import { expect, test, type Locator, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function mockReadingLayers(page: Page) {
  const arabic = JSON.parse(readFileSync('public/data/quran/ar/1.json', 'utf8'));
  await page.route('https://api.alquran.cloud/**', route => route.fulfill({ json: {
    code: 200, data: { ...arabic, edition: { identifier: route.request().url().split('/').at(-1) },
      ayahs: arabic.ayahs.map((ayah: Record<string, unknown>, index: number) => ({ ...ayah,
        text: `Prüftext ${index + 1} für Schriftgröße und Umbruch. Dieser synthetische Absatz prüft längere Wörter, mehrere Sätze und eine angenehme Zeilenlänge auf kleinen Bildschirmen.`,
      })),
    },
  } }));
}

async function waitForPaint(locator: Locator) {
  await expect.poll(() => locator.evaluate(el => {
    for (let node: Element | null = el; node; node = node.parentElement) {
      if (Number(getComputedStyle(node).opacity) < .999) return false;
    }
    return true;
  })).toBe(true);
}

async function capture(page: Page, path: string) {
  const dialog = page.getByRole('dialog');
  await waitForPaint(await dialog.count() ? dialog : page.locator('main:not(.reference-splash)').first());
  await page.screenshot({ path });
}

for (const size of [{ width: 320, height: 740 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 844, height: 390 }]) {
  test(`readable design and complete labels at ${size.width}x${size.height}`, async ({ page }, testInfo) => {
    await page.setViewportSize(size);
    await page.goto('/?preview=1');
    const nav = page.locator('.bottom-nav');
    await expect(nav).toBeVisible();
    const clock = page.locator('.home-prayer-focus .ds-arch__value');
    await expect(clock).toBeVisible();
    await waitForPaint(clock);
    const brand = page.locator('.brand-lockup__mark > img');
    await expect.poll(() => brand.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    await brand.evaluate((el: HTMLImageElement) => el.decode());
    await page.evaluate(() => document.fonts.ready);
    const bounds = await clock.boundingBox();
    const navigation = await nav.boundingBox();
    if (bounds!.y + bounds!.height >= navigation!.y) {
      await page.screenshot({ path: testInfo.outputPath('home-clock-outside-viewport.png') });
      await testInfo.attach('home-clock-layout', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() =>
        [...document.querySelectorAll('.premium-home--v2,.premium-home--v2 > *,.home-prayer-focus .ds-arch,.brand-lockup__mark > img')].map(el => {
          const css = getComputedStyle(el), bounds = el.getBoundingClientRect();
          return { selector: el.className, top: bounds.top, height: bounds.height, position: css.position, display: css.display, gridTemplateRows: css.gridTemplateRows };
        }))) });
    }
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    await expect.poll(async () => {
      const current = await clock.boundingBox(), bar = await nav.boundingBox();
      return Boolean(current && bar && current.y + current.height < bar.y);
    }).toBe(true);
    await capture(page, testInfo.outputPath('home.png'));

    await nav.getByRole('button', { name: 'Mehr', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Mehr', exact: true, level: 1 })).toBeVisible();
    const prayerLabel = page.locator('.reference-core-access-grid strong').filter({ hasText: /^Gebetszeiten$/ });
    await prayerLabel.scrollIntoViewIfNeeded();
    const lineCount = await prayerLabel.evaluate(el => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getClientRects().length;
    });
    expect(lineCount).toBe(1);
    await capture(page, testInfo.outputPath('more.png'));
    if (size.width >= 768) {
      const groups = page.locator('.reference-core-access__groups');
      await expect(groups).toHaveCSS('column-count', '2');
      await capture(page, testInfo.outputPath('tablet-groups.png'));
    }

    await page.getByRole('button', { name: /^Vers des Tages / }).click();
    await expect(page.getByRole('heading', { name: 'Ayah im Fokus', exact: true })).toBeVisible();
    const contrast = await page.locator('.reference-ayah-hero > .hero-pill').evaluate(el => {
      const rgba = (value: string) => value.match(/[\d.]+/g)!.map(Number);
      const foreground = rgba(getComputedStyle(el).color);
      const overlay = rgba(getComputedStyle(el).backgroundColor);
      const base = rgba(getComputedStyle(el.parentElement!).backgroundColor);
      const background = base.slice(0, 3).map((c, i) => (overlay[3] ?? 1) * overlay[i] + (1 - (overlay[3] ?? 1)) * c);
      const luminance = (rgb: number[]) => rgb.slice(0, 3).map(c => c / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4).reduce((v, c, i) => v + c * [.2126, .7152, .0722][i], 0);
      const a = luminance(foreground), b = luminance(background);
      return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    });
    expect(contrast).toBeGreaterThanOrEqual(4.5);
    await expect(page.getByRole('button', { name: 'Kopieren', exact: true })).toHaveCount(1);
    await capture(page, testInfo.outputPath('ayah.png'));
  });
}

test('reading text is legible by default and storage guidance remains reachable', async ({ page }, testInfo) => {
  await mockReadingLayers(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?preview=1');
  await page.locator('.bottom-nav').getByRole('button', { name: 'Quran', exact: true }).click();
  await page.getByRole('button', { name: 'Quellen anzeigen: Lesen & Offline', exact: true }).click();
  const help = page.getByRole('dialog', { name: 'Lesen & Offline', exact: true });
  await expect(help).toContainText('Gelöschte Browserdaten entfernen auch gespeicherte Texte und Lesestellen.');
  await help.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
  await page.getByRole('button', { name: 'Lesen beginnen', exact: true }).click();
  await expect(page.locator('.reference-reader-screen')).toBeVisible();
  await page.getByRole('button', { name: 'Deutsch Buchseiten', exact: true }).click();
  const text = page.locator('.reference-reader-flow__text.is-german').first();
  await expect(text).toBeVisible();
  expect(await text.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
  await text.scrollIntoViewIfNeeded();
  await capture(page, testInfo.outputPath('german-reading.png'));
});

test('widget labels have a full row on a normal phone', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?preview=1');
  await page.locator('.bottom-nav').getByRole('button', { name: 'Mehr', exact: true }).click();
  await page.getByRole('button', { name: 'Nur Premium 0,99 € · Komfortfunktionen ansehen', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Home', exact: true }).click();
  const rows = page.locator('.premium-local-toggle-grid').first().locator('.premium-widget-picker-entry');
  const first = await rows.nth(0).boundingBox(), second = await rows.nth(1).boundingBox();
  expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height);
  await capture(page, testInfo.outputPath('widgets.png'));
});

test('each accent updates text and action roles together', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?preview=1');
  await page.locator('.bottom-nav').getByRole('button', { name: 'Mehr', exact: true }).click();
  await page.getByRole('button', { name: /Nur Premium/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Nur Islam Premium' });
  await dialog.getByRole('button', { name: 'Design', exact: true }).click();
  const accents: Array<[string, string, string]> = [
    ['Saphir', '#8fb7cf', '#b8d8eb'], ['Pflaume', '#c69ab8', '#e2bfd5'],
    ['Sand', '#d6b78c', '#edd2ac'], ['Nur Klassik', '#d4af37', '#e2bf77'],
  ];
  for (const [name, primary, text] of accents) {
    await dialog.getByRole('button', { name, exact: true }).click();
    const roles = await page.locator('html').evaluate(el => {
      const css = getComputedStyle(el);
      return ['--gold', '--gold-text', '--ds-gold'].map(key => css.getPropertyValue(key).trim().toLowerCase());
    });
    expect(roles).toEqual([primary, text, name === 'Nur Klassik' ? text : primary]);
    const gradient = await dialog.locator('.premium-local-inline-form > button').evaluate(el => getComputedStyle(el).backgroundImage);
    const channel = name === 'Nur Klassik' ? '#e2bf77' : primary;
    const rgb = channel.slice(1).match(/../g)!.map(value => parseInt(value, 16)).join(', ');
    expect(gradient).toContain(`rgb(${rgb})`);
    await capture(page, testInfo.outputPath(`accent-${name}.png`));
  }
});

for (const width of [320, 390, 768]) {
  test(`onboarding preserves complete mosque at ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 768 ? 1024 : 844 });
    await page.goto('/');
    const image = page.locator('.reference-onboarding__visual--1 > .premium-image > img');
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    await waitForPaint(image);
    await expect(image).toHaveCSS('transform', 'none');
    const bounds = await image.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    await capture(page, testInfo.outputPath('onboarding-art.png'));
  });
}

test('topic artwork stays distinct and loads on the secondary screens', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?preview=1');
  await page.locator('.bottom-nav').getByRole('button', { name: 'Mehr', exact: true }).click();
  for (const [title, filename] of [['Zakat-Rechner', 'zakat-calculator-v1.webp'], ['Ummah-Übersicht', 'home-extra-ummah-v2.webp']]) {
    await page.locator('.reference-core-access button, .reference-services-grid button').filter({ hasText: title }).click();
    const heading = page.getByRole('heading', { name: title, level: 1, exact: true });
    await expect(heading).toBeVisible();
    await waitForPaint(heading);
    const art = page.locator('.reference-legacy-hero > img');
    await expect(art).toHaveAttribute('src', new RegExp(filename));
    const imageBox = (await art.boundingBox())!;
    const copyBox = (await page.locator('.reference-legacy-hero__copy').boundingBox())!;
    expect(imageBox.x + imageBox.width).toBeLessThanOrEqual(copyBox.x);
    expect(await art.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    await capture(page, testInfo.outputPath(`${title}.png`));
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Mehr', exact: true, level: 1 })).toBeVisible();
  }
});

test('main sections and reading remain usable with a doubled base font', async ({ page }, testInfo) => {
  await mockReadingLayers(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?preview=1');
  await expect(page.locator('.bottom-nav')).toBeVisible();
  await page.addStyleTag({ content: ':root { font-size: 200%; }' });
  for (const title of ['Start', 'Gebet', 'Quran', 'Lernen', 'Mehr']) {
    await page.locator('.bottom-nav').getByRole('button', { name: title, exact: true }).click();
    const heading = page.getByRole('heading', { name: title === 'Start' ? 'Start – Nur Islam' : title === 'Gebet' ? 'Gebetszeiten' : title, exact: true, level: 1 });
    await expect(heading).toBeVisible();
    await waitForPaint(heading);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await capture(page, testInfo.outputPath(`large-type-${title}.png`));
  }
  await page.locator('.bottom-nav').getByRole('button', { name: 'Quran', exact: true }).click();
  await page.getByRole('button', { name: 'Lesen beginnen', exact: true }).click();
  await page.getByRole('button', { name: 'Deutsch Buchseiten', exact: true }).click();
  const text = page.locator('.reference-reader-flow__text.is-german').first();
  await expect(text).toBeVisible();
  expect(await text.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(32);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await text.scrollIntoViewIfNeeded();
  await capture(page, testInfo.outputPath('large-type-reader.png'));
});
