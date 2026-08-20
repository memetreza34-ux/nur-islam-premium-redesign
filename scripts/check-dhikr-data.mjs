import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const dataSource = await readFile(resolve(root, 'src/data/dhikrData.ts'), 'utf8');
const screenSource = await readFile(resolve(root, 'src/screens/DhikrScreen.tsx'), 'utf8');
const stylesSource = await readFile(resolve(root, 'src/styles.css'), 'utf8');
const hardeningStyles = await readFile(resolve(root, 'src/styles/functional-hardening.css'), 'utf8');

const routineIds = [...dataSource.matchAll(/\n\s+id: '(after-prayer|morning-weighted|before-sleep)'/g)].map((match) => match[1]);
const uniqueRoutineIds = new Set(routineIds);

for (const required of ['after-prayer', 'morning-weighted', 'before-sleep']) {
  if (!uniqueRoutineIds.has(required)) throw new Error(`Dhikr routine is missing: ${required}`);
}

if (dataSource.includes("id: 'free-counter'") || dataSource.includes("source: 'Persönlicher Zähler · keine bestimmte Anzahl behauptet'")) {
  throw new Error('A neutral/free counter must not reappear with an artificial religious target inside the sourced routine system.');
}

for (const source of [
  'Sahih Muslim 597a',
  'Sahih Muslim 2726a',
  'Sahih al-Bukhari 3113; Sahih al-Bukhari 5361',
]) {
  if (!dataSource.includes(source)) throw new Error(`Dhikr source label is missing: ${source}`);
}

if (!dataSource.includes('33-mal SubhanAllah, 33-mal Alhamdulillah und 34-mal Allahu Akbar')) {
  throw new Error('Bedtime Dhikr description must preserve the source-backed 33/33/34 form.');
}
if (!/id: 'sleep-allahu-akbar'[\s\S]*?target: 34/.test(dataSource)) {
  throw new Error('Bedtime Takbir must remain 34 repetitions for the selected Bukhari 3113/5361 form.');
}
if (!/id: 'sleep-subhanallah'[\s\S]*?target: 33/.test(dataSource)
  || !/id: 'sleep-alhamdulillah'[\s\S]*?target: 33/.test(dataSource)) {
  throw new Error('Bedtime Tasbih/Tahmid must remain 33 repetitions for the selected Bukhari 3113/5361 form.');
}
if (!dataSource.includes('unterschiedlichen Wortlautvarianten') || !dataSource.includes('andere authentische Varianten nicht für ungültig')) {
  throw new Error('Bedtime Dhikr must keep the authentic-variant notice instead of presenting one wording as the only valid form.');
}

const targetValues = [...dataSource.matchAll(/target: (\d+)/g)].map((match) => Number(match[1]));
if (targetValues.length < 8 || targetValues.some((value) => !Number.isInteger(value) || value < 1)) {
  throw new Error('Sourced Dhikr targets are incomplete or invalid.');
}

for (const required of [
  'nur_dhikr_daily_v2',
  'nur_dhikr_active_routine',
  'todayKey()',
  'DHIKR_ROUTINES',
  'DHIKR_TARGET_BY_KEY',
  'DHIKR_TARGET_BY_KEY.has(key)',
  'Math.min(DHIKR_TARGET_BY_KEY.get(key)',
  'statsOpen',
  'setStatsOpen(true)',
  'reference-dhikr-stats-modal',
  'allRoutineStats',
  'completedRoutines',
  'reference-dhikr-source',
]) {
  if (!screenSource.includes(required)) throw new Error(`Dhikr screen integration is missing: ${required}`);
}

if (screenSource.includes("onClick={() => flash(`${totalToday} Wiederholungen heute`)}")) {
  throw new Error('Dhikr statistics control regressed to a toast-only action.');
}

if (!stylesSource.includes('reference-dhikr-complete.css') || !stylesSource.includes('functional-hardening.css')) {
  throw new Error('Complete Dhikr or functional hardening stylesheet is not loaded.');
}
for (const required of ['.reference-dhikr-stats-modal', '.reference-dhikr-stats-summary', '.reference-dhikr-stats-list']) {
  if (!hardeningStyles.includes(required)) throw new Error(`Dhikr statistics styling is missing: ${required}`);
}

console.log(`Dhikr verified: ${uniqueRoutineIds.size} sourced routines, source-backed repetition counts including bedtime 33/33/34, authentic-variant notice, valid capped persisted counts, and no artificial free-counter target.`);
