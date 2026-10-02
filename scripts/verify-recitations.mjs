/**
 * Prüft vor einem Release, ob die im Gebetskurs verwendeten
 * Quran-Rezitationen bei Islamic Network erreichbar sind.
 *
 * Nicht Teil von `npm run check`: Ein Ausfall des fremden Dienstes darf den
 * lokalen Build nicht fehlschlagen lassen.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const source = await readFile(resolve(root, 'src/data/prayerRakatData.ts'), 'utf8');
const ayahs = [...new Set(
  [...source.matchAll(/audioAyahs:\s*\[([^\]]+)\]/g)]
    .flatMap((match) => match[1].split(',').map((value) => Number(value.trim())))
    .filter(Number.isFinite),
)];

if (!ayahs.length) throw new Error('Keine Quran-Versnummern für die Audioprüfung gefunden.');

const problems = [];
for (const ayah of ayahs) {
  const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah}.mp3`;
  const response = await fetch(url, { method: 'HEAD' });
  if (!response.ok) problems.push(`${url} ist nicht erreichbar (HTTP ${response.status}).`);
  else if (!(response.headers.get('content-type') ?? '').includes('audio')) {
    problems.push(`${url} liefert kein Audio (${response.headers.get('content-type')}).`);
  }
}

if (problems.length) {
  console.error(`\n${problems.length} Problem(e):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}

console.log(`Rezitationen geprüft: ${ayahs.length} Quran-Aufnahmen sind erreichbar.`);
