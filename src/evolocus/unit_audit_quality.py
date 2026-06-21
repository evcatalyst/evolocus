"""Publish aggregate per-unit audit quality signals for Pages maps."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
import json
from pathlib import Path
from typing import Any

import polars as pl

from .locus_normalize import (
    jurisdiction_name_expr,
    jurisdiction_type_expr,
    ocr_risk_level_from_reasons,
    ocr_risk_reasons,
)
from .locus_source import LocusCorpus


UNIT_AUDIT_QUALITY_SCHEMA_VERSION = "evolocus-unit-audit-quality-v1"
DEFAULT_UNIT_AUDIT_QUALITY_PATH = Path("site/data/analysis/unit_audit_quality.json")

OCR_REASON_FIELDS = [
    "empty_content",
    "short_content",
    "replacement_character",
    "low_alpha_ratio",
    "repeated_punctuation",
    "long_whitespace_run",
    "broken_hyphenation",
]


@dataclass(frozen=True)
class UnitAuditQualityResult:
    output_path: Path
    unit_count: int
    row_count: int
    review_signal_units: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "output": str(self.output_path),
            "unit_count": self.unit_count,
            "row_count": self.row_count,
            "review_signal_units": self.review_signal_units,
        }


def publish_unit_audit_quality(
    corpus: LocusCorpus,
    map_layers_path: Path,
    output_path: Path = DEFAULT_UNIT_AUDIT_QUALITY_PATH,
) -> UnitAuditQualityResult:
    """Write per-unit aggregate audit quality signals for already-published map units."""

    map_layers = _read_json(map_layers_path)
    map_units = map_layers.get("units") or []
    map_unit_ids = [unit["unit_id"] for unit in map_units if unit.get("unit_id")]
    rows = _collect_quality_rows(corpus, set(map_unit_ids)) if map_unit_ids else []
    quality_by_unit = {row["unit_id"]: row for row in rows}
    units = [_unit_payload(unit, quality_by_unit.get(unit["unit_id"])) for unit in map_units if unit.get("unit_id")]
    summary = _summary(units)
    payload = {
        "schema_version": UNIT_AUDIT_QUALITY_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "dataset_revision": map_layers.get("dataset_revision") or corpus.config.dataset_revision,
        "scope": "published_map_units",
        "map_unit_count": len(map_units),
        "matched_unit_count": len(units),
        "row_count": summary["row_count"],
        "synthetic": bool(map_layers.get("synthetic")),
        "real_locus_rows_published": False,
        "publication_policy": {
            "artifact_kind": "aggregate_only_unit_audit_quality",
            "raw_rows_included": False,
            "ordinance_text_included": False,
            "headers_included": False,
            "record_locator_values_included": False,
            "sample_findings_included": False,
            "legal_findings": False,
        },
        "source_artifacts": {
            "map_layers": "map_layers.json",
            "audit_basis": "local Polars aggregate scan over published map units",
        },
        "quality_signal_definitions": {
            "ocr_review_rows": "Rows with medium or high OCR-risk heuristics.",
            "duplicate_text_hash_rows": "Rows whose text hash is shared by another row inside the published map-unit scope.",
            "audit_attention_score": "0-100 review-priority signal from OCR-review rate and duplicate-text-hash rate; not a ranking or legal finding.",
        },
        "summary": summary,
        "units": units,
        "limitations": [
            "Per-unit audit signals are aggregate review aids, not legal findings.",
            "OCR heuristics are approximate and require human review before interpretation.",
            "Duplicate text hashes may reflect boilerplate or repeated legal text and are not proof of OCR duplication.",
            "The scope is the published map-unit layer, not every LOCUS jurisdiction.",
        ],
    }
    _assert_public_payload_safe(payload)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2, sort_keys=True, default=str) + "\n", encoding="utf-8")
    return UnitAuditQualityResult(
        output_path=output_path,
        unit_count=len(units),
        row_count=int(summary["row_count"]),
        review_signal_units=int(summary["review_signal_units"]),
    )


def _collect_quality_rows(corpus: LocusCorpus, unit_ids: set[str]) -> list[dict[str, Any]]:
    unit_expr = (
        pl.col("state_normalized")
        + pl.lit(":")
        + pl.col("jurisdiction_type_normalized").fill_null("unknown")
        + pl.lit(":")
        + pl.col("jurisdiction_name").fill_null("Unknown")
    )
    ocr_reasons = pl.col("content").map_elements(ocr_risk_reasons, return_dtype=pl.List(pl.Utf8))
    base = (
        corpus.lazy()
        .with_columns(
            [
                jurisdiction_name_expr().alias("jurisdiction_name"),
                jurisdiction_type_expr().alias("jurisdiction_type_normalized"),
                pl.col("state").cast(pl.Utf8).str.strip_chars().str.to_uppercase().alias("state_normalized"),
            ]
        )
        .with_columns(unit_expr.alias("unit_id"))
        .filter(pl.col("unit_id").is_in(sorted(unit_ids)))
        .with_columns(
            [
                pl.col("content").fill_null("").hash(seed=17).cast(pl.Utf8).alias("text_hash"),
                ocr_reasons.alias("ocr_risk_reasons"),
                ocr_reasons.map_elements(ocr_risk_level_from_reasons, return_dtype=pl.Utf8).alias("ocr_risk_level"),
            ]
        )
    )
    duplicate_hashes = (
        base.group_by("text_hash")
        .agg(pl.len().alias("hash_row_count"))
        .filter(pl.col("hash_row_count") > 1)
        .select("text_hash")
        .with_columns(pl.lit(True).alias("duplicate_text_hash_candidate"))
    )
    with_duplicates = base.join(duplicate_hashes, on="text_hash", how="left").with_columns(
        pl.col("duplicate_text_hash_candidate").fill_null(False)
    )
    reason_exprs = [
        pl.col("ocr_risk_reasons").list.contains(reason).sum().alias(f"{reason}_rows")
        for reason in OCR_REASON_FIELDS
    ]
    rows = (
        with_duplicates.group_by("unit_id")
        .agg(
            [
                pl.len().alias("row_count"),
                (pl.col("ocr_risk_level") == "low").sum().alias("ocr_low_rows"),
                (pl.col("ocr_risk_level") == "medium").sum().alias("ocr_medium_rows"),
                (pl.col("ocr_risk_level") == "high").sum().alias("ocr_high_rows"),
                pl.col("duplicate_text_hash_candidate").sum().alias("duplicate_text_hash_rows"),
                *reason_exprs,
            ]
        )
        .collect()
        .to_dicts()
    )
    return rows


def _unit_payload(map_unit: dict[str, Any], row: dict[str, Any] | None) -> dict[str, Any]:
    row_count = int((row or {}).get("row_count") or map_unit.get("law_count") or 0)
    ocr_low = int((row or {}).get("ocr_low_rows") or 0)
    ocr_medium = int((row or {}).get("ocr_medium_rows") or 0)
    ocr_high = int((row or {}).get("ocr_high_rows") or 0)
    duplicate_rows = int((row or {}).get("duplicate_text_hash_rows") or 0)
    ocr_review_rows = ocr_medium + ocr_high
    ocr_review_rate = _rate(ocr_review_rows, row_count)
    duplicate_rate = _rate(duplicate_rows, row_count)
    attention_score = round(min(100.0, (ocr_review_rate * 0.7 + duplicate_rate * 0.3) * 100.0), 2)
    reason_counts = {
        reason: int((row or {}).get(f"{reason}_rows") or 0)
        for reason in OCR_REASON_FIELDS
    }
    return {
        "unit_id": map_unit.get("unit_id"),
        "name": map_unit.get("name"),
        "state": map_unit.get("state"),
        "kind": map_unit.get("kind"),
        "law_count": row_count,
        "ocr_low_rows": ocr_low,
        "ocr_medium_rows": ocr_medium,
        "ocr_high_rows": ocr_high,
        "ocr_review_rows": ocr_review_rows,
        "ocr_review_rate": ocr_review_rate,
        "duplicate_text_hash_rows": duplicate_rows,
        "duplicate_text_hash_rate": duplicate_rate,
        "audit_attention_score": attention_score,
        "attention_status": "review_signal" if ocr_review_rows or duplicate_rows else "no_review_signal",
        "ocr_reason_counts": reason_counts,
    }


def _summary(units: list[dict[str, Any]]) -> dict[str, Any]:
    row_count = sum(int(unit.get("law_count") or 0) for unit in units)
    ocr_review_rows = sum(int(unit.get("ocr_review_rows") or 0) for unit in units)
    duplicate_rows = sum(int(unit.get("duplicate_text_hash_rows") or 0) for unit in units)
    attention_scores = [float(unit.get("audit_attention_score") or 0) for unit in units]
    return {
        "unit_count": len(units),
        "row_count": row_count,
        "ocr_review_rows": ocr_review_rows,
        "ocr_review_rate": _rate(ocr_review_rows, row_count),
        "duplicate_text_hash_rows": duplicate_rows,
        "duplicate_text_hash_rate": _rate(duplicate_rows, row_count),
        "review_signal_units": sum(1 for unit in units if unit.get("attention_status") == "review_signal"),
        "max_audit_attention_score": round(max(attention_scores) if attention_scores else 0, 2),
    }


def _rate(part: int, total: int) -> float:
    return round(part / total, 6) if total else 0.0


def _assert_public_payload_safe(payload: dict[str, Any]) -> None:
    serialized = json.dumps(payload, sort_keys=True, default=str)
    blocked = ["source_locator", '"content"', '"header"', "data/raw/", "data/processed/", ".parquet", ".sqlite", ".db"]
    hits = [value for value in blocked if value in serialized]
    if hits:
        raise ValueError(f"unit audit quality payload contains blocked public values: {hits}")


def _read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))
