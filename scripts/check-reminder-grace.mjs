import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const prayer = await readFile(resolve(root, 'src/services/prayerReminderService.ts'), 'utf8');
const calendar = await readFile(resolve(root, 'src/services/calendarReminderService.ts'), 'utf8');

for (const [label, source] of [['Prayer', prayer], ['Calendar', calendar]]) {
  if (!source.includes('REMINDER_WINDOW_MINUTES = 5') && !source.includes('REMINDER_GRACE_MINUTES = 5')) {
    throw new Error(`${label} reminders do not keep a five-minute grace window for throttled browser timers.`);
  }
}

for (const requirement of [
  "window.addEventListener('focus', run)",
  "document.addEventListener('visibilitychange', handleVisibility)",
]) {
  if (!prayer.includes(requirement)) throw new Error(`Prayer reminder recovery path is missing: ${requirement}`);
}

for (const requirement of [
  "window.addEventListener('focus', handleFocus)",
  "document.addEventListener('visibilitychange', handleVisibility)",
]) {
  if (!calendar.includes(requirement)) throw new Error(`Calendar reminder recovery path is missing: ${requirement}`);
}

console.log('Reminder grace verified: prayer and calendar reminders allow five minutes of timer-throttling recovery and recheck on focus/visibility.');
