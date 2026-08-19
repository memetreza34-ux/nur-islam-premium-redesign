import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

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
  await expect(page.locator('.premium-home').getByRole('heading', { level: 1 })).toBeVisible();
  const times = page.locator('text=/^([01]\\d|2[0-3]):[0-5]\\d$/');
  expect(await times.count()).toBeGreaterThanOrEqual(6);
});

test('reaches every primary tab', async ({ page }) => {
  for (const label of ['Gebet', 'Quran', 'Lernen', 'Mehr']) {
    await page.getByRole('navigation').getByText(label, { exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('opens the Quran reader and shows Arabic verses', async ({ page }) => {
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('Quran', { exact: true }).first().click();
  await page.getByRole('button').filter({ hasText: /Al-Faatiha|Lesen|Weiterlesen/ }).first().click();
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
  await page.getByRole('navigation').getByText('Gebet', { exact: true }).click();
  await expect(page.locator('.reference-prayer-screen')).toBeVisible();
  const depth = await page.evaluate(() => window.history.state?.__nurIslamNavigation?.depth ?? -1);
  expect(depth).toBe(0);
});

test('secondary devotional screens keep the correct primary tab active', async ({ page }) => {
  await page.locator('.journey-card').filter({ hasText: 'Dhikr' }).click();
  await expect(page.locator('.reference-dhikr-screen')).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Gebet' })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('Duas', { exact: true }).first().click();
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Lernen' })).toHaveAttribute('aria-current', 'page');
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
  const collectionsEntry = page.getByRole('button').filter({ hasText: 'Meine Sammlung' }).first();
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
  const stored = await page.evaluate(() => localStorage.getItem('nur_dhikr_daily_v2'));
  expect(stored).toBeTruthy();
});

test('shows the imprint and privacy screen', async ({ page }) => {
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('Impressum & Datenschutz').click();
  await expect(page.getByText('Verantwortlicher')).toBeVisible();
  await expect(page.getByText(/api\.aladhan\.com/)).toBeVisible();
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
  for (const label of ['Gebet', 'Quran', 'Lernen', 'Mehr']) {
    await page.getByRole('navigation').getByText(label, { exact: true }).click();
    await page.waitForTimeout(250);
  }
  const realErrors = errors.filter((text) => !/Failed to fetch|NetworkError|net::/i.test(text));
  expect(realErrors).toEqual([]);
});

test('reads a long surah from the local bundle instead of the network', async ({ page }) => {
  const onlineCalls: string[] = [];
  await page.route('**://api.alquran.cloud/**', async (route) => {
    onlineCalls.push(route.request().url());
    await route.continue();
  });
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('Quran', { exact: true }).first().click();
  await page.getByPlaceholder(/Sure/i).fill('Baqara');
  await page.getByRole('button').filter({ hasText: /Al-Baqara/ }).first().click();
  await expect(page.locator('[dir="rtl"]').first()).toBeVisible({ timeout: 15_000 });
  expect(onlineCalls.length, 'only the translation is fetched, and only once').toBe(1);
  expect(onlineCalls[0], 'the request must name the translation edition').toContain('de.bubenheim');
  expect(onlineCalls[0], 'the Arabic is bundled and must not be requested').not.toContain('quran-uthmani');
  await expect(page.getByText('Bubenheim & Elyas').first()).toBeVisible();
  await expect(page.getByText(/Sinngemäße deutsche Bedeutung/)).toHaveCount(0);
  await expect(page.getByText(/im Diesseits Gutes und im Jenseits Gutes/).first()).toBeVisible();
  await expect(page.getByText(/in dieser Welt Gutes und im Jenseits Gutes/)).toHaveCount(0);
});
