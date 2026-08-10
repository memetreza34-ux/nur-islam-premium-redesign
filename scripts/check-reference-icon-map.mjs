import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [
  app,
  quran,
  dhikr,
  qibla,
  prayer,
  calendar,
  duas,
  assistant,
  more,
  mosque,
  learn,
  legacy,
  iconCss,
  finalLock,
  styleIndex,
] = await Promise.all([
  read('src/app/App.tsx'),
  read('src/screens/QuranScreen.tsx'),
  read('src/screens/DhikrScreen.tsx'),
  read('src/screens/QiblaScreen.tsx'),
  read('src/screens/PrayerScreen.tsx'),
  read('src/screens/CalendarScreen.tsx'),
  read('src/screens/DuasScreen.tsx'),
  read('src/screens/AssistantScreen.tsx'),
  read('src/screens/MoreScreen.tsx'),
  read('src/screens/MosqueScreen.tsx'),
  read('src/screens/LearnScreen.tsx'),
  read('src/screens/LegacyFeatureScreens.tsx'),
  read('src/styles/premium-typography-icon-lock.css'),
  read('src/styles/premium-reference-geometry-lock.css'),
  read('src/styles.css'),
]);

function requireFragments(source, label, fragments) {
  for (const fragment of fragments) {
    if (!source.includes(fragment)) throw new Error(`${label} icon mapping is missing: ${fragment}`);
  }
}

function featureObject(source, id) {
  const match = source.match(new RegExp(`\\{\\s*id:\\s*'${id}'[\\s\\S]*?\\}`));
  if (!match) throw new Error(`Legacy feature definition is missing: ${id}`);
  return match[0];
}

requireFragments(app, 'Primary navigation', [
  "{ id: 'home', label: 'Start', icon: Home }",
  "{ id: 'prayer', label: 'Gebete', icon: SunMedium }",
  "{ id: 'calendar', label: 'Kalender', icon: CalendarDays }",
  "{ id: 'learn', label: 'Islam verstehen', icon: BookOpen }",
  "{ id: 'profile', label: 'Mehr', icon: Menu }",
  '<BellRing size={20} />',
  "onNavigate('prayer')",
  '<Menu size={20} />',
  "onNavigate('profile')",
]);

// This file pins which icon belongs to which action. The eyebrow next to a
// label is supporting copy that design rewrites freely, so it is deliberately
// not part of the assertion: pinning it here broke the build on a wording
// change while the icon mapping was never in question.
for (const [label, icon] of [
  // The Home tiles moved off Lucide onto the app's own set: at 25px the generic
  // glyphs read as placeholder next to the rendered artwork on the same screen.
  ['Quran lesen', 'NurQuranIcon'],
  ['Beten lernen', 'NurMihrabIcon'],
  ['99 Namen Allahs', 'NurRosetteIcon'],
  ['Islam Quiz', 'NurQuizIcon'],
  ['Duas', 'NurDuaIcon'],
  ['Nur Assistent', 'NurAssistantIcon'],
]) {
  const pairing = new RegExp(`label: '${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[^}]*icon: ${icon}\\b`);
  if (!pairing.test(app)) {
    throw new Error(`Home semantic cards icon mapping is missing: ${label} -> ${icon}`);
  }
}

requireFragments(app, 'Home semantic cards', [
  '<MapPin size={22} />',
  '<Globe2 size={22} />',
]);

requireFragments(quran, 'Quran header', [
  'aria-label="Lieblingssuren"',
  '<Heart size={20} />',
]);

requireFragments(dhikr, 'Dhikr header', [
  'aria-label="Heutige Statistik öffnen"',
  '<BarChart3 size={20} />',
]);

requireFragments(qibla, 'Qibla controls', [
  'aria-label="Kompass-Einstellungen öffnen"',
  '<Settings size={20} />',
  '<MapPin size={20} />',
  'aria-label="Standort aktualisieren"',
  '<LocateFixed size={18} />',
]);

requireFragments(prayer, 'Prayer controls', [
  'aria-label="Gebetszeiten aktualisieren"',
  '<RefreshCw size={20}',
  '<Navigation size={20} />',
  '<LocateFixed size={16} />',
  '<Settings2 size={15} /> Berechnung',
]);

requireFragments(calendar, 'Calendar controls', [
  'aria-label="Termin hinzufügen"',
  '<Plus size={20} />',
  '<CalendarDays size={24} />',
]);

requireFragments(duas, 'Dua controls', [
  'aria-label="Favoriten anzeigen"',
  '<Heart size={20} />',
  '<Search size={18} />',
  '<Filter size={17} />',
]);

requireFragments(assistant, 'Assistant header', [
  'aria-label="Informationen zum Quellenmodus"',
  '<ShieldCheck size={20} />',
]);

requireFragments(more, 'More / Profile header', [
  'aria-label="Einstellungen"',
  '<Settings2 size={20} />',
]);

requireFragments(mosque, 'Mosque controls', [
  'aria-label="Moscheen aktualisieren"',
  '<RefreshCw size={20}',
  '<LocateFixed size={16} /> Eigenen Standort verwenden',
  '<MapPin size={20} />',
  '<Map size={16} /> Karte',
]);

requireFragments(learn, 'Learning controls', [
  'aria-label="Lernplan öffnen"',
  '<Settings size={20} />',
  '<GraduationCap size={18} />',
  '<Droplets size={22} />',
  '<Compass size={22} />',
]);

const legacyIconMap = {
  'hadith-library': 'Library',
  knowledge: 'BookOpenCheck',
  prophets: 'Milestone',
  quiz: 'BrainCircuit',
  hajj: 'Mountain',
  sunnah: 'Sparkles',
  sins: 'ShieldCheck',
  fasting: 'MoonStar',
  ummah: 'Globe2',
  places: 'MapPinned',
  jumuah: 'CalendarHeart',
  zakat: 'BadgeDollarSign',
  standby: 'Radio',
};
for (const [id, icon] of Object.entries(legacyIconMap)) {
  const definition = featureObject(legacy, id);
  if (!definition.includes(`icon: ${icon}`)) {
    throw new Error(`Legacy feature ${id} must keep semantic icon ${icon}.`);
  }
}

for (const requirement of [
  'stroke-width: 1.75',
  'stroke-linecap: round',
  'stroke-linejoin: round',
]) {
  if (!iconCss.includes(requirement)) throw new Error(`Reference icon styling is missing: ${requirement}`);
}
for (const requirement of [
  ':where(svg.lucide)',
  'stroke-width: 1.75 !important',
  'stroke-linecap: round !important',
  'stroke-linejoin: round !important',
]) {
  if (!finalLock.includes(requirement)) throw new Error(`Final reference icon lock is missing: ${requirement}`);
}
const importedLayers = [...styleIndex.matchAll(/@import '\.\/styles\/([^']+)';/g)]
  .map((match) => match[1]);
if (importedLayers.at(-1) !== 'premium-reference-geometry-lock.css') {
  throw new Error('The final 1.75 Lucide lock must remain the last stylesheet import.');
}

console.log('Reference icon map verified: primary navigation, honest Home actions and core controls are fixed, all 13 additional features keep exact ID-to-icon pairs, and the final stylesheet enforces uniform 1.75 rounded Lucide strokes.');
