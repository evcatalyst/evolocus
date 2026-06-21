from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


REQUIRED_PATHS = [
    ".github/workflows/pages.yml",
    ".github/workflows/analysis-refresh.yml",
    "data/README.md",
    "dashboards/README.md",
    "docs/architecture.md",
    "docs/data-policy.md",
    "notebooks/README.md",
    "scrapers/README.md",
    "site/assets/app.js",
    "site/assets/styles.css",
    "site/data/analysis/status.json",
    "site/data/analysis/map_layers.json",
    "site/data/analysis/ontology.json",
    "site/data/analysis/chat_index.json",
    "site/data/analysis/models.json",
    "site/data/analysis/charts.json",
    "site/data/analysis/county_geometry.json",
    "site/data/analysis/municipal_points.json",
    "site/index.html",
    "src/evolocus/__init__.py",
    "src/evolocus/cli.py",
    "src/evolocus/county_geometry.py",
    "src/evolocus/municipal_points.py",
    "src/evolocus/locus_ingest.py",
    "tests/test_scaffold.py",
    "tests/test_locus_ingest.py",
    ".gitignore",
    "AGENTS.md",
    "README.md",
    "docker-compose.yml",
    "lessons.md",
    "requirements.txt",
    "roadmap.json",
    "status.md",
]


def read_text(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def test_required_scaffold_files_exist() -> None:
    missing = [path for path in REQUIRED_PATHS if not (ROOT / path).exists()]
    assert missing == []


def test_roadmap_is_valid_and_phase_zero_complete() -> None:
    roadmap = json.loads(read_text("roadmap.json"))
    phase_zero = next(phase for phase in roadmap["phases"] if phase["id"] == 0)
    assert roadmap["completion_model"] == "phase_checklist"
    assert roadmap["overall_percentage"] is None
    assert phase_zero["status"] == "complete"
    assert roadmap["data_policy"]["phase_0_real_locus_records_committed"] is False
    assert roadmap["data_policy"]["phase_0_scrapers_run"] is False
    assert roadmap["data_policy"]["phase_0_database_created"] is False
    assert roadmap["data_policy"]["phase_0_embeddings_created"] is False


def test_requirements_include_requested_stack() -> None:
    requirements = set(read_text("requirements.txt").splitlines())
    assert any(req.startswith("polars") for req in requirements)
    assert any(req.startswith("pyarrow") for req in requirements)
    assert any(req.startswith("huggingface_hub") for req in requirements)
    assert all(not req.startswith("streamlit") for req in requirements)
    assert all(not req.startswith("duckdb") for req in requirements)


def test_pages_workflow_uses_pinned_major_versions_and_site_path() -> None:
    workflow = read_text(".github/workflows/pages.yml")
    assert "path: site" in workflow
    assert "pages: write" in workflow
    assert "id-token: write" in workflow
    assert "@main" not in workflow
    assert "actions/checkout@v4" in workflow
    assert "actions/configure-pages@v5" in workflow
    assert "actions/upload-pages-artifact@v3" in workflow
    assert "actions/deploy-pages@v4" in workflow


def test_static_site_is_relative_and_aggregate_only() -> None:
    html = read_text("site/index.html")
    css = read_text("site/assets/styles.css")
    js = read_text("site/assets/app.js")
    assert 'href="assets/styles.css"' in html
    assert 'src="assets/app.js"' in html
    assert "Aggregate-only LOCUS visuals" in html
    assert "SYNTHETIC DEMONSTRATION DATA" in js
    assert "No real LOCUS rows published" in html
    assert "Pages-first UI" in html
    assert "Law Map" in html
    assert "Inquiry" in html
    assert "Analysis Status" in html
    assert "map-filter-form" in html
    assert "map-insight-grid" in html
    assert "map-comparison-grid" in html
    assert "Min laws" in html
    assert "Progressive disclosure" in html
    assert "analysis-chart-grid" in html
    assert "state-topic-grid" in html
    assert "coverage-matrix-grid" in html
    assert "county-choropleth" in html
    assert "municipal point layer" in html
    assert "geo-color-legend" in html
    assert "data-geo-color=\"topic\"" in html
    assert "data-geo-color=\"function\"" in html
    assert "data-geo-color=\"law_count\"" in html
    assert "status-card-grid" in html
    assert "status-detail-grid" in html
    assert "status-gate-grid" in html
    assert "data/analysis/status.json" in js
    assert "data/analysis/charts.json" in js
    assert "data/analysis/county_geometry.json" in js
    assert "data/analysis/municipal_points.json" in js
    assert "filterMapUnits" in js
    assert "applyMapFilters" in js
    assert "renderMapInsights" in js
    assert "filteredViewAnswer" in js
    assert "renderMapComparisons" in js
    assert "compareCounts" in js
    assert "renderStateTopicCharts" in js
    assert "renderCoverageMatrix" in js
    assert "coverageMatrixRows" in js
    assert "renderCountyChoropleth" in js
    assert "municipalPointSvg" in js
    assert "geographyDatumColor" in js
    assert "geographyColorLegend" in js
    assert "lawCountColor" in js
    assert "official_census_county_geometry_machine_matched_pending_review" not in js
    assert "renderAnalysisStatusPanel" in js
    assert "publication_gates" in js
    assert "stateSummaries" in js
    assert "api.x.ai" not in js
    assert "https://fonts." not in html + css + js
    assert "googletagmanager" not in html + css + js
    assert "analytics" not in html.lower()


def test_static_analysis_artifacts_are_aggregate_only_and_bounded() -> None:
    status = json.loads(read_text("site/data/analysis/status.json"))
    map_layers = json.loads(read_text("site/data/analysis/map_layers.json"))
    models = json.loads(read_text("site/data/analysis/models.json"))
    charts = json.loads(read_text("site/data/analysis/charts.json"))
    county_geometry = json.loads(read_text("site/data/analysis/county_geometry.json"))
    municipal_points = json.loads(read_text("site/data/analysis/municipal_points.json"))
    assert status["synthetic"] is False
    assert status["real_locus_rows_published"] is False
    assert status["grok_secret_name"] == "GROK_API_KEY"
    assert map_layers["synthetic"] is False
    assert (
        map_layers["geometry_status"]
        == "state_clustered_approximate_layout_until_reviewed_county_town_geometries_available"
    )
    assert map_layers["view_box"] == "0 0 100 86"
    assert len(map_layers["state_centers"]) >= 40
    assert len(map_layers["units"]) <= 1000
    assert all(not unit.get("samples") for unit in map_layers["units"])
    assert len({unit["tier"] for unit in map_layers["units"]}) >= 2
    for unit in map_layers["units"]:
        layout = unit["layout"]
        assert 0 <= layout["x"] <= 100
        assert 0 <= layout["y"] <= 86
    assert models["import_policy"]["status"] == "released_dataset_outputs_imported"
    assert models["grok"]["forbidden_use"] == "embedding the key in GitHub Pages JavaScript"
    assert charts["synthetic"] is False
    assert charts["charts"]["tier_counts"]
    assert charts["charts"]["score_means"]
    assert county_geometry["schema_version"] == "evolocus-county-geometry-v1"
    assert county_geometry["geometry_status"] == "official_census_county_geometry_machine_matched_pending_review"
    assert county_geometry["source"]["name"] == "U.S. Census Bureau TIGERweb Current Counties layer"
    assert county_geometry["real_locus_rows_published"] is False
    assert county_geometry["county_unit_count"] == 177
    assert county_geometry["matched_count"] == 177
    assert county_geometry["unmatched_count"] == 0
    assert len(county_geometry["feature_collection"]["features"]) == county_geometry["matched_count"]
    assert all(feature["properties"]["match_status"] == "machine_matched_pending_review" for feature in county_geometry["feature_collection"]["features"])
    assert municipal_points["schema_version"] == "evolocus-municipal-points-v1"
    assert municipal_points["geometry_status"] == "official_census_municipal_points_machine_matched_pending_review"
    assert municipal_points["real_locus_rows_published"] is False
    assert municipal_points["municipal_unit_count"] == 823
    assert municipal_points["matched_count"] == 815
    assert municipal_points["unmatched_count"] == 8
    assert len(municipal_points["points"]) == municipal_points["matched_count"]
    assert all(point["match_status"] == "machine_matched_pending_review" for point in municipal_points["points"])
    serialized = json.dumps(
        {
            "status": status,
            "map_layers": map_layers,
            "charts": charts,
            "county_geometry": county_geometry,
            "municipal_points": municipal_points,
        }
    )
    assert '"content"' not in serialized
    assert '"header"' not in serialized
    assert "source_locator" not in serialized


def test_analysis_refresh_workflow_uses_grok_secret_without_client_exposure() -> None:
    workflow = read_text(".github/workflows/analysis-refresh.yml")
    js = read_text("site/assets/app.js")
    assert "secrets.GROK_API_KEY" in workflow
    assert "GROK_API_KEY" not in js


def test_gitignore_blocks_real_data_artifacts() -> None:
    ignore = read_text(".gitignore")
    for pattern in [
        "data/raw/",
        "data/processed/",
        "data/cache/",
        "*.parquet",
        "*.sqlite",
        "*.duckdb",
        "*.faiss",
        ".env",
    ]:
        assert pattern in ignore
