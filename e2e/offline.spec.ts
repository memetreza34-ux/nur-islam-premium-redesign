import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

async function openMore(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Mehr öffnen' }).click();
  await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeVisible();
}

test('still shows a full prayer schedule with no connection', async ({ page, context }) => {
  await context.setOffline(true);
  await page.reload();

  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 20_000 });
  await page.getByRole('button', { name: 'Gebete und Erinnerungen öffnen' }).click();
  await expect(page.locator('.reference-prayer-screen')).toBeVisible({ timeout: 20_000 });

  const times = page.locator('text=/^([01]\\d|2[0-3]):[0-5]\\d$/');
  expect(await times.count()).toBeGreaterThanOrEqual(6);
});

test('opens a bundled surah with no connection', async ({ page, context }) => {
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 20_000 });

  await openMore(page);
  await page.getByRole('button').filter({ hasText: /^Quran/ }).first().click();
  await page.getByRole('button').filter({ hasText: /Al-Faatiha|Lesen|Weiterlesen/ }).first().click();

  await expect(page.locator('[dir="rtl"]').first()).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('Deutsch fehlt')).toBeVisible();
  await expect(page.getByText(/braucht dafür einmal eine Verbindung/)).toBeVisible();
});

test('reports a failure instead of inventing mosques when offline', async ({ page, context }) => {
  await openMore(page);
  await page.getByRole('button').filter({ hasText: /^Moscheen/ }).first().click();

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 20_000 });

  const body = await page.locator('body').innerText();
  expect(body).not.toMatch(/Beispiel-Moschee|Musterstraße|Demo/i);
});

test('recovers once the connection returns', async ({ page, context }) => {
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 20_000 });

  await context.setOffline(false);
  await page.reload();
  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 20_000 });

  await page.getByRole('button', { name: 'Gebete und Erinnerungen öffnen' }).click();
  const times = page.locator('text=/^([01]\\d|2[0-3]):[0-5]\\d$/');
  expect(await times.count()).toBeGreaterThanOrEqual(6);
});
