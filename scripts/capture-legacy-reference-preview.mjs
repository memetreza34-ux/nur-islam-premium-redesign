import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const outputDir = resolve(process.cwd(), 'artifacts/reference-preview');
const baseUrl = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const appUrl = new URL(baseUrl);
appUrl.searchParams.set('preview', '1');

const groups = [
  {
    nav: 'Islam verstehen',
    parent: '.reference-learn-screen',
    scope: '.reference-expanded-learning-grid > button',
    startIndex: 27,
    features: [
      ['hadith-library', 'Hadith-Sammlung'],
      ['knowledge', 'Wissensbibliothek'],
      ['prophets', 'Propheten'],
      ['quiz', 'Islam-Quiz'],
      ['hajj', 'Hajj & Umrah'],
      ['sunnah', 'Sunnah im Alltag'],
      ['sins', 'Fehler & Reue'],
    ],
  },
  {
    nav: 'Mehr',
    parent: '.reference-profile-screen',
    scope: '.reference-services-grid > button',
    startIndex: 34,
    features: [
      ['fasting', 'Fasten-Assistent'],
      ['ummah', 'Ummah-Übersicht'],
      ['places', 'Islamische Orte'],
      ['jumuah', 'Jumuah'],
      ['zakat', 'Zakat-Rechner'],
      ['standby', 'Gebetsanzeige'],
    ],
  },
];

const viewports = [
  { width: 390, height: 844, suffix: '390x844' },
  { width: 340, height: 740, suffix: '340x740' },
];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function createContext(width, height) {
  return browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    geolocation: { latitude: 52.52, longitude: 13.405 },
    permissions: ['geolocation'],
    reducedMotion: 'reduce',
  });
}

async function settle(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(360);
}

async function nav(page, label) {
  const button = page.locator('.bottom-nav__item').filter({ hasText: label }).first();
  await button.waitFor({ state: 'visible', timeout: 10_000 });
  await button.click();
  await page.waitForTimeout(260);
}

async function screenshot(page, name, suffix) {
  await page.screenshot({
    path: resolve(outputDir, `${name}-${suffix}.png`),
    animations: 'disabled',
  });
}

async function inspectHeroArtwork(legacy, id, suffix) {
  const image = legacy.locator('.reference-legacy-hero img').first();
  const diagnostics = await image.evaluate((node) => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return {
      currentSrc: node.currentSrc,
      complete: node.complete,
      naturalWidth: node.naturalWidth,
      naturalHeight: node.naturalHeight,
      hidden: node.hidden,
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      position: style.position,
      zIndex: style.zIndex,
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
    };
  });
  console.log(`[legacy-art:${suffix}:${id}] ${JSON.stringify(diagnostics)}`);
  if (!diagnostics.complete || diagnostics.naturalWidth <= 0 || diagnostics.naturalHeight <= 0) {
    throw new Error(`Legacy hero artwork failed to decode for ${id} at ${suffix}: ${diagnostics.currentSrc}`);
  }
}

async function assertViewportLayout(page, id, suffix) {
  const layout = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }));
  console.log(`[legacy-layout:${suffix}:${id}] ${JSON.stringify(layout)}`);
  const overflow = Math.max(layout.documentWidth, layout.bodyWidth) - layout.viewportWidth;
  if (overflow > 2) {
    throw new Error(`Horizontal viewport overflow for ${id} at ${suffix}: ${overflow}px`);
  }
}

async function captureViewport({ width, height, suffix }) {
  const context = await createContext(width, height);
  const page = await context.newPage();

  page.on('pageerror', (error) => console.error(`[legacy-preview:${suffix}] page error:`, error));
  page.on('console', (message) => {
    if (message.type() === 'error') console.error(`[legacy-preview:${suffix}] console error:`, message.text());
  });

  try {
    await page.goto(appUrl.toString(), { waitUntil: 'domcontentloaded' });
    await page.locator('.bottom-nav').waitFor({ state: 'visible', timeout: 15_000 });
    await settle(page);

    for (const group of groups) {
      await nav(page, group.nav);
      await page.locator(group.parent).waitFor({ state: 'visible', timeout: 15_000 });
      await settle(page);

      for (let index = 0; index < group.features.length; index += 1) {
        const [id, title] = group.features[index];
        const button = page.locator(group.scope).filter({ hasText: title }).first();
        await button.waitFor({ state: 'visible', timeout: 10_000 });
        await button.scrollIntoViewIfNeeded();
        await page.waitForTimeout(140);
        await button.click();

        const legacy = page.locator('.reference-legacy-screen');
        await legacy.waitFor({ state: 'visible', timeout: 15_000 });
        const hero = legacy.locator('.reference-legacy-hero').first();
        await hero.waitFor({ state: 'visible', timeout: 10_000 });
        await hero.scrollIntoViewIfNeeded();
        await settle(page);
        await inspectHeroArtwork(legacy, id, suffix);
        await assertViewportLayout(page, id, suffix);
        await screenshot(page, `${String(group.startIndex + index).padStart(2, '0')}-legacy-${id}`, suffix);

        const back = legacy.locator('.reference-screen-header .icon-button').first();
        await back.waitFor({ state: 'visible', timeout: 10_000 });
        await back.click();
        await page.locator(group.parent).waitFor({ state: 'visible', timeout: 15_000 });
        await page.waitForTimeout(220);
      }
    }
  } finally {
    await context.close();
  }
}

try {
  for (const viewport of viewports) await captureViewport(viewport);
} finally {
  await browser.close();
}

console.log('Legacy premium reference screenshots captured at 390x844 and 340x740.');
