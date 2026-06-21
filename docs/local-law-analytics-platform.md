# Local Law Analytics Platform: Polars-First Evaluator Blueprint

This document supersedes the earlier DuckDB-first analytics blueprint for the current milestone.

Primary stack for the evaluator MVP:

- Polars lazy frames over local Parquet.
- SQLite through Python `sqlite3` for mutable evaluation state.
- Streamlit for local human review.
- GitHub Pages for static documentation only.

Optional later:

- DuckDB for ad hoc SQL after evaluator MVP.
- LanceDB for semantic retrieval after relevance evaluation exists.
- Postgres for multi-user review workflows.
- Census/FIPS/geospatial enrichment after reviewed crosswalks exist.

## Source

- Dataset: https://huggingface.co/datasets/LocalLaws/LOCUS-v1
- Paper: https://arxiv.org/abs/2606.19334
- License: CC-BY-NC-4.0
- Reported release scale: 2,211,516 rows, eight Parquet shards, about 1.77 GB

Published raw columns:

```text
header
content
is_substantive
function
topic
source_jurisdiction_type
state
city
county
enforcement_discretion
opacity
paternalism
problem_salience
```

## Current Data Flow

```mermaid
flowchart LR
  A["LOCUS Parquet or synthetic demo rows"] --> B["Polars lazy corpus service"]
  B --> C["Raw schema validation"]
  B --> D["Derived metadata without overwriting raw fields"]
  D --> E["Audit JSON + bounded findings sample"]
  D --> F["Deterministic queue sampler"]
  F --> G["SQLite queue snapshots"]
  G --> H["Streamlit blinded review"]
  H --> I["Append-only review events"]
  I --> J["Metrics + content-free exports"]
```

## Execution Commands

Demo evaluator:

```bash
EVOLOCUS_MODE=demo \
EVOLOCUS_EVAL_DB=data/evaluation/evolocus_eval.sqlite3 \
streamlit run dashboards/app.py
```

Local Parquet evaluator:

```bash
EVOLOCUS_MODE=local \
EVOLOCUS_DATA_GLOB='data/raw/locus-v1/<revision>/**/*.parquet' \
EVOLOCUS_DATASET_REVISION='<revision>' \
EVOLOCUS_EVAL_DB=data/evaluation/evolocus_eval.sqlite3 \
streamlit run dashboards/app.py
```

Audit:

```bash
PYTHONPATH=src python -m evolocus.cli audit-locus \
  --input 'data/raw/locus-v1/<revision>/**/*.parquet' \
  --dataset-revision '<revision>' \
  --output data/processed/locus-v1/<revision>/audit
```

Evaluation store:

```bash
PYTHONPATH=src python -m evolocus.cli init-evaluation \
  --db data/evaluation/evolocus_eval.sqlite3
```

Seed queue:

```bash
PYTHONPATH=src python -m evolocus.cli seed-evaluation \
  --input 'data/raw/locus-v1/<revision>/**/*.parquet' \
  --db data/evaluation/evolocus_eval.sqlite3 \
  --queue baseline-v1 \
  --strategy balanced_labels \
  --size 500 \
  --seed 20260621 \
  --dataset-revision '<revision>'
```

Default content-free export:

```bash
PYTHONPATH=src python -m evolocus.cli export-evaluation \
  --db data/evaluation/evolocus_eval.sqlite3 \
  --queue baseline-v1 \
  --output data/exports/baseline-v1 \
  --without-content
```

## Design Guarantees

- Raw fields are preserved unchanged.
- Derived values live in separate columns.
- Generic jurisdiction/name fields are not required.
- `source_jurisdiction_type`, `city`, and `county` derive jurisdiction identity.
- No FIPS/county assignment is fabricated.
- Null topic values are evaluated in context of `is_substantive`.
- Unexpected labels are reported as audit findings.
- Score direction is unverified and displayed only as neutral relative model scores.
- No regulatory-burden score is computed during this milestone.
- SQLite stores bounded queue snapshots and review history, not the full corpus.
- GitHub Pages does not host the evaluator or real LOCUS rows.

## Deferred Analytics

The following are future work only:

- semantic search;
- RAG;
- embeddings;
- Census and FIPS enrichment;
- geospatial maps;
- FastAPI;
- Postgres;
- Superset;
- scrapers;
- model fine-tuning.

Each deferred module should include its own human-evaluation or provenance checks before publication.

