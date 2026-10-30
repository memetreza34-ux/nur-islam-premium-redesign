import { expect, test, type Page } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
const frame = (page: Page) => page.locator('.screen-transition-frame');
const scroll = (page: Page) => frame(page).evaluate(node => node.scrollTop);

for (const width of [320, 768]) {
  test(`Home reading Back returns to the same Home position at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/?preview=1');
    const entry = page.locator('.journey-card--quran');
    await entry.scrollIntoViewIfNeeded();
    const before = await scroll(page);
    await entry.click();
    await expect(page.locator('.reference-reader-screen')).toBeVisible();
    await page.getByRole('button', { name: 'Zurück zu Start', exact: true }).click();
    await expect(page.locator('.premium-home')).toBeVisible();
    await expect.poll(() => scroll(page)).toBeCloseTo(before, 0);
    await expect(entry).toBeFocused();
    await page.screenshot({ path: testInfo.outputPath(`home-return-${width}.png`) });
  });

  test(`Quran search and scroll survive Reader Back and browser Forward at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Quran', exact: true }).click();
    const search = page.getByPlaceholder('Sure oder Nummer suchen …');
    await search.fill('Al-');
    const entry = page.locator('.reference-quran-list__main').nth(10);
    await entry.scrollIntoViewIfNeeded();
    const before = await scroll(page);
    const name = (await entry.getAttribute('aria-label'))!;
    await entry.click();
    await expect(page.locator('.reference-reader-screen')).toBeVisible();
    await page.getByRole('button', { name: 'Zurück zum Quran', exact: true }).click();
    await expect(search).toHaveValue('Al-');
    await expect(page.getByRole('button', { name, exact: true })).toBeVisible();
    await expect.poll(() => scroll(page)).toBeCloseTo(before, 0);
    await expect(page.locator('.reference-quran-list__main').nth(10)).toBeFocused();
    await page.goForward();
    await expect(page.locator('.reference-reader-screen')).toBeVisible();
    await page.goBack();
    await expect(search).toHaveValue('Al-');
    await expect.poll(() => scroll(page)).toBeCloseTo(before, 0);
  });

  test(`Wudu Back returns to its learning overview position at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    const entry = page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true });
    await entry.scrollIntoViewIfNeeded();
    const before = await scroll(page);
    await entry.click();
    await expect(page.locator('.wudu-lesson')).toBeVisible();
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();
    await expect(page.locator('.reference-learn-screen')).toBeVisible();
    await expect.poll(() => scroll(page)).toBeCloseTo(before, 0);
    await page.screenshot({ path: testInfo.outputPath(`learn-wudu-return-${width}.png`) });
  });

  test(`prayer course survives a Qibla detour and returns to the learning overview at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    const entry = page.getByRole('button', { name: 'Gebetsablauf Rakʿah mit Wortlaut', exact: true });
    await entry.scrollIntoViewIfNeeded();
    const overview = await scroll(page);
    await entry.click();
    await page.locator('.reference-prayer-course-selector button').filter({ hasText: 'Asr' }).click();
    await page.locator('.reference-rakah-practice > summary').click();
    await page.getByRole('button', { name: 'Rakʿah 2', exact: true }).click();
    const qibla = page.getByRole('button', { name: 'Qibla öffnen', exact: true });
    await qibla.scrollIntoViewIfNeeded();
    const before = await scroll(page);
    await qibla.click();
    await expect(page.getByRole('heading', { name: 'Qibla', exact: true })).toBeVisible();
    await page.getByRole('button', { name: /^Zurück/ }).click();
    await expect(page.locator('.reference-prayer-course-screen')).toBeVisible();
    await expect(page.locator('.reference-prayer-course-selector .is-active')).toContainText('Asr');
    await expect.poll(() => scroll(page)).toBeCloseTo(before, 0);
    await page.locator('.reference-rakah-practice > summary').click();
    await expect(page.locator('.reference-rakah-practice h2')).toContainText('Rakʿah 2');
    await page.getByRole('button', { name: 'Zurück zu Lernen', exact: true }).click();
    await expect(page.locator('.reference-learn-screen')).toBeVisible();
    await expect.poll(() => scroll(page)).toBeCloseTo(overview, 0);
  });
}

test('Quran search and favorites selection remain active after reading', async ({ page }) => {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Quran', exact: true }).click();
  const search = page.getByPlaceholder('Sure oder Nummer suchen …');
  await search.fill('112');
  await page.getByRole('button', { name: 'Al-Ikhlaas als Favorit markieren', exact: true }).click();
  await page.getByRole('button', { name: 'Favoriten', exact: true }).click();
  await page.locator('.reference-quran-list__main').click();
  await expect(page.locator('.reference-reader-screen')).toBeVisible();
  await page.getByRole('button', { name: 'Zurück zum Quran', exact: true }).click();
  await expect(search).toHaveValue('112');
  await expect(page.getByRole('button', { name: 'Favoriten', exact: true })).toHaveClass('is-active');
  await expect(page.locator('.reference-quran-list__main')).toHaveCount(1);
});

test('expanded Home overview remains expanded after an app detour', async ({ page }) => {
  await page.goto('/?preview=1');
  const details = page.locator('.premium-local-widgets__disclosure');
  await details.locator('summary').click();
  await expect(details).toHaveAttribute('open', '');
  await page.locator('.recommendation-card').filter({ hasText: 'Meine Sammlung' }).click();
  await expect(page.getByRole('heading', { name: 'Meine Sammlung', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /^Zurück/ }).click();
  await expect(details).toHaveAttribute('open', '');
});
