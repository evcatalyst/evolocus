from __future__ import annotations

from pathlib import Path


def test_pages_app_contains_review_workflow() -> None:
    html = Path("site/index.html").read_text(encoding="utf-8")
    js = Path("site/assets/app.js").read_text(encoding="utf-8")
    assert "Review Queue" in html
    assert "Dataset Explorer" in html
    assert "Charts" in html
    assert "import-status" in html
    assert "Walkthrough" in html
    assert "walkthrough-panel" in html
    assert "Score Lens" in html
    assert "Audit Lens" in html
    assert "Queue Plan" in html
    assert "Export Package Request" in html
    assert "package-request-command" in html
    assert "package-request-preview" in html
    assert "package-coverage-grid" in html
    assert "Snapshots" in html
    assert "Export Current View JSON" in html
    assert "Save to Snapshots" in html
    assert "Question matrix" in html
    assert "localStorage" in js
    assert "renderImportStatus" in js
    assert "importStatusFromPayload" in js
    assert "renderPackageCoverage" in js
    assert "packageCoverageSummary" in js
    assert "BROWSER-LOCAL IMPORTED LOCUS TEXT" in js
    assert "reveal_prediction" in js
    assert "exportLatestCsv" in js
    assert "renderMap" in js
    assert "renderWalkthrough" in js
    assert "walkthroughStepHtml" in js
    assert "data-walkthrough-tab" in js
    assert "renderOntology" in js
    assert "renderInquiry" in js
    assert "matchInquiryBriefing" in js
    assert "renderInquiryContext" in js
    assert "renderInquiryMatrix" in js
    assert "filteredAuditAnswer" in js
    assert "filteredScoreAnswer" in js
    assert "briefingSectionsHtml" in js
    assert "selectedUnitAnswer" in js
    assert "askAboutMapUnit" in js
    assert "selectedUnitOntologyNeighborhoodHtml" in js
    assert "ontologyNodeSvg" in js
    assert "selectedUnitPeerComparisonHtml" in js
    assert "scoreDeltaSummary" in js
    assert "modelSubstantiveShare" in js
    assert "substantiveShareColor" in js
    assert "unitAuditQualityFor" in js
    assert "auditAttentionColor" in js
    assert "selectedUnitAuditQualityHtml" in js
    assert "renderScoreLens" in js
    assert "scoreStateGridHtml" in js
    assert "scoreUnitListHtml" in js
    assert "openScoreUnitOnMap" in js
    assert "renderAuditLens" in js
    assert "auditPriorityListHtml" in js
    assert "openAuditUnitOnMap" in js
    assert "renderQueuePlan" in js
    assert "queuePlanPayload" in js
    assert "exportQueuePlan" in js
    assert "reviewPackageRequestPayload" in js
    assert "reviewPackagePreviewHtml" in js
    assert "packageSafetyRows" in js
    assert "exportReviewPackageRequest" in js
    assert "materialize-review-package" in js
    assert "data-open-queue-unit" in js
    assert "currentViewSnapshotPayload" in js
    assert "exportCurrentViewSnapshot" in js
    assert "snapshotGalleryPayload" in js
    assert "loadSnapshotView" in js
    assert "auditGateSummary" in js
    assert "auditOcrBarsHtml" in js
    assert "fetchAnalysisArtifacts" in js
