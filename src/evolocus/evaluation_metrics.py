"""Evaluation coverage and disagreement metrics."""

from __future__ import annotations

from collections import Counter, defaultdict
from typing import Any

from .evaluation_db import latest_reviews, queue_items, queue_progress


EXCLUDED_LABELS = {"uncertain", "not_scorable", "Uncertain", "Not_scorable"}


def evaluation_summary(db_path: str, queue_name: str, reviewer_id: str | None = None) -> dict[str, Any]:
    items = queue_items(db_path, queue_name)
    reviews = latest_reviews(db_path, queue_name)
    if reviewer_id:
        reviews = [review for review in reviews if review["reviewer_id"] == reviewer_id]
    progress = queue_progress(db_path, queue_name, reviewer_id)
    by_record = {review["record_id"]: review for review in reviews}
    reviewed_items = [item for item in items if item["record_id"] in by_record]
    return {
        "progress": progress,
        "total_review_events_latest": len(reviews),
        "coverage_by_state": _coverage(reviewed_items, "state_normalized"),
        "coverage_by_jurisdiction_type": _coverage(reviewed_items, "jurisdiction_type_normalized"),
        "coverage_by_model_function": _coverage(reviewed_items, "function"),
        "coverage_by_model_topic": _coverage(reviewed_items, "topic"),
        "ocr_quality_distribution": _review_distribution(reviews, "ocr_quality"),
        "correction_rate": _rate(reviews, lambda review: review["review"].get("disposition") == "correction_needed"),
        "exclusion_rate": _rate(reviews, lambda review: review["review"].get("disposition") == "exclude_from_evaluation"),
        "adjudication_rate": _rate(reviews, lambda review: review["review"].get("disposition") == "needs_adjudication"),
        "substantive_agreement": _binary_substantive_agreement(reviewed_items, by_record),
        "function_confusion": _confusion(reviewed_items, by_record, "function", "human_function"),
        "topic_confusion": _confusion(reviewed_items, by_record, "topic", "human_topic"),
        "score_review_distributions": {
            field: _review_distribution(reviews, f"{field}_review")
            for field in ["enforcement_discretion", "opacity", "paternalism", "problem_salience"]
        },
    }


def _coverage(items: list[dict[str, Any]], field: str) -> dict[str, int]:
    counter: Counter[str] = Counter()
    for item in items:
        snapshot = item["snapshot"]
        counter[str(snapshot.get(field) or "<missing>")] += 1
    return dict(sorted(counter.items()))


def _review_distribution(reviews: list[dict[str, Any]], field: str) -> dict[str, int]:
    counter: Counter[str] = Counter()
    for review in reviews:
        counter[str(review["review"].get(field) or "<missing>")] += 1
    return dict(sorted(counter.items()))


def _rate(reviews: list[dict[str, Any]], predicate) -> dict[str, Any]:
    denominator = len(reviews)
    numerator = sum(1 for review in reviews if predicate(review))
    return {"numerator": numerator, "denominator": denominator, "rate": numerator / denominator if denominator else None}


def _binary_substantive_agreement(items: list[dict[str, Any]], by_record: dict[str, dict[str, Any]]) -> dict[str, Any]:
    denominator = 0
    numerator = 0
    for item in items:
        review = by_record[item["record_id"]]["review"]
        human = review.get("human_substantivity")
        if human in {"uncertain", "not_scorable"}:
            continue
        denominator += 1
        model = bool(item["snapshot"].get("is_substantive"))
        human_bool = human == "substantive"
        if model == human_bool:
            numerator += 1
    return {"numerator": numerator, "denominator": denominator, "accuracy": numerator / denominator if denominator else None}


def _confusion(
    items: list[dict[str, Any]],
    by_record: dict[str, dict[str, Any]],
    model_field: str,
    human_field: str,
) -> dict[str, dict[str, int]]:
    matrix: dict[str, Counter[str]] = defaultdict(Counter)
    for item in items:
        review = by_record[item["record_id"]]["review"]
        human = review.get(human_field)
        if human in EXCLUDED_LABELS or human is None:
            continue
        model = str(item["snapshot"].get(model_field) or "<null>")
        matrix[str(human)][model] += 1
    return {human: dict(models) for human, models in matrix.items()}
