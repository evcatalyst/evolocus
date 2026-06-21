from __future__ import annotations

import json

import pytest

from evolocus.audit_status import audit_status_payload


def test_audit_status_payload_is_aggregate_only() -> None:
    audit = {
        "row_count": 10,
        "schema": {"is_compatible": True, "columns": ["header", "content"], "missing_columns": [], "extra_columns": []},
        "unexpected_function_values": [],
        "unexpected_topic_values": [],
        "unexpected_state_formats": [],
        "observed_label_values": {"function": ["Rules"], "topic": ["Zoning"]},
        "observed_jurisdiction_type_values": ["cities"],
        "ocr_risk_counts": {"low": 8, "medium": 1, "high": 1},
        "duplicate_source_locator_count": 0,
        "duplicate_content_hash_count": 2,
        "nonfinite_score_rows": 0,
        "invalid_jurisdiction_identity_rows": 0,
        "null_rates": {"header": 0.0, "content": 0.0, "topic": 0.2},
        "score_stats": {},
    }
    manifest = {
        "dataset_id": "LocalLaws/LOCUS-v1",
        "dataset_revision": "test",
        "license": "CC-BY-NC-4.0",
        "paper": "https://arxiv.org/abs/2606.19334",
        "citation": "Peskoff, Barrow, Vu, and Davenport. LOCUS.",
        "expected_row_count": 10,
        "observed_row_count": 10,
        "full_scan_completed": True,
        "source_files": ["ignored/raw.parquet"],
        "source_file_sizes": {"ignored/raw.parquet": 123},
    }
    payload = audit_status_payload(audit, manifest, audit_digest="a" * 64, manifest_digest="b" * 64)
    serialized = json.dumps(payload)
    assert payload["row_count_matches_expected"] is True
    assert payload["publication_policy"]["raw_rows_included"] is False
    assert payload["quality_counts"]["duplicate_record_locator_count"] == 0
    assert payload["null_rates"]["section_heading_field"] == 0.0
    assert "source_locator" not in serialized
    assert '"content"' not in serialized
    assert '"header"' not in serialized
    assert ".parquet" not in serialized


def test_audit_status_payload_rejects_public_source_locator_strings() -> None:
    audit = {"row_count": 1, "schema": {"is_compatible": True, "columns": []}, "observed_label_values": {}}
    manifest = {"dataset_id": "source_locator leak", "expected_row_count": 1, "source_files": [], "source_file_sizes": {}}
    with pytest.raises(ValueError, match="blocked public values"):
        audit_status_payload(audit, manifest)
