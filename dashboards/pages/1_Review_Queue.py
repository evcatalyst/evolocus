from __future__ import annotations

import streamlit as st

from evolocus.config import load_config
from evolocus.evaluation_db import (
    append_review_event,
    init_db,
    list_queues,
    next_queue_item,
    queue_progress,
    review_history,
)
from evolocus.evaluation_protocol import (
    DISPOSITIONS,
    FUNCTION_LABELS,
    JURISDICTION_METADATA_LABELS,
    OCR_QUALITY_LABELS,
    SCORE_FIELDS,
    SCORE_REVIEW_LABELS,
    SUBSTANTIVITY_LABELS,
    TOPIC_LABELS,
)
from evolocus.evaluation_sampling import manifest_dict_and_fingerprint, queue_id_for, sample_queue_items
from evolocus.evaluation_db import create_queue
from evolocus.locus_source import CorpusConfig, LocusCorpus


def corpus_from_config(config) -> LocusCorpus:
    if config.mode == "local":
        return LocusCorpus(CorpusConfig(mode="local", data_glob=config.data_glob, dataset_revision=config.dataset_revision))
    return LocusCorpus.demo()


def ensure_demo_queue(config) -> None:
    init_db(config.eval_db)
    if any(queue["queue_name"] == config.queue for queue in list_queues(config.eval_db)):
        return
    corpus = corpus_from_config(config)
    manifest, fingerprint = manifest_dict_and_fingerprint(corpus)
    items = sample_queue_items(corpus, strategy="balanced_labels", size=min(6, corpus.count()), seed=20260621)
    queue_id = queue_id_for(
        queue_name=config.queue,
        dataset_revision=manifest["dataset_revision"],
        manifest_fingerprint=fingerprint,
        strategy="balanced_labels",
        size=len(items),
        seed=20260621,
    )
    create_queue(
        config.eval_db,
        queue_id=queue_id,
        queue_name=config.queue,
        manifest=manifest,
        manifest_fingerprint=fingerprint,
        sampling_strategy="balanced_labels",
        sampling_parameters={"size": len(items), "auto_created": True},
        random_seed=20260621,
        created_by=config.reviewer,
        items=items,
    )


def main() -> None:
    config = load_config()
    st.title("Review Queue")
    st.warning(
        "Research use only; not legal advice. OCR and model labels may be wrong. "
        "Scores are neutral relative model outputs until direction is verified."
    )
    if config.mode == "demo":
        st.error("SYNTHETIC DEMONSTRATION DATA")
    ensure_demo_queue(config)
    progress = queue_progress(config.eval_db, config.queue, config.reviewer)
    cols = st.columns(5)
    for col, key in zip(cols, ["total", "reviewed", "skipped", "flagged", "remaining"], strict=True):
        col.metric(key.title(), progress[key])

    item = next_queue_item(config.eval_db, config.queue, config.reviewer)
    if not item:
        st.success("No remaining items for this reviewer.")
        return

    snapshot = item["snapshot"]
    st.subheader(snapshot.get("header") or "Untitled ordinance chunk")
    st.caption(f"Source locator: {snapshot['source_locator']}")
    st.write(
        {
            "state": snapshot.get("state"),
            "city": snapshot.get("city"),
            "county": snapshot.get("county"),
            "raw_jurisdiction_type": snapshot.get("source_jurisdiction_type"),
            "normalized_jurisdiction_type": snapshot.get("jurisdiction_type_normalized"),
            "content_chars": snapshot.get("content_length_chars"),
            "ocr_risk_level": snapshot.get("ocr_risk_level"),
            "ocr_risk_reasons": snapshot.get("ocr_risk_reasons"),
        }
    )
    st.text_area("Ordinance text", snapshot.get("content") or "", height=260, disabled=True)

    reveal_key = f"reveal_{item['queue_item_id']}"
    reveal_before_submit = st.checkbox("Reveal model output before submission", key=reveal_key)
    if reveal_before_submit and config.blind_review:
        _show_model_output(snapshot)
    elif config.blind_review:
        st.info("Blind review is enabled. Model outputs are hidden until you save or explicitly reveal.")
    else:
        _show_model_output(snapshot)

    with st.form("review_form", clear_on_submit=False):
        disposition = st.selectbox("Overall disposition", DISPOSITIONS)
        human_substantivity = st.selectbox("Human substantivity", SUBSTANTIVITY_LABELS)
        human_function = st.selectbox("Human function", FUNCTION_LABELS)
        human_topic = st.selectbox("Human topic", TOPIC_LABELS)
        ocr_quality = st.selectbox("OCR quality", OCR_QUALITY_LABELS)
        jurisdiction_metadata_quality = st.selectbox("Jurisdiction metadata quality", JURISDICTION_METADATA_LABELS)
        confidence = st.slider("Reviewer confidence", 0.0, 1.0, 0.7, 0.05)
        score_reviews = {
            f"{field}_review": st.selectbox(field.replace("_", " ").title(), SCORE_REVIEW_LABELS, key=field)
            for field in SCORE_FIELDS
        }
        notes = st.text_area("Reviewer notes")
        action = st.radio("Action", ["Save and next", "Save", "Skip", "Flag for adjudication"])
        submitted = st.form_submit_button("Commit review")

    if submitted:
        if human_substantivity == "not_substantive" and human_topic not in {"Not_applicable", "Not_scorable", "Uncertain"}:
            st.warning("Non-substantive reviews should normally use topic Not_applicable, Uncertain, or Not_scorable.")
        review = {
            "disposition": "skip" if action == "Skip" else ("needs_adjudication" if action == "Flag for adjudication" else disposition),
            "human_substantivity": human_substantivity,
            "human_function": human_function,
            "human_topic": human_topic,
            "ocr_quality": ocr_quality,
            "jurisdiction_metadata_quality": jurisdiction_metadata_quality,
            "confidence": confidence,
            "notes": notes,
            **score_reviews,
        }
        event_type = "skip" if action == "Skip" else ("flag" if action == "Flag for adjudication" else "save")
        event_id = append_review_event(
            config.eval_db,
            queue_item_id=item["queue_item_id"],
            reviewer_id=config.reviewer,
            event_type=event_type,
            review=review,
            prediction_revealed_before_submit=reveal_before_submit,
        )
        st.success(f"Saved review event {event_id}")
        _show_model_output(snapshot)
        if action == "Save and next":
            st.rerun()

    history = review_history(config.eval_db, item["queue_item_id"])
    with st.expander("View previous saved review history"):
        st.json(history)


def _show_model_output(snapshot: dict) -> None:
    st.info(
        {
            "model_is_substantive": snapshot.get("is_substantive"),
            "model_function": snapshot.get("function"),
            "model_topic": snapshot.get("topic"),
            "enforcement_discretion": snapshot.get("enforcement_discretion"),
            "opacity": snapshot.get("opacity"),
            "paternalism": snapshot.get("paternalism"),
            "problem_salience": snapshot.get("problem_salience"),
        }
    )


main()
