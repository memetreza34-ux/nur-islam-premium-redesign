import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 390, 768]) {
  test(`calm surfaces keep introductions and content usable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/?preview=1');
    await expect(page.locator('.bottom-nav')).toBeVisible();
    const more = async () => {
      if (!await page.locator('.bottom-nav').count()) await page.getByRole('button', { name: /^Zurück(?: zu .+)?$/ }).click();
      await page.locator('.bottom-nav').getByRole('button', { name: 'Mehr', exact: true }).click();
    };
    const capture = async (name: string) => {
      await page.evaluate(() => document.fonts.ready);
      await expect.poll(() => page.locator('main').first().evaluate(el => getComputedStyle(el).opacity)).toBe('1');
      await page.screenshot({ path: testInfo.outputPath(`${name}.png`) });
    };
    await more();
    await capture('more');
    await page.locator('.reference-core-access button').filter({ hasText: '99 Namen Allahs' }).click();
    const names = page.locator('.reference-names-hero');
    await expect(names).toContainText('Traditionelle Lernliste');
    await expect(page.locator('.reference-name-list--complete > article')).toHaveCount(99);
    const title = await names.locator('h2').boundingBox();
    const mark = await names.locator('.reference-names-hero__allah').boundingBox();
    expect(title!.x + title!.width).toBeLessThanOrEqual(mark!.x);
    await capture('names-intro');
    expect((await names.boundingBox())!.height).toBeLessThan(width < 350 ? 350 : 310);
    await names.getByRole('button', { name: 'Quellen anzeigen: Quellen zur Namensliste', exact: true }).click();
    await expect(page.getByRole('dialog')).toContainText('zählen sie aber nicht einzeln auf');
    await expect(page.getByRole('dialog')).toContainText('nicht jeder Eintrag ist bereits mit einem eigenen Beleg geprüft');
    await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
    await more();
    await page.locator('.reference-core-access button').filter({ hasText: 'Allah & der Glaube' }).click();
    const introduction = page.locator('.learning-course-v2__lesson > header');
    await expect(introduction).toContainText('Einführung: Woran Muslime glauben');
    expect((await introduction.boundingBox())!.height).toBeLessThan(280);
    await capture('course');
    await page.getByRole('button', { name: /Lektion auswählen/ }).click();
    await expect(page.locator('.learning-course-v2__lessons button')).toHaveCount(7);
    await page.getByRole('button', { name: /Lektion auswählen/ }).click();
    await page.locator('.learning-course-v2__takeaways').scrollIntoViewIfNeeded();
    await capture('course-takeaways');
    await more();
    await page.locator('.reference-core-access button').filter({ hasText: 'Wudu lernen' }).click();
    await expect(page.locator('.wudu-lesson__card')).toBeVisible();
    await expect(page.locator('.reference-guide-progress')).toHaveCount(0);
    const wudu = page.locator('.worship-guide-intro');
    expect((await wudu.boundingBox())!.height).toBeLessThan(350);
    const text = await wudu.locator('p').boundingBox();
    const art = await wudu.locator('.premium-image').boundingBox();
    expect(art!.x + art!.width).toBeLessThanOrEqual(text!.x);
    await capture('wudu-intro');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}
