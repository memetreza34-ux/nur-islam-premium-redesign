import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
test.setTimeout(180_000);

const comparedSources: Record<number, string[]> = {
  14: ['https://quran.com/39/5'], 15: ['https://quran.com/39/4'], 16: ['https://quran.com/3/8'],
  17: ['https://quran.com/51/58'], 18: ['https://quran.com/34/26'], 19: ['https://quran.com/34/26'],
  20: ['https://sunnah.com/abudawud:3451'], 21: ['https://sunnah.com/abudawud:3451'],
  22: ['https://sunnah.com/abudawud:3450'], 23: ['https://sunnah.com/abudawud:3450'],
  24: ['https://quran.com/3/26'], 25: ['https://quran.com/3/26'],
  26: ['https://quran.com/42/11'], 27: ['https://quran.com/42/11'],
  28: ['https://sunnah.com/abudawud:4955'], 29: ['https://quran.com/4/40'],
  30: ['https://quran.com/6/103', 'https://quran.com/42/19'], 31: ['https://quran.com/6/18'],
  32: ['https://quran.com/2/225'], 33: ['https://quran.com/2/255'],
  34: ['https://quran.com/85/14'], 35: ['https://quran.com/35/30'],
  36: ['https://quran.com/2/255'], 37: ['https://quran.com/22/62'], 38: ['https://quran.com/11/57'],
  39: ['https://quran.com/4/85'], 40: ['https://quran.com/4/6', 'https://quran.com/4/86'],
  41: ['https://quran.com/55/27'], 42: ['https://quran.com/82/6'], 43: ['https://quran.com/4/1'],
  44: ['https://quran.com/11/61'], 45: ['https://quran.com/2/115'], 46: ['https://quran.com/59/24', 'https://quran.com/6/18'],
  47: ['https://quran.com/85/14'], 48: ['https://quran.com/11/73'], 49: ['https://quran.com/22/7'],
  50: ['https://quran.com/22/17'], 51: ['https://quran.com/22/6', 'https://quran.com/22/62'],
  52: ['https://quran.com/3/173'], 53: ['https://quran.com/22/40'], 54: ['https://quran.com/51/58'],
  55: ['https://quran.com/42/28'], 56: ['https://quran.com/42/28'], 57: ['https://quran.com/72/28'],
  58: ['https://quran.com/85/13'], 59: ['https://quran.com/85/13'], 60: ['https://quran.com/41/39'],
  61: ['https://quran.com/53/44'], 62: ['https://quran.com/2/255', 'https://quran.com/3/2'],
  63: ['https://quran.com/2/255', 'https://quran.com/3/2'], 64: [], 65: [], 66: ['https://quran.com/39/4'],
  67: ['https://quran.com/112/1'], 68: ['https://quran.com/112/2'], 69: ['https://quran.com/6/65'],
  70: ['https://quran.com/18/45'], 71: ['https://sunnah.com/bukhari:6398'], 72: ['https://sunnah.com/bukhari:6398'],
  73: ['https://quran.com/57/3', 'https://sunnah.com/muslim:2713a'],
  74: ['https://quran.com/57/3', 'https://sunnah.com/muslim:2713a'],
  75: ['https://quran.com/57/3', 'https://sunnah.com/muslim:2713a'],
  76: ['https://quran.com/57/3', 'https://sunnah.com/muslim:2713a'],
  77: [], 78: ['https://quran.com/13/9'], 79: ['https://quran.com/52/28'], 80: ['https://quran.com/2/37'],
  81: ['https://quran.com/32/22'], 82: ['https://quran.com/4/99'], 83: ['https://quran.com/3/30'],
  84: ['https://quran.com/3/26'], 85: ['https://quran.com/55/27', 'https://quran.com/55/78'],
  86: ['https://quran.com/3/18'], 87: ['https://quran.com/3/9'], 88: ['https://quran.com/22/64'],
  89: ['https://quran.com/53/48'], 90: ['https://sunnah.com/bukhari:844'],
  91: ['https://quran.com/10/107'], 92: ['https://quran.com/10/107'], 93: ['https://quran.com/24/35'],
  94: ['https://quran.com/25/31'], 95: ['https://quran.com/2/117'], 96: ['https://quran.com/55/27'],
  97: ['https://quran.com/15/23'], 98: ['https://quran.com/11/87'], 99: ['https://sunnah.com/bukhari:6099'],
};

for (const width of [320, 768, 1280]) {
  test(`Names preserve evidence boundaries and readable dialogs at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await page.goto('/?preview=1');
    await page.getByRole('button', { name: /^Heute entdecken 99 Namen/ }).click();
    await expect(page.locator('.reference-name-list__main')).toHaveCount(99);
    await expect(page.locator('.reference-names-hero')).toContainText('Darussalam als Daʿif');
    for (const id of Array.from({ length: 99 }, (_, i) => i + 1)) {
      await page.locator('.reference-name-list__main').nth(id - 1).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      const source = dialog.locator('.reference-name-source');
      await expect(source).toContainText('Umschrift ist eine angenäherte Lesehilfe');
      if (id <= 13) {
        await expect(source.getByRole('link')).toHaveAttribute('href', `https://quran.com/59/${id < 3 ? 22 : id < 11 ? 23 : 24}`);
      } else {
        expect(await source.getByRole('link').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(comparedSources[id]);
        if ([22, 23, 24, 25, 29, 41, 49, 57, 58, 59, 61, 81, 86, 89, 90, 91, 92, 96, 97, 98, 99].includes(id)) {
          await expect(source).toContainText('kein direkter Namensbeleg');
          await expect(source).toContainText('gesondert zu prüfen');
        }
        if ([20, 21, 22, 23, 28].includes(id)) await expect(source).toContainText('Sahih (Al-Albani)');
        if ([64, 65, 77].includes(id)) await expect(source).toContainText('keine direkte Einzelfundstelle dokumentiert');
        if ([67, 70].includes(id)) await expect(source).toContainText('ohne bestimmten Artikel');
        if (id === 78) await expect(source).toContainText('finale Ya');
        if ([82, 83, 87, 94, 95].includes(id)) await expect(source).toContainText('ohne bestimmten Artikel');
        if ([87, 93, 95].includes(id)) await expect(source).toContainText('Genitivverbindung');
        if (id === 93) await expect(source).toContainText('keine Gleichsetzung');
        if (id === 98) await expect(source).toContainText('Shuayb, nicht an Allah');
        if (id === 99) await expect(source).toContainText('Vergleichsform asbar');
      }
      for (const copy of await dialog.locator('.reference-name-modal__meaning, .reference-name-source, .reference-name-modal__arabic').all()) {
        expect(await copy.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
      }
      expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
      if ([5, 22, 30, 35, 40, 48, 58, 63, 68, 70, 76, 81, 84, 85, 88, 90, 93, 95, 98, 99].includes(id)) {
        await dialog.screenshot({ path: testInfo.outputPath(`name-${id}-${width}.png`) });
      }
      await dialog.getByRole('button', { name: 'Schließen', exact: true }).click();
      await expect(dialog).toBeHidden();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });

  test(`Names preserve stored marks and disclose failed writes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await page.addInitScript(() => {
      localStorage.setItem('nur_name_favorites', '["48","65"]');
      localStorage.setItem('nur_name_learned', '["63"]');
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key.startsWith('nur_name_')) throw new DOMException('quota', 'QuotaExceededError');
        return set.call(this, key, value);
      };
    });
    await page.goto('/?preview=1');
    await page.getByRole('button', { name: /^Heute entdecken 99 Namen/ }).click();
    await expect(page.locator('.reference-name-heart').nth(47)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.reference-name-heart').nth(64)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.reference-name-state').nth(62)).toHaveAttribute('aria-pressed', 'true');
    await page.locator('.reference-name-list__main').first().click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Favorit', exact: true }).click();
    await expect(dialog.getByRole('status')).toContainText('nicht dauerhaft gespeichert');
    await expect(dialog.getByRole('status')).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('nur_name_favorites'))).toBe('["48","65"]');
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
  });

  test(`Names do not overwrite corrupt learning data or ambiguous legacy favorites at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await page.addInitScript(() => {
      localStorage.setItem('nur_name_favorites', '["Al-Majid"]');
      localStorage.setItem('nur_name_learned', '{broken');
    });
    await page.goto('/?preview=1');
    await page.getByRole('button', { name: /^Heute entdecken 99 Namen/ }).click();
    await expect(page.getByRole('status')).toContainText('nicht eindeutig zuordenbar');
    await expect(page.locator('.reference-name-progress')).toContainText('Kein bestätigter Lernstand');
    await expect(page.locator('.reference-name-heart').nth(47)).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('.reference-name-heart').nth(64)).toHaveAttribute('aria-pressed', 'false');
    await page.locator('.reference-name-heart').first().click();
    await page.locator('.reference-name-state').first().click();
    expect(await page.evaluate(() => localStorage.getItem('nur_name_favorites'))).toBe('["1","Al-Majid"]');
    expect(await page.evaluate(() => localStorage.getItem('nur_name_learned'))).toBe('{broken');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}
