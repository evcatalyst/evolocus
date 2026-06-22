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
- Real LOCUS local package smoke: complete for 24 records across 12 public aggregate units, stored only in ignored `data/exports/`
- Browser synthetic package demo: complete for one-click package-to-map overlay on published aggregate units
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
- guided Walkthrough tab for the public map -> inquiry -> ontology -> queue plan -> package overlay -> snapshots demo flow;
- compact analysis journey strip connecting Map -> Inquiry -> Ontology -> Queue Plan with aggregate-only status;
- first-screen Ask -> Map -> Ontology visual path with current aggregate denominators and progressive disclosure controls;
- one-click front-door example questions that apply aggregate topic/tier filters before opening Inquiry, Map, or Ontology;
- first-screen offline analysis freshness card for briefing/question-pack age, mode, validation, and Actions-only refresh;
- official Census TIGERweb county choropleth for matched aggregate county units;
- official Census TIGERweb municipal/town point layer for matched aggregate municipal units;
- official geography layer toggles for county polygons, town points, and progressive aggregate ontology links;
- progressive official-geography layer legend with selected-unit ontology peer-link explanations;
- geography color modes for neutral tier, dominant topic, dominant function, model-substantive share, and law-count intensity;
- map filters for state, topic, function, tier, and minimum law count;
- filtered-view insight cards and inquiry answers over the current aggregate map selection;
- filtered-vs-full comparison panels for topic, tier, function, jurisdiction kind, and neutral score means;
- state/topic small-multiple charts in the Charts tab from the same aggregate map layer;
- chart-to-map drilldowns from aggregate tier, topic, function, jurisdiction kind, state/topic, and top-unit chart rows;
- chart-to-inquiry Ask actions that turn aggregate chart rows into saved deterministic Inquiry answers;
- chart-to-ontology Graph actions that open the aggregate ontology with chart-scoped filters and selected units;
- animated Charts route legend for Chart -> Map -> Inquiry -> Ontology progressive disclosure;
- county/town aggregate coverage atlas by state, unit type, and neutral tier;
- analysis status and publication-gate provenance from published static JSON artifacts;
- map and inquiry artifact freshness badges with aggregate layer, briefing, question-pack, dataset revision, snapshot deltas, and no-row-text boundary;
- Law Map last-refresh source detail showing tracked Polars artifact source, analysis commit, briefing source, deploy guard, and publication boundary;
- latest-artifact refresh panel and timestamp timeline showing current aggregate metadata contributions without row text or law-change claims;
- artifact lineage visual showing which aggregate JSON files power the map, inquiry, ontology, charts, audit lens, queue plan, and snapshot surfaces;
- stored aggregate artifact snapshot baseline for current-vs-prior metadata deltas in the Analysis Status tab;
- full LOCUS audit status with aggregate schema, label, OCR-risk, duplicate-content, and manifest checks;
- per-unit audit review signals for the published map layer, including OCR-risk and duplicate-text-hash rates;
- audit-driven map filters and an audit-attention geography color mode, framed as review priority rather than ranking;
- Audit Lens tab with attention distribution, OCR reason mix, state atlas, and review-priority queue preview;
- Queue Plan tab for aggregate county/town review batch planning, with content-free unit-level JSON export;
- Queue Plan review-package request export for local ignored materialization from authorized Parquet;
- Queue Plan package-request preview with record budget, unit mix, and safety gates before download;
- browser-local import-status panel after bounded package upload, including provenance, text-inclusion state, unit counts, and safety flags;
- one-click synthetic browser package demo anchored to published aggregate units, with placeholder records clearly marked as non-LOCUS text;
- browser-local package-to-map overlay that highlights imported review-package units on the aggregate law map and official geography layer;
- one-click imported-package-units map filter for narrowing real aggregate visuals to locally reviewed units;
- Results-tab package coverage visuals after bounded package upload, including state/topic/function/type/OCR mix and review progress;
- ontology view for topics, functions, tiers, model outputs, and jurisdiction units;
- ontology build-status panel for graph freshness, node/edge mix, model registry provenance, and aggregate-only boundaries;
- map-driven ontology query presets that route current aggregate map context into bounded Inquiry answers;
- ontology-to-map visual presets that preview county/town color routes for tiers, topics, functions, audit signals, law-count intensity, and score bands before opening the map;
- package-to-ontology bridge that connects browser-local package counts to topic, function, tier, and matched map-unit nodes without exposing row text;
- selected-unit ontology neighborhood visual for topic, function, tier, scores, and geometry provenance;
- selected-unit mini ontology path animation over aggregate topic/function/tier/score/geometry steps;
- map-to-ontology animation controls for focusing selected-unit path stages with disclosure-gated score and geometry steps;
- map-side law-location tier guide with active filters, county/town counts, neutral tier mix, and publication boundary;
- map-side topic/tier co-occurrence mini matrix with aggregate-unit counts, row bars, and filter drillback;
- matrix-linked Inquiry prompts that open deterministic aggregate answers for selected topic/tier cells;
- tier-to-ontology clickthrough from the map guide into a focused neutral-tier context card;
- tier-focus mini charts for topic mix, function mix, unit type mix, and neutral score means;
- tier-focus mini-chart drilldowns that apply map filters for topic, function, and unit type;
- neutral score-band drilldowns from tier mini charts into relative model-score map filters;
- map-side chat-style inquiry panel for current filters, selected unit, audit signals, score profile, and browser-local package overlay;
- browser-local aggregate inquiry results log for preset/manual questions, with content-free JSON export and explicit no-text/no-locator policy flags;
- visual replay controls for saved aggregate inquiry log entries that restore safe filters, disclosure depth, and selected aggregate unit context;
- question-to-map replay paths that visualize saved aggregate questions as prompt -> filters -> colored map -> ontology routes;
- map-side route playback cards that restore saved aggregate question paths directly from the Law Map;
- replay timeline sparklines for saved aggregate inquiry answers, scaled by visible law rows and units without row-level data;
- browser-local map inquiry history snapshots for saved aggregate answers, filters, selected units, and comparison rows;
- browser-local map inquiry history JSON export with aggregate-only policy metadata;
- inquiry-driven county/town comparison strip with prompt-aware aggregate unit rows and map drillback;
- selected-unit ontology drilldown cards for map-side topic/function/tier/score/geometry/package links;
- selected-unit progressive visual trail that switches overview, unit-detail, and evidence depth from the map panel;
- selected-unit peer comparison visuals for similar published county/town aggregate units;
- Score Lens tab with filter-aware neutral model-score distributions, state matrix, and high-contrast unit profiles;
- static progressive inquiry briefings over current aggregate analysis artifacts;
- static filter-aware question pack generated from aggregate artifacts, optionally Grok-noted offline;
- Inquiry question matrix with filter-aware prompts for map, package overlay, topic, function, audit, score, and selected-unit questions;
- inquiry-to-map question composer that previews deterministic aggregate map filters before applying them;
- click-through mini charts inside Inquiry answers for topic, function, tier, and top-unit aggregate drillbacks;
- ontology mini-map inside Inquiry answers that links the current aggregate scope to topic, function, neutral tier, top county/town unit nodes, and a county/town comparison drawer;
- Inquiry topic/tier pathway chart that turns current aggregate map filters into visual question cells with ask and map actions;
- pathway-cell mini peer comparison bars for top aggregate units, with map drillback and no row text;
- map-linked ontology chips inside topic/tier pathway cells for aggregate topic, tier, and top-unit drillback;
- package-aware inquiry answer that summarizes browser-local package coverage, map matches, workflow progress, and text/source-locator boundaries without listing record text;
- selected county/town inquiry drilldowns from the map into aggregate-only Q&A;
- aggregate charts for tier, topic, function, jurisdiction kind, score means, and top units;
- aggregate chart rows can open the Law Map with safe browser-only filters or published aggregate unit IDs;
- aggregate chart Ask buttons can open Inquiry with the same safe filters and no browser model calls;
- aggregate chart Graph buttons can open Ontology using the same filters, tier focus, and progressive disclosure boundary;
- aggregate chart route legend shows the current visual path before opening Map, Inquiry, or Ontology;
- current-view snapshot export for filtered map/inquiry context, with aggregate metadata only;
- browser-local snapshot gallery for comparing saved aggregate map/inquiry views;
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
- `publish-question-pack` for generating static filter-aware prompts that can apply safe map filters and disclosure levels from GitHub Pages.
- `publish-unit-audit-quality` for generating aggregate per-unit audit-quality JSON from local Parquet and the reviewed public map-unit scope.
- `validate-public-artifacts` for blocking Pages deployment when static analysis JSON contains raw text, source locators, local paths, databases, or secret-shaped values.
- Browser Queue Plan export for unit-level planning metadata only; it is not a LOCUS text queue and does not create local review records.
- Browser review-package request export for handing selected aggregate units to local tooling; the request stays aggregate-only.
- Browser package-request preview for inspecting unit mix, record budget, and publication safety gates before download.
- Browser import-status panel for local package provenance and review readiness after upload; this state remains in localStorage.
- Browser synthetic package demo for exercising package import, package-to-map overlay, package-only filtering, Results-tab package charts, and review workflow without loading LOCUS row text.
- Browser package inquiry answer for explaining the active local package overlay from counts, map-unit matches, workflow status, and safety flags only.
- Browser package-to-ontology bridge for showing active package topic/function/tier/unit context from local counts and aggregate map matches only.
- Browser package-to-map overlay for imported local queues; it joins local `unit_id` values to public aggregate units and highlights matches without writing records to public artifacts.
- Browser imported-package-only map filter for focusing aggregate map, inquiry, snapshot, score, and audit views on local package coverage.
- Browser selected-unit progressive trail for walking from aggregate map color to unit metrics and evidence boundaries without exposing ordinance text.
- Browser selected-unit ontology drilldown cards for opening ontology context, evidence depth, and package focus from the map panel.
- Browser package-coverage charts for imported local queues; these summarize only browser-local records and are never written to `site/data/analysis/`.
- Local package materializer verified against real LOCUS Parquet for a bounded 24-record smoke package; public Pages shows aggregate verification counts only.
- Browser current-view snapshot export for sharing filtered aggregate map/inquiry context without text, raw rows, review events, or record locators.
- Browser snapshot gallery storage in localStorage for aggregate current-view snapshots only; it does not store LOCUS text or review-event history.
- Browser package-aware snapshot comparison for saved views with local package counts, matched units, and text/source-locator exclusion state only.
- Browser walkthrough cards for the real aggregate visual path; these route across existing public tabs and do not introduce a separate data publication channel.

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

Materialize a browser-import package from a Pages Queue Plan request:

```bash
PYTHONPATH=src python -m evolocus.cli materialize-review-package \
  --request data/exports/requests/evolocus-review-package-request.json \
  --input 'data/raw/locus-v1/<revision>/**/*.parquet' \
  --output data/exports/review-packages/browser-import.json \
  --dataset-revision '<revision>' \
  --max-records 250 \
  --max-records-per-unit 3 \
  --include-content
```

Without `--include-content`, the materializer writes metadata only. With `--include-content`, the output is a local review package that may contain LOCUS text and must remain ignored and unpublished.

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

Use the repository secret name `GROK_API_KEY` for future offline analysis jobs. The refresh workflow also accepts the existing `Grok_api_key` repository secret as an alias and normalizes it to `GROK_API_KEY` inside the Action process only. Add the canonical secret in GitHub under repository settings, or with:

```bash
gh secret set GROK_API_KEY --repo evcatalyst/evolocus
```

The `GROK_API_KEY` or `Grok_api_key` repository secret is configured for GitHub Actions offline jobs. The key must never be embedded into `site/assets/app.js` or any other browser JavaScript. GitHub Pages can show static Grok-generated artifacts after an offline workflow produces them, but it cannot safely call Grok directly with a private key.

The current tracked `site/data/analysis/inquiry_briefings.json` artifact is Grok-enriched and aggregate-only. Run the manual `Refresh static analysis artifacts` workflow to regenerate static inquiry briefings with the secret. The workflow can persist validated updates to `inquiry_briefings.json` and `question_pack.json` back to the current branch, so the next normal Pages deploy does not revert refreshed aggregate artifacts. The GitHub Pages Analysis Status tab includes an Actions-only refresh control that opens that workflow; it does not call Grok from the browser. Both the normal Pages deploy workflow and the manual refresh workflow validate `site/data/analysis/` with `validate-public-artifacts` before deploying Pages.

## Hugging Face Download One-Liner

Do not run this unless you are intentionally performing local ingestion and keeping outputs in ignored data paths:

```python
from datasets import load_dataset
dataset = load_dataset("LocalLaws/LOCUS-v1")
```
