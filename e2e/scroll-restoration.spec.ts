import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

/**
 * Going back returns to the place the reader left, not to the top.
 *
 * Home is roughly four screens tall. Scrolling to the fasting card near its
 * foot, opening it and coming back used to land at the very top, with the card
 * just tapped somewhere far below — the reader had to find their way down
 * again on every return. Reported from use, reproduced here.
 *
 * The frame is the scroll container, not the window: every screen change mounts
 * a fresh one, and a fresh element starts at zero.
 */
const FRAME = '.screen-transition-frame';

async function frameScroll(page: import('@playwright/test').Page) {
  return page.locator(FRAME).evaluate((node) => node.scrollTop);
}

test('returning from a card lands where the reader left, not at the top', async ({ page }) => {
  await openApp(page);

  // Scroll the card into view first and read the position from there. Clicking
  // a card that is off screen makes the driver scroll on its own, and that
  // scroll — not the one set here — would be the position the app remembers.
  const fastingCard = page.getByRole('button').filter({ hasText: 'Fastentage' }).first();
  await fastingCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const left = await frameScroll(page);
  expect(left).toBeGreaterThan(0);

  await fastingCard.click();
  await page.waitForTimeout(800);
  await expect(page.getByRole('heading', { name: 'Fasten-Assistent', level: 1 })).toBeVisible();

  // A screen opened for the first time still begins at its own top.
  expect(await frameScroll(page)).toBe(0);

  await page.getByRole('button', { name: /^Zurück/ }).first().click();
  await page.waitForTimeout(1000);

  expect(await frameScroll(page)).toBe(left);
});

test('a screen opened for the first time starts at its top', async ({ page }) => {
  await openApp(page);

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.waitForTimeout(500);
  expect(await frameScroll(page)).toBe(0);

  await page.getByRole('button').filter({ hasText: 'Duas' }).first().click();
  await page.waitForTimeout(800);
  expect(await frameScroll(page)).toBe(0);
});
