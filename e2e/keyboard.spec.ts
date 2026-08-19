/** The app has to be operable without a pointer. */
import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

async function focused(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return { tag: 'BODY', label: '', inDialog: false };
    return {
      tag: el.tagName,
      label: (el.getAttribute('aria-label') || el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40),
      inDialog: Boolean(el.closest('[role="dialog"]')),
    };
  });
}

test('the reduced Home menu can be reached and opened with the keyboard', async ({ page }) => {
  await openApp(page);

  let reached = false;
  for (let press = 0; press < 20 && !reached; press += 1) {
    await page.keyboard.press('Tab');
    reached = (await focused(page)).label === 'Mehr öffnen';
  }
  expect(reached, 'the Home menu must be reachable with Tab alone').toBe(true);

  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
});

test('the focused control is visible', async ({ page }) => {
  await openApp(page);

  const invisible = await page.evaluate(() => {
    const controls = [...document.querySelectorAll('button, a[href], input, select, [tabindex]:not([tabindex="-1"])')]
      .filter((el) => (el as HTMLElement).offsetParent !== null)
      .slice(0, 12) as HTMLElement[];
    const bad: string[] = [];
    for (const control of controls) {
      const before = getComputedStyle(control);
      const resting = `${before.outlineWidth}|${before.outlineStyle}|${before.boxShadow}|${before.backgroundColor}|${before.borderColor}`;
      control.focus();
      const after = getComputedStyle(control);
      const active = `${after.outlineWidth}|${after.outlineStyle}|${after.boxShadow}|${after.backgroundColor}|${after.borderColor}`;
      if (resting === active) {
        bad.push((control.getAttribute('aria-label') || control.innerText || control.tagName).replace(/\s+/g, ' ').trim().slice(0, 40));
      }
    }
    return bad;
  });

  expect(invisible, 'these controls look identical focused and unfocused').toEqual([]);
});

test('a dialog takes focus, holds it, and gives it back on Escape', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Mehr öffnen' }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button').filter({ hasText: '99 Namen' }).first().click();
  await page.waitForTimeout(700);

  const opener = page.getByRole('button').filter({ hasText: /Ar-Rahman/ }).first();
  await opener.waitFor({ state: 'visible', timeout: 15_000 });
  await opener.click();
  await page.waitForTimeout(500);

  const dialog = page.locator('[role="dialog"]').first();
  await expect(dialog).toBeVisible();
  expect((await focused(page)).inDialog, 'opening a dialog must move focus into it').toBe(true);

  for (let press = 0; press < 12; press += 1) {
    await page.keyboard.press('Tab');
    const where = await focused(page);
    expect(where.inDialog, `Tab ${press + 1} left the dialog and landed on "${where.label}"`).toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  expect((await focused(page)).inDialog, 'focus must come back out of the closed dialog').toBe(false);
});
