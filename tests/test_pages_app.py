from __future__ import annotations

from pathlib import Path


def test_pages_app_contains_review_workflow() -> None:
    html = Path("site/index.html").read_text(encoding="utf-8")
    js = Path("site/assets/app.js").read_text(encoding="utf-8")
    assert "Review Queue" in html
    assert "Dataset Explorer" in html
    assert "Evaluation Results" in html
    assert "localStorage" in js
    assert "reveal_prediction" in js
    assert "exportLatestCsv" in js
    assert "renderMap" in js
    assert "renderOntology" in js
    assert "renderInquiry" in js
    assert "fetchAnalysisArtifacts" in js
