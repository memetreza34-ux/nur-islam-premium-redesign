import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

// Fixed test data only; never ships as a timetable.
const timings = { Fajr: '04:10', Sunrise: '06:00', Dhuhr: '13:10', Asr: '17:00', Maghrib: '20:10', Isha: '22:10' };
test.use({ serviceWorkers: 'block' });

async function openLandscapeApp(page: Page, time: string) {
  await page.clock.setFixedTime(new Date(`2026-08-27T${time}:00+02:00`));
  await page.route('https://api.aladhan.com/**', (route) => route.fulfill({
    json: { code: 200, data: { timings, meta: { timezone: 'Europe/Berlin', method: { name: 'Test fixture' }, school: 'Standard' } } },
  }));
  await page.goto('/?preview=1');
  await expect(page.getByRole('navigation')).toBeVisible();
}

for (const [id, name, time, value] of [
  ['fajr', 'Morgendämmerung', '05:00', timings.Dhuhr],
  ['dhuhr', 'Tageslicht', '14:00', timings.Asr],
  ['asr', 'Nachmittagslicht', '18:00', timings.Maghrib],
  ['maghrib', 'Abendstimmung', '21:00', timings.Isha],
  ['isha', 'Nachthimmel', '23:00', timings.Fajr],
]) {
  test(`${name}: same landscape on Home and Prayer, readable on mobile`, async ({ page }, testInfo) => {
    await openLandscapeApp(page, time);
    const arch = page.locator(`[data-prayer-scene="${id}"]`);
    await expect(arch).toBeVisible();
    await expect(arch.getByText(value, { exact: true })).toBeVisible();
    const homeFrame = page.getByRole('region', { name: 'Nächstes Gebet', exact: true });
    expect(await homeFrame.evaluate((node) => getComputedStyle(node).borderTopWidth)).toBe('0px');
    expect(await homeFrame.evaluate((node) => getComputedStyle(node).backgroundImage)).toBe('none');
    expect(await arch.evaluate((node) => getComputedStyle(node).backgroundImage)).toBe('none');
    expect(await arch.locator('.ds-arch__backdrop').evaluate((node) => getComputedStyle(node).maskImage)).not.toBe('none');
    await expect(arch.locator('image')).toHaveAttribute('href', new RegExp(`prayer-${id}-v1.webp`));
    const imageUrl = await arch.locator('image').getAttribute('href');
    const imageResponse = await page.request.get(imageUrl!);
    expect(imageResponse.ok()).toBe(true);
    expect(imageResponse.headers()['content-type']).toContain('image/webp');
    await page.screenshot({ path: testInfo.outputPath(`${id}-home.png`) });
    await page.getByRole('navigation').getByRole('button', { name: 'Gebet', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Gebetszeiten', exact: true })).toBeVisible();
    await expect(arch).toBeVisible();
    await expect(arch.getByText(value, { exact: true })).toBeVisible();
    await expect(arch.locator('image')).toHaveAttribute('href', imageUrl!);
    const prayerFrame = page.getByRole('region', { name: 'Nächstes Pflichtgebet', exact: true });
    expect(await prayerFrame.evaluate((node) => getComputedStyle(node).borderTopWidth)).toBe('0px');
    expect(await prayerFrame.evaluate((node) => getComputedStyle(node).backgroundImage)).toBe('none');
    expect(await arch.evaluate((node) => getComputedStyle(node).backgroundImage)).toBe('none');
    expect(await arch.locator('.ds-arch__backdrop').evaluate((node) => getComputedStyle(node).maskImage)).not.toBe('none');
    expect(await prayerFrame.evaluate((node) => getComputedStyle(node, '::before').content)).toBe('none');
    await page.setViewportSize({ width: 320, height: 740 });
    const bounds = await arch.boundingBox();
    for (const selector of ['.ds-arch__overline', '.ds-arch__name', '.ds-arch__value', '.ds-arch__meta']) {
      const text = await arch.locator(selector).boundingBox();
      expect(text!.x).toBeGreaterThanOrEqual(bounds!.x);
      expect(text!.x + text!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width + 1);
      expect(text!.y + text!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height + 1);
    }
    const markButton = prayerFrame.getByRole('button', { name: 'Als gebetet markieren', exact: true });
    const toneButton = prayerFrame.getByRole('button', { name: 'Hinweiston testen' });
    await expect(markButton).toBeVisible();
    await expect(toneButton).toBeVisible();
    const buttonBounds = await markButton.boundingBox();
    const toneBounds = await toneButton.boundingBox();
    expect(buttonBounds!.y).toBeGreaterThanOrEqual(bounds!.y + bounds!.height);
    expect(buttonBounds!.x + buttonBounds!.width).toBeLessThanOrEqual(toneBounds!.x);
    expect(Math.abs(buttonBounds!.y - toneBounds!.y)).toBeLessThanOrEqual(1);
    expect(toneBounds!.height).toBeGreaterThanOrEqual(44);
    await page.screenshot({ path: testInfo.outputPath(`${id}-prayer-320.png`) });
  });
}

test('open prayer layout still marks and unmarks the next prayer', async ({ page }) => {
  await openLandscapeApp(page, '14:00');
  await page.getByRole('navigation').getByRole('button', { name: 'Gebet', exact: true }).click();
  const focus = page.getByRole('region', { name: 'Nächstes Pflichtgebet', exact: true });
  await focus.getByRole('button', { name: 'Als gebetet markieren', exact: true }).click();
  await expect(focus).toContainText('1/5 heute');
  await expect(page.getByRole('button', { name: 'Asr als gebetet markieren', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await focus.getByRole('button', { name: 'Als gebetet markiert', exact: true }).click();
  await expect(focus).toContainText('0/5 heute');
  await expect(page.getByRole('button', { name: 'Asr als gebetet markieren', exact: true })).toHaveAttribute('aria-pressed', 'false');
});

test('after Isha and midnight the scene stays dark while Fajr is next', async ({ page }) => {
  await openLandscapeApp(page, '23:00');
  await expect(page.locator('[data-prayer-scene="isha"]')).toBeVisible();
  await expect(page.getByText('Nächstes Gebet · morgen', { exact: true })).toBeVisible();
  await page.clock.setFixedTime(new Date('2026-08-28T00:01:00+02:00'));
  await page.reload();
  await expect(page.locator('[data-prayer-scene="isha"]')).toBeVisible();
});

test('running countdown changes the image at a prayer boundary without reload', async ({ page }) => {
  test.setTimeout(45_000);
  await openLandscapeApp(page, '20:09');
  await expect(page.locator('[data-prayer-scene="asr"]')).toBeVisible();
  await page.clock.setFixedTime(new Date('2026-08-27T20:11:00+02:00'));
  // Keep animation time real: advancing the mock RAF clock independently of
  // the browser's native animation timeline can strand an exiting SVG image.
  await expect(page.locator('[data-prayer-scene="maghrib"]')).toBeVisible({ timeout: 35_000 });
  await expect(page.locator('[data-prayer-scene="maghrib"] image')).toHaveCount(1);
  await expect(page.locator('[data-prayer-scene="maghrib"]').getByText(timings.Isha, { exact: true })).toBeVisible();
});

test.describe('different device timezone', () => {
  test.use({ timezoneId: 'UTC' });
  test('the background uses the timetable timezone on both pages', async ({ page }) => {
    await openLandscapeApp(page, '18:00');
    await expect(page.locator('[data-prayer-scene="asr"]')).toBeVisible();
    await page.getByRole('navigation').getByRole('button', { name: 'Gebet', exact: true }).click();
    await expect(page.locator('[data-prayer-scene="asr"]')).toBeVisible();
  });
});
