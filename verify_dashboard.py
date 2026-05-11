from playwright.sync_api import sync_playwright

def run_cuj(page):
    import os
    file_url = f"file://{os.path.abspath('examples/dashboard/index.html')}"
    page.goto(file_url)
    page.wait_for_timeout(1000) # wait for D3 chart initial animations

    # Locate the refresh button
    refresh_btn = page.get_by_role("button", name="Refresh Data")

    # Take screenshot before click
    page.screenshot(path="/home/jules/verification/screenshots/verification_dashboard_before.png")

    # Click it to see the loading feedback
    refresh_btn.click()
    page.wait_for_timeout(100) # wait briefly to capture the immediate UI change

    # The button should now be disabled and say "Refreshing..."
    # Take screenshot during the disabled/refreshing state
    page.screenshot(path="/home/jules/verification/screenshots/verification_dashboard_refreshing.png")

    # Wait for the animation to complete and button to reset
    page.wait_for_timeout(1000)

    # Final state screenshot
    page.screenshot(path="/home/jules/verification/screenshots/verification_dashboard_final.png")
    page.wait_for_timeout(500)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()  # MUST close context to save the video
            browser.close()