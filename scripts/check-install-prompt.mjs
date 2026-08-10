import fs from 'node:fs';

const service = fs.readFileSync(new URL('../src/services/installPromptService.ts', import.meta.url), 'utf8');
const prompt = fs.readFileSync(new URL('../src/shared/InstallAppPrompt.tsx', import.meta.url), 'utf8');
const main = fs.readFileSync(new URL('../src/app/main.tsx', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const manifest = JSON.parse(fs.readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'));

function pngSize(relativePath) {
  const buffer = fs.readFileSync(new URL(relativePath, import.meta.url));
  const pngSignature = '89504e470d0a1a0a';
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== pngSignature) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function hasManifestIcon(src, sizes, purpose) {
  return Array.isArray(manifest.icons) && manifest.icons.some((icon) => (
    icon.src === src
    && icon.sizes === sizes
    && icon.type === 'image/png'
    && icon.purpose === purpose
  ));
}

const icon192 = pngSize('../public/nur-app-icon-192.png');
const icon512 = pngSize('../public/nur-app-icon-512.png');

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
  [hasManifestIcon('./nur-app-icon-192.png', '192x192', 'any'), 'manifest keeps the 192x192 PNG install icon'],
  [hasManifestIcon('./nur-app-icon-512.png', '512x512', 'any'), 'manifest keeps the 512x512 PNG install icon'],
  [hasManifestIcon('./nur-app-icon-512.png', '512x512', 'maskable'), 'manifest keeps the 512x512 maskable PNG icon'],
  [icon192?.width === 192 && icon192?.height === 192, 'the 192 PNG file has real 192x192 dimensions'],
  [icon512?.width === 512 && icon512?.height === 512, 'the 512 PNG file has real 512x512 dimensions'],
];

const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);
if (failures.length) {
  console.error('Install prompt check failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Install prompt check passed, including iPhone/iPad detection, Apple PWA metadata, exact 192/512 raster icons, standalone suppression and Add-to-Home-Screen guidance.');
