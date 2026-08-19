import { expect, test, type Page } from '@playwright/test';
import { openApp } from './appReady';

/**
 * Smoke tests for the flows a user actually performs.
 *
 * Start is intentionally hero-only. The two controls in its header are the
 * entry points into the rest of the app; once a destination is open, the
 * normal primary navigation is available again.
 */

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

async function openMoreFromHome(page: Page) {
  await page.getByRole('button', { name: 'Mehr öffnen' }).click();
  await expect(page.getByRole('heading', { name: 'Mehr' })).toBeVisible();
}

test('opens on the hero-only Start screen', async ({ page }) => {
  await expect(page.locator('.premium-home').getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.welcome-hero')).toBeVisible();
  await expect(page.locator('.welcome-hero__visual img')).toBeVisible();
  await expect(page.locator('.welcome-hero__date')).toBeHidden();
  await expect(page.locator('.prayer-hero')).toBeHidden();
  await expect(page.locator('.journey-card')).toBeHidden();
  await expect(page.locator('.bottom-nav')).toBeHidden();
});

test('reaches every primary area from the new Start entry points', async ({ page }) => {
  await page.getByRole('button', { name: 'Gebete und Erinnerungen öffnen' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();

  for (const label of ['Quran', 'Lernen', 'Mehr']) {
    await page.getByRole('navigation').getByText(label, { exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('opens the Quran reader and shows Arabic verses', async ({ page }) => {
  await openMoreFromHome(page);
  await page.getByRole('button').filter({ hasText: /^Quran/ }).first().click();
  await expect(page.getByRole('heading', { name: 'Quran' })).toBeVisible();
  await page.getByRole('button').filter({ hasText: /Al-Faatiha|Lesen|Weiterlesen/ }).first().click();
  await expect(page.locator('[dir="rtl"]').first()).toBeVisible({ timeout: 15_000 });
});

test('keeps the Quran reader inside the Quran hierarchy', async ({ page }) => {
  await openMoreFromHome(page);
  await page.getByRole('button').filter({ hasText: /^Quran/ }).first().click();
  await page.getByRole('button').filter({ hasText: /Al-Faatiha/ }).first().click();
  await expect(page.locator('.reference-reader-screen')).toBeVisible({ timeout: 15_000 });

  await page.getByRole('button', { name: 'Zurück zum Quran' }).click();
  await expect(page.locator('.reference-quran-screen')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('heading', { name: 'Quran' })).toBeVisible();
});

test('browser Back can return from More to hero-only Start', async ({ page }) => {
  await openMoreFromHome(page);
  await page.goBack();
  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.bottom-nav')).toBeHidden();
});

test('primary navigation resets the app-owned browser stack after leaving Start', async ({ page }) => {
  await openMoreFromHome(page);
  await page.getByRole('button').filter({ hasText: /^Dhikr/ }).first().click();
  await expect(page.locator('.reference-dhikr-screen')).toBeVisible();

  await page.getByRole('navigation').getByText('Gebet', { exact: true }).click();
  await expect(page.locator('.reference-prayer-screen')).toBeVisible();

  const depth = await page.evaluate(() => window.history.state?.__nurIslamNavigation?.depth ?? -1);
  expect(depth).toBe(0);
});

test('secondary devotional screens keep the correct primary tab active', async ({ page }) => {
  await openMoreFromHome(page);
  await page.getByRole('button').filter({ hasText: /^Dhikr/ }).first().click();
  await expect(page.locator('.reference-dhikr-screen')).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Gebet' })).toHaveAttribute('aria-current', 'page');

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByRole('button').filter({ hasText: /^Duas/ }).first().click();
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Lernen' })).toHaveAttribute('aria-current', 'page');
});

test('counts a dhikr and keeps it across a reload', async ({ page }) => {
  await openMoreFromHome(page);
  await page.getByRole('button').filter({ hasText: /^Dhikr/ }).first().click();

  const counter = page.locator('.reference-dhikr-counter, [class*="dhikr"]').first();
  await expect(counter).toBeVisible();
  const tap = page.getByRole('button').filter({ hasText: /^\d+$|Zählen|SubhanAllah/ }).first();
  await tap.click();

  await page.reload();
  const stored = await page.evaluate(() => localStorage.getItem('nur_dhikr_daily_v2'));
  expect(stored).toBeTruthy();
});

test('shows the imprint and privacy screen', async ({ page }) => {
  await openMoreFromHome(page);
  await page.getByText('Impressum & Datenschutz').click();

  await expect(page.getByText('Verantwortlicher')).toBeVisible();
  await expect(page.getByText(/api\.aladhan\.com/)).toBeVisible();
  await expect(page.getByText('Noch nicht veröffentlichungsfertig')).toBeVisible();
});

test('closes a dialog with the Escape key', async ({ page }) => {
  await openMoreFromHome(page);
  await page.getByRole('button').filter({ hasText: /99 Namen/ }).first().click();
  await page.getByRole('button').filter({ hasText: 'Ar-Rahman' }).first().click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('reports no console errors while navigating from hero-only Start', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.getByRole('button', { name: 'Gebete und Erinnerungen öffnen' }).click();
  for (const label of ['Quran', 'Lernen', 'Mehr']) {
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

  await openMoreFromHome(page);
  await page.getByRole('button').filter({ hasText: /^Quran/ }).first().click();
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
