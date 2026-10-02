import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function openLearning(page: Page) {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Lernen', exact: true })).toBeVisible();
}

for (const width of [320, 390, 768]) {
  test(`learning art has its own space and course opens at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openLearning(page);
    const overview = page.getByRole('region', { name: 'Einführung in den Lernbereich', exact: true });
    await expect(overview).toContainText('Islam verstehen.');
    await expect(overview.locator('img')).toHaveAttribute('src', /home-quran-illustrated-v1.webp/);
    if (width === 390) await overview.screenshot({ path: testInfo.outputPath('learning-overview-390.png') });
    const intro = page.getByRole('region', { name: 'Beten lernen', exact: true });
    const art = intro.locator('img');
    await expect(art).toHaveAttribute('src', /home-learn-prayer-v2.webp/);
    await expect(art).toHaveAttribute('alt', '');
    await expect.poll(() => art.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    const container = (await intro.boundingBox())!;
    const heading = (await intro.locator('.learning-intro__heading').boundingBox())!;
    const image = (await art.boundingBox())!;
    const description = (await intro.locator('.learning-intro__description').boundingBox())!;
    const progress = (await intro.locator('.reference-prayer-learning-hub__progress').boundingBox())!;
    const start = intro.getByRole('button', { name: 'Gebetskurs starten', exact: true });
    const action = (await start.boundingBox())!;
    expect(heading.x + heading.width).toBeLessThanOrEqual(image.x);
    expect(image.x + image.width).toBeLessThan(container.x + container.width);
    expect(description.y).toBeGreaterThanOrEqual(heading.y + heading.height);
    expect(progress.y).toBeGreaterThanOrEqual(description.y + description.height);
    expect(action.y).toBeGreaterThanOrEqual(progress.y + progress.height);
    expect(action.height).toBeGreaterThanOrEqual(44);
    await expect(intro).toContainText('0/6 Gebetsgrundlagen abgeschlossen');
    await intro.screenshot({ path: testInfo.outputPath(`learning-${width}.png`) });
    await start.click();
    await expect(page.getByRole('heading', { name: 'Gebetskurs', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Zurück zu Lernen', exact: true }).click();
    await expect(intro).toBeVisible();
    for (const row of await page.locator('.learn-library-prayer-card').all()) {
      await row.scrollIntoViewIfNeeded();
      await expect.poll(() => row.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      const layout = await row.evaluate(element => {
        const box = element.getBoundingClientRect();
        const scene = element.querySelector('.learn-library-prayer-scene')!.getBoundingClientRect();
        const copy = element.querySelector('.learn-library-prayer-copy')!.getBoundingClientRect();
        const badge = element.querySelector('.learn-library-prayer-rakahs')!.getBoundingClientRect();
        return { width: box.width, sceneWidth: scene.width, copyRight: copy.right, badgeLeft: badge.left, badgeRight: badge.right, right: box.right };
      });
      expect(layout.sceneWidth).toBeGreaterThan(layout.width - 4);
      expect(layout.copyRight).toBeLessThanOrEqual(layout.badgeLeft);
      expect(layout.badgeRight).toBeLessThan(layout.right);
    }
    await page.locator('.learn-library-prayer-card--fajr').screenshot({ path: testInfo.outputPath(`prayer-card-${width}.png`) });

    const learningCard = page.locator('.learn-library-card').first();
    await learningCard.scrollIntoViewIfNeeded();
    const cardLayout = await learningCard.evaluate(element => {
      const marker = element.querySelector('.reference-foundation-step__marker')!.getBoundingClientRect();
      const art = element.querySelector('.learn-library-card__art')!.getBoundingClientRect();
      const copy = element.querySelector('.reference-foundation-step__copy')!.getBoundingClientRect();
      return { markerRight: marker.right, artLeft: art.left, visualBottom: Math.max(marker.bottom, art.bottom), copyTop: copy.top };
    });
    expect(cardLayout.markerRight).toBeLessThanOrEqual(cardLayout.artLeft);
    expect(cardLayout.copyTop).toBeGreaterThanOrEqual(cardLayout.visualBottom);
  });
}

test('illustration failure leaves a readable intro and working course', async ({ page }) => {
  await page.route('**/home-learn-prayer-v2.webp*', route => route.abort());
  await openLearning(page);
  const intro = page.getByRole('region', { name: 'Beten lernen', exact: true });
  await expect(intro.locator('img')).toBeHidden();
  await expect(intro.locator('.premium-image__fallback svg')).toBeVisible();
  await intro.getByRole('button', { name: 'Gebetskurs starten', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Gebetskurs', exact: true })).toBeVisible();
});

test('learning overview follows three readable chapters without horizontal overflow', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();

  const prayerPractice = page.locator('.learn-library-practice--priority');
  const knowledgeCurriculum = page.locator('.reference-knowledge-curriculum');
  const overview = page.getByRole('region', { name: 'Einführung in den Lernbereich', exact: true });
  await expect(prayerPractice).toBeVisible();
  await expect(prayerPractice.locator('.learn-library-action-visual img')).toHaveCount(3);
  await expect(prayerPractice.locator('.learn-library-action-visual img').nth(0)).toHaveAttribute('src', /wudu-washing-v1.webp/);
  await expect(prayerPractice.locator('.learn-library-action-visual img').nth(1)).toHaveAttribute('src', /learn-salah-v3.webp/);
  await expect(prayerPractice.locator('.learn-library-action-visual img').nth(2)).toHaveAttribute('src', /home-qibla-illustrated-v1.webp/);
  for (const art of await prayerPractice.locator('img').all()) {
    await art.scrollIntoViewIfNeeded();
    await expect.poll(() => art.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  }
  for (const prayer of [
    ['Fajr', 'Morgengebet', 'Zwei Pflicht-Rakʿah'],
    ['Dhuhr', 'Mittagsgebet', 'Vier Pflicht-Rakʿah'],
    ['Asr', 'Nachmittagsgebet', 'Vier Pflicht-Rakʿah'],
    ['Maghrib', 'Abendgebet', 'Drei Pflicht-Rakʿah'],
    ['Isha', 'Nachtgebet', 'Vier Pflicht-Rakʿah'],
  ]) {
    const row = prayerPractice.getByRole('button', { name: new RegExp(prayer[0]) });
    await expect(row).toContainText(prayer[1]);
    await expect(row).toContainText(prayer[2]);
    await expect(row.locator('.learn-library-prayer-scene img')).toHaveAttribute('src', new RegExp(`prayer-${prayer[0].toLowerCase()}-v1.webp`));
  }
  const prayerPosition = (await prayerPractice.boundingBox())!;
  const knowledgePosition = (await knowledgeCurriculum.boundingBox())!;
  const overviewPosition = (await overview.boundingBox())!;
  const prayerIntroPosition = (await page.getByRole('region', { name: 'Beten lernen', exact: true }).boundingBox())!;
  expect(overviewPosition.y).toBeLessThan(prayerIntroPosition.y);
  expect(prayerPosition.y).toBeLessThan(knowledgePosition.y);
  await prayerPractice.screenshot({ path: testInfo.outputPath('learning-prayers-390.png') });

  const chapters = page.locator('.learn-library-chapter');
  await expect(chapters).toHaveCount(3);
  await expect(page.locator('.learn-library-index').getByRole('button')).toHaveCount(3);
  await expect(page.locator('.reference-foundation-step')).toHaveCount(14);
  await expect(page.locator('.learn-library-card__art img')).toHaveCount(14);
  await expect(page.locator('.reference-foundation-step--madhhabs img')).toHaveAttribute('src', /learn-madhhabs-v3.webp/);
  await expect(page.getByRole('button', { name: /99 Namen Allahs/ }).locator('img')).toHaveAttribute('src', /home-names-v1.webp/);
  await expect(page.getByRole('button', { name: /Hajj & Umrah/ }).locator('img')).toHaveAttribute('src', /kaaba-v2.webp/);
  await expect(page.getByRole('button', { name: /Hadith-Sammlung/ }).locator('img')).toHaveAttribute('src', /learn-hadith-v3.webp/);
  await expect(page.getByRole('button', { name: /Sunnah im Alltag/ }).locator('img')).toHaveAttribute('src', /learn-sunnah-v3.webp/);
  await expect(page.getByRole('button', { name: /Fehler & Reue/ }).locator('img')).toHaveAttribute('src', /learn-repentance-v3.webp/);
  const chapterList = await chapters.all();
  for (const [index, chapter] of chapterList.entries()) {
    await expect(chapter.locator('.learn-library-chapter__header .premium-image')).toHaveCount(0);
    await chapter.screenshot({ path: testInfo.outputPath(`learning-chapter-${index + 1}-390.png`) });
  }

  const dimensions = await page.locator('.reference-learn-screen').evaluate(element => ({
    scrollWidth: element.scrollWidth,
    clientWidth: element.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});
