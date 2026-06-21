"""Guarded LOCUS-v1 ingest helpers and master jurisdiction table builder.

This module does not download LOCUS-v1 at import time. Network access is only
allowed by an explicit runtime flag so Phase 1 can remain reviewable and safe.
"""

from __future__ import annotations

from collections import defaultdict
from collections.abc import Iterable, Iterator, Mapping
from dataclasses import asdict, dataclass
from pathlib import Path
import csv
import hashlib
import json
import re
from typing import Any

from .jurisdiction import derive_jurisdiction_name


LOCUS_DATASET_ID = "LocalLaws/LOCUS-v1"
LOCUS_DATASET_URL = "https://huggingface.co/datasets/LocalLaws/LOCUS-v1"
LOCUS_PAPER_URL = "https://arxiv.org/abs/2606.19334"
LOCUS_CITATION = (
    'Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport. '
    '"Freeing the Law with LOCUS: A Local Ordinance Corpus for the United States." '
    "arXiv:2606.19334, 2026."
)

VALID_JURISDICTION_TYPES = {"city", "county", "unknown"}
VALID_VENDORS = {"ecode360", "municode", "amlegal", "self", "other", "unknown"}
SCORE_FIELDS = (
    "opacity",
    "paternalism",
    "enforcement_discretion",
    "problem_salience",
)
TOPIC_TAGS = {
    "housing",
    "zoning",
    "environment",
    "climate",
    "land_use",
    "public_safety",
    "transportation",
    "business",
}


class LocusIngestError(ValueError):
    """Raised when LOCUS ingest input is unsafe or malformed."""


class LocusDownloadBlocked(RuntimeError):
    """Raised when a caller attempts network ingest without explicit approval."""


@dataclass(frozen=True)
class LocusFieldMap:
    """Column aliases for LOCUS-like records.

    LOCUS-v1 is the canonical source, but early development also needs to run
    against tiny synthetic fixtures and local extracts. Aliases keep the table
    builder strict about required meaning while tolerating harmless column-name
    differences.
    """

    jurisdiction: tuple[str, ...] = (
        "jurisdiction",
        "jurisdiction_name",
        "municipality",
        "place",
        "name",
    )
    state: tuple[str, ...] = ("state", "state_abbrev", "state_code")
    jurisdiction_type: tuple[str, ...] = ("jurisdiction_type", "type", "place_type")
    city: tuple[str, ...] = ("city", "municipality")
    county: tuple[str, ...] = ("county", "county_name")
    vendor: tuple[str, ...] = ("vendor", "provider", "source_provider")
    source_url: tuple[str, ...] = ("source_url", "url", "document_url", "source")
    topic: tuple[str, ...] = ("topic", "topic_label", "predicted_topic")
    function: tuple[str, ...] = ("function", "function_label")
    is_substantive: tuple[str, ...] = ("is_substantive", "substantive")
    header: tuple[str, ...] = ("header", "section_header", "title")
    content: tuple[str, ...] = ("content", "text", "chunk_text")
    last_scrape: tuple[str, ...] = ("last_scrape", "retrieved_at", "scraped_at")


@dataclass(frozen=True)
class MasterJurisdiction:
    """Master jurisdiction table row used by dashboards and queue planning."""

    fips: str | None
    name: str
    state: str
    type: str
    vendor: str
    last_scrape: str | None
    next_priority_score: int
    status: str
    tags: tuple[str, ...]
    source: str = "locus-v1"
    review_state: str = "needs_geocoding"
    locus_chunk_count: int = 0
    substantive_chunk_count: int = 0
    avg_opacity: float | None = None
    avg_paternalism: float | None = None
    avg_enforcement_discretion: float | None = None
    avg_problem_salience: float | None = None

    def to_dict(self) -> dict[str, Any]:
        row = asdict(self)
        row["tags"] = list(self.tags)
        return row


def load_locus_from_huggingface(*, allow_download: bool = False, split: str = "train") -> Any:
    """Load LOCUS-v1 from Hugging Face only when explicitly allowed.

    The function is intentionally small and lazy-imported so tests and local
    scaffold work never contact the network by accident.
    """

    if not allow_download:
        raise LocusDownloadBlocked(
            "LOCUS-v1 download blocked. Re-run with an explicit allow-download flag "
            "and keep outputs in ignored local data directories."
        )

    from datasets import load_dataset  # type: ignore[import-not-found]

    return load_dataset(LOCUS_DATASET_ID, split=split)


def iter_records_from_file(path: Path, *, limit: int | None = None) -> Iterator[dict[str, Any]]:
    """Yield records from JSON, JSONL, CSV, or Parquet files.

    Parquet support is optional and requires Polars. This function does not
    create databases, embeddings, or committed outputs.
    """

    suffix = path.suffix.lower()
    if suffix == ".jsonl":
        yield from _limit(_iter_jsonl(path), limit)
        return
    if suffix == ".json":
        data = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(data, list):
            yield from _limit((dict(row) for row in data), limit)
            return
        raise LocusIngestError("JSON input must be a list of record objects.")
    if suffix == ".csv":
        yield from _limit(_iter_csv(path), limit)
        return
    if suffix == ".parquet":
        yield from _limit(_iter_parquet(path), limit)
        return
    raise LocusIngestError(f"Unsupported input format: {path.suffix}")


def build_master_jurisdictions(
    records: Iterable[Mapping[str, Any]],
    *,
    field_map: LocusFieldMap | None = None,
) -> list[MasterJurisdiction]:
    """Build deterministic master jurisdiction rows from LOCUS-like records."""

    fmap = field_map or LocusFieldMap()
    grouped: dict[tuple[str, str, str], list[Mapping[str, Any]]] = defaultdict(list)

    for record in records:
        name = _clean_text(_first(record, fmap.jurisdiction))
        if not name:
            name = _clean_text(derive_jurisdiction_name(
                _first(record, fmap.jurisdiction_type),
                _first(record, fmap.city),
                _first(record, fmap.county),
            )[0])
        state = _normalize_state(_first(record, fmap.state))
        if not name or not state:
            raise LocusIngestError("Each LOCUS record must include state and derivable jurisdiction metadata.")
        jurisdiction_type = infer_jurisdiction_type(record, fmap)
        grouped[(state, name, jurisdiction_type)].append(record)

    rows = [_build_row(state, name, jurisdiction_type, rows, fmap) for (state, name, jurisdiction_type), rows in grouped.items()]
    return sorted(rows, key=lambda row: (row.state, row.type, row.name))


def write_master_jurisdictions(rows: Iterable[MasterJurisdiction], path: Path) -> None:
    """Write master jurisdiction rows to JSON or CSV in an explicit output path."""

    path.parent.mkdir(parents=True, exist_ok=True)
    row_dicts = [row.to_dict() for row in rows]
    if path.suffix.lower() == ".json":
        path.write_text(json.dumps(row_dicts, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        return
    if path.suffix.lower() == ".csv":
        if not row_dicts:
            path.write_text("", encoding="utf-8")
            return
        with path.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(row_dicts[0]))
            writer.writeheader()
            for row in row_dicts:
                writer.writerow({**row, "tags": "|".join(row["tags"])})
        return
    raise LocusIngestError("Master jurisdiction output must be .json or .csv.")


def infer_jurisdiction_type(record: Mapping[str, Any], field_map: LocusFieldMap | None = None) -> str:
    fmap = field_map or LocusFieldMap()
    explicit = _slug(_first(record, fmap.jurisdiction_type))
    if explicit in {"city", "cities", "town", "towns", "village", "villages", "municipality", "municipalities", "borough"}:
        return "city"
    if explicit in {"county", "counties"}:
        return "county"

    name = _clean_text(_first(record, fmap.jurisdiction))
    if _first(record, fmap.city):
        return "city"
    if _first(record, fmap.county):
        return "county"
    if re.search(r"\bcounty\b", name, flags=re.IGNORECASE):
        return "county"
    return "unknown"


def infer_vendor(record: Mapping[str, Any], field_map: LocusFieldMap | None = None) -> str:
    fmap = field_map or LocusFieldMap()
    raw = " ".join(
        str(value)
        for value in (
            _first(record, fmap.vendor),
            _first(record, fmap.source_url),
        )
        if value is not None
    ).lower()
    if "ecode360" in raw or "generalcode" in raw:
        return "ecode360"
    if "municode" in raw or "municodenext" in raw:
        return "municode"
    if "amlegal" in raw or "american legal" in raw:
        return "amlegal"
    if any(term in raw for term in ("self", "city website", "county website", ".gov")):
        return "self"
    if raw.strip():
        return "other"
    return "unknown"


def stable_jurisdiction_id(state: str, name: str, jurisdiction_type: str) -> str:
    digest = hashlib.sha1(f"{state}|{jurisdiction_type}|{name}".encode("utf-8")).hexdigest()[:10]
    return f"{state.lower()}-{_slug(name)}-{jurisdiction_type}-{digest}"


def _build_row(
    state: str,
    name: str,
    jurisdiction_type: str,
    records: list[Mapping[str, Any]],
    field_map: LocusFieldMap,
) -> MasterJurisdiction:
    vendors = [infer_vendor(record, field_map) for record in records]
    vendor = _mode(vendors, default="unknown")
    tags = tuple(sorted(_extract_tags(records, field_map)))
    substantive_count = sum(1 for record in records if _truthy(_first(record, field_map.is_substantive)))
    averages = {score: _average_score(records, score) for score in SCORE_FIELDS}
    last_scrape = _max_text(_first(record, field_map.last_scrape) for record in records)
    priority = _priority_score(
        chunk_count=len(records),
        substantive_count=substantive_count,
        vendor=vendor,
        tags=tags,
        averages=averages,
    )
    return MasterJurisdiction(
        fips=None,
        name=name,
        state=state,
        type=jurisdiction_type,
        vendor=vendor,
        last_scrape=last_scrape,
        next_priority_score=priority,
        status="needs_geocoding",
        tags=tags,
        locus_chunk_count=len(records),
        substantive_chunk_count=substantive_count,
        avg_opacity=averages["opacity"],
        avg_paternalism=averages["paternalism"],
        avg_enforcement_discretion=averages["enforcement_discretion"],
        avg_problem_salience=averages["problem_salience"],
    )


def _priority_score(
    *,
    chunk_count: int,
    substantive_count: int,
    vendor: str,
    tags: tuple[str, ...],
    averages: Mapping[str, float | None],
) -> int:
    score = 25
    score += min(20, chunk_count // 10)
    score += min(15, substantive_count // 8)
    if vendor in {"unknown", "other"}:
        score += 12
    if {"housing", "zoning", "environment", "climate"} & set(tags):
        score += 14
    if averages.get("problem_salience") is not None:
        score += round((averages["problem_salience"] or 0) * 14)
    return max(0, min(100, score))


def _extract_tags(records: Iterable[Mapping[str, Any]], field_map: LocusFieldMap) -> set[str]:
    tags: set[str] = set()
    for record in records:
        for aliases in (field_map.topic, field_map.function):
            value = _first(record, aliases)
            if value is None:
                continue
            slug = _slug(str(value).replace("/", " "))
            if slug in TOPIC_TAGS:
                tags.add(slug)
            if "housing" in slug:
                tags.add("housing")
            if "zoning" in slug or "land_use" in slug:
                tags.add("zoning")
            if "environment" in slug or "climate" in slug:
                tags.add("environment")
    return tags


def _average_score(records: Iterable[Mapping[str, Any]], score: str) -> float | None:
    values: list[float] = []
    aliases = (score, f"{score}_score")
    for record in records:
        value = _first(record, aliases)
        parsed = _float_or_none(value)
        if parsed is not None:
            values.append(parsed)
    if not values:
        return None
    return round(sum(values) / len(values), 4)


def _iter_jsonl(path: Path) -> Iterator[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            if line.strip():
                yield json.loads(line)


def _iter_csv(path: Path) -> Iterator[dict[str, Any]]:
    with path.open("r", encoding="utf-8", newline="") as handle:
        yield from csv.DictReader(handle)


def _iter_parquet(path: Path) -> Iterator[dict[str, Any]]:
    try:
        import polars as pl  # type: ignore[import-not-found]
    except ImportError as exc:
        raise LocusIngestError("Parquet input requires polars. Install requirements.txt first.") from exc
    offset = 0
    batch_size = 1000
    while True:
        frame = pl.scan_parquet(path).slice(offset, batch_size).collect()
        if frame.is_empty():
            break
        for row in frame.iter_rows(named=True):
            yield dict(row)
        offset += batch_size


def _limit(records: Iterable[dict[str, Any]], limit: int | None) -> Iterator[dict[str, Any]]:
    if limit is None:
        yield from records
        return
    for index, record in enumerate(records):
        if index >= limit:
            break
        yield record


def _first(record: Mapping[str, Any], aliases: Iterable[str]) -> Any:
    for key in aliases:
        value = record.get(key)
        if value not in (None, ""):
            return value
    return None


def _clean_text(value: Any) -> str:
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value)).strip()


def _normalize_state(value: Any) -> str:
    return _clean_text(value).upper()


def _slug(value: Any) -> str:
    text = _clean_text(value).lower()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_") or "unknown"


def _truthy(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return False
    return str(value).strip().lower() in {"1", "true", "yes", "y"}


def _float_or_none(value: Any) -> float | None:
    if value in (None, ""):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _mode(values: Iterable[str], *, default: str) -> str:
    counts: dict[str, int] = defaultdict(int)
    for value in values:
        counts[value] += 1
    if not counts:
        return default
    return sorted(counts.items(), key=lambda item: (-item[1], item[0]))[0][0]


def _max_text(values: Iterable[Any]) -> str | None:
    cleaned = sorted(_clean_text(value) for value in values if _clean_text(value))
    return cleaned[-1] if cleaned else None
