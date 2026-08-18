import { test } from '@playwright/test';
import { openApp } from './appReady';

test('capture final Home mosque visibility', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);
  await page.screenshot({ path: 'test-results/home-mosque-final-390x844.png', fullPage: false });

  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload();
  await page.waitForSelector('.premium-home--v2 .welcome-hero');
  await page.screenshot({ path: 'test-results/home-mosque-final-375x667.png', fullPage: false });
});
