/**
 * The Wudu and prayer guides.
 *
 * The app carried six shortened steps each for Wudu and Salah and no Arabic at
 * all — for a guide whose whole purpose is teaching someone what to say, the
 * words were the one thing missing. Three guides did not exist: what is said in
 * each position, the obligatory parts, and the common mistakes.
 *
 * What this holds in place is the Arabic. A summary of a prayer guide is not a
 * prayer guide, and the wording is the part most likely to be dropped in a
 * redesign because it is the part that complicates a layout.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const data = await readFile(resolve(root, 'src/data/worshipGuideData.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/ReferenceReadingScreens.tsx'), 'utf8');

const guideIds = [...data.matchAll(/^ {4}id: '([^']+)',$/gm)].map((match) => match[1]);
for (const required of ['wudu', 'salah', 'what-to-say', 'mandatory', 'mistakes']) {
  if (!guideIds.includes(required)) throw new Error(`Worship guide "${required}" is missing.`);
}

const steps = [...data.matchAll(/^ {8}title: '((?:[^'\\]|\\.)*)',\n\s+description: '((?:[^'\\]|\\.)*)',/gm)];
if (steps.length < 50) {
  throw new Error(`Worship guides hold ${steps.length} steps; at least 50 are expected.`);
}
for (const [, title, description] of steps) {
  if (description.trim().length < 20) throw new Error(`Guide step "${title}" has no usable description.`);
}

// The Arabic is the point of these guides, so its presence is measured rather
// than assumed. "what-to-say" carries it on every step by definition.
const arabicCount = (data.match(/^ {8}arabic: '/gm) ?? []).length;
if (arabicCount < 18) {
  throw new Error(`Only ${arabicCount} guide steps carry Arabic wording; at least 18 are expected.`);
}

const whatToSay = data.slice(data.indexOf("id: 'what-to-say'"), data.indexOf("id: 'mandatory'"));
const whatToSayTitles = (whatToSay.match(/^ {8}title: '/gm) ?? []).length;
const whatToSayArabic = (whatToSay.match(/^ {8}arabic: '/gm) ?? []).length;
if (whatToSayArabic !== whatToSayTitles) {
  throw new Error(
    `"Was sagt man im Gebet" has ${whatToSayTitles} steps but only ${whatToSayArabic} carry the wording.\n`
      + '  Every step of that guide exists to show what is said.',
  );
}

for (const requirement of [
  "import { WORSHIP_GUIDES, WORSHIP_GUIDE_BY_ID } from '../data/worshipGuideData';",
  'reference-guide-arabic',
  'reference-guide-translit',
  'dir="rtl"',
  // The stored step index belongs to a list whose length differs per guide.
  'Math.min(activeStep, steps.length - 1)',
]) {
  if (!screen.includes(requirement)) throw new Error(`Worship guide screen is missing: ${requirement}`);
}

if (screen.includes('const wuduSteps: GuideStep[]')) {
  throw new Error('The six hard-coded Wudu steps are back; src/data/worshipGuideData.ts is the source.');
}

console.log(
  `Worship guides verified: ${guideIds.length} guides, ${steps.length} steps, ${arabicCount} carrying Arabic wording with its transliteration.`,
);
