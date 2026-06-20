"""Command line entrypoints for EvoLOCUS."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys
from typing import NoReturn

from .locus_ingest import (
    LOCUS_CITATION,
    LOCUS_DATASET_ID,
    LOCUS_DATASET_URL,
    LocusDownloadBlocked,
    build_master_jurisdictions,
    iter_records_from_file,
    load_locus_from_huggingface,
    write_master_jurisdictions,
)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="evolocus", description="EvoLOCUS local-first data tooling.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    status_parser = subparsers.add_parser("status", help="Print LOCUS ingest guardrails and source citation.")
    status_parser.set_defaults(func=_status)

    ingest_parser = subparsers.add_parser("ingest-locus", help="Guarded LOCUS-v1 download entrypoint.")
    ingest_parser.add_argument("--allow-download", action="store_true", help="Explicitly permit Hugging Face access.")
    ingest_parser.add_argument("--split", default="train", help="Hugging Face dataset split to load.")
    ingest_parser.set_defaults(func=_ingest_locus)

    update_parser = subparsers.add_parser("update-cycle", help="Print the next safe evolution cycle.")
    update_parser.set_defaults(func=_update_cycle)

    master_parser = subparsers.add_parser("build-master", help="Build master jurisdiction table from local records.")
    master_parser.add_argument("--input", required=True, type=Path, help="Local JSON, JSONL, CSV, or Parquet input.")
    master_parser.add_argument("--output", required=True, type=Path, help="Output .json or .csv path.")
    master_parser.add_argument("--limit", type=int, default=None, help="Optional local record limit.")
    master_parser.set_defaults(func=_build_master)

    args = parser.parse_args(argv)
    return int(args.func(args) or 0)


def _status(_args: argparse.Namespace) -> int:
    payload = {
        "dataset": LOCUS_DATASET_ID,
        "dataset_url": LOCUS_DATASET_URL,
        "citation": LOCUS_CITATION,
        "phase": "1",
        "default_download_behavior": "blocked",
        "real_records_committed": False,
    }
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


def _ingest_locus(args: argparse.Namespace) -> int:
    try:
        dataset = load_locus_from_huggingface(allow_download=args.allow_download, split=args.split)
    except LocusDownloadBlocked as exc:
        _die(str(exc), exit_code=2)
    print(dataset)
    return 0


def _build_master(args: argparse.Namespace) -> int:
    records = iter_records_from_file(args.input, limit=args.limit)
    rows = build_master_jurisdictions(records)
    write_master_jurisdictions(rows, args.output)
    print(f"wrote {len(rows)} master jurisdiction rows to {args.output}")
    return 0


def _update_cycle(_args: argparse.Namespace) -> int:
    payload = {
        "mode": "dry_run",
        "current_phase": 1,
        "safe_next_steps": [
            "Build gap analysis from the master jurisdiction table.",
            "Seed a synthetic or source-backed queue without running scrapers.",
            "Add Streamlit controls after local-only data contracts are stable.",
        ],
        "downloads_allowed": False,
        "scrapers_allowed": False,
    }
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


def _die(message: str, *, exit_code: int = 1) -> NoReturn:
    print(f"error: {message}", file=sys.stderr)
    raise SystemExit(exit_code) from None


if __name__ == "__main__":
    raise SystemExit(main())
