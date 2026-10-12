import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function openReader(page: Page) {
  await page.route('https://api.alquran.cloud/**', route => route.abort());
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Quran', exact: true }).click();
  await expect(page.locator('.reference-quran-list--catalog article')).toHaveCount(114);
  await page.getByRole('button', { name: 'Lesen beginnen', exact: true }).click();
  await expect(page.locator('#quran-ayah-1-1')).toBeVisible();
}

for (const width of [320, 768, 1280]) {
  for (const failure of ['throw', 'discard'] as const) {
    test(`failed reader writes stay honest at ${width}px (${failure})`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await openReader(page);
      await page.evaluate(mode => {
        const write = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key, value) {
          if (key.startsWith('nur_quran_') || key.startsWith('nur_reader_')) {
            if (mode === 'throw') throw new DOMException('Test quota failure', 'QuotaExceededError');
            return;
          }
          write.call(this, key, value);
        };
      }, failure);
      const bookmark = page.locator('#quran-ayah-1-1').getByRole('button', { name: 'Ayah speichern', exact: true });
      await bookmark.click();
      await expect(bookmark).not.toHaveClass(/is-saved/);
      await expect(page.locator('.toast')).toContainText('nicht gespeichert');
      expect(await page.evaluate(() => localStorage.getItem('nur_quran_bookmarks_1'))).toBeNull();
      await page.getByRole('button', { name: 'Arabisch Buchseiten', exact: true }).click();
      await page.getByRole('button', { name: 'Lesestelle merken', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Lesestelle merken', exact: true })).not.toHaveClass(/is-saved/);
      await expect(page.locator('.toast')).toContainText('Lesestelle nicht gespeichert oder nicht überprüfbar');
      await expect(page.locator('.toast')).not.toContainText('Lesestelle auf Seite');
      await expect(page.locator('.toast svg')).toHaveClass(/lucide-x/);
      const bounds = await page.locator('.toast').boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`reader-storage-${width}-${failure}.png`) });
    });
  }

  test(`confirmed bookmarks and markers survive reopening at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openReader(page);
    const bookmark = page.locator('#quran-ayah-1-1').getByRole('button', { name: 'Ayah speichern', exact: true });
    await bookmark.click();
    await expect(bookmark).toHaveClass(/is-saved/);
    expect(await page.evaluate(() => localStorage.getItem('nur_quran_bookmarks_1'))).toBe('[1]');
    await page.getByRole('button', { name: 'Arabisch Buchseiten', exact: true }).click();
    await page.getByRole('button', { name: 'Lesestelle merken', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Lesestelle merken', exact: true })).toHaveClass(/is-saved/);
    expect(await page.evaluate(() => localStorage.getItem('nur_quran_flow_marker_1_arabic-flow'))).toBe('1');
    await page.reload();
    await expect(page.getByRole('button', { name: 'Lesestelle merken', exact: true })).toHaveClass(/is-saved/);
    await page.getByRole('button', { name: 'Versweise Alle drei Texte', exact: true }).click();
    await expect(bookmark).toHaveClass(/is-saved/);
    await bookmark.click();
    await expect(bookmark).not.toHaveClass(/is-saved/);
    expect(await page.evaluate(() => localStorage.getItem('nur_quran_bookmarks_1'))).toBe('[]');
  });
}

test('unreadable bookmark data and invalid saved markers are not cleared on opening', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('nur_quran_bookmarks_1', '{broken');
    localStorage.setItem('nur_quran_flow_marker_1_arabic-flow', '999');
    localStorage.setItem('nur_reader_font_size', 'not-a-number');
  });
  await openReader(page);
  expect(await page.evaluate(() => localStorage.getItem('nur_quran_bookmarks_1'))).toBe('{broken');
  expect(await page.evaluate(() => localStorage.getItem('nur_reader_font_size'))).toBe('not-a-number');
  await page.locator('#quran-ayah-1-1').getByRole('button', { name: 'Ayah speichern', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('nur_quran_bookmarks_1'))).toBe('{broken');
  await page.getByRole('button', { name: 'Arabisch Buchseiten', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Lesestelle merken', exact: true })).not.toHaveClass(/is-saved/);
  expect(await page.evaluate(() => localStorage.getItem('nur_quran_flow_marker_1_arabic-flow'))).toBe('999');
});
