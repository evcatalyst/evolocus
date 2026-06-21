from __future__ import annotations

from evolocus.jurisdiction import derive_jurisdiction_name, normalize_jurisdiction_type
from evolocus.locus_ingest import build_master_jurisdictions


def test_jurisdiction_derives_from_published_locus_fields() -> None:
    name, source = derive_jurisdiction_name("cities", "Sample Valley", None)
    assert name == "Sample Valley"
    assert source == "city"
    assert normalize_jurisdiction_type("counties", None, "Demo County") == "county"


def test_master_builder_accepts_published_schema_without_generic_name() -> None:
    rows = build_master_jurisdictions(
        [
            {
                "state": "ny",
                "city": "Sample Valley",
                "county": None,
                "source_jurisdiction_type": "cities",
                "is_substantive": True,
                "topic": "Zoning",
                "function": "Rules",
                "content": "Synthetic only",
            }
        ]
    )
    assert rows[0].name == "Sample Valley"
    assert rows[0].type == "city"
