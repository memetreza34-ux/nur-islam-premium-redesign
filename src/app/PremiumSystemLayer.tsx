import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BarChart3,
  BellRing,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Crown,
  FolderHeart,
  LayoutDashboard,
  ListChecks,
  MoonStar,
  NotebookPen,
  Palette,
  Plus,
  CircleDot,
  Target,
  Trash2,
  X,
} from 'lucide-react';
import { fetchSurahs } from '../services/quranService';
import { formatPrayerRemaining, getNextPrayer, PRAYER_SCHEDULE_META } from '../services/prayerSchedule';
import {
  PREMIUM_HOME_SECTIONS,
  PREMIUM_WIDGETS,
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
  journey: 'Spirituelle Werkzeuge',
  discover: 'Entdecken',
  continue: 'Quran weiterlesen',
  inspiration: 'Ayah & Hadith',
  assistant: 'Nur Assistent',
  recommendations: 'Empfehlungen',
};

const widgetLabels: Record<PremiumWidgetId, string> = {
  prayer: 'Nächstes Gebet',
  quran: 'Quran-Ziel',
  dhikr: 'Dhikr heute',
  routine: 'Tagesroutine',
};

const accentLabels: Record<PremiumAccent, string> = {
  classic: 'Nur Klassik',
  sapphire: 'Saphir',
  plum: 'Pflaume',
  sand: 'Sand',
};

function readDhikrToday(): number {
  try {
    const parsed = JSON.parse(localStorage.getItem('nur_dhikr_daily_v2') || '{}') as { date?: unknown; counts?: unknown };
    if (parsed.date !== getLocalDateKey() || !parsed.counts || typeof parsed.counts !== 'object' || Array.isArray(parsed.counts)) return 0;
    return Object.values(parsed.counts as Record<string, unknown>).reduce<number>((sum, value) => sum + (typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0), 0);
  } catch {
    return 0;
  }
}

function applyHomePreferences(home: HTMLElement, settings: PremiumSettings, host: HTMLElement | null) {
  home.classList.add('premium-home--personalized');
  const contentSections = Array.from(home.querySelectorAll<HTMLElement>(':scope > .content-section'));
  const nodes: Partial<Record<PremiumHomeSection, HTMLElement>> = {
    journey: contentSections.find((node) => Boolean(node.querySelector('.journey-grid'))),
    discover: contentSections.find((node) => Boolean(node.querySelector('.quick-grid'))),
    continue: home.querySelector<HTMLElement>(':scope > .continue-card') ?? undefined,
    inspiration: home.querySelector<HTMLElement>(':scope > .inspiration-grid') ?? undefined,
    assistant: home.querySelector<HTMLElement>(':scope > .ai-preview') ?? undefined,
    recommendations: home.querySelector<HTMLElement>(':scope > .recommendations') ?? undefined,
  };

  const fixed = [
    home.querySelector<HTMLElement>(':scope > .brand-bar'),
    home.querySelector<HTMLElement>(':scope > .welcome-hero'),
    home.querySelector<HTMLElement>(':scope > .prayer-hero'),
  ];
  fixed.forEach((node, index) => { if (node) node.style.order = String(index); });
  if (host) host.style.order = '3';

  settings.homeOrder.forEach((section, index) => {
    const node = nodes[section];
    if (!node) return;
    node.style.order = String(index + 4);
    node.hidden = settings.hiddenHomeSections.includes(section);
  });
}

function PremiumHomeWidgets({ onOpen }: { onOpen: () => void }) {
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
  const nextPrayer = getNextPrayer(new Date());
  const plan = readQuranPlan();
  const lastRead = readQuranLastRead();
  const routines = readPremiumRoutines();
  const completion = readRoutineCompletion();
  const firstRoutine = routines[0];
  const routineDone = firstRoutine ? new Set(completion[firstRoutine.id] ?? []).size : 0;
  const dhikr = readDhikrToday();

  if (settings.widgets.length === 0) return null;

  return (
    <section className="premium-local-widgets" aria-label="Premium Widgets">
      <div className="premium-local-widgets__heading">
        <span><Crown size={15} /> Premium-Widgets</span>
        <button onClick={onOpen}>Anpassen</button>
      </div>
      <div className="premium-local-widgets__grid">
        {settings.widgets.includes('prayer') ? (
          <button onClick={onOpen} className="premium-local-widget">
            <MoonStar size={18} />
            <span><small>{PRAYER_SCHEDULE_META.city}</small><strong>{nextPrayer.prayer.label} · {nextPrayer.prayer.time}</strong><em>{nextPrayer.tomorrow ? 'morgen ' : ''}in {formatPrayerRemaining(nextPrayer.remaining)}</em></span>
          </button>
        ) : null}
        {settings.widgets.includes('quran') ? (
          <button onClick={onOpen} className="premium-local-widget">
            <Target size={18} />
            <span><small>{plan.enabled ? `Khatm-Ziel · ${plan.targetDays} Tage` : 'Quran-Ziel'}</small><strong>Sure {lastRead.surahNumber} · Ayah {lastRead.ayahNumber}</strong><em>{plan.enabled ? 'Plan aktiv' : 'Plan festlegen'}</em></span>
          </button>
        ) : null}
        {settings.widgets.includes('dhikr') ? (
          <button onClick={onOpen} className="premium-local-widget">
            <CircleDot size={18} />
            <span><small>Heute gezählt</small><strong>{dhikr} Dhikr</strong><em>lokal gespeichert</em></span>
          </button>
        ) : null}
        {settings.widgets.includes('routine') ? (
          <button onClick={onOpen} className="premium-local-widget">
            <ListChecks size={18} />
            <span><small>{firstRoutine?.name ?? 'Tagesroutine'}</small><strong>{firstRoutine ? `${routineDone}/${firstRoutine.items.length} erledigt` : 'Noch keine Routine'}</strong><em>{firstRoutine ? 'heutiger Fortschritt' : 'Routine erstellen'}</em></span>
          </button>
        ) : null}
      </div>
    </section>
  );
}

function OverviewPanel({ onTab }: { onTab: (tab: PremiumTab) => void }) {
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

function HomePanel({ refresh }: { refresh: () => void }) {
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
        <span className="premium-local-kicker"><LayoutDashboard size={15} /> Premium-Widgets</span>
        <h2>Dein Home-Dashboard</h2>
        <p>Diese Widgets erscheinen direkt in Nur Islam auf der Startseite.</p>
        <div className="premium-local-toggle-grid">
          {PREMIUM_WIDGETS.map((id) => <button key={id} className={settings.widgets.includes(id) ? 'is-active' : ''} onClick={() => toggleWidget(id)}><span>{settings.widgets.includes(id) ? <Check size={14} /> : null}</span><strong>{widgetLabels[id]}</strong></button>)}
        </div>
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

function PremiumPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<PremiumTab>('overview');
  const [, setVersion] = useState(0);
  const refresh = () => setVersion((value) => value + 1);

  useEffect(() => {
    const handle = () => refresh();
    window.addEventListener('nur:premium-data-changed', handle);
    capturePremiumDailySnapshot();
    return () => window.removeEventListener('nur:premium-data-changed', handle);
  }, []);

  return (
    <div className="premium-local-overlay" role="dialog" aria-modal="true" aria-label="Nur Islam Premium">
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
          {tab === 'home' ? <HomePanel refresh={refresh} /> : null}
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
  const [profileHost, setProfileHost] = useState<HTMLElement | null>(null);
  const [homeHost, setHomeHost] = useState<HTMLElement | null>(null);
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);
  const [, setPreferencesVersion] = useState(0);

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
        const prayer = home.querySelector(':scope > .prayer-hero');
        if (prayer?.nextSibling) home.insertBefore(currentHost, prayer.nextSibling);
        else home.appendChild(currentHost);
        setHomeHost(currentHost);
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
      {profileHost && !open ? createPortal(<button className="premium-local-launcher" onClick={() => setOpen(true)}><Crown size={19} /><span><strong>Nur Premium</strong><small>0,99 € · Komfortfunktionen ansehen</small></span></button>, profileHost) : null}
      {homeHost ? createPortal(<PremiumHomeWidgets onOpen={() => setOpen(true)} />, homeHost) : null}
      {open ? createPortal(<PremiumPanel onClose={() => setOpen(false)} />, document.body) : null}
      {reminderMessage ? <aside className="premium-local-reminder-banner" role="alert"><BellRing size={18} /><span><small>Premium-Erinnerung</small><strong>{reminderMessage}</strong></span><button onClick={() => setReminderMessage(null)} aria-label="Erinnerung schließen"><X size={16} /></button></aside> : null}
    </>
  );
}
