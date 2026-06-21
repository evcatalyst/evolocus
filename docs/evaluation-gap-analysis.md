# Evaluation Gap Analysis

Created: 2026-06-21

## Baseline Verified

- Branch: `main`
- Starting commit: `9532fc400d8d8fd20891ea183fc6f50021a448a4`
- Starting message: `Add Local Law Analytics Platform blueprint`
- Working tree before changes: clean
- Existing direct baseline tests: 12 passed
- Baseline `python3.11 -m pytest -q`: failed because `pytest` was not installed in the active Python 3.11 environment
- Workspace `.venv` created on the project volume and core evaluator dependencies installed for validation

## Verified Defects

- `src/evolocus/locus_ingest.py` used `pl.scan_parquet(path).collect().iter_rows(...)`, which materializes Parquet before iteration and is unsafe as the primary LOCUS path.
- The existing master jurisdiction builder required a generic `jurisdiction`/`name` field, but the published LOCUS-v1 schema derives jurisdiction identity from `source_jurisdiction_type`, `state`, `city`, and `county`.
- `load_locus_from_huggingface()` returns a materialized Hugging Face Dataset when allowed; the evaluator path needs Polars lazy local Parquet access and must never download on app startup.
- The production blueprint presented DuckDB as the primary analytical store; this milestone requires Polars + Parquet for corpus reads and SQLite for mutable review state.
- `update-cycle` only reported future work; it did not provide a working evaluation vertical slice.

## Future Enhancements, Not Defects

- LanceDB, semantic search, RAG, Census/FIPS enrichment, Postgres, FastAPI, and choropleth maps are deferred until the evaluator MVP passes.
- Full LOCUS-v1 download and real-data audit remain guarded operations and were not run.

## Data Safety

- No LOCUS records were downloaded.
- No scrapers were run.
- No real data, SQLite databases, exports, embeddings, or Parquet artifacts were staged.
