/**
 * Writes docs/INHALTE-PRUEFUNG.md — the list a qualified reviewer works through.
 *
 * Generated rather than written by hand, for one reason: a hand-kept checklist
 * goes stale on the first content change and then quietly certifies entries
 * nobody looked at. This is regenerated from the data files, so an item that
 * does not exist cannot appear, and an item that was added cannot be missing.
 *
 * What it can and cannot do: it reports whether a source is present and where
 * the text came from. It cannot tell whether a citation is correct, whether a
 * translation is sound, or whether a statement of practice is right. That is
 * the review itself, and it is a human step.
 *
 *   npm run review:write
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (file) => readFile(resolve(root, file), 'utf8');

const CARRIED = 'übernommen';
const WRITTEN = 'hier verfasst';

/**
 * Pulls `field: '...'` values in document order, honouring escaped quotes.
 *
 * Anchored to the start of the property: an unanchored search for `title`
 * also matches `subtitle`, which counted every section of every knowledge topic
 * as a topic of its own.
 */
function values(source, field) {
  return [...source.matchAll(new RegExp(`(?:^|[^A-Za-z])${field}: '((?:[^'\\\\]|\\\\.)*)'`, 'gm'))]
    .map((match) => match[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
}

function table(rows) {
  return [
    '| Nr. | Inhalt | Quelle | Herkunft | geprüft |',
    '|---:|---|---|---|:---:|',
    ...rows.map((row, index) => `| ${index + 1} | ${row.text} | ${row.source} | ${row.origin} | ☐ |`),
  ].join('\n');
}

const short = (text, limit = 90) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length <= limit ? clean : `${clean.slice(0, limit - 1)}…`;
};

const areas = [];

// --- Hadith -----------------------------------------------------------------
const hadith = await read('src/data/hadithData.ts');
const hadithLibrary = hadith.slice(hadith.indexOf('export const HADITH_LIBRARY'), hadith.indexOf('\n] as const;'));
const hadithTitles = values(hadithLibrary, 'title');
const hadithSources = values(hadithLibrary, 'source');
areas.push({
  name: 'Hadith-Sammlung',
  note: 'Jeder Eintrag ist ausdrücklich als sinngemäße Inhaltsangabe gekennzeichnet, nicht als Wortlaut. Wo die Belegstelle keine Nummer trägt, fehlt sie im Altbestand — sie ist nachzutragen, nicht zu schätzen.',
  rows: hadithTitles.map((title, index) => ({
    text: short(title),
    source: hadithSources[index] ?? '—',
    origin: CARRIED,
  })),
});

// --- Duas -------------------------------------------------------------------
const duasFile = await read('src/data/duaData.ts');
// Scoped to DUAS: the file also exports DUA_CATEGORIES, whose thirteen entries
// carry a `title` of their own and are navigation, not content to review.
const duas = duasFile.slice(duasFile.indexOf('export const DUAS'), duasFile.indexOf('export const DUA_BY_ID'));
const duaTitles = values(duas, 'title');
const duaSources = values(duas, 'source');
areas.push({
  name: 'Duas',
  note: 'Bestand der App, jeder Eintrag mit Quellenangabe.',
  rows: duaTitles.map((title, index) => ({ text: short(title), source: duaSources[index] ?? '—', origin: CARRIED })),
});

// --- Sunnah and repentance --------------------------------------------------
const practice = await read('src/data/practiceData.ts');
const practiceItems = [...practice.matchAll(
  /title: '((?:[^'\\]|\\.)*)',\n\s+description: '(?:[^'\\]|\\.)*',\n\s+proof: '((?:[^'\\]|\\.)*)',/g,
)];
areas.push({
  name: 'Sunnah im Alltag · Fehler und Reue',
  note: 'Jeder Eintrag führt den Beleg mit, der im Altbestand hinterlegt war. Der Wortlaut der Belege ist mitzuprüfen.',
  rows: practiceItems.map(([, title, proof]) => ({ text: short(title), source: short(proof, 60), origin: CARRIED })),
});

// --- Pilgrimage -------------------------------------------------------------
const pilgrimage = await read('src/data/pilgrimageData.ts');
const stations = [...pilgrimage.matchAll(
  /id: '[^']+',\n\s+(?:when|name): '(?:[^'\\]|\\.)*',\n\s+(?:title|city): '((?:[^'\\]|\\.)*)',\n\s+description: '(?:[^'\\]|\\.)*',(?:\n\s+reference: '((?:[^'\\]|\\.)*)',)?/g,
)];
areas.push({
  name: 'Hajj, Umrah und heilige Stätten',
  priority: true,
  note: 'Der einzige Bereich, für den es keine Vorlage gab — diese Texte sind für die App verfasst und daher vorrangig zu prüfen. Sie beschreiben bewusst nur den Ablauf und treffen keine Urteile darüber, was Pflicht ist oder was bei Versäumnissen gilt.',
  rows: stations.map(([, title, reference]) => ({ text: short(title), source: reference ?? '— (keine)', origin: WRITTEN })),
});

// --- Quiz -------------------------------------------------------------------
const quiz = await read('src/data/quizData.ts');
const quizQuestions = values(quiz, 'question');
areas.push({
  name: 'Islam-Quiz',
  note: 'Die Fragen tragen keine Einzelnachweise. Zu prüfen sind Frage, richtige Antwort und Erklärung gemeinsam — eine falsche Erklärung wiegt hier schwerer als eine falsche Frage.',
  rows: quizQuestions.map((question) => ({ text: short(question), source: '— (keine)', origin: CARRIED })),
});

// --- Knowledge --------------------------------------------------------------
const knowledge = await read('src/data/knowledgeData.ts');
const knowledgeTitles = values(knowledge.slice(0, knowledge.indexOf('GLOSSARY_TERMS')), 'title');
areas.push({
  name: 'Wissensbibliothek',
  note: 'Zwölf Themen mit je mehreren Abschnitten. Zu prüfen ist der gesamte Abschnittstext, nicht nur die Überschrift.',
  rows: knowledgeTitles.map((title) => ({ text: short(title), source: '— (keine)', origin: CARRIED })),
});

// --- Prophets ---------------------------------------------------------------
const prophets = await read('src/data/prophetData.ts');
areas.push({
  name: 'Propheten',
  note: 'Je Eintrag sind Einordnung, Beschreibung, Kernpunkte und Lehren zu prüfen.',
  rows: values(prophets, 'name').map((name) => ({ text: name, source: '— (keine)', origin: CARRIED })),
});

// --- Ummah ------------------------------------------------------------------
const ummah = await read('src/data/ummahData.ts');
areas.push({
  name: 'Ummah-Übersicht',
  priority: true,
  note: 'Die Zahlen tragen im Altbestand weder Quelle noch Stichjahr. Sie sind entweder durch eine datierte Quelle zu ersetzen oder zu entfernen. Die App weist derzeit offen darauf hin.',
  rows: values(ummah.slice(ummah.indexOf('UMMAH_COUNTRIES')), 'name').map((name) => ({ text: name, source: '— (undatiert)', origin: CARRIED })),
});

// --- Report -----------------------------------------------------------------
const total = areas.reduce((count, area) => count + area.rows.length, 0);
const withoutSource = areas.reduce(
  (count, area) => count + area.rows.filter((row) => row.source.startsWith('—')).length,
  0,
);
const written = areas.reduce((count, area) => count + area.rows.filter((row) => row.origin === WRITTEN).length, 0);

const document = `# Inhalte zur fachlichen Prüfung

> **Erzeugt, nicht von Hand gepflegt.** Neu erzeugen mit \`npm run review:write\`.
> Eine handgeführte Liste veraltet bei der ersten Inhaltsänderung und bestätigt
> danach Einträge, die niemand gesehen hat.

Diese Liste führt jede religiöse Aussage der App auf, mit ihrer Quelle und ihrer
Herkunft. Sie sagt, **ob** eine Quelle da ist — nicht, ob sie **stimmt**. Ob eine
Belegstelle zutrifft, eine Übersetzung trägt oder eine Aussage zur Praxis richtig
ist, entscheidet die Prüfung selbst.

## Überblick

| | |
|---|---|
| Einträge insgesamt | ${total} |
| davon ohne Einzelnachweis | ${withoutSource} |
| davon für diese App verfasst | ${written} |

## Zuerst prüfen

1. **Hajj, Umrah und heilige Stätten** — der einzige Bereich, den niemand vorher
   geschrieben hat. Alles andere wurde aus \`memetreza34-ux/nur-islam\`
   übernommen; diese Texte entstanden für diese App.
2. **Ummah-Zahlen** — undatiert und ohne Quelle. Entweder datierte Quelle
   nachtragen oder entfernen.
3. **Hadith-Belegstellen ohne Nummer** — im Altbestand nur mit Sammlungsnamen
   hinterlegt. Nummern nachtragen, nicht schätzen.

## Wie zu verwenden

Pro Zeile ein Häkchen setzen, wenn der Eintrag geprüft ist. Bei Beanstandungen
den Eintrag hier markieren und die Korrektur an die Entwicklung geben — die
Datendateien unter \`src/data/\` sind die Quelle, nicht dieses Dokument.

${areas.map((area) => [
  `## ${area.name}${area.priority ? ' ⚠️' : ''}`,
  '',
  area.note,
  '',
  table(area.rows),
].join('\n')).join('\n\n')}

---

*99 Namen Allahs, Dhikr-Routinen und die Lernlektionen sind über
\`npm run content:report\` gesondert erfasst und dort bereits mit ihrer
Quellenlage ausgewiesen.*
`;

const target = resolve(root, 'docs/INHALTE-PRUEFUNG.md');

// `--check` compares instead of writing, so the release chain can catch a list
// that no longer matches the data. A checklist that silently under-reports is
// worse than none: it certifies entries nobody was shown.
if (process.argv.includes('--check')) {
  const committed = await readFile(target, 'utf8').catch(() => null);
  if (committed === null) {
    throw new Error('docs/INHALTE-PRUEFUNG.md is missing. Run npm run review:write.');
  }
  if (committed !== document) {
    throw new Error(
      'docs/INHALTE-PRUEFUNG.md no longer matches the content in src/data.\n'
        + '  Run npm run review:write and commit the result.',
    );
  }
  console.log(`Content review list verified: ${total} entries in sync with src/data, ${written} written for this app.`);
} else {
  await writeFile(target, document);
  console.log(areas.map((area) => `  ${String(area.rows.length).padStart(4)}  ${area.name}`).join('\n'));
  console.log(`docs/INHALTE-PRUEFUNG.md geschrieben: ${total} Einträge, ${withoutSource} ohne Einzelnachweis, ${written} hier verfasst.`);
}
