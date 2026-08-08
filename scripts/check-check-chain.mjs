import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const pkg = JSON.parse(await readFile(resolve(process.cwd(), 'package.json'), 'utf8'));
const scripts = pkg.scripts ?? {};
const chain = String(scripts.check ?? '');

const requiredChecks = [
  'assets:check',
  'image-map:check',
  'icon-map:check',
  'deployment:check',
  'visual:check',
  'navigation:check',
  'pending-navigation:check',
  'prayer-reminders:check',
  'reminder-grace:check',
  'fasting-reminders:check',
  'install-prompt:check',
  'cloud-restore-sync:check',
  'static-controls:check',
  'persistence:check',
  'release:check',
  'functional:check',
];

for (const name of requiredChecks) {
  if (!scripts[name]) throw new Error(`Required release script is missing from package.json: ${name}`);
}

const definedChecks = Object.keys(scripts).filter((name) => name.endsWith(':check') && name !== 'check-chain:check');
for (const name of definedChecks) {
  if (!chain.includes(`npm run ${name}`)) {
    throw new Error(`Defined check is not wired into npm run check: ${name}`);
  }
}

for (const name of requiredChecks) {
  if (!chain.includes(`npm run ${name}`)) {
    throw new Error(`Critical release gate is not wired into npm run check: ${name}`);
  }
}

if (!chain.includes('npm run check-chain:check')) {
  throw new Error('The check-chain guard itself is not wired into npm run check.');
}

const lintIndex = chain.lastIndexOf('npm run lint');
const buildIndex = chain.lastIndexOf('npm run build');
if (lintIndex < 0 || buildIndex < 0 || lintIndex > buildIndex) {
  throw new Error('npm run check must finish with TypeScript lint before the production build.');
}

console.log(`Check chain verified: ${definedChecks.length} defined release checks are wired, reference image/icon gates are critical, and lint/build remain final.`);
