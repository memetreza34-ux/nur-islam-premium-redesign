import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const path = resolve(process.cwd(), 'scripts/check-prayer-reminders.mjs');
const source = await readFile(path, 'utf8');
const before = `if (!app.includes("window.addEventListener('nur:open-prayer'")\n  || !app.includes('const pending = consumePendingNavigation()')\n  || !app.includes("setActiveTab('prayer')")) {\n  throw new Error('App does not handle live or queued prayer navigation from reminders.');\n}`;
const after = `if (!app.includes("window.addEventListener('nur:open-prayer'")\n  || !app.includes('const pending = consumePendingNavigation()')\n  || !app.includes("const openPrayerTracker = () => openRootTab('prayer')")\n  || !app.includes('resetBrowserRoot(buildNavigationSnapshot({')) {\n  throw new Error('App does not handle live or queued prayer navigation through the browser-aware root reset.');\n}`;

const first = source.indexOf(before);
if (first < 0) throw new Error('Prayer reminder guard source block was not found.');
if (source.indexOf(before, first + before.length) >= 0) throw new Error('Prayer reminder guard source block is not unique.');
await writeFile(path, source.slice(0, first) + after + source.slice(first + before.length));
console.log('Prayer reminder guard updated for browser-aware root navigation.');
