import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const outputDir = resolve(process.cwd(), 'artifacts/reference-preview');
const baseUrl = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/nur-islam-premium-redesign/';

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function createContext({ completedOnboarding }) {
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

  await context.addInitScript(({ completed }) => {
    localStorage.setItem('nur_theme', 'dark');
    localStorage.setItem('nur_install_prompt_dismissed', 'true');
    if (completed) localStorage.setItem('nur_onboarding_complete', 'true');
    else localStorage.removeItem('nur_onboarding_complete');
  }, { completed: completedOnboarding });

  return context;
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

try {
  const appContext = await createContext({ completedOnboarding: true });
  const page = await appContext.newPage();
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

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
  await appContext.close();

  const onboardingContext = await createContext({ completedOnboarding: false });
  const onboardingPage = await onboardingContext.newPage();
  await onboardingPage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await onboardingPage.locator('.reference-onboarding').waitFor({ state: 'visible', timeout: 15_000 });
  await waitForStableUi(onboardingPage);
  await capture(onboardingPage, '07-onboarding');
  await onboardingContext.close();
} finally {
  await browser.close();
}

console.log(`Reference preview screenshots written to ${outputDir}`);
