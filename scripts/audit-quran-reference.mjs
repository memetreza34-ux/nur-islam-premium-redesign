import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const REFERENCE_URL = 'https://api.alquran.cloud/v1/quran/quran-uthmani';
const METADATA_FIELDS = ['number', 'name', 'englishName', 'englishNameTranslation', 'numberOfAyahs', 'revelationType'];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

export function compareQuran(reference, catalogue, files) {
  if (reference?.code !== 200 || reference.data?.edition?.identifier !== 'quran-uthmani'
    || !Array.isArray(reference.data.surahs) || reference.data.surahs.length !== 114) {
    throw new Error('Reference response is not the complete identified quran-uthmani edition.');
  }
  if (!Array.isArray(catalogue) || catalogue.length !== 114 || files.length !== 114) {
    throw new Error('Local catalogue or file collection is not complete.');
  }
  const result = { versesCompared: 0, exactTexts: 0, metadataCompared: 0, metadataEqual: 0, differences: [] };
  for (let index = 0; index < 114; index++) {
    const source = reference.data.surahs[index];
    const local = files[index];
    const meta = catalogue[index];
    const number = index + 1;
    if (source?.number !== number || !Array.isArray(source.ayahs) || !source.ayahs.length
      || (source.numberOfAyahs !== undefined && source.ayahs.length !== source.numberOfAyahs)) {
      throw new Error(`Reference surah ${number} is incomplete or misnumbered.`);
    }
    if (meta?.number !== number || local?.number !== number || !Array.isArray(local.ayahs)) {
      throw new Error(`Local surah ${number} is missing or misnumbered.`);
    }
    for (const field of METADATA_FIELDS) {
      const referenceValue = field === 'numberOfAyahs' ? source.ayahs.length : source[field];
      if (referenceValue === undefined) throw new Error(`Reference surah ${number} lacks ${field}.`);
      for (const [location, value] of [['catalogue', meta[field]], ['file', local[field]]]) {
        result.metadataCompared++;
        if (referenceValue === value) result.metadataEqual++;
        else result.differences.push({ surah: number, location, field, local: value ?? null, reference: referenceValue });
      }
    }
    if (local.ayahs.length !== source.ayahs.length) {
      result.differences.push({ surah: number, location: 'file', field: 'ayahs.length', local: local.ayahs.length, reference: source.ayahs.length });
    }
    for (let verseIndex = 0; verseIndex < source.ayahs.length; verseIndex++) {
      const expected = source.ayahs[verseIndex];
      const actual = local.ayahs[verseIndex];
      const ayah = verseIndex + 1;
      if (expected?.numberInSurah !== ayah || typeof expected.text !== 'string' || !expected.text.trim()) {
        throw new Error(`Reference ayah ${number}:${ayah} is malformed.`);
      }
      result.versesCompared++;
      if (actual?.numberInSurah === ayah && actual.text === expected.text) result.exactTexts++;
      else result.differences.push({
        surah: number, ayah, location: 'file', field: 'ayah',
        numberEqual: actual?.numberInSurah === ayah,
        localTextSha256: typeof actual?.text === 'string' ? hash(actual.text) : null,
        referenceTextSha256: hash(expected.text),
      });
    }
  }
  return result;
}

export async function runAudit(root = process.cwd()) {
  const retrievedAt = new Date().toISOString();
  const response = await fetch(REFERENCE_URL, { signal: AbortSignal.timeout(30000), headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Reference HTTP ${response.status}; no comparison completed.`);
  const sourceBytes = Buffer.from(await response.arrayBuffer());
  const reference = JSON.parse(sourceBytes.toString('utf8'));
  const catalogueBytes = await readFile(resolve(root, 'public/data/quran/surahs.json'));
  const catalogue = JSON.parse(catalogueBytes.toString('utf8'));
  const files = [];
  const fingerprints = [{ path: 'public/data/quran/surahs.json', bytes: catalogueBytes.length, sha256: hash(catalogueBytes) }];
  for (let number = 1; number <= 114; number++) {
    const path = `public/data/quran/ar/${number}.json`;
    const bytes = await readFile(resolve(root, path));
    files.push(JSON.parse(bytes.toString('utf8')));
    fingerprints.push({ path, bytes: bytes.length, sha256: hash(bytes) });
  }
  return {
    url: REFERENCE_URL, retrievedAt, httpStatus: response.status,
    responseDate: response.headers.get('date'), etag: response.headers.get('etag'),
    referenceBytes: sourceBytes.length, referenceSha256: hash(sourceBytes),
    edition: reference.data?.edition,
    localManifestSha256: hash(JSON.stringify(fingerprints)),
    fingerprints, ...compareQuran(reference, catalogue, files),
    countMethod: 'The whole-Quran endpoint omits numberOfAyahs; counts are derived from each reference ayahs array, not copied from the local catalogue.',
    scope: 'Exact text strings, five supplied metadata fields and derived verse counts only; no provenance, rights, translation, recitation or theological certification.',
  };
}

export async function verifyFingerprints(audit, readBytes) {
  const paths = ['public/data/quran/surahs.json', ...Array.from({ length: 114 }, (_, index) => `public/data/quran/ar/${index + 1}.json`)];
  if (audit?.url !== REFERENCE_URL || audit.edition?.identifier !== 'quran-uthmani'
    || audit.versesCompared !== 6236 || audit.exactTexts !== 6236
    || audit.metadataCompared !== 1368 || audit.metadataEqual !== 1368
    || !Array.isArray(audit.differences) || audit.differences.length
    || !Array.isArray(audit.fingerprints) || audit.fingerprints.length !== paths.length) {
    throw new Error('No complete, matching reference-audit snapshot.');
  }
  if (hash(JSON.stringify(audit.fingerprints)) !== audit.localManifestSha256) {
    throw new Error('Reference-audit fingerprint manifest was changed.');
  }
  for (let index = 0; index < paths.length; index++) {
    const fingerprint = audit.fingerprints[index];
    const path = paths[index];
    if (fingerprint.path !== path) throw new Error(`Unexpected audit path at index ${index}.`);
    const bytes = await readBytes(path);
    if (bytes.length !== fingerprint.bytes || hash(bytes) !== fingerprint.sha256) {
      throw new Error(`${path} differs from the externally compared snapshot; repeat and investigate the reference audit, do not just update a checksum.`);
    }
  }
  return paths.length;
}

export async function checkAuditSnapshot(root = process.cwd()) {
  const audit = JSON.parse(await readFile(resolve(root, 'docs/quran-reference-audit-2026-10-11.json'), 'utf8'));
  return verifyFingerprints(audit, path => readFile(resolve(root, path)));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const audit = await runAudit();
  console.log(JSON.stringify(audit, null, 2));
  if (audit.differences.length) process.exitCode = 1;
}
