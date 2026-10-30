import { expect, test, type Page } from '@playwright/test';
import { WORSHIP_GUIDE_BY_ID } from '../src/data/worshipGuideData';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
const wudu = WORSHIP_GUIDE_BY_ID.get('wudu')!;
const last = wudu.steps.length - 1;
async function openWudu(page: Page) {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Wudu Schritt für Schritt', exact: true })).toBeVisible();
}
async function chooseLast(page: Page) {
  await page.getByText('Schritt auswählen', { exact: true }).click();
  await page.getByRole('button', { name: `Schritt ${last + 1}: ${wudu.steps[last].title}`, exact: true }).click();
}

for (const width of [320, 390, 768]) {
  test(`guide remembers reading position without completion at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('https://api.aladhan.com/**', route => route.abort());
    await page.addInitScript(() => {
      localStorage.setItem('nur_guide_wudu_complete', 'future-format');
      localStorage.setItem('nur_prayer_learning_complete', '["fajr"]');
    });
    await openWudu(page);
    await expect(page.locator('.reference-guide-progress')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Abschließen', exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Nächster Schritt', exact: true }).click();
    expect(await page.evaluate(() => localStorage.getItem('nur_guide_wudu_step'))).toBe('1');
    await openWudu(page);
    await expect(page.getByRole('article')).toHaveAccessibleName(wudu.steps[1].title);
    await chooseLast(page);
    await page.getByRole('button', { name: 'Von vorn', exact: true }).click();
    await expect(page.getByRole('article')).toHaveAccessibleName(wudu.steps[0].title);
    expect(await page.evaluate(() => [localStorage.getItem('nur_guide_wudu_step'), localStorage.getItem('nur_guide_wudu_complete'), localStorage.getItem('nur_prayer_learning_complete')])).toEqual(['0', 'future-format', '["fajr"]']);
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();
    await expect(page.locator('.learn-library-prayer-entry, .reference-prayer-learning-hub__progress, .learn-library-prayer-card.is-complete')).toHaveCount(0);
    await expect(page.locator('.learn-library-prayer-card')).toHaveCount(0);
    await expect(page.locator('.reference-foundation-step')).toHaveCount(14);
    await page.locator('.screen-transition-frame').evaluate(node => { node.scrollTop = 0; });
    await page.screenshot({ path: testInfo.outputPath(`free-learning-${width}.png`) });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const failure of ['throw', 'discard'] as const) {
  test(`reading remains usable when storage writes ${failure}`, async ({ page }) => {
    await page.route('https://api.aladhan.com/**', route => route.abort());
    await page.addInitScript(mode => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        if (key.startsWith('nur_guide_')) {
          if (mode === 'throw') throw new DOMException('Test quota', 'QuotaExceededError');
          return;
        }
        return original.call(this, key, value);
      };
    }, failure);
    await openWudu(page);
    await page.getByRole('button', { name: 'Nächster Schritt', exact: true }).click();
    await expect(page.getByRole('article')).toHaveAccessibleName(wudu.steps[1].title);
    await expect(page.getByRole('status').filter({ hasText: 'Speicherhinweis' })).toContainText('Speicherung der Schrittposition nicht bestätigt');
    expect(await page.evaluate(() => localStorage.getItem('nur_guide_wudu_step'))).toBeNull();
    expect(await page.evaluate(() => localStorage.getItem('nur_guide_wudu_complete'))).toBeNull();
  });
}

test('unknown saved data survives navigation and reading restart', async ({ page }) => {
  await page.route('https://api.aladhan.com/**', route => route.abort());
  await page.addInitScript(() => {
    localStorage.setItem('nur_guide_wudu_step', '999');
    localStorage.setItem('nur_guide_wudu_complete', 'future-format');
    localStorage.setItem('personal-note', 'keep');
  });
  await openWudu(page);
  await expect(page.getByRole('status').filter({ hasText: 'Speicherhinweis' })).toContainText('nicht lesbar');
  await chooseLast(page);
  await page.getByRole('button', { name: 'Von vorn', exact: true }).click();
  await expect(page.getByRole('article')).toHaveAccessibleName(wudu.steps[0].title);
  expect(await page.evaluate(() => [localStorage.getItem('nur_guide_wudu_step'), localStorage.getItem('nur_guide_wudu_complete'), localStorage.getItem('personal-note')])).toEqual(['999', 'future-format', 'keep']);
});
