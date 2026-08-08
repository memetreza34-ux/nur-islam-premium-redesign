import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const root = process.cwd();
const expectedVisualVersion = '20260808-release-hardening';
const chunksDirectory = resolve(root, 'src/assets');
const chunkNames = (await readdir(chunksDirectory))
  .filter((name) => /^referenceSpriteChunk\d{2}\.ts$/.test(name))
  .sort();

if (chunkNames.length !== 6) {
  throw new Error(`Expected 6 reference sprite chunks, found ${chunkNames.length}.`);
}

const encodedParts = [];
for (const name of chunkNames) {
  const source = await readFile(resolve(chunksDirectory, name), 'utf8');
  const match = source.match(/^export default '([A-Za-z0-9+/=]+)';\s*$/);
  if (!match) throw new Error(`Invalid reference sprite chunk: ${name}`);
  encodedParts.push(match[1]);
}

const sprite = Buffer.from(encodedParts.join(''), 'base64');
if (sprite.subarray(0, 4).toString('ascii') !== 'RIFF') {
  throw new Error('Reference sprite has no RIFF header.');
}
if (sprite.subarray(8, 12).toString('ascii') !== 'WEBP') {
  throw new Error('Reference sprite is not a WebP file.');
}
if (sprite.subarray(12, 16).toString('ascii') !== 'VP8X') {
  throw new Error('Reference sprite does not use the expected VP8X container.');
}

const width = 1 + sprite.readUIntLE(24, 3);
const height = 1 + sprite.readUIntLE(27, 3);
if (width !== 512 || height !== 256) {
  throw new Error(`Unexpected reference sprite dimensions: ${width}x${height}.`);
}

const spriteComponent = await readFile(resolve(root, 'src/ReferenceSprite.tsx'), 'utf8');
const requiredSpriteAssets = [
  'dome',
  'kaaba',
  'lantern',
  'mihrab',
  'dua-hands',
  'sun-emblem',
  'calendar-chip',
  'bookmark',
];

for (const asset of requiredSpriteAssets) {
  if (!spriteComponent.includes(`'${asset}'`)) {
    throw new Error(`Reference sprite mapping is missing: ${asset}`);
  }
}

const recoveredDirectory = resolve(root, 'public/premium-assets/high-res-objects');
const recoveredAssets = [
  'nur-logo-emblem-v2.webp',
  'mosque-gold-v2.webp',
  'mosque-v2.webp',
  'quran-closed-v2.webp',
  'quran-open-v2.webp',
  'tasbih-v2.webp',
  'qibla-compass-v2.webp',
  'qibla-v2.webp',
  'mihrab-v2.webp',
  'mihrab-arch-v2.webp',
  'lantern-v2.webp',
  'kaaba-v2.webp',
  'dome-v2.webp',
  'dua-hands-v2.webp',
  'sun-emblem-v2.webp',
  'calendar-chip-v2.webp',
  'bookmark-v2.webp',
];

for (const name of recoveredAssets) {
  const path = resolve(recoveredDirectory, name);
  const fileStats = await stat(path);
  if (fileStats.size < 1000) {
    throw new Error(`Recovered asset is unexpectedly small: ${name} (${fileStats.size} bytes).`);
  }

  const data = await readFile(path);
  if (data.subarray(0, 4).toString('ascii') !== 'RIFF') {
    throw new Error(`Recovered asset has no RIFF header: ${name}`);
  }
  if (data.subarray(8, 12).toString('ascii') !== 'WEBP') {
    throw new Error(`Recovered asset is not WebP: ${name}`);
  }
}

const appleTouchPath = resolve(recoveredDirectory, 'nur-logo-emblem.png');
const appleTouchStats = await stat(appleTouchPath);
if (appleTouchStats.size < 1000) {
  throw new Error(`Apple touch icon is unexpectedly small: ${appleTouchStats.size} bytes.`);
}
const appleTouch = await readFile(appleTouchPath);
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!appleTouch.subarray(0, 8).equals(pngSignature)) {
  throw new Error('Apple touch icon is not a valid PNG file.');
}
const appleTouchWidth = appleTouch.readUInt32BE(16);
const appleTouchHeight = appleTouch.readUInt32BE(20);
if (appleTouchWidth !== 180 || appleTouchHeight !== 180) {
  throw new Error(`Apple touch icon must stay 180x180, found ${appleTouchWidth}x${appleTouchHeight}.`);
}
const appleTouchHash = createHash('sha256').update(appleTouch).digest('hex');
const expectedAppleTouchHash = 'db08c43eb9d0b69a2b9324bbd32b88cc023de8afd7fb93f83f06b3b256080dd6';
if (appleTouchHash !== expectedAppleTouchHash) {
  throw new Error(`Apple touch icon drifted from the approved reference render: ${appleTouchHash}.`);
}

const designBoardDirectory = resolve(root, 'docs/design-references/chat');
const designBoards = new Map([
  ['01-core-experience.webp', 5598],
  ['02-quran-daily-content.webp', 5428],
  ['03-learning-knowledge.webp', 6536],
  ['04-worship-seasons.webp', 6674],
  ['05-places-community-settings.webp', 6612],
  ['06-home-components.webp', 5596],
  ['07-calendar-components.webp', 5970],
  ['08-settings-profile-components.webp', 8626],
]);

const designBoardReadme = await readFile(resolve(designBoardDirectory, 'README.md'), 'utf8');
for (const [name, expectedSize] of designBoards) {
  const path = resolve(designBoardDirectory, name);
  const fileStats = await stat(path);
  if (fileStats.size !== expectedSize) {
    throw new Error(`Chat design board has an unexpected size: ${name} (${fileStats.size}, expected ${expectedSize}).`);
  }

  const data = await readFile(path);
  if (data.subarray(0, 4).toString('ascii') !== 'RIFF' || data.subarray(8, 12).toString('ascii') !== 'WEBP') {
    throw new Error(`Chat design board is not a valid WebP file: ${name}`);
  }
  if (!designBoardReadme.includes(name)) {
    throw new Error(`Chat design board is missing from its README: ${name}`);
  }
}

async function collectTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectTextFiles(path));
    else if (['.ts', '.tsx', '.css'].includes(extname(entry.name))) files.push(path);
  }
  return files;
}

const sourceFiles = await collectTextFiles(resolve(root, 'src'));
const sourceParts = await Promise.all(sourceFiles.map((path) => readFile(path, 'utf8')));
const completeSource = sourceParts.join('\n');

for (const name of recoveredAssets) {
  if (!completeSource.includes(name) && !['mosque-v2.webp', 'qibla-v2.webp', 'mihrab-v2.webp'].includes(name)) {
    throw new Error(`Recovered asset is not wired in the app source: ${name}`);
  }
}

const allCss = sourceFiles
  .filter((path) => extname(path) === '.css')
  .map((path) => sourceParts[sourceFiles.indexOf(path)])
  .join('\n');

const forbiddenGlobalRules = [
  /\.premium-image\s*>\s*img\s*\{[^}]*display\s*:\s*none\s*!important/si,
  /\.premium-image\s*>\s*img\s*\{[^}]*opacity\s*:\s*0\s*!important/si,
];

for (const pattern of forbiddenGlobalRules) {
  if (pattern.test(allCss)) {
    throw new Error('A global CSS rule hides real premium images. SVG fallbacks must only appear after an image load error.');
  }
}

const recoveryCss = await readFile(resolve(root, 'src/styles/reference-asset-recovery.css'), 'utf8');
if (!recoveryCss.includes('.premium-image > img[hidden]') || !recoveryCss.includes('display: block !important')) {
  throw new Error('Premium image fallback CSS does not preserve visible real images and error-only fallbacks.');
}

const premiumVisuals = await readFile(resolve(root, 'src/PremiumVisuals.tsx'), 'utf8');
if (!premiumVisuals.includes('event.currentTarget.hidden = true') || !premiumVisuals.includes('next.hidden = false')) {
  throw new Error('PremiumImage must switch to its SVG fallback only after an actual image error.');
}

const mainSource = await readFile(resolve(root, 'src/main.tsx'), 'utf8');
const serviceWorker = await readFile(resolve(root, 'public/sw.js'), 'utf8');
const stylesEntry = await readFile(resolve(root, 'src/styles.css'), 'utf8');
const sourceRootEntries = await readdir(resolve(root, 'src'));
const styleEntries = await readdir(resolve(root, 'src/styles'));

const versionAssertions = [
  ['PremiumVisuals', premiumVisuals],
  ['main preload', mainSource],
  ['service worker', serviceWorker],
];
for (const [label, source] of versionAssertions) {
  if (!source.includes(expectedVisualVersion)) {
    throw new Error(`${label} does not use the shared premium visual version ${expectedVisualVersion}.`);
  }
}

for (const staleVersion of ['20260806-visual4', '20260807-visual-cleanup']) {
  if (completeSource.includes(staleVersion)) {
    throw new Error(`Active app source still references stale premium visual version: ${staleVersion}.`);
  }
}

if (!serviceWorker.includes(`nur-islam-premium-v14-${'${VISUAL_VERSION}'}`)) {
  throw new Error('Service worker app-shell cache must stay on premium v14 for the current reference visual release.');
}
if (!serviceWorker.includes("scoped('premium-assets/high-res-objects/nur-logo-emblem.png')")) {
  throw new Error('Service worker must cache the reference-aligned Apple touch icon in the app shell.');
}

if (!serviceWorker.includes('meta name="theme-color" content="#001b16"')
  || !serviceWorker.includes('background:#00120f')
  || !serviceWorker.includes('border-radius:28px')
  || !serviceWorker.includes('border-radius:18px')) {
  throw new Error('Offline PWA document must stay aligned with the current reference palette and geometry.');
}

if (mainSource.includes('ReferenceArtworkHost')) {
  throw new Error('The obsolete fixed ReferenceArtworkHost must not be mounted; artwork is integrated per screen.');
}
if (sourceRootEntries.includes('ReferenceArtworkHost.tsx')) {
  throw new Error('Obsolete ReferenceArtworkHost.tsx should remain removed from the source tree.');
}
if (stylesEntry.includes('premium-artwork-host-lock.css') || styleEntries.includes('premium-artwork-host-lock.css')) {
  throw new Error('Obsolete artwork-host hiding CSS should remain removed with the host runtime.');
}

console.log(
  `Reference artwork verified: sprite ${width}x${height}, ${requiredSpriteAssets.length} sprite mappings, ${recoveredAssets.length} recovered WebP assets, exact 180x180 Apple touch icon hash, ${designBoards.size} archived chat boards, shared visual version ${expectedVisualVersion}, PWA shell v14 reference styling, no obsolete artwork host or global image-hiding CSS.`,
);
