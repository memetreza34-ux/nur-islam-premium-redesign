/**
 * Sucht für die 25 im Quran namentlich genannten Propheten die Stellen, an
 * denen ihr Name im mitgelieferten Quran-Text steht, und schreibt
 * docs/PROPHETS-QURAN-EVIDENCE.md.
 *
 * Gleiche Regel wie beim Namens-Scan: Belegstellen aus dem Gedächtnis eines
 * Sprachmodells sind keine Belege. Durchsucht wird der Text, den
 * `npm run quran:verify` gegen `quran-uthmani` geprüft und
 * `quran-integrity:check` per sha256 gesichert hat.
 *
 *   npm run prophets:evidence
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();

/**
 * Vergleichsform eines arabischen Wortes.
 *
 * Am Uthmani-Satz sind drei Dinge zu erledigen, die jeweils wie ein Fehlen des
 * Namens aussehen, wenn man sie übergeht — alle drei am Text selbst abgelesen:
 *
 * - `ءَادَمَ` (2:31) schreibt Adam mit Hamza plus Alif, nicht mit `آ`.
 * - `دَاوُۥدُ` (2:251) enthält ein kleines Waw (U+06E5). Das ist kein
 *   Vokalzeichen, sondern ein eigener Buchstabe, den der Mn-Filter stehen lässt.
 * - Manche Langvokale stehen als hochgestelltes Alif, wo die Namensliste ein
 *   volles Alif schreibt. Deshalb werden beide Lesarten erzeugt.
 */
function normalize(text, superscriptAlef) {
  const shaped = text
    .normalize('NFC')
    .replace(/ٱ/g, 'ا')
    .replace(/[ـۥۦ]/g, '')
    .replace(/ٰ/g, superscriptAlef);
  return [...shaped]
    .filter((char) => !/\p{Mn}/u.test(char))
    .join('')
    .replace(/ءا/g, 'ا')
    .replace(/[آأإ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
}

const forms = (text) => new Set([normalize(text, 'ا'), normalize(text, '')]);

/**
 * Namen und arabische Schreibweisen stammen aus src/data/knowledgeData.ts,
 * damit die Liste im Repo steht und nicht in diesem Skript erfunden wird.
 */
const knowledge = await readFile(resolve(root, 'src/data/knowledgeData.ts'), 'utf8');
const topicStart = knowledge.indexOf("title: 'Die 25 Propheten im Islam'");
if (topicStart === -1) throw new Error('The 25-prophets topic is no longer in knowledgeData.ts.');
const topic = knowledge.slice(topicStart, knowledge.indexOf('  },', knowledge.indexOf('sections:', topicStart)));
const prophets = [...topic.matchAll(/subtitle: '(\d+)\. ([^(]+)\(([^)]+)\)'/g)]
  .map((match) => ({ number: Number(match[1]), label: match[2].trim().replace(/\\'/g, "'"), arabic: match[3] }));
if (prophets.length !== 25) throw new Error(`Expected 25 prophets, found ${prophets.length}.`);

async function loadEdition(language) {
  const dir = resolve(root, `public/data/quran/${language}`);
  const verses = [];
  for (const file of await readdir(dir)) {
    const surah = JSON.parse(await readFile(resolve(dir, file), 'utf8'));
    for (const ayah of surah.ayahs) {
      verses.push({ surah: surah.number, ayah: ayah.numberInSurah, ref: `${surah.number}:${ayah.numberInSurah}`, text: ayah.text });
    }
  }
  // readdir yields 1, 10, 100 … so without this the "first occurrence" would
  // be file order rather than the order of the mushaf.
  return verses.sort((left, right) => left.surah - right.surah || left.ayah - right.ayah);
}

/**
 * Die deutsche Wiedergabe kommt online, weil die App sie nicht mehr mitliefert.
 *
 * Der Bestand wurde bewusst auf den Online-Abruf umgestellt: eine geschützte
 * Übersetzung mitzuliefern hieße, sie selbst zu verbreiten. Für dieses
 * Prüfdokument gilt das nicht — es wird lokal erzeugt und nicht ausgeliefert —,
 * also wird hier dieselbe Ausgabe abgerufen, die auch die App anzeigt. So steht
 * im Dokument der Wortlaut, den ein Nutzer tatsächlich zu sehen bekommt.
 */
async function loadGermanEdition(surahNumbers) {
  const verses = new Map();
  for (const number of surahNumbers) {
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}/de.bubenheim`);
      if (!response.ok) continue;
      const payload = await response.json();
      for (const ayah of payload?.data?.ayahs ?? []) {
        verses.set(`${number}:${ayah.numberInSurah}`, ayah.text);
      }
    } catch {
      // Ohne Netz bleibt die deutsche Spalte leer; der arabische Befund steht trotzdem.
    }
  }
  return verses;
}

const arabic = await loadEdition('ar');
// Nur die Suren abrufen, in denen tatsächlich eine erste Fundstelle liegt.
let german = new Map();

// Whole tokens only, with the prefixes Arabic attaches to a name. A substring
// search matches "Ibrahim" inside longer words and inflates every count.
const PREFIX = '(?:^|[\\s]|و|ف|ل|ب|ك|ال)';
// Das Alif des Akkusativ-Tanwin gehört zum Wort: 7:85 schreibt شُعَيْبًۭا, nicht
// شُعَيْب. Ohne dieses optionale Alif fehlt jede Stelle, an der ein Prophet im
// Akkusativ steht — bei Shu'ayb wären das fast alle.
const SUFFIX = 'ا?(?:[\\s]|$)';

const tokenized = arabic.map((verse) => ({ ...verse, bare: [normalize(verse.text, 'ا'), normalize(verse.text, '')] }));

function findRefs(arabicName) {
  const patterns = [...forms(arabicName)].map((form) => new RegExp(`${PREFIX}${form}${SUFFIX}`, 'u'));
  return tokenized
    .filter((verse) => verse.bare.some((bare) => patterns.some((pattern) => pattern.test(` ${bare} `))))
    .map((verse) => verse.ref);
}

/**
 * Schreibweisen, die im Text anders stehen als in der Lernliste. Jede ist am
 * Quran-Text selbst abgelesen, nicht angenommen.
 */
const SPELLINGS = new Map([
  // 21:85 und 38:48 schreiben ذَا ٱلْكِفْلِ — flektiert und in zwei Wörtern.
  [16, 'الكفل'],
]);

const results = prophets.map((prophet) => ({
  ...prophet,
  refs: findRefs(SPELLINGS.get(prophet.number) ?? prophet.arabic),
}));

// Control: six surahs carry a prophet's name as their own title, so the name
// has to be found inside that surah. If it is not, the matching is broken and
// no other count here can be trusted.
// Adam und Dawud stehen zusätzlich drin, weil genau ihre Schreibweisen den
// ersten Durchlauf stillschweigend leer ausgehen ließen: 2:31 schreibt ءَادَمَ,
// 2:251 دَاوُۥدُ. Beide Stellen wurden im Text nachgesehen.
const CONTROL = [[21, 10], [4, 11], [11, 12], [6, 14], [25, 47], [3, 71], [1, 2], [17, 2], [13, 7]];
for (const [prophetNumber, surah] of CONTROL) {
  const entry = results.find((item) => item.number === prophetNumber);
  if (!entry?.refs.some((ref) => Number(ref.split(':')[0]) === surah)) {
    throw new Error(`Scan fails the control: ${entry?.label} not found in surah ${surah}, which is named after them.`);
  }
}

/**
 * Namen, die zugleich gewöhnliche arabische Wörter sind. Ein Treffer kann dort
 * das Wort statt der Person meinen, deshalb wird die Zahl nicht als Zahl der
 * Nennungen ausgegeben.
 */
const HOMOGRAPHS = new Map([
  [5, 'صالح ist auch das gewöhnliche Wort für „rechtschaffen". Treffer können das Adjektiv meinen.'],
  [4, 'هود steht auch für „Juden" (etwa 2:111). Treffer können das Volk meinen.'],
  [23, 'يحيى ist auch die Verbform „er lebt". Treffer können das Verb meinen.'],
  [16, 'ذو الكفل steht im Quran flektiert (ذَا ٱلْكِفْلِ); gesucht wurde die Grundform.'],
]);

german = await loadGermanEdition([...new Set(results.flatMap((entry) => entry.refs.slice(0, 1)).map((ref) => Number(ref.split(':')[0])))]);

const shorten = (text) => (text.length > 240 ? `${text.slice(0, 239)}…` : text);
const withRefs = results.filter((entry) => entry.refs.length);
const withoutRefs = results.filter((entry) => !entry.refs.length);

const lines = [
  '# Belegstellen der 25 Propheten im Quran-Text',
  '',
  '<!-- Erzeugt von scripts/scan-quran-prophet-evidence.mjs · npm run prophets:evidence',
  '     Nicht von Hand bearbeiten. -->',
  '',
  '**Dies ist keine Freigabe.** Es weist eine einzige Sache nach: dass der Name',
  'im Quran-Text vorkommt, und wo.',
  '',
  'Durchsucht wurde der mitgelieferte Bestand — derselbe Text, den',
  '`npm run quran:verify` Ayah für Ayah gegen `quran-uthmani` geprüft hat und den',
  '`npm run quran-integrity:check` per sha256 sichert. Jede Stelle ist',
  'nachschlagbar.',
  '',
  '## Was hier nicht bewiesen wird',
  '',
  'Was die App über einen Propheten **erzählt**. Dass „Nuh" in Sure 71 steht,',
  'belegt nicht, dass er 950 Jahre predigte — das steht in 29:14, und dort steht',
  '„weilte unter ihnen", nicht „predigte". Für jede erzählte Einzelheit muss die',
  'Stelle einzeln geprüft werden, die sie trägt.',
  '',
  'Gesucht wurde nach ganzen Wörtern mit den arabischen Vorsilben, nicht nach',
  'Zeichenketten — sonst zählt jedes längere Wort mit, das den Namen enthält.',
  '',
  'Die Zahlen sind **gefundene Fundstellen dieser Schreibweise**, keine Aussage',
  'darüber, wie oft ein Prophet insgesamt im Quran erwähnt wird. Nennungen ohne',
  'den Namen („ihr Bruder", „der Gefährte des Fisches") zählt kein Textsuchlauf',
  'mit, und seltene Formen können durchrutschen. Nach unten ist die Zahl also',
  'belastbar, nach oben nicht.',
  '',
  '## Stand',
  '',
  `- **${withRefs.length} von 25** Namen kommen im Quran-Text vor.`,
  withoutRefs.length ? `- **${withoutRefs.length}** wurden in dieser Schreibweise nicht gefunden.` : '- Alle 25 wurden gefunden.',
  '- Kontrolle: sechs Suren tragen den Namen eines Propheten als Titel. Der Scan findet jeden davon in seiner eigenen Sure, sonst bricht er ab.',
  '',
  '---',
  '',
  '| # | Prophet | Arabisch | Stellen | Erste Fundstelle |',
  '| --: | --- | --- | --: | --- |',
];

for (const entry of results) {
  const first = entry.refs[0] ?? '—';
  lines.push(`| ${entry.number} | ${entry.label} | ${entry.arabic} | ${entry.refs.length || '—'} | ${first} |`);
}
lines.push('', '---', '', '## Einzeln', '');

for (const entry of results) {
  lines.push(`### ${entry.number}. ${entry.label} · ${entry.arabic}`, '');
  if (!entry.refs.length) {
    lines.push('In dieser Schreibweise nicht im Text gefunden. Das kann an der Schreibweise liegen und ist kein Urteil über den Eintrag.', '', 'Geprüft: ☐', '');
    continue;
  }
  const warning = HOMOGRAPHS.get(entry.number);
  if (warning) lines.push(`> **Vorsicht beim Zählen:** ${warning}`, '');
  lines.push(`${entry.refs.length} Fundstelle${entry.refs.length === 1 ? '' : 'n'}.`, '');
  lines.push(`**${entry.refs[0]}** — ${shorten(german.get(entry.refs[0]) ?? '')}`, '');
  if (entry.refs.length > 1) {
    lines.push(`Weitere: ${entry.refs.slice(1, 15).join(', ')}${entry.refs.length > 15 ? ` … (${entry.refs.length - 15} weitere)` : ''}`, '');
  }
  lines.push('Geprüft: ☐', '');
}

await writeFile(resolve(root, 'docs/PROPHETS-QURAN-EVIDENCE.md'), lines.join('\n'), 'utf8');
console.log(`Prophet evidence scan: ${withRefs.length}/25 names occur in the bundled Quran text; the six eponymous-surah controls passed. Wrote docs/PROPHETS-QURAN-EVIDENCE.md.`);
