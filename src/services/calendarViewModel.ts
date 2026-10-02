import {
  WEEKLY_FAST_EVENT,
  WHITE_DAYS,
  WHITE_DAYS_EVENT,
  findIslamicEvents,
  isFastingForbidden,
} from '../data/islamicEventsData';
import { getHijriDay, getHijriMonth } from './hijriCalendar';

export type CalendarEvent = {
  title: string;
  subtitle: string;
  meaning?: string;
  practice?: string;
  fasting: boolean;
  sourceNote: string;
  named: boolean;
};

export type UpcomingIslamicDate = {
  date: Date;
  event: CalendarEvent;
};

export function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getMonthData(offset: number, today = new Date()) {
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

const HIJRI_SOURCE_NOTE = 'Der Termin ist aus dem Hijri-Kalender des Geräts berechnet. Die örtliche Mondsichtung kann um einen Tag abweichen.';

export function getCalendarEvent(date: Date): CalendarEvent | null {
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
      sourceNote: HIJRI_SOURCE_NOTE,
      named: true,
    };
  }

  if (WHITE_DAYS.includes(hijriDay as (typeof WHITE_DAYS)[number])) {
    return {
      title: WHITE_DAYS_EVENT.title,
      subtitle: `${hijriDay}. berechneter Tag des islamischen Monats`,
      meaning: WHITE_DAYS_EVENT.meaning,
      practice: WHITE_DAYS_EVENT.practice,
      fasting: !fastingForbidden,
      sourceNote: HIJRI_SOURCE_NOTE,
      named: false,
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
      sourceNote: 'Dieser Hinweis basiert ausschließlich auf dem lokalen Wochentag.',
      named: false,
    };
  }

  return null;
}

export function getUpcomingIslamicDates(from = new Date(), limit = 4) {
  const result: UpcomingIslamicDate[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 12);

  for (let offset = 0; offset < 400 && result.length < limit; offset += 1) {
    const date = new Date(cursor);
    date.setDate(cursor.getDate() + offset);
    const event = getCalendarEvent(date);
    if (event?.named) result.push({ date, event });
  }

  return result;
}
