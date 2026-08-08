import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const vite = await readFile(resolve(root, 'vite.config.ts'), 'utf8');
const paths = await readFile(resolve(root, 'src/appPaths.ts'), 'utf8');
const visuals = await readFile(resolve(root, 'src/PremiumVisuals.tsx'), 'utf8');
const legacyFeatures = await readFile(resolve(root, 'src/LegacyFeatureScreens.tsx'), 'utf8');
const main = await readFile(resolve(root, 'src/main.tsx'), 'utf8');
const pwa = await readFile(resolve(root, 'src/pwa.ts'), 'utf8');
const worker = await readFile(resolve(root, 'public/sw.js'), 'utf8');
const appIcon = await readFile(resolve(root, 'public/nur-app-icon.svg'), 'utf8');
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
  'PREMIUM_ASSET_ALIASES',
  "path.replace(/^\\.\\//, '').replace(/^\\/+/, '')",
]) {
  if (!paths.includes(requirement)) throw new Error(`App path resolver is incomplete: ${requirement}`);
}

const requiredAssetAliases = [
  "'nur-logo-emblem.webp': 'nur-logo-emblem-v2.webp'",
  "'mosque-gold.webp': 'mosque-gold-v2.webp'",
  "'quran-closed.webp': 'quran-closed-v2.webp'",
  "'tasbih.webp': 'tasbih-v2.webp'",
  "'qibla-compass.webp': 'qibla-compass-v2.webp'",
  "'kaaba.webp': 'kaaba-v2.webp'",
];
for (const alias of requiredAssetAliases) {
  if (!paths.includes(alias)) throw new Error(`Premium asset alias is missing: ${alias}`);
}

if (!visuals.includes("import { versionAppPath } from './appPaths';") || !visuals.includes('return versionAppPath(src, PREMIUM_ASSET_VERSION);')) {
  throw new Error('PremiumImage does not resolve assets through the deployment base path.');
}
if (!visuals.includes("const PREMIUM_ASSET_VERSION = '20260808-release-hardening';")) {
  throw new Error('PremiumImage is not pinned to the current release asset version.');
}

for (const requirement of [
  "import { versionAppPath } from './appPaths';",
  "const VISUAL_VERSION = '20260808-release-hardening';",
  'const visual = (path: string) => versionAppPath(path, VISUAL_VERSION);',
]) {
  if (!legacyFeatures.includes(requirement)) throw new Error(`Legacy hero assets are not deployment-safe: ${requirement}`);
}
if (legacyFeatures.includes("const VISUAL_REVISION = '8'") || legacyFeatures.includes('`${path}?v=${VISUAL_REVISION}`')) {
  throw new Error('Legacy feature heroes still use the obsolete independent visual revision.');
}

if (main.includes('ReferenceArtworkHost')) {
  throw new Error('Main still mounts the obsolete fixed artwork host.');
}

for (const requirement of [
  "versionAppPath(`premium-assets/high-res-objects/${name}`, VISUAL_VERSION)",
  "const VISUAL_VERSION = '20260808-release-hardening';",
  "resolveAppPath('manifest.webmanifest')",
]) {
  if (!main.includes(requirement)) throw new Error(`Main preload path is not deployment-safe: ${requirement}`);
}

for (const requirement of [
  "resolveAppPath('sw.js')",
  'scope: import.meta.env.BASE_URL',
  'updateViaCache: \'none\'',
]) {
  if (!pwa.includes(requirement)) throw new Error(`PWA registration is not deployment-safe: ${requirement}`);
}

// The registration version has to match the worker's cache name, otherwise a
// deployed worker is never picked up. Derived from the worker rather than
// written out here: a hard-coded number has to be edited on every bump, and
// the one time that was forgotten the two silently diverged.
const workerCache = worker.match(/const CACHE_NAME = `nur-islam-premium-v(\d+)-\$\{VISUAL_VERSION\}`/);
const workerVisual = worker.match(/const VISUAL_VERSION = '([^']+)'/);
if (!workerCache || !workerVisual) {
  throw new Error('Cannot read the service worker cache version; the naming scheme changed.');
}
const expectedRegistrationVersion = `${workerCache[1]}-${workerVisual[1]}`;
if (!pwa.includes(`SERVICE_WORKER_VERSION = '${expectedRegistrationVersion}'`)) {
  throw new Error(`PWA registration version must match the worker cache: expected '${expectedRegistrationVersion}'.`);
}

for (const requirement of [
  "new URL(path.replace(/^\\/+/, ''), self.registration.scope)",
  "const INDEX_URL = scoped('index.html')",
  "const PREMIUM_PATHNAME = new URL('premium-assets/', self.registration.scope).pathname",
  "scoped('premium-assets/high-res-objects/nur-logo-emblem.png')",
  "scoped('data/quran/surahs.json')",
  'cache.put(INDEX_URL, copy)',
  'caches.match(INDEX_URL)',
  `nur-islam-premium-v${workerCache[1]}`,
]) {
  if (!worker.includes(requirement)) throw new Error(`Service worker scope handling is incomplete: ${requirement}`);
}

if (worker.includes("'/index.html'") || worker.includes("'/premium-assets/") || worker.includes("'/data/quran/")) {
  throw new Error('Service worker still contains root-absolute app-shell paths.');
}

for (const color of ['#042a21', '#001b16', '#00120f', '#e2bf77', '#f2d79a', '#fff8ea']) {
  if (!appIcon.includes(color)) throw new Error(`PWA SVG app icon is missing reference palette color: ${color}`);
}
if (!appIcon.includes('<title id="title">Nur Islam</title>') || !appIcon.includes('Halbmond und Stern')) {
  throw new Error('PWA SVG app icon must keep the Nur Islam identity metadata.');
}

if (manifest.id !== './' || manifest.start_url !== './' || manifest.scope !== './') {
  throw new Error('PWA manifest must keep id, start_url, and scope relative to its deployment location.');
}
if (manifest.background_color !== '#00120f' || manifest.theme_color !== '#001b16') {
  throw new Error('PWA manifest colors must match the dark reference palette.');
}
if (!Array.isArray(manifest.icons) || manifest.icons.some((icon) => icon.src !== './nur-app-icon.svg')) {
  throw new Error('PWA manifest icons are not relative to the deployment scope.');
}

for (const requirement of [
  'meta name="theme-color" content="#001b16"',
  'href="%BASE_URL%manifest.webmanifest"',
  'href="%BASE_URL%nur-app-icon.svg"',
  'href="%BASE_URL%premium-assets/high-res-objects/nur-logo-emblem.png"',
]) {
  if (!html.includes(requirement)) throw new Error(`HTML reference/deployment token is missing: ${requirement}`);
}

console.log(`Deployment paths verified: GitHub Pages base, matching v${workerCache[1]} service worker registration, cached reference Apple touch icon, exact SVG reference palette, reference PWA colors, shared visual version for core and legacy heroes, legacy-to-v2 premium aliases, integrated screen artwork, preloads, manifest scope, and scoped offline cache.`);
