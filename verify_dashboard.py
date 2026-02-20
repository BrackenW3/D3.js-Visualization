from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"Page Error: {exc}"))

        # Get absolute path to the file
        cwd = os.getcwd()
        file_path = f"file://{cwd}/examples/dashboard/index.html"

        print(f"Navigating to {file_path}")
        page.goto(file_path)

        # Wait for charts to render (animation takes 2s)
        # Increase wait time to 5s
        page.wait_for_timeout(5000)

        # Take screenshot of light mode
        page.screenshot(path="verification_dashboard_light.png", full_page=True)
        print("Screenshot saved to verification_dashboard_light.png")

        browser.close()

if __name__ == "__main__":
    run()
