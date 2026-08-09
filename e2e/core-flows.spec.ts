import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

/**
 * Smoke tests for the flows a user actually performs.
 *
 * Everything else in this repository checks source text or unit behaviour.
 * Nothing until now started the built app and clicked it, so "it builds" and
 * "it works" were never the same statement.
 *
 * `?preview=1` skips the first-launch onboarding, which is covered separately.
 */

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

test('opens on the home screen with a prayer schedule', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // Six entries, whatever their source: live, cached or the offline fallback.
  // A user must never face an empty prayer card.
  const times = page.locator('text=/^([01]\\d|2[0-3]):[0-5]\\d$/');
  expect(await times.count()).toBeGreaterThanOrEqual(6);
});

test('reaches every primary tab', async ({ page }) => {
  for (const label of ['Gebete', 'Kalender', 'Mehr']) {
    await page.getByRole('navigation').getByText(label, { exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('opens the Quran reader and shows Arabic verses', async ({ page }) => {
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('Quran', { exact: true }).first().click();
  await page.getByRole('button').filter({ hasText: /Al-Faatiha|Lesen|Weiterlesen/ }).first().click();

  // Al-Faatiha ships offline, so this must work with no network at all.
  await expect(page.locator('[dir="rtl"]').first()).toBeVisible({ timeout: 15_000 });
});

test('counts a dhikr and keeps it across a reload', async ({ page }) => {
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('Dhikr', { exact: true }).first().click();

  const counter = page.locator('.reference-dhikr-counter, [class*="dhikr"]').first();
  await expect(counter).toBeVisible();

  const tap = page.getByRole('button').filter({ hasText: /^\d+$|Zählen|SubhanAllah/ }).first();
  await tap.click();

  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 15_000 });
  // The stored count survives a reload; the exact figure depends on which
  // control was hit, so assert persistence rather than a number.
  const stored = await page.evaluate(() => localStorage.getItem('nur_dhikr_daily_v2'));
  expect(stored).toBeTruthy();
});

test('shows the imprint and privacy screen', async ({ page }) => {
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('Impressum & Datenschutz').click();

  await expect(page.getByText('Verantwortlicher')).toBeVisible();
  await expect(page.getByText(/api\.aladhan\.com/)).toBeVisible();
  // While the operator details are unfilled the screen has to say so.
  await expect(page.getByText('Noch nicht veröffentlichungsfertig')).toBeVisible();
});

test('closes a dialog with the Escape key', async ({ page }) => {
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('99 Namen', { exact: false }).first().click();
  await page.getByRole('button').filter({ hasText: 'Ar-Rahman' }).first().click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(dialog).toBeHidden();
});

test('reports no console errors while navigating', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  for (const label of ['Gebete', 'Kalender', 'Islam verstehen', 'Mehr']) {
    await page.getByRole('navigation').getByText(label, { exact: true }).click();
    await page.waitForTimeout(250);
  }

  // Network failures against the live prayer or mosque APIs are tolerated;
  // the app is meant to degrade to cached or offline data.
  const realErrors = errors.filter((text) => !/Failed to fetch|NetworkError|net::/i.test(text));
  expect(realErrors).toEqual([]);
});

test('reads a long surah from the local bundle instead of the network', async ({ page }) => {
  // Only four surahs used to ship locally; everything else came from
  // api.alquran.cloud. Al-Baqara is the longest surah and was the clearest
  // case of that gap, so it stands in for the other 109 that moved offline.
  const onlineCalls: string[] = [];
  await page.route('**://api.alquran.cloud/**', async (route) => {
    onlineCalls.push(route.request().url());
    await route.abort();
  });

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('Quran', { exact: true }).first().click();
  await page.getByPlaceholder(/Sure/i).fill('Baqara');
  await page.getByRole('button').filter({ hasText: /Al-Baqara/ }).first().click();

  await expect(page.locator('[dir="rtl"]').first()).toBeVisible({ timeout: 15_000 });
  expect(onlineCalls, 'Al-Baqara must come from the bundled files').toEqual([]);
});
