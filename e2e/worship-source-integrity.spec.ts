import { expect, test } from '@playwright/test';
import { WORSHIP_GUIDES } from '../src/data/worshipGuideData';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 768]) {
  test(`Wudu opens directly and each step keeps its source at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
    await expect(page.locator('.reference-guide-topics, .reference-guide-tabs')).toHaveCount(0);
    const guide = WORSHIP_GUIDES.find(item => item.id === 'wudu')!;
    for (const [index, step] of guide.steps.entries()) {
      await page.getByText('Schritt auswählen', { exact: true }).click();
      await page.getByRole('button', { name: `Schritt ${index + 1}: ${step.title}`, exact: true }).click();
      const article = page.getByRole('article');
      await expect(article).toContainText(step.description.split('. ')[0].replace('Sinngemäße Bedeutung: ', ''));
      if (index === 0 || index === 9) await expect(article.locator('.wudu-lesson__arabic')).toHaveText(step.arabic!);
      if (step.sourceUrl) {
        await page.getByRole('button', { name: `Quellen anzeigen: Quelle zu „${step.title}“`, exact: true }).click();
        const source = page.getByRole('dialog', { name: /^Quelle zu/ });
        await expect(source).toContainText(step.source!);
        await expect(source.getByRole('link')).toHaveAttribute('href', step.sourceUrl);
        expect(await source.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        await source.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await page.screenshot({ path: testInfo.outputPath(`wudu-direct-${width}.png`) });
  });
}
