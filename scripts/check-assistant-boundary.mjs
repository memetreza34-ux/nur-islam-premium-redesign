/**
 * The assistant's boundary.
 *
 * It used to hold nine hand-written answers, and a keyword match was the only
 * thing between a question and one of them. That is fine for "Was bedeutet
 * Tawhid" and wrong for "Darf ich im Ramadan Wasser trinken" — a search will
 * happily match the second to an article about Ramadan and return something
 * that reads like a ruling.
 *
 * So two things are enforced here. Ruling and personal questions are turned
 * away before any lookup happens, and every answer comes from an entry that
 * already exists in the app rather than from prose written for the chat
 * window. Both are the kind of property that survives only if something checks
 * it: they are invisible until the day they are gone.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const index = await readFile(resolve(root, 'src/services/assistantIndex.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/AssistantScreen.tsx'), 'utf8');
const tests = await readFile(resolve(root, 'src/services/assistantIndex.test.ts'), 'utf8');

// The decline must happen before the search, not after it.
const declineAt = index.indexOf('isRulingQuestion(question)');
const searchAt = index.indexOf('searchContent(question)');
if (declineAt < 0 || searchAt < 0 || declineAt > searchAt) {
  throw new Error('answerFromApp must decline ruling questions before it searches for content.');
}

const patterns = (index.match(/\/\\b[^/]+\\b\//g) ?? []).length;
if (patterns < 20) {
  throw new Error(`Only ${patterns} ruling/personal phrasings are recognised; at least 20 are expected.`);
}

for (const phrasing of ['darf ich', 'muss ich', 'ist es erlaubt', 'fatwa', 'gültig']) {
  if (!index.includes(phrasing)) {
    throw new Error(`The assistant no longer recognises "${phrasing}" as a ruling question.`);
  }
}

// Answers are drawn from the app's own content, not composed for the chat.
for (const source of ['KNOWLEDGE_TOPICS', 'LEARNING_LESSONS', 'HADITH_LIBRARY', 'DUAS', 'PROPHETS', 'WORSHIP_GUIDES']) {
  if (!index.includes(source)) throw new Error(`The assistant index no longer covers ${source}.`);
}

if (screen.includes('const LOCAL_ANSWERS')) {
  throw new Error('The hand-written answer list is back; the assistant answers from the app\'s content.');
}
if (!screen.includes('reference-chat-hits')) {
  throw new Error('The assistant no longer shows which entry an answer came from.');
}

// The boundary is the one behaviour that must never regress silently.
for (const required of ['Darf ich im Ramadan Wasser trinken?', 'declines before searching']) {
  if (!tests.includes(required)) {
    throw new Error(`The test proving the assistant turns away ruling questions is missing: ${required}`);
  }
}

console.log(
  `Assistant boundary verified: ${patterns} ruling/personal phrasings turned away before any lookup, answers drawn from six content sets in the app, and the regression test for it in place.`,
);
