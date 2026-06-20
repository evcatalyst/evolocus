# EvoLOCUS Status

Phase: 1 in progress

Completion: Phase 0 complete. Phase 1 has started with guarded LOCUS ingest contracts and master jurisdiction table generation. No overall percentage is reported because `roadmap.json` does not define a weighted completion model.

Files saved:

- `.github/workflows/pages.yml`
- `data/README.md`
- `dashboards/README.md`
- `docs/architecture.md`
- `docs/data-policy.md`
- `notebooks/README.md`
- `scrapers/README.md`
- `site/assets/styles.css`
- `site/index.html`
- `src/evolocus/__init__.py`
- `src/evolocus/cli.py`
- `src/evolocus/locus_ingest.py`
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
- Queue records created: 0

Verified LOCUS source:

- Dataset: https://huggingface.co/datasets/LocalLaws/LOCUS-v1
- Paper: https://arxiv.org/abs/2606.19334
- Citation: Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport. "Freeing the Law with LOCUS: A Local Ordinance Corpus for the United States." arXiv:2606.19334, 2026.

Beautiful next visualization idea:

A full-screen national coverage atlas that starts with a synthetic county-style choropleth and city coverage point layer, then swaps to real LOCUS-derived aggregates only after Phase 1 provenance and licensing checks pass.

Latest update:

- Added `src/evolocus/locus_ingest.py` with guarded Hugging Face access, local file readers, vendor/type inference, and deterministic master jurisdiction rows.
- Added `src/evolocus/cli.py` with `status`, `ingest-locus`, and `build-master` commands.
- Added `update-cycle` CLI stub that reports safe next steps without downloads or scrapers.
- Added tests using synthetic LOCUS-like records only.
- Did not download LOCUS-v1, run scrapers, create databases, or create embeddings.
