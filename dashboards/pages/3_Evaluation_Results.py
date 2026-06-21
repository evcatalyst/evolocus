from __future__ import annotations

import streamlit as st

from evolocus.config import load_config
from evolocus.evaluation_metrics import evaluation_summary


def main() -> None:
    config = load_config()
    st.title("Evaluation Results")
    st.warning("Research use only. Metrics are based only on saved human reviews and disclose denominators.")
    summary = evaluation_summary(str(config.eval_db), config.queue, config.reviewer)
    st.subheader("Progress")
    st.json(summary["progress"])
    st.subheader("Human/model substantive agreement")
    st.json(summary["substantive_agreement"])
    st.subheader("Coverage")
    st.json(
        {
            "state": summary["coverage_by_state"],
            "jurisdiction_type": summary["coverage_by_jurisdiction_type"],
            "model_function": summary["coverage_by_model_function"],
            "model_topic": summary["coverage_by_model_topic"],
        }
    )
    st.subheader("Distributions and confusion matrices")
    st.json(
        {
            "ocr_quality": summary["ocr_quality_distribution"],
            "function_confusion": summary["function_confusion"],
            "topic_confusion": summary["topic_confusion"],
            "score_reviews": summary["score_review_distributions"],
        }
    )


main()
