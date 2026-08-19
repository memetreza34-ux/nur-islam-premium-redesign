import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

async function waitForHome(page: Page) {
  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 20_000 });
}

/**
 * Opens the app and waits until it is safe to interact with.
 *
 * On a first visit the service worker installs, claims the page, and the app
 * reloads to pick up the new version — correct behaviour in production, but it
 * yanks the page out from under a test that started clicking too early.
 *
 * `?preview=1` skips the first-launch onboarding, which has its own coverage.
 * Start intentionally has no visible bottom navigation anymore, so Home itself
 * is the stable readiness surface.
 */
export async function openApp(page: Page) {
  await page.goto('/?preview=1');
  await waitForHome(page);

  await page.waitForFunction(
    () => !('serviceWorker' in navigator) || navigator.serviceWorker.controller != null,
    undefined,
    { timeout: 30_000 },
  );
  await waitForHome(page);
}

/** Opens the More hub from either the hero-only Start or another app screen. */
export async function openMoreHub(page: Page) {
  if (await page.locator('.premium-home--v2').isVisible()) {
    await page.getByRole('button', { name: 'Mehr öffnen' }).click();
  } else {
    await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeVisible({ timeout: 15_000 });
}

/**
 * Opens a primary area without reintroducing a bottom nav on Start. From Home
 * the user enters through the hamburger menu; once inside the app, the normal
 * primary navigation is available again.
 */
export async function openPrimaryTab(page: Page, label: 'Start' | 'Gebet' | 'Quran' | 'Lernen' | 'Mehr') {
  if (label === 'Start') {
    if (await page.locator('.premium-home--v2').isVisible()) return;
    await page.getByRole('navigation').getByText('Start', { exact: true }).click();
    await waitForHome(page);
    return;
  }

  if (await page.locator('.premium-home--v2').isVisible()) {
    await openMoreHub(page);
  }
  if (label === 'Mehr') return;

  await page.getByRole('navigation').getByText(label, { exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15_000 });
}
