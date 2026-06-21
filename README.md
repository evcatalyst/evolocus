# EvoLOCUS

EvoLOCUS is an open-source, local-first, extensible platform for turning the LOCUS Local Ordinance Corpus and future public-source scrapes into an enriched, geospatial-enabled national dataset of United States local laws.

Phase 0 is a scaffold only. It does not download LOCUS-v1, run scrapers, create databases, generate embeddings, or publish real ordinance data.

## Current Status

- Phase: 0 complete
- Evaluator MVP: complete for synthetic demo validation
- Real LOCUS ingest: not run
- Real LOCUS evaluation: not started
- Data state: no real data committed
- Public site: static GitHub Pages companion site from `site/`
- Interactive dashboards: local Streamlit human-evaluation runtime
- Completion method: phase checklist, not weighted overall percentage

## LOCUS Source and Citation

Primary dataset: https://huggingface.co/datasets/LocalLaws/LOCUS-v1

Citation:

> Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport. "Freeing the Law with LOCUS: A Local Ordinance Corpus for the United States." arXiv:2606.19334, 2026.

The LOCUS-v1 Hugging Face dataset card identifies the dataset as Parquet, CC-BY-NC-4.0, English, and linked to arXiv:2606.19334. EvoLOCUS records this citation for reproducibility, but Phase 0 intentionally does not download or redistribute LOCUS records.

## Evaluator Mission

EvoLOCUS now includes a local-first human-evaluation workbench for LOCUS-v1. A reviewer can run a Streamlit app, browse synthetic demo or local Parquet records, create deterministic evaluation queues, perform blinded reviews, persist append-only review events in SQLite, view agreement metrics, and export auditable results without exporting ordinance text by default.

The evaluator is not a public legal search engine and not legal advice. LOCUS text may contain OCR errors, labels and scores are model-produced, the corpus is not complete or continuously current law, and users must consult official current legal sources. LOCUS-v1 is licensed CC-BY-NC-4.0.

## Architecture

Primary evaluator stack:

- Polars lazy frames over Parquet for corpus reads and bounded transforms.
- SQLite through Python `sqlite3` for mutable evaluation state.
- Streamlit for local human review.
- GitHub Pages for static documentation only.

Deferred optional tools: DuckDB for ad hoc SQL, LanceDB for semantic retrieval, Postgres for multi-user writes, and geospatial/Census enrichment after the evaluator MVP.

## Phase Roadmap

1. Phase 0: scaffold, documentation, validation, static Pages companion site.
2. Phase 1: LOCUS-v1 ingestion contracts, master jurisdiction table, evaluator workbench, and local queue/evaluation store.
3. Phase 2: Streamlit dashboards for Collection, Informatics, and GeoViz.
4. Phase 3: scraper framework, priority engine, Optimize Flow simulation.
5. Phase 4+: continuous enrichment, classifiers, exports, deployment helpers.

## Production Blueprint

The phased Local Law Analytics Platform architecture and starter code lives in `docs/local-law-analytics-platform.md`. It has been superseded for the current milestone by the Polars-first evaluator path: Polars + Parquet + SQLite + Streamlit are primary; DuckDB, LanceDB, FastAPI, Postgres, RAG, and Census enrichment are deferred.

## Local Setup

```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest
```

Optional Docker services are stubbed in `docker-compose.yml` for future PostgreSQL/PostGIS work. Phase 0 does not require Docker.

## Phase 1 Evaluator Tools

The first Phase 1 module adds a guarded LOCUS-v1 ingestion contract, master jurisdiction table builder, Polars-first corpus service, evaluation queues, SQLite review store, Streamlit evaluator, and content-free exports.

Status command:

```bash
PYTHONPATH=src python -m evolocus.cli status
```

Demo-mode evaluator:

```bash
EVOLOCUS_MODE=demo \
EVOLOCUS_EVAL_DB=data/evaluation/evolocus_eval.sqlite3 \
streamlit run dashboards/app.py
```

Local-Parquet evaluator:

```bash
EVOLOCUS_MODE=local \
EVOLOCUS_DATA_GLOB='data/raw/locus-v1/<revision>/**/*.parquet' \
EVOLOCUS_DATASET_REVISION='<revision>' \
EVOLOCUS_EVAL_DB=data/evaluation/evolocus_eval.sqlite3 \
streamlit run dashboards/app.py
```

Blocked-by-default Hugging Face entrypoint:

```bash
PYTHONPATH=src python -m evolocus.cli ingest-locus
```

Audit demo or local Parquet:

```bash
PYTHONPATH=src python -m evolocus.cli audit-locus \
  --output data/processed/locus-v1/demo/audit
```

Initialize and seed an evaluation queue:

```bash
PYTHONPATH=src python -m evolocus.cli init-evaluation \
  --db data/evaluation/evolocus_eval.sqlite3

PYTHONPATH=src python -m evolocus.cli seed-evaluation \
  --db data/evaluation/evolocus_eval.sqlite3 \
  --queue baseline-v1 \
  --strategy balanced_labels \
  --size 500 \
  --seed 20260621 \
  --input 'data/raw/locus-v1/<revision>/**/*.parquet' \
  --dataset-revision '<revision>'
```

Export without ordinance content:

```bash
PYTHONPATH=src python -m evolocus.cli export-evaluation \
  --db data/evaluation/evolocus_eval.sqlite3 \
  --queue baseline-v1 \
  --output data/exports/baseline-v1 \
  --without-content
```

Ignored storage locations:

- `data/raw/`: local LOCUS Parquet
- `data/processed/`: audit outputs and derived local artifacts
- `data/evaluation/`: SQLite review state
- `data/exports/`: local evaluation exports

## GitHub Pages

The static companion site lives in `site/` and is deployed by `.github/workflows/pages.yml`. GitHub Pages is not the Streamlit evaluator and must not host real LOCUS rows or local evaluation databases.

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
