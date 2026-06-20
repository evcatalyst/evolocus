# Data Directory

This directory is intentionally empty in Phase 0.

Future local data should stay in ignored subdirectories:

- `raw/` for downloaded source material
- `processed/` for derived Parquet or table outputs
- `cache/` for temporary scraper or geospatial caches
- `exports/` for generated GeoJSON, shapefile, or CSV exports

Do not commit LOCUS records, scraper outputs, databases, embeddings, or private source files without an explicit review step.

Phase 1 ingest code can read local JSON, JSONL, CSV, or Parquet extracts and write a master jurisdiction table into an ignored path such as `data/processed/master_jurisdictions.json`.
