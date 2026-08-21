import { OBLIGATORY_PRAYER_IDS, PRAYER_SCHEDULE, PRAYER_SCHEDULE_META } from './prayerSchedule';
import type { PrayerScheduleItem } from './prayerSchedule';

export type PrayerReminderDetail = {
  prayerId: PrayerScheduleItem['id'];
  label: string;
  arabic: string;
  time: string;
  description: string;
};

const NOTIFICATION_STORAGE_KEY = 'nur_prayer_notifications';
// Background tabs get their timers throttled to a minute or worse, so a
// one-minute window silently dropped reminders. The calendar reminders already
// allow five minutes of catch-up; prayers follow the same rule.
const REMINDER_WINDOW_MINUTES = 5;
const CHECK_INTERVAL_MS = 20000;
const APP_BASE = import.meta.env.BASE_URL;
const PRAYER_TARGET_URL = `${APP_BASE}?open=prayer`;
const OBLIGATORY_REMINDER_IDS = new Set<string>(OBLIGATORY_PRAYER_IDS);

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
    return new Set(Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : []);
  } catch {
    return new Set<string>();
  }
}

function writeStringSet(key: string, value: Set<string>) {
  try { localStorage.setItem(key, JSON.stringify([...value])); } catch { /* optional */ }
}

function readEnabledReminderSet() {
  const stored = readStringSet(NOTIFICATION_STORAGE_KEY);
  const valid = new Set([...stored].filter((id) => OBLIGATORY_REMINDER_IDS.has(id)));
  if (valid.size !== stored.size) writeStringSet(NOTIFICATION_STORAGE_KEY, valid);
  return valid;
}

function firedStorageKey(date = new Date()) {
  return `nur_prayer_reminders_fired_${dateKey(date)}`;
}

/**
 * The bundled fallback clock values are UI/emergency placeholders only. They
 * are not today's verified prayer times and must never trigger a religious
 * reminder. Live or same-day cached AlAdhan data replace this metadata through
 * applyPrayerSnapshotToSharedSchedule before reminders are allowed to fire.
 */
export function hasReliableSharedPrayerTimes() {
  return PRAYER_SCHEDULE_META.sourceLabel !== 'Offline-Ersatzzeitplan';
}

async function showPrayerNotification(prayer: PrayerScheduleItem) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return false;

  const options: NotificationOptions = {
    body: `Es ist Zeit für ${prayer.label}. Öffne Nur Islam, um deinen Gebets-Tracker zu aktualisieren.`,
    icon: `${APP_BASE}nur-app-icon-192.png`,
    badge: `${APP_BASE}nur-app-icon-192.png`,
    tag: `nur-prayer-${dateKey()}-${prayer.id}`,
    data: { type: 'prayer-reminder', prayerId: prayer.id, url: PRAYER_TARGET_URL },
    silent: false,
  };

  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification(`${prayer.label} · Gebetszeit`, options);
        return true;
      }
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
  // Never let bundled fallback clock values become religious reminders.
  if (!hasReliableSharedPrayerTimes()) return;

  const enabled = readEnabledReminderSet();
  if (!enabled.size) return;

  const firedKey = firedStorageKey(now);
  const fired = readStringSet(firedKey);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const prayer of PRAYER_SCHEDULE) {
    if (!prayer.obligatory || !enabled.has(prayer.id) || fired.has(prayer.id)) continue;
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

  // This is a page/PWA scheduler, not a remote Web Push service. Browsers may
  // suspend a fully closed app, so focus/visibility catch-up is intentional and
  // the UI must not promise guaranteed closed-app delivery.
  run();
  timer = window.setInterval(run, CHECK_INTERVAL_MS);
  window.addEventListener('focus', run);
  document.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('nur:prayer-times-updated', run);

  return () => {
    active = false;
    if (timer) window.clearInterval(timer);
    window.removeEventListener('focus', run);
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('nur:prayer-times-updated', run);
  };
}
