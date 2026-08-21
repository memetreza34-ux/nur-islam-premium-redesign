/**
 * Religious calendar safety guard.
 *
 * Public events must fall on real calculated Hijri dates, must carry an
 * explicit source, and must not turn disputed/traditional dates into fixed v1
 * religious observances. The calculated Umm al-Qura date remains a planning
 * aid; local moon sighting can differ.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const source = await readFile(resolve(root, 'src/data/islamicEventsData.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/CalendarScreen.tsx'), 'utf8');

const events = [];
const block = source.slice(source.indexOf('ISLAMIC_EVENTS'), source.indexOf('/**\n * Historisch'));
for (const match of block.matchAll(/id: '([a-z0-9-]+)',\s*title: '([^']+)',\s*month: (\d+),\s*days: \[([0-9, ]+)\][\s\S]*?fasting: (true|false),\s*source: '([^']+)'/g)) {
  events.push({
    id: match[1],
    title: match[2],
    month: Number(match[3]),
    days: match[4].split(',').map((value) => Number(value.trim())),
    fasting: match[5] === 'true',
    source: match[6],
  });
}

if (events.length !== 11) throw new Error(`Expected 11 conservative public Islamic calendar events, found ${events.length}.`);

for (const event of events) {
  if (event.month < 1 || event.month > 12) throw new Error(`${event.id} has an impossible Hijri month: ${event.month}`);
  if (!event.source.trim()) throw new Error(`${event.id} has no traceable source.`);
  for (const day of event.days) {
    if (day < 1 || day > 30) throw new Error(`${event.id} has an impossible Hijri day: ${day}`);
  }
}

for (const required of ['ramadan', 'eid-al-fitr', 'eid-al-adha', 'arafah', 'ashura', 'laylat-al-qadr', 'tashriq']) {
  if (!events.some((event) => event.id === required)) {
    throw new Error(`The public calendar no longer knows a major supported occasion: ${required}`);
  }
}

const ramadan = events.find((event) => event.id === 'ramadan');
const qadr = events.find((event) => event.id === 'laylat-al-qadr');
const lastTen = events.find((event) => event.id === 'last-ten-ramadan');
if (ramadan?.fasting !== false) throw new Error('Ramadan must never produce the UI label "Freiwilliges Fasten".');
if (qadr?.days.join(',') !== '21,23,25,27,29') throw new Error('Laylat al-Qadr must be shown as a search across the odd nights, not fixed to the 27th.');
if (lastTen?.days.join(',') !== '21,22,23,24,25,26,27,28,29,30') throw new Error('The last-ten-Ramadan event must cover all possible final ten nights, including the 27th.');

for (const quarantined of ['mawlid-12-rabi-al-awwal', 'isra-miraj-27-rajab', 'mid-shaban-15']) {
  if (!source.includes(`id: '${quarantined}'`)) throw new Error(`Calendar quarantine record is missing: ${quarantined}`);
  if (events.some((event) => event.id === quarantined)) throw new Error(`Disputed/traditional date leaked into the public calendar: ${quarantined}`);
}
if (!source.includes('QUARANTINED_CALENDAR_NOTICES')) throw new Error('Calendar has no explicit quarantine for disputed/traditional dates.');

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
    `These public events never fall on a day in two years of real dates:\n  ${
      missed.map((event) => `${event.id} (${event.month}. Monat, Tag ${event.days.join('/')})`).join('\n  ')}`,
  );
}

if (!source.includes('NO_FASTING_DAYS') || !source.includes('isFastingForbidden')) {
  throw new Error('The calendar no longer suppresses voluntary fasting hints on Eid and Tashriq.');
}
if (!screen.includes('isFastingForbidden')) {
  throw new Error('The calendar screen does not apply the fasting-forbidden rule.');
}
if (!source.includes("source: 'Jamiʿ at-Tirmidhi 761 · Hasan'")) throw new Error('White-days source is missing.');
if (!source.includes("source: 'Jamiʿ at-Tirmidhi 747 · Hasan · Sunan Abi Dawud 2436'")) throw new Error('Monday/Thursday source is missing.');

for (const renderedSource of [
  '`${named.source} · ${HIJRI_SOURCE_NOTE}`',
  '`${WHITE_DAYS_EVENT.source} · ${HIJRI_SOURCE_NOTE}`',
  '`${WEEKLY_FAST_EVENT.source} · Der Wochentag wird lokal auf dem Gerät bestimmt.`',
]) {
  if (!screen.includes(renderedSource)) throw new Error(`Calendar does not surface source evidence: ${renderedSource}`);
}

if (/<strong>\{day\}<\/strong><em>/.test(screen)) {
  throw new Error('Calendar cells show two numbers again; the Hijri day belongs in the header.');
}
if (!screen.includes('Berechnetes Hijri-Datum') || !screen.includes('Mondsichtung')) {
  throw new Error('Calendar no longer discloses that calculated Hijri dates can differ from local moon sighting.');
}

console.log(`Islamic calendar verified: ${events.length} sourced public occasions, primary references are visible in the UI, disputed fixed dates are quarantined, Qadr is shown across odd last-ten nights, Ramadan is not mislabeled voluntary, and calculated Hijri dates are explicitly disclosed.`);
