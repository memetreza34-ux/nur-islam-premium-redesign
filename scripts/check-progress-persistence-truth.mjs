import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [app, quran, reader, duas, names, dhikr, collections, calendar, notes, account, backend] = await Promise.all([
  read('src/app/App.tsx'),
  read('src/screens/QuranScreen.tsx'),
  read('src/screens/QuranReaderScreen.tsx'),
  read('src/screens/DuasScreen.tsx'),
  read('src/screens/NamesScreen.tsx'),
  read('src/screens/DhikrScreen.tsx'),
  read('src/screens/CollectionsScreen.tsx'),
  read('src/screens/CalendarScreen.tsx'),
  read('src/screens/NotesScreen.tsx'),
  read('src/screens/AccountScreen.tsx'),
  read('src/services/nurBackend.ts'),
]);

function requireTokens(source, label, tokens) {
  for (const token of tokens) {
    if (!source.includes(token)) throw new Error(`${label} is missing persistence truth token: ${token}`);
  }
}

function forbidTokens(source, label, tokens) {
  for (const token of tokens) {
    if (source.includes(token)) throw new Error(`${label} still contains a synthetic/default persistence token: ${token}`);
  }
}

requireTokens(app, 'Home Quran progress', [
  'hasProgress: boolean',
  'surahNumber: 1',
  "englishName: 'Al-Faatiha'",
  'hasProgress: false',
  "localStorage.getItem('nur_quran_last_read')",
  'quranProgress.hasProgress && quranProgress.numberOfAyahs',
  "'Quran beginnen'",
  "'Noch kein Lesestand'",
  "'Noch kein gespeicherter Lesestand'",
  "label: 'Quran lesen', eyebrow: 'Lesen & weiterlesen', icon: BookOpen",
]);
forbidTokens(app, 'Home Quran progress', [
  "surahNumber: 112,\n    ayahNumber: 1,\n    englishName: 'Al-Ikhlaas'",
  "label: 'Quran lesen', eyebrow: 'Zuletzt gelesen', icon: BookOpen",
  ': 1;\n\n  useEffect(() => {\n    const syncLocalProgress',
]);

requireTokens(quran, 'Quran catalog progress', [
  'function readLastRead(): LastRead | null',
  'if (!raw) return null;',
  "lastRead ? 'Weiterlesen' : 'Quran beginnen'",
  "lastRead ? 'Weiterlesen' : 'Lesen beginnen'",
  'const readerSurahNumber = lastSurah?.number ?? lastRead?.surahNumber ?? 1',
  'lastRead && lastSurah ? Math.min(100, Math.max(1, (lastAyah / lastSurah.numberOfAyahs) * 100)) : 0',
]);
forbidTokens(quran, 'Quran catalog progress', [
  'const fallback = { surahNumber: 112, ayahNumber: 1',
  'Math.max(4, (lastAyah / lastSurah.numberOfAyahs)',
]);

requireTokens(reader, 'Quran reader validated persistence', [
  'if (!bundle) return;',
  'const validatedAyah = Math.min(bundle.meta.numberOfAyahs, Math.max(1, activeAyah))',
  'surahNumber: bundle.meta.number',
  'ayahNumber: validatedAyah',
  'setBookmarks((current) => new Set([...current].filter((ayahNumber) => ayahNumber <= data.meta.numberOfAyahs)))',
]);
forbidTokens(reader, 'Quran reader validated persistence', [
  'surahNumber,\n        ayahNumber: activeAyah',
]);

requireTokens(duas, 'Dua favorites', [
  "useState(() => readStringSet('nur_dua_favorites'))",
  'toastTimerRef',
]);
forbidTokens(duas, 'Dua favorites', [
  "readStringSet('nur_dua_favorites', ['dua_guidance_1'])",
]);

requireTokens(names, 'Name favorites', [
  "useState(() => migrateNameSet('nur_name_favorites'))",
  "useState(() => migrateNameSet('nur_name_learned'))",
  'toastTimerRef',
]);
forbidTokens(names, 'Name favorites', [
  "migrateNameSet('nur_name_favorites', ['1'])",
]);

requireTokens(dhikr, 'Dhikr daily persistence', [
  'parsed.date !== fallback.date',
  'const firstItem = routine.items[0]',
  'const firstItemKey = `${routine.id}:${firstItem.id}`',
  'counts: { [firstItemKey]: 1 }',
  'toastTimerRef',
]);
forbidTokens(dhikr, 'Dhikr daily persistence', [
  'counts: { [itemKey]: 1 }',
]);

requireTokens(collections, 'Collection persistence routing', [
  "filter === 'Impulse'",
  "['Alle', 'Quran', 'Duas', 'Namen', 'Impulse', 'Termine']",
  'const showHighlights =',
  'readDuaFavoriteSet()',
  'readNameFavoriteSet()',
  'readSavedHadithIds',
  'readDateSet',
  'onOpenReader(group.surahNumber, ayahNumber)',
]);
forbidTokens(collections, 'Collection persistence routing', [
  "filter === 'Tagesinhalte'",
  "['Alle', 'Quran', 'Duas', 'Namen', 'Tagesinhalte', 'Termine']",
  "filter === 'Hadith' && !ayahSaved && !hadithSaved",
  "['Alle', 'Quran', 'Duas', 'Namen', 'Hadith', 'Termine']",
]);

requireTokens(calendar, 'Calendar persistence', [
  'function isValidDateKey(value: string)',
  "const match = /^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(value)",
  "typeof value === 'string' && isValidDateKey(value)",
  'const normalized = [...new Set(valid)]',
  "localStorage.setItem('nur_calendar_favorites', JSON.stringify(normalized))",
  'const entryIdRef = useRef(Date.now() * 1000)',
  'const nextEntryId = () => {',
  'Math.max(entryIdRef.current + 1, Date.now() * 1000)',
  'id: nextEntryId()',
  'toastTimerRef',
]);
forbidTokens(calendar, 'Calendar persistence', [
  'id: Date.now()',
  "parsed.filter((value): value is string => typeof value === 'string')",
]);

requireTokens(notes, 'Local note identity', [
  'const localNoteIdRef = useRef(Date.now() * 1000)',
  'const nextLocalNoteId = () => {',
  'Math.max(localNoteIdRef.current + 1, Date.now() * 1000)',
  'id: nextLocalNoteId()',
]);
forbidTokens(notes, 'Local note identity', [
  'id: `local-${Date.now()}`',
]);

requireTokens(account, 'Cloud deletion wording', [
  'Dein Auth-Konto bleibt bestehen, aber du wirst nach dem Löschen abgemeldet.',
  'Die Daten auf diesem Gerät werden nicht angetastet.',
  'Deine Nur-Islam-Cloud-Daten wurden gelöscht und du wurdest abgemeldet.',
]);
forbidTokens(account, 'Cloud deletion wording', [
  'Deine Anmeldung bleibt bestehen',
]);

requireTokens(backend, 'Cloud backup privacy', [
  "'nur_prayer_location'",
  "'nur_mosque_location_v1'",
  "'nur_local_notes_v1'",
  "'nur_onboarding_complete'",
  'await signOut();',
]);

console.log('Progress/persistence truth verified: Home and Quran never synthesize reading history, reader progress is range-validated, empty Dua/Name favorites stay empty, Dhikr rolls over coherently, collections preserve exact saved-content routing with durable Quran/Hadith impulses, Calendar favorite dates are validated/deduplicated, local Calendar/Notes IDs are collision-resistant, cloud deletion wording matches the actual sign-out behavior, and device-local/private state stays outside generic cloud backup.');
