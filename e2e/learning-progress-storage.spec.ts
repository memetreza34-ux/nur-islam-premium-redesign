import { expect, test, type Page } from '@playwright/test';
import { getCategoryLessons } from '../src/data/islamicLearningContent';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
const progressKey = 'nur_learning_completed';

async function openCourse(page: Page, unreadable = false) {
  await page.route('**/api.aladhan.com/**', route => route.abort());
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  if (unreadable) {
    await expect(page.locator('.reference-knowledge-progress')).toHaveText('—');
    await expect(page.locator('.reference-knowledge-overview small')).toContainText('Lernfortschritt nicht lesbar');
    await expect(page.locator('.reference-knowledge-overview small')).not.toContainText('0% abgeschlossen');
  }
  await page.locator('.reference-foundation-step').filter({ hasText: 'Allah & der Glaube' }).click();
}

for (const width of [320, 768, 1280]) {
  test(`completion, resume and reset survive reload at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openCourse(page);
    expect(await page.evaluate(key => localStorage.getItem(key), progressKey)).toBeNull();
    expect(await page.evaluate(() => localStorage.getItem('nur_learning_last_faith'))).toBeNull();
    const lesson = getCategoryLessons('faith')[0];
    await page.locator('.learning-course-v2__quiz').getByRole('button', { name: lesson.question.options[lesson.question.correctIndex] }).click();
    const dialog = page.getByRole('dialog', { name: 'Verständnisfrage beantwortet' });
    await expect(dialog).toContainText('Der Fortschritt wurde lokal gespeichert.');
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), progressKey)).toEqual(['faith-overview']);
    await dialog.screenshot({ path: testInfo.outputPath(`learning-confirmed-${width}.png`) });
    await dialog.getByRole('button', { name: 'Weiterlernen', exact: false }).click();
    expect(await page.evaluate(() => localStorage.getItem('nur_learning_last_faith'))).toBe('faith-allah');
    await page.reload();
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    await page.locator('.reference-foundation-step').filter({ hasText: 'Allah & der Glaube' }).click();
    await expect(page.locator('.learning-course-v2__lesson h2')).toHaveText('1. Glaube an Allah');
    await expect(page.locator('.learning-course-v2__plan-toggle')).toContainText('1 von 7 abgeschlossen');
    await page.getByRole('button', { name: 'Vorherige', exact: true }).click();
    await page.getByRole('button', { name: 'Lektionsfortschritt zurücksetzen', exact: true }).click();
    await expect(page.locator('.toast')).toContainText('Lektionsfortschritt zurückgesetzt');
    expect(await page.evaluate(key => localStorage.getItem(key), progressKey)).toBe('[]');
    await expect(page.locator('.learning-course-v2__plan-toggle')).toContainText('0 von 7 abgeschlossen');
  });

  for (const mode of ['throw', 'discard', 'readback', 'malformed'] as const) {
    test(`completion is not falsely stored with ${mode} at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(({ mode, key }) => {
        const get = Storage.prototype.getItem;
        const set = Storage.prototype.setItem;
        set.call(localStorage, key, mode === 'malformed' ? '{broken' : '["pillars-hajj"]');
        let written = false;
        Storage.prototype.getItem = function (name) {
          if (mode === 'readback' && name === key && written) throw new DOMException('Denied', 'SecurityError');
          return get.call(this, name);
        };
        Storage.prototype.setItem = function (name, value) {
          if (name !== key) { set.call(this, name, value); return; }
          if (mode === 'throw') throw new DOMException('Full', 'QuotaExceededError');
          if (mode === 'discard') return;
          set.call(this, name, value);
          written = true;
        };
        (window as unknown as { readOriginalProgress: () => string | null }).readOriginalProgress = () => get.call(localStorage, key);
      }, { mode, key: progressKey });
      await openCourse(page, mode === 'malformed');
      expect(await page.evaluate(() => (window as unknown as { readOriginalProgress: () => string | null }).readOriginalProgress())).toBe(mode === 'malformed' ? '{broken' : '["pillars-hajj"]');
      const lesson = getCategoryLessons('faith')[0];
      await page.locator('.learning-course-v2__quiz').getByRole('button', { name: lesson.question.options[lesson.question.correctIndex] }).click();
      const dialog = page.getByRole('dialog', { name: 'Verständnisfrage beantwortet' });
      await expect(dialog).toContainText('Speicherung nicht bestätigt');
      await expect(dialog).not.toContainText('Der Fortschritt wurde lokal gespeichert');
      await expect(dialog).not.toContainText('Lektion abgeschlossen');
      await expect(page.locator('.learning-course-v2__plan-toggle')).toContainText(mode === 'malformed' ? 'Fortschritt nicht lesbar' : '0 von 7 abgeschlossen');
      const actual = await page.evaluate(() => (window as unknown as { readOriginalProgress: () => string | null }).readOriginalProgress());
      expect(actual).toBe(mode === 'malformed' ? '{broken' : mode === 'readback' ? '["pillars-hajj","faith-overview"]' : '["pillars-hajj"]');
      if (mode === 'throw') await dialog.screenshot({ path: testInfo.outputPath(`learning-unconfirmed-${width}.png`) });
      await dialog.getByRole('button', { name: 'Schließen', exact: true }).click();
      await expect(page.getByRole('status').filter({ hasText: 'Speicherung nicht bestätigt' })).toBeVisible();
    });
  }

  test(`failed reset is preserved and its toast fits at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(key => {
      const set = Storage.prototype.setItem;
      set.call(localStorage, key, '["faith-overview","pillars-hajj"]');
      Storage.prototype.setItem = function (name, value) {
        if (name === key) throw new DOMException('Denied', 'SecurityError');
        set.call(this, name, value);
      };
    }, progressKey);
    await openCourse(page);
    await page.getByRole('button', { name: 'Lektionsfortschritt zurücksetzen', exact: true }).click();
    expect(await page.evaluate(key => localStorage.getItem(key), progressKey)).toBe('["faith-overview","pillars-hajj"]');
    await expect(page.locator('.learning-course-v2__plan-toggle')).toContainText('1 von 7 abgeschlossen');
    const toast = page.locator('.toast');
    await expect(toast).toContainText('Zurücksetzen nicht bestätigt');
    await expect(toast.locator('svg')).toHaveClass(/lucide-x/);
    const bounds = await toast.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(900);
    await page.screenshot({ path: testInfo.outputPath(`learning-reset-warning-${width}.png`) });
  });
}
