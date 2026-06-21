"""Command line entrypoints for EvoLOCUS."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys
from typing import NoReturn

from .analysis_publish import DEFAULT_OUTPUT_DIR, publish_analysis_artifacts
from .county_geometry import publish_county_geometry_artifact
from .evaluation_db import init_db, create_queue
from .evaluation_exports import export_evaluation
from .evaluation_sampling import manifest_dict_and_fingerprint, queue_id_for, sample_queue_items
from .locus_audit import run_audit
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
from .locus_source import CorpusConfig, LocusCorpus
from .municipal_points import publish_municipal_points_artifact


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

    audit_parser = subparsers.add_parser("audit-locus", help="Run a bounded Polars audit over demo or local LOCUS Parquet.")
    audit_parser.add_argument("--input", type=str, default=None, help="Local Parquet file or glob. Omit for demo mode.")
    audit_parser.add_argument("--output", required=True, type=Path, help="Ignored output directory for audit artifacts.")
    audit_parser.add_argument("--dataset-revision", default="local", help="Dataset revision label for local mode.")
    audit_parser.add_argument("--sample-limit", type=int, default=200)
    audit_parser.set_defaults(func=_audit_locus)

    init_eval_parser = subparsers.add_parser("init-evaluation", help="Initialize the local SQLite evaluation store.")
    init_eval_parser.add_argument("--db", required=True, type=Path)
    init_eval_parser.set_defaults(func=_init_evaluation)

    seed_parser = subparsers.add_parser("seed-evaluation", help="Seed a deterministic evaluation queue.")
    seed_parser.add_argument("--input", type=str, default=None, help="Local Parquet file/glob. Omit for demo mode.")
    seed_parser.add_argument("--db", required=True, type=Path)
    seed_parser.add_argument("--queue", required=True)
    seed_parser.add_argument("--strategy", required=True, choices=["random", "balanced_labels", "geographic", "quality_audit", "score_stratified"])
    seed_parser.add_argument("--size", type=int, required=True)
    seed_parser.add_argument("--seed", type=int, required=True)
    seed_parser.add_argument("--dataset-revision", default="local")
    seed_parser.add_argument("--created-by", default="local-reviewer")
    seed_parser.set_defaults(func=_seed_evaluation)

    export_parser = subparsers.add_parser("export-evaluation", help="Export auditable evaluation results.")
    export_parser.add_argument("--db", required=True, type=Path)
    export_parser.add_argument("--queue", required=True)
    export_parser.add_argument("--output", required=True, type=Path)
    export_parser.add_argument("--with-content", action="store_true", help="Include ordinance text. Off by default.")
    export_parser.add_argument("--without-content", action="store_true", help="Explicitly omit ordinance text.")
    export_parser.set_defaults(func=_export_evaluation)

    publish_parser = subparsers.add_parser("publish-analysis", help="Publish bounded static analysis artifacts for GitHub Pages.")
    publish_parser.add_argument("--input", type=str, default=None, help="Local Parquet file/glob. Omit for synthetic demo artifacts.")
    publish_parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_DIR, help="Output directory for static JSON artifacts.")
    publish_parser.add_argument("--dataset-revision", default="synthetic-demo")
    publish_parser.add_argument("--max-units", type=int, default=250)
    publish_parser.add_argument(
        "--include-record-samples",
        action="store_true",
        help="Include record text samples. Blocked for non-demo corpus sources.",
    )
    publish_parser.set_defaults(func=_publish_analysis)

    county_geometry_parser = subparsers.add_parser(
        "publish-county-geometry",
        help="Publish official Census county geometry matched to aggregate Pages units.",
    )
    county_geometry_parser.add_argument(
        "--map-layers",
        type=Path,
        default=DEFAULT_OUTPUT_DIR / "map_layers.json",
        help="Existing aggregate map_layers.json input.",
    )
    county_geometry_parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT_DIR / "county_geometry.json",
        help="Output county geometry JSON artifact.",
    )
    county_geometry_parser.add_argument("--max-allowable-offset", type=float, default=0.02)
    county_geometry_parser.add_argument("--geometry-precision", type=int, default=4)
    county_geometry_parser.set_defaults(func=_publish_county_geometry)

    municipal_points_parser = subparsers.add_parser(
        "publish-municipal-points",
        help="Publish official Census place/subdivision points matched to aggregate Pages units.",
    )
    municipal_points_parser.add_argument(
        "--map-layers",
        type=Path,
        default=DEFAULT_OUTPUT_DIR / "map_layers.json",
        help="Existing aggregate map_layers.json input.",
    )
    municipal_points_parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT_DIR / "municipal_points.json",
        help="Output municipal points JSON artifact.",
    )
    municipal_points_parser.set_defaults(func=_publish_municipal_points)

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


def _audit_locus(args: argparse.Namespace) -> int:
    corpus = _corpus_from_args(args.input, args.dataset_revision)
    audit = run_audit(corpus, args.output, sample_limit=args.sample_limit)
    print(json.dumps({"rows": audit["row_count"], "output": str(args.output)}, indent=2, sort_keys=True))
    return 0


def _init_evaluation(args: argparse.Namespace) -> int:
    init_db(args.db)
    print(json.dumps({"db": str(args.db), "initialized": True}, indent=2, sort_keys=True))
    return 0


def _seed_evaluation(args: argparse.Namespace) -> int:
    corpus = _corpus_from_args(args.input, args.dataset_revision)
    manifest, fingerprint = manifest_dict_and_fingerprint(corpus)
    items = sample_queue_items(corpus, strategy=args.strategy, size=args.size, seed=args.seed)
    queue_id = queue_id_for(
        queue_name=args.queue,
        dataset_revision=manifest["dataset_revision"],
        manifest_fingerprint=fingerprint,
        strategy=args.strategy,
        size=args.size,
        seed=args.seed,
    )
    create_queue(
        args.db,
        queue_id=queue_id,
        queue_name=args.queue,
        manifest=manifest,
        manifest_fingerprint=fingerprint,
        sampling_strategy=args.strategy,
        sampling_parameters={"size": args.size},
        random_seed=args.seed,
        created_by=args.created_by,
        items=items,
    )
    print(json.dumps({"queue": args.queue, "queue_id": queue_id, "items": len(items)}, indent=2, sort_keys=True))
    return 0


def _export_evaluation(args: argparse.Namespace) -> int:
    paths = export_evaluation(args.db, queue_name=args.queue, output_dir=args.output, include_content=args.with_content)
    print(json.dumps(paths, indent=2, sort_keys=True))
    return 0


def _publish_analysis(args: argparse.Namespace) -> int:
    corpus = _corpus_from_args(args.input, args.dataset_revision)
    result = publish_analysis_artifacts(
        corpus,
        args.output,
        max_units=args.max_units,
        include_record_samples=args.include_record_samples or None,
    )
    print(json.dumps(result.to_dict(), indent=2, sort_keys=True))
    return 0


def _publish_county_geometry(args: argparse.Namespace) -> int:
    result = publish_county_geometry_artifact(
        args.map_layers,
        args.output,
        max_allowable_offset=args.max_allowable_offset,
        geometry_precision=args.geometry_precision,
    )
    print(json.dumps(result.to_dict(), indent=2, sort_keys=True))
    return 0


def _publish_municipal_points(args: argparse.Namespace) -> int:
    result = publish_municipal_points_artifact(args.map_layers, args.output)
    print(json.dumps(result.to_dict(), indent=2, sort_keys=True))
    return 0


def _update_cycle(_args: argparse.Namespace) -> int:
    payload = {
        "mode": "dry_run",
        "current_phase": 1,
        "safe_next_steps": [
            "Build gap analysis from the master jurisdiction table.",
            "Seed a synthetic or source-backed queue without running scrapers.",
            "Refresh GitHub Pages map, ontology, and inquiry artifacts from reviewed aggregates.",
        ],
        "downloads_allowed": False,
        "scrapers_allowed": False,
    }
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


def _corpus_from_args(input_glob: str | None, dataset_revision: str) -> LocusCorpus:
    if input_glob:
        return LocusCorpus(CorpusConfig(mode="local", data_glob=input_glob, dataset_revision=dataset_revision))
    return LocusCorpus.demo()


def _die(message: str, *, exit_code: int = 1) -> NoReturn:
    print(f"error: {message}", file=sys.stderr)
    raise SystemExit(exit_code) from None


if __name__ == "__main__":
    raise SystemExit(main())
