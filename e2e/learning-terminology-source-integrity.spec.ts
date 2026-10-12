import { expect, test } from '@playwright/test';
import { getCategoryLessons } from '../src/data/islamicLearningContent';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

const groups = [
  ['terms-overview', 'terms-islam-iman-ihsan'],
  ['terms-fard', 'terms-sunnah'],
  ['terms-mubah-makruh', 'terms-halal'],
  ['terms-haram', 'terms-hadith-fiqh-madhhab'],
];

for (const width of [320, 768, 1280]) {
  for (const [groupIndex, ids] of groups.entries()) {
  test(`terminology group ${groupIndex + 1} preserves text, context and sharing at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text: string) => { (window as unknown as { sharedLesson: string }).sharedLesson = text; } }, configurable: true });
    });
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    await page.locator('.reference-foundation-step').filter({ hasText: 'Wichtige Begriffe' }).click();
    for (const id of ids) {
    const lesson = getCategoryLessons('terms').find(item => item.id === id)!;
    await page.getByRole('button', { name: /Kursplan/ }).click();
    await page.locator('.learning-course-v2__lessons').getByRole('button').filter({ hasText: lesson.title }).click();
    const article = page.locator('.learning-course-v2__lesson');
    await expect(article).toContainText(lesson.summary);
    for (const paragraph of lesson.paragraphs) await expect(article).toContainText(paragraph);
    for (const detail of lesson.detailItems!) {
      await expect(article).toContainText(detail.title);
      await expect(article).toContainText(detail.text);
    }
    for (const point of lesson.keyPoints) await expect(page.locator('.learning-course-v2__takeaways')).toContainText(point);
    const quiz = page.locator('.learning-course-v2__quiz');
    await expect(quiz).toContainText(lesson.question.prompt);
    for (const option of lesson.question.options) await expect(quiz).toContainText(option);
    const wrongIndex = lesson.question.options.findIndex((_, index) => index !== lesson.question.correctIndex);
    await quiz.getByRole('button', { name: lesson.question.options[wrongIndex] }).click();
    await expect(quiz).toContainText(lesson.question.explanation);
    const sources = page.locator('.learning-course-v2__sources');
    await sources.locator('summary').click();
    await expect(sources.getByRole('link')).toHaveCount(lesson.sources.length);
    for (const source of lesson.sources) {
      const link = sources.getByRole('link', { name: source.reference, exact: true });
      await link.scrollIntoViewIfNeeded();
      await expect(link).toHaveAttribute('href', source.url!);
      const card = link.locator('xpath=../..');
      await expect(card).toContainText(source.note);
      const bounds = await link.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
      const noteBounds = await card.locator('p').boundingBox();
      const cardBounds = await card.boundingBox();
      expect(noteBounds!.width).toBeGreaterThan(cardBounds!.width * .8);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.locator('.toast')).toHaveCount(0);
    await sources.locator('article').last().scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`${id}-${width}.png`) });
    await page.getByRole('button', { name: 'Lektion teilen', exact: true }).click();
    const shared = await page.evaluate(() => (window as unknown as { sharedLesson: string }).sharedLesson);
    expect(shared).toContain(lesson.title);
    expect(shared).toContain(lesson.summary);
    for (const source of lesson.sources) {
      expect(shared).toContain(source.reference);
      expect(shared).toContain(source.url);
    }
    await sources.locator('summary').click();
    }
  });
  }
}
