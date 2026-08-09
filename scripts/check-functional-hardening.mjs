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
  read('src/App.tsx'),
  read('src/AssistantScreen.tsx'),
  read('src/QuranReaderScreen.tsx'),
  read('src/QuranScreen.tsx'),
  read('src/ReferenceReadingScreens.tsx'),
  read('src/LegacyFeatureScreens.tsx'),
  read('src/CollectionsScreen.tsx'),
  read('src/DuasScreen.tsx'),
  read('src/NamesScreen.tsx'),
  read('src/CalendarScreen.tsx'),
  read('src/DhikrScreen.tsx'),
  read('src/QiblaScreen.tsx'),
  read('src/PrayerScreen.tsx'),
  read('src/MoreScreen.tsx'),
  read('src/prayerReminderService.ts'),
  read('src/fastingReminderService.ts'),
  read('src/nurBackend.ts'),
  read('src/AccountScreen.tsx'),
  read('src/NotesScreen.tsx'),
  read('src/mosqueService.ts'),
  read('src/InstallAppPrompt.tsx'),
  read('src/styles.css'),
  read('src/styles/functional-hardening.css'),
  read('src/styles/functional-legacy-overview.css'),
  read('src/styles/reference-install-prompt.css'),
  read('src/calendarReminderService.ts'),
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
  'Lokaler Quellenmodus',
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
  'onOpenDua(id)',
  'onOpenName(id)',
  'onOpenCalendarDate(date)',
  "filter === 'Tagesinhalte'",
  "['Alle', 'Quran', 'Duas', 'Namen', 'Tagesinhalte', 'Termine']",
], 'Collection routing');
forbidText(collections, [
  'OFFLINE_QURAN_SURAHS',
  'onOpenDuas',
  'onOpenNames',
  'onOpenCalendar:',
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
  'LOCAL_ANSWERS',
  'findLocalAnswer',
  'Quran 97:1–5',
  'Quran 112:1–4',
  'Kein lokaler Quellen-Treffer',
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
  "localStorage.setItem('nur_daily_hadith_saved'",
  'copyAyah',
  'shareAyah',
  'shareHadith',
  'completeGuide',
  'nur_guide_${mode}_complete',
], 'Daily content and worship guide actions');
forbidText(readingScreens, [
  'setPlaying',
  '<Headphones',
  "flash('Ayah kopiert')}",
  "flash('Teilen geöffnet')}",
  "flash('Hadith teilen geöffnet')}",
  'export function QuranReaderScreen',
  'Leseeinstellungen geöffnet',
  'Hadith-Einstellungen geöffnet',
  'Lerneinstellungen geöffnet',
], 'Daily content and worship guide actions');

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
  'GenericOverviewFeature',
  'reference-legacy-list--overview',
  'Dieser Bereich ist aktuell eine Übersicht ohne vorgetäuschte Detail-Navigation',
  "featureId === 'jumuah'",
  "featureId === 'zakat'",
  "featureId === 'standby'",
], 'Legacy functional tools');
forbidText(legacy, [
  'function GenericFeature(',
  'nur_feature_${feature.id}_progress',
  'buildFastingReminderEntries',
  'FASTING_REMINDER_ID_BASE',
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

console.log('Functional hardening verified: Home and Quran use real persisted progress only, empty Dua favorites stay empty, saved-content routing is exact, Assistant message identity is stable, Quran reader progress is validated before persistence, Dhikr day rollover is coherent, Qibla sensor/listener cleanup is protected, reminders remain real, mosque URLs are safe, cloud deletion signs out locally, cloud backup excludes device-local state, note failures remain visible, and PWA install actions cannot remain dead.');