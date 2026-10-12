import { expect, test } from '@playwright/test';
import type { Page, Route } from '@playwright/test';
import { readFileSync } from 'node:fs';

const arabic = JSON.parse(readFileSync('public/data/quran/ar/1.json', 'utf8'));
test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function openReader(page: Page) {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Quran', exact: true }).click();
  await expect(page.locator('.reference-quran-list--catalog article')).toHaveCount(114);
  await expect(page.locator('.reference-quran-online-note')).toContainText('sofern dein Browser Speicherung erlaubt');
  await expect(page.locator('.reference-quran-online-note')).not.toContainText('nach dem ersten Laden gespeichert');
  await page.getByRole('button', { name: 'Lesen beginnen', exact: true }).click();
}

test('loading notice separates local Arabic from pending supporting requests', async ({ page }) => {
  const pending: Route[] = [];
  await page.route('https://api.alquran.cloud/**', route => { pending.push(route); });
  await openReader(page);
  await expect.poll(() => pending.length).toBe(2);
  await expect(page.locator('.reference-reader-loading')).toContainText('Arabisch wird aus den lokalen Dateien geladen');
  await expect(page.locator('.reference-reader-loading')).not.toContainText('andere Suren');
  for (const route of pending) await route.abort();
  await expect(page.locator('#quran-ayah-1-1 .reference-reader-arabic')).toHaveText(arabic.ayahs[0].text);
});

for (const width of [320, 768, 1280]) {
  test(`unavailable supporting texts keep Arabic and truthful notices at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('https://api.alquran.cloud/**', route => route.abort());
    await openReader(page);
    const first = page.locator('#quran-ayah-1-1');
    await expect(first.locator('.reference-reader-arabic')).toHaveText(arabic.ayahs[0].text);
    await expect(page.locator('.reference-screen-header .overline')).toHaveText('Arabisch offline');
    await expect(page.locator('.reference-reader-verse')).toHaveCount(7);
    for (const selector of ['.reference-reader-pronunciation', '.reference-reader-translation']) {
      await expect(first.locator(selector)).toContainText('nutzbarer Browser-Cache');
      await expect(first.locator(selector)).not.toContainText('Beim ersten Öffnen');
    }
    await first.scrollIntoViewIfNeeded();
    expect(await first.locator('p').evaluateAll(elements => elements.every(el => el.scrollWidth <= el.clientWidth))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`quran-unavailable-${width}.png`) });
    await page.getByRole('button', { name: 'Deutsch Buchseiten', exact: true }).click();
    await expect(page.locator('.reference-reader-flow__empty')).toContainText('Deutsche Übersetzung nicht verfügbar');
    await page.getByRole('button', { name: 'Arabisch Buchseiten', exact: true }).click();
    await expect(page.locator('.reference-reader-flow__text.is-arabic')).toContainText(arabic.ayahs[6].text);
  });
}

test('a misidentified local surah fails honestly and the retry loads a corrected file', async ({ page }) => {
  let invalid = true;
  await page.route('https://api.alquran.cloud/**', route => route.abort());
  await page.route('**/data/quran/ar/1.json', route => route.fulfill({
    json: invalid ? { ...arabic, number: 2 } : arabic,
  }));
  await openReader(page);
  await expect(page.locator('.reference-reader-unavailable')).toContainText('Surenverzeichnis');
  await expect(page.locator('.reference-reader-verse')).toHaveCount(0);
  invalid = false;
  await page.getByRole('button', { name: 'Erneut versuchen', exact: true }).click();
  await expect(page.locator('#quran-ayah-1-1 .reference-reader-arabic')).toHaveText(arabic.ayahs[0].text);
});

test('a wrong translated edition never appears under the Bubenheim attribution', async ({ page }) => {
  await page.route('https://api.alquran.cloud/**', route => route.fulfill({ json: {
    code: 200, data: { ...arabic, edition: { identifier: 'wrong-edition' }, ayahs: arabic.ayahs.map((ayah: { numberInSurah: number }) => ({ ...ayah, text: 'Falsche Testausgabe' })) },
  } }));
  await openReader(page);
  await expect(page.locator('#quran-ayah-1-1 .reference-reader-arabic')).toHaveText(arabic.ayahs[0].text);
  await expect(page.locator('.reference-reader-screen')).not.toContainText('Falsche Testausgabe');
  await expect(page.locator('#quran-ayah-1-1 .reference-reader-translation')).toHaveClass(/is-unavailable/);
});

test('network reading layers do not claim browser storage when cache writes fail', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'caches', { configurable: true, value: {
      open: async () => ({ match: async () => undefined, put: async () => { throw new Error('Test quota failure'); } }),
    } });
  });
  await page.route('https://api.alquran.cloud/**', route => {
    const identifier = route.request().url().split('/').at(-1)!;
    return route.fulfill({ json: {
      code: 200, data: { ...arabic, edition: { identifier }, ayahs: arabic.ayahs.map((ayah: { numberInSurah: number }) => ({ ...ayah, text: `Test-Lesetext ${ayah.numberInSurah}` })) },
    } });
  });
  await openReader(page);
  await expect(page.locator('#quran-ayah-1-1 .reference-reader-translation')).toContainText('Test-Lesetext 1');
  await expect(page.locator('.reference-screen-header .overline')).toHaveText('Lesetexte geladen');
  await expect(page.locator('.reference-screen-header')).not.toContainText('Im Browser gespeichert');
});

for (const width of [320, 768, 1280]) {
  test(`openings stay separate from numbered, copied and shared verses at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      Object.assign(window, { copiedAyah: '', sharedAyah: '' });
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
        writeText: async (text: string) => { Object.assign(window, { copiedAyah: text }); },
      } });
      Object.defineProperty(navigator, 'share', { configurable: true, value: async (data: ShareData) => {
        Object.assign(window, { sharedAyah: data.text });
      } });
    });
    await page.route('https://api.alquran.cloud/**', route => route.abort());
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Quran', exact: true }).click();
    for (const number of [2, 9, 95, 97, 112]) {
      const raw = JSON.parse(readFileSync(`public/data/quran/ar/${number}.json`, 'utf8'));
      const prefix = number === 9 ? null : raw.ayahs[0].text.split(' ').slice(0, 4).join(' ');
      const firstText = prefix ? raw.ayahs[0].text.slice(prefix.length + 1) : raw.ayahs[0].text;
      await page.getByRole('button', { name: new RegExp(`^Sure ${number}:`) }).click();
      const first = page.locator(`#quran-ayah-${number}-1`);
      await expect(first.locator('.reference-reader-arabic')).toHaveText(firstText);
      const opening = page.getByRole('region', { name: 'Unnummerierter Surenbeginn', exact: true });
      if (prefix) {
        await expect(opening.locator('p')).toHaveText(prefix);
        await expect(opening.locator('sup, button, [id]')).toHaveCount(0);
      } else {
        await expect(opening).toHaveCount(0);
      }
      await first.getByRole('button', { name: 'Ayah kopieren', exact: true }).click();
      const expected = `${firstText}\n\n${raw.englishName} ${number}:1`;
      await expect.poll(() => page.evaluate(() => (window as Window & { copiedAyah: string }).copiedAyah)).toBe(expected);
      await first.getByRole('button', { name: 'Teilen', exact: true }).click();
      await expect.poll(() => page.evaluate(() => (window as Window & { sharedAyah: string }).sharedAyah)).toBe(expected);
      await page.getByRole('button', { name: 'Arabisch Buchseiten', exact: true }).click();
      await expect(page.locator(`#quran-ayah-${number}-1`)).toContainText(firstText);
      if (prefix) await expect(opening).toHaveCount(1);
      else await expect(opening).toHaveCount(0);
      if (number === 2) {
        await page.getByRole('button', { name: 'Nächste Leseseite', exact: true }).click();
        await expect(opening).toHaveCount(0);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      if (number === 112) {
        await opening.scrollIntoViewIfNeeded();
        expect(await opening.locator('p').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
        await page.screenshot({ path: testInfo.outputPath(`quran-basmalah-${width}.png`) });
      }
      await page.getByRole('button', { name: 'Versweise Alle drei Texte', exact: true }).click();
      await page.getByRole('button', { name: 'Zurück zum Quran', exact: true }).click();
      await expect(page.locator('.reference-quran-list--catalog article')).toHaveCount(114);
    }
  });
}
