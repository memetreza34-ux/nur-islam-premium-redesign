import { readFile, readdir } from 'node:fs/promises';
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
  read('supabase/migrations/20260808040606_create_nur_islam_backend.sql'),
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

// Editorial approval remains an internal release prerequisite, not learner UI.
for (const directory of ['src/screens', 'src/shared']) {
  for (const file of await readdir(resolve(root, directory))) {
    if (!file.endsWith('.tsx')) continue;
    const source = await read(`${directory}/${file}`);
    for (const pattern of [
      /fachliche.{0,30}Freigabe/i,
      /Fachprüfung offen/i,
      /Endprüfung|(?:fachlich|redaktionell).{0,90}(?:offen|ausstehend|steht noch aus)/i,
      /(?:vor|vor der) Veröffentlichung/i,
      /Altbestand|migriert/,
    ]) {
      if (pattern.test(source)) throw new Error(`Internal editorial status leaked into ${directory}/${file}: ${pattern}`);
    }
  }
}

const legalScreen = await read('src/screens/LegalScreen.tsx');
requireText(legalScreen, ['hasUnfilledOperatorDetails()', 'Noch nicht veröffentlichungsfertig'], 'Incomplete imprint warning');
const legalContent = await read('src/data/legalContent.ts');
const prayerRakatData = await read('src/data/prayerRakatData.ts');
forbidText(legalContent, ['hisnmuslim.com', 'Hisn al-Muslim'], 'Release audio sources');
forbidText(prayerRakatData, ['hisnmuslim.com', 'audioUrl'], 'Release audio sources');
requireText(
  legalContent,
  ['Mishary Alafasy', 'Die Nutzung richtet sich nach den Bedingungen von Al Quran Cloud'],
  'Quran audio attribution',
);
const wudu = await read('src/shared/WuduLesson.tsx');
requireText(wudu, ['https://sunnah.com/muslim:234b', 'unterschiedlich bewertet', 'vereinfachte Lernhilfen'], 'Wudu source and illustration limits');
const legacyScreens = await read('src/screens/LegacyFeatureScreens.tsx');
requireText(legacyScreens, ['beschreibt den Ablauf, nicht die Urteile', 'Wo der Quran keine Details nennt', 'Sinngemäßer Inhalt'], 'Content scope and paraphrase limits');

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

// Account, notes and the service features are rendered by the app rather than
// by this screen. Holding them here was what kept them out of the navigation:
// as local state they pushed no history entry, so the Android back button did
// nothing and the active tab could not return to the list. The requirement
// moved to the app with them, and this screen has to keep routing rather than
// rendering.
requireText(app, [
  '<AccountScreen',
  '<NotesScreen',
  "activeTab === 'account'",
  "activeTab === 'notes'",
], 'Account and notes as navigable screens');
requireText(more, [
  "onNavigate('account')",
  "destination: 'notes'",
  'onNavigate(`legacy:${feature.id}`)',
  "localStorage.setItem('nur_prayer_notifications'",
  'await signOut()',
  'Deutsch ist aktuell die einzige vollständig gepflegte App-Sprache',
], 'Profile/settings integration');
forbidText(more, ['Erscheinungsbild', "modal === 'appearance'", 'applyTheme(next)'], 'Fixed premium palette');
forbidText(more, ['premium_prayer_notifications', 'premium_cloud_sync', 'bis Firebase verbunden wird'], 'Profile/settings integration');
forbidText(more, ['<AccountScreen', '<NotesScreen', '<LegacyFeatureScreen'], 'Profile screens outside navigation');

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
  "const openCalendar = () => openRootTab('calendar')",
  'resetBrowserRoot(buildNavigationSnapshot({',
], 'Calendar browser-aware app navigation');
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
  "dataset.theme = 'dark'",
  "dataset.themePreference = 'dark'",
  "style.colorScheme = 'dark'",
  "themeMeta.content = '#001b16'",
  'localStorage.removeItem(THEME_STORAGE_KEY)',
], 'Theme service');
requireText(styles, ["@import './styles/release-hardening.css';", "@import './styles/premium-reference-geometry-lock.css';"], 'Style index');
requireText(releaseStyles, ["html[data-theme='light']", '.reference-account-screen', '.reference-notes-screen'], 'Release styles');

if (html.includes('maximum-scale=1')) throw new Error('Viewport still blocks user zoom.');
requireText(html, [
  'viewport-fit=cover',
  'color-scheme" content="dark"',
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

console.log(`Release hardening verified: privacy-scoped cloud backup, device-local onboarding state, visible note failures, least-privilege RLS, background-tolerant reminders, fixed premium palette, reference-aligned PWA v${swCacheMajor} shell/colors/icons, queued closed-PWA routing, direct in-app routing and accessibility.`);
