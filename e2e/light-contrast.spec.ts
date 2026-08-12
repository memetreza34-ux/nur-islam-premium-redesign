/**
 * The light theme must not hide its own text.
 *
 * `--gold` is not redefined for the light theme, so gold text sat on cream at
 * 1.55:1, and one card kept a hardcoded dark fill while the text on it turned
 * dark with the theme. Both were invisible to a screenshot review and obvious
 * to a measurement.
 */
import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

test('no unreadable text in the light theme', async ({ page }) => {
  await openApp(page);
  await page.evaluate(() => { localStorage.setItem('nur_theme', 'light'); document.documentElement.setAttribute('data-theme', 'light'); });
  const tabs = ['Start', 'Gebete', 'Kalender', 'Islam', 'Mehr'];
  const all: string[] = [];
  for (const tab of tabs) {
    await page.getByRole('navigation').getByText(tab, { exact: false }).first().click();
    await page.waitForTimeout(800);
    const bad = await page.evaluate((tabName) => {
      const parse = (v: string) => (v.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
      const lum = ([r, g, b]: number[]) => { const f = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const backdrop = (el: Element): number[] | null => {
        let node: Element | null = el;
        while (node) {
          const style = getComputedStyle(node);
          if (style.backgroundImage && style.backgroundImage !== 'none') return null;
          const bg = style.backgroundColor;
          const alpha = Number((bg.match(/[\d.]+\)$/) ?? ['1'])[0].replace(')', ''));
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && alpha > 0.5) return parse(bg);
          node = node.parentElement;
        }
        return [255, 255, 255];
      };
      const out: string[] = [];
      for (const el of document.querySelectorAll('h1,h2,h3,strong,small,p,span,em,button')) {
        const text = (el.textContent ?? '').trim();
        if (!text || el.children.length > 0) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width < 8 || rect.height < 6) continue;
        const style = getComputedStyle(el);
        if (style.visibility === 'hidden' || style.opacity === '0') continue;
        const bg = backdrop(el);
        if (!bg) continue;
        const fg = parse(style.color);
        const ratio = (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);
        if (ratio < 3) out.push(`${ratio.toFixed(2)}  ${tabName}  ${el.className || el.tagName}  "${text.slice(0, 30)}"`);
      }
      return out;
    }, tab);
    all.push(...bad);
  }
  // A gradient-backed card has no backgroundColor to read, so those elements
  // are skipped rather than measured against the page behind them — that
  // mistake reported thirty false failures on the first run.
  expect([...new Set(all)], 'text below 3:1 in the light theme').toEqual([]);
});
