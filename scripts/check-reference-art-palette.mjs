import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const domains = new Map([
  ['learning', await read('src/styles/premium-learning-art-lock.css')],
  ['devotional', await read('src/styles/premium-devotional-art-lock.css')],
  ['worship', await read('src/styles/premium-worship-art-lock.css')],
  ['discovery', await read('src/styles/premium-discovery-collection-art-lock.css')],
  ['daily', await read('src/styles/premium-daily-inspiration-art-lock.css')],
  ['quran', await read('src/styles/premium-quran-art-lock.css')],
]);

function requireTokens(source, label, tokens) {
  for (const token of tokens) {
    if (!source.includes(token)) throw new Error(`${label} art palette is missing: ${token}`);
  }
}

requireTokens(domains.get('learning'), 'Learning', [
  '#0d5743',
  '#07372b',
  '#00120f',
  'rgba(226,191,119,.14)',
  'rgba(145,168,158,.8)',
  '#fff8ea',
]);

requireTokens(domains.get('devotional'), 'Duas / Names', [
  'linear-gradient(145deg, #0d5743, #07372b 62%, #00120f) !important',
  'rgba(226, 191, 119, .12)',
  'color: #f2d79a !important',
  'color: rgba(145, 168, 158, .8) !important',
  'dua-hands-v2.webp?v=20260808-release-hardening',
]);

requireTokens(domains.get('worship'), 'Prayer / Qibla', [
  'linear-gradient(145deg, #0d5743, #07372b 62%, #00120f) !important',
  'color: #f2d79a !important',
  'rgba(145, 168, 158, .81)',
  'dome-v2.webp?v=20260808-release-hardening',
  'kaaba-v2.webp?v=20260808-release-hardening',
]);

requireTokens(domains.get('discovery'), 'Mosque / Calendar / Collections', [
  'linear-gradient(145deg, #0d5743, #07372b 61%, #00120f) !important',
  'color: #f2d79a !important',
  'rgba(145, 168, 158, .8)',
  'mosque',
  'sun-emblem-v2.webp?v=20260808-release-hardening',
  'calendar-chip-v2.webp?v=20260808-release-hardening',
  'bookmark-v2.webp?v=20260808-release-hardening',
]);

requireTokens(domains.get('daily'), 'Daily Ayah / Hadith', [
  'linear-gradient(145deg, #0d5743, #07372b 62%, #00120f) !important',
  'rgba(226, 191, 119, .13)',
  'rgba(145, 168, 158, .8)',
  'mihrab-arch-v2.webp?v=20260808-release-hardening',
  'lantern-v2.webp?v=20260808-release-hardening',
]);

requireTokens(domains.get('quran'), 'Quran', [
  'rgba(226, 191, 119, .055)',
  'rgba(13, 87, 67, .045)',
  'color: #e2bf77 !important',
  'color: #8d6d39 !important',
  'quran-closed-v2',
]);

const staleByDomain = new Map([
  ['learning', ['#104534', '#104333', '#06291f', '#05271e', '#02140f', '#02130f', 'rgba(232,199,122', 'rgba(183,203,193', 'rgba(184,204,194']],
  ['devotional', ['#124c3a', '#062a20', '#02140f', 'rgba(232, 199, 122', 'rgba(183, 203, 193', '#eed08b']],
  ['worship', ['#104938', '#062a20', '#02140f', 'rgba(232, 199, 122', 'rgba(185, 204, 194', '#eed08b']],
  ['discovery', ['#124c3a', '#062a20', '#02140f', 'rgba(232, 199, 122', 'rgba(183, 203, 193', '#eed08b']],
  ['daily', ['#124c3a', '#062a20', '#02140f', 'rgba(232, 199, 122', 'rgba(183, 203, 193', '#eed08b']],
  ['quran', ['rgba(232, 199, 122', 'rgba(49, 139, 103', '#b8862e', '#9d792e']],
]);

for (const [domain, staleTokens] of staleByDomain) {
  const source = domains.get(domain);
  for (const stale of staleTokens) {
    if (source.includes(stale)) throw new Error(`${domain} art layer still contains a stale pre-reference token: ${stale}`);
  }
}

console.log('Reference art palette verified: learning, Duas/Names, Prayer/Qibla, Mosque/Calendar/Collections, Daily Ayah/Hadith and Quran accents use the approved emerald/gold/cream family without the known pre-reference near-match colors.');
