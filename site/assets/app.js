const STORAGE_EVENTS = "evolocus.pages.reviewEvents.v1";
const STORAGE_REVIEWER = "evolocus.pages.reviewer.v1";
const STORAGE_BLIND = "evolocus.pages.blind.v1";
const STORAGE_RECORDS = "evolocus.pages.records.v1";
const STORAGE_SNAPSHOTS = "evolocus.pages.viewSnapshots.v1";
const STORAGE_IMPORT_STATUS = "evolocus.pages.importStatus.v1";
const STORAGE_MAP_INQUIRY_HISTORY = "evolocus.pages.mapInquiryHistory.v1";
const STORAGE_INQUIRY_RESULTS_LOG = "evolocus.pages.aggregateInquiryResultsLog.v1";
const ACTIONS_REFRESH_WORKFLOW_URL = "https://github.com/evcatalyst/evolocus/actions/workflows/analysis-refresh.yml";
const ACTIONS_BROWSER_SMOKE_WORKFLOW_URL = "https://github.com/evcatalyst/evolocus/actions/workflows/pages-browser-smoke.yml";

const ANALYSIS_PATHS = {
  status: "data/analysis/status.json",
  mapLayers: "data/analysis/map_layers.json",
  countyGeometry: "data/analysis/county_geometry.json",
  municipalPoints: "data/analysis/municipal_points.json",
  auditStatus: "data/analysis/audit_status.json",
  unitAuditQuality: "data/analysis/unit_audit_quality.json",
  ontology: "data/analysis/ontology.json",
  chatIndex: "data/analysis/chat_index.json",
  inquiryBriefings: "data/analysis/inquiry_briefings.json",
  questionPack: "data/analysis/question_pack.json",
  models: "data/analysis/models.json",
  charts: "data/analysis/charts.json",
  artifactSnapshot: "data/analysis/artifact_snapshot.json",
  visualSmoke: "data/analysis/visual_smoke.json",
  refreshStatus: "data/analysis/refresh_status.json",
};

const SCORE_OPTIONS = [
  "not_reviewed",
  "far_too_low",
  "somewhat_too_low",
  "plausible",
  "somewhat_too_high",
  "far_too_high",
  "not_scorable",
];

const TOPICS = ["Buildings", "Business", "Nuisance", "Zoning", "Other"];
const FUNCTIONS = ["Context", "Rules", "Process", "Enforcement"];
const SCORE_FIELDS = ["enforcement_discretion", "opacity", "paternalism", "problem_salience"];
const STATE_NAME_TO_CODE = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
  "district of columbia": "DC",
};
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");
const TOPIC_COLORS = {
  Buildings: "#5f7fc8",
  Business: "#8d6aa8",
  Nuisance: "#c27b4f",
  Zoning: "#2f756b",
  Other: "#77808f",
  Not_applicable: "#d8dee8",
  Unknown: "#d8dee8",
};
const FUNCTION_COLORS = {
  Context: "#7a8aa0",
  Rules: "#326f70",
  Process: "#b7892c",
  Enforcement: "#b35a55",
  Unknown: "#d8dee8",
};

const syntheticRecords = [
  {
    record_id: "demo/part-000.parquet#0",
    source_locator: "demo-revision/part-000.parquet#0",
    dataset_revision: "demo-revision",
    source_file: "demo/part-000.parquet",
    source_row_number: 0,
    header: "Purpose",
    content:
      "SYNTHETIC DEMONSTRATION DATA. Sample Valley explains the purpose of its local code and includes no operative rule in this example text.",
    is_substantive: false,
    function: "Context",
    topic: null,
    source_jurisdiction_type: "cities",
    state: "CA",
    city: "Sample Valley",
    county: null,
    jurisdiction_name: "Sample Valley",
    jurisdiction_type_normalized: "city",
    enforcement_discretion: 0.12,
    opacity: 0.28,
    paternalism: 0.22,
    problem_salience: 0.31,
    content_length_chars: 126,
    content_length_words: 18,
    ocr_risk_level: "low",
    ocr_risk_reasons: [],
  },
  {
    record_id: "demo/part-000.parquet#1",
    source_locator: "demo-revision/part-000.parquet#1",
    dataset_revision: "demo-revision",
    source_file: "demo/part-000.parquet",
    source_row_number: 1,
    header: "Zoning permits",
    content:
      "SYNTHETIC DEMONSTRATION DATA. Example Township requires a zoning permit before exterior construction begins. The official may request additional plans.",
    is_substantive: true,
    function: "Rules",
    topic: "Zoning",
    source_jurisdiction_type: "city",
    state: "TN",
    city: "Example Township",
    county: "Demo County",
    jurisdiction_name: "Example Township",
    jurisdiction_type_normalized: "city",
    enforcement_discretion: 0.61,
    opacity: 0.49,
    paternalism: 0.36,
    problem_salience: 0.68,
    content_length_chars: 146,
    content_length_words: 20,
    ocr_risk_level: "low",
    ocr_risk_reasons: [],
  },
  {
    record_id: "demo/part-000.parquet#2",
    source_locator: "demo-revision/part-000.parquet#2",
    dataset_revision: "demo-revision",
    source_file: "demo/part-000.parquet",
    source_row_number: 2,
    header: "Business renewal",
    content:
      "SYNTHETIC DEMONSTRATION DATA. Synthetic Vendor LLC must file a renewal form by March 1 and pay the listed local license fee.",
    is_substantive: true,
    function: "Process",
    topic: "Business",
    source_jurisdiction_type: "municipal",
    state: "NJ",
    city: "Demo Borough",
    county: "Sample County",
    jurisdiction_name: "Demo Borough",
    jurisdiction_type_normalized: "city",
    enforcement_discretion: 0.24,
    opacity: 0.54,
    paternalism: 0.18,
    problem_salience: 0.47,
    content_length_chars: 127,
    content_length_words: 19,
    ocr_risk_level: "low",
    ocr_risk_reasons: [],
  },
  {
    record_id: "demo/part-000.parquet#3",
    source_locator: "demo-revision/part-000.parquet#3",
    dataset_revision: "demo-revision",
    source_file: "demo/part-000.parquet",
    source_row_number: 3,
    header: "Nuisance notice",
    content:
      "SYNTHETIC DEMONSTRATION DATA. Demo County may issue a notice for repeated nuisance conditions!!!!",
    is_substantive: true,
    function: "Enforcement",
    topic: "Nuisance",
    source_jurisdiction_type: "county",
    state: "PA",
    city: null,
    county: "Demo County",
    jurisdiction_name: "Demo County",
    jurisdiction_type_normalized: "county",
    enforcement_discretion: 0.73,
    opacity: 0.44,
    paternalism: 0.41,
    problem_salience: 0.58,
    content_length_chars: 96,
    content_length_words: 13,
    ocr_risk_level: "medium",
    ocr_risk_reasons: ["repeated punctuation"],
  },
  {
    record_id: "demo/part-000.parquet#4",
    source_locator: "demo-revision/part-000.parquet#4",
    dataset_revision: "demo-revision",
    source_file: "demo/part-000.parquet",
    source_row_number: 4,
    header: "OCR risk sample",
    content: "SYNTHETIC DEMONSTRATION DATA. \uFFFD\uFFFD Sec. 4 -- -- -- text text text",
    is_substantive: false,
    function: "Context",
    topic: "Zoning",
    source_jurisdiction_type: "unknown_demo_type",
    state: "tx",
    city: null,
    county: null,
    jurisdiction_name: "Incomplete source metadata",
    jurisdiction_type_normalized: "unknown",
    enforcement_discretion: null,
    opacity: 0.82,
    paternalism: 0.2,
    problem_salience: 0.19,
    content_length_chars: 62,
    content_length_words: 9,
    ocr_risk_level: "high",
    ocr_risk_reasons: ["replacement characters", "short content", "topic on non-substantive row"],
  },
  {
    record_id: "demo/part-000.parquet#5",
    source_locator: "demo-revision/part-000.parquet#5",
    dataset_revision: "demo-revision",
    source_file: "demo/part-000.parquet",
    source_row_number: 5,
    header: "Building fee",
    content: "SYNTHETIC DEMONSTRATION DATA. Fee.",
    is_substantive: true,
    function: "Rules",
    topic: "Buildings",
    source_jurisdiction_type: "cities",
    state: "WA",
    city: "Sample Heights",
    county: null,
    jurisdiction_name: "Sample Heights",
    jurisdiction_type_normalized: "city",
    enforcement_discretion: 0.33,
    opacity: 0.72,
    paternalism: 0.29,
    problem_salience: 0.25,
    content_length_chars: 35,
    content_length_words: 4,
    ocr_risk_level: "high",
    ocr_risk_reasons: ["extremely short content"],
  },
];

let records = loadRecords();
let state = {
  activeTab: "map",
  currentIndex: 0,
  reviewer: localStorage.getItem(STORAGE_REVIEWER) || "local-reviewer",
  blind: localStorage.getItem(STORAGE_BLIND) !== "false",
  revealed: {},
  explorerRows: records,
  explorerPageSize: 8,
  selectedUnitId: null,
  disclosureLevel: "overview",
  geographyColorMode: "tier",
  geographyLayers: defaultGeographyLayers(),
  mapInlineInquiry: "view",
  inquiryMapHighlight: null,
  ontologyFocusTier: "",
  ontologyPathStage: "auto",
  selectedOntologyNeighborFilter: "all",
  inquiryMapComposerQuestion: "",
  frontdoorComposerQuestion: "",
  frontdoorRouteImportStatus: null,
  mapFilters: {
    state: "",
    topic: "",
    function: "",
    kind: "",
    tier: "",
    scoreField: "",
    scoreBand: "",
    auditFocus: "",
    minLaws: 0,
    minAuditScore: 0,
    packageOnly: false,
  },
  queuePlan: {
    strategy: "audit_priority",
    size: 25,
    seedLabel: "pages-aggregate-plan",
  },
  inquiryAnswer: null,
  inquiryResultsLog: loadInquiryResultsLog(),
  activeInquiryReplayId: "",
  inquiryOntologyDrawer: null,
  analysis: {
    status: null,
    mapLayers: null,
    countyGeometry: null,
    municipalPoints: null,
    auditStatus: null,
    unitAuditQuality: null,
    ontology: null,
    chatIndex: null,
    inquiryBriefings: null,
    questionPack: null,
    models: null,
    charts: null,
    artifactSnapshot: null,
    visualSmoke: null,
    refreshStatus: null,
    error: null,
  },
};

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function loadRecords() {
  const stored = localStorage.getItem(STORAGE_RECORDS);
  if (!stored) {
    return syntheticRecords;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : syntheticRecords;
  } catch {
    return syntheticRecords;
  }
}

function loadEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_EVENTS) || "[]");
  } catch {
    return [];
  }
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_EVENTS, JSON.stringify(events));
}

function loadSnapshots() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_SNAPSHOTS) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((snapshot) => snapshot?.payload?.schema_version === "evolocus-current-view-snapshot-v1")
      : [];
  } catch {
    return [];
  }
}

function loadImportStatus() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_IMPORT_STATUS) || "null");
  } catch {
    return null;
  }
}

function saveImportStatus(status) {
  localStorage.setItem(STORAGE_IMPORT_STATUS, JSON.stringify(status));
}

function clearImportStatus() {
  localStorage.removeItem(STORAGE_IMPORT_STATUS);
}

function saveSnapshots(snapshots) {
  localStorage.setItem(STORAGE_SNAPSHOTS, JSON.stringify(snapshots.slice(0, 24)));
}

function loadMapInquiryHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_MAP_INQUIRY_HISTORY) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((item) => item?.schema_version === "evolocus-map-inquiry-history-v1")
      : [];
  } catch {
    return [];
  }
}

function saveMapInquiryHistory(history) {
  localStorage.setItem(STORAGE_MAP_INQUIRY_HISTORY, JSON.stringify(history.slice(0, 12)));
}

function loadInquiryResultsLog() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_INQUIRY_RESULTS_LOG) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((item) => item?.schema_version === "evolocus-aggregate-inquiry-result-v1")
      : [];
  } catch {
    return [];
  }
}

function saveInquiryResultsLog(items) {
  state.inquiryResultsLog = items.slice(0, 12);
  localStorage.setItem(STORAGE_INQUIRY_RESULTS_LOG, JSON.stringify(state.inquiryResultsLog));
}

function eventId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `event-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function latestEvents() {
  const latest = new Map();
  for (const event of loadEvents()) {
    if (!event.record_id || event.event_type === "reveal_prediction") {
      continue;
    }
    const key = `${event.record_id}:${event.reviewer_id}`;
    latest.set(key, event);
  }
  return latest;
}

function currentRecord() {
  return records[state.currentIndex] || null;
}

function currentLatestEvent(record = currentRecord()) {
  if (!record) {
    return null;
  }
  return latestEvents().get(`${record.record_id}:${state.reviewer}`) || null;
}

function statusForRecord(record) {
  const latest = latestEvents().get(`${record.record_id}:${state.reviewer}`);
  if (!latest) {
    return "remaining";
  }
  if (latest.event_type === "skip") {
    return "skipped";
  }
  if (latest.event_type === "flag") {
    return "flagged";
  }
  return "reviewed";
}

function queueMetrics() {
  const counts = { total: records.length, reviewed: 0, skipped: 0, flagged: 0, remaining: 0 };
  for (const record of records) {
    counts[statusForRecord(record)] += 1;
  }
  return counts;
}

function text(value) {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }
  return String(value);
}

function titleCase(value) {
  return text(value)
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function displayUnitName(unitOrName) {
  const raw = typeof unitOrName === "string" ? unitOrName : unitOrName.name || unitOrName.unit_id;
  return titleCase(raw);
}

function render() {
  renderTabs();
  renderToolbar();
  renderImportStatus();
  renderAnalysisJourney();
  renderFrontdoorVisualPath();
  renderVisualRouteVerification();
  renderOfflineRefreshFreshness();
  renderArtifactFreshnessBadges();
  renderMap();
  renderWalkthrough();
  renderOntology();
  renderInquiry();
  renderSnapshotGallery();
  renderReview();
  renderExplorer();
  renderResults();
  renderScoreLens();
  renderAuditLens();
  renderQueuePlan();
  renderAnalysisStatusPanel();
}

function renderTabs() {
  $all(".tab-link").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === state.activeTab);
  });
  $all(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${state.activeTab}-panel`);
  });
}

function renderToolbar() {
  $("#reviewer-input").value = state.reviewer;
  $("#blind-toggle").checked = state.blind;
  $("#mode-select").value = isSyntheticQueue() ? "demo" : "imported";
}

function renderAnalysisJourney() {
  const target = $("#analysis-journey");
  if (!target) {
    return;
  }
  const mapLayers = state.analysis.mapLayers;
  const status = state.analysis.status;
  if (!mapLayers || !status) {
    target.innerHTML = `
      <article class="analysis-journey-card loading">
        <span>Journey loading</span>
        <strong>Aggregate analysis artifacts</strong>
        <p>Map, inquiry, ontology, and queue-plan context will appear after static Pages artifacts load.</p>
      </article>
    `;
    return;
  }
  const visibleUnits = filterMapUnits(mapLayers.units || []);
  const summary = summarizeUnits(visibleUnits);
  const selectedUnit = currentSelectedMapUnit();
  const packageSummary = packageCoverageSummary();
  const planCount = Math.min(Number(state.queuePlan.size || 0), visibleUnits.length);
  const filters = activeFilterLabels();
  const steps = [
    {
      key: "map",
      tab: "map",
      label: "1. Law Map",
      value: `${formatCount(visibleUnits.length)} units`,
      detail: `${formatCount(summary.lawCount)} aggregate rows${filters.length ? ` · ${filters.slice(0, 2).join(" · ")}` : ""}`,
      disclosure: "overview",
    },
    {
      key: "inquiry",
      tab: "inquiry",
      label: "2. Inquiry",
      value: summary.topTopic.label || "No topic",
      detail: `${formatCount(summary.topTopic.value || 0)} rows in top topic · deterministic browser answer`,
      disclosure: "unit",
    },
    {
      key: "ontology",
      tab: "ontology",
      label: "3. Ontology",
      value: selectedUnit ? displayUnitName(selectedUnit) : summary.topFunction.label,
      detail: selectedUnit ? `${selectedUnit.state || "NA"} · ${selectedUnit.tier_label || "neutral tier"}` : "topic/function/tier links from aggregate artifacts",
      disclosure: "unit",
    },
    {
      key: "queueplan",
      tab: "queueplan",
      label: "4. Queue Plan",
      value: `${formatCount(planCount)} candidates`,
      detail: `${state.queuePlan.strategy.replace(/_/g, " ")} · content-free unit request`,
      disclosure: "evidence",
    },
  ];
  target.innerHTML = `
    <div class="analysis-journey-heading">
      <div>
        <span>Progressive analysis journey</span>
        <strong>Map -&gt; Inquiry -&gt; Ontology -&gt; Queue Plan</strong>
      </div>
      <em>${escapeHtml(packageSummary.imported ? "Browser-local package overlay active" : "Aggregate-only public path")}</em>
    </div>
    <div class="analysis-journey-steps">
      ${steps.map(analysisJourneyStepHtml).join("")}
    </div>
    <p class="analysis-journey-boundary">Public journey steps pass only filters, disclosure level, aggregate counts, and published unit IDs. No ordinance text, source locators, review events, or browser model calls.</p>
  `;
}

function analysisJourneyStepHtml(step) {
  const active = state.activeTab === step.tab ? " active" : "";
  return `
    <button type="button" class="analysis-journey-step${active}" data-journey-tab="${escapeHtml(step.tab)}" data-journey-disclosure="${escapeHtml(step.disclosure)}">
      <span>${escapeHtml(step.label)}</span>
      <strong>${escapeHtml(step.value)}</strong>
      <em>${escapeHtml(step.detail)}</em>
    </button>
  `;
}

function openAnalysisJourneyStep(tab, disclosure) {
  if (["overview", "unit", "evidence"].includes(disclosure)) {
    state.disclosureLevel = disclosure;
  }
  if (tab === "ontology" && !state.ontologyFocusTier) {
    const selectedUnit = currentSelectedMapUnit();
    const tier = selectedUnit?.tier || selectedUnit?.tier_label || state.mapFilters.tier || "";
    if (tier) {
      state.ontologyFocusTier = tier;
    }
  }
  state.activeTab = tab || "map";
  render();
}

function renderFrontdoorVisualPath() {
  const target = $("#frontdoor-visual-path");
  if (!target) {
    return;
  }
  const mapLayers = state.analysis.mapLayers;
  const status = state.analysis.status;
  if (!mapLayers || !status) {
    target.innerHTML = `
      <article class="frontdoor-visual-path-card loading">
        <span>Visual path loading</span>
        <strong>Ask -&gt; Map -&gt; Ontology</strong>
        <p>The guided public visual path appears after aggregate map and inquiry artifacts load.</p>
      </article>
    `;
    return;
  }
  const visibleUnits = filterMapUnits(mapLayers.units || []);
  const summary = summarizeUnits(visibleUnits);
  const selectedUnit = currentSelectedMapUnit() || summary.topUnit;
  const topTier = topEntry(summary.tierCounts);
  const filters = activeFilterLabels();
  const question = frontdoorVisualPathQuestion(summary, visibleUnits);
  const composerPlan = inquiryMapComposerPlan(state.frontdoorComposerQuestion);
  const exampleRows = frontdoorExampleQuestionRows(visibleUnits);
  const selectedLabel = selectedUnit
    ? `${displayUnitName(selectedUnit)}${selectedUnit.state ? `, ${selectedUnit.state}` : ""}`
    : "No selected aggregate unit";
  const cards = [
    {
      key: "ask",
      title: "Ask the current view",
      value: summary.topTopic.label || "No topic",
      detail: `${formatCount(summary.topTopic.value || 0)} rows in top topic · deterministic answer`,
      button: "Ask now",
    },
    {
      key: "map",
      title: "Open the colored map",
      value: `${formatCount(visibleUnits.length)} units`,
      detail: `${geographyColorLabel(state.geographyColorMode)} · ${formatCount(summary.lawCount)} aggregate rows`,
      button: "Open map",
    },
    {
      key: "ontology",
      title: "Inspect the ontology path",
      value: topTier.label || "No tier",
      detail: `${selectedLabel} · ${summary.topFunction.label || "No function"}`,
      button: "Open ontology",
    },
  ];
  target.innerHTML = `
    <article class="frontdoor-visual-path-card">
      <div class="frontdoor-visual-path-heading">
        <div>
          <p class="eyebrow">Public visual path</p>
          <h2>Ask a question, see the county/town map, then inspect the ontology.</h2>
          <p>Uses the published aggregate LOCUS artifacts only. The browser receives units, counts, neutral tiers, and model-output summaries, not ordinance text.</p>
        </div>
        <div class="frontdoor-visual-path-metrics" aria-label="Current aggregate scope">
          <span><strong>${escapeHtml(formatCount(visibleUnits.length))}</strong><em>visible units</em></span>
          <span><strong>${escapeHtml(formatCount(summary.lawCount))}</strong><em>aggregate rows</em></span>
          <span><strong>${escapeHtml(titleCase(state.disclosureLevel))}</strong><em>disclosure</em></span>
        </div>
      </div>
      <div class="frontdoor-visual-path-question">
        <span>Suggested question</span>
        <strong>${escapeHtml(question)}</strong>
        <em>${escapeHtml(filters.length ? filters.slice(0, 4).join(" · ") : "No active map filters")}</em>
      </div>
      ${frontdoorQuestionComposerHtml(composerPlan, question)}
      ${frontdoorSavedRoutesHtml(state.inquiryResultsLog)}
      <div class="frontdoor-visual-path-steps">
        ${cards.map((card) => frontdoorVisualPathStepHtml(card, question)).join("")}
      </div>
      ${frontdoorExampleQuestionsHtml(exampleRows)}
      <div class="frontdoor-disclosure-controls" role="group" aria-label="Front-door disclosure level">
        ${["overview", "unit", "evidence"].map(frontdoorDisclosureButtonHtml).join("")}
      </div>
      <p class="frontdoor-visual-path-boundary">Actions pass only aggregate filters, disclosure level, selected published unit IDs, and deterministic answers. No browser Grok call, API key, source locator, review event, or LOCUS ordinance text is exposed.</p>
    </article>
  `;
}

function frontdoorQuestionComposerHtml(plan, suggestedQuestion) {
  const question = state.frontdoorComposerQuestion || "";
  const previewReady = Boolean(question);
  const filterChips = plan.filterLabels.length
    ? plan.filterLabels.map((label) => `<span>${escapeHtml(label)}</span>`).join("")
    : "<span>No inferred filters yet</span>";
  const reasonRows = plan.reasons.length
    ? plan.reasons.slice(0, 4).map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")
    : "<li>Type a topic, state, county/town cue, model-score field, audit cue, or neutral tier to preview an aggregate route.</li>";
  const topUnit = plan.previewSummary.topUnit;
  const ontologyRoute = normalizedQuestionOntologyRoute(plan.ontologyRoute);
  return `
    <section class="frontdoor-question-composer" aria-label="Landing question to map composer">
      <form data-frontdoor-composer>
        <label for="frontdoor-question-input">
          <span>Ask the aggregate map</span>
          <input id="frontdoor-question-input" name="frontdoor_question" type="search" value="${escapeHtml(question)}" placeholder="${escapeHtml(suggestedQuestion)}" autocomplete="off">
        </label>
        <div class="frontdoor-question-actions">
          <button type="submit" data-frontdoor-composer-action="preview">Preview route</button>
          <button type="button" data-frontdoor-composer-action="save"${previewReady ? "" : " disabled"}>Save route</button>
          <button type="button" data-frontdoor-composer-action="map"${previewReady ? "" : " disabled"}>Map question</button>
          <button type="button" data-frontdoor-composer-action="ask"${previewReady ? "" : " disabled"}>Ask + save</button>
          <button type="button" data-frontdoor-composer-action="ontology"${previewReady ? "" : " disabled"}>Ontology route</button>
        </div>
      </form>
      <div class="frontdoor-question-preview">
        <div class="frontdoor-question-chips" aria-label="Front-door inferred aggregate filters">
          ${filterChips}
        </div>
        <div class="frontdoor-question-metrics">
          ${frontdoorQuestionMetricHtml("Matching units", formatCount(plan.previewUnits.length), `${formatCount(plan.currentUnits.length)} before preview`)}
          ${frontdoorQuestionMetricHtml("Aggregate rows", formatCount(plan.previewSummary.lawCount), "no ordinance text")}
          ${frontdoorQuestionMetricHtml("Top topic", plan.previewSummary.topTopic.label, `${formatCount(plan.previewSummary.topTopic.value)} rows`)}
          ${frontdoorQuestionMetricHtml("Top unit", topUnit ? displayUnitName(topUnit) : "No matching unit", topUnit ? `${topUnit.state || "NA"} · ${formatCount(topUnit.law_count)} rows` : "adjust the question")}
        </div>
        <div class="frontdoor-question-reasons">
          <strong>Route logic</strong>
          <ul>${reasonRows}</ul>
        </div>
      </div>
      ${questionOntologyRouteHtml(ontologyRoute, "frontdoor")}
      <p class="frontdoor-question-boundary">Front-door chat is deterministic filter routing over published aggregate artifacts. It makes no browser Grok call, reads no ordinance text, exposes no source locators, and creates no legal finding.</p>
    </section>
  `;
}

function frontdoorSavedRoutesHtml(entries) {
  const routes = (entries || []).slice(0, 3);
  if (!routes.length) {
    return `
      <section class="frontdoor-saved-routes empty" aria-label="Saved landing question routes">
        <div>
          <span>Saved visual routes</span>
          <strong>No browser-local routes yet.</strong>
          <p>Use Save route or Ask + save to keep aggregate question routes on this landing surface.</p>
        </div>
        ${frontdoorRouteImportHtml()}
      </section>
    `;
  }
  const maxRows = Math.max(1, ...routes.map((item) => Number(item.visible_summary?.law_count || 0)));
  return `
    <section class="frontdoor-saved-routes" aria-label="Saved landing question routes">
      <div class="frontdoor-saved-heading">
        <div>
          <span>Saved visual routes</span>
          <strong>${escapeHtml(formatCount(routes.length))} browser-local aggregate routes</strong>
        </div>
        <button type="button" data-frontdoor-export-routes>Export route packet</button>
      </div>
      <div class="frontdoor-saved-export-card" aria-label="Content-free route export preview">
        <span><strong>${escapeHtml(formatCount(routes.length))}</strong><em>routes</em></span>
        <span><strong>JSON</strong><em>content-free packet</em></span>
        <span><strong>0</strong><em>text rows or locators</em></span>
      </div>
      ${frontdoorRouteImportHtml()}
      <div class="frontdoor-saved-grid">
        ${routes.map((item, index) => frontdoorSavedRouteCardHtml(item, index, maxRows)).join("")}
      </div>
      <p class="frontdoor-saved-boundary">Saved route cards restore aggregate filters, selected public unit IDs, and deterministic answers only. No ordinance text, source locators, review events, secrets, or live model output is stored or published.</p>
    </section>
  `;
}

function frontdoorRouteImportHtml() {
  const status = state.frontdoorRouteImportStatus;
  return `
    <div class="frontdoor-route-import" aria-label="Import a content-free route packet">
      <label>
        <span>Import route packet</span>
        <input id="frontdoor-route-import" type="file" accept="application/json,.json" data-frontdoor-import-routes>
      </label>
      <p>${escapeHtml(status ? `${status.imported} imported · ${status.skipped} skipped · ${status.filename}` : "Imports only EvoLOCUS front-door route exports. Raw text, locators, review events, and answer text are rejected.")}</p>
    </div>
  `;
}

function frontdoorRouteExportPayload(entries = state.inquiryResultsLog) {
  const routes = (entries || []).slice(0, 12).map(frontdoorRouteExportItem);
  return {
    schema_version: "evolocus-frontdoor-route-export-v1",
    generated_at: new Date().toISOString(),
    route_count: routes.length,
    publication_policy: aggregateInquiryLogPolicy(),
    source_artifacts: [
      "status.json",
      "map_layers.json",
      "inquiry_briefings.json",
      "question_pack.json",
      "unit_audit_quality.json",
    ],
    notes: [
      "This export contains browser-local aggregate question routes only.",
      "It excludes ordinance text, headers, source locators, review events, local paths, secrets, and live model output.",
    ],
    routes,
  };
}

function frontdoorRouteExportItem(item) {
  return {
    route_id: item.id || null,
    created_at: item.created_at || null,
    source: item.source || null,
    question: item.question || "",
    disclosure_level: item.disclosure_level || "overview",
    geography_color_mode: item.geography_color_mode || "tier",
    map_filters: normalizedLogMapFilters(item.map_filters),
    filter_labels: Array.isArray(item.filter_labels) ? item.filter_labels.slice(0, 8) : [],
    selected_unit: item.selected_unit
      ? {
          unit_id: item.selected_unit.unit_id || null,
          name: item.selected_unit.name || null,
          state: item.selected_unit.state || null,
          kind: item.selected_unit.kind || null,
          tier_label: item.selected_unit.tier_label || null,
        }
      : null,
    ontology_route: normalizedQuestionOntologyRoute(item.ontology_route || item.question_highlight?.ontology_route),
    visible_summary: {
      unit_count: Number(item.visible_summary?.unit_count || 0),
      law_count: Number(item.visible_summary?.law_count || 0),
      substantive_count: Number(item.visible_summary?.substantive_count || 0),
      top_topic: item.visible_summary?.top_topic || null,
      top_function: item.visible_summary?.top_function || null,
      tier_counts: item.visible_summary?.tier_counts || {},
    },
    artifact_provenance: item.artifact_provenance || {},
    publication_policy: aggregateInquiryLogPolicy(),
  };
}

function exportFrontdoorSavedRoutes() {
  download("evolocus-frontdoor-routes.json", JSON.stringify(frontdoorRouteExportPayload(), null, 2), "application/json");
}

function importFrontdoorSavedRoutes(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(String(reader.result || "{}"));
      const importedRoutes = frontdoorRouteImportEntries(payload, file);
      saveInquiryResultsLog([...importedRoutes, ...state.inquiryResultsLog].slice(0, 12));
      state.frontdoorRouteImportStatus = {
        filename: file.name || "route packet",
        imported: importedRoutes.length,
        skipped: Math.max(0, Number(payload.route_count || (payload.routes || []).length || 0) - importedRoutes.length),
      };
      state.activeInquiryReplayId = importedRoutes[0]?.id || state.activeInquiryReplayId;
      alert(`Imported ${importedRoutes.length} content-free aggregate route${importedRoutes.length === 1 ? "" : "s"} into browser-local history.`);
      event.target.value = "";
      render();
    } catch (error) {
      event.target.value = "";
      alert(`Route packet import failed: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

function frontdoorRouteImportEntries(payload, file) {
  if (!payload || payload.schema_version !== "evolocus-frontdoor-route-export-v1") {
    throw new Error("Route packet must use schema evolocus-frontdoor-route-export-v1.");
  }
  if (containsBlockedRoutePacketKeys(payload)) {
    throw new Error("Route packet contains blocked row-text, locator, answer-text, review-event, or secret-shaped fields.");
  }
  const routes = Array.isArray(payload.routes) ? payload.routes : [];
  if (!routes.length) {
    throw new Error("Route packet has no routes.");
  }
  if (routes.length > 12) {
    throw new Error("Route packet imports are bounded to 12 routes.");
  }
  return routes.map((route, index) => frontdoorRouteImportEntry(route, payload, file, index));
}

function containsBlockedRoutePacketKeys(value) {
  const blockedKeys = new Set(["content", "header", "source_locator", "source_locators", "answer_excerpt", "review_events", "secret", "token"]);
  if (!value || typeof value !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return value.some(containsBlockedRoutePacketKeys);
  }
  return Object.entries(value).some(([key, child]) => blockedKeys.has(key) || containsBlockedRoutePacketKeys(child));
}

function frontdoorRouteImportEntry(route, payload, file, index) {
  const routeId = String(route.route_id || `route-${index}`).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || `route-${index}`;
  const question = String(route.question || "Imported aggregate route").slice(0, 240);
  const ontologyRoute = normalizedQuestionOntologyRoute(route.ontology_route);
  const filterLabels = Array.isArray(route.filter_labels) ? route.filter_labels.slice(0, 8).map((label) => String(label).slice(0, 80)) : [];
  return {
    schema_version: "evolocus-aggregate-inquiry-result-v1",
    id: `frontdoor-import-${Date.now()}-${index}-${routeId}`,
    created_at: new Date().toISOString(),
    source: `front-door route import: ${file.name || "route packet"}`,
    question,
    answer_title: "Imported aggregate route",
    answer_excerpt: "Imported route packet restored aggregate filters, counts, selected public unit metadata, and provenance only.",
    disclosure_level: ["overview", "unit", "evidence"].includes(route.disclosure_level) ? route.disclosure_level : "overview",
    geography_color_mode: route.geography_color_mode || "tier",
    map_filters: normalizedLogMapFilters(route.map_filters),
    filter_labels: filterLabels,
    selected_unit: route.selected_unit
      ? {
          unit_id: route.selected_unit.unit_id || null,
          name: route.selected_unit.name || null,
          state: route.selected_unit.state || null,
          kind: route.selected_unit.kind || null,
          tier_label: route.selected_unit.tier_label || null,
        }
      : null,
    question_highlight: inquiryMapHighlightFromOntologyRoute(question, `front-door route import: ${file.name || "route packet"}`, ontologyRoute, filterLabels),
    ontology_route: ontologyRoute,
    visible_summary: {
      unit_count: Number(route.visible_summary?.unit_count || 0),
      law_count: Number(route.visible_summary?.law_count || 0),
      substantive_count: Number(route.visible_summary?.substantive_count || 0),
      top_topic: route.visible_summary?.top_topic || null,
      top_function: route.visible_summary?.top_function || null,
      tier_counts: route.visible_summary?.tier_counts || {},
    },
    artifact_provenance: {
      ...(route.artifact_provenance || {}),
      imported_from: payload.schema_version,
      imported_at: new Date().toISOString(),
    },
    publication_policy: aggregateInquiryLogPolicy(),
  };
}

function frontdoorSavedRouteCardHtml(item, index, maxRows) {
  const summary = item.visible_summary || {};
  const lawCount = Number(summary.law_count || 0);
  const unitCount = Number(summary.unit_count || 0);
  const width = Math.max(lawCount ? 5 : 0, (lawCount / maxRows) * 100).toFixed(2);
  const filters = item.filter_labels?.length ? item.filter_labels : ["No active filters"];
  const activeClass = item.id === state.activeInquiryReplayId ? " active" : "";
  return `
    <article class="frontdoor-saved-route${activeClass}">
      <div class="frontdoor-saved-route-heading">
        <span>Route ${escapeHtml(String(index + 1))}</span>
        <em>${escapeHtml(formatDateTime(item.created_at))}</em>
      </div>
      <strong>${escapeHtml(item.question || "Aggregate question")}</strong>
      <div class="frontdoor-saved-scale" aria-label="Saved aggregate route scale">
        <b style="width:${escapeHtml(width)}%"></b>
        <em>${escapeHtml(formatCount(lawCount))} rows · ${escapeHtml(formatCount(unitCount))} units</em>
      </div>
      <div class="frontdoor-saved-filters" aria-label="Saved route filters">
        ${filters.slice(0, 4).map((label) => `<i>${escapeHtml(label)}</i>`).join("")}
      </div>
      <div class="frontdoor-saved-actions">
        <button type="button" data-frontdoor-route-action="answer" data-frontdoor-route-id="${escapeHtml(item.id || "")}">Replay answer</button>
        <button type="button" data-frontdoor-route-action="map" data-frontdoor-route-id="${escapeHtml(item.id || "")}">Map route</button>
        <button type="button" data-frontdoor-route-action="ontology" data-frontdoor-route-id="${escapeHtml(item.id || "")}">Ontology route</button>
      </div>
    </article>
  `;
}

function frontdoorQuestionMetricHtml(label, value, detail) {
  return `
    <span>
      <strong>${escapeHtml(label)}</strong>
      <b>${escapeHtml(value)}</b>
      <em>${escapeHtml(detail)}</em>
    </span>
  `;
}

function frontdoorVisualPathQuestion(summary, visibleUnits) {
  const unitPhrase = `${formatCount(visibleUnits.length)} visible county/town aggregate units`;
  const topicPhrase = summary.topTopic.value ? `${summary.topTopic.label} laws` : "the current published law layer";
  return `What does the current public map show for ${topicPhrase} across ${unitPhrase}?`;
}

function frontdoorVisualPathStepHtml(card, question) {
  return `
    <article class="frontdoor-step-card">
      <span>${escapeHtml(card.title)}</span>
      <strong>${escapeHtml(card.value)}</strong>
      <em>${escapeHtml(card.detail)}</em>
      <button type="button" data-frontdoor-action="${escapeHtml(card.key)}" data-frontdoor-question="${escapeHtml(question)}">${escapeHtml(card.button)}</button>
    </article>
  `;
}

function frontdoorExampleQuestionRows(units) {
  return inquiryPathwayRows(units)
    .filter((row) => row.topic && row.tierKey && row.unitCount && row.lawCount)
    .slice(0, 4);
}

function frontdoorExampleQuestionsHtml(rows) {
  if (!rows.length) {
    return `
      <section class="frontdoor-example-questions empty" aria-label="Example topic and tier questions">
        <div>
          <span>Example topic/tier questions</span>
          <strong>No topic/tier examples match the current filters.</strong>
          <p>Reset or loosen map filters to generate aggregate example questions from published units.</p>
        </div>
      </section>
    `;
  }
  const maxLawCount = Math.max(1, ...rows.map((row) => Number(row.lawCount || 0)));
  return `
    <section class="frontdoor-example-questions" aria-label="Example topic and tier questions">
      <div class="frontdoor-example-heading">
        <div>
          <span>Example topic/tier questions</span>
          <strong>Click once to filter the map and ask.</strong>
        </div>
        <em>Aggregate pathways only</em>
      </div>
      <div class="frontdoor-example-grid">
        ${rows.map((row) => frontdoorExampleQuestionCardHtml(row, maxLawCount)).join("")}
      </div>
    </section>
  `;
}

function frontdoorExampleQuestionCardHtml(row, maxLawCount) {
  const question = inquiryPathwayQuestion(row);
  const width = inquiryPathwayWidth(row.lawCount, maxLawCount);
  const topUnit = row.topUnits[0] ? displayUnitName(row.topUnits[0]) : "No unit";
  return `
    <article class="frontdoor-example-card">
      <div class="frontdoor-example-card-heading">
        <i style="background:${escapeHtml(row.tierColor)}"></i>
        <span>${escapeHtml(row.topicLabel)}</span>
        <strong>${escapeHtml(row.tierLabel)}</strong>
      </div>
      <p>${escapeHtml(question)}</p>
      <div class="frontdoor-example-scale" aria-label="Aggregate rows for this example">
        <b style="width:${escapeHtml(width)}%"></b>
        <em>${escapeHtml(formatCount(row.lawCount))} rows · ${escapeHtml(formatCount(row.unitCount))} units · ${escapeHtml(topUnit)}</em>
      </div>
      <div class="frontdoor-example-actions">
        <button type="button" data-frontdoor-example-action="ask" data-frontdoor-example-topic="${escapeHtml(row.topic)}" data-frontdoor-example-tier="${escapeHtml(row.tierKey)}" data-frontdoor-example-question="${escapeHtml(question)}">Ask + filter</button>
        <button type="button" data-frontdoor-example-action="map" data-frontdoor-example-topic="${escapeHtml(row.topic)}" data-frontdoor-example-tier="${escapeHtml(row.tierKey)}" data-frontdoor-example-question="${escapeHtml(question)}">Map</button>
        <button type="button" data-frontdoor-example-action="ontology" data-frontdoor-example-topic="${escapeHtml(row.topic)}" data-frontdoor-example-tier="${escapeHtml(row.tierKey)}" data-frontdoor-example-question="${escapeHtml(question)}">Ontology</button>
      </div>
    </article>
  `;
}

function frontdoorDisclosureButtonHtml(level) {
  const active = state.disclosureLevel === level ? " active" : "";
  return `
    <button type="button" class="frontdoor-disclosure-button${active}" data-frontdoor-disclosure="${escapeHtml(level)}">
      <strong>${escapeHtml(titleCase(level))}</strong>
      <span>${escapeHtml(frontdoorDisclosureLabel(level))}</span>
    </button>
  `;
}

function frontdoorDisclosureLabel(level) {
  if (level === "evidence") {
    return "show provenance gates";
  }
  if (level === "unit") {
    return "show selected-unit context";
  }
  return "show aggregate overview";
}

function renderVisualRouteVerification() {
  const target = $("#visual-route-verification");
  if (!target) {
    return;
  }
  const smoke = state.analysis.visualSmoke;
  if (!smoke) {
    target.innerHTML = `
      <article class="visual-route-verification-card loading">
        <span>Route verification loading</span>
        <strong>Chart -> Map -> Inquiry -> Ontology</strong>
        <p>The hosted-route verification card appears after the public smoke artifact loads.</p>
      </article>
    `;
    return;
  }
  const route = smoke.verified_route || {};
  const policy = smoke.publication_policy || {};
  const passed = smoke.status === "success";
  const runUrl = smoke.run_url || ACTIONS_BROWSER_SMOKE_WORKFLOW_URL;
  const metrics = [
    ["Result", passed ? "passed" : smoke.status || "unknown"],
    ["Verified route", route.name || "Chart -> Map -> Inquiry -> Ontology"],
    ["Completed", smoke.completed_at ? `${formatDateTime(smoke.completed_at)} · ${artifactAgeLabel(smoke.completed_at)}` : "not recorded"],
    ["Commit", shortCommit(smoke.head_sha || "")],
  ];
  const chips = [
    ["No rows", policy.raw_rows_included === false],
    ["No text", policy.ordinance_text_included === false],
    ["No locators", policy.record_locator_values_included === false],
    ["No browser model", policy.browser_llm_calls === false],
    ["No secrets", policy.secrets_included === false],
    ["No findings", policy.legal_findings === false],
  ];
  const steps = route.steps || [];
  const assertions = route.assertions || [];
  target.innerHTML = `
    <article class="visual-route-verification-card ${passed ? "passed" : "review"}">
      <div class="visual-route-heading">
        <div>
          <p class="eyebrow">Visual route verified</p>
          <h2>${escapeHtml(route.name || "Chart -> Map -> Inquiry -> Ontology")}</h2>
          <p>${escapeHtml(smoke.interpretation || "Route verification covers public UI navigation only.")}</p>
        </div>
        <a class="primary-action-link" href="${escapeHtml(runUrl)}" target="_blank" rel="noopener noreferrer">Open smoke run</a>
      </div>
      <div class="visual-route-grid">
        ${metrics.map(visualRouteMetricHtml).join("")}
      </div>
      <div class="visual-route-path" aria-label="Verified visual route steps">
        ${steps.map(visualRouteStepHtml).join("")}
      </div>
      <div class="visual-route-policy" aria-label="Visual smoke publication policy">
        ${chips.map(visualRoutePolicyChipHtml).join("")}
      </div>
      <details class="visual-route-assertions">
        <summary>Assertions checked by the browser smoke</summary>
        <ul>
          ${assertions.map((assertion) => `<li>${escapeHtml(assertion)}</li>`).join("")}
        </ul>
      </details>
    </article>
  `;
}

function visualRouteMetricHtml([label, value]) {
  return `
    <span>
      <strong>${escapeHtml(label)}</strong>
      <em>${escapeHtml(String(value))}</em>
    </span>
  `;
}

function visualRouteStepHtml(step, index) {
  return `
    <span>
      <b>${escapeHtml(String(index + 1).padStart(2, "0"))}</b>
      <em>${escapeHtml(step)}</em>
    </span>
  `;
}

function visualRoutePolicyChipHtml([label, ok]) {
  return `
    <span class="${ok ? "ok" : "review"}">
      <strong>${escapeHtml(ok ? "ok" : "review")}</strong>
      <em>${escapeHtml(label)}</em>
    </span>
  `;
}

function applyFrontdoorVisualPathAction(action, question) {
  const visibleUnits = filterMapUnits(state.analysis.mapLayers?.units || []);
  const prompt = question || frontdoorVisualPathQuestion(summarizeUnits(visibleUnits), visibleUnits);
  if (action === "ask") {
    state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(prompt, "front-door visual path", visibleUnits);
    const input = $("#inquiry-form input[name='question']");
    if (input) {
      input.value = prompt;
    }
    answerAndLogInquiry(prompt, "front-door visual path");
    state.activeTab = "inquiry";
    render();
    return;
  }
  if (action === "map") {
    state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(prompt, "front-door visual path", visibleUnits);
  }
  if (action === "ontology") {
    const selectedUnit = currentSelectedMapUnit();
    const tier = selectedUnit?.tier || selectedUnit?.tier_label || state.mapFilters.tier || "";
    if (tier) {
      state.ontologyFocusTier = tier;
    }
    if (state.disclosureLevel === "overview") {
      state.disclosureLevel = "unit";
    }
    state.activeTab = "ontology";
    render();
    return;
  }
  state.activeTab = "map";
  render();
}

function applyFrontdoorExampleQuestion(action, topic, tier, question) {
  state.mapFilters = {
    ...state.mapFilters,
    topic: topic || "",
    tier: tier || "",
  };
  state.selectedUnitId = null;
  const prompt = question || "What does this topic and tier pathway show on the public map?";
  state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(prompt, "front-door topic-tier example", filterMapUnits(state.analysis.mapLayers?.units || []));
  if (action === "map") {
    state.activeTab = "map";
    render();
    return;
  }
  if (action === "ontology") {
    if (tier) {
      state.ontologyFocusTier = tier;
    }
    if (state.disclosureLevel === "overview") {
      state.disclosureLevel = "unit";
    }
    state.activeTab = "ontology";
    render();
    return;
  }
  const input = $("#inquiry-form input[name='question']");
  if (input) {
    input.value = prompt;
  }
  answerAndLogInquiry(prompt, "front-door topic-tier example");
  state.activeTab = "inquiry";
  render();
}

function applyFrontdoorComposerAction(action, form) {
  const formData = form ? new FormData(form) : null;
  const question = String(formData?.get("frontdoor_question") || state.frontdoorComposerQuestion || "").trim();
  state.frontdoorComposerQuestion = question;
  const plan = inquiryMapComposerPlan(question);
  if (action === "preview" || !question) {
    render();
    return;
  }
  state.mapFilters = plan.proposedFilters;
  state.selectedUnitId = plan.previewSummary.topUnit?.unit_id || null;
  setInquiryMapHighlightFromPlan(plan, "front-door question composer");
  const inquiryInput = $("#inquiry-form input[name='question']");
  if (inquiryInput) {
    inquiryInput.value = question;
  }
  if (action === "ask") {
    answerAndLogInquiry(question, "front-door question composer");
    state.activeTab = "inquiry";
    render();
    return;
  }
  if (action === "save") {
    answerAndLogInquiry(question, "front-door saved route");
    render();
    return;
  }
  if (action === "ontology") {
    applyQuestionOntologyRoute(plan.ontologyRoute, { renderNow: false });
    render();
    return;
  }
  state.activeTab = "map";
  render();
}

function applyFrontdoorSavedRoute(action, routeId) {
  if (!routeId) {
    return;
  }
  const destination = action === "map" || action === "ontology" ? action : "inquiry";
  replayInquiryResultLog(routeId, destination);
}

function renderOfflineRefreshFreshness() {
  const target = $("#offline-refresh-freshness");
  if (!target) {
    return;
  }
  const status = state.analysis.status;
  const inquiryBriefings = state.analysis.inquiryBriefings;
  const questionPack = state.analysis.questionPack;
  const refreshStatus = state.analysis.refreshStatus;
  const briefingGrok = inquiryBriefings?.grok || {};
  const questionGrok = questionPack?.grok || {};
  const latestArtifact = latestIso([inquiryBriefings?.generated_at, questionPack?.generated_at, status?.generated_at, refreshStatus?.completed_at, refreshStatus?.generated_at]);
  const briefingMode = inquiryBriefings
    ? briefingGrok.used
      ? `Offline Grok ${briefingGrok.model || "model noted"}`
      : "Deterministic briefing"
    : "Briefing loading";
  const questionMode = questionPack
    ? questionGrok.used
      ? `Offline noted ${questionGrok.model || "model noted"}`
      : "Deterministic question pack"
    : "Question pack loading";
  const validationState = status?.real_locus_rows_published === false
    ? "validated aggregate-only before Pages deploy"
    : "publication boundary loading";
  const metrics = [
    ["Briefing mode", briefingMode],
    ["Question pack", questionMode],
    ["Briefings", inquiryBriefings ? formatCount((inquiryBriefings.briefings || []).length) : "loading"],
    ["Prompts", questionPack ? formatCount((questionPack.prompts || []).length) : "loading"],
    ["Latest artifact", latestArtifact ? `${formatDateTime(latestArtifact)} · ${artifactAgeLabel(latestArtifact)}` : "loading"],
    ["Latest Actions run", refreshStatus ? `run ${refreshStatus.run_id || "unknown"} · ${refreshStatus.conclusion || refreshStatus.status || "published"}` : "refresh status loading"],
    ["Validation", validationState],
  ];
  target.innerHTML = `
    <article class="offline-refresh-freshness-card">
      <div class="offline-refresh-heading">
        <div>
          <p class="eyebrow">Offline analysis freshness</p>
          <h2>Static inquiry artifacts are refreshed outside the browser.</h2>
          <p>Grok enrichment, when present, is generated by local tooling or GitHub Actions and committed as validated aggregate JSON. The Pages app never sends questions, keys, source locators, review events, or ordinance text to a model endpoint.</p>
        </div>
        <a class="primary-action-link" href="${ACTIONS_REFRESH_WORKFLOW_URL}" target="_blank" rel="noopener noreferrer">Open refresh workflow</a>
      </div>
      <div class="offline-refresh-grid">
        ${metrics.map(offlineRefreshMetricHtml).join("")}
      </div>
      ${grokRefreshRunBadgeHtml(refreshStatus, inquiryBriefings, questionPack)}
      <div class="offline-refresh-boundary">
        <span>No browser model calls</span>
        <span>No key in public JavaScript</span>
        <span>Validated aggregate artifacts only</span>
      </div>
    </article>
  `;
}

function grokRefreshRunBadgeHtml(refreshStatus, inquiryBriefings, questionPack) {
  const briefingGrok = inquiryBriefings?.grok || {};
  const questionGrok = questionPack?.grok || {};
  const runUrl = safeRefreshRunUrl(refreshStatus?.run_url || "");
  const runLabel = refreshStatus?.run_id ? `Run ${refreshStatus.run_id}` : "Refresh workflow";
  const conclusion = refreshStatus?.conclusion || refreshStatus?.status || "status loading";
  const completedAt = refreshStatus?.completed_at || refreshStatus?.generated_at || "";
  const persistedCommit = shortCommit(refreshStatus?.artifact_commit || refreshStatus?.head_sha || "");
  const rows = [
    ["Run status", `${conclusion}${completedAt ? ` · ${formatDateTime(completedAt)}` : ""}`],
    ["Grok mode", briefingGrok.used || questionGrok.used ? `offline ${briefingGrok.model || questionGrok.model || "model noted"}` : "deterministic static"],
    ["Published artifacts", `${inquiryBriefings ? `${formatCount((inquiryBriefings.briefings || []).length)} briefings` : "briefings loading"} · ${questionPack ? `${formatCount((questionPack.prompts || []).length)} prompts` : "prompts loading"}`],
    ["Artifact commit", persistedCommit],
  ];
  return `
    <section class="grok-refresh-run-badge" aria-label="Latest offline Grok refresh run">
      <div class="grok-refresh-run-heading">
        <div>
          <span>Latest offline refresh</span>
          <strong>${escapeHtml(runLabel)}</strong>
        </div>
        <a href="${escapeHtml(runUrl)}" target="_blank" rel="noopener noreferrer">Open run</a>
      </div>
      <div class="grok-refresh-run-grid">
        ${rows.map(offlineRefreshMetricHtml).join("")}
      </div>
      <p>Run metadata is public aggregate provenance only. The browser receives no model credentials, raw rows, ordinance text, source locator values, review events, or legal findings.</p>
    </section>
  `;
}

function safeRefreshRunUrl(value) {
  const url = String(value || "");
  return url.startsWith("https://github.com/evcatalyst/evolocus/actions/runs/")
    ? url
    : ACTIONS_REFRESH_WORKFLOW_URL;
}

function offlineRefreshMetricHtml([label, value]) {
  return `
    <span>
      <strong>${escapeHtml(label)}</strong>
      <em>${escapeHtml(String(value))}</em>
    </span>
  `;
}

function renderImportStatus() {
  const panel = $("#import-status");
  if (!panel) {
    return;
  }
  if (isSyntheticQueue()) {
    panel.innerHTML = `
      <article class="import-status-card demo">
        <div>
          <p class="eyebrow">Queue source</p>
          <h3>Synthetic demo queue active.</h3>
          <p>No local review package is loaded. Public maps and charts still read aggregate LOCUS artifacts; the review queue uses synthetic records until you import a bounded local package or load the synthetic package demo.</p>
        </div>
        <div class="import-status-facts">
          <span><strong>${escapeHtml(formatCount(records.length))}</strong><em>synthetic records</em></span>
          <span><strong>No LOCUS text</strong><em>in browser review queue</em></span>
          <span><strong>Pages-safe</strong><em>no upload occurs</em></span>
        </div>
      </article>
    `;
    return;
  }
  const meta = loadImportStatus() || fallbackImportStatus();
  panel.innerHTML = importStatusHtml(meta);
}

function importStatusHtml(meta) {
  const policy = meta.package_policy || {};
  const syntheticPackage = Boolean(meta.synthetic_demo_data);
  const textLabel = syntheticPackage ? "Synthetic text only" : meta.ordinance_text_included ? "Text included locally" : "Metadata only";
  const textDetail = syntheticPackage
    ? "demo text; no LOCUS ordinance text"
    : meta.ordinance_text_included
      ? "review text stays in this browser"
      : "no ordinance text loaded";
  const publicationLabel = meta.github_pages_publication_allowed ? "Publication blocked" : "Local only";
  const unitRows = topCountEntries(meta.unit_counts || {}, 5);
  return `
    <article class="import-status-card imported">
      <div>
        <p class="eyebrow">${escapeHtml(syntheticPackage ? "Synthetic browser package" : "Browser-local package")}</p>
        <h3>${escapeHtml(meta.file_name || "Imported bounded package")}</h3>
        <p>${escapeHtml(meta.dataset_id || "LocalLaws/LOCUS-v1")} · revision ${escapeHtml(meta.dataset_revision || "unknown")} · imported ${escapeHtml(formatDateTime(meta.imported_at))}</p>
      </div>
      <div class="import-status-facts">
        <span><strong>${escapeHtml(formatCount(meta.record_count || 0))}</strong><em>records loaded</em></span>
        <span><strong>${escapeHtml(formatCount(meta.unit_count || 0))}</strong><em>aggregate units</em></span>
        <span><strong>${escapeHtml(textLabel)}</strong><em>${escapeHtml(textDetail)}</em></span>
        <span><strong>${escapeHtml(publicationLabel)}</strong><em>${escapeHtml(meta.github_pages_publication_allowed ? "do not publish package" : "not a Pages artifact")}</em></span>
      </div>
      <div class="import-safety-grid">
        ${importSafetyBadge("Publication", policy.github_pages_publication_allowed ? "blocked" : "clear", policy.github_pages_publication_allowed ? "Package says publication allowed; treat as unsafe." : "Package is marked local-only.")}
        ${importSafetyBadge("Ordinance text", meta.ordinance_text_included ? "explicit" : "clear", syntheticPackage ? "Synthetic placeholders only; no LOCUS ordinance text." : meta.ordinance_text_included ? "Text loaded by explicit local package import." : "No text field was loaded.")}
        ${syntheticPackage ? importSafetyBadge("Demo source", "clear", "Generated in this browser from published aggregate units.") : ""}
        ${importSafetyBadge("Source locators", meta.source_locators_included ? "explicit" : "clear", meta.source_locators_included ? "Present for local provenance joins only." : "No source locator values loaded.")}
        ${importSafetyBadge("Review history", meta.review_events_included ? "blocked" : "clear", meta.review_events_included ? "Unexpected review history present." : "No review events imported.")}
      </div>
      ${
        unitRows.length
          ? `<div class="import-unit-strip">${unitRows.map((row) => `<span><strong>${escapeHtml(row.label)}</strong><em>${escapeHtml(formatCount(row.value))}</em></span>`).join("")}</div>`
          : ""
      }
    </article>
  `;
}

function importSafetyBadge(label, stateLabel, detail) {
  return `
    <span class="import-safety-${escapeHtml(stateLabel)}">
      <strong>${escapeHtml(label)}</strong>
      <em>${escapeHtml(detail)}</em>
    </span>
  `;
}

function isSyntheticQueue() {
  return records === syntheticRecords || !localStorage.getItem(STORAGE_RECORDS);
}

function recordSourceBadge(_record) {
  if (isSyntheticQueue()) {
    return "SYNTHETIC DEMONSTRATION DATA";
  }
  const meta = loadImportStatus();
  if (meta?.synthetic_demo_data) {
    return "SYNTHETIC DEMONSTRATION PACKAGE";
  }
  if (meta?.ordinance_text_included) {
    return "BROWSER-LOCAL IMPORTED LOCUS TEXT";
  }
  if (meta?.browser_import_compatible) {
    return "BROWSER-LOCAL IMPORTED PACKAGE METADATA";
  }
  return "BROWSER-LOCAL IMPORTED QUEUE";
}

function renderReview() {
  const record = currentRecord();
  const metrics = queueMetrics();
  $("#metric-total").textContent = metrics.total;
  $("#metric-reviewed").textContent = metrics.reviewed;
  $("#metric-flagged").textContent = metrics.flagged;
  $("#metric-remaining").textContent = metrics.remaining;

  if (!record) {
    $("#record-position").textContent = "No records loaded";
    $("#record-header").textContent = "No record loaded";
    $("#record-content").textContent = "";
    return;
  }

  $("#record-position").textContent = `Item ${state.currentIndex + 1} of ${records.length}`;
  $("#record-header").textContent = record.header || "Untitled chunk";
  $("#record-content").textContent = record.content || "";

  const badges = [
    recordSourceBadge(record),
    `status: ${statusForRecord(record)}`,
    `ocr risk: ${text(record.ocr_risk_level)}`,
  ];
  $("#record-badges").innerHTML = badges.map((badge) => `<span>${escapeHtml(badge)}</span>`).join("");

  const metadata = [
    ["Record ID", record.record_id],
    ["Source locator", record.source_locator],
    ["State", record.state],
    ["City", record.city],
    ["County", record.county],
    ["Raw jurisdiction type", record.source_jurisdiction_type],
    ["Normalized type", record.jurisdiction_type_normalized],
    ["Jurisdiction", record.jurisdiction_name],
    ["Text length", `${text(record.content_length_words)} words / ${text(record.content_length_chars)} chars`],
  ];
  $("#record-metadata").innerHTML = metadata
    .map(([key, value]) => `<dt>${escapeHtml(key)}</dt><dd>${escapeHtml(text(value))}</dd>`)
    .join("");

  const reasons = record.ocr_risk_reasons || [];
  $("#ocr-flags").innerHTML = reasons.length
    ? reasons.map((reason) => `<span>${escapeHtml(reason)}</span>`).join("")
    : "<span>No OCR risk flags</span>";

  renderPrediction(record);
  renderHistory(record);
}

function renderMap() {
  const mapLayers = state.analysis.mapLayers;
  const status = state.analysis.status;
  const allUnits = mapLayers ? mapLayers.units || [] : [];
  const units = filterMapUnits(allUnits);
  const packageStats = importedPackageMapStats(allUnits);
  renderAnalysisStatus(status, units);

  if (!mapLayers) {
    $("#map-generated").textContent = state.analysis.error || "Analysis artifacts are loading.";
    $("#map-geometry-status").textContent = "No map layer loaded";
    $("#map-refresh-source").innerHTML = "";
    $("#tier-legend").innerHTML = "";
    $("#map-reading-guide").innerHTML = "";
    $("#map-route-replay").innerHTML = "";
    $("#map-inline-inquiry").innerHTML = "";
    $("#map-question-highlight").innerHTML = "";
    $("#law-map").innerHTML = "";
    $("#map-insight-grid").innerHTML = "";
    $("#map-comparison-grid").innerHTML = "";
    $("#package-map-summary").innerHTML = "";
    $("#unit-detail").innerHTML = "<p>No map layer has loaded yet.</p>";
    $("#map-unit-table tbody").innerHTML = "";
    return;
  }

  renderMapFilters(allUnits);
  renderMapInsights(units, allUnits);
  renderMapComparisons(units, allUnits);
  renderPackageMapSummary(packageStats, units);
  if (state.selectedUnitId && !units.some((unit) => unit.unit_id === state.selectedUnitId)) {
    state.selectedUnitId = null;
  }
  if (!state.selectedUnitId && units.length) {
    state.selectedUnitId = units[0].unit_id;
  }
  renderCountyChoropleth(units, packageStats);
  renderMapReadingGuide(units, allUnits, mapLayers, packageStats);
  renderMapRefreshSource(status, mapLayers);
  renderMapQuestionHighlight(units);
  $("#map-generated").textContent = `Generated ${new Date(mapLayers.generated_at).toLocaleString()}`;
  $("#map-geometry-status").textContent = mapLayers.geometry_status || "geometry status unavailable";
  $("#map-note").textContent = mapLayers.notice || "Tiers are neutral analysis bands, not legal rankings.";
  $("#tier-legend").innerHTML = Object.entries(mapLayers.tier_definitions || {})
    .map(
      ([tier, definition]) => `
        <span><i style="background:${escapeHtml(definition.color)}"></i>${escapeHtml(definition.label)} <em>${escapeHtml(tier)}</em></span>
      `,
    )
    .join("");

  renderMapRouteReplay();
  renderMapInlineInquiry();

  const visibleStates = new Set(units.map((unit) => unit.state).filter(Boolean));
  const stateCenters = (mapLayers.state_centers || []).filter((center) => visibleStates.has(center.state));
  $("#law-map").setAttribute("viewBox", mapLayers.view_box || "0 0 100 100");
  $("#law-map").innerHTML = `${stateCenters.map(stateCenterSvg).join("")}${units.map((unit) => unitSvg(unit, packageStats)).join("")}`;
  $("#map-unit-table tbody").innerHTML = units
    .map(
      (unit) => {
        const packageHit = packageStats.units.get(unit.unit_id);
        return `
        <tr class="${packageHit ? "package-hit" : ""}">
          <td><button type="button" data-unit-id="${escapeHtml(unit.unit_id)}">${escapeHtml(displayUnitName(unit))}</button></td>
          <td>${escapeHtml(text(unit.state))}</td>
          <td>${escapeHtml(text(unit.kind))}</td>
          <td>${escapeHtml(text(unit.tier_label))}</td>
          <td>${escapeHtml(String(unit.law_count))}</td>
          <td>${escapeHtml(text(unit.dominant_topic))}</td>
          <td>${packageHit ? `<span class="package-hit-badge">${escapeHtml(formatCount(packageHit.recordCount))} local</span>` : "none"}</td>
        </tr>
      `;
      },
    )
    .join("");
  renderSelectedUnit();
  renderPublicationGates();
  renderDisclosureButtons();
  renderGeoColorButtons();
  renderGeoLayerControls();
}

function renderMapRefreshSource(status, mapLayers) {
  const target = $("#map-refresh-source");
  if (!target) {
    return;
  }
  const summary = lastRefreshSourceSummary(status, mapLayers);
  target.innerHTML = `
    <article class="map-refresh-source-card">
      <div>
        <p class="eyebrow">Last refresh source</p>
        <h3>${escapeHtml(summary.title)}</h3>
        <p>${escapeHtml(summary.detail)}</p>
      </div>
      <dl>
        ${summary.rows
          .map(
            ([label, value]) => `
              <dt>${escapeHtml(label)}</dt>
              <dd>${escapeHtml(value)}</dd>
            `,
          )
          .join("")}
      </dl>
    </article>
  `;
}

function lastRefreshSourceSummary(status, mapLayers) {
  const inquiryBriefings = state.analysis.inquiryBriefings;
  const questionPack = state.analysis.questionPack;
  const briefingGrok = inquiryBriefings?.grok || {};
  const mapSource = mapLayers?.synthetic ? "synthetic demo artifact" : "tracked Polars aggregate artifact";
  const briefingSource = inquiryBriefings
    ? briefingGrok.used
      ? `offline Grok briefing (${briefingGrok.model || "model recorded"})`
      : "deterministic static briefing"
    : "briefing artifact loading";
  const questionPackSource = questionPack
    ? questionPack.grok?.used
      ? `offline Grok question pack (${questionPack.grok.model || "model recorded"})`
      : "deterministic question pack"
    : "question pack loading";
  const title = status?.analysis_state ? `${status.analysis_state} · ${mapSource}` : `Loading · ${mapSource}`;
  const detail = "The map uses committed aggregate JSON produced from local Polars analysis. Manual Actions refreshes may update inquiry briefings, but the browser still receives only validated aggregate artifacts.";
  return {
    title,
    detail,
    rows: [
      ["Map source", mapSource],
      ["Map generated", mapLayers?.generated_at ? `${formatDateTime(mapLayers.generated_at)} · ${artifactAgeLabel(mapLayers.generated_at)}` : "loading"],
      ["Analysis commit", shortCommit(status?.code_commit)],
      ["Briefing source", briefingSource],
      ["Briefing generated", inquiryBriefings?.generated_at ? `${formatDateTime(inquiryBriefings.generated_at)} · ${artifactAgeLabel(inquiryBriefings.generated_at)}` : "loading"],
      ["Question pack", questionPackSource],
      ["Deploy guard", "public artifact validator runs before Pages upload"],
      ["Boundary", status?.real_locus_rows_published === false ? "aggregate only; no LOCUS row text" : "publication boundary loading"],
    ],
  };
}

function renderArtifactFreshnessBadges() {
  artifactFreshnessTargets().forEach(({ targetId, title, context, kind }) => {
    const target = $(`#${targetId}`);
    if (!target) {
      return;
    }
    target.innerHTML = artifactFreshnessBadgeHtml(title, context, kind);
  });
}

function artifactFreshnessTargets() {
  return [
    {
      targetId: "map-freshness-badge",
      title: "Map artifact freshness",
      context: "Real aggregate map layer",
      kind: "map",
    },
    {
      targetId: "inquiry-freshness-badge",
      title: "Inquiry artifact freshness",
      context: "Static aggregate question layer",
      kind: "inquiry",
    },
  ];
}

function artifactFreshnessBadgeHtml(title, context, kind) {
  const status = state.analysis.status;
  const mapLayers = state.analysis.mapLayers;
  const inquiryBriefings = state.analysis.inquiryBriefings;
  const questionPack = state.analysis.questionPack;
  const briefingGrok = inquiryBriefings?.grok || {};
  const datasetRevision = status?.dataset_revision || mapLayers?.dataset_revision || inquiryBriefings?.dataset_revision || "loading";
  const mapGenerated = mapLayers?.generated_at || status?.generated_at || null;
  const briefingGenerated = inquiryBriefings?.generated_at || null;
  const questionPackGenerated = questionPack?.generated_at || null;
  const currentMode = inquiryBriefings
    ? briefingGrok.used
      ? `Offline Grok ${briefingGrok.model || "enrichment"}`
      : "Deterministic static briefing"
    : "Briefing loading";
  const refreshSummary = lastRefreshSourceSummary(status, mapLayers);
  const rowBoundary = status?.real_locus_rows_published === false ? "No row text published" : "Publication boundary loading";
  const rows = [
    { label: "Dataset", value: datasetRevision },
    { label: "Map layer", value: mapGenerated ? `${formatDateTime(mapGenerated)} · ${artifactAgeLabel(mapGenerated)}` : "loading" },
    { label: "Briefing", value: briefingGenerated ? `${formatDateTime(briefingGenerated)} · ${artifactAgeLabel(briefingGenerated)}` : "loading" },
    { label: "Question pack", value: questionPackGenerated ? `${formatDateTime(questionPackGenerated)} · ${artifactAgeLabel(questionPackGenerated)}` : "loading" },
    { label: "Since snapshot", value: artifactFreshnessSnapshotDelta(kind), className: "snapshot-delta" },
    { label: "Refresh source", value: refreshSummary.rows[0][1] },
    { label: "Mode", value: currentMode },
    { label: "Boundary", value: rowBoundary },
  ];
  return `
    <article class="artifact-freshness-card">
      <div class="artifact-freshness-heading">
        <div>
          <p class="eyebrow">${escapeHtml(context)}</p>
          <h3>${escapeHtml(title)}</h3>
        </div>
        <button type="button" data-open-status-tab>Open Analysis Status</button>
      </div>
      <div class="artifact-freshness-grid">
        ${rows
          .map(
            (row) => `
              <span${row.className ? ` class="${escapeHtml(row.className)}"` : ""}>
                <strong>${escapeHtml(row.label)}</strong>
                <em>${escapeHtml(String(row.value))}</em>
              </span>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function artifactFreshnessSnapshotDelta(kind) {
  const snapshotMetrics = state.analysis.artifactSnapshot?.metrics || {};
  const metrics = currentArtifactSnapshotMetrics(state.analysis.status || {}, state.analysis);
  if (kind === "map") {
    return artifactDeltaSummary([
      artifactMetricDelta(metrics.unit_count, snapshotMetrics.unit_count, "units"),
      artifactMetricDelta(metrics.law_count, snapshotMetrics.law_count, "rows"),
    ]);
  }
  if (kind === "inquiry") {
    return artifactDeltaSummary([
      artifactMetricDelta(metrics.inquiry_briefing_count, snapshotMetrics.inquiry_briefing_count, "briefings"),
      artifactMetricDelta(metrics.question_prompt_count, snapshotMetrics.question_prompt_count, "prompts"),
    ]);
  }
  return "snapshot baseline unavailable";
}

function artifactAgeLabel(isoValue) {
  const parsed = new Date(isoValue).getTime();
  if (!Number.isFinite(parsed)) {
    return "age unknown";
  }
  const elapsedMs = Math.max(0, Date.now() - parsed);
  const minutes = Math.floor(elapsedMs / 60000);
  if (minutes < 1) {
    return "just now";
  }
  if (minutes < 60) {
    return `${formatCount(minutes)} min ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 48) {
    return `${formatCount(hours)} hr ago`;
  }
  const days = Math.floor(hours / 24);
  return `${formatCount(days)} days ago`;
}

function openAnalysisStatusTab() {
  state.activeTab = "status";
  render();
}

function renderMapReadingGuide(units, allUnits, mapLayers, packageStats) {
  const summary = summarizeUnits(units);
  const allSummary = summarizeUnits(allUnits);
  const tierDefinitions = mapLayers.tier_definitions || {};
  const filterLabels = activeFilterLabels();
  const countyCount = units.filter((unit) => unit.kind === "county").length;
  const municipalCount = units.filter((unit) => unit.kind === "city").length;
  const layerLabels = activeGeographyLayerLabels().join(" + ") || "No official geography layers";
  const packageVisible = packageStats.imported
    ? [...packageStats.units.values()].filter((hit) => units.some((unit) => unit.unit_id === hit.unitId)).length
    : 0;
  const tierRows = Object.entries(summary.tierCounts)
    .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
    .map(([label, value]) => {
      const definition = Object.values(tierDefinitions).find((item) => item.label === label) || {};
      const tierKey = definition.key || tierKeyForLabel(label, tierDefinitions);
      const color = definition.color || tierColorForLabel(label, units, tierDefinitions);
      return `
        <button type="button" data-tier-ontology="${escapeHtml(tierKey)}" aria-label="Open ontology for ${escapeHtml(label)}">
          <i style="background:${escapeHtml(color)}"></i>
          <strong>${escapeHtml(label)}</strong>
          <em>${escapeHtml(formatCount(value))} units</em>
        </button>
      `;
    })
    .join("");
  const disclosure = {
    overview: "Overview: colors and counts only",
    unit: "Unit detail: adds model-output summaries",
    evidence: "Evidence trail: adds provenance and boundary details",
  }[state.disclosureLevel] || "Overview: colors and counts only";
  $("#map-reading-guide").innerHTML = `
    <section class="map-reading-guide-card" aria-label="Map reading guide">
      <div class="map-reading-guide-main">
        <p class="eyebrow">Law-location tier guide</p>
        <h3>${escapeHtml(formatCount(units.length))} visible county/town aggregate units</h3>
        <p>
          The top map is colored by neutral tier bands from aggregate LOCUS model outputs. Filters currently show
          ${escapeHtml(formatCount(summary.lawCount))} law rows from ${escapeHtml(formatCount(allSummary.lawCount))} published aggregate rows.
          Tier colors are review groupings, not legal rankings.
        </p>
      </div>
      <div class="map-reading-guide-metrics">
        <span><strong>${escapeHtml(formatCount(countyCount))}</strong><em>county units</em></span>
        <span><strong>${escapeHtml(formatCount(municipalCount))}</strong><em>town/city units</em></span>
        <span><strong>${escapeHtml(layerLabels)}</strong><em>visible geography layers</em></span>
        <span><strong>${escapeHtml(geographyColorLabel(state.geographyColorMode))}</strong><em>geography color mode</em></span>
        <span><strong>${escapeHtml(disclosure)}</strong><em>disclosure level</em></span>
        ${packageStats.imported ? `<span><strong>${escapeHtml(formatCount(packageVisible))}</strong><em>visible package units</em></span>` : ""}
      </div>
      <div class="map-reading-guide-tiers" aria-label="Visible neutral tier mix">
        ${tierRows || "<span><strong>No visible tiers</strong><em>adjust filters</em></span>"}
      </div>
      ${mapTierLegendDrilldownHtml(units, summary, tierDefinitions)}
      ${mapCrossFilterLegendHtml(units, summary, tierDefinitions)}
      ${mapTopicTierMatrixHtml(units, tierDefinitions)}
      <div class="map-reading-guide-filters" aria-label="Active map filters">
        ${
          filterLabels.length
            ? filterLabels.map((label) => `<span>${escapeHtml(label)}</span>`).join("")
            : "<span>No active filters</span>"
        }
      </div>
      <p class="map-reading-guide-boundary">
        Official county polygons and municipal points are machine-matched and pending review. Public artifacts contain aggregate counts only: no ordinance text, source locators, review events, or legal findings.
      </p>
    </section>
  `;
}

function mapTierLegendDrilldownHtml(units, summary, tierDefinitions) {
  const rows = mapTierLegendDrilldownRows(units, summary, tierDefinitions);
  if (!rows.length) {
    return "";
  }
  return `
    <section class="map-tier-drilldown" aria-label="County/town tier color drilldown">
      <div class="map-tier-drilldown-heading">
        <div>
          <span>County/town tier color drilldown</span>
          <strong>Explain the visible map colors.</strong>
        </div>
        <em>Aggregate rows and units only</em>
      </div>
      <div class="map-tier-drilldown-grid">
        ${rows.map(mapTierLegendDrilldownCardHtml).join("")}
      </div>
      <p>Tier colors are neutral model-output review bands. Drilldowns filter or focus aggregate county/town units only; they are not rankings, legal findings, source records, or evidence that a law controls a place.</p>
    </section>
  `;
}

function mapTierLegendDrilldownRows(units, summary, tierDefinitions) {
  const rows = new Map();
  for (const unit of units || []) {
    const tierKey = unit.tier || tierKeyForLabel(unit.tier_label, tierDefinitions) || "";
    const definition = tierDefinitionForKey(tierKey);
    const rowKey = tierKey || unit.tier_label || "unknown";
    const row = rows.get(rowKey) || {
      tierKey,
      label: definition.label || unit.tier_label || tierKey || "No neutral tier",
      color: definition.color || unit.tier_color || "#d8dee8",
      description: definition.description || "Neutral model-output review band.",
      lawCount: 0,
      unitCount: 0,
      countyCount: 0,
      municipalCount: 0,
      topicCounts: {},
      functionCounts: {},
      topUnit: null,
    };
    row.lawCount += Number(unit.law_count || 0);
    row.unitCount += 1;
    row.countyCount += unit.kind === "county" ? 1 : 0;
    row.municipalCount += unit.kind === "city" ? 1 : 0;
    row.topUnit = !row.topUnit || Number(unit.law_count || 0) > Number(row.topUnit.law_count || 0) ? unit : row.topUnit;
    for (const [topic, value] of Object.entries(unit.topic_counts || {})) {
      if (topic && topic !== "Not_applicable") {
        row.topicCounts[topic] = Number(row.topicCounts[topic] || 0) + Number(value || 0);
      }
    }
    for (const [fn, value] of Object.entries(unit.function_counts || {})) {
      if (fn) {
        row.functionCounts[fn] = Number(row.functionCounts[fn] || 0) + Number(value || 0);
      }
    }
    rows.set(rowKey, row);
  }
  const denominator = Number(summary?.lawCount || 0);
  const limit = state.disclosureLevel === "overview" ? 3 : 5;
  return [...rows.values()]
    .map((row) => {
      const topTopic = topEntry(row.topicCounts);
      const topFunction = topEntry(row.functionCounts);
      return {
        ...row,
        shareLabel: formatPercent(row.lawCount, denominator),
        topTopic,
        topFunction,
      };
    })
    .sort((a, b) => b.lawCount - a.lawCount || b.unitCount - a.unitCount || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function mapTierLegendDrilldownCardHtml(row) {
  const tierKey = row.tierKey || tierKeyForLabel(row.label, state.analysis.mapLayers?.tier_definitions || {}) || row.label;
  return `
    <article class="map-tier-drilldown-card">
      <div class="map-tier-drilldown-card-heading">
        <i style="background:${escapeHtml(row.color)}"></i>
        <span>
          <strong>${escapeHtml(row.label)}</strong>
          <em>${escapeHtml(row.description)}</em>
        </span>
      </div>
      <dl>
        <div><dt>Units</dt><dd>${escapeHtml(formatCount(row.unitCount))}</dd></div>
        <div><dt>Rows</dt><dd>${escapeHtml(formatCount(row.lawCount))}</dd></div>
        <div><dt>Share</dt><dd>${escapeHtml(row.shareLabel)}</dd></div>
        <div><dt>County/town</dt><dd>${escapeHtml(`${formatCount(row.countyCount)} / ${formatCount(row.municipalCount)}`)}</dd></div>
      </dl>
      <p>
        Top aggregate route: ${escapeHtml(row.topTopic.label)} topic (${escapeHtml(formatCount(row.topTopic.value))} rows)
        · ${escapeHtml(row.topFunction.label)} function (${escapeHtml(formatCount(row.topFunction.value))} rows)
        · ${escapeHtml(row.topUnit ? displayUnitName(row.topUnit) : "no unit")}
      </p>
      <div class="map-tier-drilldown-actions">
        <button type="button" data-map-tier-drilldown="filter" data-map-tier-drilldown-value="${escapeHtml(tierKey)}">Filter map</button>
        <button type="button" data-map-tier-drilldown="ontology" data-map-tier-drilldown-value="${escapeHtml(tierKey)}">Open ontology</button>
      </div>
    </article>
  `;
}

function mapCrossFilterLegendHtml(units, summary, tierDefinitions) {
  const limit = state.disclosureLevel === "overview" ? 4 : 6;
  const rows = [
    mapCrossFilterGroup("topic", "Topic nodes", "released model topic labels", crossFilterCountRows(units, "topic_counts", summary.lawCount, limit)),
    mapCrossFilterGroup("function", "Function nodes", "released model function labels", crossFilterCountRows(units, "function_counts", summary.lawCount, limit)),
    mapCrossFilterGroup("tier", "Neutral tiers", "aggregate review color bands", crossFilterTierRows(units, tierDefinitions, limit)),
  ];
  return `
    <section class="map-cross-filter-legend" aria-label="Cross-filtered topic function and tier legend">
      <div class="map-cross-filter-heading">
        <div>
          <span>Cross-filter legend</span>
          <strong>Visible topic, function, and tier routes</strong>
        </div>
        <em>Current map scope only</em>
      </div>
      <div class="map-cross-filter-grid">
        ${rows.map(mapCrossFilterGroupHtml).join("")}
      </div>
      <p>Rows apply browser map filters from aggregate counts only. They are navigation aids, not legal findings, rankings, or evidence that a law controls a place.</p>
    </section>
  `;
}

function mapCrossFilterGroup(type, title, detail, rows) {
  return { type, title, detail, rows };
}

function crossFilterCountRows(units, countField, denominator, limit) {
  const rows = new Map();
  for (const unit of units || []) {
    for (const [label, rawValue] of Object.entries(unit[countField] || {})) {
      if (!label || label === "Not_applicable") {
        continue;
      }
      const row = rows.get(label) || { label, value: 0, unitCount: 0, topUnit: null };
      const value = Number(rawValue || 0);
      row.value += value;
      if (value > 0) {
        row.unitCount += 1;
      }
      row.topUnit = !row.topUnit || value > Number(row.topUnit[countField]?.[label] || 0) ? unit : row.topUnit;
      rows.set(label, row);
    }
  }
  return [...rows.values()]
    .filter((row) => row.value > 0)
    .map((row) => ({
      ...row,
      valueLabel: `${formatCount(row.value)} rows`,
      unitLabel: `${formatCount(row.unitCount)} units`,
      shareLabel: formatPercent(row.value, denominator),
      topUnitLabel: row.topUnit ? displayUnitName(row.topUnit) : "No unit",
      valueKey: row.label,
    }))
    .sort((a, b) => b.value - a.value || b.unitCount - a.unitCount || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function crossFilterTierRows(units, tierDefinitions, limit) {
  const rows = new Map();
  for (const unit of units || []) {
    const tierKey = unit.tier || tierKeyForLabel(unit.tier_label, tierDefinitions) || "";
    const definition = tierDefinitionForKey(tierKey);
    const label = definition.label || unit.tier_label || tierKey || "No neutral tier";
    const row = rows.get(tierKey || label) || {
      label,
      valueKey: tierKey,
      value: 0,
      unitCount: 0,
      topUnit: null,
      color: definition.color || unit.tier_color || "#d8dee8",
    };
    row.value += Number(unit.law_count || 0);
    row.unitCount += 1;
    row.topUnit = !row.topUnit || Number(unit.law_count || 0) > Number(row.topUnit.law_count || 0) ? unit : row.topUnit;
    rows.set(tierKey || label, row);
  }
  const denominator = (units || []).reduce((total, unit) => total + Number(unit.law_count || 0), 0);
  return [...rows.values()]
    .map((row) => ({
      ...row,
      valueLabel: `${formatCount(row.value)} rows`,
      unitLabel: `${formatCount(row.unitCount)} units`,
      shareLabel: formatPercent(row.value, denominator),
      topUnitLabel: row.topUnit ? displayUnitName(row.topUnit) : "No unit",
    }))
    .sort((a, b) => b.value - a.value || b.unitCount - a.unitCount || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function mapCrossFilterGroupHtml(group) {
  return `
    <article class="map-cross-filter-group">
      <div>
        <span>${escapeHtml(group.title)}</span>
        <em>${escapeHtml(group.detail)}</em>
      </div>
      ${
        group.rows.length
          ? group.rows.map((row) => mapCrossFilterRowHtml(group.type, row, Math.max(1, ...group.rows.map((item) => Number(item.value || 0))))).join("")
          : '<p class="muted-note">No visible aggregate rows for this lens.</p>'
      }
    </article>
  `;
}

function mapCrossFilterRowHtml(type, row, maxValue) {
  const width = Math.max(row.value ? 5 : 0, (Number(row.value || 0) / Math.max(1, Number(maxValue || 1))) * 100).toFixed(2);
  const color = type === "tier" ? row.color || tierDefinitionForKey(row.valueKey).color || "#d8dee8" : "";
  return `
    <button type="button" class="map-cross-filter-row ${escapeHtml(type)}" data-map-cross-filter="${escapeHtml(type)}" data-map-cross-value="${escapeHtml(row.valueKey || row.label)}" data-map-cross-label="${escapeHtml(row.label)}">
      <span>
        ${color ? `<i style="background:${escapeHtml(color)}"></i>` : ""}
        <strong>${escapeHtml(row.label)}</strong>
        <em>${escapeHtml(row.unitLabel)} · ${escapeHtml(row.shareLabel)}</em>
      </span>
      <b><u style="width:${escapeHtml(width)}%"></u></b>
      <small>${escapeHtml(row.valueLabel)} · ${escapeHtml(row.topUnitLabel)}</small>
    </button>
  `;
}

function mapTopicTierMatrixHtml(units, tierDefinitions) {
  const matrix = topicTierMatrixRows(units, tierDefinitions);
  if (!matrix.rows.length || !matrix.tiers.length) {
    return `
      <section class="map-topic-tier-matrix empty" aria-label="Topic and tier co-occurrence matrix">
        <div>
          <span>Topic/tier co-occurrence</span>
          <strong>No visible aggregate cells</strong>
        </div>
        <p>Adjust filters to compare aggregate dominant-topic and neutral-tier intersections.</p>
      </section>
    `;
  }
  return `
    <section class="map-topic-tier-matrix" aria-label="Topic and tier co-occurrence matrix">
      <div class="map-topic-tier-heading">
        <div>
          <span>Topic/tier co-occurrence</span>
          <strong>${escapeHtml(formatCount(matrix.rows.length))} dominant topics across ${escapeHtml(formatCount(matrix.tiers.length))} neutral tiers</strong>
        </div>
        <em>Aggregate units only</em>
      </div>
      <div class="map-topic-tier-grid" style="--tier-columns:${escapeHtml(String(matrix.tiers.length))}">
        <span class="map-topic-tier-corner">Topic</span>
        ${matrix.tiers.map((tier) => mapTopicTierHeaderHtml(tier)).join("")}
        ${matrix.rows.map((row) => mapTopicTierRowHtml(row, matrix)).join("")}
      </div>
      <p>Filter narrows the map by dominant topic and neutral tier. Ask opens a deterministic Inquiry answer for that aggregate cell. Counts are aggregate jurisdiction units and rows, not legal findings.</p>
    </section>
  `;
}

function topicTierMatrixRows(units, tierDefinitions) {
  const grouped = new Map();
  const tierMap = new Map();
  for (const unit of units) {
    const topic = unit.dominant_topic && unit.dominant_topic !== "Not available" ? String(unit.dominant_topic) : "";
    const topicLabel = topic || "No dominant topic";
    const tierKey = unit.tier || tierKeyForLabel(unit.tier_label, tierDefinitions) || "";
    const definition = tierDefinitionForKey(tierKey);
    const tierLabel = definition.label || unit.tier_label || tierKey || "No neutral tier";
    const tierColor = definition.color || unit.tier_color || "#d8dee8";
    const tierSortKey = tierKey || tierLabel;
    if (!tierMap.has(tierSortKey)) {
      tierMap.set(tierSortKey, {
        key: tierKey,
        label: tierLabel,
        color: tierColor,
        sortKey: tierSortKey,
      });
    }
    const key = `${topic || "no-topic"}::${tierSortKey}`;
    const cell = grouped.get(key) || {
      key,
      topic,
      topicLabel,
      tierKey,
      tierLabel,
      tierColor,
      tierSortKey,
      unitCount: 0,
      lawCount: 0,
      topUnit: null,
    };
    cell.unitCount += 1;
    cell.lawCount += Number(unit.law_count || 0);
    cell.topUnit = !cell.topUnit || Number(unit.law_count || 0) > Number(cell.topUnit.law_count || 0) ? unit : cell.topUnit;
    grouped.set(key, cell);
  }
  const tiers = [...tierMap.values()].sort((a, b) => a.label.localeCompare(b.label) || a.sortKey.localeCompare(b.sortKey));
  const topics = [...new Set([...grouped.values()].map((cell) => cell.topicLabel))].sort();
  const rows = topics.map((topicLabel) => {
    const cells = tiers.map((tier) => {
      const match = grouped.get(`${topicLabel === "No dominant topic" ? "no-topic" : topicLabel}::${tier.sortKey}`);
      return match || {
        topic: topicLabel === "No dominant topic" ? "" : topicLabel,
        topicLabel,
        tierKey: tier.key,
        tierLabel: tier.label,
        tierColor: tier.color,
        tierSortKey: tier.sortKey,
        unitCount: 0,
        lawCount: 0,
        topUnit: null,
      };
    });
    return {
      topic: cells.find((cell) => cell.topic)?.topic || "",
      topicLabel,
      lawCount: cells.reduce((total, cell) => total + Number(cell.lawCount || 0), 0),
      unitCount: cells.reduce((total, cell) => total + Number(cell.unitCount || 0), 0),
      cells,
    };
  }).sort((a, b) => b.lawCount - a.lawCount || b.unitCount - a.unitCount || a.topicLabel.localeCompare(b.topicLabel));
  const maxLawCount = Math.max(1, ...[...grouped.values()].map((cell) => Number(cell.lawCount || 0)));
  return { rows, tiers, maxLawCount };
}

function mapTopicTierHeaderHtml(tier) {
  return `
    <span class="map-topic-tier-header">
      <i style="background:${escapeHtml(tier.color)}"></i>
      ${escapeHtml(tier.label)}
    </span>
  `;
}

function mapTopicTierRowHtml(row, matrix) {
  return `
    <span class="map-topic-tier-topic">
      <strong>${escapeHtml(row.topicLabel)}</strong>
      <em>${escapeHtml(formatCount(row.unitCount))} units · ${escapeHtml(formatCount(row.lawCount))} rows</em>
    </span>
    ${row.cells.map((cell) => mapTopicTierCellHtml(cell, matrix.maxLawCount)).join("")}
  `;
}

function mapTopicTierCellHtml(cell, maxLawCount) {
  const width = Math.max(cell.lawCount ? 7 : 0, (Number(cell.lawCount || 0) / maxLawCount) * 100).toFixed(2);
  const disabled = cell.unitCount ? "" : " disabled";
  const topUnit = cell.topUnit ? displayUnitName(cell.topUnit) : "No aggregate unit";
  const question = mapTopicTierQuestion(cell);
  return `
    <div class="map-topic-tier-cell${cell.unitCount ? "" : " empty"}">
      <button type="button" class="map-topic-tier-filter"${disabled} data-map-topic-tier-filter data-map-topic-tier-topic="${escapeHtml(cell.topic)}" data-map-topic-tier-tier="${escapeHtml(cell.tierKey)}">
        <span><b style="width:${escapeHtml(width)}%"></b></span>
        <strong>${escapeHtml(formatCount(cell.unitCount))}</strong>
        <em>${escapeHtml(formatCount(cell.lawCount))} rows</em>
        <small>${escapeHtml(topUnit)}</small>
      </button>
      ${
        cell.unitCount
          ? `<button type="button" class="map-topic-tier-ask" data-map-topic-tier-ask data-map-topic-tier-topic="${escapeHtml(cell.topic)}" data-map-topic-tier-tier="${escapeHtml(cell.tierKey)}" data-map-topic-tier-question="${escapeHtml(question)}">Ask cell</button>`
          : '<span class="map-topic-tier-empty-label">No visible units</span>'
      }
    </div>
  `;
}

function mapTopicTierQuestion(cell) {
  const topicClause = cell.topic ? `${cell.topic} laws` : "laws without a dominant topic";
  const tierClause = cell.tierLabel || "the selected neutral tier";
  return `What does the current filtered map view show for ${topicClause} in ${tierClause} units?`;
}

function renderMapRouteReplay() {
  const panel = $("#map-route-replay");
  if (!panel) {
    return;
  }
  const entries = state.inquiryResultsLog.slice(0, state.disclosureLevel === "overview" ? 3 : 5);
  if (!entries.length) {
    panel.innerHTML = `
      <section class="map-route-replay-card" aria-label="Map-side question route playback">
        <div class="map-route-replay-heading">
          <div>
            <p class="eyebrow">Question paths</p>
            <h3>Replay saved aggregate questions on the map.</h3>
          </div>
          <span>No saved paths</span>
        </div>
        <p class="map-route-empty">Ask or save an aggregate question from the Inquiry panel. Saved routes will appear here with restored filters, map color mode, selected unit, and ontology context.</p>
      </section>
    `;
    return;
  }
  const maxRows = Math.max(1, ...entries.map((item) => Number(item.visible_summary?.law_count || 0)));
  const maxUnits = Math.max(1, ...entries.map((item) => Number(item.visible_summary?.unit_count || 0)));
  panel.innerHTML = `
    <section class="map-route-replay-card" aria-label="Map-side question route playback">
      <div class="map-route-replay-heading">
        <div>
          <p class="eyebrow">Question paths</p>
          <h3>Saved aggregate routes for this map.</h3>
        </div>
        <span>${escapeHtml(formatCount(entries.length))} browser-local</span>
      </div>
      <div class="map-route-list">
        ${entries.map((item, index) => mapRouteReplayCardHtml(item, index, maxRows, maxUnits)).join("")}
      </div>
      <p class="map-route-boundary">Map route playback restores only aggregate browser state. It does not store or reveal ordinance text, headers, source locators, review events, secrets, or live model calls.</p>
    </section>
  `;
}

function mapRouteReplayCardHtml(item, index, maxRows, maxUnits) {
  const summary = item.visible_summary || {};
  const lawCount = Number(summary.law_count || 0);
  const unitCount = Number(summary.unit_count || 0);
  const lawWidth = Math.max(lawCount ? 5 : 0, (lawCount / maxRows) * 100).toFixed(2);
  const unitWidth = Math.max(unitCount ? 5 : 0, (unitCount / maxUnits) * 100).toFixed(2);
  const filters = item.filter_labels?.length ? item.filter_labels : ["No active filters"];
  const activeClass = item.id === state.activeInquiryReplayId ? " active" : "";
  const selectedUnit = item.selected_unit?.name
    ? `${item.selected_unit.name}${item.selected_unit.state ? `, ${item.selected_unit.state}` : ""}`
    : "No selected unit";
  return `
    <article class="map-route-row${activeClass}">
      <button type="button" class="map-route-primary" data-map-route-replay-map="${escapeHtml(item.id || "")}">
        <span>Path ${escapeHtml(String(index + 1))} · ${escapeHtml(formatDateTime(item.created_at))}</span>
        <strong>${escapeHtml(item.question || item.answer_title || "Aggregate question")}</strong>
        <em>${escapeHtml(selectedUnit)} · ${escapeHtml(geographyColorLabel(item.geography_color_mode || state.geographyColorMode))}</em>
      </button>
      <div class="map-route-scale" aria-label="Saved aggregate route scale">
        <span><b style="width:${escapeHtml(lawWidth)}%"></b><em>${escapeHtml(formatCount(lawCount))} law rows</em></span>
        <span><b style="width:${escapeHtml(unitWidth)}%"></b><em>${escapeHtml(formatCount(unitCount))} units</em></span>
      </div>
      <div class="map-route-filters" aria-label="Saved aggregate route filters">
        ${filters.slice(0, 4).map((label) => `<i>${escapeHtml(label)}</i>`).join("")}
      </div>
      <div class="map-route-actions">
        <button type="button" data-map-route-replay-answer="${escapeHtml(item.id || "")}">Replay answer</button>
        <button type="button" data-map-route-replay-map="${escapeHtml(item.id || "")}">Restore map</button>
        <button type="button" data-map-route-replay-ontology="${escapeHtml(item.id || "")}">Open ontology</button>
      </div>
    </article>
  `;
}

function renderMapQuestionHighlight(units) {
  const panel = $("#map-question-highlight");
  if (!panel) {
    return;
  }
  const highlight = normalizedInquiryMapHighlight(state.inquiryMapHighlight);
  if (!highlight) {
    panel.innerHTML = `
      <section class="map-question-highlight-card empty" aria-label="Question-driven map highlight">
        <div>
          <p class="eyebrow">Question highlight</p>
          <h3>No active chat-to-map highlight.</h3>
          <p>Use the Inquiry or landing question composer to infer aggregate filters, then apply them to the map.</p>
        </div>
        <span>No row text, locators, or browser model call</span>
      </section>
    `;
    return;
  }
  const highlightedIds = new Set(highlight.unit_ids || []);
  const visibleHighlightedUnits = (units || []).filter((unit) => highlightedIds.has(unit.unit_id));
  const hiddenCount = Math.max(0, highlightedIds.size - visibleHighlightedUnits.length);
  const summary = summarizeUnits(visibleHighlightedUnits);
  const topUnits = visibleHighlightedUnits.slice(0, state.disclosureLevel === "overview" ? 3 : 6);
  const filterLabels = highlight.filter_labels?.length ? highlight.filter_labels : mapComposerFilterLabels(highlight.map_filters || {});
  const ontologyRoute = normalizedQuestionOntologyRoute(highlight.ontology_route);
  panel.innerHTML = `
    <section class="map-question-highlight-card" aria-label="Question-driven map highlight">
      <div class="map-question-highlight-heading">
        <div>
          <p class="eyebrow">Chat-to-map highlight</p>
          <h3>${escapeHtml(highlight.question || "Aggregate question route")}</h3>
        </div>
        <button type="button" data-clear-inquiry-map-highlight>Clear highlight</button>
      </div>
      <div class="map-question-highlight-metrics">
        ${mapQuestionHighlightMetricHtml("Highlighted units", formatCount(visibleHighlightedUnits.length), hiddenCount ? `${formatCount(hiddenCount)} hidden by current filters` : "all highlighted units visible")}
        ${mapQuestionHighlightMetricHtml("Highlighted rows", formatCount(summary.lawCount), "aggregate law rows only")}
        ${mapQuestionHighlightMetricHtml("Top topic", summary.topTopic.label, `${formatCount(summary.topTopic.value)} highlighted rows`)}
        ${mapQuestionHighlightMetricHtml("Source", highlight.source || "question composer", "browser route state")}
      </div>
      <div class="map-question-highlight-chips" aria-label="Question-inferred aggregate filters">
        ${filterLabels.length ? filterLabels.map((label) => `<span>${escapeHtml(label)}</span>`).join("") : "<span>No inferred filters</span>"}
      </div>
      ${questionOntologyRouteHtml(ontologyRoute, "map")}
      ${topUnits.length ? `<div class="map-question-highlight-units">${topUnits.map((unit) => mapQuestionHighlightUnitHtml(unit)).join("")}</div>` : ""}
      ${mapQuestionHighlightDetailCardsHtml(highlight, visibleHighlightedUnits)}
      <p class="map-question-highlight-boundary">
        Highlighting uses public aggregate unit IDs and counts from static artifacts. It exposes no ordinance text, source locators, review events, rankings, legal conclusions, and makes no browser-side Grok call.
      </p>
    </section>
  `;
}

function mapQuestionHighlightDetailCardsHtml(highlight, units) {
  const detailUnits = (units || [])
    .slice()
    .sort((a, b) => Number(b.law_count || 0) - Number(a.law_count || 0) || displayUnitName(a).localeCompare(displayUnitName(b)))
    .slice(0, state.disclosureLevel === "evidence" ? 5 : state.disclosureLevel === "unit" ? 4 : 3);
  if (!detailUnits.length) {
    return "";
  }
  return `
    <div class="map-question-highlight-details" aria-label="Highlighted county and town detail cards">
      <div class="map-question-highlight-details-heading">
        <strong>Why highlighted county/town units matched</strong>
        <span>Aggregate reasons from current filters and ontology route</span>
      </div>
      ${detailUnits.map((unit) => mapQuestionHighlightDetailCardHtml(highlight, unit)).join("")}
      <p>No row text, source locators, rankings, legal findings, or browser model calls are used in these detail cards.</p>
    </div>
  `;
}

function mapQuestionHighlightDetailCardHtml(highlight, unit) {
  const reasons = mapQuestionHighlightUnitReasons(highlight, unit);
  return `
    <article class="map-question-highlight-detail-card">
      <button type="button" data-unit-id="${escapeHtml(unit.unit_id)}">
        <i style="background:${escapeHtml(unit.tier_color || "#d8dee8")}"></i>
        <span>
          <strong>${escapeHtml(displayUnitName(unit))}</strong>
          <em>${escapeHtml(unit.state || "NA")} · ${escapeHtml(text(unit.kind))} · ${escapeHtml(text(unit.tier_label))}</em>
        </span>
      </button>
      <dl>
        <div><dt>Rows</dt><dd>${escapeHtml(formatCount(unit.law_count))}</dd></div>
        <div><dt>Topic</dt><dd>${escapeHtml(text(unit.dominant_topic))}</dd></div>
        <div><dt>Function</dt><dd>${escapeHtml(text(unit.dominant_function))}</dd></div>
        <div><dt>Model substantive</dt><dd>${escapeHtml(formatPercentRatio(modelSubstantiveShare(unit)))}</dd></div>
      </dl>
      <div class="map-question-highlight-reasons">
        ${reasons.map((reason) => `<span>${escapeHtml(reason)}</span>`).join("")}
      </div>
      ${mapQuestionHighlightOntologyTraceHtml(highlight, unit)}
      <small>Why this unit matched is a public aggregate navigation explanation, not evidence that a law controls a place or person.</small>
    </article>
  `;
}

function mapQuestionHighlightUnitReasons(highlight, unit) {
  const filters = normalizedLogMapFilters(highlight?.map_filters || {});
  const reasons = [];
  if (filters.state && filters.state === unit.state) {
    reasons.push(`state ${unit.state}`);
  }
  if (filters.topic && (unit.dominant_topic === filters.topic || Number(unit.topic_counts?.[filters.topic] || 0) > 0)) {
    reasons.push(`topic ${filters.topic}`);
  }
  if (filters.function && (unit.dominant_function === filters.function || Number(unit.function_counts?.[filters.function] || 0) > 0)) {
    reasons.push(`function ${filters.function}`);
  }
  if (filters.kind && normalizePackageKind(filters.kind) === normalizePackageKind(unit.kind)) {
    reasons.push(`unit type ${unit.kind}`);
  }
  const tierDefinition = filters.tier ? tierDefinitionForKey(filters.tier) : null;
  if (filters.tier && (unit.tier === filters.tier || unit.tier_label === tierDefinition?.label || unit.tier_label === filters.tier)) {
    reasons.push(`tier ${unit.tier_label || filters.tier}`);
  }
  if (filters.scoreField || filters.scoreBand) {
    reasons.push("relative score filter");
  }
  if (filters.auditFocus || filters.minAuditScore) {
    reasons.push("audit review filter");
  }
  if (filters.packageOnly) {
    reasons.push("browser-local package unit");
  }
  if (highlight?.ontology_route?.focus_unit_id === unit.unit_id) {
    reasons.push("ontology route focus unit");
  }
  if (Array.isArray(highlight?.top_unit_ids) && highlight.top_unit_ids.includes(unit.unit_id)) {
    reasons.push("top highlighted unit");
  }
  if (!reasons.length && highlight?.source) {
    reasons.push(highlight.source);
  }
  return reasons.length ? [...new Set(reasons)].slice(0, 5) : ["current aggregate highlight"];
}

function mapQuestionHighlightOntologyTraceHtml(highlight, unit) {
  const nodes = mapQuestionHighlightOntologyTraceNodes(highlight, unit);
  if (!nodes.length) {
    return "";
  }
  return `
    <div class="map-question-highlight-ontology-trace" aria-label="Highlighted-unit ontology trace">
      <strong>Highlighted-unit ontology trace</strong>
      <div class="map-question-highlight-ontology-nodes">
        ${nodes
          .map(
            (node, index) => `
              ${index ? `<i aria-hidden="true">&rarr;</i>` : ""}
              <span class="map-question-highlight-ontology-node ${escapeHtml(node.type)}${node.active ? " active" : ""}">
                <b>${escapeHtml(node.label)}</b>
                <em>${escapeHtml(node.detail)}</em>
              </span>
            `,
          )
          .join("")}
      </div>
      <small>Aggregate route nodes only; this trace is not legal authority, row-level evidence, or a ranking.</small>
    </div>
  `;
}

function mapQuestionHighlightOntologyTraceNodes(highlight, unit) {
  const route = normalizedQuestionOntologyRoute(highlight?.ontology_route);
  const filters = normalizedLogMapFilters(highlight?.map_filters || route?.map_filters || {});
  const routeNodeByType = new Map((route?.nodes || []).map((node) => [node.type, node]));
  const topicLabel = routeNodeByType.get("topic")?.label || route?.focus_topic || filters.topic || unit.dominant_topic || "";
  const functionLabel = routeNodeByType.get("function")?.label || route?.focus_function || filters.function || unit.dominant_function || "";
  const tierDefinition = filters.tier ? tierDefinitionForKey(filters.tier) : null;
  const tierLabel = routeNodeByType.get("tier")?.label || tierDefinition?.label || filters.tier || unit.tier_label || unit.tier || "";
  const nodes = [];
  if (topicLabel) {
    const topicCount = Number(unit.topic_counts?.[topicLabel] || 0);
    nodes.push({
      type: "topic",
      label: `Topic: ${topicLabel}`,
      detail: topicCount ? `${formatCount(topicCount)} aggregate rows in unit` : "route or dominant topic node",
      active: unit.dominant_topic === topicLabel || topicCount > 0,
    });
  }
  if (functionLabel) {
    const functionCount = Number(unit.function_counts?.[functionLabel] || 0);
    nodes.push({
      type: "function",
      label: `Function: ${functionLabel}`,
      detail: functionCount ? `${formatCount(functionCount)} aggregate rows in unit` : "route or dominant function node",
      active: unit.dominant_function === functionLabel || functionCount > 0,
    });
  }
  if (tierLabel) {
    const tierValues = [unit.tier, unit.tier_label, filters.tier].filter(Boolean).map((value) => String(value).toLowerCase());
    nodes.push({
      type: "tier",
      label: `Tier: ${tierLabel}`,
      detail: "neutral color tier from aggregate model-output bands",
      active: tierValues.includes(String(tierLabel).toLowerCase()) || tierValues.includes(String(filters.tier || "").toLowerCase()),
    });
  }
  nodes.push({
    type: "unit",
    label: displayUnitName(unit),
    detail: `${unit.state || "NA"} · ${text(unit.kind)} · ${formatCount(unit.law_count)} aggregate rows`,
    active: true,
  });
  return nodes.filter((node) => node.label && node.detail).slice(0, 4);
}

function mapQuestionHighlightMetricHtml(label, value, detail) {
  return `
    <span>
      <strong>${escapeHtml(label)}</strong>
      <b>${escapeHtml(value)}</b>
      <em>${escapeHtml(detail)}</em>
    </span>
  `;
}

function mapQuestionHighlightUnitHtml(unit) {
  return `
    <button type="button" data-unit-id="${escapeHtml(unit.unit_id)}">
      <strong>${escapeHtml(displayUnitName(unit))}</strong>
      <em>${escapeHtml(unit.state || "NA")} · ${escapeHtml(text(unit.kind))} · ${escapeHtml(text(unit.tier_label))}</em>
    </button>
  `;
}

function normalizedInquiryMapHighlight(highlight) {
  if (!highlight || highlight.schema_version !== "evolocus-question-map-highlight-v1") {
    return null;
  }
  return {
    ...highlight,
    map_filters: normalizedLogMapFilters(highlight.map_filters || {}),
    unit_ids: Array.isArray(highlight.unit_ids) ? highlight.unit_ids.filter(Boolean) : [],
    filter_labels: Array.isArray(highlight.filter_labels) ? highlight.filter_labels.filter(Boolean) : [],
    reasons: Array.isArray(highlight.reasons) ? highlight.reasons.filter(Boolean) : [],
    ontology_route: normalizedQuestionOntologyRoute(highlight.ontology_route),
  };
}

function inquiryMapHighlightFromPlan(plan, source = "question composer") {
  const unitIds = (plan.previewUnits || []).map((unit) => unit.unit_id).filter(Boolean).slice(0, 1000);
  const ontologyRoute = normalizedQuestionOntologyRoute(plan.ontologyRoute || questionOntologyRouteFromPlan(plan, source));
  return {
    schema_version: "evolocus-question-map-highlight-v1",
    question: String(plan.question || "").trim(),
    source,
    map_filters: normalizedLogMapFilters(plan.proposedFilters || {}),
    filter_labels: plan.filterLabels || [],
    reasons: plan.reasons || [],
    unit_ids: unitIds,
    unit_count: unitIds.length,
    law_count: Number(plan.previewSummary?.lawCount || 0),
    top_unit_ids: (plan.previewUnits || []).slice(0, 8).map((unit) => unit.unit_id).filter(Boolean),
    ontology_route: ontologyRoute,
    publication_policy: {
      raw_rows_included: false,
      ordinance_text_included: false,
      record_locator_values_included: false,
      review_events_included: false,
      browser_model_call: false,
    },
  };
}

function inquiryMapHighlightFromVisibleUnits(question, source, units, summary = summarizeUnits(units)) {
  const unitIds = (units || []).map((unit) => unit.unit_id).filter(Boolean).slice(0, 1000);
  const ontologyRoute = questionOntologyRouteFromUnits(question, source, units || [], state.mapFilters, summary);
  return {
    schema_version: "evolocus-question-map-highlight-v1",
    question: String(question || "").trim(),
    source: source || "aggregate inquiry",
    map_filters: mapFiltersSnapshot(),
    filter_labels: activeFilterLabels(),
    reasons: ["Saved route -> current aggregate map filter state"],
    unit_ids: unitIds,
    unit_count: unitIds.length,
    law_count: Number(summary?.lawCount || 0),
    top_unit_ids: (units || []).slice(0, 8).map((unit) => unit.unit_id).filter(Boolean),
    ontology_route: ontologyRoute,
    publication_policy: {
      raw_rows_included: false,
      ordinance_text_included: false,
      record_locator_values_included: false,
      review_events_included: false,
      browser_model_call: false,
    },
  };
}

function setInquiryMapHighlightFromPlan(plan, source) {
  state.inquiryMapHighlight = inquiryMapHighlightFromPlan(plan, source);
}

function questionOntologyRouteFromPlan(plan, source = "question composer") {
  return questionOntologyRouteFromUnits(plan.question, source, plan.previewUnits || [], plan.proposedFilters || {}, plan.previewSummary);
}

function questionOntologyRouteFromUnits(question, source, units, filters = state.mapFilters, summary = summarizeUnits(units)) {
  const routeUnits = units || [];
  const normalizedFilters = normalizedLogMapFilters(filters);
  const routeSummary = summary || summarizeUnits(routeUnits);
  const definitions = state.analysis.mapLayers?.tier_definitions || {};
  const topUnit = routeSummary.topUnit || routeUnits[0] || null;
  const topTier = topEntry(routeSummary.tierCounts || {});
  const focusTier = normalizedFilters.tier || topUnit?.tier || (topTier.value ? tierKeyForLabel(topTier.label, definitions) : "");
  const focusTopic = normalizedFilters.topic || (routeSummary.topTopic?.value ? routeSummary.topTopic.label : "");
  const focusFunction = normalizedFilters.function || (routeSummary.topFunction?.value ? routeSummary.topFunction.label : "");
  const focusUnitId = topUnit?.unit_id || "";
  const tierDefinition = focusTier ? tierDefinitionForKey(focusTier) : null;
  const nodes = [
    focusTopic
      ? questionOntologyRouteNode("topic", `topic:${focusTopic}`, focusTopic, `${formatCount(routeSummary.topicCounts?.[focusTopic] || routeSummary.topTopic?.value || 0)} aggregate rows`)
      : null,
    focusFunction
      ? questionOntologyRouteNode("function", `function:${focusFunction}`, focusFunction, `${formatCount(routeSummary.functionCounts?.[focusFunction] || routeSummary.topFunction?.value || 0)} aggregate rows`)
      : null,
    focusTier
      ? questionOntologyRouteNode(
          "tier",
          `tier:${focusTier}`,
          tierDefinition?.label || focusTier,
          `${formatCount(routeSummary.tierCounts?.[tierDefinition?.label || focusTier] || routeSummary.tierCounts?.[focusTier] || 0)} visible units`,
        )
      : null,
    focusUnitId
      ? questionOntologyRouteNode("unit", `unit:${focusUnitId}`, displayUnitName(topUnit), `${topUnit.state || "NA"} · ${text(topUnit.kind)} · ${formatCount(topUnit.law_count)} rows`)
      : null,
  ].filter(Boolean);
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edgeCount = (state.analysis.ontology?.edges || []).filter((edge) => nodeIds.has(edge.source) || nodeIds.has(edge.target)).length;
  return {
    schema_version: "evolocus-question-ontology-route-v1",
    source: source || "aggregate question route",
    question: String(question || "").trim(),
    map_filters: normalizedFilters,
    focus_tier: focusTier,
    focus_topic: focusTopic,
    focus_function: focusFunction,
    focus_unit_id: focusUnitId,
    unit_ids: routeUnits.map((unit) => unit.unit_id).filter(Boolean).slice(0, 1000),
    unit_count: routeUnits.length,
    law_count: Number(routeSummary.lawCount || 0),
    nodes,
    edge_count: edgeCount,
    publication_policy: questionOntologyRoutePolicy(),
  };
}

function questionOntologyRouteNode(type, id, label, detail) {
  return {
    type,
    id,
    label,
    detail,
    available: ontologyNodeAvailable(id),
  };
}

function ontologyNodeAvailable(nodeId) {
  return Boolean((state.analysis.ontology?.nodes || []).some((node) => node.id === nodeId));
}

function normalizedQuestionOntologyRoute(route) {
  if (!route || route.schema_version !== "evolocus-question-ontology-route-v1") {
    return null;
  }
  return {
    ...route,
    map_filters: normalizedLogMapFilters(route.map_filters || {}),
    unit_ids: Array.isArray(route.unit_ids) ? route.unit_ids.filter(Boolean).slice(0, 1000) : [],
    nodes: Array.isArray(route.nodes)
      ? route.nodes
          .filter((node) => node && node.id && node.label)
          .map((node) => ({
            type: String(node.type || "node"),
            id: String(node.id),
            label: String(node.label),
            detail: String(node.detail || "aggregate node"),
            available: Boolean(node.available),
          }))
          .slice(0, 6)
      : [],
    unit_count: Number(route.unit_count || 0),
    law_count: Number(route.law_count || 0),
    edge_count: Number(route.edge_count || 0),
    publication_policy: questionOntologyRoutePolicy(),
  };
}

function questionOntologyRouteHtml(route, surface = "map") {
  const normalized = normalizedQuestionOntologyRoute(route);
  if (!normalized) {
    return "";
  }
  const actionLabel = surface === "ontology" ? "Refresh ontology route" : "Open ontology route";
  return `
    <section class="question-ontology-route ${escapeHtml(surface)}" aria-label="Ontology-backed aggregate question route">
      <div class="question-ontology-route-heading">
        <span>Ontology-backed route</span>
        <strong>${escapeHtml(formatCount(normalized.nodes.length))} nodes · ${escapeHtml(formatCount(normalized.edge_count))} adjacent graph links</strong>
        <em>${escapeHtml(formatCount(normalized.unit_count))} units · ${escapeHtml(formatCount(normalized.law_count))} aggregate rows</em>
      </div>
      <div class="question-ontology-route-nodes">
        ${normalized.nodes.map(questionOntologyRouteNodeHtml).join("") || "<span>No ontology nodes matched the current aggregate route.</span>"}
      </div>
      <div class="question-ontology-route-actions">
        <button type="button" data-question-ontology-open>${escapeHtml(actionLabel)}</button>
        <span>No row text, source locators, legal conclusions, or browser model calls</span>
      </div>
    </section>
  `;
}

function questionOntologyRouteNodeHtml(node) {
  return `
    <span class="${node.available ? "available" : "review"}">
      <strong>${escapeHtml(titleCase(node.type))}: ${escapeHtml(node.label)}</strong>
      <em>${escapeHtml(node.detail)} · ${escapeHtml(node.available ? "node found" : "node pending review")}</em>
    </span>
  `;
}

function questionOntologyRoutePolicy() {
  return {
    raw_rows_included: false,
    ordinance_text_included: false,
    header_text_included: false,
    record_locator_values_included: false,
    review_events_included: false,
    browser_model_call: false,
    legal_findings: false,
  };
}

function inquiryMapHighlightFromOntologyRoute(question, source, route, filterLabels = []) {
  const normalized = normalizedQuestionOntologyRoute(route);
  if (!normalized) {
    return null;
  }
  const unitIds = normalized.unit_ids || [];
  return {
    schema_version: "evolocus-question-map-highlight-v1",
    question: String(question || normalized.question || "").trim(),
    source: source || normalized.source || "saved aggregate route",
    map_filters: normalized.map_filters,
    filter_labels: Array.isArray(filterLabels) && filterLabels.length ? filterLabels : mapComposerFilterLabels(normalized.map_filters),
    reasons: ["Saved route -> ontology-backed aggregate question route"],
    unit_ids: unitIds,
    unit_count: Number(normalized.unit_count || unitIds.length),
    law_count: Number(normalized.law_count || 0),
    top_unit_ids: unitIds.slice(0, 8),
    ontology_route: normalized,
    publication_policy: questionOntologyRoutePolicy(),
  };
}

function applyQuestionOntologyRoute(route, options = {}) {
  const normalized = normalizedQuestionOntologyRoute(route || state.inquiryMapHighlight?.ontology_route);
  if (!normalized) {
    state.activeTab = "ontology";
    if (options.renderNow !== false) {
      render();
    }
    return false;
  }
  state.mapFilters = normalized.map_filters;
  state.selectedUnitId = normalized.focus_unit_id || state.selectedUnitId;
  if (normalized.focus_tier) {
    state.ontologyFocusTier = normalized.focus_tier;
  }
  state.geographyLayers = {
    ...defaultGeographyLayers(),
    ...state.geographyLayers,
    ontology: true,
  };
  if (state.disclosureLevel === "overview") {
    state.disclosureLevel = "unit";
  }
  state.activeTab = "ontology";
  if (options.renderNow !== false) {
    render();
  }
  return true;
}

function inquiryMapHighlightHasUnit(unitId) {
  const highlight = normalizedInquiryMapHighlight(state.inquiryMapHighlight);
  return Boolean(highlight && highlight.unit_ids.includes(unitId));
}

function renderMapInlineInquiry() {
  const panel = $("#map-inline-inquiry");
  if (!panel) {
    return;
  }
  const prompts = mapInlineInquiryPrompts();
  const activePrompt = prompts.find((prompt) => prompt.key === state.mapInlineInquiry) || prompts[0];
  state.mapInlineInquiry = activePrompt.key;
  const answer = answerQuestion(activePrompt.question);
  const history = loadMapInquiryHistory();
  panel.innerHTML = `
    <section class="map-inline-inquiry-card" aria-label="Map-side aggregate inquiry">
      <div class="map-inline-inquiry-heading">
        <div>
          <p class="eyebrow">Ask this map</p>
          <h3>Static answers from the current aggregate view.</h3>
        </div>
        <span>No browser LLM call</span>
      </div>
      <div class="map-inline-inquiry-prompts" role="group" aria-label="Map inquiry prompts">
        ${prompts.map((prompt) => mapInlineInquiryPromptHtml(prompt, activePrompt.key)).join("")}
      </div>
      <div class="map-inline-chat">
        <div class="map-inline-chat-question">
          <span>Question</span>
          <p>${escapeHtml(activePrompt.question)}</p>
        </div>
        <div class="map-inline-chat-answer">
          ${inquiryAnswerHtml(answer)}
        </div>
      </div>
      <div class="map-inline-inquiry-actions">
        <button type="button" data-save-map-inquiry>Save answer snapshot</button>
        <button type="button" data-export-map-inquiry-history>Export history JSON</button>
        <span>${escapeHtml(formatCount(history.length))} browser-local saved answers</span>
      </div>
      ${mapInlineInquiryHistoryHtml(history)}
      ${mapInlineComparisonStripHtml(activePrompt.key)}
      <p class="map-inline-inquiry-boundary">
        Answers are recomputed from current filters, selected unit, package overlay, and progressive disclosure level. They omit ordinance text, source locator values, review events, and legal conclusions.
      </p>
    </section>
  `;
}

function mapInlineComparisonStripHtml(promptKey) {
  const rows = mapInlineComparisonRows(promptKey);
  const maxValue = Math.max(1, ...rows.map((row) => Number(row.value || 0)));
  return `
    <section class="map-inline-comparison-strip" aria-label="County and town comparison for active map inquiry">
      <div class="map-inline-comparison-heading">
        <div>
          <span>Comparison strip</span>
          <strong>${escapeHtml(mapInlineComparisonTitle(promptKey))}</strong>
        </div>
        <em>${escapeHtml(disclosureComparisonLabel())}</em>
      </div>
      <div class="map-inline-comparison-rows">
        ${
          rows.length
            ? rows.map((row) => mapInlineComparisonRowHtml(row, maxValue)).join("")
            : '<p class="muted-note">No comparable aggregate units match the current map state.</p>'
        }
      </div>
    </section>
  `;
}

function mapInlineInquiryHistoryHtml(history) {
  const rows = history.slice(0, state.disclosureLevel === "overview" ? 3 : 6);
  return `
    <section class="map-inline-inquiry-history" aria-label="Browser-local map inquiry history">
      <div class="map-inline-history-heading">
        <div>
          <span>Question history</span>
          <strong>Saved aggregate answers in this browser</strong>
        </div>
        <em>No text, locators, or review events</em>
      </div>
      <div class="map-inline-history-list">
        ${
          rows.length
            ? rows.map(mapInlineInquiryHistoryRowHtml).join("")
            : '<p class="muted-note">Save a map answer to compare how filters, selected units, packages, and disclosure depth change the aggregate response.</p>'
        }
      </div>
    </section>
  `;
}

function mapInlineInquiryHistoryRowHtml(item) {
  const unitLabel = item.selected_unit?.name
    ? `${item.selected_unit.name}${item.selected_unit.state ? `, ${item.selected_unit.state}` : ""}`
    : "No selected unit";
  const filters = item.filters?.active_labels?.length ? item.filters.active_labels.join(" · ") : "No active filters";
  return `
    <article class="map-inline-history-row">
      <button type="button" data-load-map-inquiry="${escapeHtml(item.id)}">
        <span>${escapeHtml(formatDateTime(item.created_at))}</span>
        <strong>${escapeHtml(item.question_label || item.prompt_key || "Saved map answer")}</strong>
        <em>${escapeHtml(item.answer_title || "Aggregate answer")}</em>
      </button>
      <div>
        <span>${escapeHtml(unitLabel)}</span>
        <span>${escapeHtml(formatCount(item.visible_units))} units · ${escapeHtml(formatCount(item.visible_law_count))} rows</span>
        <span>${escapeHtml(filters)}</span>
      </div>
      <button type="button" class="secondary" data-delete-map-inquiry="${escapeHtml(item.id)}">Delete</button>
    </article>
  `;
}

function mapInlineComparisonRows(promptKey) {
  const mapUnits = state.analysis.mapLayers?.units || [];
  const visibleUnits = filterMapUnits(mapUnits);
  const limit = state.disclosureLevel === "evidence" ? 8 : state.disclosureLevel === "unit" ? 6 : 4;
  if (promptKey === "selected") {
    const selectedUnit = currentSelectedMapUnit();
    if (!selectedUnit) {
      return largestVisibleComparisonRows(visibleUnits, limit);
    }
    const peers = selectedUnitPeers(selectedUnit)
      .slice(0, Math.max(0, limit - 1))
      .map((peer) => ({
        unit: peer.unit,
        value: peer.score,
        metric: `peer ${peer.score.toFixed(1)}`,
        detail: peer.reasons.slice(0, 3).join(" · ") || "aggregate similarity",
      }));
    return [
      {
        unit: selectedUnit,
        value: Math.max(1, ...peers.map((row) => row.value || 0)),
        metric: "selected",
        detail: `${formatCount(selectedUnit.law_count)} rows · ${text(selectedUnit.tier_label)}`,
      },
      ...peers,
    ].slice(0, limit);
  }
  if (promptKey === "audit") {
    return visibleAuditRows()
      .filter((row) => row.mapUnit)
      .sort((a, b) => Number(b.audit_attention_score || 0) - Number(a.audit_attention_score || 0))
      .slice(0, limit)
      .map((row) => ({
        unit: row.mapUnit,
        value: Number(row.audit_attention_score || 0),
        metric: `${formatNumber(row.audit_attention_score)} / 100`,
        detail: `${formatCount(row.ocr_review_rows)} OCR rows · ${formatCount(row.duplicate_text_hash_rows)} duplicate hashes`,
      }));
  }
  if (promptKey === "scores") {
    return visibleUnits
      .slice()
      .sort((a, b) => scoreSpread(b) - scoreSpread(a) || Number(b.law_count || 0) - Number(a.law_count || 0))
      .slice(0, limit)
      .map((unit) => ({
        unit,
        value: scoreSpread(unit),
        metric: `spread ${scoreSpread(unit).toFixed(3)}`,
        detail: scoreSnapshot(unit.model_score_means || {}),
      }));
  }
  if (promptKey === "package") {
    const visibleIds = new Set(visibleUnits.map((unit) => unit.unit_id));
    return [...importedPackageMapStats(mapUnits).units.values()]
      .filter((hit) => visibleIds.has(hit.unitId))
      .sort((a, b) => b.recordCount - a.recordCount || displayUnitName(a.unit).localeCompare(displayUnitName(b.unit)))
      .slice(0, limit)
      .map((hit) => ({
        unit: hit.unit,
        value: hit.recordCount,
        metric: `${formatCount(hit.recordCount)} local`,
        detail: `${formatCount(hit.reviewed)} reviewed · ${formatCount(hit.remaining)} remaining`,
      }));
  }
  return largestVisibleComparisonRows(visibleUnits, limit);
}

function largestVisibleComparisonRows(units, limit) {
  return units
    .slice()
    .sort((a, b) => Number(b.law_count || 0) - Number(a.law_count || 0))
    .slice(0, limit)
    .map((unit) => ({
      unit,
      value: Number(unit.law_count || 0),
      metric: `${formatCount(unit.law_count)} rows`,
      detail: `${text(unit.dominant_topic)} · ${text(unit.dominant_function)} · ${text(unit.tier_label)}`,
    }));
}

function mapInlineComparisonTitle(promptKey) {
  const titles = {
    view: "Largest visible county/town units",
    selected: "Selected unit and aggregate peers",
    audit: "Highest visible audit-review signals",
    scores: "Highest visible score-profile contrast",
    package: "Visible browser-local package matches",
  };
  return titles[promptKey] || titles.view;
}

function disclosureComparisonLabel() {
  if (state.disclosureLevel === "evidence") {
    return "evidence depth: 8 units";
  }
  if (state.disclosureLevel === "unit") {
    return "unit detail: 6 units";
  }
  return "overview: 4 units";
}

function mapInlineComparisonRowHtml(row, maxValue) {
  const unit = row.unit || {};
  const selected = unit.unit_id === state.selectedUnitId ? " selected" : "";
  const width = Math.max(4, (Number(row.value || 0) / Math.max(1, Number(maxValue || 1))) * 100);
  return `
    <button type="button" class="map-inline-comparison-row${selected}" data-map-compare-unit="${escapeHtml(unit.unit_id || "")}">
      <i style="background:${escapeHtml(unit.tier_color || "#d8dee8")}"></i>
      <span>
        <strong>${escapeHtml(displayUnitName(unit))}</strong>
        <em>${escapeHtml(unit.state || "NA")} · ${escapeHtml(titleCase(unit.kind || "unit"))}</em>
      </span>
      <b>${escapeHtml(row.metric)}</b>
      <u><small style="width:${width.toFixed(2)}%"></small></u>
      <small>${escapeHtml(row.detail)}</small>
    </button>
  `;
}

function mapInlineInquiryPrompts() {
  const selectedUnit = currentSelectedMapUnit();
  return [
    {
      key: "view",
      label: "Current view",
      question: "What does the current filtered map view show?",
    },
    {
      key: "selected",
      label: "Selected unit",
      question: selectedUnit
        ? `What does the selected unit ${displayUnitName(selectedUnit)} show?`
        : "What does the selected unit show?",
    },
    {
      key: "audit",
      label: "Audit signals",
      question: "What audit signals are visible in the current filtered map view?",
    },
    {
      key: "scores",
      label: "Scores",
      question: "What model score profile is visible in the current filtered map view?",
    },
    {
      key: "package",
      label: "Package overlay",
      question: "What does the loaded package show on the map?",
    },
  ];
}

function currentMapInquiryHistoryItem() {
  const prompts = mapInlineInquiryPrompts();
  const activePrompt = prompts.find((prompt) => prompt.key === state.mapInlineInquiry) || prompts[0];
  const answer = answerQuestion(activePrompt.question);
  const units = state.analysis.mapLayers ? filterMapUnits(state.analysis.mapLayers.units || []) : [];
  const summary = summarizeUnits(units);
  const selectedUnit = currentSelectedMapUnit();
  const packageStats = importedPackageMapStats(state.analysis.mapLayers?.units || []);
  const comparisonRows = mapInlineComparisonRows(activePrompt.key).map((row) => ({
    unit_id: row.unit?.unit_id || "",
    name: row.unit ? displayUnitName(row.unit) : "Unknown unit",
    state: row.unit?.state || "",
    kind: row.unit?.kind || "",
    tier_label: row.unit?.tier_label || "",
    metric: row.metric || "",
    detail: row.detail || "",
    value: Number(row.value || 0),
  }));
  return {
    schema_version: "evolocus-map-inquiry-history-v1",
    id: eventId(),
    created_at: new Date().toISOString(),
    prompt_key: activePrompt.key,
    question: activePrompt.question,
    question_label: activePrompt.label,
    answer_title: answer.title || "Aggregate map answer",
    answer_summary: answer.answer || "",
    disclosure_level: state.disclosureLevel,
    geography_color_mode: state.geographyColorMode,
    geography_layers: { ...state.geographyLayers },
    filters: {
      ...state.mapFilters,
      active_labels: activeFilterLabels(),
    },
    selected_unit: selectedUnit
      ? {
          unit_id: selectedUnit.unit_id,
          name: displayUnitName(selectedUnit),
          state: selectedUnit.state || "",
          kind: selectedUnit.kind || "",
          tier_label: selectedUnit.tier_label || "",
          law_count: Number(selectedUnit.law_count || 0),
        }
      : null,
    visible_units: units.length,
    visible_law_count: Number(summary.lawCount || 0),
    visible_tier_mix: summary.tierCounts || {},
    package_summary: {
      imported: Boolean(packageStats.imported),
      matched_records: Number(packageStats.matchedRecords || 0),
      matched_units: packageStats.units ? packageStats.units.size : 0,
      synthetic_demo: Boolean(packageStats.syntheticDemo),
    },
    comparison_rows: comparisonRows,
    publication_policy: {
      aggregate_only: true,
      ordinance_text_included: false,
      source_locators_included: false,
      review_events_included: false,
      browser_llm_calls: false,
      legal_findings: false,
    },
  };
}

function saveCurrentMapInquiryHistory() {
  const item = currentMapInquiryHistoryItem();
  const history = loadMapInquiryHistory().filter((entry) => entry.id !== item.id);
  saveMapInquiryHistory([item, ...history]);
  renderMap();
}

function loadMapInquiryHistoryItem(itemId) {
  const item = loadMapInquiryHistory().find((entry) => entry.id === itemId);
  if (!item) {
    return;
  }
  state.mapInlineInquiry = item.prompt_key || "view";
  state.disclosureLevel = item.disclosure_level || state.disclosureLevel;
  state.geographyColorMode = item.geography_color_mode || state.geographyColorMode;
  state.geographyLayers = { ...defaultGeographyLayers(), ...(item.geography_layers || {}) };
  state.mapFilters = {
    ...state.mapFilters,
    ...(item.filters || {}),
    active_labels: undefined,
  };
  delete state.mapFilters.active_labels;
  if (item.selected_unit?.unit_id) {
    state.selectedUnitId = item.selected_unit.unit_id;
  }
  renderMap();
}

function deleteMapInquiryHistoryItem(itemId) {
  saveMapInquiryHistory(loadMapInquiryHistory().filter((entry) => entry.id !== itemId));
  renderMap();
}

function mapInquiryHistoryExportPayload() {
  const status = state.analysis.status || {};
  const briefings = state.analysis.inquiryBriefings || {};
  const history = loadMapInquiryHistory().map(mapInquiryHistoryExportItem);
  return {
    schema_version: "evolocus-map-inquiry-history-export-v1",
    generated_at: new Date().toISOString(),
    dataset_id: status.dataset_id || briefings.dataset_id || "LocalLaws/LOCUS-v1",
    dataset_revision: status.dataset_revision || state.analysis.mapLayers?.dataset_revision || briefings.dataset_revision || "unknown",
    license: status.license || briefings.license || "CC-BY-NC-4.0",
    citation: status.citation || briefings.citation || "Peskoff, Barrow, Vu, and Davenport. Freeing the Law with LOCUS. arXiv:2606.19334, 2026.",
    history_count: history.length,
    source_artifacts: [
      "status.json",
      "map_layers.json",
      "unit_audit_quality.json",
      "inquiry_briefings.json",
      "question_pack.json",
    ],
    publication_policy: {
      aggregate_only: true,
      raw_rows_included: false,
      ordinance_text_included: false,
      record_locator_values_included: false,
      source_locators_included: false,
      browser_llm_calls: false,
      review_events_included: false,
      legal_findings: false,
      local_database_paths_included: false,
      secrets_included: false,
    },
    history,
    limitations: [
      "This export contains browser-local aggregate map inquiry history only.",
      "It excludes LOCUS ordinance text, headers, raw rows, source locator values, browser review events, local database paths, and secrets.",
      "Saved answers are deterministic summaries from static aggregate artifacts and current browser state, not legal findings or rankings.",
    ],
  };
}

function mapInquiryHistoryExportItem(item) {
  return {
    schema_version: "evolocus-map-inquiry-history-v1",
    id: String(item.id || ""),
    created_at: item.created_at || null,
    prompt_key: item.prompt_key || "",
    question: item.question || "",
    question_label: item.question_label || "",
    answer_title: item.answer_title || "",
    answer_summary: item.answer_summary || "",
    disclosure_level: item.disclosure_level || "overview",
    geography_color_mode: item.geography_color_mode || "tier",
    geography_layers: {
      counties: item.geography_layers?.counties !== false,
      municipalities: item.geography_layers?.municipalities !== false,
      ontology: Boolean(item.geography_layers?.ontology),
    },
    filters: {
      state: item.filters?.state || "",
      topic: item.filters?.topic || "",
      function: item.filters?.function || "",
      kind: item.filters?.kind || "",
      tier: item.filters?.tier || "",
      scoreField: item.filters?.scoreField || "",
      scoreBand: item.filters?.scoreBand || "",
      auditFocus: item.filters?.auditFocus || "",
      minLaws: Number(item.filters?.minLaws || 0),
      minAuditScore: Number(item.filters?.minAuditScore || 0),
      packageOnly: Boolean(item.filters?.packageOnly),
      active_labels: Array.isArray(item.filters?.active_labels) ? item.filters.active_labels.map(String).slice(0, 12) : [],
    },
    selected_unit: item.selected_unit
      ? {
          unit_id: item.selected_unit.unit_id || "",
          name: item.selected_unit.name || "",
          state: item.selected_unit.state || "",
          kind: item.selected_unit.kind || "",
          tier_label: item.selected_unit.tier_label || "",
          law_count: Number(item.selected_unit.law_count || 0),
        }
      : null,
    visible_units: Number(item.visible_units || 0),
    visible_law_count: Number(item.visible_law_count || 0),
    visible_tier_mix: safeCountMap(item.visible_tier_mix),
    package_summary: {
      imported: Boolean(item.package_summary?.imported),
      matched_records: Number(item.package_summary?.matched_records || 0),
      matched_units: Number(item.package_summary?.matched_units || 0),
      synthetic_demo: Boolean(item.package_summary?.synthetic_demo),
    },
    comparison_rows: Array.isArray(item.comparison_rows)
      ? item.comparison_rows.slice(0, 12).map((row) => ({
          unit_id: row.unit_id || "",
          name: row.name || "",
          state: row.state || "",
          kind: row.kind || "",
          tier_label: row.tier_label || "",
          metric: row.metric || "",
          detail: row.detail || "",
          value: Number(row.value || 0),
        }))
      : [],
    publication_policy: {
      aggregate_only: true,
      ordinance_text_included: false,
      source_locators_included: false,
      record_locator_values_included: false,
      review_events_included: false,
      browser_llm_calls: false,
      legal_findings: false,
    },
  };
}

function safeCountMap(counts) {
  return Object.fromEntries(
    Object.entries(counts || {})
      .slice(0, 24)
      .map(([label, value]) => [String(label), Number(value || 0)]),
  );
}

function exportMapInquiryHistory() {
  download("evolocus-map-inquiry-history.json", JSON.stringify(mapInquiryHistoryExportPayload(), null, 2), "application/json");
}

function mapInlineInquiryPromptHtml(prompt, activeKey) {
  return `
    <button type="button" data-map-inquiry="${escapeHtml(prompt.key)}" class="${prompt.key === activeKey ? "active" : ""}">
      ${escapeHtml(prompt.label)}
    </button>
  `;
}

function renderPackageMapSummary(packageStats, visibleUnits) {
  const panel = $("#package-map-summary");
  if (!panel) {
    return;
  }
  if (!packageStats.imported) {
    panel.innerHTML = `
      <article class="package-map-card demo">
        <div>
          <p class="eyebrow">Local package overlay</p>
          <h3>No bounded review package is imported.</h3>
          <p>The public map is real aggregate LOCUS data. Import a local review package to highlight its county/town units here without publishing record text.</p>
        </div>
        <span>No local LOCUS text in browser</span>
      </article>
    `;
    return;
  }
  const visibleIds = new Set(visibleUnits.map((unit) => unit.unit_id));
  const visibleHits = [...packageStats.units.values()].filter((hit) => visibleIds.has(hit.unitId));
  const reviewed = [...packageStats.units.values()].reduce((sum, hit) => sum + hit.reviewed, 0);
  const cards = [
    ["Matched records", `${formatCount(packageStats.matchedRecords)}/${formatCount(packageStats.recordCount)}`, `${formatCount(packageStats.unmatchedRecords)} could not be joined to a public map unit`],
    ["Highlighted units", formatCount(packageStats.units.size), `${formatCount(visibleHits.length)} visible under current filters`],
    ["Reviewed locally", formatCount(reviewed), `${formatPercent(reviewed, packageStats.recordCount)} of browser-local package records`],
    [
      "Text boundary",
      packageStats.syntheticDemo ? "synthetic placeholders" : packageStats.textIncluded ? "browser-local LOCUS text loaded" : "metadata only",
      packageStats.syntheticDemo ? "No LOCUS row text is loaded" : "Package records remain in localStorage, not public artifacts",
    ],
  ];
  panel.innerHTML = `
    <article class="package-map-card imported">
      <div>
        <p class="eyebrow">Local package overlay</p>
        <h3>${escapeHtml(packageStats.syntheticDemo ? "Synthetic package units are highlighted on the map." : "Imported package units are highlighted on the map.")}</h3>
        <p>${escapeHtml(packageStats.fileName)} · ${escapeHtml(packageStats.datasetRevision)} · ${escapeHtml(formatDateTime(packageStats.importedAt))}</p>
      </div>
      <div class="package-map-card-grid">
        ${cards
          .map(
            ([label, value, detail]) => `
              <span>
                <strong>${escapeHtml(String(value))}</strong>
                <em>${escapeHtml(label)}</em>
                <b>${escapeHtml(detail)}</b>
              </span>
            `,
          )
          .join("")}
      </div>
      ${
        visibleHits.length
          ? `<div class="package-map-hit-list">${visibleHits.slice(0, 8).map((hit) => packageMapHitPill(hit)).join("")}</div>`
          : `<p class="muted-note">No imported units are visible under the current filters. Clear filters to locate package units.</p>`
      }
      <div class="package-map-actions">
        <button type="button" data-package-map-filter="${state.mapFilters.packageOnly ? "all" : "only"}">
          ${escapeHtml(state.mapFilters.packageOnly ? "Show all aggregate units" : "Show only imported package units")}
        </button>
        <button type="button" data-package-map-filter="clear">Clear map filters</button>
      </div>
    </article>
  `;
}

function packageMapHitPill(hit) {
  return `
    <button type="button" data-unit-id="${escapeHtml(hit.unitId)}">
      ${escapeHtml(displayUnitName(hit.unit || hit.unitId))}
      <em>${escapeHtml(formatCount(hit.recordCount))} records · ${escapeHtml(formatCount(hit.remaining))} remaining</em>
    </button>
  `;
}

function renderCountyChoropleth(units, packageStats = importedPackageMapStats()) {
  const artifact = state.analysis.countyGeometry;
  const municipalArtifact = state.analysis.municipalPoints;
  const layers = { ...defaultGeographyLayers(), ...state.geographyLayers };
  const summary = $("#county-layer-summary");
  const svg = $("#county-choropleth");
  const detail = $("#county-layer-detail");
  const layerLegend = $("#geo-layer-legend");
  const legend = $("#geo-color-legend");
  if (!summary || !svg || !detail || !layerLegend || !legend) {
    return;
  }
  if (!artifact) {
    summary.innerHTML = "<span>Official geography loading</span>";
    svg.innerHTML = "";
    detail.innerHTML = "<p>Official geography artifacts have not loaded yet.</p>";
    layerLegend.innerHTML = "";
    legend.innerHTML = "";
    return;
  }
  const visibleCountyIds = new Set(units.filter((unit) => unit.kind === "county").map((unit) => unit.unit_id));
  const visibleMunicipalIds = new Set(units.filter((unit) => unit.kind === "city").map((unit) => unit.unit_id));
  const allFeatures = artifact.feature_collection?.features || [];
  const visibleFeatures = allFeatures.filter((feature) =>
    visibleCountyIds.has(feature.properties?.unit_id),
  );
  const visibleMunicipalPoints = (municipalArtifact?.points || []).filter((point) => visibleMunicipalIds.has(point.unit_id));
  const features = layers.counties ? visibleFeatures : [];
  const municipalPoints = layers.municipalities ? visibleMunicipalPoints : [];
  const previewBounds = geoBounds(features, municipalPoints);
  const previewPositionIndex = geographyPositionIndex(features, municipalPoints, previewBounds);
  const ontologyRows = layers.ontology ? geographyOntologyLinkRows(features, municipalPoints, previewPositionIndex) : [];
  summary.innerHTML = `
    <span>${escapeHtml(formatCount(features.length))}/${escapeHtml(formatCount(visibleFeatures.length))} counties shown</span>
    <span>${escapeHtml(formatCount(municipalPoints.length))}/${escapeHtml(formatCount(visibleMunicipalPoints.length))} town points shown</span>
    <span>${escapeHtml(layers.ontology ? `${formatCount(ontologyRows.length)} ontology links` : "ontology links off")}</span>
    <span>${escapeHtml(formatCount(artifact.matched_count || allFeatures.length))}/${escapeHtml(formatCount(artifact.county_unit_count || allFeatures.length))} matched</span>
    <span>${escapeHtml(formatCount(municipalArtifact?.matched_count || 0))}/${escapeHtml(formatCount(municipalArtifact?.municipal_unit_count || 0))} municipal matched</span>
    <span>color: ${escapeHtml(geographyColorLabel(state.geographyColorMode))}</span>
    <span>${escapeHtml(artifact.geometry_status || "geometry status unknown")}</span>
  `;
  svg.setAttribute("viewBox", "0 0 960 560");
  if (!features.length && !municipalPoints.length) {
    svg.innerHTML = `<text x="32" y="54">No active county polygons or town points under the current layer controls.</text>`;
    detail.innerHTML = "<p>No official geography layer is visible under the current filters and layer controls. Turn on Counties or Town points, or clear map filters.</p>";
    layerLegend.innerHTML = geographyLayerLegendHtml(layers, { features, municipalPoints, visibleFeatures, visibleMunicipalPoints, ontologyRows });
    legend.innerHTML = "";
    return;
  }
  const bounds = previewBounds;
  const colorContext = geographyColorContext(features, municipalPoints);
  const ontologyLinks = layers.ontology ? geographyOntologyLinksSvg(features, municipalPoints, bounds, ontologyRows) : "";
  layerLegend.innerHTML = geographyLayerLegendHtml(layers, { features, municipalPoints, visibleFeatures, visibleMunicipalPoints, ontologyRows });
  legend.innerHTML = geographyColorLegend(colorContext);
  svg.innerHTML = `${features.map((feature) => countyFeatureSvg(feature, bounds, colorContext, packageStats)).join("")}${ontologyLinks}${municipalPoints.map((point) => municipalPointSvg(point, bounds, colorContext, packageStats)).join("")}`;
  const selectedPoint = municipalPoints.find((point) => point.unit_id === state.selectedUnitId);
  const selectedFeature = features.find((feature) => feature.properties?.unit_id === state.selectedUnitId);
  if (selectedPoint) {
    renderMunicipalPointDetail(selectedPoint, municipalArtifact, packageStats);
  } else if (features.length) {
    renderCountyGeometryDetail(selectedFeature || features[0], artifact, municipalArtifact, packageStats);
  } else {
    renderMunicipalPointDetail(municipalPoints[0], municipalArtifact, packageStats);
  }
  if (layers.ontology) {
    detail.insertAdjacentHTML("beforeend", geographyOntologyLinkDetail(features, municipalPoints, ontologyRows));
  }
}

function geographyLayerLegendHtml(layers, context) {
  const selectedUnit = currentSelectedMapUnit();
  const rows = context.ontologyRows || [];
  const linkState = !layers.ontology
    ? "Ontology links are off"
    : state.disclosureLevel === "overview"
      ? "Switch to Unit detail to draw links"
      : rows.length
        ? `${formatCount(rows.length)} selected-unit peer links`
        : "No visible peer links";
  const layerRows = [
    {
      label: "County polygons",
      value: `${formatCount(context.features.length)}/${formatCount(context.visibleFeatures.length)}`,
      active: layers.counties,
      detail: "matched county units",
    },
    {
      label: "Town points",
      value: `${formatCount(context.municipalPoints.length)}/${formatCount(context.visibleMunicipalPoints.length)}`,
      active: layers.municipalities,
      detail: "matched municipal units",
    },
    {
      label: "Ontology links",
      value: linkState,
      active: layers.ontology,
      detail: "aggregate peer metadata",
    },
  ];
  return `
    <section class="geo-layer-legend-panel" aria-label="Official geography layer legend">
      <div class="geo-layer-legend-heading">
        <div>
          <span>Layer legend</span>
          <strong>${escapeHtml(selectedUnit ? displayUnitName(selectedUnit) : "No selected unit")}</strong>
        </div>
        <em>${escapeHtml(titleCase(state.disclosureLevel))}</em>
      </div>
      <div class="geo-layer-legend-pills">
        ${layerRows.map(geoLayerLegendPillHtml).join("")}
      </div>
      ${
        layers.ontology
          ? geographyLayerLinkRowsHtml(rows)
          : '<p class="muted-note">Turn on Ontology links to connect the selected aggregate unit to visible peers by topic, function, tier, kind, state, and law-count similarity.</p>'
      }
      <p class="geo-layer-boundary">Layer controls use public aggregate artifacts only. Ontology links are exploratory review aids, not source-backed legal relationships, rankings, or findings.</p>
    </section>
  `;
}

function geoLayerLegendPillHtml(row) {
  return `
    <span class="${row.active ? "active" : "inactive"}">
      <strong>${escapeHtml(row.value)}</strong>
      <em>${escapeHtml(row.label)}</em>
      <b>${escapeHtml(row.detail)}</b>
    </span>
  `;
}

function geographyLayerLinkRowsHtml(rows) {
  if (state.disclosureLevel === "overview") {
    return '<p class="muted-note">Ontology links are staged at Overview depth. Switch to Unit detail or Evidence trail to draw selected-unit peer links.</p>';
  }
  if (!rows.length) {
    return '<p class="muted-note">No visible peer links match the selected unit under the active filters and layer controls.</p>';
  }
  return `
    <div class="geo-layer-link-list" aria-label="Visible aggregate ontology links">
      ${rows.map(geoLayerLinkRowHtml).join("")}
    </div>
  `;
}

function geoLayerLinkRowHtml(row) {
  return `
    <button type="button" data-unit-id="${escapeHtml(row.peer.unit.unit_id)}">
      <strong>${escapeHtml(displayUnitName(row.peer.unit))}</strong>
      <span>${row.reasons.length ? row.reasons.map((reason) => `<em>${escapeHtml(reason)}</em>`).join("") : "<em>aggregate peer</em>"}</span>
      <b>peer ${escapeHtml(row.peer.score.toFixed(1))}</b>
    </button>
  `;
}

function geographyOntologyLinksSvg(features, municipalPoints, bounds, rows = null) {
  if (state.disclosureLevel === "overview") {
    return "";
  }
  const linkRows = rows || geographyOntologyLinkRows(features, municipalPoints, geographyPositionIndex(features, municipalPoints, bounds));
  if (!linkRows.length) {
    return "";
  }
  return `
    <g class="geography-ontology-links" aria-label="Selected-unit aggregate ontology links">
      ${linkRows.map(geographyOntologyLinkSvg).join("")}
    </g>
  `;
}

function geographyOntologyLinkRows(features, municipalPoints, positionIndex = null) {
  if (state.disclosureLevel === "overview") {
    return [];
  }
  const selectedUnit = currentSelectedMapUnit();
  if (!selectedUnit) {
    return [];
  }
  const index = positionIndex || geographyPositionIndex(features, municipalPoints, geoBounds(features, municipalPoints));
  const origin = index.get(selectedUnit.unit_id);
  if (!origin) {
    return [];
  }
  const limit = state.disclosureLevel === "evidence" ? 6 : 3;
  return selectedUnitPeers(selectedUnit)
    .filter((peer) => index.has(peer.unit.unit_id))
    .slice(0, limit)
    .map((peer) => ({
      peer,
      origin,
      target: index.get(peer.unit.unit_id),
      reasons: peer.reasons.slice(0, 3),
    }));
}

function geographyOntologyLinkSvg(row) {
  const label = row.reasons.length ? row.reasons.join(" · ") : "aggregate peer";
  return `
    <line
      class="geography-ontology-link"
      data-unit-id="${escapeHtml(row.peer.unit.unit_id)}"
      x1="${row.origin.x.toFixed(2)}"
      y1="${row.origin.y.toFixed(2)}"
      x2="${row.target.x.toFixed(2)}"
      y2="${row.target.y.toFixed(2)}"
      tabindex="0"
    >
      <title>${escapeHtml(displayUnitName(row.peer.unit))} · ${escapeHtml(label)} · peer score ${escapeHtml(row.peer.score.toFixed(1))}</title>
    </line>
  `;
}

function geographyOntologyLinkDetail(features, municipalPoints, rows = null) {
  if (state.disclosureLevel === "overview") {
    return `
      <section class="geography-ontology-detail">
        <strong>Ontology links are staged.</strong>
        <p>Switch to Unit detail or Evidence trail to draw selected-unit peer links from aggregate topic, function, tier, kind, state, and law-count similarity.</p>
      </section>
    `;
  }
  const linkRows = rows || geographyOntologyLinkRows(features, municipalPoints);
  const selectedUnit = currentSelectedMapUnit();
  return `
    <section class="geography-ontology-detail">
      <strong>${escapeHtml(formatCount(linkRows.length))} aggregate ontology links${selectedUnit ? ` from ${escapeHtml(displayUnitName(selectedUnit))}` : ""}</strong>
      ${
        linkRows.length
          ? `<p>${linkRows.map((row) => `${displayUnitName(row.peer.unit)} (${row.reasons.slice(0, 2).join(", ") || "aggregate peer"})`).map(escapeHtml).join(" · ")}</p>`
          : "<p>No visible peer links for the selected unit under the active filters and layer controls.</p>"
      }
      <p class="muted-note">Links use aggregate peer metadata from map_layers.json only. They are not legal findings, rankings, or source-backed legal conclusions.</p>
    </section>
  `;
}

function geographyPositionIndex(features, municipalPoints, bounds) {
  const index = new Map();
  for (const feature of features) {
    const properties = feature.properties || {};
    const centroid = geometryCentroid(feature.geometry);
    if (properties.unit_id && centroid) {
      const [x, y] = projectLonLat(centroid.lon, centroid.lat, bounds);
      index.set(properties.unit_id, { x, y, datum: properties, kind: "county" });
    }
  }
  for (const point of municipalPoints) {
    if (point.unit_id && Number.isFinite(Number(point.lon)) && Number.isFinite(Number(point.lat))) {
      const [x, y] = projectLonLat(point.lon, point.lat, bounds);
      index.set(point.unit_id, { x, y, datum: point, kind: "municipality" });
    }
  }
  return index;
}

function geometryCentroid(geometry) {
  const coords = [];
  visitCoordinates(geometry, ([lon, lat]) => {
    if (Number.isFinite(Number(lon)) && Number.isFinite(Number(lat))) {
      coords.push([Number(lon), Number(lat)]);
    }
  });
  if (!coords.length) {
    return null;
  }
  const sums = coords.reduce((acc, [lon, lat]) => ({ lon: acc.lon + lon, lat: acc.lat + lat }), { lon: 0, lat: 0 });
  return { lon: sums.lon / coords.length, lat: sums.lat / coords.length };
}

function countyFeatureSvg(feature, bounds, colorContext, packageStats) {
  const properties = feature.properties || {};
  const d = geometryPath(feature.geometry, bounds);
  const selected = properties.unit_id === state.selectedUnitId ? " selected" : "";
  const packageHit = packageStats.units.get(properties.unit_id) ? " package-hit" : "";
  const fill = geographyDatumColor(properties, colorContext);
  return `
    <path
      class="county-feature${selected}${packageHit}"
      data-unit-id="${escapeHtml(properties.unit_id)}"
      d="${d}"
      fill="${escapeHtml(fill)}"
      tabindex="0"
    >
      <title>${escapeHtml(properties.census_name || properties.unit_name)} · ${escapeHtml(properties.tier_label || "No tier")} · ${escapeHtml(formatCount(properties.law_count))} laws${packageHit ? ` · ${escapeHtml(formatCount(packageStats.units.get(properties.unit_id).recordCount))} local package records` : ""}</title>
    </path>
  `;
}

function renderCountyGeometryDetail(feature, artifact, _municipalArtifact, packageStats = importedPackageMapStats()) {
  const properties = feature.properties || {};
  const showEvidence = state.disclosureLevel === "evidence";
  const substantiveShare = modelSubstantiveShare(properties);
  const auditQuality = unitAuditQualityFor(properties.unit_id);
  const packageHit = packageStats.units.get(properties.unit_id);
  $("#county-layer-detail").innerHTML = `
    <button class="ask-unit-button" type="button" data-ask-unit-id="${escapeHtml(properties.unit_id)}">Ask about this county</button>
    <dl class="metadata-grid compact-metadata">
      <dt>County</dt><dd>${escapeHtml(properties.census_name || "Unknown")}</dd>
      <dt>State</dt><dd>${escapeHtml(properties.state || "Unknown")}</dd>
      <dt>GEOID</dt><dd>${escapeHtml(properties.geoid || "Unknown")}</dd>
      <dt>Tier</dt><dd>${escapeHtml(properties.tier_label || "No tier")}</dd>
      <dt>Laws</dt><dd>${escapeHtml(formatCount(properties.law_count))}</dd>
      <dt>Model substantive share</dt><dd>${escapeHtml(formatPercentRatio(substantiveShare))}</dd>
      <dt>Audit attention</dt><dd>${escapeHtml(auditQuality ? `${formatNumber(auditQuality.audit_attention_score)} / 100` : "not available")}</dd>
      <dt>Dominant topic</dt><dd>${escapeHtml(properties.dominant_topic || "Unknown")}</dd>
      <dt>Match status</dt><dd>${escapeHtml(properties.match_status || "Unknown")}</dd>
    </dl>
    ${selectedUnitPackageCoverageHtml(packageHit)}
    ${
      showEvidence
        ? `<p class="muted-note">Geometry source: ${escapeHtml(artifact.source?.name || "U.S. Census Bureau TIGERweb")} layer ${escapeHtml(String(artifact.source?.layer_id || "82"))}. Substantive share uses released LOCUS model labels: ${escapeHtml(formatCount(properties.substantive_count || 0))}/${escapeHtml(formatCount(properties.law_count || 0))} rows. Audit attention is a local aggregate review signal, not a legal ranking. Generalized for static display; ${escapeHtml(formatCount(artifact.unmatched_count || 0))} aggregate county units are unmatched.</p>`
        : `<p class="muted-note">Switch to Evidence trail to reveal geometry source and match-status details.</p>`
    }
  `;
}

function municipalPointSvg(point, bounds, colorContext, packageStats) {
  const [x, y] = projectLonLat(point.lon, point.lat, bounds);
  const selected = point.unit_id === state.selectedUnitId ? " selected" : "";
  const packageHit = packageStats.units.get(point.unit_id) ? " package-hit" : "";
  const lawCount = Math.max(0, Number(point.law_count || 0));
  const radius = 3.2 + Math.min(4.8, Math.log10(lawCount + 1) * 0.95);
  const fill = geographyDatumColor(point, colorContext);
  return `
    <circle
      class="municipal-point${selected}${packageHit}"
      data-unit-id="${escapeHtml(point.unit_id)}"
      cx="${x.toFixed(2)}"
      cy="${y.toFixed(2)}"
      r="${radius.toFixed(2)}"
      fill="${escapeHtml(fill)}"
      tabindex="0"
    >
      <title>${escapeHtml(point.census_name || point.unit_name)} · ${escapeHtml(point.tier_label || "No tier")} · ${escapeHtml(formatCount(point.law_count))} laws${packageHit ? ` · ${escapeHtml(formatCount(packageStats.units.get(point.unit_id).recordCount))} local package records` : ""}</title>
    </circle>
  `;
}

function renderMunicipalPointDetail(point, artifact, packageStats = importedPackageMapStats()) {
  const showEvidence = state.disclosureLevel === "evidence";
  const substantiveShare = modelSubstantiveShare(point);
  const auditQuality = unitAuditQualityFor(point.unit_id);
  const packageHit = packageStats.units.get(point.unit_id);
  $("#county-layer-detail").innerHTML = `
    <button class="ask-unit-button" type="button" data-ask-unit-id="${escapeHtml(point.unit_id)}">Ask about this municipality</button>
    <dl class="metadata-grid compact-metadata">
      <dt>Municipality</dt><dd>${escapeHtml(point.census_name || "Unknown")}</dd>
      <dt>State</dt><dd>${escapeHtml(point.state || "Unknown")}</dd>
      <dt>GEOID</dt><dd>${escapeHtml(point.geoid || "Unknown")}</dd>
      <dt>Layer</dt><dd>${escapeHtml(point.census_layer || "Unknown")}</dd>
      <dt>Tier</dt><dd>${escapeHtml(point.tier_label || "No tier")}</dd>
      <dt>Laws</dt><dd>${escapeHtml(formatCount(point.law_count))}</dd>
      <dt>Model substantive share</dt><dd>${escapeHtml(formatPercentRatio(substantiveShare))}</dd>
      <dt>Audit attention</dt><dd>${escapeHtml(auditQuality ? `${formatNumber(auditQuality.audit_attention_score)} / 100` : "not available")}</dd>
      <dt>Dominant topic</dt><dd>${escapeHtml(point.dominant_topic || "Unknown")}</dd>
      <dt>Match status</dt><dd>${escapeHtml(point.match_status || "Unknown")}</dd>
    </dl>
    ${selectedUnitPackageCoverageHtml(packageHit)}
    ${
      showEvidence
        ? `<p class="muted-note">Municipal point source: ${escapeHtml((artifact?.source?.layers || []).find((layer) => layer.id === point.census_layer)?.name || "U.S. Census Bureau TIGERweb")}. Substantive share uses released LOCUS model labels: ${escapeHtml(formatCount(point.substantive_count || 0))}/${escapeHtml(formatCount(point.law_count || 0))} rows. Audit attention is a local aggregate review signal, not a legal ranking. ${escapeHtml(formatCount(artifact?.unmatched_count || 0))} aggregate municipal units remain unmatched rather than guessed.</p>`
        : `<p class="muted-note">Switch to Evidence trail to reveal municipal point source and match-status details.</p>`
    }
  `;
}

function geographyColorContext(features, municipalPoints) {
  const data = [
    ...features.map((feature) => feature.properties || {}),
    ...municipalPoints,
  ];
  const maxLawCount = Math.max(1, ...data.map((item) => Number(item.law_count || 0)));
  const auditScores = data
    .map((item) => unitAuditQualityFor(item.unit_id)?.audit_attention_score)
    .filter((value) => Number.isFinite(Number(value)))
    .map(Number);
  const substantiveShares = data
    .map(modelSubstantiveShare)
    .filter((value) => Number.isFinite(value));
  return {
    mode: state.geographyColorMode,
    data,
    maxLawCount,
    maxAuditAttention: Math.max(1, ...auditScores),
    minSubstantiveShare: Math.min(1, ...substantiveShares),
    maxSubstantiveShare: Math.max(0, ...substantiveShares),
    tierDefinitions: state.analysis.mapLayers?.tier_definitions || {},
  };
}

function geographyDatumColor(datum, context) {
  if (context.mode === "topic") {
    return TOPIC_COLORS[datum.dominant_topic] || TOPIC_COLORS.Unknown;
  }
  if (context.mode === "function") {
    return FUNCTION_COLORS[datum.dominant_function] || FUNCTION_COLORS.Unknown;
  }
  if (context.mode === "law_count") {
    return lawCountColor(datum.law_count, context.maxLawCount);
  }
  if (context.mode === "audit_attention") {
    return auditAttentionColor(unitAuditQualityFor(datum.unit_id), context);
  }
  if (context.mode === "substantive_share") {
    return substantiveShareColor(modelSubstantiveShare(datum), context);
  }
  return datum.tier_color || context.tierDefinitions?.[datum.tier]?.color || "#d8dee8";
}

function tierColorForLabel(label, units, tierDefinitions) {
  const definition = Object.values(tierDefinitions || {}).find((item) => item.label === label);
  if (definition?.color) {
    return definition.color;
  }
  const unit = units.find((item) => (item.tier_label || item.tier || "Unspecified") === label);
  return unit?.tier_color || "#d8dee8";
}

function tierKeyForLabel(label, tierDefinitions) {
  const entry = Object.entries(tierDefinitions || {}).find(([, definition]) => definition.label === label);
  return entry ? entry[0] : label;
}

function tierDefinitionForKey(tierKey) {
  const definitions = state.analysis.mapLayers?.tier_definitions || {};
  if (definitions[tierKey]) {
    return definitions[tierKey];
  }
  const entry = Object.entries(definitions).find(([, definition]) => definition.label === tierKey);
  return entry ? entry[1] : { label: tierKey, color: "#d8dee8" };
}

function geographyColorLegend(context) {
  if (context.mode === "audit_attention") {
    return `
      <span class="geo-gradient audit-gradient"><i></i>Lower to higher audit attention</span>
      <span>Max visible: ${escapeHtml(formatNumber(context.maxAuditAttention))} / 100</span>
      <span>Review-priority signal from OCR risk and duplicate text hashes</span>
    `;
  }
  if (context.mode === "substantive_share") {
    return `
      <span class="geo-gradient substantive-gradient"><i></i>Lower to higher model-substantive share</span>
      <span>Visible range: ${escapeHtml(formatPercentRatio(context.minSubstantiveShare))} to ${escapeHtml(formatPercentRatio(context.maxSubstantiveShare))}</span>
      <span>Uses model-produced is_substantive labels and aggregate denominators</span>
    `;
  }
  if (context.mode === "law_count") {
    return `
      <span class="geo-gradient"><i></i>Low to high law-count intensity</span>
      <span>Max visible: ${escapeHtml(formatCount(context.maxLawCount))} law records</span>
      <span>Point size also scales by law count</span>
    `;
  }
  const rows = geographyLegendRows(context);
  return rows
    .map(
      (row) => `
        <span><i style="background:${escapeHtml(row.color)}"></i>${escapeHtml(row.label)} <em>${escapeHtml(formatCount(row.count))}</em></span>
      `,
    )
    .join("");
}

function geographyLegendRows(context) {
  const counts = {};
  for (const item of context.data) {
    const label = geographyLegendLabel(item, context.mode);
    counts[label] = (counts[label] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
      color: geographyLegendColor(label, context),
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function geographyLegendLabel(item, mode) {
  if (mode === "topic") {
    return item.dominant_topic || "Unknown";
  }
  if (mode === "function") {
    return item.dominant_function || "Unknown";
  }
  if (mode === "substantive_share") {
    return "Model substantive share";
  }
  if (mode === "audit_attention") {
    return "Audit attention";
  }
  return item.tier_label || item.tier || "No tier";
}

function geographyLegendColor(label, context) {
  if (context.mode === "topic") {
    return TOPIC_COLORS[label] || TOPIC_COLORS.Unknown;
  }
  if (context.mode === "function") {
    return FUNCTION_COLORS[label] || FUNCTION_COLORS.Unknown;
  }
  const tierEntry = Object.values(context.tierDefinitions).find((definition) => definition.label === label);
  if (tierEntry) {
    return tierEntry.color;
  }
  const datum = context.data.find((item) => (item.tier_label || item.tier || "No tier") === label);
  return datum?.tier_color || "#d8dee8";
}

function geographyColorLabel(mode) {
  const labels = {
    tier: "neutral tier",
    topic: "dominant topic",
    function: "dominant function",
    substantive_share: "model-substantive share",
    audit_attention: "audit attention",
    law_count: "law-count intensity",
  };
  return labels[mode] || labels.tier;
}

function modelSubstantiveShare(datum) {
  const lawCount = Number(datum?.law_count || 0);
  if (!lawCount) {
    return null;
  }
  return Number(datum?.substantive_count || 0) / lawCount;
}

function substantiveShareColor(value, context) {
  if (!Number.isFinite(value)) {
    return "#d8dee8";
  }
  const low = Number.isFinite(context.minSubstantiveShare) ? context.minSubstantiveShare : 0;
  const high = Number.isFinite(context.maxSubstantiveShare) ? context.maxSubstantiveShare : 1;
  const range = Math.max(0.000001, high - low);
  const ratio = (value - low) / range;
  return interpolateColor("#f2e9c9", "#275f79", Math.max(0, Math.min(1, ratio)));
}

function auditAttentionColor(quality, context) {
  if (!quality) {
    return "#d8dee8";
  }
  const ratio = Number(quality.audit_attention_score || 0) / Math.max(1, Number(context.maxAuditAttention || 1));
  return interpolateColor("#f2e9c9", "#7a3b31", Math.max(0, Math.min(1, ratio)));
}

function lawCountColor(value, maxValue) {
  const ratio = Math.log10(Number(value || 0) + 1) / Math.log10(Number(maxValue || 1) + 1);
  return interpolateColor("#f3ead2", "#2f756b", Math.max(0, Math.min(1, ratio)));
}

function interpolateColor(start, end, ratio) {
  const first = hexToRgb(start);
  const second = hexToRgb(end);
  const mixed = first.map((channel, index) => Math.round(channel + (second[index] - channel) * ratio));
  return `#${mixed.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16));
}

function geometryPath(geometry, bounds) {
  if (!geometry) {
    return "";
  }
  if (geometry.type === "Polygon") {
    return polygonPath(geometry.coordinates, bounds);
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.map((polygon) => polygonPath(polygon, bounds)).join(" ");
  }
  return "";
}

function polygonPath(polygon, bounds) {
  return polygon
    .map((ring) =>
      ring
        .map(([lon, lat], index) => {
          const [x, y] = projectLonLat(lon, lat, bounds);
          return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(" ") + " Z",
    )
    .join(" ");
}

function geoBounds(features, points = []) {
  const bounds = { minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity };
  for (const feature of features) {
    visitCoordinates(feature.geometry, ([lon, lat]) => {
      bounds.minLon = Math.min(bounds.minLon, Number(lon));
      bounds.maxLon = Math.max(bounds.maxLon, Number(lon));
      bounds.minLat = Math.min(bounds.minLat, Number(lat));
      bounds.maxLat = Math.max(bounds.maxLat, Number(lat));
    });
  }
  for (const point of points) {
    if (Number.isFinite(Number(point.lon)) && Number.isFinite(Number(point.lat))) {
      bounds.minLon = Math.min(bounds.minLon, Number(point.lon));
      bounds.maxLon = Math.max(bounds.maxLon, Number(point.lon));
      bounds.minLat = Math.min(bounds.minLat, Number(point.lat));
      bounds.maxLat = Math.max(bounds.maxLat, Number(point.lat));
    }
  }
  if (!Number.isFinite(bounds.minLon)) {
    return { minLon: -125, maxLon: -66, minLat: 24, maxLat: 50 };
  }
  return bounds;
}

function visitCoordinates(geometry, callback) {
  if (!geometry) {
    return;
  }
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates || [];
  polygons.forEach((polygon) => polygon.forEach((ring) => ring.forEach(callback)));
}

function projectLonLat(lon, lat, bounds) {
  const width = 960;
  const height = 560;
  const padding = 18;
  const lonSpan = Math.max(0.000001, bounds.maxLon - bounds.minLon);
  const latSpan = Math.max(0.000001, bounds.maxLat - bounds.minLat);
  const x = padding + ((Number(lon) - bounds.minLon) / lonSpan) * (width - padding * 2);
  const y = padding + ((bounds.maxLat - Number(lat)) / latSpan) * (height - padding * 2);
  return [x, y];
}

function renderAnalysisStatus(status, units) {
  const grid = $("#analysis-status-grid");
  if (!status) {
    grid.innerHTML = `
      <article class="metric-card"><span class="metric-value">...</span><span class="metric-label">Loading analysis state</span></article>
    `;
    return;
  }
  const cards = [
    ["State", status.analysis_state],
    ["Units", status.unit_count],
    ["Law records", status.law_count],
    ["Filtered units", units.length],
    ["Real rows published", status.real_locus_rows_published ? "yes" : "no"],
  ];
  grid.innerHTML = cards
    .map(
      ([label, value]) => `
        <article class="metric-card">
          <span class="metric-value small">${escapeHtml(String(value))}</span>
          <span class="metric-label">${escapeHtml(label)}</span>
        </article>
      `,
    )
    .join("");
}

function renderWalkthrough() {
  const statusEl = $("#walkthrough-status");
  const flowEl = $("#walkthrough-flow");
  const disclosureEl = $("#walkthrough-disclosure");
  const gatesEl = $("#walkthrough-gates");
  if (!statusEl || !flowEl || !disclosureEl || !gatesEl) {
    return;
  }

  const status = state.analysis.status;
  const mapLayers = state.analysis.mapLayers;
  const units = mapLayers ? filterMapUnits(mapLayers.units || []) : [];
  const selectedUnit = currentSelectedMapUnit() || units[0] || null;
  const snapshots = loadSnapshots();
  const inquiryBriefings = state.analysis.inquiryBriefings;
  const briefingGrok = inquiryBriefings?.grok || {};
  const ontology = state.analysis.ontology;

  if (!status || !mapLayers) {
    statusEl.innerHTML = `
      <article class="walkthrough-status-card">
        <span>Loading</span>
        <strong>Aggregate analysis artifacts</strong>
        <p>The walkthrough will activate after the static map, inquiry, ontology, and status artifacts load.</p>
      </article>
    `;
    flowEl.innerHTML = "";
    disclosureEl.innerHTML = "";
    gatesEl.innerHTML = "";
    return;
  }

  const statusCards = [
    ["Units", formatCount(status.unit_count || units.length), "Published county/town aggregate units"],
    ["Law records", formatCount(status.law_count), "Aggregate count; no row text is published"],
    ["Filtered units", formatCount(units.length), activeFilterLabels().join(" · ") || "No map filters active"],
    ["Inquiry", inquiryBriefings ? (briefingGrok.used ? `Grok ${briefingGrok.model}` : "deterministic") : "not loaded", "Offline artifact only; no browser API calls"],
    ["Snapshots", formatCount(snapshots.length), "Browser-local aggregate saved views"],
  ];
  statusEl.innerHTML = statusCards
    .map(
      ([label, value, detail]) => `
        <article class="walkthrough-status-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(String(value))}</strong>
          <p>${escapeHtml(detail)}</p>
        </article>
      `,
    )
    .join("");

  const selectedLabel = selectedUnit ? `${displayUnitName(selectedUnit)} · ${text(selectedUnit.state)}` : "No selected unit";
  const flowSteps = [
    {
      number: "01",
      title: "Start with the map",
      body: `${formatCount(units.length)} filtered aggregate units are available. Color modes can switch among neutral tier, topic, function, model-substantive share, audit attention, and law-count intensity.`,
      target: "map",
      button: "Open Law Map",
      meta: selectedLabel,
    },
    {
      number: "02",
      title: "Ask a bounded question",
      body: "Inquiry answers use the current filter context plus static aggregate briefings. Grok enrichment is produced offline through GitHub Actions and published only after artifact validation.",
      target: "inquiry",
      button: "Open Inquiry",
      meta: inquiryBriefings ? formatDateTime(inquiryBriefings.generated_at) : "Briefings not loaded",
    },
    {
      number: "03",
      title: "Inspect ontology links",
      body: "Topic, function, model-output, tier, and geography nodes explain how the selected unit is connected without publishing ordinance text.",
      target: "ontology",
      button: "Open Ontology",
      meta: ontology ? `${formatCount((ontology.nodes || []).length)} nodes` : "Ontology not loaded",
    },
    {
      number: "04",
      title: "Plan review coverage",
      body: "Queue planning ranks aggregate units for future local review packaging while exporting unit-level planning metadata only.",
      target: "queueplan",
      button: "Open Queue Plan",
      meta: `${queuePlanStrategyLabel(state.queuePlan.strategy)} · ${formatCount(state.queuePlan.size)} units`,
    },
    {
      number: "05",
      title: "Load a package overlay",
      body: "A synthetic package can be generated in this browser from the current aggregate units so reviewers can test package highlighting without loading LOCUS text.",
      action: "demo-package",
      button: "Load Demo Package",
      meta: isSyntheticQueue() ? "No package loaded" : `${formatCount(records.length)} browser-local records`,
    },
    {
      number: "06",
      title: "Save and compare views",
      body: "Snapshots preserve filters, visible aggregate counts, selected-unit metadata, audit signals, and briefing provenance in this browser.",
      target: "snapshots",
      button: "Open Snapshots",
      meta: `${formatCount(snapshots.length)} saved`,
    },
  ];
  flowEl.innerHTML = flowSteps.map(walkthroughStepHtml).join("");

  const disclosureRows = [
    ["overview", "Overview", "Aggregate counts, neutral tier colors, and safe publication boundary."],
    ["unit", "Unit detail", "Selected county/town metrics, model-score means, peer context, and ontology neighborhood."],
    ["evidence", "Evidence trail", "Artifact provenance, match status, denominators, and publication gates when allowed."],
  ];
  disclosureEl.innerHTML = `
    <article class="walkthrough-disclosure-card wide">
      <div>
        <p class="eyebrow">Progressive disclosure</p>
        <h3>Current level: ${escapeHtml(titleCase(state.disclosureLevel))}</h3>
        <p>The same disclosure state controls the map, score, audit, queue, and status evidence depth.</p>
      </div>
      <div class="walkthrough-disclosure-steps">
        ${disclosureRows.map(walkthroughDisclosureStepHtml).join("")}
      </div>
    </article>
  `;

  const gates = status.publication_gates || [];
  gatesEl.innerHTML = `
    <article class="walkthrough-gate-card wide">
      <div>
        <p class="eyebrow">Publication boundary</p>
        <h3>Public artifacts stay aggregate-only.</h3>
        <p>Real LOCUS rows, ordinance text, source locators, SQLite databases, exports, and secrets are excluded from GitHub Pages.</p>
      </div>
      <div class="gate-list compact-gates">
        ${gates
          .map(
            (gate) => `
              <span>
                <strong>${escapeHtml(gate.label)}</strong>
                <em>${escapeHtml(gate.status)}</em>
              </span>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function walkthroughStepHtml(step) {
  return `
    <article class="walkthrough-step-card">
      <span class="walkthrough-step-number">${escapeHtml(step.number)}</span>
      <h3>${escapeHtml(step.title)}</h3>
      <p>${escapeHtml(step.body)}</p>
      <em>${escapeHtml(step.meta)}</em>
      <button type="button" ${step.action ? `data-walkthrough-action="${escapeHtml(step.action)}"` : `data-walkthrough-tab="${escapeHtml(step.target)}"`}>${escapeHtml(step.button)}</button>
    </article>
  `;
}

function walkthroughDisclosureStepHtml([level, label, body]) {
  const active = state.disclosureLevel === level ? " active" : "";
  return `
    <button class="walkthrough-disclosure-step${active}" type="button" data-walkthrough-disclosure="${escapeHtml(level)}">
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(body)}</span>
    </button>
  `;
}

function renderAnalysisStatusPanel() {
  const status = state.analysis.status;
  const mapLayers = state.analysis.mapLayers;
  const countyGeometry = state.analysis.countyGeometry;
  const municipalPoints = state.analysis.municipalPoints;
  const auditStatus = state.analysis.auditStatus;
  const inquiryBriefings = state.analysis.inquiryBriefings;
  const visualSmoke = state.analysis.visualSmoke;
  const briefingGrok = inquiryBriefings?.grok || {};
  const packageVerification = status?.local_package_verification || null;
  const cardsGrid = $("#status-card-grid");
  const actionGrid = $("#status-action-grid");
  const changePanel = $("#status-artifact-change-panel");
  const detailGrid = $("#status-detail-grid");
  const gateGrid = $("#status-gate-grid");
  if (!cardsGrid || !actionGrid || !changePanel || !detailGrid || !gateGrid) {
    return;
  }
  if (!status) {
    cardsGrid.innerHTML = `
      <article class="status-card"><span class="metric-value small">...</span><span class="metric-label">Loading analysis artifact status</span></article>
    `;
    actionGrid.innerHTML = "";
    changePanel.innerHTML = "";
    detailGrid.innerHTML = "";
    gateGrid.innerHTML = "";
    return;
  }

  const units = mapLayers ? mapLayers.units || [] : [];
  const sampleCount = units.reduce((total, unit) => total + (unit.samples || []).length, 0);
  const generatedAt = formatDateTime(status.generated_at || mapLayers?.generated_at);
  const statusCards = [
    ["Analysis state", status.analysis_state || "unknown", "Current Pages artifact readiness"],
    ["Published units", formatCount(status.unit_count || units.length), "Bounded county/town-style aggregate layer"],
    ["Law records", formatCount(status.law_count), "Aggregate row count inside the published cap"],
    ["Raw rows published", status.real_locus_rows_published ? "yes" : "no", "GitHub Pages must not expose LOCUS text rows"],
    ["Synthetic layer", status.synthetic ? "yes" : "no", status.synthetic ? "Demo artifact" : "Real aggregate artifact"],
    ["Public samples", formatCount(sampleCount), "No ordinance text is included in this public layer"],
    [
      "Local package smoke",
      packageVerification?.status === "complete" ? `${formatCount(packageVerification.metadata_package_record_count)} records` : "not run",
      packageVerification?.status === "complete" ? `${formatCount(packageVerification.matched_public_unit_count)} matched public units; local-only` : "No bounded real package verification recorded",
    ],
    ...(auditStatus
      ? [
          ["Audit rows", formatCount(auditStatus.row_count), "Full local LOCUS audit summarized as aggregate status"],
          ["Audit gates", auditGateSummary(auditStatus), "Review-needed gates are data-quality priorities"],
        ]
      : [["Audit status", "not loaded", "Full audit summary artifact is unavailable"]]),
    [
      "Inquiry briefings",
      inquiryBriefings ? (briefingGrok.used ? `Grok (${briefingGrok.model})` : "deterministic") : "not loaded",
      "Static aggregate Q&A artifact; no browser LLM calls",
    ],
    [
      "Visual route smoke",
      visualSmoke ? visualSmoke.status || "unknown" : "not loaded",
      visualSmoke ? `${visualSmoke.verified_route?.name || "visual route"} · ${formatDateTime(visualSmoke.completed_at)}` : "Hosted route smoke artifact unavailable",
    ],
  ];
  cardsGrid.innerHTML = statusCards
    .map(
      ([label, value, detail]) => `
        <article class="status-card">
          <span class="metric-value small">${escapeHtml(String(value))}</span>
          <span class="metric-label">${escapeHtml(label)}</span>
          <p>${escapeHtml(detail)}</p>
        </article>
      `,
    )
    .join("");
  actionGrid.innerHTML = actionsBriefingRefreshHtml(status, inquiryBriefings, briefingGrok);
  changePanel.innerHTML = latestArtifactChangePanelHtml(status, {
    mapLayers,
    auditStatus,
    inquiryBriefings,
    questionPack: state.analysis.questionPack,
    countyGeometry,
    municipalPoints,
    unitAuditQuality: state.analysis.unitAuditQuality,
    ontology: state.analysis.ontology,
    charts: state.analysis.charts,
    models: state.analysis.models,
    artifactSnapshot: state.analysis.artifactSnapshot,
    visualSmoke,
    packageVerification,
  });

  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  const details = [
    ["Dataset", status.dataset_id || "unknown"],
    ["Dataset revision", status.dataset_revision || mapLayers?.dataset_revision || "unknown"],
    ["Generated", generatedAt],
    ["License", status.license || "unknown"],
    ["Schema", status.schema_version || "unknown"],
    ["Artifact commit", shortCommit(status.code_commit)],
    ["Geometry status", mapLayers?.geometry_status || "not loaded"],
    ["County geometry", countyGeometry ? `${formatCount(countyGeometry.matched_count)} matched / ${formatCount(countyGeometry.county_unit_count)} county units` : "not loaded"],
    ["Municipal points", municipalPoints ? `${formatCount(municipalPoints.matched_count)} matched / ${formatCount(municipalPoints.municipal_unit_count)} municipal units` : "not loaded"],
    ["Full LOCUS audit", auditStatus ? `${formatCount(auditStatus.row_count)} rows · schema ${auditStatus.schema?.is_compatible ? "compatible" : "review needed"}` : "not loaded"],
    ["OCR heuristic review", auditStatus ? auditOcrSummary(auditStatus) : "not loaded"],
    ["Duplicate content hashes", auditStatus ? formatCount(auditStatus.quality_counts?.duplicate_content_hash_count) : "not loaded"],
    ["Inquiry generated", inquiryBriefings ? formatDateTime(inquiryBriefings.generated_at) : "not loaded"],
    ["Visual route smoke", visualSmoke ? `${visualSmoke.status} · run ${visualSmoke.run_id || "unknown"} · ${formatDateTime(visualSmoke.completed_at)}` : "not loaded"],
    ["Grok enrichment", inquiryBriefings ? (briefingGrok.used ? `offline ${briefingGrok.model}` : `not used${briefingGrok.error ? ` · ${briefingGrok.error}` : ""}`) : "not loaded"],
    ["Grok secret status", "Configured in repository Actions secrets for offline refresh only"],
    ["Grok boundary", "Repository Actions secrets are available only to offline refresh jobs; no API key is embedded in Pages."],
    ["Local package smoke", packageVerification ? `${packageVerification.status} · ${formatCount(packageVerification.matched_public_unit_count)} matched units · ${formatCount(packageVerification.content_package_record_count)} local review records` : "not recorded"],
  ];
  detailGrid.innerHTML = details
    .slice(0, showUnit ? details.length : 4)
    .map(
      ([label, value]) => `
        <article class="status-detail-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(String(value))}</strong>
        </article>
      `,
    )
    .join("");

  if (!showEvidence) {
    gateGrid.innerHTML = `
      <article class="status-evidence-note">
        <h3>Evidence trail hidden</h3>
        <p>Switch to Evidence trail to inspect publication gates, citation, and artifact boundary notes.</p>
      </article>
    `;
    renderDisclosureButtons();
    return;
  }

  const gates = status.publication_gates || [];
  gateGrid.innerHTML = `
    <article class="status-evidence-card wide">
      <h3>Publication gates</h3>
      <div class="gate-list">
        ${gates
          .map(
            (gate) => `
              <span>
                <strong>${escapeHtml(gate.label)}</strong>
                <em>${escapeHtml(gate.status)}</em>
              </span>
            `,
          )
          .join("") || "<p>No publication gates recorded.</p>"}
      </div>
    </article>
    ${
      auditStatus
        ? `<article class="status-evidence-card wide">
            <h3>Full LOCUS audit summary</h3>
            <p>${escapeHtml(formatCount(auditStatus.row_count))} rows were audited locally against ${escapeHtml(formatCount(auditStatus.expected_row_count))} expected rows. This public artifact contains aggregate counts and rates only.</p>
            <div class="gate-list">
              ${(auditStatus.quality_gates || [])
                .map(
                  (gate) => `
                    <span>
                      <strong>${escapeHtml(gate.label)}</strong>
                      <em>${escapeHtml(gate.status)}${gate.value === undefined ? "" : ` · ${formatCount(gate.value)}`}</em>
                    </span>
                  `,
                )
                .join("")}
            </div>
          </article>
          <article class="status-evidence-card">
            <h3>OCR Risk Heuristics</h3>
            ${auditOcrBarsHtml(auditStatus)}
            <p>OCR flags are review-priority heuristics, not proof that the ordinance text is wrong.</p>
          </article>
          <article class="status-evidence-card">
            <h3>Audit Provenance</h3>
            <p>Manifest scan: ${escapeHtml(auditStatus.manifest?.full_scan_completed ? "complete" : "not complete")} · source files: ${escapeHtml(formatCount(auditStatus.source_artifacts?.source_file_count || 0))} · audit digest ${escapeHtml(shortCommit(auditStatus.source_artifacts?.audit_sha256))}</p>
            <p>${escapeHtml((auditStatus.limitations || []).join(" "))}</p>
          </article>`
        : `<article class="status-evidence-card wide"><h3>Full LOCUS audit summary</h3><p>Audit status artifact is not loaded.</p></article>`
    }
    <article class="status-evidence-card">
      <h3>Boundary</h3>
      <p>No raw LOCUS rows, ordinance text, SQLite databases, exports, credentials, or machine-specific paths are published through this artifact layer.</p>
    </article>
    <article class="status-evidence-card">
      <h3>Local Package Verification</h3>
      <p>${escapeHtml(packageVerification ? `${formatCount(packageVerification.metadata_package_record_count)} metadata-only records and ${formatCount(packageVerification.content_package_record_count)} local review records were materialized from real LOCUS Parquet across ${formatCount(packageVerification.matched_public_unit_count)} public aggregate units.` : "No local package verification is recorded.")}</p>
      <p>${escapeHtml(packageVerification ? packageVerification.note || "Only aggregate verification counts are published." : "Run the local ignored materializer to verify browser-import packages.")}</p>
    </article>
    <article class="status-evidence-card">
      <h3>Inquiry Briefing Refresh</h3>
      <p>${escapeHtml(inquiryBriefings ? `${briefingGrok.used ? "Grok-enriched offline" : "Deterministic"} briefing generated ${formatDateTime(inquiryBriefings.generated_at)}.` : "Inquiry briefing artifact is not loaded.")}</p>
      <p>The refresh control above opens a manual GitHub Actions workflow. Actions may use the configured repository secret to refresh aggregate summaries, but Pages never performs browser LLM calls.</p>
    </article>
    <article class="status-evidence-card">
      <h3>County Geometry</h3>
      <p>${escapeHtml(countyGeometry?.notice || "County geometry artifact is not loaded.")}</p>
    </article>
    <article class="status-evidence-card">
      <h3>Municipal Points</h3>
      <p>${escapeHtml(municipalPoints?.notice || "Municipal point artifact is not loaded.")}</p>
    </article>
    <article class="status-evidence-card">
      <h3>Citation</h3>
      <p>${escapeHtml(status.citation || "Peskoff, Barrow, Vu, and Davenport. Freeing the Law with LOCUS. arXiv:2606.19334, 2026.")}</p>
      <p>${escapeHtml(status.paper || "https://arxiv.org/abs/2606.19334")} · ${escapeHtml(status.license || "CC-BY-NC-4.0")}</p>
    </article>
  `;
  renderDisclosureButtons();
}

function latestArtifactChangePanelHtml(status, artifacts) {
  const rows = latestArtifactChangeRows(status, artifacts);
  const latest = latestArtifactTimestamp(rows);
  const snapshot = artifacts.artifactSnapshot;
  const snapshotLabel = snapshot
    ? `Compared with stored snapshot: ${snapshot.snapshot_label || formatDateTime(snapshot.created_at)}`
    : "Current refresh metadata only; no stored snapshot loaded.";
  return `
    <section class="artifact-change-card" aria-label="Latest aggregate artifact changes">
      <div class="artifact-change-heading">
        <div>
          <p class="eyebrow">Latest artifact refresh</p>
          <h3>What the current aggregate artifact set contributes.</h3>
          <p>${escapeHtml(snapshotLabel)} Rows summarize public aggregate artifacts only.</p>
        </div>
        <span>${escapeHtml(latest ? `${formatDateTime(latest)} · ${artifactAgeLabel(latest)}` : "artifact timestamps loading")}</span>
      </div>
      <div class="artifact-change-grid">
        ${rows.map(artifactChangeRowHtml).join("")}
      </div>
      ${artifactRefreshTimelineHtml(rows, snapshot)}
      ${artifactLineageVisualHtml(status, artifacts)}
      <p class="artifact-change-boundary">No row text, source locators, local databases, exports, or legal findings are included in this change summary.</p>
    </section>
  `;
}

function latestArtifactChangeRows(status, artifacts) {
  const {
    mapLayers,
    auditStatus,
    inquiryBriefings,
    questionPack,
    countyGeometry,
    municipalPoints,
    unitAuditQuality,
    ontology,
    charts,
    models,
    artifactSnapshot,
    packageVerification,
  } = artifacts;
  const mapUnits = mapLayers?.units || [];
  const briefingGrok = inquiryBriefings?.grok || {};
  const questionGrok = questionPack?.grok || {};
  const chartCount = charts?.charts ? Object.keys(charts.charts).length : 0;
  const modelCount = models?.models ? models.models.length : 0;
  const metrics = currentArtifactSnapshotMetrics(status, artifacts);
  const snapshotMetrics = artifactSnapshot?.metrics || {};
  return [
    {
      label: "Aggregate map scope",
      snapshotKey: "map_layers",
      value: `${formatCount(status.unit_count || mapUnits.length)} units · ${formatCount(status.law_count)} rows`,
      detail: `Dataset ${status.dataset_revision || mapLayers?.dataset_revision || "unknown"} · ${status.real_locus_rows_published ? "review needed" : "no row text"}`,
      generatedAt: mapLayers?.generated_at || status.generated_at,
      delta: artifactDeltaSummary([
        artifactMetricDelta(metrics.unit_count, snapshotMetrics.unit_count, "units"),
        artifactMetricDelta(metrics.law_count, snapshotMetrics.law_count, "rows"),
      ]),
    },
    {
      label: "Inquiry answers",
      snapshotKey: "inquiry_briefings",
      value: inquiryBriefings ? `${formatCount((inquiryBriefings.briefings || []).length)} briefings · ${briefingGrok.used ? `offline ${briefingGrok.model || "Grok"}` : "deterministic"}` : "not loaded",
      detail: "Published as static aggregate JSON; no browser model call",
      generatedAt: inquiryBriefings?.generated_at,
      delta: artifactMetricDelta(metrics.inquiry_briefing_count, snapshotMetrics.inquiry_briefing_count, "briefings"),
    },
    {
      label: "Question presets",
      snapshotKey: "question_pack",
      value: questionPack ? `${formatCount((questionPack.prompts || []).length)} prompts · ${questionGrok.used ? "offline noted" : "deterministic"}` : "not loaded",
      detail: "Filter-aware prompts over aggregate map artifacts",
      generatedAt: questionPack?.generated_at,
      delta: artifactMetricDelta(metrics.question_prompt_count, snapshotMetrics.question_prompt_count, "prompts"),
    },
    {
      label: "Audit layer",
      snapshotKey: "audit_status",
      value: auditStatus ? `${formatCount(auditStatus.row_count)} audited rows` : "not loaded",
      detail: auditStatus ? `${formatCount((auditStatus.quality_gates || []).length)} quality gates · ${auditGateSummary(auditStatus)}` : "Run local audit before publishing status",
      generatedAt: auditStatus?.generated_at,
      delta: artifactMetricDelta(metrics.audit_row_count, snapshotMetrics.audit_row_count, "audited rows"),
    },
    {
      label: "Per-unit audit signals",
      snapshotKey: "unit_audit_quality",
      value: unitAuditQuality ? `${formatCount(unitAuditQuality.matched_unit_count)} matched units` : "not loaded",
      detail: unitAuditQuality ? `${formatCount(unitAuditQuality.row_count)} rows summarized as OCR/duplicate review signals` : "Unit audit artifact unavailable",
      generatedAt: unitAuditQuality?.generated_at,
      delta: artifactDeltaSummary([
        artifactMetricDelta(metrics.matched_audit_unit_count, snapshotMetrics.matched_audit_unit_count, "units"),
        artifactMetricDelta(metrics.unit_audit_row_count, snapshotMetrics.unit_audit_row_count, "rows"),
      ]),
    },
    {
      label: "Geometry overlay",
      snapshotKey: "county_geometry",
      value: `${countyGeometry ? `${formatCount(countyGeometry.matched_count)} counties` : "counties loading"} · ${municipalPoints ? `${formatCount(municipalPoints.matched_count)} towns` : "towns loading"}`,
      detail: "Official Census geometry machine-matched and pending review",
      generatedAt: latestIso([countyGeometry?.generated_at, municipalPoints?.generated_at]),
      delta: artifactDeltaSummary([
        artifactMetricDelta(metrics.county_match_count, snapshotMetrics.county_match_count, "counties"),
        artifactMetricDelta(metrics.municipal_match_count, snapshotMetrics.municipal_match_count, "towns"),
      ]),
    },
    {
      label: "Ontology and charts",
      snapshotKey: "ontology",
      value: `${ontology ? `${formatCount((ontology.nodes || []).length)} nodes` : "ontology loading"} · ${formatCount(chartCount)} charts · ${formatCount(modelCount)} models`,
      detail: ontology ? `${formatCount((ontology.edges || []).length)} aggregate edges; charts are review aids` : "Static graph artifacts loading",
      generatedAt: latestIso([ontology?.generated_at, charts?.generated_at, models?.generated_at]),
      delta: artifactDeltaSummary([
        artifactMetricDelta(metrics.ontology_node_count, snapshotMetrics.ontology_node_count, "nodes"),
        artifactMetricDelta(metrics.chart_panel_count, snapshotMetrics.chart_panel_count, "charts"),
        artifactMetricDelta(metrics.model_count, snapshotMetrics.model_count, "models"),
      ]),
    },
    {
      label: "Local package verification",
      snapshotKey: "local_package_verification",
      value: packageVerification?.status === "complete" ? `${formatCount(packageVerification.metadata_package_record_count)} metadata records` : "not recorded",
      detail: packageVerification?.status === "complete" ? `${formatCount(packageVerification.matched_public_unit_count)} matched public units · local-only` : "Package materialization remains ignored and browser-local",
      generatedAt: packageVerification?.verified_at,
      delta: artifactDeltaSummary([
        artifactMetricDelta(metrics.local_package_metadata_records, snapshotMetrics.local_package_metadata_records, "records"),
        artifactMetricDelta(metrics.local_package_matched_units, snapshotMetrics.local_package_matched_units, "units"),
      ]),
    },
  ];
}

function artifactRefreshTimelineHtml(rows, snapshot) {
  const timelineRows = artifactRefreshTimelineRows(rows, snapshot);
  const latest = latestArtifactTimestamp(rows);
  return `
    <section class="artifact-refresh-timeline" aria-label="Aggregate artifact refresh history timeline">
      <div class="artifact-refresh-timeline-heading">
        <div>
          <span>Refresh timeline</span>
          <strong>${escapeHtml(latest ? `Latest current artifact ${formatDateTime(latest)}` : "Artifact timestamps loading")}</strong>
        </div>
        <em>${escapeHtml(snapshot ? `Snapshot baseline ${snapshot.snapshot_label || formatDateTime(snapshot.created_at)}` : "Snapshot baseline unavailable")}</em>
      </div>
      <div class="artifact-refresh-timeline-strip">
        ${timelineRows.map(artifactRefreshTimelineRowHtml).join("")}
      </div>
      <p>Timeline entries compare current public aggregate artifact timestamps with the stored aggregate snapshot baseline only.</p>
    </section>
  `;
}

function artifactRefreshTimelineRows(rows, snapshot) {
  const snapshotTimes = snapshot?.artifact_generated_at || {};
  return rows
    .filter((row) => row.generatedAt || snapshotTimes[row.snapshotKey])
    .map((row) => {
      const baselineAt = snapshotTimes[row.snapshotKey] || "";
      return {
        label: row.label,
        currentAt: row.generatedAt || "",
        baselineAt,
        status: artifactTimelineStatus(row.generatedAt, baselineAt),
        delta: artifactTimestampDeltaLabel(row.generatedAt, baselineAt),
      };
    });
}

function artifactTimelineStatus(currentAt, baselineAt) {
  const currentTime = new Date(currentAt || "").getTime();
  const baselineTime = new Date(baselineAt || "").getTime();
  if (!Number.isFinite(currentTime) || !Number.isFinite(baselineTime)) {
    return "unknown";
  }
  if (currentTime === baselineTime) {
    return "same";
  }
  return currentTime > baselineTime ? "newer" : "older";
}

function artifactTimestampDeltaLabel(currentAt, baselineAt) {
  const currentTime = new Date(currentAt || "").getTime();
  const baselineTime = new Date(baselineAt || "").getTime();
  if (!Number.isFinite(currentTime) && !Number.isFinite(baselineTime)) {
    return "timestamps unavailable";
  }
  if (!Number.isFinite(baselineTime)) {
    return "snapshot timestamp unavailable";
  }
  if (!Number.isFinite(currentTime)) {
    return "current timestamp unavailable";
  }
  const deltaMs = currentTime - baselineTime;
  if (!deltaMs) {
    return "same as snapshot";
  }
  const direction = deltaMs > 0 ? "after snapshot" : "before snapshot";
  return `${artifactDurationLabel(Math.abs(deltaMs))} ${direction}`;
}

function artifactDurationLabel(durationMs) {
  const minutes = Math.round(durationMs / 60000);
  if (minutes < 1) {
    return "under 1 min";
  }
  if (minutes < 60) {
    return `${formatCount(minutes)} min`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 48) {
    return `${formatCount(hours)} hr`;
  }
  const days = Math.round(hours / 24);
  return `${formatCount(days)} days`;
}

function artifactRefreshTimelineRowHtml(row) {
  return `
    <article class="artifact-refresh-timeline-row ${escapeHtml(row.status)}">
      <span>${escapeHtml(row.label)}</span>
      <div class="artifact-refresh-track" aria-hidden="true">
        <i class="baseline"></i>
        <b></b>
        <i class="current"></i>
      </div>
      <strong>${escapeHtml(row.delta)}</strong>
      <em>snapshot ${escapeHtml(row.baselineAt ? formatDateTime(row.baselineAt) : "unavailable")} · current ${escapeHtml(row.currentAt ? formatDateTime(row.currentAt) : "unavailable")}</em>
    </article>
  `;
}

function artifactLineageVisualHtml(status, artifacts) {
  const rows = artifactLineageRows(status, artifacts);
  const visibleRows = state.disclosureLevel === "overview" ? rows.slice(0, 4) : rows;
  const hiddenCount = rows.length - visibleRows.length;
  return `
    <section class="artifact-lineage-visual" aria-label="Public aggregate artifact lineage">
      <div class="artifact-lineage-heading">
        <div>
          <span>Artifact lineage</span>
          <strong>Which public files power each visual surface.</strong>
        </div>
        <em>${escapeHtml(titleCase(state.disclosureLevel))} disclosure · ${escapeHtml(status.dataset_revision || artifacts.mapLayers?.dataset_revision || "unknown revision")}</em>
      </div>
      <div class="artifact-lineage-flow" aria-label="Aggregate publication flow">
        <span>Local Polars aggregate build</span>
        <b aria-hidden="true">&rarr;</b>
        <span>Validated static JSON</span>
        <b aria-hidden="true">&rarr;</b>
        <span>GitHub Pages visuals</span>
        <b aria-hidden="true">&rarr;</b>
        <span>Browser-local review/export</span>
      </div>
      <div class="artifact-lineage-grid">
        ${visibleRows.map(artifactLineageRowHtml).join("")}
      </div>
      ${hiddenCount > 0 ? `<p class="artifact-lineage-more">${escapeHtml(formatCount(hiddenCount))} more lineage rows available at Unit detail or Evidence trail disclosure.</p>` : ""}
      <p class="artifact-lineage-boundary">Lineage shows public aggregate artifacts only. It excludes ordinance text, headers, source locators, SQLite databases, exports, local paths, secrets, and legal findings.</p>
    </section>
  `;
}

function artifactLineageRows(status, artifacts) {
  const {
    mapLayers,
    auditStatus,
    inquiryBriefings,
    questionPack,
    countyGeometry,
    municipalPoints,
    unitAuditQuality,
    ontology,
    charts,
    models,
    visualSmoke,
    packageVerification,
  } = artifacts;
  const unitCount = status.unit_count || (mapLayers?.units || []).length;
  const lawCount = status.law_count || mapLayers?.row_count || 0;
  const briefingCount = (inquiryBriefings?.briefings || []).length;
  const promptCount = (questionPack?.prompts || []).length;
  const ontologyNodeCount = (ontology?.nodes || []).length;
  const ontologyEdgeCount = (ontology?.edges || []).length;
  const chartCount = charts?.charts ? Object.keys(charts.charts).length : 0;
  const modelCount = (models?.models || []).length;
  return [
    {
      surface: "Law Map",
      tab: "map",
      artifacts: ["map_layers.json", "county_geometry.json", "municipal_points.json", "unit_audit_quality.json"],
      metric: `${formatCount(unitCount)} aggregate units · ${formatCount(lawCount)} rows summarized`,
      visual: "County/town colored map, official geography overlays, neutral tiers, audit filters.",
      detail: "Map filters, selected-unit trails, package overlays, and tier chips read aggregate units only.",
      evidence: "Evidence trail adds geometry-match and audit-signal provenance without row text.",
    },
    {
      surface: "Inquiry",
      tab: "inquiry",
      artifacts: ["inquiry_briefings.json", "question_pack.json", "map_layers.json"],
      metric: `${formatCount(briefingCount)} briefings · ${formatCount(promptCount)} prompts`,
      visual: "Deterministic aggregate answers, prompt matrix, mini charts, ontology mini-map.",
      detail: "Questions use current filters and selected-unit aggregate context, not browser LLM calls.",
      evidence: "Offline Grok notes may appear only in validated static aggregate JSON.",
    },
    {
      surface: "Ontology",
      tab: "ontology",
      artifacts: ["ontology.json", "models.json", "map_layers.json"],
      metric: `${formatCount(ontologyNodeCount)} nodes · ${formatCount(ontologyEdgeCount)} links · ${formatCount(modelCount)} model fields`,
      visual: "Topic, function, neutral tier, model-output, package, and unit relationship cards.",
      detail: "Ontology links are aggregate similarity and grouping cues, not legal authority claims.",
      evidence: "Model scores remain neutral relative outputs until score direction is verified.",
    },
    {
      surface: "Charts and Score Lens",
      tab: "results",
      artifacts: ["charts.json", "models.json", "map_layers.json", "visual_smoke.json"],
      metric: `${formatCount(chartCount)} chart panels · ${formatCount(modelCount)} model fields`,
      visual: "State/topic charts, route legend, neutral score distributions, state matrix, unit profiles.",
      detail: "Charts summarize published aggregate units and can route to Map, Inquiry, and Ontology.",
      evidence: visualSmoke ? `Hosted route smoke ${visualSmoke.status || "unknown"} on ${formatDateTime(visualSmoke.completed_at)}.` : "No hosted route-smoke artifact is loaded.",
    },
    {
      surface: "Audit Lens",
      tab: "audit",
      artifacts: ["audit_status.json", "unit_audit_quality.json", "map_layers.json"],
      metric: `${formatCount(auditStatus?.row_count || 0)} audit rows · ${formatCount(unitAuditQuality?.matched_unit_count || 0)} matched units`,
      visual: "OCR-risk, duplicate-text-hash, attention distribution, state atlas, queue preview.",
      detail: "Audit attention is a review-priority signal, not proof of OCR defects.",
      evidence: "Full audit outputs stay in ignored local storage; Pages receives aggregate rates only.",
    },
    {
      surface: "Queue Plan and Packages",
      tab: "queueplan",
      artifacts: ["map_layers.json", "unit_audit_quality.json", "status.json"],
      metric: packageVerification?.status === "complete" ? `${formatCount(packageVerification.matched_public_unit_count)} smoke-tested units` : "aggregate request planning only",
      visual: "Unit-level package requests, safety gates, browser-local package overlays.",
      detail: "The public export is a request artifact; local tooling materializes bounded packages.",
      evidence: "Text-bearing packages remain ignored and require explicit local content flags.",
    },
    {
      surface: "Snapshots and Status",
      tab: "snapshots",
      artifacts: ["artifact_snapshot.json", "status.json", "map_layers.json", "visual_smoke.json"],
      metric: `${formatCount(unitCount)} units compared against stored aggregate snapshot metrics`,
      visual: "Current-view exports, snapshot gallery, freshness badges, refresh timeline.",
      detail: "Snapshots preserve visual context and publication metadata, not row-level evidence.",
      evidence: "Timestamp and metric deltas are publication provenance, not proof of legal change.",
    },
    {
      surface: "Geometry Overlays",
      tab: "map",
      artifacts: ["county_geometry.json", "municipal_points.json", "map_layers.json"],
      metric: `${formatCount(countyGeometry?.matched_count || 0)} counties · ${formatCount(municipalPoints?.matched_count || 0)} towns matched`,
      visual: "Official county polygons, municipal/town points, selected-unit peer links.",
      detail: "Matches are machine-generated and pending review; unmatched towns remain explicit.",
      evidence: "No FIPS certainty or jurisdiction-control claim is inferred from a map match.",
    },
  ];
}

function artifactLineageRowHtml(row) {
  const showArtifacts = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  return `
    <article class="artifact-lineage-row">
      <div>
        <span>${escapeHtml(row.surface)}</span>
        <strong>${escapeHtml(row.metric)}</strong>
      </div>
      <p>${escapeHtml(row.visual)}</p>
      ${showArtifacts ? `<ul>${row.artifacts.map((artifact) => `<li>${escapeHtml(artifact)}</li>`).join("")}</ul>` : ""}
      <em>${escapeHtml(showEvidence ? row.evidence : row.detail)}</em>
      <button type="button" data-artifact-lineage-tab="${escapeHtml(row.tab)}">${escapeHtml(`Open ${row.surface}`)}</button>
    </article>
  `;
}

function currentArtifactSnapshotMetrics(status, artifacts) {
  const {
    auditStatus,
    inquiryBriefings,
    questionPack,
    countyGeometry,
    municipalPoints,
    unitAuditQuality,
    ontology,
    charts,
    models,
    packageVerification,
  } = artifacts;
  return {
    unit_count: Number(status.unit_count || artifacts.mapLayers?.units?.length || 0),
    law_count: Number(status.law_count || 0),
    audit_row_count: Number(auditStatus?.row_count || 0),
    unit_audit_row_count: Number(unitAuditQuality?.row_count || 0),
    matched_audit_unit_count: Number(unitAuditQuality?.matched_unit_count || 0),
    inquiry_briefing_count: (inquiryBriefings?.briefings || []).length,
    question_prompt_count: (questionPack?.prompts || []).length,
    ontology_node_count: (ontology?.nodes || []).length,
    ontology_edge_count: (ontology?.edges || []).length,
    chart_panel_count: charts?.charts ? Object.keys(charts.charts).length : 0,
    model_count: (models?.models || []).length,
    county_match_count: Number(countyGeometry?.matched_count || 0),
    municipal_match_count: Number(municipalPoints?.matched_count || 0),
    local_package_metadata_records: Number(packageVerification?.metadata_package_record_count || 0),
    local_package_matched_units: Number(packageVerification?.matched_public_unit_count || 0),
  };
}

function artifactMetricDelta(currentValue, baselineValue, noun) {
  const current = Number(currentValue);
  const baseline = Number(baselineValue);
  if (!Number.isFinite(current) || !Number.isFinite(baseline)) {
    return "snapshot baseline unavailable";
  }
  const delta = current - baseline;
  if (!delta) {
    return `no change in ${noun}`;
  }
  const sign = delta > 0 ? "+" : "";
  return `${sign}${formatCount(delta)} ${noun}`;
}

function artifactDeltaSummary(parts) {
  const available = parts.filter((part) => part && part !== "snapshot baseline unavailable");
  return available.length ? available.join(" · ") : "snapshot baseline unavailable";
}

function artifactChangeRowHtml(row) {
  return `
    <article class="artifact-change-row">
      <span>${escapeHtml(row.label)}</span>
      <strong>${escapeHtml(row.value)}</strong>
      <em>${escapeHtml(row.generatedAt ? `${formatDateTime(row.generatedAt)} · ${artifactAgeLabel(row.generatedAt)}` : "timestamp not available")}</em>
      <small>${escapeHtml(row.delta || "snapshot baseline unavailable")}</small>
      <p>${escapeHtml(row.detail)}</p>
    </article>
  `;
}

function latestArtifactTimestamp(rows) {
  return latestIso(rows.map((row) => row.generatedAt));
}

function latestIso(values) {
  return values
    .filter(Boolean)
    .map((value) => ({ value, time: new Date(value).getTime() }))
    .filter((item) => Number.isFinite(item.time))
    .sort((a, b) => b.time - a.time)[0]?.value || "";
}

function actionsBriefingRefreshHtml(status, inquiryBriefings, briefingGrok) {
  const refreshStatus = state.analysis.refreshStatus;
  const datasetRevision = status?.dataset_revision || state.analysis.mapLayers?.dataset_revision || "unknown";
  const generatedAt = inquiryBriefings?.generated_at || refreshStatus?.completed_at || status?.generated_at || null;
  const currentMode = inquiryBriefings
    ? briefingGrok.used
      ? `Offline Grok briefing generated ${formatDateTime(inquiryBriefings.generated_at)}`
      : `Deterministic briefing generated ${formatDateTime(inquiryBriefings.generated_at)}`
    : "Briefing artifact is not loaded";
  const validationState = status?.real_locus_rows_published
    ? "blocked if raw rows appear"
    : "aggregate-only validation required before deploy";
  return `
    <article class="actions-briefing-refresh" aria-label="Actions-only briefing refresh status">
      <div>
        <p class="eyebrow">Actions-only refresh</p>
        <h3>Refresh aggregate inquiry briefings</h3>
        <p>Use the repository workflow to regenerate static question and briefing artifacts. The browser opens the workflow page only; model calls happen offline during Actions and publish only validated aggregate JSON.</p>
      </div>
      <div class="actions-refresh-status" aria-label="Current briefing refresh state">
        <span>
          <strong>Current briefing</strong>
          <em>${escapeHtml(currentMode)}</em>
        </span>
        <span>
          <strong>Latest run</strong>
          <em>${escapeHtml(refreshStatus ? `run ${refreshStatus.run_id || "unknown"} · ${refreshStatus.conclusion || refreshStatus.status || "published"}` : "refresh status not loaded")}</em>
        </span>
        <span>
          <strong>Dataset revision</strong>
          <em>${escapeHtml(datasetRevision)}</em>
        </span>
        <span>
          <strong>Validation gate</strong>
          <em>${escapeHtml(validationState)}</em>
        </span>
        <span>
          <strong>Last artifact timestamp</strong>
          <em>${escapeHtml(generatedAt ? formatDateTime(generatedAt) : "not loaded")}</em>
        </span>
      </div>
      ${grokRefreshRunBadgeHtml(refreshStatus, inquiryBriefings, state.analysis.questionPack)}
      <div class="actions-refresh-controls">
        <a class="primary-action-link" href="${ACTIONS_REFRESH_WORKFLOW_URL}" target="_blank" rel="noopener noreferrer">Open refresh workflow</a>
        <span>Choose a manual run with offline enrichment enabled when the repository Actions secret is configured.</span>
      </div>
    </article>
  `;
}

function auditGateSummary(auditStatus) {
  const gates = auditStatus?.quality_gates || [];
  const reviewNeeded = gates.filter((gate) => gate.status !== "complete").length;
  return reviewNeeded ? `${formatCount(reviewNeeded)} review needed` : "all complete";
}

function auditOcrSummary(auditStatus) {
  const counts = auditStatus?.quality_counts?.ocr_risk_counts || {};
  const mediumHigh = Number(counts.medium || 0) + Number(counts.high || 0);
  return `${formatCount(mediumHigh)} medium/high rows`;
}

function auditOcrBarsHtml(auditStatus) {
  const counts = auditStatus?.quality_counts?.ocr_risk_counts || {};
  const total = Number(auditStatus?.row_count || 0);
  const rows = ["low", "medium", "high"].map((level) => ({
    level,
    value: Number(counts[level] || 0),
  }));
  return `
    <div class="audit-risk-bars">
      ${rows.map((row) => auditRiskSegment(row, total)).join("")}
    </div>
  `;
}

function auditRiskSegment(row, total) {
  const width = total ? Math.max(row.value ? 2 : 0, (row.value / total) * 100) : 0;
  return `
    <span class="audit-risk-${escapeHtml(row.level)}" style="width:${width.toFixed(3)}%" title="${escapeHtml(row.level)}: ${escapeHtml(formatCount(row.value))}">
      <strong>${escapeHtml(row.level)}</strong>
      <em>${escapeHtml(formatCount(row.value))}</em>
    </span>
  `;
}

function unitAuditQualityFor(unitId) {
  if (!unitId) {
    return null;
  }
  const rows = state.analysis.unitAuditQuality?.units || [];
  return rows.find((row) => row.unit_id === unitId) || null;
}

function importedPackageMapStats(allUnits = state.analysis.mapLayers?.units || []) {
  const imported = !isSyntheticQueue();
  const meta = imported ? loadImportStatus() || fallbackImportStatus() : null;
  const aliasIndex = packageUnitAliasIndex(allUnits);
  const units = new Map();
  let matchedRecords = 0;
  let unmatchedRecords = 0;
  for (const record of imported ? records : []) {
    const match = matchPackageRecordUnit(record, aliasIndex);
    if (!match) {
      unmatchedRecords += 1;
      continue;
    }
    matchedRecords += 1;
    if (!units.has(match.unit_id)) {
      units.set(match.unit_id, {
        unitId: match.unit_id,
        unit: match,
        recordCount: 0,
        reviewed: 0,
        skipped: 0,
        flagged: 0,
        remaining: 0,
      });
    }
    const hit = units.get(match.unit_id);
    hit.recordCount += 1;
    hit[statusForRecord(record)] += 1;
  }
  return {
    imported,
    meta,
    fileName: meta?.file_name || "Imported bounded package",
    datasetRevision: meta?.dataset_revision || records[0]?.dataset_revision || "imported-bounded-queue",
    importedAt: meta?.imported_at || null,
    recordCount: imported ? records.length : 0,
    matchedRecords,
    unmatchedRecords,
    units,
    syntheticDemo: Boolean(meta?.synthetic_demo_data),
    textIncluded: Boolean(meta?.ordinance_text_included),
  };
}

function packageUnitAliasIndex(units) {
  const index = new Map();
  for (const unit of units || []) {
    for (const alias of packageUnitAliases(unit)) {
      index.set(alias, unit);
    }
  }
  return index;
}

function packageUnitAliases(unit) {
  return [
    unit.unit_id,
    packageUnitAlias(unit.state, unit.kind, unit.name),
    packageUnitAlias(unit.state, unit.kind, unit.unit_name),
  ].filter(Boolean).map(packageAliasKey);
}

function matchPackageRecordUnit(record, aliasIndex) {
  const candidates = [
    record.unit_id,
    packageUnitAlias(record.state_normalized || record.state, record.jurisdiction_type_normalized || record.source_jurisdiction_type, record.jurisdiction_name),
    packageUnitAlias(record.state_normalized || record.state, "county", record.county),
    packageUnitAlias(record.state_normalized || record.state, "city", record.city),
  ].filter(Boolean).map(packageAliasKey);
  for (const candidate of candidates) {
    const unit = aliasIndex.get(candidate);
    if (unit) {
      return unit;
    }
  }
  return null;
}

function packageUnitAlias(stateCode, kind, name) {
  if (!stateCode || !kind || !name) {
    return "";
  }
  return `${String(stateCode).trim().toUpperCase()}:${normalizePackageKind(kind)}:${String(name).trim()}`;
}

function normalizePackageKind(kind) {
  const value = String(kind || "").trim().toLowerCase();
  if (["county", "counties"].includes(value)) {
    return "county";
  }
  if (["city", "cities", "municipal", "municipality", "town", "township", "village", "borough", "place"].includes(value)) {
    return "city";
  }
  return value || "unknown";
}

function packageAliasKey(value) {
  return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
}

function filterMapUnits(units) {
  return filterMapUnitsWithFilters(units, state.mapFilters);
}

function filterMapUnitsWithFilters(units, filters) {
  const normalized = normalizedLogMapFilters(filters);
  const packageUnitIds = normalized.packageOnly ? importedPackageMapStats(units).units : null;
  const scoreBandMap = normalized.scoreField ? scoreBandLookupFor(units, normalized.scoreField) : new Map();
  return units.filter((unit) => {
    if (packageUnitIds && !packageUnitIds.has(unit.unit_id)) {
      return false;
    }
    return unitMatchesMapFilters(unit, scoreBandMap, normalized);
  });
}

function unitMatchesMapFilters(unit, scoreBandMap = new Map(), filters = state.mapFilters) {
  const auditQuality = unitAuditQualityFor(unit.unit_id);
  if (filters.state && unit.state !== filters.state) {
    return false;
  }
  if (filters.tier && unit.tier !== filters.tier) {
    return false;
  }
  if (filters.topic && !Number(unit.topic_counts?.[filters.topic] || 0)) {
    return false;
  }
  if (filters.function && !Number(unit.function_counts?.[filters.function] || 0)) {
    return false;
  }
  if (filters.kind && normalizePackageKind(unit.kind) !== filters.kind) {
    return false;
  }
  if (filters.scoreField) {
    const value = Number(unit.model_score_means?.[filters.scoreField]);
    if (!Number.isFinite(value)) {
      return false;
    }
    if (filters.scoreBand && scoreBandMap.get(unit.unit_id) !== filters.scoreBand) {
      return false;
    }
  }
  if (Number(unit.law_count || 0) < filters.minLaws) {
    return false;
  }
  if (Number(auditQuality?.audit_attention_score || 0) < filters.minAuditScore) {
    return false;
  }
  if (filters.auditFocus === "ocr" && !Number(auditQuality?.ocr_review_rows || 0)) {
    return false;
  }
  if (filters.auditFocus === "duplicate" && !Number(auditQuality?.duplicate_text_hash_rows || 0)) {
    return false;
  }
  if (filters.auditFocus === "attention" && Number(auditQuality?.audit_attention_score || 0) < 5) {
    return false;
  }
  return true;
}

function renderMapFilters(units) {
  const form = $("#map-filter-form");
  fillSelect(form.elements.state, [...new Set(units.map((unit) => unit.state).filter(Boolean))].sort(), state.mapFilters.state, "All states");
  fillSelect(form.elements.topic, sortedKeys(units, "topic_counts"), state.mapFilters.topic, "All topics");
  fillSelect(form.elements["function"], sortedKeys(units, "function_counts"), state.mapFilters.function, "All functions");
  fillSelect(form.elements.kind, [...new Set(units.map((unit) => normalizePackageKind(unit.kind)).filter(Boolean))].sort(), state.mapFilters.kind, "All unit types", titleCase);
  fillSelect(form.elements.tier, [...new Set(units.map((unit) => unit.tier).filter(Boolean))].sort(), state.mapFilters.tier, "All tiers", (tier) => {
    const definitions = state.analysis.mapLayers?.tier_definitions || {};
    return definitions[tier]?.label || tier;
  });
  fillSelect(form.elements.score_field, SCORE_FIELDS, state.mapFilters.scoreField, "All score fields", scoreFieldLabel);
  form.elements.score_band.value = state.mapFilters.scoreBand;
  form.elements.audit_focus.value = state.mapFilters.auditFocus;
  form.elements.min_laws.value = String(state.mapFilters.minLaws);
  form.elements.min_audit_score.value = String(state.mapFilters.minAuditScore);
  form.elements.package_only.checked = Boolean(state.mapFilters.packageOnly);
}

function fillSelect(select, values, selected, emptyLabel, labeler = (value) => value) {
  select.innerHTML = `<option value="">${escapeHtml(emptyLabel)}</option>`;
  values.forEach((value) => select.append(new Option(labeler(value), value)));
  select.value = selected;
}

function scoreFieldLabel(field) {
  return titleCase(field);
}

function scoreBandLabel(band) {
  return {
    low: "Low relative band",
    middle: "Middle relative band",
    high: "High relative band",
  }[band] || band;
}

function scoreBandLookupFor(units, field) {
  const rows = (units || [])
    .map((unit, index) => ({ unit, index, value: Number(unit.model_score_means?.[field]) }))
    .filter((row) => Number.isFinite(row.value))
    .sort((a, b) => a.value - b.value || a.index - b.index);
  const bands = new Map();
  const count = rows.length;
  rows.forEach((row, index) => {
    const ratio = (index + 1) / Math.max(1, count);
    const band = ratio <= 1 / 3 ? "low" : ratio <= 2 / 3 ? "middle" : "high";
    bands.set(row.unit.unit_id, band);
  });
  return bands;
}

function scoreBandForUnit(unit, field, units = state.analysis.mapLayers?.units || []) {
  return scoreBandLookupFor(units, field).get(unit.unit_id) || "";
}

function sortedKeys(units, key) {
  return [...new Set(units.flatMap((unit) => Object.keys(unit[key] || {})).filter((value) => value !== "Not_applicable"))].sort();
}

function renderMapInsights(units, allUnits) {
  const summary = summarizeUnits(units);
  const allSummary = summarizeUnits(allUnits);
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  const filteredLabel = activeFilterLabels().join(" · ") || "All published aggregate units";
  const cards = [
    insightCard("Current filter", filteredLabel, `${formatCount(units.length)} of ${formatCount(allUnits.length)} units`),
    insightCard("Law records", formatCount(summary.lawCount), `${formatPercent(summary.lawCount, allSummary.lawCount)} of published aggregate layer`),
    insightCard("Substantive rows", formatCount(summary.substantiveCount), `${formatPercent(summary.substantiveCount, summary.lawCount)} of filtered rows`),
    insightCard("Top topic", summary.topTopic.label, `${formatCount(summary.topTopic.value)} rows`),
    insightCard("Top function", summary.topFunction.label, `${formatCount(summary.topFunction.value)} rows`),
    insightCard("Tier mix", tierMix(summary.tierCounts), "Neutral bands, not legal rankings"),
  ];
  if (showUnit) {
    cards.push(insightCard("Largest unit", summary.topUnit ? displayUnitName(summary.topUnit) : "No matching unit", summary.topUnit ? `${summary.topUnit.state} · ${formatCount(summary.topUnit.law_count)} rows` : "Adjust filters"));
    cards.push(insightCard("Mean score snapshot", scoreSnapshot(summary.scoreMeans), "Neutral model-score means"));
  }
  if (showEvidence) {
    cards.push(insightCard("Evidence boundary", "Aggregate only", "No ordinance text or source samples are public in this layer"));
  }
  $("#map-insight-grid").innerHTML = cards.join("");
}

function renderMapComparisons(units, allUnits) {
  const summary = summarizeUnits(units);
  const allSummary = summarizeUnits(allUnits);
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  const cards = [
    comparisonCard(
      "Topic share",
      compareCounts(summary.topicCounts, allSummary.topicCounts, summary.lawCount, allSummary.lawCount).slice(0, 6),
      "Filtered rows vs full published aggregate layer",
    ),
    comparisonCard(
      "Tier unit share",
      compareCounts(summary.tierCounts, allSummary.tierCounts, units.length, allUnits.length),
      "Filtered units vs all published units",
    ),
  ];
  if (showUnit) {
    cards.push(
      comparisonCard(
        "Function share",
        compareCounts(summary.functionCounts, allSummary.functionCounts, summary.lawCount, allSummary.lawCount).slice(0, 6),
        "Released LOCUS function labels, not human review labels",
      ),
    );
    cards.push(
      comparisonCard(
        "Jurisdiction kind",
        compareCounts(summary.kindCounts, allSummary.kindCounts, units.length, allUnits.length),
        "County/town source type normalized for the aggregate layer",
      ),
    );
  }
  if (showEvidence) {
    cards.push(scoreComparisonCard(summary.scoreMeans, allSummary.scoreMeans));
  }
  $("#map-comparison-grid").innerHTML = cards.join("");
}

function insightCard(label, value, detail) {
  return `
    <article class="insight-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <em>${escapeHtml(detail)}</em>
    </article>
  `;
}

function summarizeUnits(units) {
  const topicCounts = {};
  const functionCounts = {};
  const tierCounts = {};
  const kindCounts = {};
  const scoreTotals = {};
  const scoreCounts = {};
  let lawCount = 0;
  let substantiveCount = 0;
  let topUnit = null;
  for (const unit of units) {
    lawCount += Number(unit.law_count || 0);
    substantiveCount += Number(unit.substantive_count || 0);
    topUnit = !topUnit || Number(unit.law_count || 0) > Number(topUnit.law_count || 0) ? unit : topUnit;
    addCounts(topicCounts, unit.topic_counts || {});
    addCounts(functionCounts, unit.function_counts || {});
    tierCounts[unit.tier_label || unit.tier || "Unspecified"] = (tierCounts[unit.tier_label || unit.tier || "Unspecified"] || 0) + 1;
    kindCounts[unit.kind || "unknown"] = (kindCounts[unit.kind || "unknown"] || 0) + 1;
    for (const [field, value] of Object.entries(unit.model_score_means || {})) {
      const number = Number(value);
      if (Number.isFinite(number)) {
        scoreTotals[field] = (scoreTotals[field] || 0) + number;
        scoreCounts[field] = (scoreCounts[field] || 0) + 1;
      }
    }
  }
  const scoreMeans = Object.fromEntries(
    Object.entries(scoreTotals).map(([field, total]) => [field, total / scoreCounts[field]]),
  );
  return {
    lawCount,
    substantiveCount,
    topicCounts,
    functionCounts,
    tierCounts,
    kindCounts,
    scoreMeans,
    topTopic: topEntry(topicCounts),
    topFunction: topEntry(functionCounts),
    topUnit,
  };
}

function compareCounts(filteredCounts, fullCounts, filteredTotal, fullTotal) {
  const labels = [...new Set([...Object.keys(filteredCounts), ...Object.keys(fullCounts)])];
  return labels
    .map((label) => {
      const filteredValue = Number(filteredCounts[label] || 0);
      const fullValue = Number(fullCounts[label] || 0);
      const filteredShare = filteredTotal ? filteredValue / filteredTotal : 0;
      const fullShare = fullTotal ? fullValue / fullTotal : 0;
      return {
        label,
        filteredValue,
        fullValue,
        filteredShare,
        fullShare,
        delta: filteredShare - fullShare,
      };
    })
    .filter((row) => row.filteredValue || row.fullValue)
    .sort((a, b) => b.filteredShare - a.filteredShare || b.fullShare - a.fullShare || a.label.localeCompare(b.label));
}

function comparisonCard(title, rows, detail) {
  return `
    <article class="comparison-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(detail)}</p>
      <div class="comparison-list">
        ${
          rows.length
            ? rows.map(comparisonRow).join("")
            : '<p class="muted-note">No matching aggregate rows.</p>'
        }
      </div>
    </article>
  `;
}

function comparisonRow(row) {
  return `
    <div class="comparison-row">
      <div>
        <strong>${escapeHtml(row.label)}</strong>
        <span>${formatPercent(row.filteredShare, 1)} visible · ${formatPercent(row.fullShare, 1)} full</span>
      </div>
      <div class="comparison-bars" aria-hidden="true">
        <i class="filtered" style="width:${Math.max(2, row.filteredShare * 100)}%"></i>
        <i class="full" style="width:${Math.max(2, row.fullShare * 100)}%"></i>
      </div>
    </div>
  `;
}

function scoreComparisonCard(filteredScores, fullScores) {
  const rows = Object.keys({ ...fullScores, ...filteredScores }).sort();
  return `
    <article class="comparison-card">
      <h3>Neutral score means</h3>
      <p>Filtered mean vs full-layer mean. Directional legal meaning remains unverified.</p>
      <div class="score-compare-list">
        ${
          rows.length
            ? rows
                .map((field) => {
                  const filtered = filteredScores[field];
                  const full = fullScores[field];
                  const delta = Number.isFinite(filtered) && Number.isFinite(full) ? filtered - full : null;
                  return `
                    <div>
                      <strong>${escapeHtml(field)}</strong>
                      <span>${escapeHtml(formatScoreValue(filtered))} filtered · ${escapeHtml(formatScoreValue(full))} full · delta ${escapeHtml(formatScoreValue(delta))}</span>
                    </div>
                  `;
                })
                .join("")
            : '<p class="muted-note">No score data for this view.</p>'
        }
      </div>
    </article>
  `;
}

function formatScoreValue(value) {
  return Number.isFinite(value) ? value.toFixed(3) : "n/a";
}

function addCounts(target, source) {
  for (const [label, value] of Object.entries(source)) {
    if (label === "Not_applicable") {
      continue;
    }
    target[label] = (target[label] || 0) + Number(value || 0);
  }
}

function topEntry(counts) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries.length ? { label: entries[0][0], value: entries[0][1] } : { label: "No matching rows", value: 0 };
}

function tierMix(counts) {
  const entries = Object.entries(counts);
  return entries.length ? entries.map(([label, value]) => `${label}: ${formatCount(value)}`).join(" · ") : "No matching units";
}

function scoreSnapshot(scoreMeans) {
  const entries = Object.entries(scoreMeans);
  return entries.length ? entries.map(([field, value]) => `${field}: ${value.toFixed(2)}`).join(" · ") : "No score data";
}

function activeFilterLabels() {
  const labels = [];
  if (state.mapFilters.state) labels.push(`State ${state.mapFilters.state}`);
  if (state.mapFilters.topic) labels.push(`Topic ${state.mapFilters.topic}`);
  if (state.mapFilters.function) labels.push(`Function ${state.mapFilters.function}`);
  if (state.mapFilters.kind) labels.push(`Unit type ${titleCase(state.mapFilters.kind)}`);
  if (state.mapFilters.tier) labels.push(`Tier ${state.mapFilters.tier}`);
  if (state.mapFilters.scoreField) labels.push(`Score ${scoreFieldLabel(state.mapFilters.scoreField)}`);
  if (state.mapFilters.scoreBand) labels.push(`Score band ${scoreBandLabel(state.mapFilters.scoreBand)}`);
  if (state.mapFilters.minLaws) labels.push(`Min ${formatCount(state.mapFilters.minLaws)} laws`);
  if (state.mapFilters.auditFocus) labels.push(`Audit ${auditFocusLabel(state.mapFilters.auditFocus)}`);
  if (state.mapFilters.minAuditScore) labels.push(`Min audit ${formatNumber(state.mapFilters.minAuditScore)}`);
  if (state.mapFilters.packageOnly) labels.push("Imported package units");
  return labels;
}

function auditFocusLabel(value) {
  return {
    ocr: "medium/high OCR",
    duplicate: "duplicate text hash",
    attention: "attention 5+",
  }[value] || value;
}

function formatCount(value) {
  return NUMBER_FORMATTER.format(Number(value || 0));
}

function formatNumber(value) {
  const number = Number(value || 0);
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}

function formatDateTime(value) {
  if (!value) {
    return "unknown";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString();
}

function formatPercent(part, total) {
  if (!total) {
    return "0%";
  }
  return `${((Number(part || 0) / Number(total)) * 100).toFixed(1)}%`;
}

function formatPercentRatio(value) {
  if (!Number.isFinite(value)) {
    return "n/a";
  }
  return `${(Number(value) * 100).toFixed(1)}%`;
}

function shortCommit(value) {
  return value ? String(value).slice(0, 12) : "unknown";
}

function stateCenterSvg(center) {
  return `
    <g class="state-anchor" aria-hidden="true">
      <circle cx="${Number(center.x || 0)}" cy="${Number(center.y || 0)}" r="4.2"></circle>
      <text x="${Number(center.x || 0)}" y="${Number(center.y || 0) + 0.45}">${escapeHtml(center.state)}</text>
    </g>
  `;
}

function unitSvg(unit, packageStats = importedPackageMapStats()) {
  const layout = unit.layout || {};
  const fill = unit.tier_color || "#d8dee8";
  const selected = state.selectedUnitId === unit.unit_id ? " selected" : "";
  const packageHit = packageStats.units.get(unit.unit_id);
  const packageClass = packageHit ? " package-hit" : "";
  const inquiryClass = state.inquiryMapHighlight ? (inquiryMapHighlightHasUnit(unit.unit_id) ? " inquiry-hit" : " inquiry-muted") : "";
  const title = `${displayUnitName(unit)}: ${unit.tier_label}${packageHit ? ` · ${formatCount(packageHit.recordCount)} local package records` : ""}`;
  const common = `data-unit-id="${escapeHtml(unit.unit_id)}" class="map-unit${selected}${packageClass}${inquiryClass}" fill="${escapeHtml(fill)}" tabindex="0"`;
  if (layout.type === "point") {
    return `<circle ${common} cx="${Number(layout.x || 0)}" cy="${Number(layout.y || 0)}" r="${Number(layout.r || 3.5)}"><title>${escapeHtml(title)}</title></circle>`;
  }
  return `<rect ${common} x="${Number(layout.x || 0)}" y="${Number(layout.y || 0)}" width="${Number(layout.w || 8)}" height="${Number(layout.h || 8)}" rx="1.5"><title>${escapeHtml(title)}</title></rect>`;
}

function renderSelectedUnit() {
  const units = state.analysis.mapLayers ? filterMapUnits(state.analysis.mapLayers.units || []) : [];
  const unit = units.find((item) => item.unit_id === state.selectedUnitId) || units[0];
  if (!unit) {
    $("#unit-detail").innerHTML = "<p>No aggregate unit matches the current filters.</p>";
    return;
  }
  const scores = Object.entries(unit.model_score_means || {})
    .map(([field, value]) => `<li>${escapeHtml(field)}: ${escapeHtml(value === null ? "n/a" : Number(value).toFixed(3))}</li>`)
    .join("");
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  const substantiveShare = modelSubstantiveShare(unit);
  const auditQuality = unitAuditQualityFor(unit.unit_id);
  const packageStats = importedPackageMapStats(state.analysis.mapLayers?.units || []);
  const packageHit = packageStats.units.get(unit.unit_id);
  const samples = showEvidence
    ? (unit.samples || [])
        .map(
          (sample) => `
            <li>
              <strong>${escapeHtml(text(sample.header))}</strong>
              <span>${escapeHtml(text(sample.topic))} / ${escapeHtml(text(sample.function))}</span>
              <code>${escapeHtml(text(sample.source_locator))}</code>
            </li>
          `,
        )
        .join("")
    : "";
  $("#unit-detail").innerHTML = `
    <h3>${escapeHtml(displayUnitName(unit))}</h3>
    <p>${escapeHtml(text(unit.state))} ${escapeHtml(text(unit.kind))} · ${escapeHtml(unit.tier_label)}</p>
    <button class="ask-unit-button" type="button" data-ask-unit-id="${escapeHtml(unit.unit_id)}">Ask about this unit</button>
    ${selectedUnitQueryReplayHtml(unit, auditQuality, packageHit)}
    ${selectedUnitProgressiveTrailHtml(unit, auditQuality, packageHit)}
    ${selectedUnitMapOntologyRouteHtml(unit, auditQuality, packageHit)}
    ${selectedUnitOntologyRouteComparisonOverlayHtml(unit, auditQuality, packageHit, packageStats)}
    ${selectedUnitOntologyQueryDrawerHtml(unit, auditQuality, packageHit)}
    <dl class="metadata-grid compact-metadata">
      <dt>Laws</dt><dd>${escapeHtml(String(unit.law_count))}</dd>
      <dt>Substantive</dt><dd>${escapeHtml(String(unit.substantive_count))}</dd>
      <dt>Model substantive share</dt><dd>${escapeHtml(formatPercentRatio(substantiveShare))}</dd>
      <dt>Audit attention</dt><dd>${escapeHtml(auditQuality ? `${formatNumber(auditQuality.audit_attention_score)} / 100` : "not available")}</dd>
      <dt>Dominant topic</dt><dd>${escapeHtml(text(unit.dominant_topic))}</dd>
      <dt>Dominant function</dt><dd>${escapeHtml(text(unit.dominant_function))}</dd>
      <dt>OCR risk</dt><dd>${escapeHtml(text(unit.ocr_risk_level))}</dd>
    </dl>
    ${selectedUnitPackageCoverageHtml(packageHit)}
    ${selectedUnitOntologyNeighborhoodHtml(unit, { compact: true })}
    ${selectedUnitOntologyDrilldownHtml(unit, auditQuality, packageHit)}
    ${selectedUnitPeerComparisonHtml(unit)}
    ${selectedUnitAuditQualityHtml(auditQuality)}
    ${
      showUnit
        ? `<h4>Neutral model-score means</h4><ul>${scores}</ul>`
        : `<p class="muted-note">Switch to Unit detail to reveal score summaries.</p>`
    }
    ${
      showEvidence
        ? `<h4>Evidence trail</h4><p class="muted-note">Model substantive share denominator: ${escapeHtml(formatCount(unit.substantive_count || 0))}/${escapeHtml(formatCount(unit.law_count || 0))} released LOCUS rows in this aggregate unit. This is a model output, not a verified legal classification.</p><ol>${samples || "<li>No public samples in this artifact.</li>"}</ol>`
        : `<p class="muted-note">Switch to Evidence trail to reveal source locators and public samples when allowed.</p>`
    }
  `;
}

function selectedUnitQueryReplayHtml(unit, auditQuality, packageHit) {
  const question = selectedUnitRouteQuestion(unit);
  const steps = [
    {
      label: "Map mark",
      value: displayUnitName(unit),
      detail: `${text(unit.state)} · ${text(unit.kind)} · ${text(unit.tier_label)}`,
    },
    {
      label: "Static answer",
      value: "Selected-unit inquiry",
      detail: `${formatCount(unit.law_count)} aggregate rows · ${text(unit.dominant_topic)} / ${text(unit.dominant_function)}`,
    },
    {
      label: "Ontology replay",
      value: "Topic, function, tier",
      detail: packageHit
        ? `${formatCount(packageHit.recordCount)} browser-local package records can overlay the route`
        : auditQuality
          ? `audit attention ${formatNumber(auditQuality.audit_attention_score)} / 100`
          : "aggregate graph path",
    },
  ];
  return `
    <section class="selected-query-replay" aria-label="Selected unit query replay route">
      <div class="selected-query-heading">
        <div>
          <p class="eyebrow">Selected-unit query replay</p>
          <h4>Ask -> answer -> ontology for this county/town</h4>
        </div>
        <span>${escapeHtml(formatCount(unit.law_count))} aggregate rows</span>
      </div>
      <p class="selected-query-question">${escapeHtml(question)}</p>
      <div class="selected-query-steps">
        ${steps.map((step, index) => selectedUnitQueryReplayStepHtml(step, index)).join("")}
      </div>
      <div class="selected-query-actions">
        <button type="button" data-selected-query-route="inquiry" data-selected-query-unit="${escapeHtml(unit.unit_id)}">Open answer</button>
        <button type="button" data-selected-query-route="ontology" data-selected-query-unit="${escapeHtml(unit.unit_id)}">Replay graph</button>
        <button type="button" data-selected-query-route="save" data-selected-query-unit="${escapeHtml(unit.unit_id)}">Save route</button>
      </div>
      <p class="selected-query-boundary">Route stores only aggregate filters, selected unit ID, answer summary, artifact timestamps, and publication-policy flags. No ordinance text, source locators, review events, secrets, or browser model calls.</p>
    </section>
  `;
}

function selectedUnitQueryReplayStepHtml(step, index) {
  return `
    <span style="--query-index:${index}">
      <strong>${escapeHtml(step.label)}</strong>
      <b>${escapeHtml(step.value)}</b>
      <em>${escapeHtml(step.detail)}</em>
    </span>
  `;
}

function selectedUnitRouteQuestion(unit) {
  return `What does the selected unit ${displayUnitName(unit)} show?`;
}

function selectedUnitOntologyQueryDrawerHtml(unit, auditQuality, packageHit) {
  const geometry = geometryMatchForUnit(unit.unit_id);
  const nodes = selectedUnitOntologyQueryNodes(unit, geometry, auditQuality, packageHit);
  const peers = selectedUnitPeers(unit).slice(0, state.disclosureLevel === "overview" ? 3 : 5);
  return `
    <section class="selected-ontology-query-drawer" aria-label="County and town ontology query drawer">
      <div class="selected-ontology-query-heading">
        <div>
          <p class="eyebrow">County/town ontology query drawer</p>
          <h4>Turn this selected map unit into graph questions</h4>
        </div>
        <span>${escapeHtml(text(unit.kind))} · ${escapeHtml(text(unit.state))}</span>
      </div>
      <div class="selected-ontology-query-nodes" aria-label="Selected aggregate ontology nodes">
        ${nodes.map(selectedUnitOntologyQueryNodeHtml).join("")}
      </div>
      <div class="selected-ontology-query-peers" aria-label="Connected county and town aggregate peers">
        <div>
          <strong>${escapeHtml(formatCount(peers.length))} connected aggregate peers</strong>
          <em>${escapeHtml(state.disclosureLevel === "overview" ? "Overview shows a short peer list" : "Unit detail shows expanded peer routes")}</em>
        </div>
        ${peers.length ? peers.map(selectedUnitOntologyQueryPeerHtml).join("") : '<p class="muted-note">No aggregate peers are available for this selected unit under the current artifact.</p>'}
      </div>
      <p class="selected-ontology-query-boundary">Node filters update the colored county/town map from aggregate counts only. The drawer publishes no ordinance text, source locators, review events, secrets, live model calls, or legal findings.</p>
    </section>
  `;
}

function selectedUnitOntologyQueryNodes(unit, geometry, auditQuality, packageHit) {
  const tierKey = unit.tier || tierKeyForLabel(unit.tier_label, state.analysis.mapLayers?.tier_definitions || {});
  const topicRows = Number(unit.topic_counts?.[unit.dominant_topic] || 0);
  const functionRows = Number(unit.function_counts?.[unit.dominant_function] || 0);
  const peerCount = selectedUnitPeers(unit).length;
  return [
    {
      action: "ask",
      label: "Ask",
      value: "Selected-unit answer",
      detail: `${formatCount(unit.law_count)} aggregate rows`,
      color: "#6b4fd6",
      disabled: false,
    },
    {
      action: "topic",
      label: "Topic node",
      value: text(unit.dominant_topic),
      routeValue: unit.dominant_topic || "",
      detail: `${formatCount(topicRows)} rows in this unit`,
      color: TOPIC_COLORS[unit.dominant_topic] || TOPIC_COLORS.Unknown,
      disabled: !unit.dominant_topic || !topicRows,
    },
    {
      action: "function",
      label: "Function node",
      value: text(unit.dominant_function),
      routeValue: unit.dominant_function || "",
      detail: `${formatCount(functionRows)} rows in this unit`,
      color: FUNCTION_COLORS[unit.dominant_function] || FUNCTION_COLORS.Unknown,
      disabled: !unit.dominant_function || !functionRows,
    },
    {
      action: "tier",
      label: "Neutral tier",
      value: text(unit.tier_label),
      routeValue: tierKey || "",
      detail: "color band and ontology focus",
      color: unit.tier_color || "#d8dee8",
      disabled: !tierKey,
    },
    {
      action: "peers",
      label: "Peer graph",
      value: `${formatCount(peerCount)} routes`,
      detail: "topic, function, tier, geography",
      color: "#326f70",
      disabled: peerCount === 0,
    },
    {
      action: "scores",
      label: "Score nodes",
      value: scoreSnapshot(unit.model_score_means || {}),
      detail: "relative model means; direction unverified",
      color: "#8d6aa8",
      disabled: !Object.keys(unit.model_score_means || {}).length,
    },
    {
      action: "evidence",
      label: "Provenance gate",
      value: geometry.matchStatus,
      detail: packageHit
        ? `${formatCount(packageHit.recordCount)} browser-local package records`
        : auditQuality
          ? `audit attention ${formatNumber(auditQuality.audit_attention_score)} / 100`
          : geometry.source,
      color: "#b7892c",
      disabled: false,
    },
  ];
}

function selectedUnitOntologyQueryNodeHtml(node) {
  const routeValue = node.routeValue || node.value || "";
  return `
    <button type="button" class="selected-ontology-query-node${node.disabled ? " disabled" : ""}" data-selected-ontology-query="${escapeHtml(node.action)}" data-selected-ontology-query-value="${escapeHtml(routeValue)}" style="--query-node-color:${escapeHtml(node.color || "#d8dee8")}"${node.disabled ? " disabled" : ""}>
      <span>${escapeHtml(node.label)}</span>
      <strong>${escapeHtml(node.value)}</strong>
      <em>${escapeHtml(node.detail)}</em>
    </button>
  `;
}

function selectedUnitOntologyQueryPeerHtml(peer) {
  const unit = peer.unit;
  const reasons = peer.reasons.slice(0, 3).join(" + ") || "aggregate similarity";
  return `
    <button type="button" class="selected-ontology-query-peer" data-selected-ontology-query="peer" data-selected-ontology-query-value="${escapeHtml(unit.unit_id)}">
      <strong>${escapeHtml(displayUnitName(unit))}</strong>
      <span>${escapeHtml(text(unit.state))} · ${escapeHtml(text(unit.kind))} · ${escapeHtml(text(unit.tier_label))}</span>
      <em>${escapeHtml(reasons)}</em>
    </button>
  `;
}

function applySelectedUnitOntologyQuery(action, value = "") {
  const unit = currentSelectedMapUnit();
  if (!unit && action !== "peer") {
    return;
  }
  if (action === "ask" && unit) {
    const question = selectedUnitRouteQuestion(unit);
    const input = $("#inquiry-form input[name='question']");
    if (input) {
      input.value = question;
    }
    answerAndLogInquiry(question, "selected-unit ontology query drawer");
    state.activeTab = "inquiry";
    render();
    return;
  }
  if (action === "peer" && value) {
    const units = state.analysis.mapLayers ? state.analysis.mapLayers.units || [] : [];
    const peerUnit = units.find((item) => item.unit_id === value);
    if (!peerUnit) {
      return;
    }
    state.selectedUnitId = peerUnit.unit_id;
    state.disclosureLevel = "unit";
    state.activeTab = "map";
    state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(
      "Open aggregate peer from the selected-unit ontology query drawer",
      "selected-unit ontology query drawer",
      [peerUnit],
    );
    render();
    return;
  }
  if ((action === "topic" || action === "function" || action === "tier") && value) {
    state.mapFilters = {
      ...state.mapFilters,
      topic: action === "topic" ? value : state.mapFilters.topic,
      function: action === "function" ? value : state.mapFilters.function,
      tier: action === "tier" ? value : state.mapFilters.tier,
    };
    state.geographyColorMode = action;
    state.disclosureLevel = state.disclosureLevel === "overview" ? "unit" : state.disclosureLevel;
    const visibleUnits = filterMapUnits(state.analysis.mapLayers?.units || []);
    state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(
      `Show ${value} aggregate ${action} route from the selected-unit ontology query drawer`,
      "selected-unit ontology query drawer",
      visibleUnits,
    );
    state.activeTab = "map";
    render();
    return;
  }
  if (action === "peers") {
    state.selectedOntologyNeighborFilter = "all";
    state.ontologyPathStage = "unit";
    state.geographyLayers = {
      ...defaultGeographyLayers(),
      ...state.geographyLayers,
      ontology: true,
    };
    state.disclosureLevel = "unit";
    state.activeTab = "ontology";
    render();
    return;
  }
  if (action === "scores") {
    state.ontologyPathStage = "scores";
    state.disclosureLevel = "unit";
    state.activeTab = "ontology";
    render();
    return;
  }
  if (action === "evidence") {
    state.ontologyPathStage = "geometry";
    state.disclosureLevel = "evidence";
    state.geographyLayers = {
      ...defaultGeographyLayers(),
      ...state.geographyLayers,
      ontology: true,
    };
    state.activeTab = "map";
    render();
  }
}

function selectedUnitOntologyDrilldownHtml(unit, auditQuality, packageHit) {
  const cards = selectedUnitOntologyDrilldownCards(unit, auditQuality, packageHit);
  return `
    <section class="selected-ontology-drilldown" aria-label="Selected unit ontology drilldown cards">
      <div class="selected-ontology-drilldown-heading">
        <div>
          <p class="eyebrow">Ontology drilldown</p>
          <h4>Aggregate links for this map unit</h4>
        </div>
        <span>${escapeHtml(formatCount(cards.length))} nodes</span>
      </div>
      <div class="selected-ontology-drilldown-grid">
        ${cards.map(selectedUnitOntologyDrilldownCardHtml).join("")}
      </div>
      <p class="muted-note">These cards link aggregate LOCUS model outputs, geometry-match artifacts, and browser-local package state. They are not legal conclusions.</p>
    </section>
  `;
}

function selectedUnitOntologyDrilldownCards(unit, auditQuality, packageHit) {
  const geometry = geometryMatchForUnit(unit.unit_id);
  const packageValue = packageHit
    ? `${formatCount(packageHit.recordCount)} local records`
    : "No local package match";
  return [
    {
      key: "topic",
      label: "Topic node",
      value: text(unit.dominant_topic),
      detail: `${formatCount(unit.law_count)} aggregate rows connect this unit to its dominant released topic label.`,
      color: TOPIC_COLORS[unit.dominant_topic] || TOPIC_COLORS.Unknown,
      action: "ontology",
      actionLabel: "Open ontology",
    },
    {
      key: "function",
      label: "Function node",
      value: text(unit.dominant_function),
      detail: "Function labels are model-produced aggregate context for review and comparison.",
      color: FUNCTION_COLORS[unit.dominant_function] || FUNCTION_COLORS.Unknown,
      action: "ontology",
      actionLabel: "Open ontology",
    },
    {
      key: "tier",
      label: "Map tier",
      value: text(unit.tier_label),
      detail: "Tier color is a neutral visual grouping over published aggregate model-score means.",
      color: unit.tier_color || "#d8dee8",
      action: "overview",
      actionLabel: "Show overview",
    },
    {
      key: "scores",
      label: "Model outputs",
      value: scoreSnapshot(unit.model_score_means || {}),
      detail: `${formatPercentRatio(modelSubstantiveShare(unit))} model-substantive share; score direction remains unverified.`,
      color: "#8d6aa8",
      action: "unit",
      actionLabel: "Show details",
    },
    {
      key: "geometry",
      label: "Geometry link",
      value: geometry.matchStatus,
      detail: `${geometry.summary}; audit attention ${auditQuality ? `${formatNumber(auditQuality.audit_attention_score)} / 100` : "not available"}.`,
      color: "#b7892c",
      action: "evidence",
      actionLabel: "Show evidence",
    },
    {
      key: "package",
      label: "Local package",
      value: packageValue,
      detail: packageHit
        ? `${formatCount(packageHit.reviewed)} reviewed, ${formatCount(packageHit.remaining)} remaining in this browser only.`
        : "Import a bounded local package or load the synthetic package demo to connect review records.",
      color: "#6b4fd6",
      action: packageHit ? "package" : "evidence",
      actionLabel: packageHit ? "Focus package" : "Show boundary",
    },
  ];
}

function selectedUnitOntologyDrilldownCardHtml(card) {
  return `
    <article class="selected-ontology-drilldown-card" style="--node-color:${escapeHtml(card.color)}">
      <span>${escapeHtml(card.label)}</span>
      <strong>${escapeHtml(card.value)}</strong>
      <p>${escapeHtml(card.detail)}</p>
      <button type="button" data-selected-ontology-drilldown="${escapeHtml(card.action)}">${escapeHtml(card.actionLabel)}</button>
    </article>
  `;
}

function applySelectedOntologyDrilldown(action) {
  if (action === "ontology") {
    state.activeTab = "ontology";
    state.disclosureLevel = "unit";
    render();
    return;
  }
  if (action === "package") {
    state.mapFilters = {
      ...state.mapFilters,
      packageOnly: true,
    };
    state.disclosureLevel = "unit";
    render();
    return;
  }
  if (["overview", "unit", "evidence"].includes(action)) {
    state.disclosureLevel = action;
    render();
  }
}

function selectedUnitMapOntologyRouteHtml(unit, auditQuality, packageHit) {
  const geometry = geometryMatchForUnit(unit.unit_id);
  const routeStages = selectedUnitMapOntologyRouteStages(unit, geometry, auditQuality, packageHit);
  const activeStage = state.ontologyPathStage === "auto" ? "unit" : state.ontologyPathStage;
  return `
    <section class="selected-map-ontology-route" aria-label="Selected unit map-to-ontology route trail">
      <div class="selected-route-heading">
        <div>
          <p class="eyebrow">Map-to-ontology route</p>
          <h4>How this selected color reaches the graph</h4>
        </div>
        <button type="button" data-selected-route-open="auto">Open full path</button>
      </div>
      <div class="selected-route-strip" aria-label="Aggregate route stages">
        ${routeStages.map((stage, index) => selectedUnitMapOntologyRouteStageHtml(stage, index, activeStage)).join("")}
      </div>
      <p class="selected-route-boundary">Route stages pass only aggregate unit IDs, model-output labels, neutral score summaries, and match status. No ordinance text, source locators, legal conclusions, or live model calls are published.</p>
    </section>
  `;
}

function selectedUnitMapOntologyRouteStages(unit, geometry, auditQuality, packageHit) {
  return [
    {
      key: "unit",
      label: "Map color",
      value: text(unit.tier_label),
      detail: `${formatCount(unit.law_count)} aggregate rows in ${displayUnitName(unit)}`,
    },
    {
      key: "topic",
      label: "Topic node",
      value: text(unit.dominant_topic),
      detail: "released LOCUS model label",
    },
    {
      key: "function",
      label: "Function node",
      value: text(unit.dominant_function),
      detail: "released LOCUS model label",
    },
    {
      key: "tier",
      label: "Tier node",
      value: text(unit.tier_label),
      detail: "neutral grouping, not a ranking",
    },
    {
      key: "scores",
      label: "Score node",
      value: state.disclosureLevel === "overview" ? "Unit detail gated" : scoreSnapshot(unit.model_score_means || {}),
      detail: "relative numeric outputs; direction unverified",
    },
    {
      key: "geometry",
      label: "Evidence gate",
      value: state.disclosureLevel === "evidence" ? geometry.matchStatus : "Evidence gated",
      detail: packageHit
        ? `${formatCount(packageHit.recordCount)} browser-local package records`
        : auditQuality
          ? `audit attention ${formatNumber(auditQuality.audit_attention_score)} / 100`
          : "match and audit provenance",
    },
  ];
}

function selectedUnitMapOntologyRouteStageHtml(stage, index, activeStage) {
  const active = stage.key === activeStage ? " active" : "";
  return `
    <button type="button" class="selected-route-stage${active}" data-selected-route-open="${escapeHtml(stage.key)}" style="--route-index:${index}">
      <span>${escapeHtml(stage.label)}</span>
      <strong>${escapeHtml(stage.value)}</strong>
      <em>${escapeHtml(stage.detail)}</em>
    </button>
  `;
}

function selectedUnitOntologyRouteComparisonOverlayHtml(unit, auditQuality, packageHit, packageStats) {
  const peer = selectedUnitPeers(unit)[0];
  if (!peer) {
    return `
      <section class="selected-route-comparison-overlay" aria-label="Ontology route comparison overlay">
        <div class="selected-route-comparison-heading">
          <div>
            <p class="eyebrow">Ontology route comparison overlay</p>
            <h4>Selected route has no aggregate peer</h4>
          </div>
        </div>
        <p class="selected-route-comparison-boundary">Overlay compares aggregate map routes only. It is not a ranking, legal finding, source record, legal authority, or evidence that a law controls a place. No ordinance text, source locators, browser model calls, or secrets are published.</p>
      </section>
    `;
  }
  const peerUnit = peer.unit;
  const peerAuditQuality = unitAuditQualityFor(peerUnit.unit_id);
  const peerPackageHit = packageStats?.units?.get(peerUnit.unit_id);
  const comparisonRows = selectedUnitOntologyRouteComparisonRows(
    unit,
    peerUnit,
    auditQuality,
    peerAuditQuality,
    packageHit,
    peerPackageHit,
  );
  const tierKey = unit.tier || peerUnit.tier || tierKeyForLabel(unit.tier_label || peerUnit.tier_label || "", state.analysis.mapLayers?.tier_definitions || "");
  return `
    <section class="selected-route-comparison-overlay" aria-label="Ontology route comparison overlay">
      <div class="selected-route-comparison-heading">
        <div>
          <p class="eyebrow">Ontology route comparison overlay</p>
          <h4>Selected unit vs strongest aggregate peer</h4>
        </div>
        <div class="selected-route-comparison-actions">
          <button type="button" data-route-comparison-peer="${escapeHtml(peerUnit.unit_id)}">Open peer on map</button>
          <button type="button" data-route-comparison-ontology="${escapeHtml(tierKey)}">Open ontology tier</button>
        </div>
      </div>
      <p>Peer match uses shared aggregate fields and law-count proximity. It is a navigation overlay for the colored county/town map and ontology graph, not a legal ranking.</p>
      <div class="selected-route-comparison-grid" role="list">
        ${comparisonRows.map((row, index) => selectedUnitOntologyRouteComparisonRowHtml(row, index)).join("")}
      </div>
      <p class="selected-route-comparison-boundary">Overlay compares aggregate map routes only. It is not a ranking, legal finding, source record, legal authority, or evidence that a law controls a place. No ordinance text, source locators, browser model calls, or secrets are published.</p>
    </section>
  `;
}

function selectedUnitOntologyRouteComparisonRows(unit, peerUnit, auditQuality, peerAuditQuality, packageHit, peerPackageHit) {
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  const selectedGeometry = geometryMatchForUnit(unit.unit_id);
  const peerGeometry = geometryMatchForUnit(peerUnit.unit_id);
  const selectedProvenance = selectedUnitRouteComparisonProvenance(unit, selectedGeometry, auditQuality, packageHit, showEvidence);
  const peerProvenance = selectedUnitRouteComparisonProvenance(peerUnit, peerGeometry, peerAuditQuality, peerPackageHit, showEvidence);
  const scoreSelected = showUnit ? scoreSnapshot(unit.model_score_means || {}) : "Unit detail gated";
  const scorePeer = showUnit ? scoreSnapshot(peerUnit.model_score_means || {}) : "Unit detail gated";
  return [
    selectedUnitRouteComparisonRow("Map color", text(unit.tier_label), text(peerUnit.tier_label), "neutral tier color, not a ranking"),
    selectedUnitRouteComparisonRow("Topic", text(unit.dominant_topic), text(peerUnit.dominant_topic), "released LOCUS model-output label"),
    selectedUnitRouteComparisonRow("Function", text(unit.dominant_function), text(peerUnit.dominant_function), "released LOCUS model-output label"),
    selectedUnitRouteComparisonRow(
      "Rows",
      `${formatCount(unit.law_count)} aggregate rows`,
      `${formatCount(peerUnit.law_count)} aggregate rows`,
      "published aggregate counts, not a completeness finding",
      false,
    ),
    selectedUnitRouteComparisonRow("Score profile", scoreSelected, scorePeer, "relative numeric outputs; score direction unverified"),
    selectedUnitRouteComparisonRow("Geometry and audit", selectedProvenance, peerProvenance, "match status and audit metadata only"),
  ];
}

function selectedUnitRouteComparisonRow(stage, selectedValue, peerValue, detail, compareValues = true) {
  const normalizedSelected = String(selectedValue || "").trim().toLowerCase();
  const normalizedPeer = String(peerValue || "").trim().toLowerCase();
  const shared = compareValues && normalizedSelected && normalizedSelected === normalizedPeer;
  return {
    stage,
    selectedValue,
    peerValue,
    detail,
    shared,
    relationship: shared ? "shared aggregate route" : "different aggregate route",
  };
}

function selectedUnitRouteComparisonProvenance(unit, geometry, auditQuality, packageHit, showEvidence) {
  if (!showEvidence) {
    return "Evidence gated";
  }
  if (packageHit) {
    return `${geometry.matchStatus}; ${formatCount(packageHit.recordCount)} package records`;
  }
  if (auditQuality) {
    return `${geometry.matchStatus}; audit ${formatNumber(auditQuality.audit_attention_score)} / 100`;
  }
  return `${geometry.matchStatus}; no local package`;
}

function selectedUnitOntologyRouteComparisonRowHtml(row, index) {
  return `
    <article class="selected-route-comparison-row${row.shared ? " shared" : ""}" role="listitem" style="--route-index:${index}">
      <span>${escapeHtml(row.stage)}</span>
      <div>
        <em>Selected unit</em>
        <strong>${escapeHtml(row.selectedValue)}</strong>
      </div>
      <div>
        <em>Peer unit</em>
        <strong>${escapeHtml(row.peerValue)}</strong>
      </div>
      <small>${escapeHtml(row.relationship)} · ${escapeHtml(row.detail)}</small>
    </article>
  `;
}

function openSelectedUnitOntologyRoute(stage = "auto") {
  const allowed = new Set(["auto", "unit", "topic", "function", "tier", "scores", "geometry"]);
  const nextStage = allowed.has(stage) ? stage : "auto";
  state.ontologyPathStage = nextStage;
  if (nextStage === "scores" && state.disclosureLevel === "overview") {
    state.disclosureLevel = "unit";
  }
  if (nextStage === "geometry") {
    state.disclosureLevel = "evidence";
  }
  if (state.disclosureLevel === "overview" && nextStage !== "auto" && nextStage !== "unit") {
    state.disclosureLevel = "unit";
  }
  const selectedUnit = currentSelectedMapUnit();
  if (selectedUnit?.tier) {
    state.ontologyFocusTier = selectedUnit.tier;
  }
  state.geographyLayers = {
    ...defaultGeographyLayers(),
    ...state.geographyLayers,
    ontology: true,
  };
  state.activeTab = "ontology";
  render();
}

function openTierOntology(tierKey) {
  state.ontologyFocusTier = tierKey;
  state.activeTab = "ontology";
  if (state.disclosureLevel === "overview") {
    state.disclosureLevel = "unit";
  }
  render();
}

function selectedUnitProgressiveTrailHtml(unit, auditQuality, packageHit) {
  const geometry = geometryMatchForUnit(unit.unit_id);
  const scoreSummary = scoreSnapshot(unit.model_score_means || {});
  const packageSummary = packageHit
    ? `${formatCount(packageHit.recordCount)} local package records matched in this browser`
    : "No local package match for this aggregate unit";
  const steps = [
    {
      level: "overview",
      label: "Overview",
      value: `${formatCount(unit.law_count)} aggregate rows`,
      detail: `${text(unit.tier_label)} · ${text(unit.dominant_topic)} · ${text(unit.dominant_function)}`,
      boundary: "Public map color and counts only",
    },
    {
      level: "unit",
      label: "Unit detail",
      value: `${formatPercentRatio(modelSubstantiveShare(unit))} model-substantive`,
      detail: `Neutral score means: ${scoreSummary}`,
      boundary: "Model outputs are review aids, not legal findings",
    },
    {
      level: "evidence",
      label: "Evidence trail",
      value: auditQuality ? `Audit attention ${formatNumber(auditQuality.audit_attention_score)} / 100` : "Audit artifact not loaded",
      detail: `${geometry.matchStatus} geometry via ${geometry.source}; ${packageSummary}`,
      boundary: "No ordinance text or locator values are published",
    },
  ];
  return `
    <section class="selected-disclosure-trail" aria-label="Selected unit progressive disclosure trail">
      <div class="selected-disclosure-heading">
        <p class="eyebrow">Progressive visual trail</p>
        <strong>${escapeHtml(titleCase(state.disclosureLevel))}</strong>
      </div>
      <div class="selected-disclosure-steps">
        ${steps.map(selectedUnitDisclosureStepHtml).join("")}
      </div>
    </section>
  `;
}

function selectedUnitDisclosureStepHtml(step) {
  const active = step.level === state.disclosureLevel ? " active" : "";
  return `
    <button class="selected-disclosure-step${active}" type="button" data-selected-disclosure="${escapeHtml(step.level)}" aria-pressed="${step.level === state.disclosureLevel ? "true" : "false"}">
      <span>${escapeHtml(step.label)}</span>
      <strong>${escapeHtml(step.value)}</strong>
      <em>${escapeHtml(step.detail)}</em>
      <small>${escapeHtml(step.boundary)}</small>
    </button>
  `;
}

function selectedUnitPackageCoverageHtml(packageHit) {
  if (!packageHit) {
    return !isSyntheticQueue()
      ? `<section class="selected-package-card empty"><h4>Imported package coverage</h4><p class="muted-note">This selected aggregate unit is not represented in the current browser-local review package.</p></section>`
      : "";
  }
  return `
    <section class="selected-package-card" aria-label="Imported package coverage for selected unit">
      <div class="selected-package-heading">
        <h4>Imported package coverage</h4>
        <span>${escapeHtml(formatCount(packageHit.recordCount))} browser-local records</span>
      </div>
      <dl class="metadata-grid compact-metadata">
        <dt>Reviewed</dt><dd>${escapeHtml(formatCount(packageHit.reviewed))}</dd>
        <dt>Remaining</dt><dd>${escapeHtml(formatCount(packageHit.remaining))}</dd>
        <dt>Skipped</dt><dd>${escapeHtml(formatCount(packageHit.skipped))}</dd>
        <dt>Flagged</dt><dd>${escapeHtml(formatCount(packageHit.flagged))}</dd>
      </dl>
      <p class="muted-note">These counts are browser-local review workflow state for the imported package. They are not public evidence, legal findings, or part of the aggregate Pages artifact.</p>
    </section>
  `;
}

function selectedUnitAuditQualityHtml(auditQuality) {
  if (!auditQuality) {
    return `<p class="muted-note">No unit-level audit quality artifact is available for this map unit.</p>`;
  }
  const showEvidence = state.disclosureLevel === "evidence";
  return `
    <section class="selected-audit-card">
      <h4>Audit review signals</h4>
      <dl class="metadata-grid compact-metadata">
        <dt>Medium/high OCR rows</dt><dd>${escapeHtml(formatCount(auditQuality.ocr_review_rows))}</dd>
        <dt>Duplicate text-hash rows</dt><dd>${escapeHtml(formatCount(auditQuality.duplicate_text_hash_rows))}</dd>
        <dt>OCR review rate</dt><dd>${escapeHtml(formatPercentRatio(auditQuality.ocr_review_rate))}</dd>
        <dt>Duplicate text-hash rate</dt><dd>${escapeHtml(formatPercentRatio(auditQuality.duplicate_text_hash_rate))}</dd>
      </dl>
      ${
        showEvidence
          ? `<p class="muted-note">Unit audit quality is generated by a local Polars aggregate scan over published map units. OCR and duplicate text-hash signals are review aids, not legal findings or proof of text defects.</p>`
          : `<p class="muted-note">Switch to Evidence trail for the audit-quality generation boundary.</p>`
      }
    </section>
  `;
}

function renderPublicationGates() {
  const status = state.analysis.status;
  const gates = status ? status.publication_gates || [] : [];
  $("#publication-gates").innerHTML = gates.length
    ? `
      <h3>Publication gates</h3>
      <div>
        ${gates
          .map(
            (gate) => `
              <span>
                <strong>${escapeHtml(gate.label)}</strong>
                <em>${escapeHtml(gate.status)}</em>
              </span>
            `,
          )
          .join("")}
      </div>
    `
    : "";
}

function renderDisclosureButtons() {
  $all(".disclosure-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.disclosure === state.disclosureLevel);
  });
}

function renderGeoColorButtons() {
  $all(".geo-color-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.geoColor === state.geographyColorMode);
  });
}

function renderGeoLayerControls() {
  $all("[data-geo-layer]").forEach((control) => {
    const layer = control.dataset.geoLayer;
    const enabled = Boolean(state.geographyLayers?.[layer]);
    control.checked = enabled;
    control.closest("label")?.classList.toggle("active", enabled);
  });
}

function defaultGeographyLayers() {
  return { counties: true, municipalities: true, ontology: false };
}

function activeGeographyLayerLabels() {
  const labels = {
    counties: "Counties",
    municipalities: "Town points",
    ontology: state.disclosureLevel === "overview" ? "Ontology links at unit detail" : "Ontology links",
  };
  return Object.entries({ ...defaultGeographyLayers(), ...state.geographyLayers })
    .filter(([, enabled]) => enabled)
    .map(([layer]) => labels[layer] || titleCase(layer));
}

function renderOntology() {
  const ontology = state.analysis.ontology;
  const models = state.analysis.models;
  const buildStatus = $("#ontology-build-status");
  const modelImportStatus = $("#model-import-status");
  const queryPresets = $("#ontology-query-presets");
  const tierFocus = $("#ontology-tier-focus");
  const selectedNeighborhood = $("#selected-ontology-neighborhood");
  const packageBridge = $("#package-ontology-bridge");
  if (!ontology) {
    $("#ontology-summary").innerHTML = `
      <article class="metric-card"><span class="metric-value">...</span><span class="metric-label">Loading ontology</span></article>
    `;
    if (selectedNeighborhood) {
      selectedNeighborhood.innerHTML = "<p>Selected-unit ontology neighborhood loading.</p>";
    }
    if (queryPresets) {
      queryPresets.innerHTML = "<p>Map-driven ontology query presets loading.</p>";
    }
    if (buildStatus) {
      buildStatus.innerHTML = "<p>Ontology build status loading.</p>";
    }
    if (modelImportStatus) {
      modelImportStatus.innerHTML = "<p>Model import status loading.</p>";
    }
    if (tierFocus) {
      tierFocus.innerHTML = "<p>Tier ontology focus loading.</p>";
    }
    if (packageBridge) {
      packageBridge.innerHTML = "<p>Package ontology bridge loading.</p>";
    }
    $("#ontology-node-list").innerHTML = "";
    $("#model-list").innerHTML = "";
    return;
  }
  const counts = (ontology.nodes || []).reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {});
  $("#ontology-summary").innerHTML = [
    ["Nodes", ontology.nodes.length],
    ["Edges", ontology.edges.length],
    ["Topics", counts.topic || 0],
    ["Models", models ? models.models.length : 0],
  ]
    .map(
      ([label, value]) => `
        <article class="metric-card">
          <span class="metric-value small">${escapeHtml(String(value))}</span>
          <span class="metric-label">${escapeHtml(label)}</span>
        </article>
      `,
    )
    .join("");
  if (buildStatus) {
    buildStatus.innerHTML = ontologyBuildStatusHtml(ontology, models);
  }
  if (modelImportStatus) {
    modelImportStatus.innerHTML = modelImportStatusHtml(models, ontology);
  }
  $("#ontology-node-list").innerHTML = (ontology.nodes || [])
    .slice(0, 80)
    .map((node) => `<span>${escapeHtml(node.type)} · ${escapeHtml(node.label)}${node.count ? ` (${escapeHtml(String(node.count))})` : ""}</span>`)
    .join("");
  if (tierFocus) {
    tierFocus.innerHTML = ontologyTierFocusHtml();
  }
  if (queryPresets) {
    queryPresets.innerHTML = ontologyQueryPresetsHtml();
  }
  if (selectedNeighborhood) {
    const selectedUnit = currentSelectedMapUnit();
    selectedNeighborhood.innerHTML = selectedUnit
      ? selectedUnitOntologyNeighborhoodHtml(selectedUnit, { compact: false })
      : "<h3>Selected-unit ontology neighborhood</h3><p>Select a county or town on the map to show its aggregate ontology neighborhood.</p>";
  }
  if (packageBridge) {
    packageBridge.innerHTML = packageOntologyBridgeHtml();
  }
  $("#model-list").innerHTML = models
    ? models.models
        .map(
          (model) => `
            <span>
              ${escapeHtml(model.display_name)}
              <em>${escapeHtml(model.output_field)} · ${escapeHtml(model.status)}</em>
            </span>
          `,
        )
        .join("")
    : "<span>Model registry loading</span>";
}

function modelImportStatusHtml(models, ontology) {
  if (!models) {
    return `
      <section class="model-import-status" aria-label="Model import status cards">
        <div class="model-import-heading">
          <div>
            <p class="eyebrow">Model import status</p>
            <h3>Released LOCUS model-output registry loading.</h3>
          </div>
        </div>
      </section>
    `;
  }
  const rows = models.models || [];
  const scoreRows = rows.filter((model) => SCORE_FIELDS.includes(model.output_field) || String(model.task || "").includes("score"));
  const classifierRows = rows.filter((model) => !scoreRows.includes(model));
  const releasedRows = rows.filter((model) => model.status === "released_column");
  const verifiedScoreRows = scoreRows.filter((model) => model.direction_verified === true);
  const policy = models.import_policy || {};
  const grok = models.grok || {};
  const mapLayers = state.analysis.mapLayers || {};
  const latest = latestIso([models.generated_at, ontology?.generated_at, mapLayers.generated_at]);
  const cards = [
    ["Registry artifact", `${formatCount(rows.length)} output fields`, `${models.schema_version || "schema unknown"} · generated ${formatDateTime(models.generated_at)}`],
    ["Released columns", formatCount(releasedRows.length), `${formatCount(classifierRows.length)} classifiers · ${formatCount(scoreRows.length)} continuous score fields`],
    ["HF model imports", titleCase(policy.hf_model_downloads || "not recorded"), "Executable model downloads are deferred until model cards are reviewed."],
    ["Score direction", scoreRows.length === verifiedScoreRows.length && scoreRows.length ? "verified" : "unverified", "Display as neutral relative model scores until authoritative direction is verified."],
    ["Browser model calls", "none", "Pages reads static aggregate artifacts only; no model endpoint is called from the browser."],
  ];
  return `
    <section class="model-import-status" aria-label="Model import status cards">
      <div class="model-import-heading">
        <div>
          <p class="eyebrow">Model import status</p>
          <h3>Released model outputs, not browser inference.</h3>
          <p>EvoLOCUS currently imports LOCUS-v1 released model-output columns into aggregate artifacts. It has not imported executable Hugging Face model weights into the public site.</p>
        </div>
        <span>${escapeHtml(latest ? `${formatDateTime(latest)} · ${artifactAgeLabel(latest)}` : "artifact timestamps loading")}</span>
      </div>
      <div class="model-import-flow" aria-label="Model import flow">
        <span>LOCUS-v1 released columns</span>
        <b aria-hidden="true">&rarr;</b>
        <span>Local Polars aggregate artifacts</span>
        <b aria-hidden="true">&rarr;</b>
        <span>Pages map, charts, inquiry, and ontology</span>
      </div>
      <div class="model-import-grid">
        ${cards.map(([label, value, detail]) => modelImportCardHtml(label, value, detail)).join("")}
      </div>
      <div class="model-output-grid" aria-label="Released model output fields">
        ${rows.map(modelOutputCardHtml).join("")}
      </div>
      <p class="model-import-boundary">Model cards are pending verification; score direction remains unverified. The public site treats labels and scores as model-produced review signals, not legal facts, rankings, legal authority, or source-backed findings. Grok is ${escapeHtml(grok.allowed_use || "offline only")} and forbidden for ${escapeHtml(grok.forbidden_use || "browser key delivery")}.</p>
      <div class="model-import-actions">
        <button type="button" data-model-status-action="score">Open Score Lens</button>
        <button type="button" data-model-status-action="status">Open Analysis Status</button>
        <button type="button" data-model-status-action="ask">Ask about model outputs</button>
      </div>
    </section>
  `;
}

function modelImportCardHtml(label, value, detail) {
  return `
    <article class="model-import-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <em>${escapeHtml(String(detail))}</em>
    </article>
  `;
}

function modelOutputCardHtml(model) {
  const scoreField = SCORE_FIELDS.includes(model.output_field);
  const direction = scoreField ? (model.direction_verified ? "direction verified" : "direction unverified") : "label output";
  return `
    <article class="model-output-card ${scoreField ? "score" : "label"}">
      <span>${escapeHtml(scoreField ? "score field" : "classifier field")}</span>
      <strong>${escapeHtml(model.output_field || model.id || "unknown")}</strong>
      <em>${escapeHtml(model.display_name || model.id || "Unnamed output")}</em>
      <small>${escapeHtml(model.task || "task not recorded")} · ${escapeHtml(model.status || "status unknown")} · ${escapeHtml(direction)}</small>
    </article>
  `;
}

function applyModelStatusAction(action) {
  if (action === "score") {
    state.activeTab = "score";
    render();
    return;
  }
  if (action === "status") {
    state.activeTab = "status";
    render();
    return;
  }
  if (action === "ask") {
    const question = "What model outputs are imported into the current EvoLOCUS public site?";
    const input = $("#inquiry-form input[name='question']");
    if (input) {
      input.value = question;
    }
    answerAndLogInquiry(question, "model import status card");
    state.activeTab = "inquiry";
    render();
  }
}

function ontologyBuildStatusHtml(ontology, models) {
  const status = state.analysis.status || {};
  const mapLayers = state.analysis.mapLayers || {};
  const snapshot = state.analysis.artifactSnapshot || null;
  const nodeCounts = countValues((ontology.nodes || []).map((node) => node.type || "unknown"));
  const edgeCounts = countValues((ontology.edges || []).map((edge) => edge.relationship || "unknown"));
  const unitNodes = nodeCounts.jurisdiction_unit || nodeCounts.unit || nodeCounts.jurisdiction || 0;
  const latest = latestIso([ontology.generated_at, models?.generated_at, mapLayers?.generated_at, status.generated_at]);
  const snapshotAt = snapshot?.artifact_generated_at?.ontology || "";
  const snapshotDelta = artifactTimestampDeltaLabel(ontology.generated_at, snapshotAt);
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  const artifacts = [
    ["ontology.json", ontology.generated_at, `${formatCount((ontology.nodes || []).length)} nodes · ${formatCount((ontology.edges || []).length)} edges`],
    ["models.json", models?.generated_at, `${formatCount((models?.models || []).length)} released output fields`],
    ["map_layers.json", mapLayers.generated_at, `${formatCount((mapLayers.units || []).length)} aggregate map units`],
    ["artifact_snapshot.json", snapshot?.created_at, snapshot ? `${snapshot.snapshot_label || "stored baseline"}` : "baseline unavailable"],
  ];
  const relationshipRows = Object.entries(edgeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  return `
    <section class="ontology-build-status" aria-label="Aggregate ontology build status">
      <div class="ontology-build-heading">
        <div>
          <p class="eyebrow">Ontology build status</p>
          <h3>Graph freshness and artifact provenance.</h3>
          <p>The public ontology is generated from aggregate LOCUS model outputs and map-unit summaries. It is a review navigation layer, not a legal ontology of controlling authority.</p>
        </div>
        <span>${escapeHtml(latest ? `${formatDateTime(latest)} · ${artifactAgeLabel(latest)}` : "artifact timestamps loading")}</span>
      </div>
      <div class="ontology-build-flow" aria-label="Ontology build flow">
        <span>Local Polars aggregate layer</span>
        <b aria-hidden="true">&rarr;</b>
        <span>ontology.json + models.json</span>
        <b aria-hidden="true">&rarr;</b>
        <span>Browser graph and drilldowns</span>
      </div>
      <div class="ontology-build-grid">
        ${ontologyBuildCardHtml("Graph size", `${formatCount((ontology.nodes || []).length)} nodes`, `${formatCount((ontology.edges || []).length)} aggregate links · ${formatCount(unitNodes)} unit nodes`)}
        ${ontologyBuildCardHtml("Node mix", `${formatCount(nodeCounts.topic || 0)} topics · ${formatCount(nodeCounts.function || 0)} functions`, `${formatCount(nodeCounts.tier || 0)} neutral tiers · ${formatCount(nodeCounts.score_dimension || nodeCounts.score || nodeCounts.model || 0)} model/score nodes`)}
        ${ontologyBuildCardHtml("Model registry", `${formatCount((models?.models || []).length)} output fields`, models?.schema_version || "models artifact loading")}
        ${ontologyBuildCardHtml("Snapshot delta", snapshotDelta, snapshotAt ? `baseline ${formatDateTime(snapshotAt)}` : "stored ontology baseline unavailable")}
      </div>
      ${
        showUnit
          ? `<div class="ontology-artifact-strip">
              ${artifacts
                .map(
                  ([name, generatedAt, detail]) => `
                    <span>
                      <strong>${escapeHtml(name)}</strong>
                      <em>${escapeHtml(generatedAt ? formatDateTime(generatedAt) : "not loaded")} · ${escapeHtml(detail)}</em>
                    </span>
                  `,
                )
                .join("")}
            </div>
            <div class="ontology-relationship-strip">
              ${relationshipRows
                .map(
                  ([relationship, count]) => `
                    <span>
                      <strong>${escapeHtml(relationship.replaceAll("_", " "))}</strong>
                      <em>${escapeHtml(formatCount(count))} links</em>
                    </span>
                  `,
                )
                .join("")}
            </div>`
          : `<p class="ontology-build-more">Switch to Unit detail to inspect artifact timestamps and relationship counts.</p>`
      }
      ${
        showEvidence
          ? `<div class="ontology-build-boundary-grid">
              <span><strong>Dataset revision</strong><em>${escapeHtml(status.dataset_revision || mapLayers.dataset_revision || "unknown")}</em></span>
              <span><strong>Schema</strong><em>${escapeHtml(ontology.schema_version || "unknown")} · ${escapeHtml(ontology.ontology_version || "ontology version not recorded")}</em></span>
              <span><strong>Publication guard</strong><em>No ordinance text, headers, source locators, databases, exports, local paths, or secrets.</em></span>
              <span><strong>Limitations</strong><em>${escapeHtml((ontology.limitations || ["Aggregate relationships are review context only."]).join(" "))}</em></span>
            </div>`
          : ""
      }
      <div class="ontology-build-actions">
        <button type="button" data-ontology-action="open-map">Open Law Map</button>
        <button type="button" data-ontology-action="open-status">Open Analysis Status</button>
      </div>
    </section>
  `;
}

function ontologyBuildCardHtml(label, value, detail) {
  return `
    <article class="ontology-build-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <em>${escapeHtml(detail)}</em>
    </article>
  `;
}

function countValues(values) {
  return values.reduce((acc, value) => {
    const key = value || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function ontologyQueryPresetsHtml() {
  const presets = ontologyQueryPresetCards();
  return `
    <section class="ontology-query-presets" aria-label="Map-driven ontology query presets">
      <div class="ontology-query-heading">
        <div>
          <p class="eyebrow">Map-driven queries</p>
          <h3>Ask from the current aggregate map state.</h3>
          <p>Preset questions use current filters, selected unit, and visible ontology context. They route to the Inquiry tab and never expose ordinance text or source locator values.</p>
        </div>
        <span>${escapeHtml(formatCount(presets.length))} presets</span>
      </div>
      <div class="ontology-query-grid">
        ${presets.length ? presets.map(ontologyQueryPresetCardHtml).join("") : '<p class="muted-note">Map artifacts are not loaded yet.</p>'}
      </div>
      ${ontologyMapPresetHtml()}
      <p class="ontology-query-boundary">Queries are deterministic browser actions over public aggregate artifacts. Results are review context, not legal findings or rankings.</p>
    </section>
  `;
}

function ontologyQueryPresetCards() {
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    return [];
  }
  const units = filterMapUnits(mapLayers.units || []);
  const summary = summarizeUnits(units);
  const selectedUnit = currentSelectedMapUnit();
  const topTier = topEntry(summary.tierCounts);
  const tierKey = topTier.value ? tierKeyForLabel(topTier.label, mapLayers.tier_definitions || {}) : "";
  const scoreField = state.mapFilters.scoreField || topScoreField(summary.scoreMeans);
  const auditSummary = inquiryAuditSummary(units);
  const filters = activeFilterLabels().join(" · ") || "No active filters";
  const cards = [
    {
      key: "current-map",
      group: "Map",
      title: "Current ontology slice",
      question: "What does the current filtered map view show?",
      detail: `${formatCount(units.length)} units · ${formatCount(summary.lawCount)} rows · ${filters}`,
      disclosure: state.disclosureLevel,
    },
    {
      key: "topic",
      group: "Topic",
      title: summary.topTopic.value ? `${summary.topTopic.label} laws` : "Topic not available",
      question: `What does the current filtered map view show for ${summary.topTopic.label} laws?`,
      detail: `${formatCount(summary.topTopic.value)} aggregate rows`,
      filters: summary.topTopic.value ? { topic: summary.topTopic.label } : {},
      disclosure: "unit",
      disabled: !summary.topTopic.value,
    },
    {
      key: "function",
      group: "Function",
      title: summary.topFunction.value ? `${summary.topFunction.label} function` : "Function not available",
      question: `What does the current filtered map view show for ${summary.topFunction.label} functions?`,
      detail: `${formatCount(summary.topFunction.value)} aggregate rows`,
      filters: summary.topFunction.value ? { function: summary.topFunction.label } : {},
      disclosure: "unit",
      disabled: !summary.topFunction.value,
    },
    {
      key: "tier",
      group: "Tier",
      title: topTier.value ? topTier.label : "Tier not available",
      question: `What does the current filtered map view show for ${topTier.label} units?`,
      detail: `${formatCount(topTier.value)} visible units`,
      filters: tierKey ? { tier: tierKey } : {},
      tierFocus: tierKey,
      disclosure: "unit",
      disabled: !topTier.value,
    },
    {
      key: "audit",
      group: "Audit",
      title: "Review signal focus",
      question: "What audit review signals are visible in the current filtered map view?",
      detail: `${formatCount(auditSummary.reviewRows)} OCR-review rows · ${formatCount(auditSummary.duplicateRows)} duplicate hash rows`,
      disclosure: "evidence",
    },
    {
      key: "score",
      group: "Score",
      title: scoreField ? scoreFieldLabel(scoreField) : "Neutral score profile",
      question: "What model score patterns are visible in the current filtered map view?",
      detail: scoreField ? `${scoreBandLabel(state.mapFilters.scoreBand || "high")} available as map filter` : scoreSnapshot(summary.scoreMeans),
      filters: scoreField ? { scoreField, scoreBand: state.mapFilters.scoreBand || "high" } : {},
      disclosure: "unit",
      disabled: !scoreField,
    },
  ];
  if (selectedUnit) {
    cards.unshift({
      key: "selected",
      group: "Selected",
      title: displayUnitName(selectedUnit),
      question: `What does the selected unit ${displayUnitName(selectedUnit)} show?`,
      detail: `${selectedUnit.state} · ${selectedUnit.tier_label} · ${formatCount(selectedUnit.law_count)} rows`,
      unitId: selectedUnit.unit_id,
      disclosure: "unit",
      geographyLayers: { ontology: true },
    });
  }
  return cards;
}

function ontologyQueryPresetCardHtml(card) {
  return `
    <article class="ontology-query-card${card.disabled ? " disabled" : ""}">
      <span>${escapeHtml(card.group)}</span>
      <strong>${escapeHtml(card.title)}</strong>
      <p>${escapeHtml(card.detail)}</p>
      <button type="button" data-ontology-query-preset="${escapeHtml(card.key)}"${card.disabled ? " disabled" : ""}>Ask preset</button>
    </article>
  `;
}

function ontologyMapPresetHtml() {
  const presets = ontologyMapPresetCards();
  return `
    <section class="ontology-map-presets" aria-label="Ontology-to-map visual presets">
      <div class="ontology-map-preset-heading">
        <div>
          <p class="eyebrow">Ontology-to-map visuals</p>
          <h4>Color counties and towns from ontology cues.</h4>
          <p>Each card previews a deterministic aggregate map route, including color mode, filters, and matching unit counts.</p>
        </div>
        <span>${escapeHtml(formatCount(presets.length))} map routes</span>
      </div>
      <div class="ontology-map-preset-grid">
        ${presets.length ? presets.map(ontologyMapPresetCardHtml).join("") : '<p class="muted-note">Aggregate map layers are not loaded yet.</p>'}
      </div>
      <p class="ontology-map-preset-boundary">Map presets use public aggregate counts and model labels only. They do not expose ordinance text, source locators, live model calls, or legal conclusions.</p>
    </section>
  `;
}

function ontologyMapPresetCards() {
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    return [];
  }
  const mapUnits = mapLayers.units || [];
  const currentUnits = filterMapUnits(mapUnits);
  const summary = summarizeUnits(currentUnits);
  const topTier = topEntry(summary.tierCounts);
  const tierKey = topTier.value ? tierKeyForLabel(topTier.label, mapLayers.tier_definitions || {}) : "";
  const scoreField = state.mapFilters.scoreField || topScoreField(summary.scoreMeans);
  const baseLayers = { counties: true, municipalities: true, ontology: true };
  const rows = [
    {
      key: "tier-colored-map",
      group: "Tier map",
      title: "County/town neutral tier colors",
      question: "Where are the current aggregate laws on the county and town map by neutral tier?",
      detail: "Keeps current filters and colors geography by neutral tier.",
      colorMode: "tier",
      filters: {},
      geographyLayers: baseLayers,
      disclosure: "unit",
    },
    {
      key: "topic-colored-map",
      group: "Topic map",
      title: summary.topTopic.value ? `${summary.topTopic.label} geography` : "Topic geography unavailable",
      question: `Where do ${summary.topTopic.label} laws appear on the county and town map?`,
      detail: "Filters to the current top topic and colors geography by topic.",
      colorMode: "topic",
      filters: summary.topTopic.value ? { topic: summary.topTopic.label } : {},
      geographyLayers: baseLayers,
      disclosure: "unit",
      disabled: !summary.topTopic.value,
    },
    {
      key: "function-colored-map",
      group: "Function map",
      title: summary.topFunction.value ? `${summary.topFunction.label} geography` : "Function geography unavailable",
      question: `Where do ${summary.topFunction.label} law functions appear on the county and town map?`,
      detail: "Filters to the current top function and colors geography by function.",
      colorMode: "function",
      filters: summary.topFunction.value ? { function: summary.topFunction.label } : {},
      geographyLayers: baseLayers,
      disclosure: "unit",
      disabled: !summary.topFunction.value,
    },
    {
      key: "audit-attention-map",
      group: "Audit map",
      title: "Audit-attention geography",
      question: "Where are aggregate OCR and duplicate-text review signals concentrated on the map?",
      detail: "Focuses audit attention signals and colors geography by audit score.",
      colorMode: "audit_attention",
      filters: { auditFocus: "attention", minAuditScore: Math.max(5, Number(state.mapFilters.minAuditScore || 0)) },
      geographyLayers: baseLayers,
      disclosure: "evidence",
    },
    {
      key: "law-count-map",
      group: "Density map",
      title: "Law-count intensity geography",
      question: "Where are the largest aggregate law-count units on the county and town map?",
      detail: "Raises the minimum law-count filter and colors geography by row-count intensity.",
      colorMode: "law_count",
      filters: { minLaws: Math.max(10000, Number(state.mapFilters.minLaws || 0)) },
      geographyLayers: baseLayers,
      disclosure: "unit",
    },
  ];
  if (tierKey) {
    rows.splice(1, 0, {
      key: "top-tier-map",
      group: "Tier focus",
      title: `${topTier.label} counties/towns`,
      question: `Where do ${topTier.label} aggregate units appear on the county and town map?`,
      detail: "Filters to the dominant visible neutral tier and opens the tier ontology focus.",
      colorMode: "tier",
      filters: { tier: tierKey },
      geographyLayers: baseLayers,
      disclosure: "unit",
      tierFocus: tierKey,
    });
  }
  if (scoreField) {
    rows.push({
      key: "score-band-map",
      group: "Score band",
      title: `${scoreFieldLabel(scoreField)} band`,
      question: `Where do high relative ${scoreFieldLabel(scoreField)} score-band units appear on the county and town map?`,
      detail: "Filters to a neutral high relative model-score band while keeping tier colors visible.",
      colorMode: "tier",
      filters: { scoreField, scoreBand: state.mapFilters.scoreBand || "high" },
      geographyLayers: baseLayers,
      disclosure: "unit",
    });
  }
  return rows.map((row) => ontologyMapPresetWithPreview(row, mapUnits));
}

function ontologyMapPresetWithPreview(row, mapUnits) {
  const proposedFilters = normalizedLogMapFilters({ ...state.mapFilters, ...(row.filters || {}) });
  const previewUnits = filterMapUnitsWithFilters(mapUnits, proposedFilters);
  const previewSummary = summarizeUnits(previewUnits);
  return {
    ...row,
    proposedFilters,
    previewUnits,
    previewSummary,
    disabled: row.disabled || !previewUnits.length,
  };
}

function ontologyMapPresetCardHtml(card) {
  const colorLabel = geographyColorLabel(card.colorMode || "tier");
  const filterLabels = mapComposerFilterLabels(card.proposedFilters).slice(0, 4);
  return `
    <article class="ontology-map-preset-card${card.disabled ? " disabled" : ""}">
      <span>${escapeHtml(card.group)}</span>
      <strong>${escapeHtml(card.title)}</strong>
      <p>${escapeHtml(card.detail)}</p>
      <div class="ontology-map-preset-metrics">
        <em>${escapeHtml(colorLabel)} colors</em>
        <em>${escapeHtml(formatCount(card.previewUnits.length))} units</em>
        <em>${escapeHtml(formatCount(card.previewSummary.lawCount))} rows</em>
      </div>
      <div class="ontology-map-preset-filters" aria-label="Preset aggregate filters">
        ${filterLabels.length ? filterLabels.map((label) => `<i>${escapeHtml(label)}</i>`).join("") : "<i>Current map filters</i>"}
      </div>
      <div class="ontology-map-preset-actions">
        <button type="button" data-ontology-map-preset="${escapeHtml(card.key)}" data-ontology-map-preset-action="map"${card.disabled ? " disabled" : ""}>Open colored map</button>
        <button type="button" data-ontology-map-preset="${escapeHtml(card.key)}" data-ontology-map-preset-action="ask-map"${card.disabled ? " disabled" : ""}>Ask + map</button>
      </div>
    </article>
  `;
}

function topScoreField(scoreMeans) {
  const rows = Object.entries(scoreMeans || {})
    .map(([field, value]) => ({ field, value: Number(value) }))
    .filter((row) => Number.isFinite(row.value))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value) || a.field.localeCompare(b.field));
  return rows[0]?.field || "";
}

function applyOntologyQueryPreset(key) {
  const preset = ontologyQueryPresetCards().find((card) => card.key === key);
  if (!preset || preset.disabled) {
    return;
  }
  state.mapFilters = {
    ...state.mapFilters,
    ...(preset.filters || {}),
  };
  state.geographyLayers = {
    ...defaultGeographyLayers(),
    ...state.geographyLayers,
    ...(preset.geographyLayers || {}),
  };
  if (preset.unitId) {
    state.selectedUnitId = preset.unitId;
  }
  if (preset.tierFocus) {
    state.ontologyFocusTier = preset.tierFocus;
  }
  if (["overview", "unit", "evidence"].includes(preset.disclosure)) {
    state.disclosureLevel = preset.disclosure;
  }
  const input = $("#inquiry-form input[name='question']");
  if (input) {
    input.value = preset.question;
  }
  answerAndLogInquiry(preset.question, `ontology preset: ${preset.title || preset.key}`);
  state.activeTab = "inquiry";
  render();
}

function applyOntologyMapPreset(key, action = "map") {
  const preset = ontologyMapPresetCards().find((card) => card.key === key);
  if (!preset || preset.disabled) {
    return;
  }
  state.mapFilters = preset.proposedFilters;
  state.geographyColorMode = preset.colorMode || state.geographyColorMode;
  state.geographyLayers = {
    ...defaultGeographyLayers(),
    ...state.geographyLayers,
    ...(preset.geographyLayers || {}),
  };
  state.selectedUnitId = preset.previewSummary.topUnit?.unit_id || null;
  if (preset.tierFocus) {
    state.ontologyFocusTier = preset.tierFocus;
  }
  if (["overview", "unit", "evidence"].includes(preset.disclosure)) {
    state.disclosureLevel = preset.disclosure;
  }
  const input = $("#inquiry-form input[name='question']");
  if (input) {
    input.value = preset.question;
  }
  if (action === "ask-map") {
    answerAndLogInquiry(preset.question, `ontology map preset: ${preset.title || preset.key}`);
  }
  state.activeTab = "map";
  render();
}

function ontologyTierFocusHtml() {
  const tierKey = state.ontologyFocusTier;
  if (!tierKey) {
    return `
      <section class="ontology-tier-focus empty" aria-label="Tier ontology focus">
        <div class="ontology-tier-focus-heading">
          <div>
            <p class="eyebrow">Tier focus</p>
            <h3>Open a tier from the map guide.</h3>
            <p>Click a neutral tier chip in the law-location guide to see how that color band connects to topics, functions, score summaries, and visible county/town units.</p>
          </div>
          <button type="button" data-ontology-action="open-map">Open map</button>
        </div>
      </section>
    `;
  }
  const mapUnits = state.analysis.mapLayers?.units || [];
  const visibleUnits = filterMapUnits(mapUnits).filter((unit) => unit.tier === tierKey || unit.tier_label === tierKey);
  const definition = tierDefinitionForKey(tierKey);
  const summary = summarizeUnits(visibleUnits);
  const topUnits = visibleUnits
    .slice()
    .sort((a, b) => Number(b.law_count || 0) - Number(a.law_count || 0))
    .slice(0, state.disclosureLevel === "overview" ? 6 : 10);
  const filters = activeFilterLabels().join(" · ") || "No active map filters";
  const questionRoute = normalizedQuestionOntologyRoute(state.inquiryMapHighlight?.ontology_route);
  return `
    <section class="ontology-tier-focus" aria-label="Focused tier ontology context">
      <div class="ontology-tier-focus-heading">
        <div>
          <p class="eyebrow">Tier focus</p>
          <h3><i style="background:${escapeHtml(definition.color || "#d8dee8")}"></i>${escapeHtml(definition.label || tierKey)}</h3>
          <p>This neutral color band is shown from the current map filters. It is a review grouping over aggregate model outputs, not a legal ranking.</p>
        </div>
        <button type="button" data-ontology-action="open-map">Back to map</button>
      </div>
      <div class="ontology-tier-focus-metrics">
        <span><strong>${escapeHtml(formatCount(visibleUnits.length))}</strong><em>visible units</em></span>
        <span><strong>${escapeHtml(formatCount(summary.lawCount))}</strong><em>aggregate law rows</em></span>
        <span><strong>${escapeHtml(summary.topTopic.label)}</strong><em>top topic · ${escapeHtml(formatCount(summary.topTopic.value))} rows</em></span>
        <span><strong>${escapeHtml(summary.topFunction.label)}</strong><em>top function · ${escapeHtml(formatCount(summary.topFunction.value))} rows</em></span>
        <span><strong>${escapeHtml(scoreSnapshot(summary.scoreMeans))}</strong><em>neutral score means</em></span>
      </div>
      ${questionOntologyRouteHtml(questionRoute, "ontology")}
      <div class="ontology-tier-focus-links">
        <article>
          <span>Topic links</span>
          <strong>${escapeHtml(compactCounts(summary.topicCounts))}</strong>
        </article>
        <article>
          <span>Function links</span>
          <strong>${escapeHtml(compactCounts(summary.functionCounts))}</strong>
        </article>
        <article>
          <span>Filter context</span>
          <strong>${escapeHtml(filters)}</strong>
        </article>
      </div>
      ${ontologyTierNeighborhoodHtml(tierKey, definition, summary, visibleUnits)}
      ${ontologyTierMiniChartsHtml(summary)}
      <div class="ontology-tier-focus-units">
        <h4>Visible county/town units in this tier</h4>
        <div>
          ${
            topUnits.length
              ? topUnits.map((unit) => ontologyTierUnitButton(unit)).join("")
              : "<p class=\"muted-note\">No units in this tier match the current filters.</p>"
          }
        </div>
      </div>
      <p class="muted-note">This card reads map_layers.json aggregates and current browser filters only. It does not publish ordinance text, source locators, review events, or legal conclusions.</p>
    </section>
  `;
}

function ontologyTierMiniChartsHtml(summary) {
  const rowLimit = state.disclosureLevel === "overview" ? 4 : 6;
  return `
    <div class="ontology-tier-mini-charts" aria-label="Tier-focus aggregate mini charts">
      ${ontologyTierBarChartHtml("Topic mix", topCountEntries(summary.topicCounts, rowLimit), "aggregate law rows", "topic")}
      ${ontologyTierBarChartHtml("Function mix", topCountEntries(summary.functionCounts, rowLimit), "aggregate law rows", "function")}
      ${ontologyTierBarChartHtml("Unit type mix", topCountEntries(summary.kindCounts, rowLimit), "visible units", "kind", titleCase)}
      ${ontologyTierScoreChartHtml(summary.scoreMeans)}
    </div>
  `;
}

function ontologyTierNeighborhoodHtml(tierKey, definition, summary, visibleUnits) {
  const rowLimit = state.disclosureLevel === "overview" ? 3 : 5;
  const topicNodes = topCountEntries(summary.topicCounts, rowLimit).map((row) => ontologyTierNeighborhoodNode("topic", row.label, row.value, summary.lawCount, "topic law rows"));
  const functionNodes = topCountEntries(summary.functionCounts, rowLimit).map((row) => ontologyTierNeighborhoodNode("function", row.label, row.value, summary.lawCount, "function law rows"));
  const kindNodes = topCountEntries(summary.kindCounts, Math.min(3, rowLimit)).map((row) => ontologyTierNeighborhoodNode("kind", row.label, row.value, visibleUnits.length, "visible units", titleCase(row.label)));
  const scoreNodes = ontologyTierScoreNeighborhoodNodes(summary.scoreMeans);
  const centerLabel = definition.label || tierKey || "Neutral tier";
  const centerDetail = `${formatCount(visibleUnits.length)} units · ${formatCount(summary.lawCount)} rows`;
  return `
    <section class="ontology-tier-neighborhood" aria-label="Tier ontology neighborhood graph">
      <div class="ontology-tier-neighborhood-heading">
        <div>
          <span>Tier neighborhood graph</span>
          <strong><i style="background:${escapeHtml(definition.color || "#d8dee8")}"></i>${escapeHtml(centerLabel)}</strong>
          <em>${escapeHtml(centerDetail)}</em>
        </div>
        <button type="button" data-tier-neighborhood-map>Highlight tier on map</button>
      </div>
      <div class="ontology-tier-neighborhood-grid">
        ${ontologyTierNeighborhoodLaneHtml("Topic nodes", "released model topic labels", topicNodes)}
        ${ontologyTierNeighborhoodCenterHtml(centerLabel, centerDetail)}
        ${ontologyTierNeighborhoodLaneHtml("Function nodes", "released model function labels", functionNodes)}
        ${ontologyTierNeighborhoodLaneHtml("Unit type nodes", "city/county aggregate units", kindNodes)}
        ${ontologyTierNeighborhoodLaneHtml("Model-score nodes", "neutral relative means; direction unverified", scoreNodes)}
      </div>
      <p class="ontology-tier-neighborhood-boundary">Neighborhood nodes are aggregate visual routes from map_layers.json only. They are not a legal ontology, ranking, source-backed claim, or row-level evidence trail.</p>
    </section>
  `;
}

function ontologyTierNeighborhoodNode(type, value, amount, denominator, detail, label = value) {
  return {
    type,
    value,
    label,
    amount: Number(amount || 0),
    detail,
    share: formatPercent(amount, denominator),
  };
}

function ontologyTierScoreNeighborhoodNodes(scoreMeans) {
  return SCORE_FIELDS.map((field) => {
    const value = Number(scoreMeans?.[field]);
    return {
      type: "score",
      value: field,
      label: scoreFieldLabel(field),
      amount: Number.isFinite(value) ? Math.abs(value) : 0,
      rawValue: Number.isFinite(value) ? formatScore(value) : "n/a",
      detail: "neutral mean",
      share: "relative score",
    };
  });
}

function ontologyTierNeighborhoodCenterHtml(label, detail) {
  return `
    <article class="ontology-tier-neighborhood-center">
      <span>Tier node</span>
      <strong>${escapeHtml(label)}</strong>
      <em>${escapeHtml(detail)}</em>
      <p>Click a surrounding node to carry this tier context back to the county/town map.</p>
    </article>
  `;
}

function ontologyTierNeighborhoodLaneHtml(title, detail, nodes) {
  return `
    <article class="ontology-tier-neighborhood-lane">
      <div>
        <span>${escapeHtml(title)}</span>
        <em>${escapeHtml(detail)}</em>
      </div>
      <div class="ontology-tier-neighborhood-nodes">
        ${
          nodes.length
            ? nodes.map(ontologyTierNeighborhoodNodeHtml).join("")
            : '<p class="muted-note">No aggregate nodes available for this lane under current filters.</p>'
        }
      </div>
    </article>
  `;
}

function ontologyTierNeighborhoodNodeHtml(node) {
  const isScore = node.type === "score";
  const width = isScore
    ? Math.max(4, Math.min(100, Number(node.amount || 0) * 100))
    : Math.max(4, Math.min(100, Number.parseFloat(node.share) || 0));
  const attrs = isScore
    ? `data-tier-neighborhood-score="${escapeHtml(node.value)}"`
    : `data-tier-neighborhood-filter="${escapeHtml(node.type)}" data-tier-neighborhood-value="${escapeHtml(node.value)}"`;
  return `
    <button type="button" class="ontology-tier-neighborhood-node ${escapeHtml(node.type)}" ${attrs}>
      <strong>${escapeHtml(node.label)}</strong>
      <i><u style="width:${width.toFixed(2)}%"></u></i>
      <span>${escapeHtml(isScore ? node.rawValue : formatCount(node.amount))}</span>
      <em>${escapeHtml(node.share)} · ${escapeHtml(node.detail)}</em>
    </button>
  `;
}

function applyTierNeighborhoodFilter(filterType, value) {
  if (filterType === "score") {
    applyTierScoreFilter(value, "high");
    return;
  }
  applyTierMiniFilter(filterType, value);
}

function ontologyTierBarChartHtml(title, rows, detail, filterType = "", labeler = (value) => value) {
  const maxValue = Math.max(1, ...rows.map((row) => Number(row.value || 0)));
  return `
    <article class="ontology-tier-mini-chart">
      <div>
        <span>${escapeHtml(title)}</span>
        <em>${escapeHtml(detail)}</em>
      </div>
      <div class="ontology-tier-mini-bars">
        ${
          rows.length
            ? rows.map((row) => ontologyTierBarRowHtml(row, maxValue, labeler, filterType)).join("")
            : '<p class="muted-note">No aggregate counts for this tier under current filters.</p>'
        }
      </div>
    </article>
  `;
}

function ontologyTierBarRowHtml(row, maxValue, labeler, filterType = "") {
  const width = Math.max(4, (Number(row.value || 0) / Math.max(1, Number(maxValue || 1))) * 100);
  const tagName = filterType ? "button" : "span";
  const actionAttrs = filterType
    ? ` type="button" data-tier-mini-filter="${escapeHtml(filterType)}" data-tier-mini-value="${escapeHtml(row.label)}" aria-label="Filter map to ${escapeHtml(labeler(row.label))} within this tier"`
    : "";
  return `
    <${tagName}${actionAttrs} class="ontology-tier-mini-bar">
      <strong>${escapeHtml(labeler(row.label))}</strong>
      <i><u style="width:${width.toFixed(2)}%"></u></i>
      <em>${escapeHtml(formatCount(row.value))}</em>
    </${tagName}>
  `;
}

function applyTierMiniFilter(filterType, value) {
  const tierKey = state.ontologyFocusTier;
  state.mapFilters = {
    ...state.mapFilters,
    tier: tierKey || state.mapFilters.tier,
  };
  if (filterType === "topic") {
    state.mapFilters.topic = value;
  }
  if (filterType === "function") {
    state.mapFilters.function = value;
  }
  if (filterType === "kind") {
    state.mapFilters.kind = normalizePackageKind(value);
  }
  state.selectedUnitId = null;
  state.disclosureLevel = "unit";
  state.activeTab = "map";
  render();
}

function highlightOntologyTierOnMap() {
  const tierKey = state.ontologyFocusTier;
  if (!tierKey) {
    state.activeTab = "map";
    render();
    return;
  }
  state.mapFilters = {
    ...state.mapFilters,
    tier: tierKey,
  };
  const units = filterMapUnits(state.analysis.mapLayers?.units || []);
  const definition = tierDefinitionForKey(tierKey);
  const question = `Show ${definition.label || tierKey} aggregate units on the map`;
  state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(question, "ontology tier neighborhood", units);
  state.selectedUnitId = units[0]?.unit_id || null;
  state.activeTab = "map";
  render();
}

function applyTierScoreFilter(field, band = "high") {
  if (!SCORE_FIELDS.includes(field)) {
    return;
  }
  const scoreBand = ["low", "middle", "high"].includes(band) ? band : "high";
  const tierKey = state.ontologyFocusTier;
  state.mapFilters = {
    ...state.mapFilters,
    tier: tierKey || state.mapFilters.tier,
    scoreField: field,
    scoreBand,
  };
  state.selectedUnitId = null;
  state.disclosureLevel = "unit";
  state.activeTab = "map";
  render();
}

function ontologyTierScoreChartHtml(scoreMeans) {
  const rows = SCORE_FIELDS
    .map((field) => ({ field, value: Number(scoreMeans?.[field]) }))
    .filter((row) => Number.isFinite(row.value));
  const maxValue = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
  return `
    <article class="ontology-tier-mini-chart score">
      <div>
        <span>Neutral score means</span>
        <em>direction unverified</em>
      </div>
      <div class="ontology-tier-mini-bars">
        ${
          rows.length
            ? rows.map((row) => ontologyTierScoreRowHtml(row, maxValue)).join("")
            : '<p class="muted-note">No score means for this tier under current filters.</p>'
        }
      </div>
    </article>
  `;
}

function ontologyTierScoreRowHtml(row, maxValue) {
  const width = Math.max(4, (Math.abs(Number(row.value || 0)) / Math.max(1, Number(maxValue || 1))) * 100);
  const label = scoreFieldLabel(row.field);
  return `
    <button type="button" class="ontology-tier-mini-bar score" data-tier-score-filter="${escapeHtml(row.field)}" data-tier-score-band="high" aria-label="Filter map to high relative ${escapeHtml(label)} band within this tier">
      <strong>${escapeHtml(label)}</strong>
      <i><u style="width:${width.toFixed(2)}%"></u></i>
      <em>${escapeHtml(formatScore(row.value))}</em>
    </button>
  `;
}

function ontologyTierUnitButton(unit) {
  return `
    <button type="button" data-tier-ontology-unit="${escapeHtml(unit.unit_id)}">
      <strong>${escapeHtml(displayUnitName(unit))}</strong>
      <em>${escapeHtml(unit.state || "NA")} · ${escapeHtml(formatCount(unit.law_count))} rows · ${escapeHtml(text(unit.dominant_topic))}</em>
    </button>
  `;
}

function packageOntologyBridgeHtml() {
  const mapUnits = state.analysis.mapLayers?.units || [];
  const summary = packageCoverageSummary();
  const packageStats = importedPackageMapStats(mapUnits);
  if (!summary.imported) {
    return `
      <section class="package-ontology-bridge empty" aria-label="Package ontology bridge">
        <div class="package-ontology-heading">
          <div>
            <p class="eyebrow">Package ontology bridge</p>
            <h3>No browser-local package is loaded.</h3>
            <p>Load a synthetic package or import a bounded local package to see how its topic, function, tier, and map-unit counts connect to the ontology.</p>
          </div>
          <button type="button" data-ontology-action="demo-package">Load Demo Package</button>
        </div>
        <div class="package-ontology-facts">
          <span><strong>Public ontology</strong>loaded from aggregate artifacts</span>
          <span><strong>Package records</strong>not loaded</span>
          <span><strong>LOCUS text</strong>not published</span>
        </div>
      </section>
    `;
  }
  const matchedHits = [...packageStats.units.values()].sort(
    (a, b) => b.recordCount - a.recordCount || displayUnitName(a.unit).localeCompare(displayUnitName(b.unit)),
  );
  const tierCounts = packageTierCounts(matchedHits);
  const title = summary.syntheticPackage ? "Synthetic package ontology bridge" : "Imported package ontology bridge";
  const textState = summary.syntheticPackage ? "synthetic placeholders only" : summary.textIncluded ? "local LOCUS text present" : "metadata only";
  return `
    <section class="package-ontology-bridge" aria-label="Package ontology bridge">
      <div class="package-ontology-heading">
        <div>
          <p class="eyebrow">Package ontology bridge</p>
          <h3>${escapeHtml(title)}</h3>
          <p>Package records stay in browser localStorage. This bridge summarizes ontology context from counts and aggregate map matches only.</p>
        </div>
        <span>${escapeHtml(formatCount(summary.recordCount))} records · ${escapeHtml(formatCount(packageStats.units.size))} matched units</span>
      </div>
      <div class="package-ontology-lane">
        ${packageOntologyNodeCard("Package", summary.syntheticPackage ? "Demo package" : "Local package", `${formatCount(summary.recordCount)} records · ${formatCount(summary.unitCount)} units`, "localStorage")}
        ${packageOntologyNodeCard("Topic", topCountEntries(summary.topicCounts, 3), "Record labels", "package counts")}
        ${packageOntologyNodeCard("Function", topCountEntries(summary.functionCounts, 3), "Record labels", "package counts")}
        ${packageOntologyNodeCard("Tier", topCountEntries(tierCounts, 3), "Matched map units", "aggregate units")}
      </div>
      <div class="package-ontology-units">
        <h4>Matched aggregate units</h4>
        <div>
          ${matchedHits
            .slice(0, state.disclosureLevel === "overview" ? 6 : 10)
            .map((hit) => packageOntologyUnitButton(hit))
            .join("")}
        </div>
      </div>
      <div class="package-ontology-facts">
        <span><strong>Text state</strong>${escapeHtml(textState)}</span>
        <span><strong>Source locators</strong>${escapeHtml(summary.sourceLocatorsIncluded ? "present locally, not listed" : "not loaded")}</span>
        <span><strong>Evidence boundary</strong>no text, headers, locator values, or review-event details are rendered here</span>
      </div>
    </section>
  `;
}

function packageOntologyNodeCard(label, value, detail, source) {
  const body = Array.isArray(value)
    ? value.length
      ? `<div class="package-ontology-bars">${value.map((row) => packageOntologyBar(row, value[0]?.value || 1)).join("")}</div>`
      : `<p>No package counts available.</p>`
    : `<strong>${escapeHtml(String(value))}</strong>`;
  return `
    <article class="package-ontology-node-card">
      <span>${escapeHtml(label)}</span>
      ${body}
      <em>${escapeHtml(detail)} · ${escapeHtml(source)}</em>
    </article>
  `;
}

function packageOntologyBar(row, maxValue) {
  const width = maxValue ? Math.max(4, (Number(row.value || 0) / Number(maxValue)) * 100) : 0;
  return `
    <span>
      <b>${escapeHtml(row.label)}</b>
      <i><u style="width:${width.toFixed(2)}%"></u></i>
      <em>${escapeHtml(formatCount(row.value))}</em>
    </span>
  `;
}

function packageOntologyUnitButton(hit) {
  const unit = hit.unit || {};
  return `
    <button type="button" data-package-ontology-unit="${escapeHtml(hit.unitId)}">
      <strong>${escapeHtml(displayUnitName(unit || hit.unitId))}</strong>
      <em>${escapeHtml(unit.state || "NA")} · ${escapeHtml(text(unit.dominant_topic))} · ${escapeHtml(formatCount(hit.recordCount))} package records</em>
    </button>
  `;
}

function packageTierCounts(hits) {
  return hits.reduce((counts, hit) => {
    const label = hit.unit?.tier_label || hit.unit?.tier || "Unknown tier";
    counts[label] = (counts[label] || 0) + Number(hit.recordCount || 0);
    return counts;
  }, {});
}

function selectedUnitOntologyNeighborhoodHtml(unit, { compact = false } = {}) {
  const geometry = geometryMatchForUnit(unit.unit_id);
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  const neighborFilter = selectedOntologyNeighborFilter();
  const nodes = selectedUnitOntologyNodes(unit, geometry, showUnit, showEvidence, neighborFilter);
  const peers = selectedUnitFilteredPeers(unit, neighborFilter);
  return `
    <section class="ontology-neighborhood${compact ? " compact" : ""}" aria-label="Selected unit ontology neighborhood">
      <div class="ontology-neighborhood-heading">
        <div>
          <p class="eyebrow">Selected ontology</p>
          <h3>${escapeHtml(displayUnitName(unit))}</h3>
        </div>
        <span>${escapeHtml(formatCount(unit.law_count))} law records</span>
      </div>
      ${selectedUnitOntologyNeighborFilterControlsHtml(neighborFilter)}
      <svg class="ontology-neighborhood-svg" viewBox="0 0 640 300" role="img" aria-label="Aggregate ontology neighborhood for selected unit">
        ${nodes
          .filter((node) => node.id !== "unit")
          .map((node) => `<line x1="320" y1="150" x2="${node.x}" y2="${node.y}" class="ontology-edge"></line>`)
          .join("")}
        ${nodes.map(ontologyNodeSvg).join("")}
      </svg>
      ${selectedUnitOntologyPathHtml(unit, geometry, showUnit, showEvidence)}
      <div class="ontology-neighborhood-facts">
        <span><strong>Topic</strong>${escapeHtml(text(unit.dominant_topic))}</span>
        <span><strong>Function</strong>${escapeHtml(text(unit.dominant_function))}</span>
        <span><strong>Tier</strong>${escapeHtml(text(unit.tier_label))}</span>
        ${
          showUnit
            ? `<span><strong>Score means</strong>${escapeHtml(scoreSnapshot(unit.model_score_means || {}))}</span>`
            : ""
        }
        ${
          showEvidence
            ? `<span><strong>Geometry</strong>${escapeHtml(geometry.matchStatus)} via ${escapeHtml(geometry.source)}</span>`
            : ""
        }
      </div>
      ${selectedUnitNeighborPeerStripHtml(unit, peers, neighborFilter, showUnit, showEvidence)}
      <p class="muted-note">Neighborhood edges summarize released LOCUS aggregate fields and machine-match artifacts. They are not verified legal relationships.</p>
    </section>
  `;
}

function selectedOntologyNeighborFilters() {
  return [
    ["all", "All", "topic, function, tier"],
    ["topic", "Topic lens", "same model topic"],
    ["function", "Function lens", "same model function"],
    ["tier", "Tier lens", "same neutral tier"],
    ["geography", "Geography lens", "state and unit type"],
    ["scores", "Scores lens", "relative model means"],
  ];
}

function selectedOntologyNeighborFilter() {
  const allowed = new Set(selectedOntologyNeighborFilters().map(([key]) => key));
  return allowed.has(state.selectedOntologyNeighborFilter) ? state.selectedOntologyNeighborFilter : "all";
}

function selectedUnitOntologyNeighborFilterControlsHtml(activeFilter) {
  return `
    <div class="selected-neighbor-filter-controls" aria-label="Map-side ontology neighborhood filters">
      <div>
        <p class="eyebrow">Map-side ontology neighborhood filters</p>
        <span>Aggregate lenses only. No ordinance text, source locators, or legal conclusions are shown.</span>
      </div>
      <div class="selected-neighbor-filter-buttons">
        ${selectedOntologyNeighborFilters()
          .map(([key, label, detail]) => {
            const active = key === activeFilter;
            return `
              <button class="selected-neighbor-filter-button${active ? " active" : ""}" type="button" data-selected-neighbor-filter="${escapeHtml(key)}" aria-pressed="${active ? "true" : "false"}">
                <strong>${escapeHtml(label)}</strong>
                <span>${escapeHtml(detail)}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function selectedUnitOntologyPathHtml(unit, geometry, showUnit, showEvidence) {
  const steps = [
    {
      key: "unit",
      label: "Map unit",
      value: `${displayUnitName(unit)} (${text(unit.state)})`,
      detail: `${formatCount(unit.law_count)} aggregate law rows`,
    },
    {
      key: "topic",
      label: "Topic",
      value: text(unit.dominant_topic),
      detail: "released model label",
    },
    {
      key: "function",
      label: "Function",
      value: text(unit.dominant_function),
      detail: "released model label",
    },
    {
      key: "tier",
      label: "Neutral tier",
      value: text(unit.tier_label),
      detail: "map color grouping",
    },
  ];
  if (showUnit) {
    steps.push({
      key: "scores",
      label: "Scores",
      value: scoreSnapshot(unit.model_score_means || {}),
      detail: "neutral means; direction unverified",
    });
  }
  if (showEvidence) {
    steps.push({
      key: "geometry",
      label: "Geometry",
      value: geometry.matchStatus,
      detail: `${geometry.source}; pending review`,
    });
  }
  const activeKey = state.ontologyPathStage === "auto" ? "" : state.ontologyPathStage;
  return `
    <div class="ontology-path-controls" aria-label="Map-to-ontology animation controls">
      ${ontologyPathControlStages().map((stage) => ontologyPathControlStageHtml(stage, activeKey, showUnit, showEvidence)).join("")}
    </div>
    <div class="ontology-path-strip${activeKey ? " controlled" : ""}" aria-label="Animated aggregate ontology path">
      ${steps.map((step, index) => ontologyPathStepHtml(step, index, steps.length, activeKey)).join("")}
    </div>
    <p class="ontology-path-boundary">Controls focus aggregate map-to-ontology stages only; they do not reveal ordinance text, source locators, legal conclusions, or live model calls.</p>
  `;
}

function ontologyPathControlStages() {
  return [
    ["auto", "Auto", "loop"],
    ["unit", "Map", "unit"],
    ["topic", "Topic", "label"],
    ["function", "Function", "label"],
    ["tier", "Tier", "band"],
    ["scores", "Scores", "unit detail"],
    ["geometry", "Geometry", "evidence"],
  ];
}

function ontologyPathControlStageHtml([stage, label, detail], activeKey, showUnit, showEvidence) {
  const active = stage === "auto" ? !activeKey : activeKey === stage;
  const locked = (stage === "scores" && !showUnit) || (stage === "geometry" && !showEvidence);
  return `
    <button class="ontology-path-control${active ? " active" : ""}${locked ? " gated" : ""}" type="button" data-ontology-path-stage="${escapeHtml(stage)}" aria-pressed="${active ? "true" : "false"}">
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(detail)}</span>
    </button>
  `;
}

function ontologyPathStepHtml(step, index, total, activeKey = "") {
  const progress = total > 1 ? (index / (total - 1)) * 100 : 0;
  const delay = `${(index * 0.18).toFixed(2)}s`;
  const active = activeKey && step.key === activeKey ? " active" : "";
  return `
    <article class="ontology-path-step${active}" style="--path-progress:${progress}%; --path-delay:${delay}">
      <span>${escapeHtml(step.label)}</span>
      <strong>${escapeHtml(step.value)}</strong>
      <em>${escapeHtml(step.detail)}</em>
    </article>
  `;
}

function applyOntologyPathStage(stage) {
  const allowed = new Set(["auto", "unit", "topic", "function", "tier", "scores", "geometry"]);
  state.ontologyPathStage = allowed.has(stage) ? stage : "auto";
  if (state.ontologyPathStage === "scores" && state.disclosureLevel === "overview") {
    state.disclosureLevel = "unit";
  }
  if (state.ontologyPathStage === "geometry") {
    state.disclosureLevel = "evidence";
  }
  render();
}

function applySelectedNeighborFilter(filter) {
  const allowed = new Set(selectedOntologyNeighborFilters().map(([key]) => key));
  state.selectedOntologyNeighborFilter = allowed.has(filter) ? filter : "all";
  if (state.selectedOntologyNeighborFilter === "scores" && state.disclosureLevel === "overview") {
    state.disclosureLevel = "unit";
  }
  render();
}

function selectedUnitOntologyNodes(unit, geometry, showUnit, showEvidence, neighborFilter = selectedOntologyNeighborFilter()) {
  const unitNode = {
    id: "unit",
    label: displayUnitName(unit),
    sublabel: `${text(unit.state)} · ${text(unit.kind)}`,
    x: 320,
    y: 150,
    r: 54,
    fill: unit.tier_color || "#d8dee8",
    className: "unit-node",
  };
  const nodeById = {
    unit: unitNode,
    topic: {
      id: "topic",
      label: text(unit.dominant_topic),
      sublabel: "dominant topic",
      x: 138,
      y: 72,
      r: 42,
      fill: TOPIC_COLORS[unit.dominant_topic] || TOPIC_COLORS.Unknown,
    },
    function: {
      id: "function",
      label: text(unit.dominant_function),
      sublabel: "dominant function",
      x: 502,
      y: 72,
      r: 42,
      fill: FUNCTION_COLORS[unit.dominant_function] || FUNCTION_COLORS.Unknown,
    },
    tier: {
      id: "tier",
      label: text(unit.tier_label),
      sublabel: "neutral tier",
      x: 138,
      y: 228,
      r: 42,
      fill: unit.tier_color || "#d8dee8",
    },
    scores: {
      id: "scores",
      label: "Scores",
      sublabel: showUnit ? "neutral means" : "unit detail gated",
      x: 502,
      y: 228,
      r: 42,
      fill: "#8d6aa8",
      className: showUnit ? "" : "gated-node",
    },
    state: {
      id: "state",
      label: text(unit.state),
      sublabel: "state field",
      x: 138,
      y: 112,
      r: 40,
      fill: "#326f70",
    },
    kind: {
      id: "kind",
      label: text(unit.kind),
      sublabel: "unit type",
      x: 502,
      y: 112,
      r: 40,
      fill: "#4f6f91",
    },
    geometry: {
      id: "geometry",
      label: "Geometry",
      sublabel: showEvidence ? geometry.source : "evidence gated",
      x: 320,
      y: 250,
      r: 38,
      fill: "#b7892c",
      className: showEvidence ? "" : "gated-node",
    },
  };
  const layouts = {
    all: ["unit", "topic", "function", "tier", ...(showUnit ? ["scores"] : []), ...(showEvidence ? ["geometry"] : [])],
    topic: ["unit", "topic"],
    function: ["unit", "function"],
    tier: ["unit", "tier"],
    geography: ["unit", "state", "kind", "geometry"],
    scores: ["unit", "scores"],
  };
  const ids = layouts[neighborFilter] || layouts.all;
  return ids.map((id) => nodeById[id]).filter(Boolean);
}

function ontologyNodeSvg(node) {
  const words = String(node.label || "Unknown").split(/\s+/).slice(0, 3);
  const labelLines = words.length ? words : ["Unknown"];
  return `
    <g class="ontology-node ${escapeHtml(node.className || "")}" transform="translate(${node.x} ${node.y})">
      <circle r="${node.r}" fill="${escapeHtml(node.fill)}"></circle>
      ${labelLines
        .map((line, index) => `<text y="${(index - (labelLines.length - 1) / 2) * 14 - 2}" class="node-label">${escapeHtml(line)}</text>`)
        .join("")}
      <text y="${node.r - 12}" class="node-sublabel">${escapeHtml(node.sublabel || "")}</text>
    </g>
  `;
}

function selectedUnitNeighborPeerStripHtml(unit, peers, neighborFilter, showUnit, showEvidence) {
  const filterMeta = selectedOntologyNeighborFilters().find(([key]) => key === neighborFilter) || selectedOntologyNeighborFilters()[0];
  const lensName = filterMeta[1];
  if (!peers.length) {
    return `
      <div class="selected-neighbor-peer-strip" aria-label="Filtered aggregate ontology peers">
        <div class="selected-neighbor-peer-heading">
          <strong>${escapeHtml(lensName)} peers</strong>
          <span>0 aggregate units</span>
        </div>
        <p class="muted-note">No aggregate peer units match this lens in the published map layer. No ordinance text or source locators are shown.</p>
      </div>
    `;
  }
  const maxScore = Math.max(1, ...peers.map((peer) => peer.score));
  return `
    <div class="selected-neighbor-peer-strip" aria-label="Filtered aggregate ontology peers">
      <div class="selected-neighbor-peer-heading">
        <strong>${escapeHtml(lensName)} peers</strong>
        <span>${escapeHtml(formatCount(peers.length))} aggregate units</span>
      </div>
      ${peers.map((peer) => selectedNeighborPeerRowHtml(peer, unit, neighborFilter, maxScore, showUnit, showEvidence)).join("")}
      <p class="muted-note">Peer links move the map to another aggregate unit. They do not publish ordinance text, source locators, rankings, or legal conclusions.</p>
    </div>
  `;
}

function selectedNeighborPeerRowHtml(peer, selectedUnit, neighborFilter, maxScore, showUnit, showEvidence) {
  const unit = peer.unit;
  const width = Math.max(6, (Number(peer.score || 0) / maxScore) * 100).toFixed(2);
  const reason = selectedNeighborPeerLensReason(peer, selectedUnit, neighborFilter);
  return `
    <button class="selected-neighbor-peer-row" type="button" data-map-compare-unit="${escapeHtml(unit.unit_id)}" style="--neighbor-peer-width:${width}%">
      <span>
        <strong>${escapeHtml(displayUnitName(unit))}</strong>
        <em>${escapeHtml(text(unit.state))} · ${escapeHtml(text(unit.kind))} · ${escapeHtml(text(unit.tier_label))}</em>
      </span>
      <i aria-hidden="true"></i>
      <small>${escapeHtml(reason)}</small>
      ${
        showUnit
          ? `<b>${escapeHtml(text(unit.dominant_topic))} / ${escapeHtml(text(unit.dominant_function))}</b>`
          : ""
      }
      ${
        showEvidence
          ? `<u>aggregate peer score ${escapeHtml(peer.score.toFixed(1))}; source map_layers.json</u>`
          : ""
      }
    </button>
  `;
}

function selectedNeighborPeerLensReason(peer, selectedUnit, neighborFilter) {
  if (neighborFilter === "topic") {
    return peer.unit.dominant_topic === selectedUnit.dominant_topic ? "same model topic" : "nearest aggregate topic peer";
  }
  if (neighborFilter === "function") {
    return peer.unit.dominant_function === selectedUnit.dominant_function ? "same model function" : "nearest aggregate function peer";
  }
  if (neighborFilter === "tier") {
    return peer.unit.tier === selectedUnit.tier ? "same neutral tier" : "nearest neutral-tier peer";
  }
  if (neighborFilter === "geography") {
    const parts = [];
    if (peer.unit.state === selectedUnit.state) {
      parts.push("same state");
    }
    if (peer.unit.kind === selectedUnit.kind) {
      parts.push("same unit type");
    }
    return parts.length ? parts.join(" + ") : "nearest geography peer";
  }
  if (neighborFilter === "scores") {
    return showScorePeerReason(selectedUnit, peer.unit);
  }
  return peer.reasons.slice(0, 3).join(" + ") || "aggregate similarity";
}

function showScorePeerReason(selectedUnit, peerUnit) {
  const selectedScores = selectedUnit.model_score_means || {};
  const peerScores = peerUnit.model_score_means || {};
  const shared = Object.keys(selectedScores).filter((field) => Number.isFinite(Number(selectedScores[field])) && Number.isFinite(Number(peerScores[field])));
  if (!shared.length) {
    return "score means unavailable";
  }
  const closest = shared
    .map((field) => [field, Math.abs(Number(peerScores[field]) - Number(selectedScores[field]))])
    .sort((a, b) => a[1] - b[1])[0];
  return `${closest[0]} delta ${closest[1].toFixed(3)}`;
}

function selectedUnitPeerComparisonHtml(unit) {
  return selectedUnitPeerComparisonDrawerHtml(unit);
}

function selectedUnitPeerComparisonDrawerHtml(unit) {
  const peers = selectedUnitPeers(unit);
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  if (!peers.length) {
    return `
      <section class="selected-peer-card selected-peer-comparison-drawer" aria-label="County/town peer comparison drawer">
        <div class="selected-peer-comparison-heading">
          <span>Compare selected unit to aggregate ontology peers</span>
          <h4>County/town peer comparison drawer</h4>
        </div>
        <p class="muted-note">No peer units are available in the current published aggregate layer.</p>
        <p class="selected-peer-comparison-boundary"><strong>Rows compare aggregate map units only.</strong> No ordinance text, source locators, browser model calls, rankings, or legal findings.</p>
      </section>
    `;
  }
  const maxLaws = Math.max(1, Number(unit.law_count || 0), ...peers.map((peer) => Number(peer.unit.law_count || 0)));
  const peerKinds = selectedPeerKindSummary(unit, peers);
  const sharedLens = selectedPeerLensSummary(peers);
  return `
    <section class="selected-peer-card selected-peer-comparison-drawer" aria-label="County/town peer comparison drawer">
      <div class="selected-peer-comparison-heading">
        <div>
          <span>Compare selected unit to aggregate ontology peers</span>
          <h4>County/town peer comparison drawer</h4>
        </div>
        <button type="button" data-selected-ontology-query="peer">Ask with peers</button>
      </div>
      <p>Peers are selected by shared aggregate fields and law-count proximity. This is a review aid, not a ranking.</p>
      <div class="selected-peer-comparison-metrics">
        ${selectedUnitPeerComparisonMetricHtml("Peer units", formatCount(peers.length), "published aggregate peers")}
        ${selectedUnitPeerComparisonMetricHtml("County/town mix", peerKinds, "from current public map layer")}
        ${selectedUnitPeerComparisonMetricHtml("Shared lens", sharedLens, "state, kind, topic, function, tier, or count")}
      </div>
      <p class="selected-peer-comparison-boundary"><strong>Rows compare aggregate map units only.</strong> No ordinance text, source locators, browser model calls, rankings, or legal findings.</p>
      <div class="selected-peer-comparison-list" role="list">
        ${selectedUnitPeerComparisonRows(unit, peers, maxLaws, showUnit, showEvidence)}
      </div>
      ${!showUnit ? `<p class="muted-note">Switch to Unit detail for neutral score deltas and topic/function mix.</p>` : ""}
      ${
        showEvidence
          ? `<p class="muted-note">Peer method: same state, jurisdiction kind, topic, function, tier, and log-scaled law-count proximity over the published top-1,000 aggregate units in map_layers.json.</p>`
          : ""
      }
    </section>
  `;
}

function selectedUnitPeerComparisonMetricHtml(label, value, detail) {
  return `
    <span>
      <strong>${escapeHtml(String(value || "n/a"))}</strong>
      <em>${escapeHtml(label)}</em>
      <small>${escapeHtml(detail)}</small>
    </span>
  `;
}

function selectedUnitPeerComparisonRows(unit, peers, maxLaws, showUnit, showEvidence) {
  const selectedPeer = { unit, score: null, lawDelta: 0, reasons: ["selected aggregate unit"] };
  return [
    selectedUnitPeerComparisonRowHtml(selectedPeer, unit, maxLaws, showUnit, showEvidence, true),
    ...peers.map((peer) => selectedUnitPeerComparisonRowHtml(peer, unit, maxLaws, showUnit, showEvidence, false)),
  ].join("");
}

function selectedUnitPeerComparisonRowHtml(peer, selectedUnit, maxLaws, showUnit, showEvidence, selected = false) {
  const unit = peer.unit;
  const width = peerLawWidth(unit, maxLaws);
  const name = displayUnitName(unit);
  const button = selected
    ? `<button type="button" data-unit-id="${escapeHtml(unit.unit_id)}">${escapeHtml(name)}</button>`
    : `<button type="button" data-map-compare-unit="${escapeHtml(unit.unit_id)}">${escapeHtml(name)}</button>`;
  const scoreLabel = selected ? "Selected unit" : `Peer score ${peer.score.toFixed(1)}`;
  const reasonTags = (selected ? ["selected map unit"] : peer.reasons).map((reason) => `<em>${escapeHtml(reason)}</em>`).join("");
  return `
    <article class="selected-peer-comparison-row${selected ? " selected" : ""}" role="listitem" style="--peer-row-width:${width}%">
      <div class="selected-peer-comparison-main">
        ${button}
        <span>${escapeHtml(text(unit.state))} · ${escapeHtml(text(unit.kind))} · ${escapeHtml(text(unit.tier_label))}</span>
      </div>
      <div class="selected-peer-comparison-bar" aria-hidden="true"><i></i></div>
      <strong>${escapeHtml(formatCount(unit.law_count))}</strong>
      <small>${escapeHtml(scoreLabel)}</small>
      <div class="selected-peer-comparison-tags">${reasonTags}</div>
      ${
        showUnit
          ? `<p>${escapeHtml(text(unit.dominant_topic))} / ${escapeHtml(text(unit.dominant_function))} · neutral score delta ${escapeHtml(selected ? "selected baseline" : scoreDeltaSummary(selectedUnit, unit))}</p>`
          : ""
      }
      ${
        showEvidence && !selected
          ? `<p class="muted-note">Law-count delta ${escapeHtml(formatCount(peer.lawDelta))}; source map_layers.json.</p>`
          : ""
      }
    </article>
  `;
}

function selectedPeerKindSummary(unit, peers) {
  const kinds = [unit, ...peers.map((peer) => peer.unit)]
    .map((peerUnit) => text(peerUnit.kind).toLowerCase())
    .filter(Boolean);
  const uniqueKinds = [...new Set(kinds)];
  if (!uniqueKinds.length) {
    return "aggregate units";
  }
  return uniqueKinds.map((kind) => (kind === "city" ? "town/city" : kind)).join(" + ");
}

function selectedPeerLensSummary(peers) {
  const counts = new Map();
  peers.forEach((peer) => {
    peer.reasons.forEach((reason) => counts.set(reason, (counts.get(reason) || 0) + 1));
  });
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 2);
  return top.length ? top.map(([reason]) => reason).join(" + ") : "aggregate similarity";
}

function selectedUnitPeers(unit) {
  const allUnits = state.analysis.mapLayers ? state.analysis.mapLayers.units || [] : [];
  return allUnits
    .filter((candidate) => candidate.unit_id !== unit.unit_id)
    .map((candidate) => peerComparison(unit, candidate))
    .filter((peer) => peer.score > 0)
    .sort((a, b) => b.score - a.score || a.lawDelta - b.lawDelta || displayUnitName(a.unit).localeCompare(displayUnitName(b.unit)))
    .slice(0, 6);
}

function selectedUnitFilteredPeers(unit, neighborFilter = selectedOntologyNeighborFilter()) {
  const peers = selectedUnitPeers(unit);
  if (neighborFilter === "all") {
    return peers.slice(0, 4);
  }
  const filters = {
    topic: (peer) => peer.unit.dominant_topic === unit.dominant_topic,
    function: (peer) => peer.unit.dominant_function === unit.dominant_function,
    tier: (peer) => peer.unit.tier === unit.tier,
    geography: (peer) => peer.unit.state === unit.state || peer.unit.kind === unit.kind,
    scores: (peer) => hasComparableScoreMeans(unit, peer.unit),
  };
  const filtered = peers.filter(filters[neighborFilter] || (() => true));
  return (filtered.length ? filtered : peers).slice(0, 4);
}

function hasComparableScoreMeans(unit, peerUnit) {
  const selectedScores = unit.model_score_means || {};
  const peerScores = peerUnit.model_score_means || {};
  return Object.keys(selectedScores).some((field) => Number.isFinite(Number(selectedScores[field])) && Number.isFinite(Number(peerScores[field])));
}

function peerComparison(unit, candidate) {
  const reasons = [];
  let score = 0;
  if (candidate.state === unit.state) {
    score += 18;
    reasons.push("same state");
  }
  if (candidate.kind === unit.kind) {
    score += 12;
    reasons.push(`same ${unit.kind || "kind"}`);
  }
  if (candidate.dominant_topic === unit.dominant_topic) {
    score += 16;
    reasons.push("same topic");
  }
  if (candidate.dominant_function === unit.dominant_function) {
    score += 10;
    reasons.push("same function");
  }
  if (candidate.tier === unit.tier) {
    score += 8;
    reasons.push("same tier");
  }
  const lawDelta = Math.abs(Number(candidate.law_count || 0) - Number(unit.law_count || 0));
  const selectedLog = Math.log10(Number(unit.law_count || 0) + 1);
  const candidateLog = Math.log10(Number(candidate.law_count || 0) + 1);
  const proximity = Math.max(0, 18 - Math.abs(selectedLog - candidateLog) * 10);
  if (proximity > 4) {
    score += proximity;
    reasons.push("similar count");
  }
  return { unit: candidate, score, lawDelta, reasons };
}

function peerRowHtml(peer, selectedUnit, maxLaws, showUnit, showEvidence) {
  return selectedUnitPeerComparisonRowHtml(peer, selectedUnit, maxLaws, showUnit, showEvidence, false);
}

function peerLawWidth(unit, maxLaws) {
  return Math.max(4, (Number(unit.law_count || 0) / Math.max(1, maxLaws)) * 100).toFixed(2);
}

function scoreDeltaSummary(selectedUnit, peerUnit) {
  const deltas = Object.keys({ ...(selectedUnit.model_score_means || {}), ...(peerUnit.model_score_means || {}) })
    .sort()
    .map((field) => {
      const selected = Number(selectedUnit.model_score_means?.[field]);
      const peer = Number(peerUnit.model_score_means?.[field]);
      if (!Number.isFinite(selected) || !Number.isFinite(peer)) {
        return `${field}: n/a`;
      }
      return `${field}: ${(peer - selected).toFixed(3)}`;
    });
  return deltas.length ? deltas.join(" · ") : "n/a";
}

function renderInquiry() {
  const chatIndex = state.analysis.chatIndex;
  const briefings = state.analysis.inquiryBriefings;
  const questionPack = state.analysis.questionPack;
  const selectedUnit = currentSelectedMapUnit();
  const selectedQuestions = selectedUnit ? [`What does the selected unit ${displayUnitName(selectedUnit)} show?`] : [];
  const suggested = [
    ...selectedQuestions,
    ...((questionPack && questionPack.suggested_questions) || []),
    ...((briefings && briefings.suggested_questions) || []),
    ...((chatIndex && chatIndex.suggested_questions) || []),
  ].slice(0, 8);
  const grok = briefings?.grok || {};
  const generatedAt = briefings?.generated_at ? new Date(briefings.generated_at).toLocaleString() : "not loaded";
  $("#inquiry-provenance").innerHTML = briefings
    ? `
      <span>${escapeHtml(briefings.synthetic ? "Synthetic briefing" : "Real aggregate briefing")}</span>
      <span>${escapeHtml(grok.used ? `Grok-enriched offline (${grok.model})` : "Deterministic static briefing")}</span>
      <span>Generated ${escapeHtml(generatedAt)}</span>
      <span>No live browser LLM calls</span>
    `
    : "<span>Inquiry briefings loading</span>";
  renderInquiryContext();
  renderInquiryMapComposer();
  renderInquiryPathways();
  renderInquiryMatrix();
  $("#suggested-questions").innerHTML = suggested
    .map((question) => `<button type="button" data-question="${escapeHtml(question)}">${escapeHtml(question)}</button>`)
    .join("");
  $("#inquiry-answer").innerHTML = state.inquiryAnswer
    ? inquiryAnswerHtml(state.inquiryAnswer)
    : "<p>Ask about status, tiers, topics, map units, model outputs, or Grok integration.</p>";
  renderInquiryRouteReplay();
  renderInquiryResultsLog();
}

function renderInquiryContext() {
  const grid = $("#inquiry-context-grid");
  if (!grid) {
    return;
  }
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    grid.innerHTML = `<article class="inquiry-context-card"><span>Analysis</span><strong>Loading</strong><em>Aggregate map artifact unavailable</em></article>`;
    return;
  }
  const units = filterMapUnits(mapLayers.units || []);
  const summary = summarizeUnits(units);
  const auditSummary = inquiryAuditSummary(units);
  const cards = [
    ["Visible units", formatCount(units.length), activeFilterLabels().join(" · ") || "No active map filters"],
    ["Visible law rows", formatCount(summary.lawCount), `${formatPercent(summary.lawCount, summarizeUnits(mapLayers.units || []).lawCount)} of published layer`],
    ["Top topic", summary.topTopic.label, `${formatCount(summary.topTopic.value)} aggregate rows`],
    ["Top function", summary.topFunction.label, `${formatCount(summary.topFunction.value)} aggregate rows`],
    ["Audit signals", formatCount(auditSummary.reviewRows), `${formatCount(auditSummary.duplicateRows)} duplicate text-hash rows`],
  ];
  grid.innerHTML = cards
    .map(
      ([label, value, detail]) => `
        <article class="inquiry-context-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <em>${escapeHtml(detail)}</em>
        </article>
      `,
    )
    .join("");
}

function renderInquiryMapComposer() {
  const target = $("#inquiry-map-composer");
  const summaryTarget = $("#inquiry-map-composer-summary");
  if (!target || !summaryTarget) {
    return;
  }
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    summaryTarget.textContent = "Loading map artifact";
    target.innerHTML = `<article class="inquiry-map-composer-empty"><strong>Map artifact loading.</strong><p>The composer will activate after aggregate map layers load.</p></article>`;
    return;
  }
  const inputQuestion = String($("#inquiry-form input[name='question']")?.value || "");
  const question = state.inquiryMapComposerQuestion || inputQuestion;
  const plan = inquiryMapComposerPlan(question);
  summaryTarget.textContent = question
    ? `${formatCount(plan.previewUnits.length)} units · ${formatCount(plan.previewSummary.lawCount)} rows`
    : "Type a question and preview filters";
  target.innerHTML = inquiryMapComposerHtml(plan);
}

function inquiryMapComposerHtml(plan) {
  const question = plan.question || "";
  const filterChips = plan.filterLabels.length
    ? plan.filterLabels.map((label) => `<span>${escapeHtml(label)}</span>`).join("")
    : "<span>No inferred filters yet</span>";
  const reasonRows = plan.reasons.length
    ? plan.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")
    : "<li>Preview uses the current aggregate map filters until the question includes a recognized topic, function, state, tier, score, audit, package, or unit-type cue.</li>";
  const ontologyRoute = normalizedQuestionOntologyRoute(plan.ontologyRoute);
  const topUnits = plan.previewUnits
    .slice(0, 3)
    .map(
      (unit) => `
        <button type="button" data-inquiry-map-composer-unit="${escapeHtml(unit.unit_id)}">
          <strong>${escapeHtml(displayUnitName(unit))}</strong>
          <em>${escapeHtml(unit.state || "NA")} · ${escapeHtml(text(unit.kind))} · ${escapeHtml(formatCount(unit.law_count))} rows</em>
        </button>
      `,
    )
    .join("");
  return `
    <article class="inquiry-map-composer-preview">
      <div class="inquiry-map-composer-heading">
        <div>
          <span>Deterministic filter preview</span>
          <strong>${escapeHtml(question || "No question previewed yet")}</strong>
        </div>
        <button type="button" data-inquiry-map-composer-action="preview">Preview typed question</button>
      </div>
      <div class="inquiry-map-composer-chips" aria-label="Inferred aggregate map filters">
        ${filterChips}
      </div>
      <div class="inquiry-map-composer-metrics">
        ${inquiryMapComposerMetricHtml("Matching units", formatCount(plan.previewUnits.length), `${formatCount(plan.currentUnits.length)} units before preview`)}
        ${inquiryMapComposerMetricHtml("Law rows", formatCount(plan.previewSummary.lawCount), "aggregate rows only")}
        ${inquiryMapComposerMetricHtml("Top topic", plan.previewSummary.topTopic.label, `${formatCount(plan.previewSummary.topTopic.value)} rows`)}
        ${inquiryMapComposerMetricHtml("Top unit", plan.previewSummary.topUnit ? displayUnitName(plan.previewSummary.topUnit) : "No matching unit", plan.previewSummary.topUnit ? `${plan.previewSummary.topUnit.state} · ${formatCount(plan.previewSummary.topUnit.law_count)} rows` : "Adjust question or filters")}
      </div>
      <div class="inquiry-map-composer-reasons">
        <strong>Why these filters?</strong>
        <ul>${reasonRows}</ul>
      </div>
      ${questionOntologyRouteHtml(ontologyRoute, "inquiry")}
      ${topUnits ? `<div class="inquiry-map-composer-units" aria-label="Top aggregate units for preview">${topUnits}</div>` : ""}
      <div class="inquiry-map-composer-actions">
        <button type="button" data-inquiry-map-composer-action="apply-map"${question ? "" : " disabled"}>Apply preview on map</button>
        <button type="button" data-inquiry-map-composer-action="ask"${question ? "" : " disabled"}>Ask with preview filters</button>
        <button type="button" data-inquiry-map-composer-action="ontology"${question ? "" : " disabled"}>Open ontology route</button>
      </div>
      <p class="inquiry-map-composer-boundary">Composer previews aggregate map filters and ontology nodes only. It does not call Grok, inspect ordinance text, expose source locators, or create legal findings.</p>
    </article>
  `;
}

function inquiryMapComposerMetricHtml(label, value, detail) {
  return `
    <span>
      <strong>${escapeHtml(label)}</strong>
      <b>${escapeHtml(value)}</b>
      <em>${escapeHtml(detail)}</em>
    </span>
  `;
}

function inquiryMapComposerPlan(question) {
  const mapUnits = state.analysis.mapLayers?.units || [];
  const normalizedQuestion = normalizeInquiryText(question);
  const filters = { ...state.mapFilters };
  const reasons = [];
  const inferred = {};
  const stateCode = inferQuestionState(normalizedQuestion, mapUnits);
  if (stateCode) {
    inferred.state = stateCode;
    reasons.push(`State cue -> ${stateCode}`);
  }
  const topic = inferQuestionOption(normalizedQuestion, [
    ["Zoning", ["zoning", "zone", "land use", "rezoning", "variance"]],
    ["Buildings", ["building", "buildings", "construction", "permit", "housing", "code enforcement"]],
    ["Business", ["business", "license", "licensing", "commercial", "vendor"]],
    ["Nuisance", ["nuisance", "noise", "trash", "weeds", "public nuisance"]],
    ["Other", ["other topic", "miscellaneous"]],
  ]);
  if (topic) {
    inferred.topic = topic;
    reasons.push(`Topic cue -> ${topic}`);
  }
  const functionLabel = inferQuestionOption(normalizedQuestion, [
    ["Enforcement", ["enforcement", "penalty", "penalties", "fine", "violation", "citation"]],
    ["Process", ["process", "procedure", "application", "appeal", "hearing", "permit process"]],
    ["Rules", ["rules", "requirements", "required", "shall", "must", "prohibit", "restriction"]],
    ["Context", ["context", "purpose", "definition", "definitions", "findings"]],
  ]);
  if (functionLabel) {
    inferred.function = functionLabel;
    reasons.push(`Function cue -> ${functionLabel}`);
  }
  const kind = inferQuestionOption(normalizedQuestion, [
    ["county", ["county", "counties"]],
    ["city", ["city", "cities", "town", "towns", "municipal", "municipality", "village", "borough"]],
  ]);
  if (kind) {
    inferred.kind = kind;
    reasons.push(`Unit-type cue -> ${titleCase(kind)}`);
  }
  const tier = inferQuestionTier(normalizedQuestion);
  if (tier) {
    inferred.tier = tier;
    reasons.push(`Neutral tier cue -> ${tierDefinitionForKey(tier).label || tier}`);
  }
  const scoreField = inferQuestionScoreField(normalizedQuestion);
  const scoreBand = inferQuestionScoreBand(normalizedQuestion);
  if (scoreField) {
    inferred.scoreField = scoreField;
    inferred.scoreBand = scoreBand || filters.scoreBand || "high";
    reasons.push(`Model-score cue -> ${scoreFieldLabel(scoreField)} ${scoreBandLabel(inferred.scoreBand)}`);
  }
  const auditFocus = inferQuestionAuditFocus(normalizedQuestion);
  if (auditFocus) {
    inferred.auditFocus = auditFocus;
    if (auditFocus === "attention" && !filters.minAuditScore) {
      inferred.minAuditScore = 5;
    }
    reasons.push(`Audit cue -> ${auditFocusLabel(auditFocus)}`);
  }
  if (/\b(package|imported|review package|local queue|overlay)\b/.test(normalizedQuestion)) {
    inferred.packageOnly = true;
    reasons.push("Package cue -> imported package units");
  }
  if (/\b(large|largest|many laws|high count|dense)\b/.test(normalizedQuestion)) {
    inferred.minLaws = Math.max(Number(filters.minLaws || 0), 10000);
    reasons.push("Scale cue -> at least 10,000 aggregate law rows");
  }
  const proposedFilters = normalizedLogMapFilters({ ...filters, ...inferred });
  const currentUnits = filterMapUnitsWithFilters(mapUnits, filters);
  const previewUnits = filterMapUnitsWithFilters(mapUnits, proposedFilters);
  const previewSummary = summarizeUnits(previewUnits);
  const ontologyRoute = questionOntologyRouteFromUnits(String(question || "").trim(), "question composer", previewUnits, proposedFilters, previewSummary);
  return {
    question: String(question || "").trim(),
    proposedFilters,
    currentUnits,
    previewUnits,
    previewSummary,
    ontologyRoute,
    filterLabels: mapComposerFilterLabels(proposedFilters),
    reasons,
  };
}

function normalizeInquiryText(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function inferQuestionOption(normalizedQuestion, rows) {
  for (const [value, keywords] of rows) {
    if (keywords.some((keyword) => normalizedQuestion.includes(keyword))) {
      return value;
    }
  }
  return "";
}

function inferQuestionState(normalizedQuestion, units) {
  const availableStates = new Set((units || []).map((unit) => unit.state).filter(Boolean));
  for (const [name, code] of Object.entries(STATE_NAME_TO_CODE)) {
    if (availableStates.has(code) && normalizedQuestion.includes(name)) {
      return code;
    }
  }
  const ambiguousWordCodes = new Set(["IN", "ME", "OR"]);
  const tokens = new Set(
    normalizedQuestion
      .toUpperCase()
      .split(/\s+/)
      .filter((token) => token.length === 2 && !ambiguousWordCodes.has(token)),
  );
  return [...availableStates].find((code) => tokens.has(code)) || "";
}

function inferQuestionTier(normalizedQuestion) {
  if (/\btier\s*1\b|\blow tier\b|\blower relative\b/.test(normalizedQuestion)) {
    return "tier_1";
  }
  if (/\btier\s*2\b|\bmiddle tier\b|\bmid tier\b/.test(normalizedQuestion)) {
    return "tier_2";
  }
  if (/\btier\s*3\b|\bhigh tier\b|\bhigher relative\b/.test(normalizedQuestion)) {
    return "tier_3";
  }
  return "";
}

function inferQuestionScoreField(normalizedQuestion) {
  if (/\benforcement discretion\b|\bdiscretion\b/.test(normalizedQuestion)) {
    return "enforcement_discretion";
  }
  if (/\bopacity\b|\bopaque\b/.test(normalizedQuestion)) {
    return "opacity";
  }
  if (/\bpaternalism\b|\bpaternalistic\b/.test(normalizedQuestion)) {
    return "paternalism";
  }
  if (/\bproblem salience\b|\bsalience\b/.test(normalizedQuestion)) {
    return "problem_salience";
  }
  return "";
}

function inferQuestionScoreBand(normalizedQuestion) {
  if (/\blow\b|\blower\b|\bbottom\b/.test(normalizedQuestion)) {
    return "low";
  }
  if (/\bmiddle\b|\bmid\b|\bmoderate\b/.test(normalizedQuestion)) {
    return "middle";
  }
  if (/\bhigh\b|\bhigher\b|\btop\b/.test(normalizedQuestion)) {
    return "high";
  }
  return "";
}

function inferQuestionAuditFocus(normalizedQuestion) {
  if (/\bocr\b|\bunreadable\b|\btext quality\b/.test(normalizedQuestion)) {
    return "ocr";
  }
  if (/\bduplicate\b|\bhash\b|\brepeated text\b/.test(normalizedQuestion)) {
    return "duplicate";
  }
  if (/\baudit\b|\breview priority\b|\battention\b/.test(normalizedQuestion)) {
    return "attention";
  }
  return "";
}

function mapComposerFilterLabels(filters) {
  const labels = [];
  if (filters.state) labels.push(`State ${filters.state}`);
  if (filters.topic) labels.push(`Topic ${filters.topic}`);
  if (filters.function) labels.push(`Function ${filters.function}`);
  if (filters.kind) labels.push(`Unit type ${titleCase(filters.kind)}`);
  if (filters.tier) labels.push(`Tier ${tierDefinitionForKey(filters.tier).label || filters.tier}`);
  if (filters.scoreField) labels.push(`${scoreFieldLabel(filters.scoreField)} · ${scoreBandLabel(filters.scoreBand || "high")}`);
  if (filters.auditFocus) labels.push(`Audit ${auditFocusLabel(filters.auditFocus)}`);
  if (filters.minLaws) labels.push(`Min ${formatCount(filters.minLaws)} rows`);
  if (filters.minAuditScore) labels.push(`Audit attention ${formatNumber(filters.minAuditScore)}+`);
  if (filters.packageOnly) labels.push("Imported package units");
  return labels;
}

function renderInquiryMatrix() {
  const matrix = $("#inquiry-question-matrix");
  const summary = $("#inquiry-matrix-summary");
  if (!matrix || !summary) {
    return;
  }
  const prompts = inquiryPromptCards();
  const pack = state.analysis.questionPack;
  summary.textContent = `${formatCount(prompts.length)} static prompts${pack?.grok?.used ? ` · Grok-pack ${pack.grok.model}` : ""}`;
  matrix.innerHTML = prompts
    .map(
      (prompt) => `
        <button type="button" data-inquiry-prompt="${escapeHtml(prompt.question)}"${prompt.unitId ? ` data-inquiry-unit="${escapeHtml(prompt.unitId)}"` : ""}${prompt.packId ? ` data-inquiry-pack="${escapeHtml(prompt.packId)}"` : ""}>
          <span>${escapeHtml(prompt.group)}</span>
          <strong>${escapeHtml(prompt.title)}</strong>
          <em>${escapeHtml(prompt.detail)}</em>
        </button>
      `,
    )
    .join("");
}

function renderInquiryPathways() {
  const grid = $("#inquiry-pathway-grid");
  const summaryTarget = $("#inquiry-pathway-summary");
  if (!grid || !summaryTarget) {
    return;
  }
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    summaryTarget.textContent = "Loading aggregate layer";
    grid.innerHTML = `<article class="inquiry-pathway-empty"><strong>Pathways loading.</strong><p>Aggregate map artifacts are not ready yet.</p></article>`;
    return;
  }
  const visibleUnits = filterMapUnits(mapLayers.units || []);
  const rows = inquiryPathwayRows(visibleUnits);
  const rowLimit = state.disclosureLevel === "evidence" ? 12 : state.disclosureLevel === "unit" ? 9 : 6;
  const maxLawCount = Math.max(1, ...rows.map((row) => Number(row.lawCount || 0)));
  const maxUnitCount = Math.max(1, ...rows.map((row) => Number(row.unitCount || 0)));
  summaryTarget.textContent = `${formatCount(rows.length)} cells · ${formatCount(visibleUnits.length)} visible units`;
  grid.innerHTML = rows.length
    ? rows.slice(0, rowLimit).map((row) => inquiryPathwayCardHtml(row, maxLawCount, maxUnitCount)).join("")
    : `<article class="inquiry-pathway-empty"><strong>No topic/tier cells match this view.</strong><p>Adjust map filters to restore aggregate pathways.</p></article>`;
}

function inquiryPathwayRows(units) {
  const tierDefinitions = state.analysis.mapLayers?.tier_definitions || {};
  const grouped = new Map();
  for (const unit of units) {
    const topic = unit.dominant_topic && unit.dominant_topic !== "Not available" ? String(unit.dominant_topic) : "";
    const tierKey = unit.tier || tierKeyForLabel(unit.tier_label, tierDefinitions) || "";
    const tierDefinition = tierDefinitionForKey(tierKey);
    const key = `${topic || "no-topic"}::${tierKey || unit.tier_label || "no-tier"}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        topic,
        topicLabel: topic || "No dominant topic",
        tierKey,
        tierLabel: tierDefinition.label || unit.tier_label || tierKey || "No neutral tier",
        tierColor: tierDefinition.color || unit.tier_color || "#d8dee8",
        unitCount: 0,
        lawCount: 0,
        states: new Set(),
        kinds: {},
        topUnits: [],
      });
    }
    const row = grouped.get(key);
    row.unitCount += 1;
    row.lawCount += Number(unit.law_count || 0);
    if (unit.state) {
      row.states.add(unit.state);
    }
    const kind = normalizePackageKind(unit.kind || "") || "unknown";
    row.kinds[kind] = (row.kinds[kind] || 0) + 1;
    row.topUnits.push(unit);
  }
  return [...grouped.values()]
    .map((row) => ({
      ...row,
      topUnits: row.topUnits.sort((a, b) => Number(b.law_count || 0) - Number(a.law_count || 0)).slice(0, 3),
      topKind: topEntry(row.kinds),
    }))
    .sort((a, b) => b.lawCount - a.lawCount || b.unitCount - a.unitCount || a.topicLabel.localeCompare(b.topicLabel));
}

function inquiryPathwayCardHtml(row, maxLawCount, maxUnitCount) {
  const stateList = [...row.states].sort().slice(0, 5);
  const moreStates = row.states.size > stateList.length ? ` +${row.states.size - stateList.length}` : "";
  const unitPreview = row.topUnits.map((unit) => displayUnitName(unit)).join(" · ") || "No units";
  const question = inquiryPathwayQuestion(row);
  return `
    <article class="inquiry-pathway-cell">
      <div class="inquiry-pathway-cell-heading">
        <span>${escapeHtml(row.topicLabel)}</span>
        <i style="background:${escapeHtml(row.tierColor)}"></i>
        <strong>${escapeHtml(row.tierLabel)}</strong>
      </div>
      <div class="inquiry-pathway-bars" aria-label="Aggregate law rows and visible unit count">
        <span><b style="width:${escapeHtml(inquiryPathwayWidth(row.lawCount, maxLawCount))}%"></b><em>${escapeHtml(formatCount(row.lawCount))} rows</em></span>
        <span><b style="width:${escapeHtml(inquiryPathwayWidth(row.unitCount, maxUnitCount))}%"></b><em>${escapeHtml(formatCount(row.unitCount))} units</em></span>
      </div>
      <p>${escapeHtml(stateList.join(", ") || "No state")} ${escapeHtml(moreStates)} · ${escapeHtml(row.topKind.label || "mixed")} source units</p>
      <em>${escapeHtml(unitPreview)}</em>
      ${inquiryPathwayPeerComparisonHtml(row)}
      ${inquiryPathwayOntologyChipsHtml(row)}
      <div class="inquiry-pathway-actions">
        <button type="button" data-inquiry-pathway-ask data-pathway-topic="${escapeHtml(row.topic)}" data-pathway-tier="${escapeHtml(row.tierKey)}" data-pathway-question="${escapeHtml(question)}">Ask this pathway</button>
        <button type="button" data-inquiry-pathway-map data-pathway-topic="${escapeHtml(row.topic)}" data-pathway-tier="${escapeHtml(row.tierKey)}">Open on map</button>
      </div>
    </article>
  `;
}

function inquiryPathwayPeerComparisonHtml(row) {
  const peers = row.topUnits.slice(0, 3);
  if (!peers.length) {
    return '<div class="inquiry-pathway-peers empty"><span>No peer units in this aggregate cell.</span></div>';
  }
  const maxLawCount = Math.max(1, ...peers.map((unit) => Number(unit.law_count || 0)));
  return `
    <div class="inquiry-pathway-peers" aria-label="Aggregate peer comparison for pathway">
      <span>Top aggregate units in this cell</span>
      ${peers.map((unit) => inquiryPathwayPeerRowHtml(unit, maxLawCount)).join("")}
    </div>
  `;
}

function inquiryPathwayPeerRowHtml(unit, maxLawCount) {
  const lawCount = Number(unit.law_count || 0);
  const width = Math.max(lawCount ? 5 : 0, (lawCount / maxLawCount) * 100).toFixed(2);
  return `
    <button type="button" class="inquiry-pathway-peer-row" data-inquiry-pathway-peer-unit="${escapeHtml(unit.unit_id)}">
      <strong>${escapeHtml(displayUnitName(unit))}</strong>
      <span><b style="width:${escapeHtml(width)}%"></b><em>${escapeHtml(formatCount(lawCount))} rows</em></span>
      <small>${escapeHtml(unit.state || "NA")} · ${escapeHtml(text(unit.kind))} · ${escapeHtml(text(unit.tier_label))}</small>
    </button>
  `;
}

function inquiryPathwayOntologyChipsHtml(row) {
  const topUnit = row.topUnits[0];
  return `
    <div class="inquiry-pathway-ontology-chips" aria-label="Aggregate ontology links for pathway">
      ${
        row.topic
          ? `<button type="button" data-inquiry-pathway-ontology="topic" data-pathway-topic="${escapeHtml(row.topic)}" data-pathway-tier="${escapeHtml(row.tierKey)}">Topic node: ${escapeHtml(row.topicLabel)}</button>`
          : '<span>No topic node</span>'
      }
      ${
        row.tierKey
          ? `<button type="button" data-inquiry-pathway-ontology="tier" data-pathway-topic="${escapeHtml(row.topic)}" data-pathway-tier="${escapeHtml(row.tierKey)}">Tier node: ${escapeHtml(row.tierLabel)}</button>`
          : '<span>No tier node</span>'
      }
      ${
        topUnit
          ? `<button type="button" data-inquiry-pathway-ontology="unit" data-pathway-unit="${escapeHtml(topUnit.unit_id)}">Map unit: ${escapeHtml(displayUnitName(topUnit))}</button>`
          : '<span>No map unit</span>'
      }
    </div>
  `;
}

function inquiryPathwayWidth(value, max) {
  return Math.max(value ? 5 : 0, (Number(value || 0) / max) * 100).toFixed(2);
}

function inquiryPathwayQuestion(row) {
  const topicClause = row.topic ? `${row.topic} laws` : "laws without a dominant topic";
  const tierClause = row.tierLabel || "the selected neutral tier";
  return `What does the current filtered map view show for ${topicClause} in ${tierClause} units?`;
}

function applyInquiryPathway(topic, tier, question, destination) {
  state.mapFilters = {
    ...state.mapFilters,
    topic: topic || "",
    tier: tier || "",
  };
  state.selectedUnitId = null;
  if (destination === "map") {
    state.activeTab = "map";
    render();
    return;
  }
  const prompt = question || "What does the current filtered map view show?";
  const input = $("#inquiry-form input[name='question']");
  if (input) {
    input.value = prompt;
  }
  answerAndLogInquiry(prompt, "topic-tier pathway");
  state.activeTab = "inquiry";
  render();
}

function applyInquiryPathwayOntology(action, topic, tier, unitId) {
  if (action === "unit" && unitId) {
    openAuditUnitOnMap(unitId);
    return;
  }
  state.mapFilters = {
    ...state.mapFilters,
    topic: topic || state.mapFilters.topic,
    tier: tier || state.mapFilters.tier,
  };
  state.selectedUnitId = null;
  if (action === "tier" && tier) {
    openTierOntology(tier);
    return;
  }
  if (tier) {
    state.ontologyFocusTier = tier;
  }
  if (state.disclosureLevel === "overview") {
    state.disclosureLevel = "unit";
  }
  state.activeTab = "ontology";
  render();
}

function inquiryPromptCards() {
  const mapLayers = state.analysis.mapLayers;
  const units = mapLayers ? filterMapUnits(mapLayers.units || []) : [];
  const summary = summarizeUnits(units);
  const topUnit = summary.topUnit;
  const selectedUnit = currentSelectedMapUnit();
  const auditSummary = inquiryAuditSummary(units);
  const packageSummary = packageCoverageSummary();
  const packageStats = importedPackageMapStats(mapLayers?.units || []);
  const packCards = questionPackPromptCards();
  const cards = [
    {
      group: "Map",
      title: "Current filtered view",
      question: "What does the current filtered map view show?",
      detail: `${formatCount(units.length)} units · ${formatCount(summary.lawCount)} rows`,
    },
    {
      group: "Package",
      title: packageSummary.imported ? (packageSummary.syntheticPackage ? "Synthetic package overlay" : "Loaded package overlay") : "No package loaded",
      question: "What does the loaded package show on the map?",
      detail: packageSummary.imported
        ? `${formatCount(packageStats.matchedRecords)}/${formatCount(packageStats.recordCount)} records matched · ${formatCount(packageStats.units.size)} units`
        : "Use Load Demo Package or import a bounded local package",
    },
    {
      group: "Topic",
      title: `Why ${summary.topTopic.label}?`,
      question: `What does the current filtered map view show for ${summary.topTopic.label} laws?`,
      detail: `${formatCount(summary.topTopic.value)} aggregate rows`,
    },
    {
      group: "Function",
      title: `Function mix: ${summary.topFunction.label}`,
      question: `What does the current filtered map view show for ${summary.topFunction.label} functions?`,
      detail: `${formatCount(summary.topFunction.value)} aggregate rows`,
    },
    {
      group: "Audit",
      title: "Review signals",
      question: "What audit review signals are visible in the current filtered map view?",
      detail: `${formatCount(auditSummary.reviewRows)} OCR · ${formatCount(auditSummary.duplicateRows)} duplicate hash`,
    },
    {
      group: "Scores",
      title: "Neutral score profile",
      question: "What model score patterns are visible in the current filtered map view?",
      detail: scoreSnapshot(summary.scoreMeans),
    },
  ];
  if (topUnit) {
    cards.push({
      group: "Unit",
      title: displayUnitName(topUnit),
      question: `What does the selected unit ${displayUnitName(topUnit)} show?`,
      detail: `${topUnit.state} · ${formatCount(topUnit.law_count)} rows`,
      unitId: topUnit.unit_id,
    });
  }
  if (selectedUnit) {
    cards.unshift({
      group: "Selected",
      title: displayUnitName(selectedUnit),
      question: `What does the selected unit ${displayUnitName(selectedUnit)} show?`,
      detail: `${selectedUnit.state} · ${selectedUnit.tier_label}`,
      unitId: selectedUnit.unit_id,
    });
  }
  const limit = state.disclosureLevel === "overview" ? 8 : 12;
  return [...packCards, ...cards].slice(0, limit);
}

function questionPackPromptCards() {
  const pack = state.analysis.questionPack;
  if (!pack?.prompts?.length) {
    return [];
  }
  const limit = state.disclosureLevel === "overview" ? 4 : 6;
  return pack.prompts.slice(0, limit).map((prompt) => ({
    group: `Pack · ${prompt.group || "Prompt"}`,
    title: prompt.title || prompt.id || "Question pack",
    question: prompt.question,
    detail: prompt.detail || "Static aggregate question pack",
    packId: prompt.id,
    unitId: prompt.filters?.selected_unit_id || null,
  }));
}

function applyQuestionPackPrompt(promptId) {
  const pack = state.analysis.questionPack;
  const prompt = (pack?.prompts || []).find((item) => item.id === promptId);
  if (!prompt) {
    return;
  }
  const filters = prompt.filters || {};
  state.mapFilters = {
    ...state.mapFilters,
    state: filters.state || state.mapFilters.state,
    topic: filters.topic || state.mapFilters.topic,
    function: filters.function || state.mapFilters.function,
    kind: filters.kind || state.mapFilters.kind,
    tier: filters.tier || state.mapFilters.tier,
    scoreField: filters.scoreField || filters.score_field || state.mapFilters.scoreField,
    scoreBand: filters.scoreBand || filters.score_band || state.mapFilters.scoreBand,
    auditFocus: filters.auditFocus || state.mapFilters.auditFocus,
    packageOnly: typeof filters.packageOnly === "boolean" ? filters.packageOnly : state.mapFilters.packageOnly,
  };
  if (filters.selected_unit_id) {
    state.selectedUnitId = filters.selected_unit_id;
  }
  if (["overview", "unit", "evidence"].includes(prompt.recommended_disclosure)) {
    state.disclosureLevel = prompt.recommended_disclosure;
  }
}

function inquiryAuditSummary(units) {
  const unitIds = new Set(units.map((unit) => unit.unit_id));
  const rows = (state.analysis.unitAuditQuality?.units || []).filter((row) => unitIds.has(row.unit_id));
  return rows.reduce(
    (summary, row) => ({
      reviewRows: summary.reviewRows + Number(row.ocr_review_rows || 0),
      duplicateRows: summary.duplicateRows + Number(row.duplicate_text_hash_rows || 0),
    }),
    { reviewRows: 0, duplicateRows: 0 },
  );
}

function inquiryAnswerHtml(answer) {
  return `
    <h3>${escapeHtml(answer.title)}</h3>
    ${inquiryAnswerFreshnessHtml()}
    <p>${escapeHtml(answer.answer)}</p>
    ${inquiryAnswerQuestionMapCardsHtml(answer)}
    ${inquiryAnswerFilterChipsHtml(answer)}
    ${answer.grokSummary ? `<aside><strong>Offline Grok summary</strong><p>${escapeHtml(answer.grokSummary)}</p></aside>` : ""}
    ${answer.sections || ""}
    ${inquiryAnswerMiniChartsHtml()}
    ${inquiryAnswerOntologyMiniMapHtml()}
    ${answer.matches || ""}
  `;
}

function inquiryAnswerQuestionMapCardsHtml(answer) {
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    return "";
  }
  const units = filterMapUnits(mapLayers.units || []);
  if (!units.length) {
    return `
      <section class="inquiry-answer-map-cards empty" aria-label="Question-to-map answer cards">
        <div>
          <span>Question-to-map answer cards</span>
          <strong>No aggregate county/town units match the current answer filters.</strong>
        </div>
        <p>Adjust the Law Map filters to restore colored aggregate unit cards.</p>
      </section>
    `;
  }
  const summary = summarizeUnits(units);
  const question = inquiryAnswerQuestion(answer);
  const tierDefinitions = mapLayers.tier_definitions || {};
  const topTier = topEntry(summary.tierCounts);
  const tierRows = inquiryAnswerTierColorRows(summary, units, tierDefinitions);
  const unitRows = units
    .slice()
    .sort((a, b) => Number(b.law_count || 0) - Number(a.law_count || 0) || displayUnitName(a).localeCompare(displayUnitName(b)))
    .slice(0, state.disclosureLevel === "evidence" ? 6 : state.disclosureLevel === "unit" ? 4 : 3);
  return `
    <section class="inquiry-answer-map-cards" aria-label="Question-to-map answer cards">
      <div class="inquiry-answer-map-heading">
        <div>
          <span>Question-to-map answer cards</span>
          <strong>Color counties and towns from this answer.</strong>
          <em>${escapeHtml(question)}</em>
        </div>
        <button type="button" data-inquiry-answer-map-action="highlight">Highlight answer on map</button>
      </div>
      <div class="inquiry-answer-map-metrics">
        ${inquiryAnswerMapMetricHtml("Visible units", formatCount(units.length), "current aggregate scope")}
        ${inquiryAnswerMapMetricHtml("Visible rows", formatCount(summary.lawCount), "aggregate law rows only")}
        ${inquiryAnswerMapMetricHtml("Top tier", topTier.label || "No tier", "neutral review band")}
      </div>
      <div class="inquiry-answer-map-grid">
        <article class="inquiry-answer-map-tier-card">
          <h4>Tier color explanation</h4>
          ${tierRows.map(inquiryAnswerTierColorRowHtml).join("")}
        </article>
        <article class="inquiry-answer-map-unit-card">
          <h4>County/town map targets</h4>
          ${unitRows.map(inquiryAnswerMapUnitRowHtml).join("")}
        </article>
      </div>
      <div class="inquiry-answer-map-actions">
        <button type="button" data-inquiry-answer-map-action="map">Open colored Law Map</button>
        <button type="button" data-inquiry-answer-map-action="ontology">Open ontology route</button>
        <span>No row text, source locators, rankings, legal findings, or browser model calls.</span>
      </div>
    </section>
  `;
}

function inquiryAnswerFilterChipsHtml(answer) {
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    return "";
  }
  const units = filterMapUnits(mapLayers.units || []);
  if (!units.length) {
    return "";
  }
  const summary = summarizeUnits(units);
  const chips = inquiryAnswerFilterChipRows(summary, units, mapLayers.tier_definitions || {});
  if (!chips.length) {
    return "";
  }
  const question = inquiryAnswerQuestion(answer);
  return `
    <section class="inquiry-answer-filter-chips" aria-label="Answer ontology filter chips">
      <div class="inquiry-answer-filter-heading">
        <span>Answer ontology filter chips</span>
        <strong>Progressively narrow the county/town map.</strong>
        <em>${escapeHtml(question || "Current aggregate answer scope")}</em>
      </div>
      <div class="inquiry-answer-filter-chip-row">
        ${chips.map(inquiryAnswerFilterChipHtml).join("")}
      </div>
      <p>Chips apply aggregate topic/function/tier/unit context to the colored county/town map. They expose no row text, source locators, rankings, legal findings, or browser model calls.</p>
    </section>
  `;
}

function inquiryAnswerFilterChipRows(summary, units, tierDefinitions) {
  const topTier = topEntry(summary.tierCounts || {});
  const topTierKey = topTier.value ? tierKeyForLabel(topTier.label, tierDefinitions) : "";
  const topUnit = summary.topUnit;
  const chips = [];
  if (summary.topTopic.value > 0) {
    chips.push({
      action: "topic",
      value: summary.topTopic.label,
      label: `Topic: ${summary.topTopic.label}`,
      detail: `${formatCount(summary.topTopic.value)} aggregate rows`,
      color: TOPIC_COLORS[summary.topTopic.label] || TOPIC_COLORS.Unknown,
    });
  }
  if (summary.topFunction.value > 0) {
    chips.push({
      action: "function",
      value: summary.topFunction.label,
      label: `Function: ${summary.topFunction.label}`,
      detail: `${formatCount(summary.topFunction.value)} aggregate rows`,
      color: FUNCTION_COLORS[summary.topFunction.label] || FUNCTION_COLORS.Unknown,
    });
  }
  if (topTier.value > 0 && topTierKey) {
    chips.push({
      action: "tier",
      value: topTierKey,
      label: `Tier: ${topTier.label}`,
      detail: "neutral county/town color band",
      color: tierColorForLabel(topTier.label, units, tierDefinitions),
    });
  }
  if (topUnit) {
    chips.push({
      action: "unit",
      value: topUnit.unit_id,
      label: `Unit: ${displayUnitName(topUnit)}`,
      detail: `${topUnit.state || "NA"} · ${text(topUnit.kind)} · ${formatCount(topUnit.law_count)} rows`,
      color: topUnit.tier_color || tierColorForLabel(topTier.label, units, tierDefinitions),
    });
  }
  return chips.slice(0, 4);
}

function inquiryAnswerFilterChipHtml(chip) {
  return `
    <button type="button" class="inquiry-answer-filter-chip" data-inquiry-answer-filter-chip="${escapeHtml(chip.action)}" data-inquiry-answer-filter-value="${escapeHtml(chip.value)}">
      <i style="background:${escapeHtml(chip.color || "#d8dee8")}"></i>
      <span>
        <strong>${escapeHtml(chip.label)}</strong>
        <em>${escapeHtml(chip.detail)}</em>
      </span>
    </button>
  `;
}

function applyInquiryAnswerFilterChip(action, value) {
  if (!action || !value) {
    return;
  }
  if (action === "unit") {
    openInquiryAnswerMapUnit(value);
    return;
  }
  if (!["topic", "function", "tier"].includes(action)) {
    return;
  }
  state.mapFilters = {
    ...state.mapFilters,
    topic: action === "topic" ? value : state.mapFilters.topic,
    function: action === "function" ? value : state.mapFilters.function,
    tier: action === "tier" ? value : state.mapFilters.tier,
  };
  state.selectedUnitId = null;
  const visibleUnits = filterMapUnits(state.analysis.mapLayers?.units || []);
  const label = action === "tier" ? tierDefinitionForKey(value).label || value : value;
  state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(
    `${titleCase(action)} chip: ${label}`,
    "answer ontology filter chip",
    visibleUnits,
  );
  if (action === "tier") {
    state.geographyColorMode = "tier";
  }
  state.disclosureLevel = state.disclosureLevel === "overview" ? "unit" : state.disclosureLevel;
  state.activeTab = "map";
  render();
}

function inquiryAnswerQuestion(answer) {
  const storedQuestion = String(answer?.question || "").trim();
  if (storedQuestion) {
    return storedQuestion;
  }
  return String($("#inquiry-form input[name='question']")?.value || state.inquiryMapComposerQuestion || "Current aggregate answer").trim();
}

function inquiryAnswerMapMetricHtml(label, value, detail) {
  return `
    <span>
      <strong>${escapeHtml(label)}</strong>
      <b>${escapeHtml(value)}</b>
      <em>${escapeHtml(detail)}</em>
    </span>
  `;
}

function inquiryAnswerTierColorRows(summary, units, tierDefinitions) {
  const rows = Object.entries(summary.tierCounts || {})
    .filter(([, value]) => Number(value || 0) > 0)
    .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0) || a[0].localeCompare(b[0]))
    .slice(0, 4);
  return rows.map(([label, value]) => {
    const key = tierKeyForLabel(label, tierDefinitions);
    const definition = tierDefinitions[key] || tierDefinitionForKey(key);
    return {
      key,
      label,
      value: Number(value || 0),
      color: definition.color || tierColorForLabel(label, units, tierDefinitions),
      detail: definition.description || "Neutral model-output review band.",
    };
  });
}

function inquiryAnswerTierColorRowHtml(row) {
  return `
    <button type="button" class="inquiry-answer-tier-row" data-inquiry-answer-map-action="tier" data-inquiry-answer-map-value="${escapeHtml(row.key)}">
      <i style="background:${escapeHtml(row.color)}"></i>
      <span>
        <strong>${escapeHtml(row.label)}</strong>
        <em>${escapeHtml(row.detail)}</em>
      </span>
      <b>${escapeHtml(formatCount(row.value))}</b>
    </button>
  `;
}

function inquiryAnswerMapUnitRowHtml(unit) {
  return `
    <button type="button" class="inquiry-answer-map-unit-row" data-inquiry-answer-map-unit="${escapeHtml(unit.unit_id)}">
      <i style="background:${escapeHtml(unit.tier_color || "#d8dee8")}"></i>
      <span>
        <strong>${escapeHtml(displayUnitName(unit))}</strong>
        <em>${escapeHtml(unit.state || "NA")} · ${escapeHtml(text(unit.kind))} · ${escapeHtml(text(unit.tier_label))}</em>
      </span>
      <b>${escapeHtml(formatCount(unit.law_count))}</b>
    </button>
  `;
}

function applyInquiryAnswerMapAction(action, value = "") {
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    return;
  }
  const question = inquiryAnswerQuestion(state.inquiryAnswer || {});
  if (action === "tier" && value) {
    state.mapFilters = {
      ...state.mapFilters,
      tier: value,
    };
    state.selectedUnitId = null;
  }
  const visibleUnits = filterMapUnits(mapLayers.units || []);
  state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(
    question || "Question-to-map answer card",
    "question-to-map answer card",
    visibleUnits,
  );
  state.geographyColorMode = "tier";
  state.disclosureLevel = state.disclosureLevel === "overview" ? "unit" : state.disclosureLevel;
  if (action === "ontology") {
    applyQuestionOntologyRoute(questionOntologyRouteFromUnits(question, "question-to-map answer card", visibleUnits, state.mapFilters, summarizeUnits(visibleUnits)), { renderNow: false });
    state.activeTab = "ontology";
  } else {
    state.activeTab = "map";
  }
  render();
}

function openInquiryAnswerMapUnit(unitId) {
  const unit = (state.analysis.mapLayers?.units || []).find((item) => item.unit_id === unitId);
  if (!unit) {
    return;
  }
  state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(
    inquiryAnswerQuestion(state.inquiryAnswer || {}),
    "question-to-map answer card",
    [unit],
    summarizeUnits([unit]),
  );
  openAuditUnitOnMap(unit.unit_id);
}

function inquiryAnswerFreshnessHtml() {
  const status = state.analysis.status || {};
  const mapLayers = state.analysis.mapLayers || {};
  const briefings = state.analysis.inquiryBriefings || {};
  const questionPack = state.analysis.questionPack || {};
  const briefingGrok = briefings.grok || {};
  const questionGrok = questionPack.grok || {};
  const grokUsed = Boolean(briefingGrok.used || questionGrok.used);
  const latestInquiryAt = latestIso([briefings.generated_at, questionPack.generated_at]);
  const mode = grokUsed
    ? `Grok-refreshed offline${briefingGrok.model || questionGrok.model ? ` · ${briefingGrok.model || questionGrok.model}` : ""}`
    : briefings.generated_at || questionPack.generated_at
      ? "Deterministic static artifacts"
      : "Artifacts loading";
  const latestLabel = latestInquiryAt
    ? `${formatDateTime(latestInquiryAt)} · ${artifactAgeLabel(latestInquiryAt)}`
    : "inquiry artifacts loading";
  const datasetRevision = status.dataset_revision || mapLayers.dataset_revision || briefings.dataset_revision || "unknown";
  return `
    <section class="inquiry-answer-freshness" aria-label="Inquiry answer artifact freshness">
      <div class="inquiry-answer-freshness-heading">
        <span>Answer provenance</span>
        <strong>${escapeHtml(mode)}</strong>
        <em>${escapeHtml(latestLabel)}</em>
      </div>
      <div class="inquiry-answer-freshness-grid">
        ${inquiryAnswerFreshnessBadgeHtml("Dataset", datasetRevision, status.dataset_id || briefings.dataset_id || "LocalLaws/LOCUS-v1")}
        ${inquiryAnswerFreshnessBadgeHtml("Map layer", mapLayers.generated_at ? `${formatDateTime(mapLayers.generated_at)} · ${artifactAgeLabel(mapLayers.generated_at)}` : "loading", "aggregate map artifacts")}
        ${inquiryAnswerFreshnessBadgeHtml("Briefing", briefings.generated_at ? `${formatDateTime(briefings.generated_at)} · ${artifactAgeLabel(briefings.generated_at)}` : "loading", briefingGrok.used ? "offline Grok artifact" : "static artifact")}
        ${inquiryAnswerFreshnessBadgeHtml("Question pack", questionPack.generated_at ? `${formatDateTime(questionPack.generated_at)} · ${artifactAgeLabel(questionPack.generated_at)}` : "loading", questionGrok.used ? "offline Grok notes" : "static prompts")}
      </div>
      <p>No browser model call. No ordinance text, headers, source locators, review events, or secrets are sent or displayed.</p>
    </section>
  `;
}

function inquiryAnswerFreshnessBadgeHtml(label, value, detail) {
  return `
    <span>
      <strong>${escapeHtml(label)}</strong>
      <b>${escapeHtml(value || "unknown")}</b>
      <em>${escapeHtml(detail || "aggregate artifact")}</em>
    </span>
  `;
}

function inquiryAnswerMiniChartsHtml() {
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    return "";
  }
  const units = filterMapUnits(mapLayers.units || []);
  if (!units.length) {
    return `
      <section class="inquiry-answer-mini-charts empty" aria-label="Aggregate answer mini charts">
        <div>
          <span>Answer visuals</span>
          <strong>No aggregate units match the current filters.</strong>
        </div>
        <p>Adjust the Law Map filters to restore answer-level topic, function, tier, and unit charts.</p>
      </section>
    `;
  }
  const summary = summarizeUnits(units);
  const tierDefinitions = mapLayers.tier_definitions || {};
  const limit = state.disclosureLevel === "evidence" ? 6 : state.disclosureLevel === "unit" ? 5 : 4;
  const charts = [
    inquiryAnswerCountChart("Topic mix", "topic", summary.topicCounts, summary.lawCount, limit),
    inquiryAnswerCountChart("Function mix", "function", summary.functionCounts, summary.lawCount, limit),
    inquiryAnswerCountChart("Neutral tier mix", "tier", summary.tierCounts, units.length, limit, (label) => tierKeyForLabel(label, tierDefinitions)),
    inquiryAnswerUnitChart(units, limit),
  ].filter(Boolean);
  return `
    <section class="inquiry-answer-mini-charts" aria-label="Aggregate answer mini charts">
      <div class="inquiry-answer-mini-heading">
        <div>
          <span>Answer visuals</span>
          <strong>${escapeHtml(formatCount(units.length))} visible units · ${escapeHtml(formatCount(summary.lawCount))} rows</strong>
        </div>
        <em>Click rows to filter the Law Map</em>
      </div>
      <div class="inquiry-answer-mini-grid">
        ${charts.join("")}
      </div>
      <p>Mini charts reuse current aggregate map artifacts only. They do not expose ordinance text, source locators, review events, or legal findings.</p>
    </section>
  `;
}

function inquiryAnswerCountChart(title, action, counts, denominator, limit, valueTransform = (label) => label) {
  const rows = Object.entries(counts || {})
    .filter(([, value]) => Number(value || 0) > 0)
    .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0) || a[0].localeCompare(b[0]))
    .slice(0, limit);
  if (!rows.length) {
    return "";
  }
  const max = Math.max(1, ...rows.map(([, value]) => Number(value || 0)));
  return `
    <article class="inquiry-answer-mini-chart">
      <h4>${escapeHtml(title)}</h4>
      ${rows
        .map(([label, value]) =>
          inquiryAnswerMiniChartRowHtml({
            label,
            value,
            max,
            detail: `${formatPercent(value, denominator)} of current aggregate scope`,
            action,
            actionValue: valueTransform(label),
          }),
        )
        .join("")}
    </article>
  `;
}

function inquiryAnswerUnitChart(units, limit) {
  const rows = units
    .slice()
    .sort((a, b) => Number(b.law_count || 0) - Number(a.law_count || 0) || displayUnitName(a).localeCompare(displayUnitName(b)))
    .slice(0, limit);
  if (!rows.length) {
    return "";
  }
  const max = Math.max(1, ...rows.map((unit) => Number(unit.law_count || 0)));
  return `
    <article class="inquiry-answer-mini-chart">
      <h4>Top visible units</h4>
      ${rows
        .map((unit) =>
          inquiryAnswerMiniChartRowHtml({
            label: displayUnitName(unit),
            value: Number(unit.law_count || 0),
            max,
            detail: `${unit.state || "NA"} · ${text(unit.kind)} · ${text(unit.tier_label)}`,
            action: "unit",
            actionValue: unit.unit_id,
          }),
        )
        .join("")}
    </article>
  `;
}

function inquiryAnswerMiniChartRowHtml(row) {
  const width = Math.max(row.value ? 5 : 0, (Number(row.value || 0) / Math.max(1, Number(row.max || 1))) * 100).toFixed(2);
  return `
    <button type="button" class="inquiry-answer-mini-row" data-inquiry-answer-chart-action="${escapeHtml(row.action)}" data-inquiry-answer-chart-value="${escapeHtml(row.actionValue)}">
      <span>
        <strong>${escapeHtml(row.label)}</strong>
        <em>${escapeHtml(row.detail)}</em>
      </span>
      <b><i style="width:${escapeHtml(width)}%"></i></b>
      <small>${escapeHtml(formatCount(row.value))}</small>
    </button>
  `;
}

function applyInquiryAnswerChartAction(action, value) {
  if (action === "unit") {
    openAuditUnitOnMap(value);
    return;
  }
  if (!["topic", "function", "tier"].includes(action)) {
    return;
  }
  state.mapFilters = {
    ...state.mapFilters,
    topic: action === "topic" ? value : state.mapFilters.topic,
    function: action === "function" ? value : state.mapFilters.function,
    tier: action === "tier" ? value : state.mapFilters.tier,
  };
  state.selectedUnitId = null;
  state.disclosureLevel = "unit";
  state.activeTab = "map";
  render();
}

function inquiryAnswerOntologyMiniMapHtml() {
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    return "";
  }
  const units = filterMapUnits(mapLayers.units || []);
  if (!units.length) {
    return `
      <section class="inquiry-answer-ontology-map empty" aria-label="Answer ontology mini-map">
        <span>Ontology mini-map</span>
        <strong>No aggregate units match the current filters.</strong>
        <p>Adjust the Law Map filters to restore a topic, function, tier, and unit path.</p>
      </section>
    `;
  }
  const summary = summarizeUnits(units);
  const tierDefinitions = mapLayers.tier_definitions || {};
  const topTier = topEntry(summary.tierCounts);
  const topTierKey = tierKeyForLabel(topTier.label, tierDefinitions);
  const nodes = inquiryAnswerOntologyNodes(summary, units, topTier, topTierKey, tierDefinitions);
  const edgeNodes = nodes.filter((node) => node.id !== "scope");
  const scopeTitle = activeFilterLabels().join(" · ") || "Current aggregate answer scope";
  return `
    <section class="inquiry-answer-ontology-map" aria-label="Answer ontology mini-map">
      <div class="inquiry-answer-ontology-heading">
        <div>
          <span>Ontology mini-map</span>
          <strong>${escapeHtml(formatCount(units.length))} units · ${escapeHtml(formatCount(summary.lawCount))} rows</strong>
        </div>
        <em>${escapeHtml(scopeTitle)}</em>
      </div>
      <svg class="inquiry-answer-ontology-svg" viewBox="0 0 700 260" role="img" aria-label="Aggregate topic function tier and unit path for this answer">
        ${edgeNodes
          .map((node) => `<line x1="350" y1="130" x2="${node.x}" y2="${node.y}" class="inquiry-answer-ontology-edge"></line>`)
          .join("")}
        ${nodes.map(inquiryAnswerOntologyNodeSvg).join("")}
      </svg>
      <div class="inquiry-answer-ontology-actions" aria-label="Ontology mini-map actions">
        ${inquiryAnswerOntologyActionButton("topic", summary.topTopic.label, `Topic node: ${summary.topTopic.label}`, `${formatCount(summary.topTopic.value)} rows`, summary.topTopic.value > 0)}
        ${inquiryAnswerOntologyActionButton("function", summary.topFunction.label, `Function node: ${summary.topFunction.label}`, `${formatCount(summary.topFunction.value)} rows`, summary.topFunction.value > 0)}
        ${inquiryAnswerOntologyActionButton("tier", topTierKey, `Tier node: ${topTier.label}`, `${formatCount(topTier.value)} units`, topTier.value > 0)}
        ${
          summary.topUnit
            ? inquiryAnswerOntologyActionButton("unit", summary.topUnit.unit_id, `Map unit: ${displayUnitName(summary.topUnit)}`, `${summary.topUnit.state || "NA"} · ${formatCount(summary.topUnit.law_count)} rows`, true)
            : ""
        }
      </div>
      ${inquiryAnswerOntologyDrawerHtml(units, summary, topTier, topTierKey)}
      <p>Mini-map edges summarize aggregate model-output fields from public static artifacts. They are not verified legal relationships and include no ordinance text or source locator values.</p>
    </section>
  `;
}

function inquiryAnswerOntologyNodes(summary, units, topTier, topTierKey, tierDefinitions) {
  const topUnit = summary.topUnit;
  return [
    {
      id: "scope",
      label: "Answer scope",
      sublabel: `${formatCount(units.length)} units`,
      x: 350,
      y: 130,
      r: 50,
      fill: "#ffffff",
    },
    {
      id: "topic",
      label: summary.topTopic.label,
      sublabel: "top topic",
      x: 132,
      y: 74,
      r: 38,
      fill: TOPIC_COLORS[summary.topTopic.label] || TOPIC_COLORS.Unknown,
      action: "topic",
      actionValue: summary.topTopic.value > 0 ? summary.topTopic.label : "",
    },
    {
      id: "function",
      label: summary.topFunction.label,
      sublabel: "top function",
      x: 568,
      y: 74,
      r: 38,
      fill: FUNCTION_COLORS[summary.topFunction.label] || FUNCTION_COLORS.Unknown,
      action: "function",
      actionValue: summary.topFunction.value > 0 ? summary.topFunction.label : "",
    },
    {
      id: "tier",
      label: topTier.label,
      sublabel: "neutral tier",
      x: 170,
      y: 210,
      r: 38,
      fill: tierColorForLabel(topTier.label, units, tierDefinitions),
      action: "tier",
      actionValue: topTier.value > 0 ? topTierKey : "",
    },
    {
      id: "unit",
      label: topUnit ? displayUnitName(topUnit) : "No unit",
      sublabel: topUnit ? `${topUnit.state || "NA"} · top unit` : "top unit",
      x: 530,
      y: 210,
      r: 42,
      fill: topUnit?.tier_color || tierColorForLabel(topTier.label, units, tierDefinitions),
      action: "unit",
      actionValue: topUnit?.unit_id || "",
      className: "unit-node",
    },
  ];
}

function inquiryAnswerOntologyNodeSvg(node) {
  const actionAttrs = node.actionValue
    ? ` data-inquiry-answer-ontology-action="${escapeHtml(node.action)}" data-inquiry-answer-ontology-value="${escapeHtml(node.actionValue)}"`
    : "";
  const words = String(node.label || "Unknown").split(/\s+/).slice(0, 3);
  const labelLines = words.length ? words : ["Unknown"];
  return `
    <g class="inquiry-answer-ontology-node ${escapeHtml(node.className || "")}" transform="translate(${node.x} ${node.y})"${actionAttrs}>
      <circle r="${node.r}" fill="${escapeHtml(node.fill)}"></circle>
      ${labelLines
        .map((line, index) => `<text y="${(index - (labelLines.length - 1) / 2) * 13 - 2}" class="node-label">${escapeHtml(line)}</text>`)
        .join("")}
      <text y="${node.r - 10}" class="node-sublabel">${escapeHtml(node.sublabel || "")}</text>
    </g>
  `;
}

function inquiryAnswerOntologyActionButton(action, value, label, detail, enabled) {
  if (!enabled || !value) {
    return `
      <span class="inquiry-answer-ontology-chip disabled">
        <strong>${escapeHtml(label)}</strong>
        <em>${escapeHtml(detail)}</em>
      </span>
    `;
  }
  return `
    <button type="button" class="inquiry-answer-ontology-chip" data-inquiry-answer-ontology-action="${escapeHtml(action)}" data-inquiry-answer-ontology-value="${escapeHtml(value)}">
      <strong>${escapeHtml(label)}</strong>
      <em>${escapeHtml(detail)}</em>
    </button>
  `;
}

function applyInquiryAnswerOntologyAction(action, value) {
  if (!action || !value) {
    return;
  }
  state.inquiryOntologyDrawer = { action, value };
  renderInquiry();
}

function inquiryAnswerOntologyDrawerHtml(units, summary, topTier, topTierKey) {
  const drawer = inquiryAnswerOntologyDrawerState(summary, topTier, topTierKey);
  const rows = inquiryAnswerOntologyDrawerRows(units, drawer);
  const rowLimit = state.disclosureLevel === "evidence" ? 8 : state.disclosureLevel === "unit" ? 6 : 4;
  const visibleRows = rows.slice(0, rowLimit);
  const maxValue = Math.max(1, ...visibleRows.map((row) => Number(row.value || 0)));
  return `
    <aside class="inquiry-answer-ontology-drawer" aria-label="County and town comparison drawer">
      <div class="inquiry-answer-ontology-drawer-heading">
        <div>
          <span>County/town comparison drawer</span>
          <strong>${escapeHtml(inquiryAnswerOntologyDrawerTitle(drawer))}</strong>
          <em>${escapeHtml(inquiryAnswerOntologyDrawerDetail(drawer, rows.length))}</em>
        </div>
        <button type="button" data-inquiry-drawer-open="${escapeHtml(drawer.action)}" data-inquiry-drawer-value="${escapeHtml(drawer.value)}">${escapeHtml(inquiryAnswerOntologyDrawerOpenLabel(drawer))}</button>
      </div>
      <div class="inquiry-answer-ontology-drawer-rows">
        ${
          visibleRows.length
            ? visibleRows.map((row) => inquiryAnswerOntologyDrawerRowHtml(row, maxValue)).join("")
            : '<p class="muted-note">No aggregate county/town units match this mini-map node inside the current filters.</p>'
        }
      </div>
      <p>Drawer rows compare public aggregate units only. Counts are model-output review aids, not legal findings, rankings, or source-backed legal conclusions.</p>
    </aside>
  `;
}

function inquiryAnswerOntologyDrawerState(summary, topTier, topTierKey) {
  const requested = state.inquiryOntologyDrawer || {};
  if (["topic", "function", "tier", "unit"].includes(requested.action) && requested.value) {
    return requested;
  }
  if (summary.topTopic.value > 0) {
    return { action: "topic", value: summary.topTopic.label };
  }
  if (topTier.value > 0) {
    return { action: "tier", value: topTierKey };
  }
  return { action: "unit", value: summary.topUnit?.unit_id || "" };
}

function inquiryAnswerOntologyDrawerTitle(drawer) {
  if (drawer.action === "topic") {
    return `Topic node: ${drawer.value}`;
  }
  if (drawer.action === "function") {
    return `Function node: ${drawer.value}`;
  }
  if (drawer.action === "tier") {
    return `Neutral tier node: ${tierDefinitionForKey(drawer.value).label || drawer.value}`;
  }
  const unit = (state.analysis.mapLayers?.units || []).find((item) => item.unit_id === drawer.value);
  return unit ? `Map unit node: ${displayUnitName(unit)}` : "Map unit node";
}

function inquiryAnswerOntologyDrawerDetail(drawer, rowCount) {
  const unitLabel = rowCount === 1 ? "aggregate unit" : "aggregate units";
  if (drawer.action === "topic") {
    return `${formatCount(rowCount)} county/town ${unitLabel} with rows in this topic`;
  }
  if (drawer.action === "function") {
    return `${formatCount(rowCount)} county/town ${unitLabel} with rows in this function`;
  }
  if (drawer.action === "tier") {
    return `${formatCount(rowCount)} county/town ${unitLabel} in this neutral tier`;
  }
  return `${formatCount(rowCount)} selected/peer ${unitLabel}`;
}

function inquiryAnswerOntologyDrawerOpenLabel(drawer) {
  if (drawer.action === "tier") {
    return "Open tier ontology";
  }
  if (drawer.action === "unit") {
    return "Open unit map";
  }
  return "Filter map";
}

function inquiryAnswerOntologyDrawerRows(units, drawer) {
  if (drawer.action === "unit") {
    const unit = (state.analysis.mapLayers?.units || []).find((item) => item.unit_id === drawer.value);
    if (!unit) {
      return [];
    }
    return [
      inquiryAnswerOntologyDrawerRow(unit, Number(unit.law_count || 0), "selected unit"),
      ...selectedUnitPeers(unit).map((peer) =>
        inquiryAnswerOntologyDrawerRow(peer.unit, Number(peer.unit.law_count || 0), peer.reasons.slice(0, 2).join(" · ") || "aggregate peer"),
      ),
    ];
  }
  return units
    .map((unit) => {
      const value = inquiryAnswerOntologyDrawerUnitValue(unit, drawer);
      return inquiryAnswerOntologyDrawerRow(unit, value, inquiryAnswerOntologyDrawerReason(unit, drawer));
    })
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value || Number(b.unit.law_count || 0) - Number(a.unit.law_count || 0) || displayUnitName(a.unit).localeCompare(displayUnitName(b.unit)));
}

function inquiryAnswerOntologyDrawerUnitValue(unit, drawer) {
  if (drawer.action === "topic") {
    return Number(unit.topic_counts?.[drawer.value] || 0);
  }
  if (drawer.action === "function") {
    return Number(unit.function_counts?.[drawer.value] || 0);
  }
  if (drawer.action === "tier") {
    const tierLabel = tierDefinitionForKey(drawer.value).label || drawer.value;
    return unit.tier === drawer.value || unit.tier_label === tierLabel ? Number(unit.law_count || 0) : 0;
  }
  return 0;
}

function inquiryAnswerOntologyDrawerReason(unit, drawer) {
  if (drawer.action === "topic") {
    return `${formatPercent(Number(unit.topic_counts?.[drawer.value] || 0), Number(unit.law_count || 0))} of unit rows`;
  }
  if (drawer.action === "function") {
    return `${formatPercent(Number(unit.function_counts?.[drawer.value] || 0), Number(unit.law_count || 0))} of unit rows`;
  }
  if (drawer.action === "tier") {
    return `${text(unit.tier_label)} · ${scoreSnapshot(unit.model_score_means || {})}`;
  }
  return "aggregate comparison";
}

function inquiryAnswerOntologyDrawerRow(unit, value, reason) {
  return {
    unit,
    value: Number(value || 0),
    reason,
  };
}

function inquiryAnswerOntologyDrawerRowHtml(row, maxValue) {
  const width = Math.max(row.value ? 5 : 0, (Number(row.value || 0) / Math.max(1, Number(maxValue || 1))) * 100).toFixed(2);
  return `
    <button type="button" class="inquiry-answer-ontology-drawer-row" data-inquiry-drawer-unit="${escapeHtml(row.unit.unit_id)}">
      <span>
        <strong>${escapeHtml(displayUnitName(row.unit))}</strong>
        <em>${escapeHtml(row.unit.state || "NA")} · ${escapeHtml(text(row.unit.kind))} · ${escapeHtml(text(row.unit.tier_label))}</em>
      </span>
      <b><i style="width:${escapeHtml(width)}%"></i></b>
      <small>${escapeHtml(formatCount(row.value))}</small>
      <em>${escapeHtml(row.reason || "aggregate comparison")}</em>
    </button>
  `;
}

function applyInquiryOntologyDrawerOpen(action, value) {
  if (action === "unit" && value) {
    openAuditUnitOnMap(value);
    return;
  }
  if (action === "tier" && value) {
    state.mapFilters = {
      ...state.mapFilters,
      tier: value,
    };
    openTierOntology(value);
    return;
  }
  if (action === "topic" || action === "function") {
    state.mapFilters = {
      ...state.mapFilters,
      topic: action === "topic" ? value : state.mapFilters.topic,
      function: action === "function" ? value : state.mapFilters.function,
    };
    state.activeTab = "ontology";
    render();
  }
}

function answerAndLogInquiry(question, source) {
  const answer = answerWithRouteMetadata(String(question), source, answerQuestion(String(question)));
  state.inquiryOntologyDrawer = null;
  state.inquiryAnswer = answer;
  appendInquiryResultsLog(String(question), answer, source);
  return answer;
}

function answerWithRouteMetadata(question, source, answer) {
  return {
    ...answer,
    question: String(question || "").trim(),
    source: String(source || "aggregate inquiry"),
  };
}

function appendInquiryResultsLog(question, answer, source) {
  const entry = inquiryResultLogEntry(question, answer, source);
  state.activeInquiryReplayId = entry.id;
  saveInquiryResultsLog([entry, ...state.inquiryResultsLog.filter((item) => item.id !== entry.id)]);
}

function inquiryResultLogEntry(question, answer, source) {
  const mapLayers = state.analysis.mapLayers;
  const visibleUnits = mapLayers ? filterMapUnits(mapLayers.units || []) : [];
  const summary = summarizeUnits(visibleUnits);
  const briefings = state.analysis.inquiryBriefings || {};
  const questionPack = state.analysis.questionPack || {};
  const selectedUnit = currentSelectedMapUnit();
  const highlight = normalizedInquiryMapHighlight(state.inquiryMapHighlight);
  const ontologyRoute = normalizedQuestionOntologyRoute(highlight?.ontology_route || questionOntologyRouteFromUnits(question, source, visibleUnits, state.mapFilters, summary));
  return {
    schema_version: "evolocus-aggregate-inquiry-result-v1",
    id: `inquiry-result-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    created_at: new Date().toISOString(),
    source,
    question,
    answer_title: answer.title,
    answer_excerpt: answer.answer,
    disclosure_level: state.disclosureLevel,
    geography_color_mode: state.geographyColorMode,
    map_filters: mapFiltersSnapshot(),
    filter_labels: activeFilterLabels(),
    question_highlight: highlight || inquiryMapHighlightFromVisibleUnits(question, source, visibleUnits, summary),
    ontology_route: ontologyRoute,
    selected_unit: selectedUnit
      ? {
          unit_id: selectedUnit.unit_id,
          name: displayUnitName(selectedUnit),
          state: selectedUnit.state || null,
          kind: selectedUnit.kind || null,
          tier_label: selectedUnit.tier_label || null,
        }
      : null,
    visible_summary: {
      unit_count: visibleUnits.length,
      law_count: summary.lawCount,
      substantive_count: summary.substantiveCount,
      top_topic: summary.topTopic,
      top_function: summary.topFunction,
      tier_counts: summary.tierCounts,
    },
    artifact_provenance: {
      dataset_id: state.analysis.status?.dataset_id || briefings.dataset_id || "LocalLaws/LOCUS-v1",
      dataset_revision: state.analysis.status?.dataset_revision || mapLayers?.dataset_revision || briefings.dataset_revision || "unknown",
      map_generated_at: mapLayers?.generated_at || null,
      briefing_generated_at: briefings.generated_at || null,
      question_pack_generated_at: questionPack.generated_at || null,
      briefing_mode: briefings.grok?.used ? `offline Grok ${briefings.grok.model || ""}`.trim() : "deterministic static",
    },
    publication_policy: aggregateInquiryLogPolicy(),
  };
}

function aggregateInquiryLogPolicy() {
  return {
    raw_rows_included: false,
    ordinance_text_included: false,
    header_text_included: false,
    record_locator_values_included: false,
    source_locators_included: false,
    review_events_included: false,
    browser_llm_calls: false,
    legal_findings: false,
  };
}

function renderInquiryRouteReplay() {
  const target = $("#inquiry-route-replay");
  const summaryTarget = $("#inquiry-route-replay-summary");
  if (!target || !summaryTarget) {
    return;
  }
  const entries = state.inquiryResultsLog.slice(0, 6);
  summaryTarget.textContent = entries.length
    ? `${formatCount(entries.length)} routes · browser local`
    : "Ask or replay a question";
  if (!entries.length) {
    target.innerHTML = `
      <article class="inquiry-route-empty">
        <strong>No saved question routes yet.</strong>
        <p>Ask a question, use the question-to-map composer, or click a preset. The route panel will show aggregate filters, map counts, ontology context, and replay actions.</p>
      </article>
    `;
    return;
  }
  const maxRows = Math.max(1, ...entries.map((item) => Number(item.visible_summary?.law_count || 0)));
  const maxUnits = Math.max(1, ...entries.map((item) => Number(item.visible_summary?.unit_count || 0)));
  target.innerHTML = `
    <div class="inquiry-route-grid">
      ${entries.map((item, index) => inquiryRouteReplayCardHtml(item, index, maxRows, maxUnits)).join("")}
    </div>
    <p class="inquiry-route-boundary">Question routes restore browser state only: aggregate map filters, disclosure depth, selected unit IDs, and deterministic answers. They do not store or reveal ordinance text, source locators, review events, secrets, or live model calls.</p>
  `;
}

function inquiryRouteReplayCardHtml(item, index, maxRows, maxUnits) {
  const summary = item.visible_summary || {};
  const lawCount = Number(summary.law_count || 0);
  const unitCount = Number(summary.unit_count || 0);
  const lawWidth = Math.max(lawCount ? 5 : 0, (lawCount / maxRows) * 100).toFixed(2);
  const unitWidth = Math.max(unitCount ? 5 : 0, (unitCount / maxUnits) * 100).toFixed(2);
  const activeClass = item.id === state.activeInquiryReplayId ? " active" : "";
  const filters = item.filter_labels?.length ? item.filter_labels : ["No active filters"];
  return `
    <article class="inquiry-route-card${activeClass}">
      <div class="inquiry-route-heading">
        <span>Route ${escapeHtml(String(index + 1))}</span>
        <em>${escapeHtml(formatDateTime(item.created_at))}</em>
      </div>
      <strong>${escapeHtml(item.question || "Aggregate question")}</strong>
      <div class="inquiry-route-steps" aria-label="Question to map route">
        ${inquiryRouteStepHtml("Question", item.source || "manual inquiry", "prompt")}
        ${inquiryRouteStepHtml("Filters", filters.slice(0, 3).join(" · "), "browser state")}
        ${inquiryRouteStepHtml("Colored map", `${formatCount(unitCount)} units · ${formatCount(lawCount)} rows`, geographyColorLabel(item.geography_color_mode || state.geographyColorMode))}
        ${inquiryRouteStepHtml("Ontology", inquiryRouteOntologyLabel(summary), "aggregate context")}
      </div>
      <div class="inquiry-route-scale" aria-label="Aggregate row and unit replay scale">
        <span><b style="width:${escapeHtml(lawWidth)}%"></b><em>${escapeHtml(formatCount(lawCount))} law rows</em></span>
        <span><b style="width:${escapeHtml(unitWidth)}%"></b><em>${escapeHtml(formatCount(unitCount))} units</em></span>
      </div>
      <div class="inquiry-route-filters" aria-label="Saved aggregate filters">
        ${filters.slice(0, 5).map((label) => `<i>${escapeHtml(label)}</i>`).join("")}
      </div>
      <div class="inquiry-route-actions">
        <button type="button" data-replay-inquiry-log="${escapeHtml(item.id || "")}">Replay answer</button>
        <button type="button" data-open-inquiry-log-map="${escapeHtml(item.id || "")}">Open map path</button>
        <button type="button" data-open-inquiry-log-ontology="${escapeHtml(item.id || "")}">Open ontology path</button>
      </div>
    </article>
  `;
}

function inquiryRouteStepHtml(label, value, detail) {
  return `
    <span>
      <strong>${escapeHtml(label)}</strong>
      <b>${escapeHtml(value || "not available")}</b>
      <em>${escapeHtml(detail || "aggregate")}</em>
    </span>
  `;
}

function inquiryRouteOntologyLabel(summary) {
  const topTier = topEntry(summary.tier_counts || {});
  const topic = summary.top_topic?.label || "topic n/a";
  const functionLabel = summary.top_function?.label || "function n/a";
  return `${topic} · ${functionLabel} · ${topTier.label || "tier n/a"}`;
}

function renderInquiryResultsLog() {
  const target = $("#inquiry-results-log");
  if (!target) {
    return;
  }
  if (!state.inquiryResultsLog.length) {
    target.innerHTML = `
      <article class="inquiry-log-empty">
        <strong>No aggregate inquiry results saved yet.</strong>
        <p>Ask a question or click a preset. The log will store answer summaries, filter context, artifact timestamps, and safety policy flags in this browser only.</p>
      </article>
    `;
    return;
  }
  target.innerHTML = `
    ${inquiryResultsTimelineHtml(state.inquiryResultsLog)}
    ${inquiryRouteComparisonHtml(state.inquiryResultsLog)}
    ${state.inquiryResultsLog.slice(0, 8).map(inquiryResultLogCardHtml).join("")}
  `;
}

function inquiryRouteComparisonHtml(entries) {
  const rows = entries.slice(0, 6);
  if (!rows.length) {
    return "";
  }
  const maxRows = Math.max(1, ...rows.map((item) => Number(item.visible_summary?.law_count || 0)));
  const maxUnits = Math.max(1, ...rows.map((item) => Number(item.visible_summary?.unit_count || 0)));
  const baseline = rows[0];
  return `
    <section class="inquiry-route-comparison" aria-label="Saved aggregate route comparison">
      <div class="inquiry-route-comparison-heading">
        <div>
          <span>Route comparison</span>
          <strong>${escapeHtml(formatCount(rows.length))} browser-local saved question paths</strong>
        </div>
        <em>${escapeHtml(rows.length > 1 ? "Compared against newest saved route" : "Save another route to compare deltas")}</em>
      </div>
      <div class="inquiry-route-comparison-grid">
        ${rows.map((item, index) => inquiryRouteComparisonCardHtml(item, index, baseline, maxRows, maxUnits)).join("")}
      </div>
      <p class="inquiry-route-comparison-boundary">Comparison rows use saved aggregate route metadata only: filters, selected public unit IDs, row/unit counts, model-output labels, artifact timestamps, and no-text publication flags. They are not legal rankings or civic findings.</p>
    </section>
  `;
}

function inquiryRouteComparisonCardHtml(item, index, baseline, maxRows, maxUnits) {
  const summary = item.visible_summary || {};
  const lawCount = Number(summary.law_count || 0);
  const unitCount = Number(summary.unit_count || 0);
  const selectedUnit = item.selected_unit?.name
    ? `${item.selected_unit.name}${item.selected_unit.state ? `, ${item.selected_unit.state}` : ""}`
    : "No selected unit";
  const filters = item.filter_labels?.length ? item.filter_labels : ["No active filters"];
  const activeClass = item.id === state.activeInquiryReplayId ? " active" : "";
  return `
    <article class="inquiry-route-comparison-card${activeClass}">
      <div class="inquiry-route-comparison-title">
        <span>Route ${escapeHtml(String(index + 1))}</span>
        <em>${escapeHtml(formatDateTime(item.created_at))}</em>
      </div>
      <strong>${escapeHtml(item.question || item.answer_title || "Aggregate question")}</strong>
      <div class="inquiry-route-comparison-bars">
        ${inquiryRouteComparisonBarHtml("Rows", lawCount, maxRows, routeComparisonDelta(lawCount, Number(baseline.visible_summary?.law_count || 0), index))}
        ${inquiryRouteComparisonBarHtml("Units", unitCount, maxUnits, routeComparisonDelta(unitCount, Number(baseline.visible_summary?.unit_count || 0), index))}
      </div>
      <dl class="inquiry-route-comparison-facts">
        <dt>Selected unit</dt><dd>${escapeHtml(selectedUnit)}</dd>
        <dt>Top topic</dt><dd>${escapeHtml(routeComparisonField(summary.top_topic))}</dd>
        <dt>Top function</dt><dd>${escapeHtml(routeComparisonField(summary.top_function))}</dd>
        <dt>Top tier</dt><dd>${escapeHtml(routeComparisonTopTier(summary.tier_counts || {}))}</dd>
        <dt>Artifacts</dt><dd>${escapeHtml(item.artifact_provenance?.briefing_mode || "static")} · ${escapeHtml(formatDateTime(item.artifact_provenance?.briefing_generated_at))}</dd>
      </dl>
      <div class="inquiry-route-comparison-filters">
        ${filters.slice(0, 5).map((label) => `<i>${escapeHtml(label)}</i>`).join("")}
      </div>
      <div class="inquiry-route-comparison-actions">
        <button type="button" data-replay-inquiry-log="${escapeHtml(item.id || "")}">Answer</button>
        <button type="button" data-open-inquiry-log-map="${escapeHtml(item.id || "")}">Map</button>
        <button type="button" data-open-inquiry-log-ontology="${escapeHtml(item.id || "")}">Ontology</button>
      </div>
    </article>
  `;
}

function inquiryRouteComparisonBarHtml(label, value, maxValue, deltaLabel) {
  const width = Math.max(value ? 5 : 0, (Number(value || 0) / Math.max(1, Number(maxValue || 0))) * 100).toFixed(2);
  return `
    <span>
      <strong>${escapeHtml(label)}</strong>
      <b><i style="width:${escapeHtml(width)}%"></i></b>
      <em>${escapeHtml(formatCount(value))} · ${escapeHtml(deltaLabel)}</em>
    </span>
  `;
}

function routeComparisonDelta(value, baseline, index) {
  if (index === 0) {
    return "baseline";
  }
  const delta = Number(value || 0) - Number(baseline || 0);
  if (!delta) {
    return "same as baseline";
  }
  return `${delta > 0 ? "+" : "-"}${formatCount(Math.abs(delta))} from baseline`;
}

function routeComparisonField(field) {
  if (!field) {
    return "not available";
  }
  if (typeof field === "string") {
    return field;
  }
  const label = field.label || field.name || "not available";
  const value = Number(field.value || 0);
  return value ? `${label} (${formatCount(value)})` : label;
}

function routeComparisonTopTier(tierCounts) {
  const topTier = topEntry(tierCounts || {});
  return topTier.label ? `${topTier.label} (${formatCount(topTier.value)})` : "not available";
}

function inquiryResultsTimelineHtml(entries) {
  const rows = entries.slice(0, 10);
  const maxRows = Math.max(1, ...rows.map((item) => Number(item.visible_summary?.law_count || 0)));
  const maxUnits = Math.max(1, ...rows.map((item) => Number(item.visible_summary?.unit_count || 0)));
  return `
    <section class="inquiry-log-timeline" aria-label="Aggregate inquiry replay timeline">
      <div class="inquiry-log-timeline-heading">
        <div>
          <span>Replay timeline</span>
          <strong>${escapeHtml(formatCount(entries.length))} saved aggregate answers</strong>
        </div>
        <em>No ordinance text, locators, review events, or browser model calls</em>
      </div>
      <div class="inquiry-log-timeline-rows">
        ${rows.map((item) => inquiryResultsTimelineRowHtml(item, maxRows, maxUnits)).join("")}
      </div>
    </section>
  `;
}

function inquiryResultsTimelineRowHtml(item, maxRows, maxUnits) {
  const summary = item.visible_summary || {};
  const lawCount = Number(summary.law_count || 0);
  const unitCount = Number(summary.unit_count || 0);
  const lawWidth = Math.max(lawCount ? 4 : 0, (lawCount / maxRows) * 100).toFixed(2);
  const unitWidth = Math.max(unitCount ? 4 : 0, (unitCount / maxUnits) * 100).toFixed(2);
  const activeClass = item.id === state.activeInquiryReplayId ? " active" : "";
  const filters = item.filter_labels?.length ? item.filter_labels.join(" · ") : "No active filters";
  return `
    <article class="inquiry-log-timeline-row${activeClass}">
      <button type="button" data-replay-inquiry-log="${escapeHtml(item.id || "")}">
        <span>${escapeHtml(formatDateTime(item.created_at))}</span>
        <strong>${escapeHtml(item.answer_title || "Aggregate answer")}</strong>
        <em>${escapeHtml(item.source || "inquiry")} · ${escapeHtml(filters)}</em>
      </button>
      <div class="inquiry-log-sparkline" aria-label="Aggregate row and unit scale">
        <span><b style="width:${escapeHtml(lawWidth)}%"></b><em>${escapeHtml(formatCount(lawCount))} rows</em></span>
        <span><b style="width:${escapeHtml(unitWidth)}%"></b><em>${escapeHtml(formatCount(unitCount))} units</em></span>
      </div>
      <button type="button" class="secondary" data-open-inquiry-log-map="${escapeHtml(item.id || "")}">Map</button>
    </article>
  `;
}

function inquiryResultLogCardHtml(item) {
  const summary = item.visible_summary || {};
  const provenance = item.artifact_provenance || {};
  const filterLabel = item.filter_labels?.length ? item.filter_labels.join(" · ") : "No active map filters";
  const activeClass = item.id === state.activeInquiryReplayId ? " active" : "";
  const replayState = item.map_filters ? "filters restorable" : "summary only";
  return `
    <article class="inquiry-log-entry${activeClass}">
      <div class="inquiry-log-entry-heading">
        <span>${escapeHtml(item.source || "inquiry")}</span>
        <em>${escapeHtml(formatDateTime(item.created_at))}</em>
      </div>
      <h4>${escapeHtml(item.answer_title || "Aggregate answer")}</h4>
      <p>${escapeHtml(item.answer_excerpt || "")}</p>
      <div class="inquiry-log-actions">
        <button type="button" data-replay-inquiry-log="${escapeHtml(item.id || "")}">Replay answer</button>
        <button type="button" data-open-inquiry-log-map="${escapeHtml(item.id || "")}">Open map view</button>
      </div>
      <dl>
        <dt>Question</dt><dd>${escapeHtml(item.question || "")}</dd>
        <dt>Filters</dt><dd>${escapeHtml(filterLabel)}</dd>
        <dt>Replay state</dt><dd>${escapeHtml(replayState)}</dd>
        <dt>Visible aggregate</dt><dd>${escapeHtml(formatCount(summary.unit_count || 0))} units · ${escapeHtml(formatCount(summary.law_count || 0))} law rows</dd>
        <dt>Artifacts</dt><dd>${escapeHtml(provenance.briefing_mode || "static")} · map ${escapeHtml(formatDateTime(provenance.map_generated_at))} · briefing ${escapeHtml(formatDateTime(provenance.briefing_generated_at))}</dd>
        <dt>Boundary</dt><dd>No text, headers, locators, review events, or browser model calls</dd>
      </dl>
    </article>
  `;
}

function replayInquiryResultLog(entryId, destination) {
  const item = state.inquiryResultsLog.find((entry) => entry.id === entryId);
  if (!item) {
    return;
  }
  state.mapFilters = normalizedLogMapFilters(item.map_filters);
  state.geographyColorMode = item.geography_color_mode || state.geographyColorMode;
  state.selectedUnitId = item.selected_unit?.unit_id || null;
  state.disclosureLevel = ["overview", "unit", "evidence"].includes(item.disclosure_level) ? item.disclosure_level : state.disclosureLevel;
  state.activeInquiryReplayId = item.id;
  state.inquiryMapHighlight = normalizedInquiryMapHighlight(item.question_highlight) || null;
  const ontologyRoute = normalizedQuestionOntologyRoute(item.ontology_route || item.question_highlight?.ontology_route);
  const question = String(item.question || "");
  if (!state.inquiryMapHighlight && ontologyRoute) {
    state.inquiryMapHighlight = inquiryMapHighlightFromOntologyRoute(question, item.source || "saved aggregate route", ontologyRoute, item.filter_labels || []);
  }
  if (destination === "ontology" && ontologyRoute) {
    applyQuestionOntologyRoute(ontologyRoute, { renderNow: false });
  }
  const input = $("#inquiry-form input[name='question']");
  if (input) {
    input.value = question;
  }
  state.inquiryAnswer = answerWithRouteMetadata(question, item.source || "saved aggregate route", answerQuestion(question));
  state.activeTab = ["map", "ontology"].includes(destination) ? destination : "inquiry";
  render();
}

function inquiryResultsLogExportPayload() {
  return {
    schema_version: "evolocus-aggregate-inquiry-results-log-export-v1",
    generated_at: new Date().toISOString(),
    entry_count: state.inquiryResultsLog.length,
    publication_policy: aggregateInquiryLogPolicy(),
    source_artifacts: [
      "status.json",
      "map_layers.json",
      "inquiry_briefings.json",
      "question_pack.json",
      "unit_audit_quality.json",
    ],
    entries: state.inquiryResultsLog.map((item) => ({
      ...item,
      publication_policy: aggregateInquiryLogPolicy(),
    })),
  };
}

function exportInquiryResultsLog() {
  download("evolocus-aggregate-inquiry-results-log.json", JSON.stringify(inquiryResultsLogExportPayload(), null, 2), "application/json");
}

function clearInquiryResultsLog() {
  state.activeInquiryReplayId = "";
  saveInquiryResultsLog([]);
  renderInquiry();
}

function renderPrediction(record) {
  const latest = currentLatestEvent(record);
  const shouldReveal = !state.blind || state.revealed[record.record_id] || Boolean(latest);
  const box = $("#prediction-box");
  $("#reveal-prediction").disabled = shouldReveal;
  if (!shouldReveal) {
    box.innerHTML = "<strong>Blind review active.</strong><p>Model labels and scores are hidden until save or explicit reveal.</p>";
    return;
  }
  box.innerHTML = `
    <strong>Model output</strong>
    <dl>
      <dt>is_substantive</dt><dd>${escapeHtml(String(record.is_substantive))}</dd>
      <dt>function</dt><dd>${escapeHtml(text(record.function))}</dd>
      <dt>topic</dt><dd>${escapeHtml(text(record.topic))}</dd>
      <dt>enforcement_discretion</dt><dd>${formatScore(record.enforcement_discretion)}</dd>
      <dt>opacity</dt><dd>${formatScore(record.opacity)}</dd>
      <dt>paternalism</dt><dd>${formatScore(record.paternalism)}</dd>
      <dt>problem_salience</dt><dd>${formatScore(record.problem_salience)}</dd>
    </dl>
    <p>Scores are neutral model scores. Directional legal meaning has not been verified.</p>
  `;
}

function renderHistory(record) {
  const events = loadEvents().filter((event) => event.record_id === record.record_id && event.reviewer_id === state.reviewer);
  $("#event-history").innerHTML = events.length
    ? events
        .slice()
        .reverse()
        .map((event) => `<li><strong>${escapeHtml(event.event_type)}</strong> ${escapeHtml(event.created_at)}</li>`)
        .join("")
    : "<li>No saved events for this reviewer and record.</li>";
}

function renderExplorer() {
  const topicSelect = $("#explorer-form select[name='topic']");
  const functionSelect = $("#explorer-form select[name='function']");
  if (topicSelect.options.length === 1) {
    TOPICS.forEach((topic) => topicSelect.append(new Option(topic, topic)));
  }
  if (functionSelect.options.length === 1) {
    FUNCTIONS.forEach((fn) => functionSelect.append(new Option(fn, fn)));
  }

  const rows = state.explorerRows.slice(0, state.explorerPageSize);
  $("#explorer-summary").textContent = `${state.explorerRows.length} matching records. Showing ${rows.length}.`;
  $("#explorer-table tbody").innerHTML = rows
    .map(
      (record) => `
        <tr>
          <td>${escapeHtml(record.record_id)}</td>
          <td>${escapeHtml(text(record.state))}</td>
          <td>${escapeHtml(text(record.jurisdiction_name))}</td>
          <td>${escapeHtml(text(record.function))}</td>
          <td>${escapeHtml(text(record.topic))}</td>
          <td>${escapeHtml(text(record.ocr_risk_level))}</td>
          <td><button type="button" data-open-record="${escapeHtml(record.record_id)}">Open</button></td>
        </tr>
      `,
    )
    .join("");
}

function renderResults() {
  renderAnalysisCharts();
  renderStateTopicCharts();
  renderCoverageMatrix();
  renderPackageCoverage();
  const latest = Array.from(latestEvents().values()).filter((event) => event.reviewer_id === state.reviewer);
  const reviewed = latest.filter((event) => ["save", "save_next"].includes(event.event_type));
  const flagged = latest.filter((event) => event.event_type === "flag").length;
  const skipped = latest.filter((event) => event.event_type === "skip").length;
  const agreement = agreementMetrics(reviewed);
  const cards = [
    ["Saved reviews", reviewed.length],
    ["Skipped", skipped],
    ["Flagged", flagged],
    ["Substantive agreement", formatFraction(agreement.substantive)],
    ["Function agreement", formatFraction(agreement.function)],
    ["Topic agreement", formatFraction(agreement.topic)],
  ];
  $("#results-grid").innerHTML = cards
    .map(
      ([label, value]) => `
      <article class="metric-card">
        <span class="metric-value">${escapeHtml(String(value))}</span>
        <span class="metric-label">${escapeHtml(label)}</span>
      </article>
    `,
    )
    .join("");
  $("#confusion-output").innerHTML = confusionTable(reviewed);
}

function renderPackageCoverage() {
  const grid = $("#package-coverage-grid");
  if (!grid) {
    return;
  }
  const summary = packageCoverageSummary();
  grid.innerHTML = `
    ${packageCoverageCardsHtml(summary)}
    ${packageCoverageVisualsHtml(summary)}
  `;
}

function packageCoverageSummary() {
  const imported = !isSyntheticQueue();
  const meta = imported ? loadImportStatus() || fallbackImportStatus() : null;
  const metrics = queueMetrics();
  const unitCounts = meta?.unit_counts || unitCountsFromRecords(records);
  const stateCounts = countBy(records, (record) => normalizedCountLabel(record.state, "Unknown state"));
  const topicCounts = countBy(records, (record) => topicLabelForCoverage(record));
  const functionCounts = countBy(records, (record) => normalizedCountLabel(record.function, "Unknown function"));
  const kindCounts = countBy(records, (record) => normalizedCountLabel(record.jurisdiction_type_normalized || record.source_jurisdiction_type, "Unknown type"));
  const ocrCounts = countBy(records, (record) => normalizedCountLabel(record.ocr_risk_level, "not_evaluated"));
  const sourceFiles = new Set(records.map((record) => record.source_file).filter((value) => value !== null && value !== undefined && String(value).trim() !== ""));
  const syntheticPackage = Boolean(meta?.synthetic_demo_data);
  return {
    imported,
    modeLabel: imported ? (syntheticPackage ? "Browser-local synthetic package" : "Browser-local imported package") : "Synthetic demo queue",
    sourceDetail: imported
      ? `${meta?.file_name || (syntheticPackage ? "Synthetic package" : "Imported package")} · imported ${formatDateTime(meta?.imported_at)}`
      : "No real LOCUS text is loaded into the review queue.",
    datasetId: meta?.dataset_id || (imported ? "LocalLaws/LOCUS-v1" : "Synthetic demonstration records"),
    datasetRevision: meta?.dataset_revision || records[0]?.dataset_revision || "demo-revision",
    recordCount: records.length,
    unitCount: Number(meta?.unit_count || Object.keys(unitCounts).length),
    unitCounts,
    stateCounts,
    topicCounts,
    functionCounts,
    kindCounts,
    ocrCounts,
    sourceFileCount: sourceFiles.size,
    metrics,
    syntheticPackage,
    textIncluded: imported ? Boolean(meta?.ordinance_text_included) : false,
    sourceLocatorsIncluded: imported ? Boolean(meta?.source_locators_included) : false,
    reviewEventsIncluded: imported ? Boolean(meta?.review_events_included) : false,
    publicationAllowed: imported ? Boolean(meta?.github_pages_publication_allowed) : false,
    offlineModelBoundary: "Offline Actions-only enrichment; Pages makes no live model calls.",
  };
}

function packageCoverageCardsHtml(summary) {
  const reviewedShare = formatPercent(summary.metrics.reviewed, summary.metrics.total);
  const cards = [
    [
      "Queue source",
      summary.imported ? (summary.syntheticPackage ? "Demo package" : "Imported") : "Synthetic",
      summary.sourceDetail,
      summary.imported ? "imported" : "demo",
    ],
    [
      "Records / units",
      `${formatCount(summary.recordCount)} / ${formatCount(summary.unitCount)}`,
      `${summary.datasetId} · revision ${summary.datasetRevision}`,
      "neutral",
    ],
    [
      "Review progress",
      `${formatCount(summary.metrics.reviewed)} reviewed`,
      `${reviewedShare} complete · ${formatCount(summary.metrics.remaining)} remaining · ${formatCount(summary.metrics.skipped)} skipped · ${formatCount(summary.metrics.flagged)} flagged`,
      "neutral",
    ],
    [
      "Text boundary",
      summary.syntheticPackage ? "Synthetic placeholders" : summary.textIncluded ? "Local LOCUS text loaded" : "No local LOCUS text",
      summary.syntheticPackage
        ? "Generated demo text only; no LOCUS ordinance text or source locators are loaded."
        : summary.imported
          ? "Imported text stays in this browser and is not a Pages artifact."
          : "Synthetic demonstration content only.",
      summary.textIncluded ? "explicit" : "clear",
    ],
    [
      "Model boundary",
      "Static only",
      summary.offlineModelBoundary,
      "clear",
    ],
  ];
  return `
    <div class="package-coverage-summary">
      ${cards
        .map(
          ([label, value, detail, stateLabel]) => `
            <article class="package-coverage-card ${escapeHtml(stateLabel)}">
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(String(value))}</strong>
              <em>${escapeHtml(String(detail))}</em>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function packageCoverageVisualsHtml(summary) {
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const limit = showUnit ? 10 : 5;
  const workflowRows = [
    { label: "reviewed", value: summary.metrics.reviewed },
    { label: "remaining", value: summary.metrics.remaining },
    { label: "skipped", value: summary.metrics.skipped },
    { label: "flagged", value: summary.metrics.flagged },
  ];
  const safetyRows = [
    { label: summary.syntheticPackage ? "synthetic placeholder text" : summary.textIncluded ? "local ordinance text loaded" : "no local ordinance text", value: summary.recordCount },
    { label: summary.sourceLocatorsIncluded ? "source locator values loaded" : "no source locator values", value: summary.recordCount },
    { label: summary.reviewEventsIncluded ? "review events imported" : "no review events imported", value: summary.recordCount },
    { label: summary.publicationAllowed ? "publication flag needs review" : "local-only package", value: summary.recordCount },
  ];
  return `
    <div class="package-coverage-visuals">
      ${packageCoverageBarCard("Review queue by state", summary.stateCounts, limit)}
      ${packageCoverageBarCard("Review queue by topic", summary.topicCounts, limit)}
      ${packageCoverageBarCard("Review queue by function", summary.functionCounts, limit)}
      ${packageCoverageBarCard("Review queue by jurisdiction type", summary.kindCounts, limit, titleCase)}
      ${packageCoverageBarCard("OCR-risk mix", summary.ocrCounts, limit, titleCase)}
      ${packageCoverageBarCard("Review workflow status", workflowRows, 4)}
      ${packageCoverageBarCard("Largest local units", summary.unitCounts, limit)}
      ${packageCoverageBarCard("Package safety markers", safetyRows, 4)}
    </div>
    ${
      !showUnit
        ? `<p class="muted-note">Switch to Unit detail to show longer imported-package distributions. These charts summarize the browser-local queue only.</p>`
        : `<p class="muted-note">Browser-local package summary: ${escapeHtml(formatCount(summary.sourceFileCount))} source files are represented when source-file metadata is present. No package content is written to GitHub Pages.</p>`
    }
  `;
}

function packageCoverageBarCard(title, countsOrRows, limit, labeler = (label) => label) {
  const rows = Array.isArray(countsOrRows) ? countsOrRows.slice(0, limit) : topCountEntries(countsOrRows, limit);
  return `
    <article class="package-coverage-visual-card">
      <h3>${escapeHtml(title)}</h3>
      <div class="bar-list">${auditBarRows(rows, labeler)}</div>
    </article>
  `;
}

function topicLabelForCoverage(record) {
  if (record.topic) {
    return String(record.topic);
  }
  return record.is_substantive ? "Unknown topic" : "Not_applicable";
}

function normalizedCountLabel(value, fallback) {
  const label = value === null || value === undefined ? "" : String(value).trim();
  return label || fallback;
}

function renderAuditLens() {
  const summaryGrid = $("#audit-summary-grid");
  const visualGrid = $("#audit-visual-grid");
  const stateGrid = $("#audit-state-grid");
  const priorityList = $("#audit-priority-list");
  if (!summaryGrid || !visualGrid || !stateGrid || !priorityList) {
    return;
  }
  const auditQuality = state.analysis.unitAuditQuality;
  if (!auditQuality) {
    summaryGrid.innerHTML = `<article class="audit-card"><h3>Audit lens loading</h3><p>Aggregate unit audit-quality artifact has not loaded yet.</p></article>`;
    visualGrid.innerHTML = "";
    stateGrid.innerHTML = "";
    priorityList.innerHTML = "";
    return;
  }
  const rows = visibleAuditRows();
  const summary = auditLensSummary(rows, auditQuality);
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  summaryGrid.innerHTML = auditLensSummaryCards(summary);
  visualGrid.innerHTML = [
    auditAttentionDistributionHtml(rows),
    auditReasonBarsHtml(rows),
    auditKindBarsHtml(rows),
  ].join("");
  stateGrid.innerHTML = auditStateGridHtml(rows, showUnit);
  priorityList.innerHTML = auditPriorityListHtml(rows, showUnit, showEvidence, auditQuality);
  renderDisclosureButtons();
}

function renderScoreLens() {
  const summaryGrid = $("#score-summary-grid");
  const visualGrid = $("#score-visual-grid");
  const stateGrid = $("#score-state-grid");
  const unitList = $("#score-unit-list");
  if (!summaryGrid || !visualGrid || !stateGrid || !unitList) {
    return;
  }
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    summaryGrid.innerHTML = `<article class="score-lens-card"><h3>Score lens loading</h3><p>Aggregate map score artifact has not loaded yet.</p></article>`;
    visualGrid.innerHTML = "";
    stateGrid.innerHTML = "";
    unitList.innerHTML = "";
    return;
  }
  const units = filterMapUnits(mapLayers.units || []);
  const allUnits = mapLayers.units || [];
  const summary = scoreLensSummary(units, allUnits);
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  summaryGrid.innerHTML = scoreLensSummaryCards(summary);
  visualGrid.innerHTML = [
    scoreDimensionBarsHtml(units),
    scoreDimensionRangeHtml(units),
    scoreTierMixHtml(units),
  ].join("");
  stateGrid.innerHTML = scoreStateGridHtml(units, showUnit);
  unitList.innerHTML = scoreUnitListHtml(units, showUnit, showEvidence, mapLayers);
  renderDisclosureButtons();
}

function scoreLensSummary(units, allUnits) {
  const visible = summarizeUnits(units);
  const full = summarizeUnits(allUnits);
  const unitScores = units.flatMap((unit) => scoreValues(unit));
  const finiteScores = unitScores.map((entry) => entry.value).filter((value) => Number.isFinite(value));
  return {
    visibleUnits: units.length,
    fullUnits: allUnits.length,
    rowCount: visible.lawCount,
    fullRows: full.lawCount,
    scoreCount: finiteScores.length,
    minScore: finiteScores.length ? Math.min(...finiteScores) : null,
    maxScore: finiteScores.length ? Math.max(...finiteScores) : null,
    meanScores: visible.scoreMeans,
  };
}

function scoreLensSummaryCards(summary) {
  const cards = [
    ["Visible units", formatCount(summary.visibleUnits), `${formatPercent(summary.visibleUnits, summary.fullUnits)} of published layer`],
    ["Visible law rows", formatCount(summary.rowCount), `${formatPercent(summary.rowCount, summary.fullRows)} of published layer`],
    ["Score values", formatCount(summary.scoreCount), "Four released dimensions when available"],
    ["Visible score range", scoreRangeLabel(summary.minScore, summary.maxScore), "Neutral aggregate model-score means"],
    ["Mean snapshot", scoreSnapshot(summary.meanScores), "Direction not verified"],
  ];
  return cards
    .map(
      ([label, value, detail]) => `
        <article class="score-lens-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <em>${escapeHtml(detail)}</em>
        </article>
      `,
    )
    .join("");
}

function scoreDimensionBarsHtml(units) {
  const rows = SCORE_FIELDS.map((field) => {
    const values = units
      .map((unit) => Number(unit.model_score_means?.[field]))
      .filter((value) => Number.isFinite(value));
    return {
      label: field,
      value: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null,
      count: values.length,
    };
  });
  return `
    <article class="score-visual-card">
      <h3>Mean score by dimension</h3>
      <p>Aggregate means across visible county/town units.</p>
      <div class="score-axis-list">
        ${scoreAxisRows(rows)}
      </div>
    </article>
  `;
}

function scoreDimensionRangeHtml(units) {
  const rows = SCORE_FIELDS.map((field) => {
    const values = units
      .map((unit) => Number(unit.model_score_means?.[field]))
      .filter((value) => Number.isFinite(value));
    return {
      label: field,
      min: values.length ? Math.min(...values) : null,
      max: values.length ? Math.max(...values) : null,
      median: median(values),
    };
  });
  return `
    <article class="score-visual-card">
      <h3>Dimension range</h3>
      <p>Min, median, and max across visible aggregate units.</p>
      <div class="score-range-list">
        ${rows.map(scoreRangeRowHtml).join("")}
      </div>
    </article>
  `;
}

function scoreTierMixHtml(units) {
  const rows = Object.entries(summarizeUnits(units).tierCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
  return `
    <article class="score-visual-card">
      <h3>Neutral tier mix</h3>
      <p>Tier bands are review aids over aggregate model-score summaries and law counts.</p>
      <div class="bar-list">
        ${auditBarRows(rows, (label) => label)}
      </div>
    </article>
  `;
}

function scoreAxisRows(rows) {
  const values = rows.map((row) => Number(row.value)).filter((value) => Number.isFinite(value));
  const min = values.length ? Math.min(-1, ...values) : -1;
  const max = values.length ? Math.max(1, ...values) : 1;
  const span = Math.max(0.000001, max - min);
  return rows
    .map((row) => {
      const value = Number(row.value);
      const position = Number.isFinite(value) ? ((value - min) / span) * 100 : 50;
      return `
        <div class="score-axis-row">
          <span>${escapeHtml(titleCase(row.label))}</span>
          <div><i style="left:${Math.max(0, Math.min(100, position)).toFixed(2)}%"></i></div>
          <strong>${escapeHtml(Number.isFinite(value) ? value.toFixed(3) : "n/a")}</strong>
        </div>
      `;
    })
    .join("");
}

function scoreRangeRowHtml(row) {
  const min = Number(row.min);
  const max = Number(row.max);
  const mid = Number(row.median);
  return `
    <div class="score-range-row">
      <span>${escapeHtml(titleCase(row.label))}</span>
      <strong>${escapeHtml(Number.isFinite(min) ? min.toFixed(3) : "n/a")}</strong>
      <em>${escapeHtml(Number.isFinite(mid) ? mid.toFixed(3) : "n/a")}</em>
      <strong>${escapeHtml(Number.isFinite(max) ? max.toFixed(3) : "n/a")}</strong>
    </div>
  `;
}

function scoreStateGridHtml(units, showUnit) {
  const rows = scoreStateRows(units);
  const visibleRows = showUnit ? rows : rows.slice(0, 10);
  return `
    <article class="score-state-card wide">
      <div class="coverage-matrix-heading">
        <div>
          <h3>State score matrix</h3>
          <p>Each row shows visible unit averages by released model-score dimension. Colors are relative within this filtered view.</p>
        </div>
        <span>${escapeHtml(formatCount(rows.length))} states</span>
      </div>
      <div class="score-state-list">
        ${
          visibleRows.length
            ? visibleRows.map((row) => scoreStateRowHtml(row, rows)).join("")
            : '<p class="muted-note">No score rows match the current map filters.</p>'
        }
      </div>
      ${
        !showUnit && rows.length > visibleRows.length
          ? `<p class="muted-note">Switch to Unit detail to show all ${escapeHtml(formatCount(rows.length))} state rows.</p>`
          : ""
      }
    </article>
  `;
}

function scoreStateRows(units) {
  const grouped = new Map();
  for (const unit of units) {
    const stateCode = unit.state || "NA";
    if (!grouped.has(stateCode)) {
      grouped.set(stateCode, { state: stateCode, units: 0, lawCount: 0, totals: {}, counts: {} });
    }
    const row = grouped.get(stateCode);
    row.units += 1;
    row.lawCount += Number(unit.law_count || 0);
    for (const field of SCORE_FIELDS) {
      const value = Number(unit.model_score_means?.[field]);
      if (Number.isFinite(value)) {
        row.totals[field] = (row.totals[field] || 0) + value;
        row.counts[field] = (row.counts[field] || 0) + 1;
      }
    }
  }
  return [...grouped.values()]
    .map((row) => ({
      ...row,
      means: Object.fromEntries(SCORE_FIELDS.map((field) => [field, row.counts[field] ? row.totals[field] / row.counts[field] : null])),
    }))
    .sort((a, b) => b.lawCount - a.lawCount || a.state.localeCompare(b.state));
}

function scoreStateRowHtml(row, allRows) {
  return `
    <div class="score-state-row">
      <div class="coverage-state">
        <strong>${escapeHtml(row.state)}</strong>
        <span>${escapeHtml(formatCount(row.lawCount))} rows · ${escapeHtml(formatCount(row.units))} units</span>
      </div>
      <div class="score-state-cells">
        ${SCORE_FIELDS.map((field) => scoreStateCellHtml(field, row.means[field], allRows)).join("")}
      </div>
    </div>
  `;
}

function scoreStateCellHtml(field, value, rows) {
  const rangeValues = rows.map((row) => Number(row.means[field])).filter((item) => Number.isFinite(item));
  const min = rangeValues.length ? Math.min(...rangeValues) : -1;
  const max = rangeValues.length ? Math.max(...rangeValues) : 1;
  const ratio = Number.isFinite(Number(value)) ? (Number(value) - min) / Math.max(0.000001, max - min) : 0;
  const color = interpolateColor("#f2e9c9", "#275f79", Math.max(0, Math.min(1, ratio)));
  return `
    <span style="background:${escapeHtml(color)}" title="${escapeHtml(titleCase(field))}: ${escapeHtml(Number.isFinite(Number(value)) ? Number(value).toFixed(3) : "n/a")}">
      <strong>${escapeHtml(titleCase(field).replace("Enforcement ", "Enf. ").replace("Problem ", "Prob. "))}</strong>
      <em>${escapeHtml(Number.isFinite(Number(value)) ? Number(value).toFixed(2) : "n/a")}</em>
    </span>
  `;
}

function scoreUnitListHtml(units, showUnit, showEvidence, mapLayers) {
  const rows = units
    .slice()
    .sort((a, b) => scoreSpread(b) - scoreSpread(a) || Number(b.law_count || 0) - Number(a.law_count || 0))
    .slice(0, showUnit ? 14 : 7);
  return `
    <article class="score-unit-card wide">
      <div class="coverage-matrix-heading">
        <div>
          <h3>High-contrast score profiles</h3>
          <p>Units sorted by spread across the four released model-score dimensions. This highlights records for review, not legal conclusions.</p>
        </div>
        <span>${escapeHtml(formatCount(rows.length))} shown</span>
      </div>
      <div class="score-unit-rows">
        ${
          rows.length
            ? rows.map(scoreUnitRowHtml).join("")
            : '<p class="muted-note">No score profiles match the current filters.</p>'
        }
      </div>
      ${
        showEvidence
          ? `<p class="muted-note">Source artifact: map_layers.json revision ${escapeHtml(mapLayers.dataset_revision || "unknown")}. Score values are aggregate means of released LOCUS model outputs and are not verified legal classifications.</p>`
          : `<p class="muted-note">Switch to Evidence trail to show artifact source and score interpretation boundaries.</p>`
      }
    </article>
  `;
}

function scoreUnitRowHtml(unit) {
  return `
    <div class="score-unit-row">
      <button type="button" data-open-score-unit="${escapeHtml(unit.unit_id)}">${escapeHtml(displayUnitName(unit))}</button>
      <span>${escapeHtml(unit.state || "NA")} · ${escapeHtml(titleCase(unit.kind || "unknown"))} · ${escapeHtml(formatCount(unit.law_count))} rows</span>
      <div class="score-chip-row">
        ${SCORE_FIELDS.map((field) => `<em>${escapeHtml(titleCase(field))}: ${escapeHtml(formatScore(unit.model_score_means?.[field]))}</em>`).join("")}
      </div>
    </div>
  `;
}

function scoreValues(unit) {
  return SCORE_FIELDS.map((field) => ({ field, value: Number(unit.model_score_means?.[field]) })).filter((entry) => Number.isFinite(entry.value));
}

function scoreSpread(unit) {
  const values = scoreValues(unit).map((entry) => entry.value);
  return values.length ? Math.max(...values) - Math.min(...values) : 0;
}

function scoreRangeLabel(min, max) {
  return Number.isFinite(Number(min)) && Number.isFinite(Number(max)) ? `${Number(min).toFixed(2)} to ${Number(max).toFixed(2)}` : "n/a";
}

function median(values) {
  const sorted = values.filter((value) => Number.isFinite(value)).slice().sort((a, b) => a - b);
  if (!sorted.length) {
    return null;
  }
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function visibleAuditRows() {
  const auditRows = state.analysis.unitAuditQuality?.units || [];
  const mapUnits = state.analysis.mapLayers?.units || [];
  const mapUnitById = new Map(mapUnits.map((unit) => [unit.unit_id, unit]));
  const visibleIds = mapUnits.length
    ? new Set(filterMapUnits(mapUnits).map((unit) => unit.unit_id))
    : new Set(auditRows.map((unit) => unit.unit_id));
  return auditRows
    .filter((unit) => visibleIds.has(unit.unit_id))
    .map((unit) => ({
      ...unit,
      mapUnit: mapUnitById.get(unit.unit_id) || null,
    }));
}

function auditLensSummary(rows, auditQuality) {
  const rowCount = rows.reduce((sum, row) => sum + Number(row.law_count || 0), 0);
  const ocrRows = rows.reduce((sum, row) => sum + Number(row.ocr_review_rows || 0), 0);
  const duplicateRows = rows.reduce((sum, row) => sum + Number(row.duplicate_text_hash_rows || 0), 0);
  const attentionScores = rows.map((row) => Number(row.audit_attention_score || 0)).filter((value) => Number.isFinite(value));
  return {
    units: rows.length,
    rowCount,
    ocrRows,
    duplicateRows,
    maxAttention: attentionScores.length ? Math.max(...attentionScores) : 0,
    fullUnits: Number(auditQuality.summary?.unit_count || auditQuality.units?.length || 0),
    fullRows: Number(auditQuality.summary?.row_count || auditQuality.row_count || 0),
  };
}

function auditLensSummaryCards(summary) {
  const cards = [
    ["Visible units", formatCount(summary.units), `${formatPercent(summary.units, summary.fullUnits)} of audit artifact`],
    ["Scoped rows", formatCount(summary.rowCount), `${formatPercent(summary.rowCount, summary.fullRows)} of published audit scope`],
    ["OCR review rows", formatCount(summary.ocrRows), `${formatPercent(summary.ocrRows, summary.rowCount)} of visible rows`],
    ["Duplicate text-hash rows", formatCount(summary.duplicateRows), `${formatPercent(summary.duplicateRows, summary.rowCount)} of visible rows`],
    ["Max audit attention", `${formatNumber(summary.maxAttention)} / 100`, "Review-priority signal, not a ranking"],
  ];
  return cards
    .map(
      ([label, value, detail]) => `
        <article class="audit-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <em>${escapeHtml(detail)}</em>
        </article>
      `,
    )
    .join("");
}

function auditAttentionDistributionHtml(rows) {
  const buckets = [
    { label: "0-2", min: 0, max: 2, count: 0 },
    { label: "2-5", min: 2, max: 5, count: 0 },
    { label: "5-10", min: 5, max: 10, count: 0 },
    { label: "10-20", min: 10, max: 20, count: 0 },
    { label: "20+", min: 20, max: Infinity, count: 0 },
  ];
  for (const row of rows) {
    const score = Number(row.audit_attention_score || 0);
    const bucket = buckets.find((item) => score >= item.min && score < item.max) || buckets[buckets.length - 1];
    bucket.count += 1;
  }
  return `
    <article class="audit-visual-card">
      <h3>Audit attention distribution</h3>
      <p>Counts of visible county/town aggregate units by review-priority score band.</p>
      <div class="audit-band-list">
        ${auditBandRows(buckets)}
      </div>
    </article>
  `;
}

function auditReasonBarsHtml(rows) {
  const reasonCounts = {};
  for (const row of rows) {
    for (const [reason, value] of Object.entries(row.ocr_reason_counts || {})) {
      reasonCounts[reason] = (reasonCounts[reason] || 0) + Number(value || 0);
    }
  }
  const sorted = Object.entries(reasonCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, state.disclosureLevel === "overview" ? 5 : 8);
  return `
    <article class="audit-visual-card">
      <h3>OCR heuristic reason mix</h3>
      <p>Aggregate flag reasons across visible units. These are review cues, not ground truth.</p>
      <div class="bar-list">
        ${auditBarRows(sorted, (label) => titleCase(label))}
      </div>
    </article>
  `;
}

function auditKindBarsHtml(rows) {
  const counts = {};
  for (const row of rows) {
    const label = row.kind || row.mapUnit?.kind || "unknown";
    counts[label] = (counts[label] || 0) + 1;
  }
  const sorted = Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
  return `
    <article class="audit-visual-card">
      <h3>Unit type mix</h3>
      <p>Visible audit units by normalized source type.</p>
      <div class="bar-list">
        ${auditBarRows(sorted, (label) => titleCase(label))}
      </div>
    </article>
  `;
}

function auditBandRows(rows) {
  const max = Math.max(1, ...rows.map((row) => Number(row.count || 0)));
  return rows
    .map(
      (row) => `
        <div class="audit-band-row">
          <span>${escapeHtml(row.label)}</span>
          <div><i style="width:${Math.max(row.count ? 4 : 0, (Number(row.count || 0) / max) * 100)}%"></i></div>
          <strong>${escapeHtml(formatCount(row.count))}</strong>
        </div>
      `,
    )
    .join("");
}

function auditBarRows(rows, labeler = (label) => label) {
  const max = Math.max(1, ...rows.map((row) => Number(row.value || 0)));
  return rows
    .map(
      (row) => `
        <div class="bar-row">
          <span>${escapeHtml(labeler(row.label))}</span>
          <div><i style="width:${Math.max(row.value ? 3 : 0, (Number(row.value || 0) / max) * 100)}%"></i></div>
          <strong>${escapeHtml(formatCount(row.value))}</strong>
        </div>
      `,
    )
    .join("") || "<p>No aggregate audit rows.</p>";
}

function auditStateGridHtml(rows, showUnit) {
  const stateRows = auditStateRows(rows);
  const visibleRows = showUnit ? stateRows : stateRows.slice(0, 10);
  return `
    <article class="audit-state-card wide">
      <div class="coverage-matrix-heading">
        <div>
          <h3>State audit signal atlas</h3>
          <p>Rows summarize visible county/town aggregate units. The bars compare OCR-review and duplicate-text-hash rows.</p>
        </div>
        <span>${escapeHtml(formatCount(stateRows.length))} states</span>
      </div>
      <div class="audit-state-list">
        ${
          visibleRows.length
            ? visibleRows.map(auditStateRowHtml).join("")
            : '<p class="muted-note">No audit rows match the current map filters.</p>'
        }
      </div>
      ${
        !showUnit && stateRows.length > visibleRows.length
          ? `<p class="muted-note">Switch to Unit detail to show all ${escapeHtml(formatCount(stateRows.length))} state rows.</p>`
          : ""
      }
    </article>
  `;
}

function auditStateRows(rows) {
  const grouped = new Map();
  for (const row of rows) {
    const stateCode = row.state || "NA";
    if (!grouped.has(stateCode)) {
      grouped.set(stateCode, { state: stateCode, units: 0, lawCount: 0, ocrRows: 0, duplicateRows: 0, maxAttention: 0 });
    }
    const stateRow = grouped.get(stateCode);
    stateRow.units += 1;
    stateRow.lawCount += Number(row.law_count || 0);
    stateRow.ocrRows += Number(row.ocr_review_rows || 0);
    stateRow.duplicateRows += Number(row.duplicate_text_hash_rows || 0);
    stateRow.maxAttention = Math.max(stateRow.maxAttention, Number(row.audit_attention_score || 0));
  }
  return [...grouped.values()].sort((a, b) => b.ocrRows + b.duplicateRows - (a.ocrRows + a.duplicateRows) || a.state.localeCompare(b.state));
}

function auditStateRowHtml(row) {
  const total = Math.max(1, row.ocrRows + row.duplicateRows);
  return `
    <div class="audit-state-row">
      <div class="coverage-state">
        <strong>${escapeHtml(row.state)}</strong>
        <span>${escapeHtml(formatCount(row.lawCount))} rows · ${escapeHtml(formatCount(row.units))} units</span>
      </div>
      <div class="audit-signal-bars" aria-label="Audit signal mix">
        <span class="ocr" style="width:${Math.max(row.ocrRows ? 7 : 0, (row.ocrRows / total) * 100)}%"><strong>OCR</strong><em>${escapeHtml(formatCount(row.ocrRows))}</em></span>
        <span class="duplicate" style="width:${Math.max(row.duplicateRows ? 7 : 0, (row.duplicateRows / total) * 100)}%"><strong>Dup hash</strong><em>${escapeHtml(formatCount(row.duplicateRows))}</em></span>
      </div>
      <span class="coverage-topic">Max audit attention: ${escapeHtml(formatNumber(row.maxAttention))} / 100</span>
    </div>
  `;
}

function auditPriorityListHtml(rows, showUnit, showEvidence, auditQuality) {
  const sorted = rows
    .slice()
    .sort((a, b) => Number(b.audit_attention_score || 0) - Number(a.audit_attention_score || 0) || Number(b.ocr_review_rows || 0) - Number(a.ocr_review_rows || 0))
    .slice(0, showUnit ? 14 : 7);
  return `
    <article class="audit-priority-card wide">
      <div class="coverage-matrix-heading">
        <div>
          <h3>Review-priority unit queue preview</h3>
          <p>Sorted by aggregate audit attention to help decide where human review should start. This is not a legal ranking.</p>
        </div>
        <span>${escapeHtml(formatCount(sorted.length))} shown</span>
      </div>
      <div class="audit-priority-rows">
        ${
          sorted.length
            ? sorted.map(auditPriorityRowHtml).join("")
            : '<p class="muted-note">No visible audit-priority units match the current filters.</p>'
        }
      </div>
      ${
        showEvidence
          ? `<p class="muted-note">Artifact scope: ${escapeHtml(auditQuality.scope || "published map units")}. ${(auditQuality.limitations || []).map(escapeHtml).join(" ")}</p>`
          : `<p class="muted-note">Switch to Evidence trail to show artifact scope and limitations.</p>`
      }
    </article>
  `;
}

function auditPriorityRowHtml(row) {
  return `
    <div class="audit-priority-row">
      <button type="button" data-open-audit-unit="${escapeHtml(row.unit_id)}">${escapeHtml(displayUnitName(row))}</button>
      <span>${escapeHtml(row.state || "NA")} · ${escapeHtml(titleCase(row.kind || "unknown"))}</span>
      <strong>${escapeHtml(formatNumber(row.audit_attention_score))} / 100</strong>
      <em>${escapeHtml(formatCount(row.ocr_review_rows))} OCR · ${escapeHtml(formatCount(row.duplicate_text_hash_rows))} duplicate hash</em>
    </div>
  `;
}

function renderQueuePlan() {
  const form = $("#queue-plan-form");
  const summary = $("#queue-plan-summary");
  const visuals = $("#queue-plan-visuals");
  const list = $("#queue-plan-list");
  if (!form || !summary || !visuals || !list) {
    return;
  }
  form.elements.strategy.value = state.queuePlan.strategy;
  form.elements.size.value = String(state.queuePlan.size);
  form.elements.seed_label.value = state.queuePlan.seedLabel;
  const plan = buildQueuePlan();
  summary.innerHTML = queuePlanSummaryHtml(plan);
  visuals.innerHTML = queuePlanVisualsHtml(plan);
  list.innerHTML = queuePlanListHtml(plan);
  const packageCommand = $("#package-request-command");
  const packagePreview = $("#package-request-preview");
  const requestPayload = reviewPackageRequestPayload(plan);
  if (packageCommand) {
    packageCommand.textContent = requestPayload.local_command;
  }
  if (packagePreview) {
    packagePreview.innerHTML = reviewPackagePreviewHtml(requestPayload, plan);
  }
  renderDisclosureButtons();
}

function buildQueuePlan() {
  const mapLayers = state.analysis.mapLayers;
  const visibleUnits = mapLayers ? filterMapUnits(mapLayers.units || []) : [];
  const enriched = visibleUnits.map((unit) => {
    const audit = unitAuditQualityFor(unit.unit_id);
    const score = queuePlanScore(unit, audit, state.queuePlan.strategy);
    return { unit, audit, score };
  });
  const selected = selectQueuePlanUnits(enriched, state.queuePlan.strategy, state.queuePlan.size);
  const summary = summarizeQueuePlan(selected, visibleUnits);
  return {
    strategy: state.queuePlan.strategy,
    size: state.queuePlan.size,
    seedLabel: state.queuePlan.seedLabel,
    generatedAt: new Date().toISOString(),
    visibleUnits,
    selected,
    summary,
  };
}

function queuePlanScore(unit, audit, strategy) {
  const auditAttention = Number(audit?.audit_attention_score || 0);
  const lawSignal = Math.log10(Number(unit.law_count || 0) + 1) * 8;
  const scoreContrast = scoreSpread(unit) * 20;
  const substantiveSignal = modelSubstantiveShare(unit) ? Number(modelSubstantiveShare(unit)) * 12 : 0;
  if (strategy === "score_contrast") {
    return scoreContrast + auditAttention * 0.35 + lawSignal * 0.2;
  }
  if (strategy === "law_volume") {
    return lawSignal + auditAttention * 0.25 + substantiveSignal * 0.1;
  }
  if (strategy === "balanced_state") {
    return auditAttention * 0.55 + scoreContrast * 0.25 + lawSignal * 0.2;
  }
  return auditAttention * 0.7 + scoreContrast * 0.2 + lawSignal * 0.1;
}

function selectQueuePlanUnits(rows, strategy, size) {
  const sorted = rows
    .slice()
    .sort((a, b) => b.score - a.score || Number(b.unit.law_count || 0) - Number(a.unit.law_count || 0) || displayUnitName(a.unit).localeCompare(displayUnitName(b.unit)));
  if (strategy !== "balanced_state") {
    return sorted.slice(0, size);
  }
  const byState = new Map();
  for (const row of sorted) {
    const stateCode = row.unit.state || "NA";
    if (!byState.has(stateCode)) {
      byState.set(stateCode, []);
    }
    byState.get(stateCode).push(row);
  }
  const selected = [];
  while (selected.length < size && byState.size) {
    for (const stateCode of [...byState.keys()].sort()) {
      const bucket = byState.get(stateCode);
      const next = bucket.shift();
      if (next) {
        selected.push(next);
        if (selected.length >= size) {
          break;
        }
      }
      if (!bucket.length) {
        byState.delete(stateCode);
      }
    }
  }
  return selected;
}

function summarizeQueuePlan(selected, visibleUnits) {
  const lawCount = selected.reduce((sum, item) => sum + Number(item.unit.law_count || 0), 0);
  const ocrRows = selected.reduce((sum, item) => sum + Number(item.audit?.ocr_review_rows || 0), 0);
  const duplicateRows = selected.reduce((sum, item) => sum + Number(item.audit?.duplicate_text_hash_rows || 0), 0);
  const states = new Set(selected.map((item) => item.unit.state || "NA"));
  const kinds = {};
  for (const item of selected) {
    const kind = item.unit.kind || "unknown";
    kinds[kind] = (kinds[kind] || 0) + 1;
  }
  return {
    selectedUnits: selected.length,
    visibleUnits: visibleUnits.length,
    lawCount,
    ocrRows,
    duplicateRows,
    states: states.size,
    kinds,
  };
}

function queuePlanSummaryHtml(plan) {
  const cards = [
    ["Planned units", formatCount(plan.summary.selectedUnits), `${formatPercent(plan.summary.selectedUnits, plan.summary.visibleUnits)} of visible aggregate units`],
    ["Planned law rows", formatCount(plan.summary.lawCount), "Aggregate row count, not copied records"],
    ["States covered", formatCount(plan.summary.states), `${queuePlanStrategyLabel(plan.strategy)} strategy`],
    ["Audit review rows", formatCount(plan.summary.ocrRows), `${formatCount(plan.summary.duplicateRows)} duplicate text-hash rows`],
    ["Export boundary", "Unit IDs only", "No ordinance text or source locators"],
  ];
  return cards
    .map(
      ([label, value, detail]) => `
        <article class="queue-plan-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <em>${escapeHtml(detail)}</em>
        </article>
      `,
    )
    .join("");
}

function queuePlanVisualsHtml(plan) {
  return [
    queuePlanKindMixHtml(plan),
    queuePlanStateBarsHtml(plan),
    queuePlanSignalBarsHtml(plan),
  ].join("");
}

function queuePlanKindMixHtml(plan) {
  const rows = Object.entries(plan.summary.kinds)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
  return `
    <article class="queue-plan-visual-card">
      <h3>Unit type mix</h3>
      <p>Selected aggregate units by normalized source type.</p>
      <div class="bar-list">${auditBarRows(rows, titleCase)}</div>
    </article>
  `;
}

function queuePlanStateBarsHtml(plan) {
  const counts = {};
  for (const item of plan.selected) {
    const stateCode = item.unit.state || "NA";
    counts[stateCode] = (counts[stateCode] || 0) + 1;
  }
  const rows = Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
    .slice(0, state.disclosureLevel === "overview" ? 8 : 16);
  return `
    <article class="queue-plan-visual-card">
      <h3>State coverage</h3>
      <p>Top states in this planned aggregate batch.</p>
      <div class="bar-list">${auditBarRows(rows, (label) => label)}</div>
    </article>
  `;
}

function queuePlanSignalBarsHtml(plan) {
  const rows = [
    { label: "OCR review rows", value: plan.summary.ocrRows },
    { label: "Duplicate text-hash rows", value: plan.summary.duplicateRows },
    { label: "Selected units", value: plan.summary.selectedUnits },
    { label: "States covered", value: plan.summary.states },
  ];
  return `
    <article class="queue-plan-visual-card">
      <h3>Review signals</h3>
      <p>Aggregate signals for the planned unit batch.</p>
      <div class="bar-list">${auditBarRows(rows, (label) => label)}</div>
    </article>
  `;
}

function queuePlanListHtml(plan) {
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  const visibleRows = showUnit ? plan.selected : plan.selected.slice(0, 10);
  return `
    <article class="queue-plan-list-card wide">
      <div class="coverage-matrix-heading">
        <div>
          <h3>Planned aggregate unit batch</h3>
          <p>Ranked units are candidates for a future bounded review package. This page does not create or publish LOCUS text records.</p>
        </div>
        <span>${escapeHtml(queuePlanStrategyLabel(plan.strategy))} · ${escapeHtml(formatCount(plan.selected.length))} units</span>
      </div>
      <div class="queue-plan-rows">
        ${
          visibleRows.length
            ? visibleRows.map((item, index) => queuePlanRowHtml(item, index)).join("")
            : '<p class="muted-note">No units match the current filters.</p>'
        }
      </div>
      ${
        !showUnit && plan.selected.length > visibleRows.length
          ? `<p class="muted-note">Switch to Unit detail to show all ${escapeHtml(formatCount(plan.selected.length))} planned units.</p>`
          : ""
      }
      ${
        showEvidence
          ? `<p class="muted-note">Export includes strategy, seed label, generated timestamp, unit IDs, aggregate row counts, audit signals, score spread, and source artifact names only. It excludes ordinance text, headers, source locators, SQLite state, and raw LOCUS rows.</p>`
          : `<p class="muted-note">Switch to Evidence trail to show the export boundary.</p>`
      }
    </article>
  `;
}

function queuePlanRowHtml(item, index) {
  const unit = item.unit;
  const audit = item.audit || {};
  return `
    <div class="queue-plan-row">
      <strong>${escapeHtml(String(index + 1).padStart(2, "0"))}</strong>
      <button type="button" data-open-queue-unit="${escapeHtml(unit.unit_id)}">${escapeHtml(displayUnitName(unit))}</button>
      <span>${escapeHtml(unit.state || "NA")} · ${escapeHtml(titleCase(unit.kind || "unknown"))} · ${escapeHtml(formatCount(unit.law_count))} rows</span>
      <em>score ${escapeHtml(item.score.toFixed(2))} · audit ${escapeHtml(formatNumber(audit.audit_attention_score || 0))}/100 · spread ${escapeHtml(scoreSpread(unit).toFixed(3))}</em>
    </div>
  `;
}

function queuePlanStrategyLabel(strategy) {
  return {
    audit_priority: "Audit priority",
    balanced_state: "Balanced states",
    score_contrast: "Score contrast",
    law_volume: "Law volume",
  }[strategy] || strategy;
}

function queuePlanPayload(plan = buildQueuePlan()) {
  return {
    schema_version: "evolocus-pages-queue-plan-v1",
    generated_at: plan.generatedAt,
    strategy: plan.strategy,
    strategy_label: queuePlanStrategyLabel(plan.strategy),
    seed_label: plan.seedLabel,
    source_artifacts: ["map_layers.json", "unit_audit_quality.json"],
    publication_policy: {
      aggregate_unit_ids_only: true,
      ordinance_text_included: false,
      raw_rows_included: false,
      source_locators_included: false,
      legal_findings: false,
    },
    summary: plan.summary,
    units: plan.selected.map((item, index) => ({
      rank: index + 1,
      unit_id: item.unit.unit_id,
      name: item.unit.name,
      state: item.unit.state,
      kind: item.unit.kind,
      law_count: Number(item.unit.law_count || 0),
      dominant_topic: item.unit.dominant_topic || null,
      dominant_function: item.unit.dominant_function || null,
      neutral_tier: item.unit.tier_label || item.unit.tier || null,
      queue_score: Number(item.score.toFixed(6)),
      audit_attention_score: Number(item.audit?.audit_attention_score || 0),
      ocr_review_rows: Number(item.audit?.ocr_review_rows || 0),
      duplicate_text_hash_rows: Number(item.audit?.duplicate_text_hash_rows || 0),
      score_spread: Number(scoreSpread(item.unit).toFixed(6)),
    })),
    limitations: [
      "This is an aggregate planning artifact, not a review queue containing LOCUS text.",
      "Use local ignored tooling to materialize bounded record-level queues from authorized local LOCUS Parquet.",
      "Scores and audit signals are review aids, not legal findings.",
    ],
  };
}

function reviewPackageRequestPayload(plan = buildQueuePlan()) {
  const status = state.analysis.status || {};
  const queuePlan = queuePlanPayload(plan);
  const seedSlug = slugify(plan.seedLabel || "pages-aggregate-plan");
  const suggestedRequestPath = `data/exports/requests/${seedSlug}-review-package-request.json`;
  const suggestedOutputPath = `data/exports/review-packages/${seedSlug}-browser-import.json`;
  const payload = {
    schema_version: "evolocus-review-package-request-v1",
    generated_at: plan.generatedAt,
    dataset_id: status.dataset_id || "LocalLaws/LOCUS-v1",
    dataset_revision: status.dataset_revision || state.analysis.mapLayers?.dataset_revision || "local",
    analysis_status: {
      analysis_state: status.analysis_state || "unknown",
      dataset_id: status.dataset_id || "LocalLaws/LOCUS-v1",
      dataset_revision: status.dataset_revision || state.analysis.mapLayers?.dataset_revision || "local",
      unit_count: Number(status.unit_count || 0),
      law_count: Number(status.law_count || 0),
      real_locus_rows_published: Boolean(status.real_locus_rows_published),
    },
    source_queue_plan: {
      schema_version: queuePlan.schema_version,
      generated_at: queuePlan.generated_at,
      strategy: queuePlan.strategy,
      strategy_label: queuePlan.strategy_label,
      seed_label: queuePlan.seed_label,
      summary: queuePlan.summary,
    },
    materialization: {
      seed_label: plan.seedLabel,
      max_records: Math.min(250, Math.max(1, plan.selected.length * 3)),
      max_records_per_unit: 3,
      suggested_request_path: suggestedRequestPath,
      suggested_output_path: suggestedOutputPath,
      include_content_flag_required_for_browser_review: true,
      default_output_omits_content: true,
    },
    publication_policy: {
      aggregate_unit_ids_only: true,
      ordinance_text_included: false,
      raw_rows_included: false,
      source_locators_included: false,
      browser_llm_calls: false,
      review_events_included: false,
      legal_findings: false,
    },
    units: queuePlan.units,
    local_command: "",
    limitations: [
      "This request is safe to share as aggregate planning metadata, but the materialized review package must remain local and ignored.",
      "Local materialization reads authorized Parquet and may include LOCUS text only when --include-content is explicit.",
      "The materialized package is for research review only and is not legal advice.",
    ],
  };
  payload.local_command = reviewPackageLocalCommand(payload);
  return payload;
}

function reviewPackagePreviewHtml(requestPayload, plan) {
  const units = requestPayload.units || [];
  const materialization = requestPayload.materialization || {};
  const policy = requestPayload.publication_policy || {};
  const stateCounts = countBy(units, (unit) => unit.state || "NA");
  const kindCounts = countBy(units, (unit) => unit.kind || "unknown");
  const topicCounts = countBy(units, (unit) => unit.dominant_topic || "Unknown");
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  const cards = [
    ["Requested units", formatCount(units.length), `${queuePlanStrategyLabel(plan.strategy)} strategy`],
    ["Record budget", formatCount(materialization.max_records || 0), `${formatCount(materialization.max_records_per_unit || 0)} per unit`],
    ["States", formatCount(Object.keys(stateCounts).length), topCountEntries(stateCounts, 3).map((row) => row.label).join(", ") || "none"],
    ["Public request", "Aggregate only", "No text, raw rows, source locator values, or review events"],
  ];
  return `
    <div class="package-preview-cards">
      ${cards
        .map(
          ([label, value, detail]) => `
            <article>
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(String(value))}</strong>
              <em>${escapeHtml(detail)}</em>
            </article>
          `,
        )
        .join("")}
    </div>
    <div class="package-preview-bars">
      ${packagePreviewBarCard("State mix", stateCounts, showUnit ? 8 : 4)}
      ${packagePreviewBarCard("Unit type mix", kindCounts, showUnit ? 6 : 3, titleCase)}
      ${packagePreviewBarCard("Topic mix", topicCounts, showUnit ? 6 : 3)}
    </div>
    <div class="package-safety-list">
      ${packageSafetyRows(policy, materialization, showEvidence)}
    </div>
  `;
}

function packagePreviewBarCard(title, counts, limit, labeler = (label) => label) {
  const rows = topCountEntries(counts, limit);
  return `
    <article class="package-preview-bar-card">
      <h4>${escapeHtml(title)}</h4>
      <div class="bar-list">${auditBarRows(rows, labeler)}</div>
    </article>
  `;
}

function packageSafetyRows(policy, materialization, showEvidence) {
  const rows = [
    ["Request text", policy.ordinance_text_included ? "blocked" : "clear", policy.ordinance_text_included ? "Text included" : "No ordinance text"],
    ["Raw rows", policy.raw_rows_included ? "blocked" : "clear", policy.raw_rows_included ? "Raw rows included" : "No raw rows"],
    ["Source locator values", policy.source_locators_included ? "blocked" : "clear", policy.source_locators_included ? "Values included" : "No source locator values"],
    ["Review events", policy.review_events_included ? "blocked" : "clear", policy.review_events_included ? "Events included" : "No review history"],
    ["Browser LLM calls", policy.browser_llm_calls ? "blocked" : "clear", policy.browser_llm_calls ? "Live calls enabled" : "No browser model calls"],
    ["Local text package", materialization.include_content_flag_required_for_browser_review ? "explicit" : "review", "--include-content required"],
  ];
  const visibleRows = showEvidence ? rows : rows.slice(0, 4);
  return `
    <article class="package-safety-card">
      <h4>Safety gates before download</h4>
      <div>
        ${visibleRows
          .map(
            ([label, stateLabel, detail]) => `
              <span class="package-safety-${escapeHtml(stateLabel)}">
                <strong>${escapeHtml(label)}</strong>
                <em>${escapeHtml(detail)}</em>
              </span>
            `,
          )
          .join("")}
      </div>
      ${
        showEvidence
          ? `<p class="muted-note">The downloaded request is safe aggregate metadata. The materialized package is local-only and must stay under ignored paths such as data/exports/.</p>`
          : `<p class="muted-note">Switch to Evidence trail to show all request safety gates.</p>`
      }
    </article>
  `;
}

function countBy(rows, keyFn) {
  const counts = {};
  for (const row of rows || []) {
    const key = keyFn(row);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function reviewPackageLocalCommand(requestPayload = reviewPackageRequestPayload()) {
  const revision = requestPayload.dataset_revision || "local";
  const materialization = requestPayload.materialization || {};
  const requestPath = materialization.suggested_request_path || "data/exports/requests/evolocus-review-package-request.json";
  const outputPath = materialization.suggested_output_path || "data/exports/review-packages/evolocus-browser-import.json";
  const maxRecords = Number(materialization.max_records || 250);
  const maxPerUnit = Number(materialization.max_records_per_unit || 3);
  return [
    "PYTHONPATH=src python -m evolocus.cli materialize-review-package",
    `--request ${requestPath}`,
    `--input 'data/raw/locus-v1/${revision}/**/*.parquet'`,
    `--output ${outputPath}`,
    `--dataset-revision '${revision}'`,
    `--max-records ${maxRecords}`,
    `--max-records-per-unit ${maxPerUnit}`,
    "--include-content",
  ].join(" ");
}

function exportReviewPackageRequest() {
  const payload = reviewPackageRequestPayload();
  download("evolocus-review-package-request.json", JSON.stringify(payload, null, 2), "application/json");
}

function slugify(value) {
  return String(value || "evolocus")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "evolocus";
}

function applyQueuePlan(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  state.queuePlan = {
    strategy: String(form.get("strategy") || "audit_priority"),
    size: Math.max(5, Math.min(100, Number(form.get("size") || 25))),
    seedLabel: String(form.get("seed_label") || "pages-aggregate-plan").trim() || "pages-aggregate-plan",
  };
  renderQueuePlan();
}

function exportQueuePlan() {
  const payload = queuePlanPayload();
  download("evolocus-aggregate-queue-plan.json", JSON.stringify(payload, null, 2), "application/json");
}

function currentViewSnapshotPayload() {
  const mapLayers = state.analysis.mapLayers;
  const status = state.analysis.status || {};
  const briefings = state.analysis.inquiryBriefings || {};
  const allUnits = mapLayers ? mapLayers.units || [] : [];
  const visibleUnits = mapLayers ? filterMapUnits(allUnits) : [];
  const visibleSummary = summarizeUnits(visibleUnits);
  const allSummary = summarizeUnits(allUnits);
  const auditSummary = inquiryAuditSummary(visibleUnits);
  const selectedUnit = currentSelectedMapUnit();
  const questionInput = $("#inquiry-form input[name='question']");
  return {
    schema_version: "evolocus-current-view-snapshot-v1",
    generated_at: new Date().toISOString(),
    dataset_id: status.dataset_id || briefings.dataset_id || "LocalLaws/LOCUS-v1",
    dataset_revision: status.dataset_revision || mapLayers?.dataset_revision || briefings.dataset_revision || "unknown",
    license: status.license || briefings.license || "CC-BY-NC-4.0",
    citation: status.citation || briefings.citation || "Peskoff, Barrow, Vu, and Davenport. Freeing the Law with LOCUS. arXiv:2606.19334, 2026.",
    source_artifacts: [
      "status.json",
      "map_layers.json",
      "unit_audit_quality.json",
      "inquiry_briefings.json",
      "county_geometry.json",
      "municipal_points.json",
    ],
    publication_policy: {
      aggregate_only: true,
      raw_rows_included: false,
      ordinance_text_included: false,
      record_locator_values_included: false,
      browser_llm_calls: false,
      review_events_included: false,
      legal_findings: false,
    },
    view_state: {
      active_tab: state.activeTab,
      disclosure_level: state.disclosureLevel,
      geography_color_mode: state.geographyColorMode,
      geography_layers: { ...state.geographyLayers },
      filters: { ...state.mapFilters },
      filter_labels: activeFilterLabels(),
      selected_unit_id: selectedUnit?.unit_id || null,
      inquiry_question: questionInput ? String(questionInput.value || "") : "",
    },
    visible_summary: currentViewSummaryPayload(visibleSummary, visibleUnits.length),
    full_layer_summary: currentViewSummaryPayload(allSummary, allUnits.length),
    audit_summary: {
      ocr_review_rows: auditSummary.reviewRows,
      duplicate_text_hash_rows: auditSummary.duplicateRows,
      visible_audit_attention_max: maxAuditAttention(visibleUnits),
    },
    package_summary: snapshotPackageSummary(allUnits, visibleUnits),
    grok_briefing: {
      used: Boolean(briefings.grok?.used),
      model: briefings.grok?.model || null,
      generated_at: briefings.generated_at || null,
      summary: briefings.grok_summary || null,
    },
    selected_unit: selectedUnit ? currentViewUnitPayload(selectedUnit) : null,
    visible_unit_sample: visibleUnits
      .slice()
      .sort((a, b) => Number(b.law_count || 0) - Number(a.law_count || 0) || displayUnitName(a).localeCompare(displayUnitName(b)))
      .slice(0, 25)
      .map(currentViewUnitPayload),
    limitations: [
      "This browser export contains aggregate map and inquiry metadata only.",
      "It excludes LOCUS ordinance text, headers, raw rows, record locators, browser review events, local databases, and secrets.",
      "Tiers, labels, audit signals, and scores are review aids, not legal findings or rankings.",
    ],
  };
}

function snapshotPackageSummary(allUnits, visibleUnits) {
  const allStats = importedPackageMapStats(allUnits);
  const visibleStats = importedPackageMapStats(visibleUnits);
  const meta = allStats.meta || {};
  const metrics = queueMetrics();
  const active = Boolean(allStats.imported);
  const textState = !active
    ? "No local package active"
    : allStats.syntheticDemo
      ? "Synthetic package text may be present locally; snapshot excludes text"
      : allStats.textIncluded
        ? "Local review text loaded in this browser; snapshot excludes text"
        : "Metadata-only package";
  const sourceLocatorState = !active
    ? "No local package active"
    : meta.source_locators_included
      ? "Source locator values may exist locally; snapshot excludes values"
      : "Source locator values not included in local package";
  const topUnits = Array.from(visibleStats.units.values())
    .sort((a, b) => b.recordCount - a.recordCount || displayUnitName(a.unit).localeCompare(displayUnitName(b.unit)))
    .slice(0, 10)
    .map((row) => ({
      unit_id: row.unitId,
      unit_name: displayUnitName(row.unit),
      state: row.unit.state || null,
      kind: row.unit.kind || null,
      record_count: row.recordCount,
      reviewed: row.reviewed,
      skipped: row.skipped,
      flagged: row.flagged,
      remaining: row.remaining,
    }));
  return {
    active,
    mode_label: active ? (allStats.syntheticDemo ? "Browser-local synthetic package" : "Browser-local imported package") : "Synthetic demo queue",
    synthetic_demo: Boolean(allStats.syntheticDemo),
    dataset_revision: allStats.datasetRevision || null,
    package_file: active ? allStats.fileName : null,
    imported_at: allStats.importedAt || null,
    package_record_count: allStats.recordCount,
    all_matched_record_count: allStats.matchedRecords,
    visible_matched_record_count: visibleStats.matchedRecords,
    all_matched_unit_count: allStats.units.size,
    visible_matched_unit_count: visibleStats.units.size,
    unmatched_record_count: allStats.unmatchedRecords,
    review_status: {
      reviewed: metrics.reviewed,
      skipped: metrics.skipped,
      flagged: metrics.flagged,
      remaining: metrics.remaining,
    },
    text_state: textState,
    source_locator_state: sourceLocatorState,
    publication_allowed: false,
    ordinance_text_included_in_snapshot: false,
    record_locator_values_included_in_snapshot: false,
    review_events_included_in_snapshot: false,
    topic_counts_top: topCountEntries(countBy(records, (record) => topicLabelForCoverage(record)), 5),
    function_counts_top: topCountEntries(countBy(records, (record) => normalizedCountLabel(record.function, "Unknown function")), 5),
    top_visible_units: topUnits,
  };
}

function currentViewSummaryPayload(summary, unitCount) {
  return {
    unit_count: unitCount,
    law_count: summary.lawCount,
    substantive_count: summary.substantiveCount,
    top_topic: summary.topTopic,
    top_function: summary.topFunction,
    tier_counts: summary.tierCounts,
    kind_counts: summary.kindCounts,
    topic_counts_top: topCountEntries(summary.topicCounts, 8),
    function_counts_top: topCountEntries(summary.functionCounts, 8),
    neutral_model_score_means: roundedScoreMeans(summary.scoreMeans),
  };
}

function currentViewUnitPayload(unit) {
  const audit = unitAuditQualityFor(unit.unit_id);
  return {
    unit_id: unit.unit_id,
    name: unit.name,
    state: unit.state,
    kind: unit.kind,
    law_count: Number(unit.law_count || 0),
    substantive_count: Number(unit.substantive_count || 0),
    dominant_topic: unit.dominant_topic || null,
    dominant_function: unit.dominant_function || null,
    neutral_tier: unit.tier_label || unit.tier || null,
    model_substantive_share: modelSubstantiveShare(unit),
    neutral_model_score_means: roundedScoreMeans(unit.model_score_means || {}),
    audit_attention_score: Number(audit?.audit_attention_score || 0),
    ocr_review_rows: Number(audit?.ocr_review_rows || 0),
    duplicate_text_hash_rows: Number(audit?.duplicate_text_hash_rows || 0),
  };
}

function topCountEntries(counts, limit) {
  return Object.entries(counts || {})
    .map(([label, value]) => ({ label, value: Number(value || 0) }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function roundedScoreMeans(scoreMeans) {
  return Object.fromEntries(
    Object.entries(scoreMeans || {})
      .map(([field, value]) => [field, Number(value)])
      .filter(([, value]) => Number.isFinite(value))
      .map(([field, value]) => [field, Number(value.toFixed(6))]),
  );
}

function maxAuditAttention(units) {
  return units.reduce((max, unit) => Math.max(max, Number(unitAuditQualityFor(unit.unit_id)?.audit_attention_score || 0)), 0);
}

function exportCurrentViewSnapshot() {
  const payload = currentViewSnapshotPayload();
  download("evolocus-current-view-snapshot.json", JSON.stringify(payload, null, 2), "application/json");
}

function saveCurrentViewSnapshot() {
  const payload = currentViewSnapshotPayload();
  const savedAt = new Date().toISOString();
  const snapshot = {
    snapshot_id: `snapshot-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    saved_at: savedAt,
    name: snapshotName(payload),
    payload,
  };
  saveSnapshots([snapshot, ...loadSnapshots()]);
  state.activeTab = "snapshots";
  render();
}

function snapshotName(payload) {
  const labels = payload.view_state?.filter_labels || [];
  const selected = payload.selected_unit?.name ? displayUnitName(payload.selected_unit.name) : "";
  if (labels.length) {
    return labels.join(" + ");
  }
  if (selected) {
    return selected;
  }
  return "All published aggregate units";
}

function snapshotGalleryPayload() {
  const snapshots = loadSnapshots();
  return {
    schema_version: "evolocus-snapshot-gallery-v1",
    generated_at: new Date().toISOString(),
    snapshot_count: snapshots.length,
    publication_policy: {
      aggregate_only: true,
      raw_rows_included: false,
      ordinance_text_included: false,
      record_locator_values_included: false,
      browser_llm_calls: false,
      review_events_included: false,
      legal_findings: false,
    },
    snapshots,
    limitations: [
      "Gallery snapshots are browser-local aggregate map/inquiry exports.",
      "They exclude ordinance text, headers, raw rows, record locators, local databases, review events, and secrets.",
    ],
  };
}

function exportSnapshotGallery() {
  download("evolocus-snapshot-gallery.json", JSON.stringify(snapshotGalleryPayload(), null, 2), "application/json");
}

function clearSnapshotGallery() {
  if (window.confirm("Clear saved aggregate snapshots from this browser?")) {
    saveSnapshots([]);
    renderSnapshotGallery();
  }
}

function loadSnapshotView(snapshotId) {
  const snapshot = loadSnapshots().find((item) => item.snapshot_id === snapshotId);
  if (!snapshot) {
    return;
  }
  const view = snapshot.payload.view_state || {};
  state.mapFilters = { ...defaultMapFilters(), ...(view.filters || {}) };
  state.selectedUnitId = view.selected_unit_id || null;
  state.disclosureLevel = view.disclosure_level || state.disclosureLevel;
  state.geographyColorMode = view.geography_color_mode || state.geographyColorMode;
  state.geographyLayers = { ...defaultGeographyLayers(), ...(view.geography_layers || {}) };
  state.activeTab = "map";
  render();
}

function deleteSnapshot(snapshotId) {
  saveSnapshots(loadSnapshots().filter((snapshot) => snapshot.snapshot_id !== snapshotId));
  renderSnapshotGallery();
}

function renderSnapshotGallery() {
  const summary = $("#snapshot-summary");
  const compare = $("#snapshot-compare");
  const list = $("#snapshot-list");
  if (!summary || !compare || !list) {
    return;
  }
  const snapshots = loadSnapshots();
  summary.innerHTML = snapshotSummaryHtml(snapshots);
  compare.innerHTML = snapshotCompareHtml(snapshots);
  list.innerHTML = snapshotListHtml(snapshots);
}

function snapshotSummaryHtml(snapshots) {
  const latest = snapshots[0];
  const totalUnits = snapshots.reduce((sum, snapshot) => sum + Number(snapshot.payload.visible_summary?.unit_count || 0), 0);
  const packageSnapshots = snapshots.filter((snapshot) => snapshot.payload.package_summary?.active);
  const cards = [
    ["Saved snapshots", formatCount(snapshots.length), "Browser-local aggregate views"],
    ["Latest", latest ? formatDateTime(latest.saved_at) : "None saved", latest ? latest.name : "Save the current map first"],
    ["Total visible-unit references", formatCount(totalUnits), "Sum across saved aggregate snapshots"],
    ["Package overlay snapshots", formatCount(packageSnapshots.length), "Saved views with local package counts"],
    ["Export boundary", "Aggregate only", "No text, locators, review events, or secrets"],
  ];
  return cards
    .map(
      ([label, value, detail]) => `
        <article class="snapshot-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(String(value))}</strong>
          <em>${escapeHtml(detail)}</em>
        </article>
      `,
    )
    .join("");
}

function snapshotCompareHtml(snapshots) {
  if (!snapshots.length) {
    return `<article class="snapshot-compare-card wide"><h3>No saved snapshots</h3><p>Use Save Current View from the Law Map or Inquiry tab to build a comparison gallery.</p></article>`;
  }
  const recent = snapshots.slice(0, 6);
  const maxLaws = Math.max(1, ...recent.map((snapshot) => Number(snapshot.payload.visible_summary?.law_count || 0)));
  const packageSnapshots = recent.filter((snapshot) => snapshot.payload.package_summary?.active);
  return `
    <article class="snapshot-compare-card wide">
      <div class="coverage-matrix-heading">
        <div>
          <h3>Recent aggregate snapshot comparison</h3>
          <p>Bars compare visible law rows in saved filtered views. Counts are aggregate LOCUS rows, not exported records.</p>
        </div>
        <span>${escapeHtml(formatCount(recent.length))} shown</span>
      </div>
      <div class="snapshot-bars">
        ${recent.map((snapshot) => snapshotBarHtml(snapshot, maxLaws)).join("")}
      </div>
    </article>
    ${snapshotPackageComparisonHtml(packageSnapshots)}
  `;
}

function snapshotBarHtml(snapshot, maxLaws) {
  const summary = snapshot.payload.visible_summary || {};
  const laws = Number(summary.law_count || 0);
  const width = Math.max(laws ? 4 : 0, (laws / maxLaws) * 100);
  return `
    <div class="snapshot-bar-row">
      <span>${escapeHtml(snapshot.name)}</span>
      <div><i style="width:${width}%"></i></div>
      <strong>${escapeHtml(formatCount(laws))}</strong>
      <em>${escapeHtml(formatCount(summary.unit_count || 0))} units · ${escapeHtml(summary.top_topic?.label || "No topic")}</em>
    </div>
  `;
}

function snapshotPackageComparisonHtml(snapshots) {
  if (!snapshots.length) {
    return `<article class="snapshot-compare-card"><h3>Package overlay snapshots</h3><p>No saved aggregate snapshot currently includes a browser-local package overlay.</p></article>`;
  }
  const maxRecords = Math.max(1, ...snapshots.map((snapshot) => Number(snapshot.payload.package_summary?.visible_matched_record_count || 0)));
  return `
    <article class="snapshot-compare-card wide">
      <div class="coverage-matrix-heading">
        <div>
          <h3>Package overlay snapshots</h3>
          <p>Bars compare locally imported package matches in the saved filtered views. Snapshot payloads exclude ordinance text, record locators, and review events.</p>
        </div>
        <span>${escapeHtml(formatCount(snapshots.length))} active</span>
      </div>
      <div class="snapshot-bars package-snapshot-bars">
        ${snapshots.map((snapshot) => snapshotPackageBarHtml(snapshot, maxRecords)).join("")}
      </div>
    </article>
  `;
}

function snapshotPackageBarHtml(snapshot, maxRecords) {
  const summary = snapshot.payload.package_summary || {};
  const recordsMatched = Number(summary.visible_matched_record_count || 0);
  const width = Math.max(recordsMatched ? 4 : 0, (recordsMatched / maxRecords) * 100);
  return `
    <div class="snapshot-bar-row package-snapshot-row">
      <span>${escapeHtml(snapshot.name)}</span>
      <div><i style="width:${width}%"></i></div>
      <strong>${escapeHtml(formatCount(recordsMatched))}</strong>
      <em>${escapeHtml(formatCount(summary.visible_matched_unit_count || 0))} matched units · ${escapeHtml(summary.text_state || "snapshot excludes text")}</em>
    </div>
  `;
}

function snapshotListHtml(snapshots) {
  if (!snapshots.length) {
    return `<article class="snapshot-list-card"><p class="muted-note">No browser-local aggregate snapshots are saved yet.</p></article>`;
  }
  return snapshots.map(snapshotCardHtml).join("");
}

function snapshotCardHtml(snapshot) {
  const payload = snapshot.payload;
  const summary = payload.visible_summary || {};
  const selected = payload.selected_unit;
  const filters = payload.view_state?.filter_labels || [];
  const packageSummary = payload.package_summary || {};
  return `
    <article class="snapshot-list-card">
      <div>
        <span>${escapeHtml(formatDateTime(snapshot.saved_at))}</span>
        <h3>${escapeHtml(snapshot.name)}</h3>
        <p>${escapeHtml(formatCount(summary.unit_count || 0))} visible units · ${escapeHtml(formatCount(summary.law_count || 0))} aggregate rows · top topic ${escapeHtml(summary.top_topic?.label || "No topic")}</p>
        ${
          packageSummary.active
            ? `<p class="snapshot-package-row">${escapeHtml(formatCount(packageSummary.visible_matched_unit_count || 0))} package units · ${escapeHtml(formatCount(packageSummary.visible_matched_record_count || 0))} package records · ${escapeHtml(packageSummary.text_state || "snapshot excludes text")}</p>`
            : `<p class="snapshot-package-row">No package overlay stored in this snapshot.</p>`
        }
        <p>${escapeHtml(selected ? `Selected ${displayUnitName(selected.name)} (${selected.state})` : "No selected unit stored")}</p>
        <em>${escapeHtml(filters.length ? filters.join(" · ") : "No active filters")}</em>
      </div>
      <div class="snapshot-card-actions">
        <button type="button" data-load-snapshot="${escapeHtml(snapshot.snapshot_id)}">Load View</button>
        <button type="button" data-delete-snapshot="${escapeHtml(snapshot.snapshot_id)}">Delete</button>
      </div>
    </article>
  `;
}

function renderAnalysisCharts() {
  const charts = state.analysis.charts ? state.analysis.charts.charts || {} : null;
  const grid = $("#analysis-chart-grid");
  if (!charts) {
    grid.innerHTML = `<article class="chart-card"><h3>Analysis charts loading</h3><p>Static chart artifacts have not loaded yet.</p></article>`;
    return;
  }
  grid.innerHTML = [
    chartInquiryCard(),
    chartRouteLegendCard(),
    chartQuestionChipsCard(),
    chartCard("Tier distribution", charts.tier_counts || [], "tier"),
    chartCard("Topic distribution", charts.topic_counts || [], "topic"),
    chartCard("Function distribution", charts.function_counts || [], "function"),
    chartCard("Jurisdiction kind", charts.kind_counts || [], "kind"),
    scoreCard("Neutral score means", charts.score_means || []),
    topUnitsCard(charts.top_units || []),
  ].join("");
}

function chartRouteLegendCard() {
  const mapLayers = state.analysis.mapLayers;
  const units = mapLayers ? filterMapUnits(mapLayers.units || []) : [];
  const summary = summarizeUnits(units);
  const target = chartRouteTarget(summary, mapLayers);
  const filters = activeFilterLabels();
  const selectedUnit = currentSelectedMapUnit();
  const stages = [
    {
      key: "scope",
      label: "Chart scope",
      value: `${formatCount(units.length)} units`,
      detail: `${formatCount(summary.lawCount)} aggregate rows from public JSON`,
    },
    {
      key: "map",
      label: "Map route",
      value: filters.length ? filters.slice(0, 2).join(" · ") : target.label,
      detail: "Applies browser filters only",
    },
    {
      key: "inquiry",
      label: "Inquiry route",
      value: "Deterministic answer",
      detail: "Saved to browser-local aggregate log",
    },
    {
      key: "ontology",
      label: "Ontology route",
      value: selectedUnit ? displayUnitName(selectedUnit) : target.label,
      detail: "Opens graph context and tier focus",
    },
    {
      key: "boundary",
      label: "Boundary",
      value: "No row text",
      detail: "No locators, secrets, or live model calls",
    },
  ];
  return `
    <article class="chart-route-legend-card">
      <div class="chart-route-heading">
        <div>
          <p class="eyebrow">Progressive chart route</p>
          <h3>Chart -> Map -> Inquiry -> Ontology</h3>
          <p>Animated route over the current aggregate chart scope. Each action reuses published aggregate counts, filters, and unit IDs only.</p>
        </div>
        <span>${escapeHtml(target.detail)}</span>
      </div>
      <div class="chart-route-strip" aria-label="Animated chart route legend">
        ${stages.map((stage, index) => chartRouteStageHtml(stage, index)).join("")}
      </div>
      <div class="chart-route-actions">
        <button type="button" data-chart-route-action="map">Open map route</button>
        <button type="button" data-chart-route-action="ask">Ask route</button>
        <button type="button" data-chart-route-action="graph">Graph route</button>
      </div>
      <p class="chart-drilldown-note">The route legend is navigational context, not evidence or legal analysis. Chart map actions brush matching counties and towns on the Law Map without expanding beyond aggregate map, inquiry, and ontology artifacts.</p>
    </article>
  `;
}

function chartRouteStageHtml(stage, index) {
  return `
    <section class="chart-route-stage ${escapeHtml(stage.key)}" style="--route-delay:${index * 120}ms">
      <span>${escapeHtml(stage.label)}</span>
      <strong>${escapeHtml(stage.value)}</strong>
      <em>${escapeHtml(stage.detail)}</em>
    </section>
  `;
}

function chartRouteTarget(summary, mapLayers) {
  if (summary.topTopic.value > 0) {
    return {
      action: "topic",
      value: summary.topTopic.label,
      label: `${summary.topTopic.label} topic`,
      detail: `${formatCount(summary.topTopic.value)} top-topic rows`,
    };
  }
  const topTier = topEntry(summary.tierCounts);
  if (topTier.value > 0) {
    return {
      action: "tier",
      value: tierKeyForLabel(topTier.label, mapLayers?.tier_definitions || {}),
      label: topTier.label,
      detail: `${formatCount(topTier.value)} top-tier units`,
    };
  }
  return {
    action: "view",
    value: "",
    label: "current chart scope",
    detail: "current aggregate filters",
  };
}

function chartInquiryCard() {
  const mapLayers = state.analysis.mapLayers;
  const units = mapLayers ? filterMapUnits(mapLayers.units || []) : [];
  const summary = summarizeUnits(units);
  const tierDefinitions = mapLayers?.tier_definitions || {};
  const topTier = topEntry(summary.tierCounts);
  const topTierKey = tierKeyForLabel(topTier.label, tierDefinitions);
  const topTopic = summary.topTopic.value > 0 ? summary.topTopic.label : "";
  const topUnit = summary.topUnit;
  const scope = activeFilterLabels().join(" · ") || "No active map filters";
  return `
    <article class="chart-card chart-inquiry-card">
      <div>
        <h3>Ask this chart view</h3>
        <p>Route the current aggregate chart scope into deterministic Inquiry answers. These actions update browser state only and do not call a model endpoint.</p>
      </div>
      <div class="chart-inquiry-summary">
        <span>${escapeHtml(formatCount(units.length))} visible units</span>
        <span>${escapeHtml(formatCount(summary.lawCount))} law records</span>
        <span>${escapeHtml(scope)}</span>
      </div>
      <div class="chart-inquiry-actions">
        ${chartInquiryButton("view", "", "Ask current view", "Visible aggregate chart scope", true, "", "current chart view")}
        ${chartOntologyButton("view", "", "Open current ontology", "Visible chart scope", true, "", "current chart view")}
        ${chartInquiryButton("topic", topTopic, "Ask top topic", topTopic ? `${topTopic} · ${formatCount(summary.topTopic.value)} rows` : "No topic rows", Boolean(topTopic), "", topTopic)}
        ${chartOntologyButton("topic", topTopic, "Graph top topic", topTopic ? `${topTopic} · ${formatCount(summary.topTopic.value)} rows` : "No topic rows", Boolean(topTopic), "", topTopic)}
        ${chartInquiryButton("tier", topTierKey, "Ask top tier", topTier.value ? `${topTier.label} · ${formatCount(topTier.value)} units` : "No tier rows", topTier.value > 0, "", topTier.label)}
        ${chartOntologyButton("tier", topTierKey, "Graph top tier", topTier.value ? `${topTier.label} · ${formatCount(topTier.value)} units` : "No tier rows", topTier.value > 0, "", topTier.label)}
        ${
          topUnit
            ? chartInquiryButton("unit", topUnit.unit_id, "Ask top unit", `${displayUnitName(topUnit)} · ${topUnit.state || "NA"}`, true, "", displayUnitName(topUnit))
            : chartInquiryButton("unit", "", "Ask top unit", "No visible unit", false)
        }
        ${
          topUnit
            ? chartOntologyButton("unit", topUnit.unit_id, "Graph top unit", `${displayUnitName(topUnit)} · ${topUnit.state || "NA"}`, true, "", displayUnitName(topUnit))
            : chartOntologyButton("unit", "", "Graph top unit", "No visible unit", false)
        }
      </div>
      <p class="chart-drilldown-note">Inquiry answers are generated from published aggregate JSON artifacts and omit ordinance text, source locators, review events, and browser model calls.</p>
    </article>
  `;
}

function chartQuestionChipsCard() {
  const mapLayers = state.analysis.mapLayers;
  const units = mapLayers ? filterMapUnits(mapLayers.units || []) : [];
  if (!units.length) {
    return `
      <article class="chart-card chart-question-chip-card empty">
        <span>Chart-to-chat question chips</span>
        <strong>No visible aggregate units for question chips.</strong>
        <p>Adjust map filters to restore chart-derived Inquiry prompts.</p>
      </article>
    `;
  }
  const summary = summarizeUnits(units);
  const rows = chartQuestionChipRows(summary, units, mapLayers);
  return `
    <article class="chart-card chart-question-chip-card" aria-label="Chart-to-chat question chips">
      <div class="chart-question-chip-heading">
        <div>
          <span>Chart-to-chat question chips</span>
          <strong>Reusable questions from current aggregate charts.</strong>
        </div>
        <em>${escapeHtml(formatCount(units.length))} units · ${escapeHtml(formatCount(summary.lawCount))} aggregate rows</em>
      </div>
      <div class="chart-question-chip-grid">
        ${rows.map(chartQuestionChipHtml).join("")}
      </div>
      <p>Question chips are generated from visible aggregate chart rows and route into deterministic Inquiry only, with no browser model calls, ordinance text, source locators, or legal findings.</p>
    </article>
  `;
}

function chartQuestionChipRows(summary, units, mapLayers) {
  const tierDefinitions = mapLayers?.tier_definitions || {};
  const topTier = topEntry(summary.tierCounts || {});
  const topTierKey = topTier.value ? tierKeyForLabel(topTier.label, tierDefinitions) : "";
  const rows = [
    chartQuestionChipRow("view", "", "Current view", "Visible aggregate chart scope", "", "current chart view"),
    chartQuestionChipRow("score", "", "Score profile", "Neutral model-output score means", "", "score profile"),
  ];
  if (summary.topTopic.value > 0) {
    rows.push(chartQuestionChipRow("topic", summary.topTopic.label, `Topic: ${summary.topTopic.label}`, `${formatCount(summary.topTopic.value)} aggregate rows`, "", summary.topTopic.label));
  }
  if (summary.topFunction.value > 0) {
    rows.push(chartQuestionChipRow("function", summary.topFunction.label, `Function: ${summary.topFunction.label}`, `${formatCount(summary.topFunction.value)} aggregate rows`, "", summary.topFunction.label));
  }
  if (topTier.value > 0 && topTierKey) {
    rows.push(chartQuestionChipRow("tier", topTierKey, `Tier: ${topTier.label}`, `${formatCount(topTier.value)} visible units`, "", topTier.label));
  }
  if (summary.topUnit) {
    rows.push(
      chartQuestionChipRow(
        "unit",
        summary.topUnit.unit_id,
        `Unit: ${displayUnitName(summary.topUnit)}`,
        `${summary.topUnit.state || "NA"} · ${formatCount(summary.topUnit.law_count)} rows`,
        "",
        displayUnitName(summary.topUnit),
      ),
    );
  }
  const limit = state.disclosureLevel === "overview" ? 4 : 6;
  return rows.slice(0, limit).map((row) => ({
    ...row,
    question: chartInquiryQuestion(row.action, row.value, row.questionLabel, row.stateCode),
  }));
}

function chartQuestionChipRow(action, value, label, detail, stateCode = "", questionLabel = "") {
  return {
    action,
    value,
    label,
    detail,
    stateCode,
    questionLabel,
  };
}

function chartQuestionChipHtml(row) {
  return `
    <button type="button" class="chart-question-chip" data-chart-question-chip="${escapeHtml(row.action)}" data-chart-question-value="${escapeHtml(row.value)}" data-chart-question-state="${escapeHtml(row.stateCode || "")}" data-chart-question-label="${escapeHtml(row.questionLabel || row.label)}">
      <span>${escapeHtml(row.label)}</span>
      <strong>${escapeHtml(row.question)}</strong>
      <em>${escapeHtml(row.detail)}</em>
    </button>
  `;
}

function applyChartQuestionChip(action, value, label = "", stateCode = "") {
  if (!action) {
    return;
  }
  applyChartInquiryAction(action, value, label, stateCode);
}

function chartCard(title, rows, action = "") {
  const max = Math.max(1, ...rows.map((row) => Number(row.value || 0)));
  return `
    <article class="chart-card">
      <h3>${escapeHtml(title)}</h3>
      <div class="bar-list">
        ${rows
          .map((row) => {
            const value = row.id || row.label;
            const enabled = chartMapFilterEnabled(action, value);
            return `
              <div class="chart-drilldown-line">
                <button type="button" class="bar-row chart-drilldown-row${enabled ? "" : " disabled"}" ${enabled ? "" : "disabled"} data-chart-map-filter="${escapeHtml(enabled ? action : "")}" data-chart-map-value="${escapeHtml(enabled ? value : "")}" data-chart-map-label="${escapeHtml(enabled ? row.label : "")}">
                  <span>${escapeHtml(row.label)}</span>
                  <div><i style="width:${Math.max(3, (Number(row.value || 0) / max) * 100)}%"></i></div>
                  <strong>${escapeHtml(String(row.value))}</strong>
                </button>
                ${chartInquiryButton(action, value, "Ask", `Inquiry for ${row.label}`, enabled, "", row.label, "compact")}
                ${chartOntologyButton(action, value, "Graph", `Ontology for ${row.label}`, enabled, "", row.label, "compact")}
              </div>
            `;
          })
          .join("") || "<p>No aggregate rows.</p>"}
      </div>
      <p class="chart-drilldown-note">Click a row to brush/filter the Law Map, or Ask to open a deterministic Inquiry answer. This changes browser state only.</p>
    </article>
  `;
}

function scoreCard(title, rows) {
  const values = rows.map((row) => Number(row.value)).filter((value) => Number.isFinite(value));
  const min = values.length ? Math.min(0, ...values) : 0;
  const max = values.length ? Math.max(0, ...values) : 1;
  const span = Math.max(0.000001, max - min);
  return `
    <article class="chart-card">
      <h3>${escapeHtml(title)}</h3>
      <div class="bar-list">
        ${rows
          .map((row) => {
            const value = Number(row.value);
            const width = Number.isFinite(value) ? ((value - min) / span) * 100 : 0;
            return `
              <div class="bar-row">
                <span>${escapeHtml(row.label)}</span>
                <div><i style="width:${Math.max(3, width)}%"></i></div>
                <strong>${escapeHtml(Number.isFinite(value) ? value.toFixed(3) : "n/a")}</strong>
              </div>
            `;
          })
          .join("")}
      </div>
      <div class="chart-inquiry-actions compact">
        ${chartInquiryButton("score", "", "Ask score profile", "Current filtered map view", true, "", "score profile")}
        ${chartOntologyButton("score", "", "Open model graph", "Current filtered map view", true, "", "score profile")}
      </div>
      <p>Scores are neutral model outputs; direction is not verified.</p>
    </article>
  `;
}

function topUnitsCard(rows) {
  return `
    <article class="chart-card">
      <h3>Top units by artifact law count</h3>
      <ol class="top-unit-list">
        ${rows
          .slice(0, 8)
          .map((row) => `
            <li class="top-unit-list-row">
              <button type="button" data-chart-map-unit="${escapeHtml(row.unit_id || "")}">
                <strong>${escapeHtml(displayUnitName(row.name))}</strong>
                <span>${escapeHtml(row.state)} · ${escapeHtml(String(row.law_count))} laws · ${escapeHtml(row.tier_label)}</span>
              </button>
              ${chartInquiryButton("unit", row.unit_id || "", "Ask", "Selected-unit inquiry", Boolean(row.unit_id), "", displayUnitName(row.name), "compact")}
              ${chartOntologyButton("unit", row.unit_id || "", "Graph", "Selected-unit ontology", Boolean(row.unit_id), "", displayUnitName(row.name), "compact")}
            </li>
          `)
          .join("")}
      </ol>
      <p class="chart-drilldown-note">Click a unit to open it on the Law Map with unit-level disclosure.</p>
    </article>
  `;
}

function renderStateTopicCharts() {
  const mapLayers = state.analysis.mapLayers;
  const grid = $("#state-topic-grid");
  if (!mapLayers) {
    grid.innerHTML = `<article class="state-topic-card"><h3>State/topic charts loading</h3><p>Aggregate map artifacts have not loaded yet.</p></article>`;
    return;
  }
  const units = filterMapUnits(mapLayers.units || []);
  const allUnits = mapLayers.units || [];
  const summaries = stateSummaries(units).slice(0, 12);
  const allSummary = summarizeUnits(allUnits);
  grid.innerHTML = `
    <article class="state-topic-card wide">
      <h3>Filtered layer vs full aggregate layer</h3>
      <div class="state-topic-meta">
        <span>${escapeHtml(formatCount(units.length))} visible units</span>
        <span>${escapeHtml(formatCount(summarizeUnits(units).lawCount))} visible law records</span>
        <span>${escapeHtml(formatPercent(summarizeUnits(units).lawCount, allSummary.lawCount))} of published aggregate layer</span>
      </div>
      <div class="topic-strip">${topicStrip(summarizeUnits(units).topicCounts, allSummary.topicCounts)}</div>
      <p class="chart-drilldown-note">Topic bars and state cards can route back to the Law Map using aggregate filters only.</p>
    </article>
    ${
      summaries.length
        ? summaries.map(stateTopicCard).join("")
        : '<article class="state-topic-card"><h3>No matching states</h3><p>Adjust map filters to restore aggregate chart data.</p></article>'
    }
  `;
}

function renderCoverageMatrix() {
  const mapLayers = state.analysis.mapLayers;
  const grid = $("#coverage-matrix-grid");
  if (!grid) {
    return;
  }
  if (!mapLayers) {
    grid.innerHTML = `<article class="coverage-matrix-card wide"><h3>Coverage atlas loading</h3><p>Aggregate map artifacts have not loaded yet.</p></article>`;
    return;
  }
  const units = filterMapUnits(mapLayers.units || []);
  const rows = coverageMatrixRows(units);
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  const visibleRows = showUnit ? rows : rows.slice(0, 12);
  grid.innerHTML = `
    <article class="coverage-matrix-card wide">
      <div class="coverage-matrix-heading">
        <div>
          <h3>County/town aggregate coverage atlas</h3>
          <p>State rows summarize county and municipal source units in the current filtered aggregate layer. Colors are neutral tier bands, not legal rankings.</p>
        </div>
        <span>${escapeHtml(formatCount(units.length))} units · ${escapeHtml(formatCount(summarizeUnits(units).lawCount))} law records</span>
      </div>
      <div class="coverage-matrix-list">
        ${
          visibleRows.length
            ? visibleRows.map((row) => coverageMatrixRow(row, mapLayers.tier_definitions || {})).join("")
            : '<p class="muted-note">No state coverage rows match the current filters.</p>'
        }
      </div>
      ${
        !showUnit && rows.length > visibleRows.length
          ? `<p class="muted-note">Switch to Unit detail to show all ${escapeHtml(formatCount(rows.length))} state rows.</p>`
          : ""
      }
      ${
        showEvidence
          ? `<p class="muted-note">Geometry evidence status: ${escapeHtml(mapLayers.geometry_status || "not recorded")}. This atlas uses aggregate unit metadata until reviewed county/town geometries are available.</p>`
          : ""
      }
    </article>
  `;
}

function coverageMatrixRows(units) {
  const grouped = new Map();
  for (const unit of units) {
    const stateCode = unit.state || "NA";
    if (!grouped.has(stateCode)) {
      grouped.set(stateCode, {
        state: stateCode,
        lawCount: 0,
        substantiveCount: 0,
        countyUnits: 0,
        municipalUnits: 0,
        unknownUnits: 0,
        tierCounts: {},
        kindCounts: {},
        topTopicCounts: {},
      });
    }
    const row = grouped.get(stateCode);
    row.lawCount += Number(unit.law_count || 0);
    row.substantiveCount += Number(unit.substantive_count || 0);
    row.tierCounts[unit.tier || "no_data"] = (row.tierCounts[unit.tier || "no_data"] || 0) + 1;
    row.kindCounts[unit.kind || "unknown"] = (row.kindCounts[unit.kind || "unknown"] || 0) + 1;
    addCounts(row.topTopicCounts, unit.topic_counts || {});
    if (unit.kind === "county") {
      row.countyUnits += 1;
    } else if (unit.kind === "city") {
      row.municipalUnits += 1;
    } else {
      row.unknownUnits += 1;
    }
  }
  return [...grouped.values()].sort((a, b) => b.lawCount - a.lawCount || a.state.localeCompare(b.state));
}

function coverageMatrixRow(row, tierDefinitions) {
  const totalUnits = row.countyUnits + row.municipalUnits + row.unknownUnits;
  const topTopic = topEntry(row.topTopicCounts);
  const tiers = Object.keys(tierDefinitions).length ? Object.keys(tierDefinitions) : Object.keys(row.tierCounts).sort();
  return `
    <div class="coverage-matrix-row">
      <div class="coverage-state">
        <strong>${escapeHtml(row.state)}</strong>
        <span>${escapeHtml(formatCount(row.lawCount))} laws · ${escapeHtml(formatCount(totalUnits))} units</span>
      </div>
      <div class="coverage-kind-bars" aria-label="County and municipal unit mix">
        ${coverageKindSegment("County", row.countyUnits, totalUnits)}
        ${coverageKindSegment("Municipal", row.municipalUnits, totalUnits)}
        ${coverageKindSegment("Unknown", row.unknownUnits, totalUnits)}
      </div>
      <div class="coverage-tier-bars" aria-label="Neutral tier mix">
        ${tiers
          .map((tier) => coverageTierSegment(tier, row.tierCounts[tier] || 0, totalUnits, tierDefinitions[tier]))
          .join("")}
      </div>
      <span class="coverage-topic">Top topic: ${escapeHtml(topTopic.label)} (${escapeHtml(formatCount(topTopic.value))})</span>
    </div>
  `;
}

function coverageKindSegment(label, value, total) {
  const width = total ? (Number(value || 0) / total) * 100 : 0;
  return `<span style="width:${Math.max(value ? 7 : 0, width)}%"><strong>${escapeHtml(label)}</strong><em>${escapeHtml(formatCount(value))}</em></span>`;
}

function coverageTierSegment(tier, value, total, definition = {}) {
  const width = total ? (Number(value || 0) / total) * 100 : 0;
  const color = definition.color || "#d8dee8";
  const label = definition.label || tier;
  return `<span style="width:${Math.max(value ? 7 : 0, width)}%; background:${escapeHtml(color)}" title="${escapeHtml(label)}: ${escapeHtml(formatCount(value))}">${escapeHtml(formatCount(value))}</span>`;
}

function stateSummaries(units) {
  const grouped = new Map();
  for (const unit of units) {
    const stateCode = unit.state || "NA";
    if (!grouped.has(stateCode)) {
      grouped.set(stateCode, { state: stateCode, units: 0, lawCount: 0, substantiveCount: 0, topicCounts: {}, tierCounts: {} });
    }
    const summary = grouped.get(stateCode);
    summary.units += 1;
    summary.lawCount += Number(unit.law_count || 0);
    summary.substantiveCount += Number(unit.substantive_count || 0);
    addCounts(summary.topicCounts, unit.topic_counts || {});
    summary.tierCounts[unit.tier_label || unit.tier || "Unspecified"] = (summary.tierCounts[unit.tier_label || unit.tier || "Unspecified"] || 0) + 1;
  }
  return [...grouped.values()].sort((a, b) => b.lawCount - a.lawCount || a.state.localeCompare(b.state));
}

function stateTopicCard(summary) {
  const topTopic = topEntry(summary.topicCounts);
  return `
    <article class="state-topic-card">
      <div class="state-topic-heading">
        <h3>${escapeHtml(summary.state)}</h3>
        <span>${escapeHtml(formatCount(summary.lawCount))} laws · ${escapeHtml(formatCount(summary.units))} units</span>
      </div>
      <p>Top topic: ${escapeHtml(topTopic.label)} (${escapeHtml(formatCount(topTopic.value))})</p>
      <div class="topic-strip">${topicStrip(summary.topicCounts, null, summary.state)}</div>
      <div class="tier-strip">${tierStrip(summary.tierCounts)}</div>
      <div class="state-topic-actions">
        <button type="button" data-chart-state-map="${escapeHtml(summary.state)}">Open state on map</button>
        <button type="button" data-chart-state-topic-map="${escapeHtml(summary.state)}" data-chart-topic-map="${escapeHtml(topTopic.label)}">Map top topic</button>
        ${chartInquiryButton("state", summary.state, "Ask state", `${formatCount(summary.lawCount)} rows`, true, summary.state, summary.state)}
        ${chartInquiryButton("state_topic", topTopic.label, "Ask top topic", `${topTopic.label} · ${formatCount(topTopic.value)} rows`, topTopic.value > 0, summary.state, topTopic.label)}
        ${chartOntologyButton("state", summary.state, "Graph state", `${formatCount(summary.lawCount)} rows`, true, summary.state, summary.state)}
        ${chartOntologyButton("state_topic", topTopic.label, "Graph topic", `${topTopic.label} · ${formatCount(topTopic.value)} rows`, topTopic.value > 0, summary.state, topTopic.label)}
      </div>
    </article>
  `;
}

function topicStrip(topicCounts, baselineCounts = null, stateCode = "") {
  const rows = Object.entries(topicCounts)
    .filter(([label, value]) => label !== "Not_applicable" && Number(value || 0) > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const total = rows.reduce((sum, [, value]) => sum + Number(value || 0), 0);
  if (!rows.length) {
    return '<p class="muted-note">No topic aggregate rows.</p>';
  }
  return rows
    .map(([label, value]) => {
      const share = total ? Number(value || 0) / total : 0;
      const baselineShare = baselineCounts ? Number(baselineCounts[label] || 0) / Math.max(1, Object.values(baselineCounts).reduce((sum, item) => sum + Number(item || 0), 0)) : null;
      return `
        <button type="button" class="topic-strip-row" data-chart-topic-map="${escapeHtml(label)}" data-chart-state-map="${escapeHtml(stateCode)}">
          <span>${escapeHtml(label)}</span>
          <div>
            <i style="width:${Math.max(2, share * 100)}%"></i>
            ${baselineShare === null ? "" : `<b style="width:${Math.max(2, baselineShare * 100)}%"></b>`}
          </div>
          <strong>${escapeHtml(formatPercent(share, 1))}</strong>
        </button>
      `;
    })
    .join("");
}

function tierStrip(tierCounts) {
  const rows = Object.entries(tierCounts).sort((a, b) => a[0].localeCompare(b[0]));
  const total = rows.reduce((sum, [, value]) => sum + Number(value || 0), 0);
  return `
    <div class="tier-mini-strip">
      ${rows
        .map(([label, value]) => `<span style="width:${Math.max(4, (Number(value || 0) / Math.max(1, total)) * 100)}%">${escapeHtml(label.replace("Tier ", "T"))}</span>`)
        .join("")}
    </div>
  `;
}

function chartMapFilterEnabled(action, value) {
  if (!action || !value) {
    return false;
  }
  if (action === "topic") {
    return value !== "Not_applicable";
  }
  return ["tier", "function", "kind"].includes(action);
}

function chartBrushQuestion(action, value, label = "", stateCode = "") {
  const displayLabel = label || value || "current chart scope";
  if (action === "topic") {
    return `Brush chart topic ${displayLabel} on the Law Map`;
  }
  if (action === "function") {
    return `Brush chart function ${displayLabel} on the Law Map`;
  }
  if (action === "kind") {
    return `Brush chart unit type ${displayLabel} on the Law Map`;
  }
  if (action === "tier") {
    return `Brush chart neutral tier ${displayLabel} on the Law Map`;
  }
  if (action === "state_topic") {
    return `Brush chart topic ${displayLabel} in ${stateCode || "this state"} on the Law Map`;
  }
  if (action === "state") {
    return `Brush chart state ${stateCode || displayLabel} on the Law Map`;
  }
  if (action === "unit") {
    return `Brush chart unit ${displayLabel} on the Law Map`;
  }
  return "Brush current chart scope on the Law Map";
}

function setChartBrushHighlight(action, value, label = "", stateCode = "") {
  const units = filterMapUnits(state.analysis.mapLayers?.units || []);
  const question = chartBrushQuestion(action, value, label, stateCode);
  state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(question, "charts tab brush", units);
}

function applyChartMapFilter(action, value, label = "") {
  if (!chartMapFilterEnabled(action, value)) {
    return;
  }
  state.mapFilters = {
    ...state.mapFilters,
    topic: action === "topic" ? value : state.mapFilters.topic,
    function: action === "function" ? value : state.mapFilters.function,
    kind: action === "kind" ? normalizePackageKind(value) : state.mapFilters.kind,
    tier: action === "tier" ? value : state.mapFilters.tier,
  };
  state.selectedUnitId = null;
  setChartBrushHighlight(action, value, label || value);
  state.activeTab = "map";
  render();
}

function applyChartStateTopicFilter(stateCode, topic) {
  const validTopic = topic && topic !== "No matching rows" ? topic : "";
  state.mapFilters = {
    ...state.mapFilters,
    state: stateCode || state.mapFilters.state,
    topic: validTopic || state.mapFilters.topic,
  };
  state.selectedUnitId = null;
  setChartBrushHighlight(validTopic ? "state_topic" : "state", validTopic || stateCode, validTopic || stateCode, stateCode);
  state.activeTab = "map";
  render();
}

function chartInquiryButton(action, value, label, detail, enabled = true, stateCode = "", questionLabel = "", variant = "") {
  const disabled = !enabled || (action !== "view" && action !== "score" && !value);
  return `
    <button type="button" class="chart-inquiry-chip${variant ? ` ${escapeHtml(variant)}` : ""}${disabled ? " disabled" : ""}" ${disabled ? "disabled" : ""} data-chart-inquiry-action="${escapeHtml(disabled ? "" : action)}" data-chart-inquiry-value="${escapeHtml(disabled ? "" : value)}" data-chart-inquiry-state="${escapeHtml(disabled ? "" : stateCode)}" data-chart-inquiry-label="${escapeHtml(disabled ? "" : questionLabel)}">
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(detail)}</span>
    </button>
  `;
}

function chartOntologyButton(action, value, label, detail, enabled = true, stateCode = "", focusLabel = "", variant = "") {
  const disabled = !enabled || (action !== "view" && action !== "score" && !value);
  return `
    <button type="button" class="chart-ontology-chip${variant ? ` ${escapeHtml(variant)}` : ""}${disabled ? " disabled" : ""}" ${disabled ? "disabled" : ""} data-chart-ontology-action="${escapeHtml(disabled ? "" : action)}" data-chart-ontology-value="${escapeHtml(disabled ? "" : value)}" data-chart-ontology-state="${escapeHtml(disabled ? "" : stateCode)}" data-chart-ontology-label="${escapeHtml(disabled ? "" : focusLabel)}">
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(detail)}</span>
    </button>
  `;
}

function applyChartInquiryAction(action, value, label = "", stateCode = "") {
  if (!action) {
    return;
  }
  if (action === "unit") {
    applyChartUnitInquiry(value);
    return;
  }
  const nextFilters = { ...state.mapFilters };
  if (action === "topic") {
    if (!chartMapFilterEnabled("topic", value)) {
      return;
    }
    nextFilters.topic = value;
  }
  if (action === "function") {
    if (!chartMapFilterEnabled("function", value)) {
      return;
    }
    nextFilters.function = value;
  }
  if (action === "kind") {
    if (!chartMapFilterEnabled("kind", value)) {
      return;
    }
    nextFilters.kind = normalizePackageKind(value);
  }
  if (action === "tier") {
    if (!chartMapFilterEnabled("tier", value)) {
      return;
    }
    nextFilters.tier = value;
  }
  if (action === "state") {
    nextFilters.state = value || stateCode || nextFilters.state;
  }
  if (action === "state_topic") {
    nextFilters.state = stateCode || nextFilters.state;
    nextFilters.topic = value || nextFilters.topic;
  }
  state.mapFilters = nextFilters;
  state.selectedUnitId = null;
  const question = chartInquiryQuestion(action, value, label, stateCode);
  const input = $("#inquiry-form input[name='question']");
  if (input) {
    input.value = question;
  }
  answerAndLogInquiry(question, "charts tab aggregate ask");
  state.activeTab = "inquiry";
  render();
}

function applyChartUnitInquiry(unitId) {
  const unit = (state.analysis.mapLayers?.units || []).find((item) => item.unit_id === unitId);
  if (!unit) {
    return;
  }
  state.selectedUnitId = unit.unit_id;
  state.disclosureLevel = "unit";
  const question = `What does the selected unit ${displayUnitName(unit)} show?`;
  const input = $("#inquiry-form input[name='question']");
  if (input) {
    input.value = question;
  }
  answerAndLogInquiry(question, "charts tab top unit ask");
  state.activeTab = "inquiry";
  render();
}

function chartInquiryQuestion(action, value, label = "", stateCode = "") {
  const displayLabel = label || value;
  if (action === "topic") {
    return `What does the current filtered map view show for ${displayLabel} laws?`;
  }
  if (action === "function") {
    return `What does the current filtered map view show for ${displayLabel} functions?`;
  }
  if (action === "kind") {
    return `What does the current filtered map view show for ${displayLabel} sources?`;
  }
  if (action === "tier") {
    return `What does the current filtered map view show for ${displayLabel}?`;
  }
  if (action === "state_topic") {
    return `What does the current filtered map view show for ${displayLabel} laws in ${stateCode || "this state"}?`;
  }
  if (action === "state") {
    return `What does the current filtered map view show in ${stateCode || displayLabel}?`;
  }
  if (action === "score") {
    return "What model score profile is visible in the current filtered map view?";
  }
  return "What does the current chart view show on the county and town map?";
}

function applyChartOntologyAction(action, value, label = "", stateCode = "") {
  if (!action) {
    return;
  }
  if (action === "unit") {
    applyChartUnitOntology(value);
    return;
  }
  const nextFilters = { ...state.mapFilters };
  if (action === "topic") {
    if (!chartMapFilterEnabled("topic", value)) {
      return;
    }
    nextFilters.topic = value;
  }
  if (action === "function") {
    if (!chartMapFilterEnabled("function", value)) {
      return;
    }
    nextFilters.function = value;
  }
  if (action === "kind") {
    if (!chartMapFilterEnabled("kind", value)) {
      return;
    }
    nextFilters.kind = normalizePackageKind(value);
  }
  if (action === "tier") {
    if (!chartMapFilterEnabled("tier", value)) {
      return;
    }
    nextFilters.tier = value;
  }
  if (action === "state") {
    nextFilters.state = value || stateCode || nextFilters.state;
  }
  if (action === "state_topic") {
    nextFilters.state = stateCode || nextFilters.state;
    nextFilters.topic = value || nextFilters.topic;
  }
  state.mapFilters = nextFilters;
  state.selectedUnitId = null;
  state.geographyLayers = {
    ...defaultGeographyLayers(),
    ...state.geographyLayers,
    ontology: true,
  };
  if (state.disclosureLevel === "overview") {
    state.disclosureLevel = "unit";
  }
  focusChartOntologyTier(action, value, label);
  state.activeTab = "ontology";
  render();
}

function applyChartRouteLegend(action) {
  const mapLayers = state.analysis.mapLayers;
  const summary = summarizeUnits(mapLayers ? filterMapUnits(mapLayers.units || []) : []);
  const target = chartRouteTarget(summary, mapLayers);
  if (action === "map") {
    if (target.action === "view") {
      state.selectedUnitId = null;
      setChartBrushHighlight("view", "", target.label);
      state.activeTab = "map";
      render();
      return;
    }
    applyChartMapFilter(target.action, target.value, target.label);
    return;
  }
  if (action === "ask") {
    applyChartInquiryAction(target.action, target.value, target.label);
    return;
  }
  if (action === "graph") {
    applyChartOntologyAction(target.action, target.value, target.label);
  }
}

function openChartUnitOnMap(unitId) {
  const unit = (state.analysis.mapLayers?.units || []).find((item) => item.unit_id === unitId);
  if (!unit) {
    return;
  }
  state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(
    chartBrushQuestion("unit", unit.unit_id, displayUnitName(unit)),
    "charts tab brush",
    [unit],
    summarizeUnits([unit]),
  );
  openAuditUnitOnMap(unitId);
}

function applyChartUnitOntology(unitId) {
  const unit = (state.analysis.mapLayers?.units || []).find((item) => item.unit_id === unitId);
  if (!unit) {
    return;
  }
  state.selectedUnitId = unit.unit_id;
  state.ontologyFocusTier = unit.tier || tierKeyForLabel(unit.tier_label || "", state.analysis.mapLayers?.tier_definitions || {});
  state.geographyLayers = {
    ...defaultGeographyLayers(),
    ...state.geographyLayers,
    ontology: true,
  };
  state.disclosureLevel = "unit";
  state.activeTab = "ontology";
  render();
}

function focusChartOntologyTier(action, value, label = "") {
  if (action === "tier" && value) {
    state.ontologyFocusTier = value;
    return;
  }
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    state.ontologyFocusTier = "";
    return;
  }
  const summary = summarizeUnits(filterMapUnits(mapLayers.units || []));
  const topTier = topEntry(summary.tierCounts);
  state.ontologyFocusTier = topTier.value ? tierKeyForLabel(topTier.label, mapLayers.tier_definitions || {}) : "";
  if (!state.ontologyFocusTier && label) {
    state.ontologyFocusTier = label;
  }
}

function agreementMetrics(events) {
  const metrics = {
    substantive: { correct: 0, denominator: 0 },
    function: { correct: 0, denominator: 0 },
    topic: { correct: 0, denominator: 0 },
  };
  for (const event of events) {
    const record = records.find((item) => item.record_id === event.record_id);
    if (!record) {
      continue;
    }
    const review = event.review || {};
    if (["substantive", "not_substantive"].includes(review.human_substantivity)) {
      metrics.substantive.denominator += 1;
      const humanBool = review.human_substantivity === "substantive";
      if (humanBool === Boolean(record.is_substantive)) {
        metrics.substantive.correct += 1;
      }
    }
    if (FUNCTIONS.includes(review.human_function)) {
      metrics.function.denominator += 1;
      if (review.human_function === record.function) {
        metrics.function.correct += 1;
      }
    }
    if (TOPICS.includes(review.human_topic)) {
      metrics.topic.denominator += 1;
      if (review.human_topic === record.topic) {
        metrics.topic.correct += 1;
      }
    }
  }
  return metrics;
}

function confusionTable(events) {
  const rows = events.map((event) => {
    const record = records.find((item) => item.record_id === event.record_id);
    const review = event.review || {};
    return {
      record_id: event.record_id,
      model_function: record ? record.function : "missing",
      human_function: review.human_function || "missing",
      model_topic: record ? text(record.topic) : "missing",
      human_topic: review.human_topic || "missing",
    };
  });
  if (!rows.length) {
    return "<p>No saved reviews yet. Metrics will appear after review submission.</p>";
  }
  return `
    <table>
      <thead>
        <tr><th>Record</th><th>Model function</th><th>Human function</th><th>Model topic</th><th>Human topic</th></tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                <td>${escapeHtml(row.record_id)}</td>
                <td>${escapeHtml(row.model_function)}</td>
                <td>${escapeHtml(row.human_function)}</td>
                <td>${escapeHtml(row.model_topic)}</td>
                <td>${escapeHtml(row.human_topic)}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function handleReviewSubmit(event) {
  event.preventDefault();
  const submitter = event.submitter;
  const action = submitter ? submitter.dataset.action : "save_next";
  const record = currentRecord();
  if (!record) {
    return;
  }
  const form = new FormData(event.currentTarget);
  const review = Object.fromEntries(form.entries());
  if (
    review.human_substantivity === "not_substantive" &&
    !["Not_applicable", "Uncertain", "Not_scorable"].includes(review.human_topic)
  ) {
    $("#form-warning").textContent =
      "Non-substantive review usually uses Not_applicable, Uncertain, or Not_scorable for topic. Save again after changing topic.";
    return;
  }
  $("#form-warning").textContent = "";
  appendEvent({
    event_type: action,
    record,
    review,
    revealed_before_submission: Boolean(state.revealed[record.record_id]),
  });
  if (action === "save_next" || action === "skip") {
    advanceToNextRemaining();
  }
  render();
}

function appendEvent({ event_type, record, review = {}, revealed_before_submission = false }) {
  const events = loadEvents();
  events.push({
    event_id: eventId(),
    event_type,
    record_id: record.record_id,
    source_locator: record.source_locator,
    dataset_revision: record.dataset_revision || "unknown",
    reviewer_id: state.reviewer,
    created_at: new Date().toISOString(),
    protocol_version: "evolocus-browser-eval-v1",
    revealed_before_submission,
    review,
  });
  saveEvents(events);
}

function advanceToNextRemaining() {
  for (let offset = 1; offset <= records.length; offset += 1) {
    const nextIndex = (state.currentIndex + offset) % records.length;
    if (statusForRecord(records[nextIndex]) === "remaining") {
      state.currentIndex = nextIndex;
      return;
    }
  }
  state.currentIndex = Math.min(state.currentIndex + 1, records.length - 1);
}

function applyExplorerFilters(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const stateFilter = String(form.get("state") || "").trim().toUpperCase();
  const topic = String(form.get("topic") || "");
  const fn = String(form.get("function") || "");
  const search = String(form.get("text") || "").trim().toLowerCase();
  state.explorerPageSize = Number(form.get("page_size") || 8);
  state.explorerRows = records.filter((record) => {
    if (stateFilter && String(record.state || "").toUpperCase() !== stateFilter) {
      return false;
    }
    if (topic && record.topic !== topic) {
      return false;
    }
    if (fn && record.function !== fn) {
      return false;
    }
    if (search) {
      const haystack = `${record.header || ""} ${record.content || ""}`.toLowerCase();
      if (!haystack.includes(search)) {
        return false;
      }
    }
    return true;
  });
  renderExplorer();
}

function applyMapFilters(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const scoreField = String(form.get("score_field") || "");
  state.mapFilters = {
    state: String(form.get("state") || ""),
    topic: String(form.get("topic") || ""),
    function: String(form.get("function") || ""),
    kind: String(form.get("kind") || ""),
    tier: String(form.get("tier") || ""),
    scoreField,
    scoreBand: scoreField ? String(form.get("score_band") || "") : "",
    auditFocus: String(form.get("audit_focus") || ""),
    minLaws: Math.max(0, Number(form.get("min_laws") || 0)),
    minAuditScore: Math.max(0, Number(form.get("min_audit_score") || 0)),
    packageOnly: form.get("package_only") === "1",
  };
  state.selectedUnitId = null;
  state.inquiryMapHighlight = null;
  renderMap();
}

function applyMapTopicTierMatrix(topic, tier) {
  state.mapFilters = {
    ...state.mapFilters,
    topic: topic || "",
    tier: tier || "",
  };
  state.selectedUnitId = null;
  state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(
    mapTopicTierQuestion({ topic, tierLabel: tierDefinitionForKey(tier).label || tier, tierKey: tier }),
    "map topic/tier matrix",
    filterMapUnits(state.analysis.mapLayers?.units || []),
  );
  renderMap();
}

function applyMapCrossFilterLegend(type, value, label = "") {
  if (!["topic", "function", "tier"].includes(type) || !value) {
    return;
  }
  state.mapFilters = {
    ...state.mapFilters,
    topic: type === "topic" ? value : state.mapFilters.topic,
    function: type === "function" ? value : state.mapFilters.function,
    tier: type === "tier" ? value : state.mapFilters.tier,
  };
  state.selectedUnitId = null;
  const visibleUnits = filterMapUnits(state.analysis.mapLayers?.units || []);
  const displayLabel = label || value;
  state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(
    `Show ${displayLabel} ${type} aggregate units from the map legend`,
    "map cross-filter legend",
    visibleUnits,
  );
  renderMap();
}

function applyMapTierLegendDrilldown(action, tierKey) {
  if (!tierKey) {
    return;
  }
  const definition = tierDefinitionForKey(tierKey);
  if (action === "ontology") {
    state.mapFilters = {
      ...state.mapFilters,
      tier: tierKey,
    };
    openTierOntology(tierKey);
    return;
  }
  if (action !== "filter") {
    return;
  }
  state.mapFilters = {
    ...state.mapFilters,
    tier: tierKey,
  };
  state.selectedUnitId = null;
  state.geographyColorMode = "tier";
  state.disclosureLevel = state.disclosureLevel === "overview" ? "unit" : state.disclosureLevel;
  const visibleUnits = filterMapUnits(state.analysis.mapLayers?.units || []);
  state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(
    `Tier color drilldown: ${definition.label || tierKey}`,
    "map tier legend drilldown",
    visibleUnits,
  );
  renderMap();
}

function askMapTopicTierMatrix(topic, tier, question) {
  state.mapFilters = {
    ...state.mapFilters,
    topic: topic || "",
    tier: tier || "",
  };
  state.selectedUnitId = null;
  const prompt = question || "What does the current filtered map view show?";
  state.inquiryMapHighlight = inquiryMapHighlightFromVisibleUnits(prompt, "map topic/tier matrix", filterMapUnits(state.analysis.mapLayers?.units || []));
  const input = $("#inquiry-form input[name='question']");
  if (input) {
    input.value = prompt;
  }
  answerAndLogInquiry(prompt, "map topic/tier matrix");
  state.activeTab = "inquiry";
  render();
}

function applyInquiryMapComposerAction(action) {
  const input = $("#inquiry-form input[name='question']");
  const question = String(input?.value || state.inquiryMapComposerQuestion || "").trim();
  state.inquiryMapComposerQuestion = question;
  const plan = inquiryMapComposerPlan(question);
  if (action === "preview") {
    renderInquiry();
    return;
  }
  if (!question) {
    renderInquiry();
    return;
  }
  state.mapFilters = plan.proposedFilters;
  state.selectedUnitId = null;
  setInquiryMapHighlightFromPlan(plan, "inquiry question composer");
  if (action === "apply-map") {
    state.activeTab = "map";
    render();
    return;
  }
  if (action === "ontology") {
    applyQuestionOntologyRoute(plan.ontologyRoute, { renderNow: false });
    render();
    return;
  }
  if (action === "ask") {
    answerAndLogInquiry(question, "inquiry-to-map composer");
    state.activeTab = "inquiry";
    render();
  }
}

function openInquiryMapComposerUnit(unitId) {
  if (!unitId) {
    return;
  }
  state.selectedUnitId = unitId;
  state.activeTab = "map";
  if (state.disclosureLevel === "overview") {
    state.disclosureLevel = "unit";
  }
  render();
}

function resetMapFilters() {
  state.mapFilters = defaultMapFilters();
  state.selectedUnitId = null;
  state.inquiryMapHighlight = null;
  renderMap();
}

function defaultMapFilters() {
  return { state: "", topic: "", function: "", kind: "", tier: "", scoreField: "", scoreBand: "", auditFocus: "", minLaws: 0, minAuditScore: 0, packageOnly: false };
}

function mapFiltersSnapshot() {
  return normalizedLogMapFilters(state.mapFilters);
}

function normalizedLogMapFilters(filters) {
  const base = defaultMapFilters();
  const input = filters || {};
  return {
    ...base,
    state: String(input.state || ""),
    topic: String(input.topic || ""),
    function: String(input.function || ""),
    kind: String(input.kind || ""),
    tier: String(input.tier || ""),
    scoreField: String(input.scoreField || input.score_field || ""),
    scoreBand: String(input.scoreBand || input.score_band || ""),
    auditFocus: String(input.auditFocus || input.audit_focus || ""),
    minLaws: Math.max(0, Number(input.minLaws || input.min_laws || 0)),
    minAuditScore: Math.max(0, Number(input.minAuditScore || input.min_audit_score || 0)),
    packageOnly: Boolean(input.packageOnly || input.package_only),
  };
}

function applyPackageMapFilter(action) {
  if (action === "clear") {
    state.mapFilters = defaultMapFilters();
  } else {
    state.mapFilters = {
      ...state.mapFilters,
      packageOnly: action !== "all",
    };
  }
  state.selectedUnitId = null;
  renderMap();
}

function answerQuestion(question) {
  const normalized = question.trim().toLowerCase();
  if (!normalized) {
    return {
      title: "Ask a question",
      answer: "Enter a question about status, tiers, topics, the current filtered map view, models, or Grok integration.",
      sections: "",
      matches: "",
    };
  }
  if (/\b(package|imported|browser-local|loaded package|review package|overlay|local queue)\b/.test(normalized)) {
    return packageInquiryAnswer();
  }
  if (/\b(selected|current|this)\b/.test(normalized) && /\b(unit|county|town|municipal|municipality|jurisdiction|place)\b/.test(normalized)) {
    return selectedUnitAnswer();
  }
  if (/\b(audit|ocr|duplicate|quality|review signal|review signals)\b/.test(normalized)) {
    return filteredAuditAnswer();
  }
  if (/\b(score|scores|opacity|paternalism|salience|enforcement|model output|model outputs)\b/.test(normalized)) {
    return filteredScoreAnswer();
  }
  if (/\b(current|filtered|visible|shown|view)\b/.test(normalized) && /\b(map|unit|units|law|laws|topic|tier|state)\b/.test(normalized)) {
    return filteredViewAnswer();
  }
  const briefingMatch = matchInquiryBriefing(normalized);
  if (briefingMatch) {
    return briefingAnswer(briefingMatch);
  }
  const entries = state.analysis.chatIndex ? state.analysis.chatIndex.entries || [] : [];
  const scored = entries
    .map((entry) => {
      const keywords = [entry.title, ...(entry.keywords || [])].join(" ").toLowerCase();
      const score = normalized
        .split(/\s+/)
        .filter((term) => term.length > 2)
        .reduce((total, term) => total + (keywords.includes(term) ? 1 : 0), 0);
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (!scored.length) {
    const status = state.analysis.status;
    return {
      title: "No exact static match",
      answer: status
        ? `The current published artifact is ${status.analysis_state} with ${status.unit_count} units and ${status.law_count} law records. This browser inquiry reads static aggregate artifacts; Grok-backed analysis must run offline and publish updated artifacts.`
        : "Analysis artifacts have not loaded yet.",
      sections: "",
      matches: "",
    };
  }
  return {
    title: scored[0].entry.title,
    answer: scored[0].entry.answer,
    sections: "",
    matches: `
      <h4>Related artifact matches</h4>
      <ol>
        ${scored
          .map((item) => `<li>${escapeHtml(item.entry.title)} <span>score ${escapeHtml(String(item.score))}</span></li>`)
          .join("")}
      </ol>
    `,
  };
}

function packageInquiryAnswer() {
  const mapUnits = state.analysis.mapLayers?.units || [];
  const summary = packageCoverageSummary();
  const packageStats = importedPackageMapStats(mapUnits);
  if (!summary.imported) {
    return {
      title: "No browser-local package loaded",
      answer: "The public map and inquiry layers are loaded, but no browser-local package is active. Use Load Demo Package for a synthetic package overlay or import a bounded local review package. No LOCUS row text is published through this path.",
      sections: "",
      matches: `
        <h4>Package boundary</h4>
        <dl class="briefing-facts">
          <dt>Public map</dt><dd>Available <span>aggregate artifacts</span></dd>
          <dt>Browser package</dt><dd>Not loaded <span>localStorage</span></dd>
          <dt>Raw LOCUS rows</dt><dd>Not published <span>publication policy</span></dd>
        </dl>
      `,
    };
  }
  const sourceLabel = summary.syntheticPackage ? "synthetic browser package" : "browser-local imported package";
  return {
    title: summary.syntheticPackage ? "Synthetic package map overlay" : "Loaded package map overlay",
    answer: `The active ${sourceLabel} contains ${formatCount(summary.recordCount)} browser-local records across ${formatCount(summary.unitCount)} package units. ${formatCount(packageStats.matchedRecords)} records match published aggregate map units, highlighting ${formatCount(packageStats.units.size)} county/town units. Review progress is ${formatCount(summary.metrics.reviewed)} reviewed, ${formatCount(summary.metrics.remaining)} remaining, ${formatCount(summary.metrics.skipped)} skipped, and ${formatCount(summary.metrics.flagged)} flagged. This is workflow coverage, not a civic finding or legal ranking.`,
    sections: packageInquirySectionsHtml(summary, packageStats),
    matches: `
      <h4>Package evidence boundary</h4>
      <dl class="briefing-facts">
        <dt>Package source</dt><dd>${escapeHtml(summary.sourceDetail)} <span>browser localStorage</span></dd>
        <dt>Map join</dt><dd>${escapeHtml(formatCount(packageStats.matchedRecords))}/${escapeHtml(formatCount(packageStats.recordCount))} records matched <span>map_layers.json unit IDs</span></dd>
        <dt>Text state</dt><dd>${escapeHtml(summary.syntheticPackage ? "Synthetic placeholders only" : summary.textIncluded ? "LOCUS text loaded locally" : "Metadata only")} <span>not a Pages artifact</span></dd>
        <dt>Source locators</dt><dd>${escapeHtml(summary.sourceLocatorsIncluded ? "Present locally, not listed here" : "Not loaded")} <span>provenance boundary</span></dd>
      </dl>
    `,
  };
}

function packageInquirySectionsHtml(summary, packageStats) {
  const rows = [
    {
      level: "overview",
      heading: "Package map coverage",
      body: `${formatCount(packageStats.units.size)} public aggregate units are represented in the browser-local package overlay. Package-only filtering narrows the map, inquiry, score, audit, and snapshot context to those units.`,
      rows: [
        { field: "records", value: formatCount(summary.recordCount) },
        { field: "units", value: formatCount(summary.unitCount) },
        { field: "matched records", value: `${formatCount(packageStats.matchedRecords)}/${formatCount(packageStats.recordCount)}` },
        { field: "text boundary", value: summary.syntheticPackage ? "synthetic placeholders only" : summary.textIncluded ? "local LOCUS text present" : "metadata only" },
      ],
    },
  ];
  if (["unit", "evidence"].includes(state.disclosureLevel)) {
    rows.push({
      level: "unit",
      heading: "Package composition",
      body: "These counts summarize the browser-local queue, not public LOCUS rows.",
      rows: [
        { field: "state mix", value: compactCounts(summary.stateCounts) },
        { field: "topic mix", value: compactCounts(summary.topicCounts) },
        { field: "function mix", value: compactCounts(summary.functionCounts) },
        { field: "workflow", value: `reviewed ${formatCount(summary.metrics.reviewed)} · remaining ${formatCount(summary.metrics.remaining)} · skipped ${formatCount(summary.metrics.skipped)} · flagged ${formatCount(summary.metrics.flagged)}` },
      ],
    });
  }
  if (state.disclosureLevel === "evidence") {
    rows.push({
      level: "evidence",
      heading: "Highest matched package units",
      body: "Matched unit rows use aggregate map unit IDs and browser-local record counts. They do not expose ordinance text or source locator values.",
      rows: [...packageStats.units.values()]
        .sort((a, b) => b.recordCount - a.recordCount || displayUnitName(a.unit).localeCompare(displayUnitName(b.unit)))
        .slice(0, 8)
        .map((hit) => ({
          field: displayUnitName(hit.unit),
          value: `${hit.unit?.state || "NA"} · ${formatCount(hit.recordCount)} records · ${formatCount(hit.reviewed)} reviewed`,
        })),
    });
  }
  return `
    <div class="briefing-sections package-briefing">
      ${rows
        .map(
          (section) => `
            <section>
              <span>${escapeHtml(section.level)}</span>
              <h4>${escapeHtml(section.heading)}</h4>
              <p>${escapeHtml(section.body)}</p>
              ${briefingRowsHtml(section.rows)}
            </section>
          `,
        )
        .join("")}
    </div>
  `;
}

function filteredAuditAnswer() {
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    return {
      title: "Audit signals unavailable",
      answer: "Aggregate map artifacts have not loaded yet.",
      sections: "",
      matches: "",
    };
  }
  const units = filterMapUnits(mapLayers.units || []);
  const auditSummary = inquiryAuditSummary(units);
  const visibleUnitIds = new Set(units.map((unit) => unit.unit_id));
  const topAuditRows = (state.analysis.unitAuditQuality?.units || [])
    .filter((row) => visibleUnitIds.has(row.unit_id))
    .sort((a, b) => Number(b.audit_attention_score || 0) - Number(a.audit_attention_score || 0))
    .slice(0, state.disclosureLevel === "overview" ? 5 : 10);
  return {
    title: "Current audit review signals",
    answer: `The current filtered aggregate view contains ${formatCount(auditSummary.reviewRows)} medium/high OCR-review rows and ${formatCount(auditSummary.duplicateRows)} duplicate text-hash rows across ${formatCount(units.length)} visible units. These are review-priority cues, not legal findings or proof of text defects.`,
    sections: inquiryAuditSectionsHtml(topAuditRows),
    matches: `
      <h4>Audit evidence boundary</h4>
      <dl class="briefing-facts">
        <dt>Source artifact</dt><dd>unit_audit_quality.json <span>aggregate only</span></dd>
        <dt>Visible filters</dt><dd>${escapeHtml(activeFilterLabels().join(" · ") || "No active map filters")} <span>browser state</span></dd>
        <dt>Raw text</dt><dd>Not published <span>publication policy</span></dd>
      </dl>
    `,
  };
}

function inquiryAuditSectionsHtml(rows) {
  if (!rows.length) {
    return "";
  }
  return `
    <div class="briefing-sections">
      <section>
        <span>unit</span>
        <h4>Highest visible audit-attention units</h4>
        <p>Sorted by aggregate audit-attention score within the current filter.</p>
        <div class="briefing-row-list">
          ${rows
            .map(
              (row) => `
                <span>
                  <strong>${escapeHtml(displayUnitName(row))}</strong>
                  ${escapeHtml(row.state || "NA")} · ${escapeHtml(formatNumber(row.audit_attention_score))}/100 · ${escapeHtml(formatCount(row.ocr_review_rows))} OCR · ${escapeHtml(formatCount(row.duplicate_text_hash_rows))} duplicate hash
                </span>
              `,
            )
            .join("")}
        </div>
      </section>
    </div>
  `;
}

function filteredScoreAnswer() {
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    return {
      title: "Score profile unavailable",
      answer: "Aggregate map artifacts have not loaded yet.",
      sections: "",
      matches: "",
    };
  }
  const units = filterMapUnits(mapLayers.units || []);
  const summary = summarizeUnits(units);
  const highContrast = units
    .slice()
    .sort((a, b) => scoreSpread(b) - scoreSpread(a))
    .slice(0, state.disclosureLevel === "overview" ? 5 : 10);
  return {
    title: "Current neutral score profile",
    answer: `The visible aggregate layer has ${formatCount(units.length)} units and mean released model-score values of ${scoreSnapshot(summary.scoreMeans)}. Score direction and legal meaning are not verified here, so this is only a relative model-output profile.`,
    sections: inquiryScoreSectionsHtml(highContrast),
    matches: `
      <h4>Score evidence boundary</h4>
      <dl class="briefing-facts">
        <dt>Source artifact</dt><dd>map_layers.json <span>aggregate score means</span></dd>
        <dt>Dimensions</dt><dd>${escapeHtml(SCORE_FIELDS.join(", "))} <span>released LOCUS model outputs</span></dd>
        <dt>Interpretation</dt><dd>Neutral relative scores only <span>direction unverified</span></dd>
      </dl>
    `,
  };
}

function inquiryScoreSectionsHtml(rows) {
  if (!rows.length) {
    return "";
  }
  return `
    <div class="briefing-sections">
      <section>
        <span>unit</span>
        <h4>High-contrast visible score profiles</h4>
        <p>Units sorted by spread across the four released model-score dimensions.</p>
        <div class="briefing-row-list">
          ${rows
            .map(
              (unit) => `
                <span>
                  <strong>${escapeHtml(displayUnitName(unit))}</strong>
                  ${escapeHtml(unit.state || "NA")} · spread ${escapeHtml(scoreSpread(unit).toFixed(3))} · ${escapeHtml(scoreSnapshot(unit.model_score_means || {}))}
                </span>
              `,
            )
            .join("")}
        </div>
      </section>
    </div>
  `;
}

function currentSelectedMapUnit() {
  const units = state.analysis.mapLayers ? state.analysis.mapLayers.units || [] : [];
  return units.find((item) => item.unit_id === state.selectedUnitId) || null;
}

function selectedUnitAnswer(unit = currentSelectedMapUnit()) {
  if (!unit) {
    return {
      title: "No selected unit",
      answer: "Select a county, town, or aggregate map unit first. The browser will answer from published aggregate artifacts only.",
      sections: "",
      matches: "",
    };
  }
  const geometry = geometryMatchForUnit(unit.unit_id);
  const substantiveShare = modelSubstantiveShare(unit);
  return {
    title: `Selected unit: ${displayUnitName(unit)}`,
    answer: `${displayUnitName(unit)} is a ${text(unit.kind)} aggregate unit in ${text(unit.state)} with ${formatCount(unit.law_count)} LOCUS law records, ${formatPercentRatio(substantiveShare)} model-substantive share, dominant topic ${text(unit.dominant_topic)}, dominant function ${text(unit.dominant_function)}, and neutral tier ${text(unit.tier_label)}. These are aggregate model-output summaries, not legal findings.`,
    sections: selectedUnitSectionsHtml(unit, geometry),
    matches: `
      <h4>Supporting aggregate facts</h4>
      <dl class="briefing-facts">
        <dt>Substantive rows</dt><dd>${escapeHtml(formatCount(unit.substantive_count))}/${escapeHtml(formatCount(unit.law_count))} <span>map_layers.json</span></dd>
        <dt>Official geography</dt><dd>${escapeHtml(geometry.summary)} <span>${escapeHtml(geometry.source)}</span></dd>
        <dt>Evidence boundary</dt><dd>No ordinance text or raw LOCUS rows are published <span>publication policy</span></dd>
      </dl>
    `,
  };
}

function selectedUnitSectionsHtml(unit, geometry) {
  const sections = [
    {
      level: "overview",
      heading: "Aggregate map reading",
      body: `${displayUnitName(unit)} is shown in the current map layer as ${text(unit.tier_label)}. Tier colors are neutral review bands, not rankings.`,
      rows: [
        { field: "state", value: unit.state || "Unknown" },
        { field: "unit type", value: unit.kind || "unknown" },
        { field: "law records", value: formatCount(unit.law_count) },
        { field: "model-substantive share", value: formatPercentRatio(modelSubstantiveShare(unit)) },
      ],
    },
  ];
  if (["unit", "evidence"].includes(state.disclosureLevel)) {
    sections.push({
      level: "unit",
      heading: "Model-output profile",
      body: "Topic, function, and score fields are released LOCUS model outputs aggregated for this unit.",
      rows: [
        { field: "dominant topic", value: unit.dominant_topic || "Unknown" },
        { field: "dominant function", value: unit.dominant_function || "Unknown" },
        { field: "topic mix", value: compactCounts(unit.topic_counts || {}) },
        { field: "function mix", value: compactCounts(unit.function_counts || {}) },
        { field: "score means", value: scoreSnapshot(unit.model_score_means || {}) },
      ],
    });
  }
  if (state.disclosureLevel === "evidence") {
    sections.push({
      level: "evidence",
      heading: "Provenance and boundary",
      body: "This answer is generated in the browser from static aggregate artifacts. It omits headers, ordinance text, raw rows, and source locator values.",
      rows: [
        { field: "unit id", value: unit.unit_id },
        { field: "geometry match", value: geometry.summary },
        { field: "match status", value: geometry.matchStatus },
        { field: "source artifact", value: geometry.source },
      ],
    });
  }
  return `
    <div class="briefing-sections selected-unit-briefing">
      ${sections
        .map(
          (section) => `
            <section>
              <span>${escapeHtml(section.level)}</span>
              <h4>${escapeHtml(section.heading)}</h4>
              <p>${escapeHtml(section.body)}</p>
              ${briefingRowsHtml(section.rows)}
            </section>
          `,
        )
        .join("")}
    </div>
  `;
}

function geometryMatchForUnit(unitId) {
  const countyFeature = (state.analysis.countyGeometry?.feature_collection?.features || []).find(
    (feature) => feature.properties?.unit_id === unitId,
  );
  if (countyFeature) {
    const properties = countyFeature.properties || {};
    return {
      summary: `${properties.census_name || properties.unit_name || "matched county"} polygon (${properties.geoid || "GEOID unavailable"})`,
      source: "county_geometry.json",
      matchStatus: properties.match_status || "machine_matched_pending_review",
    };
  }
  const municipalPoint = (state.analysis.municipalPoints?.points || []).find((point) => point.unit_id === unitId);
  if (municipalPoint) {
    return {
      summary: `${municipalPoint.census_name || municipalPoint.unit_name || "matched municipal point"} point (${municipalPoint.geoid || "GEOID unavailable"})`,
      source: "municipal_points.json",
      matchStatus: municipalPoint.match_status || "machine_matched_pending_review",
    };
  }
  return {
    summary: "No reviewed official county/town geometry match in the current public artifact",
    source: "map_layers.json",
    matchStatus: "aggregate_state_cluster_only",
  };
}

function compactCounts(counts) {
  const rows = Object.entries(counts)
    .filter(([, value]) => Number(value || 0) > 0)
    .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))
    .slice(0, 4);
  return rows.length ? rows.map(([label, value]) => `${label}: ${formatCount(value)}`).join(" · ") : "No aggregate counts";
}

function matchInquiryBriefing(normalizedQuestion) {
  const briefings = state.analysis.inquiryBriefings ? state.analysis.inquiryBriefings.briefings || [] : [];
  const scored = briefings
    .map((briefing) => {
      const haystack = [
        briefing.id,
        briefing.title,
        briefing.question,
        briefing.short_answer,
        ...(briefing.progressive_sections || []).flatMap((section) => [section.heading, section.body]),
      ]
        .join(" ")
        .toLowerCase();
      const score = normalizedQuestion
        .split(/\s+/)
        .filter((term) => term.length > 2)
        .reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      const exactBoost = briefing.question && briefing.question.toLowerCase() === normalizedQuestion ? 100 : 0;
      return { briefing, score: score + exactBoost };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.length ? { ...scored[0], related: scored.slice(0, 5) } : null;
}

function briefingAnswer(match) {
  const artifact = state.analysis.inquiryBriefings || {};
  return {
    title: match.briefing.title,
    answer: match.briefing.short_answer,
    grokSummary: artifact.grok_summary || "",
    sections: briefingSectionsHtml(match.briefing),
    matches: `
      <h4>Related static briefings</h4>
      <ol>
        ${match.related
          .map((item) => `<li>${escapeHtml(item.briefing.title)} <span>score ${escapeHtml(String(item.score))}</span></li>`)
          .join("")}
      </ol>
      ${briefingFactsHtml(match.briefing)}
    `,
  };
}

function briefingSectionsHtml(briefing) {
  const allowed = disclosureLevelsForInquiry();
  const sections = (briefing.progressive_sections || []).filter((section) => allowed.includes(section.level));
  if (!sections.length) {
    return "";
  }
  return `
    <div class="briefing-sections">
      ${sections
        .map(
          (section) => `
            <section>
              <span>${escapeHtml(section.level || "overview")}</span>
              <h4>${escapeHtml(section.heading || "Detail")}</h4>
              ${section.body ? `<p>${escapeHtml(section.body)}</p>` : ""}
              ${briefingRowsHtml(section.rows || [])}
            </section>
          `,
        )
        .join("")}
    </div>
  `;
}

function disclosureLevelsForInquiry() {
  if (state.disclosureLevel === "evidence") {
    return ["overview", "unit", "evidence"];
  }
  if (state.disclosureLevel === "unit") {
    return ["overview", "unit"];
  }
  return ["overview"];
}

function briefingRowsHtml(rows) {
  if (!rows.length) {
    return "";
  }
  return `
    <div class="briefing-row-list">
      ${rows
        .slice(0, 8)
        .map((row) => `<span>${escapeHtml(Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(" · "))}</span>`)
        .join("")}
    </div>
  `;
}

function briefingFactsHtml(briefing) {
  const facts = briefing.supporting_facts || [];
  if (!facts.length) {
    return "";
  }
  return `
    <h4>Supporting aggregate facts</h4>
    <dl class="briefing-facts">
      ${facts
        .map(
          (fact) => `
            <dt>${escapeHtml(fact.label)}</dt>
            <dd>${escapeHtml(fact.value)} <span>${escapeHtml(fact.source || "aggregate artifacts")}</span></dd>
          `,
        )
        .join("")}
    </dl>
  `;
}

function filteredViewAnswer() {
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers) {
    return {
      title: "Current map view",
      answer: "The aggregate map artifact has not loaded yet.",
      sections: "",
      matches: "",
    };
  }
  const units = filterMapUnits(mapLayers.units || []);
  const summary = summarizeUnits(units);
  const filters = activeFilterLabels().join(", ") || "no active filters";
  return {
    title: "Current filtered map view",
    answer: `Using ${filters}, the visible aggregate layer contains ${formatCount(units.length)} jurisdiction units and ${formatCount(summary.lawCount)} law records. The largest visible unit is ${summary.topUnit ? displayUnitName(summary.topUnit) : "not available"}. The top non-null topic is ${summary.topTopic.label}, and the top function is ${summary.topFunction.label}. These are aggregate model-output summaries, not legal findings.`,
    sections: "",
    matches: `
      <h4>Filtered aggregate summary</h4>
      <ol>
        <li>Substantive rows: ${escapeHtml(formatCount(summary.substantiveCount))}</li>
        <li>Tier mix: ${escapeHtml(tierMix(summary.tierCounts))}</li>
        <li>Evidence boundary: no ordinance text or public samples in this layer</li>
      </ol>
    `,
  };
}

function submitInquiry(event) {
  event.preventDefault();
  const question = new FormData(event.currentTarget).get("question") || "";
  answerAndLogInquiry(String(question), "manual inquiry");
  renderInquiry();
}

function askAboutMapUnit(unitId) {
  const units = state.analysis.mapLayers ? state.analysis.mapLayers.units || [] : [];
  const unit = units.find((item) => item.unit_id === unitId);
  if (!unit) {
    return;
  }
  state.selectedUnitId = unit.unit_id;
  const question = selectedUnitRouteQuestion(unit);
  const input = $("#inquiry-form input[name='question']");
  if (input) {
    input.value = question;
  }
  answerAndLogInquiry(question, "selected-unit map query");
  state.activeTab = "inquiry";
  render();
}

function applySelectedUnitQueryRoute(action, unitId) {
  const units = state.analysis.mapLayers ? state.analysis.mapLayers.units || [] : [];
  const unit = units.find((item) => item.unit_id === unitId);
  if (!unit) {
    return;
  }
  state.selectedUnitId = unit.unit_id;
  const question = selectedUnitRouteQuestion(unit);
  const answer = answerWithRouteMetadata(question, "selected-unit query replay", selectedUnitAnswer(unit));
  const input = $("#inquiry-form input[name='question']");
  if (input) {
    input.value = question;
  }
  if (action === "save") {
    state.inquiryAnswer = answer;
    appendInquiryResultsLog(question, answer, "selected-unit query replay");
    renderMap();
    return;
  }
  answerAndLogInquiry(question, "selected-unit query replay");
  if (action === "ontology") {
    state.ontologyPathStage = "unit";
    state.geographyLayers = {
      ...defaultGeographyLayers(),
      ...state.geographyLayers,
      ontology: true,
    };
    state.activeTab = "ontology";
  } else {
    state.activeTab = "inquiry";
  }
  render();
}

function openAuditUnitOnMap(unitId) {
  const units = state.analysis.mapLayers ? state.analysis.mapLayers.units || [] : [];
  const unit = units.find((item) => item.unit_id === unitId);
  if (!unit) {
    return;
  }
  state.selectedUnitId = unit.unit_id;
  state.disclosureLevel = "unit";
  state.activeTab = "map";
  render();
}

function openScoreUnitOnMap(unitId) {
  openAuditUnitOnMap(unitId);
}

function importQueue(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const imported = Array.isArray(parsed) ? parsed : parsed.records;
      if (!Array.isArray(imported) || imported.length === 0) {
        throw new Error("Queue JSON must be an array or an object with a records array.");
      }
      if (imported.length > 500) {
        throw new Error("Browser queue imports are bounded to 500 records. Create a smaller evaluation package.");
      }
      const importStatus = importStatusFromPayload(parsed, imported, file);
      records = imported.map(normalizeImportedRecord);
      localStorage.setItem(STORAGE_RECORDS, JSON.stringify(records));
      saveImportStatus(importStatus);
      state.currentIndex = 0;
      state.explorerRows = records;
      state.activeTab = "review";
      alert("Imported bounded queue into browser storage. No upload occurred. Package status is visible above the workbench.");
      render();
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

function loadSyntheticPackageDemo() {
  const mapLayers = state.analysis.mapLayers;
  if (!mapLayers || !Array.isArray(mapLayers.units) || !mapLayers.units.length) {
    alert("Aggregate map artifacts are still loading. Try again after the Law Map appears.");
    return;
  }
  const units = demoPackageUnits(mapLayers.units);
  if (!units.length) {
    alert("No aggregate units are available for a synthetic package demo under the current filters.");
    return;
  }
  const payload = syntheticDemoPackagePayload(units);
  const imported = payload.records;
  const importStatus = importStatusFromPayload(payload, imported, { name: "synthetic-demo-package.json" });
  records = imported.map(normalizeImportedRecord);
  localStorage.setItem(STORAGE_RECORDS, JSON.stringify(records));
  saveImportStatus(importStatus);
  state.currentIndex = 0;
  state.explorerRows = records;
  state.revealed = {};
  state.mapFilters.packageOnly = true;
  state.selectedUnitId = units[0]?.unit_id || null;
  state.disclosureLevel = "unit";
  state.activeTab = "map";
  alert("Loaded a synthetic browser-local package over published aggregate units. No LOCUS row text, source locators, or secrets were loaded.");
  render();
}

function demoPackageUnits(allUnits) {
  const filtered = filterMapUnits(allUnits);
  const candidates = filtered.length ? filtered : allUnits;
  return [...candidates]
    .sort((a, b) => Number(b.law_count || 0) - Number(a.law_count || 0))
    .slice(0, 12);
}

function syntheticDemoPackagePayload(units) {
  const records = units.flatMap((unit, unitIndex) => [
    syntheticDemoPackageRecord(unit, unitIndex, 0),
    syntheticDemoPackageRecord(unit, unitIndex, 1),
  ]);
  return {
    schema_version: "evolocus-browser-review-package-v1",
    browser_import_compatible: true,
    synthetic_demo_data: true,
    dataset_id: "Synthetic demonstration package over published LOCUS aggregate units",
    dataset_revision: "pages-synthetic-package-demo",
    generated_at: new Date().toISOString(),
    license: "Synthetic placeholder records; public aggregate unit context derives from LOCUS-v1 CC-BY-NC-4.0.",
    citation: "Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport. \"Freeing the Law with LOCUS: A Local Ordinance Corpus for the United States.\" arXiv:2606.19334, 2026.",
    records,
    unit_counts: Object.fromEntries(units.map((unit) => [unit.unit_id, 2])),
    package_policy: {
      local_only: true,
      github_pages_publication_allowed: false,
      raw_rows_included: false,
      ordinance_text_included: false,
      synthetic_demo_data: true,
      source_locators_included: false,
      review_events_included: false,
      legal_findings: false,
    },
    limitations: [
      "Synthetic package records are generated in the browser for demonstration only.",
      "Published aggregate units are real LOCUS-derived counts, but package records are not LOCUS rows.",
      "No ordinance text, source locators, row-level records, review history, or secrets are loaded.",
    ],
  };
}

function syntheticDemoPackageRecord(unit, unitIndex, recordIndex) {
  const unitName = displayUnitName(unit);
  const topic = unit.dominant_topic && unit.dominant_topic !== "Not_applicable" ? unit.dominant_topic : null;
  const functionLabel = unit.dominant_function || FUNCTIONS[(unitIndex + recordIndex) % FUNCTIONS.length];
  const stateCode = unit.state || "";
  const kind = normalizePackageKind(unit.kind || "");
  const header = `Synthetic package placeholder ${recordIndex + 1}`;
  const content = [
    "SYNTHETIC DEMONSTRATION PACKAGE.",
    `This placeholder review item is anchored to the published aggregate unit ${unitName}, ${stateCode}.`,
    `The public artifact reports ${formatCount(unit.law_count || 0)} aggregate LOCUS rows for that unit.`,
    "This is not ordinance text, not a source locator, not a legal finding, and not a record-level LOCUS sample.",
  ].join(" ");
  return {
    record_id: `synthetic-package/${unit.unit_id}#${recordIndex}`,
    dataset_revision: "pages-synthetic-package-demo",
    source_file: "browser-generated-synthetic-package",
    source_row_number: unitIndex * 2 + recordIndex,
    unit_id: unit.unit_id,
    header,
    content,
    is_substantive: Boolean(topic),
    function: functionLabel,
    topic,
    source_jurisdiction_type: `synthetic_${kind || "unknown"}`,
    state: stateCode,
    city: kind === "city" ? unitName : null,
    county: kind === "county" ? unitName : null,
    jurisdiction_name: unitName,
    jurisdiction_type_normalized: kind || "unknown",
    enforcement_discretion: neutralScoreValue(unit, "enforcement_discretion"),
    opacity: neutralScoreValue(unit, "opacity"),
    paternalism: neutralScoreValue(unit, "paternalism"),
    problem_salience: neutralScoreValue(unit, "problem_salience"),
    content_length_chars: content.length,
    content_length_words: content.split(/\s+/).filter(Boolean).length,
    ocr_risk_level: "synthetic_demo",
    ocr_risk_reasons: ["synthetic placeholder", "no LOCUS ordinance text"],
  };
}

function neutralScoreValue(unit, field) {
  const value = unit.model_score_means?.[field];
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function importStatusFromPayload(payload, imported, file) {
  const packagePolicy = payload?.package_policy || {};
  const unitCounts = payload?.unit_counts || unitCountsFromRecords(imported);
  const syntheticDemo = Boolean(payload?.synthetic_demo_data || packagePolicy.synthetic_demo_data);
  const localTextPresent = imported.some((record) => hasNonemptyField(record, "content") || hasNonemptyField(record, "header"));
  const contentIncluded = !syntheticDemo && (Boolean(packagePolicy.ordinance_text_included) || localTextPresent);
  const sourceLocatorsIncluded = Boolean(packagePolicy.source_locators_included) || imported.some((record) => hasNonemptyField(record, "source_locator"));
  return {
    schema_version: "evolocus-browser-import-status-v1",
    imported_at: new Date().toISOString(),
    file_name: file?.name || "imported-queue.json",
    source_schema_version: payload?.schema_version || "plain-record-array",
    browser_import_compatible: Boolean(payload?.browser_import_compatible),
    dataset_id: payload?.dataset_id || "Unknown dataset",
    dataset_revision: payload?.dataset_revision || imported[0]?.dataset_revision || "imported-bounded-queue",
    generated_at: payload?.generated_at || null,
    license: payload?.license || null,
    citation: payload?.citation || null,
    record_count: imported.length,
    unit_count: Object.keys(unitCounts).length,
    unit_counts: Object.fromEntries(topCountEntries(unitCounts, 12).map((row) => [row.label, row.value])),
    synthetic_demo_data: syntheticDemo,
    local_text_present: localTextPresent,
    ordinance_text_included: contentIncluded,
    source_locators_included: sourceLocatorsIncluded,
    review_events_included: Array.isArray(payload?.events) || Array.isArray(payload?.review_events),
    github_pages_publication_allowed: Boolean(packagePolicy.github_pages_publication_allowed),
    package_policy: {
      local_only: packagePolicy.local_only !== false,
      github_pages_publication_allowed: Boolean(packagePolicy.github_pages_publication_allowed),
      raw_rows_included: Boolean(packagePolicy.raw_rows_included),
      ordinance_text_included: contentIncluded,
      synthetic_demo_data: syntheticDemo,
      source_locators_included: sourceLocatorsIncluded,
      review_events_included: Array.isArray(payload?.events) || Array.isArray(payload?.review_events),
      legal_findings: Boolean(packagePolicy.legal_findings),
    },
    limitations: Array.isArray(payload?.limitations) ? payload.limitations.slice(0, 4) : [],
  };
}

function fallbackImportStatus() {
  const unitCounts = unitCountsFromRecords(records);
  return {
    schema_version: "evolocus-browser-import-status-v1",
    imported_at: new Date().toISOString(),
    file_name: "Previously imported bounded queue",
    source_schema_version: "unknown",
    browser_import_compatible: false,
    dataset_id: "Unknown dataset",
    dataset_revision: records[0]?.dataset_revision || "imported-bounded-queue",
    record_count: records.length,
    unit_count: Object.keys(unitCounts).length,
    unit_counts: unitCounts,
    synthetic_demo_data: false,
    local_text_present: records.some((record) => hasNonemptyField(record, "content") || hasNonemptyField(record, "header")),
    ordinance_text_included: records.some((record) => hasNonemptyField(record, "content") || hasNonemptyField(record, "header")),
    source_locators_included: records.some((record) => hasNonemptyField(record, "source_locator")),
    review_events_included: false,
    github_pages_publication_allowed: false,
    package_policy: {
      local_only: true,
      github_pages_publication_allowed: false,
      raw_rows_included: false,
      ordinance_text_included: records.some((record) => hasNonemptyField(record, "content") || hasNonemptyField(record, "header")),
      source_locators_included: records.some((record) => hasNonemptyField(record, "source_locator")),
      review_events_included: false,
      legal_findings: false,
    },
    limitations: ["Legacy browser import metadata was reconstructed from local records."],
  };
}

function unitCountsFromRecords(items) {
  const counts = {};
  for (const record of items || []) {
    const label = record.unit_id || record.jurisdiction_name || record.city || record.county || record.state || "Unknown unit";
    counts[label] = (counts[label] || 0) + 1;
  }
  return counts;
}

function hasNonemptyField(record, field) {
  const value = record?.[field];
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function normalizeImportedRecord(record, index) {
  const recordId = record.record_id || `imported-record-${index}`;
  return {
    ...record,
    record_id: recordId,
    source_locator: record.source_locator || recordId,
    dataset_revision: record.dataset_revision || "imported-bounded-queue",
    header: record.header || "Imported record",
    content: record.content || "",
    state: record.state || "",
    city: record.city || null,
    county: record.county || null,
    jurisdiction_name: record.jurisdiction_name || record.city || record.county || "Unspecified jurisdiction",
    jurisdiction_type_normalized: record.jurisdiction_type_normalized || "unknown",
    ocr_risk_reasons: record.ocr_risk_reasons || [],
    ocr_risk_level: record.ocr_risk_level || "not_evaluated",
  };
}

function resetDemoQueue() {
  records = syntheticRecords;
  state.currentIndex = 0;
  state.explorerRows = records;
  state.revealed = {};
  localStorage.removeItem(STORAGE_RECORDS);
  clearImportStatus();
  render();
}

function exportEvents() {
  const payload = {
    exported_at: new Date().toISOString(),
    protocol_version: "evolocus-browser-eval-v1",
    license_notice: "LOCUS-v1 is CC-BY-NC-4.0. Synthetic demo data is not LOCUS.",
    events: loadEvents(),
  };
  download("evolocus-review-events.json", JSON.stringify(payload, null, 2), "application/json");
}

function exportLatestCsv() {
  const latest = Array.from(latestEvents().values()).filter((event) => event.reviewer_id === state.reviewer);
  const rows = latest.map((event) => {
    const record = records.find((item) => item.record_id === event.record_id) || {};
    const review = event.review || {};
    return {
      record_id: event.record_id,
      source_locator: event.source_locator,
      reviewer_id: event.reviewer_id,
      event_type: event.event_type,
      created_at: event.created_at,
      state: record.state || "",
      jurisdiction_name: record.jurisdiction_name || "",
      disposition: review.disposition || "",
      human_substantivity: review.human_substantivity || "",
      human_function: review.human_function || "",
      human_topic: review.human_topic || "",
      ocr_quality: review.ocr_quality || "",
      jurisdiction_quality: review.jurisdiction_quality || "",
      revealed_before_submission: String(Boolean(event.revealed_before_submission)),
    };
  });
  download("evolocus-latest-reviews.csv", toCsv(rows), "text/csv");
}

function toCsv(rows) {
  if (!rows.length) {
    return "record_id,source_locator,reviewer_id,event_type,created_at\n";
  }
  const headers = Object.keys(rows[0]);
  const values = rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","));
  return `${headers.join(",")}\n${values.join("\n")}\n`;
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function formatScore(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "not available";
  }
  return Number(value).toFixed(3);
}

function formatFraction(metric) {
  if (!metric.denominator) {
    return "n/a";
  }
  return `${metric.correct}/${metric.denominator}`;
}

async function fetchAnalysisArtifacts() {
  try {
    const [status, mapLayers, countyGeometry, municipalPoints, auditStatus, unitAuditQuality, ontology, chatIndex, inquiryBriefings, questionPack, models, charts, artifactSnapshot, visualSmoke, refreshStatus] = await Promise.all([
      fetchJson(ANALYSIS_PATHS.status),
      fetchJson(ANALYSIS_PATHS.mapLayers),
      fetchJson(ANALYSIS_PATHS.countyGeometry),
      fetchJson(ANALYSIS_PATHS.municipalPoints),
      fetchJson(ANALYSIS_PATHS.auditStatus),
      fetchJson(ANALYSIS_PATHS.unitAuditQuality),
      fetchJson(ANALYSIS_PATHS.ontology),
      fetchJson(ANALYSIS_PATHS.chatIndex),
      fetchJson(ANALYSIS_PATHS.inquiryBriefings),
      fetchJson(ANALYSIS_PATHS.questionPack),
      fetchJson(ANALYSIS_PATHS.models),
      fetchJson(ANALYSIS_PATHS.charts),
      fetchJson(ANALYSIS_PATHS.artifactSnapshot),
      fetchJson(ANALYSIS_PATHS.visualSmoke),
      fetchJson(ANALYSIS_PATHS.refreshStatus),
    ]);
    state.analysis = { status, mapLayers, countyGeometry, municipalPoints, auditStatus, unitAuditQuality, ontology, chatIndex, inquiryBriefings, questionPack, models, charts, artifactSnapshot, visualSmoke, refreshStatus, error: null };
  } catch (error) {
    state.analysis.error = `Could not load analysis artifacts: ${error.message}`;
  }
  render();
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  return response.json();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function initializeScoreSelects() {
  $all("select[name^='score_']").forEach((select) => {
    select.innerHTML = "";
    SCORE_OPTIONS.forEach((option) => select.append(new Option(option, option)));
    select.value = "not_reviewed";
  });
}

function bindEvents() {
  $all(".tab-link").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      render();
    });
  });
  $("#reviewer-input").addEventListener("change", (event) => {
    state.reviewer = event.target.value || "local-reviewer";
    localStorage.setItem(STORAGE_REVIEWER, state.reviewer);
    render();
  });
  $("#blind-toggle").addEventListener("change", (event) => {
    state.blind = event.target.checked;
    localStorage.setItem(STORAGE_BLIND, String(state.blind));
    render();
  });
  $("#seed-demo").addEventListener("click", resetDemoQueue);
  $("#load-demo-package").addEventListener("click", loadSyntheticPackageDemo);
  $("#queue-import").addEventListener("change", importQueue);
  $("#export-events").addEventListener("click", exportEvents);
  $("#export-latest").addEventListener("click", exportLatestCsv);
  $("#analysis-journey").addEventListener("click", (event) => {
    const stepButton = event.target.closest("[data-journey-tab]");
    if (!stepButton) {
      return;
    }
    openAnalysisJourneyStep(stepButton.dataset.journeyTab, stepButton.dataset.journeyDisclosure);
  });
  $("#frontdoor-visual-path").addEventListener("click", (event) => {
    const questionOntologyButton = event.target.closest("[data-question-ontology-open]");
    if (questionOntologyButton) {
      event.preventDefault();
      applyFrontdoorComposerAction("ontology", $("#frontdoor-visual-path [data-frontdoor-composer]"));
      return;
    }
    const composerButton = event.target.closest("[data-frontdoor-composer-action]");
    if (composerButton) {
      event.preventDefault();
      applyFrontdoorComposerAction(composerButton.dataset.frontdoorComposerAction || "preview", composerButton.closest("form"));
      return;
    }
    const exportRoutesButton = event.target.closest("[data-frontdoor-export-routes]");
    if (exportRoutesButton) {
      event.preventDefault();
      exportFrontdoorSavedRoutes();
      return;
    }
    const savedRouteButton = event.target.closest("[data-frontdoor-route-action]");
    if (savedRouteButton) {
      event.preventDefault();
      applyFrontdoorSavedRoute(savedRouteButton.dataset.frontdoorRouteAction || "answer", savedRouteButton.dataset.frontdoorRouteId || "");
      return;
    }
    const exampleButton = event.target.closest("[data-frontdoor-example-action]");
    if (exampleButton) {
      event.preventDefault();
      applyFrontdoorExampleQuestion(
        exampleButton.dataset.frontdoorExampleAction || "",
        exampleButton.dataset.frontdoorExampleTopic || "",
        exampleButton.dataset.frontdoorExampleTier || "",
        exampleButton.dataset.frontdoorExampleQuestion || "",
      );
      return;
    }
    const actionButton = event.target.closest("[data-frontdoor-action]");
    if (actionButton) {
      event.preventDefault();
      applyFrontdoorVisualPathAction(actionButton.dataset.frontdoorAction, actionButton.dataset.frontdoorQuestion || "");
      return;
    }
    const disclosureButton = event.target.closest("[data-frontdoor-disclosure]");
    if (disclosureButton) {
      event.preventDefault();
      state.disclosureLevel = disclosureButton.dataset.frontdoorDisclosure;
      render();
    }
  });
  $("#frontdoor-visual-path").addEventListener("submit", (event) => {
    const form = event.target.closest("[data-frontdoor-composer]");
    if (!form) {
      return;
    }
    event.preventDefault();
    applyFrontdoorComposerAction("preview", form);
  });
  $("#frontdoor-visual-path").addEventListener("change", (event) => {
    const importInput = event.target.closest("[data-frontdoor-import-routes]");
    if (!importInput) {
      return;
    }
    importFrontdoorSavedRoutes(event);
  });
  $("#previous-record").addEventListener("click", () => {
    state.currentIndex = Math.max(0, state.currentIndex - 1);
    render();
  });
  $("#next-record").addEventListener("click", () => {
    state.currentIndex = Math.min(records.length - 1, state.currentIndex + 1);
    render();
  });
  $("#reveal-prediction").addEventListener("click", () => {
    const record = currentRecord();
    if (!record) {
      return;
    }
    state.revealed[record.record_id] = true;
    appendEvent({ event_type: "reveal_prediction", record, review: {} });
    render();
  });
  $("#review-form").addEventListener("submit", handleReviewSubmit);
  $("#explorer-form").addEventListener("submit", applyExplorerFilters);
  $("#map-filter-form").addEventListener("submit", applyMapFilters);
  $("#reset-map-filters").addEventListener("click", resetMapFilters);
  $("#walkthrough-panel").addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-walkthrough-action]");
    if (actionButton) {
      if (actionButton.dataset.walkthroughAction === "demo-package") {
        loadSyntheticPackageDemo();
      }
      return;
    }
    const tabButton = event.target.closest("[data-walkthrough-tab]");
    if (tabButton) {
      state.activeTab = tabButton.dataset.walkthroughTab;
      render();
      return;
    }
    const disclosureButton = event.target.closest("[data-walkthrough-disclosure]");
    if (disclosureButton) {
      state.disclosureLevel = disclosureButton.dataset.walkthroughDisclosure;
      render();
    }
  });
  $all(".disclosure-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.disclosureLevel = button.dataset.disclosure;
      render();
    });
  });
  $all(".geo-color-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.geographyColorMode = button.dataset.geoColor || "tier";
      renderMap();
    });
  });
  $all("[data-geo-layer]").forEach((control) => {
    control.addEventListener("change", () => {
      state.geographyLayers = {
        ...defaultGeographyLayers(),
        ...state.geographyLayers,
        [control.dataset.geoLayer]: control.checked,
      };
      renderMap();
    });
  });
  $("#inquiry-form").addEventListener("submit", submitInquiry);
  $("#suggested-questions").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-question]");
    if (!button) {
      return;
    }
    $("#inquiry-form input[name='question']").value = button.dataset.question;
    answerAndLogInquiry(button.dataset.question, "suggested question");
    renderInquiry();
  });
  $("#inquiry-question-matrix").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-inquiry-prompt]");
    if (!button) {
      return;
    }
    if (button.dataset.inquiryPack) {
      applyQuestionPackPrompt(button.dataset.inquiryPack);
    }
    if (button.dataset.inquiryUnit) {
      state.selectedUnitId = button.dataset.inquiryUnit;
    }
    $("#inquiry-form input[name='question']").value = button.dataset.inquiryPrompt;
    answerAndLogInquiry(button.dataset.inquiryPrompt, button.dataset.inquiryPack ? "question-pack preset" : "inquiry matrix preset");
    render();
  });
  $("#inquiry-panel").addEventListener("click", (event) => {
    const statusButton = event.target.closest("[data-open-status-tab]");
    if (statusButton) {
      event.preventDefault();
      openAnalysisStatusTab();
      return;
    }
    const questionOntologyButton = event.target.closest("[data-question-ontology-open]");
    if (questionOntologyButton) {
      event.preventDefault();
      const question = String($("#inquiry-form input[name='question']")?.value || state.inquiryMapComposerQuestion || "").trim();
      applyQuestionOntologyRoute(inquiryMapComposerPlan(question).ontologyRoute);
      return;
    }
    const composerActionButton = event.target.closest("[data-inquiry-map-composer-action]");
    if (composerActionButton) {
      event.preventDefault();
      applyInquiryMapComposerAction(composerActionButton.dataset.inquiryMapComposerAction || "preview");
      return;
    }
    const composerUnitButton = event.target.closest("[data-inquiry-map-composer-unit]");
    if (composerUnitButton) {
      event.preventDefault();
      openInquiryMapComposerUnit(composerUnitButton.dataset.inquiryMapComposerUnit || "");
      return;
    }
    const answerChartButton = event.target.closest("[data-inquiry-answer-chart-action]");
    if (answerChartButton) {
      event.preventDefault();
      applyInquiryAnswerChartAction(
        answerChartButton.dataset.inquiryAnswerChartAction || "",
        answerChartButton.dataset.inquiryAnswerChartValue || "",
      );
      return;
    }
    const answerOntologyButton = event.target.closest("[data-inquiry-answer-ontology-action]");
    if (answerOntologyButton) {
      event.preventDefault();
      applyInquiryAnswerOntologyAction(
        answerOntologyButton.dataset.inquiryAnswerOntologyAction || "",
        answerOntologyButton.dataset.inquiryAnswerOntologyValue || "",
      );
      return;
    }
    const answerFilterChip = event.target.closest("[data-inquiry-answer-filter-chip]");
    if (answerFilterChip) {
      event.preventDefault();
      applyInquiryAnswerFilterChip(
        answerFilterChip.dataset.inquiryAnswerFilterChip || "",
        answerFilterChip.dataset.inquiryAnswerFilterValue || "",
      );
      return;
    }
    const answerMapButton = event.target.closest("[data-inquiry-answer-map-action]");
    if (answerMapButton) {
      event.preventDefault();
      applyInquiryAnswerMapAction(
        answerMapButton.dataset.inquiryAnswerMapAction || "highlight",
        answerMapButton.dataset.inquiryAnswerMapValue || "",
      );
      return;
    }
    const answerMapUnitButton = event.target.closest("[data-inquiry-answer-map-unit]");
    if (answerMapUnitButton) {
      event.preventDefault();
      openInquiryAnswerMapUnit(answerMapUnitButton.dataset.inquiryAnswerMapUnit || "");
      return;
    }
    const drawerUnitButton = event.target.closest("[data-inquiry-drawer-unit]");
    if (drawerUnitButton) {
      event.preventDefault();
      openAuditUnitOnMap(drawerUnitButton.dataset.inquiryDrawerUnit || "");
      return;
    }
    const drawerOpenButton = event.target.closest("[data-inquiry-drawer-open]");
    if (drawerOpenButton) {
      event.preventDefault();
      applyInquiryOntologyDrawerOpen(
        drawerOpenButton.dataset.inquiryDrawerOpen || "",
        drawerOpenButton.dataset.inquiryDrawerValue || "",
      );
      return;
    }
    const pathwayPeerButton = event.target.closest("[data-inquiry-pathway-peer-unit]");
    if (pathwayPeerButton) {
      event.preventDefault();
      openAuditUnitOnMap(pathwayPeerButton.dataset.inquiryPathwayPeerUnit);
      return;
    }
    const pathwayOntologyButton = event.target.closest("[data-inquiry-pathway-ontology]");
    if (pathwayOntologyButton) {
      event.preventDefault();
      applyInquiryPathwayOntology(
        pathwayOntologyButton.dataset.inquiryPathwayOntology || "",
        pathwayOntologyButton.dataset.pathwayTopic || "",
        pathwayOntologyButton.dataset.pathwayTier || "",
        pathwayOntologyButton.dataset.pathwayUnit || "",
      );
      return;
    }
    const pathwayAskButton = event.target.closest("[data-inquiry-pathway-ask]");
    if (pathwayAskButton) {
      event.preventDefault();
      applyInquiryPathway(
        pathwayAskButton.dataset.pathwayTopic || "",
        pathwayAskButton.dataset.pathwayTier || "",
        pathwayAskButton.dataset.pathwayQuestion || "",
        "inquiry",
      );
      return;
    }
    const pathwayMapButton = event.target.closest("[data-inquiry-pathway-map]");
    if (pathwayMapButton) {
      event.preventDefault();
      applyInquiryPathway(
        pathwayMapButton.dataset.pathwayTopic || "",
        pathwayMapButton.dataset.pathwayTier || "",
        "",
        "map",
      );
      return;
    }
    const replayButton = event.target.closest("[data-replay-inquiry-log]");
    if (replayButton) {
      event.preventDefault();
      replayInquiryResultLog(replayButton.dataset.replayInquiryLog, "inquiry");
      return;
    }
    const mapReplayButton = event.target.closest("[data-open-inquiry-log-map]");
    if (mapReplayButton) {
      event.preventDefault();
      replayInquiryResultLog(mapReplayButton.dataset.openInquiryLogMap, "map");
      return;
    }
    const ontologyReplayButton = event.target.closest("[data-open-inquiry-log-ontology]");
    if (ontologyReplayButton) {
      event.preventDefault();
      replayInquiryResultLog(ontologyReplayButton.dataset.openInquiryLogOntology, "ontology");
      return;
    }
    const exportButton = event.target.closest("#export-inquiry-log");
    if (exportButton) {
      event.preventDefault();
      exportInquiryResultsLog();
      return;
    }
    const clearButton = event.target.closest("#clear-inquiry-log");
    if (clearButton) {
      event.preventDefault();
      clearInquiryResultsLog();
    }
  });
  $("#map-panel").addEventListener("click", (event) => {
    const statusButton = event.target.closest("[data-open-status-tab]");
    if (statusButton) {
      event.preventDefault();
      openAnalysisStatusTab();
      return;
    }
    const questionOntologyButton = event.target.closest("[data-question-ontology-open]");
    if (questionOntologyButton) {
      event.preventDefault();
      applyQuestionOntologyRoute();
      return;
    }
    const selectedDisclosureButton = event.target.closest("[data-selected-disclosure]");
    if (selectedDisclosureButton) {
      event.preventDefault();
      state.disclosureLevel = selectedDisclosureButton.dataset.selectedDisclosure;
      render();
      return;
    }
    const selectedRouteButton = event.target.closest("[data-selected-route-open]");
    if (selectedRouteButton) {
      event.preventDefault();
      openSelectedUnitOntologyRoute(selectedRouteButton.dataset.selectedRouteOpen || "auto");
      return;
    }
    const routeComparisonPeerButton = event.target.closest("[data-route-comparison-peer]");
    if (routeComparisonPeerButton) {
      event.preventDefault();
      openAuditUnitOnMap(routeComparisonPeerButton.dataset.routeComparisonPeer || "");
      return;
    }
    const routeComparisonOntologyButton = event.target.closest("[data-route-comparison-ontology]");
    if (routeComparisonOntologyButton) {
      event.preventDefault();
      openTierOntology(routeComparisonOntologyButton.dataset.routeComparisonOntology || "");
      return;
    }
    const selectedQueryButton = event.target.closest("[data-selected-query-route]");
    if (selectedQueryButton) {
      event.preventDefault();
      applySelectedUnitQueryRoute(
        selectedQueryButton.dataset.selectedQueryRoute || "inquiry",
        selectedQueryButton.dataset.selectedQueryUnit || "",
      );
      return;
    }
    const selectedOntologyQueryButton = event.target.closest("[data-selected-ontology-query]");
    if (selectedOntologyQueryButton) {
      event.preventDefault();
      applySelectedUnitOntologyQuery(
        selectedOntologyQueryButton.dataset.selectedOntologyQuery || "",
        selectedOntologyQueryButton.dataset.selectedOntologyQueryValue || "",
      );
      return;
    }
    const clearInquiryMapHighlightButton = event.target.closest("[data-clear-inquiry-map-highlight]");
    if (clearInquiryMapHighlightButton) {
      event.preventDefault();
      state.inquiryMapHighlight = null;
      renderMap();
      return;
    }
    const crossFilterButton = event.target.closest("[data-map-cross-filter]");
    if (crossFilterButton) {
      event.preventDefault();
      applyMapCrossFilterLegend(
        crossFilterButton.dataset.mapCrossFilter || "",
        crossFilterButton.dataset.mapCrossValue || "",
        crossFilterButton.dataset.mapCrossLabel || "",
      );
      return;
    }
    const tierDrilldownButton = event.target.closest("[data-map-tier-drilldown]");
    if (tierDrilldownButton) {
      event.preventDefault();
      applyMapTierLegendDrilldown(
        tierDrilldownButton.dataset.mapTierDrilldown || "",
        tierDrilldownButton.dataset.mapTierDrilldownValue || "",
      );
      return;
    }
    const selectedNeighborFilterButton = event.target.closest("[data-selected-neighbor-filter]");
    if (selectedNeighborFilterButton) {
      event.preventDefault();
      applySelectedNeighborFilter(selectedNeighborFilterButton.dataset.selectedNeighborFilter || "all");
      return;
    }
    const ontologyPathButton = event.target.closest("[data-ontology-path-stage]");
    if (ontologyPathButton) {
      event.preventDefault();
      applyOntologyPathStage(ontologyPathButton.dataset.ontologyPathStage);
      return;
    }
    const ontologyDrilldownButton = event.target.closest("[data-selected-ontology-drilldown]");
    if (ontologyDrilldownButton) {
      event.preventDefault();
      applySelectedOntologyDrilldown(ontologyDrilldownButton.dataset.selectedOntologyDrilldown);
      return;
    }
    const packageFilterButton = event.target.closest("[data-package-map-filter]");
    if (packageFilterButton) {
      event.preventDefault();
      applyPackageMapFilter(packageFilterButton.dataset.packageMapFilter);
      return;
    }
    const mapRouteAnswerButton = event.target.closest("[data-map-route-replay-answer]");
    if (mapRouteAnswerButton) {
      event.preventDefault();
      replayInquiryResultLog(mapRouteAnswerButton.dataset.mapRouteReplayAnswer, "inquiry");
      return;
    }
    const mapRouteMapButton = event.target.closest("[data-map-route-replay-map]");
    if (mapRouteMapButton) {
      event.preventDefault();
      replayInquiryResultLog(mapRouteMapButton.dataset.mapRouteReplayMap, "map");
      return;
    }
    const mapRouteOntologyButton = event.target.closest("[data-map-route-replay-ontology]");
    if (mapRouteOntologyButton) {
      event.preventDefault();
      replayInquiryResultLog(mapRouteOntologyButton.dataset.mapRouteReplayOntology, "ontology");
      return;
    }
    const mapInquiryButton = event.target.closest("[data-map-inquiry]");
    if (mapInquiryButton) {
      event.preventDefault();
      state.mapInlineInquiry = mapInquiryButton.dataset.mapInquiry;
      renderMap();
      return;
    }
    const saveMapInquiryButton = event.target.closest("[data-save-map-inquiry]");
    if (saveMapInquiryButton) {
      event.preventDefault();
      saveCurrentMapInquiryHistory();
      return;
    }
    const exportMapInquiryButton = event.target.closest("[data-export-map-inquiry-history]");
    if (exportMapInquiryButton) {
      event.preventDefault();
      exportMapInquiryHistory();
      return;
    }
    const loadMapInquiryButton = event.target.closest("[data-load-map-inquiry]");
    if (loadMapInquiryButton) {
      event.preventDefault();
      loadMapInquiryHistoryItem(loadMapInquiryButton.dataset.loadMapInquiry);
      return;
    }
    const deleteMapInquiryButton = event.target.closest("[data-delete-map-inquiry]");
    if (deleteMapInquiryButton) {
      event.preventDefault();
      deleteMapInquiryHistoryItem(deleteMapInquiryButton.dataset.deleteMapInquiry);
      return;
    }
    const mapCompareButton = event.target.closest("[data-map-compare-unit]");
    if (mapCompareButton) {
      event.preventDefault();
      openAuditUnitOnMap(mapCompareButton.dataset.mapCompareUnit);
      return;
    }
    const topicTierAskButton = event.target.closest("[data-map-topic-tier-ask]");
    if (topicTierAskButton) {
      event.preventDefault();
      askMapTopicTierMatrix(
        topicTierAskButton.dataset.mapTopicTierTopic || "",
        topicTierAskButton.dataset.mapTopicTierTier || "",
        topicTierAskButton.dataset.mapTopicTierQuestion || "",
      );
      return;
    }
    const topicTierButton = event.target.closest("[data-map-topic-tier-filter]");
    if (topicTierButton) {
      event.preventDefault();
      applyMapTopicTierMatrix(topicTierButton.dataset.mapTopicTierTopic || "", topicTierButton.dataset.mapTopicTierTier || "");
      return;
    }
    const tierOntologyButton = event.target.closest("[data-tier-ontology]");
    if (tierOntologyButton) {
      event.preventDefault();
      openTierOntology(tierOntologyButton.dataset.tierOntology);
      return;
    }
    const askButton = event.target.closest("[data-ask-unit-id]");
    if (askButton) {
      event.preventDefault();
      askAboutMapUnit(askButton.dataset.askUnitId);
      return;
    }
    const target = event.target.closest("[data-unit-id]");
    if (!target) {
      return;
    }
    state.selectedUnitId = target.dataset.unitId;
    renderMap();
  });
  $("#status-panel").addEventListener("click", (event) => {
    const lineageButton = event.target.closest("[data-artifact-lineage-tab]");
    if (!lineageButton) {
      return;
    }
    event.preventDefault();
    state.activeTab = lineageButton.dataset.artifactLineageTab;
    render();
  });
  $("#results-panel").addEventListener("click", (event) => {
    const routeButton = event.target.closest("[data-chart-route-action]");
    if (routeButton) {
      event.preventDefault();
      applyChartRouteLegend(routeButton.dataset.chartRouteAction || "");
      return;
    }
    const chartOntologyButton = event.target.closest("[data-chart-ontology-action]");
    if (chartOntologyButton) {
      event.preventDefault();
      applyChartOntologyAction(
        chartOntologyButton.dataset.chartOntologyAction || "",
        chartOntologyButton.dataset.chartOntologyValue || "",
        chartOntologyButton.dataset.chartOntologyLabel || "",
        chartOntologyButton.dataset.chartOntologyState || "",
      );
      return;
    }
    const chartInquiryButton = event.target.closest("[data-chart-inquiry-action]");
    if (chartInquiryButton) {
      event.preventDefault();
      applyChartInquiryAction(
        chartInquiryButton.dataset.chartInquiryAction || "",
        chartInquiryButton.dataset.chartInquiryValue || "",
        chartInquiryButton.dataset.chartInquiryLabel || "",
        chartInquiryButton.dataset.chartInquiryState || "",
      );
      return;
    }
    const chartQuestionChip = event.target.closest("[data-chart-question-chip]");
    if (chartQuestionChip) {
      event.preventDefault();
      applyChartQuestionChip(
        chartQuestionChip.dataset.chartQuestionChip || "",
        chartQuestionChip.dataset.chartQuestionValue || "",
        chartQuestionChip.dataset.chartQuestionLabel || "",
        chartQuestionChip.dataset.chartQuestionState || "",
      );
      return;
    }
    const unitButton = event.target.closest("[data-chart-map-unit]");
    if (unitButton) {
      event.preventDefault();
      openChartUnitOnMap(unitButton.dataset.chartMapUnit || "");
      return;
    }
    const stateTopicButton = event.target.closest("[data-chart-state-topic-map]");
    if (stateTopicButton) {
      event.preventDefault();
      applyChartStateTopicFilter(stateTopicButton.dataset.chartStateTopicMap || "", stateTopicButton.dataset.chartTopicMap || "");
      return;
    }
    const topicButton = event.target.closest("[data-chart-topic-map]");
    if (topicButton) {
      event.preventDefault();
      applyChartStateTopicFilter(topicButton.dataset.chartStateMap || "", topicButton.dataset.chartTopicMap || "");
      return;
    }
    const stateButton = event.target.closest("[data-chart-state-map]");
    if (stateButton) {
      event.preventDefault();
      applyChartStateTopicFilter(stateButton.dataset.chartStateMap || "", "");
      return;
    }
    const chartFilterButton = event.target.closest("[data-chart-map-filter]");
    if (chartFilterButton) {
      event.preventDefault();
      applyChartMapFilter(
        chartFilterButton.dataset.chartMapFilter || "",
        chartFilterButton.dataset.chartMapValue || "",
        chartFilterButton.dataset.chartMapLabel || "",
      );
    }
  });
  $("#audit-panel").addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-audit-unit]");
    if (!button) {
      return;
    }
    openAuditUnitOnMap(button.dataset.openAuditUnit);
  });
  $("#score-panel").addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-score-unit]");
    if (!button) {
      return;
    }
    openScoreUnitOnMap(button.dataset.openScoreUnit);
  });
  $("#ontology-panel").addEventListener("click", (event) => {
    const questionOntologyButton = event.target.closest("[data-question-ontology-open]");
    if (questionOntologyButton) {
      event.preventDefault();
      applyQuestionOntologyRoute();
      return;
    }
    const modelStatusButton = event.target.closest("[data-model-status-action]");
    if (modelStatusButton) {
      event.preventDefault();
      applyModelStatusAction(modelStatusButton.dataset.modelStatusAction || "");
      return;
    }
    const actionButton = event.target.closest("[data-ontology-action]");
    if (actionButton) {
      if (actionButton.dataset.ontologyAction === "demo-package") {
        loadSyntheticPackageDemo();
      }
      if (actionButton.dataset.ontologyAction === "open-map") {
        state.activeTab = "map";
        render();
      }
      if (actionButton.dataset.ontologyAction === "open-status") {
        openAnalysisStatusTab();
      }
      return;
    }
    const ontologyPathButton = event.target.closest("[data-ontology-path-stage]");
    if (ontologyPathButton) {
      applyOntologyPathStage(ontologyPathButton.dataset.ontologyPathStage);
      return;
    }
    const queryPresetButton = event.target.closest("[data-ontology-query-preset]");
    if (queryPresetButton) {
      applyOntologyQueryPreset(queryPresetButton.dataset.ontologyQueryPreset);
      return;
    }
    const mapPresetButton = event.target.closest("[data-ontology-map-preset]");
    if (mapPresetButton) {
      applyOntologyMapPreset(mapPresetButton.dataset.ontologyMapPreset, mapPresetButton.dataset.ontologyMapPresetAction || "map");
      return;
    }
    const tierUnitButton = event.target.closest("[data-tier-ontology-unit]");
    if (tierUnitButton) {
      openAuditUnitOnMap(tierUnitButton.dataset.tierOntologyUnit);
      return;
    }
    const tierNeighborhoodMapButton = event.target.closest("[data-tier-neighborhood-map]");
    if (tierNeighborhoodMapButton) {
      highlightOntologyTierOnMap();
      return;
    }
    const tierNeighborhoodScoreButton = event.target.closest("[data-tier-neighborhood-score]");
    if (tierNeighborhoodScoreButton) {
      applyTierNeighborhoodFilter("score", tierNeighborhoodScoreButton.dataset.tierNeighborhoodScore || "");
      return;
    }
    const tierNeighborhoodFilterButton = event.target.closest("[data-tier-neighborhood-filter]");
    if (tierNeighborhoodFilterButton) {
      applyTierNeighborhoodFilter(
        tierNeighborhoodFilterButton.dataset.tierNeighborhoodFilter || "",
        tierNeighborhoodFilterButton.dataset.tierNeighborhoodValue || "",
      );
      return;
    }
    const tierMiniFilterButton = event.target.closest("[data-tier-mini-filter]");
    if (tierMiniFilterButton) {
      applyTierMiniFilter(tierMiniFilterButton.dataset.tierMiniFilter, tierMiniFilterButton.dataset.tierMiniValue);
      return;
    }
    const tierScoreFilterButton = event.target.closest("[data-tier-score-filter]");
    if (tierScoreFilterButton) {
      applyTierScoreFilter(tierScoreFilterButton.dataset.tierScoreFilter, tierScoreFilterButton.dataset.tierScoreBand);
      return;
    }
    const unitButton = event.target.closest("[data-package-ontology-unit]");
    if (unitButton) {
      openAuditUnitOnMap(unitButton.dataset.packageOntologyUnit);
    }
  });
  $("#queue-plan-form").addEventListener("submit", applyQueuePlan);
  $("#export-queue-plan").addEventListener("click", exportQueuePlan);
  $("#export-review-package-request").addEventListener("click", exportReviewPackageRequest);
  $all(".export-current-view").forEach((button) => {
    button.addEventListener("click", exportCurrentViewSnapshot);
  });
  $all(".save-current-view").forEach((button) => {
    button.addEventListener("click", saveCurrentViewSnapshot);
  });
  $("#save-snapshot").addEventListener("click", saveCurrentViewSnapshot);
  $("#export-snapshot-gallery").addEventListener("click", exportSnapshotGallery);
  $("#clear-snapshot-gallery").addEventListener("click", clearSnapshotGallery);
  $("#snapshots-panel").addEventListener("click", (event) => {
    const loadButton = event.target.closest("[data-load-snapshot]");
    if (loadButton) {
      loadSnapshotView(loadButton.dataset.loadSnapshot);
      return;
    }
    const deleteButton = event.target.closest("[data-delete-snapshot]");
    if (deleteButton) {
      deleteSnapshot(deleteButton.dataset.deleteSnapshot);
    }
  });
  $("#queueplan-panel").addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-queue-unit]");
    if (!button) {
      return;
    }
    openAuditUnitOnMap(button.dataset.openQueueUnit);
  });
  $("#explorer-table").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-open-record]");
    if (!button) {
      return;
    }
    const index = records.findIndex((record) => record.record_id === button.dataset.openRecord);
    if (index >= 0) {
      state.currentIndex = index;
      state.activeTab = "review";
      render();
    }
  });
}

initializeScoreSelects();
bindEvents();
render();
fetchAnalysisArtifacts();
