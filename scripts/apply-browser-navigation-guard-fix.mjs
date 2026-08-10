import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`${label}: expected source block was not found.`);
  if (source.indexOf(before, first + before.length) >= 0) throw new Error(`${label}: expected source block is not unique.`);
  return source.slice(0, first) + after + source.slice(first + before.length);
}

const prayerPath = resolve(process.cwd(), 'scripts/check-prayer-reminders.mjs');
let prayerSource = await readFile(prayerPath, 'utf8');
prayerSource = replaceOnce(
  prayerSource,
  `if (!app.includes("window.addEventListener('nur:open-prayer'")\n  || !app.includes('const pending = consumePendingNavigation()')\n  || !app.includes("setActiveTab('prayer')")) {\n  throw new Error('App does not handle live or queued prayer navigation from reminders.');\n}`,
  `if (!app.includes("window.addEventListener('nur:open-prayer'")\n  || !app.includes('const pending = consumePendingNavigation()')\n  || !app.includes("const openPrayerTracker = () => openRootTab('prayer')")\n  || !app.includes('resetBrowserRoot(buildNavigationSnapshot({')) {\n  throw new Error('App does not handle live or queued prayer navigation through the browser-aware root reset.');\n}`,
  'Prayer reminder guard',
);
await writeFile(prayerPath, prayerSource);

const releasePath = resolve(process.cwd(), 'scripts/check-release-hardening.mjs');
let releaseSource = await readFile(releasePath, 'utf8');
releaseSource = replaceOnce(
  releaseSource,
  `requireText(app, [\n  "window.addEventListener('nur:open-calendar'",\n  "window.removeEventListener('nur:open-calendar'",\n  "setActiveTab('calendar')",\n], 'Calendar app navigation');`,
  `requireText(app, [\n  "window.addEventListener('nur:open-calendar'",\n  "window.removeEventListener('nur:open-calendar'",\n  "const openCalendar = () => openRootTab('calendar')",\n  'resetBrowserRoot(buildNavigationSnapshot({',\n], 'Calendar browser-aware app navigation');`,
  'Calendar release guard',
);
await writeFile(releasePath, releaseSource);

console.log('Prayer and calendar release guards updated for browser-aware root navigation.');
