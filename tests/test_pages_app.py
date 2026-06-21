from __future__ import annotations

from pathlib import Path


def test_pages_app_contains_review_workflow() -> None:
    html = Path("site/index.html").read_text(encoding="utf-8")
    js = Path("site/assets/app.js").read_text(encoding="utf-8")
    assert "Review Queue" in html
    assert "Dataset Explorer" in html
    assert "Charts" in html
    assert "localStorage" in js
    assert "reveal_prediction" in js
    assert "exportLatestCsv" in js
    assert "renderMap" in js
    assert "renderOntology" in js
    assert "renderInquiry" in js
    assert "matchInquiryBriefing" in js
    assert "briefingSectionsHtml" in js
    assert "selectedUnitAnswer" in js
    assert "askAboutMapUnit" in js
    assert "selectedUnitOntologyNeighborhoodHtml" in js
    assert "ontologyNodeSvg" in js
    assert "selectedUnitPeerComparisonHtml" in js
    assert "scoreDeltaSummary" in js
    assert "modelSubstantiveShare" in js
    assert "substantiveShareColor" in js
    assert "fetchAnalysisArtifacts" in js
