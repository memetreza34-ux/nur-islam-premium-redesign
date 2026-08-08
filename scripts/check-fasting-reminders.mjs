import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const service = await readFile(resolve(root, 'src/fastingReminderService.ts'), 'utf8');
const main = await readFile(resolve(root, 'src/main.tsx'), 'utf8');
const legacy = await readFile(resolve(root, 'src/LegacyFeatureScreens.tsx'), 'utf8');
const calendarService = await readFile(resolve(root, 'src/calendarReminderService.ts'), 'utf8');

for (const requirement of [
  "FASTING_ENABLED_KEY = 'nur_fasting_reminders'",
  "FASTING_TIME_KEY = 'nur_fasting_reminder_time'",
  'LOOKAHEAD_DAYS = 45',
  'MAINTENANCE_INTERVAL_MS = 15 * 60_000',
  'buildRollingFastingReminders',
  'syncRollingFastingReminders',
  'startFastingReminderMaintenance',
  'isManagedFastingReminder',
  'weekday === 1',
  'weekday === 4',
  'hijriDay >= 13 && hijriDay <= 15',
  'previousDay(fastingDate)',
  'writeCalendarEntries(next)',
  "window.addEventListener('focus', sync)",
  "document.addEventListener('visibilitychange', handleVisibility)",
]) {
  if (!service.includes(requirement)) throw new Error(`Rolling fasting reminder service is missing: ${requirement}`);
}

if (service.includes('MAINTENANCE_INTERVAL_MS = 15_000')) {
  throw new Error('Fasting reminder maintenance regressed to an unnecessarily frequent 15-second loop.');
}

for (const requirement of [
  "import { startFastingReminderMaintenance } from './fastingReminderService';",
  'const stopFastingReminderMaintenance = startFastingReminderMaintenance()',
  'stopFastingReminderMaintenance()',
]) {
  if (!main.includes(requirement)) throw new Error(`Fasting reminder lifecycle is missing: ${requirement}`);
}

for (const requirement of [
  "import { syncRollingFastingReminders } from './fastingReminderService';",
  'nur_fasting_reminders',
  'nur_fasting_reminder_time',
  'syncRollingFastingReminders();',
  'Notification.requestPermission()',
  'Fasten-Erinnerungen',
]) {
  if (!legacy.includes(requirement)) throw new Error(`Fasting assistant UI is missing central service integration: ${requirement}`);
}

for (const forbidden of [
  "from './calendarReminderService'",
  'FASTING_REMINDER_ID_BASE',
  'FASTING_REMINDER_ID_MAX',
  'buildFastingReminderEntries',
  'isFastingReminder(',
  'readCalendarEntries()',
  'writeCalendarEntries(',
]) {
  if (legacy.includes(forbidden)) throw new Error(`Fasting assistant contains duplicate calendar scheduling logic: ${forbidden}`);
}

for (const requirement of [
  'readCalendarEntries',
  'writeCalendarEntries',
  'REMINDER_GRACE_MINUTES = 5',
  'nur:calendar-reminder-fired',
]) {
  if (!calendarService.includes(requirement)) throw new Error(`Shared calendar reminder engine is missing: ${requirement}`);
}

console.log('Fasting reminders verified: the assistant writes only preferences and immediately delegates to the single 45-day rolling scheduler; no duplicate screen-local calendar planning remains, and delivery uses the shared calendar reminder engine.');
