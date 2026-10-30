import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { prayerRequestFixture } from './fixtures/prayer-api';

test.use({ serviceWorkers: 'block', isMobile: false, hasTouch: false, viewport: { width: 1024, height: 900 } });

async function open(page: Page, theme = 'dark') {
  await page.addInitScript(value => localStorage.setItem('nur_theme', value), theme);
  await page.clock.setFixedTime(new Date('2026-10-22T12:00:00+02:00'));
  await page.route('https://api.aladhan.com/**', route => route.fulfill({ json: prayerRequestFixture(route.request().url()) }));
  await page.goto('/?preview=1');
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

async function checkHover(page: Page, target: Locator) {
  await page.mouse.move(0, 0);
  await target.scrollIntoViewIfNeeded();
  await expect(target).toHaveCSS('opacity', '1');
  await expect(target).toHaveCSS('transform', 'none');
  await expect(target).toHaveCSS('filter', 'none');
  const before = (await target.boundingBox())!;
  const image = target.locator('img').first();
  const imageBefore = await image.count() ? await image.boundingBox() : null;
  await target.hover();
  await expect(target).toHaveCSS('filter', 'brightness(1.06)');
  const after = (await target.boundingBox())!;
  for (const key of ['x', 'y', 'width', 'height'] as const) expect(after[key]).toBeCloseTo(before[key], 1);
  if (imageBefore) {
    const imageAfter = (await image.boundingBox())!;
    for (const key of ['x', 'y', 'width', 'height'] as const) expect(imageAfter[key]).toBeCloseTo(imageBefore[key], 1);
  }
}

for (const theme of ['dark', 'light']) {
  test(`shared hover stays calm across all main pages in ${theme} mode`, async ({ page }) => {
    await open(page, theme);
    expect(await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)).toBe(true);
    const staticHero = page.locator('.home-prayer-focus');
    await staticHero.locator('.ds-arch__value').hover();
    await expect(staticHero).toHaveCSS('filter', 'none');
    await checkHover(page, page.locator('.quick-card').first());
    const nav = page.getByRole('navigation');
    await checkHover(page, nav.getByRole('button', { name: 'Gebet', exact: true }));
    await nav.getByRole('button', { name: 'Gebet', exact: true }).click();
    const refresh = page.getByRole('button', { name: 'Gebetszeiten aktualisieren', exact: true });
    await expect(refresh).toBeEnabled();
    await checkHover(page, refresh);
    await checkHover(page, page.locator('.prayer-alert').first());
    await expect(page.locator('.prayer-alert').first()).toHaveAttribute('aria-pressed', 'false');
    await nav.getByRole('button', { name: 'Quran', exact: true }).click();
    const row = page.locator('.reference-quran-list--catalog article').first();
    await checkHover(page, row.locator('.reference-quran-list__main'));
    await expect(row).toHaveCSS('filter', 'none');
    await expect(row).toHaveCSS('transform', 'none');
    await checkHover(page, row.getByRole('button', { name: /als Favorit markieren/ }));
    await expect(row.getByRole('button', { name: /als Favorit markieren/ })).toHaveAttribute('aria-pressed', 'false');
    await checkHover(page, page.getByRole('button', { name: 'Quellen anzeigen: Lesen & Offline', exact: true }));
    await nav.getByRole('button', { name: 'Lernen', exact: true }).click();
    await checkHover(page, page.locator('.learn-library-card').first());
    await nav.getByRole('button', { name: 'Mehr', exact: true }).click();
    await checkHover(page, page.locator('.reference-core-access button').first());
    await nav.getByRole('button', { name: 'Start', exact: true }).focus();
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus-visible');
    await expect(focused).toHaveCount(1);
    await expect(focused).toHaveCSS('outline-style', 'solid');
    expect(parseFloat(await focused.evaluate(el => getComputedStyle(el).outlineWidth))).toBeGreaterThanOrEqual(2);
  });
}

test('disabled refresh controls do not react to hovering or pressing', async ({ page }) => {
  await open(page);
  const nav = page.getByRole('navigation');
  await nav.getByRole('button', { name: 'Gebet', exact: true }).click();
  const refresh = page.getByRole('button', { name: 'Gebetszeiten aktualisieren', exact: true });
  await expect(refresh).toBeEnabled();
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('https://api.aladhan.com/**', async route => {
    await gate;
    await route.fulfill({ json: prayerRequestFixture(route.request().url()) });
  });
  await refresh.click();
  await expect(refresh).toBeDisabled();
  const disabledFilter = await refresh.evaluate(el => getComputedStyle(el).filter);
  await refresh.hover({ force: true });
  await expect(refresh).toHaveCSS('filter', disabledFilter);
  await page.mouse.down();
  await expect(refresh).toHaveCSS('filter', disabledFilter);
  await page.mouse.up();
  release();
  await expect(refresh).toBeEnabled();
});

test.describe('touch feedback', () => {
  test.use({ isMobile: true, hasTouch: true, viewport: { width: 390, height: 844 } });
  test('touch has a brief press response without a sticky hover or movement', async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => matchMedia('(hover: hover)').matches)).toBe(false);
    const target = page.getByRole('navigation').getByRole('button', { name: 'Start', exact: true });
    await target.hover();
    await expect(target).toHaveCSS('filter', 'none');
    const before = (await target.boundingBox())!;
    await page.mouse.down();
    await expect(target).toHaveCSS('filter', 'brightness(0.94)');
    const pressed = (await target.boundingBox())!;
    expect(pressed.width).toBeCloseTo(before.width, 1);
    expect(pressed.height).toBeCloseTo(before.height, 1);
    await page.mouse.up();
    await expect(target).toHaveCSS('filter', 'none');
  });
});

test('reduced motion keeps feedback immediate', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  const target = page.getByRole('navigation').getByRole('button', { name: 'Start', exact: true });
  await target.hover();
  await expect(target).toHaveCSS('filter', 'brightness(1.06)');
  await expect(target).toHaveCSS('transition-duration', '0s');
});
