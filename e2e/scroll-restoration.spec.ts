import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

const FRAME = '.screen-transition-frame';

async function frameScroll(page: import('@playwright/test').Page) {
  return page.locator(FRAME).evaluate((node) => node.scrollTop);
}

async function openMore(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Mehr öffnen' }).click();
  await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeVisible();
}

test('returning from a More entry lands where the reader left, not at the top', async ({ page }) => {
  await openApp(page);
  await openMore(page);

  const fastingCard = page.getByRole('button').filter({ hasText: 'Freiwillige Fastentage' }).first();
  await fastingCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const left = await frameScroll(page);
  expect(left).toBeGreaterThan(0);

  await fastingCard.click();
  await page.waitForTimeout(800);
  await expect(page.getByRole('heading', { name: 'Fasten-Assistent', level: 1 })).toBeVisible();
  expect(await frameScroll(page)).toBe(0);

  await page.getByRole('button', { name: /^Zurück/ }).first().click();
  await page.waitForTimeout(1000);
  expect(await frameScroll(page)).toBe(left);
});

test('a screen opened for the first time starts at its top', async ({ page }) => {
  await openApp(page);
  await openMore(page);
  expect(await frameScroll(page)).toBe(0);

  await page.getByRole('button').filter({ hasText: 'Duas' }).first().click();
  await page.waitForTimeout(800);
  expect(await frameScroll(page)).toBe(0);
});
