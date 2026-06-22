"""Build a public, aggregate-only AI analysis pack for GitHub Pages."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
import json
from pathlib import Path
from typing import Any

from .inquiry_briefings import DEFAULT_ANALYSIS_DIR


AI_ANALYSIS_PACK_SCHEMA_VERSION = "evolocus-ai-analysis-pack-v1"
DEFAULT_AI_ANALYSIS_PACK_PATH = DEFAULT_ANALYSIS_DIR / "ai_analysis_pack.json"
MAX_PUBLIC_TEXT_CHARS = 700


@dataclass(frozen=True)
class AiAnalysisPackResult:
    output_path: Path
    card_count: int
    grok_used: bool

    def to_dict(self) -> dict[str, Any]:
        return {
            "output": str(self.output_path),
            "card_count": self.card_count,
            "grok_used": self.grok_used,
        }


def publish_ai_analysis_pack(
    analysis_dir: Path = DEFAULT_ANALYSIS_DIR,
    output_path: Path = DEFAULT_AI_ANALYSIS_PACK_PATH,
) -> AiAnalysisPackResult:
    """Write a static AI-analysis pack derived only from public aggregate artifacts."""

    artifacts = _load_artifacts(analysis_dir)
    payload = _ai_analysis_pack_payload(artifacts)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return AiAnalysisPackResult(
        output_path=output_path,
        card_count=len(payload["cards"]),
        grok_used=bool(payload["grok"]["used"]),
    )


def _load_artifacts(analysis_dir: Path) -> dict[str, Any]:
    required = {
        "status": "status.json",
        "map_layers": "map_layers.json",
        "ontology": "ontology.json",
        "charts": "charts.json",
        "inquiry_briefings": "inquiry_briefings.json",
        "question_pack": "question_pack.json",
    }
    optional = {
        "refresh_status": "refresh_status.json",
        "unit_audit_quality": "unit_audit_quality.json",
    }
    artifacts: dict[str, Any] = {}
    for key, filename in required.items():
        path = analysis_dir / filename
        if not path.exists():
            raise FileNotFoundError(f"required analysis artifact is missing: {path}")
        artifacts[key] = _read_json(path)
    for key, filename in optional.items():
        path = analysis_dir / filename
        artifacts[key] = _read_json(path) if path.exists() else None
    return artifacts


def _read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _ai_analysis_pack_payload(artifacts: dict[str, Any]) -> dict[str, Any]:
    status = artifacts["status"]
    map_layers = artifacts["map_layers"]
    ontology = artifacts["ontology"]
    briefings = artifacts["inquiry_briefings"]
    question_pack = artifacts["question_pack"]
    refresh_status = artifacts.get("refresh_status") or {}
    units = map_layers.get("units") or []
    facts = briefings.get("facts") or {}
    briefing_grok = briefings.get("grok") or {}
    question_grok = question_pack.get("grok") or {}
    grok_used = bool(briefing_grok.get("used") or question_grok.get("used"))
    source_model = briefing_grok.get("model") or question_grok.get("model")
    top_prompt = _prompt_by_id(question_pack, "topic-focus") or _first_prompt(question_pack)
    function_prompt = _prompt_by_id(question_pack, "function-focus")
    ontology_briefing = _briefing_by_id(briefings, "ontology")
    map_briefing = _briefing_by_id(briefings, "map")
    coverage_briefing = _briefing_by_id(briefings, "coverage")
    top_unit = max(units, key=lambda unit: int(unit.get("law_count") or 0), default={})
    cards = [
        _summary_card(briefings, coverage_briefing, status, facts),
        _question_note_card(question_pack, top_prompt, map_layers),
        _map_route_card(top_prompt, map_briefing, map_layers),
        _ontology_route_card(ontology_briefing, ontology, function_prompt),
        _unit_focus_card(top_unit, status),
    ]
    return {
        "schema_version": AI_ANALYSIS_PACK_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "generator": "evolocus-ai-analysis-pack",
        "dataset_id": status.get("dataset_id") or briefings.get("dataset_id"),
        "dataset_revision": status.get("dataset_revision") or briefings.get("dataset_revision"),
        "license": status.get("license") or briefings.get("license"),
        "paper": status.get("paper") or briefings.get("paper"),
        "citation": status.get("citation") or briefings.get("citation"),
        "synthetic": bool(status.get("synthetic") or briefings.get("synthetic")),
        "real_locus_rows_published": False,
        "grok": {
            "used": grok_used,
            "model": source_model,
            "secret_env": "GROK_API_KEY",
            "source_artifacts": {
                "inquiry_briefings_used": bool(briefing_grok.get("used")),
                "question_pack_used": bool(question_grok.get("used")),
            },
            "browser_policy": "Model calls run only in local tooling or GitHub Actions. Pages receives sanitized aggregate JSON.",
        },
        "analysis_status": {
            "state": status.get("analysis_state"),
            "unit_count": status.get("unit_count", len(units)),
            "law_count": status.get("law_count", sum(int(unit.get("law_count") or 0) for unit in units)),
            "map_generated_at": map_layers.get("generated_at"),
            "briefing_generated_at": briefings.get("generated_at"),
            "question_pack_generated_at": question_pack.get("generated_at"),
            "refresh_run_id": refresh_status.get("run_id"),
            "refresh_run_url": refresh_status.get("run_url"),
        },
        "source_artifacts": _source_artifacts(artifacts),
        "cards": cards,
        "publication_policy": {
            "artifact_kind": "aggregate_only_ai_analysis_pack",
            "raw_rows_included": False,
            "ordinance_text_included": False,
            "record_locator_values_included": False,
            "review_events_included": False,
            "browser_llm_calls": False,
            "secrets_included": False,
            "legal_findings": False,
            "notice": "Cards summarize aggregate artifacts for research review. They are not legal advice or legal findings.",
        },
    }


def _summary_card(
    briefings: dict[str, Any],
    coverage_briefing: dict[str, Any] | None,
    status: dict[str, Any],
    facts: dict[str, Any],
) -> dict[str, Any]:
    summary = briefings.get("grok_summary") or (coverage_briefing or {}).get("short_answer")
    return _card(
        "aggregate-summary",
        "Offline aggregate synthesis",
        "Grok summary" if briefings.get("grok", {}).get("used") else "Deterministic summary",
        "What does the current real aggregate layer cover?",
        _public_text(
            summary
            or f"The public layer currently represents {facts.get('unit_count', status.get('unit_count', 0))} aggregate units and {facts.get('law_count', status.get('law_count', 0))} law rows."
        ),
        "Open the high-level answer before drilling into unit or evidence views.",
        route={
            "question": "What does the real-data Pages layer currently cover?",
            "filters": {},
            "color_mode": "tier",
            "disclosure_level": "overview",
            "ontology_stage": "overview",
        },
        facts=[
            {"label": "Units", "value": facts.get("unit_count") or status.get("unit_count"), "source": "inquiry_briefings.json"},
            {"label": "Rows", "value": facts.get("law_count") or status.get("law_count"), "source": "status.json"},
        ],
    )


def _question_note_card(question_pack: dict[str, Any], prompt: dict[str, Any] | None, map_layers: dict[str, Any]) -> dict[str, Any]:
    note = question_pack.get("grok_note")
    question = (prompt or {}).get("question") or "What does the current filtered map view show?"
    return _card(
        "question-router",
        "Question router",
        "Askable pack",
        question,
        _public_text(note or "The question pack converts aggregate prompts into map filters and safe inquiry routes."),
        "Use the generated question to color the map before opening the answer.",
        route={
            "question": question,
            "filters": _safe_filters((prompt or {}).get("filters") or {}, map_layers),
            "color_mode": "topic",
            "disclosure_level": (prompt or {}).get("recommended_disclosure") or "unit",
            "ontology_stage": "topic",
        },
        facts=[
            {"label": "Prompts", "value": len(question_pack.get("prompts") or []), "source": "question_pack.json"},
            {"label": "Pack mode", "value": "offline model note" if question_pack.get("grok", {}).get("used") else "deterministic", "source": "question_pack.json"},
        ],
    )


def _map_route_card(prompt: dict[str, Any] | None, map_briefing: dict[str, Any] | None, map_layers: dict[str, Any]) -> dict[str, Any]:
    question = (prompt or {}).get("question") or (map_briefing or {}).get("question") or "How should I read the county and town colored map?"
    return _card(
        "color-map-route",
        "Color map route",
        "Map lens",
        question,
        _public_text((map_briefing or {}).get("short_answer") or "The map colors aggregate county and town units by selected released fields and neutral bands."),
        "Applies a topic/function/tier filter when available, then reuses the same route in Inquiry.",
        route={
            "question": question,
            "filters": _safe_filters((prompt or {}).get("filters") or {}, map_layers),
            "color_mode": _color_mode_for_filters((prompt or {}).get("filters") or {}),
            "disclosure_level": "unit",
            "ontology_stage": "geometry",
        },
        facts=[
            {"label": "Published units", "value": len(map_layers.get("units") or []), "source": "map_layers.json"},
            {"label": "Geometry", "value": map_layers.get("geometry_status"), "source": "map_layers.json"},
        ],
    )


def _ontology_route_card(
    ontology_briefing: dict[str, Any] | None,
    ontology: dict[str, Any],
    function_prompt: dict[str, Any] | None,
) -> dict[str, Any]:
    question = (ontology_briefing or {}).get("question") or "What ontology is being built from LOCUS?"
    filters = (function_prompt or {}).get("filters") or {}
    return _card(
        "ontology-route",
        "Ontology route",
        "Graph lens",
        question,
        _public_text((ontology_briefing or {}).get("short_answer") or "The ontology links aggregate units to released topics, functions, neutral tiers, and score fields."),
        "Opens the graph with the same aggregate function/topic context when available.",
        route={
            "question": question,
            "filters": filters,
            "color_mode": _color_mode_for_filters(filters),
            "disclosure_level": "unit",
            "ontology_stage": "function" if filters.get("function") else "overview",
        },
        facts=[
            {"label": "Nodes", "value": len(ontology.get("nodes") or []), "source": "ontology.json"},
            {"label": "Edges", "value": len(ontology.get("edges") or []), "source": "ontology.json"},
        ],
    )


def _unit_focus_card(unit: dict[str, Any], status: dict[str, Any]) -> dict[str, Any]:
    unit_name = unit.get("name") or "largest published aggregate unit"
    question = f"What does the selected unit {unit_name} show?"
    return _card(
        "unit-focus",
        "Largest unit route",
        "County/town focus",
        question,
        _public_text(
            f"{unit_name} is the highest-count published aggregate unit in this artifact, with {unit.get('law_count', 0)} rows. This is a navigation route, not a ranking or legal conclusion."
        ),
        "Selects a county/town unit and opens the same aggregate-only answer path.",
        route={
            "question": question,
            "filters": {"state": unit.get("state") or ""},
            "selected_unit_id": unit.get("unit_id") or "",
            "color_mode": "tier",
            "disclosure_level": "unit",
            "ontology_stage": "unit",
        },
        facts=[
            {"label": "Unit", "value": unit_name, "source": "map_layers.json"},
            {"label": "Dataset", "value": status.get("dataset_revision"), "source": "status.json"},
        ],
    )


def _card(
    card_id: str,
    title: str,
    label: str,
    question: str,
    answer: str,
    detail: str,
    *,
    route: dict[str, Any],
    facts: list[dict[str, Any]],
) -> dict[str, Any]:
    return {
        "id": card_id,
        "title": title,
        "label": label,
        "question": _public_text(question, max_chars=220),
        "answer": answer,
        "detail": _public_text(detail, max_chars=260),
        "route": route,
        "supporting_facts": facts,
        "publication_policy": {
            "aggregate_only": True,
            "ordinance_text_included": False,
            "record_locator_values_included": False,
            "review_events_included": False,
            "browser_llm_calls": False,
            "legal_findings": False,
        },
    }


def _prompt_by_id(question_pack: dict[str, Any], prompt_id: str) -> dict[str, Any] | None:
    return next((prompt for prompt in question_pack.get("prompts") or [] if prompt.get("id") == prompt_id), None)


def _first_prompt(question_pack: dict[str, Any]) -> dict[str, Any] | None:
    prompts = question_pack.get("prompts") or []
    return prompts[0] if prompts else None


def _briefing_by_id(briefings: dict[str, Any], briefing_id: str) -> dict[str, Any] | None:
    return next((briefing for briefing in briefings.get("briefings") or [] if briefing.get("id") == briefing_id), None)


def _safe_filters(filters: dict[str, Any], map_layers: dict[str, Any]) -> dict[str, Any]:
    output: dict[str, Any] = {}
    for key in ("state", "topic", "function", "kind", "scoreField", "scoreBand", "auditFocus"):
        if filters.get(key):
            output[key] = filters[key]
    if filters.get("tier"):
        output["tier"] = _tier_key_for_label(str(filters["tier"]), map_layers)
    if isinstance(filters.get("packageOnly"), bool):
        output["packageOnly"] = filters["packageOnly"]
    return output


def _tier_key_for_label(label: str, map_layers: dict[str, Any]) -> str:
    definitions = map_layers.get("tier_definitions") or {}
    for key, definition in definitions.items():
        if key == label or definition.get("label") == label:
            return key
    return label


def _color_mode_for_filters(filters: dict[str, Any]) -> str:
    if filters.get("topic"):
        return "topic"
    if filters.get("function"):
        return "function"
    if filters.get("tier"):
        return "tier"
    if filters.get("auditFocus"):
        return "audit_attention"
    return "tier"


def _source_artifacts(artifacts: dict[str, Any]) -> list[dict[str, Any]]:
    rows = []
    for key, value in artifacts.items():
        if not value:
            continue
        rows.append(
            {
                "id": key,
                "schema_version": value.get("schema_version"),
                "generated_at": value.get("generated_at"),
                "synthetic": value.get("synthetic"),
                "real_locus_rows_published": value.get("real_locus_rows_published", False),
            }
        )
    return rows


def _public_text(value: Any, *, max_chars: int = MAX_PUBLIC_TEXT_CHARS) -> str:
    text = " ".join(str(value or "").split())
    replacements = {
        '"content"': "content field",
        '"header"': "header field",
        "source_locator": "source locator",
        "source_locators": "source locators",
        "Authorization: Bearer": "authorization credential",
        "api.x.ai": "model endpoint",
        "GROK_API_KEY": "repository model secret",
        "Grok_api_key": "repository model secret",
        "xai-": "model-key-prefix-",
    }
    for needle, replacement in replacements.items():
        text = text.replace(needle, replacement)
    if len(text) > max_chars:
        return text[: max_chars - 1].rstrip() + "…"
    return text
