import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Opens the app and waits until it is safe to interact with.
 *
 * On a first visit the service worker installs, claims the page, and the app
 * reloads to pick up the new version — correct behaviour in production, but it
 * yanks the page out from under a test that started clicking too early. Every
 * flake seen here traced back to that reload.
 *
 * `?preview=1` skips the first-launch onboarding, which has its own coverage.
 *
 * Start intentionally has no visible bottom navigation anymore. The stable
 * readiness surface is therefore the Home container itself, not a navigation
 * element that only becomes visible after leaving Start.
 */
export async function openApp(page: Page) {
  await page.goto('/?preview=1');
  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 20_000 });

  // Wait for the worker to control this page, so the claim-triggered reload has
  // already happened rather than landing in the middle of the test.
  await page.waitForFunction(
    () => !('serviceWorker' in navigator) || navigator.serviceWorker.controller != null,
    undefined,
    { timeout: 30_000 },
  );
  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 20_000 });
}
