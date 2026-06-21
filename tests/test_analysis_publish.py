from __future__ import annotations

import json

from evolocus.analysis_publish import publish_analysis_artifacts
from evolocus.inquiry_briefings import publish_inquiry_briefings
from evolocus.locus_source import LocusCorpus


def test_publish_analysis_artifacts_for_demo(tmp_path) -> None:
    output_dir = tmp_path / "analysis"
    result = publish_analysis_artifacts(LocusCorpus.demo(), output_dir, include_record_samples=True)
    assert result.synthetic is True
    assert result.unit_count > 0
    status = json.loads((output_dir / "status.json").read_text(encoding="utf-8"))
    map_layers = json.loads((output_dir / "map_layers.json").read_text(encoding="utf-8"))
    ontology = json.loads((output_dir / "ontology.json").read_text(encoding="utf-8"))
    charts = json.loads((output_dir / "charts.json").read_text(encoding="utf-8"))
    assert status["real_locus_rows_published"] is False
    assert status["grok_secret_name"] == "GROK_API_KEY"
    assert status["publication_gates"]
    assert map_layers["units"]
    assert ontology["nodes"]
    assert charts["charts"]["tier_counts"]


def test_publish_inquiry_briefings_are_aggregate_only(tmp_path) -> None:
    output_dir = tmp_path / "analysis"
    publish_analysis_artifacts(LocusCorpus.demo(), output_dir, include_record_samples=True)
    result = publish_inquiry_briefings(output_dir, output_dir / "inquiry_briefings.json")
    payload = json.loads((output_dir / "inquiry_briefings.json").read_text(encoding="utf-8"))
    assert result.briefing_count == 5
    assert result.grok_used is False
    assert payload["schema_version"] == "evolocus-progressive-inquiry-v1"
    assert payload["publication_policy"]["raw_rows_included"] is False
    assert payload["publication_policy"]["ordinance_text_included"] is False
    assert payload["publication_policy"]["browser_llm_calls"] is False
    assert payload["briefings"]
    assert payload["suggested_questions"]
    serialized = json.dumps(payload)
    assert '"content"' not in serialized
    assert '"header"' not in serialized
    assert "source_locator" not in serialized
