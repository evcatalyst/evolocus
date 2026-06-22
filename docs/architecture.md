# EvoLOCUS Architecture

EvoLOCUS is now Pages-first for user interaction. GitHub Pages is the primary and only supported user-facing surface for this milestone.

Current evaluator architecture:

```mermaid
flowchart LR
  A["Synthetic demo or bounded queue JSON"] --> B["GitHub Pages browser app"]
  C["Static analysis artifacts"] --> B
  B --> D["Map, ontology, inquiry, review UI"]
  D --> W["Guided aggregate walkthrough"]
  D --> Q["Aggregate Queue Plan export"]
  Q --> R["Aggregate review-package request"]
  R --> S["Local ignored package materializer"]
  S --> A
  D --> X["Aggregate current-view snapshot export"]
  X --> Y["Browser-local snapshot gallery"]
  A --> Z["Browser-local import-status panel"]
  D --> E["Append-only localStorage review events"]
  E --> F["Browser metrics and disagreement summaries"]
  E --> G["User-triggered CSV/JSON exports"]
  H["LOCUS Parquet support tooling"] --> I["Polars lazy validation and aggregation"]
  I --> J["Bounded queue/export packages"]
  I --> C
  C --> V["Public artifact guard"]
  J --> A
```

## Current Milestone

- GitHub Pages serves the workbench from `site/`.
- Browser JavaScript handles queue review, explorer filters, metrics, local persistence, and exports.
- Browser JavaScript handles the map, ontology, and static inquiry over `site/data/analysis/`.
- The Walkthrough tab orchestrates the public map, inquiry, ontology, queue planning, and snapshots into a guided real-aggregate demo flow without adding a separate data publication channel.
- The persistent analysis journey strip connects Map, Inquiry, Ontology, and Queue Plan steps using only filters, disclosure level, aggregate counts, and published unit IDs.
- Map selections can open aggregate-only selected-unit inquiry answers; the browser still reads only bounded static JSON artifacts.
- Inquiry prompt cards use current map filters and static artifacts to answer map, package overlay, topic, function, audit, score, and selected-unit questions without live model calls.
- Inquiry pathway cells group current aggregate map units by dominant topic and neutral tier, then apply safe filters or deterministic aggregate questions without exposing rows.
- Inquiry pathway peer comparisons show top aggregate units inside each cell and drill back to the Law Map by published unit ID only.
- Inquiry pathway ontology chips route aggregate topic, tier, and top-unit context into Ontology or Law Map views using only browser state and published unit IDs.
- Inquiry results are logged in browser localStorage as aggregate answer summaries with filter context, artifact timestamps, and explicit no-text/no-locator/no-review-event policy flags.
- Saved inquiry results can replay only safe browser state: map filters, disclosure depth, and selected aggregate unit IDs. Replay does not create row-level evidence or call a model.
- Saved inquiry results also render as a browser-local replay timeline with row/unit sparklines derived from aggregate summaries only.
- `question_pack.json` adds static filter-aware prompts generated from aggregate artifacts; prompt cards can apply safe map filters and disclosure levels in the browser.
- The manual analysis-refresh workflow can use `GROK_API_KEY`, or the existing `Grok_api_key` alias, to refresh static inquiry briefings offline, then runs the public artifact guard before deploying Pages.
- The Pages Analysis Status tab links to that manual workflow as an Actions-only refresh control; the browser never receives a model secret and never performs a live model call.
- The Law Map and Inquiry headers show artifact freshness badges for the aggregate map layer, briefing, question pack, dataset revision, stored-snapshot deltas, and no-row-text boundary before users drill into detail.
- The Law Map header also shows a last-refresh source strip so map readers can distinguish tracked Polars aggregate artifacts, offline briefing refreshes, analysis commit provenance, and deploy validation gates.
- Official geography can color counties and towns by neutral tier, dominant topic, dominant function, model-substantive share, audit attention, or law-count intensity; all are aggregate review aids.
- Official geography layer controls can independently toggle matched county polygons, matched town/municipal points, and selected-unit ontology peer links; the link layer uses aggregate map metadata only and appears through progressive disclosure.
- The official-geography layer legend explains shown/available county and town layers, selected-unit peer-link reasons, disclosure depth, and the no-legal-relationship boundary.
- The map card includes a law-location tier guide that explains active filters, visible county/town counts, neutral tier mix, geography color mode, disclosure depth, and publication boundaries.
- The map guide includes a topic/tier co-occurrence mini matrix that filters the public map by aggregate dominant topic and neutral tier only.
- Matrix cells can open deterministic Inquiry prompts for the selected aggregate topic/tier cell without browser-side model calls or row-level publication.
- Inquiry answers render mini charts from the current aggregate map scope and drill back to map filters or published aggregate units only.
- Tier chips in the map guide click through to an ontology tier-focus card that summarizes visible units, topic/function links, neutral score means, and filter context.
- The tier-focus ontology card includes mini charts for topic mix, function mix, unit type mix, and neutral score means under the current filters.
- Topic, function, and unit-type mini-chart bars can drill back into the map by applying aggregate filters; this changes only browser state and does not publish rows.
- Neutral score mini-chart rows can drill back into relative score-band map filters; score direction remains unverified and no burden, ranking, or legal meaning is inferred.
- The map card also includes a chat-style inquiry panel that reuses static aggregate answer functions for current filters, selected unit, audit signals, model-score profile, and browser-local package overlay.
- Map-side inquiry history snapshots are stored only in browser localStorage and include aggregate prompt context, filters, selected unit metadata, package counts, and comparison rows without text, source locators, review events, or browser LLM calls.
- Map-side inquiry history can be exported as JSON with sanitized aggregate entries and explicit no-text/no-locator/no-review-event policy metadata.
- The map inquiry panel renders a prompt-aware county/town comparison strip and lets users drill comparison rows back into the selected map unit.
- The selected map unit includes a progressive visual trail that switches between overview, unit detail, and evidence trail while preserving aggregate-only publication boundaries.
- The selected ontology neighborhood includes a mini animated path from map unit to released topic/function/tier, then score and geometry nodes as disclosure depth increases.
- The selected map unit also includes ontology drilldown cards for topic, function, tier, score, geometry, and package links; cards route to ontology, detail, evidence, or package-filter states without exposing row text.
- The Ontology tab includes map-driven query presets that derive from current filters, selected unit, visible top topic/function/tier, audit signals, and score context, then route to deterministic Inquiry answers.
- The Analysis Status tab reads `audit_status.json`, a full-row-count audit summary that excludes raw rows, ordinance text, sampled findings, and record locators.
- The map reads `unit_audit_quality.json`, a per-published-unit aggregate of OCR-risk and duplicate-text-hash review signals scoped to the public map layer.
- The Audit Lens tab renders `unit_audit_quality.json` as aggregate-only charts, state rows, OCR reason mix, and map drill-through links.
- The Score Lens tab renders released LOCUS model-score means from `map_layers.json` as neutral distributions, state matrices, and unit profiles.
- The Queue Plan tab combines current map filters, `map_layers.json`, and `unit_audit_quality.json` to rank aggregate county/town units for future local review packaging. Its preview shows record budget, state/type/topic mix, and safety gates before exporting unit IDs, aggregate counts, review signals, strategy metadata, and optional local materialization instructions only.
- The Queue Plan review-package request can be consumed by `materialize-review-package` to create a bounded browser-import package from ignored local Parquet. The request itself remains aggregate-only.
- The browser can generate a synthetic package demo from the currently published aggregate units, exercising package overlays, package-only filters, package coverage charts, and review workflow without loading LOCUS row text.
- Package-aware inquiry answers summarize browser-local package coverage, map-unit matches, workflow progress, text state, and source-locator state without listing record text or locator values.
- The map and inquiry tabs can export the current filtered view as aggregate JSON with filters, counts, selected-unit metadata, audit signals, and briefing provenance only.
- The Snapshots tab saves those aggregate current-view payloads in browser localStorage for comparison and reloads only filter state and selected aggregate unit IDs. When a local package is active, snapshots store aggregate package counts, matched unit counts, workflow status, and text/source-locator exclusion state only.
- Selected units render an ontology neighborhood from aggregate topic, function, tier, score, and geometry-match fields without publishing raw ordinance text.
- Active packages render an ontology bridge from browser-local topic/function counts, matched aggregate unit tiers, and map-unit joins without exposing record text or source locator values.
- Selected units render peer comparisons against similar published aggregate units by shared topic, function, tier, kind, state, and law-count proximity; this is review context, not a legal ranking.
- Browser storage is local to the reviewer and is not a shared database.
- Imported package status is stored in browser localStorage and displayed as provenance for the current review queue.
- Synthetic browser package status is stored in the same localStorage layer but is explicitly marked as synthetic demonstration data, not LOCUS ordinance text.
- Imported package map overlays join browser-local record `unit_id` values to public aggregate map units, highlighting matched county/town units without copying imported records into static artifacts.
- Imported-package-only filtering uses the same browser-local match set to focus aggregate map, inquiry, snapshot, score, and audit views on the current local review package.
- Imported package coverage charts are computed in the browser from the bounded local queue and review events; they summarize state/topic/function/type/OCR mix and workflow status without writing imported records to public artifacts.
- The local review-package materializer has a verified real-data smoke path: it generated ignored packages for 24 LOCUS records across 12 public aggregate units, while Pages publishes only aggregate verification counts.
- Demo mode is synthetic and conspicuously labeled.
- Real LOCUS aggregate artifacts are published through Pages after local safety checks.
- Real LOCUS rows and ordinance text are not published through Pages.
- Polars remains the support engine for local Parquet validation and queue preparation.

## Corpus Support Layer

`src/evolocus/locus_source.py` supports:

- `demo`: synthetic records, no network, safe default.
- `local`: one Parquet file or deterministic sorted glob of Parquet shards.
- `download`: blocked unless explicitly allowed by CLI code.

Raw LOCUS fields are preserved. Derived fields such as `record_id`, `source_locator`, normalized jurisdiction metadata, content lengths, content hash, and OCR-risk flags are added separately.

## Browser Evaluation Layer

`site/assets/app.js` owns the public workbench behavior:

- append-only review events in localStorage;
- browser-local import-status metadata for bounded local packages;
- browser-local map overlays for imported package units;
- browser-local imported-package-only map filtering;
- browser-local package coverage visuals for bounded local packages;
- blinded model output by default;
- explicit reveal logging;
- review save, save-next, skip, and flag actions;
- bounded queue import through the browser File API;
- content-free latest-review CSV export;
- review-event JSON export.

## Static Analysis Artifacts

`src/evolocus/analysis_publish.py` generates:

- `status.json`: analysis state, dataset revision, public-data flags, Grok policy.
- `map_layers.json`: state-clustered county/town-style units, neutral tier colors, law counts, model-score summaries.
- `unit_audit_quality.json`: per-unit OCR-risk, duplicate-text-hash, and audit-attention aggregates for the published map-unit scope.
- `ontology.json`: topics, functions, score dimensions, tiers, and jurisdiction-unit edges.
- `models.json`: imported LOCUS released model outputs and model-import policy.
- `chat_index.json`: deterministic inquiry entries for the browser chat panel.
- `inquiry_briefings.json`: progressive static answer briefings derived from aggregate artifacts.
- `question_pack.json`: aggregate-only filter-aware question prompts with optional offline Grok note.

Map tiers are review-priority bands over available model-score summaries and law counts. They are not rankings of legal burden, legality, freedom, or civic performance.

Audit attention is a review-priority signal from aggregate OCR-risk and duplicate-text-hash rates. It is not a legal ranking, proof of text defects, or a civic finding.

The Audit Lens uses the same progressive disclosure control as the map and status views: overview summarizes the aggregate scan, unit detail expands state and unit rows, and evidence trail exposes artifact scope and limitations.

The Score Lens uses the same filters and disclosure levels. It displays score values as neutral relative model outputs only; directional legal interpretations remain out of scope until authoritative model-card verification is added.

The Inquiry question matrix is a browser-side prompt surface over the same aggregate artifacts and `question_pack.json`. It can fill and answer the inquiry form, apply safe filter templates, and change disclosure depth, but it does not call Grok or any browser-exposed LLM API.

Inquiry answers include a filter-aware ontology mini-map that renders only aggregate topic, function, neutral-tier, and map-unit nodes from the current public artifact scope. Mini-map node clicks open a county/town comparison drawer over aggregate units before routing to existing map and ontology views; it does not publish ordinance text, source locators, review events, or live model calls.

The Queue Plan export is a planning artifact, not a real record-level LOCUS evaluation queue. It excludes ordinance text, headers, source locators, raw row data, SQLite state, and browser review events.

The review-package request export is also aggregate-only. `materialize-review-package` is the local support command that can turn the request into a bounded browser-import package from authorized local Parquet. It refuses to write under `site/`. Its default output omits `header` and `content`; `--include-content` is required to create a text-bearing local review package.

The current-view snapshot export is a shareable analysis artifact, not an evidence record. It excludes ordinance text, headers, raw row data, record locators, browser review events, local databases, and secrets.

The snapshot gallery is browser-local visual state. It compares saved aggregate views and exports gallery JSON with the same no-text/no-locator boundary.

The map-side inquiry history is also browser-local visual state. It stores bounded aggregate answer summaries for quick comparison in the map card and exports sanitized JSON with the same no-text, no-locator, no-review-event, no-browser-LLM boundary.

The current public artifact set is a top-1,000 jurisdiction-unit aggregate layer generated from local LOCUS Parquet. It uses approximate state-clustered positions with state anchors until reviewed county/town geometry crosswalks are added.

The latest-artifact refresh panel reports current metadata contributions from the loaded aggregate artifact set. The tracked `artifact_snapshot.json` file stores prior aggregate metrics only, allowing current-vs-snapshot deltas without publishing text, source locators, databases, exports, or legal findings. The Analysis Status timeline strip compares aggregate artifact timestamps against that stored baseline as publication provenance only; it is not evidence that the underlying law corpus changed. The artifact lineage visual maps public surfaces to their aggregate JSON dependencies so a reviewer can see how the Law Map, Inquiry, Ontology, Charts, Audit Lens, Queue Plan, and Snapshots are powered without exposing row-level records.

The same stored snapshot appears on the primary Map and Inquiry freshness cards. Map deltas compare aggregate unit and row counts; Inquiry deltas compare briefing and question-pack counts. These badges are publication provenance, not claims that the underlying law corpus changed.

## Grok Integration Boundary

The repository secret name is `GROK_API_KEY`. It may be used by offline GitHub Actions or local jobs to produce static aggregate-only inquiry briefings. It must not be exposed in Pages JavaScript because every browser-delivered asset is public.

The Actions refresh path uses the xAI Responses endpoint with model `grok-4.3` for offline enrichment when available. The generated artifact records whether Grok was used, and the Analysis Status tab surfaces that state.

## Optional Support Components

- SQLite: local support workflows and reproducible queue snapshots.
- DuckDB: optional ad hoc analytical SQL after evaluator MVP.
- LanceDB: optional semantic retrieval after human evaluation exists.
- Postgres: optional multi-user review store later.
- Census/FIPS/geospatial enrichment: deferred until reviewed crosswalks exist.

DuckDB is not required for the evaluator path and must not be used as a browser-side database.
