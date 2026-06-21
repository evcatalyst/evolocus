"""Human evaluation protocol constants."""

from __future__ import annotations

PROTOCOL_VERSION = "evolocus-eval-v1"

DISPOSITIONS = [
    "accept_as_presented",
    "correction_needed",
    "exclude_from_evaluation",
    "needs_adjudication",
    "skip",
]

SUBSTANTIVITY_LABELS = ["substantive", "not_substantive", "uncertain", "not_scorable"]
FUNCTION_LABELS = ["Context", "Rules", "Process", "Enforcement", "Other_or_unexpected", "Uncertain", "Not_scorable"]
TOPIC_LABELS = ["Buildings", "Business", "Nuisance", "Zoning", "Other", "Not_applicable", "Uncertain", "Not_scorable"]
OCR_QUALITY_LABELS = ["good", "minor_errors", "major_errors", "unreadable", "not_scorable"]
JURISDICTION_METADATA_LABELS = [
    "appears_correct",
    "appears_incorrect",
    "insufficient_information",
    "not_reviewed",
]
SCORE_REVIEW_LABELS = [
    "far_too_low",
    "somewhat_too_low",
    "plausible",
    "somewhat_too_high",
    "far_too_high",
    "not_scorable",
    "not_reviewed",
]
SCORE_FIELDS = ["enforcement_discretion", "opacity", "paternalism", "problem_salience"]


def protocol_definition() -> dict[str, object]:
    return {
        "protocol_version": PROTOCOL_VERSION,
        "unit_of_evaluation": "one LOCUS-v1 ordinance chunk",
        "blind_review_default": True,
        "dispositions": DISPOSITIONS,
        "substantivity_labels": SUBSTANTIVITY_LABELS,
        "function_labels": FUNCTION_LABELS,
        "topic_labels": TOPIC_LABELS,
        "ocr_quality_labels": OCR_QUALITY_LABELS,
        "jurisdiction_metadata_labels": JURISDICTION_METADATA_LABELS,
        "score_review_labels": SCORE_REVIEW_LABELS,
        "score_direction_state": "unverified; display as neutral relative model scores",
        "license": "CC-BY-NC-4.0",
        "disclaimer": "Research use only; not legal advice; consult official current legal sources.",
    }
