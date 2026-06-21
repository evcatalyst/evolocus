from __future__ import annotations

from pathlib import Path


def test_pages_app_contains_review_workflow() -> None:
    html = Path("site/index.html").read_text(encoding="utf-8")
    js = Path("site/assets/app.js").read_text(encoding="utf-8")
    css = Path("site/assets/styles.css").read_text(encoding="utf-8")
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
    assert "Aggregate inquiry results log" in html
    assert "inquiry-results-log" in html
    assert "package-map-summary" in html
    assert "map-reading-guide" in html
    assert "map-inline-inquiry" in html
    assert "map-freshness-badge" in html
    assert "map-refresh-source" in html
    assert "inquiry-freshness-badge" in html
    assert "ontology-tier-focus" in html
    assert "ontology-query-presets" in html
    assert "Unit type" in html
    assert 'name="kind"' in html
    assert "Score field" in html
    assert 'name="score_field"' in html
    assert "Score band" in html
    assert 'name="score_band"' in html
    assert "High relative band" in html
    assert "Official geography visible layers" in html
    assert 'data-geo-layer="counties"' in html
    assert 'data-geo-layer="municipalities"' in html
    assert 'data-geo-layer="ontology"' in html
    assert "geo-layer-legend" in html
    assert "Imported package units" in html
    assert "Load Demo Package" in html
    assert "localStorage" in js
    assert "renderImportStatus" in js
    assert "importStatusFromPayload" in js
    assert "renderPackageCoverage" in js
    assert "packageCoverageSummary" in js
    assert "snapshotPackageSummary" in js
    assert "snapshotPackageComparisonHtml" in js
    assert "data/analysis/question_pack.json" in js
    assert "questionPackPromptCards" in js
    assert "applyQuestionPackPrompt" in js
    assert "data-inquiry-pack" in js
    assert "importedPackageMapStats" in js
    assert "matchPackageRecordUnit" in js
    assert "selectedUnitPackageCoverageHtml" in js
    assert "selectedUnitProgressiveTrailHtml" in js
    assert "data-selected-disclosure" in js
    assert "selectedUnitOntologyDrilldownHtml" in js
    assert "applySelectedOntologyDrilldown" in js
    assert "data-selected-ontology-drilldown" in js
    assert "applyPackageMapFilter" in js
    assert "packageOnly" in js
    assert "package-hit" in js
    assert "Local package smoke" in js
    assert "Local Package Verification" in js
    assert "loadSyntheticPackageDemo" in js
    assert "synthetic_demo_data" in js
    assert "SYNTHETIC DEMONSTRATION PACKAGE" in js
    assert "Synthetic package units are highlighted on the map" in js
    assert "data-walkthrough-action" in js
    assert "BROWSER-LOCAL IMPORTED LOCUS TEXT" in js
    assert "reveal_prediction" in js
    assert "exportLatestCsv" in js
    assert "renderMap" in js
    assert "renderMapRefreshSource" in js
    assert "lastRefreshSourceSummary" in js
    assert "tracked Polars aggregate artifact" in js
    assert "public artifact validator runs before Pages upload" in js
    assert "renderMapReadingGuide" in js
    assert "renderMapInlineInquiry" in js
    assert "mapInlineInquiryPrompts" in js
    assert "mapInlineComparisonStripHtml" in js
    assert "mapInlineComparisonRows" in js
    assert "largestVisibleComparisonRows" in js
    assert "STORAGE_MAP_INQUIRY_HISTORY" in js
    assert "loadMapInquiryHistory" in js
    assert "saveCurrentMapInquiryHistory" in js
    assert "currentMapInquiryHistoryItem" in js
    assert "mapInquiryHistoryExportPayload" in js
    assert "mapInquiryHistoryExportItem" in js
    assert "exportMapInquiryHistory" in js
    assert "evolocus-map-inquiry-history.json" in js
    assert "evolocus-map-inquiry-history-export-v1" in js
    assert "data-save-map-inquiry" in js
    assert "data-export-map-inquiry-history" in js
    assert "data-load-map-inquiry" in js
    assert "data-delete-map-inquiry" in js
    assert "evolocus-map-inquiry-history-v1" in js
    assert "record_locator_values_included: false" in js
    assert "source_locators_included: false" in js
    assert "review_events_included: false" in js
    assert "local_database_paths_included: false" in js
    assert "safeCountMap" in js
    assert "data-map-inquiry" in js
    assert "data-map-compare-unit" in js
    assert "tierColorForLabel" in js
    assert "tierKeyForLabel" in js
    assert "openTierOntology" in js
    assert "ontologyQueryPresetsHtml" in js
    assert "ontologyQueryPresetCards" in js
    assert "ontologyQueryPresetCardHtml" in js
    assert "applyOntologyQueryPreset" in js
    assert "data-ontology-query-preset" in js
    assert "ontologyTierFocusHtml" in js
    assert "ontologyTierMiniChartsHtml" in js
    assert "ontologyTierBarChartHtml" in js
    assert "ontologyTierScoreChartHtml" in js
    assert "applyTierMiniFilter" in js
    assert "applyTierScoreFilter" in js
    assert "data-tier-mini-filter" in js
    assert "data-tier-mini-value" in js
    assert "data-tier-score-filter" in js
    assert "data-tier-score-band" in js
    assert "mapFilters.kind" in js
    assert "mapFilters.scoreField" in js
    assert "mapFilters.scoreBand" in js
    assert "form.elements.kind" in js
    assert "form.elements.score_field" in js
    assert "scoreBandForUnit" in js
    assert "scoreBandLabel" in js
    assert "defaultGeographyLayers" in js
    assert "renderGeoLayerControls" in js
    assert "activeGeographyLayerLabels" in js
    assert "geographyOntologyLinksSvg" in js
    assert "geographyOntologyLinkRows" in js
    assert "geographyLayerLegendHtml" in js
    assert "geoLayerLegendPillHtml" in js
    assert "geographyLayerLinkRowsHtml" in js
    assert "geoLayerLinkRowHtml" in js
    assert "geographyPositionIndex" in js
    assert "geometryCentroid" in js
    assert "geography_layers" in js
    assert "data-tier-ontology" in js
    assert "data-tier-ontology-unit" in js
    assert "renderWalkthrough" in js
    assert "walkthroughStepHtml" in js
    assert "data-walkthrough-tab" in js
    assert "renderOntology" in js
    assert "package-ontology-bridge" in html
    assert "Package overlay snapshots" in js
    assert "packageOntologyBridgeHtml" in js
    assert "packageOntologyNodeCard" in js
    assert "data-package-ontology-unit" in js
    assert "renderInquiry" in js
    assert "matchInquiryBriefing" in js
    assert "renderInquiryContext" in js
    assert "renderInquiryMatrix" in js
    assert "packageInquiryAnswer" in js
    assert "What does the loaded package show on the map?" in js
    assert "Package evidence boundary" in js
    assert "filteredAuditAnswer" in js
    assert "filteredScoreAnswer" in js
    assert "briefingSectionsHtml" in js
    assert "STORAGE_INQUIRY_RESULTS_LOG" in js
    assert "loadInquiryResultsLog" in js
    assert "saveInquiryResultsLog" in js
    assert "answerAndLogInquiry" in js
    assert "inquiryResultLogEntry" in js
    assert "mapFiltersSnapshot" in js
    assert "normalizedLogMapFilters" in js
    assert "replayInquiryResultLog" in js
    assert "activeInquiryReplayId" in js
    assert "data-replay-inquiry-log" in js
    assert "data-open-inquiry-log-map" in js
    assert "Replay answer" in js
    assert "Open map view" in js
    assert "Replay state" in js
    assert "aggregateInquiryLogPolicy" in js
    assert "renderInquiryResultsLog" in js
    assert "inquiryResultsLogExportPayload" in js
    assert "evolocus-aggregate-inquiry-results-log.json" in js
    assert "record_locator_values_included: false" in js
    assert "source_locators_included: false" in js
    assert "review_events_included: false" in js
    assert "selectedUnitAnswer" in js
    assert "askAboutMapUnit" in js
    assert "selectedUnitOntologyNeighborhoodHtml" in js
    assert "selectedUnitOntologyPathHtml" in js
    assert "selected-disclosure-trail" in css
    assert "selected-ontology-drilldown" in css
    assert "ontology-query-presets" in css
    assert "ontology-query-grid" in css
    assert "ontology-query-card" in css
    assert "map-reading-guide-card" in css
    assert "map-inline-inquiry-card" in css
    assert "map-inline-chat-answer" in css
    assert "map-inline-inquiry-history" in css
    assert "inquiry-results-log-card" in css
    assert "inquiry-log-entry" in css
    assert "inquiry-log-actions" in css
    assert "inquiry-log-entry.active" in css
    assert "map-inline-history-row" in css
    assert "map-inline-comparison-strip" in css
    assert "map-inline-comparison-row" in css
    assert "ontology-tier-focus" in css
    assert "ontology-tier-focus-metrics" in css
    assert "ontology-tier-mini-charts" in css
    assert "ontology-tier-mini-bar" in css
    assert "button.ontology-tier-mini-bar" in css
    assert "ontology-path-strip" in css
    assert "ontologyPathSweep" in css
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
    assert "geo-layer-control" in css
    assert "geo-layer-legend-panel" in css
    assert "geo-layer-link-list" in css
    assert "geo-layer-boundary" in css
    assert "geography-ontology-link" in css
    assert "geography-ontology-detail" in css
    assert "status-action-grid" in html
    assert "ACTIONS_REFRESH_WORKFLOW_URL" in js
    assert "actions/workflows/analysis-refresh.yml" in js
    assert "actionsBriefingRefreshHtml" in js
    assert "Open refresh workflow" in js
    assert "actions-briefing-refresh" in css
    assert "primary-action-link" in css
    assert "api.x.ai" not in js
    assert "GROK_API_KEY" not in js
    assert "Grok_api_key" not in js
    assert "fetchAnalysisArtifacts" in js
    assert "renderArtifactFreshnessBadges" in js
    assert "artifactFreshnessBadgeHtml" in js
    assert "artifactAgeLabel" in js
    assert "openAnalysisStatusTab" in js
    assert "data-open-status-tab" in js
    assert "No row text published" in js
    assert "artifact-freshness-card" in css
    assert "artifact-freshness-grid" in css
    assert "map-refresh-source-card" in css
