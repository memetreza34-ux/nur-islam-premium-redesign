import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

/**
 * Everything opened from the hub is a screen the navigation knows about.
 *
 * Account, notes and the six service features used to be local state inside the
 * hub. They looked like screens and had a back arrow, but the app's navigation
 * had never heard of them: no history entry, so the Android system back button
 * did nothing at all, and tapping the already-active tab — the usual way back
 * to a list — was a dead control. The same feature opened from Home behaved
 * correctly, which made it look like a screen-specific glitch rather than a
 * missing route.
 */
async function openHub(page: import('@playwright/test').Page) {
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeVisible();
}

const hubScreens = [
  { row: /^Notizen/, heading: 'Notizen' },
  { row: /^Konto & Cloud/, heading: 'Nur Cloud' },
];

for (const screen of hubScreens) {
  test(`${screen.heading}: the system back button returns to the hub`, async ({ page }) => {
    await openApp(page);
    await openHub(page);

    await page.getByRole('button').filter({ hasText: screen.row }).first().click();
    await expect(page.getByRole('heading', { name: screen.heading, level: 1 })).toBeVisible();

    await page.goBack();
    await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeVisible();
  });

  test(`${screen.heading}: tapping the active tab returns to the hub`, async ({ page }) => {
    await openApp(page);
    await openHub(page);

    await page.getByRole('button').filter({ hasText: screen.row }).first().click();
    await expect(page.getByRole('heading', { name: screen.heading, level: 1 })).toBeVisible();

    await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeVisible();
  });
}

test('a service feature opens the same way from the hub as from Home', async ({ page }) => {
  await openApp(page);

  // From Home it has always been a real screen: no bottom navigation, and the
  // system back button closes it.
  await page.getByRole('button').filter({ hasText: 'Fastentage' }).first().click();
  await expect(page.getByRole('heading', { name: 'Fasten-Assistent', level: 1 })).toBeVisible();
  await expect(page.getByRole('navigation')).toHaveCount(0);
  await page.goBack();
  await expect(page.getByRole('navigation')).toBeVisible();

  await openHub(page);
  await page.getByRole('button').filter({ hasText: 'Freiwillige Fastentage' }).first().click();
  await expect(page.getByRole('heading', { name: 'Fasten-Assistent', level: 1 })).toBeVisible();
  await expect(page.getByRole('navigation')).toHaveCount(0);

  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeVisible();
});
