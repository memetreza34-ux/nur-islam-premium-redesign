import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

test('compact portrait keeps Home useful and Notes clear around its sticky header', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);

  const hero = page.locator('.premium-home--v2 .welcome-hero');
  const heroBox = await hero.boundingBox();
  expect(heroBox).not.toBeNull();
  expect(heroBox!.height, 'compact Home hero should leave room for the next-prayer card').toBeLessThanOrEqual(390);

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByRole('button').filter({ hasText: 'Notizen' }).first().click();
  await expect(page.getByRole('heading', { name: 'Notizen' })).toBeVisible();

  const geometry = await page.evaluate(() => {
    const header = document.querySelector('.reference-notes-screen > .reference-screen-header')?.getBoundingClientRect();
    const storage = document.querySelector('.reference-notes-storage')?.getBoundingClientRect();
    return header && storage ? { headerBottom: header.bottom, storageTop: storage.top } : null;
  });
  expect(geometry).not.toBeNull();
  expect(geometry!.storageTop - geometry!.headerBottom, 'Notes storage card must start clear of the sticky header before editing').toBeGreaterThanOrEqual(6);

  await page.getByRole('button', { name: 'Neue Notiz schreiben' }).click();
  const editor = page.locator('.reference-note-editor');
  await expect(editor).toBeVisible();
  await editor.scrollIntoViewIfNeeded();
  const titleInput = page.getByRole('textbox', { name: 'Titel der Notiz' });
  await titleInput.focus();

  const focusedState = await page.evaluate(() => {
    const header = document.querySelector<HTMLElement>('.reference-notes-screen > .reference-screen-header');
    const storage = document.querySelector<HTMLElement>('.reference-notes-storage');
    if (!header || !storage) return null;
    const backgroundImage = getComputedStyle(header).backgroundImage;
    const translucentLayer = /rgba\([^)]*,\s*0?\.\d+\)/i.test(backgroundImage);
    return {
      backgroundImage,
      translucentLayer,
      headerBottom: header.getBoundingClientRect().bottom,
      storageTop: storage.getBoundingClientRect().top,
    };
  });
  expect(focusedState).not.toBeNull();
  expect(focusedState!.translucentLayer, `focused Notes header must fully mask scrolled content: ${focusedState!.backgroundImage}`).toBe(false);
});

test('light calendar keeps navigation labels and day numbers comfortably readable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  await page.evaluate(() => {
    localStorage.setItem('nur_theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  });

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByRole('button').filter({ hasText: 'Kalender' }).first().click();
  await expect(page.getByRole('heading', { name: 'Kalender' })).toBeVisible();

  const type = await page.evaluate(() => {
    const weekday = document.querySelector('.calendar-weekdays span');
    const day = document.querySelector('.reference-calendar-grid .calendar-day:not(.calendar-day--empty) strong');
    if (!weekday || !day) return null;
    return {
      weekdaySize: parseFloat(getComputedStyle(weekday).fontSize),
      weekdayWeight: Number(getComputedStyle(weekday).fontWeight),
      daySize: parseFloat(getComputedStyle(day).fontSize),
      dayWeight: Number(getComputedStyle(day).fontWeight),
    };
  });

  expect(type).not.toBeNull();
  expect(type!.weekdaySize).toBeGreaterThanOrEqual(11.5);
  expect(type!.weekdayWeight).toBeGreaterThanOrEqual(700);
  expect(type!.daySize).toBeGreaterThanOrEqual(11.3);
  expect(type!.dayWeight).toBeGreaterThanOrEqual(600);
});
