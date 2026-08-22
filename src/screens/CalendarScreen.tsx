import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Heart,
  MoonStar,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useDialog } from '../shared/useDialog';
import { readCalendarEntries, writeCalendarEntries } from '../services/calendarReminderService';
import type { PersonalCalendarEntry } from '../services/calendarReminderService';
import { getHijriDay, getHijriLabel, getHijriMonth } from '../services/hijriCalendar';
import { getEffectiveIslamicDay } from '../services/islamicDay';
import {
  WEEKLY_FAST_EVENT,
  WHITE_DAYS,
  WHITE_DAYS_EVENT,
  findIslamicEvents,
  isFastingForbidden,
} from '../data/islamicEventsData';

type CalendarEvent = {
  title: string;
  subtitle: string;
  meaning?: string;
  practice?: string;
  fasting: boolean;
  sourceNote: string;
};

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidDateKey(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function getInitialCalendarPosition(initialDateKey?: string | null) {
  const today = new Date();
  let target = today;
  if (initialDateKey && isValidDateKey(initialDateKey)) {
    const parsed = new Date(`${initialDateKey}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) target = parsed;
  }
  return {
    monthOffset: (target.getFullYear() - today.getFullYear()) * 12 + target.getMonth() - today.getMonth(),
    selectedDay: target.getDate(),
  };
}

function readFavorites() {
  try {
    const stored = localStorage.getItem('nur_calendar_favorites');
    const parsed = stored ? JSON.parse(stored) as unknown : [];
    const valid = Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string' && isValidDateKey(value))
      : [];
    const normalized = [...new Set(valid)];
    if (JSON.stringify(normalized) !== JSON.stringify(parsed)) localStorage.setItem('nur_calendar_favorites', JSON.stringify(normalized));
    return new Set(normalized);
  } catch {
    return new Set<string>();
  }
}

function getMonthData(offset: number) {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const year = first.getFullYear();
  const month = first.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayFirstIndex = (first.getDay() + 6) % 7;
  const cells: Array<number | null> = Array.from({ length: mondayFirstIndex }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length < 42) cells.push(null);
  return { first, year, month, daysInMonth, cells };
}

const HIJRI_SOURCE_NOTE = 'Das Hijri-Datum ist berechnet. Der tatsächliche Monatsbeginn kann je nach örtlicher Mondsichtung oder zuständiger Stelle abweichen.';

/**
 * What falls on this day, most significant first.
 *
 * The order matters: Eid outranks the white days it can collide with, and a
 * named occasion outranks the weekly voluntary fast.
 */
function getCalendarEvent(date: Date): CalendarEvent | null {
  const hijriDay = getHijriDay(date);
  const hijriMonth = getHijriMonth(date);
  const fastingForbidden = isFastingForbidden(hijriMonth, hijriDay);

  const [named] = findIslamicEvents(hijriMonth, hijriDay);
  if (named) {
    return {
      title: named.title,
      subtitle: `${hijriDay}. Tag des ${hijriMonth}. islamischen Monats`,
      meaning: named.meaning,
      practice: named.practice,
      fasting: named.fasting && !fastingForbidden,
      sourceNote: `${named.source} · ${HIJRI_SOURCE_NOTE}`,
    };
  }

  if (WHITE_DAYS.includes(hijriDay as (typeof WHITE_DAYS)[number])) {
    return {
      title: WHITE_DAYS_EVENT.title,
      subtitle: `${hijriDay}. berechneter Tag des islamischen Monats`,
      meaning: WHITE_DAYS_EVENT.meaning,
      practice: WHITE_DAYS_EVENT.practice,
      fasting: !fastingForbidden,
      sourceNote: `${WHITE_DAYS_EVENT.source} · ${HIJRI_SOURCE_NOTE}`,
    };
  }

  const weekday = date.getDay();
  if (weekday === 1 || weekday === 4) {
    return {
      title: weekday === 1 ? 'Montagsfasten' : 'Donnerstagsfasten',
      subtitle: 'Freiwilliger Fastentag',
      meaning: WEEKLY_FAST_EVENT.meaning,
      practice: WEEKLY_FAST_EVENT.practice,
      fasting: !fastingForbidden,
      sourceNote: `${WEEKLY_FAST_EVENT.source} · Der Wochentag wird lokal auf dem Gerät bestimmt.`,
    };
  }
  return null;
}

export function CalendarScreen({ onBack, initialDateKey = null }: { onBack: () => void; initialDateKey?: string | null }) {
  const initialPosition = useMemo(() => getInitialCalendarPosition(initialDateKey), [initialDateKey]);
  const [monthOffset, setMonthOffset] = useState(initialPosition.monthOffset);
  const [selectedDay, setSelectedDay] = useState(initialPosition.selectedDay);
  const [favorites, setFavorites] = useState(readFavorites);
  const [entries, setEntries] = useState<PersonalCalendarEntry[]>(readCalendarEntries);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('19:30');
  const [newReminder, setNewReminder] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const toastTimerRef = useRef<number | null>(null);
  const entryIdRef = useRef(Date.now() * 1000);
  const closeDialog = useCallback(() => { setShowAdd(false); }, []);
  const screenDialog = useDialog(showAdd, closeDialog, 'Termin hinzufügen');
  const monthData = useMemo(() => getMonthData(monthOffset), [monthOffset]);
  const monthTitle = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(monthData.first);
  const selectedDate = new Date(monthData.year, monthData.month, Math.min(selectedDay, monthData.daysInMonth));
  const selectedDateKey = getDateKey(selectedDate);
  const hijriLabel = getHijriLabel(selectedDate);
  // The grid is a Gregorian month, so its cells keep the Gregorian mapping. What
  // it cannot show on its own is that the Islamic day has already turned: after
  // Maghrib the night belongs to the next Hijri date, which is when the nights
  // people look for actually begin.
  const islamicNow = getEffectiveIslamicDay();
  const selectedEvent = getCalendarEvent(selectedDate);
  const selectedEntries = entries.filter((entry) => entry.date === selectedDateKey);
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, .36, 1] as const };
  const microTransition = { duration: reduceMotion ? 0 : .18, ease: [0.22, 1, .36, 1] as const };

  useEffect(() => writeCalendarEntries(entries), [entries]);
  useEffect(() => {
    try { localStorage.setItem('nur_calendar_favorites', JSON.stringify([...favorites])); } catch { /* optional */ }
  }, [favorites]);
  useEffect(() => () => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
  }, []);

  const flash = (message: string) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2400);
  };

  const nextEntryId = () => {
    entryIdRef.current = Math.max(entryIdRef.current + 1, Date.now() * 1000);
    return entryIdRef.current;
  };

  const moveMonth = (direction: number) => {
    setMonthOffset((value) => value + direction);
    setSelectedDay(1);
  };

  const saveEntry = async () => {
    if (!newTitle.trim()) {
      flash('Bitte gib einen Titel ein');
      return;
    }

    let reminder = newReminder;
    if (reminder) {
      if (!('Notification' in window)) {
        reminder = false;
        flash('Termin wird gespeichert, aber Systemerinnerungen werden auf diesem Gerät nicht unterstützt');
      } else {
        const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
        if (permission !== 'granted') {
          reminder = false;
          flash('Termin gespeichert; Erinnerung blieb aus, weil Benachrichtigungen nicht freigegeben wurden');
        }
      }
    }

    const entry: PersonalCalendarEntry = {
      id: nextEntryId(),
      date: selectedDateKey,
      title: newTitle.trim().slice(0, 120),
      time: newTime,
      reminder,
    };
    setEntries((current) => [...current, entry]);
    setNewTitle('');
    setNewReminder(false);
    setShowAdd(false);
    if (!newReminder || reminder) flash(reminder ? 'Termin mit aktiver Erinnerung gespeichert' : 'Termin gespeichert');
  };

  return (
    <motion.main className="screen calendar-screen reference-calendar-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite"><ChevronLeft size={20} /></button>
        <div><span className="overline">Nur Islam</span><h1>Kalender</h1></div>
        <button className="icon-button" onClick={() => setShowAdd(true)} aria-label="Termin hinzufügen"><Plus size={20} /></button>
      </header>

      <section className="calendar-month-card glass-card reference-calendar-month">
        <div className="calendar-month-nav">
          <button onClick={() => moveMonth(-1)} aria-label="Vorheriger Monat"><ChevronLeft size={20} /></button>
          <div><span className="overline">Islamischer Kalender</span><h2>{monthTitle}</h2><p>{getHijriLabel(monthData.first)}</p></div>
          <button onClick={() => moveMonth(1)} aria-label="Nächster Monat"><ChevronRight size={20} /></button>
        </div>

        <div className="calendar-weekdays">{['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => <span key={day}>{day}</span>)}</div>

        <div className="calendar-grid reference-calendar-grid">
          {monthData.cells.map((day, index) => {
            if (!day) return <span className="calendar-day calendar-day--empty" key={`empty-${index}`} />;
            const cellDate = new Date(monthData.year, monthData.month, day);
            const dateKey = getDateKey(cellDate);
            const event = getCalendarEvent(cellDate);
            const named = Boolean(event && findIslamicEvents(getHijriMonth(cellDate), getHijriDay(cellDate)).length > 0);
            const personal = entries.some((entry) => entry.date === dateKey);
            const selected = day === selectedDay;
            const isToday = dateKey === getDateKey(new Date());
            return (
              <button key={day} className={`calendar-day${selected ? ' calendar-day--selected' : ''}${isToday ? ' calendar-day--today' : ''}`} onClick={() => setSelectedDay(day)} aria-label={event ? `${day}. — ${event.title}` : undefined}>
                <strong>{day}</strong>
                <span className="calendar-day__dots">{named ? <i className="calendar-dot calendar-dot--named" /> : event ? <i className="calendar-dot calendar-dot--event" /> : null}{personal ? <i className="calendar-dot calendar-dot--personal" /> : null}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="reference-calendar-calculation-note"><ShieldCheck size={16} /><span><strong>Berechnetes Hijri-Datum</strong><small>Das islamische Datum wird aus dem Kalender des Geräts berechnet. Der tatsächliche Monatsbeginn kann je nach örtlicher Mondsichtung oder zuständiger Stelle abweichen.</small></span></section>

      <section className="reference-calendar-calculation-note"><ShieldCheck size={16} /><span><strong>Tageswechsel ab Maghrib</strong><small>{islamicNow.afterMaghrib
        ? `Seit Maghrib (${islamicNow.maghrib} Uhr) gilt bereits der ${getHijriLabel(islamicNow.date)}. Die Kalenderfelder zeigen weiterhin die gregorianischen Tage.`
        : islamicNow.resolution === 'unknown-maghrib'
          ? 'Der islamische Tag beginnt am Abend mit Maghrib. Ohne aktuelle Gebetszeiten für deinen Standort kann Nur diesen Wechsel nicht berechnen und zeigt bis dahin den gregorianischen Tag.'
          : `Der islamische Tag beginnt heute mit Maghrib um ${islamicNow.maghrib} Uhr. Bis dahin gilt der hier gezeigte Tag.`}</small></span></section>

      <section className="selected-date-card glass-card reference-selected-date">
        <span className="selected-date-card__icon"><CalendarDays size={24} /></span>
        <span><small>Ausgewählter Tag</small><strong>{new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(selectedDate)}</strong><em>{hijriLabel}</em></span>
        <button onClick={() => setShowAdd(true)}><Plus size={17} /> Termin</button>
      </section>

      {selectedEvent ? (
        <section className="calendar-event-card reference-calendar-event">
          <div className="calendar-event-card__topline">
            <span><MoonStar size={16} /> Islamischer Hinweis</span>
            <button className={favorites.has(selectedDateKey) ? 'favorite-button favorite-button--active' : 'favorite-button'} onClick={() => setFavorites((current) => {
              const next = new Set(current);
              if (next.has(selectedDateKey)) next.delete(selectedDateKey); else next.add(selectedDateKey);
              return next;
            })} aria-label="Hinweis als Favorit speichern"><Heart size={18} fill={favorites.has(selectedDateKey) ? 'currentColor' : 'none'} /></button>
          </div>
          <h3>{selectedEvent.title}</h3><p>{selectedEvent.subtitle}</p>
          {selectedEvent.meaning ? <p className="calendar-event-card__meaning">{selectedEvent.meaning}</p> : null}
          {selectedEvent.practice ? <p className="calendar-event-card__practice"><Sparkles size={13} /> {selectedEvent.practice}</p> : null}
          {selectedEvent.fasting ? <span className="fasting-chip"><Sparkles size={14} /> Freiwilliges Fasten</span> : null}
          <span className="reference-calendar-event__source"><ShieldCheck size={14} /> {selectedEvent.sourceNote}</span>
        </section>
      ) : null}

      <section className="calendar-entries-section">
        <div className="section-heading"><div><span className="overline">Deine Planung</span><h2>Termine an diesem Tag</h2></div><button className="text-button" onClick={() => setShowAdd(true)}><Plus size={15} /> Hinzufügen</button></div>
        {selectedEntries.length ? (
          <div className="calendar-entry-list">
            {selectedEntries.map((entry) => (
              <article className="calendar-entry-row glass-card" key={entry.id}>
                <span className="calendar-entry-row__icon"><Clock3 size={20} /></span>
                <span><small>{entry.time}</small><strong>{entry.title}</strong><em>{entry.reminder ? 'Systemerinnerung aktiv' : 'Keine Erinnerung'}</em></span>
                <button onClick={() => { setEntries((current) => current.filter((item) => item.id !== entry.id)); flash('Termin gelöscht'); }} aria-label="Termin löschen"><Trash2 size={18} /></button>
              </article>
            ))}
          </div>
        ) : <button className="calendar-empty-state" onClick={() => setShowAdd(true)}><span><CalendarDays size={27} /></span><strong>Noch keine Termine</strong><small>Plane Quran, Dua, Fasten oder Moscheebesuche.</small></button>}
      </section>

      <AnimatePresence>
        {showAdd ? (
          <motion.div className="calendar-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={microTransition} onClick={() => setShowAdd(false)}>
            <motion.section {...screenDialog.props} className="calendar-modal" initial={{ y: reduceMotion ? 0 : 16, opacity: 0, scale: reduceMotion ? 1 : .99 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: reduceMotion ? 0 : 8, opacity: 0, scale: reduceMotion ? 1 : .995 }} transition={screenTransition} onClick={(event) => event.stopPropagation()}>
              <div className="calendar-modal__header"><div><span className="overline">{new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long' }).format(selectedDate)}</span><h2>Termin hinzufügen</h2></div><button className="icon-button" onClick={() => setShowAdd(false)} aria-label="Schließen"><X size={19} /></button></div>
              <label>Titel<input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} maxLength={120} placeholder="z. B. Surah Al-Kahf lesen" autoFocus /></label>
              <label>Uhrzeit<input type="time" value={newTime} onChange={(event) => setNewTime(event.target.value)} /></label>
              <button className="calendar-reminder-row" onClick={() => setNewReminder((value) => !value)}><span><Bell size={18} /> Systemerinnerung {newReminder ? 'aktiv' : 'inaktiv'}</span><span className={newReminder ? 'mini-toggle mini-toggle--on' : 'mini-toggle'}><i /></span></button>
              <small className="reference-calendar-reminder-help">Erinnerungen werden ausgelöst, solange die App/PWA aktiv ist. Für garantierte Zustellung bei vollständig beendeter App ist später native Push-Infrastruktur nötig.</small>
              <button className="gold-button calendar-save-button" onClick={() => void saveEntry()}><CircleCheck size={18} /> Speichern</button>
            </motion.section>
          </motion.div>
        ) : null}
        {toast ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }} transition={microTransition}><CircleCheck size={18} /> {toast}</motion.div> : null}
      </AnimatePresence>
    </motion.main>
  );
}
