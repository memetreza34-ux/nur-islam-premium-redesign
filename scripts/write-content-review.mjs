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
  tier: 'C',
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
  tier: 'B',
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
  tier: 'C',
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
  tier: 'A',
  priority: true,
  note: 'Der einzige Bereich, für den es keine Vorlage gab — diese Texte sind für die App verfasst und daher vorrangig zu prüfen. Sie beschreiben bewusst nur den Ablauf und treffen keine Urteile darüber, was Pflicht ist oder was bei Versäumnissen gilt.',
  rows: stations.map(([, title, reference]) => ({ text: short(title), source: reference ?? '— (keine)', origin: WRITTEN })),
});

// --- Quiz -------------------------------------------------------------------
const quiz = await read('src/data/quizData.ts');
const quizQuestions = values(quiz, 'question');
areas.push({
  name: 'Islam-Quiz',
  tier: 'D',
  note: 'Die Fragen tragen keine Einzelnachweise. Zu prüfen sind Frage, richtige Antwort und Erklärung gemeinsam — eine falsche Erklärung wiegt hier schwerer als eine falsche Frage.',
  rows: quizQuestions.map((question) => ({ text: short(question), source: '— (keine)', origin: CARRIED })),
});

// --- Knowledge --------------------------------------------------------------
const knowledge = await read('src/data/knowledgeData.ts');
const knowledgeTitles = values(knowledge.slice(0, knowledge.indexOf('GLOSSARY_TERMS')), 'title');
areas.push({
  name: 'Wissensbibliothek',
  tier: 'D',
  note: 'Zwölf Themen mit je mehreren Abschnitten. Zu prüfen ist der gesamte Abschnittstext, nicht nur die Überschrift.',
  rows: knowledgeTitles.map((title) => ({ text: short(title), source: '— (keine)', origin: CARRIED })),
});

// --- Prophets ---------------------------------------------------------------
const prophets = await read('src/data/prophetData.ts');
areas.push({
  name: 'Propheten',
  tier: 'D',
  note: 'Je Eintrag sind Einordnung, Beschreibung, Kernpunkte und Lehren zu prüfen.',
  rows: values(prophets, 'name').map((name) => ({ text: name, source: '— (keine)', origin: CARRIED })),
});

// --- Ummah ------------------------------------------------------------------
const ummah = await read('src/data/ummahData.ts');
areas.push({
  name: 'Ummah-Übersicht',
  tier: 'D',
  priority: true,
  note: 'Die absoluten Bevölkerungszahlen sind entfernt: sie trugen weder Quelle noch Stichjahr und lagen gegen Pew (Stand 2020) messbar daneben. Zu prüfen bleiben die Anteile in Prozent, die dieselbe Quellenlücke haben, sowie die Einordnungstexte je Land.',
  rows: values(ummah.slice(ummah.indexOf('UMMAH_COUNTRIES')), 'name').map((name) => ({ text: name, source: '— (undatiert)', origin: CARRIED })),
});

// --- Gebetsablauf -----------------------------------------------------------
// The spoken steps of the prayer: Quranic recitation, the Tashahhud, the
// Salawat and the supplications. Wording that a beginner will repeat verbatim,
// so the Arabic, its transliteration and its German meaning each need checking.
const rakats = await read('src/data/prayerRakatData.ts');
const rakatSteps = [...rakats.matchAll(/const [A-Z_0-9]+: RakatStep = \{[\s\S]*?title: '([^']+)'[\s\S]*?\n\};/g)]
  .map((match) => match[0]);
areas.push({
  name: 'Gebetsablauf (Rakʿah)',
  tier: 'A',
  priority: true,
  note: 'Aus dem Altbestand übernommen. Je Schritt sind arabischer Wortlaut, Umschrift und deutsche Bedeutung zu prüfen — außerdem die Zusammensetzung der Rakʿah, die sich zwischen den Rechtsschulen in Details unterscheidet.',
  rows: rakatSteps.map((step) => ({
    text: /title: '([^']+)'/.exec(step)?.[1] ?? 'Schritt',
    source: /arabic: '/.test(step) ? 'Wortlaut ohne Belegstelle' : '— (Bewegung)',
    origin: CARRIED,
  })),
});

// --- Anleitungen (Wudu, Gebet, Vergesslichkeit) -----------------------------
// Die Anleitungen fehlten hier ganz, obwohl sie beschreiben, wie etwas getan
// wird — und „Wenn etwas schiefgeht“ sagt, was ein Versehen im Gebet nach sich
// zieht. Das sind die Aussagen, bei denen eine Prüfung am meisten trägt.
const guides = await read('src/data/worshipGuideData.ts');
const guideBlock = guides.slice(guides.indexOf('WORSHIP_GUIDES: readonly'));
const guideNames = new Map([
  ['wudu', 'Wudu'], ['salah', 'Salah'], ['what-to-say', 'Wortlaut'],
  ['mandatory', 'Pflichtteile'], ['mistakes', 'Häufige Fehler'], ['sahw', 'Wenn etwas schiefgeht'],
  ['shahada', 'Die Shahada'], ['women', 'Frauen im Gebet'],
  ['more-prayers', 'Weitere Gebete'], ['special-cases', 'Besondere Lagen'],
  ['occasions', 'Zu besonderen Anlässen'],
]);
const guideRows = [];
for (const [, id] of guideBlock.matchAll(/^ {4}id: '([^']+)',$/gm)) {
  const start = guideBlock.indexOf(`id: '${id}'`);
  const rest = guideBlock.slice(start + 1);
  const nextId = rest.search(/^ {4}id: '/m);
  const section = nextId === -1 ? rest : rest.slice(0, nextId);
  for (const title of values(section, 'title')) {
    guideRows.push({
      text: `${guideNames.get(id) ?? id}: ${title}`,
      source: /arabic: '/.test(section) ? 'Wortlaut ohne Belegstelle' : '— (keine)',
        origin: ['sahw', 'shahada', 'women', 'more-prayers', 'special-cases', 'occasions'].includes(id) ? WRITTEN : CARRIED,
    });
  }
}
areas.push({
  name: 'Anleitungen zur Praxis',
  tier: 'A',
  priority: true,
  note: 'Beschreiben, wie etwas getan wird. Sechs sind hier verfasst und besonders zu prüfen: „Wenn etwas schiefgeht“ (Sujud as-Sahw — was ein Versehen nach sich zieht und was nicht), „Die Shahada“ (Wortlaut und die Angaben zum Eintritt in den Islam) „Frauen im Gebet“, wo mehrere Punkte zwischen den Rechtsschulen verlaufen, sowie „Weitere Gebete“ und „Besondere Lagen“ — dort stehen Rakʿah-Zahlen und Erleichterungen (Qasr, Zusammenlegen, Nachholen), die unmittelbar befolgt werden, und „Zu besonderen Anlässen“ mit dem Ablauf des Toten- und des Eid-Gebets.',
  rows: guideRows,
});

// --- Rechtsschulen ----------------------------------------------------------
// Aussagen über die Praxis der vier Schulen sind Aussagen über Fiqh und gehören
// damit zu den prüfbedürftigsten Inhalten der App — auch wenn sie beschreibend
// formuliert sind und keine Belegstelle behaupten.
const madhhab = await read('src/data/madhhabData.ts');
const madhhabBlock = madhhab.slice(madhhab.indexOf('MADHHAB_DIFFERENCES: readonly'), madhhab.indexOf('export const MADHHAB_DIFFERENCES_BY_STEP'));
areas.push({
  name: 'Unterschiede der Rechtsschulen',
  tier: 'A',
  priority: true,
  note: 'Hier verfasst. Je Punkt sind alle vier angegebenen Positionen zu prüfen, und ob die Frage überhaupt so trennscharf zwischen den Schulen verläuft. Innerhalb einer Schule gibt es zu mehreren dieser Punkte mehr als eine überlieferte Position; wo die Angabe das verkürzt, ist sie zu ergänzen.',
  rows: values(madhhabBlock, 'question').map((question) => ({
    text: question,
    source: '— (keine Belegstelle; beschreibende Übersicht)',
    origin: WRITTEN,
  })),
});

// --- Islamischer Kalender ---------------------------------------------------
const events = await read('src/data/islamicEventsData.ts');
const eventBlock = events.slice(events.indexOf('ISLAMIC_EVENTS'), events.indexOf('export const WHITE_DAYS'));
areas.push({
  name: 'Kalendertermine',
  tier: 'D',
  note: 'Aus dem Altbestand übernommen. Zu prüfen sind Hijri-Datum, Bedeutung und die angegebene Praxis — insbesondere dort, wo die Begehung unter Gelehrten unterschiedlich bewertet wird.',
  rows: values(eventBlock, 'title').map((title) => ({
    text: title,
    source: '— (keine)',
    origin: CARRIED,
  })),
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


/**
 * Dieselben Einträge als Prüfmappe zum Ausdrucken.
 *
 * Die Markdown-Liste oben ist für das Repository: sie liegt neben den Daten und
 * fällt im Build auf, wenn sie nicht mehr passt. Nur ist sie für die Person, die
 * tatsächlich prüfen soll, das falsche Format — eine Moschee bekommt keine
 * `.md`-Datei mit Tabellen, in der nichts eingetragen werden kann.
 *
 * Diese Fassung ordnet nach etwas anderem als die Liste: nicht nach Datei,
 * sondern danach, was ein Fehler anrichtet. Wer nur eine Stunde Zeit hat, soll
 * die Stunde auf Stufe A verwenden.
 */
const TIERS = [
  {
    id: 'A',
    title: 'Stufe A — Anweisungen zur Praxis',
    lead:
      'Aussagen darüber, wie etwas getan wird. Wer sie falsch befolgt, betet oder pilgert falsch — '
      + 'ohne es zu merken. Wenn nur für einen Teil Zeit ist, dann für diesen.',
  },
  {
    id: 'B',
    title: 'Stufe B — Wortlaute',
    lead:
      'Arabischer Wortlaut, Umschrift und deutsche Bedeutung. Zu prüfen ist, ob die drei zueinander '
      + 'passen und ob die Bedeutung trägt, was der arabische Text sagt.',
  },
  {
    id: 'C',
    title: 'Stufe C — Belegstellen',
    lead:
      'Überlieferungen und ihre Fundstellen. Wo nur die Sammlung steht, fehlt die Nummer: sie ist '
      + 'nachzutragen und nicht zu schätzen.',
  },
  {
    id: 'D',
    title: 'Stufe D — Übriges',
    lead: 'Wissenstexte, Kalender, Quizfragen und Zahlen. Falsches ist hier ärgerlich, aber folgenlos für die Praxis.',
  },
];

const escape = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const sheetRows = (area) =>
  area.rows
    .map(
      (row) => `        <tr>
          <td class="box"></td>
          <td>${escape(row.text)}${row.origin === WRITTEN ? ' <span class="written">für diese App verfasst</span>' : ''}</td>
          <td class="src">${escape(row.source)}</td>
          <td class="note"></td>
        </tr>`,
    )
    .join('\n');

const sheetSections = TIERS.map((tier) => {
  const tierAreas = areas.filter((area) => area.tier === tier.id);
  const count = tierAreas.reduce((sum, area) => sum + area.rows.length, 0);
  return `    <section class="tier tier--${tier.id}">
      <h2>${tier.title} <span class="count">${count} Einträge</span></h2>
      <p class="lead">${tier.lead}</p>
${tierAreas
  .map(
    (area) => `      <h3>${escape(area.name)}</h3>
      <p class="areanote">${escape(area.note)}</p>
      <table>
        <thead><tr><th>✓</th><th>Inhalt</th><th>Angegebene Quelle</th><th>Anmerkung der Prüfung</th></tr></thead>
        <tbody>
${sheetRows(area)}
        </tbody>
      </table>`,
  )
  .join('\n')}
    </section>`;
}).join('\n');

const sheet = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Nur Islam — Prüfmappe</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; color: #1a1a1a; background: #fff;
         font: 11pt/1.5 "Helvetica Neue", Arial, sans-serif; }
  .wrap { max-width: 980px; margin: 0 auto; }
  h1 { margin: 0 0 4px; font-size: 22pt; }
  .sub { margin: 0 0 20px; color: #555; }
  .intro { padding: 14px 16px; border: 1px solid #ccc; border-radius: 6px; background: #fafafa; }
  .intro p { margin: 0 0 8px; }
  .intro p:last-child { margin: 0; }
  .tier { margin-top: 28px; break-before: page; }
  .tier:first-of-type { break-before: auto; }
  .tier h2 { margin: 0 0 4px; padding-bottom: 6px; border-bottom: 2px solid #1a1a1a; font-size: 15pt; }
  .count { float: right; color: #666; font-size: 10pt; font-weight: 400; }
  .lead { margin: 0 0 14px; color: #444; }
  .tier--A h2 { border-bottom-color: #a1121b; }
  h3 { margin: 18px 0 2px; font-size: 12pt; }
  .areanote { margin: 0 0 8px; color: #666; font-size: 9pt; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
  th, td { padding: 5px 7px; border: 1px solid #ccc; text-align: left; vertical-align: top; font-size: 9.5pt; }
  th { background: #f0f0f0; font-size: 8.5pt; text-transform: uppercase; letter-spacing: .04em; }
  th:first-child, .box { width: 26px; text-align: center; }
  .box::before { content: "☐"; font-size: 13pt; }
  .src { width: 26%; color: #555; }
  .note { width: 26%; background: #fcfcfc; }
  .written { color: #a1121b; font-size: 8pt; white-space: nowrap; }
  tr { break-inside: avoid; }
  .foot { margin-top: 28px; padding-top: 10px; border-top: 1px solid #ccc; color: #666; font-size: 9pt; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>Nur Islam — Inhalte zur fachlichen Prüfung</h1>
    <p class="sub">Stand: ${total} Einträge, davon ${written} für diese App verfasst · erzeugt aus dem Datenbestand der App</p>

    <div class="intro">
      <p><strong>Worum es geht.</strong> Diese Mappe führt jede religiöse Aussage der App auf. Sie ist
      aus den Daten der App erzeugt, nicht von Hand geschrieben — was hier fehlt, steht auch nicht
      in der App, und umgekehrt.</p>
      <p><strong>Was sie nicht leistet.</strong> Sie sagt, <em>ob</em> eine Quelle angegeben ist —
      nicht, ob sie stimmt. Ob eine Belegstelle zutrifft, eine Übersetzung trägt oder eine Aussage
      zur Praxis richtig ist, entscheidet die Prüfung.</p>
      <p><strong>So wird sie benutzt.</strong> Häkchen setzen, wenn ein Eintrag geprüft ist.
      Beanstandungen in die rechte Spalte. Die Reihenfolge der Stufen ist eine Empfehlung: Stufe A
      zuerst, weil ein Fehler dort in der Praxis ankommt.</p>
      <p><strong>Rot markiert</strong> sind Einträge, die für diese App verfasst wurden und nicht aus
      einem geprüften Bestand stammen. Sie brauchen die genaueste Durchsicht.</p>
    </div>

${sheetSections}

    <p class="foot">Rückmeldungen gehen an die Entwicklung; die Quelle sind die Datendateien der App,
    nicht dieses Dokument. Nach jeder Inhaltsänderung wird die Mappe neu erzeugt
    (<code>npm run review:write</code>), damit keine Fassung im Umlauf ist, die
    Einträge bestätigt, die es so nicht mehr gibt.</p>
  </div>
</body>
</html>
`;

const target = resolve(root, 'docs/INHALTE-PRUEFUNG.md');
const sheetTarget = resolve(root, 'docs/pruefmappe.html');

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
  const committedSheet = await readFile(sheetTarget, 'utf8').catch(() => null);
  if (committedSheet !== sheet) {
    throw new Error(
      'docs/pruefmappe.html no longer matches the content in src/data.\n'
        + '  Run npm run review:write and commit the result.',
    );
  }
  console.log(`Content review list verified: ${total} entries in sync with src/data, ${written} written for this app.`);
} else {
  await writeFile(target, document);
  await writeFile(sheetTarget, sheet);
  console.log(areas.map((area) => `  ${String(area.rows.length).padStart(4)}  ${area.name}`).join('\n'));
  console.log(`docs/INHALTE-PRUEFUNG.md geschrieben: ${total} Einträge, ${withoutSource} ohne Einzelnachweis, ${written} hier verfasst.`);
  console.log('docs/pruefmappe.html geschrieben: zum Ausdrucken, nach Dringlichkeit geordnet.');
}
