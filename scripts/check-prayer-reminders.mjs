import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const scheduler = await readFile(resolve(root, 'src/prayerReminderService.ts'), 'utf8');
const prayerScreen = await readFile(resolve(root, 'src/PrayerScreen.tsx'), 'utf8');
const systemLayer = await readFile(resolve(root, 'src/AppSystemLayer.tsx'), 'utf8');
const main = await readFile(resolve(root, 'src/main.tsx'), 'utf8');
const app = await readFile(resolve(root, 'src/App.tsx'), 'utf8');
const pwa = await readFile(resolve(root, 'src/pwa.ts'), 'utf8');
const serviceWorker = await readFile(resolve(root, 'public/sw.js'), 'utf8');
const styles = await readFile(resolve(root, 'src/styles/reference-prayer-reminders.css'), 'utf8');
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');

const schedulerFeatures = [
  'nur_prayer_notifications',
  'nur_prayer_reminders_fired_',
  'REMINDER_WINDOW_MINUTES',
  'CHECK_INTERVAL_MS',
  'registration.showNotification',
  'nur:prayer-reminder-fired',
  'visibilitychange',
  'nur:prayer-times-updated',
  'PRAYER_TARGET_URL',
  '?open=prayer',
  'OBLIGATORY_PRAYER_IDS',
  'OBLIGATORY_REMINDER_IDS',
  'readEnabledReminderSet',
  '!prayer.obligatory',
];
for (const feature of schedulerFeatures) {
  if (!scheduler.includes(feature)) throw new Error(`Prayer reminder scheduler is missing: ${feature}`);
}

for (const feature of [
  "readSet('nur_prayer_notifications', [])",
  'obligatoryIds.includes',
  'prayer.obligatory && notifications.has(prayer.id)',
  'prayer-alert--disabled',
  'In-App-Erinnerung aktiviert; Systembenachrichtigungen sind nicht verfügbar',
]) {
  if (!prayerScreen.includes(feature)) throw new Error(`Prayer reminder control is missing: ${feature}`);
}
if (prayerScreen.includes("readSet('nur_prayer_notifications', ['fajr'")) {
  throw new Error('Prayer screen still silently enables reminder defaults.');
}

if (!main.includes('startPrayerReminderScheduler') || !main.includes('<PrayerReminderBanner />')) {
  throw new Error('Prayer reminder scheduler or in-app banner is not started with the app.');
}
if (!main.includes('const sharedPrayerTimesReady = bootstrapSharedPrayerTimes()')
  || !main.includes('void sharedPrayerTimesReady.finally(() =>')
  || !main.includes('stopPrayerReminders = startPrayerReminderScheduler()')) {
  throw new Error('Prayer reminders can start before the initial shared prayer-time schedule is ready.');
}
if (!main.includes('consumeInitialNavigationIntent')
  || !main.includes("const requested = url.searchParams.get('open')")
  || !main.includes("requested === 'prayer' ? 'prayer'")
  || !main.includes("url.searchParams.delete('open')")) {
  throw new Error('Closed PWA reminder launch URLs are not consumed and cleaned.');
}
// The launch intent may resolve to more than one destination, so match the
// dispatched event rather than one hard-coded call shape.
if (!main.includes("localStorage.setItem('nur_onboarding_complete', 'true')")
  || !/new Event\([^)]*'nur:open-prayer'/.test(main)) {
  throw new Error('Reminder launch does not persist onboarding and open the prayer tracker.');
}
if (!systemLayer.includes('PrayerReminderBanner') || !systemLayer.includes("new Event('nur:open-prayer')")) {
  throw new Error('In-app prayer reminder does not provide direct tracker navigation.');
}
if (!app.includes("window.addEventListener('nur:open-prayer'") || !app.includes("setActiveTab('prayer')")) {
  throw new Error('App does not handle direct prayer navigation from reminders.');
}
if (!pwa.includes("event.data?.type === 'OPEN_PRAYER'") || !pwa.includes("new Event('nur:open-prayer')") || !pwa.includes('nur_onboarding_complete')) {
  throw new Error('PWA bridge does not persist and forward notification clicks.');
}
if (!serviceWorker.includes("self.addEventListener('notificationclick'") || !serviceWorker.includes('postMessage({ type: messageType })') || !serviceWorker.includes('?open=${target}')) {
  throw new Error('Service worker notification click handling is missing or cannot route a closed PWA.');
}
if (!styles.includes('.reference-prayer-reminder-banner') || !styleIndex.includes('reference-prayer-reminders.css')) {
  throw new Error('Prayer reminder banner styles are missing or not loaded.');
}
if (!systemLayer.includes('nur-logo-emblem-v2.webp')) {
  throw new Error('System error screen regressed to an invalid logo asset path.');
}

console.log('Prayer reminders verified: no silent defaults, only obligatory prayers can be enabled, invalid stored IDs are cleaned, live/fallback bootstrap precedes the scheduler, and PWA/in-app navigation remains wired.');
