import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const vite = await readFile(resolve(root, 'vite.config.ts'), 'utf8');
const paths = await readFile(resolve(root, 'src/app/appPaths.ts'), 'utf8');
const visuals = await readFile(resolve(root, 'src/shared/PremiumVisuals.tsx'), 'utf8');
// The hero paths live with the feature definitions, which moved into
// src/data/legacyFeatures.ts when the screens were split out of startup.
const legacyFeatures = await readFile(resolve(root, 'src/data/legacyFeatures.ts'), 'utf8');
const main = await readFile(resolve(root, 'src/app/main.tsx'), 'utf8');
const pwa = await readFile(resolve(root, 'src/app/pwa.ts'), 'utf8');
const worker = await readFile(resolve(root, 'public/sw.js'), 'utf8');
const appIcon = await readFile(resolve(root, 'public/nur-app-icon.svg'), 'utf8');
const manifest = JSON.parse(await readFile(resolve(root, 'public/manifest.webmanifest'), 'utf8'));
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const workflowNames = [
  'deploy-pages.yml',
  'e2e.yml',
  'home-reference-audit.yml',
  'redesign-check.yml',
  'reference-render-preview.yml',
];
const workflowEntries = await Promise.all(workflowNames.map(async (name) => [
  name,
  await readFile(resolve(root, `.github/workflows/${name}`), 'utf8'),
]));
const workflows = Object.fromEntries(workflowEntries);
const pagesWorkflow = workflows['deploy-pages.yml'];

const viteRequirements = [
  "command === 'build' ? '/nur-islam-premium-redesign/' : '/'",
  'process.env.VITE_BASE_PATH',
];
for (const requirement of viteRequirements) {
  if (!vite.includes(requirement)) throw new Error(`Vite base path is missing: ${requirement}`);
}

// CI actions are part of the release surface too. checkout/setup-node v7 use
// the supported Node 24 action runtime; older majors had begun emitting runtime
// deprecation warnings on GitHub-hosted runners. Keep all project workflows on
// the same maintained major instead of allowing individual files to drift.
for (const [name, workflow] of Object.entries(workflows)) {
  for (const requirement of ['actions/checkout@v7', 'actions/setup-node@v7']) {
    if (!workflow.includes(requirement)) throw new Error(`${name} is missing current CI runtime action: ${requirement}`);
  }
  if (workflow.includes('actions/checkout@v4') || workflow.includes('actions/setup-node@v4')) {
    throw new Error(`${name} still references deprecated v4 checkout/setup-node actions.`);
  }
}
for (const name of ['e2e.yml', 'reference-render-preview.yml']) {
  if (!workflows[name].includes('actions/upload-artifact@v7')) {
    throw new Error(`${name} must use the current upload-artifact v7 runtime.`);
  }
}

// GitHub Pages is a real release surface, not a feature-branch preview. Keep
// both the trigger and the strict release gate source-controlled so a later
// workflow edit cannot silently publish a draft or bypass legal/release checks.
for (const requirement of [
  'branches: [main]',
  "NUR_RELEASE: 'true'",
  'run: npm run check',
  'actions/upload-pages-artifact@v5',
  'actions/deploy-pages@v5',
]) {
  if (!pagesWorkflow.includes(requirement)) throw new Error(`Pages workflow is missing release safety: ${requirement}`);
}
if (pagesWorkflow.includes('branches: [premium-design-finish]')) {
  throw new Error('Pages workflow must not automatically deploy the draft premium-design-finish branch.');
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

if (!visuals.includes("import { versionAppPath } from '../app/appPaths';") || !visuals.includes('return versionAppPath(src, PREMIUM_ASSET_VERSION);')) {
  throw new Error('PremiumImage does not resolve assets through the deployment base path.');
}
if (!visuals.includes("const PREMIUM_ASSET_VERSION = '20260808-release-hardening';")) {
  throw new Error('PremiumImage is not pinned to the current release asset version.');
}

for (const requirement of [
  "import { versionAppPath } from '../app/appPaths';",
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
  // Lookups pass MATCH ({ ignoreVary: true }): static hosts send Vary: Origin,
  // and a strict match missed every entry this worker precaches itself.
  'caches.match(INDEX_URL, MATCH)',
  'const MATCH = { ignoreVary: true }',
  // The build writes the content-hashed chunk names the worker cannot know, so
  // an on-demand screen is cached before it is first opened.
  "fetch(scoped('asset-manifest.json')",
  'await cacheBuildAssets(cache)',
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
if (manifest.display !== 'standalone' || manifest.display_override !== undefined) {
  throw new Error('PWA manifest must use predictable standalone window geometry without an unhandled display override.');
}
if (manifest.background_color !== '#00120f' || manifest.theme_color !== '#001b16') {
  throw new Error('PWA manifest colors must match the dark reference palette.');
}
if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
  throw new Error('PWA manifest must expose install icons.');
}
for (const icon of manifest.icons) {
  if (typeof icon.src !== 'string' || !icon.src.startsWith('./') || icon.src.startsWith('./http') || icon.src.includes('://')) {
    throw new Error(`PWA manifest icon must stay relative to the deployment scope: ${icon.src ?? 'missing src'}`);
  }
}
const hasIcon = (src, sizes, type, purpose) => manifest.icons.some((icon) => (
  icon.src === src && icon.sizes === sizes && icon.type === type && icon.purpose === purpose
));
if (!hasIcon('./nur-app-icon.svg', 'any', 'image/svg+xml', 'any')) {
  throw new Error('PWA manifest must keep the scalable Nur app icon.');
}
if (!hasIcon('./nur-app-icon-192.png', '192x192', 'image/png', 'any')) {
  throw new Error('PWA manifest must keep the scoped 192x192 PNG install icon.');
}
if (!hasIcon('./nur-app-icon-512.png', '512x512', 'image/png', 'any')) {
  throw new Error('PWA manifest must keep the scoped 512x512 PNG install icon.');
}
if (!hasIcon('./nur-app-icon-512.png', '512x512', 'image/png', 'maskable')) {
  throw new Error('PWA manifest must keep the scoped 512x512 maskable PNG icon.');
}

for (const requirement of [
  'meta name="theme-color" content="#001b16"',
  'href="%BASE_URL%manifest.webmanifest"',
  'href="%BASE_URL%nur-app-icon.svg"',
  'href="%BASE_URL%premium-assets/high-res-objects/nur-logo-emblem.png"',
]) {
  if (!html.includes(requirement)) throw new Error(`HTML reference/deployment token is missing: ${requirement}`);
}

console.log(`Deployment paths verified: current Node 24 GitHub Actions runtimes, release-gated main-only Pages workflow, GitHub Pages base, matching v${workerCache[1]} service worker registration, cached reference Apple touch icon, scoped SVG + 192/512 PNG install icons, predictable standalone desktop window geometry, exact SVG reference palette, reference PWA colors, shared visual version for core and legacy heroes, legacy-to-v2 premium aliases, integrated screen artwork, preloads, manifest scope, and scoped offline cache.`);
