import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const outputDir = resolve(process.cwd(), 'artifacts/reference-preview');
const baseUrl = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/nur-islam-premium-redesign/';

function withPreviewMode(mode) {
  const url = new URL(baseUrl);
  url.searchParams.delete('preview');
  url.searchParams.delete('onboarding');
  url.searchParams.set(mode === 'app' ? 'preview' : 'onboarding', '1');
  return url.toString();
}

const appUrl = withPreviewMode('app');
const onboardingUrl = withPreviewMode('onboarding');

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function createContext() {
  return browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    geolocation: { latitude: 52.52, longitude: 13.405 },
    permissions: ['geolocation'],
    reducedMotion: 'reduce',
  });
}

async function waitForStableUi(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(550);
}

async function capture(page, name, { fullPage = false } = {}) {
  await page.screenshot({
    path: resolve(outputDir, `${name}-390x844.png`),
    fullPage,
    animations: 'disabled',
  });
}

async function clickNav(page, label) {
  const item = page.locator('.bottom-nav__item').filter({ hasText: label }).first();
  await item.waitFor({ state: 'visible' });
  await item.click();
  await page.waitForTimeout(350);
}

async function captureSecondary(page, { trigger, screen, name }) {
  const button = page.locator('button').filter({ hasText: trigger }).first();
  await button.waitFor({ state: 'visible', timeout: 10_000 });
  await button.click();
  await page.locator(screen).waitFor({ state: 'visible', timeout: 15_000 });
  await waitForStableUi(page);
  await capture(page, name);
}

async function returnHome(page) {
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
  await waitForStableUi(page);
}

async function attachDiagnostics(page, label) {
  page.on('pageerror', (error) => console.error(`[${label}] page error:`, error));
  page.on('console', (message) => {
    if (message.type() === 'error') console.error(`[${label}] console error:`, message.text());
  });
  page.on('requestfailed', (request) => console.error(`[${label}] request failed:`, request.url(), request.failure()?.errorText ?? 'unknown'));
}

try {
  const appContext = await createContext();
  const page = await appContext.newPage();
  await attachDiagnostics(page, 'app');
  await page.goto(appUrl, { waitUntil: 'domcontentloaded' });

  await page.locator('.bottom-nav').waitFor({ state: 'visible', timeout: 15_000 });
  await waitForStableUi(page);
  await capture(page, '01-home');
  await capture(page, '01-home-full', { fullPage: true });

  const destinations = [
    ['Gebete', '02-prayer'],
    ['Kalender', '03-calendar'],
    ['Islam verstehen', '04-learning'],
    ['Mehr', '05-more'],
  ];

  for (const [label, filename] of destinations) {
    await clickNav(page, label);
    await waitForStableUi(page);
    await capture(page, filename);
  }

  await clickNav(page, 'Start');
  await waitForStableUi(page);
  await capture(page, '06-home-return');

  // First-use Quran must open the real zero-progress start at Al-Faatiha, not a synthetic resume state.
  const quranJourney = page.locator('.journey-card--quran').first();
  await quranJourney.waitFor({ state: 'visible' });
  await quranJourney.click();
  await page.locator('.reference-reader-screen').waitFor({ state: 'visible', timeout: 15_000 });
  await waitForStableUi(page);
  await capture(page, '07-quran-reader');

  const readerBack = page.getByRole('button', { name: 'Zurück zum Quran' });
  await readerBack.click();
  await page.locator('.reference-quran-screen').waitFor({ state: 'visible', timeout: 15_000 });
  await waitForStableUi(page);
  await capture(page, '08-quran-catalog');
  await returnHome(page);

  await captureSecondary(page, { trigger: 'Dhikr', screen: '.reference-dhikr-screen', name: '09-dhikr' });
  await returnHome(page);

  await captureSecondary(page, { trigger: 'Qibla', screen: '.reference-qibla-screen', name: '10-qibla' });
  await returnHome(page);

  await captureSecondary(page, { trigger: 'Duas', screen: '.reference-duas-screen', name: '11-duas' });
  await returnHome(page);

  await captureSecondary(page, { trigger: '99 Namen Allahs', screen: '.reference-names-screen', name: '12-names' });
  await returnHome(page);

  await captureSecondary(page, { trigger: 'Nur Assistent', screen: '.reference-assistant-screen', name: '13-assistant' });
  await returnHome(page);

  await captureSecondary(page, { trigger: 'Meine Sammlung', screen: '.reference-collections-screen', name: '14-collections' });
  await returnHome(page);
  await capture(page, '15-home-after-secondary');

  await appContext.close();

  const onboardingContext = await createContext();
  const onboardingPage = await onboardingContext.newPage();
  await attachDiagnostics(onboardingPage, 'onboarding');
  await onboardingPage.goto(onboardingUrl, { waitUntil: 'domcontentloaded' });
  await onboardingPage.locator('.reference-onboarding').waitFor({ state: 'visible', timeout: 15_000 });
  await waitForStableUi(onboardingPage);
  await capture(onboardingPage, '16-onboarding');
  await onboardingContext.close();
} finally {
  await browser.close();
}

console.log(`Reference preview screenshots written to ${outputDir}`);
