
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

        # Initialize dashboard functions (renderCharts etc) if needed,
        # but the JS runs on load. The initDashboard call inside admin.js happens after login.
        # So we should call initDashboard manually.
        # But wait, initDashboard is inside the DOMContentLoaded scope and not global.
        # However, the functions like renderBirthdays are also scoped inside.
        # But we exposed window.setBirthdayMonth which calls renderBirthdays.
        # Let s try to trigger a button click which calls window.setBirthdayMonth.

        # Wait a bit for JS to parse
        page.wait_for_timeout(1000)

        # Locate Birthday Section
        birthday_section = page.locator("div.admin-glass", has_text="BIRTHDAYS:")
        birthday_section.scroll_into_view_if_needed()

        # Click "MAY"
        page.locator("button[title=\"May\"]").click()
        page.wait_for_timeout(500)

        birthday_section.screenshot(path="verification/birthday_ui.png")
        print("Screenshot saved to verification/birthday_ui.png")

        browser.close()

if __name__ == "__main__":
    run()
