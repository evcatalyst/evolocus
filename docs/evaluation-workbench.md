# Evaluation Workbench

The primary workbench runs on GitHub Pages:

https://evcatalyst.github.io/evolocus/

It is a static browser app. It does not require Streamlit, a Python server, a hosted database, trackers, external fonts, or CDN dependencies.

## Pages Features

- synthetic demo queue;
- blinded review by default;
- model-output reveal logging;
- save, save-next, skip, and flag actions;
- review event history;
- bounded imported queue JSON;
- explorer filters and pagination;
- evaluation metrics from saved reviews;
- latest-review CSV export without ordinance content;
- review-event JSON export.

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
