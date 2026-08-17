export type PremiumAccent = 'classic' | 'sapphire' | 'plum' | 'sand';
export type PremiumWidgetId = 'prayer' | 'quran' | 'dhikr' | 'routine';
export type PremiumHomeSection = 'journey' | 'discover' | 'continue' | 'inspiration' | 'assistant' | 'recommendations';

export type PremiumSettings = {
  accent: PremiumAccent;
  widgets: PremiumWidgetId[];
  homeOrder: PremiumHomeSection[];
  hiddenHomeSections: PremiumHomeSection[];
};

export type PremiumQuranPlan = {
  enabled: boolean;
  targetDays: number;
  startedAt: string;
};

export type PremiumRoutine = {
  id: string;
  name: string;
  items: string[];
  reminderTime: string | null;
  activeDays: number[];
};

export type PremiumReminder = {
  id: string;
  label: string;
  time: string;
  days: number[];
  enabled: boolean;
};

export type PremiumFolder = {
  id: string;
  name: string;
  itemRefs: string[];
};

export type PremiumJournalNote = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type PremiumDailySnapshot = {
  date: string;
  prayers: number;
  dhikr: number;
  quranActive: boolean;
  routineCompleted: number;
  routineTotal: number;
};

export type PremiumFavoriteRef = {
  ref: string;
  label: string;
  group: string;
};

const SETTINGS_KEY = 'nur_premium_settings_v1';
const QURAN_PLAN_KEY = 'nur_premium_quran_plan_v1';
const ROUTINES_KEY = 'nur_premium_routines_v1';
const ROUTINE_DAYS_KEY = 'nur_premium_routine_days_v1';
const REMINDERS_KEY = 'nur_premium_reminders_v1';
const FOLDERS_KEY = 'nur_premium_folders_v1';
const JOURNAL_KEY = 'nur_premium_journal_v1';
const STATS_KEY = 'nur_premium_stats_v1';
const REMINDER_FIRED_KEY = 'nur_premium_reminders_fired_v1';

export const PREMIUM_HOME_SECTIONS: PremiumHomeSection[] = ['journey', 'discover', 'continue', 'inspiration', 'assistant', 'recommendations'];
export const PREMIUM_WIDGETS: PremiumWidgetId[] = ['prayer', 'quran', 'dhikr', 'routine'];

const DEFAULT_SETTINGS: PremiumSettings = {
  accent: 'classic',
  widgets: ['prayer', 'quran', 'routine'],
  homeOrder: [...PREMIUM_HOME_SECTIONS],
  hiddenHomeSections: [],
};

function storageAvailable() {
  return typeof localStorage !== 'undefined';
}

function readJson<T>(key: string, fallback: T): T {
  if (!storageAvailable()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (!storageAvailable()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('nur:premium-data-changed', { detail: { key } }));
  } catch {
    // Local premium data is optional in restricted browser modes.
  }
}

function safeId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function uniqueKnown<T extends string>(value: unknown, allowed: readonly T[], fallback: T[]) {
  if (!Array.isArray(value)) return fallback;
  const known = value.filter((entry): entry is T => typeof entry === 'string' && allowed.includes(entry as T));
  return [...new Set(known)];
}

export function readPremiumSettings(): PremiumSettings {
  const stored = readJson<Partial<PremiumSettings>>(SETTINGS_KEY, {});
  const accent: PremiumAccent = ['classic', 'sapphire', 'plum', 'sand'].includes(stored.accent ?? '')
    ? stored.accent as PremiumAccent
    : DEFAULT_SETTINGS.accent;
  const widgets = uniqueKnown(stored.widgets, PREMIUM_WIDGETS, DEFAULT_SETTINGS.widgets);
  const partialOrder = uniqueKnown(stored.homeOrder, PREMIUM_HOME_SECTIONS, DEFAULT_SETTINGS.homeOrder);
  const homeOrder = [...partialOrder, ...PREMIUM_HOME_SECTIONS.filter((section) => !partialOrder.includes(section))];
  const hiddenHomeSections = uniqueKnown(stored.hiddenHomeSections, PREMIUM_HOME_SECTIONS, []);
  return { accent, widgets, homeOrder, hiddenHomeSections };
}

export function writePremiumSettings(settings: PremiumSettings) {
  writeJson(SETTINGS_KEY, settings);
  applyPremiumAccent(settings.accent);
}

export function applyPremiumAccent(accent = readPremiumSettings().accent) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.premiumAccent = accent;
}

export function readQuranPlan(): PremiumQuranPlan {
  const stored = readJson<Partial<PremiumQuranPlan>>(QURAN_PLAN_KEY, {});
  const targetDays = typeof stored.targetDays === 'number' && Number.isInteger(stored.targetDays)
    ? Math.min(365, Math.max(7, stored.targetDays))
    : 60;
  const startedAt = typeof stored.startedAt === 'string' && Number.isFinite(Date.parse(stored.startedAt))
    ? stored.startedAt
    : new Date().toISOString();
  return { enabled: stored.enabled === true, targetDays, startedAt };
}

export function writeQuranPlan(plan: PremiumQuranPlan) {
  writeJson(QURAN_PLAN_KEY, {
    enabled: Boolean(plan.enabled),
    targetDays: Math.min(365, Math.max(7, Math.round(plan.targetDays))),
    startedAt: Number.isFinite(Date.parse(plan.startedAt)) ? plan.startedAt : new Date().toISOString(),
  });
}

export function readQuranLastRead() {
  const stored = readJson<{ surahNumber?: unknown; ayahNumber?: unknown; updatedAt?: unknown }>('nur_quran_last_read', {});
  const surahNumber = typeof stored.surahNumber === 'number' && Number.isInteger(stored.surahNumber) && stored.surahNumber >= 1 && stored.surahNumber <= 114 ? stored.surahNumber : 1;
  const ayahNumber = typeof stored.ayahNumber === 'number' && Number.isInteger(stored.ayahNumber) && stored.ayahNumber >= 1 ? stored.ayahNumber : 1;
  const updatedAt = typeof stored.updatedAt === 'string' && Number.isFinite(Date.parse(stored.updatedAt)) ? stored.updatedAt : null;
  return { surahNumber, ayahNumber, updatedAt };
}

function normalizeDays(value: unknown) {
  if (!Array.isArray(value)) return [0, 1, 2, 3, 4, 5, 6];
  const days = value.filter((entry): entry is number => typeof entry === 'number' && Number.isInteger(entry) && entry >= 0 && entry <= 6);
  return [...new Set(days)].sort();
}

export function readPremiumRoutines(): PremiumRoutine[] {
  const stored = readJson<unknown>(ROUTINES_KEY, []);
  if (!Array.isArray(stored)) return [];
  return stored.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const routine = entry as Partial<PremiumRoutine>;
    if (typeof routine.id !== 'string' || typeof routine.name !== 'string' || !isStringArray(routine.items)) return [];
    return [{
      id: routine.id,
      name: routine.name.trim().slice(0, 60) || 'Meine Routine',
      items: routine.items.map((item) => item.trim().slice(0, 80)).filter(Boolean).slice(0, 12),
      reminderTime: typeof routine.reminderTime === 'string' && /^\d{2}:\d{2}$/.test(routine.reminderTime) ? routine.reminderTime : null,
      activeDays: normalizeDays(routine.activeDays),
    }];
  }).slice(0, 20);
}

export function createPremiumRoutine(name: string, items: string[], reminderTime: string | null = null) {
  const routines = readPremiumRoutines();
  const routine: PremiumRoutine = {
    id: safeId('routine'),
    name: name.trim().slice(0, 60) || 'Meine Routine',
    items: items.map((item) => item.trim().slice(0, 80)).filter(Boolean).slice(0, 12),
    reminderTime: reminderTime && /^\d{2}:\d{2}$/.test(reminderTime) ? reminderTime : null,
    activeDays: [0, 1, 2, 3, 4, 5, 6],
  };
  writeJson(ROUTINES_KEY, [routine, ...routines].slice(0, 20));
  return routine;
}

export function updatePremiumRoutine(routine: PremiumRoutine) {
  const routines = readPremiumRoutines().map((item) => item.id === routine.id ? routine : item);
  writeJson(ROUTINES_KEY, routines);
}

export function deletePremiumRoutine(id: string) {
  writeJson(ROUTINES_KEY, readPremiumRoutines().filter((routine) => routine.id !== id));
}

function readRoutineDays() {
  const stored = readJson<Record<string, Record<string, string[]>>>(ROUTINE_DAYS_KEY, {});
  return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
}

export function readRoutineCompletion(date = getLocalDateKey()) {
  return readRoutineDays()[date] ?? {};
}

export function toggleRoutineItem(routineId: string, item: string, date = getLocalDateKey()) {
  const days = readRoutineDays();
  const dateState = { ...(days[date] ?? {}) };
  const current = new Set(Array.isArray(dateState[routineId]) ? dateState[routineId] : []);
  if (current.has(item)) current.delete(item); else current.add(item);
  dateState[routineId] = [...current];
  days[date] = dateState;
  const recent = Object.fromEntries(Object.entries(days).sort(([a], [b]) => b.localeCompare(a)).slice(0, 120));
  writeJson(ROUTINE_DAYS_KEY, recent);
}

export function readPremiumReminders(): PremiumReminder[] {
  const stored = readJson<unknown>(REMINDERS_KEY, []);
  if (!Array.isArray(stored)) return [];
  return stored.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const reminder = entry as Partial<PremiumReminder>;
    if (typeof reminder.id !== 'string' || typeof reminder.label !== 'string' || typeof reminder.time !== 'string' || !/^\d{2}:\d{2}$/.test(reminder.time)) return [];
    return [{ id: reminder.id, label: reminder.label.slice(0, 80), time: reminder.time, days: normalizeDays(reminder.days), enabled: reminder.enabled !== false }];
  }).slice(0, 24);
}

export function createPremiumReminder(label: string, time: string) {
  if (!/^\d{2}:\d{2}$/.test(time)) return null;
  const reminder: PremiumReminder = { id: safeId('reminder'), label: label.trim().slice(0, 80) || 'Nur Erinnerung', time, days: [0, 1, 2, 3, 4, 5, 6], enabled: true };
  writeJson(REMINDERS_KEY, [reminder, ...readPremiumReminders()].slice(0, 24));
  return reminder;
}

export function updatePremiumReminder(reminder: PremiumReminder) {
  writeJson(REMINDERS_KEY, readPremiumReminders().map((item) => item.id === reminder.id ? reminder : item));
}

export function deletePremiumReminder(id: string) {
  writeJson(REMINDERS_KEY, readPremiumReminders().filter((reminder) => reminder.id !== id));
}

export function getDuePremiumReminders(now = new Date()) {
  const day = now.getDay();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const minuteKey = `${getLocalDateKey(now)}T${time}`;
  const fired = readJson<Record<string, string>>(REMINDER_FIRED_KEY, {});
  const due = readPremiumReminders().filter((reminder) => reminder.enabled && reminder.days.includes(day) && reminder.time === time && fired[reminder.id] !== minuteKey);
  if (due.length) {
    due.forEach((reminder) => { fired[reminder.id] = minuteKey; });
    writeJson(REMINDER_FIRED_KEY, fired);
  }
  return due;
}

export function readPremiumFolders(): PremiumFolder[] {
  const stored = readJson<unknown>(FOLDERS_KEY, []);
  if (!Array.isArray(stored)) return [];
  return stored.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const folder = entry as Partial<PremiumFolder>;
    if (typeof folder.id !== 'string' || typeof folder.name !== 'string' || !isStringArray(folder.itemRefs)) return [];
    return [{ id: folder.id, name: folder.name.slice(0, 60), itemRefs: [...new Set(folder.itemRefs)].slice(0, 250) }];
  }).slice(0, 40);
}

export function createPremiumFolder(name: string) {
  const folder: PremiumFolder = { id: safeId('folder'), name: name.trim().slice(0, 60) || 'Neue Sammlung', itemRefs: [] };
  writeJson(FOLDERS_KEY, [folder, ...readPremiumFolders()].slice(0, 40));
  return folder;
}

export function updatePremiumFolder(folder: PremiumFolder) {
  writeJson(FOLDERS_KEY, readPremiumFolders().map((item) => item.id === folder.id ? folder : item));
}

export function deletePremiumFolder(id: string) {
  writeJson(FOLDERS_KEY, readPremiumFolders().filter((folder) => folder.id !== id));
}

function readNumberArray(key: string, max = Number.POSITIVE_INFINITY) {
  const stored = readJson<unknown>(key, []);
  if (!Array.isArray(stored)) return [];
  return stored.map((value) => typeof value === 'number' ? value : Number(value)).filter((value) => Number.isInteger(value) && value > 0 && value <= max);
}

export function readPremiumFavoriteRefs(): PremiumFavoriteRef[] {
  const refs: PremiumFavoriteRef[] = [];
  readNumberArray('nur_quran_surah_favorites', 114).forEach((number) => refs.push({ ref: `quran-surah:${number}`, label: `Sure ${number}`, group: 'Quran' }));
  for (let surah = 1; surah <= 114; surah += 1) {
    readNumberArray(`nur_quran_bookmarks_${surah}`).forEach((ayah) => refs.push({ ref: `quran-ayah:${surah}:${ayah}`, label: `Sure ${surah}, Ayah ${ayah}`, group: 'Quran-Lesezeichen' }));
  }
  const duas = readJson<unknown>('nur_dua_favorites', []);
  if (Array.isArray(duas)) duas.filter((id): id is string => typeof id === 'string').forEach((id) => refs.push({ ref: `dua:${id}`, label: `Dua · ${id}`, group: 'Duas' }));
  const names = readJson<unknown>('nur_name_favorites', []);
  if (Array.isArray(names)) names.filter((id): id is string => typeof id === 'string').forEach((id) => refs.push({ ref: `name:${id}`, label: `Name Allahs · ${id}`, group: '99 Namen' }));
  return refs.slice(0, 500);
}

export function readPremiumJournal(): PremiumJournalNote[] {
  const stored = readJson<unknown>(JOURNAL_KEY, []);
  if (!Array.isArray(stored)) return [];
  return stored.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const note = entry as Partial<PremiumJournalNote>;
    if (typeof note.id !== 'string' || typeof note.title !== 'string' || typeof note.body !== 'string' || typeof note.createdAt !== 'string' || typeof note.updatedAt !== 'string') return [];
    return [{ id: note.id, title: note.title.slice(0, 160), body: note.body.slice(0, 20000), tags: isStringArray(note.tags) ? note.tags.map((tag) => tag.slice(0, 30)).slice(0, 8) : [], createdAt: note.createdAt, updatedAt: note.updatedAt }];
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 250);
}

export function savePremiumJournalNote(input: { id?: string; title: string; body: string; tags?: string[] }) {
  const notes = readPremiumJournal();
  const now = new Date().toISOString();
  const existing = input.id ? notes.find((note) => note.id === input.id) : undefined;
  const note: PremiumJournalNote = {
    id: existing?.id ?? safeId('journal'),
    title: input.title.trim().slice(0, 160) || 'Notiz',
    body: input.body.slice(0, 20000),
    tags: [...new Set((input.tags ?? []).map((tag) => tag.trim().slice(0, 30)).filter(Boolean))].slice(0, 8),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  writeJson(JOURNAL_KEY, [note, ...notes.filter((item) => item.id !== note.id)].slice(0, 250));
  return note;
}

export function deletePremiumJournalNote(id: string) {
  writeJson(JOURNAL_KEY, readPremiumJournal().filter((note) => note.id !== id));
}

function readPrayerCount(date: string) {
  const stored = readJson<unknown>(`nur_prayers_${date}`, []);
  return Array.isArray(stored) ? Math.min(5, new Set(stored.filter((value) => typeof value === 'string')).size) : 0;
}

function readDhikrSnapshot() {
  const stored = readJson<{ date?: unknown; counts?: unknown }>('nur_dhikr_daily_v2', {});
  if (typeof stored.date !== 'string' || !stored.counts || typeof stored.counts !== 'object' || Array.isArray(stored.counts)) return null;
  const total = Object.values(stored.counts as Record<string, unknown>).reduce((sum, value) => sum + (typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0), 0);
  return { date: stored.date, total };
}

function routineTotals(date: string) {
  const routines = readPremiumRoutines();
  const day = readRoutineCompletion(date);
  return routines.reduce((totals, routine) => {
    const done = new Set(day[routine.id] ?? []);
    totals.total += routine.items.length;
    totals.completed += routine.items.filter((item) => done.has(item)).length;
    return totals;
  }, { completed: 0, total: 0 });
}

export function capturePremiumDailySnapshot(now = new Date()) {
  const snapshots = readJson<Record<string, PremiumDailySnapshot>>(STATS_KEY, {});
  const today = getLocalDateKey(now);
  const quran = readQuranLastRead();
  const quranDate = quran.updatedAt ? getLocalDateKey(new Date(quran.updatedAt)) : null;
  const routine = routineTotals(today);
  snapshots[today] = {
    date: today,
    prayers: readPrayerCount(today),
    dhikr: snapshots[today]?.dhikr ?? 0,
    quranActive: snapshots[today]?.quranActive === true || quranDate === today,
    routineCompleted: routine.completed,
    routineTotal: routine.total,
  };

  const dhikr = readDhikrSnapshot();
  if (dhikr && /^\d{4}-\d{2}-\d{2}$/.test(dhikr.date)) {
    const existing = snapshots[dhikr.date];
    const dhikrRoutine = routineTotals(dhikr.date);
    snapshots[dhikr.date] = {
      date: dhikr.date,
      prayers: existing?.prayers ?? readPrayerCount(dhikr.date),
      dhikr: dhikr.total,
      quranActive: existing?.quranActive ?? quranDate === dhikr.date,
      routineCompleted: existing?.routineCompleted ?? dhikrRoutine.completed,
      routineTotal: existing?.routineTotal ?? dhikrRoutine.total,
    };
  }

  const recent = Object.fromEntries(Object.entries(snapshots).sort(([a], [b]) => b.localeCompare(a)).slice(0, 120));
  writeJson(STATS_KEY, recent);
  return recent[today];
}

export function readPremiumStats(days = 30): PremiumDailySnapshot[] {
  const snapshots = readJson<Record<string, PremiumDailySnapshot>>(STATS_KEY, {});
  return Array.from({ length: Math.min(120, Math.max(1, days)) }, (_, offset) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    const key = getLocalDateKey(date);
    return snapshots[key] ?? { date: key, prayers: readPrayerCount(key), dhikr: 0, quranActive: false, routineCompleted: 0, routineTotal: 0 };
  });
}
