/**
 * The Islamic day turns at Maghrib, and exactly one place decides when.
 *
 * Every screen that asks "what is today" used to answer from `new Date()`,
 * which names the wrong day between sunset and midnight — the hours in which
 * the nights that matter religiously are actually observed. The rule now lives
 * in src/services/islamicDay.ts.
 *
 * This guard exists because the failure mode is silent: a screen that quietly
 * recomputes the boundary itself, or drops back to the Gregorian date, looks
 * fine and is wrong for a few hours every evening.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [service, serviceTest, app, calendar] = await Promise.all([
  read('src/services/islamicDay.ts'),
  read('src/services/islamicDay.test.ts'),
  read('src/app/App.tsx'),
  read('src/screens/CalendarScreen.tsx'),
]);

for (const requirement of [
  'export function resolveIslamicDay',
  'export function getEffectiveIslamicDay',
  'export function readTrustedMaghribTime',
  // At Maghrib itself the new day has already begun.
  'const afterMaghrib = nowMinutes >= maghribMinutes',
  // Fixed at local noon so a daylight-saving shift cannot move the converted
  // date onto a neighbouring day.
  'value.setHours(12, 0, 0, 0)',
  // A guessed sunset would move a religious date by a whole day.
  "resolution: 'unknown-maghrib'",
  'hasReliableSharedPrayerTimes',
]) {
  if (!service.includes(requirement)) {
    throw new Error(`Islamic day service is missing: ${requirement}`);
  }
}

for (const requirement of [
  'turns exactly at Maghrib',
  'does not advance a second time at midnight',
  'daylight-saving',
  'without a trusted Maghrib time',
]) {
  if (!serviceTest.includes(requirement)) {
    throw new Error(`Islamic day boundary test coverage is missing: ${requirement}`);
  }
}

for (const [label, source] of [['Home', app], ['Calendar', calendar]]) {
  if (!source.includes("from '../services/islamicDay'")) {
    throw new Error(`${label} does not use the shared Islamic day boundary.`);
  }
  if (!source.includes('getEffectiveIslamicDay')) {
    throw new Error(`${label} imports the Islamic day service without asking it for the current day.`);
  }
}

// The screens must not re-derive the boundary. Comparing a clock value against
// a Maghrib time outside the service is the shape this took before.
for (const [label, source] of [['Home', app], ['Calendar', calendar]]) {
  if (/maghrib[^\n]*get(Hours|Minutes)\(\)/i.test(source) || /get(Hours|Minutes)\(\)[^\n]*maghrib/i.test(source)) {
    throw new Error(`${label} computes the Maghrib boundary itself instead of using the shared service.`);
  }
}

// Home must not silently fall back to the plain Gregorian conversion.
if (!app.includes('getEffectiveIslamicDay(date)')) {
  throw new Error('Home no longer derives its Islamic date from the effective Islamic day.');
}
if (/getHijriLabel\(\s*date\s*,/.test(app)) {
  throw new Error('Home still converts the raw Gregorian date as if it were the Islamic day.');
}

// Both screens have to say which rule produced the date; falling back to the
// calendar day without saying so is the dishonest version of this feature.
for (const [label, source] of [['Home', app], ['Calendar', calendar]]) {
  if (!source.includes("'unknown-maghrib'")) {
    throw new Error(`${label} does not distinguish a real Maghrib boundary from a missing one.`);
  }
  if (!source.includes('afterMaghrib')) {
    throw new Error(`${label} does not react to the Islamic day having turned.`);
  }
}

console.log('Islamic day boundary verified: one shared Maghrib rule, exact-minute and daylight-saving coverage, an explicit unknown-Maghrib state, and Home and Calendar both reading it rather than recomputing it.');
