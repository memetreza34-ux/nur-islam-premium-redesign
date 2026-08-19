/**
 * The app has to be operable without a pointer.
 *
 * Start is intentionally hero-only. Its bell and hamburger remain real focusable
 * controls, and the normal bottom navigation becomes available after entering
 * the app through the hamburger menu.
 */
import { expect, test } from '@playwright/test';
import { openApp, openMoreHub } from './appReady';

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

test('hero menu and primary navigation can be reached with the keyboard', async ({ page }) => {
  await openApp(page);

  let reachedMenu = false;
  for (let press = 0; press < 20 && !reachedMenu; press += 1) {
    await page.keyboard.press('Tab');
    reachedMenu = (await focused(page)).label === 'Mehr öffnen';
  }
  expect(reachedMenu, 'the hero hamburger must be reachable with Tab alone').toBe(true);

  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();

  let reachedPrimaryNav = false;
  for (let press = 0; press < 80 && !reachedPrimaryNav; press += 1) {
    await page.keyboard.press('Tab');
    reachedPrimaryNav = await page.evaluate(() => Boolean(document.activeElement?.closest('nav, [role="navigation"]')));
  }
  expect(reachedPrimaryNav, 'the primary navigation must remain keyboard reachable inside the app').toBe(true);
});

test('the focused hero control becomes visibly outlined', async ({ page }) => {
  await openApp(page);

  let reachedHeroAction = false;
  for (let press = 0; press < 20 && !reachedHeroAction; press += 1) {
    await page.keyboard.press('Tab');
    reachedHeroAction = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return Boolean(el?.closest('.premium-home--v2 .brand-bar__actions'));
    });
  }
  expect(reachedHeroAction, 'a hero action must receive keyboard focus').toBe(true);

  const focusStyle = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const style = getComputedStyle(el);
    return {
      opacity: Number(style.opacity),
      outlineWidth: parseFloat(style.outlineWidth),
      outlineStyle: style.outlineStyle,
    };
  });
  expect(focusStyle.opacity, 'focused transparent hero action must become visible').toBeGreaterThanOrEqual(.95);
  expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(2);
  expect(focusStyle.outlineStyle).not.toBe('none');
});

test('a dialog takes focus, holds it, and gives it back on Escape', async ({ page }) => {
  await openApp(page);
  await openMoreHub(page);
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
