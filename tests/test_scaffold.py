from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


REQUIRED_PATHS = [
    ".github/workflows/pages.yml",
    ".github/workflows/analysis-refresh.yml",
    ".github/workflows/pages-browser-smoke.yml",
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
    "site/data/analysis/artifact_snapshot.json",
    "site/data/analysis/visual_smoke.json",
    "site/data/analysis/refresh_status.json",
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
    "tests/test_pages_browser_smoke.py",
    ".gitignore",
    "AGENTS.md",
    "README.md",
    "docker-compose.yml",
    "lessons.md",
    "requirements.txt",
    "requirements-dev.txt",
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


def test_optional_browser_smoke_dependencies_are_dev_only() -> None:
    dev_requirements = set(read_text("requirements-dev.txt").splitlines())
    requirements = set(read_text("requirements.txt").splitlines())
    assert "-r requirements.txt" in dev_requirements
    assert any(req.startswith("playwright") for req in dev_requirements)
    assert all(not req.startswith("playwright") for req in requirements)


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


def test_pages_browser_smoke_workflow_clicks_deployed_visual_route() -> None:
    workflow = read_text(".github/workflows/pages-browser-smoke.yml")
    assert "workflow_dispatch" in workflow
    assert "target_url" in workflow
    assert "https://evcatalyst.github.io/evolocus/" in workflow
    assert "contents: read" in workflow
    assert "actions/checkout@v4" in workflow
    assert "actions/setup-python@v5" in workflow
    assert "requirements-dev.txt" in workflow
    assert "playwright install --with-deps chromium" in workflow
    assert "EVOLOCUS_BROWSER_SMOKE: \"1\"" in workflow
    assert "EVOLOCUS_BROWSER_SMOKE_URL" in workflow
    assert "validate-public-artifacts" in workflow
    assert "tests/test_pages_browser_smoke.py" in workflow
    assert "pages: write" not in workflow
    assert "secrets." not in workflow
    assert "GROK_API_KEY" not in workflow
    assert "data/raw" not in workflow
    assert "data/processed" not in workflow
    assert "data/evaluation" not in workflow
    assert "data/exports" not in workflow


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
    assert "frontdoor-visual-path" in html
    assert "visual-route-verification" in html
    assert "offline-refresh-freshness" in html
    assert "coverage-timeline" in html
    assert "Real-data coverage timeline animation" in html
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
    assert "map-route-replay" in html
    assert "map-inline-inquiry" in html
    assert "map-question-law-location-trail" in css
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
    assert "map-layer-stepper" in html
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
    assert "data/analysis/artifact_snapshot.json" in js
    assert "data/analysis/visual_smoke.json" in js
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
    assert "inquiry-route-replay" in html
    assert "Question-to-map replay paths" in html
    assert "score-summary-grid" in html
    assert "score-visual-grid" in html
    assert "score-state-grid" in html
    assert "score-unit-list" in html
    assert "model-import-status" in html
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
    assert "renderFrontdoorVisualPath" in js
    assert "renderOfflineRefreshFreshness" in js
    assert "renderCoverageTimeline" in js
    assert "coverageTimelineStages" in js
    assert "coverageTimelineStageHtml" in js
    assert "coverageTimelinePlaybackHtml" in js
    assert "coverageTimelinePlaybackStepHtml" in js
    assert "coverageTimelinePlaybackConfig" in js
    assert "handleCoverageTimelinePlaybackAction" in js
    assert "startCoverageTimelinePlayback" in js
    assert "stopCoverageTimelinePlayback" in js
    assert "applyCoverageTimelinePlayback" in js
    assert "renderTopicPlaybackPresets" in js
    assert "topicPlaybackPresetRows" in js
    assert "handleTopicPlaybackAction" in js
    assert "applyTopicPlaybackPreset" in js
    assert "data-topic-playback-action" in js
    assert "data-topic-playback-topic" in js
    assert "Topic playback presets" in js
    assert "Play or click a released LOCUS topic" in js
    assert "topic playback preset" in js
    assert "coverageTimelinePolicyHtml" in js
    assert "applyCoverageTimelineAction" in js
    assert "Real-data coverage timeline" in js
    assert "Map layer playback" in js
    assert "Playback changes aggregate layer controls only" in js
    assert "law-count scan -> neutral tier map -> audit-review signal -> ontology peers -> inquiry topic view -> hosted smoke verification" in js
    assert "data-coverage-playback-action" in js
    assert "data-coverage-playback-stage" in js
    assert "Coverage animation uses aggregate artifact metadata only" in js
    assert "No ordinance text, source locators, review events, secrets, or legal findings" in js
    assert "renderMapLayerStepper" in js
    assert "mapLayerStepRows" in js
    assert "mapLayerStepButtonHtml" in js
    assert "applyMapLayerStep" in js
    assert "data-map-layer-step" in js
    assert "Layer step animation" in js
    assert "Tier -> Topic -> Function -> Score -> Audit" in js
    assert "scoreColor" in js
    assert "Neutral model-output layer; score direction remains unverified" in js
    assert "No ordinance text, source locators, browser model calls, API keys, rankings, or legal findings" in js
    assert "selectedUnitColorExplanationHtml" in js
    assert "selectedUnitColorExplanationRows" in js
    assert "selectedUnitColorExplanationRowHtml" in js
    assert "selectedColorQuestionFor" in js
    assert "selectedColorQuestionAnswer" in js
    assert "selectedColorQuestionSectionsHtml" in js
    assert "applySelectedColorQuestion" in js
    assert "data-selected-color-question" in js
    assert "Ask this lens" in js
    assert "Why this color?" in js
    assert "Color explanations use public aggregate counts and released LOCUS model outputs only" in js
    assert "not legal findings, rankings, controlling-law claims, source records, or ordinance excerpts" in js
    assert "LOCUS aggregate scan" in js
    assert "Map layer published" in js
    assert "Ontology/model layer" in js
    assert "Hosted route smoke" in js
    assert "data-coverage-timeline-action" in js
    assert "offlineRefreshMetricHtml" in js
    assert "refreshStatus" in js
    assert "data/analysis/refresh_status.json" in js
    assert "grokRefreshRunBadgeHtml" in js
    assert "safeRefreshRunUrl" in js
    assert "Latest offline refresh" in js
    assert "Open run" in js
    assert "Offline analysis freshness" in js
    assert "No browser model calls" in js
    assert "No key in public JavaScript" in js
    assert "frontdoorVisualPathQuestion" in js
    assert "frontdoorVisualPathStepHtml" in js
    assert "frontdoorExampleQuestionRows" in js
    assert "frontdoorExampleQuestionsHtml" in js
    assert "frontdoorExampleQuestionCardHtml" in js
    assert "frontdoorQuestionComposerHtml" in js
    assert "frontdoorQuestionMetricHtml" in js
    assert "frontdoorRoutePreviewStripHtml" in js
    assert "frontdoorRoutePreviewCards" in js
    assert "frontdoorRoutePreviewCardHtml" in js
    assert "applyFrontdoorRoutePreviewAction" in js
    assert "frontdoorTierConcentrationRouteHtml" in js
    assert "frontdoorTierConcentrationRows" in js
    assert "frontdoorTierConcentrationRowHtml" in js
    assert "frontdoorTierConcentrationUnitHtml" in js
    assert "applyFrontdoorTierConcentrationRoute" in js
    assert "frontdoorGrokInquiryPackCardHtml" in js
    assert "frontdoorGrokPackRouteHtml" in js
    assert "aiAnalysisRouteMiniMapHtml" in js
    assert "aiAnalysisRouteMiniMapContext" in js
    assert "frontdoorSavedRoutesHtml" in js
    assert "frontdoorSavedRouteCardHtml" in js
    assert "frontdoorRouteExportPayload" in js
    assert "frontdoorRouteExportItem" in js
    assert "exportFrontdoorSavedRoutes" in js
    assert "frontdoorRouteShareHtml" in js
    assert "frontdoorShareRoutePayload" in js
    assert "frontdoorShareRouteUrl" in js
    assert "encodeShareableRoutePayload" in js
    assert "decodeShareableRoutePayload" in js
    assert "readShareableRouteFromLocation" in js
    assert "applyPendingShareableRouteFromUrl" in js
    assert "applyShareableRoute" in js
    assert "shareFrontdoorSavedRoute" in js
    assert "evolocus-shareable-route-v1" in js
    assert "Share map link" in js
    assert "Share ontology link" in js
    assert "Loaded shared aggregate route" in js
    assert "restores only aggregate filters" in js
    assert "frontdoorVisualStoryPacketHtml" in js
    assert "frontdoorVisualStoryPacketPayload" in js
    assert "exportFrontdoorVisualStoryPacket" in js
    assert "applyFrontdoorVisualStoryAction" in js
    assert "importFrontdoorVisualStoryPacket" in js
    assert "frontdoorVisualStoryImportPayload" in js
    assert "saveFrontdoorVisualStoryPacketToGallery" in js
    assert "frontdoorVisualStoryRouteEntry" in js
    assert "frontdoorImportedStoryHtml" in js
    assert "applyImportedVisualStoryAction" in js
    assert "containsBlockedRoutePacketValues" in js
    assert "evolocus-imported-visual-story-v1" in js
    assert "evolocus-visual-story-packet-v1" in js
    assert "evolocus-visual-story-packet.json" in js
    assert "data-frontdoor-story-action" in js
    assert 'data-frontdoor-story-action="save"' in js
    assert "data-frontdoor-import-story" in js
    assert "data-frontdoor-imported-story-action" in js
    assert 'data-frontdoor-imported-story-action="save"' in js
    assert "Visual story packet" in js
    assert "Imported story ready" in js
    assert "Story packet ·" in js
    assert "imported + saved" in js
    assert "answer_text_included: false" in js
    assert "route_only: true" in js
    assert "frontdoorRouteImportHtml" in js
    assert "importFrontdoorSavedRoutes" in js
    assert "frontdoorRouteImportEntries" in js
    assert "containsBlockedRoutePacketKeys" in js
    assert "applyFrontdoorVisualPathAction" in js
    assert "applyFrontdoorExampleQuestion" in js
    assert "applyFrontdoorComposerAction" in js
    assert "applyFrontdoorSavedRoute" in js
    assert "mapQuestionLawLocationTrailHtml" in js
    assert "mapQuestionLawLocationTrailUnits" in js
    assert "mapQuestionLawLocationTrailStepHtml" in js
    assert "mapQuestionTierSummaryCardsHtml" in js
    assert "mapQuestionTierSummaryRows" in js
    assert "mapQuestionTierSummaryCardHtml" in js
    assert "applyMapQuestionTierSummary" in js
    assert "data-map-highlight-tier-summary" in js
    assert "Question result tier summary" in js
    assert "mapQuestionSignalSummaryHtml" in js
    assert "mapQuestionScoreSignalRows" in js
    assert "mapQuestionAuditSignalRows" in js
    assert "mapQuestionSignalCardHtml" in js
    assert "applyMapQuestionSignalSummary" in js
    assert "data-map-highlight-signal" in js
    assert "Question result score and audit signals" in js
    assert "County/town law-location route" in js
    assert "Tier-colored aggregate units matched by this question" in js
    assert "data-frontdoor-action" in js
    assert "data-frontdoor-composer" in js
    assert "data-frontdoor-composer-action" in js
    assert "data-frontdoor-route-preview" in js
    assert "Ask this map result routes" in js
    assert "Route previews use aggregate counts" in js
    assert "Law-tier concentration route" in js
    assert "Where are" in js
    assert "front-door law-tier concentration route" in js
    assert "data-frontdoor-tier-route-action" in js
    assert "data-frontdoor-tier-route-tier" in js
    assert "data-frontdoor-tier-route-unit" in js
    assert "Color tier map" in js
    assert "Step route" in js
    assert "data-frontdoor-grok-pack-card" in js
    assert "frontdoorLatestAnalysisRouteCardHtml" in js
    assert "frontdoorLatestAnalysisCard" in js
    assert "frontdoorLatestAnalysisFilterChips" in js
    assert "Latest analysis route" in js
    assert "data-frontdoor-latest-analysis-action" in js
    assert "applyFrontdoorLatestAnalysisAction" in js
    assert "Ask this map layer" in js
    assert "latest analysis ask-this-map-layer" in js
    assert "Color county/town map" in js
    assert "Graph ontology route" in js
    assert "Grok-refreshed inquiry pack" in js
    assert "Offline analysis routes are ready for the county/town map" in js
    assert "County/town route preview" in js
    assert "top matched geographies" in js
    assert "data-ai-route-mini-unit" in js
    assert "data-ai-route-mini-card" in js
    assert "applyAiAnalysisRouteMiniMapUnit" in js
    assert "handleAiRouteMiniMapKeydown" in js
    assert "full aggregate map" in js
    assert "data-frontdoor-route-action" in js
    assert "data-frontdoor-route-id" in js
    assert "data-frontdoor-export-routes" in js
    assert "data-frontdoor-import-routes" in js
    assert "data-frontdoor-example-action" in js
    assert "data-frontdoor-example-topic" in js
    assert "front-door topic-tier example" in js
    assert "front-door question composer" in js
    assert "data-frontdoor-disclosure" in js
    assert "Ask -&gt; Map -&gt; Ontology" in js
    assert "No browser Grok call" in js
    assert "Ask the aggregate map" in js
    assert "Front-door chat is deterministic filter routing" in js
    assert "Saved visual routes" in js
    assert "front-door saved route" in js
    assert "evolocus-frontdoor-routes.json" in js
    assert "evolocus-frontdoor-route-export-v1" in js
    assert "Route packet import failed" in js
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
    assert "selectedUnitQueryReplayHtml" in js
    assert "selectedUnitQueryReplayStepHtml" in js
    assert "selectedUnitRouteQuestion" in js
    assert "applySelectedUnitQueryRoute" in js
    assert "data-selected-query-route" in js
    assert "Selected-unit query replay" in js
    assert "Ask -> answer -> ontology for this county/town" in js
    assert "Route stores only aggregate filters" in js
    assert "selectedUnitOntologyAnswerCardsHtml" in js
    assert "selectedUnitOntologyAnswerCards" in js
    assert "selectedUnitOntologyAnswerCardHtml" in js
    assert "selectedUnitOntologyAnswerTargetUnits" in js
    assert "applySelectedUnitOntologyAnswerCard" in js
    assert "selectedUnitOntologyAnswerObject" in js
    assert "data-selected-ontology-answer-card" in js
    assert "data-selected-ontology-answer-action" in js
    assert "County/town ontology answer cards" in js
    assert "Ask this color mark through aggregate graph lenses" in js
    assert "Answer cards use aggregate unit counts" in js
    assert "selectedUnitOntologyQueryDrawerHtml" in js
    assert "selectedUnitOntologyQueryNodes" in js
    assert "selectedUnitOntologyQueryNodeHtml" in js
    assert "selectedUnitOntologyQueryPeerHtml" in js
    assert "applySelectedUnitOntologyQuery" in js
    assert "data-selected-ontology-query" in js
    assert "County/town ontology query drawer" in js
    assert "Turn this selected map unit into graph questions" in js
    assert "Node filters update the colored county/town map from aggregate counts only" in js
    assert "selectedUnitDisclosureStepHtml" in js
    assert "selectedUnitMapOntologyRouteHtml" in js
    assert "selectedUnitMapOntologyRouteStages" in js
    assert "selectedUnitMapOntologyRouteStageHtml" in js
    assert "openSelectedUnitOntologyRoute" in js
    assert "data-selected-route-open" in js
    assert "selectedUnitOntologyRouteComparisonOverlayHtml" in js
    assert "selectedUnitOntologyRouteComparisonRows" in js
    assert "selectedUnitOntologyRouteComparisonRowHtml" in js
    assert "selectedUnitRouteComparisonProvenance" in js
    assert "data-route-comparison-peer" in js
    assert "data-route-comparison-ontology" in js
    assert "Ontology route comparison overlay" in js
    assert "Selected unit vs strongest aggregate peer" in js
    assert "not a ranking, legal finding, source record" in js
    assert "Map-to-ontology route" in js
    assert "How this selected color reaches the graph" in js
    assert "Route stages pass only aggregate unit IDs" in js
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
    assert "inquiryAnswerFreshnessHtml" in js
    assert "inquiry-answer-route-source" in js
    assert "Route source:" in js
    assert "inquiryAnswerFreshnessBadgeHtml" in js
    assert "inquiryAnswerQuestionMapCardsHtml" in js
    assert "inquiryAnswerTierColorRows" in js
    assert "applyInquiryAnswerMapAction" in js
    assert "openInquiryAnswerMapUnit" in js
    assert "inquiryAnswerFilterChipsHtml" in js
    assert "inquiryAnswerFilterChipRows" in js
    assert "inquiryAnswerFilterChipHtml" in js
    assert "applyInquiryAnswerFilterChip" in js
    assert "Answer ontology filter chips" in js
    assert "Progressively narrow the county/town map." in js
    assert "Chips apply aggregate topic/function/tier/unit context" in js
    assert "answer ontology filter chip" in js
    assert "Question-to-map answer cards" in js
    assert "Color counties and towns from this answer." in js
    assert "Tier color explanation" in js
    assert "data-inquiry-answer-filter-chip" in js
    assert "data-inquiry-answer-map-action" in js
    assert "data-inquiry-answer-map-unit" in js
    assert "Answer provenance" in js
    assert "Grok-refreshed offline" in js
    assert "No browser model call. No ordinance text, headers, source locators, review events, or secrets" in js
    assert "inquiryAnswerOntologyMiniMapHtml" in js
    assert "inquiryAnswerOntologyNodes" in js
    assert "inquiryAnswerOntologyNodeSvg" in js
    assert "inquiryAnswerOntologyDrawerHtml" in js
    assert "inquiryAnswerOntologyDrawerRows" in js
    assert "inquiryAnswerOntologyDrawerRowHtml" in js
    assert "applyInquiryAnswerOntologyAction" in js
    assert "applyInquiryOntologyDrawerOpen" in js
    assert "data-inquiry-answer-ontology-action" in js
    assert "data-inquiry-drawer-unit" in js
    assert "data-inquiry-drawer-open" in js
    assert "County/town comparison drawer" in js
    assert "Drawer rows compare public aggregate units only" in js
    assert "Ontology mini-map" in js
    assert "Mini-map edges summarize aggregate model-output fields" in js
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
    assert "mapTierLegendDrilldownHtml" in js
    assert "mapTierLegendDrilldownRows" in js
    assert "mapTierLegendDrilldownCardHtml" in js
    assert "applyMapTierLegendDrilldown" in js
    assert "County/town tier color drilldown" in js
    assert "Explain the visible map colors." in js
    assert "Tier colors are neutral model-output review bands" in js
    assert "map tier legend drilldown" in js
    assert "data-map-tier-drilldown" in js
    assert "mapCrossFilterLegendHtml" in js
    assert "crossFilterCountRows" in js
    assert "crossFilterTierRows" in js
    assert "mapCrossFilterGroupHtml" in js
    assert "mapCrossFilterRowHtml" in js
    assert "applyMapCrossFilterLegend" in js
    assert "data-map-cross-filter" in js
    assert "map cross-filter legend" in js
    assert "Cross-filter legend" in js
    assert "Visible topic, function, and tier routes" in js
    assert "Rows apply browser map filters from aggregate counts only" in js
    assert "map-tier-drilldown" in css
    assert "map-tier-drilldown-card" in css
    assert "map-tier-drilldown-actions" in css
    assert "map-cross-filter-legend" in css
    assert "map-cross-filter-grid" in css
    assert "map-cross-filter-row" in css
    assert "topic-playback-presets-card" in css
    assert "topic-playback-grid" in css
    assert "topic-playback-row" in css
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
    assert "renderMapRouteReplay" in js
    assert "mapRouteReplayCardHtml" in js
    assert "data-map-route-replay-answer" in js
    assert "data-map-route-replay-map" in js
    assert "data-map-route-replay-ontology" in js
    assert "Map route playback restores only aggregate browser state" in js
    assert "renderMapInlineInquiry" in js
    assert "map-question-highlight" in html
    assert "inquiryMapHighlight" in js
    assert "renderMapQuestionHighlight" in js
    assert "inquiryMapHighlightFromPlan" in js
    assert "inquiryMapHighlightFromVisibleUnits" in js
    assert "setInquiryMapHighlightFromPlan" in js
    assert "questionOntologyRouteFromPlan" in js
    assert "questionOntologyRouteFromUnits" in js
    assert "normalizedQuestionOntologyRoute" in js
    assert "questionOntologyRouteHtml" in js
    assert "applyQuestionOntologyRoute" in js
    assert "evolocus-question-ontology-route-v1" in js
    assert "Ontology-backed route" in js
    assert "data-question-ontology-open" in js
    assert "ontology_route" in js
    assert "normalizedInquiryMapHighlight" in js
    assert "question_highlight" in js
    assert "evolocus-question-map-highlight-v1" in js
    assert "data-clear-inquiry-map-highlight" in js
    assert "Chat-to-map highlight" in js
    assert "mapQuestionHighlightDetailCardsHtml" in js
    assert "mapQuestionHighlightDetailCardHtml" in js
    assert "mapQuestionHighlightUnitReasons" in js
    assert "mapQuestionHighlightDepthHtml" in js
    assert "mapQuestionHighlightDepthStages" in js
    assert "mapQuestionHighlightDepthStageHtml" in js
    assert "applyMapQuestionHighlightDepthStage" in js
    assert "data-map-highlight-depth-stage" in js
    assert "Question-to-map ontology highlight depth" in js
    assert "Depth stages summarize aggregate route coverage only" in js
    assert "mapQuestionHighlightOntologyTraceHtml" in js
    assert "mapQuestionHighlightOntologyTraceNodes" in js
    assert "Why highlighted county/town units matched" in js
    assert "Why this unit matched is a public aggregate navigation explanation" in js
    assert "Highlighted-unit ontology trace" in js
    assert "Aggregate route nodes only" in js
    assert "not legal authority" in js
    assert "browser-side Grok call" in js
    assert "browser_model_call: false" in js
    assert "map-question-highlight-card" in css
    assert "map-question-highlight-metrics" in css
    assert "map-question-highlight-details" in css
    assert "map-question-highlight-detail-card" in css
    assert "map-question-highlight-depth" in css
    assert "map-question-highlight-depth-grid" in css
    assert "map-question-highlight-depth-stage" in css
    assert "map-question-highlight-reasons" in css
    assert "map-question-highlight-ontology-trace" in css
    assert "map-question-highlight-ontology-node" in css
    assert "map-question-tier-summary" in css
    assert "map-question-tier-summary-card" in css
    assert "map-question-signal-summary" in css
    assert "map-question-signal-card" in css
    assert "question-ontology-route" in css
    assert "question-ontology-route-nodes" in css
    assert "question-ontology-route-actions" in css
    assert "map-unit.inquiry-hit" in css
    assert "map-unit.inquiry-muted" in css
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
    assert "selectedUnitPeerComparisonDrawerHtml" in js
    assert "County/town peer comparison drawer" in js
    assert "Rows compare aggregate map units only." in js
    assert "tierColorForLabel" in js
    assert "tierKeyForLabel" in js
    assert "openTierOntology" in js
    assert "ontologyQueryPresetsHtml" in js
    assert "ontologyQueryPresetCards" in js
    assert "ontologyQueryPresetCardHtml" in js
    assert "applyOntologyQueryPreset" in js
    assert "data-ontology-query-preset" in js
    assert "ontologyMapPresetHtml" in js
    assert "ontologyMapPresetCards" in js
    assert "ontologyMapPresetCardHtml" in js
    assert "applyOntologyMapPreset" in js
    assert "data-ontology-map-preset" in js
    assert "Ontology-to-map visuals" in js
    assert "Color counties and towns from ontology cues." in js
    assert "Open colored map" in js
    assert "Ask + map" in js
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
    assert "geographyPeerLinkExplanationHtml" in js
    assert "geographyPeerLinkExplanationRows" in js
    assert "peerLinkReasonCounts" in js
    assert "geographyPeerLinkExplanationCardHtml" in js
    assert "Peer link explainer" in js
    assert "Peer links are aggregate navigation cues from public map metadata" in js
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
    assert "inquiry-map-composer" in html
    assert "Question to map filter composer" in html
    assert "renderInquiryMapComposer" in js
    assert "inquiryMapComposerPlan" in js
    assert "inquiryMapComposerHtml" in js
    assert "inferQuestionState" in js
    assert "inferQuestionScoreField" in js
    assert "applyInquiryMapComposerAction" in js
    assert "data-inquiry-map-composer-action" in js
    assert "Composer previews aggregate map filters and ontology nodes only" in js
    assert "No live browser LLM calls" in js
    assert "inquiry-map-composer-card" in css
    assert "inquiry-map-composer-preview" in css
    assert "inquiry-map-composer-metrics" in css
    assert "inquiry-map-composer-chips" in css
    assert "inquiry-answer-filter-chips" in css
    assert "inquiry-answer-filter-chip" in css
    assert "inquiry-answer-map-cards" in css
    assert "inquiry-answer-tier-row" in css
    assert "inquiry-answer-map-unit-row" in css
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
    assert "inquiryRouteComparisonHtml" in js
    assert "inquiryRouteComparisonCardHtml" in js
    assert "inquiryRouteComparisonBarHtml" in js
    assert "inquiryRouteComparisonStageStripHtml" in js
    assert "inquiryRouteComparisonStages" in js
    assert "inquiryRouteComparisonStageHtml" in js
    assert "routeComparisonDelta" in js
    assert "Route comparison" in js
    assert "Map-to-Inquiry route ladder" in js
    assert "No text, locators, review events, or browser model calls" in js
    assert "neutral model scores" in js
    assert "Compared against newest saved route" in js
    assert "not legal rankings or civic findings" in js
    assert "renderInquiryRouteReplay" in js
    assert "inquiryRouteReplayCardHtml" in js
    assert "inquiryRouteStepHtml" in js
    assert "inquiryRouteOntologyLabel" in js
    assert "data-open-inquiry-log-ontology" in js
    assert "Open ontology path" in js
    assert "Question routes restore browser state only" in js
    assert "geography_color_mode" in js
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
    assert "ontologyPathControlStages" in js
    assert "ontologyPathControlStageHtml" in js
    assert "applyOntologyPathStage" in js
    assert "selectedOntologyNeighborFilter" in js
    assert "selectedUnitOntologyNeighborFilterControlsHtml" in js
    assert "selectedUnitFilteredPeers" in js
    assert "applySelectedNeighborFilter" in js
    assert "data-ontology-path-stage" in js
    assert "data-selected-neighbor-filter" in js
    assert "Map-to-ontology animation controls" in js
    assert "Map-side ontology neighborhood filters" in js
    assert "Controls focus aggregate map-to-ontology stages only" in js
    assert "ontologyPathStepHtml" in js
    assert "selectedUnitOntologyNodes" in js
    assert "ontologyNodeSvg" in js
    assert "ontology-neighborhood-svg" in css
    assert "ontology-path-controls" in css
    assert "ontology-path-control" in css
    assert "ontology-path-control.active" in css
    assert "ontology-path-strip.controlled" in css
    assert "selected-neighbor-filter-controls" in css
    assert "selected-neighbor-peer-strip" in css
    assert "selected-neighbor-peer-row" in css
    assert "ontology-path-step.active" in css
    assert "ontology-path-boundary" in css
    assert "ontology-path-strip" in css
    assert "ontology-path-step" in css
    assert "ontologyPathSweep" in css
    assert "prefers-reduced-motion" in css
    assert "package-ontology-lane" in css
    assert "package-ontology-bars" in css
    assert "selected-disclosure-trail" in css
    assert "selected-map-ontology-route" in css
    assert "selected-query-replay" in css
    assert "selected-query-steps" in css
    assert "selected-query-actions" in css
    assert "selected-ontology-query-drawer" in css
    assert "selected-ontology-query-nodes" in css
    assert "selected-ontology-query-peer" in css
    assert "selected-route-stage" in css
    assert "selected-route-boundary" in css
    assert "selected-route-comparison-overlay" in css
    assert "selected-route-comparison-row" in css
    assert "selected-route-comparison-actions" in css
    assert "selected-route-comparison-boundary" in css
    assert "analysis-journey" in css
    assert "analysis-journey-step" in css
    assert "analysis-journey-boundary" in css
    assert "frontdoor-visual-path-card" in css
    assert "frontdoor-tier-route" in css
    assert "frontdoor-tier-route-focus" in css
    assert "frontdoor-tier-route-bars" in css
    assert "frontdoor-tier-route-units" in css
    assert "frontdoor-question-composer" in css
    assert "frontdoor-question-actions" in css
    assert "frontdoor-question-metrics" in css
    assert "frontdoor-route-preview-strip" in css
    assert "frontdoor-route-preview-card" in css
    assert "frontdoor-grok-pack-card" in css
    assert "frontdoor-latest-analysis-card" in css
    assert "frontdoor-latest-analysis-actions" in css
    assert "frontdoor-grok-pack-route" in css
    assert "ai-route-mini-map" in css
    assert "ai-route-mini-county" in css
    assert "ai-route-mini-town" in css
    assert "ai-route-mini-county:hover" in css
    assert "ai-route-mini-town:focus-visible" in css
    assert "cursor: pointer" in css
    assert "frontdoor-saved-routes" in css
    assert "frontdoor-saved-route" in css
    assert "frontdoor-saved-actions" in css
    assert "frontdoor-saved-export-card" in css
    assert "frontdoor-route-share-card" in css
    assert "frontdoor-route-share-actions" in css
    assert "frontdoor-route-import" in css
    assert "frontdoor-story-packet" in css
    assert "frontdoor-story-metrics" in css
    assert "frontdoor-story-path" in css
    assert "frontdoor-story-import" in css
    assert "frontdoor-imported-story" in css
    assert "frontdoor-step-card" in css
    assert "frontdoor-example-questions" in css
    assert "frontdoor-example-card" in css
    assert "frontdoor-example-actions" in css
    assert "frontdoor-disclosure-button" in css
    assert "frontdoor-visual-path-boundary" in css
    assert "offline-refresh-freshness-card" in css
    assert "offline-refresh-grid" in css
    assert "offline-refresh-boundary" in css
    assert "inquiry-answer-freshness" in css
    assert "inquiry-answer-route-source" in css
    assert "inquiry-answer-freshness-heading" in css
    assert "inquiry-answer-freshness-grid" in css
    assert "selected-disclosure-step" in css
    assert "selected-ontology-drilldown" in css
    assert "ontology-query-presets" in css
    assert "ontology-query-grid" in css
    assert "ontology-query-card" in css
    assert "ontology-map-presets" in css
    assert "ontology-map-preset-grid" in css
    assert "ontology-map-preset-card" in css
    assert "ontology-map-preset-actions" in css
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
    assert "map-route-replay-card" in css
    assert "map-route-row" in css
    assert "map-route-scale" in css
    assert "map-route-actions" in css
    assert "map-inline-inquiry-card" in css
    assert "map-inline-chat-answer" in css
    assert "map-inline-inquiry-history" in css
    assert "map-inline-history-row" in css
    assert "map-inline-comparison-strip" in css
    assert "map-inline-comparison-row" in css
    assert "ontology-tier-focus" in css
    assert "ontology-tier-focus-metrics" in css
    assert "ontologyTierNeighborhoodHtml" in js
    assert "ontologyTierNeighborhoodNodeHtml" in js
    assert "ontologyTierScoreNeighborhoodNodes" in js
    assert "ontologyTierCountyTownDrilldownHtml" in js
    assert "ontologyTierDrilldownUnitRowHtml" in js
    assert "applyOntologyTierDrilldown" in js
    assert "highlightOntologyTierOnMap" in js
    assert "data-tier-drilldown-action" in js
    assert "County/town tier drilldown" in js
    assert "ontology county/town tier drilldown" in js
    assert "data-tier-neighborhood-filter" in js
    assert "data-tier-neighborhood-score" in js
    assert "data-tier-neighborhood-map" in js
    assert "Tier neighborhood graph" in js
    assert "Neighborhood nodes are aggregate visual routes" in js
    assert "ontology tier neighborhood" in js
    assert "ontology-tier-drilldown" in css
    assert "ontology-tier-drilldown-unit" in css
    assert "ontology-tier-neighborhood" in css
    assert "ontology-tier-neighborhood-grid" in css
    assert "ontology-tier-neighborhood-center" in css
    assert "ontology-tier-neighborhood-node" in css
    assert "ontology-tier-mini-charts" in css
    assert "ontology-tier-mini-bar" in css
    assert "button.ontology-tier-mini-bar" in css
    assert "chart-drilldown-row" in css
    assert "chart-drilldown-row.disabled" in css
    assert "chart-drilldown-note" in css
    assert "chart-drilldown-line" in css
    assert "chart-inquiry-card" in css
    assert "chart-question-chip-card" in css
    assert "chart-question-chip-grid" in css
    assert "chart-question-chip" in css
    assert "chart-question-chip-wrap" in css
    assert "chart-question-share" in css
    assert "chart-route-legend-card" in css
    assert "chart-route-strip" in css
    assert "chart-route-stage" in css
    assert "chart-route-actions" in css
    assert "chart-route-share-card" in css
    assert "chart-route-share-actions" in css
    assert "chartRoutePulse" in css
    assert "chart-inquiry-actions" in css
    assert "chart-inquiry-chip" in css
    assert "chart-ontology-chip" in css
    assert "top-unit-list-row > button" in css
    assert "top-unit-list-row" in css
    assert "state-topic-actions" in css
    assert "topic-strip-row:hover" in css
    assert "package-map-actions" in css
    assert "checkbox-filter" in css
    assert "package-hit-badge" in css
    assert "selected-package-card" in css
    assert "selectedUnitPeerComparisonHtml" in js
    assert "selectedUnitPeerComparisonRows" in js
    assert "selectedUnitPeerComparisonMetricHtml" in js
    assert "selectedUnitPeers" in js
    assert "scoreDeltaSummary" in js
    assert "selectedUnitOntologyRouteComparisonOverlayHtml" in js
    assert "selectedUnitRouteComparisonRow" in js
    assert "selectedUnitRouteComparisonProvenance" in js
    assert "selected-peer-card" in css
    assert "selected-peer-comparison-drawer" in css
    assert "selected-peer-comparison-row" in css
    assert "selected-peer-comparison-boundary" in css
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
    assert "inquiry-answer-ontology-map" in css
    assert "inquiry-answer-ontology-svg" in css
    assert "inquiry-answer-ontology-actions" in css
    assert "inquiry-answer-ontology-chip" in css
    assert "inquiry-answer-ontology-drawer" in css
    assert "inquiry-answer-ontology-drawer-row" in css
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
    assert "inquiry-route-comparison" in css
    assert "inquiry-route-comparison-grid" in css
    assert "inquiry-route-comparison-card" in css
    assert "inquiry-route-stage-strip" in css
    assert "inquiry-route-stage-grid" in css
    assert "inquiry-route-stage" in css
    assert "inquiry-route-replay-card" in css
    assert "inquiry-route-grid" in css
    assert "inquiry-route-card" in css
    assert "inquiry-route-steps" in css
    assert "inquiry-route-actions" in css
    assert "latestArtifactChangePanelHtml" in js
    assert "latestArtifactChangeRows" in js
    assert "artifactRefreshTimelineHtml" in js
    assert "artifactRefreshTimelineRows" in js
    assert "artifactRefreshTimelineRowHtml" in js
    assert "artifactTimestampDeltaLabel" in js
    assert "Refresh timeline" in js
    assert "Timeline entries compare current public aggregate artifact timestamps" in js
    assert "artifactLineageVisualHtml" in js
    assert "artifactLineageRows" in js
    assert "artifactLineageRowHtml" in js
    assert "Artifact lineage" in js
    assert "Which public files power each visual surface." in js
    assert "Lineage shows public aggregate artifacts only." in js
    assert "data-artifact-lineage-tab" in js
    assert "artifactChangeRowHtml" in js
    assert "latestArtifactTimestamp" in js
    assert "Current refresh metadata only; no stored snapshot loaded." in js
    assert "Rows summarize public aggregate artifacts only." in js
    assert "artifactFreshnessSnapshotDelta" in js
    assert "Since snapshot" in js
    assert "snapshot-delta" in js
    assert "No row text, source locators, local databases, exports, or legal findings" in js
    assert "artifact-change-card" in css
    assert "artifact-change-grid" in css
    assert "artifact-change-row" in css
    assert "artifact-refresh-timeline" in css
    assert "artifact-refresh-timeline-strip" in css
    assert "artifact-refresh-timeline-row" in css
    assert "artifact-refresh-track" in css
    assert "artifact-lineage-visual" in css
    assert "artifact-lineage-flow" in css
    assert "artifact-lineage-grid" in css
    assert "artifact-lineage-row" in css
    assert "artifact-freshness-grid span.snapshot-delta" in css
    assert "artifact-freshness-grid .snapshot-delta em" in css
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
    assert "ontology-build-status" in html
    assert "ontologyBuildStatusHtml" in js
    assert "ontologyBuildCardHtml" in js
    assert "modelImportStatusHtml" in js
    assert "modelImportCardHtml" in js
    assert "modelOutputCardHtml" in js
    assert "applyModelStatusAction" in js
    assert "data-model-status-action" in js
    assert "Model import status" in js
    assert "Released model outputs, not browser inference." in js
    assert "HF model imports" in js
    assert "Score direction" in js
    assert "Model cards are pending verification" in js
    assert "Ontology build status" in js
    assert "Graph freshness and artifact provenance." in js
    assert "ontology.json + models.json" in js
    assert "No ordinance text, headers, source locators, databases, exports, local paths, or secrets." in js
    assert "data-ontology-action=\"open-status\"" in js
    assert "ontology-build-status" in css
    assert "ontology-build-flow" in css
    assert "ontology-build-grid" in css
    assert "ontology-build-boundary-grid" in css
    assert "model-import-status" in css
    assert "model-import-flow" in css
    assert "model-import-grid" in css
    assert "model-output-grid" in css
    assert "model-output-card.score" in css
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
    assert "map-layer-stepper-grid" in css
    assert "map-layer-step-button" in css
    assert "score-gradient" in css
    assert "selected-color-explanation-grid" in css
    assert "selected-color-card" in css
    assert "selected-color-row" in css
    assert "selected-color-ask" in css
    assert "geo-layer-link-list" in css
    assert "geo-peer-explainer" in css
    assert "geo-peer-explainer-grid" in css
    assert "geo-layer-boundary" in css
    assert "geography-ontology-link" in css
    assert "geography-ontology-detail" in css
    assert "artifact-freshness-card" in css
    assert "artifact-freshness-grid" in css
    assert "coverage-timeline-card" in css
    assert "coverage-timeline-rail" in css
    assert "coverage-timeline-stage" in css
    assert "coverage-playback" in css
    assert "coverage-playback-steps" in css
    assert "coverage-playback-step" in css
    assert "coverageTimelineSweep" in css
    assert "coverageTimelinePulse" in css
    assert "selected-ontology-answer-cards" in css
    assert "selected-ontology-answer-grid" in css
    assert "selected-ontology-answer-card" in css
    assert "map-refresh-source-card" in css
    assert "publication_gates" in js
    assert "status-action-grid" in html
    assert "ACTIONS_REFRESH_WORKFLOW_URL" in js
    assert "actions/workflows/analysis-refresh.yml" in js
    assert "actionsBriefingRefreshHtml" in js
    assert "Open refresh workflow" in js
    assert "aiAnalysisPack" in js
    assert "data/analysis/ai_analysis_pack.json" in js
    assert "renderAiAnalysisPack" in js
    assert "aiAnalysisPackCardHtml" in js
    assert "applyAiAnalysisPackCard" in js
    assert "data-ai-analysis-card" in js
    assert "Offline AI analysis pack" in js
    assert "Ask, color, and graph the current aggregate analysis." in js
    assert "ai-analysis-pack" in html
    assert "actions-briefing-refresh" in css
    assert "grok-refresh-run-badge" in css
    assert "grok-refresh-run-grid" in css
    assert "ai-analysis-pack-card" in css
    assert "ai-analysis-pack-grid" in css
    assert "ai-analysis-card-actions" in css
    assert "primary-action-link" in css
    assert "artifactSnapshot" in js
    assert "currentArtifactSnapshotMetrics" in js
    assert "artifactMetricDelta" in js
    assert "artifactDeltaSummary" in js
    assert "Compared with stored snapshot" in js
    assert "snapshot baseline unavailable" in js
    assert "artifact-change-row small" in css
    assert "stateSummaries" in js
    assert "chartMapFilterEnabled" in js
    assert "applyChartMapFilter" in js
    assert "applyChartStateTopicFilter" in js
    assert "setChartBrushHighlight" in js
    assert "chartBrushQuestion" in js
    assert "openChartUnitOnMap" in js
    assert "charts tab brush" in js
    assert "Brush chart topic" in js
    assert "brush/filter the Law Map" in js
    assert "chartInquiryCard" in js
    assert "chartRouteLegendCard" in js
    assert "chartQuestionChipsCard" in js
    assert "chartQuestionChipRows" in js
    assert "chartQuestionChipHtml" in js
    assert "applyChartQuestionChip" in js
    assert "shareChartQuestionChip" in js
    assert "Chart-to-chat question chips" in js
    assert "Reusable questions from current aggregate charts." in js
    assert "Question chips are generated from visible aggregate chart rows" in js
    assert "renderVisualRouteVerification" in js
    assert "visualRouteMetricHtml" in js
    assert "visualRoutePolicyChipHtml" in js
    assert "Visual route verified" in js
    assert "Open smoke run" in js
    assert "visual-route-verification-card" in css
    assert "visual-route-path" in css
    assert "chartRouteTarget" in js
    assert "chartRouteStageHtml" in js
    assert "applyChartRouteLegend" in js
    assert "chartRouteShareHtml" in js
    assert "chartPresetFilters" in js
    assert "chartPresetRouteItem" in js
    assert "shareChartPresetRoute" in js
    assert "chartInquiryButton" in js
    assert "applyChartInquiryAction" in js
    assert "applyChartUnitInquiry" in js
    assert "chartInquiryQuestion" in js
    assert "chartOntologyButton" in js
    assert "applyChartOntologyAction" in js
    assert "applyChartUnitOntology" in js
    assert "focusChartOntologyTier" in js
    assert "data-chart-map-filter" in js
    assert "data-chart-map-value" in js
    assert "data-chart-map-label" in js
    assert "data-chart-map-unit" in js
    assert "data-chart-state-map" in js
    assert "data-chart-topic-map" in js
    assert "data-chart-state-topic-map" in js
    assert "data-chart-inquiry-action" in js
    assert "data-chart-inquiry-value" in js
    assert "data-chart-inquiry-state" in js
    assert "data-chart-inquiry-label" in js
    assert "data-chart-question-chip" in js
    assert "data-chart-question-share" in js
    assert "data-chart-question-value" in js
    assert "data-chart-question-state" in js
    assert "data-chart-question-label" in js
    assert "data-chart-ontology-action" in js
    assert "data-chart-ontology-value" in js
    assert "data-chart-ontology-state" in js
    assert "data-chart-ontology-label" in js
    assert "data-chart-route-action" in js
    assert "Share map route" in js
    assert "Share graph route" in js
    assert "Shareable chart/filter route" in js
    assert "charts tab shareable route" in js
    assert "Progressive chart route" in js
    assert "Chart -> Map -> Inquiry -> Ontology" in js
    assert "Animated chart route legend" in js
    assert "Open map route" in js
    assert "Graph route" in js
    assert "Ask this chart view" in js
    assert "Ask score profile" in js
    assert "Open current ontology" in js
    assert "Graph top topic" in js
    assert "Open model graph" in js
    assert "charts tab aggregate ask" in js
    assert "Click a row to brush/filter the Law Map, or Ask to open a deterministic Inquiry answer. This changes browser state only." in js
    assert "Inquiry answers are generated from published aggregate JSON artifacts" in js
    assert "Topic bars and state cards can route back to the Law Map using aggregate filters only." in js
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
    artifact_snapshot = json.loads(read_text("site/data/analysis/artifact_snapshot.json"))
    visual_smoke = json.loads(read_text("site/data/analysis/visual_smoke.json"))
    refresh_status = json.loads(read_text("site/data/analysis/refresh_status.json"))
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
    assert models["import_policy"]["hf_model_downloads"] == "deferred_until_model_cards_are_verified"
    assert models["import_policy"]["score_direction"] == "unverified"
    assert models["grok"]["forbidden_use"] == "embedding the key in GitHub Pages JavaScript"
    assert len(models["models"]) == 7
    assert {model["output_field"] for model in models["models"]} >= {
        "is_substantive",
        "function",
        "topic",
        "enforcement_discretion",
        "opacity",
        "paternalism",
        "problem_salience",
    }
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
    assert artifact_snapshot["schema_version"] == "evolocus-artifact-snapshot-v1"
    assert artifact_snapshot["publication_policy"]["raw_rows_included"] is False
    assert artifact_snapshot["publication_policy"]["ordinance_text_included"] is False
    assert artifact_snapshot["publication_policy"]["record_locator_values_included"] is False
    assert artifact_snapshot["metrics"]["unit_count"] == status["unit_count"]
    assert artifact_snapshot["metrics"]["law_count"] == status["law_count"]
    assert visual_smoke["schema_version"] == "evolocus-visual-route-smoke-v1"
    assert visual_smoke["real_locus_rows_published"] is False
    assert visual_smoke["workflow_file"] == "pages-browser-smoke.yml"
    assert visual_smoke["status"] == "success"
    assert visual_smoke["verified_route"]["name"] == "Chart -> Map -> Inquiry -> Ontology"
    assert visual_smoke["run_url"].startswith("https://github.com/evcatalyst/evolocus/actions/runs/")
    assert visual_smoke["publication_policy"]["raw_rows_included"] is False
    assert visual_smoke["publication_policy"]["ordinance_text_included"] is False
    assert visual_smoke["publication_policy"]["record_locator_values_included"] is False
    assert visual_smoke["publication_policy"]["browser_llm_calls"] is False
    assert visual_smoke["publication_policy"]["secrets_included"] is False
    assert visual_smoke["publication_policy"]["legal_findings"] is False
    assert refresh_status["schema_version"] == "evolocus-actions-refresh-status-v1"
    assert refresh_status["workflow_file"] == "analysis-refresh.yml"
    assert refresh_status["run_url"].startswith("https://github.com/evcatalyst/evolocus/actions/runs/")
    assert refresh_status["conclusion"] in {"success", "success_if_pages_deploys"}
    assert refresh_status["artifacts"]["inquiry_briefings"]["grok_used"] is True
    assert refresh_status["artifacts"]["question_pack"]["grok_used"] is True
    assert refresh_status["publication_policy"]["raw_rows_included"] is False
    assert refresh_status["publication_policy"]["ordinance_text_included"] is False
    assert refresh_status["publication_policy"]["record_locator_values_included"] is False
    assert refresh_status["publication_policy"]["browser_llm_calls"] is False
    assert refresh_status["publication_policy"]["secrets_included"] is False
    assert refresh_status["publication_policy"]["legal_findings"] is False
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
            "artifact_snapshot": artifact_snapshot,
            "visual_smoke": visual_smoke,
            "refresh_status": refresh_status,
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
    assert "persist_artifacts" in workflow
    assert "contents: write" in workflow
    assert "secrets.GROK_API_KEY" in workflow
    assert "secrets.Grok_api_key" in workflow
    assert "GROK_API_KEY_ALIAS" in workflow
    assert "publish-inquiry-briefings" in workflow
    assert "publish-question-pack" in workflow
    assert "publish-ai-analysis-pack" in workflow
    assert "question_pack.json" in workflow
    assert "ai_analysis_pack.json" in workflow
    assert "refresh_status.json" in workflow
    assert "Write public refresh status" in workflow
    assert "validate-public-artifacts" in workflow
    assert "git add site/data/analysis/inquiry_briefings.json site/data/analysis/question_pack.json site/data/analysis/ai_analysis_pack.json site/data/analysis/refresh_status.json" in workflow
    assert "git diff --cached --name-only" in workflow
    assert "Unexpected staged path" in workflow
    assert "site/data/analysis/inquiry_briefings.json|site/data/analysis/question_pack.json|site/data/analysis/ai_analysis_pack.json|site/data/analysis/refresh_status.json" in workflow
    assert "chore: refresh aggregate inquiry artifacts [skip ci]" in workflow
    assert 'git push origin "HEAD:${GITHUB_REF_NAME}"' in workflow
    assert "actions/upload-pages-artifact@v3" in workflow
    assert "publish-analysis" not in workflow
    assert "data/raw" not in workflow
    assert "data/processed" not in workflow
    assert "data/evaluation" not in workflow
    assert "data/exports" not in workflow
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
