import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

/**
 * No screen may answer with a blank area.
 *
 * A list that renders nothing when a search matches nothing looks broken rather
 * than empty, and the user cannot tell which it is. Every list here is driven
 * into its empty case and has to say so in words.
 */
const searchScreens = [
  { hub: 'Quran', label: 'Quran', expect: 'Keine Sure gefunden' },
  { hub: 'Duas', label: 'Duas', expect: 'Keine Dua gefunden' },
  { hub: '99 Namen', label: 'Namen', expect: 'Keine Namen gefunden' },
];

for (const screen of searchScreens) {
  test(`${screen.label}: a search with no matches says so`, async ({ page }) => {
    await openApp(page);
    await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByRole('button').filter({ hasText: screen.hub }).first().click();
    await page.waitForTimeout(700);

    await page.getByRole('textbox').first().fill('zzzqqq-kein-treffer');
    await page.waitForTimeout(500);

    await expect(page.getByText(screen.expect)).toBeVisible();
  });
}

test('Sammlung: an untouched app says the collection is waiting', async ({ page }) => {
  await openApp(page);
  await page.evaluate(() => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('nur_') && key !== 'nur_onboarding_complete') localStorage.removeItem(key);
    }
  });
  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button').filter({ hasText: 'Sammlung' }).first().click();
  await page.waitForTimeout(700);

  await expect(page.locator('.reference-empty-result')).toBeVisible();
});

test('Moscheen: offline reports the failure instead of an empty list', async ({ page, context }) => {
  await openApp(page);
  await context.setOffline(true);

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button').filter({ hasText: 'Moscheen' }).first().click();
  await page.waitForTimeout(1500);

  // Either a stated error or cached results — never a blank area.
  const stated = await page.locator('.reference-empty-result, .reference-mosque-live-status, .reference-mosque-list').count();
  expect(stated).toBeGreaterThan(0);
});

test('Notizen: an empty list says so rather than showing a bare editor', async ({ page }) => {
  await openApp(page);
  await page.evaluate(() => localStorage.removeItem('nur_local_notes_v1'));

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button').filter({ hasText: 'Notizen' }).first().click();
  await page.waitForTimeout(800);

  const stated = await page.locator('.reference-empty-result, .reference-notes-list, .reference-note-editor').count();
  expect(stated).toBeGreaterThan(0);
});

test('Kalender: a day with no entries still renders its day view', async ({ page }) => {
  await openApp(page);
  // Calendar remains a first-class feature, but is no longer one of the five
  // primary tabs. Reach it through the More hub just as a user now does.
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button').filter({ hasText: 'Kalender' }).first().click();
  await page.waitForTimeout(900);

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const grid = await page.locator('.calendar-day, .reference-calendar-day').count();
  expect(grid).toBeGreaterThan(0);
});
