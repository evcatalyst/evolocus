from __future__ import annotations

from evolocus.municipal_points import _match_municipal_units, _municipal_keys, normalize_municipal_name


def test_municipal_name_normalization_preserves_city_when_part_of_name() -> None:
    assert "canon_city" in _municipal_keys("Cañon City", "Cañon City")
    assert "johnston_city" in _municipal_keys("Johnston City", "Johnston City")
    assert normalize_municipal_name("City of Ogden") == "ogden"


def test_municipal_matcher_uses_places_then_unique_subdivisions() -> None:
    units = [
        {"unit_id": "CA:city:san_jose", "state": "CA", "city": "san_jose", "name": "san_jose", "kind": "city"},
        {"unit_id": "MI:city:dorr_township", "state": "MI", "city": "dorr_township", "name": "dorr_township", "kind": "city"},
        {"unit_id": "OH:city:union", "state": "OH", "city": "union", "name": "union", "kind": "city"},
    ]
    place_index = {
        ("06", "san_jose"): {"GEOID": "0668000", "STATE": "06", "NAME": "San Jose city", "BASENAME": "San Jose"},
    }
    subdivision_index = {
        ("26", "dorr"): {"GEOID": "2600522600", "STATE": "26", "NAME": "Dorr township", "BASENAME": "Dorr"},
        ("39", "union"): None,
    }
    matches, unmatched = _match_municipal_units(units, place_index, subdivision_index)
    assert [match["geoid"] for match in matches] == ["0668000", "2600522600"]
    assert matches[0]["match_source"] == "incorporated_place"
    assert matches[1]["match_source"] == "county_subdivision"
    assert unmatched[0]["unit_id"] == "OH:city:union"
    assert unmatched[0]["match_status"] == "no_unique_census_municipal_match"
