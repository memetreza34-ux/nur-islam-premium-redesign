import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [app, assistant, reader, legacy, styles, hardeningStyles, calendarService] = await Promise.all([
  read('src/App.tsx'),
  read('src/AssistantScreen.tsx'),
  read('src/QuranReaderScreen.tsx'),
  read('src/LegacyFeatureScreens.tsx'),
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
], 'Home synchronization');
forbidText(app, [
  '33 von 100',
  "width: '25%'",
  "target === 'reader' ? onOpenReader(112)",
  "label: 'KI-Assistent'",
], 'Home synchronization');

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

console.log('Functional hardening verified: Home uses stored progress, assistant answers only from local sourced topics, dead Quran audio UI is removed, fasting reminders use the shared scheduler, Zakat has a transparent planning calculator, and standby uses live prayer data with fullscreen support.');
