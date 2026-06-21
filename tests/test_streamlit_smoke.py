from __future__ import annotations

from pathlib import Path


def test_streamlit_entrypoint_and_pages_exist() -> None:
    assert Path("dashboards/app.py").exists()
    for page in [
        "dashboards/pages/1_Review_Queue.py",
        "dashboards/pages/2_Dataset_Explorer.py",
        "dashboards/pages/3_Evaluation_Results.py",
        "dashboards/pages/4_Protocol_and_Provenance.py",
    ]:
        text = Path(page).read_text(encoding="utf-8")
        assert "Research use only" in text or "SYNTHETIC DEMONSTRATION DATA" in text
