"""Polars-first LOCUS corpus source service."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
import glob
import hashlib
import json
import subprocess
from typing import Any, Literal

import polars as pl

from .demo_data import demo_locus_records
from .locus_contract import (
    CITATION,
    DATASET_ID,
    DATASET_LICENSE,
    EXPECTED_ROW_COUNT,
    NORMALIZATION_VERSION,
    PAPER_URL,
    RAW_COLUMNS,
    check_schema,
)
from .locus_normalize import add_derived_fields


CorpusMode = Literal["demo", "local", "download"]


class CorpusSourceError(ValueError):
    """Raised when a corpus source cannot be safely opened."""


@dataclass(frozen=True)
class CorpusConfig:
    mode: CorpusMode = "demo"
    data_glob: str | None = None
    dataset_revision: str = "synthetic-demo"
    allow_download: bool = False
    raw_dir: Path = Path("data/raw/locus-v1")


@dataclass(frozen=True)
class CorpusManifest:
    dataset_id: str
    dataset_revision: str
    source: str
    license: str
    paper: str
    citation: str
    created_at: str
    source_files: list[str]
    source_file_sizes: dict[str, int]
    schema: dict[str, str]
    observed_row_count: int | None
    expected_row_count: int
    observed_label_values: dict[str, list[Any]]
    normalization_version: str
    code_commit: str
    full_scan_completed: bool

    def to_dict(self) -> dict[str, Any]:
        return {
            "dataset_id": self.dataset_id,
            "dataset_revision": self.dataset_revision,
            "source": self.source,
            "license": self.license,
            "paper": self.paper,
            "citation": self.citation,
            "created_at": self.created_at,
            "source_files": self.source_files,
            "source_file_sizes": self.source_file_sizes,
            "schema": self.schema,
            "observed_row_count": self.observed_row_count,
            "expected_row_count": self.expected_row_count,
            "observed_label_values": self.observed_label_values,
            "normalization_version": self.normalization_version,
            "code_commit": self.code_commit,
            "full_scan_completed": self.full_scan_completed,
        }

    def fingerprint(self) -> str:
        payload = json.dumps(self.to_dict(), sort_keys=True, default=str).encode("utf-8")
        return hashlib.sha256(payload).hexdigest()


class LocusCorpus:
    """Lazy LOCUS corpus facade for Streamlit, CLI, and tests."""

    def __init__(self, config: CorpusConfig):
        self.config = config
        self.source_files = self._resolve_source_files()
        self._lazy = self._build_lazy()
        self.schema_check = check_schema([col for col in self._raw_columns() if col in RAW_COLUMNS or col not in {"source_file", "source_row_number"}])

    @classmethod
    def demo(cls) -> "LocusCorpus":
        return cls(CorpusConfig(mode="demo", dataset_revision="synthetic-demo"))

    @classmethod
    def local(cls, data_glob: str, *, dataset_revision: str = "local") -> "LocusCorpus":
        return cls(CorpusConfig(mode="local", data_glob=data_glob, dataset_revision=dataset_revision))

    def lazy(self) -> pl.LazyFrame:
        return self._lazy

    def derived_lazy(self) -> pl.LazyFrame:
        return add_derived_fields(self._lazy, dataset_revision=self.config.dataset_revision)

    def validate_schema(self) -> dict[str, Any]:
        raw_names = [name for name in self._raw_columns() if name not in {"source_file", "source_row_number"}]
        return check_schema(raw_names).to_dict()

    def count(self, *, filters: dict[str, Any] | None = None) -> int:
        lf = self.apply_filters(self.derived_lazy(), filters or {})
        return int(lf.select(pl.len().alias("n")).collect().item())

    def page(
        self,
        *,
        filters: dict[str, Any] | None = None,
        offset: int = 0,
        limit: int = 25,
        columns: list[str] | None = None,
    ) -> list[dict[str, Any]]:
        if limit > 500:
            raise CorpusSourceError("Page limit must be <= 500.")
        selected = columns or [
            "record_id",
            "dataset_revision",
            "source_locator",
            "state",
            "state_normalized",
            "city",
            "county",
            "source_jurisdiction_type",
            "jurisdiction_name",
            "jurisdiction_type_normalized",
            "header",
            "content",
            "is_substantive",
            "function",
            "topic",
            "enforcement_discretion",
            "opacity",
            "paternalism",
            "problem_salience",
            "content_length_chars",
            "content_length_words",
            "ocr_risk_level",
            "ocr_risk_reasons",
        ]
        lf = self.apply_filters(self.derived_lazy(), filters or {})
        return (
            lf.select([col for col in selected if col in lf.collect_schema().names()])
            .slice(offset, limit)
            .collect()
            .to_dicts()
        )

    def record_by_id(self, record_id: str) -> dict[str, Any] | None:
        rows = (
            self.derived_lazy()
            .filter(pl.col("record_id") == record_id)
            .limit(1)
            .collect()
            .to_dicts()
        )
        return rows[0] if rows else None

    def manifest(self, *, full_scan: bool = False) -> CorpusManifest:
        schema = {name: str(dtype) for name, dtype in self._lazy.collect_schema().items()}
        observed_row_count = self.count() if full_scan or self.config.mode == "demo" else None
        label_values = self.observed_label_values()
        return CorpusManifest(
            dataset_id=DATASET_ID,
            dataset_revision=self.config.dataset_revision,
            source=self.config.mode,
            license=DATASET_LICENSE,
            paper=PAPER_URL,
            citation=CITATION,
            created_at=datetime.now(UTC).isoformat(),
            source_files=self.source_files,
            source_file_sizes={path: Path(path).stat().st_size for path in self.source_files if Path(path).exists()},
            schema=schema,
            observed_row_count=observed_row_count,
            expected_row_count=EXPECTED_ROW_COUNT,
            observed_label_values=label_values,
            normalization_version=NORMALIZATION_VERSION,
            code_commit=current_commit(),
            full_scan_completed=observed_row_count == EXPECTED_ROW_COUNT,
        )

    def observed_label_values(self) -> dict[str, list[Any]]:
        fields = ["function", "topic", "source_jurisdiction_type", "state"]
        values: dict[str, list[Any]] = {}
        for field in fields:
            values[field] = (
                self._lazy.select(pl.col(field).unique().sort())
                .collect()
                .get_column(field)
                .to_list()
            )
        return values

    def write_manifest(self, output_path: Path, *, full_scan: bool = False) -> CorpusManifest:
        manifest = self.manifest(full_scan=full_scan)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(manifest.to_dict(), indent=2, sort_keys=True, default=str) + "\n", encoding="utf-8")
        return manifest

    def apply_filters(self, lf: pl.LazyFrame, filters: dict[str, Any]) -> pl.LazyFrame:
        result = lf
        for key, value in filters.items():
            if value in (None, "", []):
                continue
            if key in {"state", "state_normalized"}:
                values = [str(item).upper() for item in _as_list(value)]
                result = result.filter(pl.col("state_normalized").is_in(values))
            elif key in {"function", "topic", "source_jurisdiction_type", "jurisdiction_type_normalized", "ocr_risk_level"}:
                result = result.filter(pl.col(key).is_in(_as_list(value)))
            elif key == "is_substantive":
                result = result.filter(pl.col("is_substantive") == bool(value))
            elif key == "header_text":
                result = result.filter(pl.col("header").str.contains(str(value), literal=True))
            elif key == "content_text":
                result = result.filter(pl.col("content").str.contains(str(value), literal=True))
            elif key == "min_content_length":
                result = result.filter(pl.col("content_length_chars") >= int(value))
            elif key == "max_content_length":
                result = result.filter(pl.col("content_length_chars") <= int(value))
            elif key.endswith("_range"):
                field = key.removesuffix("_range")
                low, high = value
                result = result.filter(pl.col(field).is_between(float(low), float(high), closed="both"))
        return result

    def _raw_columns(self) -> list[str]:
        return self._lazy.collect_schema().names()

    def _resolve_source_files(self) -> list[str]:
        if self.config.mode == "demo":
            return ["synthetic-demo"]
        if self.config.mode == "local":
            if not self.config.data_glob:
                raise CorpusSourceError("Local mode requires EVOLOCUS_DATA_GLOB or --input.")
            paths = sorted(glob.glob(self.config.data_glob))
            if not paths:
                raise CorpusSourceError(f"No Parquet files matched: {self.config.data_glob}")
            non_parquet = [path for path in paths if Path(path).suffix.lower() != ".parquet"]
            if non_parquet:
                raise CorpusSourceError(f"Local mode accepts only Parquet files: {non_parquet}")
            return paths
        if self.config.mode == "download":
            if not self.config.allow_download:
                raise CorpusSourceError("Download mode is blocked unless allow_download is explicit.")
            return download_locus_parquet_files(self.config.raw_dir, self.config.dataset_revision)
        raise CorpusSourceError(f"Unsupported corpus mode: {self.config.mode}")

    def _build_lazy(self) -> pl.LazyFrame:
        if self.config.mode == "demo":
            df = pl.DataFrame(demo_locus_records()).with_columns(
                [
                    pl.lit("synthetic-demo").alias("source_file"),
                    pl.int_range(0, pl.len()).alias("source_row_number"),
                ]
            )
            return df.select(RAW_COLUMNS + ["source_file", "source_row_number"]).lazy()

        frames = []
        for path in self.source_files:
            frames.append(
                pl.scan_parquet(
                    path,
                    include_file_paths="source_file",
                    row_index_name="source_row_number",
                    extra_columns="ignore",
                    missing_columns="raise",
                )
            )
        lf = pl.concat(frames, how="vertical_relaxed")
        schema_check = check_schema([name for name in lf.collect_schema().names() if name not in {"source_file", "source_row_number"}])
        if not schema_check.is_compatible:
            raise CorpusSourceError(f"Missing required LOCUS columns: {schema_check.missing_columns}")
        return lf


def download_locus_parquet_files(raw_dir: Path, dataset_revision: str) -> list[str]:
    from huggingface_hub import snapshot_download

    target = raw_dir / dataset_revision
    target.mkdir(parents=True, exist_ok=True)
    snapshot_download(
        repo_id=DATASET_ID,
        repo_type="dataset",
        revision=None if dataset_revision == "main" else dataset_revision,
        local_dir=str(target),
        allow_patterns=["*.parquet", "**/*.parquet"],
    )
    return sorted(str(path) for path in target.glob("**/*.parquet"))


def current_commit() -> str:
    try:
        return subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
    except Exception:
        return "unknown"


def manifest_fingerprint(path: Path) -> str:
    payload = path.read_bytes()
    return hashlib.sha256(payload).hexdigest()


def _as_list(value: Any) -> list[Any]:
    if isinstance(value, list):
        return value
    if isinstance(value, tuple):
        return list(value)
    return [value]
