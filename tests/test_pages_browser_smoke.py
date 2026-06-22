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
            page.wait_for_function(
                "() => document.querySelector('#visual-route-verification')?.innerText.toLowerCase().includes('visual route verified')",
                timeout=15_000,
            )
            verification_text = page.locator("#visual-route-verification").inner_text(timeout=5_000)
            assert "visual route verified" in verification_text.lower()
            assert "Chart -> Map -> Inquiry -> Ontology" in verification_text
            assert "Ontology tier drilldown share URLs" in verification_text
            assert "Latest analysis Ask this map layer" in verification_text
            assert "Question-to-map highlight depth" in verification_text
            assert "Selected-unit ontology route comparison" in verification_text
            assert "No rows" in verification_text
            assert "No text" in verification_text
            page.wait_for_selector(".grok-refresh-run-badge a[href*='/actions/runs/']", timeout=10_000)
            refresh_badge_text = page.locator(".grok-refresh-run-badge").first.inner_text(timeout=5_000).lower()
            assert "latest offline refresh" in refresh_badge_text
            assert "run " in refresh_badge_text
            assert "no model credentials" in refresh_badge_text
            assert "raw rows" in refresh_badge_text
            page.wait_for_selector("#coverage-timeline [data-coverage-timeline-action='status']", timeout=10_000)
            coverage_timeline_text = page.locator("#coverage-timeline").inner_text(timeout=5_000).lower()
            assert "real-data coverage timeline" in coverage_timeline_text
            assert "aggregate artifact metadata only" in coverage_timeline_text
            assert "no ordinance text" in coverage_timeline_text
            page.wait_for_selector(".frontdoor-latest-analysis-card [data-frontdoor-latest-analysis-action='map']", timeout=10_000)
            latest_route_text = page.locator(".frontdoor-latest-analysis-card").inner_text(timeout=5_000).lower()
            assert "latest analysis route" in latest_route_text
            assert "offline actions-only analysis" in latest_route_text
            assert "color county/town map" in latest_route_text
            assert "graph ontology route" in latest_route_text
            assert "no ordinance text" in latest_route_text
            assert "browser model calls" in latest_route_text
            assert page.locator(".frontdoor-latest-analysis-card .ai-route-mini-map svg").count() > 0
            page.locator(".frontdoor-latest-analysis-card [data-frontdoor-latest-analysis-action='ask-layer']").click()
            page.wait_for_function("() => document.querySelector('#inquiry-panel')?.classList.contains('active')")
            latest_layer_answer_text = page.locator("#inquiry-answer").inner_text(timeout=5_000).lower()
            assert "latest analysis ask-this-map-layer" in latest_layer_answer_text
            assert "aggregate metadata only" in latest_layer_answer_text
            assert "no browser model call" in latest_layer_answer_text
            page.locator("[data-tab='map']").click()
            page.locator(".frontdoor-latest-analysis-card [data-frontdoor-latest-analysis-action='map']").click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            latest_route_highlight_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "offline ai analysis pack" in latest_route_highlight_text
            assert "no browser-side grok call" in latest_route_highlight_text
            page.wait_for_selector("#coverage-timeline [data-coverage-timeline-action='status']", timeout=10_000)
            assert "map layer playback" in coverage_timeline_text
            assert "playback changes aggregate layer controls only" in coverage_timeline_text
            page.locator("#coverage-timeline [data-coverage-playback-stage='audit']").click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_function("() => document.querySelector('#county-layer-summary')?.innerText.toLowerCase().includes('color: audit attention')")
            page.get_by_label("Real-data coverage timeline").get_by_role("button", name="Open Analysis Status").click()
            page.wait_for_function("() => document.querySelector('#status-panel')?.classList.contains('active')")
            page.locator("[data-tab='map']").click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_selector(".map-layer-stepper [data-map-layer-step='topic']", timeout=10_000)
            layer_stepper_text = page.locator(".map-layer-stepper").inner_text(timeout=5_000).lower()
            assert "layer step animation" in layer_stepper_text
            assert "tier -> topic -> function -> score -> audit" in layer_stepper_text
            assert "no ordinance text" in layer_stepper_text
            assert "api keys" in layer_stepper_text
            page.locator(".map-layer-stepper [data-map-layer-step='topic']").click()
            page.wait_for_function("() => document.querySelector('#county-layer-summary')?.innerText.toLowerCase().includes('color: dominant topic')")
            page.locator(".map-layer-stepper [data-map-layer-step='function']").click()
            page.wait_for_function("() => document.querySelector('#county-layer-summary')?.innerText.toLowerCase().includes('color: dominant function')")
            page.locator(".map-layer-stepper [data-map-layer-step='score']").click()
            page.wait_for_function(
                "() => { const text = document.querySelector('#county-layer-summary')?.innerText.toLowerCase() || ''; return text.includes('color: neutral') && text.includes('score'); }",
            )
            page.locator(".map-layer-stepper [data-map-layer-step='audit']").click()
            page.wait_for_function("() => document.querySelector('#county-layer-summary')?.innerText.toLowerCase().includes('color: audit attention')")
            page.wait_for_selector(".selected-color-explanation [data-map-layer-step='score']", timeout=10_000)
            color_explanation_text = page.locator(".selected-color-explanation").inner_text(timeout=5_000).lower()
            assert "why this color?" in color_explanation_text
            assert "public aggregate counts" in color_explanation_text
            assert "not legal findings" in color_explanation_text
            page.locator(".selected-color-explanation [data-map-layer-step='score']").click()
            page.wait_for_function(
                "() => { const text = document.querySelector('#county-layer-summary')?.innerText.toLowerCase() || ''; return text.includes('color: neutral') && text.includes('score'); }",
            )
            page.locator(".selected-color-explanation [data-map-layer-step='tier']").click()
            page.wait_for_function("() => document.querySelector('#county-layer-summary')?.innerText.toLowerCase().includes('color: neutral tier')")
            page.locator(".selected-color-explanation [data-selected-color-question='score']").click()
            page.wait_for_function("() => document.querySelector('#inquiry-panel')?.classList.contains('active')")
            page.wait_for_selector("#inquiry-answer .selected-color-answer", timeout=10_000)
            selected_color_answer_text = page.locator("#inquiry-answer").inner_text(timeout=5_000).lower()
            assert "score color" in selected_color_answer_text
            assert "selected color lens" in selected_color_answer_text
            assert "publication boundary" in selected_color_answer_text
            assert "browser model calls" in selected_color_answer_text
            page.locator("[data-tab='map']").click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.get_by_label("Official geography visible layers").get_by_label("Ontology links").check()
            page.locator("#map-panel .disclosure-control [data-disclosure='unit']").click()
            page.wait_for_selector(".geo-peer-explainer", timeout=10_000)
            peer_explainer_text = page.locator(".geo-peer-explainer").inner_text(timeout=5_000).lower()
            assert "peer link explainer" in peer_explainer_text
            assert "topic lens" in peer_explainer_text
            assert "scale lens" in peer_explainer_text
            assert "aggregate navigation cues" in peer_explainer_text
            assert "not establish legal authority" in peer_explainer_text
            page.wait_for_selector(".topic-playback-presets-card [data-topic-playback-action='map'][data-topic-playback-topic]", timeout=10_000)
            topic_playback_text = page.locator(".topic-playback-presets-card").inner_text(timeout=5_000).lower()
            assert "topic playback presets" in topic_playback_text
            assert "released locus topic" in topic_playback_text
            assert "no ordinance text" in topic_playback_text
            page.locator(".topic-playback-presets-card [data-topic-playback-action='map'][data-topic-playback-topic]").first.click()
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            topic_playback_highlight_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "topic playback preset" in topic_playback_highlight_text
            assert "no browser-side grok call" in topic_playback_highlight_text
            page.wait_for_selector(".map-question-tier-summary [data-map-highlight-tier-summary]", timeout=10_000)
            tier_summary_text = page.locator(".map-question-tier-summary").inner_text(timeout=5_000).lower()
            assert "question result tier summary" in tier_summary_text
            assert "neutral tier bands" in tier_summary_text
            assert "not rankings" in tier_summary_text
            page.wait_for_selector(".map-question-signal-summary [data-map-highlight-signal='score']", timeout=10_000)
            page.wait_for_selector(".map-question-signal-summary [data-map-highlight-signal='audit']", timeout=10_000)
            signal_summary_text = page.locator(".map-question-signal-summary").inner_text(timeout=5_000).lower()
            assert "question result score and audit signals" in signal_summary_text
            assert "direction is unverified" in signal_summary_text
            assert "review cues" in signal_summary_text
            page.wait_for_selector(".map-question-law-location-trail .map-question-law-location-step", timeout=10_000)
            law_location_text = page.locator(".map-question-law-location-trail").inner_text(timeout=5_000).lower()
            assert "county/town law-location route" in law_location_text
            assert "tier-colored aggregate units" in law_location_text
            assert "not legal coverage findings" in law_location_text
            assert page.locator(".map-unit.inquiry-hit").count() > 0

            page.wait_for_selector(".frontdoor-tier-route .frontdoor-tier-route-actions [data-frontdoor-tier-route-action='map']", timeout=10_000)
            tier_route_text = page.locator(".frontdoor-tier-route").inner_text(timeout=5_000).lower()
            assert "law-tier concentration route" in tier_route_text
            assert "where are" in tier_route_text
            assert "county/town map" in tier_route_text
            assert "no ordinance text" in tier_route_text
            page.locator(".frontdoor-tier-route .frontdoor-tier-route-actions [data-frontdoor-tier-route-action='map']").first.click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            tier_route_highlight_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "front-door law-tier concentration route" in tier_route_highlight_text
            assert "no browser-side grok call" in tier_route_highlight_text
            page.wait_for_selector(".map-question-law-location-trail .map-question-law-location-step", timeout=10_000)

            page.wait_for_selector(".frontdoor-grok-pack-card [data-frontdoor-grok-pack-card]", timeout=10_000)
            grok_pack_text = page.locator(".frontdoor-grok-pack-card").inner_text(timeout=5_000).lower()
            assert "grok-refreshed inquiry pack" in grok_pack_text
            assert "offline analysis routes" in grok_pack_text
            assert "county/town map" in grok_pack_text
            assert "no row text" in grok_pack_text
            assert "browser model calls" in grok_pack_text
            assert "county/town route preview" in grok_pack_text
            assert page.locator(".frontdoor-grok-pack-card .ai-route-mini-map svg").count() > 0
            page.wait_for_selector(".frontdoor-grok-pack-card [data-ai-route-mini-unit]", timeout=10_000)
            frontdoor_mini_unit = page.locator(".frontdoor-grok-pack-card [data-ai-route-mini-unit]").first
            frontdoor_mini_unit_id = frontdoor_mini_unit.get_attribute("data-ai-route-mini-unit")
            assert frontdoor_mini_unit_id
            frontdoor_mini_unit.scroll_into_view_if_needed()
            frontdoor_mini_unit.click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_function("() => document.querySelector('#county-layer-detail')?.innerText.toLowerCase().includes('tier')")
            frontdoor_mini_detail_text = page.locator("#county-layer-detail").inner_text(timeout=5_000).lower()
            assert "law" in frontdoor_mini_detail_text
            assert "tier" in frontdoor_mini_detail_text

            page.wait_for_selector("[data-frontdoor-composer] #frontdoor-question-input", timeout=10_000)
            page.locator("#frontdoor-question-input").fill("Where are zoning enforcement laws in cities?")
            page.locator("[data-frontdoor-composer-action='preview']").click()
            composer_text = page.locator(".frontdoor-question-composer").inner_text(timeout=5_000)
            assert "Topic Zoning" in composer_text
            assert "Function Enforcement" in composer_text
            assert "ontology-backed route" in composer_text.lower()
            assert "Topic: Zoning" in composer_text
            assert "Function: Enforcement" in composer_text
            assert "State IN" not in composer_text
            assert "no ordinance text" in composer_text.lower()
            page.wait_for_selector(".frontdoor-route-preview-strip [data-frontdoor-route-preview='tier']", timeout=10_000)
            page.wait_for_selector(".frontdoor-route-preview-strip [data-frontdoor-route-preview='score']", timeout=10_000)
            page.wait_for_selector(".frontdoor-route-preview-strip [data-frontdoor-route-preview='audit']", timeout=10_000)
            page.wait_for_selector(".frontdoor-route-preview-strip [data-frontdoor-route-preview='ontology']", timeout=10_000)
            route_preview_text = page.locator(".frontdoor-route-preview-strip").inner_text(timeout=5_000).lower()
            assert "ask this map result routes" in route_preview_text
            assert "score lens" in route_preview_text
            assert "audit lens" in route_preview_text
            assert "no ordinance text" in route_preview_text
            page.wait_for_selector(".frontdoor-story-packet [data-frontdoor-story-action='export']", timeout=10_000)
            story_text = page.locator(".frontdoor-story-packet").inner_text(timeout=5_000).lower()
            assert "visual story packet" in story_text
            assert "ask -> map -> ontology" in story_text
            assert "no text" in story_text
            assert "browser model calls" in story_text
            with page.expect_download() as story_download_info:
                page.locator(".frontdoor-story-packet [data-frontdoor-story-action='export']").click()
            story_download = story_download_info.value
            assert story_download.suggested_filename == "evolocus-visual-story-packet.json"
            story_payload = json.loads(Path(story_download.path()).read_text(encoding="utf-8"))
            assert story_payload["schema_version"] == "evolocus-visual-story-packet-v1"
            assert story_payload["story_mode"] == "Ask -> Map -> Ontology"
            assert story_payload["publication_policy"]["ordinance_text_included"] is False
            assert story_payload["publication_policy"]["answer_text_included"] is False
            assert story_payload["publication_policy"]["route_only"] is True
            assert story_payload["map_route"]["previewed_from_typed_question"] is True
            assert story_payload["ontology_route"]["schema_version"] == "evolocus-question-ontology-route-v1"
            assert "answer_excerpt" not in story_payload
            page.locator(".frontdoor-story-packet [data-frontdoor-story-action='save']").click()
            page.wait_for_selector(".frontdoor-saved-route.story [data-frontdoor-route-action='map']", timeout=10_000)
            story_route_text = page.locator(".frontdoor-saved-route.story").first.inner_text(timeout=5_000).lower()
            assert "story packet" in story_route_text
            assert "where are zoning enforcement laws in cities" in story_route_text
            page.once("dialog", lambda dialog: dialog.accept())
            page.locator("[data-frontdoor-import-story]").set_input_files(story_download.path())
            page.wait_for_selector(".frontdoor-imported-story [data-frontdoor-imported-story-action='map']", timeout=10_000)
            imported_story_text = page.locator(".frontdoor-imported-story").inner_text(timeout=5_000).lower()
            assert "imported story ready" in imported_story_text
            assert "no text" in imported_story_text
            assert "no text, locators, answers, reviews, or secrets" in imported_story_text
            saved_story_routes_text = page.locator(".frontdoor-saved-routes").inner_text(timeout=5_000).lower()
            assert "story packet" in saved_story_routes_text
            page.locator(".frontdoor-imported-story [data-frontdoor-imported-story-action='map']").click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            story_highlight_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "imported visual story packet" in story_highlight_text
            assert "no browser-side grok call" in story_highlight_text
            assert page.locator(".map-unit.inquiry-hit").count() > 0
            page.locator("[data-frontdoor-composer-action='save']").click()
            page.wait_for_selector(".frontdoor-saved-route [data-frontdoor-route-action='ontology']", timeout=10_000)
            saved_route_text = page.locator(".frontdoor-saved-routes").inner_text(timeout=5_000)
            assert "saved visual routes" in saved_route_text.lower()
            assert "no ordinance text" in saved_route_text.lower()
            page.locator(".frontdoor-saved-route [data-frontdoor-route-action='share-map']").first.click()
            page.wait_for_selector(".frontdoor-route-share-card input", timeout=10_000)
            share_card_text = page.locator(".frontdoor-route-share-card").inner_text(timeout=5_000).lower()
            assert "shareable route link" in share_card_text
            assert "content-free" in share_card_text
            share_map_url = page.locator(".frontdoor-route-share-card input").input_value(timeout=5_000)
            assert "?route=" in share_map_url
            page.goto(share_map_url, wait_until="networkidle")
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            shared_map_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "shareable aggregate route url" in shared_map_text
            assert "no browser-side grok call" in shared_map_text
            assert page.locator(".map-unit.inquiry-hit").count() > 0
            page.locator(".frontdoor-saved-route [data-frontdoor-route-action='share-ontology']").first.click()
            page.wait_for_selector(".frontdoor-route-share-card input", timeout=10_000)
            share_ontology_url = page.locator(".frontdoor-route-share-card input").input_value(timeout=5_000)
            assert "?route=" in share_ontology_url
            page.goto(share_ontology_url, wait_until="networkidle")
            page.wait_for_function("() => document.querySelector('#ontology-panel')?.classList.contains('active')")
            page.wait_for_selector("#ontology-panel .question-ontology-route", timeout=10_000)
            shared_ontology_text = page.locator("#ontology-panel .question-ontology-route").first.inner_text(timeout=5_000).lower()
            assert "ontology-backed route" in shared_ontology_text
            assert "no row text" in shared_ontology_text
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
            assert export_payload["routes"][0]["ontology_route"]["schema_version"] == "evolocus-question-ontology-route-v1"
            assert export_payload["routes"][0]["ontology_route"]["publication_policy"]["ordinance_text_included"] is False
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
            page.wait_for_selector("#ontology-panel .question-ontology-route", timeout=10_000)
            imported_ontology_text = page.locator("#ontology-panel .question-ontology-route").first.inner_text(timeout=5_000).lower()
            assert "ontology-backed route" in imported_ontology_text
            assert "no row text" in imported_ontology_text
            assert "browser model calls" in imported_ontology_text

            page.locator("[data-tab='inquiry']").click()
            page.wait_for_selector(".ai-analysis-pack [data-ai-analysis-card][data-ai-analysis-action='map']", timeout=10_000)
            ai_pack_text = page.locator(".ai-analysis-pack").inner_text(timeout=5_000).lower()
            assert "offline ai analysis pack" in ai_pack_text
            assert "ask, color, and graph the current aggregate analysis" in ai_pack_text
            assert "county/town route preview" in ai_pack_text
            assert "open the full map" in ai_pack_text
            assert "no ordinance text" in ai_pack_text
            assert page.locator(".ai-analysis-pack .ai-route-mini-map svg").count() > 0
            page.wait_for_selector(".ai-analysis-pack [data-ai-route-mini-unit]", timeout=10_000)
            ai_pack_mini_unit = page.locator(".ai-analysis-pack [data-ai-route-mini-unit]").first
            ai_pack_mini_unit_id = ai_pack_mini_unit.get_attribute("data-ai-route-mini-unit")
            assert ai_pack_mini_unit_id
            ai_pack_mini_unit.scroll_into_view_if_needed()
            ai_pack_mini_unit.click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_function("() => document.querySelector('#county-layer-detail')?.innerText.toLowerCase().includes('tier')")
            ai_pack_mini_detail_text = page.locator("#county-layer-detail").inner_text(timeout=5_000).lower()
            assert "law" in ai_pack_mini_detail_text
            assert "tier" in ai_pack_mini_detail_text
            page.locator("[data-tab='inquiry']").click()
            page.wait_for_selector(".ai-analysis-pack [data-ai-analysis-card][data-ai-analysis-action='map']", timeout=10_000)
            page.locator(".ai-analysis-pack [data-ai-analysis-card][data-ai-analysis-action='map']").first.click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            ai_pack_highlight_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "offline ai analysis pack" in ai_pack_highlight_text
            assert "no browser-side grok call" in ai_pack_highlight_text
            assert page.locator(".map-unit.inquiry-hit").count() > 0

            page.locator("[data-tab='results']").click()
            page.wait_for_selector(".chart-route-legend-card [data-chart-route-action='map']", timeout=10_000)
            assert page.locator("#results-panel").evaluate("element => element.classList.contains('active')")
            page.locator(".chart-route-legend-card [data-chart-route-action='share-map']").click()
            page.wait_for_selector(".chart-route-share-card input", timeout=10_000)
            chart_share_text = page.locator(".chart-route-share-card").inner_text(timeout=5_000).lower()
            assert "shareable chart/filter route" in chart_share_text
            assert "content-free" in chart_share_text
            chart_share_map_url = page.locator(".chart-route-share-card input").input_value(timeout=5_000)
            assert "?route=" in chart_share_map_url
            page.goto(chart_share_map_url, wait_until="networkidle")
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            chart_shared_map_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "shareable aggregate route url" in chart_shared_map_text
            assert "no browser-side grok call" in chart_shared_map_text
            page.locator("[data-tab='results']").click()
            page.wait_for_selector(".chart-route-legend-card [data-chart-route-action='share-graph']", timeout=10_000)
            page.locator(".chart-route-legend-card [data-chart-route-action='share-graph']").click()
            page.wait_for_selector(".chart-route-share-card input", timeout=10_000)
            chart_share_graph_url = page.locator(".chart-route-share-card input").input_value(timeout=5_000)
            assert "?route=" in chart_share_graph_url
            page.goto(chart_share_graph_url, wait_until="networkidle")
            page.wait_for_function("() => document.querySelector('#ontology-panel')?.classList.contains('active')")
            page.wait_for_selector("#ontology-panel .question-ontology-route", timeout=10_000)
            chart_shared_graph_text = page.locator("#ontology-panel .question-ontology-route").first.inner_text(timeout=5_000).lower()
            assert "ontology-backed route" in chart_shared_graph_text
            assert "no row text" in chart_shared_graph_text
            page.locator("[data-tab='results']").click()
            page.wait_for_selector(".chart-route-legend-card [data-chart-route-action='map']", timeout=10_000)

            page.locator("[data-chart-route-action='map']").click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            chart_brush_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "chat-to-map highlight" in chart_brush_text
            assert "charts tab brush" in chart_brush_text
            assert "no browser-side grok call" in chart_brush_text
            assert page.locator(".map-unit.inquiry-hit").count() > 0
            page.wait_for_selector(".map-tier-drilldown [data-map-tier-drilldown='filter']", timeout=10_000)
            tier_drilldown_text = page.locator(".map-tier-drilldown").inner_text(timeout=5_000).lower()
            assert "county/town tier color drilldown" in tier_drilldown_text
            assert "explain the visible map colors" in tier_drilldown_text
            assert "not rankings" in tier_drilldown_text
            page.locator(".map-tier-drilldown [data-map-tier-drilldown='filter']").first.click()
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            tier_drilldown_highlight_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "map tier legend drilldown" in tier_drilldown_highlight_text
            assert "no browser-side grok call" in tier_drilldown_highlight_text
            page.wait_for_selector(".map-cross-filter-legend [data-map-cross-filter='function']", timeout=10_000)
            cross_filter_text = page.locator(".map-cross-filter-legend").inner_text(timeout=5_000).lower()
            assert "cross-filter legend" in cross_filter_text
            assert "not legal findings" in cross_filter_text
            page.locator(".map-cross-filter-legend [data-map-cross-filter='function']").first.click()
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            cross_filter_highlight_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "map cross-filter legend" in cross_filter_highlight_text
            assert "no browser-side grok call" in cross_filter_highlight_text
            assert page.locator(".map-unit.inquiry-hit").count() > 0
            page.wait_for_selector(".selected-ontology-answer-cards [data-selected-ontology-answer-card='topic'][data-selected-ontology-answer-action='map']:not([disabled])", timeout=10_000)
            answer_cards_text = page.locator(".selected-ontology-answer-cards").inner_text(timeout=5_000).lower()
            assert "county/town ontology answer cards" in answer_cards_text
            assert "ask this color mark through aggregate graph lenses" in answer_cards_text
            assert "no ordinance text" in answer_cards_text
            page.locator(".selected-ontology-answer-cards [data-selected-ontology-answer-card='topic'][data-selected-ontology-answer-action='map']:not([disabled])").first.click()
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            answer_card_highlight_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "selected-unit ontology answer card" in answer_card_highlight_text
            assert "no browser-side grok call" in answer_card_highlight_text
            assert page.locator(".map-unit.inquiry-hit").count() > 0
            page.wait_for_selector(".selected-ontology-query-drawer [data-selected-ontology-query='topic']:not([disabled])", timeout=10_000)
            query_drawer_text = page.locator(".selected-ontology-query-drawer").inner_text(timeout=5_000).lower()
            assert "county/town ontology query drawer" in query_drawer_text
            assert "no ordinance text" in query_drawer_text
            assert "legal findings" in query_drawer_text
            page.locator(".selected-ontology-query-drawer [data-selected-ontology-query='topic']:not([disabled])").first.click()
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            query_drawer_highlight_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "selected-unit ontology query drawer" in query_drawer_highlight_text
            assert "no browser-side grok call" in query_drawer_highlight_text
            assert page.locator(".map-unit.inquiry-hit").count() > 0
            page.wait_for_selector(".selected-peer-comparison-drawer [data-map-compare-unit]", timeout=10_000)
            peer_drawer_text = page.locator(".selected-peer-comparison-drawer").first.inner_text(timeout=5_000).lower()
            assert "county/town peer comparison drawer" in peer_drawer_text
            assert "rows compare aggregate map units only" in peer_drawer_text
            assert "no ordinance text" in peer_drawer_text
            assert "legal findings" in peer_drawer_text
            page.locator(".selected-peer-comparison-drawer [data-map-compare-unit]").first.click()
            page.wait_for_selector(".selected-query-replay", timeout=10_000)
            peer_drawer_after_click = page.locator(".selected-peer-comparison-drawer").first.inner_text(timeout=5_000).lower()
            assert "county/town peer comparison drawer" in peer_drawer_after_click
            assert "aggregate ontology peers" in peer_drawer_after_click
            page.wait_for_selector(".selected-route-comparison-overlay [data-route-comparison-peer]", timeout=10_000)
            route_comparison_text = page.locator(".selected-route-comparison-overlay").first.inner_text(timeout=5_000).lower()
            assert "ontology route comparison overlay" in route_comparison_text
            assert "selected unit" in route_comparison_text
            assert "peer unit" in route_comparison_text
            assert "not a ranking" in route_comparison_text
            assert "no ordinance text" in route_comparison_text
            assert "source locators" in route_comparison_text
            page.locator(".selected-route-comparison-overlay [data-route-comparison-peer]").first.click()
            page.wait_for_selector(".selected-query-replay", timeout=10_000)
            route_comparison_after_click = page.locator(".selected-route-comparison-overlay").first.inner_text(timeout=5_000).lower()
            assert "strongest aggregate peer" in route_comparison_after_click
            page.locator(".selected-route-comparison-overlay [data-route-comparison-ontology]").first.click()
            page.wait_for_function("() => document.querySelector('#ontology-panel')?.classList.contains('active')")
            page.locator("[data-tab='map']").click()
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
            page.wait_for_selector(".model-import-status-card [data-model-status-action='score']", timeout=10_000)
            model_status_text = page.locator(".model-import-status-card").inner_text(timeout=5_000).lower()
            assert "model import status" in model_status_text
            assert "released model outputs" in model_status_text
            assert "not browser inference" in model_status_text
            assert "score direction" in model_status_text
            assert "model cards are pending verification" in model_status_text
            page.locator(".model-import-status-card [data-model-status-action='score']").click()
            page.wait_for_function("() => document.querySelector('#score-panel')?.classList.contains('active')")
            page.locator("[data-tab='ontology']").click()
            page.wait_for_selector(".model-import-status-card [data-model-status-action='ask']", timeout=10_000)

            page.locator("[data-tab='results']").click()
            page.wait_for_selector(".chart-question-chip-card [data-chart-question-chip]", timeout=10_000)
            chart_chip_text = page.locator(".chart-question-chip-card").inner_text(timeout=5_000).lower()
            assert "chart-to-chat question chips" in chart_chip_text
            assert "reusable questions from current aggregate charts" in chart_chip_text
            assert "no browser model" in chart_chip_text
            page.locator(".chart-question-chip-card [data-chart-question-share]").first.click()
            page.wait_for_selector(".chart-route-share-card input", timeout=10_000)
            chart_chip_share_url = page.locator(".chart-route-share-card input").input_value(timeout=5_000)
            assert "?route=" in chart_chip_share_url
            page.goto(chart_chip_share_url, wait_until="networkidle")
            page.wait_for_function("() => document.querySelector('#inquiry-panel')?.classList.contains('active')")
            chart_chip_shared_answer = page.locator("#inquiry-answer").inner_text(timeout=5_000).lower()
            assert "shareable aggregate route url" in chart_chip_shared_answer
            assert "no browser model call" in chart_chip_shared_answer
            page.locator("[data-tab='results']").click()
            page.wait_for_selector(".chart-question-chip-card [data-chart-question-chip]", timeout=10_000)
            page.locator(".chart-question-chip-card [data-chart-question-chip]").first.click()
            page.wait_for_function("() => document.querySelector('#inquiry-panel')?.classList.contains('active')")
            page.wait_for_selector("#inquiry-answer .inquiry-answer-freshness", timeout=10_000)
            chart_chip_answer_text = page.locator("#inquiry-answer").inner_text(timeout=5_000).lower()
            assert "answer provenance" in chart_chip_answer_text
            assert "no browser model call" in chart_chip_answer_text
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
            page.wait_for_selector("#inquiry-answer .inquiry-answer-filter-chip", timeout=10_000)
            normalized_answer_text = page.locator("#inquiry-answer").inner_text(timeout=5_000).lower()
            assert "answer ontology filter chips" in normalized_answer_text
            assert "progressively narrow the county/town map" in normalized_answer_text
            assert "chips apply aggregate topic/function/tier/unit context" in normalized_answer_text
            page.wait_for_selector("#inquiry-answer .inquiry-answer-map-cards [data-inquiry-answer-map-action='highlight']", timeout=10_000)
            answer_map_text = page.locator("#inquiry-answer .inquiry-answer-map-cards").first.inner_text(timeout=5_000).lower()
            assert "question-to-map answer cards" in answer_map_text
            assert "color counties and towns from this answer" in answer_map_text
            assert "tier color explanation" in answer_map_text
            assert "no row text" in answer_map_text
            page.locator("#inquiry-answer .inquiry-answer-map-cards [data-inquiry-answer-map-action='highlight']").first.click()
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            answer_card_highlight_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "question-to-map answer card" in answer_card_highlight_text
            assert "no browser-side grok call" in answer_card_highlight_text
            assert page.locator(".map-unit.inquiry-hit").count() > 0
            page.wait_for_selector(".map-question-highlight-depth [data-map-highlight-depth-stage='score']", timeout=10_000)
            depth_text = page.locator(".map-question-highlight-depth").inner_text(timeout=5_000).lower()
            assert "question-to-map ontology highlight depth" in depth_text
            assert "topic route" in depth_text
            assert "score profile route" in depth_text
            assert "no row text" in depth_text
            page.locator(".map-question-highlight-depth [data-map-highlight-depth-stage='score']").click()
            page.wait_for_function("() => document.querySelector('#score-panel')?.classList.contains('active')")
            page.locator("[data-tab='map']").click()
            page.wait_for_selector(".map-question-highlight-depth [data-map-highlight-depth-stage='ontology']", timeout=10_000)
            page.wait_for_selector(".map-question-highlight-detail-card [data-unit-id]", timeout=10_000)
            detail_card_text = page.locator(".map-question-highlight-detail-card").first.inner_text(timeout=5_000).lower()
            assert "why this unit matched" in detail_card_text
            assert "not evidence that a law controls" in detail_card_text
            assert "highlighted-unit ontology trace" in detail_card_text
            assert "aggregate route nodes only" in detail_card_text
            assert "not legal authority" in detail_card_text
            assert "rows" in detail_card_text
            page.locator(".map-question-highlight-detail-card [data-unit-id]").first.click()
            page.wait_for_selector(".selected-query-replay", timeout=10_000)
            page.locator("[data-tab='inquiry']").click()
            page.wait_for_function("() => document.querySelector('#inquiry-panel')?.classList.contains('active')")
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
            page.wait_for_selector(".inquiry-route-comparison-card .inquiry-route-stage-strip", timeout=10_000)
            comparison_text = page.locator(".inquiry-route-comparison").inner_text(timeout=5_000)
            assert "route comparison" in comparison_text.lower()
            assert "browser-local saved question paths" in comparison_text.lower()
            assert "map-to-inquiry route ladder" in comparison_text.lower()
            assert "map color" in comparison_text.lower()
            assert "selected unit" in comparison_text.lower()
            assert "boundary" in comparison_text.lower()
            assert "no text, locators, review events, or browser model calls" in comparison_text.lower()
            assert "not legal rankings" in comparison_text.lower()
            page.locator(".inquiry-route-comparison-card [data-open-inquiry-log-ontology]").first.click()
            page.wait_for_function("() => document.querySelector('#ontology-panel')?.classList.contains('active')")

            page.locator("[data-tab='results']").click()
            page.wait_for_selector(".chart-route-legend-card [data-chart-route-action='graph']", timeout=10_000)
            page.locator("[data-chart-route-action='graph']").click()
            page.wait_for_function("() => document.querySelector('#ontology-panel')?.classList.contains('active')")
            page.wait_for_selector(".ontology-tier-neighborhood [data-tier-neighborhood-map]", timeout=10_000)
            page.wait_for_selector(".ontology-tier-drilldown [data-tier-drilldown-action='ask']", timeout=10_000)
            tier_drilldown_text = page.locator(".ontology-tier-drilldown").inner_text(timeout=5_000).lower()
            assert "county/town tier drilldown" in tier_drilldown_text
            assert "aggregate units" in tier_drilldown_text
            assert "not legal coverage findings" in tier_drilldown_text
            assert "claims that a law controls a place" in tier_drilldown_text
            page.wait_for_selector(".ontology-tier-drilldown [data-tier-drilldown-action='share-map']", timeout=10_000)
            page.wait_for_selector(".ontology-tier-drilldown [data-tier-drilldown-action='share-ask']", timeout=10_000)
            page.locator(".ontology-tier-drilldown [data-tier-drilldown-action='share-map']").click()
            page.wait_for_selector(".ontology-tier-share-card input", timeout=10_000)
            tier_share_card_text = page.locator(".ontology-tier-share-card").inner_text(timeout=5_000).lower()
            assert "shareable tier drilldown route" in tier_share_card_text
            assert "content-free" in tier_share_card_text
            tier_share_map_url = page.locator(".ontology-tier-share-card input").input_value(timeout=5_000)
            assert "?route=" in tier_share_map_url
            page.locator(".ontology-tier-drilldown [data-tier-drilldown-action='share-ask']").click()
            page.wait_for_function(
                "(previous) => document.querySelector('.ontology-tier-share-card input')?.value !== previous",
                arg=tier_share_map_url,
            )
            tier_share_ask_url = page.locator(".ontology-tier-share-card input").input_value(timeout=5_000)
            assert "?route=" in tier_share_ask_url
            assert tier_share_ask_url != tier_share_map_url
            page.locator(".ontology-tier-drilldown [data-tier-drilldown-action='ask']").click()
            page.wait_for_function("() => document.querySelector('#inquiry-panel')?.classList.contains('active')")
            tier_drilldown_answer_text = page.locator("#inquiry-answer").inner_text(timeout=5_000).lower()
            assert "ontology county/town tier drilldown" in tier_drilldown_answer_text
            assert "aggregate metadata only" in tier_drilldown_answer_text
            page.locator("[data-tab='ontology']").click()
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
            page.goto(tier_share_map_url, wait_until="networkidle")
            page.wait_for_function("() => document.querySelector('#map-panel')?.classList.contains('active')")
            page.wait_for_selector(".map-question-highlight-card [data-clear-inquiry-map-highlight]", timeout=10_000)
            tier_shared_map_text = page.locator(".map-question-highlight-card").inner_text(timeout=5_000).lower()
            assert "shareable aggregate route url" in tier_shared_map_text
            assert "no browser-side grok call" in tier_shared_map_text
            assert page.locator(".map-unit.inquiry-hit").count() > 0
            page.goto(tier_share_ask_url, wait_until="networkidle")
            page.wait_for_function("() => document.querySelector('#inquiry-panel')?.classList.contains('active')")
            tier_shared_ask_text = page.locator("#inquiry-answer").inner_text(timeout=5_000).lower()
            assert "shareable aggregate route url" in tier_shared_ask_text
            assert "aggregate metadata only" in tier_shared_ask_text
            assert "no browser model call" in tier_shared_ask_text

            assert errors == []
        finally:
            browser.close()
