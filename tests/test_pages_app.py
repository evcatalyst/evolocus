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
    assert "analysis-journey" in html
    assert "frontdoor-visual-path" in html
    assert "visual-route-verification" in html
    assert "offline-refresh-freshness" in html
    assert "coverage-timeline" in html
    assert "Real-data coverage timeline animation" in html
    assert "Aggregate analysis journey" in html
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
    assert "Topic and tier question pathways" in html
    assert "inquiry-pathway-grid" in html
    assert "Aggregate inquiry results log" in html
    assert "inquiry-results-log" in html
    assert "inquiry-route-replay" in html
    assert "Question-to-map replay paths" in html
    assert "package-map-summary" in html
    assert "map-reading-guide" in html
    assert "map-route-replay" in html
    assert "map-inline-inquiry" in html
    assert "map-question-law-location-trail" in css
    assert "map-freshness-badge" in html
    assert "map-refresh-source" in html
    assert "status-artifact-change-panel" in html
    assert "inquiry-freshness-badge" in html
    assert "ontology-tier-focus" in html
    assert "ontology-query-presets" in html
    assert "model-import-status" in html
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
    assert "renderAnalysisJourney" in js
    assert "renderFrontdoorVisualPath" in js
    assert "renderVisualRouteVerification" in js
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
    assert "frontdoorSavedRoutesHtml" in js
    assert "frontdoorSavedRouteCardHtml" in js
    assert "frontdoorRouteExportPayload" in js
    assert "frontdoorRouteExportItem" in js
    assert "exportFrontdoorSavedRoutes" in js
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
    assert "County/town law-location route" in js
    assert "Tier-colored aggregate units matched by this question" in js
    assert "data-frontdoor-action" in js
    assert "data-frontdoor-composer" in js
    assert "data-frontdoor-composer-action" in js
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
    assert "snapshotPackageSummary" in js
    assert "snapshotPackageComparisonHtml" in js
    assert "data/analysis/question_pack.json" in js
    assert "data/analysis/artifact_snapshot.json" in js
    assert "data/analysis/visual_smoke.json" in js
    assert "artifactSnapshot" in js
    assert "visualSmoke" in js
    assert "currentArtifactSnapshotMetrics" in js
    assert "artifactMetricDelta" in js
    assert "artifactDeltaSummary" in js
    assert "Compared with stored snapshot" in js
    assert "snapshot baseline unavailable" in js
    assert "questionPackPromptCards" in js
    assert "applyQuestionPackPrompt" in js
    assert "data-inquiry-pack" in js
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
    assert "setChartBrushHighlight" in js
    assert "chartBrushQuestion" in js
    assert "openChartUnitOnMap" in js
    assert "charts tab brush" in js
    assert "Brush chart topic" in js
    assert "brush/filter the Law Map" in js
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
    assert "map-unit${selected}${packageClass}${inquiryClass}" in js
    assert "browser-side Grok call" in js
    assert "browser_model_call: false" in js
    assert "map-question-highlight-card" in css
    assert "map-question-highlight-metrics" in css
    assert "question-ontology-route" in css
    assert "question-ontology-route-nodes" in css
    assert "question-ontology-route-actions" in css
    assert "map-unit.inquiry-hit" in css
    assert "map-unit.inquiry-muted" in css
    assert "renderMapRefreshSource" in js
    assert "lastRefreshSourceSummary" in js
    assert "tracked Polars aggregate artifact" in js
    assert "public artifact validator runs before Pages upload" in js
    assert "artifactFreshnessSnapshotDelta" in js
    assert "Since snapshot" in js
    assert "snapshot-delta" in js
    assert "artifact-change-row small" in css
    assert "artifact-freshness-grid span.snapshot-delta" in css
    assert "artifact-freshness-grid .snapshot-delta em" in css
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
    assert "chartMapFilterEnabled" in js
    assert "applyChartMapFilter" in js
    assert "applyChartStateTopicFilter" in js
    assert "chartInquiryCard" in js
    assert "chartRouteLegendCard" in js
    assert "chartQuestionChipsCard" in js
    assert "chartQuestionChipRows" in js
    assert "chartQuestionChipHtml" in js
    assert "applyChartQuestionChip" in js
    assert "Chart-to-chat question chips" in js
    assert "Reusable questions from current aggregate charts." in js
    assert "Question chips are generated from visible aggregate chart rows" in js
    assert "Visual route verified" in js
    assert "Open smoke run" in js
    assert "visual-route-verification-card" in css
    assert "chartRouteTarget" in js
    assert "chartRouteStageHtml" in js
    assert "applyChartRouteLegend" in js
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
    assert "data-chart-question-value" in js
    assert "data-chart-question-state" in js
    assert "data-chart-question-label" in js
    assert "data-chart-ontology-action" in js
    assert "data-chart-ontology-value" in js
    assert "data-chart-ontology-state" in js
    assert "data-chart-ontology-label" in js
    assert "data-chart-route-action" in js
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
    assert "geographyPositionIndex" in js
    assert "geometryCentroid" in js
    assert "geography_layers" in js
    assert "data-tier-ontology" in js
    assert "data-tier-ontology-unit" in js
    assert "renderWalkthrough" in js
    assert "walkthroughStepHtml" in js
    assert "data-walkthrough-tab" in js
    assert "renderOntology" in js
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
    assert "package-ontology-bridge" in html
    assert "Package overlay snapshots" in js
    assert "packageOntologyBridgeHtml" in js
    assert "packageOntologyNodeCard" in js
    assert "data-package-ontology-unit" in js
    assert "renderInquiry" in js
    assert "matchInquiryBriefing" in js
    assert "renderInquiryContext" in js
    assert "inquiry-map-composer" in html
    assert "Question to map filter composer" in html
    assert "renderInquiryMapComposer" in js
    assert "inquiryMapComposerPlan" in js
    assert "inquiryMapComposerHtml" in js
    assert "inferQuestionState" in js
    assert "inferQuestionTopic" not in js
    assert "inferQuestionScoreField" in js
    assert "applyInquiryMapComposerAction" in js
    assert "data-inquiry-map-composer-action" in js
    assert "Composer previews aggregate map filters and ontology nodes only" in js
    assert "No live browser LLM calls" in js
    assert "inquiry-map-composer-card" in css
    assert "inquiry-map-composer-preview" in css
    assert "inquiry-map-composer-metrics" in css
    assert "inquiry-map-composer-chips" in css
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
    assert "packageInquiryAnswer" in js
    assert "What does the loaded package show on the map?" in js
    assert "Package evidence boundary" in js
    assert "filteredAuditAnswer" in js
    assert "filteredScoreAnswer" in js
    assert "inquiryAnswerMiniChartsHtml" in js
    assert "inquiryAnswerFreshnessHtml" in js
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
    assert "inquiry-answer-filter-chips" in css
    assert "inquiry-answer-filter-chip" in css
    assert "inquiry-answer-map-cards" in css
    assert "inquiry-answer-tier-row" in css
    assert "inquiry-answer-map-unit-row" in css
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
    assert "inquiryResultsTimelineHtml" in js
    assert "inquiryResultsTimelineRowHtml" in js
    assert "Replay timeline" in js
    assert "Aggregate inquiry replay timeline" in js
    assert "inquiryRouteComparisonHtml" in js
    assert "inquiryRouteComparisonCardHtml" in js
    assert "inquiryRouteComparisonBarHtml" in js
    assert "routeComparisonDelta" in js
    assert "Route comparison" in js
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
    assert "selectedUnitAnswer" in js
    assert "askAboutMapUnit" in js
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
    assert "selected-disclosure-trail" in css
    assert "selected-map-ontology-route" in css
    assert "selected-query-replay" in css
    assert "selected-query-steps" in css
    assert "selected-ontology-query-drawer" in css
    assert "selected-ontology-query-nodes" in css
    assert "selected-ontology-query-peer" in css
    assert "selected-neighbor-filter-controls" in css
    assert "selected-neighbor-peer-strip" in css
    assert "selected-neighbor-peer-row" in css
    assert "selected-query-actions" in css
    assert "selected-route-strip" in css
    assert "selected-route-comparison-overlay" in css
    assert "selected-route-comparison-row" in css
    assert "selected-route-comparison-actions" in css
    assert "selected-route-comparison-boundary" in css
    assert "analysis-journey" in css
    assert "analysis-journey-step" in css
    assert "analysis-journey-boundary" in css
    assert "frontdoor-visual-path-card" in css
    assert "frontdoor-question-composer" in css
    assert "frontdoor-question-actions" in css
    assert "frontdoor-question-metrics" in css
    assert "frontdoor-saved-routes" in css
    assert "frontdoor-saved-route" in css
    assert "frontdoor-saved-actions" in css
    assert "frontdoor-saved-export-card" in css
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
    assert "inquiry-answer-freshness-heading" in css
    assert "inquiry-answer-freshness-grid" in css
    assert "selected-ontology-drilldown" in css
    assert "ontology-query-presets" in css
    assert "ontology-query-grid" in css
    assert "ontology-query-card" in css
    assert "ontology-map-presets" in css
    assert "ontology-map-preset-grid" in css
    assert "ontology-map-preset-card" in css
    assert "ontology-map-preset-actions" in css
    assert "inquiry-answer-mini-charts" in css
    assert "inquiry-answer-mini-grid" in css
    assert "inquiry-answer-mini-row" in css
    assert "inquiry-answer-ontology-map" in css
    assert "inquiry-answer-ontology-svg" in css
    assert "inquiry-answer-ontology-actions" in css
    assert "inquiry-answer-ontology-chip" in css
    assert "inquiry-answer-ontology-drawer" in css
    assert "inquiry-answer-ontology-drawer-row" in css
    assert "map-reading-guide-card" in css
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
    assert "inquiry-results-log-card" in css
    assert "inquiry-log-entry" in css
    assert "inquiry-pathway-card" in css
    assert "inquiry-pathway-grid" in css
    assert "inquiry-pathway-cell" in css
    assert "inquiry-pathway-peers" in css
    assert "inquiry-pathway-peer-row" in css
    assert "inquiry-pathway-ontology-chips" in css
    assert "inquiry-pathway-actions" in css
    assert "inquiry-log-actions" in css
    assert "inquiry-log-entry.active" in css
    assert "inquiry-log-timeline" in css
    assert "inquiry-log-timeline-row" in css
    assert "inquiry-log-sparkline" in css
    assert "inquiry-route-comparison" in css
    assert "inquiry-route-comparison-grid" in css
    assert "inquiry-route-comparison-card" in css
    assert "inquiry-route-replay-card" in css
    assert "inquiry-route-grid" in css
    assert "inquiry-route-card" in css
    assert "inquiry-route-steps" in css
    assert "inquiry-route-actions" in css
    assert "map-inline-history-row" in css
    assert "map-inline-comparison-strip" in css
    assert "map-inline-comparison-row" in css
    assert "ontology-tier-focus" in css
    assert "ontology-tier-focus-metrics" in css
    assert "ontologyTierNeighborhoodHtml" in js
    assert "ontologyTierNeighborhoodNodeHtml" in js
    assert "ontologyTierScoreNeighborhoodNodes" in js
    assert "highlightOntologyTierOnMap" in js
    assert "data-tier-neighborhood-filter" in js
    assert "data-tier-neighborhood-score" in js
    assert "data-tier-neighborhood-map" in js
    assert "Tier neighborhood graph" in js
    assert "Neighborhood nodes are aggregate visual routes" in js
    assert "ontology tier neighborhood" in js
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
    assert "chart-route-legend-card" in css
    assert "chart-route-strip" in css
    assert "chart-route-stage" in css
    assert "chart-route-actions" in css
    assert "chartRoutePulse" in css
    assert "chart-inquiry-actions" in css
    assert "chart-inquiry-chip" in css
    assert "chart-ontology-chip" in css
    assert "top-unit-list-row > button" in css
    assert "top-unit-list-row" in css
    assert "state-topic-actions" in css
    assert "topic-strip-row:hover" in css
    assert "ontology-path-controls" in css
    assert "ontology-path-control" in css
    assert "ontology-path-control.active" in css
    assert "ontology-path-strip.controlled" in css
    assert "ontology-path-step.active" in css
    assert "ontology-path-boundary" in css
    assert "ontology-path-strip" in css
    assert "ontologyPathSweep" in css
    assert "ontologyNodeSvg" in js
    assert "selectedUnitPeerComparisonHtml" in js
    assert "selectedUnitPeerComparisonDrawerHtml" in js
    assert "selectedUnitPeerComparisonRows" in js
    assert "selectedUnitPeerComparisonRowHtml" in js
    assert "selectedUnitPeerComparisonMetricHtml" in js
    assert "County/town peer comparison drawer" in js
    assert "Compare selected unit to aggregate ontology peers" in js
    assert "Rows compare aggregate map units only." in js
    assert "No ordinance text, source locators, browser model calls, rankings, or legal findings." in js
    assert "selected-peer-comparison-drawer" in css
    assert "selected-peer-comparison-row" in css
    assert "selected-peer-comparison-boundary" in css
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
    assert "api.x.ai" not in js
    assert "GROK_API_KEY" not in js
    assert "Grok_api_key" not in js
    assert "fetchAnalysisArtifacts" in js
    assert "renderArtifactFreshnessBadges" in js
    assert "artifactFreshnessBadgeHtml" in js
    assert "artifactAgeLabel" in js
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
    assert "Current refresh metadata, not a historical diff" not in js
    assert "Current refresh metadata only; no stored snapshot loaded." in js
    assert "Rows summarize public aggregate artifacts only." in js
    assert "No row text, source locators, local databases, exports, or legal findings" in js
    assert "openAnalysisStatusTab" in js
    assert "data-open-status-tab" in js
    assert "No row text published" in js
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
    assert "artifact-refresh-timeline" in css
    assert "artifact-refresh-timeline-strip" in css
    assert "artifact-refresh-timeline-row" in css
    assert "artifact-refresh-track" in css
    assert "artifact-lineage-visual" in css
    assert "artifact-lineage-flow" in css
    assert "artifact-lineage-grid" in css
    assert "artifact-lineage-row" in css
    assert "artifact-change-card" in css
    assert "artifact-change-grid" in css
    assert "artifact-change-row" in css
    assert "map-refresh-source-card" in css
