"""Generate static filter-aware inquiry question packs from aggregate Pages artifacts."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
import json
import os
from pathlib import Path
from typing import Any
from urllib import error, request

from .inquiry_briefings import DEFAULT_ANALYSIS_DIR, DEFAULT_GROK_MODEL, XAI_RESPONSES_URL


QUESTION_PACK_SCHEMA_VERSION = "evolocus-filter-aware-question-pack-v1"
DEFAULT_QUESTION_PACK_PATH = DEFAULT_ANALYSIS_DIR / "question_pack.json"


@dataclass(frozen=True)
class QuestionPackResult:
    output_path: Path
    prompt_count: int
    grok_used: bool

    def to_dict(self) -> dict[str, Any]:
        return {
            "output": str(self.output_path),
            "prompt_count": self.prompt_count,
            "grok_used": self.grok_used,
        }


def publish_question_pack(
    analysis_dir: Path = DEFAULT_ANALYSIS_DIR,
    output_path: Path = DEFAULT_QUESTION_PACK_PATH,
    *,
    use_grok: bool = False,
    grok_api_key_env: str = "GROK_API_KEY",
    grok_model: str = DEFAULT_GROK_MODEL,
    timeout_seconds: float = 20.0,
) -> QuestionPackResult:
    """Write an aggregate-only static question pack for the Pages inquiry surface."""

    artifacts = _load_artifacts(analysis_dir)
    payload = _question_pack_payload(artifacts)
    grok_status = {
        "used": False,
        "model": grok_model,
        "secret_env": grok_api_key_env,
        "error": None,
    }
    if use_grok:
        api_key = os.environ.get(grok_api_key_env)
        if api_key:
            try:
                payload["grok_note"] = _grok_question_note(
                    payload,
                    api_key=api_key,
                    model=grok_model,
                    timeout_seconds=timeout_seconds,
                )
                grok_status["used"] = True
            except RuntimeError as exc:
                grok_status["error"] = str(exc)
        else:
            grok_status["error"] = f"{grok_api_key_env} is not set; deterministic question pack used."
    payload["grok"] = grok_status
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return QuestionPackResult(
        output_path=output_path,
        prompt_count=len(payload["prompts"]),
        grok_used=bool(grok_status["used"]),
    )


def _load_artifacts(analysis_dir: Path) -> dict[str, Any]:
    required = {
        "status": "status.json",
        "map_layers": "map_layers.json",
        "charts": "charts.json",
        "models": "models.json",
    }
    optional = {
        "unit_audit_quality": "unit_audit_quality.json",
        "county_geometry": "county_geometry.json",
        "municipal_points": "municipal_points.json",
        "inquiry_briefings": "inquiry_briefings.json",
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


def _question_pack_payload(artifacts: dict[str, Any]) -> dict[str, Any]:
    status = artifacts["status"]
    map_layers = artifacts["map_layers"]
    charts = artifacts["charts"].get("charts", {})
    units = map_layers.get("units") or []
    state_rows = _state_rows(units)
    top_state = state_rows[0] if state_rows else {"label": "all states", "value": len(units), "law_count": 0}
    top_unit = max(units, key=lambda unit: int(unit.get("law_count") or 0), default={})
    top_topic = _first_row(charts.get("topic_counts"), "Other")
    top_function = _first_row(charts.get("function_counts"), "Rules")
    top_tier = _first_row(charts.get("tier_counts"), "Tier 1")
    audit_unit = _top_audit_unit(artifacts.get("unit_audit_quality") or {})

    prompts = [
        _prompt(
            "view-current",
            "Current view",
            "Map",
            "What does the current filtered map view show?",
            "Use active filters and denominators before interpreting color.",
            {},
            "overview",
            {"unit_count": len(units), "law_count": status.get("law_count")},
        ),
        _prompt(
            "state-focus",
            f"{top_state['label']} focus",
            "State filter",
            f"What changes when I focus the map on {top_state['label']}?",
            "Applies the highest-count published state filter from the aggregate layer.",
            {"state": top_state["label"]},
            "overview",
            {"unit_count": top_state["value"], "law_count": top_state["law_count"]},
        ),
        _prompt(
            "topic-focus",
            f"{top_topic['label']} topic",
            "Topic filter",
            f"Which county and town units drive the {top_topic['label']} topic view?",
            "Pairs topic filtering with selected-unit drilldowns.",
            {"topic": top_topic["label"]},
            "unit",
            {"aggregate_rows": top_topic["value"]},
        ),
        _prompt(
            "function-focus",
            f"{top_function['label']} function",
            "Function filter",
            f"How does the {top_function['label']} function pattern appear across the map?",
            "Keeps function labels framed as released model outputs.",
            {"function": top_function["label"]},
            "unit",
            {"aggregate_rows": top_function["value"]},
        ),
        _prompt(
            "tier-focus",
            f"{top_tier['label']} tier",
            "Tier filter",
            f"What should I inspect in {top_tier['label']} units?",
            "Tiers are neutral visual bands, not rankings.",
            {"tier": top_tier["label"]},
            "unit",
            {"aggregate_rows": top_tier["value"]},
        ),
        _prompt(
            "audit-focus",
            "Audit signals",
            "Evidence trail",
            "Which visible units need OCR or duplicate-text review first?",
            "Uses aggregate audit signals without publishing text or locators.",
            {"auditFocus": "review"},
            "evidence",
            {
                "top_audit_unit": audit_unit.get("name"),
                "audit_attention_score": audit_unit.get("audit_attention_score"),
            },
        ),
        _prompt(
            "selected-unit",
            "Selected unit",
            "Drilldown",
            f"What does the selected unit {top_unit.get('name', 'on the map')} show?",
            "Starts from the largest published unit if no unit is selected in the browser.",
            {"selected_unit_id": top_unit.get("unit_id")},
            "unit",
            {
                "unit_id": top_unit.get("unit_id"),
                "state": top_unit.get("state"),
                "law_count": top_unit.get("law_count"),
            },
        ),
        _prompt(
            "package-focus",
            "Local package",
            "Package overlay",
            "What does the loaded package show on the map?",
            "Only applies after a browser-local package or synthetic package demo is loaded.",
            {"packageOnly": True},
            "unit",
            {"publication": "browser-local package records are not written to static artifacts"},
        ),
    ]
    return {
        "schema_version": QUESTION_PACK_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "generator": "evolocus-static-question-pack",
        "dataset_id": status.get("dataset_id"),
        "dataset_revision": status.get("dataset_revision"),
        "license": status.get("license"),
        "paper": status.get("paper"),
        "citation": status.get("citation"),
        "synthetic": bool(status.get("synthetic")),
        "real_locus_rows_published": False,
        "publication_policy": {
            "artifact_kind": "aggregate_only_filter_aware_question_pack",
            "raw_rows_included": False,
            "ordinance_text_included": False,
            "record_locator_values_included": False,
            "browser_llm_calls": False,
            "legal_findings": False,
            "notice": "Questions guide aggregate review and are not legal advice or legal findings.",
        },
        "source_artifacts": _source_artifacts(artifacts),
        "filter_contexts": {
            "top_state": top_state,
            "top_topic": top_topic,
            "top_function": top_function,
            "top_tier": top_tier,
            "top_audit_unit": audit_unit,
        },
        "prompts": prompts,
        "suggested_questions": [prompt["question"] for prompt in prompts],
    }


def _prompt(
    prompt_id: str,
    title: str,
    group: str,
    question: str,
    detail: str,
    filters: dict[str, Any],
    disclosure_level: str,
    supporting_facts: dict[str, Any],
) -> dict[str, Any]:
    return {
        "id": prompt_id,
        "title": title,
        "group": group,
        "question": question,
        "detail": detail,
        "filters": filters,
        "recommended_disclosure": disclosure_level,
        "supporting_facts": supporting_facts,
        "safety_notes": [
            "Aggregate-only public artifact.",
            "No ordinance text, headers, raw rows, source locator values, or review events.",
            "Model labels and scores are review aids, not legal findings.",
        ],
    }


def _state_rows(units: list[dict[str, Any]]) -> list[dict[str, Any]]:
    counts: dict[str, dict[str, int]] = {}
    for unit in units:
        state = str(unit.get("state") or "Unknown")
        row = counts.setdefault(state, {"value": 0, "law_count": 0})
        row["value"] += 1
        row["law_count"] += int(unit.get("law_count") or 0)
    return [
        {"label": state, "value": values["value"], "law_count": values["law_count"]}
        for state, values in sorted(counts.items(), key=lambda item: (-item[1]["law_count"], item[0]))
    ]


def _first_row(rows: list[dict[str, Any]] | None, fallback: str) -> dict[str, Any]:
    if not rows:
        return {"label": fallback, "value": 0}
    row = rows[0]
    return {"label": row.get("label") or row.get("id") or fallback, "value": int(row.get("value") or 0)}


def _top_audit_unit(unit_audit_quality: dict[str, Any]) -> dict[str, Any]:
    units = unit_audit_quality.get("units") or []
    if not units:
        return {}
    row = max(units, key=lambda unit: float(unit.get("audit_attention_score") or 0))
    return {
        "unit_id": row.get("unit_id"),
        "name": row.get("name"),
        "state": row.get("state"),
        "audit_attention_score": row.get("audit_attention_score"),
        "ocr_review_rows": row.get("ocr_review_rows"),
        "duplicate_text_hash_rows": row.get("duplicate_text_hash_rows"),
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


def _grok_question_note(payload: dict[str, Any], *, api_key: str, model: str, timeout_seconds: float) -> str:
    prompt = {
        "task": "Write one concise public-facing note explaining how to use this filter-aware question pack.",
        "constraints": [
            "Use only aggregate facts from the payload.",
            "Do not make legal conclusions or rankings.",
            "Mention that GitHub Pages does not make live model calls.",
            "Mention that raw ordinance text and source locators are not published.",
            "Keep the response under 90 words.",
        ],
        "dataset_revision": payload.get("dataset_revision"),
        "prompt_count": len(payload.get("prompts") or []),
        "prompt_titles": [prompt["title"] for prompt in payload.get("prompts") or []],
    }
    body = {
        "model": model,
        "input": [
            {
                "role": "system",
                "content": "You write conservative civic data interface notes with provenance and uncertainty preserved.",
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
        with request.urlopen(req, timeout=timeout_seconds) as response:  # noqa: S310 - explicit API endpoint.
            data = json.loads(response.read().decode("utf-8"))
    except (error.URLError, TimeoutError, OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"Grok question-pack note failed: {exc}") from exc
    text = data.get("output_text")
    if isinstance(text, str) and text.strip():
        return text.strip()
    for item in data.get("output", []):
        for content in item.get("content", []):
            if content.get("type") in {"output_text", "text"} and content.get("text"):
                return str(content["text"]).strip()
    raise RuntimeError("Grok question-pack note returned no text.")
