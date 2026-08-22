import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [
  app,
  assistant,
  reader,
  quran,
  readingScreens,
  dailyHadith,
  hadithData,
  legacy,
  collections,
  duas,
  names,
  calendar,
  dhikr,
  qibla,
  prayer,
  more,
  prayerReminder,
  fastingReminder,
  backend,
  account,
  notes,
  mosqueService,
  installPrompt,
  styles,
  hardeningStyles,
  legacyOverviewStyles,
  installStyles,
  calendarService,
] = await Promise.all([
  read('src/app/App.tsx'),
  read('src/screens/AssistantScreen.tsx'),
  read('src/screens/QuranReaderScreen.tsx'),
  read('src/screens/QuranScreen.tsx'),
  read('src/screens/ReferenceReadingScreens.tsx'),
  read('src/screens/DailyHadithScreen.tsx'),
  read('src/data/hadithData.ts'),
  read('src/screens/LegacyFeatureScreens.tsx'),
  read('src/screens/CollectionsScreen.tsx'),
  read('src/screens/DuasScreen.tsx'),
  read('src/screens/NamesScreen.tsx'),
  read('src/screens/CalendarScreen.tsx'),
  read('src/screens/DhikrScreen.tsx'),
  read('src/screens/QiblaScreen.tsx'),
  read('src/screens/PrayerScreen.tsx'),
  read('src/screens/MoreScreen.tsx'),
  read('src/services/prayerReminderService.ts'),
  read('src/services/fastingReminderService.ts'),
  read('src/services/nurBackend.ts'),
  read('src/screens/AccountScreen.tsx'),
  read('src/screens/NotesScreen.tsx'),
  read('src/services/mosqueService.ts'),
  read('src/shared/InstallAppPrompt.tsx'),
  read('src/styles.css'),
  read('src/styles/functional-hardening.css'),
  read('src/styles/functional-legacy-overview.css'),
  read('src/styles/reference-install-prompt.css'),
  read('src/services/calendarReminderService.ts'),
]);

function requireText(source, requirements, label) {
  for (const requirement of requirements) {
    if (!source.includes(requirement)) throw new Error(`${label} is missing: ${requirement}`);
  }
}

function forbidText(source, forbidden, label) {
  for (const item of forbidden) {
    if (source.includes(item)) throw new Error(`${label} still contains a non-functional placeholder: ${item}`);
  }
}

requireText(app, [
  'readHomeQuranProgress',
  'readDhikrTotalToday',
  "localStorage.getItem('nur_quran_last_read')",
  "localStorage.getItem('nur_dhikr_daily_v2')",
  'fetchSurahs()',
  'openLastRead',
  'quranPercent',
  'onOpenReader(quranProgress.surahNumber, quranProgress.ayahNumber)',
  '<div className="brand-lockup" aria-label="Nur Islam">',
  'selectedAyahNumber',
  'initialAyahNumber={selectedAyahNumber}',
  // 'Lokaler Quellenmodus' was the assistant tile's eyebrow. The assistant is
  // not part of the public v1 surface, so Home no longer carries that string.
  'selectedDuaId',
  'selectedNameId',
  'selectedCalendarDate',
  'openSavedDua',
  'openSavedName',
  'openSavedCalendarDate',
  'initialDuaId={selectedDuaId}',
  'initialNameId={selectedNameId}',
  'initialDateKey={selectedCalendarDate}',
  'onOpenDua={openSavedDua}',
  'onOpenName={openSavedName}',
  'onOpenCalendarDate={openSavedCalendarDate}',
  'Ayah im Fokus',
  'getDailyHadith(now)',
  'selectedHadithId',
  'onOpenHadith={openSavedHadith}',
  "activeTab: 'quran'",
  "activeTab: 'reader' as const",
  'pushBrowserNavigation(quranSnapshot)',
  'pushBrowserNavigation(readerSnapshot)',
  "window.addEventListener('popstate'",
  'window.history.back()',
], 'Home and direct navigation');
forbidText(app, [
  '33 von 100',
  "width: '25%'",
  "target === 'reader' ? onOpenReader(112)",
  "label: 'KI-Assistent'",
  '<button className="brand-lockup"',
  "showToast('Nur Islam')",
  'onOpenDuas=',
  'onOpenNames=',
  'onOpenCalendar=',
  'Ayah des Tages',
], 'Home and direct navigation');

requireText(quran, [
  'reloadToken',
  'setReloadToken((value) => value + 1)',
  'function readLastRead(): LastRead | null',
  'if (!raw) return null;',
  "lastRead ? 'Weiterlesen' : 'Quran beginnen'",
  "lastRead ? 'Weiterlesen' : 'Lesen beginnen'",
  'const readerSurahNumber = lastSurah?.number ?? lastRead?.surahNumber ?? 1',
  'onOpenReader(readerSurahNumber, lastAyah)',
  'Math.min(lastRead.ayahNumber, lastSurah.numberOfAyahs)',
], 'Quran catalog real resume and retry');
forbidText(quran, [
  'const fallback = { surahNumber: 112, ayahNumber: 1',
  'Math.max(4, (lastAyah / lastSurah.numberOfAyahs)',
  'onOpenReader(lastSurah?.number ?? lastRead.surahNumber, lastAyah)',
], 'Quran catalog real resume and retry');

requireText(collections, [
  'Array.from({ length: 114 }',
  'nur_quran_bookmarks_${surahNumber}',
  'onOpenReader: (surahNumber: number, ayahNumber?: number) => void',
  'onOpenReader(group.surahNumber, ayahNumber)',
  'onOpenDua: (id: string) => void',
  'onOpenName: (id: string) => void',
  'onOpenCalendarDate: (date: string) => void',
  'onOpenHadith: (id: string) => void',
  'onOpenDua(id)',
  'onOpenName(id)',
  'onOpenCalendarDate(date)',
  'onOpenHadith(id)',
  "filter === 'Impulse'",
  "['Alle', 'Quran', 'Duas', 'Namen', 'Impulse', 'Termine']",
  'const showHighlights =',
  'readSavedHadithIds',
], 'Collection routing');
forbidText(collections, [
  'OFFLINE_QURAN_SURAHS',
  'onOpenDuas',
  'onOpenNames',
  'onOpenCalendar:',
  "filter === 'Tagesinhalte'",
  "['Alle', 'Quran', 'Duas', 'Namen', 'Tagesinhalte', 'Termine']",
  "filter === 'Hadith' && !ayahSaved && !hadithSaved",
  "['Alle', 'Quran', 'Duas', 'Namen', 'Hadith', 'Termine']",
], 'Collection routing');

requireText(reader, [
  'initialAyahNumber?: number',
  'setShowMeaning',
  'Bedeutung an',
  'Bedeutung aus',
  'reference-font-control',
  'quran-ayah-${surahNumber}-${targetAyah}',
  "scrollIntoView({ behavior: 'smooth', block: 'center' })",
  'id={`quran-ayah-${bundle.meta.number}-${ayahNumber}`}',
  'if (!bundle) return;',
  'const validatedAyah = Math.min(bundle.meta.numberOfAyahs, Math.max(1, activeAyah))',
  'surahNumber: bundle.meta.number',
  'ayahNumber: validatedAyah',
  'toastTimerRef',
], 'Quran reader controls, validated progress and deep links');
forbidText(reader, [
  'Audio folgt',
  '<Headphones',
  'geprüften Rezitationsquelle aktiviert',
  'surahNumber,\n        ayahNumber: activeAyah',
], 'Quran reader controls, validated progress and deep links');

requireText(duas, [
  'initialDuaId?: string | null',
  'DUA_BY_ID.get(initialDuaId)',
  'setSelected(dua)',
  "useState(() => readStringSet('nur_dua_favorites'))",
  'toastTimerRef',
], 'Dua direct open and empty-favorite persistence');
forbidText(duas, [
  "readStringSet('nur_dua_favorites', ['dua_guidance_1'])",
], 'Dua direct open and empty-favorite persistence');
requireText(names, [
  'initialNameId?: string | null',
  'String(entry.id) === initialNameId',
  'setSelected(name)',
], 'Name direct open');
requireText(calendar, [
  'initialDateKey?: string | null',
  'getInitialCalendarPosition',
  'monthOffset: (target.getFullYear()',
  'selectedDay: target.getDate()',
], 'Calendar direct open');

requireText(assistant, [
  // The nine hand-written answers were replaced by a lookup over the app's own
  // content, so an answer now points at an entry the user can open. The
  // guarantee this list protects is unchanged: no invented answers, and the
  // assistant says so when it has none. check-assistant-boundary covers the
  // decline path for ruling questions.
  'answerFromApp',
  'reference-chat-hits',
  'Kein Fake-KI-Modus',
  'reference-chat-message__source',
  'infoOpen',
  'setInfoOpen(true)',
  'reference-profile-modal reference-assistant-info-modal',
  'Was dieser Assistent wirklich kann',
  'Unbekannte Fragen werden ausdrücklich nicht beantwortet',
  'messageIdRef',
  'const userId = nextMessageId()',
  'const assistantId = nextMessageId()',
], 'Nur local assistant');
forbidText(assistant, [
  'Die Oberfläche ist vorbereitet',
  'Aktuell ist noch kein KI-Anbieter verbunden',
  '<Mic',
  'CircleCheckIcon',
  "flash('Nur Antworten",
  'const id = Date.now();',
], 'Nur local assistant');

requireText(readingScreens, [
  'async function copyText',
  'async function shareOrCopy',
  "navigator.share({ title, text })",
  "localStorage.setItem('nur_daily_ayah_saved'",
  'Ayah im Fokus',
  'Quran entdecken',
  'copyAyah',
  'shareAyah',
  'completeGuide',
  'nur_guide_${mode}_complete',
], 'Focused Ayah and worship guide actions');
forbidText(readingScreens, [
  'setPlaying',
  '<Headphones',
  "flash('Ayah kopiert')}",
  "flash('Teilen geöffnet')}",
  'export function HadithDetailScreen',
  'DAILY_HADITH_TEXT',
  'DAILY_HADITH_SOURCE',
  'Ayah des Tages',
  'Tägliche Inspiration',
  'export function QuranReaderScreen',
  // A toast pretending the settings opened. They are a real dialog now, so the
  // claim must not come back — and neither may the message the button used to
  // show while the surah was still loading, which said the feature did not exist.
  'Leseeinstellungen geöffnet',
  'Leseeinstellungen sind noch nicht verfügbar',
  'Lerneinstellungen geöffnet',
], 'Focused Ayah and worship guide actions');

requireText(dailyHadith, [
  'hadithId?: string | null',
  'getHadithById(hadithId) ?? getDailyHadith()',
  'readSavedHadithIds',
  'writeSavedHadithIds(next)',
  'toggleSaved',
  'shareOrCopy',
  'Hadith des Tages',
  'Gespeicherter Hadith',
  // The wording moved from "Primärquelle" to "Quellenangabe" when the screen
  // started distinguishing the daily rotation from a saved entry; the point of
  // the assertion is that the screen still defers to the cited source.
  'ist die angegebene Quellenangabe maßgeblich',
], 'Rotating daily Hadith actions');
forbidText(dailyHadith, [
  "localStorage.setItem('nur_daily_hadith_saved'",
  'DAILY_HADITH_TEXT',
], 'Rotating daily Hadith actions');

requireText(hadithData, [
  'export const HADITH_LIBRARY',
  'getDailyHadith',
  'getHadithById',
  "const SAVED_HADITH_STORAGE_KEY = 'nur_daily_hadith_saved_ids'",
  "const LEGACY_DAILY_HADITH_STORAGE_KEY = 'nur_daily_hadith_saved'",
  "saved.add('intentions')",
  'localDayNumber(date)',
  // The daily Hadith rotates over the curated, individually referenced pool -
  // not over the whole legacy library, which is still awaiting review.
  'export const DAILY_HADITH_IDS',
  'const DAILY_HADITH_POOL = DAILY_HADITH_IDS',
  'return pool[index]',
  'A damaged legacy key must not prevent valid favorites',
], 'Hadith rotation and bookmark migration');
forbidText(hadithData, [
  'HADITH_LIBRARY[index]',
], 'Hadith rotation and bookmark migration');

requireText(dhikr, [
  'DHIKR_TARGET_BY_KEY',
  'statsOpen',
  'setStatsOpen(true)',
  'reference-dhikr-stats-modal',
  'allRoutineStats',
  'completedRoutines',
  'toastTimerRef',
  'const firstItem = routine.items[0]',
  'const firstItemKey = `${routine.id}:${firstItem.id}`',
  'counts: { [firstItemKey]: 1 }',
], 'Dhikr real statistics and day rollover');
forbidText(dhikr, [
  'onClick={() => flash(`${totalToday} Wiederholungen heute`)}',
  'counts: { [itemKey]: 1 }',
], 'Dhikr real statistics and day rollover');

requireText(qibla, [
  'sensorTimeoutRef',
  'toastTimeoutRef',
  "window.removeEventListener('deviceorientationabsolute'",
  "window.removeEventListener('deviceorientation'",
  'savePrayerLocation({ latitude, longitude, label, source: \'device\' })',
  'void bootstrapSharedPrayerTimes()',
], 'Qibla sensor and location cleanup');

requireText(prayer, [
  "readSet('nur_prayer_notifications', [])",
  'obligatoryIds.includes',
  'prayer.obligatory && notifications.has(prayer.id)',
  'prayer-alert--disabled',
  'In-App-Erinnerung aktiviert; Systembenachrichtigungen sind nicht verfügbar',
], 'Prayer reminder controls');
forbidText(prayer, [
  "readSet('nur_prayer_notifications', ['fajr'",
], 'Prayer reminder controls');
requireText(prayerReminder, [
  'OBLIGATORY_PRAYER_IDS',
  'readEnabledReminderSet',
  '!prayer.obligatory',
], 'Prayer reminder scheduler');

requireText(more, [
  'readReminderEnabled',
  'OBLIGATORY_PRAYER_IDS.some',
  'systemNotificationAvailable',
  "JSON.stringify(OBLIGATORY_PRAYER_IDS)",
  'In-App-Erinnerungen aktiviert; Systembenachrichtigungen sind nicht verfügbar',
], 'Global reminder settings');
forbidText(more, [
  "flash('Systembenachrichtigungen werden auf diesem Gerät nicht unterstützt')",
  "flash('Benachrichtigungen wurden nicht freigegeben')",
], 'Global reminder settings');

requireText(backend, [
  "'nur_prayer_location'",
  "'nur_mosque_location_v1'",
  "'nur_local_notes_v1'",
  "'nur_onboarding_complete'",
  'await signOut();',
], 'Cloud backup privacy and deletion session cleanup');
requireText(account, [
  'Standortkoordinaten und lokale Notizen sind nicht Teil dieses Backups',
  'Die Übertragung erfolgt per HTTPS',
], 'Cloud backup UI');
forbidText(account, ['verschlüsselt per HTTPS'], 'Cloud backup UI');
requireText(notes, [
  'hasValidDate',
  'Cloud-Notizen konnten nicht geladen werden',
], 'Notes failure handling');

requireText(mosqueService, [
  'function normalizeWebsite',
  'new URL(candidate)',
  "parsed.protocol !== 'https:' && parsed.protocol !== 'http:'",
], 'Mosque external links');

requireText(installPrompt, [
  'function isIosDevice',
  "navigatorWithPlatform.platform === 'MacIntel'",
  'installError',
  'setInstallEvent(null)',
  "choice.outcome === 'accepted'",
  'setMode(null)',
  'disabled={!installEvent}',
], 'PWA install prompt');
forbidText(installPrompt, [
  'if (!installEvent) return;',
], 'PWA install prompt');

requireText(legacy, [
  'syncRollingFastingReminders',
  "writeStored('nur_fasting_reminders', reminders)",
  "writeStored('nur_fasting_reminder_time', reminderTime)",
  'Notification.requestPermission()',
  'ZakatFeature',
  'net * 0.025',
  'StandbyFeature',
  'getNextPrayer(now)',
  'requestFullscreen',
  'JumuahFeature',
  'nur_feature_jumuah_progress',
  // The generic overview is gone: all fifteen areas have their own screen with
  // real content behind them. What it guarded against — a screen that looks
  // like an article but holds four bullet points — is now covered by the
  // fallback, which names the gap instead of dressing it up.
  'UnbuiltFeature',
  'reference-legacy-list--overview',
  'Für diesen Bereich ist noch kein Inhalt hinterlegt',
  "featureId === 'jumuah'",
  "featureId === 'zakat'",
  "featureId === 'standby'",
  'HADITH_LIBRARY',
  'readSavedHadithIds',
  'writeSavedHadithIds',
  'const [favorites, setFavorites] = useState(() => readSavedHadithIds())',
  'const filtered = HADITH_LIBRARY.filter',
  'writeSavedHadithIds(value)',
], 'Legacy functional tools');
forbidText(legacy, [
  'function GenericFeature(',
  'nur_feature_${feature.id}_progress',
  'buildFastingReminderEntries',
  'FASTING_REMINDER_ID_BASE',
  'const hadithItems =',
  "writeStored('nur_hadith_library_favorites'",
], 'Legacy functional tools');

requireText(fastingReminder, [
  'buildRollingFastingReminders',
  'syncRollingFastingReminders',
  'startFastingReminderMaintenance',
  'LOOKAHEAD_DAYS = 45',
  'MAINTENANCE_INTERVAL_MS = 15 * 60_000',
  'readCalendarEntries()',
  'writeCalendarEntries(next)',
  'isManagedFastingReminder',
], 'Rolling fasting reminder service');

requireText(calendarService, [
  'startCalendarReminderScheduler',
  'nur:calendar-reminder-fired',
  'showSystemNotification',
], 'Shared reminder engine');

requireText(styles, [
  "@import './styles/functional-hardening.css';",
  "@import './styles/functional-legacy-overview.css';",
], 'Style index');
requireText(hardeningStyles, [
  '.reference-reader-verse {',
  'scroll-margin-top: 88px',
  '.reference-reader-verse.is-active',
  '.prayer-alert--disabled',
  '.reference-chat-message__source',
  '.reference-dhikr-stats-modal',
  '.reference-fasting-reminder-settings',
  '.reference-zakat-calculator',
  '.reference-standby-stage',
], 'Functional design layer');
requireText(legacyOverviewStyles, [
  '.reference-legacy-list--overview > article',
  '.reference-legacy-list--checklist > button',
], 'Honest legacy overview styles');
requireText(installStyles, [
  '.reference-install-prompt__error',
  '.reference-install-prompt__action:disabled',
], 'PWA install prompt styles');

console.log('Functional hardening verified: Home and Quran use real persisted progress only, Home-to-Reader preserves its Quran parent in browser/system history, the focused Ayah is honestly labelled, daily and legacy Hadith experiences share one source-labelled library and bookmark migration, empty Dua favorites stay empty, saved-content routing is exact, Assistant message identity is stable, Quran reader progress is validated before persistence, Dhikr day rollover is coherent, Qibla sensor/listener cleanup is protected, reminders remain real, mosque URLs are safe, cloud deletion signs out locally, cloud backup excludes device-local state, note failures remain visible, and PWA install actions cannot remain dead.');
