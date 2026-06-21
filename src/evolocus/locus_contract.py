"""LOCUS-v1 schema and label contracts."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


DATASET_ID = "LocalLaws/LOCUS-v1"
DATASET_LICENSE = "CC-BY-NC-4.0"
DATASET_URL = "https://huggingface.co/datasets/LocalLaws/LOCUS-v1"
PAPER_URL = "https://arxiv.org/abs/2606.19334"
CITATION = (
    'Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport. '
    '"Freeing the Law with LOCUS: A Local Ordinance Corpus for the United States." '
    "arXiv:2606.19334, 2026."
)
EXPECTED_ROW_COUNT = 2_211_516

RAW_COLUMNS = [
    "header",
    "content",
    "is_substantive",
    "function",
    "topic",
    "source_jurisdiction_type",
    "state",
    "city",
    "county",
    "enforcement_discretion",
    "opacity",
    "paternalism",
    "problem_salience",
]

FUNCTION_LABELS = {"Context", "Rules", "Process", "Enforcement"}
TOPIC_LABELS = {"Buildings", "Business", "Nuisance", "Zoning", "Other"}
SCORE_FIELDS = ["enforcement_discretion", "opacity", "paternalism", "problem_salience"]
PROTOCOL_VERSION = "evolocus-eval-v1"
NORMALIZATION_VERSION = "evolocus-normalize-v1"


@dataclass(frozen=True)
class SchemaCheck:
    columns: list[str]
    missing_columns: list[str]
    extra_columns: list[str]

    @property
    def is_compatible(self) -> bool:
        return not self.missing_columns

    def to_dict(self) -> dict[str, Any]:
        return {
            "columns": self.columns,
            "missing_columns": self.missing_columns,
            "extra_columns": self.extra_columns,
            "is_compatible": self.is_compatible,
        }


def check_schema(columns: list[str]) -> SchemaCheck:
    actual = list(columns)
    return SchemaCheck(
        columns=actual,
        missing_columns=[col for col in RAW_COLUMNS if col not in actual],
        extra_columns=[col for col in actual if col not in RAW_COLUMNS],
    )
