"""Safety checks for public static analysis artifacts."""

from __future__ import annotations

from dataclasses import dataclass
import json
from pathlib import Path
from typing import Any


FORBIDDEN_PUBLIC_TOKENS = [
    '"content"',
    '"header"',
    '"source_locator"',
    "source_locator",
    "Authorization: Bearer",
    "github_pat_",
    "gho_",
    "xai-",
    "sk_live_",
    "sk_test_",
    "data/raw",
    "data/processed",
    ".parquet",
    ".sqlite",
    ".sqlite3",
    ".db",
]

REQUIRED_PUBLIC_ARTIFACTS = [
    "status.json",
    "map_layers.json",
    "ontology.json",
    "models.json",
    "charts.json",
    "inquiry_briefings.json",
    "question_pack.json",
    "visual_smoke.json",
]


class PublicArtifactValidationError(ValueError):
    """Raised when a Pages artifact violates public-data boundaries."""


@dataclass(frozen=True)
class PublicArtifactValidationResult:
    analysis_dir: Path
    checked_artifacts: list[str]
    artifact_count: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "analysis_dir": str(self.analysis_dir),
            "artifact_count": self.artifact_count,
            "checked_artifacts": self.checked_artifacts,
            "valid": True,
        }


def validate_public_analysis_artifacts(analysis_dir: Path) -> PublicArtifactValidationResult:
    """Validate aggregate-only Pages artifacts before deployment."""

    missing = [name for name in REQUIRED_PUBLIC_ARTIFACTS if not (analysis_dir / name).exists()]
    if missing:
        raise PublicArtifactValidationError(f"missing required public analysis artifacts: {', '.join(missing)}")

    artifact_paths = sorted(path for path in analysis_dir.glob("*.json") if path.is_file())
    if not artifact_paths:
        raise PublicArtifactValidationError(f"no JSON artifacts found in {analysis_dir}")

    payloads: dict[str, Any] = {}
    forbidden_matches: list[str] = []
    for path in artifact_paths:
        text = path.read_text(encoding="utf-8")
        for token in FORBIDDEN_PUBLIC_TOKENS:
            if token in text:
                forbidden_matches.append(f"{path.name}: {token}")
        try:
            payloads[path.name] = json.loads(text)
        except json.JSONDecodeError as exc:
            raise PublicArtifactValidationError(f"invalid JSON artifact {path}: {exc}") from exc

    if forbidden_matches:
        raise PublicArtifactValidationError(
            "public artifact boundary violation: " + "; ".join(forbidden_matches[:20])
        )

    _validate_status_policy(payloads["status.json"])
    _validate_inquiry_briefings_policy(payloads["inquiry_briefings.json"])
    _validate_question_pack_policy(payloads["question_pack.json"])
    _validate_models_policy(payloads["models.json"])
    _validate_visual_smoke_policy(payloads["visual_smoke.json"])

    return PublicArtifactValidationResult(
        analysis_dir=analysis_dir,
        checked_artifacts=[path.name for path in artifact_paths],
        artifact_count=len(artifact_paths),
    )


def _validate_status_policy(payload: dict[str, Any]) -> None:
    if payload.get("real_locus_rows_published") is not False:
        raise PublicArtifactValidationError("status.json must declare real_locus_rows_published=false")
    gates = {gate.get("id"): gate.get("status") for gate in payload.get("publication_gates") or []}
    if gates.get("aggregate_only") != "complete":
        raise PublicArtifactValidationError("status.json must include a complete aggregate_only publication gate")
    browser_policy = str(payload.get("grok_browser_policy") or "")
    if "never" not in browser_policy.lower() or "javascript" not in browser_policy.lower():
        raise PublicArtifactValidationError("status.json must preserve the Grok browser-secret boundary")


def _validate_inquiry_briefings_policy(payload: dict[str, Any]) -> None:
    if payload.get("real_locus_rows_published") is not False:
        raise PublicArtifactValidationError("inquiry_briefings.json must declare real_locus_rows_published=false")
    policy = payload.get("publication_policy") or {}
    required_false = [
        "raw_rows_included",
        "ordinance_text_included",
        "record_locator_values_included",
        "browser_llm_calls",
        "legal_findings",
    ]
    for key in required_false:
        if policy.get(key) is not False:
            raise PublicArtifactValidationError(f"inquiry_briefings.json publication_policy.{key} must be false")
    grok = payload.get("grok") or {}
    if grok.get("secret_env") != "GROK_API_KEY":
        raise PublicArtifactValidationError("inquiry_briefings.json must reference only the GROK_API_KEY secret name")
    if "api.x.ai" in json.dumps(payload.get("briefings") or []):
        raise PublicArtifactValidationError("briefing content must not expose API endpoints")


def _validate_question_pack_policy(payload: dict[str, Any]) -> None:
    if payload.get("real_locus_rows_published") is not False:
        raise PublicArtifactValidationError("question_pack.json must declare real_locus_rows_published=false")
    policy = payload.get("publication_policy") or {}
    required_false = [
        "raw_rows_included",
        "ordinance_text_included",
        "record_locator_values_included",
        "browser_llm_calls",
        "legal_findings",
    ]
    for key in required_false:
        if policy.get(key) is not False:
            raise PublicArtifactValidationError(f"question_pack.json publication_policy.{key} must be false")
    grok = payload.get("grok") or {}
    if grok.get("secret_env") != "GROK_API_KEY":
        raise PublicArtifactValidationError("question_pack.json must reference only the GROK_API_KEY secret name")
    if "api.x.ai" in json.dumps(payload):
        raise PublicArtifactValidationError("question_pack.json must not expose API endpoints")


def _validate_models_policy(payload: dict[str, Any]) -> None:
    grok = payload.get("grok") or {}
    forbidden_use = str(grok.get("forbidden_use") or "").lower()
    if "github pages javascript" not in forbidden_use:
        raise PublicArtifactValidationError("models.json must preserve the Grok Pages JavaScript prohibition")


def _validate_visual_smoke_policy(payload: dict[str, Any]) -> None:
    if payload.get("real_locus_rows_published") is not False:
        raise PublicArtifactValidationError("visual_smoke.json must declare real_locus_rows_published=false")
    if payload.get("workflow_file") != "pages-browser-smoke.yml":
        raise PublicArtifactValidationError("visual_smoke.json must reference the Pages browser-smoke workflow")
    if payload.get("status") not in {"success", "not_run"}:
        raise PublicArtifactValidationError("visual_smoke.json must record success or not_run route-smoke status")
    policy = payload.get("publication_policy") or {}
    required_false = [
        "raw_rows_included",
        "ordinance_text_included",
        "record_locator_values_included",
        "browser_llm_calls",
        "secrets_included",
        "legal_findings",
    ]
    for key in required_false:
        if policy.get(key) is not False:
            raise PublicArtifactValidationError(f"visual_smoke.json publication_policy.{key} must be false")
