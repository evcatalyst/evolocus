# EvoLOCUS

EvoLOCUS is an open-source, local-first platform for reviewing and enriching the LOCUS Local Ordinance Corpus and future public-source local law data.

## Current Status

- Phase: 1 in progress
- Primary user surface: GitHub Pages browser workbench from `site/`
- Evaluator MVP: complete for synthetic browser demo validation
- Real LOCUS local shard download: complete in ignored `data/raw/`
- Real LOCUS aggregate visual publish: complete for top 1,000 state-clustered jurisdiction units
- Real LOCUS evaluation: not started
- Data state: no real LOCUS rows or ordinance text committed or published
- Completion method: phase checklist, not weighted overall percentage

The public site is the only supported user-facing surface for this milestone. It runs as a static browser app on GitHub Pages, stores review state in browser localStorage, and exports files only when the user explicitly clicks export.

## LOCUS Source and Citation

Primary dataset: https://huggingface.co/datasets/LocalLaws/LOCUS-v1

Citation:

> Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport. "Freeing the Law with LOCUS: A Local Ordinance Corpus for the United States." arXiv:2606.19334, 2026.

The LOCUS-v1 Hugging Face dataset card identifies the dataset as Parquet and CC-BY-NC-4.0. EvoLOCUS records the citation for reproducibility but does not redistribute LOCUS records through GitHub Pages.

## Browser Workbench

The Pages app supports:

- state-clustered county/town law map units colored by neutral tier;
- map filters for state, topic, function, tier, and minimum law count;
- filtered-view insight cards and inquiry answers over the current aggregate map selection;
- filtered-vs-full comparison panels for topic, tier, function, jurisdiction kind, and neutral score means;
- analysis status from published static JSON artifacts;
- ontology view for topics, functions, tiers, model outputs, and jurisdiction units;
- static inquiry over current analysis artifacts;
- aggregate charts for tier, topic, function, jurisdiction kind, score means, and top units;
- progressive disclosure from overview to unit detail to evidence trail;
- synthetic demo queue;
- blinded review by default;
- explicit model-output reveal with reveal events logged;
- substantivity, function, topic, OCR, jurisdiction, and score review fields;
- save, save-next, skip, and flag actions;
- append-only browser-local review events;
- bounded JSON queue import for local review packages;
- paginated explorer filters;
- review metrics and agreement denominators;
- content-free latest-review CSV export;
- review-event JSON export.

Open the deployed app:

https://evcatalyst.github.io/evolocus/

The site is research use only and not legal advice. LOCUS text may contain OCR errors, labels and scores are model-produced, the corpus is not complete or continuously current law, and users must consult official current legal sources.

## Architecture

Primary UI stack:

- GitHub Pages static HTML/CSS/JavaScript.
- Browser localStorage for mutable review events.
- Browser File API for bounded queue import.
- Browser-generated CSV/JSON exports.
- Static analysis artifacts in `site/data/analysis/`.

Support tooling:

- Polars lazy frames over Parquet for corpus reads and bounded transforms.
- SQLite through Python `sqlite3` for local support workflows.
- CLI commands for audit, queue seeding, and export package creation.
- `publish-analysis` for generating Pages-ready status, map, ontology, model, and inquiry JSON.

Deferred optional tools: DuckDB for ad hoc SQL, LanceDB for semantic retrieval, Postgres for multi-user writes, and geospatial/Census enrichment after the browser evaluator path is stable.

## Local Development

```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest
node --check site/assets/app.js
```

Serve the Pages app locally with any static server, for example:

```bash
python -m http.server 8000 --directory site
```

Refresh synthetic static analysis artifacts:

```bash
PYTHONPATH=src python -m evolocus.cli publish-analysis \
  --output site/data/analysis \
  --dataset-revision synthetic-demo \
  --include-record-samples
```

## Support CLI

The CLI is for preparing and validating local artifacts. It is not the primary UI.

Status:

```bash
PYTHONPATH=src python -m evolocus.cli status
```

Publish Pages-ready analysis artifacts:

```bash
PYTHONPATH=src python -m evolocus.cli publish-analysis \
  --input 'data/raw/locus-v1/<revision>/**/*.parquet' \
  --dataset-revision '<revision>' \
  --output data/exports/analysis-preview
```

The current public `site/data/analysis/` artifacts are aggregate-only LOCUS outputs generated from local Parquet with Polars. The map uses approximate state-clustered positions until reviewed county/town geometries are added. The artifacts include no ordinance text, no raw LOCUS rows, no local evaluation database, and no exported review history. Regenerate into `data/exports/analysis-preview` first, inspect the JSON for text/secrets, then copy only the reviewed aggregate artifacts into `site/data/analysis/`.

Audit demo or local Parquet:

```bash
PYTHONPATH=src python -m evolocus.cli audit-locus \
  --output data/processed/locus-v1/demo/audit
```

Initialize and seed a local evaluation queue:

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

Blocked-by-default Hugging Face entrypoint:

```bash
PYTHONPATH=src python -m evolocus.cli ingest-locus
```

Ignored storage locations:

- `data/raw/`: local LOCUS Parquet
- `data/processed/`: audit outputs and derived local artifacts
- `data/evaluation/`: SQLite review state
- `data/exports/`: local evaluation exports

## Data Policy

- Real LOCUS data belongs in ignored local paths such as `data/raw/` and `data/processed/`.
- GitHub Pages may publish reviewed aggregate-only analysis artifacts, but must not publish real LOCUS rows, ordinance text, local databases, local exports, or secrets.
- Review-queue examples remain synthetic unless a user imports a bounded queue locally in the browser.
- Browser exports are user-triggered downloads.
- Future public exports require explicit source, license, and provenance checks.

## Grok Secret

Use the repository secret name `GROK_API_KEY` for future offline analysis jobs. Add it in GitHub under repository settings, or with:

```bash
gh secret set GROK_API_KEY --repo evcatalyst/evolocus
```

The key must never be embedded into `site/assets/app.js` or any other browser-delivered file. GitHub Pages can show static Grok-generated artifacts after an offline workflow produces them, but it cannot safely call Grok directly with a private key.

## Hugging Face Download One-Liner

Do not run this unless you are intentionally performing local ingestion and keeping outputs in ignored data paths:

```python
from datasets import load_dataset
dataset = load_dataset("LocalLaws/LOCUS-v1")
```
