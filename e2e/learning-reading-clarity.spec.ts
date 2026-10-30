import { expect, test, type Page } from '@playwright/test';
import { WORSHIP_GUIDES } from '../src/data/worshipGuideData';
import { getCategoryLessons } from '../src/data/islamicLearningContent';
import { PROPHETS } from '../src/data/prophetData';
import { PROPHET_COURSES } from '../src/data/prophetCourseData';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
async function learning(page: Page) {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
}

test('learning entry loads without render errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await learning(page);
  await expect(page.locator('.reference-foundation-step')).toHaveCount(14);
  await expect(page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768]) {
  test(`reading actions and essentials stay clear at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await learning(page);
    await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
    await expect(page.locator('.reference-guide-topics')).toHaveCount(0);
    await page.getByRole('button', { name: 'Nächster Schritt', exact: true }).click();
    const card = page.getByRole('article', { name: 'Hände waschen', exact: true });
    await expect(card).toContainText(WORSHIP_GUIDES[0].steps[1].description);
    await expect(card.locator('.wudu-lesson__wording')).toHaveCount(0);
    expect((await card.boundingBox())!.height).toBeLessThan(650);
    await card.screenshot({ path: testInfo.outputPath(`wudu-clear-${width}.png`) });
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();
    await page.getByRole('button', { name: /Allah & der Glaube/ }).click();
    await expect(page.locator('.learning-course-v2__intro')).toHaveCount(0);
    const header = page.locator('.learning-course-v2__lesson > header');
    expect((await header.boundingBox())!.height).toBeLessThan(300);
    await expect(page.locator('.learning-course-v2__quiz')).toHaveCount(0);
    await page.screenshot({ path: testInfo.outputPath(`lesson-clear-${width}.png`) });
    await page.getByRole('button', { name: 'Nächste Lektion', exact: true }).click();
    await expect(page.locator('.learning-course-v2__quiz')).toHaveCount(0);
    await page.getByRole('button', { name: 'Zurück zu Lernen', exact: true }).click();
    await page.getByRole('button', { name: 'Gebetsablauf Rakʿah mit Wortlaut', exact: true }).click();
    expect((await page.locator('.reference-prayer-course-hero').boundingBox())!.height).toBeLessThan(180);
    const prayerPicker = page.getByRole('region', { name: 'Gebet auswählen', exact: true });
    await expect(prayerPicker.getByRole('button')).toHaveCount(5);
    await expect(prayerPicker.getByRole('button', { pressed: true })).toHaveCount(1);
    const pickerBox = (await prayerPicker.boundingBox())!;
    for (const button of await prayerPicker.getByRole('button').all()) {
      const box = (await button.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(pickerBox.x);
      expect(box.x + box.width).toBeLessThanOrEqual(pickerBox.x + pickerBox.width + 1);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    expect((await page.locator('.reference-rakah-practice').boundingBox())!.height).toBeLessThan(58);
    expect((await page.locator('.reference-prayer-step-chooser').boundingBox())!.height).toBeLessThan(58);
    await expect(page.locator('.reference-prayer-preparation')).not.toHaveAttribute('open');
    await expect(page.locator('.reference-rakah-practice')).not.toHaveAttribute('open');
    const heading = (await page.locator('#prayer-step-title').boundingBox())!;
    expect(heading.y + heading.height).toBeLessThan(720);
    await page.screenshot({ path: testInfo.outputPath(`prayer-clear-${width}.png`) });
    await page.locator('.reference-prayer-preparation > summary').click();
    await expect(page.getByRole('button', { name: 'Wudu und Reinheit prüfen', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test('all twenty-five prophet courses retain their ninety-seven reading chapters', async ({ page }, testInfo) => {
  test.setTimeout(300_000);
  await page.setViewportSize({ width: 390, height: 900 });
  await learning(page);
  await page.getByRole('button', { name: /Die 25 Propheten/ }).click();
  for (const [index, prophet] of PROPHETS.entries()) {
    const course = PROPHET_COURSES[prophet.id];
    await page.locator('.reference-prophet-catalogue > button').nth(index).click();
    const overview = page.locator('.reference-prophet-overview');
    await expect(overview).not.toHaveAttribute('open');
    await expect(page.locator('.reference-prophet-course__progress, .reference-prophet-status')).toHaveCount(0);
    await overview.locator('summary').click();
    await expect(overview).toContainText(course.introduction);
    await expect(overview.locator('.reference-prophet-overview__facts li')).toHaveCount(course.chapters.length);
    await overview.locator('summary').click();
    for (const chapter of course.chapters) {
      const plan = page.locator('.reference-prophet-plan');
      await plan.locator('summary').click();
      await plan.getByRole('button').filter({ hasText: chapter.title }).click();
      await expect(plan).not.toHaveAttribute('open');
      const article = page.locator('.reference-prophet-lesson');
      await expect(article.getByRole('heading', { name: chapter.title, exact: true })).toBeVisible();
      const titleStyle = await article.locator('header h2').evaluate(element => { const style = getComputedStyle(element); return { family: style.fontFamily, size: parseFloat(style.fontSize) }; });
      expect(titleStyle.family).toContain('Cormorant Garamond');
      expect(titleStyle.size).toBe(28);
      await expect(article.getByText(chapter.summary, { exact: true })).toHaveCount(1);
      for (const paragraph of chapter.paragraphs) await expect(article).toContainText(paragraph);
      for (const point of chapter.keyPoints) await expect(article).toContainText(point);
      await page.getByRole('button', { name: 'Quellen anzeigen: Im Quran nachlesen', exact: true }).click();
      for (const reference of chapter.quranReferences) await expect(page.getByRole('button', { name: `${reference} im Quran öffnen`, exact: true })).toBeEnabled();
      await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
    }
    if (index === 0) {
      await page.locator('.screen-transition-frame').evaluate(element => { element.scrollTop = 0; });
      await page.screenshot({ path: testInfo.outputPath('prophet-reading-390.png') });
    }
    await page.locator('.reference-screen-header').getByRole('button', { name: 'Zurück', exact: true }).click();
  }
});

for (const width of [320, 768]) {
  test(`names and schools keep readable entries at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await learning(page);
    await page.getByRole('button', { name: /99 Namen Allahs/ }).click();
    await expect(page.locator('.reference-name-list--complete > article')).toHaveCount(99);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.screenshot({ path: testInfo.outputPath(`names-${width}.png`) });
    await learning(page);
    await page.getByRole('button', { name: /Die vier Rechtsschulen/ }).click();
    await expect(page.locator('.madhhab-grid > button')).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.screenshot({ path: testInfo.outputPath(`schools-${width}.png`) });
  });
}

test('all forty-four lessons remain freely readable without end-of-lesson tests', async ({ page }) => {
  test.setTimeout(180_000);
  for (const [id, title] of [['faith', 'Allah & der Glaube'], ['pillars', 'Die fünf Säulen'], ['terms', 'Wichtige Begriffe'], ['practice', 'Reinheit & Alltag'], ['character', 'Charakter & Rechte'], ['community', 'Miteinander & Verantwortung'], ['prophet', 'Der Prophet ﷺ']] as const) {
    await learning(page);
    await page.locator('.reference-foundation-step').filter({ hasText: title }).click();
    for (const lesson of getCategoryLessons(id)) {
      await page.getByRole('button', { name: /Lektion auswählen/ }).click();
      await page.locator('.learning-course-v2__lessons button').filter({ hasText: lesson.title }).click();
      const article = page.locator('.learning-course-v2__lesson');
      await expect(article).toContainText(lesson.summary);
      for (const paragraph of lesson.paragraphs) await expect(article).toContainText(paragraph);
      await expect(page.locator('.learning-course-v2__quiz')).toHaveCount(0);
      await expect(page.locator('.is-complete, [role="progressbar"]')).toHaveCount(0);
    }
  }
});
