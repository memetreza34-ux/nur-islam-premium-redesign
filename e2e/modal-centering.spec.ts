import { expect, test, type Page } from '@playwright/test';
import { openApp } from './appReady';

async function expectCenteredDialog(page: Page, selector: string) {
  const metrics = await page.locator(selector).evaluate((element: HTMLElement) => {
    const box = element.getBoundingClientRect();
    const nav = document.querySelector('.bottom-nav')?.getBoundingClientRect();
    return {
      centerOffset: Math.abs(box.top + box.height / 2 - (nav?.top ?? window.innerHeight) / 2),
      top: box.top,
      bottom: box.bottom,
      navTop: nav?.top ?? window.innerHeight,
      viewportHeight: window.innerHeight,
    };
  });

  expect(metrics.centerOffset, 'dialog should be centered in the space above navigation').toBeLessThanOrEqual(2);
  expect(metrics.top, 'dialog should remain inside the viewport').toBeGreaterThanOrEqual(8);
  expect(metrics.bottom, 'dialog should not collide with the bottom navigation').toBeLessThan(metrics.navTop);
  expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewportHeight - 8);
}

test('centers prayer, profile and calendar dialogs clear of the bottom navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);

  await page.getByRole('navigation').getByText('Gebet', { exact: true }).click();
  await page.getByRole('button', { name: 'Berechnung', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Gebetszeiten-Einstellungen' })).toBeVisible();
  await expectCenteredDialog(page, '.reference-prayer-settings-modal');
  await page.getByRole('button', { name: 'Schließen' }).click();

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mehr', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Einstellungen', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Einstellungen' })).toBeVisible();
  await expectCenteredDialog(page, '.reference-profile-modal');
  await page.getByRole('button', { name: 'Schließen' }).click();

  await page.getByRole('navigation').getByText('Gebet', { exact: true }).click();
  await page.getByRole('button', { name: 'Kalender öffnen', exact: true }).click();
  await page.getByRole('button', { name: /Hinzufügen/ }).first().click();
  await expect(page.getByRole('dialog', { name: 'Termin hinzufügen' })).toBeVisible();
  await expectCenteredDialog(page, '.calendar-modal');
});
