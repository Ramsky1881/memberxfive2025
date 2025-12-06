
from playwright.sync_api import sync_playwright
import os

def run():
    cwd = os.getcwd()
    file_path = f'file://{cwd}/admin.html'

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Set a large viewport to ensure sidebar is visible
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        print(f'Navigating to {file_path}')
        page.goto(file_path)

        # Bypass Login
        print('Bypassing login...')
        page.evaluate("""
            document.getElementById('login-overlay').classList.add('hidden');
            document.getElementById('dashboard-content').classList.remove('hidden');
            // Trigger initDashboard since we skipped the grantAccess() call
            // We need to access the function if it's global, but it's inside DOMContentLoaded closure.
            // However, the elements are there. The stats might be empty but we care about UI structure.
            // Actually, initDashboard is inside the closure.
            // So we might need to rely on the fact that 'members' and 'blacklistMembers' are global.
            // We can try to trigger the render manually if needed, or just inspect the HTML structure.
            // But wait, if initDashboard isn't called, the table is empty.
            // Since the code is in a closure, we can't easily call initDashboard.
            // BUT, we can simulate the 'grantAccess' behavior if we can mock the fetch response?
            // No, easiest is to just see if we can expose initDashboard or copy-paste the render logic?
            // Actually, let's just inspect the DOM. The elements are there.
            // The tables will be empty because renderTable() wasn't called.
            // However, the user wants to see the layout.
            // Better yet, I can modify the page content to call initDashboard? No, it's local.

            // Let's try to verify the UI structure (buttons, headers) even if tables are empty.
            // Or, we can modify admin.js temporarily? No.

            // Wait, I can trigger the render by dispatching an event? No.

            // Is there any way to access the closure? No.
            // But I can define the render functions in the evaluate block and run them?
            // That's too much code duplication.

            // Alternative: The tables are empty, but I can check if the 'Add' buttons work and the 'Blacklist' section appears.
            // The click listeners for Nav are set up in DOMContentLoaded, so they should work.
        """)

        # 1. Take a screenshot of the dashboard
        page.screenshot(path='verification/1_dashboard_bypassed.png')

        # 2. Click on the Blacklist Sidebar Link
        print('Clicking Blacklist nav link...')
        page.click('#nav-blacklist')

        # Wait for the blacklist section to be visible
        page.wait_for_selector('#section-blacklist')

        # Take a screenshot of the Blacklist section
        page.screenshot(path='verification/2_blacklist_section.png')

        # 3. Click Add New Blacklist Member
        print('Clicking Add New Blacklist button...')
        page.click('#add-blacklist-btn')

        # Wait for modal
        page.wait_for_selector('#blacklist-modal.active')

        # Take a screenshot of the modal
        page.screenshot(path='verification/3_blacklist_modal.png')

        print('Verification complete.')
        browser.close()

if __name__ == '__main__':
    run()
