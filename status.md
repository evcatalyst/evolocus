# EvoLOCUS Status

Phase: 1 in progress

Completion: Phase 0 complete. Phase 1 now includes a GitHub Pages-first browser evaluation workbench MVP validated in synthetic demo mode plus aggregate-only LOCUS visual artifacts generated from local Parquet. No overall percentage is reported because `roadmap.json` does not define a weighted completion model.

Files saved:

- `.github/workflows/pages.yml`
- `.github/workflows/analysis-refresh.yml`
- `data/README.md`
- `dashboards/README.md`
- `docs/architecture.md`
- `docs/data-policy.md`
- `docs/local-law-analytics-platform.md`
- `docs/evaluation-gap-analysis.md`
- `docs/evaluation-protocol.md`
- `docs/evaluation-workbench.md`
- `notebooks/README.md`
- `scrapers/README.md`
- `site/assets/styles.css`
- `site/assets/app.js`
- `site/data/analysis/status.json`
- `site/data/analysis/map_layers.json`
- `site/data/analysis/ontology.json`
- `site/data/analysis/chat_index.json`
- `site/data/analysis/inquiry_briefings.json`
- `site/data/analysis/question_pack.json`
- `site/data/analysis/models.json`
- `site/data/analysis/charts.json`
- `site/data/analysis/county_geometry.json`
- `site/data/analysis/municipal_points.json`
- `site/data/analysis/unit_audit_quality.json`
- `site/index.html`
- `src/evolocus/__init__.py`
- `src/evolocus/analysis_publish.py`
- `src/evolocus/cli.py`
- `src/evolocus/config.py`
- `src/evolocus/demo_data.py`
- `src/evolocus/evaluation_db.py`
- `src/evolocus/evaluation_exports.py`
- `src/evolocus/evaluation_metrics.py`
- `src/evolocus/evaluation_protocol.py`
- `src/evolocus/evaluation_sampling.py`
- `src/evolocus/inquiry_briefings.py`
- `src/evolocus/static_question_pack.py`
- `src/evolocus/jurisdiction.py`
- `src/evolocus/locus_audit.py`
- `src/evolocus/locus_contract.py`
- `src/evolocus/locus_ingest.py`
- `src/evolocus/locus_normalize.py`
- `src/evolocus/locus_source.py`
- `src/evolocus/public_artifact_guard.py`
- `dashboards/app.py`
- `dashboards/pages/1_Review_Queue.py`
- `dashboards/pages/2_Dataset_Explorer.py`
- `dashboards/pages/3_Evaluation_Results.py`
- `dashboards/pages/4_Protocol_and_Provenance.py`
- `tests/test_scaffold.py`
- `tests/test_locus_ingest.py`
- `tests/test_pages_app.py`
- `.gitignore`
- `AGENTS.md`
- `README.md`
- `docker-compose.yml`
- `lessons.md`
- `requirements.txt`
- `roadmap.json`
- `status.md`

Current coverage stats:

- LOCUS Parquet shards downloaded locally: 8, in ignored `data/raw/locus-v1/main/data/`
- Scrapers run: 0
- Databases created: 0
- Embeddings created: 0
- Real civic findings published: 0
- Static site data: aggregate-only LOCUS state-clustered map, ontology, model, inquiry, chart, and status artifacts
- Static inquiry briefings: generated from aggregate-only artifacts; optional Grok enrichment is offline-only
- Tracked inquiry briefing artifact: Grok-enriched aggregate-only artifact persisted from the validated Actions refresh
- Master jurisdiction contract: implemented
- Master jurisdiction rows built from real LOCUS data: 0
- Queue records created from real LOCUS data: 0
- Evaluator code: complete
- Synthetic end-to-end validation: complete
- Primary UI: GitHub Pages browser workbench
- Static analysis artifacts: real aggregate state-clustered preview generated with Polars and published without raw rows or ordinance text
- County geometry artifact: official Census TIGERweb county polygons for 177 matched aggregate county units, machine-matched and pending review
- Municipal point artifact: official Census TIGERweb place/subdivision points for 815 of 823 aggregate municipal units, machine-matched and pending review
- Unit audit-quality artifact: aggregate OCR-risk and duplicate-text-hash review signals for 1,000 published map units covering 1,517,672 LOCUS rows
- Unit audit-quality counts: 55,816 medium/high OCR-review rows, 29,194 duplicate text-hash rows, max audit attention 30.88/100
- Audit Lens visual surface: GitHub Pages tab for attention distribution, OCR reason mix, state audit atlas, and review-priority unit drill-through
- Score Lens visual surface: GitHub Pages tab for neutral model-score distributions, state matrix, and high-contrast unit profiles
- Official geography layer toggles: GitHub Pages can independently show matched county polygons, matched town/municipal points, and progressive aggregate ontology peer links
- Official geography layer legend: GitHub Pages explains active county/town layers, selected-unit peer-link reasons, disclosure depth, and aggregate-only interpretation boundaries
- Map-side tier guide: GitHub Pages explains active filters, visible county/town counts, neutral tier mix, geography color mode, disclosure depth, and aggregate-only publication boundary in the map card
- Map-side topic/tier matrix: GitHub Pages shows aggregate dominant-topic by neutral-tier co-occurrence cells with unit counts, row bars, and safe map filter drillback
- Matrix-linked Inquiry prompts: GitHub Pages topic/tier cells can open deterministic aggregate Inquiry answers after applying safe map filters, with no browser model call
- Tier-to-ontology clickthrough: GitHub Pages tier chips open a focused ontology card with visible units, topic/function links, neutral score means, and current filter context
- Map-driven ontology query presets: GitHub Pages turns current filters, selected unit, visible topic/function/tier, audit, and score context into bounded Inquiry prompts
- Tier-focus mini charts: GitHub Pages ontology focus cards show aggregate topic mix, function mix, unit type mix, and neutral score means for the active tier
- Tier mini-chart drilldowns: GitHub Pages topic, function, and unit-type bars apply browser map filters and return to the county/town map
- Score-band drilldowns: GitHub Pages neutral score mini-chart rows apply relative model-score band filters and return to the county/town map without directional legal interpretation
- Map-side inquiry panel: GitHub Pages answers current-filter, selected-unit, audit, score, and package-overlay questions inside the map card from static aggregate artifacts
- Map inquiry history surface: GitHub Pages saves browser-local aggregate answer snapshots with filters, selected unit metadata, package counts, and comparison rows
- Map inquiry history export: GitHub Pages exports sanitized aggregate answer history JSON with no text, locators, review events, local paths, or secrets
- Inquiry comparison strip: GitHub Pages pairs map-side answers with prompt-aware county/town aggregate comparison rows that drill back to selected map units
- Selected-unit ontology path animation: GitHub Pages animates the aggregate path from map unit to topic/function/tier, then score and geometry nodes by disclosure depth
- Selected-unit progressive trail: GitHub Pages map panel walks from aggregate overview to unit-detail model outputs to evidence/provenance boundaries with disclosure buttons
- Selected-unit ontology drilldowns: GitHub Pages map panel shows topic/function/tier/score/geometry/package cards that route to ontology context, evidence depth, or package focus without raw text
- Inquiry matrix surface: GitHub Pages prompt cards for filter-aware aggregate map, package overlay, topic, function, audit, score, and selected-unit answers
- Static question-pack surface: GitHub Pages reads `question_pack.json` prompts that can apply aggregate map filters and disclosure levels without live browser model calls
- Inquiry answer mini-chart surface: GitHub Pages answers now include click-through topic, function, tier, and top-unit aggregate mini charts that route back to safe map filters or published unit IDs only
- Inquiry ontology mini-map surface: GitHub Pages answers now show a compact aggregate graph linking current answer scope to top topic, top function, neutral tier, highest-row county/town unit, and a county/town comparison drawer with map/ontology drillbacks
- Queue Plan surface: GitHub Pages tab for aggregate review batch planning and content-free unit-level JSON export
- Review package handoff surface: GitHub Pages exports aggregate-only package requests for local ignored materialization
- Review package preview surface: GitHub Pages shows package record budget, unit mix, and safety gates before download
- Real review package smoke: ignored local metadata and content packages materialized from real LOCUS Parquet for 24 records across 12 public aggregate units
- Synthetic package demo surface: GitHub Pages can generate a browser-local placeholder package from current aggregate units for package-to-map overlay testing without LOCUS text
- Import status surface: GitHub Pages shows browser-local package provenance, text-inclusion state, and safety flags after upload
- Package map overlay surface: GitHub Pages highlights imported browser-local package units on the aggregate map, official county polygons, municipal points, selected-unit panel, and map table
- Imported package filter surface: GitHub Pages can narrow map-driven aggregate visuals to units represented in the browser-local review package
- Package inquiry surface: GitHub Pages explains active browser-local package coverage, map matches, workflow status, and safety boundaries without listing text or source locator values
- Package ontology surface: GitHub Pages bridges active browser-local package counts into topic, function, tier, and matched-unit ontology context without rendering row text
- Package coverage surface: GitHub Pages Results tab summarizes imported browser-local queues by state, topic, function, jurisdiction type, OCR-risk mix, safety markers, and review progress
- Current-view export surface: GitHub Pages buttons for filtered map/inquiry aggregate snapshot JSON
- Snapshot gallery surface: GitHub Pages tab for browser-local comparison of saved aggregate map/inquiry snapshots, including package-count comparisons when a local package overlay is active
- Artifact snapshot diff surface: GitHub Pages Analysis Status compares current aggregate metadata with `artifact_snapshot.json`, a stored public baseline containing counts and publication-policy flags only
- Artifact refresh timeline surface: GitHub Pages Analysis Status compares current aggregate artifact timestamps with the stored public snapshot baseline as publication provenance only
- Walkthrough surface: GitHub Pages tab that guides the public real-aggregate visual path from map to inquiry, ontology, queue planning, package overlay, and snapshots
- Model registry: released LOCUS output fields imported
- Grok secret wiring: `GROK_API_KEY` documented for offline jobs only, with the existing `Grok_api_key` Actions secret accepted as an alias by the refresh workflow
- Public artifact guard: validates aggregate-only Pages JSON before analysis-refresh deployment
- Pages deploy guard: normal Pages workflow validates public artifacts before upload
- Real LOCUS aggregate scan: run for top 1,000 state-clustered jurisdiction units; artifact law count 1,517,672 within the published unit cap
- Real LOCUS evaluation: not started

Verified LOCUS source:

- Dataset: https://huggingface.co/datasets/LocalLaws/LOCUS-v1
- Paper: https://arxiv.org/abs/2606.19334
- Citation: Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport. "Freeing the Law with LOCUS: A Local Ordinance Corpus for the United States." arXiv:2606.19334, 2026.
- arXiv confirmation: verified from the user-supplied canonical page on 2026-06-20. The page lists submission date 2026-06-17, authors Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport, 9,239 cities/counties in the raw corpus, and Hugging Face availability for LOCUS-v1 and derivative models.

Beautiful next visualization idea:

A full-screen national coverage atlas that upgrades the current approximate state-clustered aggregate map into reviewed county and town geometries, still using neutral tiers and progressive disclosure with no ordinance text published.

Latest update:

- Added `src/evolocus/locus_ingest.py` with guarded Hugging Face access, local file readers, vendor/type inference, and deterministic master jurisdiction rows.
- Added `src/evolocus/cli.py` with `status`, `ingest-locus`, and `build-master` commands.
- Added `update-cycle` CLI stub that reports safe next steps without downloads or scrapers.
- Added tests using synthetic LOCUS-like records only.
- Current run downloaded LOCUS-v1 Parquet shards into ignored local storage only; no scrapers, databases, embeddings, raw-row commits, or ordinance-text publication occurred.
- Recorded the canonical arXiv source page supplied by the user: https://arxiv.org/abs/2606.19334.
- Added production Local Law Analytics Platform plan; it is now aligned to the GitHub Pages + browser localStorage + Polars support-tooling evaluator path, with DuckDB/LanceDB/RAG/FastAPI deferred.
- Promoted GitHub Pages from a static status page to the primary browser-based evaluator surface with localStorage review history and explicit exports.
- Added static analysis artifacts for law map tiers, ontology, model-output registry, status, charts, publication gates, progressive disclosure, and browser inquiry.
- Generated aggregate LOCUS visual artifacts from local Parquet in ignored storage, safety-checked them for raw text fields, and copied only aggregate JSON into the Pages data layer.
- Replaced the offscreen abstract unit list with a bounded state-clustered map artifact containing 50 state anchors and all published unit coordinates inside the SVG view box.
- Added Pages-side aggregate map filters for state, topic, function, tier, and minimum law count.
- Added filtered-view aggregate insight cards and inquiry answers over the current map selection.
- Added filtered-vs-full aggregate comparison panels for topic, tier, function, jurisdiction kind, and neutral score means.
- Added Charts-tab state/topic small multiples from the same real aggregate map layer.
- Added an Analysis Status tab on GitHub Pages with artifact freshness, publication gates, aggregate-only boundaries, geometry-review status, and Grok secret policy.
- Added a Charts-tab county/town aggregate coverage atlas by state, source-unit type, neutral tier, law count, and top topic.
- Added an official Census TIGERweb county choropleth layer for all 177 aggregate county units, with machine-match pending-review labeling and no raw LOCUS text.
- Added an official Census TIGERweb municipal/town point layer for 815 matched aggregate municipal units, with 8 unmatched units left explicit rather than guessed.
- Added official geography color modes for neutral tier, dominant topic, dominant function, model-substantive share, and law-count intensity.
- Added `inquiry_briefings.json` and a `publish-inquiry-briefings` CLI/workflow path so GitHub Pages can answer questions from progressive aggregate-only static briefings, optionally enriched by Grok offline.
- Added selected-unit inquiry drilldowns so a county/town map selection can open an aggregate-only Q&A answer with geometry-match provenance and disclosure-level details.
- Added selected-unit ontology neighborhood visuals linking the selected aggregate unit to dominant topic, dominant function, neutral tier, score summaries, and geometry-match provenance.
- Added selected-unit peer comparison visuals for similar published aggregate units by shared topic, function, tier, kind, state, and law-count proximity.
- Added model-substantive-share coloring and selected-unit denominators for county/town geography, using released LOCUS model labels only.
- Verified the `GROK_API_KEY` GitHub Actions secret exists for offline aggregate-only inquiry enrichment; the browser-delivered Pages app still contains no API key.
- Ran full local LOCUS audit and manifest over 2,211,516 rows; published only aggregate audit status, gates, OCR-risk counts, and duplicate-content counts to Pages.
- Added aggregate per-unit audit-quality publication for the current top-1,000 map-unit scope, with map filters and official-geography color mode for audit attention.
- Added an Audit Lens tab that visualizes per-unit aggregate audit signals with progressive disclosure and drill-through back to the map.
- Added a Score Lens tab that visualizes released model-score means from aggregate map units with progressive disclosure and drill-through back to the map.
- Added an Inquiry question matrix that turns current filters into deterministic aggregate answers for map, topic, function, audit, score, and selected-unit prompts.
- Added `question_pack.json` and `publish-question-pack` so the Inquiry matrix can render filter-aware static prompts generated from aggregate artifacts, optionally noted by Grok offline.
- Added a selected-unit mini ontology path animation that shows aggregate topic/function/tier links first, then score and geometry links as progressive disclosure deepens.
- Added a map-side law-location tier guide that explains current filters, county/town scope, neutral tier mix, geography color mode, disclosure depth, and no-row-text publication boundaries.
- Added tier-to-ontology clickthrough from the map guide so neutral tier chips open focused ontology context for visible county/town units.
- Added a map-side chat-style inquiry panel that answers current-filter, selected-unit, audit-signal, model-score, and package-overlay prompts without live browser model calls.
- Added an inquiry-driven county/town comparison strip so each map-side prompt shows relevant aggregate units and can open them back on the map.
- Added a Queue Plan tab that ranks aggregate county/town units for future local review packaging and exports only unit-level planning metadata.
- Added a review-package request export and `materialize-review-package` local CLI handoff so aggregate visual plans can become bounded browser-import packages without publishing LOCUS text.
- Added a review-package request preview that displays record budget, state/type/topic mix, and request safety gates before download.
- Added browser-local import-status visuals so materialized package uploads show provenance, text-inclusion state, unit counts, and safety flags before review.
- Added Results-tab package coverage visuals so imported browser-local queues show composition, safety markers, and review progress without publishing package records.
- Added a package-to-map overlay so imported browser-local queues highlight their aggregate county/town units without copying package records into public artifacts.
- Added a one-click imported-package-units map filter so reviewers can focus the public aggregate visual stack on the local review package.
- Optimized `materialize-review-package` to filter by native Polars unit keys before expensive derived fields, then verified a real 24-record local package across 12 public aggregate units.
- Added safe local-package verification counts to the Pages Analysis Status tab; no package text, headers, record IDs, or locator values are published.
- Added a one-click synthetic package demo in the toolbar and Walkthrough so the public site can demonstrate imported-unit map overlays, package-only filters, package coverage charts, and review flow without loading LOCUS row text.
- Added a package-aware Inquiry prompt and answer that summarizes local package map coverage, workflow progress, and publication boundaries without exposing record text or source locator values.
- Added a package-to-ontology bridge that connects browser-local package topic/function/tier counts to matched aggregate map units without exposing text, headers, locator values, or review-event details.
- Added package-aware snapshot summaries and comparisons so saved browser-local aggregate views can show local package counts and matched units without text, locators, or review-event history.
- Added Actions support for the existing `Grok_api_key` secret alias while keeping generated artifacts normalized to `GROK_API_KEY` and browser JavaScript key-free.
- Added a selected-unit progressive visual trail in the map panel so real aggregate county/town visuals can step through overview, model-output detail, and evidence boundaries without leaving the map.
- Added selected-unit ontology drilldown cards in the map panel for topic, function, neutral tier, model outputs, geometry provenance, and browser-local package context.
- Added tier-focus mini charts for topic mix, function mix, unit type mix, and neutral score means inside the ontology focus card.
- Added browser-local map inquiry history snapshots for aggregate answers, filters, selected unit context, package counts, and comparison rows.
- Added tier mini-chart drilldown filters that return from ontology context to the map with topic, function, or unit type applied.
- Added neutral score-band drilldowns from ontology score mini charts back into the map filters.
- Added official geography layer toggles for county polygons, town points, and progressive aggregate ontology peer links.
- Added a progressive official-geography layer legend for selected-unit aggregate ontology peer links.
- Added map-driven ontology query presets that route aggregate map context into deterministic Inquiry answers.
- Added aggregate-only map inquiry history export with sanitized entries and explicit no-text/no-locator/no-review-event policy metadata.
- Added a public-artifact guard and hardened the Grok briefing refresh workflow so generated inquiry artifacts are validated before Pages deployment.
- Persisted the validated Grok-enriched aggregate inquiry briefing artifact so normal Pages deployments preserve the current Q&A layer.
- Added current-view snapshot export for sharing filtered map/inquiry aggregate context without text, raw rows, record locators, or review events.
- Added a Snapshots tab that saves aggregate current-view exports locally and compares them visually without LOCUS text or review history.
- Added a stored aggregate artifact snapshot so the Analysis Status tab can show true current-vs-baseline metadata deltas without text, source locators, databases, exports, or legal findings.
- Added a Walkthrough tab that turns the existing aggregate map, inquiry, ontology, queue plan, and snapshot surfaces into a guided progressive demo flow.

Evaluator implementation state:

- Evaluator code: complete
- Synthetic end-to-end validation: complete
- Real LOCUS full ingest/audit manifest: complete for 2,211,516 rows
- Real LOCUS aggregate visual publish: complete for top 1,000 state-clustered jurisdiction units
- Real LOCUS evaluation: not started
- Default exports omit ordinance text
- Primary evaluator surface: GitHub Pages browser app
- Primary inquiry/map surface: GitHub Pages browser app reading `site/data/analysis/`
- Actions refresh surface: GitHub Pages Analysis Status tab exposes an Actions-only refresh control that opens the manual aggregate briefing workflow without browser-side model calls or embedded keys.
- Freshness surface: Law Map and Inquiry headers show aggregate map, briefing, question-pack, dataset revision, stored-snapshot deltas, and no-row-text publication boundary before users drill into visuals or answers.
- Latest artifact change surface: Analysis Status now summarizes the current aggregate refresh metadata for map, inquiry, question pack, audit, geometry, ontology, charts, models, and local package verification without row text or historical-diff claims.
- Inquiry answer ontology mini-map surface: GitHub Pages answers render a compact graph from current aggregate scope to topic/function/tier/top-unit nodes, open an aggregate county/town comparison drawer, and route clicks to Map or Ontology without row text or source locators.
- Inquiry results log: GitHub Pages stores recent preset/manual aggregate answers in browser localStorage with content-free export and explicit no-text/no-locator/no-review-event policy metadata.
- Refresh-source surface: Law Map header distinguishes tracked Polars aggregate map artifacts, offline briefing source, analysis commit, deploy guard, and aggregate-only publication boundary.
- Inquiry replay surface: saved aggregate inquiry log entries can replay safe map filters, disclosure level, and selected aggregate unit context back into Inquiry or Law Map views without row text or locator values.
- Inquiry pathway surface: GitHub Pages groups current aggregate units into topic/tier visual cells with ask and map actions that reuse safe filters and deterministic aggregate answers only.
- Inquiry pathway peer surface: topic/tier pathway cells compare top aggregate units with row-count bars and map drillback using published unit IDs only.
- Inquiry replay timeline surface: saved aggregate inquiry entries render as browser-local row/unit sparklines with replay and map actions, excluding text, locators, review events, and browser model calls.
- Inquiry ontology-chip surface: topic/tier pathway cells now include aggregate topic, tier, and top-unit chips that route to Ontology or Law Map using safe filters and published unit IDs only.
- Analysis journey surface: GitHub Pages shows a persistent Map -> Inquiry -> Ontology -> Queue Plan strip that routes tabs with aggregate counts, filters, disclosure level, and no row-level data.
