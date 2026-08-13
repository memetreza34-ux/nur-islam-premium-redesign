import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

/**
 * No screen may overflow its viewport or clip its own text.
 *
 * This is the pass that found the navigation bar standing 126px tall with its
 * label wrapped one character per line — green tests and a screenshot review
 * had both missed it, because it only appeared below a certain width.
 */
const WIDTHS = [320, 375, 430];

const SURFACES = [
  { kind: 'tab', name: 'Start' },
  { kind: 'tab', name: 'Gebete' },
  { kind: 'tab', name: 'Kalender' },
  { kind: 'tab', name: 'Islam' },
  { kind: 'tab', name: 'Mehr' },
  { kind: 'hub', name: 'Quran' },
  { kind: 'hub', name: 'Dhikr' },
  { kind: 'hub', name: 'Duas' },
  { kind: 'hub', name: '99 Namen' },
  { kind: 'hub', name: 'Qibla' },
  { kind: 'hub', name: 'Kalender' },
  { kind: 'hub', name: 'Sammlung' },
] as const;

for (const width of WIDTHS) {
  test(`layout holds at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openApp(page);

    const problems: string[] = [];

    for (const surface of SURFACES) {
      if (surface.kind === 'tab') {
        await page.getByRole('navigation').getByText(surface.name, { exact: false }).first().click();
      } else {
        await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
        await page.waitForTimeout(300);
        await page.getByRole('button').filter({ hasText: surface.name }).first().click();
      }
      await page.waitForTimeout(600);

      const found = await page.evaluate(({ label, viewport }) => {
        const out: string[] = [];

        // Nothing may push the page sideways. This is the one overflow signal
        // that is unambiguous: a per-element right edge past the viewport is
        // usually a hero image bleeding inside a clipping card, and everything
        // lives inside a scroll container that clips horizontally anyway.
        if (document.documentElement.scrollWidth > viewport + 1) {
          out.push(`${label}: page scrolls horizontally (${document.documentElement.scrollWidth}px)`);
        }

        // Text taller than the box holding it, with the overflow hidden and no
        // way to scroll to it — the reader simply loses the rest of the line.
        for (const el of document.querySelectorAll('*')) {
          if (el.children.length > 0) continue;
          const text = (el.textContent ?? '').trim();
          if (!text) continue;
          const style = getComputedStyle(el);
          if (style.overflowY !== 'hidden' && style.overflow !== 'hidden') continue;
          if (el.scrollHeight <= el.clientHeight + 2) continue;
          const name = typeof el.className === 'string' && el.className ? el.className : el.tagName;
          out.push(`${label}: ${name.slice(0, 40)} clips "${text.slice(0, 24)}"`);
        }

        return out;
      }, { label: `${surface.kind}:${surface.name}`, viewport: width });

      problems.push(...found);
    }

    expect([...new Set(problems)], `layout problems at ${width}px`).toEqual([]);
  });
}
