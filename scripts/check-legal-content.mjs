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

const legal = await read('src/legalContent.ts');
const prayer = await read('src/prayerTimesService.ts');
const quran = await read('src/quranService.ts');
const mosque = await read('src/mosqueService.ts');
const backend = await read('src/nurBackend.ts');

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
  throw new Error('Imprint still contains placeholders. Fill in src/legalContent.ts before a release build.');
}

if (unfilled) {
  console.log('Legal content verified: privacy text matches the services in code, and the promised data rights exist.');
  console.log('  PENDING: the imprint still has placeholders. Fill them in src/legalContent.ts.');
  console.log('  A release build (NUR_RELEASE=true npm run check) will refuse to pass until then.');
} else {
  console.log('Legal content verified: imprint filled in, privacy text matches the services in code, and the promised data rights exist.');
}
