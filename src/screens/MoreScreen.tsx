import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BellRing,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  Cloud,
  Info,
  Languages,
  LogIn,
  LogOut,
  MoonStar,
  NotebookPen,
  Palette,
  RotateCcw,
  ScrollText,
  Route,
  Settings2,
  ShieldCheck,
  Smartphone,
  SunMedium,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useDialog } from '../shared/useDialog';
import { AccountScreen } from './AccountScreen';
// The screens are loaded on demand; only their metadata is needed to draw
// the hub tiles.
const LegacyFeatureScreen = lazy(() => import('./LegacyFeatureScreens')
  .then((module) => ({ default: module.LegacyFeatureScreen })));
import { releaseReadyServiceLegacyFeatures } from '../data/legacyFeatures';
import type { LegacyFeatureId } from '../data/legacyFeatures';
import { NotesScreen } from './NotesScreen';
import { getCachedSession, signOut, subscribeAuth } from '../services/nurBackend';
import type { NurSession } from '../services/nurBackend';
import { OBLIGATORY_PRAYER_IDS } from '../services/prayerSchedule';
import { hasReliableSharedPrayerTimes } from '../services/prayerReminderService';
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
import { getTheme, setTheme as applyTheme } from '../services/themeService';
import type { NurTheme } from '../services/themeService';

export type MoreDestination = 'prayer' | 'learn' | 'quran' | 'dhikr' | 'qibla' | 'duas' | 'names' | 'mosques' | 'calendar' | 'collections' | 'legal';

type ProfileAction = 'appearance' | 'language' | 'settings' | 'onboarding' | 'support' | 'about';
type Subscreen = 'account' | 'notes' | null;

type ProfileRow = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action?: ProfileAction;
  destination?: MoreDestination;
  subscreen?: Exclude<Subscreen, null>;
};

type CoreShortcut = {
  destination: MoreDestination;
  title: string;
  description: string;
  icon: NurIcon;
};

const coreShortcuts: CoreShortcut[] = [
  { destination: 'prayer', title: 'Gebete', description: 'Zeiten & Tracker', icon: NurPrayerTimesIcon },
  { destination: 'learn', title: 'Beten lernen', description: 'Wudu & Salah', icon: NurMihrabIcon },
  { destination: 'quran', title: 'Quran', description: 'Alle 114 Suren', icon: NurQuranIcon },
  { destination: 'dhikr', title: 'Dhikr', description: 'Zähler & Tagesziel', icon: NurTasbihIcon },
  { destination: 'qibla', title: 'Qibla', description: 'Live-Kompass', icon: NurQiblaIcon },
  { destination: 'duas', title: 'Duas', description: 'Für jeden Moment', icon: NurDuaIcon },
  { destination: 'names', title: 'Namen Allahs', description: 'Alle 99 Namen', icon: NurRosetteIcon },
  { destination: 'mosques', title: 'Moscheen', description: 'In deiner Nähe', icon: NurMosqueIcon },
  { destination: 'calendar', title: 'Kalender', description: 'Islamische Tage', icon: NurCalendarIcon },
  { destination: 'collections', title: 'Sammlung', description: 'Favoriten & Lesezeichen', icon: NurBookmarkIcon },
];

const journeyRows: ProfileRow[] = [
  { id: 'journey', title: 'Meine Reise', description: 'Deinen Lernfortschritt ansehen', icon: Route, destination: 'learn' },
  { id: 'bookmarks', title: 'Lesezeichen', description: 'Gespeicherte Verse und Inhalte', icon: Bookmark, destination: 'collections' },
  { id: 'notes', title: 'Notizen', description: 'Lokal oder geschützt in der Cloud', icon: NotebookPen, subscreen: 'notes' },
  { id: 'reminders', title: 'Erinnerungen', description: 'Gebete direkt verwalten', icon: BellRing, destination: 'prayer' },
];

const preferenceRows: ProfileRow[] = [
  { id: 'appearance', title: 'Erscheinungsbild', description: 'Dunkel, hell oder System', icon: Palette, action: 'appearance' },
  { id: 'language', title: 'Sprache', description: 'Aktuell vollständig: Deutsch', icon: Languages, action: 'language' },
  { id: 'settings', title: 'Einstellungen', description: 'Reminder, Konto und Cloud', icon: Settings2, action: 'settings' },
];

const supportRows: ProfileRow[] = [
  { id: 'onboarding', title: 'Einführung wiederholen', description: 'Premium-Einstieg erneut ansehen', icon: RotateCcw, action: 'onboarding' },
  { id: 'help', title: 'Hilfe & Datenschutz', description: 'Datenquellen und lokale Speicherung', icon: CircleHelp, action: 'support' },
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
  const [subscreen, setSubscreen] = useState<Subscreen>(null);
  const [legacyFeature, setLegacyFeature] = useState<LegacyFeatureId | null>(null);
  const [theme, setThemeState] = useState<NurTheme>(() => getTheme());
  const [notifications, setNotifications] = useState(readReminderEnabled);
  const [prayerTimesReliable, setPrayerTimesReliable] = useState(hasReliableSharedPrayerTimes);
  const [session, setSession] = useState<NurSession | null>(() => getCachedSession());
  const [toast, setToast] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const closeDialog = useCallback(() => { setModal(null); }, []);
  const screenDialog = useDialog(Boolean(modal), closeDialog, 'Einstellungen');
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, .36, 1] as const };
  const microTransition = { duration: reduceMotion ? 0 : .18, ease: [0.22, 1, .36, 1] as const };
  const itemTransition = (index: number) => ({ duration: reduceMotion ? 0 : .2, delay: reduceMotion ? 0 : Math.min(index * .02, .1), ease: [0.22, 1, .36, 1] as const });

  const userName = readUserName(session);

  useEffect(() => subscribeAuth(setSession), []);
  useEffect(() => {
    const syncReliability = () => setPrayerTimesReliable(hasReliableSharedPrayerTimes());
    window.addEventListener('nur:prayer-times-updated', syncReliability);
    syncReliability();
    return () => window.removeEventListener('nur:prayer-times-updated', syncReliability);
  }, []);

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
    if (row.subscreen) return setSubscreen(row.subscreen);
    if (row.action) setModal(row.action);
  };

  const chooseTheme = (next: NurTheme) => {
    setThemeState(next);
    applyTheme(next);
    flash('Erscheinungsbild gespeichert');
  };

  const toggleNotifications = async () => {
    if (notifications) {
      try { localStorage.setItem('nur_prayer_notifications', '[]'); } catch { /* optional */ }
      setNotifications(false);
      flash('Gebetserinnerungen ausgeschaltet');
      return;
    }

    if (!prayerTimesReliable) {
      flash('Aktuelle Gebetszeiten fehlen. Öffne zuerst „Gebete“ und lade Zeiten für deinen Standort.');
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

  const repeatOnboarding = () => {
    try { localStorage.removeItem('nur_onboarding_complete'); } finally { window.location.reload(); }
  };

  const logout = async () => {
    if (!session) {
      setSubscreen('account');
      return;
    }
    await signOut();
    setSession(null);
    flash('Abgemeldet. Lokale Daten bleiben auf diesem Gerät erhalten.');
  };

  if (subscreen === 'account') return <AccountScreen onBack={() => setSubscreen(null)} />;
  if (subscreen === 'notes') return <NotesScreen onBack={() => setSubscreen(null)} onOpenAccount={() => setSubscreen('account')} />;
  if (legacyFeature) {
    return (
      <Suspense fallback={<div className="screen-lazy-fallback" aria-busy="true" />}>
        <LegacyFeatureScreen featureId={legacyFeature} onBack={() => setLegacyFeature(null)} />
      </Suspense>
    );
  }

  return (
    <motion.main className="screen reference-profile-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite"><ChevronLeft size={20} /></button>
        <div><span className="overline">Profil & Einstellungen</span><h1>Mehr</h1></div>
        <button className="icon-button" onClick={() => setModal('settings')} aria-label="Einstellungen"><Settings2 size={20} /></button>
      </header>

      <section className="reference-profile-greeting">
        <span className="reference-profile-greeting__logo"><PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem-v2.webp" fallback={<NurMark />} /></span>
        <div><span className="overline">Assalamu Alaikum</span><h2>{userName}</h2><p>{session ? 'Dein Konto ist verbunden. Lokale Daten kannst du in Nur Cloud sichern.' : 'Die App funktioniert lokal ohne Konto. Cloud-Sicherung ist optional.'}</p></div>
        <span className="reference-profile-avatar">{initials}</span>
      </section>

      <button className="reference-account-entry" onClick={() => setSubscreen('account')}>
        <span>{session ? <Cloud size={20} /> : <LogIn size={20} />}</span>
        <span><strong>{session ? 'Nur Cloud verbunden' : 'Konto & Cloud'}</strong><small>{session ? session.user.email : 'Anmelden, registrieren und Fortschritt sichern'}</small></span>
        <ChevronRight size={18} />
      </button>

      <section className="reference-profile-section reference-core-access">
        <div className="reference-core-access__heading"><span className="reference-profile-section__label">Direktzugriff</span><small>Alle zentralen Bereiche ohne Umwege</small></div>
        <div className="reference-core-access-grid">
          {coreShortcuts.map((shortcut, index) => {
            const Icon = shortcut.icon;
            return (
              <motion.button key={shortcut.destination} onClick={() => onNavigate(shortcut.destination)} initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={itemTransition(index)} whileTap={{ scale: reduceMotion ? 1 : .985 }}>
                <span className="reference-core-access-grid__icon"><Icon size={20} /></span>
                <span><strong>{shortcut.title}</strong><small>{shortcut.description}</small></span>
                <ChevronRight size={16} />
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="reference-profile-section"><span className="reference-profile-section__label">Deine Inhalte</span><ProfileList rows={journeyRows} onSelect={selectRow} /></section>

      {releaseReadyServiceLegacyFeatures.length ? (
        <section className="reference-profile-section reference-services-section">
          <span className="reference-profile-section__label">Geprüfte Zusatzdienste</span>
          <p className="reference-services-section__intro">Nur Zusatzfunktionen, die für den öffentlichen Release ausdrücklich freigegeben wurden.</p>
          <div className="reference-services-grid">
            {releaseReadyServiceLegacyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.button key={feature.id} onClick={() => setLegacyFeature(feature.id)} initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }} animate={{ opacity: 1, y: 0 }} transition={itemTransition(index)} whileTap={{ scale: reduceMotion ? 1 : .985 }}>
                  <span className="reference-services-grid__icon"><Icon size={21} /></span>
                  <span><small>{feature.subtitle}</small><strong>{feature.title}</strong></span>
                  <ChevronRight size={17} />
                </motion.button>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="reference-profile-section"><span className="reference-profile-section__label">Personalisierung</span><ProfileList rows={preferenceRows} onSelect={selectRow} /></section>
      <section className="reference-profile-section"><span className="reference-profile-section__label">Informationen</span><ProfileList rows={supportRows} onSelect={selectRow} /></section>

      <button className="reference-profile-logout" onClick={() => void logout()}>{session ? <><LogOut size={18} /> Abmelden</> : <><LogIn size={18} /> Konto öffnen</>}</button>

      <AnimatePresence>
        {modal ? (
          <motion.div className="reference-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={microTransition} onClick={() => setModal(null)}>
            <motion.section {...screenDialog.props} className="reference-profile-modal" initial={{ opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : .99 }} transition={screenTransition} onClick={(event) => event.stopPropagation()}>
              <button className="reference-modal-close" onClick={() => setModal(null)} aria-label="Schließen"><X size={18} /></button>

              {modal === 'appearance' ? (
                <>
                  <span className="reference-profile-modal__icon"><Palette size={28} /></span><span className="overline">Personalisierung</span><h2>Erscheinungsbild</h2><p>Die Auswahl wird sofort auf die App angewendet und auf diesem Gerät gespeichert.</p>
                  <div className="reference-choice-grid">
                    {([
                      ['dark', 'Dunkel', MoonStar],
                      ['system', 'System', Smartphone],
                      ['light', 'Hell', SunMedium],
                    ] as const).map(([value, label, Icon]) => <button key={value} className={theme === value ? 'reference-choice reference-choice--active' : 'reference-choice'} onClick={() => chooseTheme(value)}><Icon size={20} /><span>{label}</span>{theme === value ? <CircleCheck size={16} /> : null}</button>)}
                  </div>
                </>
              ) : null}

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
                    <button onClick={() => void toggleNotifications()}><span><BellRing size={19} /><span><strong>Gebetserinnerungen</strong><small>{notifications ? prayerTimesReliable ? 'Mindestens ein Gebet ist aktiv' : 'Gespeichert · pausiert bis aktuelle Zeiten verfügbar sind' : prayerTimesReliable ? 'Keine Gebetserinnerungen aktiv' : 'Aktuelle Gebetszeiten zuerst laden'}</small></span></span><em className={notifications && prayerTimesReliable ? 'is-on' : ''}><i /></em></button>
                    <button onClick={() => { setModal(null); setSubscreen('account'); }}><span><Cloud size={19} /><span><strong>Cloud-Synchronisierung</strong><small>{session ? 'Konto verbunden · Backup verwalten' : 'Konto erforderlich'}</small></span></span><ChevronRight size={18} /></button>
                  </div>
                </>
              ) : null}

              {modal === 'onboarding' ? (
                <>
                  <span className="reference-profile-modal__icon"><RotateCcw size={28} /></span><span className="overline">App-Einführung</span><h2>Einführung wiederholen</h2><p>Nur der Onboarding-Status wird zurückgesetzt. Tracker, Favoriten, Termine und Notizen bleiben erhalten.</p>
                  <div className="reference-category-modal__meta"><span><CircleCheck size={16} /> Termine bleiben erhalten</span><span><CircleCheck size={16} /> Gebets-Tracker bleibt erhalten</span><span><CircleCheck size={16} /> Nur die Einführung startet neu</span></div>
                  <button className="gold-button" onClick={repeatOnboarding}>Einführung starten <RotateCcw size={17} /></button>
                </>
              ) : null}

              {modal === 'support' ? (
                <>
                  <span className="reference-profile-modal__icon"><ShieldCheck size={28} /></span><span className="overline">Hilfe & Datenschutz</span><h2>Was die App verarbeitet</h2><p>Fortschritt bleibt standardmäßig lokal. Bei freiwilliger Standortnutzung wird der Gerätestandort für die persönliche Qibla und als gemeinsamer Gebetsstandort gespeichert; für Live-Gebetszeiten können die Koordinaten an AlAdhan und für die Moschee-Suche an öffentliche OpenStreetMap/Overpass-Dienste übertragen werden. Alle 114 Quran-Suren liegen offline vor; Al Quran Cloud dient nur als technischer Fallback, falls eine lokale Quran-Datei fehlt oder nicht lesbar ist.</p>
                  <div className="reference-category-modal__meta"><span><CircleCheck size={16} /> Cloud nur nach Anmeldung und bewusster Sicherung</span><span><CircleCheck size={16} /> Keine Werbe-Tracker im App-Code</span><span><CircleCheck size={16} /> Religiöse Hinweise ersetzen keine Fatwa</span></div>
                </>
              ) : null}

              {modal === 'about' ? (
                <>
                  <span className="reference-profile-modal__icon"><Info size={28} /></span><span className="overline">Nur Islam</span><h2>Premium-App</h2><p>Nur bündelt Gebetszeiten, Quran, Dhikr, Qibla, Duas, Lernen, Moschee-Suche und persönliche Fortschritte in einer ruhigen Oberfläche. Quellen und Unsicherheiten werden sichtbar gekennzeichnet.</p>
                  <div className="reference-category-modal__meta"><span><CircleCheck size={16} /> React + TypeScript + PWA</span><span><CircleCheck size={16} /> Supabase Auth und RLS-geschützte Cloud</span><span><CircleCheck size={16} /> Lokaler Offline-First-Ansatz</span></div>
                </>
              ) : null}

              {modal !== 'onboarding' ? <button className="gold-button" onClick={() => setModal(null)}>Fertig <CircleCheck size={17} /></button> : null}
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }} transition={microTransition}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
