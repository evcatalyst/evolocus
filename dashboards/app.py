from __future__ import annotations

import streamlit as st

from evolocus.config import load_config
from evolocus.locus_source import DATASET_LICENSE


def main() -> None:
    config = load_config()
    st.set_page_config(page_title="EvoLOCUS Evaluator", layout="wide")
    st.title("EvoLOCUS Human Evaluation Workbench")
    st.warning(
        "Research use only. Not legal advice. Text may contain OCR errors. "
        "Labels and scores are model-produced. The corpus is not a complete or continuously current statement "
        f"of local law. Consult official sources. Dataset license: {DATASET_LICENSE}."
    )
    if config.mode == "demo":
        st.error("SYNTHETIC DEMONSTRATION DATA. Do not treat displayed records as LOCUS rows or legal facts.")
    st.markdown(
        f"""
        **Mode:** `{config.mode}`
        **Dataset revision:** `{config.dataset_revision}`
        **Queue:** `{config.queue}`
        **Reviewer:** `{config.reviewer}`
        **Protocol:** `evolocus-eval-v1`
        **Blind review default:** `{config.blind_review}`
        """
    )
    st.page_link("pages/1_Review_Queue.py", label="Start Review Queue")
    st.page_link("pages/2_Dataset_Explorer.py", label="Open Dataset Explorer")
    st.page_link("pages/3_Evaluation_Results.py", label="View Evaluation Results")
    st.page_link("pages/4_Protocol_and_Provenance.py", label="Protocol and Provenance")


if __name__ == "__main__":
    main()
