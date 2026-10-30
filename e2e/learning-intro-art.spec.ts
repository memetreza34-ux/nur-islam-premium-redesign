import { expect, test, type Page } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function openLearning(page: Page) {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Lernen', exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

for (const width of [320, 390, 768]) {
  test(`learning directory stays compact and consistent at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openLearning(page);
    const index = page.getByRole('navigation', { name: 'Lernbereiche', exact: true });
    await expect(index.getByRole('button')).toHaveText(['Gebet', 'Grundlagen', 'Alltag', 'Vertiefen']);
    await expect(page.locator('.learn-library-intro, .learn-library-prayer-entry, .learn-library-prayers')).toHaveCount(0);
    await expect(page.locator('.reference-foundation-step')).toHaveCount(14);
    await expect(page.locator('.learn-library-card .topic-card__status')).toHaveCount(0);
    const entry = page.getByRole('button', { name: 'Gebetsablauf Rakʿah mit Wortlaut', exact: true });
    const qibla = page.locator('.learn-library-actions .topic-card').last();
    await expect(qibla).toBeInViewport({ ratio: 1 });
    await page.screenshot({ path: testInfo.outputPath(`learning-top-${width}.png`) });
    await entry.click();
    await expect(page.getByRole('heading', { name: 'Gebetskurs', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Zurück zu Lernen', exact: true }).click();
    await expect(entry).toBeInViewport();

    const rows = page.locator('.reference-learn-screen .topic-card');
    await expect(rows).toHaveCount(17);
    const typography = await rows.evaluateAll(elements => elements.map(element => {
      const title = element.querySelector('.topic-card__title')!;
      const description = element.querySelector('.topic-card__description')!;
      const art = element.querySelector('.topic-card__art')!;
      const copy = element.querySelector('.topic-card__copy')!;
      const arrow = element.querySelector('.topic-card__arrow')!;
      const titleStyle = getComputedStyle(title);
      const descriptionStyle = getComputedStyle(description);
      return {
        title: [titleStyle.fontSize, titleStyle.fontWeight, titleStyle.color],
        description: [descriptionStyle.fontSize, descriptionStyle.fontWeight, descriptionStyle.color],
        artLeft: art.getBoundingClientRect().left,
        artRight: art.getBoundingClientRect().right,
        copyLeft: copy.getBoundingClientRect().left,
        copyRight: copy.getBoundingClientRect().right,
        arrowLeft: arrow.getBoundingClientRect().left,
        overflow: element.scrollWidth > element.clientWidth,
      };
    }));
    for (const row of typography) {
      expect(row.title).toEqual(typography[0].title);
      expect(row.description).toEqual(typography[0].description);
      expect(row.title.slice(0, 2)).toEqual(['22px', '600']);
      expect(row.description.slice(0, 2)).toEqual(['14px', '400']);
      expect(row.artRight).toBeLessThanOrEqual(row.copyLeft);
      expect(row.copyRight).toBeLessThanOrEqual(row.arrowLeft);
      expect(row.overflow).toBe(false);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test('area navigation reaches each section and returning restores the selected card', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openLearning(page);
  const index = page.getByRole('navigation', { name: 'Lernbereiche', exact: true });
  for (const [label, title] of [['Grundlagen', 'Grundlagen'], ['Alltag', 'Alltag & Miteinander'], ['Vertiefen', 'Geschichte & Wissen'], ['Gebet', 'Gebetspraxis']]) {
    await index.getByRole('button', { name: label, exact: true }).click();
    const heading = page.getByRole('heading', { name: title, exact: true });
    await expect(heading).toBeInViewport();
    await expect.poll(async () => (await heading.boundingBox())!.y).toBeLessThan(100);
    if (label !== 'Gebet') await page.screenshot({ path: testInfo.outputPath(`learning-${label}.png`) });
  }
  await index.getByRole('button', { name: 'Grundlagen', exact: true }).click();
  const card = page.locator('.reference-foundation-step').first();
  await card.click();
  await expect(page.locator('.learning-course-v2')).toBeVisible();
  await page.getByRole('button', { name: 'Zurück zu Lernen', exact: true }).click();
  await expect(card).toBeInViewport();
  await expect(page.locator('.learn-library-chapter')).toHaveCount(3);
  for (const art of await page.locator('.learn-library-card .topic-card__art img').all()) {
    await art.scrollIntoViewIfNeeded();
    await expect.poll(() => art.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  }
});

test('missing illustration keeps the direct course entry usable', async ({ page }) => {
  await page.route('**/home-learn-prayer-v5.webp*', route => route.abort());
  await openLearning(page);
  const entry = page.getByRole('button', { name: 'Gebetsablauf Rakʿah mit Wortlaut', exact: true });
  await expect(entry.locator('img')).toBeHidden();
  await expect(entry.locator('.premium-image__fallback svg')).toBeVisible();
  await entry.click();
  await expect(page.getByRole('heading', { name: 'Gebetskurs', exact: true })).toBeVisible();
});
