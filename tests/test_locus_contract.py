from __future__ import annotations

import polars as pl

from evolocus.locus_contract import RAW_COLUMNS, check_schema
from evolocus.locus_source import CorpusSourceError, LocusCorpus


def test_exact_raw_schema_validation() -> None:
    check = check_schema(RAW_COLUMNS)
    assert check.is_compatible
    assert check.missing_columns == []
    assert check.extra_columns == []


def test_extra_column_is_reported(tmp_path, write_parquet_fixture) -> None:
    glob = write_parquet_fixture(tmp_path, extra_column=True)
    corpus = LocusCorpus.local(glob, dataset_revision="test-rev")
    check = corpus.validate_schema()
    assert check["missing_columns"] == []
    assert "unexpected_extra" in check["extra_columns"]


def test_missing_column_raises_clear_error(tmp_path) -> None:
    path = tmp_path / "missing.parquet"
    pl.DataFrame([{"header": "Synthetic only"}]).write_parquet(path)
    try:
        LocusCorpus.local(str(path), dataset_revision="test-rev")
    except CorpusSourceError as exc:
        assert "Missing required LOCUS columns" in str(exc)
    else:
        raise AssertionError("Missing LOCUS columns should fail.")
