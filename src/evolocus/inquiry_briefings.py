"""Generate static progressive inquiry briefings from aggregate Pages artifacts."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
import json
import os
from pathlib import Path
from typing import Any
from urllib import error, request


INQUIRY_BRIEFINGS_SCHEMA_VERSION = "evolocus-progressive-inquiry-v1"
DEFAULT_ANALYSIS_DIR = Path("site/data/analysis")
DEFAULT_INQUIRY_BRIEFINGS_PATH = DEFAULT_ANALYSIS_DIR / "inquiry_briefings.json"
XAI_RESPONSES_URL = "https://api.x.ai/v1/responses"
DEFAULT_GROK_MODEL = "grok-4.3"


@dataclass(frozen=True)
class InquiryBriefingResult:
    output_path: Path
    briefing_count: int
    grok_used: bool

    def to_dict(self) -> dict[str, Any]:
        return {
            "output": str(self.output_path),
            "briefing_count": self.briefing_count,
            "grok_used": self.grok_used,
        }


def publish_inquiry_briefings(
    analysis_dir: Path = DEFAULT_ANALYSIS_DIR,
    output_path: Path = DEFAULT_INQUIRY_BRIEFINGS_PATH,
    *,
    use_grok: bool = False,
    grok_api_key_env: str = "GROK_API_KEY",
    grok_model: str = DEFAULT_GROK_MODEL,
    timeout_seconds: float = 20.0,
) -> InquiryBriefingResult:
    """Write a static, aggregate-only inquiry briefing artifact."""

    artifacts = _load_artifacts(analysis_dir)
    payload = _briefings_payload(artifacts)
    grok_status = {
        "used": False,
        "model": grok_model,
        "secret_env": grok_api_key_env,
        "docs": "https://docs.x.ai/overview",
        "error": None,
    }
    if use_grok:
        api_key = os.environ.get(grok_api_key_env)
        if api_key:
            try:
                payload["grok_summary"] = _grok_summary(
                    payload,
                    api_key=api_key,
                    model=grok_model,
                    timeout_seconds=timeout_seconds,
                )
                grok_status["used"] = True
            except RuntimeError as exc:
                grok_status["error"] = str(exc)
        else:
            grok_status["error"] = f"{grok_api_key_env} is not set; deterministic briefing used."
    payload["grok"] = grok_status
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return InquiryBriefingResult(
        output_path=output_path,
        briefing_count=len(payload["briefings"]),
        grok_used=bool(grok_status["used"]),
    )


def _load_artifacts(analysis_dir: Path) -> dict[str, Any]:
    required = {
        "status": "status.json",
        "map_layers": "map_layers.json",
        "ontology": "ontology.json",
        "models": "models.json",
        "charts": "charts.json",
    }
    optional = {
        "county_geometry": "county_geometry.json",
        "municipal_points": "municipal_points.json",
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


def _briefings_payload(artifacts: dict[str, Any]) -> dict[str, Any]:
    status = artifacts["status"]
    map_layers = artifacts["map_layers"]
    ontology = artifacts["ontology"]
    charts = artifacts["charts"]
    county_geometry = artifacts.get("county_geometry") or {}
    municipal_points = artifacts.get("municipal_points") or {}
    units = map_layers.get("units") or []
    top_units = sorted(units, key=lambda item: int(item.get("law_count") or 0), reverse=True)[:8]
    state_count = len({unit.get("state") for unit in units if unit.get("state")})
    topic_rows = charts.get("charts", {}).get("topic_counts", [])
    function_rows = charts.get("charts", {}).get("function_counts", [])
    tier_rows = charts.get("charts", {}).get("tier_counts", [])
    kind_rows = charts.get("charts", {}).get("kind_counts", [])
    score_rows = charts.get("charts", {}).get("score_means", [])

    facts = {
        "analysis_state": status.get("analysis_state"),
        "dataset_revision": status.get("dataset_revision"),
        "unit_count": status.get("unit_count", len(units)),
        "law_count": status.get("law_count", sum(int(unit.get("law_count") or 0) for unit in units)),
        "state_count": state_count,
        "county_matches": county_geometry.get("matched_count", 0),
        "municipal_matches": municipal_points.get("matched_count", 0),
        "ontology_nodes": len(ontology.get("nodes") or []),
        "ontology_edges": len(ontology.get("edges") or []),
        "top_topic": _top_label(topic_rows),
        "top_function": _top_label(function_rows),
        "tier_mix": _row_summary(tier_rows),
        "kind_mix": _row_summary(kind_rows),
    }
    briefings = [
        _coverage_briefing(facts, top_units),
        _map_briefing(facts, map_layers, county_geometry, municipal_points),
        _ontology_briefing(facts),
        _model_briefing(facts, score_rows),
        _safety_briefing(status),
    ]
    return {
        "schema_version": INQUIRY_BRIEFINGS_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "generator": "evolocus-static-progressive-inquiry",
        "dataset_id": status.get("dataset_id"),
        "dataset_revision": status.get("dataset_revision"),
        "license": status.get("license"),
        "paper": status.get("paper"),
        "citation": status.get("citation"),
        "synthetic": bool(status.get("synthetic")),
        "real_locus_rows_published": False,
        "publication_policy": {
            "artifact_kind": "aggregate_only_static_briefings",
            "raw_rows_included": False,
            "ordinance_text_included": False,
            "record_locator_values_included": False,
            "browser_llm_calls": False,
            "legal_findings": False,
            "notice": "Briefings summarize aggregate artifacts for research review. They are not legal advice or legal findings.",
        },
        "source_artifacts": _source_artifacts(artifacts),
        "facts": facts,
        "suggested_questions": [briefing["question"] for briefing in briefings],
        "briefings": briefings,
    }


def _coverage_briefing(facts: dict[str, Any], top_units: list[dict[str, Any]]) -> dict[str, Any]:
    top_rows = [
        {
            "unit_id": unit.get("unit_id"),
            "name": unit.get("name"),
            "state": unit.get("state"),
            "kind": unit.get("kind"),
            "law_count": int(unit.get("law_count") or 0),
            "dominant_topic": unit.get("dominant_topic"),
            "tier_label": unit.get("tier_label"),
        }
        for unit in top_units
    ]
    largest = top_rows[0] if top_rows else None
    return {
        "id": "coverage",
        "title": "Published aggregate coverage",
        "question": "What does the real-data Pages layer currently cover?",
        "short_answer": (
            f"The public layer represents {facts['unit_count']} aggregate jurisdiction units, "
            f"{facts['law_count']} LOCUS law records, and {facts['state_count']} states or district entries. "
            "It publishes aggregate counts only, not ordinance text."
        ),
        "progressive_sections": [
            {
                "level": "overview",
                "heading": "Scope",
                "body": (
                    f"Current status is {facts['analysis_state']} for dataset revision "
                    f"{facts['dataset_revision']}."
                ),
            },
            {
                "level": "unit",
                "heading": "Largest visible aggregate units",
                "body": (
                    f"The largest aggregate unit by law-record count is {largest['name']} "
                    f"({largest['state']}, {largest['kind']}) with {largest['law_count']} records."
                    if largest
                    else "No aggregate units are available in the current artifact."
                ),
                "rows": top_rows,
            },
            {
                "level": "evidence",
                "heading": "Evidence boundary",
                "body": "The briefing is derived from map_layers.json and charts.json. It omits raw text, headers, and source locators.",
            },
        ],
        "supporting_facts": _supporting_facts(facts, ["unit_count", "law_count", "state_count"]),
    }


def _map_briefing(
    facts: dict[str, Any],
    map_layers: dict[str, Any],
    county_geometry: dict[str, Any],
    municipal_points: dict[str, Any],
) -> dict[str, Any]:
    return {
        "id": "map",
        "title": "County and town map coloring",
        "question": "How should I read the county and town colored map?",
        "short_answer": (
            "The map supports aggregate color modes for neutral tier, dominant topic, dominant function, "
            "and law-count intensity. Colors are exploratory model-output summaries, not rankings."
        ),
        "progressive_sections": [
            {
                "level": "overview",
                "heading": "Current geography",
                "body": (
                    f"{facts['county_matches']} county polygons and {facts['municipal_matches']} municipal/town points "
                    "are machine matched to the aggregate LOCUS layer pending review."
                ),
            },
            {
                "level": "unit",
                "heading": "Color modes",
                "rows": [
                    {"mode": "tier", "meaning": "neutral score band"},
                    {"mode": "topic", "meaning": "dominant LOCUS topic in aggregate counts"},
                    {"mode": "function", "meaning": "dominant LOCUS function in aggregate counts"},
                    {"mode": "law_count", "meaning": "relative aggregate record count intensity"},
                ],
            },
            {
                "level": "evidence",
                "heading": "Geometry provenance",
                "body": (
                    f"County geometry status: {county_geometry.get('geometry_status', 'not available')}. "
                    f"Municipal geometry status: {municipal_points.get('geometry_status', 'not available')}. "
                    f"State-cluster fallback status: {map_layers.get('geometry_status', 'not available')}."
                ),
            },
        ],
        "supporting_facts": _supporting_facts(facts, ["county_matches", "municipal_matches"]),
    }


def _ontology_briefing(facts: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": "ontology",
        "title": "Ontology from released LOCUS fields",
        "question": "What ontology is being built from LOCUS?",
        "short_answer": (
            f"The current ontology has {facts['ontology_nodes']} nodes and {facts['ontology_edges']} edges "
            "linking jurisdiction units to released topics, functions, neutral tiers, and score dimensions."
        ),
        "progressive_sections": [
            {
                "level": "overview",
                "heading": "Core node types",
                "body": "Topics, functions, score dimensions, neutral tiers, and jurisdiction units are represented.",
            },
            {
                "level": "unit",
                "heading": "Dominant aggregate signals",
                "body": f"Top aggregate topic: {facts['top_topic']}. Top aggregate function: {facts['top_function']}.",
            },
            {
                "level": "evidence",
                "heading": "Interpretation boundary",
                "body": "Ontology edges summarize model-produced dataset fields. They are not verified legal relationships.",
            },
        ],
        "supporting_facts": _supporting_facts(facts, ["ontology_nodes", "ontology_edges"]),
    }


def _model_briefing(facts: dict[str, Any], score_rows: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "id": "models",
        "title": "Model-output interpretation",
        "question": "What do the model scores mean on this site?",
        "short_answer": "The site displays released LOCUS labels and neutral score aggregates. Score direction is not verified here.",
        "progressive_sections": [
            {
                "level": "overview",
                "heading": "Released outputs",
                "body": "The browser imports aggregate outputs for substantivity, function, topic, and four continuous score fields.",
            },
            {
                "level": "unit",
                "heading": "Current aggregate score means",
                "rows": score_rows,
            },
            {
                "level": "evidence",
                "heading": "No legal conclusion",
                "body": "Do not interpret a higher or lower score as more or less lawful, burdensome, free, opaque, or paternalistic until source model documentation is reviewed.",
            },
        ],
        "supporting_facts": _supporting_facts(facts, ["tier_mix", "kind_mix"]),
    }


def _safety_briefing(status: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": "safety",
        "title": "Publication and Grok boundary",
        "question": "Can Grok answer live questions on the GitHub Pages site?",
        "short_answer": "No. GitHub Pages is static. Grok can only enrich aggregate artifacts in offline jobs, never in browser JavaScript.",
        "progressive_sections": [
            {
                "level": "overview",
                "heading": "Browser policy",
                "body": status.get("grok_browser_policy", "No API keys are exposed to the browser."),
            },
            {
                "level": "unit",
                "heading": "Offline generation",
                "body": "A GitHub Actions or local Python job may use GROK_API_KEY to generate static aggregate-only summaries.",
            },
            {
                "level": "evidence",
                "heading": "Data boundary",
                "body": "The generated public artifact must not contain raw ordinance text, headers, source locators, secrets, or private local paths.",
            },
        ],
        "supporting_facts": [
            {"label": "Secret name", "value": "GROK_API_KEY", "source": "status.json/models.json"},
            {"label": "Browser LLM calls", "value": "disabled", "source": "publication policy"},
        ],
    }


def _source_artifacts(artifacts: dict[str, Any]) -> list[dict[str, Any]]:
    rows = []
    for key, value in artifacts.items():
        if value is None:
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


def _supporting_facts(facts: dict[str, Any], keys: list[str]) -> list[dict[str, Any]]:
    return [{"label": key.replace("_", " "), "value": facts.get(key), "source": "aggregate artifacts"} for key in keys]


def _top_label(rows: list[dict[str, Any]]) -> str:
    if not rows:
        return "not available"
    row = max(rows, key=lambda item: int(item.get("value") or 0))
    return f"{row.get('label')} ({row.get('value')})"


def _row_summary(rows: list[dict[str, Any]]) -> str:
    if not rows:
        return "not available"
    return ", ".join(f"{row.get('label')}: {row.get('value')}" for row in rows[:5])


def _grok_summary(payload: dict[str, Any], *, api_key: str, model: str, timeout_seconds: float) -> str:
    prompt = {
        "task": "Write one concise public-facing summary of the aggregate EvoLOCUS static inquiry artifact.",
        "constraints": [
            "Use only the provided aggregate facts.",
            "Do not make legal conclusions or rankings.",
            "Mention that raw ordinance text is not published.",
            "Mention that scores are model-produced and neutral unless score direction is verified.",
            "Keep the response under 120 words.",
        ],
        "facts": payload["facts"],
        "briefing_titles": [briefing["title"] for briefing in payload["briefings"]],
    }
    body = {
        "model": model,
        "input": [
            {
                "role": "system",
                "content": "You generate conservative civic data summaries with provenance and uncertainty preserved.",
            },
            {"role": "user", "content": json.dumps(prompt, sort_keys=True)},
        ],
    }
    req = request.Request(
        XAI_RESPONSES_URL,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=timeout_seconds) as response:  # noqa: S310 - explicit user-provided API endpoint.
            data = json.loads(response.read().decode("utf-8"))
    except (error.URLError, TimeoutError, OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"Grok enrichment failed: {exc}") from exc
    text = data.get("output_text")
    if isinstance(text, str) and text.strip():
        return text.strip()
    for item in data.get("output", []):
        for content in item.get("content", []):
            if content.get("type") in {"output_text", "text"} and content.get("text"):
                return str(content["text"]).strip()
    raise RuntimeError("Grok enrichment returned no text.")
