import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const ids = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
test.use({ serviceWorkers: 'block' });

async function openPrayerList(page: Page) {
  await page.clock.setFixedTime(new Date('2026-08-28T14:00:00+02:00'));
  await page.route('https://api.aladhan.com/**', route => route.fulfill({
    json: { code: 200, data: { timings: { Fajr: '04:10', Sunrise: '06:00', Dhuhr: '13:10', Asr: '17:00', Maghrib: '20:10', Isha: '22:10' }, meta: { timezone: 'Europe/Berlin', method: { name: 'Test fixture' }, school: 'Standard' } } },
  }));
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Gebet', exact: true }).click();
  await expect(page.locator('.prayer-schedule-section')).toBeVisible();
  await expect(page.locator('.prayer-time-row')).toHaveCount(6);
}

for (const width of [320, 390, 768]) {
  test(`six distinct miniatures without overlap at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openPrayerList(page);
    const rows = page.locator('.prayer-time-row');
    await expect(rows).toHaveCount(6);
    for (const [index, id] of ids.entries()) {
      const row = rows.nth(index);
      const picture = row.locator('.prayer-time-row__art img');
      await expect(picture).toHaveAttribute('src', new RegExp(`prayer-mini-${id}-v1.webp`));
      await expect(picture).toHaveAttribute('alt', '');
      await expect(picture).toBeVisible();
      await expect.poll(() => picture.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth === 192)).toBe(true);
      const art = await picture.boundingBox();
      const name = await row.locator('.prayer-time-row__name').boundingBox();
      const time = await row.locator('.prayer-time-row__time').boundingBox();
      expect(art!.width).toBeLessThanOrEqual(44);
      expect(art!.x + art!.width).toBeLessThanOrEqual(name!.x);
      expect(name!.x + name!.width).toBeLessThanOrEqual(time!.x);
      const controls = row.getByRole('button');
      await expect(controls).toHaveCount(id === 'sunrise' ? 0 : 2);
      for (const control of await controls.all()) {
        const bounds = await control.boundingBox();
        expect(bounds!.width).toBeGreaterThanOrEqual(44);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      }
    }
    await page.locator('.prayer-schedule-section').scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`miniatures-${width}.png`) });
    await page.getByRole('button', { name: 'Asr als gebetet markieren', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Asr als gebetet markieren', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
}

test('failed miniature falls back without losing the prayer or controls', async ({ page }) => {
  await page.route('**/prayer-mini-asr-v1.webp*', route => route.abort());
  await openPrayerList(page);
  const row = page.locator('.prayer-time-row').filter({ has: page.getByRole('button', { name: 'Asr als gebetet markieren', exact: true }) });
  await expect(row.locator('.prayer-time-row__art img')).toHaveCount(0);
  await expect(row.locator('.prayer-time-row__art svg')).toBeVisible();
  await expect(row).toContainText('17:00');
  await row.getByRole('button', { name: 'Asr als gebetet markieren', exact: true }).click();
  await expect(row.getByRole('button', { name: 'Asr als gebetet markieren', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
