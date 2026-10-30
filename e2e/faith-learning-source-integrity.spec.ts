import { expect, test } from '@playwright/test';
import { getCategoryLessons } from '../src/data/islamicLearningContent';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const category of ['faith', 'pillars'] as const) {
for (const width of [320, 768, 1280]) {
  test(`all ${category} lessons retain their source context at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: async (text: string) => { (window as unknown as { sharedLesson: string }).sharedLesson = text; } },
        configurable: true,
      });
    });
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    await page.locator('.reference-foundation-step').filter({ hasText: category === 'faith' ? 'Allah & der Glaube' : 'Die fünf Säulen' }).click();
    const lessons = getCategoryLessons(category);
    const sources = page.locator('.learning-course-v2__sources');

    for (const [index, lesson] of lessons.entries()) {
      const article = page.locator('.learning-course-v2__lesson');
      await expect(article.getByRole('heading', { name: lesson.title, exact: true })).toBeVisible();
      await expect(article).toContainText(lesson.summary);
      for (const paragraph of lesson.paragraphs) await expect(article).toContainText(paragraph);
      for (const detail of lesson.detailItems ?? []) {
        await expect(article).toContainText(detail.title);
        await expect(article).toContainText(detail.text);
        if (detail.lang === 'ar') {
          const arabic = article.locator('p[lang="ar"]');
          await expect(arabic).toHaveText(detail.text);
          await expect(arabic).toHaveAttribute('dir', 'rtl');
        }
      }
      for (const point of lesson.keyPoints) await expect(page.locator('.learning-course-v2__takeaways')).toContainText(point);
      await expect(page.locator('.learning-course-v2__quiz')).toHaveCount(0);
      await page.getByRole('button', { name: 'Quellen anzeigen: Quellen und wichtige Einordnung', exact: true }).click();
      const links = sources.getByRole('link');
      await expect(links).toHaveCount(lesson.sources.length);
      for (const [sourceIndex, source] of lesson.sources.entries()) {
        const link = links.nth(sourceIndex);
        await link.scrollIntoViewIfNeeded();
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', source.url!);
        await expect(link.locator('xpath=../..')).toContainText(source.note);
        const bounds = await link.boundingBox();
        expect(bounds?.x).toBeGreaterThanOrEqual(0);
        expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(width + 1);
        expect(await link.evaluate(node => getComputedStyle(node).color)).toBe(await link.locator('..').evaluate(node => getComputedStyle(node).color));
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
      await page.getByRole('button', { name: 'Lektion teilen', exact: true }).click();
      const shared = await page.evaluate(() => (window as unknown as { sharedLesson: string }).sharedLesson);
      expect(shared).toContain(lesson.summary);
      for (const source of lesson.sources) {
        expect(shared).toContain(source.reference);
        expect(shared).toContain(source.url);
      }
      if ((category === 'faith' ? [0, 2, 6] : [1, 3, 5]).includes(index)) {
        await page.screenshot({ path: testInfo.outputPath(`${lesson.id}-${width}.png`) });
      }
      if (index < lessons.length - 1) await page.getByRole('button', { name: 'Nächste Lektion', exact: true }).click();
    }
    await page.getByRole('button', { name: 'Quellen anzeigen: Quellen und wichtige Einordnung', exact: true }).click();
    await expect(page.locator('.learning-course-v2__sources-notice')).toContainText('keinen vollständigen Tafsir');
    await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
  });
}
}
