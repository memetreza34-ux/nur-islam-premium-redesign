import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

/**
 * Switching tabs must never leave a blank screen.
 *
 * Every other spec in this suite runs with `reducedMotion: 'reduce'`, which
 * zeroes every animation duration — so none of them exercises the transition
 * at all. These deliberately leave motion on.
 *
 * Honest limitation: these do **not** reproduce the failure they were written
 * for. The transition frame used to fade its own opacity around every screen
 * change, and a tap inside that 120ms window left it stuck at opacity 0 with a
 * fully rendered screen inside — the app blank until the next tap. That was
 * observed and measured in a headed browser (frame opacity 0, screen opacity
 * 0.94, twice), but headless Chromium settles the animation differently and
 * passes either way; verified by running these against the unfixed code.
 *
 * They are kept as a smoke test that each tab ends up visible, not as a guard
 * against that specific race — which is now impossible by construction, since
 * the frame no longer animates.
 */
const TABS = ['Start', 'Gebete', 'Kalender', 'Islam', 'Mehr'];

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

test('a screen stays visible when tabs are switched faster than the animation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);

  // Dispatched straight at the DOM rather than through Playwright clicks:
  // `locator.click()` waits for actionability between taps, which is long
  // enough to miss the window entirely. This is what a fast thumb produces.
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

test('every primary tab settles visible on its own', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  const nav = page.getByRole('navigation');

  for (const tab of TABS) {
    await nav.getByText(tab, { exact: false }).first().click();
    await page.waitForTimeout(900);
    const state = await visibleState(page);
    expect(state.frameOpacity, `${tab}: frame invisible`).toBeGreaterThan(0.9);
    expect(state.mainOpacity, `${tab}: screen invisible`).toBeGreaterThan(0.9);
    expect(state.text, `${tab}: no text rendered`).toBeGreaterThan(0);
  }
});
