const STORAGE_EVENTS = "evolocus.pages.reviewEvents.v1";
const STORAGE_REVIEWER = "evolocus.pages.reviewer.v1";
const STORAGE_BLIND = "evolocus.pages.blind.v1";
const STORAGE_RECORDS = "evolocus.pages.records.v1";

const ANALYSIS_PATHS = {
  status: "data/analysis/status.json",
  mapLayers: "data/analysis/map_layers.json",
  countyGeometry: "data/analysis/county_geometry.json",
  municipalPoints: "data/analysis/municipal_points.json",
  ontology: "data/analysis/ontology.json",
  chatIndex: "data/analysis/chat_index.json",
  inquiryBriefings: "data/analysis/inquiry_briefings.json",
  models: "data/analysis/models.json",
  charts: "data/analysis/charts.json",
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
  mapFilters: {
    state: "",
    topic: "",
    function: "",
    tier: "",
    minLaws: 0,
  },
  inquiryAnswer: null,
  analysis: {
    status: null,
    mapLayers: null,
    countyGeometry: null,
    municipalPoints: null,
    ontology: null,
    chatIndex: null,
    inquiryBriefings: null,
    models: null,
    charts: null,
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
  renderMap();
  renderOntology();
  renderInquiry();
  renderReview();
  renderExplorer();
  renderResults();
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
  $("#mode-select").value = records === syntheticRecords ? "demo" : "imported";
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
    "SYNTHETIC DEMONSTRATION DATA",
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
  renderAnalysisStatus(status, units);

  if (!mapLayers) {
    $("#map-generated").textContent = state.analysis.error || "Analysis artifacts are loading.";
    $("#map-geometry-status").textContent = "No map layer loaded";
    $("#tier-legend").innerHTML = "";
    $("#law-map").innerHTML = "";
    $("#map-insight-grid").innerHTML = "";
    $("#map-comparison-grid").innerHTML = "";
    $("#unit-detail").innerHTML = "<p>No map layer has loaded yet.</p>";
    $("#map-unit-table tbody").innerHTML = "";
    return;
  }

  renderMapFilters(allUnits);
  renderMapInsights(units, allUnits);
  renderMapComparisons(units, allUnits);
  renderCountyChoropleth(units);
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

  if (state.selectedUnitId && !units.some((unit) => unit.unit_id === state.selectedUnitId)) {
    state.selectedUnitId = null;
  }
  if (!state.selectedUnitId && units.length) {
    state.selectedUnitId = units[0].unit_id;
  }

  const visibleStates = new Set(units.map((unit) => unit.state).filter(Boolean));
  const stateCenters = (mapLayers.state_centers || []).filter((center) => visibleStates.has(center.state));
  $("#law-map").setAttribute("viewBox", mapLayers.view_box || "0 0 100 100");
  $("#law-map").innerHTML = `${stateCenters.map(stateCenterSvg).join("")}${units.map(unitSvg).join("")}`;
  $("#map-unit-table tbody").innerHTML = units
    .map(
      (unit) => `
        <tr>
          <td><button type="button" data-unit-id="${escapeHtml(unit.unit_id)}">${escapeHtml(displayUnitName(unit))}</button></td>
          <td>${escapeHtml(text(unit.state))}</td>
          <td>${escapeHtml(text(unit.kind))}</td>
          <td>${escapeHtml(text(unit.tier_label))}</td>
          <td>${escapeHtml(String(unit.law_count))}</td>
          <td>${escapeHtml(text(unit.dominant_topic))}</td>
        </tr>
      `,
    )
    .join("");
  renderSelectedUnit();
  renderPublicationGates();
  renderDisclosureButtons();
  renderGeoColorButtons();
}

function renderCountyChoropleth(units) {
  const artifact = state.analysis.countyGeometry;
  const municipalArtifact = state.analysis.municipalPoints;
  const summary = $("#county-layer-summary");
  const svg = $("#county-choropleth");
  const detail = $("#county-layer-detail");
  const legend = $("#geo-color-legend");
  if (!summary || !svg || !detail || !legend) {
    return;
  }
  if (!artifact) {
    summary.innerHTML = "<span>Official geography loading</span>";
    svg.innerHTML = "";
    detail.innerHTML = "<p>Official geography artifacts have not loaded yet.</p>";
    legend.innerHTML = "";
    return;
  }
  const visibleCountyIds = new Set(units.filter((unit) => unit.kind === "county").map((unit) => unit.unit_id));
  const visibleMunicipalIds = new Set(units.filter((unit) => unit.kind === "city").map((unit) => unit.unit_id));
  const features = (artifact.feature_collection?.features || []).filter((feature) =>
    visibleCountyIds.has(feature.properties?.unit_id),
  );
  const municipalPoints = (municipalArtifact?.points || []).filter((point) => visibleMunicipalIds.has(point.unit_id));
  const allFeatures = artifact.feature_collection?.features || [];
  summary.innerHTML = `
    <span>${escapeHtml(formatCount(features.length))} visible counties</span>
    <span>${escapeHtml(formatCount(municipalPoints.length))} visible municipal points</span>
    <span>${escapeHtml(formatCount(artifact.matched_count || allFeatures.length))}/${escapeHtml(formatCount(artifact.county_unit_count || allFeatures.length))} matched</span>
    <span>${escapeHtml(formatCount(municipalArtifact?.matched_count || 0))}/${escapeHtml(formatCount(municipalArtifact?.municipal_unit_count || 0))} municipal matched</span>
    <span>color: ${escapeHtml(geographyColorLabel(state.geographyColorMode))}</span>
    <span>${escapeHtml(artifact.geometry_status || "geometry status unknown")}</span>
  `;
  svg.setAttribute("viewBox", "0 0 960 560");
  if (!features.length && !municipalPoints.length) {
    svg.innerHTML = `<text x="32" y="54">No matched county polygons or municipal points under the current filters.</text>`;
    detail.innerHTML = "<p>No official geography matches the active filters. Clear filters or select matched county/municipal units.</p>";
    legend.innerHTML = "";
    return;
  }
  const bounds = geoBounds(features, municipalPoints);
  const colorContext = geographyColorContext(features, municipalPoints);
  legend.innerHTML = geographyColorLegend(colorContext);
  svg.innerHTML = `${features.map((feature) => countyFeatureSvg(feature, bounds, colorContext)).join("")}${municipalPoints.map((point) => municipalPointSvg(point, bounds, colorContext)).join("")}`;
  const selectedPoint = municipalPoints.find((point) => point.unit_id === state.selectedUnitId);
  const selectedFeature = features.find((feature) => feature.properties?.unit_id === state.selectedUnitId);
  if (selectedPoint) {
    renderMunicipalPointDetail(selectedPoint, municipalArtifact);
  } else if (features.length) {
    renderCountyGeometryDetail(selectedFeature || features[0], artifact, municipalArtifact);
  } else {
    renderMunicipalPointDetail(municipalPoints[0], municipalArtifact);
  }
}

function countyFeatureSvg(feature, bounds, colorContext) {
  const properties = feature.properties || {};
  const d = geometryPath(feature.geometry, bounds);
  const selected = properties.unit_id === state.selectedUnitId ? " selected" : "";
  const fill = geographyDatumColor(properties, colorContext);
  return `
    <path
      class="county-feature${selected}"
      data-unit-id="${escapeHtml(properties.unit_id)}"
      d="${d}"
      fill="${escapeHtml(fill)}"
      tabindex="0"
    >
      <title>${escapeHtml(properties.census_name || properties.unit_name)} · ${escapeHtml(properties.tier_label || "No tier")} · ${escapeHtml(formatCount(properties.law_count))} laws</title>
    </path>
  `;
}

function renderCountyGeometryDetail(feature, artifact) {
  const properties = feature.properties || {};
  const showEvidence = state.disclosureLevel === "evidence";
  $("#county-layer-detail").innerHTML = `
    <button class="ask-unit-button" type="button" data-ask-unit-id="${escapeHtml(properties.unit_id)}">Ask about this county</button>
    <dl class="metadata-grid compact-metadata">
      <dt>County</dt><dd>${escapeHtml(properties.census_name || "Unknown")}</dd>
      <dt>State</dt><dd>${escapeHtml(properties.state || "Unknown")}</dd>
      <dt>GEOID</dt><dd>${escapeHtml(properties.geoid || "Unknown")}</dd>
      <dt>Tier</dt><dd>${escapeHtml(properties.tier_label || "No tier")}</dd>
      <dt>Laws</dt><dd>${escapeHtml(formatCount(properties.law_count))}</dd>
      <dt>Dominant topic</dt><dd>${escapeHtml(properties.dominant_topic || "Unknown")}</dd>
      <dt>Match status</dt><dd>${escapeHtml(properties.match_status || "Unknown")}</dd>
    </dl>
    ${
      showEvidence
        ? `<p class="muted-note">Geometry source: ${escapeHtml(artifact.source?.name || "U.S. Census Bureau TIGERweb")} layer ${escapeHtml(String(artifact.source?.layer_id || "82"))}. Generalized for static display; ${escapeHtml(formatCount(artifact.unmatched_count || 0))} aggregate county units are unmatched.</p>`
        : `<p class="muted-note">Switch to Evidence trail to reveal geometry source and match-status details.</p>`
    }
  `;
}

function municipalPointSvg(point, bounds, colorContext) {
  const [x, y] = projectLonLat(point.lon, point.lat, bounds);
  const selected = point.unit_id === state.selectedUnitId ? " selected" : "";
  const lawCount = Math.max(0, Number(point.law_count || 0));
  const radius = 3.2 + Math.min(4.8, Math.log10(lawCount + 1) * 0.95);
  const fill = geographyDatumColor(point, colorContext);
  return `
    <circle
      class="municipal-point${selected}"
      data-unit-id="${escapeHtml(point.unit_id)}"
      cx="${x.toFixed(2)}"
      cy="${y.toFixed(2)}"
      r="${radius.toFixed(2)}"
      fill="${escapeHtml(fill)}"
      tabindex="0"
    >
      <title>${escapeHtml(point.census_name || point.unit_name)} · ${escapeHtml(point.tier_label || "No tier")} · ${escapeHtml(formatCount(point.law_count))} laws</title>
    </circle>
  `;
}

function renderMunicipalPointDetail(point, artifact) {
  const showEvidence = state.disclosureLevel === "evidence";
  $("#county-layer-detail").innerHTML = `
    <button class="ask-unit-button" type="button" data-ask-unit-id="${escapeHtml(point.unit_id)}">Ask about this municipality</button>
    <dl class="metadata-grid compact-metadata">
      <dt>Municipality</dt><dd>${escapeHtml(point.census_name || "Unknown")}</dd>
      <dt>State</dt><dd>${escapeHtml(point.state || "Unknown")}</dd>
      <dt>GEOID</dt><dd>${escapeHtml(point.geoid || "Unknown")}</dd>
      <dt>Layer</dt><dd>${escapeHtml(point.census_layer || "Unknown")}</dd>
      <dt>Tier</dt><dd>${escapeHtml(point.tier_label || "No tier")}</dd>
      <dt>Laws</dt><dd>${escapeHtml(formatCount(point.law_count))}</dd>
      <dt>Dominant topic</dt><dd>${escapeHtml(point.dominant_topic || "Unknown")}</dd>
      <dt>Match status</dt><dd>${escapeHtml(point.match_status || "Unknown")}</dd>
    </dl>
    ${
      showEvidence
        ? `<p class="muted-note">Municipal point source: ${escapeHtml((artifact?.source?.layers || []).find((layer) => layer.id === point.census_layer)?.name || "U.S. Census Bureau TIGERweb")}. ${escapeHtml(formatCount(artifact?.unmatched_count || 0))} aggregate municipal units remain unmatched rather than guessed.</p>`
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
  return {
    mode: state.geographyColorMode,
    data,
    maxLawCount,
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
  return datum.tier_color || context.tierDefinitions?.[datum.tier]?.color || "#d8dee8";
}

function geographyColorLegend(context) {
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
    law_count: "law-count intensity",
  };
  return labels[mode] || labels.tier;
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

function renderAnalysisStatusPanel() {
  const status = state.analysis.status;
  const mapLayers = state.analysis.mapLayers;
  const countyGeometry = state.analysis.countyGeometry;
  const municipalPoints = state.analysis.municipalPoints;
  const cardsGrid = $("#status-card-grid");
  const detailGrid = $("#status-detail-grid");
  const gateGrid = $("#status-gate-grid");
  if (!cardsGrid || !detailGrid || !gateGrid) {
    return;
  }
  if (!status) {
    cardsGrid.innerHTML = `
      <article class="status-card"><span class="metric-value small">...</span><span class="metric-label">Loading analysis artifact status</span></article>
    `;
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
    ["Grok boundary", `${status.grok_secret_name || "Configured offline secret"} is for offline artifact generation only; no API key is embedded in Pages.`],
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
    <article class="status-evidence-card">
      <h3>Boundary</h3>
      <p>No raw LOCUS rows, ordinance text, SQLite databases, exports, credentials, or machine-specific paths are published through this artifact layer.</p>
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

function filterMapUnits(units) {
  return units.filter((unit) => {
    if (state.mapFilters.state && unit.state !== state.mapFilters.state) {
      return false;
    }
    if (state.mapFilters.tier && unit.tier !== state.mapFilters.tier) {
      return false;
    }
    if (state.mapFilters.topic && !Number(unit.topic_counts?.[state.mapFilters.topic] || 0)) {
      return false;
    }
    if (state.mapFilters.function && !Number(unit.function_counts?.[state.mapFilters.function] || 0)) {
      return false;
    }
    if (Number(unit.law_count || 0) < state.mapFilters.minLaws) {
      return false;
    }
    return true;
  });
}

function renderMapFilters(units) {
  const form = $("#map-filter-form");
  fillSelect(form.elements.state, [...new Set(units.map((unit) => unit.state).filter(Boolean))].sort(), state.mapFilters.state, "All states");
  fillSelect(form.elements.topic, sortedKeys(units, "topic_counts"), state.mapFilters.topic, "All topics");
  fillSelect(form.elements["function"], sortedKeys(units, "function_counts"), state.mapFilters.function, "All functions");
  fillSelect(form.elements.tier, [...new Set(units.map((unit) => unit.tier).filter(Boolean))].sort(), state.mapFilters.tier, "All tiers", (tier) => {
    const definitions = state.analysis.mapLayers?.tier_definitions || {};
    return definitions[tier]?.label || tier;
  });
  form.elements.min_laws.value = String(state.mapFilters.minLaws);
}

function fillSelect(select, values, selected, emptyLabel, labeler = (value) => value) {
  select.innerHTML = `<option value="">${escapeHtml(emptyLabel)}</option>`;
  values.forEach((value) => select.append(new Option(labeler(value), value)));
  select.value = selected;
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
  if (state.mapFilters.tier) labels.push(`Tier ${state.mapFilters.tier}`);
  if (state.mapFilters.minLaws) labels.push(`Min ${formatCount(state.mapFilters.minLaws)} laws`);
  return labels;
}

function formatCount(value) {
  return NUMBER_FORMATTER.format(Number(value || 0));
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

function unitSvg(unit) {
  const layout = unit.layout || {};
  const fill = unit.tier_color || "#d8dee8";
  const selected = state.selectedUnitId === unit.unit_id ? " selected" : "";
  const common = `data-unit-id="${escapeHtml(unit.unit_id)}" class="map-unit${selected}" fill="${escapeHtml(fill)}" tabindex="0"`;
  if (layout.type === "point") {
    return `<circle ${common} cx="${Number(layout.x || 0)}" cy="${Number(layout.y || 0)}" r="${Number(layout.r || 3.5)}"><title>${escapeHtml(displayUnitName(unit))}: ${escapeHtml(unit.tier_label)}</title></circle>`;
  }
  return `<rect ${common} x="${Number(layout.x || 0)}" y="${Number(layout.y || 0)}" width="${Number(layout.w || 8)}" height="${Number(layout.h || 8)}" rx="1.5"><title>${escapeHtml(displayUnitName(unit))}: ${escapeHtml(unit.tier_label)}</title></rect>`;
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
    <dl class="metadata-grid compact-metadata">
      <dt>Laws</dt><dd>${escapeHtml(String(unit.law_count))}</dd>
      <dt>Substantive</dt><dd>${escapeHtml(String(unit.substantive_count))}</dd>
      <dt>Dominant topic</dt><dd>${escapeHtml(text(unit.dominant_topic))}</dd>
      <dt>Dominant function</dt><dd>${escapeHtml(text(unit.dominant_function))}</dd>
      <dt>OCR risk</dt><dd>${escapeHtml(text(unit.ocr_risk_level))}</dd>
    </dl>
    ${selectedUnitOntologyNeighborhoodHtml(unit, { compact: true })}
    ${
      showUnit
        ? `<h4>Neutral model-score means</h4><ul>${scores}</ul>`
        : `<p class="muted-note">Switch to Unit detail to reveal score summaries.</p>`
    }
    ${
      showEvidence
        ? `<h4>Evidence trail</h4><ol>${samples || "<li>No public samples in this artifact.</li>"}</ol>`
        : `<p class="muted-note">Switch to Evidence trail to reveal source locators and public samples when allowed.</p>`
    }
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

function renderOntology() {
  const ontology = state.analysis.ontology;
  const models = state.analysis.models;
  const selectedNeighborhood = $("#selected-ontology-neighborhood");
  if (!ontology) {
    $("#ontology-summary").innerHTML = `
      <article class="metric-card"><span class="metric-value">...</span><span class="metric-label">Loading ontology</span></article>
    `;
    if (selectedNeighborhood) {
      selectedNeighborhood.innerHTML = "<p>Selected-unit ontology neighborhood loading.</p>";
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
  $("#ontology-node-list").innerHTML = (ontology.nodes || [])
    .slice(0, 80)
    .map((node) => `<span>${escapeHtml(node.type)} · ${escapeHtml(node.label)}${node.count ? ` (${escapeHtml(String(node.count))})` : ""}</span>`)
    .join("");
  if (selectedNeighborhood) {
    const selectedUnit = currentSelectedMapUnit();
    selectedNeighborhood.innerHTML = selectedUnit
      ? selectedUnitOntologyNeighborhoodHtml(selectedUnit, { compact: false })
      : "<h3>Selected-unit ontology neighborhood</h3><p>Select a county or town on the map to show its aggregate ontology neighborhood.</p>";
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

function selectedUnitOntologyNeighborhoodHtml(unit, { compact = false } = {}) {
  const geometry = geometryMatchForUnit(unit.unit_id);
  const showUnit = ["unit", "evidence"].includes(state.disclosureLevel);
  const showEvidence = state.disclosureLevel === "evidence";
  const nodes = selectedUnitOntologyNodes(unit, geometry, showUnit, showEvidence);
  return `
    <section class="ontology-neighborhood${compact ? " compact" : ""}" aria-label="Selected unit ontology neighborhood">
      <div class="ontology-neighborhood-heading">
        <div>
          <p class="eyebrow">Selected ontology</p>
          <h3>${escapeHtml(displayUnitName(unit))}</h3>
        </div>
        <span>${escapeHtml(formatCount(unit.law_count))} law records</span>
      </div>
      <svg class="ontology-neighborhood-svg" viewBox="0 0 640 300" role="img" aria-label="Aggregate ontology neighborhood for selected unit">
        ${nodes
          .filter((node) => node.id !== "unit")
          .map((node) => `<line x1="320" y1="150" x2="${node.x}" y2="${node.y}" class="ontology-edge"></line>`)
          .join("")}
        ${nodes.map(ontologyNodeSvg).join("")}
      </svg>
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
      <p class="muted-note">Neighborhood edges summarize released LOCUS aggregate fields and machine-match artifacts. They are not verified legal relationships.</p>
    </section>
  `;
}

function selectedUnitOntologyNodes(unit, geometry, showUnit, showEvidence) {
  const nodes = [
    {
      id: "unit",
      label: displayUnitName(unit),
      sublabel: `${text(unit.state)} · ${text(unit.kind)}`,
      x: 320,
      y: 150,
      r: 54,
      fill: unit.tier_color || "#d8dee8",
      className: "unit-node",
    },
    {
      id: "topic",
      label: text(unit.dominant_topic),
      sublabel: "dominant topic",
      x: 138,
      y: 72,
      r: 42,
      fill: TOPIC_COLORS[unit.dominant_topic] || TOPIC_COLORS.Unknown,
    },
    {
      id: "function",
      label: text(unit.dominant_function),
      sublabel: "dominant function",
      x: 502,
      y: 72,
      r: 42,
      fill: FUNCTION_COLORS[unit.dominant_function] || FUNCTION_COLORS.Unknown,
    },
    {
      id: "tier",
      label: text(unit.tier_label),
      sublabel: "neutral tier",
      x: 138,
      y: 228,
      r: 42,
      fill: unit.tier_color || "#d8dee8",
    },
  ];
  if (showUnit) {
    nodes.push({
      id: "scores",
      label: "Scores",
      sublabel: "neutral means",
      x: 502,
      y: 228,
      r: 42,
      fill: "#8d6aa8",
    });
  }
  if (showEvidence) {
    nodes.push({
      id: "geometry",
      label: "Geometry",
      sublabel: geometry.source,
      x: 320,
      y: 262,
      r: 36,
      fill: "#b7892c",
    });
  }
  return nodes;
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

function renderInquiry() {
  const chatIndex = state.analysis.chatIndex;
  const briefings = state.analysis.inquiryBriefings;
  const selectedUnit = currentSelectedMapUnit();
  const selectedQuestions = selectedUnit ? [`What does the selected unit ${displayUnitName(selectedUnit)} show?`] : [];
  const suggested = [
    ...selectedQuestions,
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
  $("#suggested-questions").innerHTML = suggested
    .map((question) => `<button type="button" data-question="${escapeHtml(question)}">${escapeHtml(question)}</button>`)
    .join("");
  $("#inquiry-answer").innerHTML = state.inquiryAnswer
    ? inquiryAnswerHtml(state.inquiryAnswer)
    : "<p>Ask about status, tiers, topics, map units, model outputs, or Grok integration.</p>";
}

function inquiryAnswerHtml(answer) {
  return `
    <h3>${escapeHtml(answer.title)}</h3>
    <p>${escapeHtml(answer.answer)}</p>
    ${answer.grokSummary ? `<aside><strong>Offline Grok summary</strong><p>${escapeHtml(answer.grokSummary)}</p></aside>` : ""}
    ${answer.sections || ""}
    ${answer.matches || ""}
  `;
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

function renderAnalysisCharts() {
  const charts = state.analysis.charts ? state.analysis.charts.charts || {} : null;
  const grid = $("#analysis-chart-grid");
  if (!charts) {
    grid.innerHTML = `<article class="chart-card"><h3>Analysis charts loading</h3><p>Static chart artifacts have not loaded yet.</p></article>`;
    return;
  }
  grid.innerHTML = [
    chartCard("Tier distribution", charts.tier_counts || []),
    chartCard("Topic distribution", charts.topic_counts || []),
    chartCard("Function distribution", charts.function_counts || []),
    chartCard("Jurisdiction kind", charts.kind_counts || []),
    scoreCard("Neutral score means", charts.score_means || []),
    topUnitsCard(charts.top_units || []),
  ].join("");
}

function chartCard(title, rows) {
  const max = Math.max(1, ...rows.map((row) => Number(row.value || 0)));
  return `
    <article class="chart-card">
      <h3>${escapeHtml(title)}</h3>
      <div class="bar-list">
        ${rows
          .map(
            (row) => `
              <div class="bar-row">
                <span>${escapeHtml(row.label)}</span>
                <div><i style="width:${Math.max(3, (Number(row.value || 0) / max) * 100)}%"></i></div>
                <strong>${escapeHtml(String(row.value))}</strong>
              </div>
            `,
          )
          .join("") || "<p>No aggregate rows.</p>"}
      </div>
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
          .map((row) => `<li>${escapeHtml(displayUnitName(row.name))} <span>${escapeHtml(row.state)} · ${escapeHtml(String(row.law_count))} laws · ${escapeHtml(row.tier_label)}</span></li>`)
          .join("")}
      </ol>
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
      <div class="topic-strip">${topicStrip(summary.topicCounts)}</div>
      <div class="tier-strip">${tierStrip(summary.tierCounts)}</div>
    </article>
  `;
}

function topicStrip(topicCounts, baselineCounts = null) {
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
        <div class="topic-strip-row">
          <span>${escapeHtml(label)}</span>
          <div>
            <i style="width:${Math.max(2, share * 100)}%"></i>
            ${baselineShare === null ? "" : `<b style="width:${Math.max(2, baselineShare * 100)}%"></b>`}
          </div>
          <strong>${escapeHtml(formatPercent(share, 1))}</strong>
        </div>
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
  state.mapFilters = {
    state: String(form.get("state") || ""),
    topic: String(form.get("topic") || ""),
    function: String(form.get("function") || ""),
    tier: String(form.get("tier") || ""),
    minLaws: Math.max(0, Number(form.get("min_laws") || 0)),
  };
  state.selectedUnitId = null;
  renderMap();
}

function resetMapFilters() {
  state.mapFilters = { state: "", topic: "", function: "", tier: "", minLaws: 0 };
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
  if (/\b(selected|current|this)\b/.test(normalized) && /\b(unit|county|town|municipal|municipality|jurisdiction|place)\b/.test(normalized)) {
    return selectedUnitAnswer();
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
  return {
    title: `Selected unit: ${displayUnitName(unit)}`,
    answer: `${displayUnitName(unit)} is a ${text(unit.kind)} aggregate unit in ${text(unit.state)} with ${formatCount(unit.law_count)} LOCUS law records, dominant topic ${text(unit.dominant_topic)}, dominant function ${text(unit.dominant_function)}, and neutral tier ${text(unit.tier_label)}. These are aggregate model-output summaries, not legal findings.`,
    sections: selectedUnitSectionsHtml(unit, geometry),
    matches: `
      <h4>Supporting aggregate facts</h4>
      <dl class="briefing-facts">
        <dt>Substantive rows</dt><dd>${escapeHtml(formatCount(unit.substantive_count))} <span>map_layers.json</span></dd>
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
  state.inquiryAnswer = answerQuestion(String(question));
  renderInquiry();
}

function askAboutMapUnit(unitId) {
  const units = state.analysis.mapLayers ? state.analysis.mapLayers.units || [] : [];
  const unit = units.find((item) => item.unit_id === unitId);
  if (!unit) {
    return;
  }
  state.selectedUnitId = unit.unit_id;
  const question = `What does the selected unit ${displayUnitName(unit)} show?`;
  const input = $("#inquiry-form input[name='question']");
  if (input) {
    input.value = question;
  }
  state.inquiryAnswer = selectedUnitAnswer(unit);
  state.activeTab = "inquiry";
  render();
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
      records = imported.map(normalizeImportedRecord);
      localStorage.setItem(STORAGE_RECORDS, JSON.stringify(records));
      state.currentIndex = 0;
      state.explorerRows = records;
      alert("Imported bounded queue into browser storage. No upload occurred.");
      render();
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  };
  reader.readAsText(file);
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
    const [status, mapLayers, countyGeometry, municipalPoints, ontology, chatIndex, inquiryBriefings, models, charts] = await Promise.all([
      fetchJson(ANALYSIS_PATHS.status),
      fetchJson(ANALYSIS_PATHS.mapLayers),
      fetchJson(ANALYSIS_PATHS.countyGeometry),
      fetchJson(ANALYSIS_PATHS.municipalPoints),
      fetchJson(ANALYSIS_PATHS.ontology),
      fetchJson(ANALYSIS_PATHS.chatIndex),
      fetchJson(ANALYSIS_PATHS.inquiryBriefings),
      fetchJson(ANALYSIS_PATHS.models),
      fetchJson(ANALYSIS_PATHS.charts),
    ]);
    state.analysis = { status, mapLayers, countyGeometry, municipalPoints, ontology, chatIndex, inquiryBriefings, models, charts, error: null };
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
  $("#queue-import").addEventListener("change", importQueue);
  $("#export-events").addEventListener("click", exportEvents);
  $("#export-latest").addEventListener("click", exportLatestCsv);
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
  $("#inquiry-form").addEventListener("submit", submitInquiry);
  $("#suggested-questions").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-question]");
    if (!button) {
      return;
    }
    $("#inquiry-form input[name='question']").value = button.dataset.question;
    state.inquiryAnswer = answerQuestion(button.dataset.question);
    renderInquiry();
  });
  $("#map-panel").addEventListener("click", (event) => {
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
