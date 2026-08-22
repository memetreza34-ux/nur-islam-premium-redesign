import { expect, test } from '@playwright/test';
import { openApp } from './appReady';
import { expectHonestPrayerCard } from './prayerCard';

/**
 * The app promises to keep working without a connection: a service worker, the
 * bundled surahs and every screen reachable from the cache. A prayer app is
 * used in places with no signal, so that promise is worth proving rather than
 * assuming.
 *
 * What it does not promise is prayer times without a location — offline or not,
 * the card says so rather than filling itself in.
 *
 * Offline is simulated at the browser context, which fails every request the
 * same way a lost connection does.
 */

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

test('stays honest about prayer times with no connection', async ({ page, context }) => {
  await context.setOffline(true);
  await page.reload();

  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  await expectHonestPrayerCard(page);
});

test('opens a bundled surah with no connection', async ({ page, context }) => {
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('Quran', { exact: true }).first().click();
  await page.getByRole('button').filter({ hasText: /Al-Faatiha|Lesen|Weiterlesen/ }).first().click();

  await expect(page.locator('[dir="rtl"]').first()).toBeVisible({ timeout: 20_000 });
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
  await expectHonestPrayerCard(page);
});
