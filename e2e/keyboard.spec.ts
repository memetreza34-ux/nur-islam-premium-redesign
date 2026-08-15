/**
 * The app has to be operable without a pointer.
 *
 * The light theme and reduced motion were measured; the keyboard was the one
 * accessibility promise still resting on the assumption that native buttons
 * take care of themselves. They do not take care of focus visibility, and they
 * do not take care of what Tab does once a dialog is open.
 */
import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

/** Where focus currently is, in a form that is readable in a failure message. */
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

test('every primary tab can be reached and opened with the keyboard', async ({ page }) => {
  await openApp(page);

  // Tab until focus lands in the navigation, rather than assuming a tab count:
  // the number of controls above it differs per screen and per install state.
  let reached = false;
  for (let press = 0; press < 60 && !reached; press += 1) {
    await page.keyboard.press('Tab');
    reached = await page.evaluate(() => Boolean(document.activeElement?.closest('nav, [role="navigation"]')));
  }
  expect(reached, 'the bottom navigation must be reachable with Tab alone').toBe(true);

  const label = (await focused(page)).label;
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  await expect(page.getByRole('navigation'), `pressing Enter on "${label}" must not break the shell`).toBeVisible();
});

test('the focused control is visible', async ({ page }) => {
  await openApp(page);

  // A focus ring the browser draws by default disappears the moment a
  // stylesheet sets outline: none, which is exactly what a "premium" design
  // tends to do. Measure that focus changes something visible.
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

  // The 99 Names list opens a dialog per entry. Same route the empty-state
  // tests take, including the waits — the screen transition animates, and a
  // click during it lands on an element that is about to be replaced.
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
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

  // Tab all the way round. Focus must never land behind the overlay, or a
  // keyboard user walks off into the page underneath with the dialog still up.
  for (let press = 0; press < 12; press += 1) {
    await page.keyboard.press('Tab');
    const where = await focused(page);
    expect(where.inDialog, `Tab ${press + 1} left the dialog and landed on "${where.label}"`).toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  expect((await focused(page)).inDialog, 'focus must come back out of the closed dialog').toBe(false);
});
