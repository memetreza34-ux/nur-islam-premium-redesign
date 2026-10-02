import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function openWudu(page: Page) {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Wudu Schritt für Schritt', exact: true })).toBeVisible();
}

for (const width of [320, 390, 768]) {
  test(`Wudu lesson separates image, instructions and pronunciation at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openWudu(page);
    await page.getByRole('button', { name: 'Nächster Schritt', exact: true }).click();
    const card = page.getByRole('article', { name: 'Hände waschen', exact: true });
    await expect(card).toBeVisible();
    const art = card.getByRole('img', { name: 'Zwei Hände werden mit Wasser gewaschen.', exact: true });
    await expect.poll(() => art.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(card).toContainText('Arabische Bezeichnung');
    await expect(card).toContainText('Ghasl al-Jadain');
    const instruction = card.getByText('Wasche beide Hände bis zu den Handgelenken dreimal gründlich.', { exact: true });
    const imageBox = (await art.boundingBox())!;
    const chooserBox = (await page.locator('.wudu-lesson__overview').boundingBox())!;
    expect(chooserBox.y + chooserBox.height).toBeLessThan(imageBox.y);
    const textBox = (await instruction.boundingBox())!;
    expect(imageBox.y + imageBox.height).toBeLessThan(textBox.y);
    const metrics = await instruction.evaluate(element => ({ size: parseFloat(getComputedStyle(element).fontSize), line: parseFloat(getComputedStyle(element).lineHeight) }));
    expect(metrics.size).toBeGreaterThanOrEqual(16);
    expect(metrics.line).toBeGreaterThanOrEqual(24);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await card.screenshot({ path: testInfo.outputPath(`wudu-lesson-${width}.png`) });
  });
}

test('all eight cartoon images load while previous and next keep one active step', async ({ page }) => {
  await openWudu(page);
  await expect(page.getByRole('article')).toContainText('Bis-mil-laah');
  await expect(page.getByRole('button', { name: 'Vorheriger Schritt', exact: true })).toBeDisabled();
  for (const id of ['hands', 'mouth', 'nose', 'face', 'arms', 'head', 'ears', 'feet']) {
    await page.getByRole('button', { name: 'Nächster Schritt', exact: true }).click();
    const card = page.getByRole('article');
    await expect(card).toHaveCount(1);
    const art = card.getByRole('img');
    await expect(art).toHaveAttribute('src', new RegExp(`wudu-step-${id}-v1.webp`));
    await expect.poll(() => art.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  }
  await page.getByRole('button', { name: 'Nächster Schritt', exact: true }).click();
  await expect(page.getByRole('article')).toContainText('Arabischer Wortlaut');
  await expect(page.getByRole('article')).toContainText('Asch-hadu');
  await expect(page.getByRole('article')).toContainText('freiwillig, keine Pflicht');
  const sources = page.getByRole('region', { name: 'Quellen zum Abschlusswortlaut', exact: true });
  await expect(sources.getByRole('link', { name: 'Sahih Muslim 234b', exact: true })).toHaveAttribute('href', 'https://sunnah.com/muslim:234b');
  await expect(sources).toContainText('unterschiedlich bewertet');
  await expect(sources).toContainText('Du kannst beim dort belegten Glaubensbekenntnis bleiben.');
  expect(await page.evaluate(() => localStorage.getItem('nur_guide_wudu_complete'))).toBeNull();
  await page.getByRole('button', { name: 'Abschließen', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('nur_guide_wudu_complete'))).toBe('1');
});

test('step overview selection survives reload and missing image keeps the text usable', async ({ page }) => {
  await page.route('**/wudu-step-mouth-v1.webp*', route => route.abort());
  await openWudu(page);
  await page.getByText('Schritt auswählen', { exact: true }).click();
  await page.getByRole('button', { name: 'Schritt 3: Mund ausspülen', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Schritt 2: Hände waschen', exact: true })).toBeHidden();
  const card = page.getByRole('article', { name: 'Mund ausspülen', exact: true });
  await expect(card.locator('img')).toBeHidden();
  await expect(card).toContainText('Spüle den Mund dreimal mit Wasser aus.');
  await expect(card).toContainText('Al-mad-ma-da');
  await page.reload();
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
  await expect(card).toBeVisible();
  await page.getByRole('button', { name: 'Vorheriger Schritt', exact: true }).click();
  await expect(page.getByRole('article', { name: 'Hände waschen', exact: true })).toBeVisible();
});

for (const width of [320, 768]) {
  test(`step chooser is frameless and closes after selection at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openWudu(page);
    await page.getByRole('button', { name: 'Nächster Schritt', exact: true }).click();
    const previous = page.getByRole('button', { name: 'Vorheriger Schritt', exact: true });
    const next = page.getByRole('button', { name: 'Nächster Schritt', exact: true });
    expect(await next.evaluate(el => getComputedStyle(el).marginTop)).toBe('0px');
    if (width > 360) {
      const a = (await previous.boundingBox())!;
      const b = (await next.boundingBox())!;
      expect(Math.abs(a.y - b.y)).toBeLessThan(1);
      expect(Math.abs(a.width - b.width)).toBeLessThan(1);
    }
    await page.getByText('Schritt auswählen', { exact: true }).click();
    const chooser = page.locator('.wudu-lesson__overview');
    await expect(chooser.getByRole('button')).toHaveCount(10);
    const expandedChooser = (await chooser.boundingBox())!;
    const cardBox = (await page.getByRole('article').boundingBox())!;
    expect(expandedChooser.y + expandedChooser.height).toBeLessThan(cardBox.y);
    const current = chooser.getByRole('button', { name: 'Schritt 2: Hände waschen', exact: true });
    await expect(current).toHaveAttribute('aria-current', 'step');
    await expect(current).toContainText('Aktueller Schritt');
    const other = chooser.getByRole('button', { name: 'Schritt 1: Absicht (Niyyah)', exact: true });
    await page.mouse.move(0, 0);
    await expect.poll(() => other.evaluate(el => { const s = getComputedStyle(el); return { background: s.backgroundColor, border: s.borderTopWidth, appearance: s.appearance }; })).toEqual({ background: 'rgba(0, 0, 0, 0)', border: '0px', appearance: 'none' });
    for (const button of await chooser.getByRole('button').all()) expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await chooser.screenshot({ path: testInfo.outputPath(`wudu-chooser-${width}.png`) });
    await chooser.getByRole('button', { name: 'Schritt 5: Gesicht waschen', exact: true }).click();
    await expect(chooser).not.toHaveAttribute('open');
    await expect(page.getByRole('heading', { name: 'Gesicht waschen', exact: true })).toBeFocused();
    await expect(page.getByRole('article', { name: 'Gesicht waschen', exact: true })).toBeVisible();
  });
}
