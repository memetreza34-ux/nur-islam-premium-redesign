export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const INSTALL_PROMPT_CHANGED_EVENT = 'nur:install-prompt-changed';
let pendingInstallPrompt: BeforeInstallPromptEvent | null = null;
let captureStarted = false;

function emitChange() {
  window.dispatchEvent(new Event(INSTALL_PROMPT_CHANGED_EVENT));
}

function handleBeforeInstallPrompt(event: Event) {
  event.preventDefault();
  pendingInstallPrompt = event as BeforeInstallPromptEvent;
  emitChange();
}

function handleInstalled() {
  if (!pendingInstallPrompt) return;
  pendingInstallPrompt = null;
  emitChange();
}

export function startInstallPromptCapture() {
  if (captureStarted) return () => undefined;
  captureStarted = true;
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.addEventListener('appinstalled', handleInstalled);

  return () => {
    if (!captureStarted) return;
    captureStarted = false;
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.removeEventListener('appinstalled', handleInstalled);
  };
}

export function getPendingInstallPrompt() {
  return pendingInstallPrompt;
}

export function clearPendingInstallPrompt() {
  if (!pendingInstallPrompt) return;
  pendingInstallPrompt = null;
  emitChange();
}

export function subscribeInstallPrompt(listener: (event: BeforeInstallPromptEvent | null) => void) {
  const handleChange = () => listener(pendingInstallPrompt);
  window.addEventListener(INSTALL_PROMPT_CHANGED_EVENT, handleChange);
  listener(pendingInstallPrompt);
  return () => window.removeEventListener(INSTALL_PROMPT_CHANGED_EVENT, handleChange);
}
