import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 768, 1280]) {
  test(`content corrections stay visible at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await page.goto('/?preview=1');
    await page.getByRole('button', { name: /Ummah-Übersicht Regionen/ }).click();
    const main = page.getByRole('main');
    await expect(main.getByText('Geografische Auswahl', { exact: true })).toBeVisible();
    await expect(main).not.toContainText(/\d+(?:[.,]\d+)?%/);
    await expect(main).toContainText('Unbelegte Prozentwerte, Bevölkerungszahlen und Rangbehauptungen wurden entfernt');
    await expect(main).toContainText('Vereinigtes Königreich');
    await main.screenshot({ path: testInfo.outputPath(`ummah-${width}.png`) });
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();

    await page.getByRole('button', { name: /^Dhikr / }).click();
    await page.locator('.reference-dhikr-category-grid').getByRole('button', { name: /Abend/ }).click();
    await page.getByRole('button', { name: 'Quellen anzeigen: Quelle zum Dhikr', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Quelle zum Dhikr', exact: true })).toContainText('Sahih Muslim 2723a');
    await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
    await expect(page.locator('.reference-dhikr-source')).toContainText('keine vollständig überlieferte gemeinsame Routine');
    await page.locator('.reference-dhikr-step-tabs').getByRole('button', { name: /Bismillahi/ }).click();
    await expect(page.locator('.reference-dhikr-copy')).toContainText('فِي الْأَرْضِ وَلَا فِي السَّمَاءِ');
    await page.getByRole('button', { name: 'Quellen anzeigen: Quelle zum Dhikr', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Quelle zum Dhikr', exact: true })).toContainText('5088');
    await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();

    await page.getByRole('button', { name: /^Islam Quiz / }).click();
    await expect(page.getByRole('main')).toContainText('Jede Lernfrage nennt nach deiner Antwort eine Fundstelle');
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();
    await page.getByRole('button', { name: /^99 Namen Allahs / }).click();
    await page.getByRole('button', { name: 'Quellen anzeigen: Quellen zur Namensliste', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Quellen zur Namensliste', exact: true })).toContainText('Verbreitete traditionelle Lernliste');
    await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
    await expect(page.locator('.reference-name-list__main')).toHaveCount(99);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}
