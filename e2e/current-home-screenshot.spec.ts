import { test } from '@playwright/test';
import { openApp } from './appReady';

test('captures the current Home dashboard at 390x844', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);
  await page.screenshot({
    path: 'test-results/current-home-390x844.png',
    fullPage: false,
  });
});
