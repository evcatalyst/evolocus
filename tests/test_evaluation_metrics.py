from __future__ import annotations

from tests.test_evaluation_db import review_payload, seed_queue
from evolocus.evaluation_db import append_review_event, next_queue_item
from evolocus.evaluation_metrics import evaluation_summary


def test_metrics_report_denominators_and_exclude_uncertain(tmp_path) -> None:
    db_path = tmp_path / "eval.sqlite3"
    queue_name = seed_queue(db_path)
    first = next_queue_item(db_path, queue_name, "reviewer-a")
    assert first
    append_review_event(
        db_path,
        queue_item_id=first["queue_item_id"],
        reviewer_id="reviewer-a",
        event_type="save",
        review={**review_payload(), "human_substantivity": "uncertain"},
    )
    second = next_queue_item(db_path, queue_name, "reviewer-a")
    assert second
    append_review_event(
        db_path,
        queue_item_id=second["queue_item_id"],
        reviewer_id="reviewer-a",
        event_type="save",
        review=review_payload(),
    )
    summary = evaluation_summary(str(db_path), queue_name, "reviewer-a")
    assert summary["progress"]["reviewed"] == 2
    assert summary["substantive_agreement"]["denominator"] == 1
