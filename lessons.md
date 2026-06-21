# EvoLOCUS Lessons

## 2026-06-20

- Phase 0 should publish only static documentation and synthetic previews through GitHub Pages.
- Streamlit remains the correct runtime for interactive Collection, Informatics, and GeoViz dashboards; GitHub Pages cannot run a Python Streamlit server.
- LOCUS-v1 citation and dataset URL were verified before scaffolding.
- No LOCUS records, scraper outputs, databases, or embeddings were created in Phase 0.
- Phase 1 ingest should be blocked by default: the CLI now refuses Hugging Face download unless an explicit `--allow-download` flag is supplied.
- The master jurisdiction table can be tested from tiny synthetic LOCUS-like records without committing real LOCUS chunks.
- A no-op `update-cycle` command is enough for early learning-loop scaffolding before dashboards exist.
- The canonical paper URL is https://arxiv.org/abs/2606.19334; arXiv confirms the title, authors, 2026-06-17 submission date, 9,239 raw city/county codes, and Hugging Face availability for LOCUS-v1 and derivative models.
- Polars is the primary corpus engine for the evaluator MVP.
- SQLite stores mutable review state and bounded queue snapshots.
- DuckDB is optional for later ad hoc SQL, not required and never browser-side.
- Human evaluation must be blinded by default.
- Model-produced scores are not legal facts, and score direction requires authoritative verification before directional language.
- Evaluation queues must pin dataset revisions, manifest fingerprints, sampling parameters, and random seeds.
- Full corpus materialization is prohibited in request paths.
- Real data, SQLite evaluation databases, and exports remain ignored.
