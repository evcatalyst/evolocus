"""SQLite evaluation store with append-only review events."""

from __future__ import annotations

from contextlib import contextmanager
from datetime import UTC, datetime
from pathlib import Path
import json
import sqlite3
from typing import Any, Iterator

from .evaluation_protocol import PROTOCOL_VERSION, protocol_definition


CURRENT_SCHEMA_VERSION = 1


def utc_now() -> str:
    return datetime.now(UTC).isoformat()


def connect(db_path: Path | str) -> sqlite3.Connection:
    path = Path(db_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(path)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    con.execute("PRAGMA journal_mode = WAL")
    con.execute("PRAGMA busy_timeout = 5000")
    return con


@contextmanager
def transaction(con: sqlite3.Connection) -> Iterator[sqlite3.Connection]:
    try:
        con.execute("BEGIN")
        yield con
        con.commit()
    except Exception:
        con.rollback()
        raise


def init_db(db_path: Path | str) -> None:
    con = connect(db_path)
    with transaction(con):
        con.executescript(
            """
            CREATE TABLE IF NOT EXISTS schema_migrations (
              version INTEGER PRIMARY KEY,
              applied_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS datasets (
              dataset_id TEXT NOT NULL,
              dataset_revision TEXT NOT NULL,
              manifest_fingerprint TEXT NOT NULL,
              manifest_json TEXT NOT NULL,
              created_at TEXT NOT NULL,
              PRIMARY KEY (dataset_id, dataset_revision, manifest_fingerprint)
            );

            CREATE TABLE IF NOT EXISTS evaluation_protocols (
              protocol_version TEXT PRIMARY KEY,
              definition_json TEXT NOT NULL,
              created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS queues (
              queue_id TEXT PRIMARY KEY,
              queue_name TEXT NOT NULL UNIQUE,
              dataset_id TEXT NOT NULL,
              dataset_revision TEXT NOT NULL,
              dataset_manifest_fingerprint TEXT NOT NULL,
              sampling_strategy TEXT NOT NULL,
              sampling_parameters_json TEXT NOT NULL,
              random_seed INTEGER NOT NULL,
              created_at TEXT NOT NULL,
              created_by TEXT NOT NULL,
              protocol_version TEXT NOT NULL,
              item_count INTEGER NOT NULL,
              FOREIGN KEY (protocol_version) REFERENCES evaluation_protocols(protocol_version)
            );

            CREATE TABLE IF NOT EXISTS queue_items (
              queue_item_id TEXT PRIMARY KEY,
              queue_id TEXT NOT NULL,
              position INTEGER NOT NULL,
              record_id TEXT NOT NULL,
              source_locator TEXT NOT NULL,
              snapshot_json TEXT NOT NULL,
              assigned_reviewer TEXT,
              workflow_status TEXT NOT NULL DEFAULT 'pending',
              created_at TEXT NOT NULL,
              UNIQUE(queue_id, record_id),
              UNIQUE(queue_id, position),
              FOREIGN KEY (queue_id) REFERENCES queues(queue_id)
            );

            CREATE TABLE IF NOT EXISTS review_events (
              event_id TEXT PRIMARY KEY,
              queue_item_id TEXT NOT NULL,
              record_id TEXT NOT NULL,
              queue_id TEXT NOT NULL,
              reviewer_id TEXT NOT NULL,
              event_type TEXT NOT NULL,
              previous_event_id TEXT,
              prediction_revealed_before_submit INTEGER NOT NULL DEFAULT 0,
              review_json TEXT NOT NULL,
              created_at TEXT NOT NULL,
              FOREIGN KEY (queue_item_id) REFERENCES queue_items(queue_item_id),
              FOREIGN KEY (queue_id) REFERENCES queues(queue_id)
            );
            """
        )
        con.execute(
            "INSERT OR IGNORE INTO schema_migrations(version, applied_at) VALUES (?, ?)",
            (CURRENT_SCHEMA_VERSION, utc_now()),
        )
        con.execute(
            """
            INSERT OR IGNORE INTO evaluation_protocols(protocol_version, definition_json, created_at)
            VALUES (?, ?, ?)
            """,
            (PROTOCOL_VERSION, json.dumps(protocol_definition(), sort_keys=True), utc_now()),
        )
    con.close()


def upsert_dataset(con: sqlite3.Connection, manifest: dict[str, Any], fingerprint: str) -> None:
    con.execute(
        """
        INSERT OR IGNORE INTO datasets(dataset_id, dataset_revision, manifest_fingerprint, manifest_json, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            manifest["dataset_id"],
            manifest["dataset_revision"],
            fingerprint,
            json.dumps(manifest, sort_keys=True, default=str),
            utc_now(),
        ),
    )


def create_queue(
    db_path: Path | str,
    *,
    queue_id: str,
    queue_name: str,
    manifest: dict[str, Any],
    manifest_fingerprint: str,
    sampling_strategy: str,
    sampling_parameters: dict[str, Any],
    random_seed: int,
    created_by: str,
    items: list[dict[str, Any]],
) -> None:
    init_db(db_path)
    con = connect(db_path)
    with transaction(con):
        upsert_dataset(con, manifest, manifest_fingerprint)
        con.execute(
            """
            INSERT INTO queues(
              queue_id, queue_name, dataset_id, dataset_revision, dataset_manifest_fingerprint,
              sampling_strategy, sampling_parameters_json, random_seed, created_at, created_by,
              protocol_version, item_count
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                queue_id,
                queue_name,
                manifest["dataset_id"],
                manifest["dataset_revision"],
                manifest_fingerprint,
                sampling_strategy,
                json.dumps(sampling_parameters, sort_keys=True),
                random_seed,
                utc_now(),
                created_by,
                PROTOCOL_VERSION,
                len(items),
            ),
        )
        for position, item in enumerate(items, start=1):
            con.execute(
                """
                INSERT INTO queue_items(
                  queue_item_id, queue_id, position, record_id, source_locator, snapshot_json, created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    f"{queue_id}:{position:06d}",
                    queue_id,
                    position,
                    item["record_id"],
                    item["source_locator"],
                    json.dumps(item, sort_keys=True, default=str),
                    utc_now(),
                ),
            )
    con.close()


def get_queue(con: sqlite3.Connection, queue_name: str) -> sqlite3.Row | None:
    return con.execute("SELECT * FROM queues WHERE queue_name = ?", (queue_name,)).fetchone()


def list_queues(db_path: Path | str) -> list[dict[str, Any]]:
    init_db(db_path)
    con = connect(db_path)
    rows = con.execute("SELECT * FROM queues ORDER BY created_at DESC").fetchall()
    con.close()
    return [dict(row) for row in rows]


def next_queue_item(db_path: Path | str, queue_name: str, reviewer_id: str) -> dict[str, Any] | None:
    init_db(db_path)
    con = connect(db_path)
    row = con.execute(
        """
        SELECT qi.*
        FROM queue_items qi
        JOIN queues q ON qi.queue_id = q.queue_id
        WHERE q.queue_name = ?
          AND qi.queue_item_id NOT IN (
            SELECT queue_item_id FROM review_events WHERE reviewer_id = ? AND event_type IN ('save', 'skip', 'flag')
          )
        ORDER BY qi.position
        LIMIT 1
        """,
        (queue_name, reviewer_id),
    ).fetchone()
    con.close()
    return _decode_item(row) if row else None


def queue_progress(db_path: Path | str, queue_name: str, reviewer_id: str | None = None) -> dict[str, int]:
    init_db(db_path)
    con = connect(db_path)
    queue = get_queue(con, queue_name)
    if not queue:
        con.close()
        return {"total": 0, "reviewed": 0, "skipped": 0, "flagged": 0, "remaining": 0}
    params: list[Any] = [queue["queue_id"]]
    reviewer_sql = ""
    if reviewer_id:
        reviewer_sql = "AND reviewer_id = ?"
        params.append(reviewer_id)
    rows = con.execute(
        f"""
        SELECT event_type, count(*) AS n
        FROM review_events
        WHERE queue_id = ? {reviewer_sql}
        GROUP BY event_type
        """,
        params,
    ).fetchall()
    counts = {row["event_type"]: int(row["n"]) for row in rows}
    reviewed = counts.get("save", 0)
    skipped = counts.get("skip", 0)
    flagged = counts.get("flag", 0)
    total = int(queue["item_count"])
    con.close()
    return {
        "total": total,
        "reviewed": reviewed,
        "skipped": skipped,
        "flagged": flagged,
        "remaining": max(0, total - reviewed - skipped - flagged),
    }


def append_review_event(
    db_path: Path | str,
    *,
    queue_item_id: str,
    reviewer_id: str,
    event_type: str,
    review: dict[str, Any],
    prediction_revealed_before_submit: bool = False,
    previous_event_id: str | None = None,
) -> str:
    init_db(db_path)
    con = connect(db_path)
    item = con.execute("SELECT * FROM queue_items WHERE queue_item_id = ?", (queue_item_id,)).fetchone()
    if not item:
        con.close()
        raise ValueError(f"Unknown queue item: {queue_item_id}")
    created = utc_now()
    event_id = f"{queue_item_id}:{reviewer_id}:{created}"
    with transaction(con):
        con.execute(
            """
            INSERT INTO review_events(
              event_id, queue_item_id, record_id, queue_id, reviewer_id, event_type,
              previous_event_id, prediction_revealed_before_submit, review_json, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                event_id,
                queue_item_id,
                item["record_id"],
                item["queue_id"],
                reviewer_id,
                event_type,
                previous_event_id,
                1 if prediction_revealed_before_submit else 0,
                json.dumps(review, sort_keys=True, default=str),
                created,
            ),
        )
        status = {"save": "reviewed", "skip": "skipped", "flag": "flagged"}.get(event_type, "pending")
        con.execute("UPDATE queue_items SET workflow_status = ? WHERE queue_item_id = ?", (status, queue_item_id))
    con.close()
    return event_id


def review_history(db_path: Path | str, queue_item_id: str | None = None) -> list[dict[str, Any]]:
    init_db(db_path)
    con = connect(db_path)
    if queue_item_id:
        rows = con.execute(
            "SELECT * FROM review_events WHERE queue_item_id = ? ORDER BY created_at",
            (queue_item_id,),
        ).fetchall()
    else:
        rows = con.execute("SELECT * FROM review_events ORDER BY created_at").fetchall()
    con.close()
    return [_decode_event(row) for row in rows]


def latest_reviews(db_path: Path | str, queue_name: str | None = None) -> list[dict[str, Any]]:
    init_db(db_path)
    con = connect(db_path)
    queue_join = ""
    conditions = [
        """re.created_at = (
          SELECT max(created_at)
          FROM review_events newer
          WHERE newer.record_id = re.record_id AND newer.reviewer_id = re.reviewer_id
        )"""
    ]
    params: list[Any] = []
    if queue_name:
        queue_join = "JOIN queues q ON re.queue_id = q.queue_id"
        conditions.append("q.queue_name = ?")
        params.append(queue_name)
    rows = con.execute(
        f"""
        SELECT re.*
        FROM review_events re
        {queue_join}
        WHERE {" AND ".join(conditions)}
        ORDER BY re.created_at
        """,
        params,
    ).fetchall()
    con.close()
    return [_decode_event(row) for row in rows]


def queue_items(db_path: Path | str, queue_name: str) -> list[dict[str, Any]]:
    init_db(db_path)
    con = connect(db_path)
    rows = con.execute(
        """
        SELECT qi.*
        FROM queue_items qi
        JOIN queues q ON qi.queue_id = q.queue_id
        WHERE q.queue_name = ?
        ORDER BY qi.position
        """,
        (queue_name,),
    ).fetchall()
    con.close()
    return [_decode_item(row) for row in rows]


def _decode_item(row: sqlite3.Row) -> dict[str, Any]:
    data = dict(row)
    data["snapshot"] = json.loads(data.pop("snapshot_json"))
    return data


def _decode_event(row: sqlite3.Row) -> dict[str, Any]:
    data = dict(row)
    data["review"] = json.loads(data.pop("review_json"))
    return data


def queue_definition(db_path: Path | str, queue_name: str) -> dict[str, Any] | None:
    init_db(db_path)
    con = connect(db_path)
    row = con.execute("SELECT * FROM queues WHERE queue_name = ?", (queue_name,)).fetchone()
    con.close()
    if not row:
        return None
    data = dict(row)
    data["sampling_parameters"] = json.loads(data.pop("sampling_parameters_json"))
    return data
