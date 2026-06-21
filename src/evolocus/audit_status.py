"""Publish aggregate-only audit status for the static Pages surface."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
import hashlib
import json
from pathlib import Path
from typing import Any


AUDIT_STATUS_SCHEMA_VERSION = "evolocus-audit-status-v1"
DEFAULT_AUDIT_PATH = Path("data/processed/locus-v1/main/audit/audit.json")
DEFAULT_MANIFEST_PATH = Path("data/processed/locus-v1/main/manifest.json")
DEFAULT_AUDIT_STATUS_PATH = Path("site/data/analysis/audit_status.json")


@dataclass(frozen=True)
class AuditStatusPublishResult:
    output_path: Path
    row_count: int
    full_scan_completed: bool
    schema_compatible: bool

    def to_dict(self) -> dict[str, Any]:
        return {
            "output": str(self.output_path),
            "row_count": self.row_count,
            "full_scan_completed": self.full_scan_completed,
            "schema_compatible": self.schema_compatible,
        }


def publish_audit_status(
    audit_path: Path = DEFAULT_AUDIT_PATH,
    manifest_path: Path = DEFAULT_MANIFEST_PATH,
    output_path: Path = DEFAULT_AUDIT_STATUS_PATH,
) -> AuditStatusPublishResult:
    """Write a public, aggregate-only audit status artifact.

    The source audit can include sampled finding paths and source locators in an
    ignored local directory. This publisher intentionally emits counts, rates,
    label sets, and gate statuses only.
    """

    audit = _read_json(audit_path)
    manifest = _read_json(manifest_path)
    payload = audit_status_payload(audit, manifest, audit_digest=_file_sha256(audit_path), manifest_digest=_file_sha256(manifest_path))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2, sort_keys=True, default=str) + "\n", encoding="utf-8")
    return AuditStatusPublishResult(
        output_path=output_path,
        row_count=int(payload["row_count"]),
        full_scan_completed=bool(payload["manifest"]["full_scan_completed"]),
        schema_compatible=bool(payload["schema"]["is_compatible"]),
    )


def audit_status_payload(
    audit: dict[str, Any],
    manifest: dict[str, Any],
    *,
    audit_digest: str | None = None,
    manifest_digest: str | None = None,
) -> dict[str, Any]:
    row_count = int(audit.get("row_count") or 0)
    expected_row_count = int(manifest.get("expected_row_count") or 0)
    schema = audit.get("schema") or {}
    unexpected_functions = list(audit.get("unexpected_function_values") or [])
    unexpected_topics = list(audit.get("unexpected_topic_values") or [])
    unexpected_states = list(audit.get("unexpected_state_formats") or [])
    ocr_counts = {str(key): int(value) for key, value in (audit.get("ocr_risk_counts") or {}).items()}
    duplicate_source_locators = int(audit.get("duplicate_source_locator_count") or 0)
    duplicate_content_hashes = int(audit.get("duplicate_content_hash_count") or 0)
    nonfinite_score_rows = int(audit.get("nonfinite_score_rows") or 0)
    invalid_jurisdiction_rows = int(audit.get("invalid_jurisdiction_identity_rows") or 0)
    payload = {
        "schema_version": AUDIT_STATUS_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "dataset_id": manifest.get("dataset_id"),
        "dataset_revision": manifest.get("dataset_revision"),
        "license": manifest.get("license"),
        "paper": manifest.get("paper"),
        "citation": manifest.get("citation"),
        "row_count": row_count,
        "expected_row_count": expected_row_count,
        "row_count_matches_expected": row_count == expected_row_count,
        "real_locus_rows_published": False,
        "publication_policy": {
            "artifact_kind": "aggregate_only_audit_status",
            "raw_rows_included": False,
            "ordinance_text_included": False,
            "headers_included": False,
            "record_locator_values_included": False,
            "sample_findings_included": False,
            "legal_findings": False,
        },
        "source_artifacts": {
            "audit_sha256": audit_digest,
            "manifest_sha256": manifest_digest,
            "source_file_count": len(manifest.get("source_files") or []),
            "source_file_total_bytes": sum(int(value) for value in (manifest.get("source_file_sizes") or {}).values()),
        },
        "manifest": {
            "created_at": manifest.get("created_at"),
            "normalization_version": manifest.get("normalization_version"),
            "code_commit": manifest.get("code_commit"),
            "full_scan_completed": bool(manifest.get("full_scan_completed")),
            "observed_row_count": manifest.get("observed_row_count"),
            "expected_row_count": manifest.get("expected_row_count"),
        },
        "schema": {
            "is_compatible": bool(schema.get("is_compatible")),
            "missing_columns": list(schema.get("missing_columns") or []),
            "extra_columns": list(schema.get("extra_columns") or []),
            "column_count": len(schema.get("columns") or []),
        },
        "labels": {
            "observed_function_values": list((audit.get("observed_label_values") or {}).get("function") or []),
            "observed_topic_values": list((audit.get("observed_label_values") or {}).get("topic") or []),
            "observed_jurisdiction_type_values": list(audit.get("observed_jurisdiction_type_values") or []),
            "unexpected_function_values": unexpected_functions,
            "unexpected_topic_values": unexpected_topics,
            "unexpected_state_formats": unexpected_states,
        },
        "quality_counts": {
            "ocr_risk_counts": ocr_counts,
            "ocr_risk_rates": _rates(ocr_counts, row_count),
            "nonfinite_score_rows": nonfinite_score_rows,
            "duplicate_record_locator_count": duplicate_source_locators,
            "duplicate_content_hash_count": duplicate_content_hashes,
            "invalid_jurisdiction_identity_rows": invalid_jurisdiction_rows,
        },
        "null_rates": _bounded_null_rates(audit.get("null_rates") or {}),
        "score_stats": audit.get("score_stats") or {},
        "topic_nullability_by_substantivity": audit.get("topic_nullability_by_substantivity") or [],
        "city_county_availability_by_jurisdiction_type": audit.get("city_county_availability_by_jurisdiction_type") or [],
        "quality_gates": _quality_gates(
            row_count=row_count,
            expected_row_count=expected_row_count,
            schema_compatible=bool(schema.get("is_compatible")),
            unexpected_functions=unexpected_functions,
            unexpected_topics=unexpected_topics,
            unexpected_states=unexpected_states,
            duplicate_source_locators=duplicate_source_locators,
            duplicate_content_hashes=duplicate_content_hashes,
            nonfinite_score_rows=nonfinite_score_rows,
            invalid_jurisdiction_rows=invalid_jurisdiction_rows,
            ocr_counts=ocr_counts,
        ),
        "limitations": [
            "Audit metrics are data-quality signals, not legal findings.",
            "OCR risk heuristics are approximate flags for review, not proof that text is wrong.",
            "Duplicate content hashes can reflect boilerplate, repeated code text, or OCR duplication and require review before interpretation.",
            "Score direction remains unverified; score statistics are neutral numeric summaries.",
        ],
    }
    _assert_public_payload_safe(payload)
    return payload


def _quality_gates(
    *,
    row_count: int,
    expected_row_count: int,
    schema_compatible: bool,
    unexpected_functions: list[Any],
    unexpected_topics: list[Any],
    unexpected_states: list[Any],
    duplicate_source_locators: int,
    duplicate_content_hashes: int,
    nonfinite_score_rows: int,
    invalid_jurisdiction_rows: int,
    ocr_counts: dict[str, int],
) -> list[dict[str, Any]]:
    high_or_medium_ocr = int(ocr_counts.get("high", 0)) + int(ocr_counts.get("medium", 0))
    return [
        _gate("full_scan", "Full LOCUS row audit completed", row_count == expected_row_count and row_count > 0),
        _gate("schema", "Released schema compatible", schema_compatible),
        _gate("function_labels", "No unexpected function labels observed", not unexpected_functions),
        _gate("topic_labels", "No unexpected topic labels observed", not unexpected_topics),
        _gate("state_formats", "No unexpected state formats observed", not unexpected_states),
        _gate("record_locators", "No duplicate record locators observed", duplicate_source_locators == 0),
        _gate("score_values", "No non-finite score rows observed", nonfinite_score_rows == 0),
        _gate("jurisdiction_identity", "All rows derive a jurisdiction identity", invalid_jurisdiction_rows == 0),
        {
            "id": "ocr_risk",
            "label": "OCR risk heuristics available",
            "status": "review_needed" if high_or_medium_ocr else "complete",
            "value": high_or_medium_ocr,
            "detail": "Medium/high OCR-risk rows are review-priority signals, not verified OCR defects.",
        },
        {
            "id": "duplicate_content",
            "label": "Duplicate content hashes reviewed",
            "status": "review_needed" if duplicate_content_hashes else "complete",
            "value": duplicate_content_hashes,
            "detail": "Duplicate content hashes remain aggregate review targets and are not public raw text.",
        },
    ]


def _gate(gate_id: str, label: str, passed: bool) -> dict[str, Any]:
    return {"id": gate_id, "label": label, "status": "complete" if passed else "review_needed"}


def _rates(counts: dict[str, int], total: int) -> dict[str, float]:
    if not total:
        return {key: 0.0 for key in counts}
    return {key: round(value / total, 6) for key, value in counts.items()}


def _bounded_null_rates(null_rates: dict[str, Any]) -> dict[str, float]:
    public_field_names = {
        "header": "section_heading_field",
        "content": "ordinance_text_field",
        "is_substantive": "model_substantivity_field",
        "function": "model_function_field",
        "topic": "model_topic_field",
        "source_jurisdiction_type": "source_jurisdiction_type_field",
        "state": "state_field",
        "city": "city_field",
        "county": "county_field",
        "enforcement_discretion": "enforcement_discretion_score_field",
        "opacity": "opacity_score_field",
        "paternalism": "paternalism_score_field",
        "problem_salience": "problem_salience_score_field",
    }
    return {
        public_name: round(float(null_rates.get(raw_name) or 0), 6)
        for raw_name, public_name in public_field_names.items()
    }


def _assert_public_payload_safe(payload: dict[str, Any]) -> None:
    serialized = json.dumps(payload, sort_keys=True, default=str)
    blocked = ["source_locator", '"content"', '"header"', "data/raw/", "data/processed/", ".parquet", ".sqlite", ".db"]
    hits = [value for value in blocked if value in serialized]
    if hits:
        raise ValueError(f"audit status payload contains blocked public values: {hits}")


def _read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()
