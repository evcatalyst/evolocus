from __future__ import annotations

import json

from evolocus.ai_analysis_pack import publish_ai_analysis_pack
from evolocus.analysis_publish import publish_analysis_artifacts
from evolocus.inquiry_briefings import publish_inquiry_briefings
from evolocus.locus_source import LocusCorpus
from evolocus.public_artifact_guard import PublicArtifactValidationError, validate_public_analysis_artifacts
from evolocus.static_question_pack import publish_question_pack


def test_publish_analysis_artifacts_for_demo(tmp_path) -> None:
    output_dir = tmp_path / "analysis"
    result = publish_analysis_artifacts(LocusCorpus.demo(), output_dir, include_record_samples=True)
    assert result.synthetic is True
    assert result.unit_count > 0
    status = json.loads((output_dir / "status.json").read_text(encoding="utf-8"))
    map_layers = json.loads((output_dir / "map_layers.json").read_text(encoding="utf-8"))
    ontology = json.loads((output_dir / "ontology.json").read_text(encoding="utf-8"))
    charts = json.loads((output_dir / "charts.json").read_text(encoding="utf-8"))
    visual_smoke = json.loads((output_dir / "visual_smoke.json").read_text(encoding="utf-8"))
    assert status["real_locus_rows_published"] is False
    assert status["grok_secret_name"] == "GROK_API_KEY"
    assert "Grok_api_key" in status["grok_secret_aliases"]
    assert status["publication_gates"]
    assert map_layers["units"]
    assert ontology["nodes"]
    assert charts["charts"]["tier_counts"]
    assert visual_smoke["schema_version"] == "evolocus-visual-route-smoke-v1"
    assert visual_smoke["status"] == "not_run"
    assert visual_smoke["real_locus_rows_published"] is False
    assert visual_smoke["verified_route"]["name"] == "Chart -> Map -> Inquiry -> Ontology"
    assert [route["name"] for route in visual_smoke["verified_routes"]] == [
        "Chart -> Map -> Inquiry -> Ontology",
        "Ontology tier drilldown share URLs",
        "Latest analysis Ask this map layer",
        "Question-to-map highlight depth",
        "Selected-unit ontology route comparison",
        "Selected-unit query replay",
        "Saved inquiry route comparison",
        "Timeline-driven map layer playback",
    ]


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


def test_publish_question_pack_is_aggregate_only(tmp_path) -> None:
    output_dir = tmp_path / "analysis"
    publish_analysis_artifacts(LocusCorpus.demo(), output_dir, include_record_samples=False)
    publish_inquiry_briefings(output_dir, output_dir / "inquiry_briefings.json")
    result = publish_question_pack(output_dir, output_dir / "question_pack.json")
    payload = json.loads((output_dir / "question_pack.json").read_text(encoding="utf-8"))
    assert result.prompt_count == 8
    assert result.grok_used is False
    assert payload["schema_version"] == "evolocus-filter-aware-question-pack-v1"
    assert payload["publication_policy"]["raw_rows_included"] is False
    assert payload["publication_policy"]["ordinance_text_included"] is False
    assert payload["publication_policy"]["record_locator_values_included"] is False
    assert payload["publication_policy"]["browser_llm_calls"] is False
    assert payload["publication_policy"]["legal_findings"] is False
    assert payload["grok"]["secret_env"] == "GROK_API_KEY"
    assert payload["prompts"]
    assert payload["filter_contexts"]
    serialized = json.dumps(payload)
    assert '"content"' not in serialized
    assert '"header"' not in serialized
    assert "source_locator" not in serialized


def test_publish_ai_analysis_pack_is_aggregate_only(tmp_path) -> None:
    output_dir = tmp_path / "analysis"
    publish_analysis_artifacts(LocusCorpus.demo(), output_dir, include_record_samples=False)
    publish_inquiry_briefings(output_dir, output_dir / "inquiry_briefings.json")
    publish_question_pack(output_dir, output_dir / "question_pack.json")

    result = publish_ai_analysis_pack(output_dir, output_dir / "ai_analysis_pack.json")
    payload = json.loads((output_dir / "ai_analysis_pack.json").read_text(encoding="utf-8"))

    assert result.card_count == 5
    assert result.grok_used is False
    assert payload["schema_version"] == "evolocus-ai-analysis-pack-v1"
    assert payload["real_locus_rows_published"] is False
    assert payload["publication_policy"]["raw_rows_included"] is False
    assert payload["publication_policy"]["ordinance_text_included"] is False
    assert payload["publication_policy"]["record_locator_values_included"] is False
    assert payload["publication_policy"]["browser_llm_calls"] is False
    assert payload["publication_policy"]["secrets_included"] is False
    assert payload["publication_policy"]["legal_findings"] is False
    assert payload["grok"]["secret_env"] == "GROK_API_KEY"
    assert payload["cards"]
    assert {card["id"] for card in payload["cards"]} >= {"aggregate-summary", "question-router", "color-map-route", "ontology-route", "unit-focus"}
    serialized = json.dumps(payload)
    assert '"content"' not in serialized
    assert '"header"' not in serialized
    assert "source_locator" not in serialized
    assert "api.x.ai" not in serialized


def test_public_artifact_guard_accepts_aggregate_artifacts(tmp_path) -> None:
    output_dir = tmp_path / "analysis"
    publish_analysis_artifacts(LocusCorpus.demo(), output_dir, include_record_samples=False)
    publish_inquiry_briefings(output_dir, output_dir / "inquiry_briefings.json")
    publish_question_pack(output_dir, output_dir / "question_pack.json")
    publish_ai_analysis_pack(output_dir, output_dir / "ai_analysis_pack.json")

    result = validate_public_analysis_artifacts(output_dir)

    assert result.artifact_count >= 6
    assert "ai_analysis_pack.json" in result.checked_artifacts
    assert "inquiry_briefings.json" in result.checked_artifacts
    assert "question_pack.json" in result.checked_artifacts
    assert "visual_smoke.json" in result.checked_artifacts


def test_public_artifact_guard_accepts_refresh_status_policy(tmp_path) -> None:
    output_dir = tmp_path / "analysis"
    publish_analysis_artifacts(LocusCorpus.demo(), output_dir, include_record_samples=False)
    publish_inquiry_briefings(output_dir, output_dir / "inquiry_briefings.json")
    publish_question_pack(output_dir, output_dir / "question_pack.json")
    publish_ai_analysis_pack(output_dir, output_dir / "ai_analysis_pack.json")
    (output_dir / "refresh_status.json").write_text(
        json.dumps(
            {
                "schema_version": "evolocus-actions-refresh-status-v1",
                "workflow_file": "analysis-refresh.yml",
                "run_url": "https://github.com/evcatalyst/evolocus/actions/runs/123",
                "publication_policy": {
                    "raw_rows_included": False,
                    "ordinance_text_included": False,
                    "record_locator_values_included": False,
                    "review_events_included": False,
                    "browser_llm_calls": False,
                    "secrets_included": False,
                    "legal_findings": False,
                },
            }
        ),
        encoding="utf-8",
    )

    result = validate_public_analysis_artifacts(output_dir)

    assert "refresh_status.json" in result.checked_artifacts


def test_public_artifact_guard_rejects_raw_text_fields(tmp_path) -> None:
    output_dir = tmp_path / "analysis"
    publish_analysis_artifacts(LocusCorpus.demo(), output_dir, include_record_samples=False)
    publish_inquiry_briefings(output_dir, output_dir / "inquiry_briefings.json")
    publish_question_pack(output_dir, output_dir / "question_pack.json")
    publish_ai_analysis_pack(output_dir, output_dir / "ai_analysis_pack.json")
    (output_dir / "unsafe.json").write_text('{"content": "do not publish ordinance text"}', encoding="utf-8")

    try:
        validate_public_analysis_artifacts(output_dir)
    except PublicArtifactValidationError as exc:
        assert "boundary violation" in str(exc)
    else:  # pragma: no cover - defensive assertion path
        raise AssertionError("expected raw text field to be rejected")


def test_public_artifact_guard_rejects_browser_llm_policy(tmp_path) -> None:
    output_dir = tmp_path / "analysis"
    publish_analysis_artifacts(LocusCorpus.demo(), output_dir, include_record_samples=False)
    publish_inquiry_briefings(output_dir, output_dir / "inquiry_briefings.json")
    publish_question_pack(output_dir, output_dir / "question_pack.json")
    publish_ai_analysis_pack(output_dir, output_dir / "ai_analysis_pack.json")
    path = output_dir / "inquiry_briefings.json"
    payload = json.loads(path.read_text(encoding="utf-8"))
    payload["publication_policy"]["browser_llm_calls"] = True
    path.write_text(json.dumps(payload), encoding="utf-8")

    try:
        validate_public_analysis_artifacts(output_dir)
    except PublicArtifactValidationError as exc:
        assert "browser_llm_calls" in str(exc)
    else:  # pragma: no cover - defensive assertion path
        raise AssertionError("expected browser LLM policy violation to be rejected")
