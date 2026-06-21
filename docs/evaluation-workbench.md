# Evaluation Workbench

The primary workbench runs on GitHub Pages:

https://evcatalyst.github.io/evolocus/

It is a static browser app. It does not require Streamlit, a Python server, a hosted database, trackers, external fonts, or CDN dependencies.

## Pages Features

- synthetic demo queue;
- law map with state-clustered county/town-style units colored by neutral tier;
- official Census TIGERweb county choropleth for matched aggregate county units;
- official Census TIGERweb municipal/town point layer for matched aggregate municipal units;
- geography color modes for neutral tier, dominant topic, dominant function, audit attention, and law-count intensity;
- map filters for state, topic, function, tier, minimum law count, and aggregate audit review signals;
- filtered-view aggregate insight cards and inquiry answers;
- filtered-vs-full aggregate comparison panels;
- official geography color modes for neutral tier, dominant topic, dominant function, model-substantive share, and law-count intensity;
- state/topic small-multiple charts in the Charts tab;
- county/town aggregate coverage atlas by state, source-unit type, and neutral tier;
- analysis status tab with artifact freshness, publication gates, geometry status, and Grok secret boundary;
- full LOCUS audit status with aggregate schema, label, OCR-risk, duplicate-content, and manifest checks;
- per-unit audit review signals for the published map units, including medium/high OCR risk and duplicate-text-hash rates;
- Audit Lens tab with attention distribution, OCR heuristic reason mix, state audit atlas, and review-priority queue preview;
- Queue Plan tab for aggregate county/town review batch planning from current filters, audit signals, law counts, and neutral score spread;
- ontology and model-output registry views;
- selected-unit ontology neighborhood visual for aggregate topic/function/tier/score/geography links;
- selected-unit peer comparison visuals for similar published county/town aggregate units;
- Score Lens tab with released model-score distributions, state matrix, and high-contrast unit profiles;
- static progressive inquiry briefings over published aggregate artifacts;
- Inquiry question matrix for filter-aware map, topic, function, audit, score, and selected-unit prompts;
- selected county/town inquiry drilldowns from the map into aggregate-only Q&A;
- aggregate chart panels and publication gates;
- progressive disclosure from overview to unit detail to evidence trail;
- blinded review by default;
- model-output reveal logging;
- save, save-next, skip, and flag actions;
- review event history;
- bounded imported queue JSON;
- explorer filters and pagination;
- evaluation metrics from saved reviews;
- latest-review CSV export without ordinance content;
- review-event JSON export.
- aggregate-only LOCUS public artifacts generated from local Parquet with Polars.

## Browser Storage

Review events are stored in browser localStorage under EvoLOCUS-specific keys. They remain on the reviewer machine unless the reviewer exports them.

Clearing browser storage removes local unsaved work. Export review events regularly during real evaluation.

## Queue Import

The browser can import a bounded queue JSON file with a top-level `records` array or a plain array of record objects. Imports are capped at 500 records to avoid turning the browser into a full corpus store.

Imported records should include:

- `record_id`
- `source_locator`
- `dataset_revision`
- `header`
- `content`
- `state`
- `city`
- `county`
- `source_jurisdiction_type`
- `function`
- `topic`
- model score fields

The site does not parse full LOCUS Parquet shards in the browser.

## Static Analysis Refresh

Generate synthetic public artifacts:

```bash
PYTHONPATH=src python -m evolocus.cli publish-analysis \
  --output site/data/analysis \
  --dataset-revision synthetic-demo \
  --include-record-samples
```

Generate real aggregate artifacts into ignored storage first:

```bash
PYTHONPATH=src python -m evolocus.cli publish-analysis \
  --input 'data/raw/locus-v1/<revision>/**/*.parquet' \
  --dataset-revision '<revision>' \
  --output data/exports/analysis-preview
```

Only copy reviewed, license-compliant, non-text aggregate artifacts into `site/data/analysis/`. The current public artifacts are real LOCUS aggregates for a capped top-1,000 jurisdiction-unit layer with approximate state-clustered positions, an official Census TIGERweb county choropleth for matched aggregate county units, and official Census TIGERweb municipal/town points for matched aggregate municipal units. Geography matches are machine-generated and pending review; they omit raw rows, ordinance text, local SQLite state, and local exports.

Refresh county geometry after `map_layers.json` changes:

```bash
PYTHONPATH=src python -m evolocus.cli publish-county-geometry \
  --map-layers site/data/analysis/map_layers.json \
  --output site/data/analysis/county_geometry.json

PYTHONPATH=src python -m evolocus.cli publish-municipal-points \
  --map-layers site/data/analysis/map_layers.json \
  --output site/data/analysis/municipal_points.json
```

Refresh unit audit quality after `map_layers.json` changes:

```bash
PYTHONPATH=src python -m evolocus.cli publish-unit-audit-quality \
  --input 'data/raw/locus-v1/<revision>/**/*.parquet' \
  --map-layers site/data/analysis/map_layers.json \
  --output site/data/analysis/unit_audit_quality.json \
  --dataset-revision '<revision>'
```

The audit-attention color mode is a review-priority signal from aggregate OCR and duplicate-text-hash rates. It is not a legal ranking and is not proof of an OCR defect.

The Audit Lens reads the same aggregate artifact and current map filters. It never renders ordinance text, headers, source locators, or full-row records.

The Score Lens reads aggregate `map_layers.json` score means and current map filters. It describes values as neutral relative model scores because score direction has not been authoritatively verified in this milestone.

The Queue Plan tab exports aggregate unit planning metadata only. It is useful for deciding which county/town units to package next in local ignored tooling, but it is not itself a record-level review queue and contains no LOCUS ordinance text, headers, source locators, SQLite state, or raw rows.

The Inquiry question matrix reads current browser filter state and static aggregate artifacts. It is deterministic browser logic unless a future offline workflow publishes refreshed briefing JSON.

Refresh static progressive inquiry briefings from the current aggregate artifacts:

```bash
PYTHONPATH=src python -m evolocus.cli publish-inquiry-briefings \
  --analysis-dir site/data/analysis \
  --output site/data/analysis/inquiry_briefings.json
```

Offline jobs may add `--use-grok` when `GROK_API_KEY` is available. The output must remain aggregate-only and must not include ordinance text, headers, source locators, local paths, or secrets.

## Support CLI

Python CLI commands may prepare audits, local SQLite queues, or export packages, but they are support tooling, not the user interface.

Default CLI exports omit ordinance text:

```bash
PYTHONPATH=src python -m evolocus.cli export-evaluation \
  --db data/evaluation/evolocus_eval.sqlite3 \
  --queue baseline-v1 \
  --output data/exports/baseline-v1 \
  --without-content
```

Do not write generated exports into `site/`.
