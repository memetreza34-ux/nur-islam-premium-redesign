import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 390, 768]) {
  test(`names keep complete text and separate actions at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/?preview=1');
    await page.locator('.bottom-nav').getByRole('button', { name: 'Mehr', exact: true }).click();
    await page.locator('.reference-core-access button').filter({ hasText: '99 Namen Allahs' }).click();
    const rows = page.locator('.reference-name-list--complete > article');
    await expect(rows).toHaveCount(99);
    await page.evaluate(() => document.fonts.ready);
    const geometry = await rows.evaluateAll(elements => elements.map(row => {
      const main = row.querySelector('.reference-name-list__main')!.getBoundingClientRect();
      const copy = row.querySelector('.reference-name-list__copy')!.getBoundingClientRect();
      const targets = [...row.querySelectorAll('button:not(.reference-name-list__main)')].map(el => el.getBoundingClientRect());
      const overflow = [...row.querySelectorAll('.reference-name-list__arabic,.reference-name-list__copy > *')].flatMap(el => {
        const bounds = el.getBoundingClientRect(), range = document.createRange();
        range.selectNodeContents(el);
        return [...range.getClientRects()].filter(r => r.left < bounds.left - 1 || r.right > bounds.right + 1).map(() => el.textContent);
      });
      return { width: copy.width, intersects: targets.some(r => r.left < main.right - 1), overflow };
    }));
    expect(Math.min(...geometry.map(g => g.width))).toBeGreaterThanOrEqual(96);
    expect(geometry.filter(g => g.intersects || g.overflow.length)).toEqual([]);
    await rows.nth(97).scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath('names-long-labels.png') });
    const favorite = rows.nth(97).getByRole('button', { name: /als Favorit markieren/ });
    await favorite.click();
    await expect(favorite).toHaveAttribute('aria-pressed', 'true');
    await rows.nth(97).locator('.reference-name-list__main').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('name-dialog.png') });
  });
}

for (const width of [320, 390, 768]) {
  test(`reader header stays complete with doubled text at ${width}px`, async ({ page }, testInfo) => {
    await page.route('https://api.alquran.cloud/**', route => route.abort());
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/?preview=1');
    await page.locator('.bottom-nav').getByRole('button', { name: 'Quran', exact: true }).click();
    await page.getByRole('button', { name: 'Lesen beginnen', exact: true }).click();
    await expect(page.locator('#quran-ayah-1-1')).toBeVisible();
    await page.addStyleTag({ content: ':root { font-size: 200%; }' });
    const header = page.locator('.reference-reader-screen > .reference-screen-header');
    const clipped = await header.locator('.overline,h1').evaluateAll(elements => elements.filter(el => el.scrollWidth > el.clientWidth + 1 || getComputedStyle(el).whiteSpace === 'nowrap').map(el => el.textContent));
    expect(clipped).toEqual([]);
    const truncatedModes = await page.locator('.reference-reader-mode-tabs strong,.reference-reader-mode-tabs small').evaluateAll(elements => elements.filter(el => el.scrollWidth > el.clientWidth + 1 || getComputedStyle(el).textOverflow === 'ellipsis').map(el => el.textContent));
    expect(truncatedModes).toEqual([]);
    const controls = await header.locator('button').all();
    const title = await header.locator('div').boundingBox();
    for (const control of controls) {
      const bounds = await control.boundingBox();
      expect(bounds!.x + bounds!.width <= title!.x + 1 || bounds!.x >= title!.x + title!.width - 1).toBe(true);
    }
    await page.screenshot({ path: testInfo.outputPath('reader-large-type-header.png') });
  });
}
