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

test('opens Premium from the compact Home overview and renders statistics without an update loop', async ({ page }, testInfo) => {
  await openApp(page);

  const widgets = page.getByRole('region', { name: 'Deine Widgets' });
  await expect(widgets).toBeVisible();
  await expect(widgets.locator('.premium-local-widget').first()).toBeHidden();
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await widgets.locator('summary').scrollIntoViewIfNeeded();
    const bounds = (await widgets.locator('summary').boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    expect(bounds.height).toBeLessThanOrEqual(112);
    await page.screenshot({ path: testInfo.outputPath(`widgets-closed-${width}.png`) });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await widgets.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(widgets.locator('.premium-local-widget').first()).toBeVisible();
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const rows = await widgets.locator('.premium-local-widget').evaluateAll(elements => elements.map(element => {
      const bounds = element.getBoundingClientRect();
      return { left: bounds.left, right: bounds.right, height: bounds.height, clipped: element.scrollWidth > element.clientWidth };
    }));
    for (const row of rows) {
      expect(row.left).toBeGreaterThanOrEqual(0);
      expect(row.right).toBeLessThanOrEqual(width);
      expect(row.height).toBeGreaterThanOrEqual(44);
      expect(row.clipped).toBe(false);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
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

  const widgets = page.getByRole('region', { name: 'Deine Widgets' });
  await widgets.locator('summary').click();
  await widgets.getByRole('button', { name: 'Anpassen' }).click();
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
  await expect(widgets.locator('.premium-local-widget').first()).toBeHidden();
  await widgets.locator('summary').click();
  await expect(page.getByText('1/2 erledigt')).toBeVisible();
  await widgets.locator('summary').click();
  await expect(widgets.locator('.premium-local-widget').first()).toBeHidden();
});

test('Premium entry sits in the More screen flow without covering shortcuts', async ({ page }) => {
  await openApp(page);
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();

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
