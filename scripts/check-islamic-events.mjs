/**
 * Every event in the calendar has to actually fall on a day.
 *
 * A wrong month number or a day outside the Hijri range does not throw — the
 * event simply never matches, and the calendar looks finished while Ramadan
 * silently never arrives. So rather than checking the shape of the data, this
 * walks two real years of dates through the same Umm al-Qura calendar the app
 * uses and requires every event to be reached.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const source = await readFile(resolve(root, 'src/data/islamicEventsData.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/CalendarScreen.tsx'), 'utf8');

const events = [];
const block = source.slice(source.indexOf('ISLAMIC_EVENTS'), source.indexOf('export const WHITE_DAYS'));
for (const match of block.matchAll(/id: '([a-z0-9-]+)',\s*title: '([^']+)',\s*month: (\d+),\s*days: \[([0-9, ]+)\]/g)) {
  events.push({
    id: match[1],
    title: match[2],
    month: Number(match[3]),
    days: match[4].split(',').map((value) => Number(value.trim())),
  });
}

if (events.length < 15) throw new Error(`Expected at least 15 Islamic events, found ${events.length}.`);

for (const event of events) {
  if (event.month < 1 || event.month > 12) throw new Error(`${event.id} has an impossible Hijri month: ${event.month}`);
  for (const day of event.days) {
    if (day < 1 || day > 30) throw new Error(`${event.id} has an impossible Hijri day: ${day}`);
  }
}

// The occasions the calendar exists for. Losing one of these to a refactor is
// the failure this list is here to make loud.
for (const required of ['ramadan', 'eid-al-fitr', 'eid-al-adha', 'arafah', 'ashura', 'laylat-al-qadr']) {
  if (!events.some((event) => event.id === required)) {
    throw new Error(`The calendar no longer knows a major occasion: ${required}`);
  }
}

const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric' });
const hijriOf = (date) => {
  const parts = formatter.formatToParts(date);
  return {
    day: Number(parts.find((part) => part.type === 'day')?.value),
    month: Number(parts.find((part) => part.type === 'month')?.value),
  };
};

const reached = new Map();
for (let offset = 0; offset < 740; offset += 1) {
  const date = new Date(2026, 0, 1 + offset);
  const { day, month } = hijriOf(date);
  for (const event of events) {
    if (event.month === month && event.days.includes(day) && !reached.has(event.id)) {
      reached.set(event.id, date.toDateString());
    }
  }
}

const missed = events.filter((event) => !reached.has(event.id));
if (missed.length > 0) {
  throw new Error(
    `These events never fall on a day in two years of real dates, so they can never appear:\n  ${
      missed.map((event) => `${event.id} (${event.month}. Monat, Tag ${event.days.join('/')})`).join('\n  ')}`,
  );
}

// Fasting must not be suggested on the days it is forbidden.
if (!source.includes('NO_FASTING_DAYS') || !source.includes('isFastingForbidden')) {
  throw new Error('The calendar no longer suppresses fasting hints on Eid and the Tashriq days.');
}
if (!screen.includes('isFastingForbidden')) {
  throw new Error('The calendar screen does not apply the fasting-forbidden rule.');
}

// One number per cell was the point of the redesign: the Hijri date belongs in
// the header and on the selected day, not stacked under every date.
if (/<strong>\{day\}<\/strong><em>/.test(screen)) {
  throw new Error('Calendar cells show two numbers again; the Hijri day belongs in the header.');
}

console.log(`Islamic calendar verified: ${events.length} occasions, every one reached within two years of real Umm al-Qura dates, fasting suppressed on Eid and Tashriq, and one number per cell.`);
