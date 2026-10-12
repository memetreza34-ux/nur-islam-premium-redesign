import { expect, test } from '@playwright/test';
import { getCategoryLessons } from '../src/data/islamicLearningContent';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
const groups = [['practice-overview', 'fiqh-purity'], ['fiqh-ghusl-tayammum', 'fiqh-prayer-time'], ['fiqh-asking']];

for (const width of [320, 768, 1280]) {
  for (const ids of groups) {
    test(`practice ${ids.join(', ')} retains meanings and sources at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.route('**/api.aladhan.com/**', route => route.abort());
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
        Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text: string) => { (window as unknown as { sharedLesson: string }).sharedLesson = text; } }, configurable: true });
      });
      await page.goto('/?preview=1');
      await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
      await page.locator('.reference-foundation-step').filter({ hasText: 'Reinheit & Alltag' }).click();
      for (const id of ids) {
        const lesson = getCategoryLessons('practice').find(item => item.id === id)!;
        await page.getByRole('button', { name: /Kursplan/ }).click();
        await page.locator('.learning-course-v2__lessons').getByRole('button').filter({ hasText: lesson.title }).click();
        const article = page.locator('.learning-course-v2__lesson');
        await expect(article).toContainText(lesson.summary);
        for (const paragraph of lesson.paragraphs) await expect(article).toContainText(paragraph);
        for (const detail of lesson.detailItems ?? []) {
          await expect(article).toContainText(detail.title);
          await expect(article).toContainText(detail.text);
        }
        for (const point of lesson.keyPoints) await expect(page.locator('.learning-course-v2__takeaways')).toContainText(point);
        const quiz = page.locator('.learning-course-v2__quiz');
        await expect(quiz).toContainText(lesson.question.prompt);
        for (const option of lesson.question.options) await expect(quiz).toContainText(option);
        await quiz.getByRole('button', { name: `B ${lesson.question.options[1]}`, exact: true }).click();
        await expect(quiz).toContainText(lesson.question.explanation);
        const sources = page.locator('.learning-course-v2__sources');
        await sources.locator('summary').click();
        await expect(sources.locator('article')).toHaveCount(lesson.sources.length);
        await expect(sources.getByRole('link')).toHaveCount(lesson.sources.filter(source => source.url).length);
        for (const [index, source] of lesson.sources.entries()) {
          const card = sources.locator('article').nth(index);
          await card.scrollIntoViewIfNeeded();
          await expect(card).toContainText(source.reference);
          await expect(card).toContainText(source.note);
          if (source.url) {
            const link = card.getByRole('link', { name: source.reference, exact: true });
            await expect(link).toHaveAttribute('href', source.url);
            const bounds = await link.boundingBox();
            expect(bounds!.x).toBeGreaterThanOrEqual(0);
            expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
          } else {
            await expect(card.getByRole('link')).toHaveCount(0);
            await expect(card).toContainText('Interner Bedienhinweis');
          }
          const noteBounds = await card.locator('p').boundingBox();
          const cardBounds = await card.boundingBox();
          expect(noteBounds!.width).toBeGreaterThan(cardBounds!.width * .8);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        await expect(page.locator('.toast')).toHaveCount(0);
        await page.screenshot({ path: testInfo.outputPath(`${id}-${width}.png`) });
        await page.getByRole('button', { name: 'Lektion teilen', exact: true }).click();
        const shared = await page.evaluate(() => (window as unknown as { sharedLesson: string }).sharedLesson);
        expect(shared).toContain(lesson.summary);
        for (const source of lesson.sources) {
          expect(shared).toContain(source.reference);
          if (source.url) expect(shared).toContain(source.url);
        }
        await sources.locator('summary').click();
      }
    });
  }
  test(`practice UI references match Wudu disclaimer and prayer settings at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    await page.locator('.learn-library-actions').getByRole('button', { name: /Wudu/ }).click();
    await expect(page.locator('.reference-guide-screen .reference-source-card')).toContainText('Einzelheiten unterscheiden sich teilweise zwischen Rechtsschulen');
    await page.getByRole('navigation').getByRole('button', { name: 'Gebet', exact: true }).click();
    await page.getByRole('button', { name: 'Berechnung', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Gebetszeiten-Einstellungen' });
    await expect(dialog.getByRole('heading', { name: 'Berechnung anpassen', exact: true })).toBeVisible();
    await expect(dialog).toContainText('Berechnungsmethode');
    await expect(dialog).toContainText('Asr-Berechnung');
    await expect(dialog.getByRole('button', { name: /Hanafi/ })).toBeVisible();
    await dialog.getByRole('button', { name: 'Schließen', exact: true }).click();
    const method = page.locator('.reference-prayer-method');
    await method.scrollIntoViewIfNeeded();
    await expect(method).toContainText('Asr');
    await expect(method).toContainText('Keine aktuellen Zeiten gespeichert');
    await expect(page.getByText('Für diesen Standort liegen gerade keine verwendbaren Gebetszeiten vor. Aktualisiere die Daten oder gleiche mit einer örtlichen Moschee ab.', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}
