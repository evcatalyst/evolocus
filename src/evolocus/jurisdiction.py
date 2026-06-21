"""Jurisdiction derivation from LOCUS raw metadata."""

from __future__ import annotations

import re
from typing import Any


CITY_TYPE_TOKENS = ("city", "cities", "municipal", "town", "village", "borough")
COUNTY_TYPE_TOKENS = ("county", "counties")


def clean_text(value: Any) -> str | None:
    if value is None:
        return None
    text = re.sub(r"\s+", " ", str(value)).strip()
    return text or None


def normalize_state(value: Any) -> str | None:
    text = clean_text(value)
    if not text:
        return None
    return text.upper() if len(text) == 2 and text.isalpha() else text.upper()


def normalize_jurisdiction_type(raw_type: Any, city: Any = None, county: Any = None) -> str:
    raw = (clean_text(raw_type) or "").lower()
    if any(token in raw for token in COUNTY_TYPE_TOKENS):
        return "county"
    if any(token in raw for token in CITY_TYPE_TOKENS):
        return "city"
    if clean_text(city):
        return "city"
    if clean_text(county):
        return "county"
    return "unknown"


def derive_jurisdiction_name(raw_type: Any, city: Any, county: Any) -> tuple[str | None, str]:
    normalized_type = normalize_jurisdiction_type(raw_type, city, county)
    city_text = clean_text(city)
    county_text = clean_text(county)
    if normalized_type == "county" and county_text:
        return county_text, "county"
    if normalized_type == "city" and city_text:
        return city_text, "city"
    if county_text:
        return county_text, "fallback_county"
    if city_text:
        return city_text, "fallback_city"
    return None, "missing"
