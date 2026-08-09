import fs from 'node:fs';

const service = fs.readFileSync(new URL('../src/services/installPromptService.ts', import.meta.url), 'utf8');
const prompt = fs.readFileSync(new URL('../src/shared/InstallAppPrompt.tsx', import.meta.url), 'utf8');
const main = fs.readFileSync(new URL('../src/app/main.tsx', import.meta.url), 'utf8');

const checks = [
  [service.includes("window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)"), 'global capture listens for beforeinstallprompt'],
  [service.includes('event.preventDefault()'), 'global capture prevents browser auto-prompt'],
  [service.includes('pendingInstallPrompt = event as BeforeInstallPromptEvent'), 'global capture stores the pending prompt'],
  [service.includes('subscribeInstallPrompt'), 'install prompt service exposes subscription'],
  [prompt.includes('subscribeInstallPrompt((event) =>'), 'InstallAppPrompt consumes the captured prompt'],
  [prompt.includes('clearPendingInstallPrompt();'), 'InstallAppPrompt clears consumed/dismissed prompt state'],
  [!prompt.includes("window.addEventListener('beforeinstallprompt'"), 'InstallAppPrompt no longer relies on a late component listener'],
  [main.includes("import { startInstallPromptCapture } from '../services/installPromptService';"), 'main imports early prompt capture'],
  [main.indexOf('const stopInstallPromptCapture = startInstallPromptCapture();') < main.indexOf('ReactDOM.createRoot'), 'prompt capture starts before React render'],
  [main.includes('stopInstallPromptCapture();'), 'prompt capture is cleaned up on pagehide'],
];

const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);
if (failures.length) {
  console.error('Install prompt check failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Install prompt check passed.');
