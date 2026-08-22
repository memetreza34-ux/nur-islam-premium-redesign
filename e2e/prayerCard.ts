import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * The prayer card must be honest, not merely non-empty.
 *
 * The app deliberately refuses to calculate a personal schedule without a
 * device location, and the bundled fallback carries no clock values at all —
 * showing a plausible time for the wrong place is the failure this app can
 * least afford. So there are exactly two acceptable states: real times, or a
 * card that says the times are missing and offers the way to get them. What is
 * never acceptable is silence: a blank card, or an invented time.
 */
export async function expectHonestPrayerCard(page: Page) {
  const times = page.locator('text=/^([01]\\d|2[0-3]):[0-5]\\d$/');
  if (await times.count() >= 6) return;

  await expect(page.getByText('Gebetszeiten nicht aktuell')).toBeVisible();
  await expect(page.getByRole('button', { name: /Gebetszeiten prüfen/ })).toBeVisible();
  // The placeholder must read as a placeholder, never as a time.
  expect(await times.count()).toBe(0);
}
