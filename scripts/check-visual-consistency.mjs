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
const moreHubStyles = await readFile(resolve(root, 'src/styles/reference-more-hub.css'), 'utf8');
const base = await readFile(resolve(root, 'src/styles/base.css'), 'utf8');
const navigation = await readFile(resolve(root, 'src/styles/navigation.css'), 'utf8');
const viewport = await readFile(resolve(root, 'src/styles/reference-mobile-viewport.css'), 'utf8');
const sprite = await readFile(resolve(root, 'src/styles/reference-sprite.css'), 'utf8');
const visuals = await readFile(resolve(root, 'src/PremiumVisuals.tsx'), 'utf8');
const artworkHost = await readFile(resolve(root, 'src/ReferenceArtworkHost.tsx'), 'utf8');
const moreScreen = await readFile(resolve(root, 'src/MoreScreen.tsx'), 'utf8');
const app = await readFile(resolve(root, 'src/App.tsx'), 'utf8');

const guardrailImport = "@import './styles/visual-consistency.css';";
// Deliberate override layers that load after the shared guardrails. New late
// layers must be listed here so they stay a conscious decision, not a silent
// append that quietly outranks the guardrails.
const postGuardrailLayers = [
  'release-hardening.css',
  'premium-release-design.css',
  'premium-core-screens.css',
  'premium-entry-system.css',
  'premium-visual-lock.css',
  'premium-flow-lock.css',
  'premium-depth-lock.css',
  'functional-hardening.css',
  'functional-legacy-overview.css',
];
const guardrailIndex = styleIndex.indexOf(guardrailImport);
if (guardrailIndex === -1) {
  throw new Error('The visual consistency layer is not loaded.');
}
if (guardrailIndex < styleIndex.indexOf("@import './styles/touch-target-consistency.css';")) {
  throw new Error('The visual consistency layer must load after the shared polish layers.');
}
const lateLayers = [...styleIndex.slice(guardrailIndex + guardrailImport.length).matchAll(/@import '\.\/styles\/([^']+)';/g)]
  .map((match) => match[1]);
for (const layer of lateLayers) {
  if (!postGuardrailLayers.includes(layer)) {
    throw new Error(`Unexpected stylesheet after the visual guardrails: ${layer}`);
  }
}
if (!styleIndex.includes("@import './styles/reference-more-hub.css';")) {
  throw new Error('The More hub stylesheet is not loaded.');
}
if (styleIndex.includes("reference-webp-assets.css")) {
  throw new Error('The obsolete background-image layer must not be active because it hides real premium images.');
}

const requiredGuardrails = [
  '--app-content-width: 430px',
  '--tap-target: 44px',
  '--radius-card: 18px',
  '--radius-hero: 24px',
  '--icon-stroke: 1.75',
  'grid-template-columns: var(--tap-target) minmax(0, 1fr) var(--tap-target)',
  'width: var(--tap-target) !important',
  'min-height: 72px',
  '.reference-artwork-host',
  'z-index: 1',
  '.app-shell',
  'z-index: 3',
  'stroke-width: var(--icon-stroke)',
  '.premium-image > img:not([hidden])',
  'visibility: visible !important',
  '.premium-image > .premium-image__fallback[hidden]',
  "mosque-gold-v2.webp?v=20260807-visual-cleanup",
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
if (!sprite.includes('pointer-events: none') || !guardrails.includes('pointer-events: none')) {
  throw new Error('Decorative artwork must never block app interaction.');
}

const requiredImageBehavior = [
  "import { versionAppPath } from './appPaths';",
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
if (!artworkHost.includes('aria-hidden="true"') || !artworkHost.includes('loading="eager"')) {
  throw new Error('Decorative artwork host must remain hidden from assistive technology and load predictably.');
}

const navigationItems = [
  "{ id: 'home', label: 'Home'",
  "{ id: 'prayer', label: 'Gebete'",
  "{ id: 'calendar', label: 'Kalender'",
  "{ id: 'learn', label: 'Lernen'",
  "{ id: 'profile', label: 'Mehr'",
];
for (const item of navigationItems) {
  if (!app.includes(item)) throw new Error(`Bottom navigation item is missing: ${item}`);
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
if (!moreScreenUsage[0].includes('onBack={goHome}')
  || !/onNavigate=\{\(\w+\) => navigate\(\w+\)\}/.test(moreScreenUsage[0])) {
  throw new Error('More hub shortcuts are not connected to the central app navigation.');
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
  /(?:\.welcome-hero__visual|\.reference-mosque-hero\s*>\s*\.premium-image|\.reference-dhikr-counter__tasbih|\.reference-qibla-stage__compass)[^{]*>\s*img[^{]*\{[^}]*opacity\s*:\s*0(?:\s*!important)?\s*;/si,
  /\.reference-artwork-host\s*\{[^}]*pointer-events\s*:\s*auto/si,
];
for (const pattern of forbiddenImageRules) {
  if (pattern.test(allCss)) {
    throw new Error(`Visual stylesheet contains a forbidden image or overlay rule: ${pattern}`);
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
  `Visual consistency verified: ${sourceFiles.length} TSX files, ${cssFiles.length} CSS layers, ${referencedPremiumAssets.size} referenced premium images, no active image-hiding layer, 44px touch targets, unified headers/cards/icons, safe decorative layers, complete More hub navigation, narrow-screen layout, and reduced-motion support.`,
);
