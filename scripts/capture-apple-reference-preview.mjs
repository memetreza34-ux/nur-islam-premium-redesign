import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { devices, webkit } from 'playwright';

const outputDir = resolve(process.cwd(), 'artifacts/reference-preview');
const baseUrl = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const appUrl = new URL(baseUrl);
appUrl.searchParams.set('preview', '1');

await mkdir(outputDir, { recursive: true });
const browser = await webkit.launch({ headless: true });
const iphone = devices['iPhone 14 Pro'];

async function createIphoneContext({ theme = 'dark', dismissInstall = true, standalone = false } = {}) {
  const context = await browser.newContext({
    ...iphone,
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    geolocation: { latitude: 52.52, longitude: 13.405 },
    permissions: ['geolocation'],
    reducedMotion: 'reduce',
    colorScheme: theme === 'light' ? 'light' : 'dark',
  });

  await context.addInitScript(({ selectedTheme, dismiss, standaloneMode }) => {
    localStorage.setItem('nur_onboarding_complete', 'true');
    localStorage.setItem('nur_theme', selectedTheme);
    if (dismiss) localStorage.setItem('nur_install_prompt_dismissed', 'true');
    else localStorage.removeItem('nur_install_prompt_dismissed');
    if (standaloneMode) {
      Object.defineProperty(window.navigator, 'standalone', { configurable: true, get: () => true });
    }
  }, { selectedTheme: theme, dismiss: dismissInstall, standaloneMode: standalone });

  return context;
}

async function settle(page, delay = 500) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(delay);
}

async function shot(page, name) {
  await page.screenshot({
    path: resolve(outputDir, `${name}-iphone14pro-webkit.png`),
    animations: 'disabled',
  });
}

function attachDiagnostics(page, label) {
  page.on('pageerror', (error) => console.error(`[${label}] page error:`, error));
  page.on('console', (message) => {
    if (message.type() === 'error') console.error(`[${label}] console error:`, message.text());
  });
  page.on('requestfailed', (request) => console.error(`[${label}] request failed:`, request.url(), request.failure()?.errorText ?? 'unknown'));
}

async function openHome(page) {
  const start = page.locator('.bottom-nav__item').filter({ hasText: 'Start' }).first();
  if (await start.isVisible().catch(() => false)) await start.click();
  else {
    const back = page.locator('.reference-screen-header .icon-button').first();
    if (await back.isVisible().catch(() => false)) await back.click();
  }
  await page.locator('.premium-home--v2').waitFor({ state: 'visible', timeout: 15_000 });
  await settle(page);
}

try {
  const darkContext = await createIphoneContext();
  const darkPage = await darkContext.newPage();
  attachDiagnostics(darkPage, 'apple-dark');
  await darkPage.goto(appUrl.toString(), { waitUntil: 'domcontentloaded' });
  await darkPage.locator('.bottom-nav').waitFor({ state: 'visible', timeout: 15_000 });
  await settle(darkPage);
  await shot(darkPage, 'apple-01-home');

  const ayahCard = darkPage.locator('button.reference-daily-card-button').filter({ hasText: 'Ayah im Fokus' }).first();
  await ayahCard.waitFor({ state: 'visible', timeout: 10_000 });
  await ayahCard.click();
  await darkPage.locator('.reference-ayah-hero').waitFor({ state: 'visible', timeout: 10_000 });
  await settle(darkPage);
  await shot(darkPage, 'apple-02-ayah-detail');
  await openHome(darkPage);

  const assistantButton = darkPage.locator('button').filter({ hasText: 'Nur Assistent' }).first();
  await assistantButton.waitFor({ state: 'visible', timeout: 10_000 });
  await assistantButton.click();
  await darkPage.locator('.reference-assistant-screen').waitFor({ state: 'visible', timeout: 10_000 });
  const assistantInput = darkPage.locator('.reference-assistant-input input').first();
  await assistantInput.focus();
  await darkPage.waitForTimeout(350);
  const inputFontSize = await assistantInput.evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize));
  if (inputFontSize < 16) throw new Error(`iOS input font size regressed below 16px: ${inputFontSize}px.`);
  const bottomNav = darkPage.locator('.bottom-nav').first();
  const navVisibility = await bottomNav.evaluate((node) => ({ opacity: getComputedStyle(node).opacity, visibility: getComputedStyle(node).visibility }));
  if (navVisibility.visibility !== 'hidden' && Number.parseFloat(navVisibility.opacity) > .01) {
    throw new Error(`Bottom navigation remains visible during iPhone input focus: ${JSON.stringify(navVisibility)}.`);
  }
  await shot(darkPage, 'apple-03-assistant-focus');
  await darkContext.close();

  const installContext = await createIphoneContext({ dismissInstall: false });
  const installPage = await installContext.newPage();
  attachDiagnostics(installPage, 'apple-install');
  await installPage.goto(appUrl.toString(), { waitUntil: 'domcontentloaded' });
  const installPrompt = installPage.locator('.reference-install-prompt');
  await installPrompt.waitFor({ state: 'visible', timeout: 8_000 });
  await shot(installPage, 'apple-04-install-prompt');
  await installPage.getByRole('button', { name: 'Anleitung' }).click();
  await installPage.getByText('„Zum Home-Bildschirm“ wählen').waitFor({ state: 'visible', timeout: 5_000 });
  await shot(installPage, 'apple-05-install-guide');
  await installContext.close();

  const standaloneContext = await createIphoneContext({ dismissInstall: false, standalone: true });
  const standalonePage = await standaloneContext.newPage();
  attachDiagnostics(standalonePage, 'apple-standalone');
  await standalonePage.goto(appUrl.toString(), { waitUntil: 'domcontentloaded' });
  await standalonePage.locator('.premium-home--v2').waitFor({ state: 'visible', timeout: 15_000 });
  await settle(standalonePage, 1800);
  if (await standalonePage.locator('.reference-install-prompt').isVisible().catch(() => false)) {
    throw new Error('Install prompt must stay hidden in iOS standalone mode.');
  }
  const standaloneClass = await standalonePage.locator('html').evaluate((node) => node.classList.contains('is-standalone'));
  if (!standaloneClass) throw new Error('iOS standalone mode did not reach the document state.');
  await shot(standalonePage, 'apple-06-standalone-home');
  await standaloneContext.close();

  const lightContext = await createIphoneContext({ theme: 'light' });
  const lightPage = await lightContext.newPage();
  attachDiagnostics(lightPage, 'apple-light');
  await lightPage.goto(appUrl.toString(), { waitUntil: 'domcontentloaded' });
  await lightPage.locator('.premium-home--v2').waitFor({ state: 'visible', timeout: 15_000 });
  await settle(lightPage);
  const resolvedTheme = await lightPage.locator('html').getAttribute('data-theme');
  if (resolvedTheme !== 'light') throw new Error(`iPhone WebKit light theme resolved as ${resolvedTheme ?? 'unset'}.`);
  await shot(lightPage, 'apple-07-light-home');
  await lightContext.close();
} finally {
  await browser.close();
}

console.log('Apple WebKit QA captured: iPhone Home, Ayah, focused Assistant, install flow, standalone mode and Light Theme.');
