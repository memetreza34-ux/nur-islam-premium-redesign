import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

const WIDTHS = [320, 375, 430];

const SURFACES = [
  { kind: 'home', name: 'Start' },
  { kind: 'tab', name: 'Gebet' },
  { kind: 'tab', name: 'Quran' },
  { kind: 'tab', name: 'Lernen' },
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
      if (surface.kind === 'home') {
        await expect(page.locator('.premium-home--v2')).toBeVisible();
      } else if (surface.kind === 'tab') {
        if (surface.name === 'Gebet' && await page.locator('.premium-home--v2').isVisible().catch(() => false)) {
          await page.getByRole('button', { name: 'Gebete und Erinnerungen öffnen' }).click();
        } else {
          await page.getByRole('navigation').getByText(surface.name, { exact: true }).click();
        }
      } else {
        if (await page.locator('.premium-home--v2').isVisible().catch(() => false)) {
          await page.getByRole('button', { name: 'Mehr öffnen' }).click();
        } else {
          await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
        }
        await page.waitForTimeout(300);
        await page.getByRole('button').filter({ hasText: surface.name }).first().click();
      }
      await page.waitForTimeout(600);

      const found = await page.evaluate(({ label, viewport }) => {
        const out: string[] = [];
        if (document.documentElement.scrollWidth > viewport + 1) {
          out.push(`${label}: page scrolls horizontally (${document.documentElement.scrollWidth}px)`);
        }

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
