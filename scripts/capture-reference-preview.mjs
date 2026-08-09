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

async function createContext({ width = 390, height = 844, reducedMotion = 'reduce' } = {}) {
  return browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    geolocation: { latitude: 52.52, longitude: 13.405 },
    permissions: ['geolocation'],
    reducedMotion,
  });
}

async function waitForStableUi(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(550);
}

async function capture(page, name, { fullPage = false, suffix = '390x844', animations = 'disabled' } = {}) {
  await page.screenshot({
    path: resolve(outputDir, `${name}-${suffix}.png`),
    fullPage,
    animations,
  });
}

async function captureAt(page, selector, name, options = {}) {
  const target = page.locator(selector).first();
  await target.waitFor({ state: 'visible', timeout: 10_000 });
  await target.scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
  await capture(page, name, options);
}

async function clickNav(page, label) {
  const item = page.locator('.bottom-nav__item').filter({ hasText: label }).first();
  await item.waitFor({ state: 'visible' });
  await item.click();
  await page.waitForTimeout(350);
}

async function captureSecondary(page, { trigger, screen, name, suffix = '390x844' }) {
  const button = page.locator('button').filter({ hasText: trigger }).first();
  await button.waitFor({ state: 'visible', timeout: 10_000 });
  await button.click();
  await page.locator(screen).waitFor({ state: 'visible', timeout: 15_000 });
  await waitForStableUi(page);
  await capture(page, name, { suffix });
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

  await captureAt(page, '.journey-grid', '01a-home-journey');
  await captureAt(page, '.quick-grid--v2', '01b-home-quick-actions');
  await captureAt(page, '.continue-card--v2', '01c-home-quran-continue');
  await captureAt(page, '.inspiration-grid--v2', '01d-home-inspiration');
  await captureAt(page, '.welcome-hero', '01e-home-return-top');

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

  await captureSecondary(page, { trigger: 'Moscheen', screen: '.reference-mosque-screen', name: '19-mosques' });

  await clickNav(page, 'Mehr');
  await waitForStableUi(page);
  const accountEntry = page.locator('button.reference-account-entry').first();
  await accountEntry.waitFor({ state: 'visible', timeout: 10_000 });
  await accountEntry.click();
  await page.locator('.reference-account-screen').waitFor({ state: 'visible', timeout: 15_000 });
  await waitForStableUi(page);
  await capture(page, '20-account');

  await page.locator('.reference-account-screen .reference-screen-header .icon-button').first().click();
  await page.locator('.reference-profile-screen').waitFor({ state: 'visible', timeout: 10_000 });
  const notesButton = page.locator('.reference-profile-row').filter({ hasText: 'Notizen' }).first();
  await notesButton.scrollIntoViewIfNeeded();
  await notesButton.click();
  await page.locator('.reference-notes-screen').waitFor({ state: 'visible', timeout: 15_000 });
  await waitForStableUi(page);
  await capture(page, '21-notes');
  await appContext.close();

  const splashContext = await createContext({ reducedMotion: 'no-preference' });
  const splashPage = await splashContext.newPage();
  await attachDiagnostics(splashPage, 'splash');
  await splashPage.goto(onboardingUrl, { waitUntil: 'domcontentloaded' });
  await splashPage.locator('.reference-splash__brand').waitFor({ state: 'attached', timeout: 5_000 });
  await splashPage.waitForTimeout(300);
  await capture(splashPage, '00-splash', { animations: 'allow' });
  await splashContext.close();

  const onboardingContext = await createContext();
  const onboardingPage = await onboardingContext.newPage();
  await attachDiagnostics(onboardingPage, 'onboarding');
  await onboardingPage.goto(onboardingUrl, { waitUntil: 'domcontentloaded' });
  await onboardingPage.locator('.reference-onboarding').waitFor({ state: 'visible', timeout: 15_000 });
  await waitForStableUi(onboardingPage);
  await capture(onboardingPage, '16-onboarding-1');
  const onboardingDots = onboardingPage.locator('.reference-onboarding__dots button');
  for (let slideIndex = 1; slideIndex < 3; slideIndex += 1) {
    await onboardingDots.nth(slideIndex).click();
    await onboardingPage.locator(`.reference-onboarding__visual--${slideIndex + 1}`).waitFor({ state: 'visible', timeout: 10_000 });
    await waitForStableUi(onboardingPage);
    await capture(onboardingPage, `${16 + slideIndex}-onboarding-${slideIndex + 1}`);
  }
  await onboardingContext.close();

  const narrowContext = await createContext({ width: 340, height: 740 });
  const narrowPage = await narrowContext.newPage();
  await attachDiagnostics(narrowPage, 'narrow-app');
  await narrowPage.goto(appUrl, { waitUntil: 'domcontentloaded' });
  await narrowPage.locator('.bottom-nav').waitFor({ state: 'visible', timeout: 15_000 });
  await waitForStableUi(narrowPage);
  await capture(narrowPage, '22-narrow-home', { suffix: '340x740' });

  await clickNav(narrowPage, 'Mehr');
  await waitForStableUi(narrowPage);
  await capture(narrowPage, '23-narrow-more', { suffix: '340x740' });
  await clickNav(narrowPage, 'Start');
  await waitForStableUi(narrowPage);

  await captureSecondary(narrowPage, { trigger: 'Qibla', screen: '.reference-qibla-screen', name: '24-narrow-qibla', suffix: '340x740' });
  await returnHome(narrowPage);

  const narrowQuranJourney = narrowPage.locator('.journey-card--quran').first();
  await narrowQuranJourney.waitFor({ state: 'visible' });
  await narrowQuranJourney.click();
  await narrowPage.locator('.reference-reader-screen').waitFor({ state: 'visible', timeout: 15_000 });
  await narrowPage.getByRole('button', { name: 'Zurück zum Quran' }).click();
  await narrowPage.locator('.reference-quran-screen').waitFor({ state: 'visible', timeout: 15_000 });
  await waitForStableUi(narrowPage);
  await capture(narrowPage, '25-narrow-quran-catalog', { suffix: '340x740' });
  await narrowContext.close();

  const narrowOnboardingContext = await createContext({ width: 340, height: 740 });
  const narrowOnboardingPage = await narrowOnboardingContext.newPage();
  await attachDiagnostics(narrowOnboardingPage, 'narrow-onboarding');
  await narrowOnboardingPage.goto(onboardingUrl, { waitUntil: 'domcontentloaded' });
  await narrowOnboardingPage.locator('.reference-onboarding').waitFor({ state: 'visible', timeout: 15_000 });
  const narrowDots = narrowOnboardingPage.locator('.reference-onboarding__dots button');
  await narrowDots.nth(2).click();
  await narrowOnboardingPage.locator('.reference-onboarding__permissions').waitFor({ state: 'visible', timeout: 10_000 });
  await narrowOnboardingPage.locator('.reference-onboarding__permissions').scrollIntoViewIfNeeded();
  await waitForStableUi(narrowOnboardingPage);
  await capture(narrowOnboardingPage, '26-narrow-onboarding-final', { suffix: '340x740' });
  await narrowOnboardingContext.close();
} finally {
  await browser.close();
}

console.log(`Reference preview screenshots written to ${outputDir}`);
