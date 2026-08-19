import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

const TABS = ['Gebet', 'Quran', 'Lernen', 'Mehr'];

async function visibleState(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const frame = document.querySelector('.screen-transition-frame');
    const main = document.querySelector('main');
    return {
      frameOpacity: frame ? Number(getComputedStyle(frame).opacity) : 0,
      mainOpacity: main ? Number(getComputedStyle(main).opacity) : 0,
      mainClass: main?.className ?? '(kein main)',
      text: (main as HTMLElement | null)?.innerText.trim().length ?? 0,
    };
  });
}

test('a screen stays visible when feature tabs are switched faster than the animation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);

  await page.getByRole('button', { name: 'Gebete und Erinnerungen öffnen' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();

  await page.evaluate(async (tabs: string[]) => {
    const wait = (ms: number) => new Promise((resolve) => { setTimeout(resolve, ms); });
    const tap = (label: string) => {
      const nav = document.querySelector('nav') ?? document.querySelector('[role=navigation]');
      const node = [...(nav?.querySelectorAll('*') ?? [])]
        .find((element) => element.textContent?.trim() === label && element.children.length === 0);
      (node?.closest('button') ?? node as HTMLElement | undefined)?.click();
    };
    for (let index = 0; index < 12; index += 1) {
      tap(tabs[index % tabs.length]);
      await wait(index % 3 === 0 ? 50 : 180);
    }
  }, [...TABS]);

  await page.waitForTimeout(2000);
  const state = await visibleState(page);

  expect(state.text, `nothing rendered after rapid switching (${state.mainClass})`).toBeGreaterThan(0);
  expect(state.frameOpacity, `transition frame stuck invisible (${state.mainClass})`).toBeGreaterThan(0.9);
  expect(state.mainOpacity, `screen stuck invisible (${state.mainClass})`).toBeGreaterThan(0.9);
});

test('Home and every feature tab settle visible on their own', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);

  let state = await visibleState(page);
  expect(state.frameOpacity, 'Start: frame invisible').toBeGreaterThan(0.9);
  expect(state.mainOpacity, 'Start: screen invisible').toBeGreaterThan(0.9);
  await expect(page.locator('.premium-home--v2')).toBeVisible();

  await page.getByRole('button', { name: 'Gebete und Erinnerungen öffnen' }).click();
  await page.waitForTimeout(900);

  for (const tab of TABS) {
    if (tab !== 'Gebet') await page.getByRole('navigation').getByText(tab, { exact: true }).click();
    await page.waitForTimeout(900);
    state = await visibleState(page);
    expect(state.frameOpacity, `${tab}: frame invisible`).toBeGreaterThan(0.9);
    expect(state.mainOpacity, `${tab}: screen invisible`).toBeGreaterThan(0.9);
    expect(state.text, `${tab}: no text rendered`).toBeGreaterThan(0);
  }
});
