from __future__ import annotations

import time

import streamlit as st

from evolocus.config import load_config
from evolocus.locus_source import CorpusConfig, LocusCorpus


def corpus_from_config(config) -> LocusCorpus:
    if config.mode == "local":
        return LocusCorpus(CorpusConfig(mode="local", data_glob=config.data_glob, dataset_revision=config.dataset_revision))
    return LocusCorpus.demo()


def main() -> None:
    config = load_config()
    st.title("Dataset Explorer")
    st.warning("Model predictions are not verified legal findings. Expensive text searches run only after submit.")
    if config.mode == "demo":
        st.error("SYNTHETIC DEMONSTRATION DATA")
    corpus = corpus_from_config(config)
    with st.form("filters"):
        states = st.text_input("State filter, comma-separated")
        function = st.multiselect("Function", ["Context", "Rules", "Process", "Enforcement", "Structural"])
        topic = st.multiselect("Topic", ["Buildings", "Business", "Nuisance", "Zoning", "Other"])
        substantive = st.selectbox("Substantive", ["any", "true", "false"])
        jurisdiction_type = st.multiselect("Normalized jurisdiction type", ["city", "county", "unknown"])
        ocr_risk = st.multiselect("OCR risk", ["low", "medium", "high"])
        header_text = st.text_input("Header text contains")
        content_text = st.text_input("Content text contains")
        page = st.number_input("Page", min_value=1, value=1)
        page_size = st.number_input("Page size", min_value=5, max_value=100, value=25)
        submitted = st.form_submit_button("Search")
    if not submitted:
        st.info("Set filters and submit to browse bounded results.")
        return
    filters = {
        "state": [state.strip() for state in states.split(",") if state.strip()],
        "function": function,
        "topic": topic,
        "jurisdiction_type_normalized": jurisdiction_type,
        "ocr_risk_level": ocr_risk,
        "header_text": header_text,
        "content_text": content_text,
    }
    if substantive != "any":
        filters["is_substantive"] = substantive == "true"
    started = time.perf_counter()
    rows = corpus.page(filters=filters, offset=(int(page) - 1) * int(page_size), limit=int(page_size))
    elapsed = time.perf_counter() - started
    st.caption(f"Returned {len(rows)} rows in {elapsed:.3f}s from mode {config.mode}.")
    st.dataframe(
        [
            {k: v for k, v in row.items() if k != "content"} | {"content_preview": (row.get("content") or "")[:240]}
            for row in rows
        ],
        use_container_width=True,
    )


main()
