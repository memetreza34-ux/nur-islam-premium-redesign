import { expect, test } from '@playwright/test';
import { prayerRequestFixture } from './fixtures/prayer-api';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
for (const width of [320, 390, 768]) {
  test(`calculation stays compact with complete details at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.route('https://api.aladhan.com/**', route => route.fulfill({ json: prayerRequestFixture(route.request().url()) }));
    await page.goto('/?preview=1');
    await expect(page.getByRole('region', { name: 'Nächstes Gebet', exact: true })).toBeVisible();
    await expect(page.locator('.home-prayer-times > span')).toHaveCount(6);
    await expect(page.locator('.home-prayer-note')).toHaveCount(0);
    await expect(page.getByText(/AlAdhan · berechnete Zeiten|Europe\/Berlin · Berechnung prüfen/)).toHaveCount(0);
    await page.getByRole('navigation').getByRole('button', { name: 'Gebet', exact: true }).click();
    const card = page.getByRole('region', { name: 'Berechnung der Gebetszeiten' });
    await card.scrollIntoViewIfNeeded();
    await expect(card).toContainText('Diyanet (experimentell)');
    await expect(card).not.toContainText(/LIVE VIA|Berechnete Gebetszeiten können|Başkanlığı/i);
    expect((await card.boundingBox())!.height).toBeLessThanOrEqual(96);
    expect(await card.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    const info = card.getByRole('button', { name: 'Quellen anzeigen: Berechnung & Quelle' });
    for (const button of [info, card.getByRole('button', { name: 'Anpassen', exact: true })]) {
      const box = (await button.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    await page.screenshot({ path: `output/playwright/prayer-method-compact-${width}.png` });
    await info.click();
    const dialog = page.getByRole('dialog', { name: 'Berechnung & Quelle' });
    await expect(dialog).toContainText('Live via AlAdhan');
    await expect(dialog).toContainText('Berechnete Gebetszeiten können je nach örtlicher Moschee');
    await expect(dialog).toContainText(/Standard/i);
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await dialog.getByRole('button', { name: 'Quellen schließen' }).click();
    await expect(info).toBeFocused();
    await card.getByRole('button', { name: 'Anpassen', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Gebetszeiten-Einstellungen' })).toBeVisible();
  });
}
