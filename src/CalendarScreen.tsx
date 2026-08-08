import { useEffect, useMemo, useState } from 'react';
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
import { AnimatePresence, motion } from 'motion/react';
import { readCalendarEntries, writeCalendarEntries } from './calendarReminderService';
import type { PersonalCalendarEntry } from './calendarReminderService';

type CalendarEvent = {
  title: string;
  subtitle: string;
  fasting: boolean;
  sourceNote: string;
};

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getInitialCalendarPosition(initialDateKey?: string | null) {
  const today = new Date();
  let target = today;
  if (initialDateKey && /^\d{4}-\d{2}-\d{2}$/.test(initialDateKey)) {
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
    return new Set(Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : []);
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

function getHijriLabel(date: Date) {
  try {
    return new Intl.DateTimeFormat('de-DE-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  } catch {
    return 'Islamisches Datum';
  }
}

function getHijriDay(date: Date) {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric' }).formatToParts(date);
    return Number(parts.find((part) => part.type === 'day')?.value ?? 0);
  } catch {
    return 0;
  }
}

function getCalendarEvent(date: Date): CalendarEvent | null {
  const hijriDay = getHijriDay(date);
  if ([13, 14, 15].includes(hijriDay)) {
    return {
      title: 'Weiße Tage',
      subtitle: `${hijriDay}. berechneter Tag des islamischen Monats`,
      fasting: true,
      sourceNote: 'Der Hinweis basiert auf dem berechneten Hijri-Kalender des Geräts. Örtliche Mondsichtung kann um einen Tag abweichen.',
    };
  }

  const weekday = date.getDay();
  if (weekday === 1 || weekday === 4) {
    return {
      title: weekday === 1 ? 'Montagsfasten' : 'Donnerstagsfasten',
      subtitle: 'Freiwilliger Fastentag',
      fasting: true,
      sourceNote: 'Dieser Hinweis basiert ausschließlich auf dem lokalen Wochentag.',
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
  const monthData = useMemo(() => getMonthData(monthOffset), [monthOffset]);
  const monthTitle = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(monthData.first);
  const selectedDate = new Date(monthData.year, monthData.month, Math.min(selectedDay, monthData.daysInMonth));
  const selectedDateKey = getDateKey(selectedDate);
  const hijriLabel = getHijriLabel(selectedDate);
  const selectedEvent = getCalendarEvent(selectedDate);
  const selectedEntries = entries.filter((entry) => entry.date === selectedDateKey);

  useEffect(() => writeCalendarEntries(entries), [entries]);
  useEffect(() => {
    try { localStorage.setItem('nur_calendar_favorites', JSON.stringify([...favorites])); } catch { /* optional */ }
  }, [favorites]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
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
      id: Date.now(),
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
    <motion.main className="screen calendar-screen reference-calendar-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
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
            const event = Boolean(getCalendarEvent(cellDate));
            const personal = entries.some((entry) => entry.date === dateKey);
            const selected = day === selectedDay;
            const isToday = dateKey === getDateKey(new Date());
            const hijriDay = getHijriDay(cellDate);
            return (
              <button key={day} className={`calendar-day${selected ? ' calendar-day--selected' : ''}${isToday ? ' calendar-day--today' : ''}`} onClick={() => setSelectedDay(day)}>
                <strong>{day}</strong><em>{hijriDay || ''}</em>
                <span className="calendar-day__dots">{event ? <i className="calendar-dot calendar-dot--event" /> : null}{personal ? <i className="calendar-dot calendar-dot--personal" /> : null}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="reference-calendar-calculation-note"><ShieldCheck size={16} /><span><strong>Berechnetes Hijri-Datum</strong><small>Das islamische Datum wird aus dem Kalender des Geräts berechnet. Der tatsächliche Monatsbeginn kann je nach örtlicher Mondsichtung oder zuständiger Stelle abweichen.</small></span></section>

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
          <motion.div className="calendar-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdd(false)}>
            <motion.section className="calendar-modal" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(event) => event.stopPropagation()}>
              <div className="calendar-modal__header"><div><span className="overline">{new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long' }).format(selectedDate)}</span><h2>Termin hinzufügen</h2></div><button className="icon-button" onClick={() => setShowAdd(false)} aria-label="Schließen"><X size={19} /></button></div>
              <label>Titel<input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} maxLength={120} placeholder="z. B. Surah Al-Kahf lesen" autoFocus /></label>
              <label>Uhrzeit<input type="time" value={newTime} onChange={(event) => setNewTime(event.target.value)} /></label>
              <button className="calendar-reminder-row" onClick={() => setNewReminder((value) => !value)}><span><Bell size={18} /> Systemerinnerung {newReminder ? 'aktiv' : 'inaktiv'}</span><span className={newReminder ? 'mini-toggle mini-toggle--on' : 'mini-toggle'}><i /></span></button>
              <small className="reference-calendar-reminder-help">Erinnerungen werden ausgelöst, solange die App/PWA aktiv ist. Für garantierte Zustellung bei vollständig beendeter App ist später native Push-Infrastruktur nötig.</small>
              <button className="gold-button calendar-save-button" onClick={() => void saveEntry()}><CircleCheck size={18} /> Speichern</button>
            </motion.section>
          </motion.div>
        ) : null}
        {toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}
      </AnimatePresence>
    </motion.main>
  );
}
