/**
 * Writes docs/INHALTE-PRUEFUNG.md — the list a qualified reviewer works through.
 *
 * Generated rather than written by hand, for one reason: a hand-kept checklist
 * goes stale on the first content change and then quietly certifies entries
 * nobody looked at. This is regenerated from the data files, so an item that
 * does not exist cannot appear. Coverage is explicit below: this is not a
 * guarantee that every statement embedded in screens has been extracted.
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
import ts from 'typescript';

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

function literalArray(source, name) {
  const file = ts.createSourceFile('content.ts', source, ts.ScriptTarget.Latest, true);
  const literal = (node) => {
    if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) return literal(node.expression);
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
    if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => {
      if (!ts.isPropertyAssignment(property)) throw new Error(`${name}: unsupported property; inventory must not silently omit it.`);
      return [property.name.text, literal(property.initializer)];
    }));
    throw new Error(`${name}: unsupported expression ${node.getText(file)}; add an explicit inventory rule.`);
  };
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(file) !== name || !declaration.initializer) continue;
      const result = literal(declaration.initializer);
      if (!Array.isArray(result)) throw new Error(`${name}: expected a literal array.`);
      return result;
    }
  }
  throw new Error(`Missing content array ${name}.`);
}

function literalRakatSteps(source) {
  const file = ts.createSourceFile('prayerRakatData.ts', source, ts.ScriptTarget.Latest, true);
  const declarations = new Map();
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.type?.getText(file) === 'RakatStep' && declaration.initializer) declarations.set(declaration.name.getText(file), declaration.initializer);
    }
  }
  const resolveStep = (name, ancestors = new Set()) => {
    if (ancestors.has(name) || !declarations.has(name)) throw new Error(`Prayer inventory: unresolved or cyclic step ${name}.`);
    const lineage = new Set([...ancestors, name]);
    const literal = node => {
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
      if (ts.isNumericLiteral(node)) return Number(node.text);
      if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
      if (ts.isObjectLiteralExpression(node)) {
        const result = {};
        for (const property of node.properties) {
          if (ts.isSpreadAssignment(property) && ts.isIdentifier(property.expression)) Object.assign(result, resolveStep(property.expression.text, lineage));
          else if (ts.isPropertyAssignment(property)) result[property.name.text] = literal(property.initializer);
          else throw new Error(`Prayer inventory: unsupported property ${property.getText(file)}.`);
        }
        return result;
      }
      throw new Error(`Prayer inventory: unsupported expression ${node.getText(file)}.`);
    };
    return literal(declarations.get(name));
  };
  const steps = [...declarations.keys()].map(name => resolveStep(name));
  if (steps.length < 17 || new Set(steps.map(step => step.id)).size !== steps.length) throw new Error('Prayer inventory: missing or duplicate step IDs.');
  return steps;
}

const markdownCell = (value) => String(value).replaceAll('|', '\\|').replace(/\r?\n/g, '<br>');

function table(rows) {
  return [
    '| Nr. | Inhalt | Quelle | Herkunft | geprüft |',
    '|---:|---|---|---|:---:|',
    ...rows.map((row, index) => `| ${index + 1} | ${markdownCell(row.text)} | ${markdownCell(row.source)} | ${row.origin} | ☐ |`),
  ].join('\n');
}

const short = (text, limit = 90) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length <= limit ? clean : `${clean.slice(0, limit - 1)}…`;
};

const areas = [];

// --- Hadith -----------------------------------------------------------------
const hadith = await read('src/data/hadithData.ts');
const hadithEntries = literalArray(hadith, 'HADITH_LIBRARY');
areas.push({
  name: 'Hadith-Sammlung',
  tier: 'C',
  note: 'Vollständige Kurzfassung, redaktionelle Einordnung und gegebenenfalls zugeordnete Bewertungen. Kein arabischer Originalwortlaut, keine menschliche Freigabe. Aussageabgleich: HADITH-SOURCE-AUDIT-2026-10-11.md.',
  rows: hadithEntries.map((entry) => ({
    text: [entry.title, entry.summary, entry.context, entry.grading?.text].filter(Boolean).join(' — '),
    source: [entry.source, entry.grading?.sourceUrl, entry.grading?.comparisonUrl].filter(Boolean).join(' · '),
    origin: CARRIED,
  })),
});

// --- Duas -------------------------------------------------------------------
const duasFile = await read('src/data/duaData.ts');
const duas = literalArray(duasFile, 'DUAS');
areas.push({
  name: 'Duas',
  tier: 'B',
  note: 'Vollständiger arabischer Text, Umschrift, sinngemäße Bedeutung und Einordnung. KI-Quellenabgleich und Grenzen: DUA-SOURCE-AUDIT-2026-10-11.md. Keine menschliche Fachfreigabe.',
  rows: duas.map(entry => ({
    text: [entry.id, entry.title, entry.arabic, entry.transliteration, entry.translation, entry.sourceNote].filter(Boolean).join(' — '),
    source: [entry.source, entry.sourceUrl].filter(Boolean).join(' · '),
    origin: CARRIED,
  })),
});

// --- Sunnah and repentance --------------------------------------------------
const practice = await read('src/data/practiceData.ts');
const practiceItems = [...practice.matchAll(
  /title: '((?:[^'\\]|\\.)*)',\n\s+description: '(?:[^'\\]|\\.)*',\n\s+proof: '((?:[^'\\]|\\.)*)',/g,
)];
areas.push({
  name: 'Sunnah im Alltag · Fehler und Reue',
  tier: 'C',
  note: 'Alltagspraxis und Reue wurden am 03.09.2026 mit Quellen, Begriffserklärungen und didaktischen Beispielen überarbeitet. Der Abschnitt zu schweren Verfehlungen bleibt Altbestand. Alle Einträge benötigen fachliche Prüfung; Quellenprüfung ist keine Freigabe.',
  rows: practiceItems.map(([, title, proof]) => ({ text: short(title), source: short(proof, 60), origin: proof.startsWith('Koran (') || title === 'Zauberei (Sihr)' ? CARRIED : WRITTEN })),
});

const supplements = await read('src/data/foundationSupplementData.ts');
areas.push({
  name: 'Grundlagenpfad · vier ergänzende Lesebereiche',
  tier: 'A',
  priority: true,
  note: 'Einführungen und Kapiteltexte zu Hadith, Hajj/Umrah, Sunnah und Reue. Quellenabgleich und Grenzen sind in docs/FOUNDATION-SUPPLEMENTS.md dokumentiert. Definitionen, Beispiele und Einordnung gemeinsam fachlich prüfen.',
  rows: values(supplements, 'title').map((title) => ({ text: title, source: 'Quellenmatrix: FOUNDATION-SUPPLEMENTS.md', origin: WRITTEN })),
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
  note: 'Für die App verfasste Ablauftexte. Stationsbeschreibungen und Einordnung sind vorrangig gegen Quellen zu prüfen; sie ersetzen keine persönliche Beratung zu Pflichten oder Versäumnissen. Weitere hier verfasste Texte sind in den eigenen Bereichen dieser Mappe erfasst.',
  rows: stations.map(([, title, reference]) => ({ text: short(title), source: reference ?? '— (keine)', origin: WRITTEN })),
});

// --- Quiz -------------------------------------------------------------------
const quiz = await read('src/data/quizData.ts');
const quizQuestions = values(quiz, 'question');
const quizSources = values(quiz, 'source');
areas.push({
  name: 'Islam-Quiz',
  tier: 'D',
  note: '60 Fragen mit Einzelfundstellen; KI-gestützter Wortlaut- und Aussageabgleich am 11.10.2026. Kein unabhängiges Authentizitätsgutachten und keine fachliche Freigabe. Frage, Antwort und Erklärung müssen gemeinsam betrachtet werden.',
  rows: quizQuestions.map((question, index) => ({ text: short(question), source: quizSources[index] ?? '— (keine)', origin: WRITTEN })),
});

// --- Knowledge --------------------------------------------------------------
const knowledge = await read('src/data/knowledgeData.ts');
const knowledgeTopics = literalArray(knowledge, 'KNOWLEDGE_TOPICS');
areas.push({
  name: 'Wissensbibliothek',
  tier: 'D',
  note: 'Einleitungen, alle 41 Abschnitte und sechs Glossarbegriffe getrennt erfasst. Aussageabgleich vom 11.10.2026: KNOWLEDGE-SOURCE-AUDIT-2026-10-11.md. Keine menschliche Fachfreigabe.',
  rows: [
    ...knowledgeTopics.flatMap(topic => [
      { text: `${topic.id} · Einleitung: ${topic.intro}`, source: `${topic.source} · ${topic.sourceUrl}`, origin: WRITTEN },
      ...topic.sections.map(section => ({ text: `${topic.id} · ${section.subtitle}: ${section.text}`, source: `${section.source} · ${section.sourceUrl}`, origin: WRITTEN })),
    ]),
    ...literalArray(knowledge, 'GLOSSARY_TERMS').map(entry => ({ text: `Glossar · ${entry.term}: ${entry.definition}`, source: `${entry.source} · ${entry.sourceUrl}`, origin: WRITTEN })),
  ],
});

const people = await read('src/data/companionData.ts');
areas.push({
  name: 'Gefährten und Frauen im Islam', tier: 'D',
  note: 'Namen, Beinamen, Rollen und Kurztexte: zehn Frauen im WOMEN-SOURCE-AUDIT-2026-10-11.md, 15 Gefährten im COMPANION-SOURCE-AUDIT-2026-10-11.md abgeglichen. Historische Einordnung ist kein Prophetenzitat; kein vollständiger Biografieabgleich.',
  rows: [
    ...literalArray(people, 'SAHABAH').map(entry => ({ text: `${entry.id} · ${entry.name}: ${entry.honorific} · ${entry.role}${entry.sourceNote ? ` · Quellenkontext: ${entry.sourceNote}` : ''}`, source: entry.sources.map(source => `${source.label} · ${source.url}`).join(' | '), origin: CARRIED })),
    ...literalArray(people, 'WOMEN_IN_ISLAM').map(entry => ({ text: `${entry.id} · ${entry.name}: ${entry.note}${entry.sourceNote ? ` · Quellenkontext: ${entry.sourceNote}` : ''}`, source: entry.sources.map(source => `${source.label} · ${source.url}`).join(' | '), origin: CARRIED })),
  ],
});

const names = literalArray(await read('src/data/namesOfAllahData.ts'), 'NAMES_OF_ALLAH');
const nameEvidence = new Map([
  ...literalArray(await read('src/data/verifiedNamesOfAllahData.ts'), 'VERIFIED_NAMES_OF_ALLAH'),
  ...literalArray(await read('src/data/additionalNamesOfAllahEvidence.ts'), 'ADDITIONAL_NAMES_OF_ALLAH_EVIDENCE'),
].filter(entry => entry.legacyId !== null).map(entry => [entry.legacyId, entry]));
const relatedNameEvidence = new Map(literalArray(await read('src/data/nameSourceEvidence.ts'), 'RELATED_NAME_SOURCE_CONTEXT').map(entry => [entry.legacyId, entry]));
areas.push({
  name: '99 Namen · vollständige Lernliste', tier: 'B',
  note: 'Alle 99 bleiben sichtbar und wurden am 11.10.2026 untersucht; NAMES-SOURCE-AUDIT-2026-10-11.md. 75 direkte Belegzuordnungen bestätigen nicht alle Bedeutungsnuancen oder die feste Aufzählung. 24 Listenformen bleiben ohne direkten Einzelbeleg: 20 verwandte Stellen und ein Ausschlusskontext (98: 11:87 spricht zu Shuayb, nicht über Allah) werden nicht als direkte Belege gezählt. Für 64, 65 und 77 fehlt weiterhin auch ein zugeordneter Einzelkontext. Grammatische Abweichungen und Auslegungsgrenzen sind sichtbar. Die 99er-Aussage ist von einer festen Aufzählung zu unterscheiden; Tirmidhi 3507 mit Darussalam-Bewertung Daif und eigenem Gharib-Kommentar at-Tirmidhis eingeordnet. Keine vollständige Authentizitäts- oder Aussprachefreigabe.',
  rows: names.map(entry => ({ text: `${entry.id} · ${entry.latin} · ${entry.arabic} · ${entry.meaning}${nameEvidence.get(entry.id)?.sourceNote ? ` · Belegkontext: ${nameEvidence.get(entry.id).sourceNote}` : ''}${relatedNameEvidence.get(entry.id) ? ` · Verwandter Beleg, kein direkter Namensbeleg: ${relatedNameEvidence.get(entry.id).label} · ${relatedNameEvidence.get(entry.id).url} · ${relatedNameEvidence.get(entry.id).note}` : ''}`, source: nameEvidence.get(entry.id)?.source ?? '— (traditionelle Lernliste, keine direkte Einzelfundstelle)', origin: CARRIED })),
});

const routines = literalArray(await read('src/data/dhikrData.ts'), 'DHIKR_ROUTINES');
areas.push({
  name: 'Dhikr · Routinen und einzelne Formeln', tier: 'B',
  note: 'Sieben Routinen und 18 Formeln am 11.10.2026 anhand tatsächlich gelesener Fundstellen abgeglichen: docs/DHIKR-SOURCE-AUDIT-2026-10-11.md. Sinngemäße Bedeutungen, angenäherte Umschrift, überlieferte Varianten und persönliche Zählerziele getrennt; keine Fachfreigabe.',
  rows: routines.flatMap(routine => [
    { text: `${routine.id} · ${routine.title}: ${routine.description} ${routine.note ?? ''}`, source: `${routine.source}${routine.sourceUrl ? ` · ${routine.sourceUrl}` : ''}`, origin: WRITTEN },
    ...routine.items.map(item => ({ text: `${routine.id}/${item.id} · ${item.arabic} · Kurzname: ${item.latin} · Umschrift: ${item.transliteration ?? item.latin} · ${item.meaning} · Ziel: ${item.target} · ${item.itemNote ?? ''}`, source: `${item.itemSource ?? routine.source} · ${item.itemSourceUrl ?? routine.sourceUrl ?? 'persönliche Auswahl, keine Einzelfundstelle'}`, origin: WRITTEN })),
  ]),
});

const lessons = literalArray(await read('src/data/islamicLearningContent.ts'), 'LEARNING_LESSONS');
areas.push({
  name: 'Lernkurse · Texte, Merksätze und Kontrollfragen', tier: 'A', priority: true,
  note: 'Jede Lektion mit Zusammenfassung, Absätzen, vorhandenen Detailtexten, Merksätzen, Frage samt Antwortoptionen und Erklärung. Sieben Glaubenslektionen, sechs Säulenlektionen, alle zwölf Begriffslektionen, fünf Praxislektionen, vier Charakterlektionen und sechs Gemeinschaftslektionen am 12.10.2026 in FAITH-LEARNING-SOURCE-AUDIT-2026-10-12.md, PILLARS-LEARNING-SOURCE-AUDIT-2026-10-12.md, DEVOTION-LEARNING-SOURCE-AUDIT-2026-10-12.md, TERMINOLOGY-LEARNING-SOURCE-AUDIT-2026-10-12.md, PRACTICE-LEARNING-SOURCE-AUDIT-2026-10-12.md, CHARACTER-LEARNING-SOURCE-AUDIT-2026-10-12.md und COMMUNITY-LEARNING-SOURCE-AUDIT-2026-10-12.md abgeglichen: 40/44 Lektionen; vier zu Seerah bleiben offen. Quellenzuordnung allein bestätigt keine Aussage. Keine menschliche Fachfreigabe.',
  rows: lessons.flatMap(lesson => {
    const source = lesson.sources.map(item => `${item.label}: ${item.reference} (${item.note})${item.url ? ` · ${item.url}` : ''}`).join(' · ') || '— (keine)';
    const row = (field, text) => ({ text: `${lesson.id}/${field} · ${text}`, source, origin: WRITTEN });
    return [
      row('summary', lesson.summary),
      ...lesson.paragraphs.map((text, index) => row(`paragraphs[${index}]`, text)),
      ...(lesson.detailItems ?? []).map((item, index) => row(`detailItems[${index}]`, `${item.title}: ${item.text}`)),
      ...lesson.keyPoints.map((text, index) => row(`keyPoints[${index}]`, text)),
      row('question', `${lesson.question.prompt} Optionen: ${lesson.question.options.join(' / ')}. Richtige Position: ${lesson.question.correctIndex + 1}; Erklärung: ${lesson.question.explanation}`),
    ];
  }),
});

areas.push({
  name: 'Ayah des Tages · Einstieg', tier: 'B',
  note: 'Arabischer Text und sinngemäße Bedeutung des Einstiegs separat erfasst; Rotation und Darstellung sind zusätzlich technisch zu prüfen.',
  rows: literalArray(await read('src/data/dailyAyah.ts'), 'DAILY_AYAHS').map(entry => ({ text: `${entry.arabic} · ${entry.meaning}`, source: entry.source, origin: WRITTEN })),
});

// --- Prophets ---------------------------------------------------------------
const prophets = await read('src/data/prophetData.ts');
const prophetEntries = [...prophets.matchAll(/id: '[^']+', name: '([^']+)', arabic: '[^']+'[\s\S]*?quranReferences: \[([^\]]+)\]/g)];
const prophetCourses = await read('src/data/prophetCourseData.ts');
const prophetChapters = [...prophetCourses.matchAll(/\{ id: '[^']+', title: '([^']+)'[\s\S]*?quranReferences: \[([^\]]+)\] \}/g)];
const prophetOverviews = await read('src/data/prophetCourseOverviews.ts');
const prophetOverviewRows = [...prophetOverviews.matchAll(/orientation: '([^']+)'[\s\S]*?boundary: '([^']+)'/g)];
areas.push({
  name: 'Propheten',
  tier: 'B',
  note: `25 Katalogeinträge, ${prophetOverviewRows.length} ausführliche Kursorientierungen mit Wissensgrenze und ${prophetChapters.length} Kurskapitel. Je Kapitel sind Erzählung, Merksätze und Quran-Stellen gemeinsam zu prüfen. Bei Dhul-Kifl ist die unterschiedliche gelehrte Einordnung ausdrücklich Teil der Prüfung.`,
  rows: [
    ...prophetEntries.map(([, name, references]) => ({ text: `Einführung · ${name}`, source: short(references.replaceAll("'", '').replaceAll(',', ' · '), 60), origin: WRITTEN })),
    ...prophetOverviewRows.map(([, orientation, boundary]) => ({ text: `Kursorientierung · ${short(orientation, 48)}`, source: `Grenze: ${short(boundary, 46)}`, origin: WRITTEN })),
    ...prophetChapters.map(([, title, references]) => ({ text: `Kapitel · ${short(title, 52)}`, source: short(references.replaceAll("'", '').replaceAll(',', ' · '), 60), origin: WRITTEN })),
  ],
});

// --- Ummah ------------------------------------------------------------------
const ummah = await read('src/data/ummahData.ts');
areas.push({
  name: 'Ummah-Übersicht',
  tier: 'D',
  priority: true,
  note: 'Seit 11.10.2026 nur geografische Auswahl. Unbelegte Prozentwerte, Bevölkerungszahlen und Rangbehauptungen entfernt; keine Statistik und keine religiöse Rechtsaussage.',
  rows: values(ummah.slice(ummah.indexOf('UMMAH_COUNTRIES')), 'name').map((name) => ({ text: name, source: 'Geografische Auswahl · keine Statistik', origin: CARRIED })),
});

// --- Gebetsablauf -----------------------------------------------------------
// The spoken steps of the prayer: Quranic recitation, the Tashahhud, the
// Salawat and the supplications. Wording that a beginner will repeat verbatim,
// so the Arabic, its transliteration and its German meaning each need checking.
const rakats = await read('src/data/prayerRakatData.ts');
const rakatSteps = literalRakatSteps(rakats);
areas.push({
  name: 'Gebetsablauf (Rakʿah)',
  tier: 'A',
  priority: true,
  note: '17 Schritte einschließlich geerbter Varianten vollständig mit Beschreibung, Wortlaut, beiden Lesehilfen, Bedeutung und Wiederholungsgrenze erfasst. Erneuter Teilabgleich in PRAYER-LEARNING-SOURCE-AUDIT-2026-10-11.md; konkrete Fundstelle ist keine vollständige Schul-/Aussprachefreigabe. Quran-Schritte, Zusammensetzung und weitere Praxisangaben noch offen.',
  rows: rakatSteps.map((step) => ({
    text: [step.id, step.title, step.description, step.arabic, step.transliteration, step.pronunciation, step.translation, step.repetitions !== undefined ? `${step.repetitions} Wiederholung(en)` : '', step.repetitionNote, step.repetitionLabels?.join(', ')].filter(Boolean).join(' — '),
    source: step.source ?? '— (keine Einzelfundstelle)',
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

const schoolCatalogue = await read('src/data/madhhabCatalogueData.ts');
areas.push({
  name: 'Katalog der vier sunnitischen Rechtsschulen',
  tier: 'A',
  priority: true,
  note: 'Neue Zusammenfassungen, nicht fachlich freigegeben. Je Schule sind Lebensdaten, Entstehung, Methodik, Verbreitung und die Einordnung der Institutionen zu prüfen. Die verlinkten Institutionen sind keine zentralen Vertretungen einer Rechtsschule.',
  rows: schoolCatalogue.split(/\n  \{\n    id:/).slice(1).map((school) => ({
    text: `${values(school, 'title')[0]}: Geschichte, Methodik, Verbreitung und Praxis`,
    source: values(school, 'href').join(' · '),
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

Diese Liste erfasst die unten genannten Inhaltsbestände und Prüfpositionen mit
Quelle und Herkunft. **Sie ist noch keine vollständige Extraktion aller Aussagen
aus Oberflächen, Dialogen und dynamischen Anzeigen.** Die appweite Abdeckung und
offenen Bereiche stehen in \`APP-CONTENT-AUDIT-2026-10-11.md\`.
Sie sagt, **ob** eine Quelle da ist — nicht, ob sie **stimmt**. Ob eine
Belegstelle zutrifft, eine Übersetzung trägt oder eine Aussage zur Praxis richtig
ist, entscheidet die Prüfung selbst.

## Überblick

| | |
|---|---|
| Einträge insgesamt | ${total} |
| davon ohne Einzelnachweis | ${withoutSource} |
| davon für diese App verfasst | ${written} |

## Zuerst prüfen

Wer eine Stunde hat, gibt sie hier aus — nach dem, was ein Fehler anrichtet,
nicht nach Umfang.

1. **Anleitungen zur Praxis, die vorschreiben statt beschreiben** — Sujud
   as-Sahw, Qasr und Zusammenlegen auf Reisen, Nachholen, Frauen im Gebet, das
   Toten- und das Eid-Gebet. Wer das liest, betet danach. Ein Fehler hier wird
   unmittelbar befolgt und fällt niemandem auf.
2. **Unterschiede der Rechtsschulen** — acht Punkte, je vier Positionen. Zu
   prüfen ist auch, ob die Frage überhaupt so trennscharf verläuft.
3. **Lernkurse, Hajj, Umrah und heilige Stätten** — hier stehen umfangreiche
   eigene Formulierungen. Nicht nur Titel, sondern Texte und Schlussfolgerungen
   gemeinsam mit den angegebenen Belegen prüfen.

Erledigt und nicht mehr vorrangig: die Hadith-Belegstellen tragen inzwischen
alle ihre Nummer, jede einzeln nachgeschlagen und gegen die Inhaltsangabe
gelesen; die undatierten Ummah-Zahlen sind entfernt. Beides ist in
\`docs/QUELLENPRUEFUNG-BEFUNDE.md\` festgehalten — dort steht auch, was an den
Duas und Quran-Stellen bereits geprüft ist und was daran offen blieb.

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

*\`npm run content:report\` zählt ergänzend strukturelle Quellenzuordnungen.
Weder diese Zahlen noch Häkchen sind eine KI- oder menschliche Fachfreigabe.*
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
    lead: 'Wissenstexte, Kalender, Quizfragen und Angaben. Auch diese Inhalte können Entscheidungen und Praxis beeinflussen; die Stufe ist nur eine Reihenfolgeempfehlung.',
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
      <p><strong>Worum es geht.</strong> Diese Mappe erfasst die unten genannten Inhaltsbestände.
      Sie ist aus Daten erzeugt, aber noch keine vollständige Extraktion aller Aussagen aus
      Oberflächen und dynamischen Anzeigen. Abdeckung und offene Bereiche:
      APP-CONTENT-AUDIT-2026-10-11.md.</p>
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
