from __future__ import annotations

from evolocus.locus_source import LocusCorpus


def test_lazy_local_multi_file_scan_and_source_order(tmp_path, write_parquet_fixture) -> None:
    glob = write_parquet_fixture(tmp_path, shards=2)
    corpus = LocusCorpus.local(glob, dataset_revision="test-rev")
    assert corpus.source_files == sorted(corpus.source_files)
    rows = corpus.page(limit=3)
    assert len(rows) == 3
    assert rows[0]["source_locator"].startswith("test-rev/")
    assert "#0" in rows[0]["source_locator"]
    assert rows[0]["record_id"]


def test_demo_mode_is_marked_synthetic() -> None:
    corpus = LocusCorpus.demo()
    rows = corpus.page(limit=2)
    assert len(rows) == 2
    assert rows[0]["dataset_revision"] == "synthetic-demo"
    assert "SYNTHETIC DEMONSTRATION DATA" in rows[0]["content"]
