import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

/**
 * Smoke tests for the flows a user actually performs.
 *
 * Home is intentionally a single reference hero now. Feature navigation starts
 * from its visible bell/menu controls; once a primary feature is open, the
 * normal bottom navigation remains available on those screens.
 */

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

async function openMore(page: import('@playwright/test').Page) {
  if (await page.locator('.premium-home--v2').isVisible().catch(() => false)) {
    await page.getByRole('button', { name: 'Mehr öffnen' }).click();
  } else {
    await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeVisible();
}

async function openFromMore(page: import('@playwright/test').Page, label: string | RegExp) {
  await openMore(page);
  await page.getByRole('button').filter({ hasText: label }).first().click();
}

test('opens on the selected reference-only Home screen', async ({ page }) => {
  await expect(page.locator('.premium-home--v2')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Gebete und Erinnerungen öffnen' })).toBeAttached();
  await expect(page.getByRole('button', { name: 'Mehr öffnen' })).toBeAttached();
  await expect(page.getByRole('navigation')).toBeHidden();

  const reference = await page.evaluate(() => getComputedStyle(document.querySelector('.premium-home--v2')!, '::before').backgroundImage);
  expect(reference).toContain('home-reference-hero.webp');
});

test('reaches every primary destination from the reduced Home', async ({ page }) => {
  await page.getByRole('button', { name: 'Gebete und Erinnerungen öffnen' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  for (const label of ['Quran', 'Lernen', 'Mehr']) {
    await page.getByRole('navigation').getByText(label, { exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('opens the Quran reader and shows Arabic verses', async ({ page }) => {
  await openFromMore(page, /^Quran/);
  await page.getByRole('button').filter({ hasText: /Al-Faatiha|Lesen|Weiterlesen/ }).first().click();

  await expect(page.locator('[dir="rtl"]').first()).toBeVisible({ timeout: 15_000 });
});

test('keeps the Quran reader inside the Quran hierarchy', async ({ page }) => {
  await openFromMore(page, /^Quran/);
  await page.getByRole('button').filter({ hasText: /Al-Faatiha/ }).first().click();
  await expect(page.locator('.reference-reader-screen')).toBeVisible({ timeout: 15_000 });

  await page.getByRole('button', { name: 'Zurück zum Quran' }).click();
  await expect(page.locator('.reference-quran-screen')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('heading', { name: 'Quran' })).toBeVisible();
});

test('browser Back and Forward preserve a real Quran route', async ({ page }) => {
  await openFromMore(page, /^Quran/);
  await page.getByRole('button').filter({ hasText: /Al-Faatiha/ }).first().click();
  await expect(page.locator('.reference-reader-screen')).toBeVisible({ timeout: 15_000 });

  await page.goBack();
  await expect(page.locator('.reference-quran-screen')).toBeVisible({ timeout: 15_000 });

  await page.goForward();
  await expect(page.locator('.reference-reader-screen')).toBeVisible({ timeout: 15_000 });
});

test('primary navigation resets the app-owned browser stack', async ({ page }) => {
  await openFromMore(page, /^Dhikr/);
  await expect(page.locator('.reference-dhikr-screen')).toBeVisible();

  await page.getByRole('navigation').getByText('Gebet', { exact: true }).click();
  await expect(page.locator('.reference-prayer-screen')).toBeVisible();

  const depth = await page.evaluate(() => window.history.state?.__nurIslamNavigation?.depth ?? -1);
  expect(depth).toBe(0);
});

test('secondary devotional screens keep the correct primary tab active', async ({ page }) => {
  await openFromMore(page, /^Dhikr/);
  await expect(page.locator('.reference-dhikr-screen')).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Gebet' })).toHaveAttribute('aria-current', 'page');

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByRole('button').filter({ hasText: /^Duas/ }).first().click();
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Lernen' })).toHaveAttribute('aria-current', 'page');
});

test('opens Collections from the More hub and can return', async ({ page }) => {
  await openFromMore(page, /^Sammlung/);
  await expect(page.locator('.reference-collections-screen')).toBeVisible();

  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeVisible();
});

test('counts a dhikr and keeps it across a reload', async ({ page }) => {
  await openFromMore(page, /^Dhikr/);

  const counter = page.locator('.reference-dhikr-counter, [class*="dhikr"]').first();
  await expect(counter).toBeVisible();

  const tap = page.getByRole('button').filter({ hasText: /^\d+$|Zählen|SubhanAllah/ }).first();
  await tap.click();

  await page.reload();
  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 15_000 });
  const stored = await page.evaluate(() => localStorage.getItem('nur_dhikr_daily_v2'));
  expect(stored).toBeTruthy();
});

test('shows the imprint and privacy screen', async ({ page }) => {
  await openMore(page);
  await page.getByText('Impressum & Datenschutz').click();

  await expect(page.getByText('Verantwortlicher')).toBeVisible();
  await expect(page.getByText(/api\.aladhan\.com/)).toBeVisible();
  await expect(page.getByText('Noch nicht veröffentlichungsfertig')).toBeVisible();
});

test('closes a dialog with the Escape key', async ({ page }) => {
  await openFromMore(page, /99 Namen/);
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

  await openFromMore(page, /^Quran/);
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
