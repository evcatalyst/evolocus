"""Auditable local evaluation exports."""

from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path
import csv
import json
from typing import Any

from .evaluation_db import connect, latest_reviews, queue_items, review_history
from .evaluation_metrics import evaluation_summary
from .evaluation_protocol import protocol_definition


def export_evaluation(
    db_path: Path | str,
    *,
    queue_name: str,
    output_dir: Path,
    include_content: bool = False,
) -> dict[str, str]:
    output_dir.mkdir(parents=True, exist_ok=True)
    items = queue_items(db_path, queue_name)
    events = review_history(db_path)
    latest = latest_reviews(db_path, queue_name)
    summary = evaluation_summary(str(db_path), queue_name)
    queue = _queue_definition(db_path, queue_name)

    if not include_content:
        for item in items:
            item["snapshot"].pop("content", None)
            item["snapshot"].pop("header", None)

    paths = {
        "queue_items": str(output_dir / "queue_items.csv"),
        "review_events": str(output_dir / "review_events.json"),
        "latest_reviews": str(output_dir / "latest_reviews.csv"),
        "summary": str(output_dir / "evaluation_summary.json"),
        "queue": str(output_dir / "queue_definition.json"),
        "protocol": str(output_dir / "evaluation_protocol.json"),
        "manifest": str(output_dir / "export_manifest.json"),
    }
    _write_csv(output_dir / "queue_items.csv", _flatten_items(items, include_content=include_content))
    _write_json(output_dir / "review_events.json", events)
    _write_csv(output_dir / "latest_reviews.csv", _flatten_reviews(latest))
    _write_json(output_dir / "evaluation_summary.json", summary)
    _write_json(output_dir / "queue_definition.json", queue)
    _write_json(output_dir / "evaluation_protocol.json", protocol_definition())
    _write_json(
        output_dir / "export_manifest.json",
        {
            "queue_name": queue_name,
            "exported_at": datetime.now(UTC).isoformat(),
            "include_content": include_content,
            "license": "CC-BY-NC-4.0",
            "citation": "Denis Peskoff, Joe Barrow, Christopher Vu, and Diag Davenport. arXiv:2606.19334, 2026.",
            "default_content_omitted": not include_content,
        },
    )
    return paths


def _queue_definition(db_path: Path | str, queue_name: str) -> dict[str, Any]:
    con = connect(db_path)
    row = con.execute("SELECT * FROM queues WHERE queue_name = ?", (queue_name,)).fetchone()
    con.close()
    if not row:
        raise ValueError(f"Unknown queue: {queue_name}")
    return dict(row)


def _flatten_items(items: list[dict[str, Any]], *, include_content: bool) -> list[dict[str, Any]]:
    rows = []
    for item in items:
        snapshot = item["snapshot"]
        row = {
            "queue_item_id": item["queue_item_id"],
            "queue_id": item["queue_id"],
            "position": item["position"],
            "record_id": item["record_id"],
            "source_locator": item["source_locator"],
            "workflow_status": item["workflow_status"],
            "state": snapshot.get("state"),
            "city": snapshot.get("city"),
            "county": snapshot.get("county"),
            "function": snapshot.get("function"),
            "topic": snapshot.get("topic"),
        }
        if include_content:
            row["header"] = snapshot.get("header")
            row["content"] = snapshot.get("content")
        rows.append(row)
    return rows


def _flatten_reviews(reviews: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rows = []
    for event in reviews:
        review = event["review"]
        rows.append(
            {
                "event_id": event["event_id"],
                "queue_item_id": event["queue_item_id"],
                "record_id": event["record_id"],
                "reviewer_id": event["reviewer_id"],
                "event_type": event["event_type"],
                "created_at": event["created_at"],
                "disposition": review.get("disposition"),
                "human_substantivity": review.get("human_substantivity"),
                "human_function": review.get("human_function"),
                "human_topic": review.get("human_topic"),
                "ocr_quality": review.get("ocr_quality"),
            }
        )
    return rows


def _write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, indent=2, sort_keys=True, default=str) + "\n", encoding="utf-8")


def _write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    fieldnames = sorted({key for row in rows for key in row})
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)
