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
  await expect(page.locator('.premium-home--v2')).toBeVisible();
  await expect(page.locator('.home-prayer-focus')).toBeVisible();
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

test('Home quiz keeps its title and survives browser Forward and reload', async ({ page }) => {
  await page.getByRole('button', { name: /Wissen testen Islam Quiz/i }).click();
  await expect(page.getByRole('heading', { name: 'Islam Quiz', level: 1 })).toBeVisible();
  await page.goBack();
  await expect(page.locator('.premium-home--v2')).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Islam Quiz', level: 1 })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Islam Quiz', level: 1 })).toBeVisible();
});

test('primary navigation resets the app-owned browser stack', async ({ page }) => {
  await page.locator('.journey-card').filter({ hasText: 'Dhikr' }).click();
  await expect(page.locator('.reference-dhikr-screen')).toBeVisible();
  await page.getByRole('navigation').getByText('Gebet', { exact: true }).click();
  await expect(page.locator('.reference-prayer-screen')).toBeVisible();
  const depth = await page.evaluate(() => window.history.state?.__nurIslamNavigation?.depth ?? -1);
  expect(depth).toBe(0);
});

test('shows the Islamic calendar below prayer times and opens the full planner', async ({ page }) => {
  await page.getByRole('navigation').getByText('Gebet', { exact: true }).click();
  await expect(page.locator('.prayer-calendar-section')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Islamische Tage & Termine' })).toBeVisible();
  expect(await page.locator('.prayer-calendar-day:not(.prayer-calendar-day--empty)').count()).toBeGreaterThanOrEqual(28);
  await expect(page.getByText('Nächste wichtige Termine', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Kalender öffnen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Kalender' })).toBeVisible();
  await expect(page.getByText('Nächste wichtige Termine', { exact: true })).toBeVisible();
});

test('offers the essential prayer companions and opens each destination', async ({ page }) => {
  const destinations = [
    ['Beten lernen', 'Gebetskurs'],
    ['Qibla', 'Qibla'],
    ['Duas', 'Duas'],
    ['Dhikr', 'Dhikr'],
    ['Moscheen', 'Moschee-Finder'],
    ['Fastenplan', 'Fastenplan'],
  ] as const;

  for (const [entry, heading] of destinations) {
    await page.getByRole('navigation').getByText('Gebet', { exact: true }).click();
    const companions = page.locator('.prayer-companions');
    await expect(companions).toBeVisible();
    await expect(companions.getByRole('button')).toHaveCount(6);
    await companions.getByRole('button', { name: new RegExp(`^${entry}`) }).click();
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }
});

test('opens prayer learning directly and returns to the prayer screen', async ({ page }) => {
  await page.getByRole('navigation').getByText('Gebet', { exact: true }).click();
  await page.locator('.prayer-companions').getByRole('button', { name: /^Beten lernen/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Gebetskurs' })).toBeVisible();
  await page.getByRole('button', { name: 'Zurück zu Gebet' }).click();
  await expect(page.locator('.reference-prayer-screen')).toBeVisible();
});

test('secondary devotional screens keep the correct primary tab active', async ({ page }) => {
  await page.locator('.journey-card').filter({ hasText: 'Dhikr' }).click();
  await expect(page.locator('.reference-dhikr-screen')).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Mehr' })).toHaveAttribute('aria-current', 'page');
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

test('reads a long surah from the local bundle instead of the network', async ({ page }, testInfo) => {
  const onlineCalls: string[] = [];
  await page.route('**://api.alquran.cloud/**', async (route) => {
    const url = route.request().url();
    const isGerman = url.includes('de.bubenheim');
    onlineCalls.push(url);
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        code: 200,
        status: 'OK',
        data: {
          number: 2,
          name: 'سُورَةُ البَقَرَةِ',
          englishName: 'Al-Baqara',
          englishNameTranslation: 'The Cow',
          numberOfAyahs: 286,
          revelationType: 'Medinan',
          ayahs: Array.from({ length: 286 }, (_, index) => ({
            numberInSurah: index + 1,
            text: isGerman
              ? (index === 0 ? 'Alif-Lam-Mim' : `Deutsche Bedeutung ${index + 1}`)
              : (index === 0 ? 'Alif Laam Meem' : `Pronunciation ${index + 1}`),
          })),
          edition: {
            identifier: isGerman ? 'de.bubenheim' : 'en.transliteration',
            language: isGerman ? 'de' : 'en',
            name: isGerman ? 'Bubenheim & Elyas' : 'Transliteration',
            englishName: isGerman ? 'German Translation' : 'English Transliteration',
            format: 'text',
            type: isGerman ? 'translation' : 'transliteration',
          },
        },
      }),
    });
  });
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('Quran', { exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Mekkanisch', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Medinensisch', exact: true })).toHaveCount(0);
  await page.getByPlaceholder(/Sure/i).fill('Baqara');
  await page.getByRole('button').filter({ hasText: /Al-Baqara/ }).first().click();
  await expect(page.locator('.reference-reader-screen')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.reference-reader-pronunciation').first()).toContainText('Alif Laam Meem', { timeout: 15_000 });
  await expect(page.locator('.reference-reader-translation').first()).toContainText('Alif-Lam-Mim', { timeout: 15_000 });
  expect(onlineCalls.length, 'pronunciation and German translation are each fetched once').toBe(2);
  expect(onlineCalls.some((url) => url.includes('en.transliteration'))).toBe(true);
  expect(onlineCalls.some((url) => url.includes('de.bubenheim'))).toBe(true);
  expect(onlineCalls.some((url) => url.includes('quran-uthmani')), 'the Arabic is bundled and must not be requested').toBe(false);
  await expect(page.getByText(/Deutsche Übersetzung · Bubenheim & Elyas/).first()).toBeVisible();
  await expect(page.getByText(/Bedeutung an|Bedeutung aus/)).toHaveCount(0);

  const modes = page.locator('.reference-reader-mode-tabs');
  await modes.getByRole('button', { name: /Deutsch/ }).click();
  await expect(page.locator('.reference-reader-flow.is-german-flow')).toBeVisible();
  await expect(page.locator('.reference-reader-flow__page strong')).toHaveText('Seite 1');
  const firstGermanPageCount = await page.locator('.reference-reader-flow__text.is-german > span').count();
  expect(firstGermanPageCount).toBeGreaterThan(0);
  expect(firstGermanPageCount).toBeLessThan(286);
  await expect(page.locator('.reference-reader-flow__text.is-german')).toContainText('Deutsche Bedeutung 2');
  await page.getByRole('button', { name: 'Nächste Leseseite' }).click();
  await expect(page.locator('.reference-reader-flow__page strong')).toHaveText('Seite 2');
  await page.getByRole('button', { name: 'Lesestelle merken' }).click();
  await expect(page.locator('.reference-reader-pagination__marker')).toContainText('Gemerkt');
  await page.screenshot({ path: testInfo.outputPath('quran-german-flow.png') });

  await modes.getByRole('button', { name: /Arabisch/ }).click();
  await expect(page.locator('.reference-reader-flow.is-arabic-flow')).toBeVisible();
  const firstArabicPageCount = await page.locator('.reference-reader-flow__text.is-arabic > span').count();
  expect(firstArabicPageCount).toBeGreaterThan(0);
  expect(firstArabicPageCount).toBeLessThan(286);
  await page.screenshot({ path: testInfo.outputPath('quran-arabic-flow.png') });

  await modes.getByRole('button', { name: /Deutsch/ }).click();
  await expect(page.locator('.reference-reader-flow__page strong')).toHaveText('Seite 2');
  await expect(page.locator('.reference-reader-pagination__marker')).toContainText('Gemerkt');
  await page.getByRole('button', { name: 'Nächste Leseseite' }).click();
  await expect(page.getByRole('button', { name: /Zur Markierung/ })).toBeVisible();
  await page.getByRole('button', { name: /Zur Markierung/ }).click();
  await expect(page.locator('.reference-reader-flow__page strong')).toHaveText('Seite 2');

  await modes.getByRole('button', { name: /Versweise/ }).click();
  await expect(page.locator('.reference-reader-verse').first()).toBeVisible();
});
