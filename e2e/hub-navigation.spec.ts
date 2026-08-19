import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

async function openHub(page: import('@playwright/test').Page) {
  if (await page.locator('.premium-home--v2').isVisible().catch(() => false)) {
    await page.getByRole('button', { name: 'Mehr öffnen' }).click();
  } else {
    await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  }
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

test('a service feature opens from the More hub and system Back returns there', async ({ page }) => {
  await openApp(page);
  await openHub(page);

  await page.getByRole('button').filter({ hasText: 'Freiwillige Fastentage' }).first().click();
  await expect(page.getByRole('heading', { name: 'Fasten-Assistent', level: 1 })).toBeVisible();
  await expect(page.getByRole('navigation')).toHaveCount(0);

  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeVisible();
});
