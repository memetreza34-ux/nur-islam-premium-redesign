import { readFile, readdir } from 'node:fs/promises';
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
const base = await readFile(resolve(root, 'src/styles/base.css'), 'utf8');
const navigation = await readFile(resolve(root, 'src/styles/navigation.css'), 'utf8');
const viewport = await readFile(resolve(root, 'src/styles/reference-mobile-viewport.css'), 'utf8');
const sprite = await readFile(resolve(root, 'src/styles/reference-sprite.css'), 'utf8');
const visuals = await readFile(resolve(root, 'src/PremiumVisuals.tsx'), 'utf8');
const artworkHost = await readFile(resolve(root, 'src/ReferenceArtworkHost.tsx'), 'utf8');
const app = await readFile(resolve(root, 'src/App.tsx'), 'utf8');

const finalImport = "@import './styles/visual-consistency.css';";
if (!styleIndex.trim().endsWith(finalImport)) {
  throw new Error('The visual consistency layer must be the final CSS import.');
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

const sourceFiles = await collectFiles(resolve(root, 'src'), new Set(['.tsx']));
for (const path of sourceFiles) {
  const source = await readFile(path, 'utf8');

  for (const match of source.matchAll(/<button\b[\s\S]*?>/g)) {
    const tag = match[0];
    if (tag.includes('className="icon-button"') && !tag.includes('aria-label=')) {
      throw new Error(`Icon-only button without aria-label in ${path}`);
    }
  }

  for (const match of source.matchAll(/<img\b[\s\S]*?>/g)) {
    const tag = match[0];
    if (!tag.includes('alt=')) {
      throw new Error(`Raw image without alt attribute in ${path}`);
    }
  }
}

const cssFiles = await collectFiles(resolve(root, 'src/styles'), new Set(['.css']));
const allCss = (await Promise.all(cssFiles.map((path) => readFile(path, 'utf8')))).join('\n');
const forbiddenImageRules = [
  /\.premium-image\s*>\s*img\s*\{[^}]*display\s*:\s*none\s*!important/si,
  /\.premium-image\s*>\s*img\s*\{[^}]*opacity\s*:\s*0\s*!important/si,
  /\.reference-artwork-host\s*\{[^}]*pointer-events\s*:\s*auto/si,
];
for (const pattern of forbiddenImageRules) {
  if (pattern.test(allCss)) {
    throw new Error(`Visual stylesheet contains a forbidden image or overlay rule: ${pattern}`);
  }
}

console.log(
  `Visual consistency verified: ${sourceFiles.length} TSX files, ${cssFiles.length} CSS layers, 44px touch targets, unified headers/cards/icons, visible premium imagery, safe decorative layers, narrow-screen layout, and reduced-motion support.`,
);
