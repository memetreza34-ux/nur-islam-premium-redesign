import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BellRing,
  BookOpen,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  Cloud,
  Droplets,
  HeartHandshake,
  Home,
  Info,
  Landmark,
  Languages,
  ListChecks,
  LogIn,
  LogOut,
  NotebookPen,
  ScrollText,
  Route,
  Scale,
  Settings2,
  ShieldCheck,
  Star,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useDialog } from '../shared/useDialog';
import { learningLegacyFeatures, serviceLegacyFeatures } from '../data/legacyFeatures';
import type { LegacyFeatureId } from '../data/legacyFeatures';
import { LEARNING_CATEGORIES } from '../data/learningCategories';
import type { LearningCategoryId } from '../data/learningCategories';
import { getCachedSession, signOut, subscribeAuth } from '../services/nurBackend';
import type { NurSession } from '../services/nurBackend';
import { OBLIGATORY_PRAYER_IDS } from '../services/prayerSchedule';
import type { NurIcon } from '../shared/NurIcons';
import {
  NurBookmarkIcon,
  NurCalendarIcon,
  NurDuaIcon,
  NurMihrabIcon,
  NurMosqueIcon,
  NurPrayerTimesIcon,
  NurQiblaIcon,
  NurQuranIcon,
  NurRosetteIcon,
  NurTasbihIcon,
} from '../shared/NurIcons';
import { NurMark, PremiumImage } from '../shared/PremiumVisuals';

/**
 * Everything this screen can open. Account, notes and the service features used
 * to be local state here, which kept them out of the app's navigation: they
 * pushed no history entry, so the Android system back button did nothing, and
 * tapping the already-active tab could not return to this list. They are
 * ordinary destinations now, the same as every other row.
 */
export type MoreDestination = 'home' | 'prayer' | 'learn' | 'quran' | 'dhikr' | 'qibla' | 'duas' | 'names' | 'mosques' | 'calendar' | 'collections' | 'ayah' | 'hadith' | 'wudu' | 'prayer-learning' | 'legal' | 'account' | 'notes' | `learn:${LearningCategoryId}` | `legacy:${LegacyFeatureId}`;

type ProfileAction = 'language' | 'settings' | 'support' | 'about';

type ProfileRow = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action?: ProfileAction;
  destination?: MoreDestination;
};

type CoreShortcut = {
  destination: MoreDestination;
  title: string;
  description: string;
  icon: NurIcon | LucideIcon;
};

const learningCategoryIcons: Record<LearningCategoryId, LucideIcon> = {
  faith: ShieldCheck,
  pillars: Landmark,
  terms: ListChecks,
  practice: Droplets,
  character: HeartHandshake,
  community: Users,
  prophet: Star,
};

const directServiceIds = new Set<LegacyFeatureId>(['fasting', 'ummah']);
const directServiceFeatures = serviceLegacyFeatures.filter((feature) => directServiceIds.has(feature.id));
const standaloneServiceFeatures = serviceLegacyFeatures.filter((feature) => !directServiceIds.has(feature.id));

function legacyShortcut(feature: (typeof serviceLegacyFeatures)[number]): CoreShortcut {
  return {
    destination: `legacy:${feature.id}`,
    title: feature.title,
    description: feature.subtitle,
    icon: feature.icon,
  };
}

const coreShortcutGroups: Array<{ title: string; shortcuts: CoreShortcut[] }> = [
  {
    title: 'Hauptbereiche',
    shortcuts: [
      { destination: 'home', title: 'Start', description: 'Heute & nächstes Gebet', icon: Home },
      { destination: 'prayer', title: 'Gebetszeiten', description: 'Zeiten, Plan & Tracker', icon: NurPrayerTimesIcon },
      { destination: 'quran', title: 'Quran', description: 'Alle 114 Suren', icon: NurQuranIcon },
      { destination: 'learn', title: 'Lernen', description: 'Alle Kurse & Grundlagen', icon: BookOpen },
    ],
  },
  {
    title: 'Gebet & Alltag',
    shortcuts: [
      { destination: 'prayer-learning', title: 'Beten lernen', description: 'Fünf Gebete Schritt für Schritt', icon: NurMihrabIcon },
      { destination: 'wudu', title: 'Wudu lernen', description: 'Waschung Schritt für Schritt', icon: Droplets },
      { destination: 'qibla', title: 'Qibla', description: 'Live-Kompass', icon: NurQiblaIcon },
      { destination: 'dhikr', title: 'Dhikr', description: 'Zähler & Tagesziel', icon: NurTasbihIcon },
      { destination: 'duas', title: 'Duas', description: 'Bittgebete für jeden Moment', icon: NurDuaIcon },
      { destination: 'mosques', title: 'Moscheen', description: 'Gebetsorte in deiner Nähe', icon: NurMosqueIcon },
      { destination: 'calendar', title: 'Kalender', description: 'Islamische Tage & Termine', icon: NurCalendarIcon },
      ...directServiceFeatures.filter((feature) => feature.id === 'fasting').map(legacyShortcut),
      { destination: 'collections', title: 'Sammlung', description: 'Favoriten & Lesezeichen', icon: NurBookmarkIcon },
    ],
  },
  {
    title: 'Grundlagen',
    shortcuts: LEARNING_CATEGORIES.map((category) => ({
      destination: `learn:${category.id}` as MoreDestination,
      title: category.title,
      description: category.subtitle,
      icon: learningCategoryIcons[category.id],
    })),
  },
  {
    title: 'Wissen & Vertiefung',
    shortcuts: [
      { destination: 'ayah', title: 'Vers des Tages', description: 'Arabisch, Aussprache & Bedeutung', icon: BookOpenCheck },
      { destination: 'hadith', title: 'Hadith des Tages', description: 'Quelle & Einordnung', icon: BookOpen },
      { destination: 'names', title: '99 Namen Allahs', description: 'Arabisch, Aussprache & Bedeutung', icon: NurRosetteIcon },
      ...directServiceFeatures.filter((feature) => feature.id === 'ummah').map(legacyShortcut),
      ...learningLegacyFeatures.map((feature) => ({
        destination: `legacy:${feature.id}` as MoreDestination,
        title: feature.title,
        description: feature.subtitle,
        icon: feature.icon,
      })),
    ],
  },
];

const journeyRows: ProfileRow[] = [
  { id: 'journey', title: 'Meine Reise', description: 'Deinen Lernfortschritt ansehen', icon: Route, destination: 'learn' },
  // "Lesezeichen" used to sit here and opened the same screen as "Sammlung"
  // above, under a second name. Two entries for one destination is the kind of
  // thing that makes a reader doubt they found the right one.
  { id: 'notes', title: 'Notizen', description: 'Lokal oder geschützt in der Cloud', icon: NotebookPen, destination: 'notes' },
  { id: 'reminders', title: 'Gebetserinnerungen', description: 'Benachrichtigungen für die fünf Gebete einstellen', icon: BellRing, destination: 'prayer' },
];

const preferenceRows: ProfileRow[] = [
  { id: 'language', title: 'Sprache', description: 'Aktuell vollständig: Deutsch', icon: Languages, action: 'language' },
  { id: 'settings', title: 'Einstellungen', description: 'Reminder, Konto und Cloud', icon: Settings2, action: 'settings' },
];

const supportRows: ProfileRow[] = [
  // Named "Hilfe & Datenschutz" before, directly above "Impressum &
  // Datenschutz": two rows whose titles claimed the same subject, so the only
  // way to tell them apart was to read the small line underneath.
  { id: 'help', title: 'Hilfe & Datenquellen', description: 'Woher die Inhalte kommen und was lokal bleibt', icon: CircleHelp, action: 'support' },
  { id: 'legal', title: 'Impressum & Datenschutz', description: 'Anbieter, Datenverarbeitung und Lizenzen', icon: ScrollText, destination: 'legal' },
  { id: 'about', title: 'Über Nur', description: 'Version und Produktprinzipien', icon: Info, action: 'about' },
];

function readReminderEnabled() {
  try {
    const parsed = JSON.parse(localStorage.getItem('nur_prayer_notifications') || '[]') as unknown;
    return Array.isArray(parsed) && parsed.some((value) => typeof value === 'string' && OBLIGATORY_PRAYER_IDS.some((id) => id === value));
  } catch {
    return false;
  }
}

function readUserName(session: NurSession | null) {
  try {
    const current = localStorage.getItem('nur_display_name')?.trim();
    if (current) return current;
    const legacy = localStorage.getItem('premium_user_name');
    if (legacy) {
      const parsed = JSON.parse(legacy) as unknown;
      if (typeof parsed === 'string' && parsed.trim()) return parsed.trim();
    }
  } catch {
    // Use account email or neutral fallback.
  }
  return session?.user.email.split('@')[0] || 'Nur Nutzer';
}

function ProfileList({ rows, onSelect }: { rows: ProfileRow[]; onSelect: (row: ProfileRow) => void }) {
  return (
    <div className="reference-profile-list">
      {rows.map((row) => {
        const Icon = row.icon;
        return (
          <button key={row.id} className="reference-profile-row" onClick={() => onSelect(row)}>
            <span className="reference-profile-row__icon"><Icon size={19} /></span>
            <span className="reference-profile-row__copy"><strong>{row.title}</strong><small>{row.description}</small></span>
            <ChevronRight size={18} />
          </button>
        );
      })}
    </div>
  );
}

export function MoreScreen({ onBack, onNavigate }: { onBack: () => void; onNavigate: (destination: MoreDestination) => void }) {
  const [modal, setModal] = useState<ProfileAction | null>(null);
  const [notifications, setNotifications] = useState(readReminderEnabled);
  const [session, setSession] = useState<NurSession | null>(() => getCachedSession());
  const [toast, setToast] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const closeDialog = useCallback(() => { setModal(null); }, []);
  const screenDialog = useDialog(
    Boolean(modal),
    closeDialog,
    modal === 'support' ? 'Hilfe und Datenschutz' : modal === 'about' ? 'Über Nur' : modal === 'language' ? 'App-Sprache' : 'Einstellungen',
  );
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, .36, 1] as const };
  const microTransition = { duration: reduceMotion ? 0 : .18, ease: [0.22, 1, .36, 1] as const };
  const itemTransition = (index: number) => ({ duration: reduceMotion ? 0 : .2, delay: reduceMotion ? 0 : Math.min(index * .02, .1), ease: [0.22, 1, .36, 1] as const });

  const userName = readUserName(session);

  useEffect(() => subscribeAuth(setSession), []);

  const initials = useMemo(() => {
    const clean = userName.trim();
    return clean ? clean.slice(0, 2).toUpperCase() : 'NI';
  }, [userName]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  const selectRow = (row: ProfileRow) => {
    if (row.destination) return onNavigate(row.destination);
    if (row.action) setModal(row.action);
  };

  const toggleNotifications = async () => {
    if (notifications) {
      try { localStorage.setItem('nur_prayer_notifications', '[]'); } catch { /* optional */ }
      setNotifications(false);
      flash('Gebetserinnerungen ausgeschaltet');
      return;
    }

    let systemNotificationAvailable = 'Notification' in window && Notification.permission === 'granted';
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        systemNotificationAvailable = permission === 'granted';
      } catch {
        systemNotificationAvailable = false;
      }
    }

    try { localStorage.setItem('nur_prayer_notifications', JSON.stringify(OBLIGATORY_PRAYER_IDS)); } catch { /* optional */ }
    setNotifications(true);
    flash(systemNotificationAvailable
      ? 'Alle fünf Pflichtgebete sind mit Systembenachrichtigungen aktiviert'
      : 'Alle fünf Pflichtgebete sind als In-App-Erinnerungen aktiviert; Systembenachrichtigungen sind nicht verfügbar');
  };

  const logout = async () => {
    if (!session) {
      onNavigate('account');
      return;
    }
    await signOut();
    setSession(null);
    flash('Abgemeldet. Lokale Daten bleiben auf diesem Gerät erhalten.');
  };

  return (
    <motion.main className="screen reference-profile-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite"><ChevronLeft size={20} /></button>
        <div><span className="overline">Profil & Einstellungen</span><h1>Mehr</h1></div>
        <button className="icon-button" onClick={() => setModal('settings')} aria-label="Einstellungen"><Settings2 size={20} /></button>
      </header>

      <section className="reference-profile-greeting">
        <span className="reference-profile-greeting__logo"><PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem-v3.svg" fallback={<NurMark />} /></span>
        <div><span className="overline">Assalamu Alaikum</span><h2>{userName}</h2><p>{session ? 'Dein Konto ist verbunden. Lokale Daten kannst du in Nur Cloud sichern.' : 'Die App funktioniert lokal ohne Konto. Cloud-Sicherung ist optional.'}</p></div>
        <span className="reference-profile-avatar">{initials}</span>
      </section>

      <button className="reference-account-entry" onClick={() => onNavigate('account')}>
        <span>{session ? <Cloud size={20} /> : <LogIn size={20} />}</span>
        <span><strong>{session ? 'Nur Cloud verbunden' : 'Konto & Cloud'}</strong><small>{session ? session.user.email : 'Anmelden, registrieren und Fortschritt sichern'}</small></span>
        <ChevronRight size={18} />
      </button>

      <section className="reference-profile-section reference-core-access">
        <div className="reference-core-access__heading"><span className="reference-profile-section__label">Direktzugriff</span><small>Alle Bereiche der App an einem Ort</small></div>
        <div className="reference-core-access__groups">
          {coreShortcutGroups.map((group, groupIndex) => (
            <section className="reference-core-access__group" key={group.title} aria-labelledby={`direct-access-${groupIndex}`}>
              <div className="reference-core-access__group-title"><h3 id={`direct-access-${groupIndex}`}>{group.title}</h3><span>{group.shortcuts.length}</span></div>
              <div className="reference-core-access-grid">
                {group.shortcuts.map((shortcut, index) => {
                  const Icon = shortcut.icon;
                  return (
                    <motion.button key={shortcut.destination} onClick={() => onNavigate(shortcut.destination)} initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={itemTransition(groupIndex * 4 + index)} whileTap={{ scale: reduceMotion ? 1 : .985 }}>
                      <span className="reference-core-access-grid__icon"><Icon size={20} /></span>
                      <span><strong>{shortcut.title}</strong><small>{shortcut.description}</small></span>
                      <ChevronRight size={16} />
                    </motion.button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="reference-profile-section"><span className="reference-profile-section__label">Deine Inhalte</span><ProfileList rows={journeyRows} onSelect={selectRow} /></section>

      <section className="reference-profile-section reference-services-section">
        <span className="reference-profile-section__label">Islamische Dienste</span>
        <p className="reference-services-section__intro">Zusätzliche Werkzeuge, die keinem Hauptbereich doppelt zugeordnet sind.</p>
        <div className="reference-services-grid">
          {standaloneServiceFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.button key={feature.id} onClick={() => onNavigate(`legacy:${feature.id}`)} initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }} animate={{ opacity: 1, y: 0 }} transition={itemTransition(index)} whileTap={{ scale: reduceMotion ? 1 : .985 }}>
                <span className="reference-services-grid__icon"><Icon size={21} /></span>
                <span><small>{feature.id === 'standby' ? 'Gebetsanzeige' : feature.subtitle}</small><strong>{feature.id === 'standby' ? 'Standby' : feature.title}</strong></span>
                <ChevronRight size={17} />
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="reference-profile-section"><span className="reference-profile-section__label">App</span><ProfileList rows={preferenceRows} onSelect={selectRow} /></section>
      <section className="reference-profile-section"><span className="reference-profile-section__label">Informationen</span><ProfileList rows={supportRows} onSelect={selectRow} /></section>

      <button className="reference-profile-logout" onClick={() => void logout()}>{session ? <><LogOut size={18} /> Abmelden</> : <><LogIn size={18} /> Konto öffnen</>}</button>

      <AnimatePresence>
        {modal ? (
          <motion.div className="reference-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={microTransition} onClick={() => setModal(null)}>
            <motion.section {...screenDialog.props} className={`reference-profile-modal${modal === 'support' ? ' reference-profile-modal--support' : ''}${modal === 'about' ? ' reference-profile-modal--about' : ''}`} initial={{ opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : .99 }} transition={screenTransition} onClick={(event) => event.stopPropagation()}>
              <button className="reference-modal-close" onClick={() => setModal(null)} aria-label="Schließen"><X size={18} /></button>

              {modal === 'language' ? (
                <>
                  <span className="reference-profile-modal__icon"><Languages size={28} /></span><span className="overline">App-Sprache</span><h2>Deutsch</h2><p>Deutsch ist aktuell die einzige vollständig gepflegte App-Sprache. Arabisch und Englisch werden erst freigeschaltet, wenn Navigation und religiöse Inhalte vollständig übersetzt und geprüft sind.</p>
                  <div className="reference-choice-grid"><div className="reference-choice reference-choice--active reference-choice--static" aria-label="Deutsch ist ausgewählt"><Languages size={20} /><span>Deutsch</span><CircleCheck size={16} /></div></div>
                </>
              ) : null}

              {modal === 'settings' ? (
                <>
                  <span className="reference-profile-modal__icon"><Settings2 size={28} /></span><span className="overline">App-Einstellungen</span><h2>Einstellungen</h2><p>Diese Schalter sind direkt mit den aktiven Funktionen verbunden.</p>
                  <div className="reference-settings-toggles">
                    <button onClick={() => void toggleNotifications()}><span><BellRing size={19} /><span><strong>Gebetserinnerungen</strong><small>{notifications ? 'Mindestens ein Gebet ist aktiv' : 'Keine Gebetserinnerungen aktiv'}</small></span></span><em className={notifications ? 'is-on' : ''}><i /></em></button>
                    <button onClick={() => { setModal(null); onNavigate('account'); }}><span><Cloud size={19} /><span><strong>Cloud-Synchronisierung</strong><small>{session ? 'Konto verbunden · Backup verwalten' : 'Konto erforderlich'}</small></span></span><ChevronRight size={18} /></button>
                  </div>
                </>
              ) : null}

              {modal === 'support' ? (
                <>
                  <span className="reference-profile-modal__icon"><CircleHelp size={28} /></span>
                  <span className="overline">Hilfe-Center</span>
                  <h2>Hilfe, Funktionen & Datenschutz</h2>
                  <p>Hier siehst du den aktuellen Stand wichtiger Funktionen, findest die passenden Einstellungen und kannst Probleme direkt lösen.</p>

                  <section className="reference-support-section" aria-labelledby="support-automation-title">
                    <div className="reference-support-section__heading"><span>Funktionen & Status</span><small>Was selbstständig läuft</small></div>
                    <div className="reference-support-status" id="support-automation-title">
                      <div><BellRing size={18} /><span><strong>Gebetszeiten</strong><small>Werden jeden Tag selbstständig aktualisiert</small></span><em>Jeden Tag</em></div>
                      <div><BellRing size={18} /><span><strong>Gebetserinnerungen</strong><small>{notifications ? 'Laufen nach der Aktivierung selbstständig' : 'Müssen einmal eingerichtet werden'}</small></span><em className={notifications ? 'is-ready' : ''}>{notifications ? 'Aktiv' : 'Einrichten'}</em></div>
                      <div><Cloud size={18} /><span><strong>Cloud-Sicherung</strong><small>{session ? 'Konto verbunden; du startest jedes Backup selbst' : 'Nur verfügbar, wenn du ein Konto verbindest'}</small></span><em className={session ? 'is-ready' : ''}>{session ? 'Manuell' : 'Optional'}</em></div>
                    </div>
                  </section>

                  <section className="reference-support-section" aria-labelledby="support-actions-title">
                    <div className="reference-support-section__heading"><span id="support-actions-title">Direkte Hilfe</span><small>Öffnet die richtige Stelle</small></div>
                    <div className="reference-support-actions">
                      <button onClick={() => { setModal(null); onNavigate('prayer'); }}><BellRing size={19} /><span><strong>Gebetserinnerungen einrichten</strong><small>Glocke beim gewünschten Pflichtgebet aktivieren</small></span><ChevronRight size={17} /></button>
                      <button onClick={() => { setModal(null); onNavigate('legacy:fasting'); }}><Route size={19} /><span><strong>Fastentage planen</strong><small>Auswahl als Kalender-Erinnerungen vorbereiten</small></span><ChevronRight size={17} /></button>
                      <button onClick={() => { setModal(null); onNavigate('account'); }}><Cloud size={19} /><span><strong>Konto & Sicherung öffnen</strong><small>Fortschritt sichern, exportieren oder löschen</small></span><ChevronRight size={17} /></button>
                      <button onClick={() => { setModal(null); onNavigate('legal'); }}><ShieldCheck size={19} /><span><strong>Datenschutz vollständig lesen</strong><small>Dienste, Speicherdauer und deine Rechte</small></span><ChevronRight size={17} /></button>
                    </div>
                  </section>

                  <section className="reference-support-section reference-support-data" aria-labelledby="support-data-title">
                    <div className="reference-support-section__heading"><span id="support-data-title">Dein Datenweg</span><small>Transparent in drei Stufen</small></div>
                    <div className="reference-support-data__steps">
                      <article><b>1</b><span><strong>Zunächst auf deinem Gerät</strong><small>Tracker, Dhikr, Favoriten, Termine, lokale Notizen und Lernfortschritt.</small></span></article>
                      <article><b>2</b><span><strong>Nur wenn du eine Funktion nutzt</strong><small>Standort an AlAdhan oder Overpass; Surennummer an Al Quran Cloud. Dabei fallen technisch notwendige Verbindungsdaten an.</small></span></article>
                      <article><b>3</b><span><strong>Cloud nur mit Einwilligung</strong><small>Backups und Cloud-Notizen nutzen Supabase erst nach ausdrücklicher Freigabe. Standort und lokale Notizen werden nicht mitgesichert.</small></span></article>
                    </div>
                    <div className="reference-support-trust"><Scale size={17} /><span><strong>Keine Werbung und keine Werbe-Tracker</strong><small>Die App funktioniert auch ohne Konto. Cloud-Sicherungen werden nicht automatisch ohne deine Aktion gestartet.</small></span></div>
                  </section>

                  <section className="reference-support-section" aria-labelledby="support-faq-title">
                    <div className="reference-support-section__heading"><span id="support-faq-title">Wenn etwas nicht funktioniert</span><small>Schnelle Lösungen</small></div>
                    <div className="reference-support-faq">
                      <details><summary>Ich erhalte keine Erinnerung</summary><p>Öffne „Gebetserinnerungen“, aktiviere die Glocke bei einem Pflichtgebet und erlaube Benachrichtigungen im Browser oder auf deinem Gerät.</p></details>
                      <details><summary>Die Gebetszeit oder der Ort stimmt nicht</summary><p>Öffne den Gebetsbereich und prüfe Standort, Berechnungsmethode und Asr-Einstellung. Ohne Standortfreigabe verwendet die App den voreingestellten Ort.</p></details>
                      <details><summary>Wie sichere oder lösche ich meine Daten?</summary><p>Unter „Konto & Sicherung“ kannst du ein Backup bewusst starten, Daten als JSON exportieren und Cloud-Daten wieder löschen.</p></details>
                      <details><summary>Kann ich die App offline nutzen?</summary><p>Der arabische Quran-Text und bereits geladene Inhalte bleiben verfügbar. Live-Gebetszeiten, Übersetzungen und Moschee-Suche benötigen zeitweise Internet.</p></details>
                    </div>
                  </section>
                </>
              ) : null}

              {modal === 'about' ? (
                <div className="reference-about">
                  <header className="reference-about__hero">
                    <span className="reference-about__mark">
                      <PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem-v3.svg" fallback={<NurMark />} />
                    </span>
                    <span className="overline">Nur Islam · Version 0.3</span>
                    <h2>Eine App.<br />Dein muslimischer Alltag.</h2>
                    <p>Nur Islam wurde speziell für Muslime entwickelt. Die wichtigsten Begleiter für Glauben, Gebet, Wissen und Alltag kommen in einer ruhigen App zusammen.</p>
                  </header>

                  <section className="reference-about__promise" aria-labelledby="about-promise-title">
                    <span><ShieldCheck size={21} /></span>
                    <div>
                      <small id="about-promise-title">Unser Grundsatz</small>
                      <strong>Ohne Werbung. Ohne Pflichtkonto.</strong>
                      <p>Keine Werbebanner und keine Werbe-Tracker. Du kannst Nur Islam lokal nutzen; Konto und Cloud bleiben freiwillig.</p>
                    </div>
                  </section>

                  <section className="reference-about__areas" aria-labelledby="about-areas-title">
                    <div className="reference-about__section-heading">
                      <strong id="about-areas-title">Alles Wichtige an einem Ort</strong>
                      <small>Für Ibadah, Wissen und Alltag</small>
                    </div>
                    <div className="reference-about__area-grid">
                      <span><CircleCheck size={14} /> Gebetszeiten & Erinnerungen</span>
                      <span><CircleCheck size={14} /> Quran & Lesezeichen</span>
                      <span><CircleCheck size={14} /> Dhikr & Duas</span>
                      <span><CircleCheck size={14} /> Qibla & Moscheen</span>
                      <span><CircleCheck size={14} /> Lernen & Gebet</span>
                      <span><CircleCheck size={14} /> Kalender & Fasten</span>
                      <span><CircleCheck size={14} /> Notizen & Fortschritt</span>
                      <span><CircleCheck size={14} /> Quellen & Einordnung</span>
                    </div>
                  </section>

                  <footer className="reference-about__footer">
                    <span><HeartHandshake size={16} /> Mit Sorgfalt für Muslime entwickelt</span>
                    <small>Als App installierbar</small>
                  </footer>
                </div>
              ) : null}

              <button className="gold-button" onClick={() => setModal(null)}>{modal === 'support' ? 'Hilfe schließen' : 'Fertig'} <CircleCheck size={17} /></button>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }} transition={microTransition}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
