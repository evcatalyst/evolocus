"""Generate bounded municipal point artifacts for GitHub Pages."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
import json
import re
import unicodedata
from pathlib import Path
from typing import Any

from .county_geometry import STATE_FIPS, _fetch_json


MUNICIPAL_POINTS_SCHEMA_VERSION = "evolocus-municipal-points-v1"
TIGERWEB_BASE_URL = "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer"
INCORPORATED_PLACES_LAYER_ID = 28
COUNTY_SUBDIVISIONS_LAYER_ID = 22

LAYER_DEFINITIONS = {
    "incorporated_place": {
        "layer_id": INCORPORATED_PLACES_LAYER_ID,
        "name": "U.S. Census Bureau TIGERweb Current Incorporated Places layer",
        "code_field": "PLACE",
        "out_fields": "GEOID,STATE,PLACE,NAME,BASENAME,INTPTLAT,INTPTLON,CENTLAT,CENTLON",
    },
    "county_subdivision": {
        "layer_id": COUNTY_SUBDIVISIONS_LAYER_ID,
        "name": "U.S. Census Bureau TIGERweb Current County Subdivisions layer",
        "code_field": "COUSUB",
        "out_fields": "GEOID,STATE,COUNTY,COUSUB,NAME,BASENAME,INTPTLAT,INTPTLON,CENTLAT,CENTLON",
    },
}

NAME_OVERRIDES = {
    ("21", "lexingtonfayetteco"): "Lexington-Fayette",
    ("49", "ogdencity"): "Ogden",
}


@dataclass(frozen=True)
class MunicipalPointsResult:
    output_path: Path
    matched_count: int
    unmatched_count: int
    point_count: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "output_path": str(self.output_path),
            "matched_count": self.matched_count,
            "unmatched_count": self.unmatched_count,
            "point_count": self.point_count,
        }


def publish_municipal_points_artifact(map_layers_path: Path, output_path: Path) -> MunicipalPointsResult:
    """Write Census TIGERweb points matched to aggregate municipal units."""

    map_layers = json.loads(map_layers_path.read_text(encoding="utf-8"))
    municipal_units = [unit for unit in map_layers.get("units", []) if unit.get("kind") == "city"]
    place_index = _build_unique_index(_fetch_layer_attributes("incorporated_place"))
    subdivision_index = _build_unique_index(_fetch_layer_attributes("county_subdivision"))
    matches, unmatched = _match_municipal_units(municipal_units, place_index, subdivision_index)
    points = [_point_from_match(match) for match in matches]
    artifact = {
        "schema_version": MUNICIPAL_POINTS_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "source": {
            "layers": [
                {
                    "id": key,
                    "name": definition["name"],
                    "layer_id": definition["layer_id"],
                    "layer_url": f"{TIGERWEB_BASE_URL}/{definition['layer_id']}",
                    "query_url": f"{TIGERWEB_BASE_URL}/{definition['layer_id']}/query",
                }
                for key, definition in LAYER_DEFINITIONS.items()
            ],
            "coordinate_fields": ["INTPTLAT", "INTPTLON", "CENTLAT", "CENTLON"],
        },
        "geometry_status": "official_census_municipal_points_machine_matched_pending_review",
        "match_method": "state_fips plus normalized municipal name; county subdivisions used only for unique state/name matches",
        "notice": (
            "Municipal points use official Census TIGERweb place or county-subdivision internal points matched "
            "to aggregate LOCUS municipal units. Matches are machine-generated and pending review."
        ),
        "dataset_revision": map_layers.get("dataset_revision"),
        "synthetic": bool(map_layers.get("synthetic")),
        "real_locus_rows_published": False,
        "municipal_unit_count": len(municipal_units),
        "matched_count": len(points),
        "unmatched_count": len(unmatched),
        "points": points,
        "unmatched_units": [
            {
                "unit_id": unit.get("unit_id"),
                "state": unit.get("state"),
                "unit_name": unit.get("name"),
                "reason": unit.get("match_status", "no_census_municipal_match"),
            }
            for unit in unmatched[:250]
        ],
        "unmatched_units_truncated": max(0, len(unmatched) - 250),
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(artifact, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return MunicipalPointsResult(
        output_path=output_path,
        matched_count=len(points),
        unmatched_count=len(unmatched),
        point_count=len(points),
    )


def _fetch_layer_attributes(layer_key: str) -> list[dict[str, Any]]:
    definition = LAYER_DEFINITIONS[layer_key]
    data = _fetch_json(
        f"{TIGERWEB_BASE_URL}/{definition['layer_id']}/query",
        {
            "where": "1=1",
            "outFields": definition["out_fields"],
            "returnGeometry": "false",
            "f": "json",
        },
    )
    return [
        {
            **feature["attributes"],
            "_layer_key": layer_key,
            "_layer_name": definition["name"],
            "_layer_id": definition["layer_id"],
        }
        for feature in data.get("features", [])
    ]


def _build_unique_index(attributes: list[dict[str, Any]]) -> dict[tuple[str, str], dict[str, Any] | None]:
    index: dict[tuple[str, str], dict[str, Any] | None] = {}
    for row in attributes:
        state_fips = str(row.get("STATE") or "")
        for key in _municipal_keys(row.get("NAME"), row.get("BASENAME")):
            index_key = (state_fips, key)
            if index_key in index:
                index[index_key] = None
            else:
                index[index_key] = row
    return index


def _match_municipal_units(
    municipal_units: list[dict[str, Any]],
    place_index: dict[tuple[str, str], dict[str, Any] | None],
    subdivision_index: dict[tuple[str, str], dict[str, Any] | None],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    matches: list[dict[str, Any]] = []
    unmatched: list[dict[str, Any]] = []
    for unit in municipal_units:
        state_fips = STATE_FIPS.get(str(unit.get("state") or "").upper())
        unit_key = normalize_municipal_name(unit.get("city") or unit.get("name"))
        if not state_fips:
            unmatched.append({**unit, "match_status": "missing_state_fips"})
            continue
        alias = NAME_OVERRIDES.get((state_fips, unit_key))
        keys = list(_municipal_keys(alias, unit.get("city") or unit.get("name"))) if alias else list(_municipal_keys(unit.get("city") or unit.get("name"), unit.get("name")))
        match = _first_unique_match(state_fips, keys, place_index)
        match_source = "incorporated_place"
        if not match:
            match = _first_unique_match(state_fips, keys, subdivision_index)
            match_source = "county_subdivision"
        if not match:
            unmatched.append({**unit, "match_status": "no_unique_census_municipal_match"})
            continue
        matches.append({"unit": unit, "census": match, "geoid": match["GEOID"], "match_source": match_source})
    return matches, unmatched


def _first_unique_match(
    state_fips: str,
    keys: list[str],
    index: dict[tuple[str, str], dict[str, Any] | None],
) -> dict[str, Any] | None:
    for key in keys:
        if not key:
            continue
        row = index.get((state_fips, key))
        if row:
            return row
    return None


def _point_from_match(match: dict[str, Any]) -> dict[str, Any]:
    unit = match["unit"]
    census = match["census"]
    lat = _coordinate(census, "INTPTLAT", "CENTLAT")
    lon = _coordinate(census, "INTPTLON", "CENTLON")
    return {
        "geoid": match["geoid"],
        "state": unit.get("state"),
        "unit_id": unit.get("unit_id"),
        "unit_name": unit.get("name"),
        "unit_kind": unit.get("kind"),
        "census_name": census.get("NAME"),
        "census_basename": census.get("BASENAME"),
        "census_layer": match["match_source"],
        "census_layer_id": census.get("_layer_id"),
        "lat": lat,
        "lon": lon,
        "law_count": unit.get("law_count"),
        "substantive_count": unit.get("substantive_count"),
        "dominant_topic": unit.get("dominant_topic"),
        "dominant_function": unit.get("dominant_function"),
        "tier": unit.get("tier"),
        "tier_label": unit.get("tier_label"),
        "tier_color": unit.get("tier_color"),
        "match_status": "machine_matched_pending_review",
    }


def _coordinate(row: dict[str, Any], primary: str, fallback: str) -> float | None:
    value = row.get(primary) if row.get(primary) not in (None, "") else row.get(fallback)
    try:
        return round(float(value), 6)
    except (TypeError, ValueError):
        return None


def _municipal_keys(name: Any, basename: Any) -> set[str]:
    keys = {
        _basic_municipal_key(name),
        _basic_municipal_key(basename),
        normalize_municipal_name(name),
        normalize_municipal_name(basename),
    }
    keys.update({_compact_key(key) for key in keys if key})
    return {key for key in keys if key}


def normalize_municipal_name(value: Any) -> str:
    text = _basic_municipal_key(value)
    if not text:
        return ""
    text = text.replace("&", " and ")
    text = re.sub(r"_+", "_", text).strip("_")
    text = text.replace("st.", "saint")
    text = re.sub(r"[^a-z0-9]+", "_", text).strip("_")
    prefixes = (
        "city_of_",
        "town_of_",
        "village_of_",
        "borough_of_",
        "municipality_of_",
        "township_of_",
        "the_city_of_",
        "the_town_of_",
    )
    for prefix in prefixes:
        if text.startswith(prefix):
            text = text[len(prefix) :]
            break
    suffixes = (
        "_city",
        "_town",
        "_village",
        "_borough",
        "_municipality",
        "_township",
        "_twp",
        "_corporation",
        "_government",
    )
    changed = True
    while changed:
        changed = False
        for suffix in suffixes:
            if text.endswith(suffix):
                text = text[: -len(suffix)].strip("_")
                changed = True
                break
    return re.sub(r"_+", "_", text).strip("_")


def _basic_municipal_key(value: Any) -> str:
    text = unicodedata.normalize("NFKD", str(value or ""))
    text = "".join(char for char in text if not unicodedata.combining(char))
    text = text.lower().replace("&", " and ")
    text = text.replace("st.", "saint")
    return re.sub(r"[^a-z0-9]+", "_", text).strip("_")


def _compact_key(value: Any) -> str:
    return str(value or "").replace("_", "")
