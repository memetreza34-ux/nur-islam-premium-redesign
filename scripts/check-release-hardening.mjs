import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [
  backend,
  account,
  notes,
  onboarding,
  more,
  calendarService,
  calendar,
  dhikr,
  main,
  pwa,
  sw,
  theme,
  styles,
  releaseStyles,
  html,
  migration,
] = await Promise.all([
  read('src/nurBackend.ts'),
  read('src/AccountScreen.tsx'),
  read('src/NotesScreen.tsx'),
  read('src/OnboardingScreen.tsx'),
  read('src/MoreScreen.tsx'),
  read('src/calendarReminderService.ts'),
  read('src/CalendarScreen.tsx'),
  read('src/DhikrScreen.tsx'),
  read('src/main.tsx'),
  read('src/pwa.ts'),
  read('public/sw.js'),
  read('src/themeService.ts'),
  read('src/styles.css'),
  read('src/styles/release-hardening.css'),
  read('index.html'),
  read('supabase/migrations/202608080001_create_nur_islam_backend.sql'),
]);

function requireText(source, requirements, label) {
  for (const requirement of requirements) {
    if (!source.includes(requirement)) throw new Error(`${label} is missing: ${requirement}`);
  }
}

function forbidText(source, forbidden, label) {
  for (const item of forbidden) {
    if (source.includes(item)) throw new Error(`${label} still contains forbidden release placeholder: ${item}`);
  }
}

requireText(backend, [
  '/auth/v1/token?grant_type=password',
  '/auth/v1/signup',
  '/auth/v1/token?grant_type=refresh_token',
  '/auth/v1/logout',
  'nur_islam_profiles',
  'nur_islam_user_state',
  'nur_islam_notes',
  'backupLocalState',
  'restoreCloudState',
  "'nur_local_notes_v1'",
  "'nur_prayer_location'",
  "'nur_mosque_location_v1'",
  "'nur_prayer_times_latest'",
  "'nur_mosque_search_cache_v1'",
], 'Cloud backend');
forbidText(backend, ['service_role', 'SUPABASE_SERVICE_ROLE'], 'Cloud backend');

requireText(account, [
  'signInWithPassword',
  'signUp',
  'backupLocalState',
  'restoreCloudState',
  'signOut',
  'Standortkoordinaten und lokale Notizen sind nicht Teil dieses Backups',
  'Die Übertragung erfolgt per HTTPS',
  'nicht als Ende-zu-Ende-verschlüsselter Tresor beworben',
], 'Account screen');
forbidText(account, ['verschlüsselt per HTTPS'], 'Account screen');

requireText(notes, [
  'createCloudNote',
  'updateCloudNote',
  'deleteCloudNote',
  'nur_local_notes_v1',
  'hasValidDate',
  'Cloud-Notizen konnten nicht geladen werden',
  'Prüfe deine Verbindung oder Sitzung',
], 'Notes screen');

requireText(onboarding, [
  'savePrayerLocation',
  'saveMosqueOrigin',
  'bootstrapSharedPrayerTimes',
  "localStorage.setItem('nur_prayer_notifications'",
  'OBLIGATORY_PRAYER_IDS',
], 'Onboarding integration');

requireText(more, [
  '<AccountScreen',
  '<NotesScreen',
  "localStorage.setItem('nur_prayer_notifications'",
  'applyTheme(next)',
  'await signOut()',
  'Deutsch ist aktuell die einzige vollständig gepflegte App-Sprache',
], 'Profile/settings integration');
forbidText(more, ['premium_prayer_notifications', 'premium_cloud_sync', 'bis Firebase verbunden wird'], 'Profile/settings integration');

requireText(calendarService, [
  'dateKey?: unknown',
  'typeof entry.dateKey',
  'startCalendarReminderScheduler',
  'nur:calendar-reminder-fired',
  'showNotification',
  "target: 'calendar'",
], 'Calendar reminder service');
requireText(calendar, [
  'readCalendarEntries',
  'Systemerinnerung aktiv',
  'Berechnetes Hijri-Datum',
  'Mondsichtung',
  'Notification.requestPermission()',
], 'Calendar screen');

requireText(dhikr, [
  'const syncDay = () =>',
  "window.addEventListener('focus', syncDay)",
  "document.addEventListener('visibilitychange', handleVisibility)",
  'current.date === currentDate',
], 'Dhikr midnight rollover');

requireText(main, [
  'startCalendarReminderScheduler',
  '<CalendarReminderBanner />',
  'initializeTheme()',
  "requested === 'calendar'",
], 'Application bootstrap');
requireText(pwa, ['OPEN_CALENDAR', '11-20260808-release-hardening'], 'PWA registration');
requireText(sw, ['OPEN_CALENDAR', "event.notification.data?.target === 'calendar'", 'nur-islam-premium-v11'], 'Service worker');

requireText(theme, ["export type NurTheme = 'dark' | 'light' | 'system'", 'dataset.theme', 'prefers-color-scheme: light'], 'Theme service');
requireText(styles, ["@import './styles/release-hardening.css';"], 'Style index');
requireText(releaseStyles, ["html[data-theme='light']", '.reference-account-screen', '.reference-notes-screen'], 'Release styles');

if (html.includes('maximum-scale=1')) throw new Error('Viewport still blocks user zoom.');
requireText(html, ['viewport-fit=cover', 'color-scheme" content="dark light'], 'HTML accessibility');

requireText(migration, [
  'create table if not exists public.nur_islam_profiles',
  'create table if not exists public.nur_islam_user_state',
  'create table if not exists public.nur_islam_notes',
  'enable row level security',
  'revoke all privileges on table public.nur_islam_profiles from anon, authenticated',
  'grant select, insert, update, delete on table public.nur_islam_profiles to authenticated',
  'grant select, insert, update, delete on table public.nur_islam_user_state to authenticated',
  'grant select, insert, update, delete on table public.nur_islam_notes to authenticated',
  '(select auth.uid()) = user_id',
], 'Supabase migration');
forbidText(migration, ['disable row level security', 'grant all', 'grant truncate', 'grant trigger', 'grant references'], 'Supabase migration');

console.log('Release hardening verified: real account/cloud/notes, exact device locations excluded from generic cloud backup, truthful HTTPS/RLS wording, visible cloud-note failures, least-privilege CRUD grants with RLS, unified reminders, functional themes, PWA routing and accessibility.');
