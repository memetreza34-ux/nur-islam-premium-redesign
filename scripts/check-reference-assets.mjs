import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
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

const primaryCss = await readFile(resolve(root, 'src/styles/reference-valid-assets-v2.css'), 'utf8');
const secondaryCss = await readFile(resolve(root, 'src/styles/reference-valid-assets-secondary.css'), 'utf8');
const wiredAssets = [
  'nur-logo-emblem-v2.webp',
  'mosque-gold-v2.webp',
  'quran-closed-v2.webp',
  'quran-open-v2.webp',
  'tasbih-v2.webp',
  'qibla-compass-v2.webp',
  'mihrab-arch-v2.webp',
  'lantern-v2.webp',
  'kaaba-v2.webp',
  'dome-v2.webp',
  'dua-hands-v2.webp',
  'sun-emblem-v2.webp',
  'calendar-chip-v2.webp',
  'bookmark-v2.webp',
];

const completeCss = `${primaryCss}\n${secondaryCss}`;
for (const name of wiredAssets) {
  if (!completeCss.includes(name)) {
    throw new Error(`Recovered asset is not wired in the cache-safe CSS layers: ${name}`);
  }
}

console.log(
  `Reference artwork verified: sprite ${width}x${height}, ${requiredSpriteAssets.length} sprite mappings, ${recoveredAssets.length} recovered WebP assets.`,
);
