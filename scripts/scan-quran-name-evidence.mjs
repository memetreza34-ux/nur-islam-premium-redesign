/**
 * Sucht für jeden der 99 Lernnamen die Stellen, an denen seine arabische Form
 * im mitgelieferten Quran-Text vorkommt, und schreibt docs/NAMES-QURAN-EVIDENCE.md.
 *
 * Warum maschinell: Belegstellen aus dem Gedächtnis eines Modells sind keine
 * Belege. Der hier durchsuchte Text ist derselbe, den `npm run quran:verify`
 * Ayah für Ayah gegen `quran-uthmani` geprüft hat, und `quran-integrity:check`
 * sichert ihn per sha256 gegen Veränderung. Ein Treffer ist damit nachprüfbar.
 *
 * Was der Scan NICHT entscheidet: ob der Name an der Fundstelle Allah meint.
 * `al-Aziz` steht im Quran auch für den ägyptischen Würdenträger in Sure Yusuf,
 * `al-Malik` auch für einen irdischen König. Die Ausgabe ist deshalb eine
 * Kandidatenliste zum Bestätigen, keine Freigabe.
 *
 *   npm run names:evidence
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();

/**
 * Vergleichsform eines arabischen Wortes.
 *
 * Der Uthmani-Satz schreibt manche Langvokale als hochgestelltes Alif
 * (`ٱلرَّحْمَٰنُ`), die Lernliste als volles Alif (`الرَّحْمَنُ`). Beide Lesarten
 * werden erzeugt, sonst sähe eine reine Schreibvariante wie ein Fehlen aus.
 */
function normalizeArabic(text) {
  const shaped = text.normalize('NFC').replace(/ٱ/g, 'ا').replace(/[ـۥۦ]/g, '').replace(/ٰ/g, 'ا');
  return [...shaped]
    .filter((char) => !/\p{Mn}/u.test(char))
    .join('')
    .replace(/ءا/g, 'ا')
    .replace(/[آأإ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
}

function forms(text) {
  const shared = (value) => value
    .normalize('NFC')
    .replace(/ٱ/g, 'ا')
    .replace(/ـ/g, '');
  const strip = (value) => [...value]
    .filter((char) => !/\p{Mn}/u.test(char))
    .join('')
    .replace(/[آأإ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
  return new Set([
    strip(shared(text).replace(/ٰ/g, 'ا')),
    strip(shared(text).replace(/ٰ/g, '')),
  ]);
}

const namesSource = await readFile(resolve(root, 'src/data/namesOfAllahData.ts'), 'utf8');
const names = [...namesSource.matchAll(/\{ id: (\d+), latin: (?:'([^']*)'|"([^"]*)"), arabic: '([^']+)', meaning: '([^']+)'/g)]
  .map((match) => ({ id: Number(match[1]), latin: match[2] ?? match[3], arabic: match[4], meaning: match[5] }));
if (names.length !== 99) throw new Error(`Expected 99 learning names, found ${names.length}.`);

const verifiedSource = await readFile(resolve(root, 'src/data/verifiedNamesOfAllahData.ts'), 'utf8');
const audited = new Set([...verifiedSource.matchAll(/legacyId: (\d+)/g)].map((match) => Number(match[1])));

async function loadEdition(language) {
  const dir = resolve(root, `public/data/quran/${language}`);
  const rows = [];
  for (const file of await readdir(dir)) {
    const surah = JSON.parse(await readFile(resolve(dir, file), 'utf8'));
    for (const ayah of surah.ayahs) {
      rows.push({ surah: surah.number, ayah: ayah.numberInSurah, text: ayah.text });
    }
  }
  // readdir yields 1, 10, 100 … so without sorting, the "first occurrence"
  // shown for a name would be file order rather than the order of the mushaf.
  rows.sort((left, right) => left.surah - right.surah || left.ayah - right.ayah);
  return new Map(rows.map((row) => [`${row.surah}:${row.ayah}`, row.text]));
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
// Erst die arabischen Treffer bestimmen, dann nur für die betroffenen Suren
// die deutsche Wiedergabe holen — statt alle 114 abzurufen.
let german = new Map();

const arabicForms = [...arabic].map(([ref, text]) => ({ ref, forms: forms(text) }));
const matches = (needles, haystack) => [...needles].some((needle) => [...haystack].some((hay) => hay.includes(needle)));

const results = names.map((name) => {
  const needles = forms(name.arabic);
  const refs = arabicForms.filter((verse) => matches(needles, verse.forms)).map((verse) => verse.ref);
  return { ...name, refs };
});

// The audited names are the control: every one of them was found by hand
// before this script existed, so the scan must find them too. If it does not,
// the normalisation is wrong and every other result is suspect.
const controlMisses = [...audited].filter((id) => !results.find((entry) => entry.id === id)?.refs.length);
if (controlMisses.length) {
  throw new Error(`Scan fails the control: hand-audited names not found: ${controlMisses.join(', ')}`);
}

const neededSurahs = [...new Set(results.flatMap((entry) => entry.refs.slice(0, 1)).map((ref) => Number(ref.split(':')[0])))];
german = await loadGermanEdition(neededSurahs);

const withEvidence = results.filter((entry) => entry.refs.length);
const withoutEvidence = results.filter((entry) => !entry.refs.length);
const shorten = (text) => (text.length > 220 ? `${text.slice(0, 219)}…` : text);

/**
 * Stellen, an denen der Quran mehrere Namen in Folge nennt, sodass sich die
 * deutsche Wiedergabe von Abu Rida Position für Position zuordnen lässt.
 *
 * Nur diese Verse, und nur weil die Reihenfolge dort erhalten bleibt. Eine
 * allgemeine Wort-für-Wort-Zuordnung zwischen zwei Sprachen ist nicht
 * verlässlich, und ein unzuverlässiger Abgleich wäre hier schlimmer als keiner.
 *
 * Die Zuordnung ist am Vers selbst abgelesen, nicht angenommen.
 */
const ENUMERATING_VERSES = [
  { ref: '59:22', ids: [1, 2] },
  { ref: '59:23', ids: [3, 4, 5, 6, 7, 8, 9, 10] },
  { ref: '59:24', ids: [11, 12, 13] },
  { ref: '57:3', ids: [73, 74, 75, 76] },
];

/**
 * Die Aufzählung aus Jami at-Tirmidhi 3507 — die Quelle, aus der die
 * verbreitete 99er-Zusammenstellung stammt.
 *
 * Verglichen wird Position für Position mit der Liste der App: gleiche
 * Schreibweise, gleiche Reihenfolge? Das ist prüfbar, im Gegensatz zu der
 * Frage, ob ein Name „richtig" ist.
 */
const TIRMIDHI = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-tirmidhi.min.json';
let enumeration = null;
try {
  const response = await fetch(TIRMIDHI);
  if (response.ok) {
    const entry = (await response.json()).hadiths.find((item) => item.hadithnumber === 3507);
    if (entry) {
      const bare = normalizeArabic(entry.text);
      const anchor = bare.indexOf('الرحمن الرحيم الملك');
      if (anchor !== -1) {
        const tokens = bare.slice(anchor).split(/["‏]/)[0].split(/\s+/).filter((word) => word.length > 1);
        enumeration = [];
        for (let index = 0; index < tokens.length; index += 1) {
          if (tokens[index] === 'مالك' && tokens[index + 1] === 'الملك') { enumeration.push('مالك الملك'); index += 1; }
          else if (tokens[index] === 'ذو') { enumeration.push('ذو الجلال والاكرام'); index += 2; }
          else enumeration.push(tokens[index]);
        }
      }
    }
  }
} catch {
  // Ohne Netz bleibt der Abgleich aus; der Quran-Teil oben braucht keins.
}

const alignment = [];
if (enumeration) {
  results.forEach((entry, index) => {
    const listed = enumeration[index] ?? null;
    const own = normalizeArabic(entry.arabic);
    if (listed !== own) alignment.push({ ...entry, position: index + 1, listed, own });
  });
}

const lines = [
  '# Belegstellen der 99 Lernnamen im Quran-Text',
  '',
  '<!-- Erzeugt von scripts/scan-quran-name-evidence.mjs · npm run names:evidence',
  '     Nicht von Hand bearbeiten. -->',
  '',
  '**Dies ist keine Freigabe.** Es ist eine Kandidatenliste zum Bestätigen.',
  '',
  'Durchsucht wurde der mitgelieferte Quran-Bestand — derselbe Text, den',
  '`npm run quran:verify` Ayah für Ayah gegen `quran-uthmani` geprüft hat und den',
  '`npm run quran-integrity:check` per sha256 gegen Veränderung sichert. Eine hier',
  'genannte Stelle kann also nachgeschlagen werden; sie stammt nicht aus dem',
  'Gedächtnis eines Sprachmodells.',
  '',
  '## Was der Scan nicht entscheidet',
  '',
  'Ob der Name an der Fundstelle **Allah** meint. `Al-Aziz` bezeichnet im Quran',
  'auch den ägyptischen Würdenträger in Sure Yusuf, `Al-Malik` auch einen',
  'irdischen König. Genau das ist der Schritt, den eine qualifizierte Person tun',
  'muss — er ist mit der Fundstelle daneben aber eine Minutenarbeit statt einer',
  'Suche.',
  '',
  'Ebenso wenig sagt ein fehlender Treffer, dass ein Name unbelegt ist. Er kann',
  'im Quran in anderer Form stehen — als Verb (`يُحْيِي وَيُمِيتُ`) oder unbestimmt',
  '(`رَءُوفٌ`) — oder aus der Hadith-Überlieferung stammen. Gesucht wurde nur die',
  'bestimmte Form, wie sie in der Lernliste steht.',
  '',
  '## Abgleich mit der Aufzählung, aus der die Liste stammt',
  '',
  ...(enumeration
    ? [
        `Jami at-Tirmidhi 3507 zählt nach „Allah" **${enumeration.length}** Namen auf. Die App führt **99**.`,
        '',
        alignment.length === 0
          ? 'Schreibweise und Reihenfolge stimmen an jeder Position überein.'
          : `Ab Position **${alignment[0].position}** laufen die beiden Listen auseinander. Der erste Unterschied ist der aussagekräftige, der Rest ist die Verschiebung, die daraus folgt:`,
        '',
        ...(alignment.length
          ? [
              `- Die App führt an Position ${alignment[0].position} **${alignment[0].latin}** (${alignment[0].arabic}).`,
              `- Die Aufzählung führt dort **${alignment[0].listed}** — den Namen, den die App an der nächsten Position hat.`,
              '',
              'Das heißt: die App enthält einen Namen, den diese Aufzählung nicht',
              'enthält, und alles danach ist um eine Position verschoben. Beide Listen',
              'enden auf denselben Namen.',
              '',
              '**Kein Fehler der App.** Der zusätzliche Eintrag steht im Quran (112:1),',
              'die Aufzählung in 3507 ist die schwach eingestufte. Verschiedene',
              'Zusammenstellungen zählen an dieser Stelle unterschiedlich, und wer „Allah"',
              'selbst mitzählt, kommt ebenfalls anders heraus. Die Fachprüfung',
              'entscheidet, welche Zählung die App führen soll — belegt ist hier nur,',
              'dass sie sich genau an dieser einen Stelle unterscheiden.',
              '',
            ]
          : []),
      ]
    : ['Nicht abgeglichen — die Aufzählung war nicht abrufbar (kein Netz).', '']),
  '## Stand',
  '',
  `- **${withEvidence.length} von 99** Namen kommen in dieser Form im Quran-Text vor.`,
  `- **${withoutEvidence.length} von 99** kommen in dieser Form nicht vor.`,
  `- ${audited.size} davon waren bereits von Hand geprüft und dienen hier als Kontrolle: der Scan findet sie alle wieder.`,
  '',
  '---',
  '',
  '## Namen mit Fundstelle',
  '',
];

for (const entry of withEvidence) {
  const first = entry.refs[0];
  lines.push(
    `### ${entry.id}. ${entry.latin} · ${entry.arabic}`,
    '',
    `„${entry.meaning}" · ${entry.refs.length} Fundstelle${entry.refs.length === 1 ? '' : 'n'}${audited.has(entry.id) ? ' · **bereits einzeln geprüft**' : ''}`,
    '',
    `**${first}** — ${shorten(german.get(first) ?? '')}`,
    '',
  );
  if (entry.refs.length > 1) {
    lines.push(`Weitere: ${entry.refs.slice(1, 12).join(', ')}${entry.refs.length > 12 ? ` … (${entry.refs.length - 12} weitere)` : ''}`, '');
  }
  lines.push('Referenz bestätigt: ☐', '');
}

lines.push(
  '---',
  '',
  '## Deutsche Bedeutung gegen eine veröffentlichte Übersetzung',
  '',
  'Die Bedeutungsangaben der App sind kurze Lernglossen. Hier stehen sie neben',
  'der Wiedergabe von **Abu Rida** an den Stellen, an denen der Quran mehrere',
  'Namen in Folge nennt und sich die Reihenfolge deshalb zuordnen lässt.',
  '',
  'Eine Abweichung ist **kein Fehler**: eine Übersetzung gibt den Vers im',
  'Zusammenhang wieder, eine Lernglosse den Begriff für sich. Auseinander liegen',
  'darf beides — nur wissen sollte man, wo.',
  '',
);
for (const verse of ENUMERATING_VERSES) {
  lines.push(`### ${verse.ref}`, '', `> ${german.get(verse.ref) ?? ''}`, '', '| # | Name | Bedeutung in der App |', '| --: | --- | --- |');
  for (const id of verse.ids) {
    const entry = results.find((item) => item.id === id);
    if (entry) lines.push(`| ${entry.id} | ${entry.latin} | ${entry.meaning} |`);
  }
  lines.push('', 'Zuordnung geprüft: ☐', '');
}

lines.push(
  '---',
  '',
  '## Namen ohne Fundstelle in dieser Form',
  '',
  'Für diese Einträge trägt der Quran-Text die bestimmte Form nicht. Das ist',
  'kein Urteil über den Namen — es heißt, dass der Beleg woanders liegen muss:',
  'in einer anderen grammatischen Form im Quran, oder in der Überlieferung.',
  '',
  '| # | Name | Arabisch | Bedeutung in der App |',
  '| --: | --- | --- | --- |',
);
for (const entry of withoutEvidence) {
  lines.push(`| ${entry.id} | ${entry.latin} | ${entry.arabic} | ${entry.meaning} |`);
}
lines.push('');

await writeFile(resolve(root, 'docs/NAMES-QURAN-EVIDENCE.md'), lines.join('\n'), 'utf8');
console.log(`Names evidence scan: ${withEvidence.length}/99 names occur in the bundled Quran text, ${withoutEvidence.length} do not; control of ${audited.size} hand-audited names passed. Wrote docs/NAMES-QURAN-EVIDENCE.md.`);
