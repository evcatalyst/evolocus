from __future__ import annotations

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

            page.locator("[data-tab='results']").click()
            page.wait_for_selector(".chart-route-legend-card [data-chart-route-action='map']", timeout=10_000)
            assert page.locator("#results-panel").evaluate("element => element.classList.contains('active')")

            page.locator("[data-chart-route-action='map']").click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_selector(".selected-map-ontology-route [data-selected-route-open='topic']", timeout=10_000)
            selected_route_text = page.locator(".selected-map-ontology-route").inner_text(timeout=5_000)
            assert "map-to-ontology route" in selected_route_text.lower()
            assert "No ordinance text" in selected_route_text
            page.locator(".selected-map-ontology-route [data-selected-route-open='topic']").click()
            page.wait_for_function("() => document.querySelector('#ontology-panel')?.classList.contains('active')")

            page.locator("[data-tab='results']").click()
            page.wait_for_selector(".chart-route-legend-card [data-chart-route-action='ask']", timeout=10_000)
            page.locator("[data-chart-route-action='ask']").click()
            page.wait_for_function("() => document.querySelector('#inquiry-panel')?.classList.contains('active')")

            page.locator("[data-tab='results']").click()
            page.wait_for_selector(".chart-route-legend-card [data-chart-route-action='graph']", timeout=10_000)
            page.locator("[data-chart-route-action='graph']").click()
            page.wait_for_function("() => document.querySelector('#ontology-panel')?.classList.contains('active')")

            assert errors == []
        finally:
            browser.close()
