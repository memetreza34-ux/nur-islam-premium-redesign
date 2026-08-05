import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react';
import { CircleCheck, CloudOff, RefreshCw, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { NurMark, PremiumImage } from './PremiumVisuals';

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { failed: boolean };

export class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Nur Islam render error', error, info);
    }
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="reference-system-error">
        <div className="reference-system-error__halo" />
        <PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem.webp" className="reference-system-error__logo" fallback={<NurMark />} />
        <span className="reference-system-error__icon"><ShieldAlert size={24} /></span>
        <span className="overline">Nur Islam</span>
        <h1>Die Ansicht konnte nicht geladen werden.</h1>
        <p>Deine lokal gespeicherten Fortschritte bleiben erhalten. Lade die App neu, um zur Startseite zurückzukehren.</p>
        <button className="gold-button" onClick={() => window.location.reload()}><RefreshCw size={18} /> App neu laden</button>
      </main>
    );
  }
}

export function NetworkStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    let restoredTimer: number | undefined;

    const handleOffline = () => {
      setOnline(false);
      setRestored(false);
    };

    const handleOnline = () => {
      setOnline(true);
      setRestored(true);
      restoredTimer = window.setTimeout(() => setRestored(false), 2400);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      if (restoredTimer) window.clearTimeout(restoredTimer);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!online || restored ? (
        <motion.div
          className={online ? 'reference-network-status is-online' : 'reference-network-status is-offline'}
          initial={{ opacity: 0, y: -16, scale: .96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: .97 }}
          role="status"
        >
          {online ? <CircleCheck size={17} /> : <CloudOff size={17} />}
          <span><strong>{online ? 'Wieder verbunden' : 'Offline-Modus'}</strong><small>{online ? 'Aktuelle Inhalte können wieder geladen werden.' : 'Gespeicherte Bereiche bleiben verfügbar.'}</small></span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
