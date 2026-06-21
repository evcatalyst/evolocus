from __future__ import annotations

import json
from pathlib import Path

import pytest

from evolocus.locus_source import LocusCorpus
from evolocus.review_package import ReviewPackageError, materialize_review_package


def _write_request(path, *, unit_ids: list[str] | None = None) -> None:
    units = unit_ids or ["NY:city:Sample Valley", "PA:city:Example Township"]
    payload = {
        "schema_version": "evolocus-review-package-request-v1",
        "generated_at": "2026-06-21T00:00:00+00:00",
        "dataset_id": "LocalLaws/LOCUS-v1",
        "dataset_revision": "synthetic-demo",
        "analysis_status": {
            "dataset_id": "LocalLaws/LOCUS-v1",
            "dataset_revision": "synthetic-demo",
            "real_locus_rows_published": False,
        },
        "publication_policy": {
            "aggregate_unit_ids_only": True,
            "ordinance_text_included": False,
            "raw_rows_included": False,
            "source_locators_included": False,
            "legal_findings": False,
        },
        "materialization": {
            "seed_label": "pytest-package",
            "max_records": 10,
            "max_records_per_unit": 2,
            "default_output_omits_content": True,
        },
        "units": [{"rank": index + 1, "unit_id": unit_id} for index, unit_id in enumerate(units)],
    }
    path.write_text(json.dumps(payload), encoding="utf-8")


def test_materialize_review_package_defaults_to_no_text(tmp_path) -> None:
    request_path = tmp_path / "request.json"
    output_path = tmp_path / "package.json"
    _write_request(request_path)

    result = materialize_review_package(LocusCorpus.demo(), request_path, output_path)

    payload = json.loads(output_path.read_text(encoding="utf-8"))
    assert result["records"] == 2
    assert payload["schema_version"] == "evolocus-browser-review-package-v1"
    assert payload["browser_import_compatible"] is True
    assert payload["package_policy"]["ordinance_text_included"] is False
    assert payload["package_policy"]["github_pages_publication_allowed"] is False
    assert payload["records"]
    assert "source_locator" in payload["records"][0]
    assert "content" not in payload["records"][0]
    assert "header" not in payload["records"][0]


def test_materialize_review_package_can_include_content_explicitly(tmp_path) -> None:
    request_path = tmp_path / "request.json"
    output_path = tmp_path / "package-with-content.json"
    _write_request(request_path, unit_ids=["PA:city:Example Township"])

    materialize_review_package(LocusCorpus.demo(), request_path, output_path, include_content=True)

    payload = json.loads(output_path.read_text(encoding="utf-8"))
    assert payload["package_policy"]["ordinance_text_included"] is True
    assert payload["materialization"]["include_content"] is True
    assert len(payload["records"]) == 1
    assert "SYNTHETIC DEMONSTRATION DATA" in payload["records"][0]["content"]
    assert payload["records"][0]["header"]


def test_materialize_review_package_rejects_site_output(tmp_path) -> None:
    request_path = tmp_path / "request.json"
    _write_request(request_path)

    with pytest.raises(ReviewPackageError, match="must not be written under site"):
        materialize_review_package(LocusCorpus.demo(), request_path, Path("site/package.json"))


def test_materialize_review_package_rejects_unsafe_request_policy(tmp_path) -> None:
    request_path = tmp_path / "request.json"
    _write_request(request_path)
    payload = json.loads(request_path.read_text(encoding="utf-8"))
    payload["publication_policy"]["ordinance_text_included"] = True
    request_path.write_text(json.dumps(payload), encoding="utf-8")

    with pytest.raises(ReviewPackageError, match="must be aggregate-only"):
        materialize_review_package(LocusCorpus.demo(), request_path, tmp_path / "package.json")
