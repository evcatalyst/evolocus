# Data Policy

EvoLOCUS treats provenance, uncertainty, licensing, and publication boundaries as product requirements.

## Phase 0 Guarantees

- No LOCUS-v1 records are downloaded.
- No scrapers are run.
- No database is created.
- No embeddings are created.
- No real ordinance excerpts are committed.
- Static site visuals are synthetic and labeled as synthetic.

## Evaluator Data Policy

- Real LOCUS Parquet must stay in `data/raw/`, which is ignored by git.
- Derived audit artifacts must stay in `data/processed/`, which is ignored by git.
- SQLite review stores must stay in `data/evaluation/`, which is ignored by git.
- Evaluation exports must stay in `data/exports/`, which is ignored by git.
- Default exports omit full ordinance content and include source locators for authorized local joins.
- GitHub Pages is the primary user surface and must not publish real LOCUS rows, generated local databases, or real evaluation exports.
- Browser review events stay in localStorage until the reviewer explicitly exports them.

## Future Real Data Rules

- Store downloaded data only in ignored local directories unless a user explicitly approves publication.
- Keep source URLs, retrieval timestamps, licenses, and transformation steps with derived records.
- Do not publish claim-like summaries without evidence trails.
- Render missing provenance as `Needs review`.
- Respect robots.txt, public-source terms, rate limits, and user-configurable concurrency.

## Synthetic Fixture Names

Use names such as:

- Sample Valley School District
- Example Township
- Synthetic Vendor LLC
- Demo Capital Project Fund

Synthetic examples must never be mixed with real source-backed records without explicit labeling.
