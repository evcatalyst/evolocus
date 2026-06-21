"""Generate a bounded official county geometry artifact for GitHub Pages."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
import json
import re
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.request import urlopen


COUNTY_GEOMETRY_SCHEMA_VERSION = "evolocus-county-geometry-v1"
TIGERWEB_COUNTIES_LAYER_URL = (
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/82"
)
TIGERWEB_QUERY_URL = f"{TIGERWEB_COUNTIES_LAYER_URL}/query"

STATE_FIPS = {
    "AL": "01",
    "AK": "02",
    "AZ": "04",
    "AR": "05",
    "CA": "06",
    "CO": "08",
    "CT": "09",
    "DE": "10",
    "DC": "11",
    "FL": "12",
    "GA": "13",
    "HI": "15",
    "ID": "16",
    "IL": "17",
    "IN": "18",
    "IA": "19",
    "KS": "20",
    "KY": "21",
    "LA": "22",
    "ME": "23",
    "MD": "24",
    "MA": "25",
    "MI": "26",
    "MN": "27",
    "MS": "28",
    "MO": "29",
    "MT": "30",
    "NE": "31",
    "NV": "32",
    "NH": "33",
    "NJ": "34",
    "NM": "35",
    "NY": "36",
    "NC": "37",
    "ND": "38",
    "OH": "39",
    "OK": "40",
    "OR": "41",
    "PA": "42",
    "RI": "44",
    "SC": "45",
    "SD": "46",
    "TN": "47",
    "TX": "48",
    "UT": "49",
    "VT": "50",
    "VA": "51",
    "WA": "53",
    "WV": "54",
    "WI": "55",
    "WY": "56",
}

NAME_OVERRIDES = {
    ("47", "metro_government_of_nashville_and_davidson"): "Davidson",
    ("18", "indianapolis_marion"): "Marion",
    ("20", "wyandotte_unified"): "Wyandotte",
    ("22", "saint_tammany"): "St. Tammany",
    ("13", "augusta_richmond"): "Richmond",
    ("13", "macon_bibb"): "Bibb",
    ("21", "louisville_jefferson"): "Jefferson",
    ("22", "saint_bernard"): "St. Bernard",
    ("04", "pimacounty"): "Pima",
    ("22", "lafayette_city_parish_consolidated"): "Lafayette",
    ("22", "lafourche"): "Lafourche",
    ("22", "baton_rouge_east_baton_rouge"): "East Baton Rouge",
    ("22", "saint_john_the_baptist"): "St. John the Baptist",
    ("22", "iberia"): "Iberia",
    ("18", "saint_joseph"): "St. Joseph",
    ("18", "lakecounty"): "Lake",
    ("22", "saint_landry"): "St. Landry",
    ("02", "city_borough_of_wrangell"): "Wrangell",
    ("22", "saint_martin"): "St. Martin",
}


@dataclass(frozen=True)
class CountyGeometryResult:
    output_path: Path
    matched_count: int
    unmatched_count: int
    feature_count: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "output_path": str(self.output_path),
            "matched_count": self.matched_count,
            "unmatched_count": self.unmatched_count,
            "feature_count": self.feature_count,
        }


def publish_county_geometry_artifact(
    map_layers_path: Path,
    output_path: Path,
    *,
    max_allowable_offset: float = 0.02,
    geometry_precision: int = 4,
) -> CountyGeometryResult:
    """Write Census TIGERweb county geometries matched to aggregate county units.

    The output contains only aggregate unit metadata and generalized county
    geometry. It does not include LOCUS rows, ordinance text, source locators,
    review events, or local file paths.
    """

    map_layers = json.loads(map_layers_path.read_text(encoding="utf-8"))
    county_units = [unit for unit in map_layers.get("units", []) if unit.get("kind") == "county"]
    attributes = _fetch_county_attributes()
    matches, unmatched = _match_county_units(county_units, attributes)
    geometries = _fetch_county_geometries(
        [match["geoid"] for match in matches],
        max_allowable_offset=max_allowable_offset,
        geometry_precision=geometry_precision,
    )
    geometry_by_geoid = {feature["properties"]["GEOID"]: feature for feature in geometries.get("features", [])}
    features = []
    for match in matches:
        geometry_feature = geometry_by_geoid.get(match["geoid"])
        if not geometry_feature:
            unmatched.append({**match["unit"], "match_status": "matched_without_geometry", "expected_geoid": match["geoid"]})
            continue
        unit = match["unit"]
        census = match["census"]
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "geoid": match["geoid"],
                    "state": unit.get("state"),
                    "unit_id": unit.get("unit_id"),
                    "unit_name": unit.get("name"),
                    "unit_kind": unit.get("kind"),
                    "census_name": census.get("NAME"),
                    "census_basename": census.get("BASENAME"),
                    "law_count": unit.get("law_count"),
                    "substantive_count": unit.get("substantive_count"),
                    "dominant_topic": unit.get("dominant_topic"),
                    "dominant_function": unit.get("dominant_function"),
                    "tier": unit.get("tier"),
                    "tier_label": unit.get("tier_label"),
                    "tier_color": unit.get("tier_color"),
                    "match_status": "machine_matched_pending_review",
                },
                "geometry": geometry_feature.get("geometry"),
            }
        )

    artifact = {
        "schema_version": COUNTY_GEOMETRY_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "source": {
            "name": "U.S. Census Bureau TIGERweb Current Counties layer",
            "layer_url": TIGERWEB_COUNTIES_LAYER_URL,
            "query_url": TIGERWEB_QUERY_URL,
            "layer_id": 82,
            "generalization": {
                "max_allowable_offset_degrees": max_allowable_offset,
                "geometry_precision": geometry_precision,
            },
        },
        "geometry_status": "official_census_county_geometry_machine_matched_pending_review",
        "match_method": "state_fips plus normalized county name, with explicit consolidated-government aliases",
        "notice": (
            "County polygons are official Census TIGERweb geometries matched to aggregate LOCUS county units. "
            "Matches are machine-generated and pending review. This layer is not a legal finding."
        ),
        "dataset_revision": map_layers.get("dataset_revision"),
        "synthetic": bool(map_layers.get("synthetic")),
        "real_locus_rows_published": False,
        "county_unit_count": len(county_units),
        "matched_count": len(features),
        "unmatched_count": len(unmatched),
        "feature_collection": {"type": "FeatureCollection", "features": features},
        "unmatched_units": [
            {
                "unit_id": unit.get("unit_id"),
                "state": unit.get("state"),
                "unit_name": unit.get("name"),
                "reason": unit.get("match_status", "no_census_county_match"),
            }
            for unit in unmatched
        ],
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(artifact, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return CountyGeometryResult(
        output_path=output_path,
        matched_count=len(features),
        unmatched_count=len(unmatched),
        feature_count=len(features),
    )


def _fetch_county_attributes() -> list[dict[str, Any]]:
    data = _fetch_json(
        TIGERWEB_QUERY_URL,
        {
            "where": "1=1",
            "outFields": "GEOID,STATE,COUNTY,NAME,BASENAME,INTPTLAT,INTPTLON",
            "returnGeometry": "false",
            "f": "json",
        },
    )
    return [feature["attributes"] for feature in data.get("features", [])]


def _fetch_county_geometries(
    geoids: list[str],
    *,
    max_allowable_offset: float,
    geometry_precision: int,
    batch_size: int = 40,
) -> dict[str, Any]:
    features: list[dict[str, Any]] = []
    for start in range(0, len(geoids), batch_size):
        batch = geoids[start : start + batch_size]
        if not batch:
            continue
        data = _fetch_json(
            TIGERWEB_QUERY_URL,
            {
                "where": "GEOID IN (" + ",".join(f"'{geoid}'" for geoid in batch) + ")",
                "outFields": "GEOID,STATE,COUNTY,NAME,BASENAME,INTPTLAT,INTPTLON",
                "returnGeometry": "true",
                "outSR": "4326",
                "f": "geojson",
                "geometryPrecision": str(geometry_precision),
                "maxAllowableOffset": str(max_allowable_offset),
            },
        )
        features.extend(data.get("features", []))
    return {"type": "FeatureCollection", "features": features}


def _fetch_json(url: str, params: dict[str, str]) -> dict[str, Any]:
    request_url = f"{url}?{urlencode(params)}"
    with urlopen(request_url, timeout=90) as response:
        return json.loads(response.read().decode("utf-8"))


def _match_county_units(
    county_units: list[dict[str, Any]],
    census_attributes: list[dict[str, Any]],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    index: dict[tuple[str, str], dict[str, Any]] = {}
    for attributes in census_attributes:
        state_fips = str(attributes.get("STATE") or "")
        for key in _county_keys(attributes.get("NAME"), attributes.get("BASENAME")):
            index[(state_fips, key)] = attributes

    matches: list[dict[str, Any]] = []
    unmatched: list[dict[str, Any]] = []
    for unit in county_units:
        state_fips = STATE_FIPS.get(str(unit.get("state") or "").upper())
        unit_key = normalize_county_name(unit.get("county") or unit.get("name"))
        if not state_fips:
            unmatched.append({**unit, "match_status": "missing_state_fips"})
            continue
        alias = NAME_OVERRIDES.get((state_fips, unit_key))
        keys = [normalize_county_name(alias), unit_key, _compact_key(unit_key)]
        census = next((index.get((state_fips, key)) for key in keys if key), None)
        if not census:
            unmatched.append({**unit, "match_status": "no_census_county_match"})
            continue
        matches.append({"unit": unit, "census": census, "geoid": census["GEOID"]})
    return matches, unmatched


def _county_keys(name: Any, basename: Any) -> set[str]:
    keys = {normalize_county_name(name), normalize_county_name(basename)}
    keys.update({_compact_key(key) for key in keys if key})
    return {key for key in keys if key}


def normalize_county_name(value: Any) -> str:
    text = str(value or "").lower().replace("&", " and ")
    text = text.replace("st.", "saint")
    text = re.sub(r"[^a-z0-9]+", "_", text).strip("_")
    text = re.sub(r"county_+", "", text)
    text = re.sub(r"_+", "_", text).strip("_")
    suffixes = (
        "_county",
        "_parish",
        "_borough",
        "_municipality",
        "_census_area",
        "_city_and_borough",
        "_city",
        "_council",
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
    return text.strip("_")


def _compact_key(value: Any) -> str:
    return str(value or "").replace("_", "")
