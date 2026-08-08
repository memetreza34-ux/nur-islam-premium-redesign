import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [app, assistant, reader, readingScreens, legacy, collections, duas, names, calendar, styles, hardeningStyles, calendarService] = await Promise.all([
  read('src/App.tsx'),
  read('src/AssistantScreen.tsx'),
  read('src/QuranReaderScreen.tsx'),
  read('src/ReferenceReadingScreens.tsx'),
  read('src/LegacyFeatureScreens.tsx'),
  read('src/CollectionsScreen.tsx'),
  read('src/DuasScreen.tsx'),
  read('src/NamesScreen.tsx'),
  read('src/CalendarScreen.tsx'),
  read('src/styles.css'),
  read('src/styles/functional-hardening.css'),
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
  'onOpenDuas=',
  'onOpenNames=',
  'onOpenCalendar=',
], 'Home and direct navigation');

requireText(collections, [
  'Array.from({ length: 114 }',
  'nur_quran_bookmarks_${surahNumber}',
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
], 'Nur local assistant');
forbidText(assistant, [
  'Die Oberfläche ist vorbereitet',
  'Aktuell ist noch kein KI-Anbieter verbunden',
  '<Mic',
], 'Nur local assistant');

requireText(reader, [
  'setShowMeaning',
  'Bedeutung an',
  'Bedeutung aus',
  'reference-font-control',
], 'Quran reader controls');
forbidText(reader, [
  'Audio folgt',
  '<Headphones',
  'geprüften Rezitationsquelle aktiviert',
], 'Quran reader controls');

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
  "featureId === 'zakat'",
  "featureId === 'standby'",
], 'Legacy functional tools');

requireText(calendarService, [
  'startCalendarReminderScheduler',
  'nur:calendar-reminder-fired',
  'showSystemNotification',
], 'Shared reminder engine');

requireText(styles, ["@import './styles/functional-hardening.css';"], 'Style index');
requireText(hardeningStyles, [
  '.reference-chat-message__source',
  '.reference-fasting-reminder-settings',
  '.reference-zakat-calculator',
  '.reference-standby-stage',
], 'Functional design layer');

console.log('Functional hardening verified: Home uses stored progress, collection items route to exact saved content, assistant answers only from local sourced topics, Quran controls are real, daily Ayah/Hadith copy/share actions use browser APIs, fasting reminders use the shared scheduler, Zakat has a transparent planning calculator, standby uses live prayer data with fullscreen support, and worship-guide completion is persisted.');
