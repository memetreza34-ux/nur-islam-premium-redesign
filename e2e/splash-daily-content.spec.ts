import { expect, test } from '@playwright/test';
import { getDailyAyah } from '../src/data/dailyAyah';
import { prayerRequestFixture } from './fixtures/prayer-api';

const now = new Date('2026-10-10T14:00:00+02:00');
test.use({ serviceWorkers: 'block' });

for (const [name, width, height] of [
  ['small-phone', 320, 568], ['phone', 390, 844], ['tablet', 768, 1024],
  ['desktop', 1280, 720], ['landscape', 568, 320],
] as const) {
  test(`selected doors reveal the mosque and open Home on ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.clock.install({ time: now });
    await page.clock.pauseAt(now);
    await page.route('https://api.aladhan.com/**', route => route.fulfill({ json: prayerRequestFixture(route.request().url()) }));
    await page.goto('/?preview=1');
    const splash = page.getByRole('main', { name: 'Nur Islam wird geladen' });
    await expect(splash).toBeVisible();
    await expect(splash.locator('.entry-emblem img')).toHaveJSProperty('naturalWidth', 512);
    await expect(splash.locator('.entry-emblem img')).toHaveAttribute('src', /nur-logo-mosque-3d-v1\.webp/);
    await expect(splash.locator('.entry-wordmark')).toHaveText('Nur Islam');
    await expect(splash).not.toContainText(/Ayah|Nächstes Gebet|Dein App-Name/);
    await expect(splash.getByRole('status')).toHaveText('App wird geöffnet');
    await page.evaluate(() => {
      for (const animation of document.getAnimations()) {
        if (animation instanceof CSSAnimation) { animation.pause(); animation.currentTime = 0; }
      }
    });
    await expect(splash.locator('.entry-emblem')).toHaveCSS('opacity', '0');
    await expect(splash.locator('.entry-door--left')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await page.evaluate(() => {
      for (const animation of document.getAnimations()) {
        if (animation instanceof CSSAnimation) animation.currentTime = 2400;
      }
    });
    await expect(splash.locator('.entry-emblem')).toHaveCSS('opacity', '1');
    await expect(splash.locator('.entry-wordmark')).toHaveCSS('opacity', '1');
    expect(await splash.locator('.entry-door--left').evaluate(node => getComputedStyle(node).transform)).toContain('matrix3d');
    const canvas = (await splash.boundingBox())!;
    expect(canvas.width).toBe(width);
    expect(canvas.height).toBe(height);
    for (const selector of ['.entry-emblem', '.entry-wordmark']) {
      const box = (await splash.locator(selector).boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y + box.height).toBeLessThanOrEqual(height);
    }
    expect(await splash.evaluate(node => node.scrollHeight <= node.clientHeight && node.scrollWidth <= node.clientWidth)).toBe(true);
    await page.screenshot({ path: `output/playwright/entry-logo-${name}.png` });
    await page.clock.resume();
    await expect(splash).toBeHidden();
    await expect(page.getByRole('navigation')).toBeVisible();
    const ayah = getDailyAyah(now, 'Europe/Berlin');
    const dailyCard = page.getByRole('button', { name: `Ayah des Tages im Quran lesen: ${ayah.source}` });
    await dailyCard.scrollIntoViewIfNeeded();
    await expect(dailyCard).toContainText(ayah.meaning);
    await dailyCard.click();
    await expect(page.locator(`#quran-ayah-${ayah.surahNumber}-${ayah.ayahNumber}`)).toBeVisible();
  });
}

test('failed logo and prayer requests keep the same mosque fallback and do not block entry', async ({ page }) => {
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.route('https://api.aladhan.com/**', route => route.abort());
  await page.route('**/nur-logo-mosque-3d-v1.webp*', route => route.abort());
  await page.goto('/?preview=1');
  const splash = page.getByRole('main', { name: 'Nur Islam wird geladen' });
  await expect(splash.locator('.entry-emblem img')).toBeHidden();
  const fallback = splash.locator('.entry-emblem .premium-image__fallback');
  await expect(fallback).not.toHaveAttribute('hidden');
  await expect(fallback.locator('image')).toHaveAttribute('href', /^data:image\/webp;base64,/);
  await page.clock.resume();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(splash).toBeHidden();
});

test('reduced motion skips the doors and opens the app promptly', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.route('https://api.aladhan.com/**', route => route.abort());
  await page.goto('/?preview=1');
  const splash = page.getByRole('main', { name: 'Nur Islam wird geladen' });
  await expect(splash.locator('.entry-emblem')).toHaveCSS('opacity', '1');
  await expect(splash.locator('.entry-door--left')).toHaveCSS('display', 'none');
  await expect(splash.locator('.entry-emblem')).toHaveCSS('animation-name', 'none');
  await page.clock.runFor(160);
  await page.clock.resume();
  await expect(splash).toBeHidden();
  await expect(page.getByRole('navigation')).toBeVisible();
});
