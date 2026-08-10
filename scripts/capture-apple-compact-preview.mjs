import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { devices, webkit } from 'playwright';

const outputDir = resolve(process.cwd(), 'artifacts/reference-preview');
const baseUrl = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
const appUrl = new URL(baseUrl);
appUrl.searchParams.set('preview', '1');

await mkdir(outputDir, { recursive: true });

const browser = await webkit.launch({ headless: true });
const modernIphone = devices['iPhone 14 Pro'];
const compactIphone = {
  ...modernIphone,
  viewport: { width: 375, height: 667 },
  screen: { width: 375, height: 667 },
  deviceScaleFactor: 2,
};

async function createContext({ dismissInstall = true } = {}) {
  const context = await browser.newContext({
    ...compactIphone,
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    geolocation: { latitude: 52.52, longitude: 13.405 },
    permissions: ['geolocation'],
    reducedMotion: 'reduce',
    colorScheme: 'dark',
  });

  await context.addInitScript(({ dismiss }) => {
    localStorage.setItem('nur_onboarding_complete', 'true');
    localStorage.setItem('nur_theme', 'dark');
    if (dismiss) localStorage.setItem('nur_install_prompt_dismissed', 'true');
    else localStorage.removeItem('nur_install_prompt_dismissed');
  }, { dismiss: dismissInstall });

  return context;
}

async function settle(page, delay = 220) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(delay);
}

async function waitForHome(page) {
  await page.locator('.premium-home--v2').waitFor({ state: 'visible', timeout: 15_000 });
  await page.locator('.bottom-nav').waitFor({ state: 'visible', timeout: 15_000 });
  await page.waitForFunction(() => {
    const entry = document.querySelector('.app-entry');
    const home = document.querySelector('.premium-home--v2');
    if (!entry || !home) return false;
    return Number.parseFloat(getComputedStyle(entry).opacity) > .98
      && Number.parseFloat(getComputedStyle(home).opacity) > .98;
  }, null, { timeout: 10_000 });
  await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
  await settle(page);
}

async function assertCompactShell(page, label) {
  const state = await page.evaluate(() => {
    const nav = document.querySelector('.bottom-nav');
    const navRect = nav?.getBoundingClientRect();
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    return {
      viewportWidth,
      viewportHeight,
      scrollWidth: document.documentElement.scrollWidth,
      navTop: navRect?.top ?? -1,
      navBottom: navRect?.bottom ?? -1,
    };
  });

  if (state.viewportWidth > 376 || state.viewportHeight > 668) {
    throw new Error(`${label}: compact iPhone viewport was not applied: ${JSON.stringify(state)}.`);
  }
  if (state.scrollWidth > state.viewportWidth + 1) {
    throw new Error(`${label}: horizontal overflow on compact iPhone: ${JSON.stringify(state)}.`);
  }
  if (state.navTop < 0 || state.navBottom > state.viewportHeight + 1) {
    throw new Error(`${label}: bottom navigation leaves compact iPhone viewport: ${JSON.stringify(state)}.`);
  }
}

function attachDiagnostics(page, label) {
  page.on('pageerror', (error) => console.error(`[${label}] page error:`, error));
  page.on('console', (message) => {
    if (message.type() === 'error') console.error(`[${label}] console error:`, message.text());
  });
  page.on('requestfailed', (request) => console.error(`[${label}] request failed:`, request.url(), request.failure()?.errorText ?? 'unknown'));
}

async function shot(page, name) {
  await page.screenshot({
    path: resolve(outputDir, `${name}-375x667-webkit.png`),
    animations: 'disabled',
  });
}

try {
  const homeContext = await createContext();
  const homePage = await homeContext.newPage();
  attachDiagnostics(homePage, 'apple-compact-home');
  await homePage.goto(appUrl.toString(), { waitUntil: 'domcontentloaded' });
  await waitForHome(homePage);
  await assertCompactShell(homePage, 'Home');
  await shot(homePage, 'apple-08-compact-home');
  await homeContext.close();

  const installContext = await createContext({ dismissInstall: false });
  const installPage = await installContext.newPage();
  attachDiagnostics(installPage, 'apple-compact-install');
  await installPage.goto(appUrl.toString(), { waitUntil: 'domcontentloaded' });
  await waitForHome(installPage);

  const prompt = installPage.locator('.reference-install-prompt');
  await prompt.waitFor({ state: 'visible', timeout: 8_000 });
  await installPage.getByRole('button', { name: 'Anleitung' }).click();
  const lastRow = installPage.getByText('„Zum Home-Bildschirm“ wählen');
  await lastRow.waitFor({ state: 'visible', timeout: 5_000 });
  await installPage.waitForTimeout(420);

  const guideState = await prompt.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      viewportWidth,
      viewportHeight,
      scrollWidth: document.documentElement.scrollWidth,
    };
  });
  if (guideState.top < 0 || guideState.bottom > guideState.viewportHeight + 1) {
    throw new Error(`Expanded install card leaves compact iPhone height: ${JSON.stringify(guideState)}.`);
  }
  if (guideState.left < 0 || guideState.right > guideState.viewportWidth + 1 || guideState.scrollWidth > guideState.viewportWidth + 1) {
    throw new Error(`Expanded install card overflows compact iPhone width: ${JSON.stringify(guideState)}.`);
  }
  await shot(installPage, 'apple-09-compact-install-guide');
  await installContext.close();

  const notesContext = await createContext();
  const notesPage = await notesContext.newPage();
  attachDiagnostics(notesPage, 'apple-compact-notes');
  await notesPage.goto(appUrl.toString(), { waitUntil: 'domcontentloaded' });
  await waitForHome(notesPage);

  const moreNav = notesPage.locator('.bottom-nav__item').filter({ hasText: 'Mehr' }).first();
  await moreNav.click();
  await notesPage.locator('.reference-profile-screen').waitFor({ state: 'visible', timeout: 10_000 });
  const accountEntry = notesPage.locator('button.reference-account-entry').first();
  await accountEntry.scrollIntoViewIfNeeded();
  await accountEntry.click();
  await notesPage.locator('.reference-account-screen').waitFor({ state: 'visible', timeout: 10_000 });
  await notesPage.locator('.reference-account-screen .reference-screen-header .icon-button').first().click();
  await notesPage.locator('.reference-profile-screen').waitFor({ state: 'visible', timeout: 10_000 });
  const notesEntry = notesPage.locator('.reference-profile-row').filter({ hasText: 'Notizen' }).first();
  await notesEntry.scrollIntoViewIfNeeded();
  await notesEntry.click();
  await notesPage.locator('.reference-notes-screen').waitFor({ state: 'visible', timeout: 10_000 });
  const newNote = notesPage.getByRole('button', { name: 'Neue Notiz schreiben' });
  await newNote.scrollIntoViewIfNeeded();
  await newNote.click();

  const editor = notesPage.locator('.reference-note-editor');
  await editor.waitFor({ state: 'visible', timeout: 5_000 });
  await editor.scrollIntoViewIfNeeded();
  const titleInput = notesPage.getByRole('textbox', { name: 'Titel der Notiz' });
  await titleInput.focus();
  await notesPage.waitForTimeout(180);

  const editorState = await titleInput.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      fontSize: Number.parseFloat(getComputedStyle(node).fontSize),
      viewportWidth,
      viewportHeight,
      scrollWidth: document.documentElement.scrollWidth,
    };
  });
  if (editorState.fontSize < 16) {
    throw new Error(`Notes title input can trigger iOS focus zoom: ${JSON.stringify(editorState)}.`);
  }
  if (editorState.top < 0 || editorState.bottom > editorState.viewportHeight + 1) {
    throw new Error(`Focused Notes title is outside compact iPhone viewport: ${JSON.stringify(editorState)}.`);
  }
  if (editorState.left < 0 || editorState.right > editorState.viewportWidth + 1 || editorState.scrollWidth > editorState.viewportWidth + 1) {
    throw new Error(`Notes editor overflows compact iPhone width: ${JSON.stringify(editorState)}.`);
  }
  await shot(notesPage, 'apple-10-compact-notes-editor');
  await notesContext.close();
} finally {
  await browser.close();
}

console.log('Compact Apple WebKit QA captured: 375x667 Home, expanded iOS install guide and focused Notes editor fit without horizontal overflow, viewport clipping or iOS focus-zoom risk.');
