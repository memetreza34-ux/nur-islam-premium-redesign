import fs from 'node:fs';

const service = fs.readFileSync(new URL('../src/services/installPromptService.ts', import.meta.url), 'utf8');
const prompt = fs.readFileSync(new URL('../src/shared/InstallAppPrompt.tsx', import.meta.url), 'utf8');
const main = fs.readFileSync(new URL('../src/app/main.tsx', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const manifest = JSON.parse(fs.readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'));

const checks = [
  [service.includes("window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)"), 'global capture listens for beforeinstallprompt'],
  [service.includes('event.preventDefault()'), 'global capture prevents browser auto-prompt'],
  [service.includes('pendingInstallPrompt = event as BeforeInstallPromptEvent'), 'global capture stores the pending prompt'],
  [service.includes('subscribeInstallPrompt'), 'install prompt service exposes subscription'],
  [prompt.includes('subscribeInstallPrompt((event) =>'), 'InstallAppPrompt consumes the captured prompt'],
  [prompt.includes('clearPendingInstallPrompt();'), 'InstallAppPrompt clears consumed/dismissed prompt state'],
  [!prompt.includes("window.addEventListener('beforeinstallprompt'"), 'InstallAppPrompt no longer relies on a late component listener'],
  [main.includes("import { startInstallPromptCapture } from '../services/installPromptService';"), 'main imports early prompt capture'],
  [main.indexOf('const stopInstallPromptCapture = startInstallPromptCapture();') < main.indexOf('ReactDOM.createRoot'), 'prompt capture starts before React render'],
  [main.includes('stopInstallPromptCapture();'), 'prompt capture is cleaned up on pagehide'],
  [prompt.includes('function isIosDevice()'), 'InstallAppPrompt keeps explicit iPhone/iPad detection'],
  [prompt.includes("navigatorWithPlatform.platform === 'MacIntel'"), 'InstallAppPrompt recognizes modern iPadOS desktop-style user agents'],
  [prompt.includes('standalone?: boolean') && prompt.includes('.standalone === true'), 'InstallAppPrompt recognizes iOS standalone mode'],
  [prompt.includes("revealWhenReady('ios')"), 'InstallAppPrompt exposes the iOS-specific install route'],
  [prompt.includes('Teilen antippen'), 'iOS install help explains the Share action'],
  [prompt.includes('„Zum Home-Bildschirm“ wählen'), 'iOS install help explains Add to Home Screen'],
  [html.includes('viewport-fit=cover'), 'HTML keeps edge-to-edge iPhone safe-area support'],
  [html.includes('name="apple-mobile-web-app-capable" content="yes"'), 'HTML enables Apple standalone web-app mode'],
  [html.includes('name="apple-mobile-web-app-status-bar-style" content="black-translucent"'), 'HTML keeps the Apple translucent status-bar treatment'],
  [html.includes('name="apple-mobile-web-app-title" content="Nur Islam"'), 'HTML keeps the Apple Home Screen title'],
  [html.includes('name="format-detection" content="telephone=no"'), 'HTML prevents Safari from styling unrelated numbers as phone links'],
  [html.includes('rel="apple-touch-icon"'), 'HTML exposes the dedicated Apple touch icon'],
  [manifest.display === 'standalone', 'manifest keeps standalone display mode'],
  [manifest.orientation === 'portrait-primary', 'manifest keeps the portrait-first mobile composition'],
  [Array.isArray(manifest.icons) && manifest.icons.some((icon) => icon.purpose === 'maskable'), 'manifest keeps a maskable app icon'],
];

const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);
if (failures.length) {
  console.error('Install prompt check failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Install prompt check passed, including iPhone/iPad detection, Apple PWA metadata, standalone suppression and Add-to-Home-Screen guidance.');
