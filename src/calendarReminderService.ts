import { resolveAppPath } from './appPaths';

export type PersonalCalendarEntry = {
  id: number;
  date: string;
  title: string;
  time: string;
  reminder: boolean;
};

export type CalendarReminderDetail = PersonalCalendarEntry & {
  firedAt: string;
};

type LegacyCalendarEntry = {
  id?: unknown;
  date?: unknown;
  dateKey?: unknown;
  title?: unknown;
  time?: unknown;
  reminder?: unknown;
};

const STORAGE_KEY = 'nur_calendar_entries';
const FIRED_PREFIX = 'nur_calendar_reminders_fired_';
const CHECK_INTERVAL_MS = 20_000;
const REMINDER_GRACE_MINUTES = 5;

function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function isValidDateKey(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const candidate = new Date(year, month - 1, day, 12, 0, 0, 0);
  return candidate.getFullYear() === year && candidate.getMonth() === month - 1 && candidate.getDate() === day;
}

function normalizeEntry(value: unknown): PersonalCalendarEntry | null {
  if (!value || typeof value !== 'object') return null;
  const entry = value as LegacyCalendarEntry;
  const date = typeof entry.date === 'string' ? entry.date : typeof entry.dateKey === 'string' ? entry.dateKey : '';
  const id = typeof entry.id === 'number' && Number.isSafeInteger(entry.id) ? entry.id : Number.NaN;
  const title = typeof entry.title === 'string' ? entry.title.trim().slice(0, 120) : '';
  const time = typeof entry.time === 'string' ? entry.time : '';
  const reminder = typeof entry.reminder === 'boolean' ? entry.reminder : false;
  if (!Number.isSafeInteger(id) || !isValidDateKey(date) || !title || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  return { id, date, title, time, reminder };
}

export function readCalendarEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    if (!Array.isArray(parsed)) return [];
    const migrated = parsed.map(normalizeEntry).filter((entry): entry is PersonalCalendarEntry => entry !== null);
    const normalizedJson = JSON.stringify(migrated);
    if (normalizedJson !== JSON.stringify(parsed)) localStorage.setItem(STORAGE_KEY, normalizedJson);
    return migrated;
  } catch {
    return [];
  }
}

export function writeCalendarEntries(entries: PersonalCalendarEntry[]) {
  const valid = entries.map(normalizeEntry).filter((entry): entry is PersonalCalendarEntry => entry !== null);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(valid)); } catch { /* optional */ }
}

function readFiredSet(key: string) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]') as unknown;
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set<string>();
  }
}

function writeFiredSet(key: string, values: Set<string>) {
  try { localStorage.setItem(key, JSON.stringify([...values])); } catch { /* optional */ }
}

async function showSystemNotification(entry: PersonalCalendarEntry) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const title = `Nur Islam · ${entry.title}`;
  const targetUrl = new URL(resolveAppPath(''), window.location.origin).toString();
  const notificationUrl = new URL(targetUrl);
  notificationUrl.searchParams.set('open', 'calendar');
  const icon = resolveAppPath('nur-app-icon.svg');
  const options: NotificationOptions = {
    body: `Dein Termin beginnt um ${entry.time} Uhr.`,
    icon,
    badge: icon,
    tag: `nur-calendar-${entry.id}-${entry.date}`,
    data: { target: 'calendar', url: notificationUrl.toString() },
  };

  try {
    const registration = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : undefined;
    if (registration) await registration.showNotification(title, options);
    else new Notification(title, options);
  } catch {
    // In-app reminder remains available when system notifications fail.
  }
}

async function checkCalendarReminders(now = new Date()) {
  const today = dateKey(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const entries = readCalendarEntries().filter((entry) => {
    if (!entry.reminder || entry.date !== today) return false;
    const difference = currentMinutes - timeToMinutes(entry.time);
    return difference >= 0 && difference <= REMINDER_GRACE_MINUTES;
  });
  if (!entries.length) return;

  const firedKey = `${FIRED_PREFIX}${today}`;
  const fired = readFiredSet(firedKey);
  for (const entry of entries) {
    const id = String(entry.id);
    if (fired.has(id)) continue;
    fired.add(id);
    const detail: CalendarReminderDetail = { ...entry, firedAt: now.toISOString() };
    window.dispatchEvent(new CustomEvent<CalendarReminderDetail>('nur:calendar-reminder-fired', { detail }));
    await showSystemNotification(entry);
  }
  writeFiredSet(firedKey, fired);
}

export function startCalendarReminderScheduler() {
  void checkCalendarReminders();
  const interval = window.setInterval(() => void checkCalendarReminders(), CHECK_INTERVAL_MS);
  const handleFocus = () => void checkCalendarReminders();
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') void checkCalendarReminders();
  };
  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleVisibility);
  return () => {
    window.clearInterval(interval);
    window.removeEventListener('focus', handleFocus);
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}
