import { expect, test, type Page } from '@playwright/test';
import { WORSHIP_GUIDE_BY_ID } from '../src/data/worshipGuideData';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
const wudu = WORSHIP_GUIDE_BY_ID.get('wudu')!;
const last = wudu.steps.length - 1;
const lastLabel = `Schritt ${last + 1}: ${wudu.steps[last].title}`;
async function openWudu(page: Page) {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Wudu Schritt für Schritt', exact: true })).toBeVisible();
}
async function chooseLast(page: Page) {
  await page.getByText('Schritt auswählen', { exact: true }).click();
  await page.getByRole('button', { name: lastLabel, exact: true }).click();
}

for (const width of [320, 768, 1280]) {
  test(`guide mount, explicit save, reload and cross-tab completion at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await page.addInitScript(() => {
      const set = Storage.prototype.setItem;
      (window as unknown as { guideWrites: string[] }).guideWrites = [];
      Storage.prototype.setItem = function(key, value) {
        if (key.startsWith('nur_guide_')) (window as unknown as { guideWrites: string[] }).guideWrites.push(key);
        return set.call(this, key, value);
      };
    });
    await openWudu(page);
    await expect(page.locator('.worship-guide-intro__meta')).toContainText('Noch keine bestätigte Speicherung');
    expect(await page.evaluate(() => (window as unknown as { guideWrites: string[] }).guideWrites)).toEqual([]);
    await page.getByRole('button', { name: 'Nächster Schritt', exact: true }).click();
    expect(await page.evaluate(() => localStorage.getItem('nur_guide_wudu_step'))).toBe('1');
    await expect(page.locator('.worship-guide-intro__meta')).toContainText('Position lokal gespeichert');
    await openWudu(page);
    await expect(page.getByRole('article', { name: 'Hände waschen', exact: true })).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { guideWrites: string[] }).guideWrites)).toEqual([]);
    await chooseLast(page);
    expect(await page.evaluate(() => localStorage.getItem('nur_guide_wudu_complete'))).toBeNull();
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();
    await expect(page.locator('.reference-prayer-learning-hub__progress strong')).toHaveText('0/6 Gebetsgrundlagen abgeschlossen');
    await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
    await page.getByRole('button', { name: 'Abschließen', exact: true }).click();
    await expect(page.locator('.toast')).toContainText('als abgeschlossen gespeichert');
    await expect(page.locator('.toast .lucide-circle-check')).toHaveCount(1);
    const savedToastBounds = await page.locator('.toast').boundingBox();
    expect(savedToastBounds!.x).toBeGreaterThanOrEqual(0);
    expect(savedToastBounds!.x + savedToastBounds!.width).toBeLessThanOrEqual(width + 1);
    await page.screenshot({ path: testInfo.outputPath(`guide-storage-confirmed-${width}.png`) });
    expect(await page.evaluate(() => localStorage.getItem('nur_guide_wudu_complete'))).toBe('1');
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();
    await expect(page.locator('.reference-prayer-learning-hub__progress strong')).toHaveText('1/6 Gebetsgrundlagen abgeschlossen');
    const peer = await page.context().newPage();
    await peer.route('**/api.aladhan.com/**', route => route.abort());
    await peer.goto('/?preview=1');
    await peer.evaluate(() => localStorage.setItem('nur_guide_wudu_complete', '0'));
    await expect(page.locator('.reference-prayer-learning-hub__progress strong')).toHaveText('0/6 Gebetsgrundlagen abgeschlossen');
    await peer.evaluate(() => localStorage.setItem('nur_prayer_learning_complete', '["future-a","future-b"]'));
    await expect(page.locator('.reference-prayer-learning-hub__progress strong')).toHaveText('0/6 Gebetsgrundlagen abgeschlossen');
    await peer.evaluate(() => localStorage.setItem('nur_prayer_learning_complete', '["fajr","fajr","future"]'));
    await expect(page.locator('.reference-prayer-learning-hub__progress strong')).toHaveText('1/6 Gebetsgrundlagen abgeschlossen');
    await peer.evaluate(() => localStorage.setItem('nur_prayer_learning_complete', '["fajr",123]'));
    await expect(page.locator('.reference-prayer-learning-hub__progress strong')).toHaveText('Abschlussstatus nicht vollständig lesbar');
    expect(await page.evaluate(() => localStorage.getItem('nur_prayer_learning_complete'))).toBe('["fajr",123]');
    await peer.close();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });

  for (const failure of ['throw', 'discard'] as const) {
    test(`guide ${failure} write cannot claim completion at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.route('**/api.aladhan.com/**', route => route.abort());
      await page.addInitScript(({ last, failure }) => {
        localStorage.setItem('nur_guide_wudu_step', String(last));
        const set = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key, value) {
          if (key.startsWith('nur_guide_')) {
            if (failure === 'throw') throw new DOMException('Denied', 'QuotaExceededError');
            return;
          }
          return set.call(this, key, value);
        };
      }, { last, failure });
      await openWudu(page);
      await page.getByRole('button', { name: 'Vorheriger Schritt', exact: true }).click();
      await expect(page.getByRole('article', { name: wudu.steps[last - 1].title, exact: true })).toBeVisible();
      await expect(page.getByRole('status').filter({ hasText: 'Speicherhinweis' })).toContainText('Speicherung der Schrittposition nicht bestätigt');
      expect(await page.evaluate(() => localStorage.getItem('nur_guide_wudu_step'))).toBe(String(last));
      await page.getByRole('button', { name: 'Nächster Schritt', exact: true }).click();
      await page.getByRole('button', { name: 'Abschließen', exact: true }).click();
      await expect(page.locator('.toast')).toHaveText('Speicherung nicht bestätigt');
      await expect(page.locator('.toast .lucide-circle-alert')).toHaveCount(1);
      const toastBounds = await page.locator('.toast').boundingBox();
      expect(toastBounds!.x).toBeGreaterThanOrEqual(0);
      expect(toastBounds!.x + toastBounds!.width).toBeLessThanOrEqual(width + 1);
      await expect(page.locator('.worship-guide-intro__meta')).not.toContainText('Abschluss lokal gespeichert');
      expect(await page.evaluate(() => localStorage.getItem('nur_guide_wudu_complete'))).toBeNull();
      const warning = page.getByRole('status').filter({ hasText: 'Speicherhinweis' });
      await warning.scrollIntoViewIfNeeded();
      const bounds = await warning.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.screenshot({ path: testInfo.outputPath(`guide-storage-${failure}-${width}.png`) });
      await page.getByRole('button', { name: 'Zurück', exact: true }).click();
      await expect(page.locator('.reference-prayer-learning-hub__progress strong')).toHaveText('0/6 Gebetsgrundlagen abgeschlossen');
    });
  }

  test(`unknown guide data survives viewing, selection and completion at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await page.addInitScript(() => {
      localStorage.setItem('nur_guide_wudu_step', '999');
      localStorage.setItem('nur_guide_wudu_complete', 'future-format');
      localStorage.setItem('nur_guide_salah_step', 'future-step');
      localStorage.setItem('personal-note', 'keep');
    });
    await openWudu(page);
    await expect(page.locator('.worship-guide-intro__meta')).toContainText('Gespeicherter Fortschritt nicht lesbar');
    expect(await page.evaluate(() => localStorage.getItem('nur_guide_wudu_step'))).toBe('999');
    await page.locator('.reference-guide-tabs').getByRole('button', { name: 'Salah', exact: true }).click();
    expect(await page.evaluate(() => localStorage.getItem('nur_guide_salah_step'))).toBe('future-step');
    await page.locator('.reference-guide-tabs').getByRole('button', { name: 'Wudu', exact: true }).click();
    await chooseLast(page);
    await page.getByRole('button', { name: 'Abschließen', exact: true }).click();
    await expect(page.locator('.toast')).toHaveText('Speicherung nicht bestätigt');
    expect(await page.evaluate(() => [localStorage.getItem('nur_guide_wudu_step'), localStorage.getItem('nur_guide_wudu_complete'), localStorage.getItem('personal-note')])).toEqual(['999', 'future-format', 'keep']);
    const warning = page.getByRole('status').filter({ hasText: 'Speicherhinweis' });
    await warning.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.screenshot({ path: testInfo.outputPath(`guide-storage-corrupt-${width}.png`) });
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();
    await expect(page.locator('.reference-prayer-learning-hub__progress strong')).toHaveText('Abschlussstatus nicht vollständig lesbar');
  });
}
