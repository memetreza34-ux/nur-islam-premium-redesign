import { expect, test } from '@playwright/test';
import { openApp } from './appReady';
import { expectHonestPrayerCard } from './prayerCard';

/**
 * Smoke tests for the flows a user actually performs.
 *
 * Source and unit checks protect individual contracts; this file proves that
 * the built app still connects those contracts into usable browser flows.
 *
 * `?preview=1` skips the first-launch onboarding, which is covered separately.
 */

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

test('opens on the home screen with a prayer schedule', async ({ page }) => {
  // Scoped to the Home screen rather than to any level-1 heading: the splash
  // crossfade leaves its own <h1>Nur</h1> mounted for the length of the fade,
  // so a bare heading query matched two elements and failed on timing alone.
  await expect(page.locator('.premium-home').getByRole('heading', { level: 1 })).toBeVisible();

  await expectHonestPrayerCard(page);
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

test('keeps the Quran reader inside the Quran hierarchy when opened from Home', async ({ page }) => {
  await page.locator('.journey-card--quran').click();
  await expect(page.locator('.reference-reader-screen')).toBeVisible({ timeout: 15_000 });

  await page.getByRole('button', { name: 'Zurück zum Quran' }).click();

  await expect(page.locator('.reference-quran-screen')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('heading', { name: 'Quran' })).toBeVisible();
});

test('browser Back and Forward preserve the synthetic Quran parent from Home', async ({ page }) => {
  await page.locator('.journey-card--quran').click();
  await expect(page.locator('.reference-reader-screen')).toBeVisible({ timeout: 15_000 });

  await page.goBack();
  await expect(page.locator('.reference-quran-screen')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('heading', { name: 'Quran' })).toBeVisible();

  await page.goBack();
  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 15_000 });

  await page.goForward();
  await expect(page.locator('.reference-quran-screen')).toBeVisible({ timeout: 15_000 });
});

test('primary navigation resets the app-owned browser stack', async ({ page }) => {
  await page.locator('.journey-card').filter({ hasText: 'Dhikr' }).click();
  await expect(page.locator('.reference-dhikr-screen')).toBeVisible();

  await page.getByRole('navigation').getByText('Gebete', { exact: true }).click();
  await expect(page.locator('.reference-prayer-screen')).toBeVisible();

  const depth = await page.evaluate(() => window.history.state?.__nurIslamNavigation?.depth ?? -1);
  expect(depth).toBe(0);
});

test('saves today’s Hadith and reopens that exact entry from Collections', async ({ page }) => {
  const hadithCard = page.locator('.hadith-card').first();
  await hadithCard.scrollIntoViewIfNeeded();
  await hadithCard.click();

  await expect(page.getByRole('heading', { name: 'Hadith des Tages' })).toBeVisible();
  const hadithTitle = (await page.locator('.reference-hadith-hero .hero-pill').textContent())?.trim();
  expect(hadithTitle).toBeTruthy();

  await page.getByRole('button', { name: 'Speichern' }).click();
  await expect(page.getByRole('button', { name: 'Gespeichert' })).toBeVisible();

  const savedIds = await page.evaluate(() => {
    const raw = localStorage.getItem('nur_daily_hadith_saved_ids');
    return raw ? JSON.parse(raw) as string[] : [];
  });
  expect(savedIds).toHaveLength(1);

  await page.getByRole('button', { name: 'Zurück' }).click();
  await expect(page.locator('.premium-home')).toBeVisible();

  // Reached through More rather than through Home: Home only carries the
  // collection card for users past the beginner path, and this test is about
  // the saved entry, not about which Home a first-time user gets.
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  const collectionsEntry = page.getByRole('button').filter({ hasText: 'Sammlung' }).first();
  await collectionsEntry.scrollIntoViewIfNeeded();
  await collectionsEntry.click();
  await expect(page.locator('.reference-collections-screen')).toBeVisible();

  const savedHadithRow = page.getByRole('button').filter({ hasText: hadithTitle! }).first();
  await expect(savedHadithRow).toBeVisible();
  await savedHadithRow.click();

  await expect(page.getByRole('heading', { name: 'Gespeicherter Hadith' })).toBeVisible();
  await expect(page.locator('.reference-hadith-hero .hero-pill')).toHaveText(hadithTitle!);

  await page.getByRole('button', { name: 'Zurück' }).click();
  await expect(page.locator('.reference-collections-screen')).toBeVisible();
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
