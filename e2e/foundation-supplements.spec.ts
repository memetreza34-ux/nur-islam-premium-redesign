import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 768]) {
  test(`four foundation additions have readable chapters and restore the grid at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    const frame = page.locator('.screen-transition-frame');
    const grid = page.locator('.reference-foundation-path');
    await expect(grid.locator('.reference-foundation-step')).toHaveCount(14);
    for (const title of ['Hadith-Sammlung', 'Hajj & Umrah', 'Sunnah im Alltag', 'Fehler & Reue']) {
      const tile = grid.getByRole('button', { name: new RegExp(title) });
      await tile.scrollIntoViewIfNeeded();
      const before = await frame.evaluate(element => element.scrollTop);
      await tile.click();
      await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
      const guide = page.locator('.foundation-guide');
      await expect(guide.locator('.reference-legacy-hero')).toHaveCount(0);
      const outline = guide.locator('details');
      await expect(outline).not.toHaveAttribute('open');
      const paragraphs = guide.locator('.foundation-chapter p');
      expect(await paragraphs.count()).toBeGreaterThan(6);
      const type = await paragraphs.first().evaluate(element => ({ size: parseFloat(getComputedStyle(element).fontSize), line: parseFloat(getComputedStyle(element).lineHeight) }));
      expect(type.size).toBeGreaterThanOrEqual(16);
      expect(type.line).toBeGreaterThanOrEqual(25);
      await outline.getByText('Kapitelübersicht', { exact: false }).first().click();
      const links = outline.getByRole('navigation').getByRole('link');
      expect(await links.count()).toBeGreaterThanOrEqual(3);
      const targets = await links.evaluateAll(elements => elements.map(element => element.getAttribute('href')));
      for (const target of targets) await expect(page.locator(target!)).toHaveCount(1);
      await links.last().click();
      await expect(page.locator(targets.at(-1)!).getByRole('heading', { level: 2 })).toBeVisible();
      expect(await guide.evaluate(element => element.scrollWidth)).toBeLessThanOrEqual(width);
      if (title === 'Sunnah im Alltag') {
        await guide.locator('.foundation-topic-list').first().screenshot({ path: testInfo.outputPath(`sunnah-topics-${width}.png`) });
      }
      await page.getByRole('button', { name: 'Zurück', exact: true }).click();
      await expect(grid).toBeVisible();
      await expect.poll(() => frame.evaluate(element => element.scrollTop)).toBeGreaterThan(before - 5);
      await expect.poll(() => frame.evaluate(element => element.scrollTop)).toBeLessThan(before + 5);
    }
  });
}

test('Hadith search and local favorites remain functional', async ({ page }) => {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  const openLibrary = async () => page.locator('.reference-foundation-path').getByRole('button', { name: /Hadith-Sammlung/ }).click();
  await openLibrary();
  await page.getByPlaceholder('Hadithe durchsuchen').fill('Bukhari 1;');
  const articles = page.locator('.reference-hadith-library article');
  await expect(articles).toHaveCount(1);
  await articles.getByRole('button', { name: 'Als Favorit speichern', exact: true }).click();
  await expect(articles.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Zurück', exact: true }).click();
  await openLibrary();
  await page.getByPlaceholder('Hadithe durchsuchen').fill('Bukhari 1;');
  await expect(articles.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  await page.getByPlaceholder('Hadithe durchsuchen').fill('nichts-gefunden-1234');
  await expect(page.getByText('Kein Hadith gefunden', { exact: true })).toBeVisible();
});

test('light reading theme retains readable contrast and two-column cards', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  const tiles = page.locator('.reference-foundation-path .reference-foundation-step');
  await expect(tiles).toHaveCount(14);
  const lastRow = await tiles.evaluateAll(elements => elements.slice(-2).map(element => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width };
  }));
  expect(lastRow[0].y).toBeCloseTo(lastRow[1].y, 0);
  expect(lastRow[0].x + lastRow[0].width).toBeLessThan(lastRow[1].x);
  await tiles.filter({ hasText: 'Fehler & Reue' }).click();
  await expect(page.locator('.foundation-chapter p').first()).toBeVisible();
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  const paragraph = page.locator('.foundation-chapter p').first();
  const palette = await paragraph.evaluate(element => {
    const ancestors = [];
    for (let parent: Element | null = element; parent; parent = parent.parentElement) {
      const style = getComputedStyle(parent);
      ancestors.push({ color: style.backgroundColor, image: style.backgroundImage });
    }
    return { text: getComputedStyle(element).color, ancestors };
  });
  await testInfo.attach('light-palette', { body: JSON.stringify(palette), contentType: 'application/json' });
  const channels = palette.text.match(/\d+/g)!.slice(0, 3).map(Number);
  const luminance = (rgb: number[]) => rgb.map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  // Conservative warm light background used by the app; darker than white.
  const contrast = (luminance([232, 224, 200]) + .05) / (luminance(channels) + .05);
  expect(contrast).toBeGreaterThanOrEqual(4.5);
  expect(await page.locator('.foundation-guide').evaluate(element => element.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: testInfo.outputPath('foundation-light.png') });
});
