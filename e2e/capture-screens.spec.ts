import { test } from '@playwright/test';
import { openApp } from './appReady';

/**
 * Captures one screenshot per primary surface into the directory named by
 * SHOT_DIR. Not an assertion — this is the before/after evidence for changes
 * that are supposed to be visually invisible, such as removing dead CSS.
 *
 *   SHOT_DIR=/tmp/before npx playwright test capture-screens
 */
const target = process.env.SHOT_DIR;

const tabs = ['Start', 'Gebete', 'Kalender', 'Mehr'];
const hubEntries = ['Quran', 'Dhikr', 'Duas', 'Qibla', 'Namen'];

test.skip(!target, 'SHOT_DIR is not set');

test('captures every primary surface', async ({ page }) => {
  await openApp(page);

  for (const tab of tabs) {
    await page.getByRole('navigation').getByText(tab, { exact: true }).click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${target}/tab-${tab}.png`, fullPage: true });
  }

  for (const entry of hubEntries) {
    await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
    await page.waitForTimeout(400);
    const link = page.getByText(entry, { exact: true }).first();
    if (!(await link.count())) continue;
    await link.click();
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${target}/hub-${entry}.png`, fullPage: true });
  }
});
