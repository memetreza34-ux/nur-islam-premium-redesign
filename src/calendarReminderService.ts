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

const STORAGE_KEY = 'nur_calendar_entries';
const FIRED_PREFIX = 'nur_calendar_reminders_fired_';
const CHECK_INTERVAL_MS = 20_000;

function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function isValidEntry(value: unknown): value is PersonalCalendarEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<PersonalCalendarEntry>;
  return Number.isSafeInteger(entry.id)
    && typeof entry.date === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(entry.date)
    && typeof entry.title === 'string'
    && entry.title.trim().length > 0
    && entry.title.length <= 120
    && typeof entry.time === 'string'
    && /^([01]\d|2[0-3]):[0-5]\d$/.test(entry.time)
    && typeof entry.reminder === 'boolean';
}

export function readCalendarEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter(isValidEntry);
    if (valid.length !== parsed.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
    return valid;
  } catch {
    return [];
  }
}

export function writeCalendarEntries(entries: PersonalCalendarEntry[]) {
  const valid = entries.filter(isValidEntry);
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
  const options: NotificationOptions = {
    body: `Dein Termin beginnt um ${entry.time} Uhr.`,
    icon: './nur-app-icon.svg',
    badge: './nur-app-icon.svg',
    tag: `nur-calendar-${entry.id}-${entry.date}`,
    data: { target: 'calendar', url: '?open=calendar' },
  };

  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) await registration.showNotification(title, options);
    else new Notification(title, options);
  } catch {
    // In-app reminder remains available when system notifications fail.
  }
}

async function checkCalendarReminders(now = new Date()) {
  if (document.visibilityState === 'hidden') return;
  const today = dateKey(now);
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const entries = readCalendarEntries().filter((entry) => entry.reminder && entry.date === today && entry.time === currentTime);
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
