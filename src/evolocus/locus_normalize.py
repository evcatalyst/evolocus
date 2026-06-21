"""Derived LOCUS fields and OCR heuristics."""

from __future__ import annotations

import re
from typing import Any

import polars as pl

from .jurisdiction import derive_jurisdiction_name, normalize_jurisdiction_type
from .locus_contract import FUNCTION_LABELS, SCORE_FIELDS, TOPIC_LABELS


def jurisdiction_name_expr() -> pl.Expr:
    return pl.struct(["source_jurisdiction_type", "city", "county"]).map_elements(
        lambda row: derive_jurisdiction_name(
            row["source_jurisdiction_type"], row["city"], row["county"]
        )[0],
        return_dtype=pl.Utf8,
    )


def jurisdiction_type_expr() -> pl.Expr:
    return pl.struct(["source_jurisdiction_type", "city", "county"]).map_elements(
        lambda row: normalize_jurisdiction_type(
            row["source_jurisdiction_type"], row["city"], row["county"]
        ),
        return_dtype=pl.Utf8,
    )


def ocr_risk_reasons(content: Any) -> list[str]:
    text = "" if content is None else str(content)
    reasons: list[str] = []
    if not text.strip():
        reasons.append("empty_content")
    if len(text) < 50:
        reasons.append("short_content")
    if "\ufffd" in text or "�" in text:
        reasons.append("replacement_character")
    non_space = [char for char in text if not char.isspace()]
    if non_space:
        alpha_ratio = sum(char.isalpha() for char in non_space) / len(non_space)
        if alpha_ratio < 0.45:
            reasons.append("low_alpha_ratio")
    if re.search(r"([!?.;:,\-_=*#])\1{3,}", text):
        reasons.append("repeated_punctuation")
    if re.search(r"\s{8,}", text):
        reasons.append("long_whitespace_run")
    if re.search(r"[A-Za-z]-\s+[a-z]", text):
        reasons.append("broken_hyphenation")
    return reasons


def ocr_risk_level_from_reasons(reasons: list[str]) -> str:
    if hasattr(reasons, "to_list"):
        reasons = reasons.to_list()
    if reasons is None:
        reasons = []
    if not reasons:
        return "low"
    if "empty_content" in reasons or "replacement_character" in reasons or len(reasons) >= 3:
        return "high"
    return "medium"


def add_derived_fields(lf: pl.LazyFrame, *, dataset_revision: str) -> pl.LazyFrame:
    content = pl.col("content").fill_null("")
    header = pl.col("header").fill_null("")
    source_locator = (
        pl.lit(dataset_revision)
        + pl.lit("/")
        + pl.col("source_file").cast(pl.Utf8)
        + pl.lit("#")
        + pl.col("source_row_number").cast(pl.Utf8)
    )
    ocr_reasons = pl.col("content").map_elements(ocr_risk_reasons, return_dtype=pl.List(pl.Utf8))
    return lf.with_columns(
        [
            pl.lit(dataset_revision).alias("dataset_revision"),
            source_locator.alias("source_locator"),
            jurisdiction_name_expr().alias("jurisdiction_name"),
            jurisdiction_type_expr().alias("jurisdiction_type_normalized"),
            pl.col("state").cast(pl.Utf8).str.strip_chars().str.to_uppercase().alias("state_normalized"),
            pl.col("city").cast(pl.Utf8).str.strip_chars().alias("city_normalized"),
            pl.col("county").cast(pl.Utf8).str.strip_chars().alias("county_normalized"),
            header.str.strip_chars().str.replace_all(r"\s+", " ").alias("header_normalized"),
            content.str.len_chars().alias("content_length_chars"),
            content.str.split(by=" ").list.len().alias("content_length_words"),
            content.hash(seed=17).cast(pl.Utf8).alias("content_hash"),
            (
                pl.when(pl.col("is_substantive") & pl.col("topic").is_in(list(TOPIC_LABELS)))
                .then(True)
                .when((~pl.col("is_substantive")) & pl.col("topic").is_null())
                .then(True)
                .otherwise(False)
            ).alias("topic_applicability_valid"),
            (
                pl.when(pl.col("function").is_in(list(FUNCTION_LABELS))).then(True).otherwise(False)
            ).alias("substantive_function_consistent"),
            ocr_reasons.alias("ocr_risk_reasons"),
            ocr_reasons.map_elements(ocr_risk_level_from_reasons, return_dtype=pl.Utf8).alias("ocr_risk_level"),
        ]
    ).with_columns(
        [
            (
                pl.col("dataset_revision")
                + pl.lit(":")
                + pl.col("source_locator").hash(seed=23).cast(pl.Utf8)
            ).alias("record_id"),
            pl.struct(["jurisdiction_name", "jurisdiction_type_normalized"]).map_elements(
                lambda row: row["jurisdiction_name"] is not None and row["jurisdiction_type_normalized"] != "unknown",
                return_dtype=pl.Boolean,
            ).alias("derived_jurisdiction_valid"),
        ]
    )


def score_is_finite_expr(field: str) -> pl.Expr:
    return pl.col(field).is_null() | pl.col(field).is_finite()


def nonfinite_score_filter() -> pl.Expr:
    expr = pl.lit(False)
    for field in SCORE_FIELDS:
        expr = expr | ~score_is_finite_expr(field)
    return expr
