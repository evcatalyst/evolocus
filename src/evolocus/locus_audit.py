"""Bounded LOCUS quality audit."""

from __future__ import annotations

from pathlib import Path
import json
from typing import Any

import polars as pl

from .locus_contract import FUNCTION_LABELS, SCORE_FIELDS, TOPIC_LABELS
from .locus_normalize import nonfinite_score_filter
from .locus_source import LocusCorpus


def run_audit(corpus: LocusCorpus, output_dir: Path, *, sample_limit: int = 200) -> dict[str, Any]:
    """Run bounded audit and write JSON plus sample Parquet findings."""

    output_dir.mkdir(parents=True, exist_ok=True)
    lf = corpus.derived_lazy()
    schema = corpus.validate_schema()
    null_counts = _collect_single(
        lf.select([pl.col(col).is_null().sum().alias(col) for col in corpus.lazy().collect_schema().names()])
    )
    row_count = corpus.count()
    null_rates = {key: (value / row_count if row_count else 0.0) for key, value in null_counts.items()}
    label_values = corpus.observed_label_values()
    score_stats = _score_stats(lf)

    findings_lf = lf.filter(
        (~pl.col("function").is_in(list(FUNCTION_LABELS)))
        | (pl.col("topic").is_not_null() & ~pl.col("topic").is_in(list(TOPIC_LABELS)))
        | (~pl.col("topic_applicability_valid"))
        | nonfinite_score_filter()
        | (pl.col("ocr_risk_level") != "low")
        | (~pl.col("derived_jurisdiction_valid"))
        | (pl.col("state_normalized").str.len_chars() != 2)
    ).select(
        [
            "record_id",
            "source_locator",
            "state",
            "state_normalized",
            "city",
            "county",
            "source_jurisdiction_type",
            "function",
            "topic",
            "is_substantive",
            "content_length_chars",
            "ocr_risk_level",
            "ocr_risk_reasons",
            "derived_jurisdiction_valid",
        ]
    )
    findings = findings_lf.limit(sample_limit).collect()
    findings_path = output_dir / "audit_findings_sample.parquet"
    findings.write_parquet(findings_path)

    duplicate_source_locators = int(
        lf.group_by("source_locator").agg(pl.len().alias("n")).filter(pl.col("n") > 1).select(pl.len()).collect().item()
    )
    duplicate_content_hashes = int(
        lf.group_by("content_hash").agg(pl.len().alias("n")).filter(pl.col("n") > 1).select(pl.len()).collect().item()
    )

    audit = {
        "schema": schema,
        "row_count": row_count,
        "null_counts": null_counts,
        "null_rates": null_rates,
        "observed_label_values": label_values,
        "unexpected_function_values": sorted([v for v in label_values.get("function", []) if v not in FUNCTION_LABELS]),
        "unexpected_topic_values": sorted([v for v in label_values.get("topic", []) if v is not None and v not in TOPIC_LABELS]),
        "observed_jurisdiction_type_values": label_values.get("source_jurisdiction_type", []),
        "unexpected_state_formats": _unexpected_states(lf),
        "city_county_availability_by_jurisdiction_type": _city_county_availability(lf),
        "topic_nullability_by_substantivity": _topic_nullability(lf),
        "score_stats": score_stats,
        "nonfinite_score_rows": int(lf.filter(nonfinite_score_filter()).select(pl.len()).collect().item()),
        "duplicate_source_locator_count": duplicate_source_locators,
        "duplicate_content_hash_count": duplicate_content_hashes,
        "ocr_risk_counts": _value_counts(lf, "ocr_risk_level"),
        "invalid_jurisdiction_identity_rows": int(lf.filter(~pl.col("derived_jurisdiction_valid")).select(pl.len()).collect().item()),
        "findings_sample_path": str(findings_path),
    }
    (output_dir / "audit.json").write_text(json.dumps(audit, indent=2, sort_keys=True, default=str) + "\n", encoding="utf-8")
    return audit


def _score_stats(lf: pl.LazyFrame) -> dict[str, dict[str, Any]]:
    stats: dict[str, dict[str, Any]] = {}
    for field in SCORE_FIELDS:
        row = _collect_single(
            lf.select(
                [
                    pl.col(field).count().alias("count"),
                    pl.col(field).mean().alias("mean"),
                    pl.col(field).std().alias("std"),
                    pl.col(field).quantile(0.25).alias("q25"),
                    pl.col(field).quantile(0.5).alias("q50"),
                    pl.col(field).quantile(0.75).alias("q75"),
                    pl.col(field).min().alias("min"),
                    pl.col(field).max().alias("max"),
                ]
            )
        )
        stats[field] = row
    return stats


def _unexpected_states(lf: pl.LazyFrame) -> list[str]:
    return (
        lf.filter(pl.col("state_normalized").str.len_chars() != 2)
        .select(pl.col("state").unique().sort())
        .collect()
        .get_column("state")
        .to_list()
    )


def _city_county_availability(lf: pl.LazyFrame) -> list[dict[str, Any]]:
    return (
        lf.group_by("source_jurisdiction_type")
        .agg(
            [
                pl.len().alias("rows"),
                pl.col("city").is_not_null().sum().alias("city_present"),
                pl.col("county").is_not_null().sum().alias("county_present"),
            ]
        )
        .sort("source_jurisdiction_type")
        .collect()
        .to_dicts()
    )


def _topic_nullability(lf: pl.LazyFrame) -> list[dict[str, Any]]:
    return (
        lf.group_by("is_substantive")
        .agg(
            [
                pl.len().alias("rows"),
                pl.col("topic").is_null().sum().alias("topic_null"),
                pl.col("topic").is_not_null().sum().alias("topic_present"),
            ]
        )
        .sort("is_substantive")
        .collect()
        .to_dicts()
    )


def _value_counts(lf: pl.LazyFrame, field: str) -> dict[str, int]:
    rows = lf.group_by(field).agg(pl.len().alias("n")).collect().to_dicts()
    return {str(row[field]): int(row["n"]) for row in rows}


def _collect_single(lf: pl.LazyFrame) -> dict[str, Any]:
    rows = lf.collect().to_dicts()
    return rows[0] if rows else {}
