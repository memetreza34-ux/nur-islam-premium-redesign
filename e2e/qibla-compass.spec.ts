import { expect, test, type Page } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function openQibla(page: Page, permission: 'granted' | 'denied' = 'granted') {
  await page.addInitScript(value => {
    Object.defineProperty(DeviceOrientationEvent, 'requestPermission', { configurable: true, value: async () => value });
  }, permission);
  await page.route('**/api.aladhan.com/**', route => route.abort());
  await page.goto('/?preview=1');
  await page.getByRole('button', { name: 'Qibla-Kompass öffnen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Qibla', exact: true })).toBeVisible();
}

async function orient(page: Page, heading: number, absolute = true, beta = 0, gamma = 0) {
  await page.evaluate(({ heading, absolute, beta, gamma }) => window.dispatchEvent(new DeviceOrientationEvent(absolute ? 'deviceorientationabsolute' : 'deviceorientation', { alpha: (360 - heading) % 360, absolute, beta, gamma })), { heading, absolute, beta, gamma });
}

for (const width of [320, 390, 768]) {
  test(`open Qibla dial is readable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openQibla(page);
    await expect(page.getByText('Vorschau nach Norden', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '137° Südost', exact: true })).toBeVisible();
    await expect(page.locator('.qibla-dial')).toHaveAttribute('data-aligned', 'false');
    await expect(page.locator('.qibla-dial img, .qibla-dial image')).toHaveCount(0);
    const dial = page.locator('.qibla-dial');
    await expect(dial.locator('.qibla-dial__rose')).toHaveCount(1);
    await expect(dial.locator('.qibla-dial__qibla-counterweight')).toHaveCount(1);
    await expect(dial.locator('.qibla-dial__rim')).toHaveCount(1);
    await expect(dial.locator('.qibla-dial__qibla-pointer')).toHaveCount(1);
    await expect(dial.locator('.qibla-dial__qibla-pointer')).toBeVisible();
    await expect(dial.locator('.qibla-dial__kaaba-mark')).toBeVisible();
    await expect(dial.locator('.qibla-dial__scale text')).toHaveText(['N', 'O', 'S', 'W']);
    await expect(dial.locator('.qibla-dial__degree, .qibla-dial__needle, .qibla-dial__needle-north')).toHaveCount(0);
    await expect(dial.locator('line.qibla-dial__tick')).toHaveCount(36);
    await expect(dial.locator('.qibla-dial__device-marker')).toBeVisible();
    await expect(page.getByRole('img', { name: /Qibla-Kompass: 137 Grad/ })).toBeVisible();
    const rimStrokeWidth = await page.locator('.qibla-dial__rim').evaluate(el => parseFloat(getComputedStyle(el).strokeWidth));
    expect(rimStrokeWidth).toBeGreaterThan(0);
    expect(rimStrokeWidth).toBeLessThanOrEqual(2);
    const dialBox = (await dial.boundingBox())!;
    const reading = (await page.getByRole('heading', { name: '137° Südost', exact: true }).boundingBox())!;
    expect(dialBox.y + dialBox.height).toBeLessThan(reading.y);
    expect(dialBox.width).toBeGreaterThanOrEqual(width <= 320 ? 200 : 215);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.getByRole('region', { name: 'Richtung zur Kaaba', exact: true }).screenshot({ path: testInfo.outputPath(`qibla-${width}.png`) });
    const locationCard = page.locator('.reference-qibla-location');
    const locationButton = page.getByRole('button', { name: 'Standort aktualisieren', exact: true });
    await locationCard.scrollIntoViewIfNeeded();
    await expect(locationButton.getByText('Aktualisieren', { exact: true })).toBeVisible();
    const cardBox = (await locationCard.boundingBox())!;
    const buttonBox = (await locationButton.boundingBox())!;
    expect(buttonBox.x).toBeGreaterThanOrEqual(cardBox.x);
    expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width + 1);
    await page.getByRole('button', { name: 'Kompass-Einstellungen öffnen', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Live-Kompass starten', exact: true })).toBeFocused();
    const controls = page.locator('.reference-qibla-calibration');
    expect((await controls.getByRole('button').boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });
}

test('live direction, alignment and shortest rotation across north', async ({ page }) => {
  await openQibla(page);
  await page.getByRole('button', { name: 'Live-Kompass starten', exact: true }).click();
  await orient(page, 100);
  await expect(page.getByText('37° nach rechts drehen', { exact: true })).toBeVisible();
  await orient(page, 137);
  await expect(page.getByText('Du blickst zur Kaaba', { exact: true })).toBeVisible();
  await expect(page.locator('.qibla-dial')).toHaveAttribute('data-aligned', 'true');
  await orient(page, 150);
  await expect(page.getByText('13° nach links drehen', { exact: true })).toBeVisible();
  await orient(page, 359);
  const rotation = (selector: string) => page.locator(selector).evaluate(el => parseFloat((el as SVGElement).style.transform.match(/rotate\(([-.\d]+)deg\)/)![1]));
  const scaleBefore = await rotation('.qibla-dial__scale');
  const pointerBefore = await rotation('.qibla-dial__qibla-pointer');
  await orient(page, 1);
  await expect.poll(async () => Math.abs((await rotation('.qibla-dial__scale')) - scaleBefore + 2)).toBeLessThan(.01);
  await expect.poll(async () => Math.abs((await rotation('.qibla-dial__qibla-pointer')) - pointerBefore + 2)).toBeLessThan(.01);
  await page.getByRole('button', { name: /Kompass beenden/ }).click();
  await orient(page, 137);
  await expect(page.getByText('Vorschau nach Norden', { exact: true })).toBeVisible();
  await expect(page.locator('.qibla-dial')).toHaveAttribute('data-aligned', 'false');
});

test('relative orientation is not presented as a north-referenced heading', async ({ page }) => {
  await openQibla(page);
  await page.getByRole('button', { name: 'Live-Kompass starten', exact: true }).click();
  await orient(page, 137, false);
  await expect(page.getByText('Vorschau nach Norden', { exact: true })).toBeVisible();
  await expect(page.getByText('Kein Sensorsignal', { exact: true })).toBeVisible();
  await orient(page, 137);
  await expect(page.locator('.qibla-dial')).toHaveAttribute('data-aligned', 'false');
});

test('denied permission does not simulate compass motion', async ({ page }) => {
  await openQibla(page, 'denied');
  await page.getByRole('button', { name: 'Live-Kompass starten', exact: true }).click();
  await expect(page.getByText('Kompasszugriff verweigert', { exact: true })).toBeVisible();
  await expect(page.getByText('Vorschau nach Norden', { exact: true })).toBeVisible();
});

for (const reduced of [true, false]) {
  test(`dial motion respects reduced motion: ${reduced}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await openQibla(page);
    for (const selector of ['.qibla-dial__scale', '.qibla-dial__qibla-pointer']) {
      const duration = await page.locator(selector).evaluate(el => getComputedStyle(el).transitionDuration);
      if (reduced) expect(parseFloat(duration)).toBeLessThan(.001);
      else expect(duration).toBe('0.32s');
    }
    expect(await page.locator('.qibla-dial__rim').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    await page.getByRole('button', { name: 'Live-Kompass starten', exact: true }).click();
    await orient(page, 137);
    await expect(page.locator('.qibla-dial')).toHaveAttribute('data-aligned', 'true');
    await expect(page.getByText('Du blickst zur Kaaba', { exact: true })).toBeVisible();
  });
}

test('location update and vector compass work with all raster artwork unavailable', async ({ page, context }) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 51.5074, longitude: -0.1278 });
  await page.route('**/*.webp*', route => route.abort());
  await openQibla(page);
  await page.getByRole('button', { name: 'Standort aktualisieren', exact: true }).click();
  await expect(page.getByRole('heading', { name: '119° Südost', exact: true })).toBeVisible();
  await expect(page.locator('.reference-qibla-location strong')).toHaveText('Aktueller Gerätestandort');
  await expect(page.getByRole('img', { name: /Qibla-Kompass: 119 Grad/ })).toBeVisible();
});

test('WebKit compass never confirms alignment with poor or invalid accuracy', async ({ page }) => {
  await openQibla(page);
  await page.getByRole('button', { name: 'Live-Kompass starten', exact: true }).click();
  for (const accuracy of [40, -1, 3]) {
    await page.evaluate(value => {
      const event = new Event('deviceorientation');
      Object.defineProperties(event, {webkitCompassHeading: { value: 137 }, webkitCompassAccuracy: { value }});
      window.dispatchEvent(event);
    }, accuracy);
    await expect(page.locator('.qibla-dial')).toHaveAttribute('data-aligned', String(accuracy === 3));
    if (accuracy !== 3) await expect(page.getByText('Sensor ungenau – bitte neu ausrichten', { exact: true })).toBeVisible();
  }
});

test('flatness guidance responds to device tilt', async ({ page }) => {
  await openQibla(page);
  await page.getByRole('button', { name: 'Live-Kompass starten', exact: true }).click();
  await orient(page, 120, true, 2, 3);
  await expect(page.getByText(/Handy liegt flach/)).toBeVisible();
  await orient(page, 120, true, 24, 8);
  await expect(page.getByText('Handy noch flacher halten', { exact: true })).toBeVisible();
});
