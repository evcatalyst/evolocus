from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

import pytest


ROOT = Path(__file__).resolve().parents[1]
SITE_DIR = ROOT / "site"
SITE_ORIGIN = "https://evolocus.local"
CONTENT_TYPES = {
    ".css": "text/css",
    ".html": "text/html",
    ".js": "application/javascript",
    ".json": "application/json",
}


def fulfill_static_asset(route: Any) -> None:
    parsed = urlparse(route.request.url)
    request_path = unquote(parsed.path).lstrip("/")
    path = SITE_DIR / (request_path or "index.html")
    if not path.resolve().is_relative_to(SITE_DIR.resolve()):
        route.fulfill(status=403, body="Forbidden")
        return
    if not path.exists():
        route.fulfill(status=404, body=f"Missing static asset: {request_path}")
        return
    route.fulfill(status=200, path=str(path), content_type=CONTENT_TYPES.get(path.suffix, "text/plain"))


def test_charts_route_buttons_navigate_between_public_surfaces() -> None:
    if os.environ.get("EVOLOCUS_BROWSER_SMOKE") != "1":
        pytest.skip("Set EVOLOCUS_BROWSER_SMOKE=1 after installing requirements-dev.txt to run browser smoke.")

    try:
        from playwright.sync_api import Error as PlaywrightError
        from playwright.sync_api import sync_playwright
    except ModuleNotFoundError as exc:  # pragma: no cover - exercised only without optional dev deps.
        pytest.fail("Playwright is required for EVOLOCUS_BROWSER_SMOKE=1. Run pip install -r requirements-dev.txt.")  # noqa: B011
        raise exc

    with sync_playwright() as playwright:
        try:
            browser = playwright.chromium.launch()
        except PlaywrightError as exc:  # pragma: no cover - depends on local browser install.
            pytest.fail(
                "Playwright Chromium is required for EVOLOCUS_BROWSER_SMOKE=1. "
                "Run python -m playwright install chromium."
            )
            raise exc

        errors: list[str] = []
        try:
            page = browser.new_page()
            page.on("pageerror", lambda error: errors.append(str(error)))
            target_url = os.environ.get("EVOLOCUS_BROWSER_SMOKE_URL", "").strip()
            if target_url:
                page.goto(target_url, wait_until="networkidle")
            else:
                page.route(f"{SITE_ORIGIN}/**", fulfill_static_asset)
                page.goto(f"{SITE_ORIGIN}/", wait_until="networkidle")

            page.wait_for_selector("#visual-route-verification .visual-route-verification-card", timeout=10_000)
            verification_text = page.locator("#visual-route-verification").inner_text(timeout=5_000)
            assert "visual route verified" in verification_text.lower()
            assert "Chart -> Map -> Inquiry -> Ontology" in verification_text
            assert "No rows" in verification_text
            assert "No text" in verification_text

            page.wait_for_selector("[data-frontdoor-composer] #frontdoor-question-input", timeout=10_000)
            page.locator("#frontdoor-question-input").fill("Where are zoning enforcement laws in cities?")
            page.locator("[data-frontdoor-composer-action='preview']").click()
            composer_text = page.locator(".frontdoor-question-composer").inner_text(timeout=5_000)
            assert "Topic Zoning" in composer_text
            assert "Function Enforcement" in composer_text
            assert "State IN" not in composer_text
            assert "no ordinance text" in composer_text.lower()
            page.locator("[data-frontdoor-composer-action='save']").click()
            page.wait_for_selector(".frontdoor-saved-route [data-frontdoor-route-action='ontology']", timeout=10_000)
            saved_route_text = page.locator(".frontdoor-saved-routes").inner_text(timeout=5_000)
            assert "saved visual routes" in saved_route_text.lower()
            assert "no ordinance text" in saved_route_text.lower()
            with page.expect_download() as download_info:
                page.locator("[data-frontdoor-export-routes]").click()
            download = download_info.value
            assert download.suggested_filename == "evolocus-frontdoor-routes.json"
            export_payload = json.loads(Path(download.path()).read_text(encoding="utf-8"))
            assert export_payload["schema_version"] == "evolocus-frontdoor-route-export-v1"
            assert export_payload["route_count"] >= 1
            assert export_payload["publication_policy"]["ordinance_text_included"] is False
            assert export_payload["publication_policy"]["source_locators_included"] is False
            assert export_payload["publication_policy"]["review_events_included"] is False
            assert "answer_excerpt" not in export_payload["routes"][0]
            page.evaluate("localStorage.removeItem('evolocus.pages.aggregateInquiryResultsLog.v1')")
            page.reload(wait_until="networkidle")
            page.wait_for_selector("[data-frontdoor-import-routes]", timeout=10_000)
            page.once("dialog", lambda dialog: dialog.accept())
            page.locator("[data-frontdoor-import-routes]").set_input_files(download.path())
            page.wait_for_selector(".frontdoor-saved-route [data-frontdoor-route-action='map']", timeout=10_000)
            imported_route_text = page.locator(".frontdoor-saved-routes").inner_text(timeout=5_000)
            assert "imported" in imported_route_text.lower()
            assert "no ordinance text" in imported_route_text.lower()
            page.locator(".frontdoor-saved-route [data-frontdoor-route-action='map']").first.click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.locator("[data-tab='map']").click()
            page.locator(".frontdoor-saved-route [data-frontdoor-route-action='ontology']").first.click()
            page.wait_for_function("() => document.querySelector('#ontology-panel')?.classList.contains('active')")

            page.locator("[data-tab='results']").click()
            page.wait_for_selector(".chart-route-legend-card [data-chart-route-action='map']", timeout=10_000)
            assert page.locator("#results-panel").evaluate("element => element.classList.contains('active')")

            page.locator("[data-chart-route-action='map']").click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_selector(".selected-map-ontology-route [data-selected-route-open='topic']", timeout=10_000)
            page.wait_for_selector(".selected-query-replay [data-selected-query-route='save']", timeout=10_000)
            selected_query_text = page.locator(".selected-query-replay").inner_text(timeout=5_000)
            assert "selected-unit query replay" in selected_query_text.lower()
            assert "ask -> answer -> ontology" in selected_query_text.lower()
            assert "no ordinance text" in selected_query_text.lower()
            page.locator(".selected-query-replay [data-selected-query-route='save']").click()
            page.wait_for_selector(".map-route-row.active", timeout=10_000)
            saved_map_route_text = page.locator(".map-route-row.active").inner_text(timeout=5_000)
            assert "what does the selected unit" in saved_map_route_text.lower()
            page.locator(".selected-query-replay [data-selected-query-route='ontology']").click()
            page.wait_for_function("() => document.querySelector('#ontology-panel')?.classList.contains('active')")
            page.locator("[data-tab='map']").click()
            page.wait_for_selector(".selected-map-ontology-route [data-selected-route-open='topic']", timeout=10_000)
            page.wait_for_selector(".selected-neighbor-filter-controls [data-selected-neighbor-filter='topic']", timeout=10_000)
            neighbor_text = page.locator(".ontology-neighborhood").first.inner_text(timeout=5_000)
            assert "map-side ontology neighborhood filters" in neighbor_text.lower()
            assert "no ordinance text" in neighbor_text.lower()
            page.locator(".selected-neighbor-filter-controls [data-selected-neighbor-filter='topic']").first.click()
            filtered_neighbor_text = page.locator(".ontology-neighborhood").first.inner_text(timeout=5_000).lower()
            assert "topic lens" in filtered_neighbor_text
            assert "no ordinance text" in filtered_neighbor_text
            if page.locator(".selected-neighbor-peer-row").count():
                page.locator(".selected-neighbor-peer-row").first.click()
                page.wait_for_selector(".selected-query-replay", timeout=10_000)
            selected_route_text = page.locator(".selected-map-ontology-route").inner_text(timeout=5_000)
            assert "map-to-ontology route" in selected_route_text.lower()
            assert "No ordinance text" in selected_route_text
            page.locator(".selected-map-ontology-route [data-selected-route-open='topic']").click()
            page.wait_for_function("() => document.querySelector('#ontology-panel')?.classList.contains('active')")

            page.locator("[data-tab='results']").click()
            page.wait_for_selector(".chart-route-legend-card [data-chart-route-action='ask']", timeout=10_000)
            page.locator("[data-chart-route-action='ask']").click()
            page.wait_for_function("() => document.querySelector('#inquiry-panel')?.classList.contains('active')")
            page.wait_for_selector("#inquiry-answer .inquiry-answer-freshness", timeout=10_000)
            inquiry_answer_text = page.locator("#inquiry-answer").inner_text(timeout=5_000)
            normalized_answer_text = inquiry_answer_text.lower()
            assert "answer provenance" in normalized_answer_text
            assert "grok-refreshed offline" in normalized_answer_text
            assert "no browser model call" in normalized_answer_text
            assert "no ordinance text" in normalized_answer_text
            page.locator("#inquiry-form input[name='question']").fill("Show zoning units on the map")
            page.locator("[data-inquiry-map-composer-action='apply-map']").click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            highlight_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "chat-to-map highlight" in highlight_text
            assert "highlighted units" in highlight_text
            assert "no browser-side grok call" in highlight_text
            assert "ordinance text" in highlight_text
            assert page.locator(".map-unit.inquiry-hit").count() > 0
            page.locator("[data-clear-inquiry-map-highlight]").click()
            cleared_highlight_text = page.locator(".map-question-highlight-card.empty").inner_text(timeout=5_000).lower()
            assert "no active chat-to-map highlight" in cleared_highlight_text
            page.locator("[data-tab='inquiry']").click()
            page.wait_for_function("() => document.querySelector('#inquiry-panel')?.classList.contains('active')")
            page.wait_for_selector(".inquiry-route-comparison-card [data-open-inquiry-log-ontology]", timeout=10_000)
            comparison_text = page.locator(".inquiry-route-comparison").inner_text(timeout=5_000)
            assert "route comparison" in comparison_text.lower()
            assert "browser-local saved question paths" in comparison_text.lower()
            assert "not legal rankings" in comparison_text.lower()
            page.locator(".inquiry-route-comparison-card [data-open-inquiry-log-ontology]").first.click()
            page.wait_for_function("() => document.querySelector('#ontology-panel')?.classList.contains('active')")

            page.locator("[data-tab='results']").click()
            page.wait_for_selector(".chart-route-legend-card [data-chart-route-action='graph']", timeout=10_000)
            page.locator("[data-chart-route-action='graph']").click()
            page.wait_for_function("() => document.querySelector('#ontology-panel')?.classList.contains('active')")
            page.wait_for_selector(".ontology-tier-neighborhood [data-tier-neighborhood-map]", timeout=10_000)
            tier_neighborhood_text = page.locator(".ontology-tier-neighborhood").inner_text(timeout=5_000).lower()
            assert "tier neighborhood graph" in tier_neighborhood_text
            assert "model-score nodes" in tier_neighborhood_text
            assert "not a legal ontology" in tier_neighborhood_text
            page.locator(".ontology-tier-neighborhood [data-tier-neighborhood-map]").click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            tier_highlight_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "chat-to-map highlight" in tier_highlight_text
            assert "ontology tier neighborhood" in tier_highlight_text
            assert "no browser-side grok call" in tier_highlight_text
            assert page.locator(".map-unit.inquiry-hit").count() > 0

            assert errors == []
        finally:
            browser.close()
