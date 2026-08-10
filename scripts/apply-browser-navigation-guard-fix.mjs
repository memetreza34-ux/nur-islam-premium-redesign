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

const functionalPath = resolve(process.cwd(), 'scripts/check-functional-hardening.mjs');
let functionalSource = await readFile(functionalPath, 'utf8');
functionalSource = replaceOnce(
  functionalSource,
  `  'onOpenHadith={openSavedHadith}',\n  "const readerParent: Tab = activeTab === 'home' ? 'quran' : activeTab",`,
  `  'onOpenHadith={openSavedHadith}',\n  "activeTab: 'quran'",\n  "activeTab: 'reader' as const",\n  'pushBrowserNavigation(quranSnapshot)',\n  'pushBrowserNavigation(readerSnapshot)',\n  "window.addEventListener('popstate'",\n  'window.history.back()',`,
  'Functional browser navigation guard',
);
functionalSource = functionalSource.replace(
  "Functional hardening verified: Home and Quran use real persisted progress only, the focused Ayah is honestly labelled, daily and legacy Hadith experiences share one source-labelled library and bookmark migration, empty Dua favorites stay empty, saved-content routing is exact, Assistant message identity is stable, Quran reader progress is validated before persistence, Dhikr day rollover is coherent, Qibla sensor/listener cleanup is protected, reminders remain real, mosque URLs are safe, cloud deletion signs out locally, cloud backup excludes device-local state, note failures remain visible, and PWA install actions cannot remain dead.",
  "Functional hardening verified: Home and Quran use real persisted progress only, Home-to-Reader preserves its Quran parent in browser/system history, the focused Ayah is honestly labelled, daily and legacy Hadith experiences share one source-labelled library and bookmark migration, empty Dua favorites stay empty, saved-content routing is exact, Assistant message identity is stable, Quran reader progress is validated before persistence, Dhikr day rollover is coherent, Qibla sensor/listener cleanup is protected, reminders remain real, mosque URLs are safe, cloud deletion signs out locally, cloud backup excludes device-local state, note failures remain visible, and PWA install actions cannot remain dead.",
);
await writeFile(functionalPath, functionalSource);

console.log('Prayer, calendar release and functional guards updated for browser-aware navigation.');
