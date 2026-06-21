from __future__ import annotations

from pathlib import Path
from typing import Any

import polars as pl
import pytest


def synthetic_rows() -> list[dict[str, Any]]:
    return [
        {
            "header": "Synthetic Context",
            "content": "Synthetic context text for a clearly fake local code section.",
            "is_substantive": False,
            "function": "Context",
            "topic": None,
            "source_jurisdiction_type": "cities",
            "state": "ny",
            "city": "Sample Valley",
            "county": None,
            "enforcement_discretion": 0.1,
            "opacity": 0.2,
            "paternalism": 0.3,
            "problem_salience": 0.4,
        },
        {
            "header": "Synthetic Rule",
            "content": "Synthetic zoning rule text for testing only. The permit shall be filed.",
            "is_substantive": True,
            "function": "Rules",
            "topic": "Zoning",
            "source_jurisdiction_type": "cities",
            "state": "PA",
            "city": "Example Township",
            "county": "Demo County",
            "enforcement_discretion": 0.6,
            "opacity": 0.5,
            "paternalism": 0.4,
            "problem_salience": 0.7,
        },
        {
            "header": "Synthetic Process",
            "content": "Synthetic business process text for testing only. Renewal forms are due by March 1.",
            "is_substantive": True,
            "function": "Process",
            "topic": "Business",
            "source_jurisdiction_type": "cities",
            "state": "tx",
            "city": "Demo City",
            "county": None,
            "enforcement_discretion": 0.2,
            "opacity": 0.4,
            "paternalism": 0.1,
            "problem_salience": 0.5,
        },
        {
            "header": "Synthetic Enforcement",
            "content": "Synthetic nuisance enforcement text!!!! The county may issue a written notice.",
            "is_substantive": True,
            "function": "Enforcement",
            "topic": "Nuisance",
            "source_jurisdiction_type": "counties",
            "state": "CA",
            "city": None,
            "county": "Demo County",
            "enforcement_discretion": 0.8,
            "opacity": 0.6,
            "paternalism": 0.4,
            "problem_salience": 0.8,
        },
        {
            "header": "Synthetic Building",
            "content": "Synthetic building text with OCR replacement character \ufffd and broken hy- phenation.",
            "is_substantive": True,
            "function": "Structural",
            "topic": "Buildings",
            "source_jurisdiction_type": "special district",
            "state": "n y",
            "city": None,
            "county": None,
            "enforcement_discretion": None,
            "opacity": float("nan"),
            "paternalism": None,
            "problem_salience": 0.2,
        },
        {
            "header": "Synthetic Short",
            "content": "Fee.",
            "is_substantive": False,
            "function": "Rules",
            "topic": "Other",
            "source_jurisdiction_type": "cities",
            "state": "FL",
            "city": "",
            "county": "",
            "enforcement_discretion": 0.0,
            "opacity": 0.0,
            "paternalism": 0.0,
            "problem_salience": 0.0,
        },
    ]


def write_parquet_fixture(tmp_path: Path, *, shards: int = 1, extra_column: bool = False) -> str:
    rows = synthetic_rows()
    paths = []
    for index in range(shards):
        shard_rows = rows[index::shards]
        if extra_column:
            shard_rows = [{**row, "unexpected_extra": "reported"} for row in shard_rows]
        path = tmp_path / f"part-{index}.parquet"
        pl.DataFrame(shard_rows).write_parquet(path)
        paths.append(path)
    return str(tmp_path / "*.parquet") if shards > 1 else str(paths[0])


@pytest.fixture(name="write_parquet_fixture")
def write_parquet_fixture_fixture():
    return write_parquet_fixture
