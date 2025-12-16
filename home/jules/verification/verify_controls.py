from playwright.sync_api import sync_playwright

def verify_controls():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000/prototype-2/prototype-2.html")

        # Wait for player to initialize
        page.wait_for_selector(".T_M_G-video-container", timeout=10000)

        # Screenshot initial state
        page.screenshot(path="/home/jules/verification/initial_state.png")

        # Check if play button exists
        # There are multiple video players on the page, so multiple controls. We take the first one.
        play_btn = page.locator(".T_M_G-video-play-pause-btn").first

        if play_btn.is_visible():
            print("Play button visible")
        else:
            print("Play button NOT visible")
            # If not visible, maybe it's obscured or not in the viewport, or waiting for something.
            # But tests say it is "hidden".

        # Try to click play
        try:
            # Force click if needed, or wait
            play_btn.click(timeout=5000)
            page.screenshot(path="/home/jules/verification/playing_state.png")
            print("Clicked play")
        except Exception as e:
            print(f"Failed to click play: {e}")

        browser.close()

if __name__ == "__main__":
    verify_controls()
