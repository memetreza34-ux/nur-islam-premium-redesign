import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 768]) {
  test(`four foundation additions have readable chapters and restore the grid at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(180_000);
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
      const introduction = guide.locator('.foundation-guide-context');
      await expect(introduction).not.toHaveAttribute('open');
      await expect(introduction.locator('summary')).toHaveText('Einführung');
      await introduction.locator('summary').click();
      await expect(introduction.locator('p')).toBeVisible();
      await introduction.locator('summary').click();
      const readingCard = guide.locator('.foundation-chapter:not([hidden])').first();
      expect(await readingCard.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(245, 239, 223)');
      expect(await readingCard.locator('p').first().evaluate(element => getComputedStyle(element).color)).toBe('rgb(36, 74, 59)');
      const outline = guide.locator('.foundation-guide-outline');
      await expect(outline).not.toHaveAttribute('open');
      const paragraphs = guide.locator('.foundation-chapter p');
      expect(await paragraphs.count()).toBeGreaterThan(6);
      const type = await guide.locator('.foundation-chapter:not([hidden]) p').first().evaluate(element => ({ size: parseFloat(getComputedStyle(element).fontSize), line: parseFloat(getComputedStyle(element).lineHeight) }));
      expect(type.size).toBeGreaterThanOrEqual(16);
      expect(type.line).toBeGreaterThanOrEqual(25);
      await frame.evaluate(element => { element.scrollTop = 0; });
      await page.screenshot({ path: testInfo.outputPath(`reading-card-${title.replace(/[^a-z]/gi, '')}-${width}.png`) });
      await outline.getByText('Kapitel auswählen', { exact: true }).first().click();
      const links = outline.getByRole('list', { name: 'Kapitelübersicht' }).getByRole('button');
      expect(await links.count()).toBeGreaterThanOrEqual(3);
      const targets = await links.evaluateAll(elements => elements.map(element => '#' + element.getAttribute('aria-controls')));
      for (const target of targets) await expect(page.locator(target!)).toHaveCount(1);
      await links.last().click();
      await expect(page.locator(targets.at(-1)!).getByRole('heading', { level: 2 })).toBeVisible();
      await expect(guide.locator('.foundation-chapter:not([hidden])')).toHaveCount(1);
      const navigation = guide.locator('.foundation-chapter:not([hidden])').getByRole('group', { name: 'Lektionsnavigation' });
      await navigation.getByRole('button', { name: 'Vorherige', exact: true }).click();
      await expect(page.locator(targets.at(-2)!)).toBeVisible();
      await guide.locator('.foundation-chapter:not([hidden])').getByRole('button', { name: 'Nächstes Kapitel', exact: true }).click();
      await expect(page.locator(targets.at(-1)!)).toBeVisible();
      await expect(guide.locator('.foundation-chapter:not([hidden]) .source-info--labeled').first()).toBeVisible();
      const source = guide.locator('.foundation-chapter:not([hidden]) .source-info--labeled').first().getByRole('button');
      const sourceLabel = (await source.innerText()).trim();
      expect(sourceLabel.length).toBeGreaterThan(8);
      expect(await source.getAttribute('aria-label')).toContain(sourceLabel);
      await source.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
      await expect(source).toBeFocused();
      await page.screenshot({ path: testInfo.outputPath(`reader-footer-${title.replace(/[^a-z]/gi, '')}-${width}.png`) });

      expect(await guide.evaluate(element => element.scrollWidth)).toBeLessThanOrEqual(width);
      if (title === 'Sunnah im Alltag') {
        await guide.locator('.foundation-topic-list').last().screenshot({ path: testInfo.outputPath(`sunnah-topics-${width}.png`) });
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
  await expect(articles).toHaveCSS('background-image', 'none');
  await expect(articles.locator('p').nth(1)).toHaveCSS('color', 'rgb(36, 74, 59)');
  await articles.getByRole('button', { name: 'Als Favorit speichern', exact: true }).click();
  await expect(articles.getByRole('button', { name: 'Aus Favoriten entfernen', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Zurück', exact: true }).click();
  await openLibrary();
  await page.getByPlaceholder('Hadithe durchsuchen').fill('Bukhari 1;');
  await expect(articles.getByRole('button', { name: 'Aus Favoriten entfernen', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByPlaceholder('Hadithe durchsuchen').fill('nichts-gefunden-1234');
  await expect(page.getByText('Kein Hadith gefunden', { exact: true })).toBeVisible();
});

for (const [width, theme] of [[320, 'dark'], [768, 'light']] as const) {
  test(`prophet and school reading cards use the shared readable palette at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(value => localStorage.setItem('nur_theme', value), theme);
    for (const [topic, selector, entry] of [
      ['Die 25 Propheten', '.reference-prophet-lesson', '.reference-prophet-catalogue > button'],
      ['Die vier Rechtsschulen', '.madhhab-detail', '.madhhab-grid > button'],
    ]) {
      await page.goto('/?preview=1');
      await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
      await page.getByRole('button', { name: new RegExp(topic) }).click();
      if (topic === 'Die vier Rechtsschulen') {
        const intro = page.locator('.reading-introduction');
        await expect(intro).not.toHaveAttribute('open');
        await intro.getByText('Einführung', { exact: true }).click();
        await expect(intro.getByRole('heading', { name: 'Was ist eine Rechtsschule?' })).toBeVisible();
        await page.screenshot({ path: testInfo.outputPath(`introduction-schools-${width}.png`) });
        await intro.locator('summary').click();
      }
      await page.locator(entry).first().click();
      if (topic === 'Die 25 Propheten') {
        const intro = page.locator('.reading-introduction');
        await expect(intro).not.toHaveAttribute('open');
        await expect(intro.locator('summary')).toHaveText('Einführung');
        await intro.locator('summary').click();
        await expect(intro.locator('.reference-prophet-overview__body')).toBeVisible();
        await intro.locator('summary').click();
      }
      const card = page.locator(selector);
      await expect(card).toBeVisible();
      expect(await card.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(245, 239, 223)');
      const textColors = await card.locator('p,h2,h3,h4,dt,dd,.overline').evaluateAll(elements => elements.filter(element => element.getBoundingClientRect().height > 0).map(element => getComputedStyle(element).color));
      const luminance = (rgb: number[]) => rgb.map(channel => channel / 255).map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4).reduce((sum, channel, index) => sum + channel * [.2126, .7152, .0722][index], 0);
      for (const color of textColors) {
        const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
        expect((luminance([245, 239, 223]) + .05) / (luminance(channels) + .05), `${topic}: ${color}`).toBeGreaterThanOrEqual(4.5);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await card.scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath(`shared-reading-${selector.slice(1)}-${width}.png`) });
    }
  });
}

test('light reading theme retains readable contrast and full-width learning rows', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  const tiles = page.locator('.reference-foundation-path .reference-foundation-step');
  await expect(tiles).toHaveCount(14);
  const lastRow = await tiles.evaluateAll(elements => elements.slice(-2).map(element => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width };
  }));
  expect(lastRow[1].y).toBeGreaterThan(lastRow[0].y);
  expect(lastRow[0].x).toBeCloseTo(lastRow[1].x, 0);
  expect(lastRow[0].width).toBeGreaterThan(300);
  await tiles.filter({ hasText: 'Fehler & Reue' }).click();
  await expect(page.locator('.foundation-chapter:not([hidden]) p').first()).toBeVisible();
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  const paragraph = page.locator('.foundation-chapter:not([hidden]) p').first();
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
