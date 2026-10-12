import { expect, test } from '@playwright/test';
import { getDailyAyah } from '../src/data/dailyAyah';
import { prayerRequestFixture } from './fixtures/prayer-api';

const now = new Date('2026-10-10T14:00:00+02:00');
const ayah = getDailyAyah(now, 'Europe/Berlin');
test.use({ serviceWorkers: 'block' });

for (const [name, width, height] of [
  ['small-phone', 320, 568], ['phone', 390, 844], ['tablet', 768, 1024],
  ['desktop', 1280, 720], ['landscape', 568, 320],
] as const) {
  test(`opening fits ${name} and keeps daily content on Home`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.clock.install({ time: now });
    await page.clock.pauseAt(now);
    await page.route('https://api.aladhan.com/**', route => route.fulfill({
      json: prayerRequestFixture(route.request().url()),
    }));
    await page.goto('/?preview=1');
    const splash = page.getByRole('main', { name: 'Nur Islam wird geladen' });
    await expect(splash).toBeVisible();
    await expect(page.getByTestId('splash-prayer')).toContainText('Asr16:00');
    await expect(page.getByTestId('splash-ayah')).toContainText(ayah.source);
    const prayerArt = splash.locator('.reference-splash__prayer-art img');
    await expect(prayerArt).toHaveAttribute('src', /prayer-asr-v1\.webp/);
    await expect(prayerArt).toHaveJSProperty('naturalWidth', 1200);
    await expect(splash.locator('.reference-splash__mark, .reference-splash__brand')).toHaveCount(0);
    await expect(page.getByTestId('splash-ayah').locator('img')).toHaveCount(0);
    await expect(page.getByTestId('splash-ayah')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(page.getByTestId('splash-ayah')).toHaveCSS('background-image', 'none');
    await expect(page.getByTestId('splash-ayah')).toHaveCSS('border-width', '0px');
    await expect(splash.locator('.reference-splash__arabic')).toHaveCSS('color', 'rgb(245, 240, 230)');
    await expect(page.getByTestId('splash-prayer')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(page.getByTestId('splash-prayer')).toHaveCSS('border-width', '0px');
    await page.clock.runFor(600);
    await page.evaluate(() => document.fonts.ready);
    expect(await splash.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    const canvas = await splash.boundingBox();
    const background = await splash.locator('.reference-splash__prayer-art').boundingBox();
    expect(background!.x).toBe(canvas!.x);
    expect(background!.y).toBe(canvas!.y);
    expect(background!.width).toBe(canvas!.width);
    expect(background!.height).toBe(canvas!.height);
    const nodes = [page.getByTestId('splash-prayer'), page.getByTestId('splash-ayah')];
    const bounds = await Promise.all(nodes.map(node => node.boundingBox()));
    expect(bounds[0]!.y + bounds[0]!.height).toBeLessThanOrEqual(bounds[1]!.y);
    if (height > 650) expect(Math.abs(bounds[1]!.y + bounds[1]!.height / 2 - height / 2)).toBeLessThanOrEqual(3);
    expect(bounds[1]!.x + bounds[1]!.width).toBeLessThanOrEqual(width);
    if (height > 520) expect(bounds[1]!.y + bounds[1]!.height).toBeLessThanOrEqual(height);
    await page.screenshot({ path: `output/playwright/entry-daily-${name}.png`, fullPage: true });
    await page.clock.resume();
    await expect(splash).toBeHidden();
    await expect(page.getByRole('navigation')).toBeVisible();
    const dailyCard = page.getByRole('button', { name: `Ayah des Tages im Quran lesen: ${ayah.source}` });
    await dailyCard.scrollIntoViewIfNeeded();
    await expect(dailyCard).toContainText(ayah.meaning);
    await dailyCard.click();
    await expect(page.locator(`#quran-ayah-${ayah.surahNumber}-${ayah.ayahNumber}`)).toBeVisible();
  });
}

test('unavailable times do not prevent startup or show a fabricated prayer', async ({ page }) => {
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.route('https://api.aladhan.com/**', route => route.abort());
  await page.goto('/?preview=1');
  await expect(page.getByTestId('splash-prayer')).toContainText('noch nicht verfügbar');
  await expect(page.locator('.reference-splash__time')).toHaveCount(0);
  await expect(page.locator('.reference-splash__prayer-art')).toHaveCount(0);
  await expect(page.getByTestId('splash-ayah')).toContainText(ayah.source);
  await page.clock.resume();
  await expect(page.getByRole('navigation')).toBeVisible();
});

test('missing decorative images leave readable content and do not delay startup', async ({ page }) => {
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.route('https://api.aladhan.com/**', route => route.fulfill({
    json: prayerRequestFixture(route.request().url()),
  }));
  await page.route('**/premium-assets/high-res-objects/*.webp*', route => route.abort());
  await page.goto('/?preview=1');
  await expect(page.getByTestId('splash-prayer')).toContainText('Asr16:00');
  await expect(page.getByTestId('splash-ayah')).toContainText(ayah.meaning);
  await expect(page.locator('.reference-splash__prayer-art img')).toBeHidden();
  await expect(page.getByTestId('splash-ayah')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.getByRole('main', { name: 'Nur Islam wird geladen' })).toHaveCSS('background-color', 'rgb(0, 27, 22)');
  await expect(page.locator('.reference-splash__arabic')).toHaveCSS('color', 'rgb(245, 240, 230)');
  await page.clock.resume();
  await expect(page.getByRole('navigation')).toBeVisible();
});

test('all five Ayahs fit a narrow phone, including the longest wording', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.route('https://api.aladhan.com/**', route => route.fulfill({
    json: prayerRequestFixture(route.request().url()),
  }));
  for (let day = 10; day < 15; day += 1) {
    const date = new Date(`2026-10-${day}T14:00:00+02:00`);
    await page.clock.setSystemTime(date);
    await page.goto('/?preview=1');
    const card = page.getByTestId('splash-ayah');
    await expect(card).toContainText(getDailyAyah(date, 'Europe/Berlin').source);
    await page.clock.runFor(600);
    const splash = page.getByRole('main', { name: 'Nur Islam wird geladen' });
    expect(await splash.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    const prayerBox = await page.getByTestId('splash-prayer').boundingBox();
    const ayahBox = await card.boundingBox();
    expect(prayerBox!.y + prayerBox!.height).toBeLessThanOrEqual(ayahBox!.y);
    expect(ayahBox!.y + ayahBox!.height).toBeLessThanOrEqual(568);
  }
});

test('reduced motion still opens the app promptly', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://api.aladhan.com/**', route => route.abort());
  await page.goto('/?preview=1');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('main', { name: 'Nur Islam wird geladen' })).toBeHidden();
});
