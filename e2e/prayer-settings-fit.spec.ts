import { expect, test } from '@playwright/test';
import { prayerRequestFixture } from './fixtures/prayer-api';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
for (const [width, height] of [[320, 568], [390, 844], [768, 1024], [1024, 768], [568, 320], [844, 390]]) {
  test(`calculation settings fit without scrolling at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.route('https://api.aladhan.com/**', route => route.fulfill({ json: prayerRequestFixture(route.request().url()) }));
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Gebet', exact: true }).click();
    await page.getByRole('button', { name: 'Berechnung', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Gebetszeiten-Einstellungen' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS('transform', 'none');
    await expect(dialog.getByRole('heading', { name: 'Berechnung', exact: true })).toBeVisible();
    for (const locator of [dialog, page.locator('.reference-prayer-settings-backdrop')]) {
      expect(await locator.evaluate(node => node.scrollHeight <= node.clientHeight && node.scrollWidth <= node.clientWidth)).toBe(true);
    }
    const box = (await dialog.boundingBox())!;
    const nav = (await page.getByRole('navigation').boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(8);
    expect(box.y + box.height).toBeLessThan(nav.y);
    const buttons = dialog.getByRole('button');
    for (const button of await buttons.all()) {
      const bounds = (await button.boundingBox())!;
      expect(bounds.width).toBeGreaterThanOrEqual(44);
      expect(bounds.height).toBeGreaterThanOrEqual(44);
      expect(bounds.y).toBeGreaterThanOrEqual(box.y);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(box.y + box.height);
    }
    await expect(dialog.locator('.reference-prayer-settings-group button')).toHaveCount(4);
    await expect(dialog.getByRole('button', { name: 'Übernehmen' })).toBeInViewport({ ratio: 1 });
    await page.screenshot({ path: `output/playwright/prayer-settings-fit-${width}x${height}.png` });
    await dialog.getByRole('button', { name: /Hanafi/ }).click();
    await expect(dialog.getByRole('button', { name: /Hanafi/ })).toHaveAttribute('aria-pressed', 'true');
    const info = dialog.getByRole('button', { name: 'Quellen anzeigen: Hinweise zur Berechnung' });
    await info.click();
    const notes = page.getByRole('dialog', { name: 'Hinweise zur Berechnung' });
    await expect(notes).toContainText('Die Auswahl beeinflusst insbesondere Fajr, Isha und Asr.');
    await notes.getByRole('button', { name: 'Quellen schließen' }).click();
    await expect(info).toBeFocused();
    await expect(dialog.getByRole('button', { name: /Hanafi/ })).toHaveAttribute('aria-pressed', 'true');
    await dialog.getByRole('button', { name: 'Übernehmen' }).click();
    await expect(dialog).toBeHidden();
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('nur_prayer_preferences') ?? '{}').school)).toBe(1);
  });
}
