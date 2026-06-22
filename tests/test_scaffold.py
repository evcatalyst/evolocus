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
    "site/data/analysis/inquiry_briefings.json",
    "site/data/analysis/question_pack.json",
    "site/data/analysis/models.json",
    "site/data/analysis/charts.json",
    "site/data/analysis/audit_status.json",
    "site/data/analysis/unit_audit_quality.json",
    "site/data/analysis/county_geometry.json",
    "site/data/analysis/municipal_points.json",
    "site/index.html",
    "src/evolocus/__init__.py",
    "src/evolocus/cli.py",
    "src/evolocus/county_geometry.py",
    "src/evolocus/inquiry_briefings.py",
    "src/evolocus/static_question_pack.py",
    "src/evolocus/municipal_points.py",
    "src/evolocus/locus_ingest.py",
    "src/evolocus/public_artifact_guard.py",
    "src/evolocus/review_package.py",
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
    assert "actions/setup-python@v5" in workflow
    assert "validate-public-artifacts" in workflow
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
    assert "import-status" in html
    assert "Law Map" in html
    assert "Walkthrough" in html
    assert "walkthrough-panel" in html
    assert "walkthrough-status" in html
    assert "walkthrough-flow" in html
    assert "walkthrough-disclosure" in html
    assert "walkthrough-gates" in html
    assert "public real-aggregate demo path" in html
    assert "analysis-journey" in html
    assert "Aggregate analysis journey" in html
    assert "Inquiry" in html
    assert "Snapshots" in html
    assert "Score Lens" in html
    assert "Audit Lens" in html
    assert "Queue Plan" in html
    assert "Export Package Request" in html
    assert "package-request-command" in html
    assert "package-request-preview" in html
    assert "Question matrix" in html
    assert "Topic and tier question pathways" in html
    assert "inquiry-pathway-grid" in html
    assert "selected-ontology-neighborhood" in html
    assert "ontology-tier-focus" in html
    assert "ontology-query-presets" in html
    assert "package-ontology-bridge" in html
    assert "Analysis Status" in html
    assert "map-filter-form" in html
    assert "map-reading-guide" in html
    assert "map-inline-inquiry" in html
    assert "map-freshness-badge" in html
    assert "map-refresh-source" in html
    assert "status-artifact-change-panel" in html
    assert "inquiry-freshness-badge" in html
    assert "map-insight-grid" in html
    assert "map-comparison-grid" in html
    assert "Unit type" in html
    assert 'name="kind"' in html
    assert "Score field" in html
    assert 'name="score_field"' in html
    assert "Score band" in html
    assert 'name="score_band"' in html
    assert "Low relative band" in html
    assert "Middle relative band" in html
    assert "High relative band" in html
    assert "Official geography visible layers" in html
    assert 'data-geo-layer="counties"' in html
    assert 'data-geo-layer="municipalities"' in html
    assert 'data-geo-layer="ontology"' in html
    assert "geo-layer-legend" in html
    assert "package-map-summary" in html
    assert "Export Current View JSON" in html
    assert "Save to Snapshots" in html
    assert "snapshots-panel" in html
    assert "snapshot-summary" in html
    assert "snapshot-compare" in html
    assert "snapshot-list" in html
    assert "Package overlay snapshots" in js
    assert "view-export-strip" in html
    assert "inquiry-export-row" in html
    assert "Min laws" in html
    assert "Progressive disclosure" in html
    assert "analysis-chart-grid" in html
    assert "state-topic-grid" in html
    assert "coverage-matrix-grid" in html
    assert "package-coverage-grid" in html
    assert "county-choropleth" in html
    assert "municipal point layer" in html
    assert "geo-color-legend" in html
    assert "data-geo-color=\"topic\"" in html
    assert "data-geo-color=\"function\"" in html
    assert "data-geo-color=\"substantive_share\"" in html
    assert "data-geo-color=\"audit_attention\"" in html
    assert "data-geo-color=\"law_count\"" in html
    assert "Audit focus" in html
    assert "Min audit attention" in html
    assert "Imported package units" in html
    assert "Load Demo Package" in html
    assert "package_only" in html
    assert "status-card-grid" in html
    assert "status-detail-grid" in html
    assert "status-gate-grid" in html
    assert "data/analysis/status.json" in js
    assert "local_package_verification" in read_text("site/data/analysis/status.json")
    assert "Local package smoke" in js
    assert "Local Package Verification" in js
    assert "loadSyntheticPackageDemo" in js
    assert "synthetic_demo_data" in js
    assert "SYNTHETIC DEMONSTRATION PACKAGE" in js
    assert "Synthetic package units are highlighted on the map" in js
    assert "data/analysis/charts.json" in js
    assert "data/analysis/audit_status.json" in js
    assert "data/analysis/unit_audit_quality.json" in js
    assert "data/analysis/inquiry_briefings.json" in js
    assert "data/analysis/question_pack.json" in js
    assert "data/analysis/county_geometry.json" in js
    assert "data/analysis/municipal_points.json" in js
    assert "inquiry-context-grid" in html
    assert "inquiry-question-matrix" in html
    assert "Aggregate inquiry results log" in html
    assert "inquiry-results-log" in html
    assert "score-summary-grid" in html
    assert "score-visual-grid" in html
    assert "score-state-grid" in html
    assert "score-unit-list" in html
    assert "audit-summary-grid" in html
    assert "audit-visual-grid" in html
    assert "audit-state-grid" in html
    assert "audit-priority-list" in html
    assert "queue-plan-form" in html
    assert "queue-plan-summary" in html
    assert "queue-plan-visuals" in html
    assert "queue-plan-list" in html
    assert "inquiry-provenance" in html
    assert "Ask about this unit" in js
    assert "STORAGE_IMPORT_STATUS" in js
    assert "renderImportStatus" in js
    assert "renderAnalysisJourney" in js
    assert "analysisJourneyStepHtml" in js
    assert "openAnalysisJourneyStep" in js
    assert "data-journey-tab" in js
    assert "Progressive analysis journey" in js
    assert "Map -&gt; Inquiry -&gt; Ontology -&gt; Queue Plan" in js
    assert "Public journey steps pass only filters" in js
    assert "importStatusFromPayload" in js
    assert "renderPackageCoverage" in js
    assert "packageCoverageSummary" in js
    assert "importedPackageMapStats" in js
    assert "matchPackageRecordUnit" in js
    assert "selectedUnitPackageCoverageHtml" in js
    assert "selectedUnitProgressiveTrailHtml" in js
    assert "selectedUnitDisclosureStepHtml" in js
    assert "data-selected-disclosure" in js
    assert "selectedUnitOntologyDrilldownHtml" in js
    assert "selectedUnitOntologyDrilldownCards" in js
    assert "applySelectedOntologyDrilldown" in js
    assert "data-selected-ontology-drilldown" in js
    assert "applyPackageMapFilter" in js
    assert "packageOnly" in js
    assert "data-package-map-filter" in js
    assert "package-hit" in js
    assert "BROWSER-LOCAL IMPORTED LOCUS TEXT" in js
    assert "BROWSER-LOCAL IMPORTED PACKAGE METADATA" in js
    assert "Package status is visible above the workbench" in js
    assert "data-ask-unit-id" in js
    assert "briefing-sections" in js
    assert "matchInquiryBriefing" in js
    assert "packageInquiryAnswer" in js
    assert "packageInquirySectionsHtml" in js
    assert "What does the loaded package show on the map?" in js
    assert "Package evidence boundary" in js
    assert "selectedUnitAnswer" in js
    assert "inquiryAnswerMiniChartsHtml" in js
    assert "inquiryAnswerCountChart" in js
    assert "inquiryAnswerUnitChart" in js
    assert "applyInquiryAnswerChartAction" in js
    assert "data-inquiry-answer-chart-action" in js
    assert "Click rows to filter the Law Map" in js
    assert "Mini charts reuse current aggregate map artifacts only" in js
    assert "renderInquiryContext" in js
    assert "renderInquiryMatrix" in js
    assert "renderInquiryPathways" in js
    assert "inquiryPathwayRows" in js
    assert "inquiryPathwayCardHtml" in js
    assert "inquiryPathwayPeerComparisonHtml" in js
    assert "inquiryPathwayPeerRowHtml" in js
    assert "inquiryPathwayOntologyChipsHtml" in js
    assert "applyInquiryPathway" in js
    assert "applyInquiryPathwayOntology" in js
    assert "data-inquiry-pathway-ask" in js
    assert "data-inquiry-pathway-map" in js
    assert "data-inquiry-pathway-peer-unit" in js
    assert "data-inquiry-pathway-ontology" in js
    assert "Aggregate peer comparison for pathway" in js
    assert "Top aggregate units in this cell" in js
    assert "Topic node:" in js
    assert "Tier node:" in js
    assert "Map unit:" in js
    assert "Ask this pathway" in js
    assert "Open on map" in js
    assert "renderMapReadingGuide" in js
    assert "mapTopicTierMatrixHtml" in js
    assert "topicTierMatrixRows" in js
    assert "mapTopicTierQuestion" in js
    assert "applyMapTopicTierMatrix" in js
    assert "askMapTopicTierMatrix" in js
    assert "data-map-topic-tier-filter" in js
    assert "data-map-topic-tier-topic" in js
    assert "data-map-topic-tier-ask" in js
    assert "Ask cell" in js
    assert "map topic/tier matrix" in js
    assert "Topic/tier co-occurrence" in js
    assert "Ask opens a deterministic Inquiry answer for that aggregate cell." in js
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
    assert "inquiryPromptCards" in js
    assert "questionPackPromptCards" in js
    assert "applyQuestionPackPrompt" in js
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
    assert "inquiryResultsTimelineHtml" in js
    assert "inquiryResultsTimelineRowHtml" in js
    assert "Replay timeline" in js
    assert "Aggregate inquiry replay timeline" in js
    assert "aggregateInquiryLogPolicy" in js
    assert "renderInquiryResultsLog" in js
    assert "inquiryResultsLogExportPayload" in js
    assert "evolocus-aggregate-inquiry-results-log.json" in js
    assert "record_locator_values_included: false" in js
    assert "source_locators_included: false" in js
    assert "review_events_included: false" in js
    assert "data-inquiry-pack" in js
    assert "filteredAuditAnswer" in js
    assert "filteredScoreAnswer" in js
    assert "data-inquiry-prompt" in js
    assert "data-inquiry-unit" in js
    assert "askAboutMapUnit" in js
    assert "geometryMatchForUnit" in js
    assert "packageOntologyBridgeHtml" in js
    assert "packageOntologyNodeCard" in js
    assert "packageTierCounts" in js
    assert "data-package-ontology-unit" in js
    assert "selectedUnitOntologyNeighborhoodHtml" in js
    assert "selectedUnitOntologyPathHtml" in js
    assert "ontologyPathStepHtml" in js
    assert "selectedUnitOntologyNodes" in js
    assert "ontologyNodeSvg" in js
    assert "ontology-neighborhood-svg" in css
    assert "ontology-path-strip" in css
    assert "ontology-path-step" in css
    assert "ontologyPathSweep" in css
    assert "prefers-reduced-motion" in css
    assert "package-ontology-lane" in css
    assert "package-ontology-bars" in css
    assert "selected-disclosure-trail" in css
    assert "analysis-journey" in css
    assert "analysis-journey-step" in css
    assert "analysis-journey-boundary" in css
    assert "selected-disclosure-step" in css
    assert "selected-ontology-drilldown" in css
    assert "ontology-query-presets" in css
    assert "ontology-query-grid" in css
    assert "ontology-query-card" in css
    assert "selected-ontology-drilldown-card" in css
    assert "package-coverage-card" in css
    assert "package-map-card" in css
    assert "map-reading-guide-card" in css
    assert "map-reading-guide-tiers" in css
    assert "map-topic-tier-matrix" in css
    assert "map-topic-tier-grid" in css
    assert "map-topic-tier-cell" in css
    assert "map-topic-tier-filter" in css
    assert "map-topic-tier-ask" in css
    assert "map-inline-inquiry-card" in css
    assert "map-inline-chat-answer" in css
    assert "map-inline-inquiry-history" in css
    assert "map-inline-history-row" in css
    assert "map-inline-comparison-strip" in css
    assert "map-inline-comparison-row" in css
    assert "ontology-tier-focus" in css
    assert "ontology-tier-focus-metrics" in css
    assert "ontology-tier-mini-charts" in css
    assert "ontology-tier-mini-bar" in css
    assert "button.ontology-tier-mini-bar" in css
    assert "package-map-actions" in css
    assert "checkbox-filter" in css
    assert "package-hit-badge" in css
    assert "selected-package-card" in css
    assert "selectedUnitPeerComparisonHtml" in js
    assert "selectedUnitPeers" in js
    assert "scoreDeltaSummary" in js
    assert "selected-peer-card" in css
    assert "unitAuditQualityFor" in js
    assert "auditAttentionColor" in js
    assert "selectedUnitAuditQualityHtml" in js
    assert "SCORE_FIELDS" in js
    assert "renderScoreLens" in js
    assert "scoreDimensionBarsHtml" in js
    assert "scoreDimensionRangeHtml" in js
    assert "scoreStateGridHtml" in js
    assert "scoreUnitListHtml" in js
    assert "openScoreUnitOnMap" in js
    assert "data-open-score-unit" in js
    assert "renderAuditLens" in js
    assert "visibleAuditRows" in js
    assert "auditAttentionDistributionHtml" in js
    assert "auditReasonBarsHtml" in js
    assert "auditStateGridHtml" in js
    assert "auditPriorityListHtml" in js
    assert "openAuditUnitOnMap" in js
    assert "data-open-audit-unit" in js
    assert "renderQueuePlan" in js
    assert "buildQueuePlan" in js
    assert "queuePlanPayload" in js
    assert "applyQueuePlan" in js
    assert "exportQueuePlan" in js
    assert "reviewPackageRequestPayload" in js
    assert "reviewPackagePreviewHtml" in js
    assert "packageSafetyRows" in js
    assert "Safety gates before download" in js
    assert "exportReviewPackageRequest" in js
    assert "materialize-review-package" in js
    assert "evolocus-review-package-request.json" in js
    assert "data-open-queue-unit" in js
    assert "currentViewSnapshotPayload" in js
    assert "exportCurrentViewSnapshot" in js
    assert "STORAGE_SNAPSHOTS" in js
    assert "saveCurrentViewSnapshot" in js
    assert "snapshotGalleryPayload" in js
    assert "evolocus-snapshot-gallery.json" in js
    assert "loadSnapshotView" in js
    assert "evolocus-current-view-snapshot.json" in js
    assert "record_locator_values_included" in js
    assert "review_events_included" in js
    assert "package_summary" in js
    assert "snapshotPackageSummary" in js
    assert "audit-gradient" in css
    assert "import-status-card" in css
    assert "import-safety-grid" in css
    assert "selected-audit-card" in css
    assert "audit-summary-grid" in css
    assert "audit-priority-row" in css
    assert "queue-plan-form" in css
    assert "package-request-card" in css
    assert "package-preview-cards" in css
    assert "package-safety-card" in css
    assert "queue-plan-card" in css
    assert "queue-plan-row" in css
    assert "view-export-strip" in css
    assert "inquiry-export-row" in css
    assert "snapshot-summary" in css
    assert "snapshot-bar-row" in css
    assert "snapshot-list-card" in css
    assert "package-snapshot-row" in css
    assert "snapshot-package-row" in css
    assert "score-summary-grid" in css
    assert "score-state-row" in css
    assert "score-unit-row" in css
    assert "inquiry-context-grid" in css
    assert "inquiry-answer-mini-charts" in css
    assert "inquiry-answer-mini-grid" in css
    assert "inquiry-answer-mini-row" in css
    assert "inquiry-pathway-card" in css
    assert "inquiry-pathway-grid" in css
    assert "inquiry-pathway-cell" in css
    assert "inquiry-pathway-peers" in css
    assert "inquiry-pathway-peer-row" in css
    assert "inquiry-pathway-ontology-chips" in css
    assert "inquiry-pathway-actions" in css
    assert "inquiry-question-matrix" in css
    assert "inquiry-results-log-card" in css
    assert "inquiry-log-entry" in css
    assert "inquiry-log-actions" in css
    assert "inquiry-log-entry.active" in css
    assert "inquiry-log-timeline" in css
    assert "inquiry-log-timeline-row" in css
    assert "inquiry-log-sparkline" in css
    assert "latestArtifactChangePanelHtml" in js
    assert "latestArtifactChangeRows" in js
    assert "artifactChangeRowHtml" in js
    assert "latestArtifactTimestamp" in js
    assert "This is current refresh metadata, not a historical diff." in js
    assert "No row text, source locators, local databases, exports, or legal findings" in js
    assert "artifact-change-card" in css
    assert "artifact-change-grid" in css
    assert "artifact-change-row" in css
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
    assert "modelSubstantiveShare" in js
    assert "substantiveShareColor" in js
    assert "formatPercentRatio" in js
    assert "Model substantive share" in js
    assert "lawCountColor" in js
    assert "official_census_county_geometry_machine_matched_pending_review" not in js
    assert "renderAnalysisStatusPanel" in js
    assert "renderMapRefreshSource" in js
    assert "lastRefreshSourceSummary" in js
    assert "tracked Polars aggregate artifact" in js
    assert "public artifact validator runs before Pages upload" in js
    assert "renderArtifactFreshnessBadges" in js
    assert "artifactFreshnessBadgeHtml" in js
    assert "artifactAgeLabel" in js
    assert "openAnalysisStatusTab" in js
    assert "data-open-status-tab" in js
    assert "No row text published" in js
    assert "renderWalkthrough" in js
    assert "walkthroughStepHtml" in js
    assert "walkthroughDisclosureStepHtml" in js
    assert "data-walkthrough-tab" in js
    assert "data-walkthrough-action" in js
    assert "data-walkthrough-disclosure" in js
    assert "walkthrough-flow" in css
    assert "walkthrough-step-card" in css
    assert "walkthrough-disclosure-step" in css
    assert "auditGateSummary" in js
    assert "auditOcrBarsHtml" in js
    assert "audit-risk-bars" in css
    assert "geo-layer-control" in css
    assert "geo-layer-legend-panel" in css
    assert "geo-layer-link-list" in css
    assert "geo-layer-boundary" in css
    assert "geography-ontology-link" in css
    assert "geography-ontology-detail" in css
    assert "artifact-freshness-card" in css
    assert "artifact-freshness-grid" in css
    assert "map-refresh-source-card" in css
    assert "publication_gates" in js
    assert "status-action-grid" in html
    assert "ACTIONS_REFRESH_WORKFLOW_URL" in js
    assert "actions/workflows/analysis-refresh.yml" in js
    assert "actionsBriefingRefreshHtml" in js
    assert "Open refresh workflow" in js
    assert "actions-briefing-refresh" in css
    assert "primary-action-link" in css
    assert "stateSummaries" in js
    assert "api.x.ai" not in js
    assert "GROK_API_KEY" not in js
    assert "Grok_api_key" not in js
    assert "https://fonts." not in html + css + js
    assert "googletagmanager" not in html + css + js
    assert "analytics" not in html.lower()


def test_static_analysis_artifacts_are_aggregate_only_and_bounded() -> None:
    status = json.loads(read_text("site/data/analysis/status.json"))
    map_layers = json.loads(read_text("site/data/analysis/map_layers.json"))
    models = json.loads(read_text("site/data/analysis/models.json"))
    charts = json.loads(read_text("site/data/analysis/charts.json"))
    audit_status = json.loads(read_text("site/data/analysis/audit_status.json"))
    unit_audit_quality = json.loads(read_text("site/data/analysis/unit_audit_quality.json"))
    inquiry_briefings = json.loads(read_text("site/data/analysis/inquiry_briefings.json"))
    question_pack = json.loads(read_text("site/data/analysis/question_pack.json"))
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
    assert audit_status["schema_version"] == "evolocus-audit-status-v1"
    assert audit_status["row_count"] == 2211516
    assert audit_status["manifest"]["full_scan_completed"] is True
    assert audit_status["schema"]["is_compatible"] is True
    assert audit_status["real_locus_rows_published"] is False
    assert audit_status["publication_policy"]["raw_rows_included"] is False
    assert audit_status["publication_policy"]["ordinance_text_included"] is False
    assert audit_status["publication_policy"]["sample_findings_included"] is False
    assert audit_status["quality_counts"]["duplicate_record_locator_count"] == 0
    assert audit_status["quality_counts"]["ocr_risk_counts"]["low"] > 0
    assert any(gate["id"] == "ocr_risk" for gate in audit_status["quality_gates"])
    assert unit_audit_quality["schema_version"] == "evolocus-unit-audit-quality-v1"
    assert unit_audit_quality["row_count"] == 1517672
    assert unit_audit_quality["summary"]["unit_count"] == 1000
    assert unit_audit_quality["summary"]["ocr_review_rows"] == 55816
    assert unit_audit_quality["summary"]["duplicate_text_hash_rows"] == 29194
    assert unit_audit_quality["summary"]["review_signal_units"] == 1000
    assert unit_audit_quality["summary"]["max_audit_attention_score"] == 30.88
    assert unit_audit_quality["real_locus_rows_published"] is False
    assert unit_audit_quality["publication_policy"]["raw_rows_included"] is False
    assert unit_audit_quality["publication_policy"]["ordinance_text_included"] is False
    assert unit_audit_quality["publication_policy"]["sample_findings_included"] is False
    assert unit_audit_quality["publication_policy"]["legal_findings"] is False
    assert unit_audit_quality["quality_signal_definitions"]["audit_attention_score"].endswith("not a ranking or legal finding.")
    assert inquiry_briefings["schema_version"] == "evolocus-progressive-inquiry-v1"
    assert inquiry_briefings["synthetic"] is False
    assert inquiry_briefings["real_locus_rows_published"] is False
    assert inquiry_briefings["publication_policy"]["raw_rows_included"] is False
    assert inquiry_briefings["publication_policy"]["ordinance_text_included"] is False
    assert inquiry_briefings["publication_policy"]["browser_llm_calls"] is False
    assert inquiry_briefings["grok"]["used"] is True
    assert inquiry_briefings["grok"]["model"] == "grok-4.3"
    assert inquiry_briefings["grok"]["error"] is None
    assert inquiry_briefings["grok_summary"]
    assert inquiry_briefings["briefings"]
    assert question_pack["schema_version"] == "evolocus-filter-aware-question-pack-v1"
    assert question_pack["synthetic"] is False
    assert question_pack["real_locus_rows_published"] is False
    assert question_pack["publication_policy"]["raw_rows_included"] is False
    assert question_pack["publication_policy"]["ordinance_text_included"] is False
    assert question_pack["publication_policy"]["record_locator_values_included"] is False
    assert question_pack["publication_policy"]["browser_llm_calls"] is False
    assert question_pack["publication_policy"]["legal_findings"] is False
    assert question_pack["grok"]["secret_env"] == "GROK_API_KEY"
    assert question_pack["prompts"]
    assert question_pack["suggested_questions"]
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
            "audit_status": audit_status,
            "unit_audit_quality": unit_audit_quality,
            "inquiry_briefings": inquiry_briefings,
            "question_pack": question_pack,
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
    assert "workflow_dispatch" in workflow
    assert "use_grok" in workflow
    assert "secrets.GROK_API_KEY" in workflow
    assert "secrets.Grok_api_key" in workflow
    assert "GROK_API_KEY_ALIAS" in workflow
    assert "publish-inquiry-briefings" in workflow
    assert "publish-question-pack" in workflow
    assert "question_pack.json" in workflow
    assert "validate-public-artifacts" in workflow
    assert "actions/upload-pages-artifact@v3" in workflow
    assert "publish-analysis" not in workflow
    assert "GROK_API_KEY" not in js
    assert "api.x.ai" not in js


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
