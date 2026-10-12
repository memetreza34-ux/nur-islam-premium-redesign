import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { compareQuran, REFERENCE_URL, verifyFingerprints } from './audit-quran-reference.mjs';

function fixture() {
  const catalogue = Array.from({ length: 114 }, (_, index) => ({
    number: index + 1, name: `Test ${index + 1}`, englishName: `Test ${index + 1}`,
    englishNameTranslation: 'Test metadata', numberOfAyahs: 1, revelationType: 'Meccan',
  }));
  const files = catalogue.map(meta => ({ ...meta, ayahs: [{ numberInSurah: 1, text: 'بِسْمِ' }] }));
  const reference = { code: 200, data: { edition: { identifier: 'quran-uthmani' }, surahs: files.map(file => {
    const { numberOfAyahs: _omitted, ...surah } = structuredClone(file);
    return surah;
  }) } };
  return { catalogue, files, reference };
}

test('compares all supplied surahs and independently derived counts', () => {
  const { reference, catalogue, files } = fixture();
  const result = compareQuran(reference, catalogue, files);
  assert.equal(result.versesCompared, 114);
  assert.equal(result.exactTexts, 114);
  assert.equal(result.metadataCompared, 1368);
  assert.equal(result.metadataEqual, 1368);
  assert.deepEqual(result.differences, []);
});

test('does not normalize away a changed vowel in the last surah', () => {
  const { reference, catalogue, files } = fixture();
  files[113].ayahs[0].text = 'بَسْمِ';
  const result = compareQuran(reference, catalogue, files);
  assert.equal(result.exactTexts, 113);
  assert.equal(result.differences.length, 1);
  assert.equal(result.differences[0].surah, 114);
  assert.notEqual(result.differences[0].localTextSha256, result.differences[0].referenceTextSha256);
});

test('catches catalogue count differences rather than copying them to the reference', () => {
  const { reference, catalogue, files } = fixture();
  catalogue[20].numberOfAyahs = 2;
  const result = compareQuran(reference, catalogue, files);
  assert.deepEqual(result.differences, [{ surah: 21, location: 'catalogue', field: 'numberOfAyahs', local: 2, reference: 1 }]);
});

test('records missing, extra and shifted local verses', () => {
  for (const kind of ['missing', 'extra', 'shifted']) {
    const { reference, catalogue, files } = fixture();
    if (kind === 'missing') files[0].ayahs.pop();
    if (kind === 'extra') files[0].ayahs.push({ numberInSurah: 2, text: 'Test only' });
    if (kind === 'shifted') files[0].ayahs[0].numberInSurah = 2;
    assert.ok(compareQuran(reference, catalogue, files).differences.length > 0);
  }
});

test('refuses a wrong edition, incomplete corpus or malformed reference', () => {
  for (const kind of ['edition', 'length', 'order', 'empty', 'metadata']) {
    const { reference, catalogue, files } = fixture();
    if (kind === 'edition') reference.data.edition.identifier = 'wrong';
    if (kind === 'length') reference.data.surahs.pop();
    if (kind === 'order') reference.data.surahs[0].number = 2;
    if (kind === 'empty') reference.data.surahs[0].ayahs[0].text = '';
    if (kind === 'metadata') delete reference.data.surahs[0].englishName;
    assert.throws(() => compareQuran(reference, catalogue, files));
  }
});

test('does not skip metadata differences in local files', () => {
  const { reference, catalogue, files } = fixture();
  files[100].revelationType = 'Medinan';
  assert.deepEqual(compareQuran(reference, catalogue, files).differences, [{
    surah: 101, location: 'file', field: 'revelationType', local: 'Medinan', reference: 'Meccan',
  }]);
});

function snapshotFixture() {
  const bytes = Buffer.from('Test snapshot bytes');
  const hash = value => createHash('sha256').update(value).digest('hex');
  const fingerprints = ['public/data/quran/surahs.json', ...Array.from({ length: 114 }, (_, index) => `public/data/quran/ar/${index + 1}.json`)]
    .map(path => ({ path, bytes: bytes.length, sha256: hash(bytes) }));
  const audit = {
    url: REFERENCE_URL, edition: { identifier: 'quran-uthmani' }, versesCompared: 6236, exactTexts: 6236,
    metadataCompared: 1368, metadataEqual: 1368, differences: [], fingerprints,
    localManifestSha256: hash(JSON.stringify(fingerprints)),
  };
  return { audit, bytes, hash };
}

test('offline snapshot check reads every exact expected path', async () => {
  const { audit, bytes } = snapshotFixture();
  const readPaths = [];
  assert.equal(await verifyFingerprints(audit, async path => { readPaths.push(path); return bytes; }), 115);
  assert.deepEqual(readPaths, audit.fingerprints.map(item => item.path));
});

test('offline snapshot check rejects one changed byte in the last file', async () => {
  const { audit, bytes } = snapshotFixture();
  await assert.rejects(verifyFingerprints(audit, async path => path.endsWith('/114.json') ? Buffer.from('Changed snapshot bytes') : bytes), /114.json differs/);
});

test('offline snapshot check rejects an incomplete or nonmatching report', async () => {
  for (const kind of ['count', 'metadata', 'difference', 'manifest']) {
    const { audit, bytes } = snapshotFixture();
    if (kind === 'count') audit.exactTexts--;
    if (kind === 'metadata') audit.metadataEqual--;
    if (kind === 'difference') audit.differences.push({ field: 'test' });
    if (kind === 'manifest') audit.fingerprints.pop();
    await assert.rejects(verifyFingerprints(audit, async () => bytes));
  }
});

test('offline snapshot check refuses substituted paths before reading them', async () => {
  const { audit, bytes, hash } = snapshotFixture();
  audit.fingerprints[0].path = '../unrelated.json';
  audit.localManifestSha256 = hash(JSON.stringify(audit.fingerprints));
  let reads = 0;
  await assert.rejects(verifyFingerprints(audit, async () => { reads++; return bytes; }), /Unexpected audit path/);
  assert.equal(reads, 0);
});
