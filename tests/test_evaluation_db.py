from __future__ import annotations

from evolocus.evaluation_db import (
    append_review_event,
    create_queue,
    init_db,
    next_queue_item,
    queue_progress,
    review_history,
)
from evolocus.evaluation_sampling import manifest_dict_and_fingerprint, queue_id_for, sample_queue_items
from evolocus.locus_source import LocusCorpus


def seed_queue(db_path, queue_name: str = "test-queue"):
    corpus = LocusCorpus.demo()
    manifest, fingerprint = manifest_dict_and_fingerprint(corpus)
    items = sample_queue_items(corpus, strategy="balanced_labels", size=4, seed=20260621)
    queue_id = queue_id_for(
        queue_name=queue_name,
        dataset_revision=manifest["dataset_revision"],
        manifest_fingerprint=fingerprint,
        strategy="balanced_labels",
        size=4,
        seed=20260621,
    )
    create_queue(
        db_path,
        queue_id=queue_id,
        queue_name=queue_name,
        manifest=manifest,
        manifest_fingerprint=fingerprint,
        sampling_strategy="balanced_labels",
        sampling_parameters={"size": 4},
        random_seed=20260621,
        created_by="tester",
        items=items,
    )
    return queue_name


def review_payload() -> dict[str, object]:
    return {
        "disposition": "accept_as_presented",
        "human_substantivity": "substantive",
        "human_function": "Rules",
        "human_topic": "Zoning",
        "ocr_quality": "good",
        "jurisdiction_metadata_quality": "appears_correct",
        "confidence": 0.8,
    }


def test_migrations_queue_resume_and_append_only_history(tmp_path) -> None:
    db_path = tmp_path / "eval.sqlite3"
    init_db(db_path)
    queue_name = seed_queue(db_path)
    item = next_queue_item(db_path, queue_name, "reviewer-a")
    assert item is not None
    first = append_review_event(
        db_path,
        queue_item_id=item["queue_item_id"],
        reviewer_id="reviewer-a",
        event_type="save",
        review=review_payload(),
    )
    second = append_review_event(
        db_path,
        queue_item_id=item["queue_item_id"],
        reviewer_id="reviewer-a",
        event_type="save",
        review={**review_payload(), "notes": "correction"},
        previous_event_id=first,
    )
    history = review_history(db_path, item["queue_item_id"])
    assert [event["event_id"] for event in history] == [first, second]
    progress = queue_progress(db_path, queue_name, "reviewer-a")
    assert progress["reviewed"] == 2
    resumed = next_queue_item(db_path, queue_name, "reviewer-a")
    assert resumed is not None
    assert resumed["queue_item_id"] != item["queue_item_id"]
