from __future__ import annotations

from pathlib import Path
from contextlib import redirect_stdout
import io
import sys


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from evolocus.locus_ingest import (  # noqa: E402
    LocusDownloadBlocked,
    build_master_jurisdictions,
    infer_vendor,
    load_locus_from_huggingface,
    stable_jurisdiction_id,
)
from evolocus.cli import main  # noqa: E402


def synthetic_locus_records() -> list[dict[str, object]]:
    return [
        {
            "jurisdiction": "Sample Valley",
            "state": "ny",
            "jurisdiction_type": "city",
            "vendor": "eCode360",
            "topic": "zoning",
            "function": "land use",
            "is_substantive": True,
            "opacity_score": 0.40,
            "paternalism_score": 0.20,
            "enforcement_discretion_score": 0.50,
            "problem_salience_score": 0.70,
            "last_scrape": "2026-01-01",
            "content": "Synthetic ordinance chunk for tests only.",
        },
        {
            "jurisdiction": "Sample Valley",
            "state": "NY",
            "jurisdiction_type": "municipality",
            "source_url": "https://ecode360.example.invalid/sample-valley",
            "topic": "housing",
            "is_substantive": "true",
            "opacity_score": 0.60,
            "paternalism_score": 0.40,
            "enforcement_discretion_score": 0.30,
            "problem_salience_score": 0.50,
            "last_scrape": "2026-02-01",
        },
        {
            "jurisdiction": "Example County",
            "state": "PA",
            "county": "Example County",
            "source_url": "https://county.example.gov/code",
            "topic": "environment",
            "is_substantive": False,
            "problem_salience": "0.25",
        },
    ]


def test_build_master_jurisdictions_groups_synthetic_locus_records() -> None:
    rows = build_master_jurisdictions(synthetic_locus_records())
    assert [row.name for row in rows] == ["Sample Valley", "Example County"]

    sample = rows[0]
    assert sample.fips is None
    assert sample.state == "NY"
    assert sample.type == "city"
    assert sample.vendor == "ecode360"
    assert sample.status == "needs_geocoding"
    assert sample.review_state == "needs_geocoding"
    assert sample.locus_chunk_count == 2
    assert sample.substantive_chunk_count == 2
    assert sample.avg_opacity == 0.5
    assert sample.avg_paternalism == 0.3
    assert sample.last_scrape == "2026-02-01"
    assert set(sample.tags) == {"housing", "land_use", "zoning"}
    assert 0 <= sample.next_priority_score <= 100


def test_county_vendor_and_tags_are_inferred_without_claims() -> None:
    row = build_master_jurisdictions(synthetic_locus_records())[1]
    assert row.name == "Example County"
    assert row.state == "PA"
    assert row.type == "county"
    assert row.vendor == "self"
    assert row.tags == ("environment",)
    assert row.source == "locus-v1"


def test_download_is_blocked_unless_explicitly_allowed() -> None:
    try:
        load_locus_from_huggingface()
    except LocusDownloadBlocked as exc:
        assert "download blocked" in str(exc).lower()
    else:
        raise AssertionError("LOCUS download should be blocked by default.")


def test_vendor_inference_prefers_known_bulk_sources() -> None:
    assert infer_vendor({"source_url": "https://library.municode.com/ny/sample"}) == "municode"
    assert infer_vendor({"source_url": "https://codelibrary.amlegal.com/codes/sample"}) == "amlegal"
    assert infer_vendor({"source_url": "https://example.gov/code"}) == "self"


def test_stable_jurisdiction_id_is_deterministic() -> None:
    first = stable_jurisdiction_id("NY", "Sample Valley", "city")
    second = stable_jurisdiction_id("NY", "Sample Valley", "city")
    assert first == second
    assert first.startswith("ny-sample_valley-city-")


def test_update_cycle_stub_is_dry_run() -> None:
    output = io.StringIO()
    with redirect_stdout(output):
        assert main(["update-cycle"]) == 0
    text = output.getvalue()
    assert '"mode": "dry_run"' in text
    assert '"downloads_allowed": false' in text
    assert '"scrapers_allowed": false' in text
