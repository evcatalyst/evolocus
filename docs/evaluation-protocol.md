# EvoLOCUS Evaluation Protocol

Protocol version: `evolocus-eval-v1`

## Unit of Evaluation

One LOCUS-v1 ordinance chunk, identified by `record_id` and `source_locator`.

## Blinding

Blind review is enabled by default. Before initial submission, the UI hides model `is_substantive`, `function`, `topic`, and the four model score fields unless the reviewer explicitly reveals them. Reveal-before-submit is recorded.

## Labels

Overall disposition:

- `accept_as_presented`
- `correction_needed`
- `exclude_from_evaluation`
- `needs_adjudication`
- `skip`

Substantivity:

- `substantive`
- `not_substantive`
- `uncertain`
- `not_scorable`

Function:

- `Context`
- `Rules`
- `Process`
- `Enforcement`
- `Other_or_unexpected`
- `Uncertain`
- `Not_scorable`

Topic:

- `Buildings`
- `Business`
- `Nuisance`
- `Zoning`
- `Other`
- `Not_applicable`
- `Uncertain`
- `Not_scorable`

Topic should normally be `Not_applicable` when the human substantivity label is non-substantive. The system warns but does not silently force a value.

OCR quality:

- `good`
- `minor_errors`
- `major_errors`
- `unreadable`
- `not_scorable`

Jurisdiction metadata quality:

- `appears_correct`
- `appears_incorrect`
- `insufficient_information`
- `not_reviewed`

Score review labels for `enforcement_discretion`, `opacity`, `paternalism`, and `problem_salience`:

- `far_too_low`
- `somewhat_too_low`
- `plausible`
- `somewhat_too_high`
- `far_too_high`
- `not_scorable`
- `not_reviewed`

Low/high are numeric relative-score judgments only. Score direction is unverified and must not be interpreted as a legal conclusion.

## Revisions and Adjudication

Review events are append-only. Corrections append a new event linked to the previous event where applicable. Adjudication is represented by disposition and can be resolved in a later protocol.

## Sampling

Queues record strategy, parameters, random seed, dataset revision, manifest fingerprint, protocol version, creator, and item count. Supported strategies are random, balanced labels, geographic, quality audit, and score stratified.

## Reporting

Metrics disclose denominators. Uncertain and not-scorable labels are excluded from accuracy/precision/recall/F1 denominators and reported separately. Inter-reviewer agreement is not calculated unless overlapping independent reviews exist.

## Limitations

LOCUS is a county-harmonized access layer, not a determination of controlling legal authority. OCR errors may exist. Model-produced labels and scores are not adjudicated facts. Users must consult official and current legal sources. LOCUS-v1 is CC-BY-NC-4.0.
