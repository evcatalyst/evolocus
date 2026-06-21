from __future__ import annotations

import json

import pytest

from evolocus.analysis_publish import publish_analysis_artifacts
from evolocus.locus_source import LocusCorpus
from evolocus.unit_audit_quality import publish_unit_audit_quality


def test_publish_unit_audit_quality_is_aggregate_only(tmp_path, write_parquet_fixture) -> None:
    data_glob = write_parquet_fixture(tmp_path, shards=2)
    corpus = LocusCorpus.local(data_glob, dataset_revision="test-rev")
    analysis_dir = tmp_path / "analysis"
    publish_analysis_artifacts(corpus, analysis_dir, max_units=10)
    result = publish_unit_audit_quality(corpus, analysis_dir / "map_layers.json", analysis_dir / "unit_audit_quality.json")
    payload = json.loads((analysis_dir / "unit_audit_quality.json").read_text(encoding="utf-8"))
    assert result.unit_count == len(payload["units"])
    assert payload["schema_version"] == "evolocus-unit-audit-quality-v1"
    assert payload["publication_policy"]["raw_rows_included"] is False
    assert payload["summary"]["ocr_review_rows"] >= 1
    assert any(unit["ocr_high_rows"] > 0 for unit in payload["units"])
    assert all("audit_attention_score" in unit for unit in payload["units"])
    serialized = json.dumps(payload)
    assert "source_locator" not in serialized
    assert '"content"' not in serialized
    assert '"header"' not in serialized
    assert ".parquet" not in serialized


def test_unit_audit_quality_rejects_public_raw_field_names(tmp_path) -> None:
    map_layers = {
        "units": [{"unit_id": "source_locator leak", "name": "Example Township", "law_count": 1}],
        "dataset_revision": "test",
    }
    map_path = tmp_path / "map_layers.json"
    map_path.write_text(json.dumps(map_layers), encoding="utf-8")
    with pytest.raises(ValueError, match="blocked public values"):
        publish_unit_audit_quality(LocusCorpus.demo(), map_path, tmp_path / "unit_audit_quality.json")
