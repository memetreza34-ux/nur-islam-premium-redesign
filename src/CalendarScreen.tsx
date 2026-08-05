import { useMemo, useState } from 'react';
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
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type PersonalEntry = {
  id: number;
  day: number;
  title: string;
  time: string;
  reminder: boolean;
};

const eventDays: Record<number, { title: string; subtitle: string; fasting: boolean }> = {
  5: { title: 'Montagsfasten', subtitle: 'Freiwilliger Fastentag', fasting: true },
  13: { title: 'Weiße Tage', subtitle: '13. Hijri-Tag', fasting: true },
  14: { title: 'Weiße Tage', subtitle: '14. Hijri-Tag', fasting: true },
  15: { title: 'Weiße Tage', subtitle: '15. Hijri-Tag', fasting: true },
  27: { title: 'Islamischer Impuls', subtitle: 'Abendliche Erinnerung', fasting: false },
};

function getMonthData(offset: number) {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const year = first.getFullYear();
  const month = first.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const start = first.getDay();
  const cells: Array<number | null> = Array.from({ length: start }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length < 42) cells.push(null);
  return { first, year, month, cells };
}

function getHijriLabel(date: Date) {
  try {
    return new Intl.DateTimeFormat('de-DE-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'Islamisches Datum';
  }
}

export function CalendarScreen({ onBack }: { onBack: () => void }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [favorites, setFavorites] = useState(() => new Set<number>([13]));
  const [entries, setEntries] = useState<PersonalEntry[]>([
    { id: 1, day: 11, title: 'Quran-Lesezeit', time: '19:30', reminder: true },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('19:30');
  const [toast, setToast] = useState<string | null>(null);
  const monthData = useMemo(() => getMonthData(monthOffset), [monthOffset]);
  const monthTitle = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(monthData.first);
  const selectedDate = new Date(monthData.year, monthData.month, selectedDay);
  const hijriLabel = getHijriLabel(selectedDate);
  const selectedEvent = eventDays[selectedDay];
  const selectedEntries = entries.filter((entry) => entry.day === selectedDay);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const moveMonth = (direction: number) => {
    setMonthOffset((value) => value + direction);
    setSelectedDay(1);
  };

  const saveEntry = () => {
    if (!newTitle.trim()) return;
    setEntries((current) => [...current, {
      id: Date.now(),
      day: selectedDay,
      title: newTitle.trim(),
      time: newTime,
      reminder: true,
    }]);
    setNewTitle('');
    setShowAdd(false);
    flash('Termin gespeichert');
  };

  return (
    <motion.main className="screen calendar-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="calendar-page-header glass-card">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite"><ChevronLeft size={20} /></button>
        <div>
          <span className="overline">Nur Islam</span>
          <h1>Kalender</h1>
        </div>
        <button className="icon-button" onClick={() => setShowAdd(true)} aria-label="Termin hinzufügen"><Plus size={20} /></button>
      </header>

      <section className="calendar-month-card glass-card">
        <div className="calendar-month-nav">
          <button onClick={() => moveMonth(-1)} aria-label="Vorheriger Monat"><ChevronLeft size={20} /></button>
          <div>
            <span className="overline">Islamischer Kalender</span>
            <h2>{monthTitle}</h2>
            <p>{getHijriLabel(monthData.first)}</p>
          </div>
          <button onClick={() => moveMonth(1)} aria-label="Nächster Monat"><ChevronRight size={20} /></button>
        </div>

        <div className="calendar-weekdays">
          {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}
        </div>

        <div className="calendar-grid">
          {monthData.cells.map((day, index) => {
            if (!day) return <span className="calendar-day calendar-day--empty" key={`empty-${index}`} />;
            const event = Boolean(eventDays[day]);
            const personal = entries.some((entry) => entry.day === day);
            const selected = day === selectedDay;
            const isToday = monthOffset === 0 && day === new Date().getDate();
            return (
              <button
                key={day}
                className={`calendar-day${selected ? ' calendar-day--selected' : ''}${isToday ? ' calendar-day--today' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                <strong>{day}</strong>
                <span className="calendar-day__dots">
                  {event ? <i className="calendar-dot calendar-dot--event" /> : null}
                  {personal ? <i className="calendar-dot calendar-dot--personal" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="selected-date-card glass-card">
        <span className="selected-date-card__icon"><CalendarDays size={24} /></span>
        <span>
          <small>Ausgewählter Tag</small>
          <strong>{selectedDay}. {monthTitle}</strong>
          <em>{hijriLabel}</em>
        </span>
        <button onClick={() => setShowAdd(true)}><Plus size={17} /> Termin</button>
      </section>

      {selectedEvent ? (
        <section className="calendar-event-card">
          <div className="calendar-event-card__topline">
            <span><MoonStar size={16} /> Islamisches Ereignis</span>
            <button
              className={favorites.has(selectedDay) ? 'favorite-button favorite-button--active' : 'favorite-button'}
              onClick={() => setFavorites((current) => {
                const next = new Set(current);
                if (next.has(selectedDay)) next.delete(selectedDay); else next.add(selectedDay);
                return next;
              })}
            >
              <Heart size={18} fill={favorites.has(selectedDay) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <h3>{selectedEvent.title}</h3>
          <p>{selectedEvent.subtitle}</p>
          {selectedEvent.fasting ? <span className="fasting-chip"><Sparkles size={14} /> Fasten empfohlen</span> : null}
          <button className="event-detail-button" onClick={() => flash('Ereignisdetails geöffnet')}>Bedeutung & Empfehlungen <ChevronRight size={17} /></button>
        </section>
      ) : null}

      <section className="calendar-entries-section">
        <div className="section-heading">
          <div>
            <span className="overline">Deine Planung</span>
            <h2>Termine an diesem Tag</h2>
          </div>
          <button className="text-button" onClick={() => setShowAdd(true)}><Plus size={15} /> Hinzufügen</button>
        </div>

        {selectedEntries.length ? (
          <div className="calendar-entry-list">
            {selectedEntries.map((entry) => (
              <article className="calendar-entry-row glass-card" key={entry.id}>
                <span className="calendar-entry-row__icon"><Clock3 size={20} /></span>
                <span>
                  <small>{entry.time}</small>
                  <strong>{entry.title}</strong>
                  <em>{entry.reminder ? 'Erinnerung aktiv' : 'Keine Erinnerung'}</em>
                </span>
                <button onClick={() => {
                  setEntries((current) => current.filter((item) => item.id !== entry.id));
                  flash('Termin gelöscht');
                }} aria-label="Termin löschen"><Trash2 size={18} /></button>
              </article>
            ))}
          </div>
        ) : (
          <button className="calendar-empty-state" onClick={() => setShowAdd(true)}>
            <span><CalendarDays size={27} /></span>
            <strong>Noch keine Termine</strong>
            <small>Plane Quran, Dua, Fasten oder Moscheebesuche.</small>
          </button>
        )}
      </section>

      <AnimatePresence>
        {showAdd ? (
          <motion.div className="calendar-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.section className="calendar-modal" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
              <div className="calendar-modal__header">
                <div><span className="overline">{selectedDay}. {monthTitle}</span><h2>Termin hinzufügen</h2></div>
                <button className="icon-button" onClick={() => setShowAdd(false)}><X size={19} /></button>
              </div>
              <label>Titel<input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="z. B. Surah Al-Kahf lesen" autoFocus /></label>
              <label>Uhrzeit<input type="time" value={newTime} onChange={(event) => setNewTime(event.target.value)} /></label>
              <div className="calendar-reminder-row"><span><Bell size={18} /> Erinnerung aktiv</span><span className="mini-toggle mini-toggle--on"><i /></span></div>
              <button className="gold-button calendar-save-button" onClick={saveEntry}><CircleCheck size={18} /> Speichern</button>
            </motion.section>
          </motion.div>
        ) : null}
        {toast ? (
          <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <CircleCheck size={18} /> {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.main>
  );
}
