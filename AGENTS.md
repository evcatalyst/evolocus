# EvoLOCUS Agent Instructions

EvoLOCUS is a local-first civic law data platform. Treat provenance, licensing, uncertainty, and source traceability as core product behavior.

## Non-Negotiable Rules

- Do not download, transform, cache, or commit LOCUS-v1 records unless a user explicitly requests an ingestion phase.
- Do not invent civic claims, agencies, dollar amounts, misconduct, people, contracts, legal conclusions, or findings.
- Use unmistakably labeled synthetic data for placeholders, demos, screenshots, tests, and static site previews.
- Never present synthetic coverage, scores, maps, or queue items as real civic facts.
- Preserve uncertainty. Unknown, unsupported, disputed, rejected, or missing-source records must remain visibly unverified.
- Never show a claim as verified unless it links to source-backed evidence.
- Do not publish credentials, tokens, cookies, `.env` files, machine-specific paths, private notebooks, downloaded Parquet, SQLite databases, embeddings, or scraper caches.

## Development Expectations

- Keep data contracts explicit and typed.
- Prefer validation failures over silent filtering.
- Add tests before changing provenance, publication, or ingestion behavior.
- Respect robots.txt, terms of service, rate limits, and public-source boundaries before any scrape.
- Keep GitHub Pages static and dependency-light; the interactive Streamlit app is a separate runtime.
- For the evaluator MVP, Polars is the primary corpus engine and SQLite stores mutable review state.
- Do not add DuckDB, embeddings, RAG, Census enrichment, or public real-data maps to the required evaluator path.
- Human evaluation must be blinded by default.
- Evaluation queues must pin dataset revisions, manifest fingerprints, sampling parameters, and random seeds.
- Full corpus materialization is prohibited in request paths.
- Model-produced scores are not legal facts; score direction requires authoritative verification before directional language.
- Keep real data, SQLite evaluation databases, and exports in ignored local directories.

## LOCUS Citation

Use this citation for relevant project files:

Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport. "Freeing the Law with LOCUS: A Local Ordinance Corpus for the United States." arXiv:2606.19334, 2026. Dataset: https://huggingface.co/datasets/LocalLaws/LOCUS-v1
