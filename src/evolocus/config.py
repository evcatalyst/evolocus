"""Safe local configuration for the evaluator."""

from __future__ import annotations

from dataclasses import dataclass
import os
from pathlib import Path


@dataclass(frozen=True)
class AppConfig:
    mode: str
    data_glob: str | None
    eval_db: Path
    reviewer: str
    queue: str
    blind_review: bool
    dataset_revision: str


def load_config() -> AppConfig:
    return AppConfig(
        mode=os.getenv("EVOLOCUS_MODE", "demo"),
        data_glob=os.getenv("EVOLOCUS_DATA_GLOB"),
        eval_db=Path(os.getenv("EVOLOCUS_EVAL_DB", "data/evaluation/evolocus_eval.sqlite3")),
        reviewer=os.getenv("EVOLOCUS_REVIEWER", "local-reviewer"),
        queue=os.getenv("EVOLOCUS_QUEUE", "demo-baseline"),
        blind_review=os.getenv("EVOLOCUS_BLIND_REVIEW", "1") != "0",
        dataset_revision=os.getenv("EVOLOCUS_DATASET_REVISION", "synthetic-demo"),
    )
