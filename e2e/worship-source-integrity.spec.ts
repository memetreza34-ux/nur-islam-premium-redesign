import { expect, test } from '@playwright/test';
import { WORSHIP_GUIDES } from '../src/data/worshipGuideData';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 768]) {
  test(`each selected practice step keeps its own source at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
    for (const [id, tab] of [['what-to-say', 'Wortlaut'], ['mandatory', 'Pflichtteile'], ['sahw', 'Verzählt?']]) {
      const guide = WORSHIP_GUIDES.find(item => item.id === id)!;
      await page.locator('.reference-guide-tabs').getByRole('button', { name: tab, exact: true }).click();
      const source = page.locator('.reference-source-card').filter({ hasText: 'Quelle zu' });
      for (const [index, step] of guide.steps.entries()) {
        await page.locator('.reference-guide-steps button').nth(index).click();
        await expect(source).toHaveCount(1);
        await expect(source).toContainText(`Quelle zu „${step.title}“`);
        await expect(source).toContainText(step.source!);
        await expect(source.getByRole('link', { name: 'Fundstelle öffnen', exact: true })).toHaveAttribute('href', step.sourceUrl!);
        await source.scrollIntoViewIfNeeded();
        expect(await source.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      }
      await page.screenshot({ path: testInfo.outputPath(`${id}-source-${width}.png`) });
    }
  });
}
