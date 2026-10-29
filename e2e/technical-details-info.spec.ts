import { expect, test } from '@playwright/test';
import { prayerRequestFixture } from './fixtures/prayer-api';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 390, 768]) {
  test(`technical details stay behind info controls at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 844 });
    await page.route('https://api.aladhan.com/**', route => route.fulfill({ json: prayerRequestFixture(route.request().url()) }));
    await page.route('https://api.alquran.cloud/**', route => route.abort());
    await page.route(/https:\/\/overpass[^/]+\/api\/interpreter/, route => route.fulfill({ json: {
      elements: [{ type: 'node', id: 1, lat: 52.52, lon: 13.405, tags: { amenity: 'place_of_worship', religion: 'muslim', name: 'Test-Moschee' } }],
    } }));
    await page.goto('/?preview=1');
    const nav = page.getByRole('navigation');
    await nav.getByRole('button', { name: 'Gebet', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Nächstes Pflichtgebet', exact: true })).toBeVisible();
    await expect(page.locator('.reference-prayer-live-status')).toHaveCount(0);
    await expect(page.getByText('Standort ist optional.', { exact: false })).toHaveCount(0);

    async function inspectInfo(title: string, text: string) {
      const trigger = page.getByRole('button', { name: `Quellen anzeigen: ${title}`, exact: true });
      await trigger.click();
      const dialog = page.getByRole('dialog', { name: title, exact: true });
      await expect(dialog).toContainText(text);
      expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
      await dialog.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
      await expect(trigger).toBeFocused();
    }

    await inspectInfo('Standort & Datenschutz', 'an AlAdhan übermittelt');
    await inspectInfo('Berechnung & Quelle', 'Europe/Berlin');
    await page.locator('.screen-transition-frame').evaluate(node => { node.scrollTop = 0; });
    await page.screenshot({ path: testInfo.outputPath(`prayer-${width}.png`) });

    await page.locator('.prayer-companions').getByRole('button', { name: /^Moscheen/ }).click();
    await expect(page.locator('.reference-mosque-live-status')).toContainText('1 Ergebnis');
    await expect(page.getByText('Bei freiwilliger Standortfreigabe', { exact: false })).toHaveCount(0);
    await inspectInfo('Moscheedaten & Datenschutz', 'OpenStreetMap-Mitwirkende');
    await page.screenshot({ path: testInfo.outputPath(`mosque-${width}.png`) });

    await nav.getByRole('button', { name: 'Start', exact: true }).click();
    await page.locator('.home-standfirst__date').click();
    await expect(page.getByRole('heading', { name: 'Kalender', exact: true })).toBeVisible();
    await expect(page.getByText('Berechnetes Hijri-Datum', { exact: true })).toHaveCount(0);
    await inspectInfo('Islamisches Datum', 'örtlicher Mondsichtung');
    await page.screenshot({ path: testInfo.outputPath(`calendar-${width}.png`) });

    await nav.getByRole('button', { name: 'Quran', exact: true }).click();
    await page.getByRole('button', { name: 'Lesen beginnen', exact: true }).click();
    await expect(page.locator('#quran-ayah-1-1 .reference-reader-arabic')).toBeVisible();
    await expect(page.locator('.reference-reader-hero .reference-reader-source-pill')).toHaveCount(0);
    await inspectInfo('Qurantext & Speicherung', 'Arabisch');
    await page.getByRole('button', { name: 'Zurück zum Quran', exact: true }).click();
    await nav.getByRole('button', { name: 'Lernen', exact: true }).click();
    await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
    await inspectInfo('Hinweise zur Anleitung', 'Rechtsschulen');
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();
    await page.getByRole('button', { name: 'Gebetsablauf Rakʿah mit Wortlaut', exact: true }).click();
    await inspectInfo('Hinweise zum Gebetskurs', 'Islamic Network');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('unavailable prayer times still show an actionable warning', async ({ page }) => {
  await page.route('https://api.aladhan.com/**', route => route.abort());
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Gebet', exact: true }).click();
  await expect(page.getByText('Für diesen Standort liegen gerade keine verwendbaren Gebetszeiten vor.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Gebetszeiten aktualisieren', exact: true })).toBeEnabled();
  await expect(page.getByRole('region', { name: 'Nächstes Pflichtgebet', exact: true })).toHaveCount(0);
});
