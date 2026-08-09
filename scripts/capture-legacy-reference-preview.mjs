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

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  colorScheme: 'dark',
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
  geolocation: { latitude: 52.52, longitude: 13.405 },
  permissions: ['geolocation'],
  reducedMotion: 'reduce',
});
const page = await context.newPage();

page.on('pageerror', (error) => console.error('[legacy-preview] page error:', error));
page.on('console', (message) => {
  if (message.type() === 'error') console.error('[legacy-preview] console error:', message.text());
});

async function settle() {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(420);
}

async function nav(label) {
  const button = page.locator('.bottom-nav__item').filter({ hasText: label }).first();
  await button.waitFor({ state: 'visible', timeout: 10_000 });
  await button.click();
  await page.waitForTimeout(280);
}

async function screenshot(name) {
  await page.screenshot({
    path: resolve(outputDir, `${name}-390x844.png`),
    animations: 'disabled',
  });
}

try {
  await page.goto(appUrl.toString(), { waitUntil: 'domcontentloaded' });
  await page.locator('.bottom-nav').waitFor({ state: 'visible', timeout: 15_000 });
  await settle();

  for (const group of groups) {
    await nav(group.nav);
    await page.locator(group.parent).waitFor({ state: 'visible', timeout: 15_000 });
    await settle();

    for (let index = 0; index < group.features.length; index += 1) {
      const [id, title] = group.features[index];
      const button = page.locator(group.scope).filter({ hasText: title }).first();
      await button.waitFor({ state: 'visible', timeout: 10_000 });
      await button.scrollIntoViewIfNeeded();
      await page.waitForTimeout(160);
      await button.click();

      const legacy = page.locator('.reference-legacy-screen');
      await legacy.waitFor({ state: 'visible', timeout: 15_000 });
      const hero = legacy.locator('.reference-legacy-hero').first();
      await hero.waitFor({ state: 'visible', timeout: 10_000 });
      await hero.scrollIntoViewIfNeeded();
      await settle();
      await screenshot(`${String(group.startIndex + index).padStart(2, '0')}-legacy-${id}`);

      const back = legacy.locator('.reference-screen-header .icon-button').first();
      await back.waitFor({ state: 'visible', timeout: 10_000 });
      await back.click();
      await page.locator(group.parent).waitFor({ state: 'visible', timeout: 15_000 });
      await page.waitForTimeout(240);
    }
  }
} finally {
  await context.close();
  await browser.close();
}

console.log('Legacy premium reference screenshots captured.');
