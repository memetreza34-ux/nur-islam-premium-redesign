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
  prayer,
  more,
  prayerReminder,
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
  read('src/PrayerScreen.tsx'),
  read('src/MoreScreen.tsx'),
  read('src/prayerReminderService.ts'),
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
  'onOpenReader(lastSurah?.number ?? lastRead.surahNumber, lastAyah)',
  'Math.min(lastRead.ayahNumber, lastSurah.numberOfAyahs)',
], 'Quran catalog resume and retry');

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
], 'Collection routing');
forbidText(collections, [
  'OFFLINE_QURAN_SURAHS',
  'onOpenDuas',
  'onOpenNames',
  'onOpenCalendar:',
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
], 'Quran reader controls and deep links');
forbidText(reader, [
  'Audio folgt',
  '<Headphones',
  'geprüften Rezitationsquelle aktiviert',
], 'Quran reader controls and deep links');

requireText(duas, [
  'initialDuaId?: string | null',
  'DUA_BY_ID.get(initialDuaId)',
  'setSelected(dua)',
], 'Dua direct open');
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
], 'Nur local assistant');
forbidText(assistant, [
  'Die Oberfläche ist vorbereitet',
  'Aktuell ist noch kein KI-Anbieter verbunden',
  '<Mic',
  'CircleCheckIcon',
  "flash('Nur Antworten",
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
], 'Dhikr real statistics');
forbidText(dhikr, [
  'onClick={() => flash(`${totalToday} Wiederholungen heute`)}',
], 'Dhikr real statistics');

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
], 'Cloud backup privacy');
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
  'readCalendarEntries',
  'writeCalendarEntries',
  'buildFastingReminderEntries',
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
], 'Legacy functional tools');

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

console.log('Functional hardening verified: fake Home/Assistant/legacy interactions are removed, exact Quran resume and saved-content routing work, Dhikr statistics are real, prayer reminders stay useful with or without system notification permission, mosque URLs are safe, cloud backup excludes device locations, note failures remain visible, and PWA install actions cannot remain dead.');
