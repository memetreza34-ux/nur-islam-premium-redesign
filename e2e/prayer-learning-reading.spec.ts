import { expect, test } from '@playwright/test';
import { PRAYER_LESSONS } from '../src/data/prayerLessons';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
for (const width of [320, 768]) {
  test(`all prayer instructions remain open without completion at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    await page.route('https://api.aladhan.com/**', route => route.abort());
    await page.addInitScript(() => { localStorage.setItem('nur_prayer_learning_complete', '["fajr","future"]'); });
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Beten lernen', exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Gebetsablauf Rakʿah mit Wortlaut', exact: true }).click();
    await page.locator('.reference-rakah-practice > summary').click();
    for (const prayer of PRAYER_LESSONS) {
      await page.locator('.reference-prayer-course-selector').getByRole('button', { name: new RegExp(`^${prayer.label}`) }).click();
      await page.getByRole('button', { name: `Rakʿah ${prayer.rakahs}`, exact: true }).click();
      const chooser = page.locator('.reference-prayer-step-chooser');
      await chooser.locator('summary').click();
      await chooser.getByRole('button').last().click();
      await expect(page.locator('.reference-rakah-wording__arabic').first()).toBeVisible();
      await expect(page.getByRole('button', { name: /abschließen/i })).toHaveCount(0);
      await expect(page.locator('.reference-prayer-course-hero__progress, .reference-prayer-lesson-progress, .is-complete')).toHaveCount(0);
      await page.getByRole('button', { name: 'Von vorn', exact: true }).click();
      await expect(page.getByRole('heading', { name: `Rakʿah 1 von ${prayer.rakahs}`, exact: true })).toBeVisible();
      await expect(page.locator('.reference-prayer-course-complete')).toHaveCount(0);
      expect(await page.evaluate(() => localStorage.getItem('nur_prayer_learning_complete'))).toBe('["fajr","future"]');
    }
    await page.screenshot({ path: testInfo.outputPath(`prayer-reading-${width}.png`) });
    await page.getByRole('button', { name: 'Zurück zu Lernen', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Gebetsablauf Rakʿah mit Wortlaut', exact: true })).toBeVisible();
  });
}

test('automatic practice stops at the beginning without a completion screen', async ({ page }) => {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await page.getByRole('button', { name: 'Gebetsablauf Rakʿah mit Wortlaut', exact: true }).click();
  await page.locator('.reference-rakah-practice > summary').click();
  await page.clock.install();
  await page.getByRole('button', { name: /Durchlauf starten/ }).click();
  await expect(page.getByRole('button', { name: /Durchlauf anhalten/ })).toBeVisible();
  await page.getByRole('button', { name: 'Rakʿah 2', exact: true }).click();
  const chooser = page.locator('.reference-prayer-step-chooser');
  await chooser.locator('summary').click();
  await chooser.getByRole('button').last().click();
  await expect(page.getByRole('button', { name: 'Von vorn', exact: true })).toBeVisible();
  await page.clock.fastForward(30_000);
  await expect(page.getByRole('heading', { name: 'Rakʿah 1 von 2', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Durchlauf starten/ })).toBeVisible();
  await expect(page.locator('.reference-prayer-course-complete')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('nur_prayer_learning_complete'))).toBeNull();
});
