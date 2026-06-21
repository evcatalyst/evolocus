# Evaluation Workbench

Run the local demo evaluator:

```bash
EVOLOCUS_MODE=demo \
EVOLOCUS_EVAL_DB=data/evaluation/evolocus_eval.sqlite3 \
streamlit run dashboards/app.py
```

Run against local Parquet:

```bash
EVOLOCUS_MODE=local \
EVOLOCUS_DATA_GLOB='data/raw/locus-v1/<revision>/**/*.parquet' \
EVOLOCUS_DATASET_REVISION='<revision>' \
EVOLOCUS_EVAL_DB=data/evaluation/evolocus_eval.sqlite3 \
streamlit run dashboards/app.py
```

Environment variables:

- `EVOLOCUS_MODE=demo|local`
- `EVOLOCUS_DATA_GLOB=<parquet path or glob>`
- `EVOLOCUS_EVAL_DB=data/evaluation/evolocus_eval.sqlite3`
- `EVOLOCUS_REVIEWER=<local reviewer id>`
- `EVOLOCUS_QUEUE=<queue name>`
- `EVOLOCUS_BLIND_REVIEW=1`
- `EVOLOCUS_DATASET_REVISION=<revision label>`

Pages:

- Review Queue: blinded review, save, skip, flag, history, progress.
- Dataset Explorer: bounded filters, pagination, projected fields only.
- Evaluation Results: coverage and agreement metrics from saved reviews.
- Protocol and Provenance: dataset citation, queue metadata, protocol, limitations.

Default exports omit ordinance text:

```bash
PYTHONPATH=src python -m evolocus.cli export-evaluation \
  --db data/evaluation/evolocus_eval.sqlite3 \
  --queue baseline-v1 \
  --output data/exports/baseline-v1 \
  --without-content
```

Do not write exports into `site/`. GitHub Pages is static documentation and preview only.
