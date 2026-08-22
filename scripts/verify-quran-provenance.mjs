/**
 * Compares the bundled offline Quran against the published editions it claims
 * to be, one ayah at a time.
 *
 * The offline bundle is the text most users will actually read, and it arrived
 * in this repository labelled only as inherited legacy content. That is not
 * something a structural check can settle: a file can have the right shape,
 * the right ayah count and the wrong words. This asks the source.
 *
 * Network-bound on purpose, so it is not part of `npm run check`. Run it
 * deliberately — `npm run quran:verify` — and record the result in
 * docs/QURAN-PROVENANCE.md.
 *
 *   --arabic-only / --german-only   limit the comparison
 *   --edition=de.xxx                compare German against a different edition
 *   --surahs=1,2,18                 limit to specific surahs
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);
const flag = (name) => args.some((value) => value === `--${name}`);
const option = (name, fallback) => {
  const match = args.find((value) => value.startsWith(`--${name}=`));
  return match ? match.slice(name.length + 3) : fallback;
};

const API = 'https://api.alquran.cloud/v1';
const ARABIC_EDITION = option('arabic-edition', 'quran-uthmani');
const GERMAN_EDITION = option('edition', 'de.aburida');
const surahList = option('surahs', '')
  ? option('surahs', '').split(',').map(Number).filter((n) => n >= 1 && n <= 114)
  : Array.from({ length: 114 }, (_, index) => index + 1);

/**
 * Compared after normalising whitespace and the Unicode form.
 *
 * A byte comparison would report hundreds of differences that no reader can
 * see: the same Arabic letter can be encoded as one code point or as a base
 * plus a combining mark, and the API and the bundle do not always agree. NFC
 * folds those together without changing which letters are there. Diacritics
 * are deliberately *not* stripped — in an Arabic Quran text they are part of
 * the text, not formatting.
 */
const normalise = (text) => text.normalize('NFC').replace(/﻿/g, '').replace(/\s+/g, ' ').trim();

async function fetchSurah(number, edition) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${API}/surah/${number}/${edition}`, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (payload.code !== 200 || !Array.isArray(payload.data?.ayahs)) throw new Error('unexpected payload');
      return payload.data.ayahs;
    } catch (error) {
      if (attempt === 3) throw new Error(`${edition} surah ${number}: ${error.message}`);
      await new Promise((wait) => setTimeout(wait, 400 * attempt));
    }
  }
  return [];
}

async function compare(language, edition) {
  let exact = 0;
  let total = 0;
  const differences = [];

  for (const number of surahList) {
    const local = JSON.parse(await readFile(resolve(root, `public/data/quran/${language}/${number}.json`), 'utf8'));
    const remote = await fetchSurah(number, edition);

    if (remote.length !== local.ayahs.length) {
      differences.push(`${language}/${number}: bundle has ${local.ayahs.length} ayahs, ${edition} has ${remote.length}`);
    }

    for (let index = 0; index < local.ayahs.length; index += 1) {
      total += 1;
      const mine = normalise(local.ayahs[index].text);
      const theirs = remote[index] ? normalise(remote[index].text) : '';
      if (mine === theirs) {
        exact += 1;
      } else if (differences.length < 40) {
        differences.push(`${language}/${number}:${index + 1}\n    bundle: ${mine.slice(0, 110)}\n    ${edition}: ${theirs.slice(0, 110)}`);
      }
    }
    process.stdout.write(`\r  ${language} vs ${edition}: surah ${number}/114, ${exact}/${total} exact   `);
    await new Promise((wait) => setTimeout(wait, 120));
  }

  process.stdout.write('\n');
  return { exact, total, differences };
}

const results = [];
if (!flag('german-only')) results.push(['Arabic', ARABIC_EDITION, await compare('ar', ARABIC_EDITION)]);
if (!flag('arabic-only')) results.push(['German', GERMAN_EDITION, await compare('de', GERMAN_EDITION)]);

console.log('');
let clean = true;
for (const [label, edition, { exact, total, differences }] of results) {
  const percent = total ? (exact / total * 100).toFixed(3) : '0';
  console.log(`${label} vs ${edition}: ${exact}/${total} ayahs identical (${percent}%)`);
  if (exact !== total) {
    clean = false;
    console.log('  first differences:');
    for (const difference of differences) console.log(`  - ${difference}`);
  }
}

if (!clean) {
  console.log('\nThe bundled text does not fully match the edition it was compared against.');
  console.log('Do not relabel the bundle: record what was compared and what differed in docs/QURAN-PROVENANCE.md.');
  process.exit(1);
}
console.log('\nEvery compared ayah is identical. Record the date, editions and counts in docs/QURAN-PROVENANCE.md.');
