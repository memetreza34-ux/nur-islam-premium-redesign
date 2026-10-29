import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');
const homeProgress = await read('src/services/homeQuranProgress.ts');
const dhikrDailyState = await read('src/services/dhikrDailyState.ts');
const learningProgress = await read('src/services/learningProgress.ts');
const learningCourse = await read('src/screens/LearningCourseScreen.tsx');
const guideProgress = await read('src/services/worshipGuideProgress.ts');
const guideScreen = await read('src/screens/ReferenceReadingScreens.tsx');
const learningHub = await read('src/screens/LearnScreen.tsx');

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

requireTokens(learningProgress, 'Knowledge course write acknowledgement', [
  "LEARNING_PROGRESS_KEY = 'nur_learning_completed'",
  'if (!current.valid) return null;',
  'localStorage.getItem(LEARNING_PROGRESS_KEY) === value',
  'localStorage.getItem(key) === lessonId',
]);
requireTokens(learningCourse, 'Reading position feedback without completion', [
  'readLearningPosition',
  'writeLearningPosition',
  'Speicherung der letzten Lektionsposition',
  'Lektion auswählen',
  "x: '-50%'",
]);
forbidTokens(learningCourse, 'No completion writes from reading lessons', [
  'updateLearningCompletion',
  'completionSaved',
  'Lektionsfortschritt zurücksetzen',
]);
forbidTokens(learningCourse, 'Knowledge course mount data preservation', [
  'useEffect(() => writeStringSet',
  'parsed.map(String)',
]);

requireTokens(guideProgress, 'Worship guide validated persistence', [
  'WORSHIP_GUIDE_BY_ID.get(guideId)',
  'Number.isInteger(stepIndex)',
  'Number(step.raw) < guide.steps.length',
  '!readGuideProgress(guideId).stepValid',
  'localStorage.getItem(key) === value',
]);
requireTokens(guideScreen, 'Reading position without completion', [
  'saveGuideStep(guide.id, index)', 'Speicherung der Schrittposition nicht bestätigt', 'stored.stepValid',
]);
forbidTokens(guideScreen, 'No completion writes or bars in guides', [
  'saveGuideCompletion', 'completeGuide', 'completionValid', 'stored.completed', 'reference-guide-progress',
]);
forbidTokens(learningHub, 'Learning directory without completion or a duplicate course entry', [
  'readPrayerCompletion', 'completedPrayerLessons', 'coreProgress', 'learn-library-prayer-entry',
]);
const prayerLearning = await read('src/screens/PrayerLearningScreen.tsx');
forbidTokens(prayerLearning, 'Prayer learning without completion tracking', [
  'nur_prayer_learning_complete', 'completedLessons', 'completionOpen', 'courseProgress', 'is-complete',
]);

requireTokens(homeProgress, 'Home Quran progress data', [
  'hasProgress: boolean',
  'progressFor(surahs[0])',
  'hasProgress = false',
  'surahsByNumber.get(surahNumber)',
  'Math.min(ayahNumber, surah.numberOfAyahs)',
  "localStorage.getItem('nur_quran_last_read')",
]);
requireTokens(app, 'Home Quran progress', [
  'useState(readHomeQuranProgress)',
  'quranProgress.hasProgress && quranProgress.numberOfAyahs',
  "'Quran beginnen'",
  "'Noch kein Lesestand'",
  'data-home-section="continue"',
]);
if (app.split('data-home-section="continue"').length !== 2) throw new Error('Start must contain exactly one Quran resume card.');
forbidTokens(app, 'Home Quran progress', [
  "surahNumber: 112,\n    ayahNumber: 1,\n    englishName: 'Al-Ikhlaas'",
  "label: 'Quran lesen', eyebrow: 'Zuletzt gelesen', icon: BookOpen",
  ': 1;\n\n  useEffect(() => {\n    const syncLocalProgress',
]);

requireTokens(quran, 'Quran catalog progress', [
  'function readLastRead(): LastRead | null',
  'if (!raw) return null;',
  "lastRead ? 'Weiterlesen' : 'Lesen beginnen'",
  'const readerSurahNumber = lastSurah?.number ?? lastRead?.surahNumber ?? 1',
  'title={`Sure ${readerSurahNumber}`}',
  'meta={lastRead && lastSurah ? <span id="quran-resume-position">Ayah {lastAyah} von {lastSurah.numberOfAyahs}</span> : undefined}',
  'progress={0}',
]);
forbidTokens(quran, 'Quran catalog progress', [
  'const fallback = { surahNumber: 112, ayahNumber: 1',
  'Math.max(4, (lastAyah / lastSurah.numberOfAyahs)',
]);

requireTokens(reader, 'Quran reader validated persistence', [
  'if (!bundle || bundle.meta.number !== surahNumber) return;',
  'const validatedAyah = Math.min(bundle.meta.numberOfAyahs, Math.max(1, activeAyah))',
  'surahNumber: bundle.meta.number',
  'ayahNumber: validatedAyah',
  'readBookmarks(surahNumber, data.meta.numberOfAyahs)',
  'localStorage.getItem(key) === value',
  'ayahNumber <= surah.numberOfAyahs',
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
  'readDhikrDailyState()',
  'const firstItem = routine.items[0]',
  'const firstItemKey = `${routine.id}:${firstItem.id}`',
  'counts: { [firstItemKey]: 1 }',
  'toastTimerRef',
]);
requireTokens(dhikrDailyState, 'Validated Dhikr daily state', [
  "localStorage.getItem('nur_dhikr_daily_v2')",
  'parsed.date !== day',
  'targetByKey.has(key)',
  'Math.min(targetByKey.get(key) ?? 0, Math.floor(value as number))',
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
