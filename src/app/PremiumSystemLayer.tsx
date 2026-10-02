import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BarChart3,
  Bell,
  BellRing,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Crown,
  Compass,
  FolderHeart,
  Heart,
  LayoutDashboard,
  ListChecks,
  MoonStar,
  NotebookPen,
  Palette,
  Plus,
  Quote,
  CircleDot,
  Target,
  Trash2,
  X,
} from 'lucide-react';
import { fetchSurahs } from '../services/quranService';
import { getHijriLabel } from '../services/hijriCalendar';
import { readDhikrTotalToday } from '../services/dhikrDailyState';
import { useDialog } from '../shared/useDialog';
import { applyHomePreferences } from '../services/homeLayout';
import { formatPrayerRemaining, getNextPrayer, PRAYER_SCHEDULE, PRAYER_SCHEDULE_META } from '../services/prayerSchedule';
import { PRAYER_BACKDROPS } from '../shared/prayerBackdrops';
import { WIDGET_ACTIONS } from '../services/widgetActions';
import { WidgetPreviewValue } from './WidgetPreviewValue';
import { QiblaWidgetPreview, getQiblaWidgetReading } from './QiblaWidgetPreview';
import { versionAppPath } from './appPaths';
import { loadPrayerLocation } from '../services/prayerTimesService';
import {
  PREMIUM_HOME_SECTIONS,
  FREE_WIDGETS,
  SUBSCRIPTION_WIDGETS,
  applyPremiumAccent,
  capturePremiumDailySnapshot,
  createPremiumFolder,
  createPremiumReminder,
  createPremiumRoutine,
  deletePremiumFolder,
  deletePremiumJournalNote,
  deletePremiumReminder,
  deletePremiumRoutine,
  getDuePremiumReminders,
  getLocalDateKey,
  readPremiumFavoriteRefs,
  readPremiumCollectionCount,
  readPremiumFolders,
  readPremiumJournal,
  readPremiumReminders,
  readPremiumRoutines,
  readPremiumSettings,
  readPremiumStats,
  readQuranLastRead,
  readQuranPlan,
  readRoutineCompletion,
  savePremiumJournalNote,
  toggleRoutineItem,
  updatePremiumFolder,
  updatePremiumReminder,
  writePremiumSettings,
  writeQuranPlan,
} from '../services/premiumLocalService';
import type {
  PremiumAccent,
  PremiumHomeSection,
  PremiumSettings,
  PremiumWidgetId,
} from '../services/premiumLocalService';

type PremiumTab = 'overview' | 'quran' | 'routines' | 'home' | 'stats' | 'organize' | 'design';

const tabItems: Array<{ id: PremiumTab; label: string }> = [
  { id: 'overview', label: 'Übersicht' },
  { id: 'quran', label: 'Quran-Plan' },
  { id: 'routines', label: 'Routinen' },
  { id: 'home', label: 'Home' },
  { id: 'stats', label: 'Statistik' },
  { id: 'organize', label: 'Ordnen' },
  { id: 'design', label: 'Design' },
];

const sectionLabels: Record<PremiumHomeSection, string> = {
  journey: 'Tägliche Begleiter',
  discover: 'Entdecken',
  continue: 'Quran weiterlesen',
  inspiration: 'Ayah & Hadith',
  recommendations: 'Empfehlungen',
};

const widgetLabels: Record<PremiumWidgetId, string> = {
  prayer: 'Nächstes Gebet',
  quran: 'Quran weiterlesen',
  dhikr: 'Dhikr heute',
  qibla: 'Qibla-Kompass',
  'islamic-date': 'Islamisches Datum',
  'daily-inspiration': 'Tagesimpuls',
  routine: 'Tagesroutine',
  'quran-plan': 'Quran-Plan',
  'weekly-prayers': 'Gebetswoche',
  favorites: 'Meine Sammlung',
  reminders: 'Erinnerungen',
  friday: 'Freitag vorbereiten',
};

const widgetDescriptions: Record<PremiumWidgetId, string> = {
  prayer: 'Zeit bis zum nächsten Gebet',
  quran: 'Direkt an der letzten Ayah fortsetzen',
  dhikr: 'Heutigen Zählerstand sehen',
  qibla: 'Kompass schnell öffnen',
  'islamic-date': 'Hijri-Datum für heute',
  'daily-inspiration': 'Eine kurze Ayah zum Innehalten',
  routine: 'Eigene Tagesabläufe verfolgen',
  'quran-plan': 'Khatm-Ziel und Lesetempo',
  'weekly-prayers': 'Sieben Tage im Überblick',
  favorites: 'Gespeicherte Inhalte zählen',
  reminders: 'Aktive Erinnerungen im Blick',
  friday: 'Vorbereitung auf Jumuah',
};


const widgetStories: Record<PremiumWidgetId, { title: string; benefit: string; features: string; moment: string }> = {
  prayer: { title: 'Dein Tag. Deine Gebetszeiten.', benefit: 'Plane deine Pause rechtzeitig: Uhrzeit, nächstes Gebet und verbleibende Zeit stehen direkt beieinander.', features: 'Alle fünf Gebetszeiten mit dem passenden Tagesmotiv.', moment: 'Hilfreich vor der Arbeit, zwischen Terminen und unterwegs.' },
  quran: { title: 'Dort weiterlesen, wo du warst.', benefit: 'Deine letzte Sure und Ayah bleiben griffbereit. So wird auch eine kurze Pause zu einer Gelegenheit zum Lesen.', features: 'Gespeicherte Lesestelle mit direktem Wiedereinstieg.', moment: 'Für ein paar ruhige Minuten am Morgen oder am Abend.' },
  dhikr: { title: 'Ein kleiner Moment des Gedenkens.', benefit: 'Deine heutigen Wiederholungen bleiben im Blick. Du kannst über den Zähler jederzeit anknüpfen.', features: 'Heutiger Zählerstand aus deinen gespeicherten Einträgen.', moment: 'Für kurze Pausen und deine Morgen- oder Abendroutine.' },
  qibla: { title: 'Deine Richtung zur Kaaba.', benefit: 'Zu Hause oder unterwegs: Sieh die Qibla-Richtung und die Entfernung für deinen gespeicherten Standort auf einen Blick.', features: 'Die goldene Spitze weist zur Kaaba. Norden bleibt in dieser Vorschau oben.', moment: 'Zum Ausrichten den Kompass öffnen, den Standort prüfen und den Live-Kompass starten.' },
  'islamic-date': { title: 'Beide Kalender im Blick.', benefit: 'Ordne den heutigen Tag im islamischen Kalender ein und behalte gleichzeitig das gewohnte Datum zur Orientierung.', features: 'Heutiges Hijri-Datum und Wochentag in einer Ansicht.', moment: 'Für deine tägliche Orientierung im islamischen Monat.' },
  'daily-inspiration': { title: 'Ein Gedanke, der dich begleitet.', benefit: 'Eine kurze Ayah lädt dich ein, im Alltag innezuhalten. Ihre Bedeutung und Fundstelle bleiben zusammen sichtbar.', features: 'Arabischer Text, deutsche Bedeutung und Quran-Stelle.', moment: 'Als ruhiger Impuls beim Start in deinen Tag.' },
  routine: { title: 'Gute Gewohnheiten bekommen Platz.', benefit: 'Deine selbst gewählte Routine zeigt dir, welche Schritte heute schon erledigt sind und was noch offen ist.', features: 'Eigene Schritte und der dazugehörige Tagesfortschritt.', moment: 'Für einen regelmäßigen Ablauf, der zu deinem Alltag passt.' },
  'quran-plan': { title: 'Regelmäßig lesen, im eigenen Tempo.', benefit: 'Dein Leseziel und deine letzte Lesestelle bleiben beieinander. So kannst du deine nächste Lesung bewusst einplanen.', features: 'Persönlicher Khatm-Zeitraum und gespeicherte Leseposition.', moment: 'Hilfreich, wenn du dir täglich Zeit für den Quran nehmen möchtest.' },
  'weekly-prayers': { title: 'Deine Woche wird sichtbar.', benefit: 'Erkenne, welche Gebete du in den letzten sieben Tagen eingetragen hast, und schau in Ruhe auf deine Woche zurück.', features: 'Sieben Tageswerte aus deinem Gebetstracker.', moment: 'Für deinen persönlichen Wochenrückblick.' },
  favorites: { title: 'Was dir wichtig ist, bleibt nah.', benefit: 'Deine gespeicherten Inhalte sind gesammelt erreichbar. Finde eine Ayah oder Dua wieder, die du erneut lesen möchtest.', features: 'Anzahl und Auswahl deiner gespeicherten Favoriten.', moment: 'Wenn du etwas nachlesen oder einen Gedanken wieder aufnehmen willst.' },
  reminders: { title: 'Zeit für das, was dir wichtig ist.', benefit: 'Behalte deine eingerichteten Erinnerungen und Uhrzeiten im Blick und plane dafür einen passenden Moment ein.', features: 'Aktive Erinnerungen mit ihren eigenen Bezeichnungen und Zeiten.', moment: 'Für geplante Lesezeiten und wiederkehrende Routinen.' },
  friday: { title: 'Mit Ruhe in den Freitag.', benefit: 'Sieh, wie weit der nächste Freitag entfernt ist, und öffne deine Vorbereitung rechtzeitig.', features: 'Tage bis Freitag und Zugang zur Jumuah-Checkliste.', moment: 'Für die Vorbereitung am Donnerstagabend oder Freitagmorgen.' },
};

const widgetIcons = {
  prayer: MoonStar,
  quran: BookOpen,
  dhikr: CircleDot,
  qibla: Compass,
  'islamic-date': CalendarDays,
  'daily-inspiration': Quote,
  routine: ListChecks,
  'quran-plan': Target,
  'weekly-prayers': BarChart3,
  favorites: Heart,
  reminders: Bell,
  friday: CalendarDays,
} satisfies Record<PremiumWidgetId, typeof MoonStar>;

const widgetArtwork: Record<PremiumWidgetId, { src: string; alt: string }> = {
  prayer: { src: '/premium-assets/high-res-objects/home-learn-prayer-v2.webp', alt: 'Grüner Gebetsteppich' },
  quran: { src: '/premium-assets/high-res-objects/home-quran-illustrated-v1.webp', alt: 'Quran auf einem Rehal' },
  dhikr: { src: '/premium-assets/high-res-objects/home-dhikr-illustrated-v1.webp', alt: 'Gebetskette' },
  qibla: { src: '/premium-assets/high-res-objects/home-qibla-illustrated-v1.webp', alt: 'Qibla-Kompass' },
  'islamic-date': { src: '/premium-assets/high-res-objects/widget-date-illustrated-v1.webp', alt: 'Kalender ohne festes Datum' },
  'daily-inspiration': { src: '/premium-assets/high-res-objects/widget-inspiration-illustrated-v1.webp', alt: 'Karte mit Lesezeichen' },
  routine: { src: '/premium-assets/high-res-objects/widget-routine-illustrated-v1.webp', alt: 'Karten für die Tagesroutine' },
  'quran-plan': { src: '/premium-assets/high-res-objects/widget-quran-plan-illustrated-v1.webp', alt: 'Quran mit Leseplan' },
  'weekly-prayers': { src: '/premium-assets/high-res-objects/widget-weekly-prayers-illustrated-v1.webp', alt: 'Gebetsteppich mit Wochenplan' },
  favorites: { src: '/premium-assets/high-res-objects/widget-favorites-illustrated-v1.webp', alt: 'Gesammelte Lesekarten' },
  reminders: { src: '/premium-assets/high-res-objects/widget-reminders-illustrated-v1.webp', alt: 'Glocke und Erinnerungskarte' },
  friday: { src: '/premium-assets/high-res-objects/widget-friday-illustrated-v1.webp', alt: 'Gebetsnische und Teppich für Jumuah' },
};

const widgetArtUrl = (id: PremiumWidgetId) => versionAppPath(widgetArtwork[id].src, '20260929-widget-art-v2');

function daysUntilFriday(date = new Date()) {
  return (5 - date.getDay() + 7) % 7;
}

const accentLabels: Record<PremiumAccent, string> = {
  classic: 'Nur Klassik',
  sapphire: 'Saphir',
  plum: 'Pflaume',
  sand: 'Sand',
};

type WidgetView = { eyebrow: string; value: string; detail: string };

function readWidgetView(id: PremiumWidgetId, now = new Date()): WidgetView {
  const nextPrayer = getNextPrayer(now);
  const plan = readQuranPlan();
  const lastRead = readQuranLastRead();
  const routines = readPremiumRoutines();
  const firstRoutine = routines[0];
  const completion = readRoutineCompletion();
  const routineDone = firstRoutine ? new Set(completion[firstRoutine.id] ?? []).size : 0;
  const fridayDistance = daysUntilFriday(now);

  if (id === 'prayer' && nextPrayer) return { eyebrow: PRAYER_SCHEDULE_META.city, value: `${nextPrayer.prayer.label} · ${nextPrayer.prayer.time}`, detail: `${nextPrayer.tomorrow ? 'morgen ' : ''}in ${formatPrayerRemaining(nextPrayer.remaining)}` };
  if (id === 'quran') return { eyebrow: 'Zuletzt gelesen', value: `Sure ${lastRead.surahNumber} · Ayah ${lastRead.ayahNumber}`, detail: 'Weiterlesen' };
  if (id === 'dhikr') return { eyebrow: 'Heute gezählt', value: `${readDhikrTotalToday(now)} Dhikr`, detail: 'lokal gespeichert' };
  if (id === 'qibla') {
    const location = loadPrayerLocation();
    const reading = getQiblaWidgetReading(location);
    return { eyebrow: location.label, value: reading.distance < 1 ? 'Nahe der Kaaba' : `${Math.round(reading.bearing)}° · ${reading.direction}`, detail: `${reading.source} · Kompass öffnen` };
  }
  if (id === 'islamic-date') return { eyebrow: 'Heute', value: getHijriLabel(now, 'Islamisches Datum', PRAYER_SCHEDULE_META.timezone), detail: 'Hijri-Kalender' };
  if (id === 'daily-inspiration') return { eyebrow: 'Ayah im Fokus', value: '„Allah ist Einer.“', detail: 'Al-Ikhlas · 112:1' };
  if (id === 'routine') return { eyebrow: firstRoutine?.name ?? 'Tagesroutine', value: firstRoutine ? `${routineDone}/${firstRoutine.items.length} erledigt` : 'Noch keine Routine', detail: firstRoutine ? 'heutiger Fortschritt' : 'Routine erstellen' };
  if (id === 'quran-plan') return { eyebrow: plan.enabled ? `Khatm-Ziel · ${plan.targetDays} Tage` : 'Quran-Plan', value: plan.enabled ? `Sure ${lastRead.surahNumber} · Ayah ${lastRead.ayahNumber}` : 'Lesetempo festlegen', detail: plan.enabled ? 'Plan aktiv' : 'Jetzt planen' };
  if (id === 'weekly-prayers') return { eyebrow: 'Letzte 7 Tage', value: `${readPremiumStats(7).reduce((sum, day) => sum + day.prayers, 0)} von 35 Gebeten`, detail: 'Wochenübersicht' };
  if (id === 'favorites') return { eyebrow: 'Meine Sammlung', value: `${readPremiumCollectionCount()} gespeicherte Inhalte`, detail: 'Sammlung öffnen' };
  if (id === 'reminders') { const count = readPremiumReminders().filter((reminder) => reminder.enabled).length; return { eyebrow: 'Erinnerungen', value: `${count} aktiv`, detail: count ? 'Zeiten verwalten' : 'Erste anlegen' }; }
  if (id === 'friday') return { eyebrow: 'Jumuah', value: fridayDistance === 0 ? 'Heute ist Freitag' : `Noch ${fridayDistance} ${fridayDistance === 1 ? 'Tag' : 'Tage'}`, detail: 'Vorbereitung ansehen' };
  return { eyebrow: widgetLabels[id], value: widgetDescriptions[id], detail: 'Direkt öffnen' };
}

function PremiumHomeWidgets({ onCustomize, onPreview }: { onCustomize: () => void; onPreview: (id: PremiumWidgetId) => void }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const sync = () => setTick((value) => value + 1);
    const timer = window.setInterval(sync, 30000);
    window.addEventListener('nur:premium-data-changed', sync);
    window.addEventListener('focus', sync);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('nur:premium-data-changed', sync);
      window.removeEventListener('focus', sync);
    };
  }, []);

  const settings = useMemo(() => readPremiumSettings(), [tick]);
  if (settings.widgets.length === 0) return null;

  const renderWidget = (id: PremiumWidgetId) => {
    if (!settings.widgets.includes(id)) return null;
    const Icon = widgetIcons[id];
    const view = readWidgetView(id);
    return <button key={id} onClick={() => onPreview(id)} className="premium-local-widget" data-widget={id}><Icon size={17} aria-hidden="true" /><img className="premium-local-widget__art" src={widgetArtUrl(id)} alt="" loading="lazy" aria-hidden="true" /><span><small>{view.eyebrow}</small><strong>{view.value}</strong><em>{view.detail}</em></span></button>;
  };

  const freeWidgets = FREE_WIDGETS.map(renderWidget).filter(Boolean);
  const subscriptionWidgets = SUBSCRIPTION_WIDGETS.map(renderWidget).filter(Boolean);

  return (
    <section className="premium-local-widgets" aria-label="Deine Widgets">
      <div className="premium-local-widgets__heading">
        <div><span><LayoutDashboard size={15} /> DEINE WIDGETS</span><h2>Dein Tag im Blick</h2></div>
        <button onClick={onCustomize}>Anpassen</button>
      </div>
      {freeWidgets.length ? <div className="premium-local-widget-group"><div><strong>Immer dabei</strong><small>Kostenlos</small></div><div className="premium-local-widgets__grid">{freeWidgets}</div></div> : null}
      {subscriptionWidgets.length ? <div className="premium-local-widget-group is-subscription"><div><strong><Crown size={13} /> Persönlich planen</strong><small>Im Abo · 0,99 € / Monat geplant</small></div><div className="premium-local-widgets__grid">{subscriptionWidgets}</div></div> : null}
    </section>
  );
}

function OverviewPanel({ onTab }: { onTab: (tab: PremiumTab) => void }) {
  const [purchaseReady, setPurchaseReady] = useState(false);
  const features: Array<[PremiumTab, string, string]> = [
    ['quran', 'Persönlicher Quran-Plan', 'Khatm-Ziele und tägliche Portion lokal berechnen.'],
    ['routines', 'Eigene Routinen', 'Morgen-, Abend- und Lernroutinen selbst zusammenstellen.'],
    ['home', 'Widgets & persönlicher Home', 'In-App-Widgets wählen, Bereiche ausblenden und sortieren.'],
    ['stats', 'Detaillierte Statistiken', 'Gebete, Dhikr, Quran-Aktivität und Routinen auswerten.'],
    ['organize', 'Ordner & privates Journal', 'Favoriten strukturieren und private lokale Notizen führen.'],
    ['design', 'Design & Erinnerungen', 'Premium-Akzente und eigene lokale Erinnerungen einstellen.'],
  ];
  return (
    <div className="premium-local-panel-stack">
      <section className="premium-local-hero-card">
        <span className="premium-local-kicker"><Crown size={15} /> Nur Islam Premium</span>
        <h2>Ein günstiges Komfort-Paket ohne KI-Kosten.</h2>
        <p>Alle Funktionen in dieser Version arbeiten lokal auf deinem Gerät. Das geplante Abo liegt bei 0,99 € pro Monat; die Bezahlprüfung wird erst mit einem echten Store-/Web-Abo verbunden.</p>
        <div className="premium-local-price"><strong>0,99 €</strong><span>/ Monat geplant</span></div>
        <button className="premium-local-primary" onClick={() => setPurchaseReady(true)}><Crown size={16} /> Abo für 0,99 € auswählen</button>
        {purchaseReady ? <p className="premium-local-notice">Die Kaufansicht ist vorbereitet. In der veröffentlichten App öffnet dieser Knopf den sicheren App-Store-Checkout.</p> : null}
      </section>
      <div className="premium-local-feature-grid">
        {features.map(([tab, title, description]) => (
          <button key={title} onClick={() => onTab(tab)}><Check size={17} /><span><strong>{title}</strong><small>{description}</small></span></button>
        ))}
      </div>
      <p className="premium-local-notice">Quran, Gebetszeiten, Qibla, Duas und die religiösen Grundfunktionen bleiben außerhalb dieses Komfort-Pakets nutzbar.</p>
    </div>
  );
}

function QuranPlanPanel({ refresh }: { refresh: () => void }) {
  const [surahs, setSurahs] = useState<Array<{ number: number; numberOfAyahs: number; englishName: string }>>([]);
  const [plan, setPlan] = useState(readQuranPlan);
  const lastRead = readQuranLastRead();

  useEffect(() => {
    let active = true;
    void fetchSurahs().then((items) => {
      if (active) setSurahs(items.map((item) => ({ number: item.number, numberOfAyahs: item.numberOfAyahs, englishName: item.englishName })));
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const totalAyahs = surahs.reduce((sum, surah) => sum + surah.numberOfAyahs, 0);
  const before = surahs.filter((surah) => surah.number < lastRead.surahNumber).reduce((sum, surah) => sum + surah.numberOfAyahs, 0);
  const currentMeta = surahs.find((surah) => surah.number === lastRead.surahNumber);
  const currentPosition = before + Math.min(lastRead.ayahNumber, currentMeta?.numberOfAyahs ?? lastRead.ayahNumber);
  const percent = totalAyahs ? Math.min(100, Math.max(0, Math.round((currentPosition / totalAyahs) * 100))) : 0;
  const start = new Date(plan.startedAt);
  const elapsed = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
  const daysLeft = Math.max(1, plan.targetDays - elapsed);
  const remaining = Math.max(0, totalAyahs - currentPosition);
  const dailyAyahs = totalAyahs ? Math.ceil(remaining / daysLeft) : null;
  const targetDate = new Date(start);
  targetDate.setDate(targetDate.getDate() + plan.targetDays);

  const save = (next: typeof plan) => {
    setPlan(next);
    writeQuranPlan(next);
    refresh();
  };

  return (
    <div className="premium-local-panel-stack">
      <section className="premium-local-card">
        <span className="premium-local-kicker"><Target size={15} /> Persönlicher Quran-Plan</span>
        <h2>Khatm-Ziel festlegen</h2>
        <p>Die tägliche Portion wird aus deinem gespeicherten Lesestand und den Surah-Metadaten berechnet. Keine KI und kein Server nötig.</p>
        <div className="premium-local-choice-row">
          {[30, 60, 90].map((days) => <button key={days} className={plan.targetDays === days ? 'is-active' : ''} onClick={() => save({ ...plan, enabled: true, targetDays: days, startedAt: plan.enabled ? plan.startedAt : new Date().toISOString() })}>{days} Tage</button>)}
        </div>
        <label className="premium-local-field"><span>Eigenes Ziel: {plan.targetDays} Tage</span><input type="range" min="7" max="365" step="1" value={plan.targetDays} onChange={(event) => save({ ...plan, targetDays: Number(event.target.value) })} /></label>
        <button className="premium-local-primary" onClick={() => save({ ...plan, enabled: !plan.enabled, startedAt: !plan.enabled ? new Date().toISOString() : plan.startedAt })}>{plan.enabled ? 'Plan pausieren' : 'Plan starten'}</button>
      </section>
      <section className="premium-local-card premium-local-plan-status">
        <div><small>Lesestand</small><strong>Sure {lastRead.surahNumber} · Ayah {lastRead.ayahNumber}</strong></div>
        <div><small>Quran-Fortschritt</small><strong>{totalAyahs ? `${percent}%` : 'wird geladen'}</strong></div>
        <div><small>Tägliche Portion</small><strong>{plan.enabled && dailyAyahs !== null ? `ca. ${dailyAyahs} Ayat` : 'Plan nicht aktiv'}</strong></div>
        <div><small>Zieldatum</small><strong>{plan.enabled ? new Intl.DateTimeFormat('de-DE').format(targetDate) : '—'}</strong></div>
        <div className="premium-local-progress"><span style={{ width: `${percent}%` }} /></div>
      </section>
    </div>
  );
}

function RoutinesPanel({ refresh }: { refresh: () => void }) {
  const [name, setName] = useState('');
  const [items, setItems] = useState('');
  const [time, setTime] = useState('');
  const routines = readPremiumRoutines();
  const completion = readRoutineCompletion();

  const create = () => {
    const parsedItems = items.split('\n').map((item) => item.trim()).filter(Boolean);
    if (!name.trim() || parsedItems.length === 0) return;
    createPremiumRoutine(name, parsedItems, time || null);
    if (time) createPremiumReminder(`${name.trim()} · Routine`, time);
    setName(''); setItems(''); setTime(''); refresh();
  };

  return (
    <div className="premium-local-panel-stack">
      <section className="premium-local-card">
        <span className="premium-local-kicker"><ListChecks size={15} /> Eigene Routinen</span>
        <h2>Neue Routine</h2>
        <label className="premium-local-field"><span>Name</span><input value={name} maxLength={60} onChange={(event) => setName(event.target.value)} placeholder="z. B. Morgenroutine" /></label>
        <label className="premium-local-field"><span>Schritte · eine Zeile pro Schritt</span><textarea rows={5} value={items} onChange={(event) => setItems(event.target.value)} placeholder={'Morgen-Adhkar\n5 Minuten Quran\nPersönliche Dua'} /></label>
        <label className="premium-local-field"><span>Optionale Erinnerungszeit</span><input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label>
        <button className="premium-local-primary" onClick={create}><Plus size={16} /> Routine erstellen</button>
      </section>
      {routines.map((routine) => {
        const done = new Set(completion[routine.id] ?? []);
        return (
          <section className="premium-local-card" key={routine.id}>
            <div className="premium-local-card-heading"><div><small>Routine</small><h3>{routine.name}</h3></div><button className="premium-local-icon" aria-label="Routine löschen" onClick={() => { deletePremiumRoutine(routine.id); refresh(); }}><Trash2 size={17} /></button></div>
            <div className="premium-local-check-list">
              {routine.items.map((item) => <button key={item} className={done.has(item) ? 'is-done' : ''} onClick={() => { toggleRoutineItem(routine.id, item); capturePremiumDailySnapshot(); refresh(); }}><span>{done.has(item) ? <Check size={15} /> : null}</span><strong>{item}</strong></button>)}
            </div>
            <small className="premium-local-muted">{done.size}/{routine.items.length} heute erledigt{routine.reminderTime ? ` · Erinnerung ${routine.reminderTime} Uhr` : ''}</small>
          </section>
        );
      })}
      {routines.length === 0 ? <div className="premium-local-empty">Noch keine Routine. Erstelle oben deine erste persönliche Abfolge.</div> : null}
    </div>
  );
}

function HomePanel({ refresh, onPreview }: { refresh: () => void; onPreview: (id: PremiumWidgetId) => void }) {
  const settings = readPremiumSettings();
  const update = (next: PremiumSettings) => { writePremiumSettings(next); refresh(); };
  const toggleWidget = (id: PremiumWidgetId) => update({ ...settings, widgets: settings.widgets.includes(id) ? settings.widgets.filter((item) => item !== id) : [...settings.widgets, id] });
  const toggleSection = (id: PremiumHomeSection) => update({ ...settings, hiddenHomeSections: settings.hiddenHomeSections.includes(id) ? settings.hiddenHomeSections.filter((item) => item !== id) : [...settings.hiddenHomeSections, id] });
  const moveSection = (id: PremiumHomeSection, delta: number) => {
    const current = [...settings.homeOrder];
    const from = current.indexOf(id);
    const to = Math.max(0, Math.min(current.length - 1, from + delta));
    if (from === to) return;
    current.splice(from, 1); current.splice(to, 0, id);
    update({ ...settings, homeOrder: current });
  };

  return (
    <div className="premium-local-panel-stack">
      <section className="premium-local-card">
        <span className="premium-local-kicker"><LayoutDashboard size={15} /> Widget-Baukasten</span>
        <h2>Dein Home-Dashboard</h2>
        <p>Wähle aus, was du direkt auf der Startseite sehen möchtest.</p>
        <div className="premium-local-widget-picker"><div className="premium-local-widget-tier"><strong>Kostenlos</strong><small>Diese Widgets bleiben immer nutzbar.</small></div><div className="premium-local-toggle-grid">{FREE_WIDGETS.map((id) => { const Icon = widgetIcons[id]; return <div key={id} className="premium-widget-picker-entry"><button className={settings.widgets.includes(id) ? 'is-active' : ''} onClick={() => onPreview(id)}><span>{settings.widgets.includes(id) ? <Check size={14} /> : <Icon size={14} />}</span><span className="premium-local-toggle-copy"><strong>{widgetLabels[id]}</strong><small>{widgetDescriptions[id]}</small></span></button><button className="premium-widget-picker-toggle" aria-label={`${widgetLabels[id]} ${settings.widgets.includes(id) ? 'ausblenden' : 'einblenden'}`} aria-pressed={settings.widgets.includes(id)} onClick={() => toggleWidget(id)}>{settings.widgets.includes(id) ? 'An' : 'Aus'}</button></div>; })}</div></div>
        <div className="premium-local-widget-picker is-subscription"><div className="premium-local-widget-tier"><strong><Crown size={14} /> Im Abo</strong><small>Mehr Planung und persönliche Auswertung.</small></div><div className="premium-local-toggle-grid">{SUBSCRIPTION_WIDGETS.map((id) => { const Icon = widgetIcons[id]; return <div key={id} className="premium-widget-picker-entry"><button className={settings.widgets.includes(id) ? 'is-active' : ''} onClick={() => onPreview(id)}><span>{settings.widgets.includes(id) ? <Check size={14} /> : <Icon size={14} />}</span><span className="premium-local-toggle-copy"><strong>{widgetLabels[id]}</strong><small>{widgetDescriptions[id]}</small></span></button><button className="premium-widget-picker-toggle" aria-label={`${widgetLabels[id]} ${settings.widgets.includes(id) ? 'ausblenden' : 'einblenden'}`} aria-pressed={settings.widgets.includes(id)} onClick={() => toggleWidget(id)}>{settings.widgets.includes(id) ? 'An' : 'Aus'}</button></div>; })}</div></div>
        <p className="premium-local-notice">Das sind In-App-Widgets. Echte iOS-/Android-Homescreen-Widgets benötigen später eine native App-Erweiterung und werden hier nicht vorgetäuscht.</p>
      </section>
      <section className="premium-local-card">
        <span className="premium-local-kicker">Startseite personalisieren</span>
        <h2>Bereiche sortieren & ausblenden</h2>
        <div className="premium-local-order-list">
          {settings.homeOrder.map((id, index) => (
            <div key={id} className={settings.hiddenHomeSections.includes(id) ? 'is-hidden' : ''}>
              <button className="premium-local-visibility" onClick={() => toggleSection(id)}>{settings.hiddenHomeSections.includes(id) ? 'Aus' : 'An'}</button>
              <strong>{sectionLabels[id]}</strong>
              <span><button disabled={index === 0} onClick={() => moveSection(id, -1)} aria-label={`${sectionLabels[id]} nach oben`}><ChevronUp size={16} /></button><button disabled={index === settings.homeOrder.length - 1} onClick={() => moveSection(id, 1)} aria-label={`${sectionLabels[id]} nach unten`}><ChevronDown size={16} /></button></span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatsPanel() {
  const [range, setRange] = useState(7);
  const stats = readPremiumStats(range);
  const prayerTotal = stats.reduce((sum, day) => sum + day.prayers, 0);
  const prayerPossible = stats.length * 5;
  const dhikrTotal = stats.reduce((sum, day) => sum + day.dhikr, 0);
  const quranDays = stats.filter((day) => day.quranActive).length;
  const routineDone = stats.reduce((sum, day) => sum + day.routineCompleted, 0);
  const routineTotal = stats.reduce((sum, day) => sum + day.routineTotal, 0);
  return (
    <div className="premium-local-panel-stack">
      <section className="premium-local-card">
        <div className="premium-local-card-heading"><div><span className="premium-local-kicker"><BarChart3 size={15} /> Lokale Statistik</span><h2>Deine letzten Tage</h2></div><div className="premium-local-choice-row"><button className={range === 7 ? 'is-active' : ''} onClick={() => setRange(7)}>7</button><button className={range === 30 ? 'is-active' : ''} onClick={() => setRange(30)}>30</button></div></div>
        <div className="premium-local-stat-grid">
          <div><small>Gebete markiert</small><strong>{prayerTotal}/{prayerPossible}</strong></div>
          <div><small>Quran aktive Tage</small><strong>{quranDays}/{range}</strong></div>
          <div><small>Dhikr erfasst</small><strong>{dhikrTotal}</strong></div>
          <div><small>Routine-Schritte</small><strong>{routineDone}/{routineTotal}</strong></div>
        </div>
        <p className="premium-local-notice">Die Premium-Historie wird ab Nutzung dieser Version lokal aufgebaut. Vorherige Dhikr-/Quran-Tage können nicht rückwirkend erfunden werden.</p>
      </section>
      <section className="premium-local-card">
        <div className="premium-local-mini-chart">
          {[...stats].reverse().map((day) => {
            const score = Math.min(100, Math.round(((day.prayers / 5) * 45) + (day.quranActive ? 25 : 0) + (day.dhikr > 0 ? 10 : 0) + (day.routineTotal ? (day.routineCompleted / day.routineTotal) * 20 : 0)));
            return <div key={day.date} title={`${day.date}: ${score}%`}><span style={{ height: `${Math.max(4, score)}%` }} /><small>{day.date.slice(8)}</small></div>;
          })}
        </div>
      </section>
    </div>
  );
}

function OrganizePanel({ refresh }: { refresh: () => void }) {
  const [folderName, setFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(() => readPremiumFolders()[0]?.id ?? null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteTags, setNoteTags] = useState('');
  const folders = readPremiumFolders();
  const favorites = readPremiumFavoriteRefs();
  const activeFolder = folders.find((folder) => folder.id === selectedFolder) ?? folders[0];
  const journal = readPremiumJournal();

  const toggleFavorite = (ref: string) => {
    if (!activeFolder) return;
    const has = activeFolder.itemRefs.includes(ref);
    updatePremiumFolder({ ...activeFolder, itemRefs: has ? activeFolder.itemRefs.filter((item) => item !== ref) : [...activeFolder.itemRefs, ref] });
    refresh();
  };

  return (
    <div className="premium-local-panel-stack">
      <section className="premium-local-card">
        <span className="premium-local-kicker"><FolderHeart size={15} /> Favoriten-Ordner</span>
        <h2>Sammlung strukturieren</h2>
        <div className="premium-local-inline-form"><input value={folderName} maxLength={60} onChange={(event) => setFolderName(event.target.value)} placeholder="z. B. Ramadan" /><button onClick={() => { if (!folderName.trim()) return; const folder = createPremiumFolder(folderName); setSelectedFolder(folder.id); setFolderName(''); refresh(); }}><Plus size={16} /> Ordner</button></div>
        <div className="premium-local-folder-tabs">{folders.map((folder) => <button key={folder.id} className={activeFolder?.id === folder.id ? 'is-active' : ''} onClick={() => setSelectedFolder(folder.id)}>{folder.name}</button>)}</div>
        {activeFolder ? <div className="premium-local-card-heading"><small>{activeFolder.itemRefs.length} Einträge zugeordnet</small><button className="premium-local-icon" onClick={() => { deletePremiumFolder(activeFolder.id); setSelectedFolder(null); refresh(); }} aria-label="Ordner löschen"><Trash2 size={16} /></button></div> : null}
        {activeFolder && favorites.length ? <div className="premium-local-favorites-list">{favorites.map((favorite) => <button key={favorite.ref} className={activeFolder.itemRefs.includes(favorite.ref) ? 'is-selected' : ''} onClick={() => toggleFavorite(favorite.ref)}><span>{activeFolder.itemRefs.includes(favorite.ref) ? <Check size={14} /> : null}</span><strong>{favorite.label}</strong><small>{favorite.group}</small></button>)}</div> : <p className="premium-local-muted">Speichere zuerst Quran-Lesezeichen, Duas oder Namen in der normalen Sammlung; danach kannst du sie hier in eigene Ordner sortieren.</p>}
      </section>
      <section className="premium-local-card">
        <span className="premium-local-kicker"><NotebookPen size={15} /> Privates Journal</span>
        <h2>Lokale Notiz</h2>
        <label className="premium-local-field"><span>Titel</span><input value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} maxLength={160} /></label>
        <label className="premium-local-field"><span>Text</span><textarea rows={6} value={noteBody} onChange={(event) => setNoteBody(event.target.value)} maxLength={20000} /></label>
        <label className="premium-local-field"><span>Tags · mit Komma trennen</span><input value={noteTags} onChange={(event) => setNoteTags(event.target.value)} placeholder="Tafsir, Lernen" /></label>
        <button className="premium-local-primary" onClick={() => { if (!noteTitle.trim() && !noteBody.trim()) return; savePremiumJournalNote({ title: noteTitle, body: noteBody, tags: noteTags.split(',') }); setNoteTitle(''); setNoteBody(''); setNoteTags(''); refresh(); }}>Notiz speichern</button>
        <div className="premium-local-journal-list">{journal.map((note) => <article key={note.id}><div><strong>{note.title}</strong><small>{new Intl.DateTimeFormat('de-DE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(note.updatedAt))}{note.tags.length ? ` · ${note.tags.join(', ')}` : ''}</small><p>{note.body}</p></div><button className="premium-local-icon" onClick={() => { deletePremiumJournalNote(note.id); refresh(); }} aria-label="Notiz löschen"><Trash2 size={16} /></button></article>)}</div>
      </section>
    </div>
  );
}

function DesignPanel({ refresh }: { refresh: () => void }) {
  const [label, setLabel] = useState('');
  const [time, setTime] = useState('');
  const settings = readPremiumSettings();
  const reminders = readPremiumReminders();

  const chooseAccent = (accent: PremiumAccent) => {
    writePremiumSettings({ ...settings, accent });
    applyPremiumAccent(accent);
    refresh();
  };

  const addReminder = async () => {
    if (!label.trim() || !time) return;
    if ('Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch { /* in-app reminder remains available */ }
    }
    createPremiumReminder(label, time);
    setLabel(''); setTime(''); refresh();
  };

  return (
    <div className="premium-local-panel-stack">
      <section className="premium-local-card">
        <span className="premium-local-kicker"><Palette size={15} /> Premium-Designs</span>
        <h2>Akzent wählen</h2>
        <div className="premium-local-accent-grid">{(['classic', 'sapphire', 'plum', 'sand'] as PremiumAccent[]).map((accent) => <button key={accent} className={`is-${accent} ${settings.accent === accent ? 'is-active' : ''}`} onClick={() => chooseAccent(accent)}><span /><strong>{accentLabels[accent]}</strong></button>)}</div>
      </section>
      <section className="premium-local-card">
        <span className="premium-local-kicker"><BellRing size={15} /> Eigene Erinnerungen</span>
        <h2>Lokale Routine-Erinnerung</h2>
        <div className="premium-local-inline-form"><input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="z. B. Abend-Adhkar" maxLength={80} /><input type="time" value={time} onChange={(event) => setTime(event.target.value)} /><button onClick={() => void addReminder()}><Plus size={16} /></button></div>
        <div className="premium-local-reminder-list">{reminders.map((reminder) => <div key={reminder.id}><button className={reminder.enabled ? 'is-active' : ''} onClick={() => { updatePremiumReminder({ ...reminder, enabled: !reminder.enabled }); refresh(); }}><span>{reminder.enabled ? <Check size={13} /> : null}</span><strong>{reminder.label}</strong><small>{reminder.time} Uhr</small></button><button className="premium-local-icon" aria-label="Erinnerung löschen" onClick={() => { deletePremiumReminder(reminder.id); refresh(); }}><Trash2 size={15} /></button></div>)}</div>
        <p className="premium-local-notice">In der Web-/PWA-Version werden eigene Erinnerungen sicher geprüft, solange die App aktiv ist. Ob das Betriebssystem Benachrichtigungen im Hintergrund zustellt, hängt von PWA-, Browser- und Geräteberechtigungen ab.</p>
      </section>
    </div>
  );
}

function WidgetPreviewDetail({ id, now }: { id: PremiumWidgetId; now: Date }) {
  if (id === 'quran') return <div className="premium-widget-facts"><span>Deine Lesestelle ist gespeichert</span><strong>Lesung fortsetzen →</strong></div>;
  if (id === 'dhikr') return <div className="premium-widget-facts"><span>Ein Moment für Subhanallah, Alhamdulillah und Allahu akbar.</span><strong>Dhikr-Zähler öffnen →</strong></div>;
  if (id === 'qibla') return <div className="premium-widget-facts"><span>Richtung im Kompass bestimmen</span><strong>Standort beim Öffnen verwenden →</strong></div>;
  if (id === 'islamic-date') return <div className="premium-widget-facts"><span>{new Intl.DateTimeFormat('de-DE', { weekday: 'long' }).format(now)}</span><strong>{new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(now)}</strong></div>;
  if (id === 'daily-inspiration') return <blockquote className="premium-widget-ayah"><span lang="ar" dir="rtl">قُلْ هُوَ ٱللَّهُ أَحَدٌ</span><small>Sprich: Er ist Allah, der Eine.</small></blockquote>;
  if (id === 'routine') {
    const routine = readPremiumRoutines()[0];
    const completed = new Set(routine ? readRoutineCompletion()[routine.id] ?? [] : []);
    return <div className="premium-widget-facts">{routine ? routine.items.slice(0, 3).map((item) => <span key={item}>{completed.has(item) ? '✓' : '○'} {item}</span>) : <><span>Wähle deine eigenen Schritte.</span><strong>Erste Routine erstellen →</strong></>}</div>;
  }
  if (id === 'quran-plan') {
    const plan = readQuranPlan();
    const lastRead = readQuranLastRead();
    return <div className="premium-widget-facts"><span>{plan.enabled ? `${plan.targetDays} Tage für dein Leseziel` : 'Lege einen Zeitraum fest, der zu dir passt.'}</span><strong>Lesestelle · {lastRead.surahNumber}:{lastRead.ayahNumber}</strong></div>;
  }
  if (id === 'weekly-prayers') return <div className="premium-widget-history">{readPremiumStats(7).reverse().map((day) => <span key={day.date}><strong>{day.prayers}/5</strong><i><b style={{ height: `${day.prayers / 5 * 100}%` }} /></i><small>{new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(new Date(`${day.date}T12:00:00`))}</small></span>)}</div>;
  if (id === 'favorites') {
    const favorites = readPremiumFavoriteRefs();
    return <div className="premium-widget-facts">{favorites.length ? favorites.slice(0, 2).map((item) => <span key={item.ref}>{item.label}</span>) : <><span>Speichere eine Ayah, Dua oder einen Hadith.</span><strong>Deine Sammlung beginnt hier.</strong></>}</div>;
  }
  if (id === 'reminders') {
    const reminders = readPremiumReminders().filter((item) => item.enabled).sort((a, b) => a.time.localeCompare(b.time));
    return <div className="premium-widget-facts">{reminders.length ? reminders.slice(0, 2).map((item) => <span key={item.id}><time>{item.time}</time> · {item.label}</span>) : <><span>Wähle Anlass und Uhrzeit.</span><strong>Erste Erinnerung einrichten →</strong></>}</div>;
  }
  return <div className="premium-widget-facts"><span>Ghusl · Moschee · Khutbah</span><strong>Freitagsvorbereitung öffnen →</strong></div>;
}

function PrayerWidgetPreview({ now }: { now: Date }) {
  const nextPrayer = getNextPrayer(now);
  const prayers = PRAYER_SCHEDULE.filter((prayer) => prayer.obligatory);
  const backdrop = nextPrayer && nextPrayer.prayer.id !== 'sunrise' ? PRAYER_BACKDROPS[nextPrayer.prayer.id] : undefined;
  const currentTime = new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: PRAYER_SCHEDULE_META.timezone,
  }).format(now);

  return (
    <div className="premium-prayer-widget">
      {backdrop ? <img className="premium-prayer-widget__art" src={versionAppPath(backdrop, '20260929-widget-prayer-scene-v1')} alt="" /> : null}
      <span className="premium-prayer-widget__place"><MoonStar size={10} /> {PRAYER_SCHEDULE_META.city}<time>{currentTime}</time></span>
      <div className="premium-prayer-widget__header">
        {nextPrayer ? <span className="is-next"><small>Nächstes Gebet · {nextPrayer.prayer.label}</small><time>{nextPrayer.prayer.time}</time></span> : <span><small>Aktuelle Uhrzeit</small><time>{currentTime}</time></span>}
      </div>
      {nextPrayer ? <div className="premium-prayer-widget__countdown">
        <span>{nextPrayer.tomorrow ? 'Morgen · ' : ''}noch {formatPrayerRemaining(nextPrayer.remaining)}</span>
        <i><span style={{ width: `${nextPrayer.progress}%` }} /></i>
      </div> : null}
      <div className="premium-prayer-widget__schedule">
        {prayers.map((prayer) => <span key={prayer.id} className={nextPrayer?.prayer.id === prayer.id ? 'is-active' : ''}><small>{prayer.compactLabel}</small><time>{prayer.time}</time></span>)}
      </div>
    </div>
  );
}

function WidgetPreviewPanel({ id, onClose, onBuy, onCustomize, onUse }: { id: PremiumWidgetId; onClose: () => void; onBuy: () => void; onCustomize: () => void; onUse: () => void }) {
  const dialog = useDialog(true, onClose, `${widgetLabels[id]} Vorschau`);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  const Icon = widgetIcons[id];
  const view = readWidgetView(id, now);
  const story = widgetStories[id];
  const isSubscription = SUBSCRIPTION_WIDGETS.includes(id);
  const previewDate = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'short' }).format(now);
  const previewTime = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
  return (
    <div className="premium-local-overlay" {...dialog.props}>
      <div className="premium-local-sheet premium-widget-preview-sheet">
        <header className="premium-local-header">
          <button className="premium-local-icon" onClick={onClose} aria-label="Vorschau schließen"><X size={20} /></button>
          <div><span className="premium-local-kicker">{isSubscription ? <><Crown size={14} /> Premium</> : <><Check size={14} /> Kostenlos</>}</span><h1>{widgetLabels[id]}</h1></div>
          <span className="premium-local-header-badge">Vorschau</span>
        </header>
        <main className="premium-local-content premium-widget-preview-content">
          <section className="premium-widget-preview-layout">
            <div className="premium-widget-phone-demo">
              <span className="premium-local-kicker">Deine Handy-Vorschau</span>
              <div className="premium-widget-phone" aria-label={`${widgetLabels[id]} auf einem Smartphone`}>
                <span className="premium-widget-phone__speaker" aria-hidden="true" />
                <div className="premium-widget-phone__screen">
                  <div className="premium-widget-phone__status"><time>{previewTime}</time><span aria-hidden="true"><i /><i /><i /></span></div>
                  <div className="premium-widget-phone__date"><strong>{previewDate}</strong><small>Nur Islam</small></div>
                  <section className={`premium-widget-stage premium-widget-stage--${id}`} data-widget={id} role="button" tabIndex={0} aria-label={WIDGET_ACTIONS[id].label} onClick={onUse} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onUse(); } }}>
                    {id === 'prayer' ? <PrayerWidgetPreview now={now} /> : id === 'qibla' ? <QiblaWidgetPreview /> : <>
                      <div className="premium-widget-stage__copy">
                        <span className="premium-local-kicker"><Icon size={15} /> {view.eyebrow}</span>
                        <WidgetPreviewValue id={id} value={view.value} />
                        <small>{view.detail}</small>
                      </div>
                      <div className="premium-widget-stage__visual" aria-hidden="true">
                        <img className="premium-widget-stage__art" src={widgetArtUrl(id)} alt="" />
                      </div>
                      <div className="premium-widget-stage__detail"><WidgetPreviewDetail id={id} now={now} /></div>
                    </>}
                  </section>
                  <div className="premium-widget-phone__apps" aria-hidden="true"><i><MoonStar size={13} /></i><i><BookOpen size={13} /></i><i><Compass size={13} /></i><i><CalendarDays size={13} /></i></div>
                  <span className="premium-widget-phone__home" aria-hidden="true" />
                </div>
              </div>
              <small className="premium-widget-demo-caption">Interaktive Vorschau · in der App nutzbar</small>
            </div>
            <div className="premium-widget-explainer">
              <span className="premium-local-kicker"><Icon size={15} /> So hilft es dir im Alltag</span>
              <h2>{story.title}</h2>
              <p>{story.benefit}</p>
              <div className="premium-widget-help-points">
                <span><Icon size={16} /><span><strong>Das siehst du</strong>{story.features}</span></span>
                <span><Check size={16} /><span>{story.moment}</span></span>
              </div>
              <button className="premium-local-primary premium-widget-use" onClick={onUse}>{WIDGET_ACTIONS[id].label}</button>
              {isSubscription ? <section className="premium-widget-offer"><span><Crown size={16} /><small>Alle sechs Premium-Widgets</small><strong>0,99 € <i>/ Monat · geplant</i></strong></span><button className="premium-local-primary" onClick={onBuy}>Premium entdecken</button></section> : <><p className="premium-local-notice premium-widget-included"><Check size={14} /> Kostenlos · ohne Abo</p><button className="premium-widget-customize" onClick={onCustomize}>Auf der App-Startseite anpassen</button></>}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function PremiumPanel({ onClose, onPreview, initialTab = 'overview' }: { onClose: () => void; onPreview: (id: PremiumWidgetId) => void; initialTab?: PremiumTab }) {
  const dialog = useDialog(true, onClose, 'Nur Islam Premium');
  const [tab, setTab] = useState<PremiumTab>(initialTab);
  const [, setVersion] = useState(0);
  const refresh = () => setVersion((value) => value + 1);

  useEffect(() => {
    const handle = () => refresh();
    window.addEventListener('nur:premium-data-changed', handle);
    capturePremiumDailySnapshot();
    return () => window.removeEventListener('nur:premium-data-changed', handle);
  }, []);

  return (
    <div className="premium-local-overlay" {...dialog.props}>
      <div className="premium-local-sheet">
        <header className="premium-local-header">
          <button className="premium-local-icon" onClick={onClose} aria-label="Premium schließen"><X size={20} /></button>
          <div><span className="premium-local-kicker"><Crown size={14} /> Premium</span><h1>Nur Islam Premium</h1></div>
          <span className="premium-local-header-badge">lokal</span>
        </header>
        <nav className="premium-local-tabs" aria-label="Premium-Bereiche">{tabItems.map((item) => <button key={item.id} className={tab === item.id ? 'is-active' : ''} onClick={() => setTab(item.id)}>{item.label}</button>)}</nav>
        <main className="premium-local-content">
          {tab === 'overview' ? <OverviewPanel onTab={setTab} /> : null}
          {tab === 'quran' ? <QuranPlanPanel refresh={refresh} /> : null}
          {tab === 'routines' ? <RoutinesPanel refresh={refresh} /> : null}
          {tab === 'home' ? <HomePanel refresh={refresh} onPreview={onPreview} /> : null}
          {tab === 'stats' ? <StatsPanel /> : null}
          {tab === 'organize' ? <OrganizePanel refresh={refresh} /> : null}
          {tab === 'design' ? <DesignPanel refresh={refresh} /> : null}
        </main>
      </div>
    </div>
  );
}

export function PremiumSystemLayer() {
  const [open, setOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<PremiumTab>('overview');
  const [previewWidget, setPreviewWidget] = useState<PremiumWidgetId | null>(null);
  const [profileHost, setProfileHost] = useState<HTMLElement | null>(null);
  const [homeHost, setHomeHost] = useState<HTMLElement | null>(null);
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);
  const [, setPreferencesVersion] = useState(0);
  const closePremium = useCallback(() => setOpen(false), []);
  const closePreview = useCallback(() => setPreviewWidget(null), []);
  const openPremium = (tab: PremiumTab) => { setPreviewWidget(null); setInitialTab(tab); setOpen(true); };
  const useWidget = (id: PremiumWidgetId) => {
    const target = WIDGET_ACTIONS[id].destination;
    if (target === 'routines' || target === 'quran' || target === 'stats' || target === 'design') {
      openPremium(target);
    } else {
      setPreviewWidget(null);
      window.dispatchEvent(new CustomEvent('nur:open-widget', { detail: id }));
    }
  };

  useEffect(() => {
    applyPremiumAccent();
    capturePremiumDailySnapshot();
    const handleDataChange = () => setPreferencesVersion((value) => value + 1);
    window.addEventListener('nur:premium-data-changed', handleDataChange);
    return () => window.removeEventListener('nur:premium-data-changed', handleDataChange);
  }, []);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return undefined;
    let currentHost: HTMLElement | null = null;
    let currentProfileHost: HTMLElement | null = null;

    const sync = () => {
      const profile = root.querySelector<HTMLElement>('.reference-profile-screen');
      if (!profile) {
        if (currentProfileHost?.isConnected) currentProfileHost.remove();
        currentProfileHost = null;
        setProfileHost(null);
      } else if (!currentProfileHost || !currentProfileHost.isConnected || currentProfileHost.parentElement !== profile) {
        currentProfileHost = document.createElement('div');
        currentProfileHost.className = 'premium-local-launcher-host';
        const account = profile.querySelector(':scope > .reference-account-entry');
        if (account?.nextSibling) profile.insertBefore(currentProfileHost, account.nextSibling);
        else profile.appendChild(currentProfileHost);
        setProfileHost(currentProfileHost);
      }

      const home = root.querySelector<HTMLElement>('.premium-home');
      if (!home) {
        if (currentHost?.isConnected) currentHost.remove();
        currentHost = null;
        setHomeHost(null);
        return;
      }
      if (!currentHost || !currentHost.isConnected || currentHost.parentElement !== home) {
        currentHost = document.createElement('div');
        currentHost.className = 'premium-local-widgets-host';
        home.appendChild(currentHost);
        setHomeHost(currentHost);
      } else if (home.lastElementChild !== currentHost) {
        home.appendChild(currentHost);
      }
      applyHomePreferences(home, readPremiumSettings(), currentHost);
    };

    const observer = new MutationObserver(sync);
    observer.observe(root, { childList: true, subtree: true });
    const handlePremiumChange = () => sync();
    window.addEventListener('nur:premium-data-changed', handlePremiumChange);
    sync();
    return () => {
      observer.disconnect();
      window.removeEventListener('nur:premium-data-changed', handlePremiumChange);
      if (currentHost?.isConnected) currentHost.remove();
      if (currentProfileHost?.isConnected) currentProfileHost.remove();
    };
  }, []);

  useEffect(() => {
    let hideTimer: number | undefined;
    const check = () => {
      capturePremiumDailySnapshot();
      const due = getDuePremiumReminders();
      due.forEach((reminder) => {
        setReminderMessage(`${reminder.label} · ${reminder.time} Uhr`);
        if (hideTimer) window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => setReminderMessage(null), 12000);
        if ('Notification' in window && Notification.permission === 'granted') {
          try { new Notification('Nur Islam', { body: reminder.label, tag: `nur-premium-${reminder.id}` }); } catch { /* in-app banner remains */ }
        }
      });
    };
    check();
    const timer = window.setInterval(check, 20000);
    const onFocus = () => check();
    window.addEventListener('focus', onFocus);
    return () => {
      window.clearInterval(timer);
      if (hideTimer) window.clearTimeout(hideTimer);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return (
    <>
      {profileHost && !open && !previewWidget ? createPortal(<button className="premium-local-launcher" onClick={() => openPremium('overview')}><Crown size={19} /><span><strong>Nur Premium</strong><small>0,99 € · Komfortfunktionen ansehen</small></span></button>, profileHost) : null}
      {homeHost ? createPortal(<PremiumHomeWidgets onCustomize={() => openPremium('home')} onPreview={(id) => { setOpen(false); setPreviewWidget(id); }} />, homeHost) : null}
      {open ? createPortal(<PremiumPanel initialTab={initialTab} onClose={closePremium} onPreview={(id) => { setOpen(false); setPreviewWidget(id); }} />, document.body) : null}
      {previewWidget ? createPortal(<WidgetPreviewPanel id={previewWidget} onClose={closePreview} onBuy={() => openPremium('overview')} onCustomize={() => openPremium('home')} onUse={() => useWidget(previewWidget)} />, document.body) : null}
      {reminderMessage ? <aside className="premium-local-reminder-banner" role="alert"><BellRing size={18} /><span><small>Premium-Erinnerung</small><strong>{reminderMessage}</strong></span><button onClick={() => setReminderMessage(null)} aria-label="Erinnerung schließen"><X size={16} /></button></aside> : null}
    </>
  );
}
