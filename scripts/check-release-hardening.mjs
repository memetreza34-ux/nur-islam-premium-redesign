import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [
  app,
  systemLayer,
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
  read('src/app/App.tsx'),
  read('src/app/AppSystemLayer.tsx'),
  read('src/services/nurBackend.ts'),
  read('src/screens/AccountScreen.tsx'),
  read('src/screens/NotesScreen.tsx'),
  read('src/screens/OnboardingScreen.tsx'),
  read('src/screens/MoreScreen.tsx'),
  read('src/services/calendarReminderService.ts'),
  read('src/screens/CalendarScreen.tsx'),
  read('src/screens/DhikrScreen.tsx'),
  read('src/app/main.tsx'),
  read('src/app/pwa.ts'),
  read('public/sw.js'),
  read('src/services/themeService.ts'),
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
  "'nur_install_prompt_dismissed'",
  "'nur_onboarding_complete'",
  "key.startsWith('nur_prayer_reminders_fired_')",
  "key.startsWith('nur_calendar_reminders_fired_')",
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
  'isValidDateKey',
  'REMINDER_GRACE_MINUTES = 5',
  'difference >= 0 && difference <= REMINDER_GRACE_MINUTES',
  'startCalendarReminderScheduler',
  'nur:calendar-reminder-fired',
  'showSystemNotification',
  "target: 'calendar'",
], 'Calendar reminder service');
forbidText(calendarService, ["if (document.visibilityState === 'hidden') return"], 'Calendar reminder service');
requireText(calendar, [
  'readCalendarEntries',
  'Systemerinnerung aktiv',
  'Berechnetes Hijri-Datum',
  'Mondsichtung',
  'Notification.requestPermission()',
], 'Calendar screen');

requireText(app, [
  "window.addEventListener('nur:open-calendar'",
  "window.removeEventListener('nur:open-calendar'",
  "setActiveTab('calendar')",
], 'Calendar app navigation');
requireText(systemLayer, [
  'CalendarReminderBanner',
  "window.dispatchEvent(new Event('nur:open-calendar'))",
], 'Calendar reminder banner');
forbidText(systemLayer, [
  "url.searchParams.set('open', 'calendar')",
  'window.location.assign(url.toString())',
], 'Calendar reminder banner');

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
  // The launch intent is queued rather than dispatched: main runs before React
  // mounts, so a live event would fire into nothing on a cold start.
  "import { queuePendingNavigation } from '../services/pendingNavigation';",
  'queuePendingNavigation(intent)',
], 'Application bootstrap');
forbidText(main, ['openCalendarFromShell', "querySelectorAll<HTMLButtonElement>('.bottom-nav__item')"], 'Application bootstrap');
// Derived from the worker so a version bump cannot leave the registration and
// the cache pointing at different generations.
const swCacheMajor = sw.match(/const CACHE_NAME = `nur-islam-premium-v(\d+)-/)?.[1];
const swVisual = sw.match(/const VISUAL_VERSION = '([^']+)'/)?.[1];
if (!swCacheMajor || !swVisual) {
  throw new Error('Cannot read the service worker cache version; the naming scheme changed.');
}

requireText(pwa, [
  'OPEN_CALENDAR',
  `${swCacheMajor}-${swVisual}`,
  "window.dispatchEvent(new Event('nur:open-calendar'))",
], 'PWA registration');
forbidText(pwa, ["url.searchParams.set('open', 'calendar')", 'window.location.assign(url.toString())'], 'PWA registration');
requireText(sw, [
  'OPEN_CALENDAR',
  "event.notification.data?.target === 'calendar'",
  `nur-islam-premium-v${swCacheMajor}`,
  "scoped('premium-assets/high-res-objects/nur-logo-emblem.png')",
  'meta name="theme-color" content="#001b16"',
  'background:#00120f',
  'border-radius:28px',
  'border-radius:18px',
], 'Service worker');

requireText(theme, [
  "export type NurTheme = 'dark' | 'light' | 'system'",
  'dataset.theme',
  'prefers-color-scheme: light',
  "resolved === 'light' ? '#f2eadc' : '#001b16'",
], 'Theme service');
requireText(styles, ["@import './styles/release-hardening.css';", "@import './styles/premium-reference-geometry-lock.css';"], 'Style index');
requireText(releaseStyles, ["html[data-theme='light']", '.reference-account-screen', '.reference-notes-screen'], 'Release styles');

if (html.includes('maximum-scale=1')) throw new Error('Viewport still blocks user zoom.');
requireText(html, [
  'viewport-fit=cover',
  'color-scheme" content="dark light',
  'meta name="theme-color" content="#001b16"',
  'href="%BASE_URL%premium-assets/high-res-objects/nur-logo-emblem.png"',
], 'HTML accessibility/reference shell');

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

console.log(`Release hardening verified: privacy-scoped cloud backup, device-local onboarding state, visible note failures, least-privilege RLS, background-tolerant reminders, functional themes, reference-aligned PWA v${swCacheMajor} shell/colors/icons, queued closed-PWA routing, direct in-app routing and accessibility.`);
