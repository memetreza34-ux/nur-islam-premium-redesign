import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const manifestPath = resolve(root, 'docs/image-asset-provenance.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.assets) || manifest.assets.length < 16) {
  throw new Error('Image provenance manifest is missing its required schema or asset set.');
}

const seen = new Set();
for (const asset of manifest.assets) {
  if (!asset.path?.startsWith('public/premium-assets/high-res-objects/')) {
    throw new Error(`Invalid provenance path: ${asset.path}`);
  }
  if (seen.has(asset.path)) throw new Error(`Duplicate provenance path: ${asset.path}`);
  seen.add(asset.path);

  if (!asset.prompt || !asset.use || !/^[a-f0-9]{64}$/.test(asset.sha256)) {
    throw new Error(`Incomplete provenance record: ${asset.path}`);
  }

  const bytes = await readFile(resolve(root, asset.path));
  const actual = createHash('sha256').update(bytes).digest('hex');
  if (actual !== asset.sha256) {
    throw new Error(`Image provenance hash mismatch for ${asset.path}: expected ${asset.sha256}, got ${actual}`);
  }
}

if (!Array.isArray(manifest.vectorAssets) || manifest.vectorAssets.length < 1) {
  throw new Error('Image provenance manifest is missing its code-native vector asset set.');
}

for (const asset of manifest.vectorAssets) {
  if (!asset.path?.endsWith('.svg') || !asset.origin || !asset.use || !/^[a-f0-9]{64}$/.test(asset.sha256)) {
    throw new Error(`Incomplete vector provenance record: ${asset.path}`);
  }
  if (seen.has(asset.path)) throw new Error(`Duplicate provenance path: ${asset.path}`);
  seen.add(asset.path);

  const bytes = await readFile(resolve(root, asset.path));
  const actual = createHash('sha256').update(bytes).digest('hex');
  if (actual !== asset.sha256) {
    throw new Error(`Vector provenance hash mismatch for ${asset.path}: expected ${asset.sha256}, got ${actual}`);
  }
}

console.log(`Image provenance verified: ${manifest.assets.length} generated assets and ${manifest.vectorAssets.length} code-native vector asset with matching SHA-256 records.`);
