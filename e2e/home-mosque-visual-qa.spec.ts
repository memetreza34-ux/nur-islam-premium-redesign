import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

async function waitForMosque(page: import('@playwright/test').Page) {
  const hero = page.locator('.premium-home--v2 .welcome-hero');
  const image = page.locator('.premium-home--v2 .welcome-hero__visual img');
  await expect(hero).toBeVisible();
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((node) => node.complete && node.naturalWidth > 0)).toBe(true);
}

test('capture final Home mosque visibility', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);
  await waitForMosque(page);
  await page.screenshot({ path: 'test-results/home-mosque-final-390x844.png', fullPage: false });

  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload();
  await waitForMosque(page);
  await page.screenshot({ path: 'test-results/home-mosque-final-375x667.png', fullPage: false });
});
