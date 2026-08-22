/**
 * Builds the review packet a qualified reviewer works through.
 *
 * All 42 blocks in the v1 religious release scope need a documented human
 * approval, and none of them can get one from a hand-written document that
 * drifts away from the app. So this reads the actual source data and emits
 * docs/RELIGIOUS-HUMAN-REVIEW-PACK.md from it. `--check` fails when the file on
 * disk no longer matches what the data would produce, which is how it stays
 * true — the same arrangement `npm run review:check` already uses.
 *
 * What this document is *not*: a judgement. It states what the app shows, what
 * it cites, and what a reviewer has to decide. Nothing here approves anything;
 * approvals live in the review records and require a named reviewer, a date and
 * evidence.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const outputPath = resolve(root, 'docs/RELIGIOUS-HUMAN-REVIEW-PACK.md');
const check = process.argv.includes('--check');

const load = (name) => import(`file://${resolve(root, 'src/data', name)}`);

const { V1_RELIGIOUS_RELEASE_SCOPE } = await load('v1ReligiousReleaseScope.ts');
const { BEGINNER_REVIEW_RECORDS } = await load('beginnerReview.ts');
const { LEARNING_CONTENT_REVIEW_RECORDS } = await load('learningContentReview.ts');
const { CORE_CONTENT_REVIEW_RECORDS } = await load('coreContentReview.ts');
const { BEGINNER_LESSONS } = await load('beginnerLearningContent.ts');
const { LEARNING_LESSONS } = await load('islamicLearningContent.ts');
const { DUAS } = await load('duaData.ts');
const { DUA_SOURCE_AUDIT } = await load('duaSourceAudit.ts');
const { NAMES_OF_ALLAH } = await load('namesOfAllahData.ts');
const { VERIFIED_NAMES_OF_ALLAH } = await load('verifiedNamesOfAllahData.ts');
const { HADITH_LIBRARY, DAILY_HADITH_IDS } = await load('hadithData.ts');
const { DHIKR_ROUTINES } = await load('dhikrData.ts');
const { WORSHIP_GUIDES } = await load('worshipGuideData.ts');
const { PRAYER_RAKATS } = await load('prayerRakatData.ts');
const { ISLAMIC_EVENTS, NO_FASTING_DAYS } = await load('islamicEventsData.ts');

const records = new Map(
  [...BEGINNER_REVIEW_RECORDS, ...LEARNING_CONTENT_REVIEW_RECORDS, ...CORE_CONTENT_REVIEW_RECORDS]
    .map((record) => [record.contentId, record]),
);

const lessonById = new Map([...BEGINNER_LESSONS, ...LEARNING_LESSONS].map((lesson) => [lesson.id, lesson]));

/** Shared decisions a reviewer applies to every block, stated once. */
const CROSS_CUTTING = [
  'Arabischer Wortlaut Zeichen für Zeichen, inklusive Vokalisierung.',
  'Transliteration nach einem einheitlichen Schema.',
  'Deutsche Wiedergabe: sagt sie nicht mehr, als die Quelle trägt?',
  'Quellenangabe: Sammlung, Nummer, Grad – und ob der Grad zur verwendeten Bewertung passt.',
  'Feste Zahlen (3×, 33×, 7×): trägt die Quelle die Zahl als notwendige Anzahl?',
  'Rechtsschulunterschiede: als gemeinsame Grundlage dargestellt oder als eine Position ausgegeben?',
  'Fehlender Kontext, der die Aussage im Alltag verschieben würde.',
];

/**
 * The fourteen core areas are not one data shape, so each names where it lives
 * and what specifically has to be decided about it. The rows are hand-written
 * because "what must a scholar confirm here" is not derivable from the data;
 * everything quantitative below them is read from the data.
 */
const CORE_AREAS = {
  'quran-offline-bundle': {
    files: ['public/data/quran/**', 'src/services/quranService.ts', 'docs/QURAN-PROVENANCE.md'],
    decide: [
      'Ist die deutsche Übersetzung von Abu Rida für diese App die richtige Wahl?',
      'Ist die Darstellung im Reader (Arabisch + Übersetzung + Quellenhinweis) angemessen?',
      'Genügt der Hinweis, dass die Übersetzung eine Bedeutungswiedergabe und kein Ersatz für den arabischen Text ist?',
    ],
    verified: [
      'Arabisch: 6236/6236 Ayat identisch mit quran-uthmani.',
      'Deutsch: 6236/6236 Ayat identisch mit de.aburida (Abu Rida).',
      '114 Suren, kufische Zählung, sha256-Manifest über alle 229 Dateien.',
    ],
    blocked: 'Lizenz/Nutzungsrecht für arabische Edition und Übersetzung sind ungeklärt. Siehe docs/QURAN-PROVENANCE.md.',
  },
  'quran-beginner-guide': {
    files: ['src/screens/QuranBeginnerGuideScreen.tsx'],
    decide: [
      'Sind die Begriffserklärungen (Sure, Ayah, Juz, Manzil) korrekt und anfängergerecht?',
      'Ist die Anleitung zum Umgang mit dem Quran (Reinheit, Haltung, Rezitation) vollständig genug, ohne zu belehren?',
    ],
  },
  'beginner-reference': {
    files: ['src/screens/BeginnerReferenceScreen.tsx'],
    decide: [
      'Sind FAQ-Antworten und Islam-A–Z-Einträge inhaltlich korrekt?',
      'Werden Fragen, bei denen anerkannte Unterschiede bestehen, als solche kenntlich gemacht?',
    ],
  },
  'purity-basics': {
    files: ['src/screens/PurityBasicsScreen.tsx'],
    decide: [
      'Ghusl: Pflichtteile und empfohlene Teile korrekt getrennt?',
      'Tayammum: Voraussetzungen und Ablauf korrekt, inklusive der Fälle, in denen es zulässig ist?',
      'Wird deutlich, wann eine konkrete Frage an eine örtliche Autorität gehört?',
    ],
  },
  'names-of-allah': {
    files: ['src/data/namesOfAllahData.ts', 'src/data/verifiedNamesOfAllahData.ts', 'src/screens/NamesScreen.tsx'],
    decide: [
      'Je Name: Arabisch, Transliteration, deutsche Kurzbedeutung.',
      'Je Name: Einzelbeleg aus Quran oder authentischem Hadith.',
      'Abgeleitete oder umstrittene Namen als solche kennzeichnen.',
      'Al-Majid (الْمَجِيدُ) und Al-Majid (الْمَاجِدُ) unterscheiden sich; die Transliteration darf sie nicht gleichsetzen.',
      'Die App darf keine bestimmte 99er-Reihenfolge als die einzige authentische Liste ausgeben.',
    ],
  },
  'dhikr-counter-steps': {
    files: ['src/data/dhikrData.ts', 'src/screens/DhikrScreen.tsx'],
    decide: ['Je Formel: Arabisch, Transliteration, Bedeutung, Beleg.', 'Wiederholungszahlen: trägt der Beleg die Zahl?'],
  },
  'dhikr-routines': {
    files: ['src/data/dhikrData.ts'],
    decide: [
      'Sind die Routinen als überlieferte Praxis belegt oder als Vorschlag der App gekennzeichnet?',
      'Werden Tagesziele nicht als religiös vorgeschriebene Zahl dargestellt?',
    ],
  },
  duas: {
    files: ['src/data/duaData.ts', 'src/data/duaSourceAudit.ts', 'src/screens/DuasScreen.tsx'],
    decide: ['Je Dua: Arabisch, Transliteration, Bedeutung, Referenz, Grad, Anlass.', 'Varianten als Varianten kennzeichnen.'],
  },
  'daily-hadith-rotation': {
    files: ['src/data/hadithData.ts', 'src/screens/DailyHadithScreen.tsx'],
    decide: [
      'Passt jede Nummer zum gezeigten Inhalt?',
      'Ist die sinngemäße Zusammenfassung nicht stärker als das Original?',
      'Ist der Tagespool als Ganzes für eine tägliche Ausspielung geeignet?',
    ],
  },
  'worship-guides': {
    files: ['src/data/worshipGuideData.ts', 'src/screens/ReferenceReadingScreens.tsx'],
    decide: [
      'Wudu und Salah: Pflicht, Sunnah und Empfehlung sauber getrennt?',
      'Keine einzelne Handhaltung oder Fingerbewegung als alternativlos dargestellt?',
    ],
  },
  'prayer-rakat-sequence': {
    files: ['src/data/prayerRakatData.ts', 'src/screens/PrayerLearningScreen.tsx'],
    decide: [
      'Je gesprochenem Text: Arabisch, Transliteration, Bedeutung, Beleg.',
      'Rakʿah-Zahlen je Gebet korrekt.',
      'Unterschiede zwischen Rechtsschulen im Ablauf kenntlich gemacht.',
    ],
  },
  'prayer-time-methodology': {
    files: ['src/services/prayerTimesService.ts', 'src/screens/PrayerScreen.tsx'],
    decide: [
      'Ist die Standardmethode (Diyanet, experimentell) eine vertretbare Voreinstellung?',
      'Ist die Unterscheidung Standard-/Hanafi-Asr korrekt beschrieben?',
      'Ist der Hinweis auf mögliche Abweichungen zur örtlichen Moschee ausreichend deutlich?',
    ],
    verified: [
      'Ohne Gerätestandort zeigt die App keine persönlichen Gebetszeiten.',
      'Der Ersatzzeitplan enthält keine Uhrzeiten und löst keine Erinnerungen aus.',
    ],
  },
  'qibla-guidance': {
    files: ['src/screens/QiblaScreen.tsx', 'src/services/qibla.ts'],
    decide: [
      'Ist die Erklärung zur Gebetsrichtung und zum Umgang mit Ungenauigkeit religiös angemessen?',
      'Ist der Hinweis ausreichend, dass ein Kompass eine Hilfe und keine Gewissheit ist?',
    ],
    verified: ['Ohne Gerätestandort zeigt die App keine persönliche Gradzahl.'],
  },
  'islamic-calendar-content': {
    files: ['src/data/islamicEventsData.ts', 'src/screens/CalendarScreen.tsx', 'src/services/islamicDay.ts'],
    decide: [
      'Sind die Termine, ihre Bedeutung und die Praxishinweise korrekt?',
      'Sind die Tage, an denen Fasten unzulässig ist, vollständig?',
      'Ist der Hinweis auf berechnetes Datum vs. örtliche Mondsichtung ausreichend?',
    ],
    verified: ['Der islamische Tag wechselt ab Maghrib; ohne verlässliche Maghrib-Zeit sagt die App das.'],
  },
};

/**
 * Counts and listings read from the data, so a number here cannot disagree with
 * the app. These are facts about scope, not judgements about correctness.
 */
const withAudit = new Set(DUA_SOURCE_AUDIT.map((entry) => entry.duaId));
const auditedNames = VERIFIED_NAMES_OF_ALLAH.filter((entry) => entry.legacyId !== null).length;
const dhikrItems = DHIKR_ROUTINES.reduce((total, routine) => total + routine.items.length, 0);
const rakatSteps = PRAYER_RAKATS.reduce(
  (total, prayer) => total + prayer.rakats.reduce((sum, rakat) => sum + rakat.steps.length, 0),
  0,
);
const guideSteps = WORSHIP_GUIDES.reduce((total, guide) => total + guide.steps.length, 0);

const INVENTORY = {
  'names-of-allah': `${NAMES_OF_ALLAH.length} Lernnamen sichtbar. ${auditedNames} davon sind auf einen eigenen quellenbelegten Eintrag gemappt, ${NAMES_OF_ALLAH.length - auditedNames} brauchen diese Einzelprüfung noch. Der belegte Bestand enthält ${VERIFIED_NAMES_OF_ALLAH.length} Einträge, darunter „Allah“ ohne Legacy-Zuordnung.`,
  duas: `${DUAS.length} sichtbare Duas, ${withAudit.size} davon mit Eintrag im Quellen-Audit.`,
  'dhikr-counter-steps': `${DHIKR_ROUTINES.length} Routinen mit zusammen ${dhikrItems} einzelnen Formeln.`,
  'dhikr-routines': `${DHIKR_ROUTINES.length} Routinen.`,
  'daily-hadith-rotation': `${DAILY_HADITH_IDS.length} Hadithe im Tagespool, aus einer Bibliothek von ${HADITH_LIBRARY.length}. Nur der Pool wird täglich ausgespielt.`,
  'worship-guides': `${WORSHIP_GUIDES.length} Anleitungen mit zusammen ${guideSteps} Schritten.`,
  'prayer-rakat-sequence': `${PRAYER_RAKATS.length} Gebete mit zusammen ${rakatSteps} beschriebenen Schritten.`,
  'islamic-calendar-content': `${ISLAMIC_EVENTS.length} benannte Termine und ${NO_FASTING_DAYS.length} Regeln für Tage, an denen nicht gefastet wird.`,
};

/** Per-entry listings for the blocks where a reviewer works through a list. */
const DETAIL = {
  duas: [
    '<details><summary>Alle Duas mit Quellenstand</summary>',
    '',
    '| # | Titel | Quelle laut App | Audit-Status | Nachweis im Audit |',
    '| --- | --- | --- | --- | --- |',
    ...DUAS.map((dua, index) => {
      const audit = DUA_SOURCE_AUDIT.find((entry) => entry.duaId === dua.id);
      return `| ${index + 1} | ${cell(dua.title)} | ${cell(dua.source)} | ${cell(audit?.status ?? '—')} | ${cell(audit?.evidence ?? '—')} |`;
    }),
    '',
    '</details>',
  ].join('\n'),

  'daily-hadith-rotation': [
    '<details><summary>Tagespool und übrige Bibliothek</summary>',
    '',
    '**Im Tagespool:**',
    '',
    '| ID | Titel | Sinngemäße Zusammenfassung | Quelle |',
    '| --- | --- | --- | --- |',
    ...DAILY_HADITH_IDS.map((id) => {
      const entry = HADITH_LIBRARY.find((item) => item.id === id);
      return `| \`${id}\` | ${cell(entry?.title)} | ${cell(entry?.summary)} | ${cell(entry?.source)} |`;
    }),
    '',
    '**Nicht im Tagespool, aber in der Bibliothek:**',
    '',
    '| ID | Titel | Quelle |',
    '| --- | --- | --- |',
    ...HADITH_LIBRARY.filter((entry) => !DAILY_HADITH_IDS.includes(entry.id))
      .map((entry) => `| \`${entry.id}\` | ${cell(entry.title)} | ${cell(entry.source)} |`),
    '',
    '</details>',
  ].join('\n'),

  'names-of-allah': [
    '<details><summary>Die 99 Lernnamen und ihr Belegstand</summary>',
    '',
    '| # | Latein | Arabisch | Bedeutung laut App | Einzelbeleg |',
    '| --- | --- | --- | --- | --- |',
    ...NAMES_OF_ALLAH.map((name) => {
      const verified = VERIFIED_NAMES_OF_ALLAH.find((entry) => entry.legacyId === name.id);
      return `| ${name.id} | ${cell(name.latin)} | ${cell(name.arabic)} | ${cell(name.meaning)} | ${verified ? cell(verified.source) : '**offen**'} |`;
    }),
    '',
    '</details>',
  ].join('\n'),

  'dhikr-counter-steps': [
    '<details><summary>Alle Dhikr-Formeln mit Wiederholungszahl</summary>',
    '',
    '| Routine | Formel | Arabisch | Bedeutung | Wiederholungen | Quelle der Routine |',
    '| --- | --- | --- | --- | --- | --- |',
    ...DHIKR_ROUTINES.flatMap((routine) => routine.items.map((item) => (
      `| ${cell(routine.title)} | ${cell(item.latin)} | ${cell(item.arabic)} | ${cell(item.meaning)} | ${cell(String(item.target ?? item.count ?? '—'))} | ${cell(routine.source)} |`
    ))),
    '',
    '</details>',
  ].join('\n'),

  'worship-guides': [
    '<details><summary>Alle Anleitungsschritte</summary>',
    '',
    ...WORSHIP_GUIDES.flatMap((guide) => [
      `**${guide.title}** — ${guide.intro}`,
      '',
      '| # | Schritt | Beschreibung |',
      '| --- | --- | --- |',
      ...guide.steps.map((step, index) => `| ${index + 1} | ${cell(step.title)} | ${cell(step.description)} |`),
      '',
    ]),
    '</details>',
  ].join('\n'),

  'islamic-calendar-content': [
    '<details><summary>Termine und Fastenregeln</summary>',
    '',
    '| Hijri-Monat | Tage | Termin | Bedeutung | Quelle |',
    '| --- | --- | --- | --- | --- |',
    ...ISLAMIC_EVENTS.map((event) => (
      `| ${event.month} | ${event.days.join(', ')} | ${cell(event.title)} | ${cell(event.meaning)} | ${cell(event.source)} |`
    )),
    '',
    '**Tage, an denen nicht gefastet wird:**',
    '',
    ...NO_FASTING_DAYS.map((entry) => `- Monat ${entry.month}, Tag(e) ${entry.days.join(', ')}`),
    '',
    '</details>',
  ].join('\n'),
};

/** Keeps a table cell from being broken by a pipe or a newline in the data. */
function cell(value) {
  return String(value ?? '—').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim();
}

const lines = [];
const push = (text = '') => lines.push(text);

const statusLabel = (record) => (record?.status === 'approved'
  ? `**approved** · ${record.reviewer} · ${record.reviewedAt} · ${record.evidence}`
  : '**pending**');

push('# Religiöses Review-Paket · v1');
push();
push('<!-- Generiert aus src/data. Nicht von Hand bearbeiten.');
push('     Erzeugen: npm run review-pack:write · Prüfen: npm run review-pack:check -->');
push();
push('Alle Inhaltsblöcke, die vor der ersten Veröffentlichung eine dokumentierte');
push('fachliche Freigabe brauchen. Dieses Dokument **bewertet nichts**. Es zeigt,');
push('was die App anzeigt, worauf sie sich beruft und was eine qualifizierte Person');
push('entscheiden muss.');
push();

const pending = [...records.values()].filter((record) => record.status === 'pending').length;
push(`**Stand: ${pending} von ${records.size} Blöcken offen.**`);
push();
push('## So wird freigegeben');
push();
push('Eine Freigabe ist ein Eintrag in `src/data/beginnerReview.ts`,');
push('`src/data/learningContentReview.ts` oder `src/data/coreContentReview.ts` mit');
push('`status: \'approved\'`, einem Reviewer-Namen, einem Datum (YYYY-MM-DD) und einem');
push('Nachweis. Ohne alle drei Felder schlägt der Release-Gate fehl.');
push();
push('Der Gate blockiert die Veröffentlichung, solange auch nur ein Block offen ist:');
push();
push('```bash');
push('node scripts/check-v1-religious-release-approval.mjs');
push('```');
push();
push('## Für jeden Block gleich zu prüfen');
push();
for (const item of CROSS_CUTTING) push(`- ${item}`);
push();
push('Diese Punkte werden unten nicht wiederholt. Dort steht nur, was für den');
push('jeweiligen Block zusätzlich gilt.');
push();
push('---');
push();

const groups = [
  ['beginner', 'Anfängerlektionen', 'Der Einstiegspfad für Menschen ohne Vorwissen. Was hier steht, ist für viele der erste Kontakt mit dem Thema.'],
  ['learning', 'Vertiefungslektionen', 'Aqidah, Fiqh, Tafsir, Seerah, Hadith und Akhlaq.'],
  ['core', 'Religiöse Kernbereiche', 'Funktionen, deren Inhalt religiös trägt: Quran, Namen, Duas, Dhikr, Gebet, Kalender.'],
];

for (const [group, title, intro] of groups) {
  const items = V1_RELIGIOUS_RELEASE_SCOPE.filter((item) => item.group === group);
  push(`## ${title} (${items.length})`);
  push();
  push(intro);
  push();

  for (const item of items) {
    const record = records.get(item.contentId);
    push(`### ${item.label}`);
    push();
    push(`\`${item.contentId}\` · ${statusLabel(record)}`);
    push();

    const lesson = lessonById.get(item.contentId);
    if (lesson) {
      push(`**Angezeigt als:** ${lesson.eyebrow} · ${lesson.duration}`);
      push();
      push(`**Zusammenfassung:** ${lesson.summary}`);
      push();
      push('**Volltext, wie er im Screen erscheint:**');
      push();
      for (const paragraph of lesson.paragraphs) {
        push(`> ${paragraph}`);
        push('>');
      }
      push();
      push('**Kernaussagen:**');
      push();
      for (const point of lesson.keyPoints) push(`- ${point}`);
      push();
      push('**Belege laut App:**');
      push();
      for (const source of lesson.sources) push(`- ${source.label} — ${source.reference}: ${source.note}`);
      push();
      if (lesson.glossary?.length) {
        push('**Glossar:**');
        push();
        for (const entry of lesson.glossary) push(`- **${entry.term}** — ${entry.meaning}`);
        push();
      }
      if (lesson.question) {
        push(`**Quizfrage:** ${lesson.question.prompt}`);
        push();
        lesson.question.options.forEach((option, index) => {
          push(`- ${index === lesson.question.correctIndex ? '**(richtig)**' : '(falsch)'} ${option}`);
        });
        push();
        push(`Erklärung: ${lesson.question.explanation}`);
        push();
      }
      push('**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?');
      push();
      push(`**Datei:** \`src/data/${group === 'beginner' ? 'beginnerLearningContent.ts' : 'islamicLearningContent.ts'}\``);
      push();
      push('---');
      push();
      continue;
    }

    const area = CORE_AREAS[item.contentId];
    if (!area) {
      push('> Für diesen Block fehlt eine Beschreibung in scripts/write-religious-review-pack.mjs.');
      push();
      push('---');
      push();
      continue;
    }

    const inventory = INVENTORY[item.contentId];
    if (inventory) {
      push(`**Umfang:** ${inventory}`);
      push();
    }
    if (area.verified?.length) {
      push('**Technisch bereits geprüft (keine fachliche Aussage):**');
      push();
      for (const entry of area.verified) push(`- ${entry}`);
      push();
    }
    push('**Zu entscheiden:**');
    push();
    for (const entry of area.decide) push(`- ${entry}`);
    push();
    if (area.blocked) {
      push(`**Zusätzlich blockiert:** ${area.blocked}`);
      push();
    }
    push(`**Dateien:** ${area.files.map((file) => `\`${file}\``).join(', ')}`);
    push();
    const detail = DETAIL[item.contentId];
    if (detail) {
      push(detail.trim());
      push();
    }
    push('---');
    push();
  }
}

await writeOrCheck();

async function writeOrCheck() {
  const output = `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
  if (check) {
    const current = await readFile(outputPath, 'utf8').catch(() => '');
    if (current !== output) {
      throw new Error('docs/RELIGIOUS-HUMAN-REVIEW-PACK.md no longer matches the content in src/data.\n  Run npm run review-pack:write and commit the result.');
    }
    console.log(`Religious review pack verified: ${records.size} blocks, ${pending} still pending.`);
    return;
  }
  await writeFile(outputPath, output, 'utf8');
  console.log(`Wrote ${outputPath}: ${records.size} blocks, ${pending} still pending.`);
}
