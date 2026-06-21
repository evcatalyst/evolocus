# EvoLOCUS Status

Phase: 1 in progress

Completion: Phase 0 complete. Phase 1 now includes a GitHub Pages-first browser evaluation workbench MVP validated in synthetic demo mode. No overall percentage is reported because `roadmap.json` does not define a weighted completion model.

Files saved:

- `.github/workflows/pages.yml`
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
- `site/index.html`
- `src/evolocus/__init__.py`
- `src/evolocus/cli.py`
- `src/evolocus/config.py`
- `src/evolocus/demo_data.py`
- `src/evolocus/evaluation_db.py`
- `src/evolocus/evaluation_exports.py`
- `src/evolocus/evaluation_metrics.py`
- `src/evolocus/evaluation_protocol.py`
- `src/evolocus/evaluation_sampling.py`
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

- LOCUS records downloaded: 0
- Scrapers run: 0
- Databases created: 0
- Embeddings created: 0
- Real civic findings published: 0
- Static site data: synthetic placeholders only
- Master jurisdiction contract: implemented
- Master jurisdiction rows built from real LOCUS data: 0
- Queue records created from real LOCUS data: 0
- Evaluator code: complete
- Synthetic end-to-end validation: complete
- Primary UI: GitHub Pages browser workbench
- Static analysis artifacts: synthetic demo generated with map, ontology, model registry, inquiry, charts, and publication gates
- Model registry: released LOCUS output fields imported
- Grok secret wiring: `GROK_API_KEY` documented for offline jobs only
- Real LOCUS ingest: not run
- Real LOCUS evaluation: not started

Verified LOCUS source:

- Dataset: https://huggingface.co/datasets/LocalLaws/LOCUS-v1
- Paper: https://arxiv.org/abs/2606.19334
- Citation: Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport. "Freeing the Law with LOCUS: A Local Ordinance Corpus for the United States." arXiv:2606.19334, 2026.
- arXiv confirmation: verified from the user-supplied canonical page on 2026-06-20. The page lists submission date 2026-06-17, authors Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport, 9,239 cities/counties in the raw corpus, and Hugging Face availability for LOCUS-v1 and derivative models.

Beautiful next visualization idea:

A full-screen national coverage atlas that starts with a synthetic county-style choropleth and city coverage point layer, then swaps to real LOCUS-derived aggregates only after Phase 1 provenance and licensing checks pass.

Latest update:

- Added `src/evolocus/locus_ingest.py` with guarded Hugging Face access, local file readers, vendor/type inference, and deterministic master jurisdiction rows.
- Added `src/evolocus/cli.py` with `status`, `ingest-locus`, and `build-master` commands.
- Added `update-cycle` CLI stub that reports safe next steps without downloads or scrapers.
- Added tests using synthetic LOCUS-like records only.
- Did not download LOCUS-v1, run scrapers, create databases, or create embeddings.
- Recorded the canonical arXiv source page supplied by the user: https://arxiv.org/abs/2606.19334.
- Added production Local Law Analytics Platform plan; it is now aligned to the GitHub Pages + browser localStorage + Polars support-tooling evaluator path, with DuckDB/LanceDB/RAG/FastAPI deferred.
- Promoted GitHub Pages from a static status page to the primary browser-based evaluator surface with localStorage review history and explicit exports.
- Added static analysis artifacts for law map tiers, ontology, model-output registry, status, charts, publication gates, progressive disclosure, and browser inquiry.

Evaluator implementation state:

- Evaluator code: complete
- Synthetic end-to-end validation: complete
- Real LOCUS ingest: not run
- Real LOCUS evaluation: not started
- Default exports omit ordinance text
- Primary evaluator surface: GitHub Pages browser app
- Primary inquiry/map surface: GitHub Pages browser app reading `site/data/analysis/`
