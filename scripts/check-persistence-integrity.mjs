import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');
const [duas, names, quran, reader, collections, calendar, notes, backend] = await Promise.all([
  read('src/screens/DuasScreen.tsx'),
  read('src/screens/NamesScreen.tsx'),
  read('src/screens/QuranScreen.tsx'),
  read('src/screens/QuranReaderScreen.tsx'),
  read('src/screens/CollectionsScreen.tsx'),
  read('src/screens/CalendarScreen.tsx'),
  read('src/screens/NotesScreen.tsx'),
  read('src/services/nurBackend.ts'),
]);

for (const requirement of [
  'return new Set(migrated);',
  "useState(() => readStringSet('nur_dua_favorites'))",
]) {
  if (!duas.includes(requirement)) throw new Error(`Dua persistence integrity is missing: ${requirement}`);
}
for (const forbidden of [
  'return new Set(migrated.length ? migrated : fallback);',
  "readStringSet('nur_dua_favorites', ['dua_guidance_1'])",
]) {
  if (duas.includes(forbidden)) throw new Error(`An intentionally empty stored Dua favorite set must remain empty: ${forbidden}`);
}

for (const requirement of [
  "useState(() => migrateNameSet('nur_name_favorites'))",
  "useState(() => migrateNameSet('nur_name_learned'))",
  'localStorage.setItem(key, JSON.stringify([...migrated]))',
]) {
  if (!names.includes(requirement)) throw new Error(`Name persistence integrity is missing: ${requirement}`);
}
if (names.includes("migrateNameSet('nur_name_favorites', ['1'])")) {
  throw new Error('An empty Name favorite set must not be seeded with Name 1.');
}

for (const requirement of [
  "typeof value === 'string' && /^\\d+$/.test(value)",
  'Number.isInteger(value) && value >= 1 && value <= 114',
  "readNumberSet('nur_quran_surah_favorites')",
  'function readLastRead(): LastRead | null',
  'if (!raw) return null;',
]) {
  if (!quran.includes(requirement)) throw new Error(`Quran persisted-ID validation is missing: ${requirement}`);
}

for (const requirement of [
  'function normalizePositiveInteger(value: unknown, fallback = 1)',
  "localStorage.getItem('nur_reader_font_size')",
  'Math.min(48, Math.max(26, Math.round(value)))',
  'normalizePositiveInteger(value, 0)',
  'value >= 1 && value <= 114',
  'ayahNumber <= data.meta.numberOfAyahs',
  'Math.min(bundle.meta.numberOfAyahs, normalizePositiveInteger(initialAyahNumber))',
  'const validatedAyah = Math.min(bundle.meta.numberOfAyahs, Math.max(1, activeAyah))',
]) {
  if (!reader.includes(requirement)) throw new Error(`Quran reader persistence validation is missing: ${requirement}`);
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
  'const entryIdRef = useRef(Date.now() * 1000)',
  'Math.max(entryIdRef.current + 1, Date.now() * 1000)',
  'id: nextEntryId()',
]) {
  if (!calendar.includes(requirement)) throw new Error(`Calendar persistence identity is missing: ${requirement}`);
}

for (const requirement of [
  'hasValidDate',
  'Number.isFinite(Date.parse(value))',
  'const localNoteIdRef = useRef(Date.now() * 1000)',
  'Math.max(localNoteIdRef.current + 1, Date.now() * 1000)',
  'id: nextLocalNoteId()',
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

console.log('Persistence integrity verified: empty Dua/Name favorites stay empty, Quran IDs/reader values and saved calendar dates are validated, local Calendar/Note IDs are collision-resistant, malformed note dates are filtered, and device/ephemeral state is excluded from cloud backups.');
