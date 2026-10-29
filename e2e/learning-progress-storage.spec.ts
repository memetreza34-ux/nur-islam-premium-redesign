import { expect, test } from '@playwright/test';
import { getCategoryLessons } from '../src/data/islamicLearningContent';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 390, 768]) {
  for (const stored of ['["faith-overview","pillars-hajj"]', '{broken']) {
    test(`lessons remain readable without completion at ${width}px with ${stored}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(value => { if (localStorage.getItem('nur_learning_completed') === null) localStorage.setItem('nur_learning_completed', value); }, stored);
      await page.goto('/?preview=1');
      await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
      const entry = page.locator('.reference-foundation-step').filter({ hasText: 'Allah & der Glaube' });
      await expect(entry).toContainText('Allah & der Glaube');
      await expect(entry).not.toContainText(/\d+\/\d+/);
      await expect(page.locator('.reference-knowledge-progress, .reference-knowledge-overview')).toHaveCount(0);
      await entry.click();
      await page.locator('.learning-course-v2__plan-toggle').click();
      const lessons = page.locator('.learning-course-v2__lessons button');
      await expect(lessons).toHaveCount(7);
      await expect(page.locator('.learning-course-v2__lessons .is-complete')).toHaveCount(0);
      await expect(lessons.filter({ hasText: 'Min' })).toHaveCount(7);
      await lessons.first().click();
      await expect(page.locator('.learning-course-v2__quiz')).toHaveCount(0);
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(page.getByRole('button', { name: /abschließen|zurücksetzen/i })).toHaveCount(0);
      expect(await page.evaluate(() => localStorage.getItem('nur_learning_completed'))).toBe(stored);
      await page.getByRole('button', { name: 'Nächste Lektion', exact: true }).click();
      await page.reload();
      await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
      await page.locator('.reference-foundation-step').filter({ hasText: 'Allah & der Glaube' }).click();
      await expect(page.locator('.learning-course-v2__lesson h2')).toHaveText(getCategoryLessons('faith')[1].title);
      expect(await page.evaluate(() => localStorage.getItem('nur_learning_completed'))).toBe(stored);
      await page.locator('.learning-course-v2__plan-toggle').click();
      await expect(page.locator('.learning-course-v2__lessons button').first()).toContainText('Min');
      await expect(page.locator('.learning-course-v2__lessons')).toHaveCSS('opacity', '1');
      await expect(page.locator('.learning-course-v2__lessons')).toHaveCSS('overflow', 'hidden');
      await expect.poll(async () => {
        const list = await page.locator('.learning-course-v2__lessons').boundingBox();
        const article = await page.locator('.learning-course-v2__lesson').boundingBox();
        return Boolean(list && article && list.y + list.height <= article.y + 1);
      }).toBe(true);
      if (stored !== '{broken') await page.screenshot({ path: testInfo.outputPath(`reading-lessons-${width}.png`) });
    });
  }
}
