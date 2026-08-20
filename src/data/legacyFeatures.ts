/**
 * Metadata for the fifteen legacy feature screens.
 *
 * Split out of LegacyFeatureScreens so the hub tiles can be rendered without
 * pulling the screens themselves — and with them the quiz catalogue, the
 * prophets and the companion lists — into the initial bundle. The screens are
 * loaded when one is opened.
 *
 * `releaseStatus` is deliberately explicit. A feature is not public-release
 * ready merely because a screen exists. Religious/editorial content stays
 * gated until its source and expert review work is complete.
 */
import type { LucideIcon } from 'lucide-react';
import {
  BadgeDollarSign,
  BookOpenCheck,
  BrainCircuit,
  CalendarHeart,
  Globe2,
  HeartHandshake,
  Library,
  MapPinned,
  Milestone,
  MoonStar,
  Mountain,
  Radio,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { versionAppPath } from '../app/appPaths';

export type LegacyFeatureId =
  | 'fasting'
  | 'ummah'
  | 'hadith-library'
  | 'knowledge'
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

export type LegacyReleaseStatus = 'ready' | 'review-required' | 'later';

export type LegacyFeatureItem = {
  id: LegacyFeatureId;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  art: string;
  releaseStatus: LegacyReleaseStatus;
  releaseReason: string;
};

const VISUAL_VERSION = '20260808-release-hardening';
export const visual = (path: string) => versionAppPath(path, VISUAL_VERSION);

export const learningLegacyFeatures: LegacyFeatureItem[] = [
  { id: 'hadith-library', title: 'Hadith-Sammlung', subtitle: 'Quellen & Einordnung', description: 'Hadithe durchsuchen, lesen und lokal speichern.', icon: Library, art: '/premium-assets/high-res-objects/lantern-v2.webp', releaseStatus: 'review-required', releaseReason: 'Mehrere Belegstellen des Altbestands müssen noch einzeln präzisiert und fachlich geprüft werden.' },
  { id: 'knowledge', title: 'Wissensbibliothek', subtitle: 'Themen strukturiert lernen', description: 'Aqidah, Fiqh, Geschichte und Charakter in einem Bereich.', icon: BookOpenCheck, art: '/premium-assets/high-res-objects/quran-open-v2.webp', releaseStatus: 'review-required', releaseReason: 'Die Altbibliothek besitzt noch nicht für jeden Abschnitt einen belastbaren Einzelnachweis.' },
  { id: 'prophets', title: 'Propheten', subtitle: 'Geschichten & Lehren', description: 'Elf Propheten mit Einordnung, Kernpunkten und Lehren.', icon: Milestone, art: '/premium-assets/high-res-objects/mihrab-v2.webp', releaseStatus: 'review-required', releaseReason: 'Einordnung, Kernpunkte und Lehren müssen pro Eintrag fachlich und quellenbezogen geprüft werden.' },
  { id: 'sahabah', title: 'Die Gefährten', subtitle: 'Sahabah', description: 'Weggefährten des Propheten mit Ehrenname und Rolle.', icon: HeartHandshake, art: '/premium-assets/high-res-objects/lantern-v2.webp', releaseStatus: 'review-required', releaseReason: 'Biografische Angaben und Zuschreibungen benötigen eine abschließende Quellenprüfung.' },
  { id: 'women', title: 'Frauen im Islam', subtitle: 'Bedeutende Persönlichkeiten', description: 'Frauen, die die islamische Geschichte geprägt haben.', icon: Sparkles, art: '/premium-assets/high-res-objects/dua-hands-v2.webp', releaseStatus: 'review-required', releaseReason: 'Biografische Angaben und Zuschreibungen benötigen eine abschließende Quellenprüfung.' },
  { id: 'quiz', title: 'Islam-Quiz', subtitle: 'Wissen testen', description: 'Kurze Fragen, direkte Auswertung und lokaler Bestwert.', icon: BrainCircuit, art: '/premium-assets/high-res-objects/quran-closed-v2.webp', releaseStatus: 'review-required', releaseReason: 'Frage, richtige Antwort und Erklärung müssen gemeinsam einzeln belegt und geprüft werden.' },
  { id: 'hajj', title: 'Hajj & Umrah', subtitle: 'Ablauf verstehen', description: 'Stationen, Begriffe und Vorbereitung kompakt geordnet.', icon: Mountain, art: '/premium-assets/high-res-objects/kaaba-v2.webp', releaseStatus: 'review-required', releaseReason: 'Dieser Bereich enthält für die App neu verfasste Inhalte und ist deshalb vor Veröffentlichung besonders zu prüfen.' },
  { id: 'sunnah', title: 'Sunnah im Alltag', subtitle: 'Gute Gewohnheiten', description: 'Praktische, quellenorientierte Alltagserinnerungen.', icon: Sparkles, art: '/premium-assets/high-res-objects/sun-emblem-v2.webp', releaseStatus: 'review-required', releaseReason: 'Alltagsempfehlungen und ihre Belege benötigen eine abschließende fachliche Prüfung.' },
  { id: 'sins', title: 'Fehler & Reue', subtitle: 'Rückkehr zu Allah', description: 'Ein ruhiger Bereich zu Reue, Wiedergutmachung und Hoffnung.', icon: ShieldCheck, art: '/premium-assets/high-res-objects/dome-v2.webp', releaseStatus: 'review-required', releaseReason: 'Der sensible Bereich muss sprachlich, fachlich und quellenbezogen abschließend geprüft werden.' },
];

export const serviceLegacyFeatures: LegacyFeatureItem[] = [
  { id: 'fasting', title: 'Fasten-Assistent', subtitle: 'Freiwillige Fastentage', description: 'Montag, Donnerstag und berechnete weiße Tage mit echten lokalen Erinnerungen planen.', icon: MoonStar, art: '/premium-assets/high-res-objects/calendar-chip-v2.webp', releaseStatus: 'review-required', releaseReason: 'Die technische Planung funktioniert, religiöse Hinweise und Datumslogik benötigen vor Release die fachliche Endprüfung.' },
  { id: 'ummah', title: 'Ummah-Übersicht', subtitle: 'Muslime weltweit', description: 'Regionen, Orte und Gemeinschaften als Lernübersicht entdecken.', icon: Globe2, art: '/premium-assets/high-res-objects/dome-v2.webp', releaseStatus: 'later', releaseReason: 'Die bisherigen Zahlen sind undatiert bzw. nicht ausreichend belegt und gehören nicht in Release 1.' },
  { id: 'places', title: 'Islamische Orte', subtitle: 'Makkah, Madinah & Al-Aqsa', description: 'Bedeutende Orte mit kompakten Einführungen.', icon: MapPinned, art: '/premium-assets/high-res-objects/mosque-gold-v2.webp', releaseStatus: 'review-required', releaseReason: 'Historische und religiöse Einordnungen müssen vor Veröffentlichung einzeln geprüft werden.' },
  { id: 'jumuah', title: 'Jumuah', subtitle: 'Freitag vorbereiten', description: 'Eine lokal gespeicherte Checkliste für die Freitagsvorbereitung.', icon: CalendarHeart, art: '/premium-assets/high-res-objects/mihrab-arch-v2.webp', releaseStatus: 'review-required', releaseReason: 'Die Checkliste enthält religiöse Praxisangaben und benötigt die fachliche Endprüfung.' },
  { id: 'zakat', title: 'Zakat-Rechner', subtitle: 'Planungshilfe', description: 'Eine transparente 2,5%-Planungsrechnung für eine zuvor fachlich bestimmte Bemessungsgrundlage.', icon: BadgeDollarSign, art: '/premium-assets/high-res-objects/bookmark-v2.webp', releaseStatus: 'later', releaseReason: 'Zakat besitzt persönliche Voraussetzungen und Detailregeln; der Rechner ist für einen späteren, separat geprüften Release vorgesehen.' },
  { id: 'standby', title: 'Gebetsanzeige', subtitle: 'Standby-Modus', description: 'Ruhige Live-Ansicht für das nächste Gebet mit optionalem Vollbild.', icon: Radio, art: '/premium-assets/high-res-objects/qibla-compass-v2.webp', releaseStatus: 'later', releaseReason: 'Nützliche Zusatzfunktion, aber nicht notwendig für den ersten Release.' },
];

export function getLegacyFeature(featureId: LegacyFeatureId) {
  return [...learningLegacyFeatures, ...serviceLegacyFeatures].find((item) => item.id === featureId) ?? null;
}

export function isLegacyFeatureReleaseReady(featureId: LegacyFeatureId) {
  return getLegacyFeature(featureId)?.releaseStatus === 'ready';
}
