import type { PremiumWidgetId } from './premiumLocalService';

export const WIDGET_ACTIONS = {
  prayer: { label: 'Gebetszeiten öffnen', destination: 'prayer' },
  quran: { label: 'An meiner Lesestelle weiterlesen', destination: 'reader' },
  dhikr: { label: 'Dhikr zählen', destination: 'dhikr' },
  qibla: { label: 'Qibla bestimmen', destination: 'qibla' },
  'islamic-date': { label: 'Kalender öffnen', destination: 'calendar' },
  'daily-inspiration': { label: 'Ayah im Quran lesen', destination: 'reader' },
  routine: { label: 'Meine Routine öffnen', destination: 'routines' },
  'quran-plan': { label: 'Leseplan öffnen', destination: 'quran' },
  'weekly-prayers': { label: 'Gebetswoche auswerten', destination: 'stats' },
  favorites: { label: 'Gespeicherte Inhalte öffnen', destination: 'collections' },
  reminders: { label: 'Erinnerungen verwalten', destination: 'design' },
  friday: { label: 'Freitagsvorbereitung öffnen', destination: 'legacy:jumuah' },
} as const satisfies Record<PremiumWidgetId, { label: string; destination: string }>;

export function isWidgetId(value: unknown): value is PremiumWidgetId {
  return typeof value === 'string' && Object.hasOwn(WIDGET_ACTIONS, value);
}
