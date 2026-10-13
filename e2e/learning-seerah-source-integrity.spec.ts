import { expect, test } from '@playwright/test';
import { getCategoryLessons } from '../src/data/islamicLearningContent';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
const groups = [['prophet-overview', 'seerah-revelation'], ['seerah-hijra', 'seerah-example']];

for (const width of [320, 768]) {
  for (const ids of groups) {
    test(`seerah ${ids.join(', ')} preserves meanings and sources at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.route('**/api.aladhan.com/**', route => route.abort());
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
        Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text: string) => { (window as unknown as { sharedLesson: string }).sharedLesson = text; } }, configurable: true });
      });
      await page.goto('/?preview=1');
      await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
      await page.locator('.reference-foundation-step').filter({ hasText: 'Der Prophet ﷺ' }).click();
      for (const id of ids) {
        const lesson = getCategoryLessons('prophet').find(item => item.id === id)!;
        await page.getByRole('button', { name: /Kursplan/ }).click();
        await page.locator('.learning-course-v2__lessons').getByRole('button').filter({ hasText: lesson.title }).click();
        await expect(page.locator('.toast')).toHaveCount(0);
        const article = page.locator('.learning-course-v2__lesson');
        await expect(article).toContainText(lesson.duration);
        await expect(article).toContainText(lesson.summary);
        for (const [index, paragraph] of lesson.paragraphs.entries()) {
          await expect(article).toContainText(paragraph);
          await expect(article).toContainText(lesson.sectionTitles![index]);
        }
        for (const detail of lesson.detailItems ?? []) {
          await expect(article).toContainText(detail.title);
          await expect(article).toContainText(detail.text);
        }
        for (const point of lesson.keyPoints) await expect(page.locator('.learning-course-v2__takeaways')).toContainText(point);
        await article.getByText(lesson.paragraphs[2], { exact: true }).scrollIntoViewIfNeeded();
        await page.screenshot({ path: testInfo.outputPath(`${id}-reading-${width}.png`) });
        const quiz = page.locator('.learning-course-v2__quiz');
        await expect(quiz).toContainText(lesson.question.prompt);
        for (const option of lesson.question.options) await expect(quiz).toContainText(option);
        await quiz.getByRole('button', { name: `B ${lesson.question.options[1]}`, exact: true }).click();
        await expect(quiz).toContainText(lesson.question.explanation);
        await expect(quiz).toContainText(lesson.question.options[lesson.question.correctIndex]);
        const sources = page.locator('.learning-course-v2__sources');
        await sources.locator('summary').click();
        await expect(sources.locator('article')).toHaveCount(lesson.sources.length);
        await expect(sources.getByRole('link')).toHaveCount(lesson.sources.length);
        for (const [index, source] of lesson.sources.entries()) {
          const card = sources.locator('article').nth(index);
          await card.scrollIntoViewIfNeeded();
          await expect(card).toContainText(source.note);
          const link = card.getByRole('link', { name: source.reference, exact: true });
          await expect(link).toHaveAttribute('href', source.url!);
          await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
          const bounds = await link.boundingBox();
          expect(bounds!.x).toBeGreaterThanOrEqual(0);
          expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
          const noteBounds = await card.locator('p').boundingBox();
          const cardBounds = await card.boundingBox();
          expect(noteBounds!.width).toBeGreaterThan(cardBounds!.width * .8);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        await page.screenshot({ path: testInfo.outputPath(`${id}-sources-${width}.png`) });
        await page.getByRole('button', { name: 'Lektion teilen', exact: true }).click();
        const shared = await page.evaluate(() => (window as unknown as { sharedLesson: string }).sharedLesson);
        expect(shared).toContain(lesson.summary);
        for (const source of lesson.sources) {
          expect(shared).toContain(source.reference);
          expect(shared).toContain(source.url!);
        }
        await sources.locator('summary').click();
      }
    });
  }
}
