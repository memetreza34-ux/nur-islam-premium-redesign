import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function openCourse(page: Page) {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await page.getByRole('button', { name: 'Gebetsablauf Rakʿah mit Wortlaut', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Gebetskurs', exact: true })).toBeVisible();
  await page.locator('.reference-rakah-practice > summary').click();
}

async function checkSourceReadable(page: Page) {
  const source = page.locator('.reference-rakah-source');
  await source.scrollIntoViewIfNeeded();
  await expect(source).toBeVisible();
  const sourceBox = (await source.boundingBox())!;
  const viewportHeight = page.viewportSize()!.height;
  expect(sourceBox.y).toBeGreaterThanOrEqual(0);
  expect(sourceBox.y + sourceBox.height).toBeLessThanOrEqual(viewportHeight);
  for (const selector of ['.reference-rakah-source', '.reference-rakah-wording__arabic', '.reference-rakah-wording__pronunciation', '.reference-rakah-wording__translation']) {
    expect(await page.locator(selector).evaluateAll(nodes => nodes.every(node => node.scrollWidth <= node.clientWidth))).toBe(true);
  }
  await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
}

for (const width of [320, 390, 768, 1280]) {
  test(`posture, pronunciation and step chooser stay separate at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openCourse(page);

    const chooser = page.locator('.reference-prayer-step-chooser');
    const figure = page.locator('.reference-rakah-figure');
    await expect(chooser.locator('summary')).toContainText('Schritt auswählen');
    await expect(page.getByRole('heading', { name: 'Takbir al-Ihram', exact: true })).toBeVisible();
    await expect(figure.getByRole('img')).toHaveAttribute('src', /salah-posture-takbir-v2\.webp/);
    await expect.poll(() => figure.getByRole('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(page.locator('.reference-rakah-wording__pronunciation')).toContainText('Al-laa-hu ak-bar');
    await expect(page.locator('.reference-rakah-wording')).toContainText('Deutsche Aussprachehilfe');
    await expect(page.locator('.reference-rakah-wording')).toContainText('Bedeutung');

    const chooserBox = (await chooser.boundingBox())!;
    const imageBox = (await figure.boundingBox())!;
    expect(chooserBox.y + chooserBox.height).toBeLessThan(imageBox.y);
    const actionBox = (await page.locator('.reference-rakah-step-detail__description').boundingBox())!;
    const wordingBox = (await page.locator('.reference-rakah-wording__arabic').first().boundingBox())!;
    expect(actionBox.y).toBeGreaterThanOrEqual(imageBox.y + imageBox.height);
    expect(wordingBox.y).toBeGreaterThanOrEqual(actionBox.y + actionBox.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await figure.screenshot({ path: testInfo.outputPath(`salah-posture-${width}.png`) });

    await chooser.locator('summary').click();
    const ruku = chooser.getByRole('button').filter({ hasText: 'Ruku (Verbeugung)' });
    await ruku.click();
    await expect(chooser).not.toHaveAttribute('open', '');
    await expect(figure.getByRole('img')).toHaveAttribute('src', /salah-posture-ruku-v2\.webp/);
    await expect(page.locator('.reference-rakah-wording__pronunciation').first()).toContainText('Sub-haa-na');
  });
}

for (const width of [320, 390, 768]) {
  test(`switching prayers keeps the selector position and focus at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => localStorage.setItem('nur_prayer_lesson_dhuhr_step', '3'));
    await openCourse(page);
    await page.getByRole('heading', { name: 'Gebetskurs', exact: true }).scrollIntoViewIfNeeded();
    const selector = page.getByRole('region', { name: 'Gebet auswählen', exact: true });
    const hero = page.locator('.reference-prayer-course-hero');
    const top = (await selector.boundingBox())!.y;
    for (const [name, id] of [['Dhuhr', 'dhuhr'], ['Asr', 'asr'], ['Maghrib', 'maghrib'], ['Isha', 'isha'], ['Fajr', 'fajr']]) {
      const button = selector.getByRole('button', { name, exact: true });
      await button.click();
      await expect(hero).toHaveAttribute('data-prayer-scene', id);
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(button).toBeFocused();
      expect((await selector.boundingBox())!.y).toBeCloseTo(top, 0);
      await expect(hero).toBeInViewport();
      if (id === 'dhuhr') await expect(page.locator('#prayer-step-title')).toHaveText('Sure Al-Fatihah');
    }
    if (width === 390) await page.screenshot({ path: testInfo.outputPath('prayer-switch-stays-at-top.png') });
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
    await expect(page.locator('.reference-prayer-course-hero__time-art > img')).toHaveAttribute('src', new RegExp(`prayer-oasis-${image}-v2\\.webp`));
  }
});

for (const width of [320, 768, 1280]) {
  test(`compared prayer wording, sources and limits are readable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await openCourse(page);
    const chooser = page.locator('.reference-prayer-step-chooser');
    await page.locator('.reference-rakah-wording').getByRole('button', { name: /^Quellen anzeigen:/ }).click();
    await expect(page.locator('.reference-rakah-source')).toContainText('738');
    await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
    for (const [title, reference] of [
      ['Eröffnungs-Bittgebet (Sana)', '243'], ['Ruku (Verbeugung)', '262'],
      ['Zuflucht suchen & Basmala', '7267'], ['Sure Al-Fatihah', '5899'],
      ['Eine weitere Sure', '112:1–4'],
      ['Aufrichten aus dem Ruku', '789'], ['Sujud (Niederwerfung)', '262'],
      ['Sitzen zwischen den Niederwerfungen', '897'], ['Zweite Niederwerfung', '262'],
      ['Aufstehen zur nächsten Rakʿah', '789'],
    ]) {
      await chooser.locator('summary').click();
      await chooser.getByRole('button').filter({ hasText: title }).click();
      await page.locator('.reference-rakah-wording').getByRole('button', { name: /^Quellen anzeigen:/ }).click();
      await expect(page.locator('.reference-rakah-source')).toContainText(reference);
      if (title === 'Eröffnungs-Bittgebet (Sana)') await expect(page.locator('.reference-rakah-source')).toContainText('At-Tirmidhi erwähnt Kritik');
      if (title === 'Sure Al-Fatihah') {
        await expect(page.locator('.reference-rakah-wording')).toContainText('kein Vers der Sure');
        await expect(page.locator('.reference-rakah-wording')).toContainText('Sinngemäße Bedeutung');
      }
      if (title === 'Zuflucht suchen & Basmala') await expect(page.locator('.reference-rakah-wording')).toContainText('andere Auffassungen');
      if (['Ruku (Verbeugung)', 'Sujud (Niederwerfung)', 'Zweite Niederwerfung'].includes(title)) await expect(page.locator('.reference-rakah-wording')).toContainText('keine feste Anzahl');
      await checkSourceReadable(page);
      if (title === 'Sure Al-Fatihah') await page.screenshot({ path: testInfo.outputPath(`prayer-quran-source-${width}.png`) });
    }
    await page.getByRole('button', { name: 'Rakʿah 2', exact: true }).click();
    await page.locator('.reference-rakah-wording').getByRole('button', { name: /^Quellen anzeigen:/ }).click();
    await expect(page.locator('.reference-rakah-source')).toContainText('27:30');
    await page.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
    for (const [title, reference] of [
      ['Tashahhud (At-Tahiyyat)', '1170'], ['Salawat auf den Propheten ﷺ', '3370'],
      ['Bittgebet vor dem Salam', '588a'], ['Taslim (Abschluss)', '1320'],
    ]) {
      await chooser.locator('summary').click();
      await chooser.getByRole('button').filter({ hasText: title }).click();
      await page.locator('.reference-rakah-wording').getByRole('button', { name: /^Quellen anzeigen:/ }).click();
      await expect(page.locator('.reference-rakah-source')).toContainText(reference);
      await checkSourceReadable(page);
      if (title === 'Bittgebet vor dem Salam') {
        await expect(page.locator('.reference-rakah-wording')).toContainText('unterscheiden sich nach Rechtsschule');
        await expect(chooser).not.toContainText('optional');
        await page.screenshot({ path: testInfo.outputPath(`prayer-closing-source-${width}.png`) });
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test('a missing generated posture keeps the labelled fallback and wording usable', async ({ page }) => {
  await page.route('**/salah-posture-takbir-v2.webp*', route => route.abort());
  await openCourse(page);
  await expect(page.locator('.reference-rakah-figure img')).toBeHidden();
  await expect(page.locator('.reference-rakah-figure .prayer-posture-figure')).toBeVisible();
  await expect(page.locator('.reference-rakah-wording__arabic')).toBeVisible();
  await expect(page.locator('.reference-rakah-wording__pronunciation')).toContainText('Al-laa-hu ak-bar');
});
