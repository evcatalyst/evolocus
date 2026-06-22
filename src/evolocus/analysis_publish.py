"""Publish bounded analysis artifacts for the GitHub Pages workbench."""

from __future__ import annotations

from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import UTC, datetime
import json
import math
from pathlib import Path
from typing import Any

import polars as pl

from .locus_contract import CITATION, DATASET_ID, DATASET_LICENSE, PAPER_URL, SCORE_FIELDS
from .locus_normalize import jurisdiction_name_expr, jurisdiction_type_expr
from .locus_source import LocusCorpus, current_commit


ANALYSIS_SCHEMA_VERSION = "evolocus-static-analysis-v1"
MODEL_REGISTRY_VERSION = "evolocus-model-registry-v1"
VISUAL_SMOKE_SCHEMA_VERSION = "evolocus-visual-route-smoke-v1"
DEFAULT_OUTPUT_DIR = Path("site/data/analysis")
MAP_VIEW_BOX = "0 0 100 86"

STATE_TILE_COORDS = {
    "AK": (0, 6),
    "AL": (8, 4),
    "AR": (6, 3),
    "AZ": (2, 3),
    "CA": (1, 2),
    "CO": (4, 2),
    "CT": (13, 2),
    "DC": (11, 3),
    "DE": (11, 3),
    "FL": (9, 5),
    "GA": (9, 4),
    "HI": (1, 7),
    "IA": (6, 1),
    "ID": (2, 1),
    "IL": (7, 1),
    "IN": (8, 1),
    "KS": (5, 2),
    "KY": (8, 2),
    "LA": (6, 4),
    "MA": (13, 1),
    "MD": (10, 3),
    "ME": (14, 0),
    "MI": (7, 0),
    "MN": (5, 0),
    "MO": (6, 2),
    "MS": (7, 4),
    "MT": (3, 0),
    "NC": (10, 3),
    "ND": (4, 0),
    "NE": (5, 1),
    "NH": (13, 0),
    "NJ": (11, 2),
    "NM": (4, 3),
    "NV": (2, 2),
    "NY": (11, 0),
    "OH": (9, 1),
    "OK": (5, 3),
    "OR": (1, 1),
    "PA": (10, 1),
    "RI": (14, 2),
    "SC": (10, 4),
    "SD": (4, 1),
    "TN": (8, 3),
    "TX": (5, 4),
    "UT": (3, 2),
    "VA": (10, 2),
    "VT": (12, 0),
    "WA": (1, 0),
    "WI": (6, 0),
    "WV": (9, 2),
    "WY": (3, 1),
}

TIER_DEFINITIONS = {
    "no_data": {
        "label": "No publishable data",
        "color": "#d8dee8",
        "description": "No law records are available for this unit in the published analysis artifact.",
    },
    "tier_1": {
        "label": "Tier 1",
        "color": "#b8d8c7",
        "description": "Lower relative neutral model-score band or sparse law signal.",
    },
    "tier_2": {
        "label": "Tier 2",
        "color": "#e0c070",
        "description": "Middle relative neutral model-score band.",
    },
    "tier_3": {
        "label": "Tier 3",
        "color": "#c46b53",
        "description": "Higher relative neutral model-score band. This is not a legal ranking.",
    },
}

MODEL_REGISTRY = [
    {
        "id": "locus_is_substantive",
        "display_name": "LOCUS substantivity classifier output",
        "output_field": "is_substantive",
        "task": "binary classification",
        "status": "released_column",
        "source": DATASET_ID,
    },
    {
        "id": "locus_function",
        "display_name": "LOCUS function classifier output",
        "output_field": "function",
        "task": "multiclass classification",
        "status": "released_column",
        "source": DATASET_ID,
    },
    {
        "id": "locus_topic",
        "display_name": "LOCUS topic classifier output",
        "output_field": "topic",
        "task": "multiclass classification",
        "status": "released_column",
        "source": DATASET_ID,
    },
    *[
        {
            "id": f"locus_{field}",
            "display_name": f"LOCUS {field.replace('_', ' ')} scorer output",
            "output_field": field,
            "task": "continuous model score",
            "status": "released_column",
            "source": DATASET_ID,
            "direction_verified": False,
        }
        for field in SCORE_FIELDS
    ],
]


@dataclass(frozen=True)
class AnalysisPublishResult:
    output_dir: Path
    files: dict[str, Path]
    unit_count: int
    law_count: int
    synthetic: bool

    def to_dict(self) -> dict[str, Any]:
        return {
            "output_dir": str(self.output_dir),
            "files": {key: str(path) for key, path in self.files.items()},
            "unit_count": self.unit_count,
            "law_count": self.law_count,
            "synthetic": self.synthetic,
        }


def publish_analysis_artifacts(
    corpus: LocusCorpus,
    output_dir: Path = DEFAULT_OUTPUT_DIR,
    *,
    max_units: int = 250,
    include_record_samples: bool | None = None,
) -> AnalysisPublishResult:
    """Write bounded static analysis artifacts for the Pages app."""

    synthetic = corpus.config.mode == "demo"
    include_samples = synthetic if include_record_samples is None else include_record_samples
    if include_samples and not synthetic:
        raise ValueError("Publishing record samples from non-demo data is blocked by default.")

    output_dir.mkdir(parents=True, exist_ok=True)
    rows = _collect_aggregate_rows(corpus, max_units=max_units)
    samples = _collect_samples(corpus, rows, include_samples=include_samples)
    tier_thresholds = _tier_thresholds(rows)
    state_ordinals = _state_ordinals(rows)
    units = [
        _unit_from_row(
            index,
            row,
            samples.get(row["unit_id"], []),
            tier_thresholds=tier_thresholds,
            state_position=state_ordinals[row["unit_id"]],
        )
        for index, row in enumerate(rows)
    ]
    ontology = _ontology_artifact(units)
    status = _status_artifact(corpus, units, synthetic=synthetic)
    charts = _charts_artifact(units, synthetic=synthetic)
    chat_index = _chat_index_artifact(units, ontology, status)
    models = _models_artifact()
    map_layers = _map_layers_artifact(corpus, units, synthetic=synthetic)
    visual_smoke = _visual_smoke_artifact(corpus)

    files = {
        "status": output_dir / "status.json",
        "map_layers": output_dir / "map_layers.json",
        "ontology": output_dir / "ontology.json",
        "chat_index": output_dir / "chat_index.json",
        "models": output_dir / "models.json",
        "charts": output_dir / "charts.json",
        "visual_smoke": output_dir / "visual_smoke.json",
    }
    payloads = {
        "status": status,
        "map_layers": map_layers,
        "ontology": ontology,
        "chat_index": chat_index,
        "models": models,
        "charts": charts,
        "visual_smoke": visual_smoke,
    }
    for key, payload in payloads.items():
        files[key].write_text(json.dumps(payload, indent=2, sort_keys=True, default=str) + "\n", encoding="utf-8")
    return AnalysisPublishResult(
        output_dir=output_dir,
        files=files,
        unit_count=len(units),
        law_count=sum(unit["law_count"] for unit in units),
        synthetic=synthetic,
    )


def _collect_aggregate_rows(corpus: LocusCorpus, *, max_units: int) -> list[dict[str, Any]]:
    lf = _aggregate_lazy(corpus)
    unit_expr = (
        pl.col("state_normalized")
        + pl.lit(":")
        + pl.col("jurisdiction_type_normalized").fill_null("unknown")
        + pl.lit(":")
        + pl.col("jurisdiction_name").fill_null("Unknown")
    )
    score_exprs = [
        pl.col(field).filter(pl.col(field).is_finite()).mean().alias(f"{field}_mean")
        for field in SCORE_FIELDS
    ]
    rows = (
        lf.with_columns(unit_expr.alias("unit_id"))
        .group_by(
            [
                "unit_id",
                "state_normalized",
                "jurisdiction_name",
                "jurisdiction_type_normalized",
                "city_normalized",
                "county_normalized",
            ]
        )
        .agg(
            [
                pl.len().alias("law_count"),
                pl.col("is_substantive").sum().alias("substantive_count"),
                pl.col("topic").drop_nulls().mode().first().alias("dominant_topic"),
                pl.col("function").drop_nulls().mode().first().alias("dominant_function"),
                pl.col("ocr_risk_level").drop_nulls().mode().first().alias("ocr_risk_level"),
                *score_exprs,
            ]
        )
        .sort(["law_count", "unit_id"], descending=[True, False])
        .limit(max_units)
        .collect()
        .to_dicts()
    )
    topic_counts = _topic_counts(corpus, {row["unit_id"] for row in rows})
    function_counts = _function_counts(corpus, {row["unit_id"] for row in rows})
    for row in rows:
        row["topic_counts"] = topic_counts.get(row["unit_id"], {})
        row["function_counts"] = function_counts.get(row["unit_id"], {})
    return rows


def _topic_counts(corpus: LocusCorpus, unit_ids: set[str]) -> dict[str, dict[str, int]]:
    return _value_counts_by_unit(corpus, unit_ids, "topic")


def _function_counts(corpus: LocusCorpus, unit_ids: set[str]) -> dict[str, dict[str, int]]:
    return _value_counts_by_unit(corpus, unit_ids, "function")


def _value_counts_by_unit(corpus: LocusCorpus, unit_ids: set[str], field: str) -> dict[str, dict[str, int]]:
    lf = _aggregate_lazy(corpus)
    unit_expr = (
        pl.col("state_normalized")
        + pl.lit(":")
        + pl.col("jurisdiction_type_normalized").fill_null("unknown")
        + pl.lit(":")
        + pl.col("jurisdiction_name").fill_null("Unknown")
    )
    rows = (
        lf.with_columns(unit_expr.alias("unit_id"))
        .filter(pl.col("unit_id").is_in(list(unit_ids)))
        .group_by(["unit_id", field])
        .agg(pl.len().alias("n"))
        .collect()
        .to_dicts()
    )
    counts: dict[str, dict[str, int]] = defaultdict(dict)
    for row in rows:
        value = row[field] if row[field] is not None else "Not_applicable"
        counts[row["unit_id"]][str(value)] = int(row["n"])
    return dict(counts)


def _aggregate_lazy(corpus: LocusCorpus) -> pl.LazyFrame:
    """Return derived aggregate fields without scanning ordinance text content."""

    return corpus.lazy().with_columns(
        [
            jurisdiction_name_expr().alias("jurisdiction_name"),
            jurisdiction_type_expr().alias("jurisdiction_type_normalized"),
            pl.col("state").cast(pl.Utf8).str.strip_chars().str.to_uppercase().alias("state_normalized"),
            pl.col("city").cast(pl.Utf8).str.strip_chars().alias("city_normalized"),
            pl.col("county").cast(pl.Utf8).str.strip_chars().alias("county_normalized"),
            pl.lit("not_evaluated_for_aggregate").alias("ocr_risk_level"),
        ]
    )


def _collect_samples(
    corpus: LocusCorpus,
    rows: list[dict[str, Any]],
    *,
    include_samples: bool,
) -> dict[str, list[dict[str, Any]]]:
    if not include_samples:
        return {}
    records = corpus.page(limit=500)
    wanted = {row["unit_id"] for row in rows}
    samples: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        unit_id = f"{record.get('state_normalized') or record.get('state')}:{record.get('jurisdiction_type_normalized') or 'unknown'}:{record.get('jurisdiction_name') or 'Unknown'}"
        if unit_id not in wanted or len(samples[unit_id]) >= 3:
            continue
        samples[unit_id].append(
            {
                "record_id": record.get("record_id"),
                "source_locator": record.get("source_locator"),
                "header": record.get("header"),
                "content": record.get("content"),
                "topic": record.get("topic"),
                "function": record.get("function"),
                "is_substantive": record.get("is_substantive"),
            }
        )
    return dict(samples)


def _unit_from_row(
    index: int,
    row: dict[str, Any],
    samples: list[dict[str, Any]],
    *,
    tier_thresholds: tuple[float, float] | None,
    state_position: tuple[int, int],
) -> dict[str, Any]:
    means = {field: _clean_float(row.get(f"{field}_mean")) for field in SCORE_FIELDS}
    tier_score = _tier_score(means)
    tier = _tier_for_score(tier_score, row.get("law_count") or 0, thresholds=tier_thresholds)
    layout = _layout_for_unit(index, row, state_position=state_position)
    return {
        "unit_id": row["unit_id"],
        "name": row.get("jurisdiction_name") or "Unknown jurisdiction",
        "state": row.get("state_normalized"),
        "kind": row.get("jurisdiction_type_normalized") or "unknown",
        "city": row.get("city_normalized"),
        "county": row.get("county_normalized"),
        "law_count": int(row.get("law_count") or 0),
        "substantive_count": int(row.get("substantive_count") or 0),
        "dominant_topic": row.get("dominant_topic") or "Not_applicable",
        "dominant_function": row.get("dominant_function") or "Unknown",
        "ocr_risk_level": row.get("ocr_risk_level") or "not_evaluated",
        "topic_counts": row.get("topic_counts") or {},
        "function_counts": row.get("function_counts") or {},
        "model_score_means": means,
        "tier": tier,
        "tier_score": tier_score,
        "tier_label": TIER_DEFINITIONS[tier]["label"],
        "tier_color": TIER_DEFINITIONS[tier]["color"],
        "layout": layout,
        "samples": samples,
    }


def _state_ordinals(rows: list[dict[str, Any]]) -> dict[str, tuple[int, int]]:
    counts: Counter[str] = Counter(str(row.get("state_normalized") or "unknown") for row in rows)
    seen: Counter[str] = Counter()
    positions: dict[str, tuple[int, int]] = {}
    for row in rows:
        state = str(row.get("state_normalized") or "unknown")
        positions[row["unit_id"]] = (seen[state], counts[state])
        seen[state] += 1
    return positions


def _layout_for_unit(index: int, row: dict[str, Any], *, state_position: tuple[int, int]) -> dict[str, Any]:
    kind = row.get("jurisdiction_type_normalized")
    center = _state_center(row.get("state_normalized"), index)
    ordinal, total = state_position
    if total <= 1:
        radius = 0.0
    else:
        radius = min(4.8, 0.55 + 4.4 * math.sqrt((ordinal + 1) / total))
    angle = ordinal * 2.399963229728653
    x = _clamp(center["x"] + math.cos(angle) * radius, 2.0, 98.0)
    y = _clamp(center["y"] + math.sin(angle) * radius, 3.0, 82.0)
    law_count = max(0, int(row.get("law_count") or 0))
    scale = min(1.0, math.log10(law_count + 1) / 4.0)
    if kind == "city":
        return {
            "type": "point",
            "x": round(x, 3),
            "y": round(y, 3),
            "r": round(1.0 + scale * 1.4, 3),
        }
    width = 1.5 + scale * 1.9
    height = width * 0.82
    return {
        "type": "tile",
        "x": round(_clamp(x - width / 2, 1.0, 98.0), 3),
        "y": round(_clamp(y - height / 2, 2.0, 83.0), 3),
        "w": round(width, 3),
        "h": round(height, 3),
    }


def _state_center(state: Any, index: int | None = None) -> dict[str, float]:
    state_code = str(state or "").upper()
    if state_code in STATE_TILE_COORDS:
        column, row = STATE_TILE_COORDS[state_code]
    else:
        fallback = 0 if index is None else index
        column, row = fallback % 12, 7
    return {"x": round(4.5 + column * 6.4, 3), "y": round(7.0 + row * 9.4, 3)}


def _state_centers(units: list[dict[str, Any]]) -> list[dict[str, Any]]:
    states = sorted({unit.get("state") for unit in units if unit.get("state") in STATE_TILE_COORDS})
    return [{"state": state, **_state_center(state)} for state in states]


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def _tier_score(means: dict[str, float | None]) -> float | None:
    values = [value for value in means.values() if value is not None]
    if not values:
        return None
    return sum(values) / len(values)


def _tier_thresholds(rows: list[dict[str, Any]]) -> tuple[float, float] | None:
    scores = sorted(
        score
        for row in rows
        if (score := _tier_score({field: _clean_float(row.get(f"{field}_mean")) for field in SCORE_FIELDS})) is not None
    )
    if len(scores) < 3:
        return None
    low = scores[len(scores) // 3]
    high = scores[(len(scores) * 2) // 3]
    if low == high:
        return None
    return (low, high)


def _tier_for_score(score: float | None, law_count: int, *, thresholds: tuple[float, float] | None = None) -> str:
    if law_count <= 0 or score is None:
        return "no_data"
    if thresholds is not None:
        low, high = thresholds
        if score <= low:
            return "tier_1"
        if score <= high:
            return "tier_2"
        return "tier_3"
    if score < 0.33:
        return "tier_1"
    if score < 0.66:
        return "tier_2"
    return "tier_3"


def _clean_float(value: Any) -> float | None:
    if value is None:
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if number != number or number in {float("inf"), float("-inf")}:
        return None
    return round(number, 4)


def _map_layers_artifact(corpus: LocusCorpus, units: list[dict[str, Any]], *, synthetic: bool) -> dict[str, Any]:
    return {
        "schema_version": ANALYSIS_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "dataset_revision": corpus.config.dataset_revision,
        "data_mode": corpus.config.mode,
        "synthetic": synthetic,
        "geometry_status": "state_clustered_approximate_layout_until_reviewed_county_town_geometries_available",
        "view_box": MAP_VIEW_BOX,
        "state_centers": _state_centers(units),
        "tier_definitions": TIER_DEFINITIONS,
        "units": units,
        "notice": (
            "Positions are approximate state clusters until reviewed county/town geometries are added. "
            "Tiers are neutral analysis bands, not legal rankings or findings."
        ),
    }


def _ontology_artifact(units: list[dict[str, Any]]) -> dict[str, Any]:
    topic_counter: Counter[str] = Counter()
    function_counter: Counter[str] = Counter()
    for unit in units:
        topic_counter.update(unit.get("topic_counts", {}))
        function_counter.update(unit.get("function_counts", {}))
    nodes = []
    for topic, count in sorted(topic_counter.items()):
        nodes.append({"id": f"topic:{topic}", "label": topic, "type": "topic", "count": count})
    for function, count in sorted(function_counter.items()):
        nodes.append({"id": f"function:{function}", "label": function, "type": "function", "count": count})
    for field in SCORE_FIELDS:
        nodes.append({"id": f"score:{field}", "label": field, "type": "score_dimension", "direction_verified": False})
    for tier, definition in TIER_DEFINITIONS.items():
        nodes.append({"id": f"tier:{tier}", "label": definition["label"], "type": "tier"})
    edges = []
    for unit in units:
        unit_id = f"unit:{unit['unit_id']}"
        nodes.append({"id": unit_id, "label": unit["name"], "type": "jurisdiction_unit", "count": unit["law_count"]})
        if unit.get("dominant_topic"):
            edges.append({"source": unit_id, "target": f"topic:{unit['dominant_topic']}", "relationship": "has_dominant_topic"})
        if unit.get("dominant_function"):
            edges.append({"source": unit_id, "target": f"function:{unit['dominant_function']}", "relationship": "has_dominant_function"})
        edges.append({"source": unit_id, "target": f"tier:{unit['tier']}", "relationship": "assigned_neutral_tier"})
    return {
        "schema_version": ANALYSIS_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "ontology_version": "evolocus-ontology-v1",
        "nodes": nodes,
        "edges": edges,
        "limitations": [
            "Ontology edges summarize model-produced LOCUS fields and review artifacts.",
            "No edge is a legal conclusion.",
            "Score direction has not been independently verified.",
        ],
    }


def _status_artifact(corpus: LocusCorpus, units: list[dict[str, Any]], *, synthetic: bool) -> dict[str, Any]:
    return {
        "schema_version": ANALYSIS_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "code_commit": current_commit(),
        "dataset_id": DATASET_ID,
        "dataset_revision": corpus.config.dataset_revision,
        "data_mode": corpus.config.mode,
        "synthetic": synthetic,
        "license": DATASET_LICENSE,
        "paper": PAPER_URL,
        "citation": CITATION,
        "analysis_state": "synthetic_demo" if synthetic else "local_aggregate_ready",
        "unit_count": len(units),
        "law_count": sum(unit["law_count"] for unit in units),
        "real_locus_rows_published": False,
        "grok_secret_name": "GROK_API_KEY",
        "grok_secret_aliases": ["GROK_API_KEY", "Grok_api_key"],
        "grok_browser_policy": "Grok API keys must never be embedded in GitHub Pages JavaScript.",
        "publication_gates": [
            {"id": "source_schema_validated", "label": "Source schema validated", "status": "complete" if synthetic else "pending_review"},
            {"id": "aggregate_only", "label": "No raw rows in public artifacts", "status": "complete"},
            {"id": "geometry_reviewed", "label": "Geometry/county-town layout reviewed", "status": "demo_placeholder" if synthetic else "pending_review"},
            {"id": "license_reviewed", "label": "License/provenance reviewed", "status": "demo_placeholder" if synthetic else "pending_review"},
        ],
        "progressive_disclosure": [
            "overview: aggregate counts and neutral tier colors",
            "unit: selected county/town model summaries and ontology links",
            "evidence: source locators and samples only when artifact policy allows it",
        ],
        "next_analysis_goal": "Generate bounded real aggregate map artifacts from local LOCUS Parquet after license/provenance review.",
    }


def _charts_artifact(units: list[dict[str, Any]], *, synthetic: bool) -> dict[str, Any]:
    tier_counts: Counter[str] = Counter(unit["tier"] for unit in units)
    topic_counts: Counter[str] = Counter()
    function_counts: Counter[str] = Counter()
    kind_counts: Counter[str] = Counter(unit.get("kind") or "unknown" for unit in units)
    score_totals: dict[str, list[float]] = {field: [] for field in SCORE_FIELDS}
    for unit in units:
        topic_counts.update(unit.get("topic_counts", {}))
        function_counts.update(unit.get("function_counts", {}))
        for field, value in (unit.get("model_score_means") or {}).items():
            if value is not None:
                score_totals.setdefault(field, []).append(float(value))
    score_means = {
        field: round(sum(values) / len(values), 4) if values else None
        for field, values in score_totals.items()
    }
    return {
        "schema_version": ANALYSIS_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "synthetic": synthetic,
        "charts": {
            "tier_counts": _counter_rows(tier_counts, label_map={key: value["label"] for key, value in TIER_DEFINITIONS.items()}),
            "topic_counts": _counter_rows(topic_counts),
            "function_counts": _counter_rows(function_counts),
            "kind_counts": _counter_rows(kind_counts),
            "score_means": [{"label": field, "value": value} for field, value in score_means.items()],
            "top_units": [
                {
                    "unit_id": unit["unit_id"],
                    "name": unit["name"],
                    "state": unit["state"],
                    "kind": unit["kind"],
                    "law_count": unit["law_count"],
                    "tier": unit["tier"],
                    "tier_label": unit["tier_label"],
                    "dominant_topic": unit["dominant_topic"],
                }
                for unit in sorted(units, key=lambda item: item["law_count"], reverse=True)[:20]
            ],
        },
        "notice": "Charts are aggregate visual aids for review prioritization, not legal rankings.",
    }


def _counter_rows(counter: Counter[str], *, label_map: dict[str, str] | None = None) -> list[dict[str, Any]]:
    labels = label_map or {}
    return [
        {"id": key, "label": labels.get(key, key), "value": int(value)}
        for key, value in sorted(counter.items(), key=lambda item: (-item[1], item[0]))
    ]


def _chat_index_artifact(units: list[dict[str, Any]], ontology: dict[str, Any], status: dict[str, Any]) -> dict[str, Any]:
    entries = [
        {
            "id": "status",
            "title": "Analysis status",
            "keywords": ["status", "current", "progress", "real data", "synthetic"],
            "answer": (
                f"Analysis state is {status['analysis_state']}. "
                f"{status['unit_count']} map units and {status['law_count']} law records are represented in the current artifact."
            ),
        },
        {
            "id": "tiers",
            "title": "Tier meaning",
            "keywords": ["tier", "color", "map", "score"],
            "answer": "Tiers are neutral model-score bands for review prioritization, not legal rankings or findings.",
        },
        {
            "id": "ontology",
            "title": "Ontology scope",
            "keywords": ["ontology", "topic", "function", "model"],
            "answer": f"The current ontology has {len(ontology['nodes'])} nodes and {len(ontology['edges'])} edges.",
        },
        {
            "id": "grok",
            "title": "Grok integration policy",
            "keywords": ["grok", "api", "key", "chat", "llm"],
            "answer": "Grok can be used only by offline analysis jobs with GROK_API_KEY in GitHub secrets or local env; the key is never shipped to Pages.",
        },
    ]
    for unit in units[:50]:
        entries.append(
            {
                "id": f"unit:{unit['unit_id']}",
                "title": unit["name"],
                "keywords": [
                    unit["name"],
                    unit.get("state") or "",
                    unit.get("dominant_topic") or "",
                    unit.get("dominant_function") or "",
                    unit.get("tier") or "",
                ],
                "answer": (
                    f"{unit['name']} has {unit['law_count']} records in this artifact, "
                    f"dominant topic {unit['dominant_topic']}, dominant function {unit['dominant_function']}, "
                    f"and neutral tier {unit['tier_label']}."
                ),
            }
        )
    return {
        "schema_version": ANALYSIS_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "entries": entries,
        "suggested_questions": [
            "What is the current analysis status?",
            "What do the map tiers mean?",
            "Which units mention zoning?",
            "Can Grok answer live questions on this Pages site?",
        ],
    }


def _models_artifact() -> dict[str, Any]:
    return {
        "schema_version": MODEL_REGISTRY_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "dataset": DATASET_ID,
        "paper": PAPER_URL,
        "models": MODEL_REGISTRY,
        "import_policy": {
            "status": "released_dataset_outputs_imported",
            "hf_model_downloads": "deferred_until_model_cards_are_verified",
            "score_direction": "unverified",
        },
        "grok": {
            "secret_name": "GROK_API_KEY",
            "allowed_use": "offline analysis jobs that generate static artifacts",
            "forbidden_use": "embedding the key in GitHub Pages JavaScript",
        },
    }


def _visual_smoke_artifact(corpus: LocusCorpus) -> dict[str, Any]:
    verified_routes = _visual_smoke_verified_routes()
    return {
        "schema_version": VISUAL_SMOKE_SCHEMA_VERSION,
        "generated_at": datetime.now(UTC).isoformat(),
        "dataset_id": DATASET_ID,
        "dataset_revision": corpus.config.dataset_revision,
        "real_locus_rows_published": False,
        "workflow_name": "Browser smoke static Pages visuals",
        "workflow_file": "pages-browser-smoke.yml",
        "event": "local_preview",
        "status": "not_run",
        "run_id": None,
        "run_url": None,
        "target_url": "local_static_preview",
        "head_sha": current_commit(),
        "created_at": None,
        "completed_at": None,
        "verified_route": verified_routes[0],
        "verified_routes": verified_routes,
        "publication_policy": {
            "raw_rows_included": False,
            "ordinance_text_included": False,
            "record_locator_values_included": False,
            "browser_llm_calls": False,
            "secrets_included": False,
            "legal_findings": False,
        },
        "interpretation": (
            "This preview artifact describes the public route-smoke contract. "
            "Run the Pages browser-smoke workflow to verify a hosted deployment."
        ),
    }


def _visual_smoke_verified_routes() -> list[dict[str, Any]]:
    return [
        {
            "name": "Chart -> Map -> Inquiry -> Ontology",
            "steps": [
                "Open Charts tab",
                "Click Open map route",
                "Return to Charts tab",
                "Click Ask route",
                "Return to Charts tab",
                "Click Graph route",
            ],
            "assertions": [
                "Chart route legend renders from public aggregate artifacts",
                "Map panel becomes active after the map route action",
                "Inquiry panel becomes active after the ask route action",
                "Ontology panel becomes active after the graph route action",
                "No page-level JavaScript exception is observed",
            ],
        },
        {
            "name": "Ontology tier drilldown share URLs",
            "steps": [
                "Open Ontology from the Charts graph route",
                "Generate Share tier map URL",
                "Generate Share tier ask URL",
                "Open the shared tier map route",
                "Open the shared tier Inquiry route",
            ],
            "assertions": [
                "Ontology tier drilldown renders aggregate county/town units",
                "Share URLs contain content-free route metadata only",
                "Shared map route restores a highlighted county/town map",
                "Shared Inquiry route restores a deterministic aggregate answer",
                "No browser model call, row text, source locator, secret, or legal finding is observed",
            ],
        },
    ]
