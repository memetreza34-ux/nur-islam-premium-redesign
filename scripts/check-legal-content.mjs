/**
 * Guards the imprint and privacy content.
 *
 * A half-filled imprint is worse than none: it looks official while naming
 * nobody. This fails the build while placeholders remain, so the app cannot be
 * released with one.
 *
 * It also holds the privacy text against the providers the code actually talks
 * to. A privacy notice that omits a service the app contacts is the failure
 * mode worth catching automatically — the text drifts, the network calls stay.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const legal = await read('src/data/legalContent.ts');
const prayer = await read('src/services/prayerTimesService.ts');
const quran = await read('src/services/quranService.ts');
const mosque = await read('src/services/mosqueService.ts');
const backend = await read('src/services/nurBackend.ts');

const RELEASE = process.env.NUR_RELEASE === 'true';

// Every host the app can contact has to be named in the privacy text.
const contacted = [
  ['api.aladhan.com', prayer],
  ['api.alquran.cloud', quran],
  ['overpass', mosque],
  ['supabase', backend],
];
for (const [host, source] of contacted) {
  const usesHost = source.toLowerCase().includes(host);
  const namedInPrivacy = legal.toLowerCase().includes(host);
  if (usesHost && !namedInPrivacy) {
    throw new Error(`Privacy text does not name a service the app contacts: ${host}`);
  }
}

// The Content Security Policy is the enforced version of the privacy notice.
// Code, policy and text have to name the same hosts, or one of the three is
// lying: a host missing from connect-src breaks at runtime, and a host missing
// from the notice is undisclosed processing.
const html = await read('index.html');
const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
if (!csp) throw new Error('The Content Security Policy meta tag is missing from index.html.');

const connectSrc = csp.match(/connect-src ([^;]+)/)?.[1] ?? '';
const codeHosts = new Set(
  [prayer, quran, mosque, backend]
    .flatMap((source) => [...source.matchAll(/https:\/\/([a-z0-9.-]+)/g)].map((match) => match[1]))
    // Link targets are navigations, not fetches, so they need no connect-src.
    .filter((host) => host !== 'www.openstreetmap.org'),
);
for (const host of codeHosts) {
  if (!connectSrc.includes(host)) {
    throw new Error(`connect-src does not allow a host the code fetches from: ${host}`);
  }
  if (!legal.includes(host.replace(/^www\./, ''))) {
    throw new Error(`Privacy text does not disclose a host the code fetches from: ${host}`);
  }
}
for (const allowed of connectSrc.split(/\s+/).filter((value) => value.startsWith('https://'))) {
  const host = allowed.replace('https://', '');
  if (!codeHosts.has(host)) {
    throw new Error(`connect-src allows a host nothing in the code contacts: ${host}`);
  }
}

// Claims the text makes about itself, which code changes could quietly falsify.
if (!legal.includes('keine Analyse-, Tracking- oder Werbedienste')) {
  throw new Error('The privacy text no longer states that no tracking is used.');
}
const trackers = ['googletagmanager', 'google-analytics', 'posthog', 'mixpanel', 'segment.com', 'sentry.io'];
for (const tracker of trackers) {
  if (backend.includes(tracker) || prayer.includes(tracker)) {
    throw new Error(`The privacy text claims no tracking, but ${tracker} appears in the code.`);
  }
}

// The text promises these two controls exist; both are real exports today.
for (const promise of ['exportAccountData', 'deleteCloudData']) {
  if (!backend.includes(`export async function ${promise}`)) {
    throw new Error(`Privacy text promises a data right the backend no longer implements: ${promise}`);
  }
}

const placeholderCount = [...legal.matchAll(/OPERATOR_PLACEHOLDER/g)].length;
// One declaration, one comparison in the helper, plus the fields still unfilled.
const unfilled = placeholderCount > 2;

if (unfilled && RELEASE) {
  throw new Error('Imprint still contains placeholders. Fill in src/data/legalContent.ts before a release build.');
}

if (unfilled) {
  console.log('Legal content verified: privacy text matches the services in code, and the promised data rights exist.');
  console.log('  PENDING: the imprint still has placeholders. Fill them in src/data/legalContent.ts.');
  console.log('  A release build (NUR_RELEASE=true npm run check) will refuse to pass until then.');
} else {
  console.log('Legal content verified: imprint filled in, privacy text matches the services in code, and the promised data rights exist.');
}
