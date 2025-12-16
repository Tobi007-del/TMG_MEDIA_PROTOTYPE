// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('/prototype-2/prototype-2.html');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TMG/);
});

test('first video element is present', async ({ page }) => {
  await page.goto('/prototype-2/prototype-2.html');

  // Expect the first video element to be visible
  const video = page.locator('video').first();
  await expect(video).toBeVisible();
});
