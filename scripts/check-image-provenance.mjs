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

const brandFiles = new Set([
  'public/nur-app-icon.svg',
  'public/nur-app-icon-192.png',
  'public/nur-app-icon-512.png',
  'public/nur-app-icon-maskable-512.png',
]);
if (!Array.isArray(manifest.brandExports) || manifest.brandExports.length !== brandFiles.size) {
  throw new Error('The selected mosque brand must document all four install-icon exports.');
}
for (const asset of manifest.brandExports) {
  if (!brandFiles.delete(asset.path) || !asset.origin || !asset.sourceFile || !/^[a-f0-9]{64}$/.test(asset.sha256)) {
    throw new Error(`Incomplete or duplicate brand export: ${asset.path}`);
  }
  const bytes = await readFile(resolve(root, asset.path));
  if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) {
    throw new Error(`Brand export hash mismatch: ${asset.path}`);
  }
}

const migration = JSON.parse(await readFile(resolve(root, 'docs/ILLUSTRATION-REPLACEMENTS-2026-10-15.json'), 'utf8'));
for (const asset of migration.archivedAssets) {
  if (!asset.archivePath.startsWith('output/image-archive/pre-unified-20261015/') || asset.archivePath.includes('..')) {
    throw new Error(`Invalid illustration archive path: ${asset.archivePath}`);
  }
  const bytes = await readFile(resolve(root, asset.archivePath));
  if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) {
    throw new Error(`Archived illustration hash mismatch: ${asset.archivePath}`);
  }
}

console.log(`Image provenance verified: ${manifest.assets.length} generated assets, ${manifest.vectorAssets.length} historical vectors, ${manifest.brandExports.length} current brand exports and ${migration.archivedAssets.length} archived illustrations with matching SHA-256 records.`);
