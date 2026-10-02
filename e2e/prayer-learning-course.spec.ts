import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function openCourse(page: Page) {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await page.getByRole('button', { name: 'Gebetsablauf Rakʿah mit Wortlaut', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Gebetskurs', exact: true })).toBeVisible();
}

for (const width of [320, 390, 768]) {
  test(`posture, pronunciation and step chooser stay separate at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openCourse(page);

    const chooser = page.locator('.reference-prayer-step-chooser');
    const figure = page.locator('.reference-rakah-figure');
    await expect(chooser).toContainText('Takbir al-Ihram');
    await expect(figure.getByRole('img')).toHaveAttribute('src', /salah-posture-takbir-v1\.webp/);
    await expect.poll(() => figure.getByRole('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(page.locator('.reference-rakah-wording__pronunciation')).toContainText('Al-laa-hu ak-bar');
    await expect(page.locator('.reference-rakah-wording')).toContainText('Deutsche Aussprachehilfe');
    await expect(page.locator('.reference-rakah-wording')).toContainText('Bedeutung');

    const chooserBox = (await chooser.boundingBox())!;
    const imageBox = (await figure.boundingBox())!;
    expect(chooserBox.y + chooserBox.height).toBeLessThan(imageBox.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await figure.screenshot({ path: testInfo.outputPath(`salah-posture-${width}.png`) });

    await chooser.locator('summary').click();
    const ruku = chooser.getByRole('button').filter({ hasText: 'Ruku (Verbeugung)' });
    await ruku.click();
    await expect(chooser).not.toHaveAttribute('open', '');
    await expect(figure.getByRole('img')).toHaveAttribute('src', /salah-posture-ruku-v1\.webp/);
    await expect(page.locator('.reference-rakah-wording__pronunciation').first()).toContainText('Sub-haa-na');
  });
}

test('all five prayers have their correct rakah count and time artwork', async ({ page }) => {
  await openCourse(page);
  const expected = [
    ['Fajr', '2', 'fajr'],
    ['Dhuhr', '4', 'dhuhr'],
    ['Asr', '4', 'asr'],
    ['Maghrib', '3', 'maghrib'],
    ['Isha', '4', 'isha'],
  ] as const;

  for (const [name, rakahs, image] of expected) {
    await page.locator('.reference-prayer-course-selector button').filter({ hasText: name }).click();
    await expect(page.locator('.reference-rakah-practice h2')).toHaveText(`Rakʿah 1 von ${rakahs}`);
    await expect(page.locator('.reference-prayer-course-hero__time-art > img')).toHaveAttribute('src', new RegExp(`prayer-${image}-v1\\.webp`));
  }
});

test('a missing generated posture keeps the labelled fallback and wording usable', async ({ page }) => {
  await page.route('**/salah-posture-takbir-v1.webp*', route => route.abort());
  await openCourse(page);
  await expect(page.locator('.reference-rakah-figure img')).toBeHidden();
  await expect(page.locator('.reference-rakah-figure .prayer-posture-figure')).toBeVisible();
  await expect(page.locator('.reference-rakah-wording__arabic')).toBeVisible();
  await expect(page.locator('.reference-rakah-wording__pronunciation')).toContainText('Al-laa-hu ak-bar');
});
