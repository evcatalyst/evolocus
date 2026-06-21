from __future__ import annotations

import streamlit as st

from evolocus.config import load_config
from evolocus.evaluation_db import queue_definition
from evolocus.evaluation_protocol import protocol_definition
from evolocus.locus_contract import CITATION, DATASET_LICENSE, DATASET_URL, PAPER_URL


def main() -> None:
    config = load_config()
    st.title("Protocol and Provenance")
    st.warning("Research use only. Not legal advice. Consult official and current legal sources.")
    st.subheader("Dataset")
    st.write(
        {
            "dataset": DATASET_URL,
            "paper": PAPER_URL,
            "license": DATASET_LICENSE,
            "citation": CITATION,
            "mode": config.mode,
            "dataset_revision": config.dataset_revision,
            "score_direction_state": "unverified; display as neutral relative model scores",
        }
    )
    st.subheader("Evaluation protocol")
    st.json(protocol_definition())
    st.subheader("Queue definition")
    st.json(queue_definition(config.eval_db, config.queue) or {"queue": "not initialized"})
    st.subheader("Limitations")
    st.write(
        [
            "LOCUS is an access layer, not a determination of controlling legal authority.",
            "OCR errors may be present.",
            "Model-produced labels and scores are not adjudicated facts.",
            "Synthetic mode is only for workflow demonstration.",
        ]
    )


main()
