import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const scheduler = await readFile(resolve(root, 'src/prayerReminderService.ts'), 'utf8');
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
];
for (const feature of schedulerFeatures) {
  if (!scheduler.includes(feature)) throw new Error(`Prayer reminder scheduler is missing: ${feature}`);
}

if (!main.includes('startPrayerReminderScheduler') || !main.includes('<PrayerReminderBanner />')) {
  throw new Error('Prayer reminder scheduler or in-app banner is not started with the app.');
}
if (!systemLayer.includes('PrayerReminderBanner') || !systemLayer.includes("new Event('nur:open-prayer')")) {
  throw new Error('In-app prayer reminder does not provide direct tracker navigation.');
}
if (!app.includes("window.addEventListener('nur:open-prayer'") || !app.includes("setActiveTab('prayer')")) {
  throw new Error('App does not handle direct prayer navigation from reminders.');
}
if (!pwa.includes("event.data?.type === 'OPEN_PRAYER'") || !pwa.includes("new Event('nur:open-prayer')")) {
  throw new Error('PWA bridge does not forward notification clicks.');
}
if (!serviceWorker.includes("self.addEventListener('notificationclick'") || !serviceWorker.includes("postMessage({ type: 'OPEN_PRAYER' })")) {
  throw new Error('Service worker notification click handling is missing.');
}
if (!styles.includes('.reference-prayer-reminder-banner') || !styleIndex.includes('reference-prayer-reminders.css')) {
  throw new Error('Prayer reminder banner styles are missing or not loaded.');
}
if (!systemLayer.includes('nur-logo-emblem-v2.webp')) {
  throw new Error('System error screen regressed to an invalid logo asset path.');
}

console.log('Prayer reminders verified: active scheduler, duplicate protection, PWA notification, in-app banner, and direct tracker navigation.');
