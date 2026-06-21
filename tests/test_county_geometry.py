from __future__ import annotations

from evolocus.county_geometry import _match_county_units, normalize_county_name


def test_county_name_normalization_handles_consolidated_governments() -> None:
    assert normalize_county_name("Wyandotte County - Unified Government") == "wyandotte_unified"
    assert normalize_county_name("Saint Bernard Parish Council") == "saint_bernard"
    assert normalize_county_name("LakeCounty") == "lakecounty"


def test_county_matcher_uses_state_and_aliases_without_geography_fabrication() -> None:
    units = [
        {
            "unit_id": "TN:county:metro_government_of_nashville_and_davidson_county",
            "state": "TN",
            "county": "metro_government_of_nashville_and_davidson_county",
            "kind": "county",
        },
        {"unit_id": "ZZ:county:missing", "state": "ZZ", "county": "missing", "kind": "county"},
    ]
    census = [
        {"GEOID": "47037", "STATE": "47", "COUNTY": "037", "NAME": "Davidson County", "BASENAME": "Davidson"},
    ]
    matches, unmatched = _match_county_units(units, census)
    assert matches[0]["geoid"] == "47037"
    assert matches[0]["unit"]["unit_id"] == units[0]["unit_id"]
    assert unmatched[0]["match_status"] == "missing_state_fips"
