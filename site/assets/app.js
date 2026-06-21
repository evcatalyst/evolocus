const STORAGE_EVENTS = "evolocus.pages.reviewEvents.v1";
const STORAGE_REVIEWER = "evolocus.pages.reviewer.v1";
const STORAGE_BLIND = "evolocus.pages.blind.v1";
const STORAGE_RECORDS = "evolocus.pages.records.v1";

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
  activeTab: "review",
  currentIndex: 0,
  reviewer: localStorage.getItem(STORAGE_REVIEWER) || "local-reviewer",
  blind: localStorage.getItem(STORAGE_BLIND) !== "false",
  revealed: {},
  explorerRows: records,
  explorerPageSize: 8,
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

function render() {
  renderTabs();
  renderToolbar();
  renderReview();
  renderExplorer();
  renderResults();
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
