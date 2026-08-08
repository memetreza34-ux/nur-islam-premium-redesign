import { readCalendarEntries, writeCalendarEntries } from './calendarReminderService';
import type { PersonalCalendarEntry } from './calendarReminderService';

const FASTING_ENABLED_KEY = 'nur_fasting_reminders';
const FASTING_TIME_KEY = 'nur_fasting_reminder_time';
const FASTING_REMINDER_ID_BASE = 7_100_000_000_000;
const FASTING_REMINDER_ID_MAX = 8_100_000_000_000;
const LOOKAHEAD_DAYS = 45;
const MAINTENANCE_INTERVAL_MS = 15 * 60_000;

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function atLocalNoon(date = new Date()) {
  const value = new Date(date);
  value.setHours(12, 0, 0, 0);
  return value;
}

function previousDay(date: Date) {
  const value = atLocalNoon(date);
  value.setDate(value.getDate() - 1);
  return value;
}

function readJsonValue<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readReminderTime() {
  const value = readJsonValue(FASTING_TIME_KEY, '20:00');
  return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : '20:00';
}

function getHijriDay(date: Date) {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric' }).formatToParts(date);
    return Number(parts.find((part) => part.type === 'day')?.value ?? 0);
  } catch {
    return 0;
  }
}

function managedIdFor(fastingDate: Date) {
  const numericDate = Number(localDateKey(fastingDate).replaceAll('-', ''));
  return FASTING_REMINDER_ID_BASE + numericDate;
}

export function isManagedFastingReminder(entry: PersonalCalendarEntry) {
  return entry.id >= FASTING_REMINDER_ID_BASE && entry.id < FASTING_REMINDER_ID_MAX;
}

export function buildRollingFastingReminders(now = new Date()) {
  const enabled = readJsonValue<unknown>(FASTING_ENABLED_KEY, false) === true;
  if (!enabled) return [] as PersonalCalendarEntry[];

  const time = readReminderTime();
  const today = atLocalNoon(now);
  const generated: PersonalCalendarEntry[] = [];

  for (let offset = 1; offset <= LOOKAHEAD_DAYS; offset += 1) {
    const fastingDate = new Date(today);
    fastingDate.setDate(today.getDate() + offset);
    const weekday = fastingDate.getDay();
    const hijriDay = getHijriDay(fastingDate);
    const monday = weekday === 1;
    const thursday = weekday === 4;
    const whiteDay = hijriDay >= 13 && hijriDay <= 15;
    if (!monday && !thursday && !whiteDay) continue;

    const labels: string[] = [];
    if (monday) labels.push('Montag');
    if (thursday) labels.push('Donnerstag');
    if (whiteDay) labels.push(`${hijriDay}. berechneter Hijri-Tag`);

    generated.push({
      id: managedIdFor(fastingDate),
      date: localDateKey(previousDay(fastingDate)),
      title: `Fasten morgen · ${labels.join(' · ')}`,
      time,
      reminder: true,
    });
  }

  return generated;
}

export function syncRollingFastingReminders() {
  const current = readCalendarEntries();
  const retained = current.filter((entry) => !isManagedFastingReminder(entry));
  const managed = buildRollingFastingReminders();
  const next = [...retained, ...managed];
  const before = JSON.stringify(current);
  const after = JSON.stringify(next);
  if (before !== after) writeCalendarEntries(next);
  return managed.length;
}

export function startFastingReminderMaintenance() {
  const sync = () => syncRollingFastingReminders();
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') sync();
  };

  sync();
  const timer = window.setInterval(sync, MAINTENANCE_INTERVAL_MS);
  window.addEventListener('focus', sync);
  document.addEventListener('visibilitychange', handleVisibility);

  return () => {
    window.clearInterval(timer);
    window.removeEventListener('focus', sync);
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}
