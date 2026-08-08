import { useEffect, useState, type FormEvent } from 'react';
import {
  ChevronLeft,
  CircleCheck,
  CloudDownload,
  CloudUpload,
  KeyRound,
  LoaderCircle,
  LogIn,
  LogOut,
  Mail,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  backupLocalState,
  getCachedSession,
  getSession,
  loadProfile,
  restoreCloudState,
  signInWithPassword,
  signOut,
  signUp,
  subscribeAuth,
  upsertProfile,
} from './nurBackend';
import type { NurSession } from './nurBackend';

function storeDisplayName(value: string) {
  const clean = value.trim().slice(0, 80);
  if (!clean) return;
  try { localStorage.setItem('nur_display_name', clean); } catch { /* optional */ }
}

export function AccountScreen({ onBack }: { onBack: () => void }) {
  const [session, setSession] = useState<NurSession | null>(() => getCachedSession());
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [cloudUpdatedAt, setCloudUpdatedAt] = useState<string | null>(null);

  useEffect(() => subscribeAuth(setSession), []);
  useEffect(() => {
    let active = true;
    void getSession().then(async (current) => {
      if (!active) return;
      setSession(current);
      if (!current) return;
      const profile = await loadProfile().catch(() => null);
      if (!active || !profile) return;
      storeDisplayName(profile.display_name);
      setDisplayName(profile.display_name);
    });
    return () => { active = false; };
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || password.length < 6) {
      setStatus('Bitte gib eine gültige E-Mail und mindestens 6 Zeichen Passwort ein.');
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      if (mode === 'login') {
        const next = await signInWithPassword(email, password);
        setSession(next);
        const profile = await loadProfile().catch(() => null);
        const pendingName = (() => {
          try { return localStorage.getItem('nur_pending_display_name') || ''; } catch { return ''; }
        })();
        const name = profile?.display_name || pendingName || next.user.email.split('@')[0] || 'Nur Nutzer';
        const saved = await upsertProfile({ display_name: name, cloud_sync: true });
        storeDisplayName(saved.display_name);
        try { localStorage.removeItem('nur_pending_display_name'); } catch { /* optional */ }
        setStatus('Anmeldung erfolgreich. Cloud-Synchronisierung ist verfügbar.');
      } else {
        const result = await signUp(email, password);
        const name = displayName.trim() || email.split('@')[0] || 'Nur Nutzer';
        storeDisplayName(name);
        if (result.session) {
          setSession(result.session);
          await upsertProfile({ display_name: name, cloud_sync: true });
          setStatus('Konto erstellt und angemeldet.');
        } else {
          try { localStorage.setItem('nur_pending_display_name', name); } catch { /* optional */ }
          setStatus('Konto erstellt. Prüfe deine E-Mail und bestätige die Registrierung, bevor du dich anmeldest.');
          setMode('login');
        }
      }
      setPassword('');
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : 'Der Account-Vorgang ist fehlgeschlagen.');
    } finally {
      setBusy(false);
    }
  };

  const backup = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const updatedAt = await backupLocalState();
      setCloudUpdatedAt(updatedAt);
      setStatus('Dein lokaler Fortschritt wurde verschlüsselt per HTTPS in deinem geschützten Nutzerbereich gespeichert.');
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : 'Cloud-Backup fehlgeschlagen.');
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const updatedAt = await restoreCloudState();
      if (!updatedAt) {
        setStatus('Für dieses Konto wurde noch kein Cloud-Backup gefunden.');
        return;
      }
      setCloudUpdatedAt(updatedAt);
      setStatus('Cloud-Backup wiederhergestellt. Die App wird mit den wiederhergestellten Daten neu geladen.');
      window.setTimeout(() => window.location.reload(), 650);
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : 'Wiederherstellung fehlgeschlagen.');
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    setBusy(true);
    try {
      await signOut();
      setSession(null);
      setStatus('Du wurdest abgemeldet. Lokale Daten bleiben auf diesem Gerät erhalten.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.main className="screen reference-account-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Konto & Sicherung</span><h1>Nur Cloud</h1></div>
        <span className="reference-account-header-icon"><ShieldCheck size={20} /></span>
      </header>

      {session ? (
        <>
          <section className="reference-account-hero">
            <span><CircleCheck size={28} /></span>
            <div><small>Angemeldet</small><h2>{session.user.email}</h2><p>Favoriten, Lernfortschritt, Gebets-Tracker und Einstellungen können zwischen Geräten gesichert werden.</p></div>
          </section>

          <section className="reference-account-cloud-grid">
            <button onClick={() => void backup()} disabled={busy}><CloudUpload size={24} /><strong>Jetzt sichern</strong><small>Aktuellen Gerätestand in die Cloud schreiben</small></button>
            <button onClick={() => void restore()} disabled={busy}><CloudDownload size={24} /><strong>Wiederherstellen</strong><small>Letztes Cloud-Backup auf dieses Gerät laden</small></button>
          </section>

          <section className="reference-account-security"><ShieldCheck size={18} /><span><strong>RLS-geschützter Nutzerbereich</strong><small>Die Cloud-Tabellen sind so abgesichert, dass angemeldete Nutzer nur ihre eigenen Datensätze lesen oder verändern können.</small>{cloudUpdatedAt ? <em>Letzte Aktion: {new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(cloudUpdatedAt))}</em> : null}</span></section>

          <button className="reference-account-logout" onClick={() => void logout()} disabled={busy}><LogOut size={18} /> Abmelden</button>
        </>
      ) : (
        <>
          <section className="reference-account-hero is-guest">
            <span><KeyRound size={28} /></span>
            <div><small>Optional</small><h2>Fortschritt sicher mitnehmen.</h2><p>Ohne Konto funktioniert die App weiterhin lokal. Ein Konto wird nur für Cloud-Sicherung und Cloud-Notizen benötigt.</p></div>
          </section>

          <div className="reference-account-tabs">
            <button className={mode === 'login' ? 'is-active' : ''} onClick={() => setMode('login')}><LogIn size={16} /> Anmelden</button>
            <button className={mode === 'register' ? 'is-active' : ''} onClick={() => setMode('register')}><UserPlus size={16} /> Registrieren</button>
          </div>

          <form className="reference-account-form" onSubmit={submit}>
            {mode === 'register' ? <label><span>Name</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={80} autoComplete="name" placeholder="Dein Anzeigename" /></label> : null}
            <label><span>E-Mail</span><div><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="name@beispiel.de" /></div></label>
            <label><span>Passwort</span><div><KeyRound size={17} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} required placeholder="Mindestens 6 Zeichen" /></div></label>
            <button className="gold-button" type="submit" disabled={busy}>{busy ? <LoaderCircle size={18} className="is-spinning" /> : mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}{mode === 'login' ? 'Anmelden' : 'Konto erstellen'}</button>
          </form>

          <section className="reference-account-security"><ShieldCheck size={18} /><span><strong>Kein Passwort im App-Speicher</strong><small>Die Authentifizierung läuft über Supabase Auth. Lokal wird nur die zeitlich begrenzte Sitzung gespeichert; der öffentliche Client-Schlüssel gewährt keinen Admin-Zugriff.</small></span></section>
        </>
      )}

      <AnimatePresence>{status ? <motion.div className="reference-account-status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status">{status}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
