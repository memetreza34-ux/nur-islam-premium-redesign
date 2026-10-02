import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, MoonStar } from 'lucide-react';
import { readCalendarEntries } from '../services/calendarReminderService';
import { CALENDAR_DAY_NOTES_CHANGED_EVENT, readCalendarDayNotes } from '../services/calendarDayNotes';
import { getCalendarEvent, getDateKey, getMonthData, getUpcomingIslamicDates } from '../services/calendarViewModel';
import { getHijriDay, getHijriLabel } from '../services/hijriCalendar';
import { CalendarDayNotes } from './CalendarDayNotes';

export function PrayerCalendarSection({ onOpenCalendar }: { onOpenCalendar: (dateKey: string) => void }) {
  const today = useMemo(() => new Date(), []);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const monthData = useMemo(() => getMonthData(monthOffset, today), [monthOffset, today]);
  const selectedDate = new Date(monthData.year, monthData.month, Math.min(selectedDay, monthData.daysInMonth), 12);
  const selectedEvent = getCalendarEvent(selectedDate);
  const [entries, setEntries] = useState(readCalendarEntries);
  const [notes, setNotes] = useState(readCalendarDayNotes);
  const selectedEntries = entries.filter((entry) => entry.date === getDateKey(selectedDate));
  const selectedNotes = notes.filter((note) => note.date === getDateKey(selectedDate));
  const upcomingDates = useMemo(() => getUpcomingIslamicDates(today, 3), [today]);
  const monthTitle = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(monthData.first);
  const visibleCells = useMemo(() => {
    const lastDayIndex = monthData.cells.reduce<number>((lastIndex, day, index) => day ? index : lastIndex, 0);
    return monthData.cells.slice(0, lastDayIndex + 1);
  }, [monthData.cells]);

  useEffect(() => {
    const refresh = () => {
      setEntries(readCalendarEntries());
      setNotes(readCalendarDayNotes());
    };
    window.addEventListener(CALENDAR_DAY_NOTES_CHANGED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('nur:cloud-restored', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener(CALENDAR_DAY_NOTES_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('nur:cloud-restored', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  const moveMonth = (direction: number) => {
    setMonthOffset((value) => value + direction);
    setSelectedDay(1);
  };

  const showToday = () => {
    setMonthOffset(0);
    setSelectedDay(today.getDate());
  };

  return (
    <section className="prayer-calendar-section" aria-labelledby="prayer-calendar-title">
      <div className="section-heading prayer-calendar-section__heading">
        <div><span className="overline">Gebetskalender</span><h2 id="prayer-calendar-title">Islamische Tage & Termine</h2></div>
        <button className="text-button" onClick={() => onOpenCalendar(getDateKey(selectedDate))}><CalendarDays size={15} /> Kalender öffnen</button>
      </div>

      <div className="prayer-calendar-ledger">
        <div className="prayer-calendar-ledger__nav">
          <button onClick={() => moveMonth(-1)} aria-label="Vorheriger Monat"><ChevronLeft size={19} /></button>
          <button className="prayer-calendar-ledger__title" onClick={showToday} aria-label="Zum heutigen Datum">
            <small>Gregorianischer Monat</small><strong>{monthTitle}</strong><span>Beginn: {getHijriLabel(monthData.first)}</span>
          </button>
          <button onClick={() => moveMonth(1)} aria-label="Nächster Monat"><ChevronRight size={19} /></button>
        </div>

        <div className="calendar-weekdays prayer-calendar-weekdays">{['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="prayer-calendar-grid">
          {visibleCells.map((day, index) => {
            if (!day) return <span className="prayer-calendar-day prayer-calendar-day--empty" key={`empty-${index}`} />;
            const date = new Date(monthData.year, monthData.month, day, 12);
            const event = getCalendarEvent(date);
            const dateKey = getDateKey(date);
            const isToday = dateKey === getDateKey(today);
            const isSelected = day === selectedDay;
            const appointmentCount = entries.filter((entry) => entry.date === dateKey).length;
            const noteCount = notes.filter((note) => note.date === dateKey).length;
            const hasPersonal = appointmentCount > 0 || noteCount > 0;
            return (
              <button
                key={day}
                className={`prayer-calendar-day${isSelected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}`}
                onClick={() => setSelectedDay(day)}
                aria-pressed={isSelected}
                aria-label={`${day}. ${monthTitle}${event ? `, ${event.title}` : ''}${appointmentCount ? `, ${appointmentCount} ${appointmentCount === 1 ? 'persönlicher Termin' : 'persönliche Termine'}` : ''}${noteCount ? `, ${noteCount} ${noteCount === 1 ? 'persönliche Notiz' : 'persönliche Notizen'}` : ''}`}
              >
                <strong>{day}</strong><small>{getHijriDay(date)}</small>
                <span>{event?.named ? <i className="calendar-dot calendar-dot--named" /> : event ? <i className="calendar-dot calendar-dot--event" /> : null}{hasPersonal ? <i className="calendar-dot calendar-dot--personal" /> : null}</span>
              </button>
            );
          })}
        </div>

        <div className="calendar-legend prayer-calendar-legend"><span><i className="calendar-dot calendar-dot--named" /> Wichtig</span><span><i className="calendar-dot calendar-dot--event" /> Fasten</span><span><i className="calendar-dot calendar-dot--personal" /> Persönlich</span></div>

        <div className="prayer-calendar-selected">
          <time dateTime={getDateKey(selectedDate)}><strong>{selectedDate.getDate()}</strong><small>{new Intl.DateTimeFormat('de-DE', { month: 'short' }).format(selectedDate)}</small></time>
          <span><small>{new Intl.DateTimeFormat('de-DE', { weekday: 'long' }).format(selectedDate)}</small><strong>{selectedEvent?.title ?? 'Kein besonderer Termin'}</strong><em>{getHijriLabel(selectedDate)}</em></span>
          <span className="prayer-calendar-selected__meta">{selectedNotes.length ? `${selectedNotes.length} ${selectedNotes.length === 1 ? 'Notiz' : 'Notizen'}` : selectedEntries.length ? `${selectedEntries.length} ${selectedEntries.length === 1 ? 'Termin' : 'Termine'}` : selectedEvent?.fasting ? 'Fastenhinweis' : 'Frei'}</span>
        </div>
        <CalendarDayNotes date={selectedDate} compact />
      </div>

      <div className="prayer-calendar-upcoming">
        <div><MoonStar size={17} /><span><small>Vorausblick</small><strong>Nächste wichtige Termine</strong></span></div>
        <ol>
          {upcomingDates.map(({ date, event }) => (
            <li key={`${getDateKey(date)}-${event.title}`}><time dateTime={getDateKey(date)}>{new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short' }).format(date)}</time><span><strong>{event.title}</strong><small>{getHijriLabel(date)}</small></span></li>
          ))}
        </ol>
        <p>Hijri-Daten sind berechnet. Die örtliche Mondsichtung kann um einen Tag abweichen.</p>
      </div>
    </section>
  );
}
