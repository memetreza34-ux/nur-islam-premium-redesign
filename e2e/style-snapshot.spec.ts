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
  // Freeze the clock. Two runs of identical code used to differ by the width of
  // the countdown text and of the prayer progress bar, a four-to-eight line
  // floor of noise that a real but small change hides under. Filtering the
  // clock out of the dump only caught the ones printing hh:mm; the widths they
  // drive leaked through.
  await page.clock.setFixedTime(new Date('2026-08-15T10:00:00'));
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

  // Moscheen is deliberately absent: it asks for a location and queries
  // Overpass, so it settles differently from run to run and blocked this walk.
  for (const hub of ['Quran', 'Dhikr', 'Duas', '99 Namen', 'Sammlung', 'Konto', 'Notizen', 'Assistent']) {
    await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
    await page.waitForTimeout(400);
    const entry = page.getByRole('button').filter({ hasText: hub }).first();
    if (await entry.count() === 0) continue;
    await entry.click();
    await capture(`hub:${hub}`);
  }

  // The surfaces above are the ones the app opens on. Several stylesheets exist
  // only for states this walk never entered — a dialog, a focused control, the
  // light theme, a short screen — so a change in them measured as "no change"
  // for the reason that nothing looked. These four close that gap.

  // Back to a known shell first. Detail screens hide the bottom navigation, so
  // continuing from wherever the walk above ended clicks into nothing.
  await openApp(page);

  // A dialog, open, with focus inside it.
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.waitForTimeout(600);
  const namesEntry = page.getByRole('button').filter({ hasText: '99 Namen' }).first();
  await namesEntry.waitFor({ state: 'visible', timeout: 15_000 });
  await namesEntry.click();
  await page.waitForTimeout(700);
  const nameEntry = page.getByRole('button').filter({ hasText: /Ar-Rahman/ }).first();
  if (await nameEntry.count() > 0) {
    await nameEntry.click();
    await capture('state:dialog');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // A focused control, so focus rings are part of the record.
  await page.getByRole('navigation').getByText('Start', { exact: true }).click();
  await page.waitForTimeout(400);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await capture('state:focus');

  // The light theme, which has its own token set.
  await page.evaluate(() => {
    localStorage.setItem('nur_theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await capture('state:light');
  await page.evaluate(() => {
    localStorage.setItem('nur_theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  });

  // A short screen, where the layout has its own rules.
  await page.setViewportSize({ width: 375, height: 520 });
  await capture('state:short-viewport');
  await page.setViewportSize({ width: 375, height: 812 });

  // The live countdown changes between runs and would drown the diff.
  writeFileSync(target!, lines.filter((line) => !/\d{2}:\d{2}/.test(line)).join('\n'));
});
