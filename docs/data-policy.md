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
- Public map, chart, inquiry, and ontology artifacts may be synthetic or reviewed aggregate-only outputs.
- Aggregate-only public artifacts may include jurisdiction-unit names, counts, neutral tiers, topic/function aggregates, and model-score summaries, but must omit ordinance text, raw LOCUS rows, local SQLite state, local exports, credentials, and private machine paths.
- Static progressive inquiry briefings must be derived from aggregate artifacts and must not introduce unsupported legal conclusions, rankings, or raw record excerpts.
- Grok API keys belong only in GitHub Actions secrets or local environment variables, never in browser JavaScript.
- Public static analysis artifacts must pass `validate-public-artifacts` before deployment; the guard rejects raw text fields, source locators, local data paths, database/export references, API bearer strings, and secret-shaped tokens.
- Browser review-package requests are aggregate-only handoff files. Local materialized packages must write outside `site/`, stay ignored, and require explicit `--include-content` before including ordinance text.
- Browser import-status metadata may describe a local package after upload, but it remains in localStorage and must not be written to `site/` or treated as a public artifact.
- Browser current-view exports are aggregate snapshots only and must exclude ordinance text, raw rows, record locators, localStorage review events, databases, exports, and secrets.
- Browser snapshot galleries may persist aggregate current-view snapshots in localStorage, but must not mix in review-event history, imported queue text, source locators, local database paths, or secrets.

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
