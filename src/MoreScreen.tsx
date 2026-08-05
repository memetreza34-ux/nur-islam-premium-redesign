import { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BellRing,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  Cloud,
  Globe2,
  Info,
  Languages,
  LogOut,
  MoonStar,
  NotebookPen,
  Palette,
  RotateCcw,
  Route,
  Settings2,
  Smartphone,
  SunMedium,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { LegacyFeatureScreen, serviceLegacyFeatures } from './LegacyFeatureScreens';
import type { LegacyFeatureId } from './LegacyFeatureScreens';
import { NurMark, PremiumImage } from './PremiumVisuals';

type ProfileAction = 'appearance' | 'language' | 'settings' | 'onboarding';

type ProfileRow = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action?: ProfileAction;
};

type ModalMode = ProfileAction | null;

const journeyRows: ProfileRow[] = [
  { id: 'journey', title: 'Meine Reise', description: 'Deinen spirituellen Fortschritt ansehen', icon: Route },
  { id: 'bookmarks', title: 'Lesezeichen', description: 'Gespeicherte Verse und Inhalte', icon: Bookmark },
  { id: 'notes', title: 'Notizen', description: 'Deine persönlichen Gedanken', icon: NotebookPen },
  { id: 'reminders', title: 'Erinnerungen', description: 'Gebete und Lernziele verwalten', icon: BellRing },
];

const preferenceRows: ProfileRow[] = [
  { id: 'appearance', title: 'Erscheinungsbild', description: 'Darstellung der App auswählen', icon: Palette, action: 'appearance' },
  { id: 'language', title: 'Sprache', description: 'Bevorzugte Sprache festlegen', icon: Languages, action: 'language' },
  { id: 'settings', title: 'Einstellungen', description: 'App-Einstellungen verwalten', icon: Settings2, action: 'settings' },
];

const supportRows: ProfileRow[] = [
  { id: 'onboarding', title: 'Einführung wiederholen', description: 'Premium-Einstieg erneut ansehen', icon: RotateCcw, action: 'onboarding' },
  { id: 'help', title: 'Hilfe & Support', description: 'Hilfe erhalten und Kontakt aufnehmen', icon: CircleHelp },
  { id: 'about', title: 'Über Nur', description: 'Mehr über die App erfahren', icon: Info },
];

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
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

export function MoreScreen({ onBack }: { onBack: () => void }) {
  const [modal, setModal] = useState<ModalMode>(null);
  const [legacyFeature, setLegacyFeature] = useState<LegacyFeatureId | null>(null);
  const [theme, setTheme] = useState(() => readStored('premium_theme', 'Dunkel'));
  const [language, setLanguage] = useState(() => readStored('premium_language', 'Deutsch'));
  const [notifications, setNotifications] = useState(() => readStored('premium_prayer_notifications', true));
  const [cloudSync, setCloudSync] = useState(() => readStored('premium_cloud_sync', false));
  const [toast, setToast] = useState<string | null>(null);
  const userName = readStored('premium_user_name', 'Nur Nutzer');

  const initials = useMemo(() => {
    const clean = userName.trim();
    return clean ? clean.slice(0, 2).toUpperCase() : 'NI';
  }, [userName]);

  useEffect(() => {
    try {
      localStorage.setItem('premium_theme', JSON.stringify(theme));
      localStorage.setItem('premium_language', JSON.stringify(language));
      localStorage.setItem('premium_prayer_notifications', JSON.stringify(notifications));
      localStorage.setItem('premium_cloud_sync', JSON.stringify(cloudSync));
    } catch {
      // Local persistence remains optional in restricted browser modes.
    }
  }, [theme, language, notifications, cloudSync]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const selectRow = (row: ProfileRow) => {
    if (row.action) setModal(row.action);
    else flash(`${row.title} geöffnet`);
  };

  const closeOrApplyModal = () => {
    if (modal === 'onboarding') {
      try {
        localStorage.removeItem('nur_onboarding_complete');
      } finally {
        window.location.reload();
      }
      return;
    }

    setModal(null);
    flash('Einstellung gespeichert');
  };

  if (legacyFeature) {
    return <LegacyFeatureScreen featureId={legacyFeature} onBack={() => setLegacyFeature(null)} />;
  }

  return (
    <motion.main className="screen reference-profile-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite"><ChevronLeft size={20} /></button>
        <div><span className="overline">Profil & Einstellungen</span><h1>Mehr</h1></div>
        <button className="icon-button" onClick={() => setModal('settings')} aria-label="Einstellungen"><Settings2 size={20} /></button>
      </header>

      <section className="reference-profile-greeting">
        <span className="reference-profile-greeting__logo"><PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem.webp" fallback={<NurMark />} /></span>
        <div><span className="overline">Assalamu Alaikum</span><h2>{userName}</h2><p>Möge Allah deine Bemühungen annehmen und dich stets im Guten leiten.</p></div>
        <span className="reference-profile-avatar">{initials}</span>
      </section>

      <section className="reference-profile-section"><span className="reference-profile-section__label">Deine Inhalte</span><ProfileList rows={journeyRows} onSelect={selectRow} /></section>

      <section className="reference-profile-section reference-services-section">
        <span className="reference-profile-section__label">Islamische Dienste</span>
        <p className="reference-services-section__intro">Die wichtigen Zusatzfunktionen der alten App bleiben erhalten und folgen jetzt dem neuen Premium-Aufbau.</p>
        <div className="reference-services-grid">
          {serviceLegacyFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={feature.id}
                onClick={() => setLegacyFeature(feature.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * .035 }}
                whileTap={{ scale: .98 }}
              >
                <span className="reference-services-grid__icon"><Icon size={21} /></span>
                <span><small>{feature.subtitle}</small><strong>{feature.title}</strong></span>
                <ChevronRight size={17} />
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="reference-profile-section"><span className="reference-profile-section__label">Personalisierung</span><ProfileList rows={preferenceRows} onSelect={selectRow} /></section>
      <section className="reference-profile-section"><span className="reference-profile-section__label">Informationen</span><ProfileList rows={supportRows} onSelect={selectRow} /></section>

      <button className="reference-profile-logout" onClick={() => flash('Du bleibst lokal angemeldet, bis Firebase verbunden wird')}><LogOut size={18} /> Abmelden</button>

      <AnimatePresence>
        {modal ? (
          <motion.div className="reference-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)}>
            <motion.section className="reference-profile-modal" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: .98 }} onClick={(event) => event.stopPropagation()}>
              <button className="reference-modal-close" onClick={() => setModal(null)} aria-label="Schließen"><X size={18} /></button>

              {modal === 'appearance' ? (
                <>
                  <span className="reference-profile-modal__icon"><Palette size={28} /></span><span className="overline">Personalisierung</span><h2>Erscheinungsbild</h2><p>Das dunkle Smaragd-Design bleibt die Hauptdarstellung der Premium-App.</p>
                  <div className="reference-choice-grid">
                    {[
                      ['Dunkel', MoonStar],
                      ['System', Smartphone],
                      ['Hell', SunMedium],
                    ].map(([label, Icon]) => {
                      const ChoiceIcon = Icon as LucideIcon;
                      return <button key={label as string} className={theme === label ? 'reference-choice reference-choice--active' : 'reference-choice'} onClick={() => setTheme(label as string)}><ChoiceIcon size={20} /><span>{label as string}</span>{theme === label ? <CircleCheck size={16} /> : null}</button>;
                    })}
                  </div>
                </>
              ) : null}

              {modal === 'language' ? (
                <>
                  <span className="reference-profile-modal__icon"><Languages size={28} /></span><span className="overline">App-Sprache</span><h2>Sprache</h2><p>Wähle die Sprache für Navigation und Inhalte.</p>
                  <div className="reference-choice-grid">{['Deutsch', 'Arabisch', 'Englisch'].map((item) => <button key={item} className={language === item ? 'reference-choice reference-choice--active' : 'reference-choice'} onClick={() => setLanguage(item)}><Globe2 size={20} /><span>{item}</span>{language === item ? <CircleCheck size={16} /> : null}</button>)}</div>
                </>
              ) : null}

              {modal === 'settings' ? (
                <>
                  <span className="reference-profile-modal__icon"><Settings2 size={28} /></span><span className="overline">App-Einstellungen</span><h2>Einstellungen</h2><p>Die wichtigsten Funktionen bleiben direkt erreichbar.</p>
                  <div className="reference-settings-toggles">
                    <button onClick={() => setNotifications((value) => !value)}><span><BellRing size={19} /><span><strong>Gebetserinnerungen</strong><small>Benachrichtigungen zu Gebetszeiten</small></span></span><em className={notifications ? 'is-on' : ''}><i /></em></button>
                    <button onClick={() => setCloudSync((value) => !value)}><span><Cloud size={19} /><span><strong>Cloud-Synchronisierung</strong><small>Fortschritt und Favoriten sichern</small></span></span><em className={cloudSync ? 'is-on' : ''}><i /></em></button>
                  </div>
                </>
              ) : null}

              {modal === 'onboarding' ? (
                <>
                  <span className="reference-profile-modal__icon"><RotateCcw size={28} /></span><span className="overline">App-Einführung</span><h2>Einführung wiederholen</h2><p>Die App startet neu und zeigt anschließend wieder alle drei Premium-Einstiegsseiten inklusive Standort- und Erinnerungsoptionen.</p>
                  <div className="reference-category-modal__meta"><span><CircleCheck size={16} /> Deine Termine bleiben gespeichert</span><span><CircleCheck size={16} /> Gebets-Tracker bleibt erhalten</span><span><CircleCheck size={16} /> Nur die Einführung wird zurückgesetzt</span></div>
                </>
              ) : null}

              <button className="gold-button" onClick={closeOrApplyModal}>{modal === 'onboarding' ? 'Einführung starten' : 'Fertig'} {modal === 'onboarding' ? <RotateCcw size={17} /> : <CircleCheck size={17} />}</button>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
