import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const root = process.cwd();

async function collectFiles(directory, extensions) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(path, extensions));
    else if (extensions.has(extname(entry.name))) files.push(path);
  }
  return files;
}

const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');
const guardrails = await readFile(resolve(root, 'src/styles/visual-consistency.css'), 'utf8');
const geometryLock = await readFile(resolve(root, 'src/styles/premium-reference-geometry-lock.css'), 'utf8');
const moreHubStyles = await readFile(resolve(root, 'src/styles/reference-more-hub.css'), 'utf8');
const base = await readFile(resolve(root, 'src/styles/base.css'), 'utf8');
const navigation = await readFile(resolve(root, 'src/styles/navigation.css'), 'utf8');
const viewport = await readFile(resolve(root, 'src/styles/reference-mobile-viewport.css'), 'utf8');
const sprite = await readFile(resolve(root, 'src/styles/reference-sprite.css'), 'utf8');
const visuals = await readFile(resolve(root, 'src/shared/PremiumVisuals.tsx'), 'utf8');
const moreScreen = await readFile(resolve(root, 'src/screens/MoreScreen.tsx'), 'utf8');
const app = await readFile(resolve(root, 'src/app/App.tsx'), 'utf8');
const main = await readFile(resolve(root, 'src/app/main.tsx'), 'utf8');

const guardrailImport = "@import './styles/visual-consistency.css';";
const geometryImport = "@import './styles/premium-reference-geometry-lock.css';";
// Layers may load after the shared guardrails, but only as a declared kind of
// layer: a premium `-lock`/`-pass` art layer, a functional hardening layer, or
// one of the named originals. Anything else is an unnamed sheet quietly
// outranking the guardrails, which is what this check exists to catch. Naming
// rather than an exact list keeps design work from having to edit this file for
// every new layer.
const postGuardrailNames = new Set([
  'release-hardening.css',
  'premium-release-design.css',
  'premium-core-screens.css',
  'premium-entry-system.css',
]);
const postGuardrailPatterns = [/^premium-.+-(lock|pass)\.css$/, /^functional-.+\.css$/];
const isDeclaredLateLayer = (layer) => postGuardrailNames.has(layer)
  || postGuardrailPatterns.some((pattern) => pattern.test(layer));
const guardrailIndex = styleIndex.indexOf(guardrailImport);
if (guardrailIndex === -1) {
  throw new Error('The visual consistency layer is not loaded.');
}
if (guardrailIndex < styleIndex.indexOf("@import './styles/touch-target-consistency.css';")) {
  throw new Error('The visual consistency layer must load after the shared polish layers.');
}
const geometryIndex = styleIndex.indexOf(geometryImport);
if (geometryIndex === -1 || geometryIndex < styleIndex.indexOf("@import './styles/premium-readable-type-lock.css';")) {
  throw new Error('The final reference geometry/icon lock must load after all other premium visual layers.');
}
const importedLayers = [...styleIndex.matchAll(/@import '\.\/styles\/([^']+)';/g)]
  .map((match) => match[1]);
if (importedLayers.at(-1) !== 'premium-reference-geometry-lock.css') {
  throw new Error(`The reference geometry/icon lock must be the final stylesheet import; found ${importedLayers.at(-1) ?? 'none'} after it.`);
}
const lateLayers = [...styleIndex.slice(guardrailIndex + guardrailImport.length).matchAll(/@import '\.\/styles\/([^']+)';/g)]
  .map((match) => match[1]);
for (const layer of lateLayers) {
  if (!isDeclaredLateLayer(layer)) {
    throw new Error(`Unexpected stylesheet after the visual guardrails: ${layer}`);
  }
}
if (!styleIndex.includes("@import './styles/reference-more-hub.css';")) {
  throw new Error('The More hub stylesheet is not loaded.');
}
if (styleIndex.includes('reference-webp-assets.css')) {
  throw new Error('The obsolete background-image layer must not be active because it hides real premium images.');
}
if (styleIndex.includes('premium-artwork-host-lock.css') || main.includes('ReferenceArtworkHost')) {
  throw new Error('The obsolete fixed artwork host must remain removed; artwork is integrated per screen.');
}

const requiredPalette = [
  'background: #001b16',
  '--bg-deep: #00120f',
  '--bg: #001b16',
  '--gold: #e2bf77',
  '--gold-bright: #f2d79a',
  '--cream: #f6ebd6',
  '--cream-strong: #fff8ea',
  'linear-gradient(180deg, #042a21 0%, #001b16 48%, #00120f 100%)',
];
for (const token of requiredPalette) {
  if (!base.includes(token)) throw new Error(`Reference dark palette token is missing: ${token}`);
}

const requiredGuardrails = [
  '--app-content-width: 430px',
  '--tap-target: 44px',
  '--radius-control: 18px',
  '--radius-card: 28px',
  '--radius-hero: 42px',
  '--icon-stroke: 1.75',
  'grid-template-columns: var(--tap-target) minmax(0, 1fr) var(--tap-target)',
  'width: var(--tap-target) !important',
  'min-height: 72px',
  'border-radius: 26px',
  '.app-shell',
  'z-index: 3',
  'stroke-width: var(--icon-stroke)',
  '.premium-image > img:not([hidden])',
  'visibility: visible !important',
  '.premium-image > .premium-image__fallback[hidden]',
  'mihrab-arch-v2.webp?v=20260808-release-hardening',
  '@media (max-width: 370px)',
  'grid-template-columns: repeat(2, minmax(0, 1fr))',
  '@media (prefers-reduced-motion: reduce)',
  'transition-duration: 0.01ms !important',
];
for (const requirement of requiredGuardrails) {
  if (!guardrails.includes(requirement)) {
    throw new Error(`Visual guardrail is missing: ${requirement}`);
  }
}

for (const requirement of [
  'border-radius: 42px !important',
  'border-radius: 28px !important',
  'border-radius: 18px !important',
  '.bottom-nav',
  'border-radius: 26px !important',
  '.bottom-nav__item > span',
  'border-radius: 13px !important',
  ':where(svg.lucide)',
  'stroke-width: 1.75 !important',
  'stroke-linecap: round !important',
  'stroke-linejoin: round !important',
]) {
  if (!geometryLock.includes(requirement)) {
    throw new Error(`Final reference geometry/icon lock is incomplete: ${requirement}`);
  }
}

for (const requirement of [
  '.reference-core-access-grid',
  'grid-template-columns: repeat(2, minmax(0, 1fr))',
  'min-height: 82px',
  '.reference-core-access-grid__icon',
  '@media (max-width: 370px)',
]) {
  if (!moreHubStyles.includes(requirement)) {
    throw new Error(`More hub visual structure is incomplete: ${requirement}`);
  }
}

if (!base.includes('button:focus-visible') || !guardrails.includes('a:focus-visible')) {
  throw new Error('Visible keyboard focus is not consistently defined.');
}
if (!navigation.includes('.bottom-nav') || !viewport.includes('env(safe-area-inset-bottom)')) {
  throw new Error('Bottom navigation or safe-area handling is missing.');
}
for (const requirement of [
  'color: rgba(246, 235, 214, 0.64)',
  'color: #f2d79a',
  'vector-effect: non-scaling-stroke',
  'box-shadow: 0 0 20px rgba(226, 191, 119, 0.17)',
]) {
  if (!navigation.includes(requirement)) throw new Error(`Reference navigation icon state is missing: ${requirement}`);
}
if (!sprite.includes('pointer-events: none') || !guardrails.includes('pointer-events: none')) {
  throw new Error('Decorative artwork must never block app interaction.');
}

const requiredImageBehavior = [
  "import { versionAppPath } from '../app/appPaths';",
  "const PREMIUM_ASSET_VERSION = '20260808-release-hardening';",
  'onLoad={(event) =>',
  'event.currentTarget.hidden = false',
  'onError={(event) =>',
  'event.currentTarget.hidden = true',
  'next.hidden = false',
];
for (const requirement of requiredImageBehavior) {
  if (!visuals.includes(requirement)) {
    throw new Error(`Premium image behavior is incomplete: ${requirement}`);
  }
}

const navigationItems = [
  "{ id: 'home', label: 'Start'",
  "{ id: 'prayer', label: 'Gebete'",
  "{ id: 'calendar', label: 'Kalender'",
  "{ id: 'learn', label: 'Islam verstehen'",
  "{ id: 'profile', label: 'Mehr'",
];
for (const item of navigationItems) {
  if (!app.includes(item)) throw new Error(`Bottom navigation item is missing: ${item}`);
}
if (!app.includes('aria-current={active === id ? \'page\' : undefined}')) {
  throw new Error('Bottom navigation must expose the active page semantically.');
}
if (!app.includes('mihrab-arch-v2.webp" className="verse-card__art"')) {
  throw new Error('Home daily Ayah card must use the Mihrab artwork from the reference composition.');
}
if (!app.includes("onNavigate('prayer')") || !app.includes('<BellRing size={20} />')) {
  throw new Error('Home header must keep the reference notification icon connected to the real prayer/reminder screen.');
}

const moreDestinations = ['prayer', 'learn', 'quran', 'dhikr', 'qibla', 'duas', 'names', 'mosques', 'calendar', 'collections'];
for (const destination of moreDestinations) {
  if (!moreScreen.includes(`destination: '${destination}'`)) {
    throw new Error(`More hub destination is missing: ${destination}`);
  }
}
const moreScreenUsage = app.match(/<MoreScreen[\s\S]*?\/>/);
if (!moreScreenUsage) {
  throw new Error('The More hub screen is not rendered.');
}
if (!moreScreenUsage[0].includes('onBack={goBack}')
  || !/onNavigate=\{\(\w+\) => navigate\(\w+\)\}/.test(moreScreenUsage[0])) {
  throw new Error('More hub shortcuts are not connected to history-aware central app navigation.');
}
if (!app.includes('const [navigationHistory, setNavigationHistory] = useState<Tab[]>([])')
  || !app.includes("const goBack = (fallback: Tab = 'home')")
  || !app.includes('onChange={navigatePrimary}')) {
  throw new Error('History-aware screen navigation contract is incomplete.');
}

const sourceFiles = await collectFiles(resolve(root, 'src'), new Set(['.tsx']));
const sourceContents = [];
for (const path of sourceFiles) {
  const source = await readFile(path, 'utf8');
  sourceContents.push(source);
  const normalizedSource = source.replaceAll('=>', '→');

  for (const match of normalizedSource.matchAll(/<button\b[\s\S]*?>/g)) {
    const tag = match[0];
    if (tag.includes('className="icon-button"') && !tag.includes('aria-label=')) {
      throw new Error(`Icon-only button without aria-label in ${path}`);
    }
  }

  for (const match of normalizedSource.matchAll(/<img\b[\s\S]*?>/g)) {
    const tag = match[0];
    if (!tag.includes('alt=')) {
      throw new Error(`Raw image without alt attribute in ${path}`);
    }
  }
}

const cssFiles = await collectFiles(resolve(root, 'src/styles'), new Set(['.css']));
const cssContents = await Promise.all(cssFiles.map((path) => readFile(path, 'utf8')));
const allCss = cssContents.join('\n');
const allSource = sourceContents.join('\n');
const forbiddenImageRules = [
  /\.premium-image\s*>\s*img\s*\{[^}]*display\s*:\s*none\s*!important/si,
  /\.premium-image\s*>\s*img\s*\{[^}]*opacity\s*:\s*0\s*!important/si,
  /\.premium-image[^{}]*>\s*img\s*\{[^}]*content\s*:\s*url\s*\(/si,
  /(?:\.welcome-hero__visual|\.reference-mosque-hero\s*>\s*\.premium-image|\.reference-dhikr-counter__tasbih|\.reference-qibla-stage__compass)[^{]*>\s*img[^{]*\{[^}]*opacity\s*:\s*0(?:\s*!important)?\s*;/si,
];
for (const pattern of forbiddenImageRules) {
  if (pattern.test(allCss)) {
    throw new Error(`Visual stylesheet contains a forbidden image or overlay rule: ${pattern}`);
  }
}

for (const staleVersion of ['20260806-visual4', '20260807-visual-cleanup']) {
  if (allCss.includes(staleVersion) || allSource.includes(staleVersion)) {
    throw new Error(`Visual source still contains stale premium asset version: ${staleVersion}`);
  }
}

const referencedPremiumAssets = new Set();
const addAssetReference = (value) => {
  const normalized = value.replace(/^\/+/, '');
  if (!normalized || normalized.endsWith('/') || normalized.includes('${')) return;
  referencedPremiumAssets.add(normalized);
};

for (const match of allSource.matchAll(/["'`](\/?premium-assets\/[^"'`?\s)]+)(?:\?[^"'`\s)]*)?["'`]/g)) {
  addAssetReference(match[1]);
}
for (const match of allCss.matchAll(/url\(\s*["']?(\/?premium-assets\/[^"')?\s]+)(?:\?[^"')\s]*)?["']?\s*\)/g)) {
  addAssetReference(match[1]);
}

for (const assetPath of referencedPremiumAssets) {
  const file = resolve(root, 'public', assetPath);
  const details = await stat(file).catch(() => null);
  if (!details?.isFile() || details.size < 100) {
    throw new Error(`Referenced premium image is missing or empty: ${assetPath}`);
  }
}

console.log(
  `Visual consistency verified: ${sourceFiles.length} TSX files, ${cssFiles.length} CSS layers, ${referencedPremiumAssets.size} referenced premium images, exact dark reference palette, final-last 18/28/42 geometry + 1.75 Lucide lock, navigation/header icon states and labels, Mihrab daily Ayah artwork, no CSS image-source swapping, no active image-hiding or fixed artwork-host layer, 44px touch targets, complete history-aware More hub navigation, narrow-screen layout, and reduced-motion support.`,
);
