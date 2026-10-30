import { expect, test } from '@playwright/test';
import { getCategoryLessons } from '../src/data/islamicLearningContent';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
const reviewedIds = ['terms-niyyah', 'terms-dua', 'terms-dhikr', 'terms-tawba'];

for (const width of [320, 768, 1280]) {
  test(`four devotion lessons retain their meanings and sources at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text: string) => { (window as unknown as { sharedLesson: string }).sharedLesson = text; } }, configurable: true });
    });
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    await page.locator('.reference-foundation-step').filter({ hasText: 'Wichtige Begriffe' }).click();
    for (const id of reviewedIds) {
      const lesson = getCategoryLessons('terms').find(item => item.id === id)!;
      await page.getByRole('button', { name: /Lektion auswählen/ }).click();
      await page.locator('.learning-course-v2__lessons').getByRole('button').filter({ hasText: lesson.title }).click();
      const article = page.locator('.learning-course-v2__lesson');
      await expect(article).toContainText(lesson.summary);
      for (const paragraph of lesson.paragraphs) await expect(article).toContainText(paragraph);
      for (const detail of lesson.detailItems!) {
        await expect(article).toContainText(detail.title);
        await expect(article).toContainText(detail.text);
      }
      for (const point of lesson.keyPoints) await expect(page.locator('.learning-course-v2__takeaways')).toContainText(point);
      await expect(page.locator('.learning-course-v2__quiz')).toHaveCount(0);
      const sources = page.locator('.learning-course-v2__sources');
      await page.getByRole('button', { name: 'Quellen anzeigen: Quellen und wichtige Einordnung', exact: true }).click();
      await expect(sources.getByRole('link')).toHaveCount(lesson.sources.length);
      for (const source of lesson.sources) {
        const link = sources.getByRole('link', { name: source.reference, exact: true });
        await link.scrollIntoViewIfNeeded();
        await expect(link).toHaveAttribute('href', source.url!);
        const sourceCard = link.locator('xpath=../..');
        await expect(sourceCard).toContainText(source.note);
        const noteBounds = await sourceCard.locator('p').boundingBox();
        const cardBounds = await sourceCard.boundingBox();
        expect(noteBounds!.width).toBeGreaterThan(cardBounds!.width * .8);
        const bounds = await link.boundingBox();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(page.locator('.toast')).toHaveCount(0);
      await sources.locator('article').last().scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath(`${id}-${width}.png`) });
      await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
      await page.getByRole('button', { name: 'Lektion teilen', exact: true }).click();
      const shared = await page.evaluate(() => (window as unknown as { sharedLesson: string }).sharedLesson);
      expect(shared).toContain(lesson.summary);
      for (const source of lesson.sources) { expect(shared).toContain(source.reference); expect(shared).toContain(source.url); }
    }
  });
}
