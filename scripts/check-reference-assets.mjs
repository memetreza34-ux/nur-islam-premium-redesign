import { readFile, readdir } from 'node:fs/promises';
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
const requiredAssets = [
  'dome',
  'kaaba',
  'lantern',
  'mihrab',
  'dua-hands',
  'sun-emblem',
  'calendar-chip',
  'bookmark',
];

for (const asset of requiredAssets) {
  if (!spriteComponent.includes(`'${asset}'`)) {
    throw new Error(`Reference sprite mapping is missing: ${asset}`);
  }
}

console.log(`Reference artwork verified: ${width}x${height}, ${sprite.length} bytes, ${requiredAssets.length} assets.`);
