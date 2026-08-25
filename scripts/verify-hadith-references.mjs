/**
 * Prüft die Hadith-Nummern der App gegen eine öffentlich abrufbare Ausgabe und
 * schreibt docs/HADITH-REFERENCE-CHECK.md.
 *
 * Warum das nicht Teil von `npm run check` ist: es braucht Netz, wie
 * `quran:verify`. Und warum es überhaupt existiert: die Hadith-Sammlungen
 * liegen nicht im Repo, also war jede Nummer hier bis eben unprüfbar — außer
 * man vertraut dem Gedächtnis eines Menschen oder eines Modells, und genau das
 * soll diese App nirgends tun.
 *
 *   npm run hadith:verify
 *
 * WICHTIG, und der Grund, warum unten nur Bukhari geprüft wird:
 *
 * Für Sahih al-Bukhari stimmt die Nummerierung dieser Ausgabe mit der von
 * sunnah.com überein, auf die sich die App bezieht. Drei unabhängige Proben
 * belegen das und laufen bei jedem Durchlauf mit.
 *
 * Für Sahih Muslim stimmt sie NICHT. Die Ausgabe zählt durchlaufend bis 7563;
 * die App verwendet die Zählung mit Buchstabenzusätzen (2677a), die dort bis
 * etwa 2996 reicht. Die 99-Namen-Überlieferung steht hier unter 6809/6810 und
 * bei sunnah.com unter 2677a/2677b — dieselbe Überlieferung, zwei Systeme. Eine
 * Prüfung „Nummer gegen Nummer" würde deshalb lauter Fehler melden, die keine
 * sind. Muslim, Tirmidhi und Ibn Majah werden hier daher nur auf eine
 * plausible Größenordnung geprüft und ausdrücklich als ungeprüft ausgewiesen.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const EDITION = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari.min.json';
const TIRMIDHI = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-tirmidhi.min.json';

const response = await fetch(EDITION);
if (!response.ok) throw new Error(`Could not load the Bukhari edition: HTTP ${response.status}`);
const edition = await response.json();
const bukhari = new Map(edition.hadiths.map((entry) => [entry.hadithnumber, entry.text]));

// Proben. Wenn eine davon nicht mehr passt, zählt die Ausgabe anders als die
// App zitiert, und kein Ergebnis darunter wäre etwas wert.
const CONTROLS = [
  [1, 'intentions', /reward of deeds depends upon the intentions/i],
  [7392, 'ninety-nine names', /ninety-nine Names/i],
  [164, "Uthman's wudu", /ablution/i],
];
for (const [number, label, pattern] of CONTROLS) {
  const text = bukhari.get(number);
  if (!text || !pattern.test(text)) {
    throw new Error(`Numbering control failed: Bukhari ${number} is not the ${label} hadith in this edition.`);
  }
}

// Tirmidhi carries per-scholar gradings in this edition, and the app cites it
// eleven times. A grading is a judgement, not a fact, so all of them are
// listed by name rather than reduced to one verdict.
const tirmidhiResponse = await fetch(TIRMIDHI);
if (!tirmidhiResponse.ok) throw new Error(`Could not load the Tirmidhi edition: HTTP ${tirmidhiResponse.status}`);
const tirmidhi = new Map(
  (await tirmidhiResponse.json()).hadiths.map((entry) => [entry.hadithnumber, entry]),
);

// Control for the gradings: 3507 is the report that enumerates the ninety-nine
// names, and every grader in this edition calls it weak. If that stops being
// true the grading data has changed shape and nothing below can be trusted.
const enumeration = tirmidhi.get(3507);
if (!enumeration || !/ninety-nine Names/i.test(enumeration.text) || !enumeration.grades?.length) {
  throw new Error('Grading control failed: Tirmidhi 3507 is not the enumerated ninety-nine-names report here.');
}

const dataDir = resolve(root, 'src/data');
const sources = new Map();
for (const file of await readdir(dataDir)) {
  if (!file.endsWith('.ts') || file.includes('.test.')) continue;
  sources.set(file, await readFile(resolve(dataDir, file), 'utf8'));
}

const cited = new Map();
const citedTirmidhi = new Map();
for (const [file, text] of sources) {
  for (const match of text.matchAll(/Sahih al-Bukhari (\d+)/g)) {
    const number = Number(match[1]);
    if (!cited.has(number)) cited.set(number, new Set());
    cited.get(number).add(file);
  }
  for (const match of text.matchAll(/Jami at-Tirmidhi (\d+)/g)) {
    const number = Number(match[1]);
    if (!citedTirmidhi.has(number)) citedTirmidhi.set(number, new Set());
    citedTirmidhi.get(number).add(file);
  }
}

const missing = [...cited.keys()].filter((number) => !bukhari.has(number)).sort((left, right) => left - right);

// Für Muslim, Tirmidhi und Ibn Majah nur eine Grobprüfung: eine Nummer weit
// jenseits des Umfangs der Sammlung ist mit Sicherheit falsch, eine innerhalb
// ist damit noch lange nicht richtig.
const LIMITS = new Map([['Sahih Muslim', 3033], ['Jami at-Tirmidhi', 3956], ['Sunan Ibn Majah', 4341]]);
const outOfRange = [];
for (const [file, text] of sources) {
  for (const [collection, limit] of LIMITS) {
    for (const match of text.matchAll(new RegExp(`${collection} (\\\\d+)`, 'g'))) {
      if (Number(match[1]) > limit) outOfRange.push(`${collection} ${match[1]} (${file})`);
    }
  }
}

const shorten = (text) => text.replace(/\s+/g, ' ').slice(0, 400);
const lines = [
  '# Prüfung der Hadith-Nummern',
  '',
  '<!-- Erzeugt von scripts/verify-hadith-references.mjs · npm run hadith:verify',
  '     Nicht von Hand bearbeiten. -->',
  '',
  '**Dies ist keine Freigabe.** Geprüft wird eine einzige Sache: ob die zitierte',
  'Nummer in der Sammlung existiert und welcher Text dort steht.',
  '',
  '## Was hier geprüft werden kann und was nicht',
  '',
  'Die Sammlungen liegen nicht im Repo. Geprüft wird gegen eine öffentlich',
  `abrufbare Ausgabe (\`${EDITION}\`), deren Herkunft im Datensatz selbst nicht`,
  'dokumentiert ist — das ist ausdrücklich kein Ersatz für den Druck.',
  '',
  '**Sahih al-Bukhari:** Die Nummerierung dieser Ausgabe stimmt mit der von',
  'sunnah.com überein, auf die sich die App bezieht. Drei Proben laufen bei',
  'jedem Durchlauf mit und brechen ab, wenn das nicht mehr gilt.',
  '',
  '**Sahih Muslim, Tirmidhi, Ibn Majah:** Nicht nach Nummer prüfbar. Die',
  'verfügbare Muslim-Ausgabe zählt durchlaufend bis 7563, die App zitiert die',
  'Zählung mit Buchstabenzusätzen (2677a). Dieselbe Überlieferung steht dort',
  'unter 6809, hier unter 2677a. Eine Prüfung Nummer gegen Nummer würde lauter',
  'Fehler melden, die keine sind, und ist deshalb unterlassen.',
  '',
  '## Ergebnis',
  '',
  `- **${cited.size}** verschiedene Bukhari-Nummern in \`src/data\` zitiert.`,
  `- **${cited.size - missing.length}** davon existieren in der Ausgabe.`,
  missing.length ? `- **${missing.length} existieren nicht:** ${missing.join(', ')}` : '- **Keine zitierte Nummer fehlt.**',
  outOfRange.length ? `- **Außerhalb des Umfangs ihrer Sammlung:** ${outOfRange.join('; ')}` : '- Keine Muslim-, Tirmidhi- oder Ibn-Majah-Nummer liegt jenseits des Umfangs ihrer Sammlung.',
  '',
  '---',
  '',
  '## Zitierte Bukhari-Stellen im Wortlaut',
  '',
  'Zum Abgleich mit der deutschen Inhaltsangabe in der App. Der Text ist eine',
  'englische Übersetzung, gekürzt.',
  '',
];

lines.push(
  '## Woher die verbreitete 99er-Liste stammt',
  '',
  'Beim Prüfen aufgefallen und hier festgehalten, weil es die Beleglage der',
  'Namensliste direkt betrifft:',
  '',
  `- **Sahih al-Bukhari 7392** und **Sahih Muslim 2677a** überliefern, dass es neunundneunzig Namen gibt — ohne sie aufzuzählen.`,
  `- **Jami at-Tirmidhi 3507** enthält die Aufzählung. In dieser Ausgabe stufen sie ${enumeration.grades.map((grade) => `${grade.name} (${grade.grade})`).join(', ')} ein.`,
  '',
  'Das ist kein Urteil über einen einzelnen Namen. Es heißt: die *konkrete',
  'Zusammenstellung*, die fast überall als „die 99 Namen" erscheint, hängt an',
  'einer Überlieferung, deren Aufzählung schwach eingestuft wird — und genau',
  'deshalb zeigt die App die Liste als Lernliste und nicht als feststehende',
  'Offenbarung.',
  '',
  '---',
  '',
  '## Zitierte Tirmidhi-Stellen mit Einstufungen',
  '',
  'Einstufungen sind Urteile von Gelehrten, keine Tatsachen. Sie stehen deshalb',
  'alle nebeneinander, mit Namen.',
  '',
  '| Nummer | Einstufungen | Zitiert in |',
  '| --- | --- | --- |',
);
for (const number of [...citedTirmidhi.keys()].sort((left, right) => left - right)) {
  const entry = tirmidhi.get(number);
  const grades = entry?.grades?.length
    ? entry.grades.map((grade) => `${grade.name}: ${grade.grade}`).join(' · ')
    : '**in der Ausgabe nicht gefunden**';
  lines.push(`| ${number} | ${grades} | ${[...citedTirmidhi.get(number)].sort().join(', ')} |`);
}
lines.push('', '---', '', '## Zitierte Bukhari-Stellen im Wortlaut (Fortsetzung)', '');

for (const number of [...cited.keys()].sort((left, right) => left - right)) {
  const text = bukhari.get(number);
  lines.push(`### Sahih al-Bukhari ${number}`, '', `Zitiert in: ${[...cited.get(number)].sort().join(', ')}`, '');
  lines.push(text ? `> ${shorten(text)}` : '> **Nicht in der Ausgabe gefunden.**', '', 'Stimmt mit der Angabe in der App überein: ☐', '');
}

await writeFile(resolve(root, 'docs/HADITH-REFERENCE-CHECK.md'), lines.join('\n'), 'utf8');
console.log(`Hadith reference check: ${cited.size} distinct Bukhari numbers cited, ${cited.size - missing.length} exist in the edition, ${citedTirmidhi.size} Tirmidhi numbers listed with their per-scholar gradings${missing.length ? `, MISSING: ${missing.join(', ')}` : ''}. ${outOfRange.length ? `Out of range: ${outOfRange.join('; ')}` : 'No other citation is out of its collection range.'} Wrote docs/HADITH-REFERENCE-CHECK.md.`);
if (missing.length || outOfRange.length) process.exitCode = 1;
