from __future__ import annotations

from evolocus.evaluation_sampling import sample_queue_items
from evolocus.locus_source import LocusCorpus


def test_queue_sampling_is_deterministic_for_same_seed() -> None:
    corpus = LocusCorpus.demo()
    first = sample_queue_items(corpus, strategy="random", size=4, seed=123)
    second = sample_queue_items(corpus, strategy="random", size=4, seed=123)
    assert [item["record_id"] for item in first] == [item["record_id"] for item in second]


def test_different_seeds_produce_different_samples() -> None:
    corpus = LocusCorpus.demo()
    first = sample_queue_items(corpus, strategy="random", size=4, seed=123)
    second = sample_queue_items(corpus, strategy="random", size=4, seed=456)
    assert [item["record_id"] for item in first] != [item["record_id"] for item in second]


def test_quality_audit_samples_invalid_label_and_ocr_records() -> None:
    corpus = LocusCorpus.demo()
    items = sample_queue_items(corpus, strategy="quality_audit", size=4, seed=123)
    assert items
    assert any(item["function"] == "Structural" or item["ocr_risk_level"] != "low" for item in items)
