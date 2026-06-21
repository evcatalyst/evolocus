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
- Inquiry matrix surface: GitHub Pages prompt cards for filter-aware aggregate map, topic, function, audit, score, and selected-unit answers
- Queue Plan surface: GitHub Pages tab for aggregate review batch planning and content-free unit-level JSON export
- Review package handoff surface: GitHub Pages exports aggregate-only package requests for local ignored materialization
- Review package preview surface: GitHub Pages shows package record budget, unit mix, and safety gates before download
- Import status surface: GitHub Pages shows browser-local package provenance, text-inclusion state, and safety flags after upload
- Current-view export surface: GitHub Pages buttons for filtered map/inquiry aggregate snapshot JSON
- Snapshot gallery surface: GitHub Pages tab for browser-local comparison of saved aggregate map/inquiry snapshots
- Walkthrough surface: GitHub Pages tab that guides the public real-aggregate visual path from map to inquiry, ontology, queue planning, and snapshots
- Model registry: released LOCUS output fields imported
- Grok secret wiring: `GROK_API_KEY` documented for offline jobs only
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
- Added a Queue Plan tab that ranks aggregate county/town units for future local review packaging and exports only unit-level planning metadata.
- Added a review-package request export and `materialize-review-package` local CLI handoff so aggregate visual plans can become bounded browser-import packages without publishing LOCUS text.
- Added a review-package request preview that displays record budget, state/type/topic mix, and request safety gates before download.
- Added browser-local import-status visuals so materialized package uploads show provenance, text-inclusion state, unit counts, and safety flags before review.
- Added a public-artifact guard and hardened the Grok briefing refresh workflow so generated inquiry artifacts are validated before Pages deployment.
- Persisted the validated Grok-enriched aggregate inquiry briefing artifact so normal Pages deployments preserve the current Q&A layer.
- Added current-view snapshot export for sharing filtered map/inquiry aggregate context without text, raw rows, record locators, or review events.
- Added a Snapshots tab that saves aggregate current-view exports locally and compares them visually without LOCUS text or review history.
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
