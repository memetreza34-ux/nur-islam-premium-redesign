import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AnimatePresence, motion } from 'motion/react';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/amiri/400.css';
import App from './App';
import { AppErrorBoundary, NetworkStatus } from './AppSystemLayer';
import { InstallAppPrompt } from './InstallAppPrompt';
import { registerNurPwa } from './pwa';
import { SplashScreen } from './SplashScreen';
import './styles.css';

registerNurPwa();

function BootRoot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setReady(true), reducedMotion ? 250 : 1050);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {ready ? (
        <motion.div
          key="app"
          className="app-entry"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: .32 }}
        >
          <AppErrorBoundary>
            <App />
            <InstallAppPrompt />
            <NetworkStatus />
          </AppErrorBoundary>
        </motion.div>
      ) : <SplashScreen key="splash" />}
    </AnimatePresence>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BootRoot />
  </React.StrictMode>,
);
