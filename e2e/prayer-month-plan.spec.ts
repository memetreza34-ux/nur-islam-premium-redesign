import { expect, test } from '@playwright/test';
import { prayerDayFixture, prayerRequestFixture } from './fixtures/prayer-api';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

const timings = {
  Fajr: '04:18', Sunrise: '05:54', Dhuhr: '12:45',
  Asr: '16:42', Maghrib: '19:36', Isha: '21:07',
};

test('prayer times support adjacent days and a compact monthly plan', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/api.aladhan.com/**', async (route) => {
    const url = route.request().url();
    const monthMatch = url.match(/\/calendar\/(\d{4})\/(\d{1,2})/);
    const data = monthMatch
      ? Array.from({ length: new Date(Number(monthMatch[1]), Number(monthMatch[2]), 0).getDate() }, (_, index) =>
        prayerDayFixture(`${String(index + 1).padStart(2, '0')}-${monthMatch[2].padStart(2, '0')}-${monthMatch[1]}`, timings))
      : prayerRequestFixture(url, timings).data;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ code: 200, data }) });
  });
  await page.goto('/?preview=1');
  await page.getByRole('button', { name: 'Gebet', exact: true }).click();

  const schedule = page.locator('.prayer-schedule-section');
  await schedule.scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Vorherigen Tag anzeigen' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nächsten Tag anzeigen' })).toBeVisible();

  await page.getByRole('button', { name: 'Nächsten Tag anzeigen' }).click();
  await expect(schedule.getByText('Vorschau für diesen Tag')).toBeVisible();
  await expect(schedule.locator('.prayer-time-row')).toHaveCount(6);
  await expect(schedule.locator('.prayer-alert')).toHaveCount(0);

  await schedule.getByRole('button', { name: 'Monatsplan' }).click();
  const dialog = page.getByRole('dialog', { name: 'Gebetszeiten im Monat' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.prayer-month-ledger > button').first()).toBeVisible();
  expect(await dialog.locator('.prayer-month-ledger > button').count()).toBeGreaterThanOrEqual(28);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);

  await dialog.locator('.prayer-month-ledger > button').first().click();
  await expect(dialog).toBeHidden();
  await expect(schedule.locator('.prayer-time-row')).toHaveCount(6);
});

for (const width of [320, 768, 1280]) {
  test(`rejects a falsely dated month and recovers without fabricated rows at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.clock.setFixedTime(new Date('2026-10-11T12:00:00+02:00'));
    let invalid = true;
    await page.route('**/api.aladhan.com/**', async route => {
      const url = route.request().url();
      const monthMatch = url.match(/\/calendar\/(\d{4})\/(\d{1,2})/);
      if (!monthMatch) {
        await route.fulfill({ json: prayerRequestFixture(url, timings) });
        return;
      }
      const data = Array.from({ length: new Date(Number(monthMatch[1]), Number(monthMatch[2]), 0).getDate() }, (_, index) =>
        prayerDayFixture(`${String(index + 1).padStart(2, '0')}-${monthMatch[2].padStart(2, '0')}-${monthMatch[1]}`, timings));
      if (invalid) data[1].date.gregorian.date = data[0].date.gregorian.date;
      await route.fulfill({ json: { code: 200, data } });
    });
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Gebet', exact: true }).click();
    const schedule = page.locator('.prayer-schedule-section');
    await schedule.getByRole('button', { name: 'Monatsplan' }).click();
    const dialog = page.getByRole('dialog', { name: 'Gebetszeiten im Monat' });
    await expect(dialog.getByText('Der Monatsplan konnte nicht geladen werden.')).toBeVisible();
    await expect(dialog.locator('.prayer-month-ledger > button')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    invalid = false;
    await dialog.getByRole('button', { name: 'Erneut versuchen' }).click();
    await expect(dialog.locator('.prayer-month-ledger > button')).toHaveCount(31);
    await expect(dialog.getByText('Der Monatsplan konnte nicht geladen werden.')).toHaveCount(0);
  });
}
