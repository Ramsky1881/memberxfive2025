
from playwright.sync_api import sync_playwright
import os

def run():
    cwd = os.getcwd()
    file_path = f"file://{cwd}/dist/admin.html"
    print(f"Navigating to: {file_path}")

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(file_path)

        # Bypass login since backend functions wont work on file://
        page.evaluate("document.getElementById(\"login-overlay\").classList.add(\"hidden\")")
        page.evaluate("document.getElementById(\"dashboard-content\").classList.remove(\"hidden\")")
        page.wait_for_timeout(1000)

        # Open GitHub Modal to verify token input is GONE
        page.locator("#save-github-btn").click()
        page.wait_for_timeout(500)

        modal = page.locator("#github-modal .modal-content")
        modal.screenshot(path="verification/github_modal_v2.png")
        print("Screenshot saved to verification/github_modal_v2.png")

        browser.close()

if __name__ == "__main__":
    run()
