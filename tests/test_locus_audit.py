from __future__ import annotations

from evolocus.locus_audit import run_audit
from evolocus.locus_source import LocusCorpus


def test_audit_reports_schema_labels_and_ocr_findings(tmp_path, write_parquet_fixture) -> None:
    glob = write_parquet_fixture(tmp_path, shards=2)
    corpus = LocusCorpus.local(glob, dataset_revision="test-rev")
    audit = run_audit(corpus, tmp_path / "audit")
    assert audit["row_count"] == 6
    assert "Structural" in audit["unexpected_function_values"]
    assert "special district" in audit["observed_jurisdiction_type_values"]
    assert audit["nonfinite_score_rows"] >= 1
    assert audit["ocr_risk_counts"]["high"] >= 1
    assert (tmp_path / "audit" / "audit.json").exists()
    assert (tmp_path / "audit" / "audit_findings_sample.parquet").exists()
