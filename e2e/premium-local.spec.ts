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

async function openPremium(page: import('@playwright/test').Page) {
  if (await page.locator('.premium-home--v2').isVisible().catch(() => false)) {
    await page.getByRole('button', { name: 'Mehr öffnen' }).click();
  } else {
    await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  }
  const launcher = page.getByRole('button', { name: /Nur Premium/ });
  await expect(launcher).toBeVisible();
  await launcher.click();
  const premium = page.getByRole('dialog', { name: 'Nur Islam Premium' });
  await expect(premium).toBeVisible();
  return premium;
}

test('opens Premium from More and renders statistics without an update loop', async ({ page }) => {
  await openApp(page);

  const premium = await openPremium(page);
  await premium.getByRole('button', { name: 'Statistik', exact: true }).click();

  await expect(premium.getByRole('heading', { name: 'Deine letzten Tage' })).toBeVisible();
  await expect(premium.getByText('Gebete markiert')).toBeVisible();
  await expect(premium.getByText('Quran aktive Tage')).toBeVisible();
  await page.waitForTimeout(600);
  await expect(premium).toBeVisible();
});

test('creates a local routine and persists its daily completion', async ({ page }) => {
  await openApp(page);

  let premium = await openPremium(page);
  await premium.getByRole('button', { name: 'Routinen', exact: true }).click();

  await premium.getByLabel('Name').fill('Morgenroutine');
  await premium.getByLabel(/Schritte/).fill('Morgen-Adhkar\n5 Minuten Quran');
  await premium.getByRole('button', { name: 'Routine erstellen' }).click();

  await expect(premium.getByRole('heading', { name: 'Morgenroutine' })).toBeVisible();
  await premium.getByRole('button', { name: 'Morgen-Adhkar' }).click();
  await expect(premium.getByText('1/2 heute erledigt')).toBeVisible();
  await premium.getByRole('button', { name: 'Premium schließen' }).click();

  await page.reload();
  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 20_000 });
  premium = await openPremium(page);
  await premium.getByRole('button', { name: 'Routinen', exact: true }).click();
  await expect(premium.getByRole('heading', { name: 'Morgenroutine' })).toBeVisible();
  await expect(premium.getByText('1/2 heute erledigt')).toBeVisible();
});

test('Premium entry sits in the More screen flow without covering shortcuts', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Mehr öffnen' }).click();

  const launcher = page.getByRole('button', { name: /Nur Premium/ });
  await expect(launcher).toBeVisible();
  await expect(launcher).toHaveCSS('position', 'static');

  const host = page.locator('.premium-local-launcher-host');
  await expect(host).toBeVisible();
  await expect(host.locator('xpath=..')).toHaveClass(/reference-profile-screen/);

  const account = page.locator('.reference-account-entry');
  const shortcuts = page.locator('.reference-core-access');
  const boxes = await Promise.all([account.boundingBox(), launcher.boundingBox(), shortcuts.boundingBox()]);
  const [accountBox, launcherBox, shortcutsBox] = boxes;
  expect(accountBox).not.toBeNull();
  expect(launcherBox).not.toBeNull();
  expect(shortcutsBox).not.toBeNull();
  expect(launcherBox!.y).toBeGreaterThanOrEqual(accountBox!.y + accountBox!.height - 1);
  expect(launcherBox!.y + launcherBox!.height).toBeLessThanOrEqual(shortcutsBox!.y + 1);

  await launcher.click();
  await expect(page.getByRole('dialog', { name: 'Nur Islam Premium' })).toBeVisible();
});
