
from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Desktop
        page = browser.new_page(viewport={'width': 1280, 'height': 720})
        print("Navigating to file://" + os.path.abspath("index.html") + " (Desktop)")
        page.goto("file://" + os.path.abspath("index.html"))

        # Wait for preloader to disappear
        try:
            page.wait_for_selector("#preloader", state="hidden", timeout=10000)
        except Exception as e:
            print(f"Warning: Preloader did not disappear: {e}")

        page.screenshot(path="search_desktop_v2.png")
        print("Desktop screenshot saved.")

        # Mobile
        page_mobile = browser.new_page(viewport={'width': 375, 'height': 667}, is_mobile=True)
        print("Navigating to file://" + os.path.abspath("index.html") + " (Mobile)")
        page_mobile.goto("file://" + os.path.abspath("index.html"))

        # Wait for preloader to disappear
        try:
            page_mobile.wait_for_selector("#preloader", state="hidden", timeout=10000)
        except Exception as e:
            print(f"Warning: Preloader did not disappear on mobile: {e}")

        page_mobile.screenshot(path="search_mobile_v2.png")
        print("Mobile screenshot saved.")

        browser.close()

if __name__ == "__main__":
    run()
