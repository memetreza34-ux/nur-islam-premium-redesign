import { expect, test } from '@playwright/test';
import { SAHABAH, WOMEN_IN_ISLAM } from '../../../src/data/companionData';

for (const width of [320, 768, 1280]) {
  for (const feature of ['sahabah', 'women'] as const) {
    test(`${feature}: every reference and qualification fits at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`/e2e/fixtures/people/index.html?feature=${feature}`);
      await expect(page.getByRole('heading', { name: feature === 'women' ? 'Frauen im Islam' : 'Gefährten des Propheten', exact: true }).first()).toBeVisible();
      const entries = feature === 'women' ? WOMEN_IN_ISLAM : SAHABAH;
      const cards = page.locator('.reference-person-list article');
      await expect(cards).toHaveCount(entries.length);
      for (const [index, entry] of entries.entries()) {
        const card = cards.nth(index);
        await card.scrollIntoViewIfNeeded();
        await expect(card).toBeVisible();
        await expect(card).toContainText(entry.name);
        if ('note' in entry) await expect(card).toContainText(entry.note);
        else {
          await expect(card).toContainText(entry.honorific);
          await expect(card).toContainText(entry.role);
        }
        if (entry.sourceNote) await expect(card).toContainText(entry.sourceNote);
        await expect(card.getByRole('link')).toHaveCount(entry.sources.length);
        for (const source of entry.sources) {
          const link = card.getByRole('link', { name: source.label, exact: true });
          await expect(link).toHaveAttribute('href', source.url);
          await expect(link).toHaveAttribute('target', '_blank');
          await expect(link).toHaveAttribute('rel', /noreferrer/);
          await expect(link).toBeVisible();
        }
        expect(await card.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await cards.last().screenshot({ path: testInfo.outputPath(`${feature}-last-${width}.png`) });
      await cards.first().scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath(`${feature}-first-${width}.png`) });
      const frame = await page.locator('.screen-transition-frame').evaluate(element => {
        const bounds = element.getBoundingClientRect();
        return {
          client: element.clientWidth, scroll: element.scrollWidth,
          overflow: [...element.querySelectorAll('*')].filter(child => child.getBoundingClientRect().right > bounds.right + 1).slice(0, 10).map(child => ({ class: child.className, right: child.getBoundingClientRect().right, parentRight: bounds.right })),
          decorations: [...element.querySelectorAll('*')].flatMap(child => ['::before', '::after'].map(pseudo => {
            const style = getComputedStyle(child, pseudo);
            return { class: child.className, pseudo, content: style.content, right: style.right, width: style.width, overflow: getComputedStyle(child).overflow };
          })).filter(style => style.content !== 'none' && style.content !== 'normal'),
        };
      });
      expect(frame.scroll, JSON.stringify(frame)).toBeLessThanOrEqual(frame.client + 1);
      expect(errors).toEqual([]);
    });
  }
}
