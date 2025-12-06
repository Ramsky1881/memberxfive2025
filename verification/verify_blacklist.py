
from playwright.sync_api import sync_playwright
import os

def run():
    # Get the absolute path to the admin.html file
    cwd = os.getcwd()
    file_path = f'file://{cwd}/admin.html'

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to admin.html
        print(f'Navigating to {file_path}')
        page.goto(file_path)

        # 1. Take a screenshot of the initial dashboard (Active Members)
        page.screenshot(path='verification/1_dashboard_initial.png')

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

        # 4. Fill the form
        print('Filling form...')
        page.fill('#bl-name', 'Test User')
        page.fill('#bl-nickname', 'Tester')
        page.fill('#bl-reason', 'Testing functionality')
        page.fill('#bl-outDate', '2023-01-01')
        page.fill('#bl-duration', '3')

        # Submit
        print('Submitting form...')
        page.click('button[type="submit"]')

        # Wait for modal to close (hidden)
        page.wait_for_selector('#blacklist-modal.hidden')

        # Take a screenshot of the updated table
        page.screenshot(path='verification/4_blacklist_added.png')

        print('Verification complete.')
        browser.close()

if __name__ == '__main__':
    run()
