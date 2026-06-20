# EvoLOCUS Architecture

EvoLOCUS is planned as a local-first Python platform with a static public companion site.

## Phase 0

- Static GitHub Pages site in `site/`
- Project status in `status.md`
- Roadmap in `roadmap.json`
- Data policy and scaffold tests

## Future Data Flow

1. Load LOCUS-v1 from Hugging Face into ignored local storage.
2. Normalize records into local analytical tables.
3. Enrich records with FIPS, Census, ACS, population, density, and geometry.
4. Add embeddings, topic clustering, and custom scoring.
5. Maintain a master jurisdiction table and prioritized scrape queue.
6. Serve dashboards through Streamlit.
7. Publish only reviewed static summaries or exports.

## Phase 1 Ingest Module

`src/evolocus/locus_ingest.py` defines the first production contract:

- Hugging Face LOCUS-v1 access is blocked unless `allow_download=True`.
- Local JSON, JSONL, CSV, and Parquet extracts can be read for offline development.
- Master jurisdiction rows include `fips`, `name`, `state`, `type`, `vendor`, `last_scrape`, `next_priority_score`, `status`, and `tags`.
- FIPS and geospatial fields remain unverified until a later enrichment step; generated rows use `needs_geocoding`.
- Priority scores are deterministic planning signals, not civic findings.

## Storage

- Local Parquet for large analytical tables.
- SQLite for queue state in early phases.
- DuckDB for local analysis.
- PostgreSQL/PostGIS optional later through `docker-compose.yml`.

## Publication Boundary

GitHub Pages must not expose unreviewed real civic claims, downloaded records, credentials, local caches, or generated embeddings. Static previews must remain synthetic until source-backed outputs are explicitly curated.

## Citation

Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport. "Freeing the Law with LOCUS: A Local Ordinance Corpus for the United States." arXiv:2606.19334, 2026. Dataset: https://huggingface.co/datasets/LocalLaws/LOCUS-v1
