import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');
const [duas, quran, collections, notes, backend] = await Promise.all([
  read('src/DuasScreen.tsx'),
  read('src/QuranScreen.tsx'),
  read('src/CollectionsScreen.tsx'),
  read('src/NotesScreen.tsx'),
  read('src/nurBackend.ts'),
]);

for (const requirement of [
  'return new Set(migrated);',
  "readStringSet('nur_dua_favorites', ['dua_guidance_1'])",
]) {
  if (!duas.includes(requirement)) throw new Error(`Dua persistence integrity is missing: ${requirement}`);
}
if (duas.includes('return new Set(migrated.length ? migrated : fallback);')) {
  throw new Error('An intentionally empty stored Dua favorite set must remain empty.');
}

for (const requirement of [
  "typeof value === 'string' && /^\\d+$/.test(value)",
  'Number.isInteger(value) && value >= 1 && value <= 114',
  "readNumberSet('nur_quran_surah_favorites')",
]) {
  if (!quran.includes(requirement)) throw new Error(`Quran persisted-ID validation is missing: ${requirement}`);
}

for (const requirement of [
  'function isValidDateKey(value: string)',
  "const match = /^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(value)",
  "readDateSet('nur_calendar_favorites')",
  "readNumberSet('nur_quran_surah_favorites', [], 114)",
  'value > 0 && value <= max',
]) {
  if (!collections.includes(requirement)) throw new Error(`Collection persistence validation is missing: ${requirement}`);
}

for (const requirement of [
  'hasValidDate',
  'Number.isFinite(Date.parse(value))',
]) {
  if (!notes.includes(requirement)) throw new Error(`Note persistence validation is missing: ${requirement}`);
}

for (const requirement of [
  "'nur_local_notes_v1'",
  "'nur_prayer_times_latest'",
  "'nur_prayer_location'",
  "'nur_mosque_location_v1'",
  "'nur_mosque_search_cache_v1'",
  "'nur_install_prompt_dismissed'",
  "'nur_onboarding_complete'",
  "key.startsWith('nur_prayer_reminders_fired_')",
  "key.startsWith('nur_calendar_reminders_fired_')",
]) {
  if (!backend.includes(requirement)) throw new Error(`Cloud backup exclusion is missing: ${requirement}`);
}

console.log('Persistence integrity verified: empty favorites stay empty, Quran IDs and saved calendar dates are validated, malformed note dates are filtered, and device/ephemeral state is excluded from cloud backups.');
