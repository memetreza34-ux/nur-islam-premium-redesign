import { PRAYER_SCHEDULE } from './prayerSchedule';
import type { PrayerScheduleItem } from './prayerSchedule';

export type PrayerReminderDetail = {
  prayerId: PrayerScheduleItem['id'];
  label: string;
  arabic: string;
  time: string;
  description: string;
};

const NOTIFICATION_STORAGE_KEY = 'nur_prayer_notifications';
const REMINDER_WINDOW_MINUTES = 1;
const CHECK_INTERVAL_MS = 20000;

function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function readStringSet(key: string) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set<string>();
  }
}

function writeStringSet(key: string, value: Set<string>) {
  try { localStorage.setItem(key, JSON.stringify([...value])); } catch { /* optional */ }
}

function firedStorageKey(date = new Date()) {
  return `nur_prayer_reminders_fired_${dateKey(date)}`;
}

async function showPrayerNotification(prayer: PrayerScheduleItem) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return false;

  const options: NotificationOptions = {
    body: `Es ist Zeit für ${prayer.label}. Öffne Nur Islam, um deinen Gebets-Tracker zu aktualisieren.`,
    icon: '/nur-app-icon.svg',
    badge: '/nur-app-icon.svg',
    tag: `nur-prayer-${dateKey()}-${prayer.id}`,
    data: { type: 'prayer-reminder', prayerId: prayer.id, url: '/' },
    silent: false,
  };

  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(`${prayer.label} · Gebetszeit`, options);
      return true;
    }

    new Notification(`${prayer.label} · Gebetszeit`, options);
    return true;
  } catch {
    return false;
  }
}

function emitInAppReminder(prayer: PrayerScheduleItem) {
  const detail: PrayerReminderDetail = {
    prayerId: prayer.id,
    label: prayer.label,
    arabic: prayer.arabic,
    time: prayer.time,
    description: prayer.description,
  };
  window.dispatchEvent(new CustomEvent<PrayerReminderDetail>('nur:prayer-reminder-fired', { detail }));
}

async function checkPrayerReminders(now = new Date()) {
  const enabled = readStringSet(NOTIFICATION_STORAGE_KEY);
  if (!enabled.size) return;

  const firedKey = firedStorageKey(now);
  const fired = readStringSet(firedKey);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const prayer of PRAYER_SCHEDULE) {
    if (!enabled.has(prayer.id) || fired.has(prayer.id)) continue;
    const difference = currentMinutes - timeToMinutes(prayer.time);
    if (difference < 0 || difference > REMINDER_WINDOW_MINUTES) continue;

    fired.add(prayer.id);
    writeStringSet(firedKey, fired);
    emitInAppReminder(prayer);
    await showPrayerNotification(prayer);
  }
}

export function startPrayerReminderScheduler() {
  let active = true;
  let timer: number | undefined;

  const run = () => {
    if (!active) return;
    void checkPrayerReminders();
  };

  const handleVisibility = () => {
    if (document.visibilityState === 'visible') run();
  };

  run();
  timer = window.setInterval(run, CHECK_INTERVAL_MS);
  document.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('nur:prayer-times-updated', run);

  return () => {
    active = false;
    if (timer) window.clearInterval(timer);
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('nur:prayer-times-updated', run);
  };
}
