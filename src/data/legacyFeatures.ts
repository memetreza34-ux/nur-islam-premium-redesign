/**
 * Navigation metadata for the active legacy features.
 *
 * Split out of LegacyFeatureScreens so the hub tiles can be rendered without
 * pulling the screens themselves — and with them the quiz catalogue, the
 * prophets and the companion lists — into the initial bundle. The screens are
 * loaded when one is opened.
 */
import type { LucideIcon } from 'lucide-react';
import {
  BadgeDollarSign,
  Bookmark,
  CalendarHeart,
  Clock3,
  CircleHelp,
  Globe2,
  Library,
  MapPinned,
  MoonStar,
  Route,
  Scale,
  ScrollText,
  ShieldCheck,
} from 'lucide-react';
import { versionAppPath } from '../app/appPaths';

export type LegacyFeatureId =
  | 'fasting'
  | 'ummah'
  | 'hadith-library'
  | 'knowledge'
  | 'madhhabs'
  | 'prophets'
  | 'quiz'
  | 'sahabah'
  | 'women'
  | 'hajj'
  | 'sunnah'
  | 'sins'
  | 'places'
  | 'jumuah'
  | 'zakat'
  | 'standby';

export type LegacyFeatureItem = {
  id: LegacyFeatureId;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  art: string;
};

const VISUAL_VERSION = '20260826-original-art';
export const visual = (path: string) => versionAppPath(path, VISUAL_VERSION);

// Reachable from Start without adding another tile to the learning directory.
export const quizFeature: LegacyFeatureItem = {
  id: 'quiz',
  title: 'Islam Quiz',
  subtitle: 'Wissen testen',
  description: 'Wähle ein Thema und überprüfe dein Wissen mit Fragen und Erklärungen.',
  icon: CircleHelp,
  art: '/premium-assets/high-res-objects/mini-quiz-v1.webp',
};

export const learningLegacyFeatures: LegacyFeatureItem[] = [
  { id: 'hadith-library', title: 'Hadith-Sammlung', subtitle: 'Quellen & Einordnung', description: 'Begriff · Fundstelle · Hadithe lesen und speichern', icon: Library, art: '/premium-assets/high-res-objects/learning-hadith-v2.webp' },
  { id: 'madhhabs', title: 'Die vier Rechtsschulen', subtitle: 'Fiqh richtig einordnen', description: 'Hanafi, Maliki, Schafiʿi und Hanbali mit Geschichte, Methodik und geprüften Fachlinks.', icon: Scale, art: '/premium-assets/high-res-objects/learning-madhhabs-v2.webp' },
  { id: 'prophets', title: 'Die 25 Propheten', subtitle: '25 eigenständige Quran-Kurse', description: 'Jeder Prophet mit Kursplan, wichtigen Ereignissen, klaren Lehren und genauen Quran-Stellen.', icon: ScrollText, art: '/premium-assets/high-res-objects/learning-prophets-v2.webp' },
  { id: 'hajj', title: 'Hajj & Umrah', subtitle: 'Ablauf verstehen', description: 'Begriffe · Vorbereitung · Stationen', icon: Route, art: '/premium-assets/high-res-objects/kaaba-v2.webp' },
  { id: 'sunnah', title: 'Sunnah im Alltag', subtitle: 'Gute Gewohnheiten', description: 'Vorbild · Gewohnheiten · Beispiele', icon: Bookmark, art: '/premium-assets/high-res-objects/learning-sunnah-v2.webp' },
  { id: 'sins', title: 'Fehler & Reue', subtitle: 'Rückkehr zu Allah', description: 'Hoffnung · Tawbah · Wiedergutmachung', icon: ShieldCheck, art: '/premium-assets/high-res-objects/learning-repentance-v2.webp' },
];

export const serviceLegacyFeatures: LegacyFeatureItem[] = [
  // calendar-chip is a compact UI graphic and looked tiny/soft when enlarged
  // as hero artwork. Use a real decorative asset at the size this layout needs.
  { id: 'fasting', title: 'Fastenplan', subtitle: 'Freiwillige Fastentage', description: 'Montag, Donnerstag und berechnete weiße Tage mit echten lokalen Erinnerungen planen.', icon: MoonStar, art: '/premium-assets/high-res-objects/lantern-v3.webp' },
  { id: 'ummah', title: 'Ummah-Übersicht', subtitle: 'Muslime weltweit', description: 'Regionen, Orte und Gemeinschaften als Lernübersicht entdecken.', icon: Globe2, art: '/premium-assets/high-res-objects/dome-v2.webp' },
  // The raster copy is truncated; use the intact scalable mosque artwork with
  // the same subject instead of substituting an unrelated dome photograph.
  { id: 'places', title: 'Islamische Orte', subtitle: 'Makkah, Madinah & Al-Aqsa', description: 'Bedeutende Orte mit kompakten Einführungen.', icon: MapPinned, art: '/premium-assets/high-res-objects/mosque-heritage-v1.webp' },
  { id: 'jumuah', title: 'Jumuah', subtitle: 'Das Freitagsgebet', description: 'Bedeutung, Ablauf und Vorbereitung des gemeinschaftlichen Gebets am Freitag.', icon: CalendarHeart, art: '/premium-assets/high-res-objects/mihrab-arch-v2.webp' },
  { id: 'zakat', title: 'Zakat-Rechner', subtitle: 'Planungshilfe', description: 'Eine transparente 2,5%-Planungsrechnung für eine zuvor fachlich bestimmte Bemessungsgrundlage.', icon: BadgeDollarSign, art: '/premium-assets/high-res-objects/zakat-scale-v1.webp' },
  { id: 'standby', title: 'Gebetsanzeige', subtitle: 'Standby-Modus', description: 'Ruhige Live-Ansicht für das nächste Gebet mit optionalem Vollbild.', icon: Clock3, art: '/premium-assets/high-res-objects/prayer-standby-v1.webp' },
];
