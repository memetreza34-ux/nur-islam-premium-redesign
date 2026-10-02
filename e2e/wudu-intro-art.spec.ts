import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

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
    const heading = intro.getByRole('heading', { name: 'Wudu Gebetswaschung', exact: true });
    const subtitle = heading.locator('span');
    const art = intro.locator('img');
    await expect(art).toHaveAttribute('src', /wudu-washing-v1.webp/);
    await expect(art).toHaveAttribute('alt', '');
    await expect.poll(() => art.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    const card = (await intro.boundingBox())!;
    const title = (await heading.boundingBox())!;
    const text = (await intro.getByText('Wudu ist die rituelle Waschung vor dem Gebet. Sie reinigt Körper und Geist.', { exact: true }).boundingBox())!;
    const image = (await art.boundingBox())!;
    const subtitleMetrics = await subtitle.evaluate(element => ({ height: element.getBoundingClientRect().height, lineHeight: parseFloat(getComputedStyle(element).lineHeight) }));
    expect(subtitleMetrics.height).toBeLessThanOrEqual(subtitleMetrics.lineHeight + 1);
    expect(title.x + title.width).toBeLessThanOrEqual(card.x + card.width);
    expect(text.y).toBeGreaterThanOrEqual(title.y + title.height);
    expect(image.y).toBeGreaterThanOrEqual(title.y + title.height);
    expect(text.x + text.width <= image.x || text.y + text.height <= image.y).toBe(true);
    expect(image.x + image.width).toBeLessThanOrEqual(card.x + card.width);
    await expect(intro).toContainText('10 Schritte · Fortschritt lokal gespeichert');
    await intro.screenshot({ path: testInfo.outputPath(`wudu-${width}.png`) });
  });
}

test('Wudu progress survives switching guide tabs', async ({ page }) => {
  await openWudu(page);
  await page.getByRole('button', { name: 'Nächster Schritt', exact: true }).click();
  await expect(page.locator('.reference-guide-progress')).toContainText('Schritt 2');
  await page.getByRole('button', { name: 'Salah', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Einführung' })).not.toContainText('Gebetswaschung');
  await page.getByRole('button', { name: 'Wudu', exact: true }).click();
  await expect(page.locator('.reference-guide-progress')).toContainText('Schritt 2');
  await expect(page.getByRole('region', { name: 'Einführung' })).toContainText('Gebetswaschung');
});

test('missing Wudu artwork keeps readable text and working steps', async ({ page }) => {
  await page.route('**/wudu-washing-v1.webp*', route => route.abort());
  await openWudu(page);
  const intro = page.getByRole('region', { name: 'Einführung' });
  await expect(intro.locator('img')).toBeHidden();
  await expect(intro.locator('.premium-image__fallback svg')).toBeVisible();
  await expect(intro.getByRole('heading')).toHaveText('Wudu Gebetswaschung');
  await page.getByRole('button', { name: 'Nächster Schritt', exact: true }).click();
  await expect(page.locator('.reference-guide-progress')).toContainText('Schritt 2');
});
