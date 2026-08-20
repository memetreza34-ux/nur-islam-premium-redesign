import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const data = await readFile(resolve(root, 'src/data/worshipGuideData.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/ReferenceReadingScreens.tsx'), 'utf8');

const guideIds = [...data.matchAll(/^ {4}id: '([^']+)',$/gm)].map((match) => match[1]);
for (const required of ['wudu', 'salah', 'what-to-say', 'mandatory', 'mistakes']) {
  if (!guideIds.includes(required)) throw new Error(`Worship guide "${required}" is missing.`);
}

for (const source of ['Quran 5:6', 'Sahih al-Bukhari 164', 'Sahih Muslim 235a', 'Sahih Muslim 234a/234b']) {
  if (!data.includes(source)) throw new Error(`Safe Wudu source is missing: ${source}`);
}

for (const required of [
  'Die Absicht ist keine auswendig zu sprechende Formel.',
  'unterschiedliche zulässige Wiederholungszahlen',
  'nicht jeder Waschschritt wird dadurch zu einer universell dreimal verpflichtenden Handlung',
  'keine universelle Liste',
  'keine individuelle Fatwa',
]) {
  if (!data.includes(required)) throw new Error(`Worship safety wording is missing: ${required}`);
}

for (const forbidden of [
  "Hebe die Hände zu den Ohren und sage 'Allahu Akbar'",
  'Das Gebet hat bestimmte Säulen (Arkan), ohne die das Gebet ungültig ist.',
  'Wenn du eine Säule vergisst, musst du sie nachholen.',
  'können das Gebet ungültig machen, wenn es zu viel wird',
]) {
  if (data.includes(forbidden)) throw new Error(`Unsafe universal worship wording returned: ${forbidden}`);
}

const wudu = data.slice(data.indexOf("id: 'wudu'"), data.indexOf("id: 'salah'"));
const wuduSteps = (wudu.match(/^ {8}title: '/gm) ?? []).length;
if (wuduSteps < 7) throw new Error(`Wudu guide is too short: ${wuduSteps} steps.`);
if (!wudu.includes('أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ')) {
  throw new Error('The Sahih Muslim post-Wudu shahada is missing.');
}

for (const requirement of [
  "import { WORSHIP_GUIDES, WORSHIP_GUIDE_BY_ID } from '../data/worshipGuideData';",
  'reference-guide-arabic',
  'reference-guide-translit',
  'dir="rtl"',
  'Math.min(activeStep, steps.length - 1)',
]) {
  if (!screen.includes(requirement)) throw new Error(`Worship guide screen is missing: ${requirement}`);
}

console.log(`Worship guide safety verified: ${guideIds.length} guide states, sourced Wudu core, and no legacy universal fiqh invalidation rules.`);
