/**
 * The quiz catalogue has to stay whole and answerable.
 *
 * It went from five inline questions to sixty carried over from the old repo,
 * which is enough that a broken entry stops being obvious by reading the file.
 * A question whose `correctAnswer` points past its options, or two questions
 * sharing an id, both look fine in a diff and fail only in front of a user.
 *
 * The explanation is checked as strictly as the answer: a quiz that only says
 * "richtig" or "falsch" tests, one that gives the reason teaches, and the
 * second is the point of this screen.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const source = await readFile(resolve(root, 'src/data/quizData.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/LegacyFeatureScreens.tsx'), 'utf8');

const categoryIds = [...source.matchAll(/^ {4}id: '([^']+)',$/gm)].map((match) => match[1]);
const questionIds = [...source.matchAll(/^ {8}id: '([^']+)',$/gm)].map((match) => match[1]);

if (categoryIds.length < 6) {
  throw new Error(`Quiz has ${categoryIds.length} categories; at least 6 are expected.`);
}
if (questionIds.length < 60) {
  throw new Error(`Quiz has ${questionIds.length} questions; at least 60 are expected.`);
}
if (new Set(categoryIds).size !== categoryIds.length) {
  throw new Error('Quiz category ids are not unique.');
}
if (new Set(questionIds).size !== questionIds.length) {
  const seen = new Set();
  const duplicate = questionIds.find((id) => seen.size === seen.add(id).size);
  throw new Error(`Quiz question ids are not unique: ${duplicate}`);
}

const questions = [...source.matchAll(
  /id: '([^']+)',\n\s+question: '(?:[^'\\]|\\.)*',\n\s+options: \[([^\]]*)\],\n\s+correctAnswer: (\d+),\n\s+explanation: '((?:[^'\\]|\\.)*)',/g,
)];

if (questions.length !== questionIds.length) {
  throw new Error(`Only ${questions.length} of ${questionIds.length} questions have the full question/options/answer/explanation shape.`);
}

for (const [, id, rawOptions, correctAnswer, explanation] of questions) {
  const optionCount = rawOptions.split(/',\s*'/).length;
  if (optionCount < 2) throw new Error(`Quiz question ${id} offers fewer than two options.`);

  const answerIndex = Number(correctAnswer);
  if (answerIndex < 0 || answerIndex >= optionCount) {
    throw new Error(`Quiz question ${id} points at option ${answerIndex}, but only has ${optionCount}.`);
  }
  if (explanation.trim().length < 20) {
    throw new Error(`Quiz question ${id} has no usable explanation.`);
  }
}

for (const requirement of [
  "import { QUIZ_CATEGORIES } from '../data/quizData';",
  'reference-quiz-categories',
  // The explanation renders only once an answer is locked in; showing it
  // earlier would hand over the answer.
  'selected === null ? null : (',
  'reference-quiz-explanation',
  "writeStored('nur_quiz_best_scores', nextBest)",
]) {
  if (!screen.includes(requirement)) throw new Error(`Quiz screen is missing: ${requirement}`);
}

if (screen.includes('const quizQuestions = [')) {
  throw new Error('The five inline quiz questions are back; the catalogue in src/data/quizData.ts is the source.');
}

// Where the correct answer sits has to stay spread across the four positions.
// Carried over from the old repo, 31 of 60 answers sat on B and only 2 on D:
// always tapping the second option scored 52% without knowing anything, which
// is not a quiz, and the pattern is learned within one sitting. The options
// were reordered — same wording, same correct answer, different position.
const answerPositions = questions.map(([, , , correctAnswer]) => Number(correctAnswer));
const spread = [0, 0, 0, 0];
for (const position of answerPositions) spread[position] = (spread[position] ?? 0) + 1;

// Four positions over sixty questions is fifteen each. The band is wide enough
// that adding a question does not fail the build, and narrow enough that a
// guessable catalogue does.
const even = answerPositions.length / 4;
const lowest = Math.floor(even * 0.6);
const highest = Math.ceil(even * 1.4);
spread.forEach((count, position) => {
  if (count < lowest || count > highest) {
    throw new Error(
      `The correct answer sits on position ${position} ${count} times out of ${answerPositions.length} ` +
        `(expected between ${lowest} and ${highest}).\nSpread: ${spread.map((n, i) => `${i}:${n}`).join('  ')}\n` +
        'Reorder the options of a few questions — never change which option is correct.',
    );
  }
});

console.log(
  `Quiz verified: ${categoryIds.length} categories, ${questions.length} questions with unique ids, in-range answers and an explanation each, ` +
    `chosen by category and scored per category; correct answers spread ${spread.map((n, i) => `${i}:${n}`).join(' ')}.`,
);
