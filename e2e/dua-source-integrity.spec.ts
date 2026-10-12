import { expect, test, type Page } from '@playwright/test';
import { DUAS } from '../src/data/duaData';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function openDuas(page: Page) {
  await page.route('https://api.aladhan.com/**', route => route.abort());
  await page.goto('/?preview=1');
  await expect(page.getByRole('main', { name: 'Nur Islam wird geladen' })).toHaveCount(0);
  await page.getByRole('navigation').getByRole('button', { name: 'Mehr', exact: true }).click();
  await page.getByText('Duas', { exact: true }).first().click();
  await expect(page.locator('.reference-dua-card')).toHaveCount(34);
}

for (const width of [320, 768, 1280]) {
  test(`Dua excerpts and exact references survive detail and sharing at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { configurable: true, value: async (data: ShareData) => {
        (window as unknown as { capturedShare: ShareData }).capturedShare = data;
      } });
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => {
        (window as unknown as { capturedCopy: string }).capturedCopy = text;
      } } });
    });
    await openDuas(page);
    const entries = DUAS.filter(entry => entry.sourceNote || entry.id === 'dua_sleep_1');
    for (const entry of entries) {
      await page.getByPlaceholder('Dua, Bedeutung oder Quelle suchen …').fill(entry.title);
      await page.locator('.reference-dua-card__content').click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toContainText(entry.source);
      if (entry.sourceNote) await expect(dialog).toContainText(entry.sourceNote);
      await expect(dialog.getByRole('link', { name: 'Fundstelle öffnen' })).toHaveAttribute('href', entry.sourceUrl!);
      await dialog.getByRole('button', { name: 'Teilen', exact: true }).click();
      const shared = await page.evaluate(() => (window as unknown as { capturedShare: ShareData }).capturedShare.text);
      expect(shared).toContain(entry.sourceUrl);
      if (entry.sourceNote) expect(shared).toContain(entry.sourceNote);
      if (entry.id === 'dua_pain_1') {
        await dialog.getByRole('button', { name: 'Kopieren', exact: true }).click();
        expect(await page.evaluate(() => (window as unknown as { capturedCopy: string }).capturedCopy)).toBe(entry.arabic);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await dialog.getByRole('button', { name: 'Schließen', exact: true }).click();
      await expect(dialog).toHaveCount(0);
    }
    await page.locator('.reference-duas-screen').screenshot({ path: testInfo.outputPath(`duas-sources-${width}.png`) });
  });
}

test('Dua favorite survives reload only after actual storage succeeds', async ({ page }) => {
  await openDuas(page);
  await page.locator('.reference-dua-card__top button').first().click();
  await expect(page.locator('.reference-dua-progress')).toContainText('1 gespeicherte Favoriten');
  await openDuas(page);
  await expect(page.locator('.reference-dua-card__top button').first()).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.reference-dua-card__top button').first().click();
  await expect(page.locator('.reference-dua-progress')).toContainText('0 gespeicherte Favoriten');
});

test('blocked persistence does not fabricate saved favorites or reading progress', async ({ page }) => {
  await openDuas(page);
  await page.evaluate(() => {
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'nur_dua_favorites' || key === 'nur_dua_viewed') throw new DOMException('Blocked', 'QuotaExceededError');
      return write.call(this, key, value);
    };
  });
  await page.locator('.reference-dua-card__top button').first().click();
  await expect(page.locator('.toast')).toContainText('Favoriten konnten nicht gespeichert werden');
  await expect(page.locator('.reference-dua-card__top button').first()).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.reference-dua-progress')).toContainText('0 gespeicherte Favoriten');
  await page.locator('.reference-dua-card__content').first().click();
  await page.getByRole('dialog').getByRole('button', { name: 'Schließen', exact: true }).click();
  await expect(page.locator('.reference-dua-progress').getByRole('status')).toContainText('Speicherung fehlgeschlagen');
  await expect(page.locator('.reference-dua-viewed').first()).toContainText('Geöffnet');
  expect(await page.evaluate(() => localStorage.getItem('nur_dua_viewed'))).toBeNull();
});
