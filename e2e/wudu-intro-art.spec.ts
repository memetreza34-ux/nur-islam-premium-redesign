import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { WORSHIP_GUIDES } from '../src/data/worshipGuideData';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function openWudu(page: Page) {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Wudu (Gebetswaschung)', exact: true })).toBeVisible();
}

for (const width of [320, 390, 768]) {
  test(`Wudu introduction is readable without overlapping artwork at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openWudu(page);
    const intro = page.getByRole('region', { name: 'Einführung', exact: true });
    await expect(intro.getByRole('heading')).toHaveCount(0);
    const art = intro.locator('img');
    await expect(art).toHaveAttribute('src', /learn-hub-wudu-v1.webp/);
    await expect(art).toHaveAttribute('alt', '');
    await expect.poll(() => art.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    const card = (await intro.boundingBox())!;
    const text = (await intro.getByText(WORSHIP_GUIDES.find(guide => guide.id === 'wudu')!.intro.split('. ')[0] + '.', { exact: true }).boundingBox())!;
    const image = (await art.boundingBox())!;
    expect(image.x + image.width).toBeLessThanOrEqual(text.x);
    expect(image.x + image.width).toBeLessThanOrEqual(card.x + card.width);
    expect(card.height).toBeLessThan(170);
    await expect(page.locator('.wudu-lesson__overview')).toContainText('10 Schritte');
    await expect(page.locator('.reference-guide-progress')).toHaveCount(0);
    await intro.screenshot({ path: testInfo.outputPath(`wudu-${width}.png`) });
  });
}

test('Wudu reading position survives returning to the learning overview', async ({ page }) => {
  await openWudu(page);
  await page.getByRole('button', { name: 'Nächster Schritt', exact: true }).click();
  await expect(page.locator('.wudu-lesson__card')).toHaveAccessibleName(WORSHIP_GUIDES.find(guide => guide.id === 'wudu')!.steps[1].title);
  await expect(page.locator('.reference-guide-topics, .reference-guide-tabs')).toHaveCount(0);
  await page.getByRole('button', { name: 'Zurück', exact: true }).click();
  await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
  await expect(page.locator('.wudu-lesson__card')).toHaveAccessibleName(WORSHIP_GUIDES.find(guide => guide.id === 'wudu')!.steps[1].title);
  await expect(page.getByRole('region', { name: 'Einführung' })).toContainText('Gebetswaschung');
});

test('missing Wudu artwork keeps readable text and working steps', async ({ page }) => {
  await page.route('**/learn-hub-wudu-v1.webp*', route => route.abort());
  await openWudu(page);
  const intro = page.getByRole('region', { name: 'Einführung' });
  await expect(intro.locator('img')).toBeHidden();
  await expect(intro.locator('.premium-image__fallback svg')).toBeVisible();
  await expect(intro).toContainText(WORSHIP_GUIDES.find(guide => guide.id === 'wudu')!.intro.split('. ')[0] + '.');
  await page.getByRole('button', { name: 'Nächster Schritt', exact: true }).click();
  await expect(page.locator('.wudu-lesson__card')).toHaveAccessibleName(WORSHIP_GUIDES.find(guide => guide.id === 'wudu')!.steps[1].title);
});
