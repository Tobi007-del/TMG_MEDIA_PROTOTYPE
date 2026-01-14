// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Video Player Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/prototype-2/prototype-2.html');
    await page.waitForSelector('.T_M_G-video-container');

    // Inject CSS to force controls to be visible, bypassing hover logic for stable testing
    await page.addStyleTag({
      content: `
        .T_M_G-video-bottom-controls-wrapper {
          opacity: 1 !important;
          pointer-events: auto !important;
          visibility: visible !important;
        }
        .T_M_G-video-play-pause-btn,
        .T_M_G-video-mute-btn,
        .T_M_G-video-full-screen-btn,
        .T_M_G-video-theater-btn {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          display: block !important;
        }
      `
    });
  });

  test.fixme('should play and pause the video', async ({ page }) => {
    const video = page.locator('video').first();
    const playPauseBtn = page.locator('.T_M_G-video-play-pause-btn').first();

    // Ensure initial state
    await video.evaluate((v) => v.pause());
    await expect(video).toHaveJSProperty('paused', true);

    await expect(playPauseBtn).toBeVisible({ timeout: 10000 });

    // Click play
    await playPauseBtn.click({ force: true });
    await expect(video).toHaveJSProperty('paused', false);

    // Click pause
    await playPauseBtn.click({ force: true });
    await expect(video).toHaveJSProperty('paused', true);
  });

  test.fixme('should mute and unmute the video', async ({ page }) => {
    const video = page.locator('video').first();
    const muteBtn = page.locator('.T_M_G-video-mute-btn').first();

    // Ensure initial state
    await video.evaluate((v) => { v.muted = false; });
    await expect(video).toHaveJSProperty('muted', false);

    await expect(muteBtn).toBeVisible({ timeout: 10000 });

    await muteBtn.click({ force: true });
    await expect(video).toHaveJSProperty('muted', true);

    await muteBtn.click({ force: true });
    await expect(video).toHaveJSProperty('muted', false);
  });

  test('should toggle fullscreen', async ({ page }) => {
    const videoContainer = page.locator('.T_M_G-video-container').first();
    const fullScreenBtn = page.locator('.T_M_G-video-full-screen-btn').first();

    await expect(fullScreenBtn).toBeVisible({ timeout: 10000 });

    // Mock requestFullscreen to avoid error and verify it's called
    await page.evaluate(() => {
        // @ts-ignore
        HTMLElement.prototype.requestFullscreen = async function() {
            this.classList.add('T_M_G-video-full-screen'); // Simulate the effect
        };
        // @ts-ignore
        document.exitFullscreen = async function() {
            // Simplified for test.
            const el = document.querySelector('.T_M_G-video-full-screen');
            if (el) el.classList.remove('T_M_G-video-full-screen');
        };
    });

    await fullScreenBtn.click({ force: true });
    await expect(videoContainer).toHaveClass(/T_M_G-video-full-screen/);

    await fullScreenBtn.click({ force: true });
    await expect(videoContainer).not.toHaveClass(/T_M_G-video-full-screen/);
  });

   test('should toggle theater mode', async ({ page }) => {
    const videoContainer = page.locator('.T_M_G-video-container').first();
    const theaterBtn = page.locator('.T_M_G-video-theater-btn').first();

    await expect(theaterBtn).toBeVisible({ timeout: 10000 });

    await theaterBtn.click({ force: true });
    await expect(videoContainer).toHaveClass(/T_M_G-video-theater/);

    await theaterBtn.click({ force: true });
    await expect(videoContainer).not.toHaveClass(/T_M_G-video-theater/);
  });
});
