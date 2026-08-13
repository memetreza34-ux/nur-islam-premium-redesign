import { writeFileSync } from 'node:fs';
import { test } from '@playwright/test';
import { openApp } from './appReady';

/**
 * Dumps the computed style of every element on the main surfaces.
 *
 * Written for one job: proving that a stylesheet change is inert. Screenshots
 * cannot do it — the two screens that carry a live countdown differ between two
 * runs of identical code — and reading the CSS cannot either, as a later
 * declaration with the same value is still load-bearing when another selector
 * sits between it and the earlier one.
 *
 *   SNAP=/tmp/before.txt npx playwright test style-snapshot
 */
const target = process.env.SNAP;

test.skip(!target, 'SNAP is not set');

// Animations in flight make two runs of identical code differ by fractions of
// an opacity step. Reduced motion settles them, which is what makes this
// comparable at all. Emulated on the page rather than via test.use, which did
// not reach matchMedia here.

const PROPERTIES = [
  'color', 'backgroundColor', 'backgroundImage', 'borderRadius', 'borderColor', 'borderWidth',
  'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing',
  'padding', 'margin', 'gap', 'display', 'gridTemplateColumns', 'flexDirection',
  'position', 'width', 'height', 'minHeight', 'maxWidth', 'opacity', 'boxShadow', 'transform',
];

test('snapshots the computed styles', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);
  const lines: string[] = [];

  const capture = async (label: string) => {
    await page.waitForTimeout(700);
    const rows = await page.evaluate((properties) => {
      const out: string[] = [];
      document.querySelectorAll('*').forEach((el, index) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        out.push([
          index,
          el.tagName,
          typeof el.className === 'string' ? el.className : '',
          Math.round(rect.width),
          Math.round(rect.height),
          ...properties.map((property) => style[property as keyof CSSStyleDeclaration] as string),
        ].join('|'));
      });
      return out;
    }, PROPERTIES);
    lines.push(`## ${label}`, ...rows);
  };

  for (const tab of ['Start', 'Gebete', 'Kalender', 'Islam', 'Mehr']) {
    await page.getByRole('navigation').getByText(tab, { exact: false }).first().click();
    await capture(`tab:${tab}`);
  }

  for (const hub of ['Quran', 'Dhikr', 'Duas', '99 Namen', 'Sammlung']) {
    await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByRole('button').filter({ hasText: hub }).first().click();
    await capture(`hub:${hub}`);
  }

  // The live countdown changes between runs and would drown the diff.
  writeFileSync(target!, lines.filter((line) => !/\d{2}:\d{2}/.test(line)).join('\n'));
});
