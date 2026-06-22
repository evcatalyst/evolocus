# Evaluation Workbench

The primary workbench runs on GitHub Pages:

https://evcatalyst.github.io/evolocus/

It is a static browser app. It does not require Streamlit, a Python server, a hosted database, trackers, external fonts, or CDN dependencies.

## Pages Features

- synthetic demo queue;
- Walkthrough tab that guides the public real-aggregate visual path from map to inquiry, ontology, queue planning, package overlay, and snapshots;
- first-screen Ask -> Map -> Ontology visual path over current aggregate artifacts, with disclosure controls and no browser model call;
- one-click front-door topic/tier example questions that pre-filter the public map and open deterministic aggregate answers;
- first-screen offline analysis freshness card for briefing/question-pack age, enrichment mode, validation state, and Actions-only refresh;
- law map with state-clustered county/town-style units colored by neutral tier;
- official Census TIGERweb county choropleth for matched aggregate county units;
- official Census TIGERweb municipal/town point layer for matched aggregate municipal units;
- official geography layer toggles for county polygons, town points, and progressive selected-unit ontology links;
- official geography layer legend for county/town visibility and selected-unit aggregate peer-link reasons;
- geography color modes for neutral tier, dominant topic, dominant function, audit attention, and law-count intensity;
- map filters for state, topic, function, tier, minimum law count, and aggregate audit review signals;
- filtered-view aggregate insight cards and inquiry answers;
- filtered-vs-full aggregate comparison panels;
- official geography color modes for neutral tier, dominant topic, dominant function, model-substantive share, and law-count intensity;
- state/topic small-multiple charts in the Charts tab;
- county/town aggregate coverage atlas by state, source-unit type, and neutral tier;
- analysis status tab with artifact freshness, publication gates, geometry status, and Grok secret boundary;
- Law Map and Inquiry freshness badges showing aggregate layer, briefing, question-pack, dataset revision, stored-snapshot deltas, and no-row-text publication boundary;
- Law Map last-refresh source detail for tracked Polars aggregate artifacts, analysis commit provenance, briefing source, deploy guard, and publication boundary;
- full LOCUS audit status with aggregate schema, label, OCR-risk, duplicate-content, and manifest checks;
- per-unit audit review signals for the published map units, including medium/high OCR risk and duplicate-text-hash rates;
- Audit Lens tab with attention distribution, OCR heuristic reason mix, state audit atlas, and review-priority queue preview;
- Queue Plan tab for aggregate county/town review batch planning from current filters, audit signals, law counts, and neutral score spread;
- Queue Plan review-package request export for local ignored materialization from authorized Parquet;
- Queue Plan package-request preview for record budget, state/type/topic mix, and safety gates before download;
- one-click synthetic browser package demo anchored to published aggregate units, for testing the package overlay without LOCUS row text;
- browser-local import-status panel after bounded package upload, showing package provenance, text-inclusion state, unit counts, and safety flags;
- browser-local package-to-map overlay that highlights imported package units on both the aggregate map and official geography layer;
- imported-package-units map filter for focusing the aggregate map on browser-local review-package coverage;
- Results-tab package coverage visuals for imported browser-local queues, including state/topic/function/type/OCR mix and review workflow status;
- ontology and model-output registry views;
- map-driven ontology query presets that transform current map context into bounded Inquiry prompts;
- ontology-to-map visual presets that preview aggregate county/town filters, denominators, and color modes before opening the map;
- package-to-ontology bridge that connects active package counts to topic, function, tier, and matched map-unit context without exposing row text;
- selected-unit ontology neighborhood visual for aggregate topic/function/tier/score/geography links;
- selected-unit peer comparison visuals for similar published county/town aggregate units;
- Score Lens tab with released model-score distributions, state matrix, and high-contrast unit profiles;
- static progressive inquiry briefings over published aggregate artifacts;
- static filter-aware question pack over published aggregate artifacts;
- compact analysis journey strip connecting Map, Inquiry, Ontology, and Queue Plan with current aggregate status;
- Inquiry question matrix for filter-aware map, package overlay, topic, function, audit, score, and selected-unit prompts;
- inquiry-to-map question composer that previews deterministic aggregate map filters from typed questions before changing the map;
- click-through mini charts inside Inquiry answers for topic, function, tier, and top-unit aggregate drillbacks;
- chart-to-map drilldowns from Charts-tab tier, topic, function, jurisdiction kind, state/topic, and top-unit aggregate rows;
- chart-to-inquiry Ask buttons that create saved aggregate Inquiry answers from chart scope without browser model calls;
- chart-to-ontology Graph buttons that open the existing ontology view with aggregate chart filters and progressive disclosure;
- animated chart route legend that previews Chart -> Map -> Inquiry -> Ontology before changing tabs;
- Inquiry topic/tier pathway chart that groups current aggregate units into visual question cells and safe map actions;
- pathway-cell mini peer comparison bars for top aggregate units with map drillback and no row text;
- map-linked ontology chips inside pathway cells for aggregate topic, neutral tier, and top-unit drillback;
- package-aware inquiry answer for browser-local package coverage, map matches, workflow progress, and publication boundaries;
- selected county/town inquiry drilldowns from the map into aggregate-only Q&A;
- map-side law-location tier guide with active filters, visible county/town counts, neutral tier mix, and publication boundary copy;
- map-side topic/tier co-occurrence mini matrix with aggregate-unit counts, row bars, and filter drillback;
- matrix-linked Inquiry prompts that open deterministic aggregate answers for selected topic/tier cells;
- tier-to-ontology clickthrough from neutral tier chips into a focused ontology context card for visible units, topic/function links, and score summaries;
- tier-focus mini charts for topic mix, function mix, unit type mix, and neutral score means inside the ontology card;
- tier-focus mini-chart drilldowns that return to the map with topic, function, or unit-type filters applied;
- tier-focus score mini-chart drilldowns that return to the map with neutral relative score-band filters applied;
- map-side chat-style inquiry panel that answers from current filters, selected unit, audit signals, model scores, and package overlay without live browser model calls;
- browser-local aggregate inquiry results log for preset/manual questions with content-free JSON export and no browser model calls;
- latest-artifact refresh panel and timeline strip in Analysis Status that summarize current aggregate metadata contributions without row text or law-change claims;
- artifact lineage visual in Analysis Status that maps public surfaces to aggregate JSON artifacts and disclosure boundaries;
- visual replay controls for aggregate inquiry log entries that restore safe filters, disclosure level, and selected aggregate unit context;
- question-to-map replay paths that visualize saved aggregate questions as prompt, filters, colored map, and ontology context before replaying them;
- map-side route playback cards that restore saved aggregate question paths directly from the Law Map while preserving the same no-text boundary;
- replay timeline sparklines for saved aggregate inquiry results, scaled by visible law rows and units while excluding row text and locators;
- browser-local map inquiry history snapshots for saved aggregate answers, filters, selected units, package counts, and comparison rows;
- browser-local map inquiry history JSON export with sanitized aggregate entries and policy metadata;
- inquiry-driven county/town comparison strip that changes by prompt and opens aggregate units back on the map;
- ontology build-status panel for graph freshness, node/edge mix, released model-field provenance, and aggregate-only boundaries;
- selected-unit ontology drilldown cards for topic/function/tier/score/geometry/package links inside the map panel;
- selected-unit mini ontology path animation that adds score and geometry nodes as disclosure depth increases;
- map-to-ontology animation controls that focus aggregate unit, topic, function, tier, score, or geometry stages without exposing row text;
- selected-unit progressive visual trail for overview, unit-detail, and evidence disclosure inside the map panel;
- current-view snapshot export for filtered map/inquiry context without LOCUS text or review events;
- browser-local snapshot gallery for comparing saved aggregate map/inquiry exports;
- aggregate chart panels and publication gates;
- progressive disclosure from overview to unit detail to evidence trail;
- blinded review by default;
- model-output reveal logging;
- save, save-next, skip, and flag actions;
- review event history;
- bounded imported queue JSON;
- explorer filters and pagination;
- evaluation metrics from saved reviews;
- latest-review CSV export without ordinance content;
- review-event JSON export.
- aggregate-only LOCUS public artifacts generated from local Parquet with Polars.

## Browser Storage

Review events are stored in browser localStorage under EvoLOCUS-specific keys. They remain on the reviewer machine unless the reviewer exports them.

Clearing browser storage removes local unsaved work. Export review events regularly during real evaluation.

## Queue Import

The browser can import a bounded queue JSON file with a top-level `records` array or a plain array of record objects. Imports are capped at 500 records to avoid turning the browser into a full corpus store.

After import, the Law Map highlights imported package units in the state-clustered aggregate map, official county polygons, municipal points, selected-unit detail, and map table. A binary imported-package-units filter narrows the aggregate map and downstream inquiry/snapshot context to locally loaded package units. The Results tab summarizes the browser-local package with record/unit counts, state/topic/function/type/OCR distributions, safety markers, and review progress. These visuals read localStorage and the imported package only; they are not copied into public static artifacts.

The selected-unit panel has an in-place progressive visual trail. Overview shows aggregate row count and neutral topic/function/tier context; Unit detail reveals released model-output summaries and denominators; Evidence trail adds audit and geometry-match provenance. Each step is a button bound to the same disclosure state used across the map, score, audit, queue, and status panels.

The same panel now includes ontology drilldown cards. Cards expose the selected unit's aggregate topic, function, neutral tier, model-output summary, geometry match, and browser-local package link. Card actions move to the ontology tab, adjust disclosure depth, or focus package-covered map units while keeping all raw text and source locator values out of public artifacts.

The toolbar and Walkthrough can also load a synthetic browser package generated from the current published aggregate units. That demo creates placeholder review records in localStorage, highlights their aggregate units, enables package-only filtering, and populates Results-tab package charts. It is labeled synthetic and does not load LOCUS ordinance text, source locators, raw rows, review history, or secrets.

When a package is active, the Inquiry tab adds a Package prompt. The answer reports matched aggregate units, record counts, review workflow status, text/source-locator state, and localStorage provenance. It never lists ordinance text, headers, source locator values, or row-level LOCUS samples.

The Ontology tab also shows a package bridge when a browser-local package is active. It renders package topic, function, tier, and matched-unit lanes from counts and aggregate map-unit joins only. Matched unit buttons jump back to the map, but the bridge never renders package text, headers, source locator values, or review-event details.

The local package handoff has been smoke-tested against real LOCUS Parquet: 24 records across 12 public aggregate units were materialized into ignored `data/exports/` packages, including one metadata-only package and one local text-bearing review package. Pages publishes only aggregate verification counts from that smoke test.

Imported records should include:

- `record_id`
- `source_locator`
- `dataset_revision`
- `header`
- `content`
- `state`
- `city`
- `county`
- `source_jurisdiction_type`
- `function`
- `topic`
- model score fields

The site does not parse full LOCUS Parquet shards in the browser.

## Static Analysis Refresh

Generate synthetic public artifacts:

```bash
PYTHONPATH=src python -m evolocus.cli publish-analysis \
  --output site/data/analysis \
  --dataset-revision synthetic-demo \
  --include-record-samples
```

Generate real aggregate artifacts into ignored storage first:

```bash
PYTHONPATH=src python -m evolocus.cli publish-analysis \
  --input 'data/raw/locus-v1/<revision>/**/*.parquet' \
  --dataset-revision '<revision>' \
  --output data/exports/analysis-preview
```

Only copy reviewed, license-compliant, non-text aggregate artifacts into `site/data/analysis/`. The current public artifacts are real LOCUS aggregates for a capped top-1,000 jurisdiction-unit layer with approximate state-clustered positions, an official Census TIGERweb county choropleth for matched aggregate county units, and official Census TIGERweb municipal/town points for matched aggregate municipal units. Geography matches are machine-generated and pending review; they omit raw rows, ordinance text, local SQLite state, and local exports.

Refresh county geometry after `map_layers.json` changes:

```bash
PYTHONPATH=src python -m evolocus.cli publish-county-geometry \
  --map-layers site/data/analysis/map_layers.json \
  --output site/data/analysis/county_geometry.json

PYTHONPATH=src python -m evolocus.cli publish-municipal-points \
  --map-layers site/data/analysis/map_layers.json \
  --output site/data/analysis/municipal_points.json
```

Refresh unit audit quality after `map_layers.json` changes:

```bash
PYTHONPATH=src python -m evolocus.cli publish-unit-audit-quality \
  --input 'data/raw/locus-v1/<revision>/**/*.parquet' \
  --map-layers site/data/analysis/map_layers.json \
  --output site/data/analysis/unit_audit_quality.json \
  --dataset-revision '<revision>'
```

The audit-attention color mode is a review-priority signal from aggregate OCR and duplicate-text-hash rates. It is not a legal ranking and is not proof of an OCR defect.

The Audit Lens reads the same aggregate artifact and current map filters. It never renders ordinance text, headers, source locators, or full-row records.

The Score Lens reads aggregate `map_layers.json` score means and current map filters. It describes values as neutral relative model scores because score direction has not been authoritatively verified in this milestone.

The Queue Plan tab exports aggregate unit planning metadata only. It is useful for deciding which county/town units to package next in local ignored tooling, but it is not itself a record-level review queue and contains no LOCUS ordinance text, headers, source locators, SQLite state, or raw rows.

The review-package request export is the handoff from public aggregate visuals to local ignored tooling. The Queue Plan tab previews record budget, unit mix, and safety gates before download. The request contains unit IDs, sampling limits, strategy metadata, and a suggested `materialize-review-package` command only. The local materializer defaults to metadata-only output and requires `--include-content` before writing a browser-import package with LOCUS text.

After a bounded package is imported, the browser stores a small import-status record in localStorage. The status panel shows dataset revision, package schema, record and unit counts, whether local text is present, source-locator provenance state, and publication-safety flags. The package contents are not uploaded.

The current-view snapshot export captures active filters, visible aggregate summaries, selected-unit metadata, audit signals, Grok briefing provenance, and local package aggregate counts when a package is active. It excludes ordinance text, headers, raw rows, record locators, browser review events, local databases, and secrets.

The Snapshots tab stores those aggregate current-view payloads in browser localStorage, renders comparison bars, and can reload a saved view's map filters. Package-aware snapshot cards compare matched package units and record counts while preserving text and locator exclusion. Gallery export uses the same aggregate-only policy.

The Analysis Status tab also reads `site/data/analysis/artifact_snapshot.json`, an aggregate-only stored baseline that lets the static site show true current-vs-snapshot metadata deltas. The Map and Inquiry freshness cards reuse this baseline for public snapshot badges: map units/rows on the Law Map, and briefing/question-pack counts on Inquiry. The latest-artifact timeline strip uses the same baseline to compare artifact timestamps only. The artifact lineage visual lists the aggregate JSON files behind each public surface and changes detail level with the same Overview, Unit detail, and Evidence trail control. The snapshot contains counts, timestamps, citation metadata, and publication-policy flags only.

The map-side inquiry card can save and export a bounded local history of aggregate answers. History entries are browser-local only and store prompt context, filters, selected unit metadata, package counts, and comparison rows; exports sanitize those fields and exclude ordinance text, source locator values, review events, local databases, secrets, and browser LLM calls.

The Inquiry question matrix reads current browser filter state, `question_pack.json`, and static aggregate artifacts. Question-pack prompts can apply safe map filters and disclosure levels from the browser. They remain deterministic browser logic unless an offline workflow publishes refreshed briefing or question-pack JSON.

Inquiry answers also render an ontology mini-map from the current visible aggregate scope. The graph connects answer scope to top topic, top function, dominant neutral tier, and highest-row county/town unit, then opens an aggregate county/town comparison drawer before routing buttons back to the Map or Ontology tab. It does not add row text, source locators, review events, or live browser model calls.

Refresh static progressive inquiry briefings from the current aggregate artifacts:

```bash
PYTHONPATH=src python -m evolocus.cli publish-inquiry-briefings \
  --analysis-dir site/data/analysis \
  --output site/data/analysis/inquiry_briefings.json

PYTHONPATH=src python -m evolocus.cli publish-question-pack \
  --analysis-dir site/data/analysis \
  --output site/data/analysis/question_pack.json
```

Offline jobs may add `--use-grok` to either command when `GROK_API_KEY` is available. The GitHub workflow also accepts the existing `Grok_api_key` secret alias and exports it as the canonical environment variable during the Action. The output must remain aggregate-only and must not include ordinance text, headers, source locators, local paths, or secrets.

Validate the public artifact boundary:

```bash
PYTHONPATH=src python -m evolocus.cli validate-public-artifacts \
  --analysis-dir site/data/analysis
```

The tracked `site/data/analysis/inquiry_briefings.json` artifact is currently Grok-enriched and aggregate-only. The manual `Refresh static analysis artifacts` GitHub Actions workflow performs the same briefing refresh and validation before deploying Pages. Its `persist_artifacts` input can commit only the validated `inquiry_briefings.json` and `question_pack.json` artifacts back to the current branch, preventing the next normal Pages deploy from reverting refreshed aggregate inquiry output. The Analysis Status tab now exposes an Actions-only refresh control that opens the workflow page, reports current artifact freshness, and keeps all model calls in Actions rather than the browser. The normal Pages deploy workflow also runs the validator so a later push cannot publish raw rows or secret-shaped values by accident.

## Support CLI

Python CLI commands may prepare audits, local SQLite queues, or export packages, but they are support tooling, not the user interface.

Default CLI exports omit ordinance text:

```bash
PYTHONPATH=src python -m evolocus.cli export-evaluation \
  --db data/evaluation/evolocus_eval.sqlite3 \
  --queue baseline-v1 \
  --output data/exports/baseline-v1 \
  --without-content
```

Do not write generated exports into `site/`.
