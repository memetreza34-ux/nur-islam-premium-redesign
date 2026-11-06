import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const [width, theme] of [[320, 'dark'], [320, 'light'], [768, 'dark'], [768, 'light']] as const) {
  test(`directory screens have readable image banners at ${width}px in ${theme}`, async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(value => { localStorage.setItem('nur_theme', value); }, theme);
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Mehr', exact: true }).click();
    const directory = page.locator('.reference-core-access');
    await expect(directory.getByRole('button')).toHaveCount(29);

    for (let index = 0; index < 29; index++) {
      const entry = directory.getByRole('button').nth(index);
      const title = (await entry.locator('strong').first().innerText()).trim();
      await entry.click();
      await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeHidden();
      if (title !== 'Start') {
        const header = page.locator('main > .reference-screen-header').first();
        await expect(header).toHaveClass(/reference-screen-header--banner/);
        await header.scrollIntoViewIfNeeded();
        const background = await header.evaluate(element => getComputedStyle(element).backgroundImage);
        const url = background.match(/url\("?([^"\)]+)"?\)/)?.[1];
        expect(url, title).toBeTruthy();
        expect(await page.evaluate(async source => {
          const image = new Image(); image.src = source!;
          try { await image.decode(); return image.naturalWidth >= 1080 && image.naturalHeight >= 360; }
          catch { return false; }
        }, url), title).toBe(true);
        expect(await header.locator('h1').evaluate(element => element.scrollWidth <= element.clientWidth + 1), title).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), title).toBe(true);
        await header.screenshot({ path: testInfo.outputPath(`banner-${index}-${width}.png`) });
      }
      await page.goBack();
      await expect(page.getByRole('heading', { name: 'Mehr', level: 1 })).toBeVisible();
    }
  });
}
