import { expect, test } from '@playwright/test';
import { HADITH_LIBRARY } from '../src/data/hadithData';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 768, 1280]) {
  test(`Hadith grading attribution survives library, saved detail and sharing at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('https://api.aladhan.com/**', route => route.abort());
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { configurable: true, value: async (data: ShareData) => {
        (window as unknown as { capturedShare: ShareData }).capturedShare = data;
      } });
    });
    await page.goto('/?preview=1');
    await expect(page.getByRole('main', { name: 'Nur Islam wird geladen' })).toHaveCount(0);
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    await page.locator('.reference-foundation-path').getByRole('button', { name: /Hadith-Sammlung/ }).click();
    const articles = page.locator('.reference-hadith-library article');
    await expect(articles).toHaveCount(20);
    for (const entry of HADITH_LIBRARY.filter(item => item.grading)) {
      await page.getByPlaceholder('Hadithe durchsuchen').fill(entry.source);
      await expect(articles).toHaveCount(1);
      await articles.getByRole('button', { name: /^Quellen anzeigen:/ }).click();
      const info = page.locator('dialog.source-info-dialog');
      await expect(info).toContainText(entry.grading!.text);
      await expect(info.getByRole('link', { name: 'Bewertungsquelle' })).toHaveAttribute('href', entry.grading!.sourceUrl);
      if (entry.grading!.comparisonUrl) await expect(info.getByRole('link', { name: 'Vergleichsquelle' })).toHaveAttribute('href', entry.grading!.comparisonUrl);
      await info.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
      await articles.getByRole('button', { name: 'Als Favorit speichern', exact: true }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await articles.screenshot({ path: testInfo.outputPath(`hadith-attribution-${width}.png`) });
    await page.getByRole('navigation').getByRole('button', { name: 'Start', exact: true }).click();
    await page.getByRole('button').filter({ hasText: 'Meine Sammlung' }).first().click();
    for (const entry of HADITH_LIBRARY.filter(item => item.grading)) {
      await page.getByRole('button').filter({ hasText: entry.title }).first().click();
      await page.getByRole('button', { name: /^Quellen anzeigen:/ }).click();
      const source = page.locator('dialog.source-info-dialog .reference-source-card');
      await expect(source).toContainText(entry.grading!.text);
      await expect(source.getByRole('link', { name: 'Bewertungsquelle' })).toHaveAttribute('href', entry.grading!.sourceUrl);
      if (entry.grading!.comparisonUrl) await expect(source.getByRole('link', { name: 'Vergleichsquelle' })).toHaveAttribute('href', entry.grading!.comparisonUrl);
      await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
      await page.getByRole('button', { name: 'Teilen', exact: true }).click();
      const shared = await page.evaluate(() => (window as unknown as { capturedShare: ShareData }).capturedShare.text);
      expect(shared).toContain(entry.summary);
      if (entry.context) expect(shared).toContain(`Einordnung: ${entry.context}`);
      expect(shared).toContain(entry.source);
      expect(shared).toContain(entry.grading!.text);
      expect(shared).toContain(entry.grading!.sourceUrl);
      if (entry.grading!.comparisonUrl) expect(shared).toContain(entry.grading!.comparisonUrl);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.getByRole('button', { name: 'Zurück', exact: true }).click();
    }
  });
}
