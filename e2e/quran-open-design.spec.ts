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
  test(`open Quran arch and miniature stay readable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openQuran(page, { surahNumber: 74, ayahNumber: 5 });
    const firstSurahCard = page.locator('.reference-quran-list--catalog article').first();
    await expect(firstSurahCard.locator('.reference-quran-list__number')).toHaveText('1');
    await expect(firstSurahCard.locator('.reference-quran-list__arabic')).toContainText('ٱلْفَاتِحَةِ');
    const cardBox = (await firstSurahCard.boundingBox())!;
    const favoriteBox = (await firstSurahCard.locator('.reference-quran-favorite').boundingBox())!;
    expect(cardBox.x).toBeGreaterThanOrEqual(0);
    expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(width);
    expect(favoriteBox.x + favoriteBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width + 1);
    const focus = page.getByRole('region', { name: 'Quran-Lesestand' });
    await expect(focus).toContainText('Al-Muddaththir');
    await expect(focus).toContainText('Ayah 5 von 56');
    await expect(focus).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(focus).toHaveCSS('border-top-width', '0px');
    const arch = focus.locator('.ds-arch');
    const art = arch.locator('.ds-arch__backdrop');
    await expect(art).toHaveAttribute('href', /home-prayer-sky-v1.webp/);
    await expect(art).toBeVisible();
    const backdropResponse = await page.request.get((await art.getAttribute('href'))!);
    expect(backdropResponse.ok()).toBe(true);
    expect(backdropResponse.headers()['content-type']).toContain('image/webp');
    const archBox = (await arch.boundingBox())!;
    let previousBottom = archBox.y;
    for (const selector of ['.ds-arch__overline', '.ds-arch__name', '.ds-arch__value', '.ds-arch__meta']) {
      const box = (await arch.locator(selector).boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(archBox.x);
      expect(box.x + box.width).toBeLessThanOrEqual(archBox.x + archBox.width + 1);
      expect(box.y).toBeGreaterThanOrEqual(previousBottom);
      previousBottom = box.y + box.height;
    }
    expect(previousBottom).toBeLessThan(archBox.y + archBox.height);
    const button = focus.getByRole('button', { name: 'Weiterlesen', exact: true });
    const buttonBox = (await button.boundingBox())!;
    expect(buttonBox.y).toBeGreaterThanOrEqual(archBox.y + archBox.height);
    expect(buttonBox.height).toBeGreaterThanOrEqual(44);
    const miniature = page.locator('.quran-directory-art img');
    await expect.poll(() => miniature.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    const imageBox = (await miniature.boundingBox())!;
    const labelBox = (await page.getByText('Alle 114 Suren lesbar', { exact: true }).boundingBox())!;
    expect(imageBox.width).toBeLessThanOrEqual(42);
    expect(imageBox.x + imageBox.width).toBeLessThanOrEqual(labelBox.x);
    await page.screenshot({ path: testInfo.outputPath(`quran-${width}.png`) });
    await button.click();
    await expect(page.locator('#quran-ayah-74-5')).toHaveClass(/is-active/);
  });
}

test('new reader has no invented progress; search and favorites still work', async ({ page }) => {
  await openQuran(page);
  const focus = page.getByRole('region', { name: 'Quran-Lesestand' });
  await expect(focus).toContainText('Noch kein Lesestand');
  await focus.getByRole('button', { name: 'Lesen beginnen' }).click();
  await expect(page.locator('#quran-ayah-1-1')).toHaveClass(/is-active/);
  await page.getByRole('button', { name: 'Zurück zum Quran', exact: true }).click();
  await page.getByPlaceholder('Nummer, Surenname oder Arabisch suchen …').fill('112');
  await expect(page.locator('.reference-quran-list--catalog article')).toHaveCount(1);
  await page.getByRole('button', { name: 'Al-Ikhlaas als Favorit markieren', exact: true }).click();
  await page.getByRole('button', { name: 'Favoriten · 1', exact: true }).click();
  await expect(page.locator('.reference-quran-list--catalog article')).toHaveCount(1);
  await expect(page.locator('.reference-quran-list--catalog')).toContainText('Al-Ikhlaas');
});

test('missing book image falls back without affecting the reading action', async ({ page }) => {
  await page.route('**/mini-quran-v1.webp*', route => route.abort());
  await openQuran(page);
  await expect(page.locator('.quran-directory-art img')).toBeHidden();
  await expect(page.locator('.quran-directory-art svg')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Lesen beginnen', exact: true })).toBeEnabled();
});

for (const width of [320, 390, 768]) {
  test(`daily Ayah uses the Home artwork and remains readable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openQuran(page);
    const card = page.getByRole('button', { name: 'Ayah des Tages – Details öffnen', exact: true });
    await card.scrollIntoViewIfNeeded();
    const art = card.locator('img');
    await expect(art).toHaveAttribute('src', /ayah-focus-bg-v1.webp/);
    await expect.poll(() => art.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
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
