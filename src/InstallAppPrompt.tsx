import { useEffect, useState } from 'react';
import { CircleCheck, Download, PlusSquare, Share2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { NurMark, PremiumImage } from './PremiumVisuals';

type InstallMode = 'native' | 'ios' | null;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const DISMISSED_KEY = 'nur_install_prompt_dismissed';
const ONBOARDING_KEY = 'nur_onboarding_complete';

function readFlag(key: string) {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

function writeFlag(key: string) {
  try {
    localStorage.setItem(key, 'true');
  } catch {
    // Private browsing can block storage; dismissal still works for this session.
  }
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function InstallAppPrompt() {
  const [mode, setMode] = useState<InstallMode>(null);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHelp, setIosHelp] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandalone() || readFlag(DISMISSED_KEY)) return;

    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    let revealTimer: number | undefined;
    let onboardingPoll: number | undefined;

    const revealWhenReady = (nextMode: Exclude<InstallMode, null>) => {
      const reveal = () => {
        if (readFlag(DISMISSED_KEY) || isStandalone()) return;
        revealTimer = window.setTimeout(() => setMode(nextMode), 1500);
      };

      if (readFlag(ONBOARDING_KEY)) {
        reveal();
        return;
      }

      onboardingPoll = window.setInterval(() => {
        if (!readFlag(ONBOARDING_KEY)) return;
        if (onboardingPoll) window.clearInterval(onboardingPoll);
        reveal();
      }, 700);
    };

    if (isIos) revealWhenReady('ios');

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      revealWhenReady('native');
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
      window.setTimeout(() => setMode(null), 1700);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      if (revealTimer) window.clearTimeout(revealTimer);
      if (onboardingPoll) window.clearInterval(onboardingPoll);
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const dismiss = () => {
    writeFlag(DISMISSED_KEY);
    setMode(null);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') {
      setInstalled(true);
      window.setTimeout(() => setMode(null), 1500);
    }
    setInstallEvent(null);
  };

  return (
    <AnimatePresence>
      {mode ? (
        <motion.aside
          className="reference-install-prompt"
          initial={{ opacity: 0, y: 24, scale: .97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: .98 }}
          transition={{ duration: .3, ease: [0.22, 1, 0.36, 1] }}
          aria-live="polite"
        >
          <button className="reference-install-prompt__close" onClick={dismiss} aria-label="Installationshinweis schließen"><X size={16} /></button>
          <PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem.webp" className="reference-install-prompt__logo" fallback={<NurMark />} />
          <div className="reference-install-prompt__copy">
            <span className="overline">Nur Islam als App</span>
            <strong>{installed ? 'App wurde installiert' : 'Direkt vom Home-Bildschirm öffnen'}</strong>
            <small>{mode === 'ios' ? 'Ohne Browserleiste und mit eigenem App-Symbol.' : 'Schneller Start, Vollbildansicht und Offline-Grundlage.'}</small>
          </div>

          {installed ? (
            <span className="reference-install-prompt__success"><CircleCheck size={20} /></span>
          ) : mode === 'native' ? (
            <button className="reference-install-prompt__action" onClick={install}><Download size={17} /> Installieren</button>
          ) : (
            <button className="reference-install-prompt__action" onClick={() => setIosHelp((value) => !value)}><Share2 size={17} /> Anleitung</button>
          )}

          <AnimatePresence>
            {mode === 'ios' && iosHelp ? (
              <motion.div className="reference-install-prompt__ios" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <span><Share2 size={17} /><strong>1. Teilen antippen</strong></span>
                <span><PlusSquare size={17} /><strong>2. „Zum Home-Bildschirm“ wählen</strong></span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
