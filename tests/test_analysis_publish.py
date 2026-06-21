from __future__ import annotations

import json

from evolocus.analysis_publish import publish_analysis_artifacts
from evolocus.locus_source import LocusCorpus


def test_publish_analysis_artifacts_for_demo(tmp_path) -> None:
    output_dir = tmp_path / "analysis"
    result = publish_analysis_artifacts(LocusCorpus.demo(), output_dir, include_record_samples=True)
    assert result.synthetic is True
    assert result.unit_count > 0
    status = json.loads((output_dir / "status.json").read_text(encoding="utf-8"))
    map_layers = json.loads((output_dir / "map_layers.json").read_text(encoding="utf-8"))
    ontology = json.loads((output_dir / "ontology.json").read_text(encoding="utf-8"))
    assert status["real_locus_rows_published"] is False
    assert status["grok_secret_name"] == "GROK_API_KEY"
    assert map_layers["units"]
    assert ontology["nodes"]
