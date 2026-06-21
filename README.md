# EvoLOCUS

EvoLOCUS is an open-source, local-first platform for reviewing and enriching the LOCUS Local Ordinance Corpus and future public-source local law data.

## Current Status

- Phase: 1 in progress
- Primary user surface: GitHub Pages browser workbench from `site/`
- Evaluator MVP: complete for synthetic browser demo validation
- Real LOCUS local shard download: complete in ignored `data/raw/`
- Real LOCUS aggregate visual publish: complete for top 1,000 state-clustered jurisdiction units
- Real LOCUS full audit: complete for 2,211,516 rows with aggregate-only status published
- Real LOCUS per-unit audit quality: complete for the published top-1,000 map-unit scope
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
- official Census TIGERweb county choropleth for matched aggregate county units;
- official Census TIGERweb municipal/town point layer for matched aggregate municipal units;
- geography color modes for neutral tier, dominant topic, dominant function, model-substantive share, and law-count intensity;
- map filters for state, topic, function, tier, and minimum law count;
- filtered-view insight cards and inquiry answers over the current aggregate map selection;
- filtered-vs-full comparison panels for topic, tier, function, jurisdiction kind, and neutral score means;
- state/topic small-multiple charts in the Charts tab from the same aggregate map layer;
- county/town aggregate coverage atlas by state, unit type, and neutral tier;
- analysis status and publication-gate provenance from published static JSON artifacts;
- full LOCUS audit status with aggregate schema, label, OCR-risk, duplicate-content, and manifest checks;
- per-unit audit review signals for the published map layer, including OCR-risk and duplicate-text-hash rates;
- audit-driven map filters and an audit-attention geography color mode, framed as review priority rather than ranking;
- Audit Lens tab with attention distribution, OCR reason mix, state atlas, and review-priority queue preview;
- Queue Plan tab for aggregate county/town review batch planning, with content-free unit-level JSON export;
- ontology view for topics, functions, tiers, model outputs, and jurisdiction units;
- selected-unit ontology neighborhood visual for topic, function, tier, scores, and geometry provenance;
- selected-unit peer comparison visuals for similar published county/town aggregate units;
- Score Lens tab with filter-aware neutral model-score distributions, state matrix, and high-contrast unit profiles;
- static progressive inquiry briefings over current aggregate analysis artifacts;
- Inquiry question matrix with filter-aware prompts for map, topic, function, audit, score, and selected-unit questions;
- selected county/town inquiry drilldowns from the map into aggregate-only Q&A;
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
- `publish-analysis` for generating Pages-ready status, map, ontology, model, and deterministic inquiry JSON.
- `publish-inquiry-briefings` for generating static progressive inquiry briefings, optionally enriched by Grok in offline jobs only.
- `publish-unit-audit-quality` for generating aggregate per-unit audit-quality JSON from local Parquet and the reviewed public map-unit scope.
- `validate-public-artifacts` for blocking Pages deployment when static analysis JSON contains raw text, source locators, local paths, databases, or secret-shaped values.
- Browser Queue Plan export for unit-level planning metadata only; it is not a LOCUS text queue and does not create local review records.

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

The current public `site/data/analysis/` artifacts are aggregate-only LOCUS outputs generated from local Parquet with Polars. The map includes approximate state-clustered county/town units, a generalized Census TIGERweb county choropleth for matched aggregate county units, and Census TIGERweb municipal/town internal points for matched aggregate municipal units. Geography matches are machine-generated and pending review. The artifacts include no ordinance text, no raw LOCUS rows, no local evaluation database, and no exported review history. Regenerate into `data/exports/analysis-preview` first, inspect the JSON for text/secrets, then copy only the reviewed aggregate artifacts into `site/data/analysis/`.

Validate the public artifact boundary:

```bash
PYTHONPATH=src python -m evolocus.cli validate-public-artifacts \
  --analysis-dir site/data/analysis
```

Refresh the official county geometry artifact after updating `map_layers.json`:

```bash
PYTHONPATH=src python -m evolocus.cli publish-county-geometry \
  --map-layers site/data/analysis/map_layers.json \
  --output site/data/analysis/county_geometry.json

PYTHONPATH=src python -m evolocus.cli publish-municipal-points \
  --map-layers site/data/analysis/map_layers.json \
  --output site/data/analysis/municipal_points.json
```

Refresh per-unit audit quality after `map_layers.json` changes:

```bash
PYTHONPATH=src python -m evolocus.cli publish-unit-audit-quality \
  --input 'data/raw/locus-v1/<revision>/**/*.parquet' \
  --map-layers site/data/analysis/map_layers.json \
  --output site/data/analysis/unit_audit_quality.json \
  --dataset-revision '<revision>'
```

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

The `GROK_API_KEY` repository secret is configured for GitHub Actions offline jobs. The key must never be embedded into `site/assets/app.js` or any other browser JavaScript. GitHub Pages can show static Grok-generated artifacts after an offline workflow produces them, but it cannot safely call Grok directly with a private key.

Run the manual `Refresh static analysis artifacts` workflow to regenerate static inquiry briefings with the secret. The workflow validates `site/data/analysis/` with `validate-public-artifacts` before deploying Pages.

## Hugging Face Download One-Liner

Do not run this unless you are intentionally performing local ingestion and keeping outputs in ignored data paths:

```python
from datasets import load_dataset
dataset = load_dataset("LocalLaws/LOCUS-v1")
```
