import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Opens the app and waits until it is safe to interact with.
 *
 * Home intentionally has no bottom navigation now, so readiness is anchored to
 * the reference Home shell and its real menu control instead of the old nav.
 */
export async function openApp(page: Page) {
  await page.goto('/?preview=1');
  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: 'Mehr öffnen' })).toBeAttached();

  await page.waitForFunction(
    () => !('serviceWorker' in navigator) || navigator.serviceWorker.controller != null,
    undefined,
    { timeout: 30_000 },
  );

  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: 'Mehr öffnen' })).toBeAttached();
}
