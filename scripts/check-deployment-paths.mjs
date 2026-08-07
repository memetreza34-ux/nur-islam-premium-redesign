import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const vite = await readFile(resolve(root, 'vite.config.ts'), 'utf8');
const paths = await readFile(resolve(root, 'src/appPaths.ts'), 'utf8');
const visuals = await readFile(resolve(root, 'src/PremiumVisuals.tsx'), 'utf8');
const artwork = await readFile(resolve(root, 'src/ReferenceArtworkHost.tsx'), 'utf8');
const main = await readFile(resolve(root, 'src/main.tsx'), 'utf8');
const pwa = await readFile(resolve(root, 'src/pwa.ts'), 'utf8');
const worker = await readFile(resolve(root, 'public/sw.js'), 'utf8');
const manifest = JSON.parse(await readFile(resolve(root, 'public/manifest.webmanifest'), 'utf8'));
const html = await readFile(resolve(root, 'index.html'), 'utf8');

const viteRequirements = [
  "command === 'build' ? '/nur-islam-premium-redesign/' : '/'",
  'process.env.VITE_BASE_PATH',
];
for (const requirement of viteRequirements) {
  if (!vite.includes(requirement)) throw new Error(`Vite base path is missing: ${requirement}`);
}

for (const requirement of [
  'import.meta.env.BASE_URL',
  'resolveAppPath',
  'versionAppPath',
  "path.replace(/^\\.\\//, '').replace(/^\\/+/, '')",
]) {
  if (!paths.includes(requirement)) throw new Error(`App path resolver is incomplete: ${requirement}`);
}

if (!visuals.includes("import { versionAppPath } from './appPaths';") || !visuals.includes('return versionAppPath(src, PREMIUM_ASSET_VERSION);')) {
  throw new Error('PremiumImage does not resolve assets through the deployment base path.');
}
if (!artwork.includes("import { versionAppPath } from './appPaths';") || !artwork.includes('versionAppPath(`premium-assets/high-res-objects/${name}-v2.webp`, VISUAL_VERSION)')) {
  throw new Error('ReferenceArtworkHost still uses root-absolute premium asset paths.');
}
if (artwork.includes('=> `/premium-assets/')) {
  throw new Error('ReferenceArtworkHost contains an obsolete root-absolute asset helper.');
}

for (const requirement of [
  "versionAppPath(`premium-assets/high-res-objects/${name}`, VISUAL_VERSION)",
  "resolveAppPath('manifest.webmanifest')",
]) {
  if (!main.includes(requirement)) throw new Error(`Main preload path is not deployment-safe: ${requirement}`);
}

for (const requirement of [
  "resolveAppPath('sw.js')",
  'scope: import.meta.env.BASE_URL',
  "SERVICE_WORKER_VERSION = '10-20260807-base-path'",
]) {
  if (!pwa.includes(requirement)) throw new Error(`PWA registration is not deployment-safe: ${requirement}`);
}

for (const requirement of [
  "new URL(path.replace(/^\\/+/, ''), self.registration.scope)",
  "const INDEX_URL = scoped('index.html')",
  "const PREMIUM_PATHNAME = new URL('premium-assets/', self.registration.scope).pathname",
  "scoped('data/quran/surahs.json')",
  'cache.put(INDEX_URL, copy)',
  'caches.match(INDEX_URL)',
]) {
  if (!worker.includes(requirement)) throw new Error(`Service worker scope handling is incomplete: ${requirement}`);
}

if (worker.includes("'/index.html'") || worker.includes("'/premium-assets/") || worker.includes("'/data/quran/")) {
  throw new Error('Service worker still contains root-absolute app-shell paths.');
}

if (manifest.id !== './' || manifest.start_url !== './' || manifest.scope !== './') {
  throw new Error('PWA manifest must keep id, start_url, and scope relative to its deployment location.');
}
if (!Array.isArray(manifest.icons) || manifest.icons.some((icon) => icon.src !== './nur-app-icon.svg')) {
  throw new Error('PWA manifest icons are not relative to the deployment scope.');
}

for (const requirement of [
  'href="%BASE_URL%manifest.webmanifest"',
  'href="%BASE_URL%nur-app-icon.svg"',
  'href="%BASE_URL%premium-assets/high-res-objects/nur-logo-emblem.png"',
]) {
  if (!html.includes(requirement)) throw new Error(`HTML base token is missing: ${requirement}`);
}

console.log('Deployment paths verified: GitHub Pages base, manifest scope, premium images, decorative artwork, preloads, service worker registration, and scoped offline cache.');
