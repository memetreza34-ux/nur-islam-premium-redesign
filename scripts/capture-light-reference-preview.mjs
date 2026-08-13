import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const outputDir = resolve(process.cwd(), 'artifacts/reference-preview');
const baseUrl = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const appUrl = new URL(baseUrl);
appUrl.searchParams.set('preview', '1');

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  colorScheme: 'light',
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
  geolocation: { latitude: 52.52, longitude: 13.405 },
  permissions: ['geolocation'],
  reducedMotion: 'reduce',
});
await context.addInitScript(() => {
  localStorage.setItem('nur_theme', 'light');
  localStorage.setItem('nur_onboarding_complete', 'true');
});
const page = await context.newPage();

page.on('pageerror', (error) => console.error('[light-preview] page error:', error));
page.on('console', (message) => {
  if (message.type() === 'error') console.error('[light-preview] console error:', message.text());
});

async function settle() {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(420);
}

async function shot(name) {
  await page.screenshot({
    path: resolve(outputDir, `light-${name}-390x844.png`),
    animations: 'disabled',
  });
}

async function nav(label) {
  const button = page.locator('.bottom-nav__item').filter({ hasText: label }).first();
  await button.waitFor({ state: 'visible', timeout: 10_000 });
  await button.click();
  await page.waitForTimeout(300);
}

async function returnHome() {
  const start = page.locator('.bottom-nav__item').filter({ hasText: 'Start' }).first();
  if (await start.isVisible().catch(() => false)) {
    await start.click();
  } else {
    const back = page.locator('.reference-screen-header .icon-button').first();
    await back.waitFor({ state: 'visible', timeout: 10_000 });
    await back.click();
    const startAfterBack = page.locator('.bottom-nav__item').filter({ hasText: 'Start' }).first();
    if (await startAfterBack.isVisible().catch(() => false)) await startAfterBack.click();
  }
  await page.locator('.premium-home--v2').waitFor({ state: 'visible', timeout: 15_000 });
  await settle();
}

async function captureSecondary(trigger, screen, name) {
  const button = page.locator('button').filter({ hasText: trigger }).first();
  await button.waitFor({ state: 'visible', timeout: 10_000 });
  await button.click();
  await page.locator(screen).waitFor({ state: 'visible', timeout: 15_000 });
  await settle();
  await shot(name);
}

async function assertLightTheme() {
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  if (theme !== 'light') throw new Error(`Expected light theme, received ${theme ?? 'unset'}.`);
}

async function assertBrightHeroTitle(selector, label) {
  const title = page.locator(selector).first();
  await title.waitFor({ state: 'visible', timeout: 10_000 });
  const result = await title.evaluate((node) => {
    const color = getComputedStyle(node).color;
    const match = color.match(/rgba?\(([^)]+)\)/i);
    if (!match) return { color, luminance: -1 };
    const [r, g, b] = match[1].split(',').slice(0, 3).map((value) => Number.parseFloat(value.trim()) / 255);
    const linear = [r, g, b].map((channel) => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
    return {
      color,
      luminance: .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2],
    };
  });
  if (result.luminance < .68) {
    throw new Error(`${label} hero title lost its cream-on-emerald contrast: ${result.color} (luminance ${result.luminance.toFixed(3)}).`);
  }
}

try {
  await page.goto(appUrl.toString(), { waitUntil: 'domcontentloaded' });
  await page.locator('.premium-home--v2').waitFor({ state: 'visible', timeout: 15_000 });
  await settle();
  await assertLightTheme();
  await shot('01-home');

  const ayahCard = page.locator('button.reference-daily-card-button').filter({ hasText: 'Ayah im Fokus' }).first();
  await ayahCard.waitFor({ state: 'visible', timeout: 10_000 });
  await ayahCard.click();
  await page.locator('.reference-ayah-hero').waitFor({ state: 'visible', timeout: 10_000 });
  await settle();
  await assertLightTheme();
  await shot('01a-ayah-detail');
  await returnHome();

  const hadithCard = page.locator('button.reference-daily-card-button').filter({ hasText: 'Hadith des Tages' }).first();
  await hadithCard.waitFor({ state: 'visible', timeout: 10_000 });
  await hadithCard.click();
  await page.locator('.reference-hadith-hero').waitFor({ state: 'visible', timeout: 10_000 });
  await settle();
  await assertLightTheme();
  await shot('01b-hadith-detail');
  await returnHome();

  for (const [label, name] of [
    ['Gebete', '02-prayer'],
    ['Kalender', '03-calendar'],
    ['Islam verstehen', '04-learning'],
    ['Mehr', '05-more'],
  ]) {
    await nav(label);
    await settle();
    await assertLightTheme();
    if (label === 'Islam verstehen') {
      await assertBrightHeroTitle('.reference-prayer-learning-hub h2', 'Learning');
    }
    await shot(name);
  }

  await nav('Start');
  await settle();
  const quranJourney = page.locator('.journey-card--quran').first();
  await quranJourney.waitFor({ state: 'visible', timeout: 10_000 });
  await quranJourney.click();
  await page.locator('.reference-reader-screen').waitFor({ state: 'visible', timeout: 15_000 });
  await settle();
  await assertBrightHeroTitle('.reference-reader-hero h2', 'Quran reader');
  await shot('06-quran-reader');
  await page.getByRole('button', { name: 'Zurück zum Quran' }).click();
  await page.locator('.reference-quran-screen').waitFor({ state: 'visible', timeout: 15_000 });
  await settle();
  await shot('07-quran-catalog');
  await returnHome();

  await captureSecondary('Dhikr', '.reference-dhikr-screen', '08-dhikr');
  await returnHome();
  await captureSecondary('Qibla', '.reference-qibla-screen', '09-qibla');
  await returnHome();
  await captureSecondary('Duas', '.reference-duas-screen', '10-duas');
  await returnHome();
  await captureSecondary('Meine Sammlung', '.reference-collections-screen', '11-collections');

  await returnHome();
  await nav('Mehr');
  await page.locator('.reference-profile-screen').waitFor({ state: 'visible', timeout: 15_000 });
  await settle();

  for (const [id, title, name] of [
    ['fasting', 'Fasten-Assistent', '12-fasting'],
    ['places', 'Islamische Orte', '13-places'],
  ]) {
    const button = page.locator('.reference-services-grid > button').filter({ hasText: title }).first();
    await button.waitFor({ state: 'visible', timeout: 10_000 });
    await button.scrollIntoViewIfNeeded();
    await button.click();
    const legacy = page.locator('.reference-legacy-screen');
    await legacy.waitFor({ state: 'visible', timeout: 15_000 });
    await legacy.locator('.reference-legacy-hero').first().scrollIntoViewIfNeeded();
    await settle();
    await assertLightTheme();
    const image = legacy.locator('.reference-legacy-hero img').first();
    const dimensions = await image.evaluate((node) => ({ width: node.naturalWidth, height: node.naturalHeight }));
    if (dimensions.width <= 0 || dimensions.height <= 0) throw new Error(`Light hero artwork failed to decode for ${id}.`);
    await shot(name);
    await legacy.locator('.reference-screen-header .icon-button').first().click();
    await page.locator('.reference-profile-screen').waitFor({ state: 'visible', timeout: 15_000 });
    await page.waitForTimeout(260);
  }
} finally {
  await context.close();
  await browser.close();
}

console.log('Light-theme premium reference screenshots captured at 390x844 with daily-detail and focal-title contrast assertions.');