import { expect, test } from '@playwright/test';
import { prayerRequestFixture } from './fixtures/prayer-api';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 768]) {
  test(`screen headers scroll out of view at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 844 });
    await page.route('https://api.aladhan.com/**', route => route.fulfill({ json: prayerRequestFixture(route.request().url()) }));
    await page.route('https://api.alquran.cloud/**', route => route.abort());
    await page.goto('/?preview=1');
    const nav = page.getByRole('navigation');

    async function checkHeader(screen: string, requireOverflow = true) {
      const frame = page.locator('.screen-transition-frame');
      const header = page.locator('main > .reference-screen-header').first();
      await expect(header).toBeVisible();
      await expect.poll(() => header.evaluate(node => {
        for (let parent = node.parentElement; parent; parent = parent.parentElement) {
          const transform = getComputedStyle(parent).transform;
          if (transform !== 'none' && !new DOMMatrixReadOnly(transform).isIdentity) return false;
        }
        return true;
      })).toBe(true);
      await frame.evaluate(node => { node.scrollTop = 0; });
      await expect.poll(() => frame.evaluate(node => node.scrollTop)).toBe(0);
      expect(await header.evaluate(node => getComputedStyle(node).position)).toBe('static');
      const before = (await header.boundingBox())!;
      const target = await frame.evaluate(node => Math.min(450, node.scrollHeight - node.clientHeight));
      if (requireOverflow) expect(target).toBeGreaterThan(before.y + before.height);
      await frame.evaluate(node => { node.scrollTop = 450; });
      await expect.poll(() => frame.evaluate(node => node.scrollTop)).toBeCloseTo(target, 0);
      expect((await header.boundingBox())!.y).toBeCloseTo(before.y - target, 0);
      if (target > before.y + before.height) expect((await header.boundingBox())!.y + before.height).toBeLessThan(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`${screen}-${width}-scrolled.png`) });
      await frame.evaluate(node => { node.scrollTop = 0; });
      await expect.poll(() => frame.evaluate(node => node.scrollTop)).toBe(0);
      await expect(header).toBeInViewport();
    }

    for (const [tab, heading] of [['Gebet', 'Gebetszeiten'], ['Quran', 'Quran'], ['Lernen', 'Lernen'], ['Mehr', 'Mehr']]) {
      await nav.getByRole('button', { name: tab, exact: true }).click();
      await expect(page.getByRole('heading', { name: heading, exact: true }).first()).toBeVisible();
      await checkHeader(tab);
    }
    await nav.getByRole('button', { name: 'Quran', exact: true }).click();
    await page.getByRole('button', { name: 'Lesen beginnen', exact: true }).click();
    await expect(page.locator('#quran-ayah-1-1 .reference-reader-arabic')).toBeVisible();
    await checkHeader('reader');
    await page.getByRole('button', { name: 'Zurück zum Quran', exact: true }).click();
    await nav.getByRole('button', { name: 'Lernen', exact: true }).click();
    await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Wudu Schritt für Schritt', exact: true })).toBeVisible();
    await checkHeader('wudu', false);
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Lernen', exact: true })).toBeVisible();
  });
}
