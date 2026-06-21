"""Reproducible evaluation queue sampling."""

from __future__ import annotations

import hashlib
import json
from typing import Any

import polars as pl

from .locus_source import LocusCorpus


SNAPSHOT_COLUMNS = [
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
    "topic_applicability_valid",
    "substantive_function_consistent",
    "derived_jurisdiction_valid",
]


def sample_queue_items(
    corpus: LocusCorpus,
    *,
    strategy: str,
    size: int,
    seed: int,
) -> list[dict[str, Any]]:
    if size < 1 or size > 5000:
        raise ValueError("Queue size must be between 1 and 5000.")
    lf = corpus.derived_lazy().select(SNAPSHOT_COLUMNS)
    if strategy == "random":
        sampled = _random(lf, size, seed)
    elif strategy == "balanced_labels":
        sampled = _balanced(lf, size, seed, ["is_substantive", "function", "topic"])
    elif strategy == "geographic":
        sampled = _balanced(lf, size, seed, ["state_normalized", "source_jurisdiction_type", "jurisdiction_type_normalized"])
    elif strategy == "quality_audit":
        sampled = _quality_audit(lf, size, seed)
    elif strategy == "score_stratified":
        sampled = _score_stratified(lf, size, seed)
    else:
        raise ValueError(f"Unsupported sampling strategy: {strategy}")
    return sampled.collect().to_dicts()


def queue_id_for(
    *,
    queue_name: str,
    dataset_revision: str,
    manifest_fingerprint: str,
    strategy: str,
    size: int,
    seed: int,
) -> str:
    payload = json.dumps(
        {
            "queue_name": queue_name,
            "dataset_revision": dataset_revision,
            "manifest_fingerprint": manifest_fingerprint,
            "strategy": strategy,
            "size": size,
            "seed": seed,
        },
        sort_keys=True,
    )
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


def manifest_dict_and_fingerprint(corpus: LocusCorpus) -> tuple[dict[str, Any], str]:
    manifest = corpus.manifest(full_scan=corpus.config.mode == "demo")
    data = manifest.to_dict()
    return data, manifest.fingerprint()


def _with_key(lf: pl.LazyFrame, seed: int) -> pl.LazyFrame:
    return lf.with_columns(pl.col("record_id").hash(seed=seed).alias("_sample_key"))


def _random(lf: pl.LazyFrame, size: int, seed: int) -> pl.LazyFrame:
    return _with_key(lf, seed).sort("_sample_key").limit(size).drop("_sample_key")


def _balanced(lf: pl.LazyFrame, size: int, seed: int, fields: list[str]) -> pl.LazyFrame:
    stratum = pl.concat_str([pl.col(field).cast(pl.Utf8).fill_null("<null>") for field in fields], separator="|")
    return (
        _with_key(lf.with_columns(stratum.alias("_stratum")), seed)
        .sort(["_stratum", "_sample_key"])
        .with_columns(pl.int_range(0, pl.len()).over("_stratum").alias("_rank_in_stratum"))
        .sort(["_rank_in_stratum", "_sample_key"])
        .limit(size)
        .drop(["_stratum", "_sample_key", "_rank_in_stratum"])
    )


def _quality_audit(lf: pl.LazyFrame, size: int, seed: int) -> pl.LazyFrame:
    flagged = lf.filter(
        (~pl.col("topic_applicability_valid"))
        | (~pl.col("substantive_function_consistent"))
        | (pl.col("ocr_risk_level") != "low")
        | (~pl.col("derived_jurisdiction_valid"))
        | (pl.col("content_length_chars") < 50)
    )
    return _random(flagged, size, seed)


def _score_stratified(lf: pl.LazyFrame, size: int, seed: int) -> pl.LazyFrame:
    score_band = pl.concat_str(
        [
            pl.col("enforcement_discretion").fill_null(-1).mul(4).floor().cast(pl.Int64).cast(pl.Utf8),
            pl.col("opacity").fill_null(-1).mul(4).floor().cast(pl.Int64).cast(pl.Utf8),
            pl.col("paternalism").fill_null(-1).mul(4).floor().cast(pl.Int64).cast(pl.Utf8),
            pl.col("problem_salience").fill_null(-1).mul(4).floor().cast(pl.Int64).cast(pl.Utf8),
        ],
        separator="|",
    )
    return _balanced(lf.with_columns(score_band.alias("_score_band")), size, seed, ["_score_band"])
