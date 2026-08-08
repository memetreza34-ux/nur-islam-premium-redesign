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
] = await Promise.all([
  read('src/App.tsx'),
  read('src/QuranScreen.tsx'),
  read('src/DhikrScreen.tsx'),
  read('src/QiblaScreen.tsx'),
  read('src/PrayerScreen.tsx'),
  read('src/CalendarScreen.tsx'),
  read('src/DuasScreen.tsx'),
  read('src/AssistantScreen.tsx'),
  read('src/MoreScreen.tsx'),
  read('src/MosqueScreen.tsx'),
  read('src/LearnScreen.tsx'),
  read('src/LegacyFeatureScreens.tsx'),
  read('src/styles/premium-typography-icon-lock.css'),
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

requireFragments(app, 'Home semantic cards', [
  "label: 'Quran lesen', eyebrow: 'Zuletzt gelesen', icon: BookOpen",
  "label: 'Beten lernen', eyebrow: 'Wudu, Qibla & Salah', icon: HandHeart",
  "label: '99 Namen Allahs', eyebrow: 'Heute entdecken', icon: Sparkles",
  "label: 'Islam Quiz', eyebrow: 'Wissen testen', icon: BrainCircuit",
  "label: 'Duas', eyebrow: 'Für jeden Moment', icon: BookHeart",
  "label: 'Nur Assistent', eyebrow: 'Lokaler Quellenmodus', icon: MessageCircleQuestion",
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

console.log('Reference icon map verified: primary navigation, Home actions and core controls are fixed, and all 13 additional features keep exact ID-to-icon pairs with uniform 1.75 rounded strokes.');
