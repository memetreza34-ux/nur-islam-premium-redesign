import { HADITH_LIBRARY } from '../data/hadithData';
import { KNOWLEDGE_TOPICS } from '../data/knowledgeData';
import { LEARNING_LESSONS } from '../data/islamicLearningContent';
import { PROPHETS } from '../data/prophetData';
import { DUAS } from '../data/duaData';
import { WORSHIP_GUIDES } from '../data/worshipGuideData';

/**
 * Answers the assistant can give without inventing anything.
 *
 * Two problems with a hand-written answer list. It stops at whatever was
 * written — nine entries here — and every new entry is a religious claim
 * authored for a chat window rather than carried from a source. This searches
 * what the app already holds instead: the knowledge topics, the Hadith library,
 * the Duas, the prophets and the worship guides. An answer therefore always
 * points at an entry the user can open and check, and it grows as the content
 * does, with no new claims.
 *
 * Before any of that, ruling questions are turned away. A keyword search will
 * happily match "darf ich im Ramadan …" to a general article about Ramadan and
 * hand back something that reads like an answer to a question about what is
 * permitted. That is the one failure mode this assistant must not have.
 */

export type AssistantHit = {
  label: string;
  detail: string;
  area: string;
  source?: string;
};

export type AssistantReply =
  | { kind: 'declined'; text: string; note: string }
  | { kind: 'hits'; text: string; note: string; hits: AssistantHit[] }
  | { kind: 'none'; text: string; note: string };

/**
 * Phrasings that ask what is permitted, obligatory or valid.
 *
 * Deliberately about the shape of the question, not its topic: "Was bedeutet
 * Tawhid" is answerable, "Darf ich …" is not, and both mention religion.
 */
const RULING_PATTERNS = [
  /\bdarf ich\b/, /\bdarf man\b/, /\bist es erlaubt\b/, /\bist das erlaubt\b/,
  /\bmuss ich\b/, /\bmuss man\b/, /\bist es pflicht\b/, /\bist das pflicht\b/,
  /\bist es haram\b/, /\bist das haram\b/, /\bist es halal\b/, /\bist das halal\b/,
  /\bist es sünde\b/, /\bist das sünde\b/, /\bist mein .* gültig\b/, /\bist das gültig\b/,
  /\bfatwa\b/, /\bwie viel schulde ich\b/, /\bmuss ich nachholen\b/,
];

/** Questions about a person's own situation, which need a human, not a lookup. */
const PERSONAL_PATTERNS = [
  /\bmeine ehe\b/, /\bmeine scheidung\b/, /\bmein erbe\b/, /\berbteil\b/,
  /\bsoll ich mich\b/, /\bwas soll ich tun\b/, /\bmein problem\b/,
];

export function normalizeQuestion(value: string) {
  return value
    .toLocaleLowerCase('de-DE')
    .replace(/[^a-z0-9äöüß\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isRulingQuestion(question: string) {
  const normalized = normalizeQuestion(question);
  return RULING_PATTERNS.some((pattern) => pattern.test(normalized))
    || PERSONAL_PATTERNS.some((pattern) => pattern.test(normalized));
}

type IndexEntry = AssistantHit & { haystack: string };

function buildIndex(): IndexEntry[] {
  const entries: IndexEntry[] = [];

  for (const topic of KNOWLEDGE_TOPICS) {
    entries.push({
      label: topic.title,
      detail: topic.intro,
      area: 'Islam verstehen · Wissensbibliothek',
      haystack: normalizeQuestion(`${topic.title} ${topic.intro} ${topic.sections.map((s) => `${s.subtitle} ${s.text}`).join(' ')}`),
    });
  }

  // The eighteen lessons are the richest content in the app and were the
  // obvious omission: a question about Tawhid landed on the prophets overview
  // because the lesson called "Tawhid" was not in the index.
  for (const lesson of LEARNING_LESSONS) {
    entries.push({
      label: lesson.title,
      detail: lesson.summary,
      area: 'Islam verstehen · Lektionen',
      source: lesson.sources.map((entry) => entry.reference).join(' · '),
      haystack: normalizeQuestion(`${lesson.title} ${lesson.summary} ${lesson.paragraphs.join(' ')} ${lesson.keyPoints.join(' ')}`),
    });
  }

  for (const entry of HADITH_LIBRARY) {
    entries.push({
      label: entry.title,
      detail: entry.summary,
      area: 'Islam verstehen · Hadith-Sammlung',
      source: entry.source,
      haystack: normalizeQuestion(`${entry.title} ${entry.summary} ${entry.context ?? ''}`),
    });
  }

  for (const dua of DUAS) {
    entries.push({
      label: dua.title,
      detail: dua.translation,
      area: 'Duas',
      source: dua.source,
      haystack: normalizeQuestion(`${dua.title} ${dua.translation} ${dua.transliteration}`),
    });
  }

  for (const prophet of PROPHETS) {
    entries.push({
      label: prophet.name,
      detail: prophet.intro,
      area: 'Islam verstehen · Propheten',
      haystack: normalizeQuestion(`${prophet.name} ${prophet.commonName ?? ''} ${prophet.intro} ${prophet.description} ${prophet.keyPoints.join(' ')}`),
    });
  }

  for (const guide of WORSHIP_GUIDES) {
    entries.push({
      label: guide.title,
      detail: guide.intro,
      area: 'Islam verstehen · Anleitungen',
      haystack: normalizeQuestion(`${guide.title} ${guide.intro} ${guide.steps.map((step) => `${step.title} ${step.description} ${step.transliteration ?? ''}`).join(' ')}`),
    });
  }

  return entries;
}

const index = buildIndex();

/** Words too common to distinguish one entry from another. */
const STOPWORDS = new Set([
  'der', 'die', 'das', 'ein', 'eine', 'und', 'oder', 'ist', 'sind', 'was', 'wie', 'wer', 'wo',
  'wann', 'warum', 'welche', 'welcher', 'welches', 'für', 'von', 'mit', 'im', 'in', 'am', 'an',
  'auf', 'zu', 'des', 'dem', 'den', 'ich', 'du', 'man', 'mir', 'mich', 'es', 'sich', 'bedeutet',
  'bedeutung', 'erkläre', 'erklär', 'sagt', 'gibt', 'hat', 'haben', 'kann', 'nicht',
]);

export function searchContent(question: string, limit = 3): AssistantHit[] {
  const terms = normalizeQuestion(question)
    .split(' ')
    .filter((term) => term.length > 2 && !STOPWORDS.has(term));
  if (!terms.length) return [];

  // A term in the entry's own title is a stronger signal than the same term
  // buried in its body: "Tawhid" ranked the prophets overview level with the
  // lesson actually called Tawhid, because each mentions it once.
  const scored = index
    .map((entry) => {
      const label = normalizeQuestion(entry.label);
      return {
        entry,
        score: terms.reduce(
          (total, term) => total + (label.includes(term) ? 3 : 0) + (entry.haystack.includes(term) ? 1 : 0),
          0,
        ),
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  // A single common term matching a single entry is noise, not an answer.
  const best = scored[0]?.score ?? 0;
  if (best === 0) return [];

  return scored
    .filter(({ score }) => score === best)
    .slice(0, limit)
    .map(({ entry }) => ({ label: entry.label, detail: entry.detail, area: entry.area, source: entry.source }));
}

export function answerFromApp(question: string): AssistantReply {
  if (isRulingQuestion(question)) {
    return {
      kind: 'declined',
      text: 'Das ist eine Frage danach, was erlaubt, Pflicht oder gültig ist — oder sie betrifft deine persönliche Lage. Darauf antworte ich bewusst nicht. Solche Fragen hängen von Einzelheiten ab, unterscheiden sich zwischen den Rechtsschulen und gehören zu einer qualifizierten Person, die dich und deine Situation kennt.',
      note: 'Bewusst nicht beantwortet',
    };
  }

  const hits = searchContent(question);
  if (hits.length) {
    return {
      kind: 'hits',
      text: hits.length === 1
        ? 'Dazu findest du in der App einen Eintrag:'
        : 'Dazu findest du in der App diese Einträge:',
      note: 'Aus dem Bestand der App',
      hits,
    };
  }

  return {
    kind: 'none',
    text: 'Dazu habe ich in der App keinen passenden Eintrag. Ich erfinde deshalb keine religiöse Antwort. Schau in den Bereichen Quran, Gebete, Islam verstehen, Duas oder Dhikr nach — oder frage eine qualifizierte, vertrauenswürdige Stelle.',
    note: 'Kein Treffer im Bestand',
  };
}
