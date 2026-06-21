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
    "site/index.html",
    "src/evolocus/__init__.py",
    "src/evolocus/cli.py",
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


def test_static_site_is_relative_and_synthetic_only() -> None:
    html = read_text("site/index.html")
    css = read_text("site/assets/styles.css")
    js = read_text("site/assets/app.js")
    assert 'href="assets/styles.css"' in html
    assert 'src="assets/app.js"' in html
    assert "Synthetic only by default" in html
    assert "SYNTHETIC DEMONSTRATION DATA" in js
    assert "No real LOCUS rows published" in html
    assert "Pages-first UI" in html
    assert "Law Map" in html
    assert "Inquiry" in html
    assert "data/analysis/status.json" in js
    assert "api.x.ai" not in js
    assert "https://fonts." not in html + css + js
    assert "googletagmanager" not in html + css + js
    assert "analytics" not in html.lower()


def test_static_analysis_artifacts_are_synthetic_and_bounded() -> None:
    status = json.loads(read_text("site/data/analysis/status.json"))
    map_layers = json.loads(read_text("site/data/analysis/map_layers.json"))
    models = json.loads(read_text("site/data/analysis/models.json"))
    assert status["synthetic"] is True
    assert status["real_locus_rows_published"] is False
    assert status["grok_secret_name"] == "GROK_API_KEY"
    assert map_layers["synthetic"] is True
    assert map_layers["geometry_status"] == "abstract_layout_until_reviewed_geometries_available"
    assert len(map_layers["units"]) <= 250
    assert models["import_policy"]["status"] == "released_dataset_outputs_imported"
    assert models["grok"]["forbidden_use"] == "embedding the key in GitHub Pages JavaScript"


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
