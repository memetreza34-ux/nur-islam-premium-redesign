import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function openQuran(page: Page, lastRead?: { surahNumber: number; ayahNumber: number }) {
  if (lastRead) {
    await page.addInitScript((value) => {
      localStorage.setItem('nur_quran_last_read', JSON.stringify({ ...value, updatedAt: '2026-08-28T06:00:00Z' }));
    }, lastRead);
  }
  await page.route('https://api.alquran.cloud/**', route => route.abort());
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Quran', exact: true }).click();
  await expect(page.locator('.reference-quran-list--catalog article')).toHaveCount(114);
}

for (const width of [320, 390, 768]) {
  test(`garden arch and Quran catalogue stay readable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openQuran(page, { surahNumber: 74, ayahNumber: 5 });
    const firstSurahCard = page.locator('.reference-quran-list--catalog article').first();
    await expect(firstSurahCard.locator('.reference-quran-list__number')).toHaveText('1');
    await expect(firstSurahCard.locator('.reference-quran-list__arabic')).toContainText('ٱلْفَاتِحَةِ');
    await expect(firstSurahCard.locator('.reference-quran-list__arabic')).toBeVisible();
    const cardBox = (await firstSurahCard.boundingBox())!;
    const favoriteBox = (await firstSurahCard.locator('.reference-quran-favorite').boundingBox())!;
    expect(cardBox.x).toBeGreaterThanOrEqual(0);
    expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(width);
    expect(favoriteBox.x + favoriteBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width + 1);
    await expect(page.locator('.reference-quran-list__index, .reference-quran-list__extent, .reference-quran-availability')).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    const clipped = await page.locator('.reference-quran-list--catalog article').evaluateAll(cards => cards.flatMap(card => {
      const main = card.querySelector('.reference-quran-list__main')!;
      const copy = card.querySelector('.reference-quran-list__copy')!;
      const favorite = card.querySelector('.reference-quran-favorite')!;
      const texts = [copy.querySelector('strong')!, ...copy.querySelectorAll('small > span')];
      const ranges = texts.flatMap(el => {
        const range = document.createRange(); range.selectNodeContents(el);
        return [...range.getClientRects()];
      });
      const bounds = main.getBoundingClientRect();
      const target = favorite.getBoundingClientRect();
      return ranges.filter(rect => rect.left < bounds.left - 1 || rect.right > bounds.right + 1 || Math.min(rect.right, target.right) - Math.max(rect.left, target.left) > 1 && Math.min(rect.bottom, target.bottom) - Math.max(rect.top, target.top) > 1).map(() => copy.textContent);
    }));
    expect(clipped).toEqual([]);
    const focus = page.getByRole('region', { name: 'Quran-Lesestand' });
    await expect(focus).toContainText('Al-Muddaththir');
    await expect(focus).toContainText('Ayah 5 von 56');
    await expect(focus).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(focus).toHaveCSS('border-top-width', '0px');
    const button = focus.getByRole('button', { name: 'Weiterlesen', exact: true });
    const arch = focus.locator('.quran-reading-arch');
    const art = arch.locator('.ds-arch__backdrop');
    await expect(art).toHaveAttribute('href', /quran-garden-hero-v2.webp/);
    await expect(art).toHaveAttribute('clip-path', /url\(#arch-clip-/);
    const artworkResponse = await page.request.get((await art.getAttribute('href'))!);
    expect(artworkResponse.ok()).toBe(true);
    const archBox = (await arch.boundingBox())!;
    expect(archBox.height).toBe(250);
    const buttonBox = (await button.boundingBox())!;
    expect(buttonBox.height).toBeGreaterThanOrEqual(44);
    expect(buttonBox.height).toBeLessThanOrEqual(60);
    expect(buttonBox.y).toBeGreaterThanOrEqual(archBox.y + archBox.height);
    expect(buttonBox.width).toBeCloseTo(archBox.width, 0);
    for (const selector of ['.ds-arch__overline', '.ds-arch__name', '.ds-arch__value', '.ds-arch__meta']) {
      const textBox = (await arch.locator(selector).boundingBox())!;
      expect(textBox.x).toBeGreaterThanOrEqual(archBox.x + 16);
      expect(textBox.x + textBox.width).toBeLessThanOrEqual(archBox.x + archBox.width - 16);
      expect(textBox.y + textBox.height).toBeLessThan(archBox.y + archBox.height);
    }
    expect(await arch.locator('.ds-arch__value').evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeLessThanOrEqual(36);
    await expect(page.locator('.reference-quran-library-status, .reading-help, .reference-quran-results')).toHaveCount(0);
    const filters = page.getByRole('group', { name: 'Suren filtern' });
    await expect(filters.getByRole('button')).toHaveText(['Alle', 'Favoriten']);
    const filterWidths = await filters.getByRole('button').evaluateAll(buttons => buttons.map(button => button.getBoundingClientRect().width));
    expect(Math.abs(filterWidths[0] - filterWidths[1])).toBeLessThan(1);
    await expect(firstSurahCard).toBeInViewport({ ratio: 1 });
    await page.screenshot({ path: testInfo.outputPath(`quran-${width}.png`) });
    await firstSurahCard.scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`quran-catalog-${width}.png`) });
    await button.click();
    await expect(page.locator('#quran-ayah-74-5')).toHaveClass(/is-active/);
  });
}

test('new reader has no invented progress; search and favorites still work', async ({ page }) => {
  await openQuran(page);
  const focus = page.getByRole('region', { name: 'Quran-Lesestand' });
  await expect(focus).not.toContainText('Ayah');
  expect(await page.evaluate(() => localStorage.getItem('nur_quran_last_read'))).toBeNull();
  await page.getByRole('button', { name: 'Favoriten', exact: true }).click();
  await expect(page.getByText('Noch keine Lieblingssuren', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Alle', exact: true }).click();
  await focus.getByRole('button', { name: 'Lesen beginnen' }).click();
  await expect(page.locator('#quran-ayah-1-1')).toHaveClass(/is-active/);
  await page.getByRole('button', { name: 'Zurück zum Quran', exact: true }).click();
  await page.getByPlaceholder('Sure oder Nummer suchen …').fill('112');
  await expect(page.locator('.reference-quran-list--catalog article')).toHaveCount(1);
  await expect(page.locator('.reference-quran-results')).toContainText('1 Sure gefunden');
  await page.getByRole('button', { name: 'Al-Ikhlaas als Favorit markieren', exact: true }).click();
  await page.getByRole('button', { name: 'Favoriten', exact: true }).click();
  await expect(page.locator('.reference-quran-list--catalog article')).toHaveCount(1);
  await expect(page.locator('.reference-quran-list--catalog')).toContainText('Al-Ikhlaas');
  await page.getByRole('textbox', { name: 'Suren suchen' }).fill('');
  await expect(page.locator('.reference-quran-results')).toHaveCount(0);
  await page.reload();
  await page.getByRole('navigation').getByRole('button', { name: 'Quran', exact: true }).click();
  await page.getByRole('button', { name: 'Favoriten', exact: true }).click();
  await expect(page.locator('.reference-quran-list--catalog article')).toHaveCount(1);
  await expect(page.locator('.reference-quran-list--catalog')).toContainText('Al-Ikhlaas');
});

test('missing resume artwork keeps the reading action usable', async ({ page }) => {
  await page.route('**/quran-garden-hero-v2.webp*', route => route.abort());
  await openQuran(page);
  await expect(page.locator('.quran-reading-arch .ds-arch__base')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Quran-Lesestand' })).toContainText('Al-Faatiha');
  await expect(page.getByRole('button', { name: 'Lesen beginnen', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Quellen anzeigen: Lesen & Offline', exact: true }).click();
  const info = page.getByRole('dialog', { name: 'Lesen & Offline', exact: true });
  await expect(info).toContainText('Alle 114 Suren sind arabisch mitgeliefert');
  await expect(info).toContainText('sofern dein Browser Speicherung erlaubt');
  await info.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
  await page.getByRole('button', { name: 'Lesen beginnen', exact: true }).click();
  await expect(page.locator('#quran-ayah-1-1')).toHaveClass(/is-active/);
});

for (const width of [320, 390, 768]) {
  test(`daily Ayah keeps a quiet oasis backdrop and remains readable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openQuran(page);
    const card = page.getByRole('button', { name: 'Ayah des Tages – Details öffnen', exact: true });
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('img')).toHaveCount(1);
    await expect(card.locator('img')).toHaveAttribute('src', /ayah-oasis-card-v1\.webp/);
    await expect.poll(() => card.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(1024);
    await expect(card).toHaveCSS('background-image', 'none');
    await expect(card).toHaveCSS('background-color', 'rgb(246, 237, 220)');
    await expect(card.locator('blockquote')).toHaveCSS('color', 'rgb(23, 53, 43)');
    await expect(card.locator('.card-title-row')).toContainText('Ayah des Tages');
    await expect(card.locator('footer')).toHaveText('Al-Ikhlas · 112:1');
    const bounds = (await card.boundingBox())!;
    let previousBottom = bounds.y;
    for (const selector of ['.card-title-row', '.arabic-verse', 'blockquote', 'footer']) {
      const box = (await card.locator(selector).boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(bounds.x);
      expect(box.x + box.width).toBeLessThanOrEqual(bounds.x + bounds.width);
      expect(box.y).toBeGreaterThanOrEqual(previousBottom);
      previousBottom = box.y + box.height;
    }
    expect(previousBottom).toBeLessThan(bounds.y + bounds.height);
    await card.screenshot({ path: testInfo.outputPath(`ayah-card-${width}.png`) });
    await card.click();
    await expect(page.locator('.reference-ayah-hero')).toBeVisible();
  });
}
