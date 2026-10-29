import { expect, test, type Page } from '@playwright/test';
import { DHIKR_ROUTINES } from '../src/data/dhikrData';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
async function openDhikr(page: Page) {
  await page.route('**/api.aladhan.com/**', route => route.abort());
  await page.goto('/?preview=1');
  await page.locator('.home-companion-card').filter({ hasText: 'Dhikr' }).click();
  await expect(page.locator('.reference-dhikr-screen')).toBeVisible();
}

for (const width of [320, 768, 1280]) {
  test(`all eighteen Dhikr texts and source qualifications are readable at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 900 });
    await openDhikr(page);
    for (const [routineIndex, routine] of DHIKR_ROUTINES.entries()) {
      await page.locator('.reference-dhikr-category-grid button').nth(routineIndex).click();
      for (const [itemIndex, item] of routine.items.entries()) {
        await page.locator('.reference-dhikr-step-tabs button').nth(itemIndex).click();
        const copy = page.locator('.reference-dhikr-copy');
        await expect(copy).toContainText(item.arabic);
        await expect(copy).toContainText(`Umschrift: ${item.transliteration ?? item.latin}`);
        await expect(copy).toContainText(`Sinngemäße Bedeutung: ${item.meaning}`);
        for (const paragraph of await copy.locator('p, small').all()) {
          await paragraph.scrollIntoViewIfNeeded();
          await expect(paragraph).toBeVisible();
          expect(await paragraph.evaluate(element => element.scrollWidth <= element.clientWidth + 1 && element.scrollHeight <= element.clientHeight + 1)).toBe(true);
        }
        const source = page.locator('.reference-dhikr-source').last();
        await source.scrollIntoViewIfNeeded();
        await source.getByRole('button', { name: /^Quellen anzeigen:/ }).click();
        await expect(page.locator('dialog.source-info-dialog').getByRole('link')).toHaveAttribute('href', item.itemSourceUrl ?? routine.sourceUrl!);
        await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
        if (routine.note) await expect(source).toContainText(routine.note);
        if (item.itemNote) await expect(source).toContainText(item.itemNote);
        expect(await source.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        if (item.id === 'evening-amsayna') {
          await copy.screenshot({ path: testInfo.outputPath(`evening-full-text-${width}.png`) });
          await source.screenshot({ path: testInfo.outputPath(`evening-source-${width}.png`) });
        }
      }
    }
  });
}

test('manual step selection survives counting and reload with actual saved data', async ({ page }) => {
  await openDhikr(page);
  await page.locator('.reference-dhikr-step-tabs button').nth(1).click();
  await page.locator('.reference-dhikr-ring').click();
  await expect(page.locator('.reference-dhikr-copy h2')).toHaveText('Alhamdulillah');
  await expect(page.locator('.reference-dhikr-ring strong')).toHaveText('1');
  await page.reload();
  await expect(page.locator('.reference-dhikr-screen')).toBeVisible();
  await page.locator('.reference-dhikr-step-tabs button').nth(1).click();
  await expect(page.locator('.reference-dhikr-ring strong')).toHaveText('1');
});

test('blocked storage keeps counts in the session without claiming device persistence', async ({ page }) => {
  await openDhikr(page);
  await page.evaluate(() => {
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith('nur_dhikr_')) throw new DOMException('Blocked', 'QuotaExceededError');
      return write.call(this, key, value);
    };
  });
  await page.locator('.reference-dhikr-ring').click();
  await expect(page.getByRole('status')).toContainText('Speicherung fehlgeschlagen');
  await page.getByRole('button', { name: 'Heutige Statistik öffnen' }).click();
  await expect(page.getByRole('dialog')).toContainText('nur in dieser Sitzung');
});
