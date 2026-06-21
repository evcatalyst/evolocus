from __future__ import annotations

from tests.test_evaluation_db import review_payload, seed_queue
from evolocus.evaluation_db import append_review_event, next_queue_item
from evolocus.evaluation_exports import export_evaluation


def test_default_export_omits_ordinance_content(tmp_path) -> None:
    db_path = tmp_path / "eval.sqlite3"
    queue_name = seed_queue(db_path)
    item = next_queue_item(db_path, queue_name, "reviewer-a")
    assert item
    append_review_event(
        db_path,
        queue_item_id=item["queue_item_id"],
        reviewer_id="reviewer-a",
        event_type="save",
        review=review_payload(),
    )
    output_dir = tmp_path / "exports"
    export_evaluation(db_path, queue_name=queue_name, output_dir=output_dir, include_content=False)
    queue_items = (output_dir / "queue_items.csv").read_text(encoding="utf-8")
    assert "SYNTHETIC DEMONSTRATION DATA" not in queue_items
    assert "content" not in queue_items.splitlines()[0]
    assert "header" not in queue_items.splitlines()[0]
    assert "source_locator" in queue_items
    assert (output_dir / "review_events.json").exists()
