import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BellRing,
  Calculator,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Cloud,
  CloudOff,
  Database,
  FileText,
  Globe2,
  HelpCircle,
  Languages,
  LayoutGrid,
  LocateFixed,
  MapPin,
  MessageSquareText,
  MoonStar,
  RotateCcw,
  Search,
  Settings2,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type ToggleRowProps = {
  icon: typeof Bell;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
};

type InfoModal = {
  title: string;
  body: string;
} | null;

const languages = ['Deutsch', 'English', 'العربية', 'Français', 'Türkçe', 'اردو', 'Bahasa Indonesia', 'Español', 'فارسی', 'Русский', 'বাংলা'];
const themes = ['System', 'Hell', 'Dunkel', 'Grün'];
const methods = ['Diyanet', 'Muslim World League', 'Umm al-Qura', 'Karachi'];
const madhabs = ['Standard', 'Hanafi'];

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function ToggleRow({ icon: Icon, title, description, enabled, onToggle }: ToggleRowProps) {
  return (
    <div className="settings-row">
      <span className="settings-row__icon"><Icon size={20} /></span>
      <span className="settings-row__copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <button
        type="button"
        className={enabled ? 'premium-switch premium-switch--on' : 'premium-switch'}
        onClick={onToggle}
        role="switch"
        aria-checked={enabled}
        aria-label={title}
      >
        <span />
      </button>
    </div>
  );
}

function SelectRow({
  icon: Icon,
  title,
  value,
  options,
  onChange,
}: {
  icon: typeof Bell;
  title: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="settings-row settings-row--select">
      <span className="settings-row__icon"><Icon size={20} /></span>
      <span className="settings-row__copy">
        <strong>{title}</strong>
        <small>{value}</small>
      </span>
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={title}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

export function MoreScreen({ onBack }: { onBack: () => void }) {
  const [userName, setUserName] = useState(() => readStored('premium_user_name', 'Gast'));
  const [accountPreview, setAccountPreview] = useState(false);
  const [theme, setTheme] = useState(() => readStored('premium_theme', 'System'));
  const [language, setLanguage] = useState(() => readStored('premium_language', 'Deutsch'));
  const [city, setCity] = useState(() => readStored('premium_city', 'Berlin'));
  const [useLocation, setUseLocation] = useState(() => readStored('premium_location', true));
  const [method, setMethod] = useState(() => readStored('premium_method', 'Diyanet'));
  const [madhab, setMadhab] = useState(() => readStored('premium_madhab', 'Standard'));
  const [radius, setRadius] = useState(() => readStored('premium_radius', 10));
  const [prayerNotifications, setPrayerNotifications] = useState(() => readStored('premium_prayer_notifications', true));
  const [leadTime, setLeadTime] = useState(() => readStored('premium_lead_time', 0));
  const [prayerAlerts, setPrayerAlerts] = useState<Record<string, boolean>>(() => readStored('premium_prayer_alerts', {
    Fajr: true,
    Dhuhr: true,
    Asr: false,
    Maghrib: true,
    Isha: true,
  }));
  const [fastingReminder, setFastingReminder] = useState(() => readStored('premium_fasting', true));
  const [dailyImpulse, setDailyImpulse] = useState(() => readStored('premium_impulse', true));
  const [hadithAyah, setHadithAyah] = useState(() => readStored('premium_hadith', true));
  const [compactCards, setCompactCards] = useState(() => readStored('premium_compact', false));
  const [toast, setToast] = useState<string | null>(null);
  const [infoModal, setInfoModal] = useState<InfoModal>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const initials = useMemo(() => {
    const clean = userName.trim();
    return clean ? clean.slice(0, 2).toUpperCase() : 'NI';
  }, [userName]);

  useEffect(() => {
    const values: Record<string, unknown> = {
      premium_user_name: userName,
      premium_theme: theme,
      premium_language: language,
      premium_city: city,
      premium_location: useLocation,
      premium_method: method,
      premium_madhab: madhab,
      premium_radius: radius,
      premium_prayer_notifications: prayerNotifications,
      premium_lead_time: leadTime,
      premium_prayer_alerts: prayerAlerts,
      premium_fasting: fastingReminder,
      premium_impulse: dailyImpulse,
      premium_hadith: hadithAyah,
      premium_compact: compactCards,
    };
    Object.entries(values).forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)));
  }, [userName, theme, language, city, useLocation, method, madhab, radius, prayerNotifications, leadTime, prayerAlerts, fastingReminder, dailyImpulse, hadithAyah, compactCards]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const clearLocalHistory = () => {
    ['premium_recent_quran', 'premium_search_history', 'premium_recent_pages'].forEach((key) => localStorage.removeItem(key));
    setConfirmClear(false);
    flash('Lokaler Verlauf wurde gelöscht');
  };

  return (
    <motion.main
      className="screen more-screen"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="settings-header glass-card">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite"><ChevronLeft size={20} /></button>
        <div>
          <span className="overline">Nur Islam</span>
          <h1>Mehr & Einstellungen</h1>
        </div>
        <span className="settings-header__mark"><Settings2 size={22} /></span>
      </header>

      <section className="account-card">
        <div className="account-card__ornament" aria-hidden="true">۞</div>
        <div className="account-avatar">{accountPreview ? initials : <UserRound size={32} />}</div>
        <div className="account-card__copy">
          <span className="overline">Konto & Cloud</span>
          <h2>{accountPreview ? userName || 'Nur Islam Nutzer' : 'Nicht angemeldet'}</h2>
          <p>{accountPreview ? 'Vorschau: Cloud-Synchronisierung aktiv' : 'Synchronisiere Favoriten, Fortschritt und Einstellungen.'}</p>
        </div>
        <div className="account-status">
          {accountPreview ? <Cloud size={17} /> : <CloudOff size={17} />}
          <span>{accountPreview ? 'Aktiv' : 'Lokal'}</span>
        </div>
        <button
          className={accountPreview ? 'account-button account-button--secondary' : 'account-button'}
          onClick={() => {
            setAccountPreview((value) => !value);
            flash(accountPreview ? 'Kontovorschau beendet' : 'Kontovorschau aktiviert – Firebase folgt beim Funktionsimport');
          }}
        >
          {accountPreview ? 'Vorschau beenden' : 'Konto-Vorschau'}
        </button>
      </section>

      <section className="settings-section glass-card">
        <div className="settings-section__title">
          <span className="settings-section__badge"><UserRound size={17} /></span>
          <div><span className="overline">Allgemein</span><h2>Profil & App</h2></div>
        </div>

        <label className="settings-row settings-row--input">
          <span className="settings-row__icon"><UserRound size={20} /></span>
          <span className="settings-row__copy"><strong>Name</strong><small>Wird in der Begrüßung verwendet</small></span>
          <input value={userName} onChange={(event) => setUserName(event.target.value)} placeholder="Dein Name" />
        </label>
        <SelectRow icon={MoonStar} title="Erscheinungsbild" value={theme} options={themes} onChange={setTheme} />
        <SelectRow icon={Languages} title="Sprache" value={language} options={languages} onChange={setLanguage} />
        <label className="settings-row settings-row--input">
          <span className="settings-row__icon"><MapPin size={20} /></span>
          <span className="settings-row__copy"><strong>Stadt</strong><small>{useLocation ? 'GPS hat Vorrang' : 'Manuell ausgewählt'}</small></span>
          <input value={city} onChange={(event) => setCity(event.target.value)} />
        </label>
        <ToggleRow icon={LocateFixed} title="Standort verwenden" description="Genauere Gebetszeiten für deinen Standort" enabled={useLocation} onToggle={() => setUseLocation((value) => !value)} />
        <SelectRow icon={Calculator} title="Berechnungsmethode" value={method} options={methods} onChange={setMethod} />
        <SelectRow icon={Clock3} title="Asr-Methode (Madhab)" value={madhab} options={madhabs} onChange={setMadhab} />

        <div className="settings-row settings-row--range">
          <span className="settings-row__icon"><Search size={20} /></span>
          <span className="settings-row__copy"><strong>Moschee-Suchradius</strong><small>Umkreis für die Moschee-Suche</small></span>
          <div className="range-control">
            <input type="range" min="1" max="50" value={radius} onChange={(event) => setRadius(Number(event.target.value))} />
            <strong>{radius} km</strong>
          </div>
        </div>
      </section>

      <section className="settings-section glass-card">
        <div className="settings-section__title">
          <span className="settings-section__badge"><BellRing size={17} /></span>
          <div><span className="overline">Benachrichtigungen</span><h2>Gebete & Impulse</h2></div>
        </div>

        <ToggleRow icon={BellRing} title="Gebetsbenachrichtigungen" description="Adhan und Erinnerungen aktivieren" enabled={prayerNotifications} onToggle={() => setPrayerNotifications((value) => !value)} />

        <div className={prayerNotifications ? 'notification-details notification-details--open' : 'notification-details'}>
          <div className="lead-time-control">
            <span><strong>Vorlaufzeit</strong><small>Wann möchtest du erinnert werden?</small></span>
            <div>
              {[0, 5, 10, 15].map((minutes) => (
                <button key={minutes} className={leadTime === minutes ? 'choice-pill choice-pill--active' : 'choice-pill'} onClick={() => setLeadTime(minutes)}>
                  {minutes === 0 ? 'Genau' : `${minutes} Min.`}
                </button>
              ))}
            </div>
          </div>

          <div className="prayer-alert-grid">
            {Object.entries(prayerAlerts).map(([prayer, enabled]) => (
              <button
                key={prayer}
                className={enabled ? 'prayer-alert-chip prayer-alert-chip--on' : 'prayer-alert-chip'}
                onClick={() => setPrayerAlerts((current) => ({ ...current, [prayer]: !current[prayer] }))}
                aria-pressed={enabled}
              >
                {enabled ? <CircleCheck size={16} /> : <Bell size={16} />}{prayer}
              </button>
            ))}
          </div>
        </div>

        <ToggleRow icon={MoonStar} title="Fasten-Erinnerung" description="Freiwillige und besondere Fastentage" enabled={fastingReminder} onToggle={() => setFastingReminder((value) => !value)} />
        <ToggleRow icon={Sparkles} title="Täglicher Impuls" description="Ein ruhiger islamischer Tagesimpuls" enabled={dailyImpulse} onToggle={() => setDailyImpulse((value) => !value)} />
        <ToggleRow icon={FileText} title="Hadith & Ayah" description="Tägliche Inhalte aus Quran und Sunnah" enabled={hadithAyah} onToggle={() => setHadithAyah((value) => !value)} />
      </section>

      <section className="settings-section glass-card">
        <div className="settings-section__title">
          <span className="settings-section__badge"><LayoutGrid size={17} /></span>
          <div><span className="overline">Personalisierung</span><h2>Darstellung & Daten</h2></div>
        </div>

        <button className="settings-action-row" onClick={() => flash('Standby-Modus geöffnet')}>
          <span className="settings-row__icon"><Clock3 size={20} /></span><span><strong>Standby-Modus</strong><small>Ruhige Vollbildansicht der Gebetszeiten</small></span><ChevronRight size={19} />
        </button>
        <ToggleRow icon={LayoutGrid} title="Kompakte Karten" description="Mehr Inhalte auf kleinerem Raum" enabled={compactCards} onToggle={() => setCompactCards((value) => !value)} />
        <button className="settings-action-row" onClick={() => flash('Tasbih-Zähler wurde zurückgesetzt')}>
          <span className="settings-row__icon"><RotateCcw size={20} /></span><span><strong>Tasbih zurücksetzen</strong><small>Dhikr-Zähler auf null setzen</small></span><ChevronRight size={19} />
        </button>
        <button className="settings-action-row settings-action-row--danger" onClick={() => setConfirmClear(true)}>
          <span className="settings-row__icon"><Trash2 size={20} /></span><span><strong>Verlauf löschen</strong><small>Lokale Lese- und Suchhistorie entfernen</small></span><ChevronRight size={19} />
        </button>
      </section>

      <section className="settings-section glass-card">
        <div className="settings-section__title">
          <span className="settings-section__badge"><ShieldCheck size={17} /></span>
          <div><span className="overline">Informationen</span><h2>App & Rechtliches</h2></div>
        </div>

        {[
          { icon: Star, title: 'App bewerten', description: 'Dein Feedback hilft bei der Weiterentwicklung', action: () => flash('Bewertungsdialog geöffnet') },
          { icon: Share2, title: 'App teilen', description: 'Nur Islam weiterempfehlen', action: () => flash('Teilen-Menü geöffnet') },
          { icon: MessageSquareText, title: 'Feedback senden', description: 'Ideen oder Fehler melden', action: () => flash('Feedback geöffnet') },
          { icon: Database, title: 'Quellen', description: 'Informationen zu Quran-, Hadith- und Gebetsdaten', action: () => setInfoModal({ title: 'Quellen', body: 'Hier werden die geprüften Datenquellen der produktiven App transparent aufgeführt. Beim Funktionsimport bleiben die bestehenden Quellenangaben erhalten.' }) },
          { icon: ShieldCheck, title: 'Datenschutz', description: 'Informationen zur Datenverarbeitung', action: () => setInfoModal({ title: 'Datenschutz', body: 'Lokale Einstellungen dieses Prototyps werden ausschließlich im Browser gespeichert. Firebase und Cloud-Synchronisierung werden erst beim Import der echten App-Funktionen verbunden.' }) },
          { icon: FileText, title: 'Impressum & Lizenzen', description: 'Rechtliche Hinweise und Open-Source-Lizenzen', action: () => setInfoModal({ title: 'Impressum & Lizenzen', body: 'Dieser Bereich erhält im produktiven Stand die echten Anbieterangaben, Kontaktinformationen und verwendeten Open-Source-Lizenzen.' }) },
          { icon: HelpCircle, title: 'Hilfe & Support', description: 'Antworten und Kontaktmöglichkeiten', action: () => flash('Hilfe-Bereich geöffnet') },
        ].map(({ icon: Icon, title, description, action }) => (
          <button className="settings-action-row" key={title} onClick={action}>
            <span className="settings-row__icon"><Icon size={20} /></span><span><strong>{title}</strong><small>{description}</small></span><ChevronRight size={19} />
          </button>
        ))}

        <div className="settings-footer">
          <Globe2 size={18} />
          <span><strong>Nur Islam Premium Redesign</strong><small>Design-Prototyp · Version 0.2</small></span>
        </div>
      </section>

      <AnimatePresence>
        {toast ? (
          <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <CircleCheck size={18} /> {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {infoModal ? (
          <motion.div className="settings-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setInfoModal(null)}>
            <motion.section className="settings-modal" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} onClick={(event) => event.stopPropagation()}>
              <button className="settings-modal__close" onClick={() => setInfoModal(null)} aria-label="Schließen"><X size={19} /></button>
              <span className="settings-modal__icon"><ShieldCheck size={28} /></span>
              <span className="overline">Nur Islam</span>
              <h2>{infoModal.title}</h2>
              <p>{infoModal.body}</p>
              <button className="gold-button" onClick={() => setInfoModal(null)}>Verstanden <Check size={17} /></button>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {confirmClear ? (
          <motion.div className="settings-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmClear(false)}>
            <motion.section className="settings-modal settings-modal--danger" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} onClick={(event) => event.stopPropagation()}>
              <span className="settings-modal__icon"><Trash2 size={28} /></span>
              <span className="overline">Bestätigung</span>
              <h2>Verlauf wirklich löschen?</h2>
              <p>Favoriten und Einstellungen bleiben erhalten. Nur lokale Lese- und Suchhistorien werden entfernt.</p>
              <div className="settings-modal__actions">
                <button onClick={() => setConfirmClear(false)}>Abbrechen</button>
                <button className="danger-button" onClick={clearLocalHistory}>Löschen</button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.main>
  );
}
