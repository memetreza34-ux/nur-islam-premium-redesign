/**
 * Proves the bundled Quran is still byte-for-byte what was verified.
 *
 * The structural check next to this one reads the bundle against its own
 * metadata, which cannot notice a file whose *words* changed. Once the text has
 * been compared against a published edition — `npm run quran:verify`, recorded
 * in docs/QURAN-PROVENANCE.md — the only thing left to protect is that nothing
 * edits it afterwards. A single altered ayah in the scripture the app serves is
 * the most serious defect this repository can ship, and it is also the easiest
 * to introduce silently: a stray formatter, a bad merge, a partial download.
 *
 * The manifest is generated from the verified files and committed. Regenerate
 * it only when the bundle is deliberately replaced, and re-run the edition
 * comparison in the same change:
 *
 *   node scripts/check-quran-integrity.mjs --write
 *
 * The per-surah ayah counts are pinned separately, against the Kufan counting
 * the 114-surah metadata is built on, so a bundle and a manifest that were both
 * replaced still cannot quietly disagree with the canonical structure.
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const dataRoot = resolve(root, 'public/data/quran');
const manifestPath = resolve(root, 'public/data/quran/manifest.sha256.json');
const write = process.argv.includes('--write');

/**
 * The Kufan ayah counts, which is the counting the surah metadata, the 6236
 * total and every ayah reference in the app follow. Other traditions count
 * differently; this is the one the bundle is built on and must stay on.
 */
const KUFAN_AYAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

const files = ['surahs.json'];
for (const language of ['ar', 'de']) {
  for (let number = 1; number <= 114; number += 1) files.push(`${language}/${number}.json`);
}

const digests = {};
for (const file of files) {
  const contents = await readFile(resolve(dataRoot, file));
  digests[file] = createHash('sha256').update(contents).digest('hex');
}

if (write) {
  await writeFile(manifestPath, `${JSON.stringify({ algorithm: 'sha256', files: digests }, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${manifestPath} for ${files.length} files.`);
  process.exit(0);
}

let manifest;
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
} catch {
  throw new Error('public/data/quran/manifest.sha256.json is missing. Generate it with --write and verify the text against a published edition in the same change.');
}
if (manifest.algorithm !== 'sha256') throw new Error('Quran manifest uses an unexpected digest algorithm.');

const listed = Object.keys(manifest.files ?? {});
if (listed.length !== files.length) {
  throw new Error(`Quran manifest covers ${listed.length} files; the bundle has ${files.length}.`);
}
for (const file of files) {
  const expected = manifest.files[file];
  if (!expected) throw new Error(`Quran manifest has no digest for ${file}.`);
  if (expected !== digests[file]) {
    throw new Error(
      `Bundled Quran file changed since it was verified: ${file}\n`
      + `  expected sha256 ${expected}\n  found    sha256 ${digests[file]}\n`
      + '  If the change is intended, re-run npm run quran:verify against the published edition,\n'
      + '  record the result in docs/QURAN-PROVENANCE.md, and regenerate the manifest with --write.',
    );
  }
}

// The manifest proves the files did not change. This proves they were right in
// the first place, in the one dimension a digest cannot express.
const surahs = JSON.parse(await readFile(resolve(dataRoot, 'surahs.json'), 'utf8'));
for (let index = 0; index < 114; index += 1) {
  if (surahs[index]?.numberOfAyahs !== KUFAN_AYAH_COUNTS[index]) {
    throw new Error(`Surah ${index + 1} claims ${surahs[index]?.numberOfAyahs} ayahs; the Kufan counting has ${KUFAN_AYAH_COUNTS[index]}.`);
  }
}

const provenance = await readFile(resolve(root, 'docs/QURAN-PROVENANCE.md'), 'utf8').catch(() => '');
if (!provenance.includes('sha256')) {
  throw new Error('docs/QURAN-PROVENANCE.md must record that the bundle is pinned by digest.');
}

console.log(`Quran integrity verified: ${files.length} bundled files match their recorded sha256 digests, and all 114 surahs keep the Kufan ayah counts totalling ${KUFAN_AYAH_COUNTS.reduce((sum, count) => sum + count, 0)}.`);
