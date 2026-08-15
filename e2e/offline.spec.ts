import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

/**
 * The app promises to keep working without a connection: a service worker, a
 * fallback prayer schedule and four surahs bundled offline. A prayer app is
 * used in places with no signal, so that promise is worth proving rather than
 * assuming.
 *
 * Offline is simulated at the browser context, which fails every request the
 * same way a lost connection does.
 */

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

test('still shows a full prayer schedule with no connection', async ({ page, context }) => {
  await context.setOffline(true);
  await page.reload();

  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  // Six times must appear from cache or the bundled fallback. An empty prayer
  // card is the one outcome this app cannot afford.
  const times = page.locator('text=/^([01]\\d|2[0-3]):[0-5]\\d$/');
  expect(await times.count()).toBeGreaterThanOrEqual(6);
});

test('opens a bundled surah with no connection', async ({ page, context }) => {
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('Quran', { exact: true }).first().click();
  await page.getByRole('button').filter({ hasText: /Al-Faatiha|Lesen|Weiterlesen/ }).first().click();

  await expect(page.locator('[dir="rtl"]').first()).toBeVisible({ timeout: 20_000 });

  // The Arabic is bundled and the German rendering is fetched, so with no
  // connection the Surah is still readable and the screen has to say why the
  // meaning is missing rather than leave a blank where it used to be.
  await expect(page.getByText('Deutsch fehlt')).toBeVisible();
  await expect(page.getByText(/braucht dafür einmal eine Verbindung/)).toBeVisible();
});

test('reports a failure instead of inventing mosques when offline', async ({ page, context }) => {
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('Moschee', { exact: false }).first().click();

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  const body = await page.locator('body').innerText();
  // Placeholder mosques would send someone to a building that is not there.
  expect(body).not.toMatch(/Beispiel-Moschee|Musterstraße|Demo/i);
});

test('recovers once the connection returns', async ({ page, context }) => {
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  await context.setOffline(false);
  await page.reload();

  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });
  const times = page.locator('text=/^([01]\\d|2[0-3]):[0-5]\\d$/');
  expect(await times.count()).toBeGreaterThanOrEqual(6);
});
