"""Materialize local browser review packages from aggregate Pages requests."""

from __future__ import annotations

from collections import Counter
from datetime import UTC, datetime
import hashlib
import json
import math
from pathlib import Path
from typing import Any

import polars as pl

from .locus_contract import CITATION, DATASET_ID, DATASET_LICENSE, PAPER_URL
from .locus_normalize import add_derived_fields
from .locus_source import LocusCorpus, current_commit


REQUEST_SCHEMA_VERSION = "evolocus-review-package-request-v1"
QUEUE_PLAN_SCHEMA_VERSION = "evolocus-pages-queue-plan-v1"
PACKAGE_SCHEMA_VERSION = "evolocus-browser-review-package-v1"

PACKAGE_COLUMNS = [
    "record_id",
    "source_locator",
    "dataset_revision",
    "source_file",
    "source_row_number",
    "state",
    "state_normalized",
    "city",
    "county",
    "source_jurisdiction_type",
    "jurisdiction_name",
    "jurisdiction_type_normalized",
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
    "topic_applicability_valid",
    "substantive_function_consistent",
    "derived_jurisdiction_valid",
]

TEXT_COLUMNS = ["header", "content"]


class ReviewPackageError(ValueError):
    """Raised when a review package request is invalid or unsafe."""


def materialize_review_package(
    corpus: LocusCorpus,
    request_path: Path,
    output_path: Path,
    *,
    include_content: bool = False,
    max_records: int | None = None,
    max_records_per_unit: int | None = None,
    seed: int | None = None,
) -> dict[str, Any]:
    """Write a bounded browser-import package from a public aggregate unit request."""

    _ensure_not_site_path(output_path)
    request = _load_request(request_path)
    units = _request_units(request)
    if not units:
        raise ReviewPackageError("Review package request does not contain any unit IDs.")

    defaults = request.get("materialization", {})
    limit_total = _positive_int(max_records, defaults.get("max_records"), default=250, maximum=5000)
    limit_per_unit = _positive_int(max_records_per_unit, defaults.get("max_records_per_unit"), default=3, maximum=250)
    sample_seed = seed if seed is not None else _seed_from_request(request)
    records = _sample_records(
        corpus,
        units,
        include_content=include_content,
        max_records=limit_total,
        max_records_per_unit=limit_per_unit,
        seed=sample_seed,
    )
    payload = _package_payload(
        corpus,
        request=request,
        records=records,
        include_content=include_content,
        max_records=limit_total,
        max_records_per_unit=limit_per_unit,
        seed=sample_seed,
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")
    return {
        "output": str(output_path),
        "records": len(records),
        "units_requested": len(units),
        "units_matched": len({record.get("unit_id") for record in records}),
        "include_content": include_content,
    }


def _sample_records(
    corpus: LocusCorpus,
    units: list[dict[str, Any]],
    *,
    include_content: bool,
    max_records: int,
    max_records_per_unit: int,
    seed: int,
) -> list[dict[str, Any]]:
    unit_rank = pl.DataFrame(
        [
            {
                "unit_id": unit["unit_id"],
                "_unit_plan_rank": int(unit.get("rank") or index + 1),
            }
            for index, unit in enumerate(units)
        ]
    )
    selected_columns = [*PACKAGE_COLUMNS, "unit_id", "_unit_plan_rank"]
    if include_content:
        selected_columns.extend(TEXT_COLUMNS)
    raw_with_unit = (
        corpus.lazy()
        .with_columns(_native_unit_id_expr().alias("unit_id"))
        .filter(pl.col("unit_id").is_in([unit["unit_id"] for unit in units]))
    )
    lf = (
        add_derived_fields(raw_with_unit, dataset_revision=corpus.config.dataset_revision)
        .join(unit_rank.lazy(), on="unit_id", how="inner")
        .select([column for column in selected_columns if column in [*PACKAGE_COLUMNS, "unit_id", "_unit_plan_rank", *TEXT_COLUMNS]])
        .with_columns(pl.col("record_id").hash(seed=seed).alias("_sample_key"))
        .sort(["_unit_plan_rank", "unit_id", "_sample_key"])
        .with_columns(pl.int_range(0, pl.len()).over("unit_id").alias("_unit_sample_rank"))
        .filter(pl.col("_unit_sample_rank") < max_records_per_unit)
        .sort(["_unit_plan_rank", "_unit_sample_rank", "_sample_key"])
        .limit(max_records)
        .drop(["_sample_key", "_unit_sample_rank"])
    )
    return [_json_safe(row) for row in lf.collect().to_dicts()]


def _native_unit_id_expr() -> pl.Expr:
    """Build the aggregate unit key with native Polars expressions before costly derivation."""

    raw_type = pl.col("source_jurisdiction_type").cast(pl.Utf8).fill_null("").str.strip_chars().str.to_lowercase()
    city = pl.col("city").cast(pl.Utf8).fill_null("").str.strip_chars()
    county = pl.col("county").cast(pl.Utf8).fill_null("").str.strip_chars()
    has_city = city.str.len_chars() > 0
    has_county = county.str.len_chars() > 0
    kind = (
        pl.when(raw_type.str.contains("county|counties"))
        .then(pl.lit("county"))
        .when(raw_type.str.contains("city|cities|municipal|town|village|borough"))
        .then(pl.lit("city"))
        .when(has_city)
        .then(pl.lit("city"))
        .when(has_county)
        .then(pl.lit("county"))
        .otherwise(pl.lit("unknown"))
    )
    name = (
        pl.when((kind == "county") & has_county)
        .then(county)
        .when((kind == "city") & has_city)
        .then(city)
        .when(has_county)
        .then(county)
        .when(has_city)
        .then(city)
        .otherwise(pl.lit("Unknown"))
    )
    return pl.col("state").cast(pl.Utf8).fill_null("").str.strip_chars().str.to_uppercase() + pl.lit(":") + kind + pl.lit(":") + name


def _package_payload(
    corpus: LocusCorpus,
    *,
    request: dict[str, Any],
    records: list[dict[str, Any]],
    include_content: bool,
    max_records: int,
    max_records_per_unit: int,
    seed: int,
) -> dict[str, Any]:
    unit_counts = Counter(str(record.get("unit_id")) for record in records)
    status = request.get("analysis_status") or {}
    return {
        "schema_version": PACKAGE_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "dataset_id": status.get("dataset_id") or DATASET_ID,
        "dataset_revision": status.get("dataset_revision") or corpus.config.dataset_revision,
        "source_request_schema": request.get("schema_version"),
        "source_request_generated_at": request.get("generated_at"),
        "license": DATASET_LICENSE,
        "paper": PAPER_URL,
        "citation": CITATION,
        "code_commit": current_commit(),
        "browser_import_compatible": True,
        "package_policy": {
            "local_only": True,
            "github_pages_publication_allowed": False,
            "raw_rows_included": include_content,
            "ordinance_text_included": include_content,
            "source_locators_included": True,
            "legal_findings": False,
        },
        "materialization": {
            "seed": seed,
            "max_records": max_records,
            "max_records_per_unit": max_records_per_unit,
            "requested_unit_count": len(_request_units(request)),
            "matched_unit_count": len(unit_counts),
            "record_count": len(records),
            "include_content": include_content,
        },
        "unit_counts": dict(sorted(unit_counts.items())),
        "records": records,
        "limitations": [
            "This package is for local browser import and must not be committed or published through GitHub Pages.",
            "LOCUS text may contain OCR errors. Model labels and scores are not legal facts.",
            "Consult official and current legal sources before relying on any law text.",
        ],
    }


def _load_request(path: Path) -> dict[str, Any]:
    try:
        request = json.loads(path.read_text(encoding="utf-8"))
    except OSError as exc:
        raise ReviewPackageError(f"Could not read review package request: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ReviewPackageError(f"Review package request is not valid JSON: {path}") from exc
    schema = request.get("schema_version")
    if schema not in {REQUEST_SCHEMA_VERSION, QUEUE_PLAN_SCHEMA_VERSION}:
        raise ReviewPackageError(f"Unsupported request schema_version: {schema}")
    policy = request.get("publication_policy") or {}
    if policy.get("ordinance_text_included") or policy.get("raw_rows_included") or policy.get("source_locators_included"):
        raise ReviewPackageError("Review package requests must be aggregate-only and must not contain text, rows, or source locators.")
    return request


def _request_units(request: dict[str, Any]) -> list[dict[str, Any]]:
    units = request.get("units")
    if not isinstance(units, list):
        return []
    normalized: list[dict[str, Any]] = []
    for index, unit in enumerate(units):
        if not isinstance(unit, dict):
            continue
        unit_id = str(unit.get("unit_id") or "").strip()
        if not unit_id:
            continue
        normalized.append({"unit_id": unit_id, "rank": int(unit.get("rank") or index + 1)})
    return normalized


def _seed_from_request(request: dict[str, Any]) -> int:
    seed_basis = json.dumps(
        {
            "schema_version": request.get("schema_version"),
            "seed_label": request.get("seed_label") or request.get("materialization", {}).get("seed_label"),
            "units": [unit["unit_id"] for unit in _request_units(request)],
        },
        sort_keys=True,
    )
    return int(hashlib.sha256(seed_basis.encode("utf-8")).hexdigest()[:8], 16)


def _positive_int(*values: Any, default: int, maximum: int) -> int:
    for value in values:
        if value in (None, ""):
            continue
        parsed = int(value)
        if parsed < 1:
            raise ReviewPackageError("Record limits must be positive integers.")
        return min(parsed, maximum)
    return default


def _ensure_not_site_path(path: Path) -> None:
    resolved = path.resolve()
    site = Path("site").resolve()
    if resolved == site or site in resolved.parents:
        raise ReviewPackageError("Review packages must not be written under site/ or published through GitHub Pages.")


def _json_safe(value: Any) -> Any:
    if isinstance(value, dict):
        return {str(key): _json_safe(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_json_safe(item) for item in value]
    if isinstance(value, float):
        return value if math.isfinite(value) else None
    return value
