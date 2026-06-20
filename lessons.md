# EvoLOCUS Lessons

## 2026-06-20

- Phase 0 should publish only static documentation and synthetic previews through GitHub Pages.
- Streamlit remains the correct runtime for interactive Collection, Informatics, and GeoViz dashboards; GitHub Pages cannot run a Python Streamlit server.
- LOCUS-v1 citation and dataset URL were verified before scaffolding.
- No LOCUS records, scraper outputs, databases, or embeddings were created in Phase 0.
- Phase 1 ingest should be blocked by default: the CLI now refuses Hugging Face download unless an explicit `--allow-download` flag is supplied.
- The master jurisdiction table can be tested from tiny synthetic LOCUS-like records without committing real LOCUS chunks.
- A no-op `update-cycle` command is enough for early learning-loop scaffolding before dashboards exist.
