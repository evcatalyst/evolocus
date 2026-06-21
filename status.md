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
- Master jurisdiction contract: implemented
- Master jurisdiction rows built from real LOCUS data: 0
- Queue records created from real LOCUS data: 0
- Evaluator code: complete
- Synthetic end-to-end validation: complete
- Primary UI: GitHub Pages browser workbench
- Static analysis artifacts: real aggregate state-clustered preview generated with Polars and published without raw rows or ordinance text
- County geometry artifact: official Census TIGERweb county polygons for 177 matched aggregate county units, machine-matched and pending review
- Municipal point artifact: official Census TIGERweb place/subdivision points for 815 of 823 aggregate municipal units, machine-matched and pending review
- Model registry: released LOCUS output fields imported
- Grok secret wiring: `GROK_API_KEY` documented for offline jobs only
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
- Added official geography color modes for neutral tier, dominant topic, dominant function, and law-count intensity.
- Added `inquiry_briefings.json` and a `publish-inquiry-briefings` CLI/workflow path so GitHub Pages can answer questions from progressive aggregate-only static briefings, optionally enriched by Grok offline.
- Added selected-unit inquiry drilldowns so a county/town map selection can open an aggregate-only Q&A answer with geometry-match provenance and disclosure-level details.
- Added selected-unit ontology neighborhood visuals linking the selected aggregate unit to dominant topic, dominant function, neutral tier, score summaries, and geometry-match provenance.

Evaluator implementation state:

- Evaluator code: complete
- Synthetic end-to-end validation: complete
- Real LOCUS full ingest/audit manifest: not run
- Real LOCUS aggregate visual publish: complete for top 1,000 state-clustered jurisdiction units
- Real LOCUS evaluation: not started
- Default exports omit ordinance text
- Primary evaluator surface: GitHub Pages browser app
- Primary inquiry/map surface: GitHub Pages browser app reading `site/data/analysis/`
