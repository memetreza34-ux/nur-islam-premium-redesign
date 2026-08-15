/**
 * Gleicht die hinterlegten Aufnahmen mit der Quelle ab.
 *
 * Die Formel-Aufnahmen heißen bei der Quelle nur `33.mp3`. Zugeordnet wurden
 * sie über den arabischen Text, den dieselbe Quelle zu jeder Datei ausliefert;
 * `prayerRakatData.test.ts` hält das Ergebnis fest. Dieses Skript prüft die
 * andere Richtung: ob die Quelle heute noch denselben Text zu derselben Datei
 * liefert — und ob die Dateien überhaupt erreichbar sind.
 *
 * Nicht Teil von `npm run check`: es hängt an einem fremden Server, und ein
 * Netzausfall dort darf keinen Build rot machen. Vor einer Veröffentlichung und
 * nach jeder Änderung an den Aufnahmen ist es der Weg, das zu prüfen:
 *
 *   npm run recitation:verify
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const source = await readFile(resolve(root, 'src/data/prayerRakatData.ts'), 'utf8');

/** Diakritika und Satzzeichen weg — verglichen wird der Konsonantentext. */
const bare = (text) => text.replace(/[ً-ْٰـ]/g, '').replace(/[^ء-ي]/g, '');

// Kapitel der Quelle, in denen die Formeln des Gebets stehen.
const CHAPTERS = [16, 17, 18, 19, 20, 22, 23];
const fetchJson = async (url) => {
  const response = await fetch(url, { headers: { 'User-Agent': 'nur-islam-verify' } });
  if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`);
  return JSON.parse((await response.text()).replace(/^﻿/, ''));
};

console.log('Lade die Textliste der Quelle …');
const catalogue = new Map();
for (const chapter of CHAPTERS) {
  const data = await fetchJson(`https://www.hisnmuslim.com/api/ar/${chapter}.json`);
  for (const entry of Object.values(data).flat()) {
    if (entry.AUDIO) catalogue.set(entry.AUDIO.replace(/^http:/, 'https:'), entry);
  }
}

// Jede im Datensatz hinterlegte Aufnahme mit ihrem Wortlaut.
const steps = [...source.matchAll(/const ([A-Z_0-9]+): RakatStep = \{([\s\S]*?)\n\};/g)];
const problems = [];
let checked = 0;

for (const [, name, body] of steps) {
  const url = /audioUrl: '([^']+)'/.exec(body)?.[1];
  if (!url) continue;
  checked += 1;
  const arabic = /arabic: '([^']+)'/.exec(body)?.[1] ?? '';
  const entry = catalogue.get(url);

  if (!entry) {
    problems.push(`${name}: ${url} kommt in den Kapiteln der Quelle nicht mehr vor.`);
    continue;
  }
  if (!bare(entry.ARABIC_TEXT).includes(bare(arabic))) {
    problems.push(
      `${name}: Die Quelle liefert zu ${url} einen anderen Wortlaut.\n` +
        `    hinterlegt: ${arabic.slice(0, 70)}\n` +
        `    Quelle:     ${entry.ARABIC_TEXT.slice(0, 70)}`,
    );
    continue;
  }
  const head = await fetch(url, { method: 'HEAD' });
  if (!head.ok) problems.push(`${name}: ${url} ist nicht erreichbar (HTTP ${head.status}).`);
  else if (!(head.headers.get('content-type') ?? '').includes('audio')) {
    problems.push(`${name}: ${url} liefert kein Audio (${head.headers.get('content-type')}).`);
  }
}

if (problems.length) {
  console.error(`\n${problems.length} Problem(e):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}

console.log(
  `Rezitationen geprüft: ${checked} Aufnahmen, jede erreichbar und mit dem Wortlaut belegt, ` +
    'den die Quelle zu derselben Datei ausliefert.',
);
