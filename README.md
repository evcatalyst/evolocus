# EvoLOCUS

EvoLOCUS is an open-source, local-first, extensible platform for turning the LOCUS Local Ordinance Corpus and future public-source scrapes into an enriched, geospatial-enabled national dataset of United States local laws.

Phase 0 is a scaffold only. It does not download LOCUS-v1, run scrapers, create databases, generate embeddings, or publish real ordinance data.

## Current Status

- Phase: 0 complete
- Data state: no real data committed
- Public site: static GitHub Pages companion site from `site/`
- Interactive dashboards: planned Streamlit runtime
- Completion method: phase checklist, not weighted overall percentage

## LOCUS Source and Citation

Primary dataset: https://huggingface.co/datasets/LocalLaws/LOCUS-v1

Citation:

> Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport. "Freeing the Law with LOCUS: A Local Ordinance Corpus for the United States." arXiv:2606.19334, 2026.

The LOCUS-v1 Hugging Face dataset card identifies the dataset as Parquet, CC-BY-NC-4.0, English, and linked to arXiv:2606.19334. EvoLOCUS records this citation for reproducibility, but Phase 0 intentionally does not download or redistribute LOCUS records.

## Phase Roadmap

1. Phase 0: scaffold, documentation, validation, static Pages companion site.
2. Phase 1: LOCUS-v1 ingestion, master jurisdiction table, gap finder, queue seeding.
3. Phase 2: Streamlit dashboards for Collection, Informatics, and GeoViz.
4. Phase 3: scraper framework, priority engine, Optimize Flow simulation.
5. Phase 4+: continuous enrichment, classifiers, exports, deployment helpers.

## Local Setup

```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest
```

Optional Docker services are stubbed in `docker-compose.yml` for future PostgreSQL/PostGIS work. Phase 0 does not require Docker.

## Phase 1 Ingest Tools

The first Phase 1 module adds a guarded LOCUS-v1 ingestion contract and master jurisdiction table builder.

Status command:

```bash
PYTHONPATH=src python -m evolocus.cli status
```

Blocked-by-default Hugging Face entrypoint:

```bash
PYTHONPATH=src python -m evolocus.cli ingest-locus
```

No-op update-cycle stub:

```bash
PYTHONPATH=src python -m evolocus.cli update-cycle
```

Local-only master table build from an existing JSON, JSONL, CSV, or Parquet extract:

```bash
PYTHONPATH=src python -m evolocus.cli build-master \
  --input data/raw/locus_local_extract.jsonl \
  --output data/processed/master_jurisdictions.json
```

The `data/raw/` and `data/processed/` paths are ignored by git. Do not commit LOCUS records or derived tables without an explicit publication review.

## GitHub Pages

The static companion site lives in `site/` and is deployed by `.github/workflows/pages.yml`.

GitHub Pages is not the Streamlit application. Pages is for documentation, status, and synthetic previews. Streamlit will remain the local or separately hosted interactive dashboard runtime.

## Data Policy

- Real LOCUS data belongs in ignored local paths such as `data/raw/` and `data/processed/`.
- Static site examples must be synthetic and clearly labeled.
- Future public exports require explicit source, license, and provenance checks.

## Hugging Face Download One-Liner

Do not run this unless you are intentionally performing local ingestion and keeping outputs in ignored data paths:

```python
from datasets import load_dataset
dataset = load_dataset("LocalLaws/LOCUS-v1")
```
