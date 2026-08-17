import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const cleanMarker = 'local_nur_premium_e2e_cleaned';
    if (sessionStorage.getItem(cleanMarker) === '1') return;
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('local_nur_premium_')) localStorage.removeItem(key);
    }
    sessionStorage.setItem(cleanMarker, '1');
  });
});

test('opens Premium from Home and renders statistics without an update loop', async ({ page }) => {
  await openApp(page);

  const widgets = page.getByRole('region', { name: 'Premium Widgets' });
  await expect(widgets).toBeVisible();
  await widgets.getByRole('button', { name: 'Anpassen' }).click();

  const premium = page.getByRole('dialog', { name: 'Nur Islam Premium' });
  await expect(premium).toBeVisible();
  await premium.getByRole('button', { name: 'Statistik', exact: true }).click();

  await expect(premium.getByRole('heading', { name: 'Deine letzten Tage' })).toBeVisible();
  await expect(premium.getByText('Gebete markiert')).toBeVisible();
  await expect(premium.getByText('Quran aktive Tage')).toBeVisible();
  await page.waitForTimeout(600);
  await expect(premium).toBeVisible();
});

test('creates a local routine and persists its daily completion', async ({ page }) => {
  await openApp(page);

  await page.getByRole('region', { name: 'Premium Widgets' }).getByRole('button', { name: 'Anpassen' }).click();
  const premium = page.getByRole('dialog', { name: 'Nur Islam Premium' });
  await premium.getByRole('button', { name: 'Routinen', exact: true }).click();

  await premium.getByLabel('Name').fill('Morgenroutine');
  await premium.getByLabel(/Schritte/).fill('Morgen-Adhkar\n5 Minuten Quran');
  await premium.getByRole('button', { name: 'Routine erstellen' }).click();

  await expect(premium.getByRole('heading', { name: 'Morgenroutine' })).toBeVisible();
  await premium.getByRole('button', { name: 'Morgen-Adhkar' }).click();
  await expect(premium.getByText('1/2 heute erledigt')).toBeVisible();

  await premium.getByRole('button', { name: 'Premium schließen' }).click();
  await expect(page.getByText('1/2 erledigt')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('1/2 erledigt')).toBeVisible();
});
