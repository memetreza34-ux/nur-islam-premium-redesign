/**
 * Rebuilds the bundled German Quran text from a named Al Quran Cloud edition.
 *
 * The offline bundle is 1.3 MB of third-party translation that ships inside the
 * app. Without this script nobody can tell which edition produced it — which is
 * exactly what went wrong: every offline file held de.aburida while the service,
 * the licence and the guard all named Bubenheim & Elyas. Nobody chose that; the
 * bundle was simply built from the wrong edition and no script recorded it.
 *
 * Only the Ayah texts are replaced. Surah metadata (name, counts, revelation
 * type) is left exactly as it is, so a rebuild cannot quietly change the
 * catalogue the rest of the app is pinned to.
 *
 *   node scripts/build-quran-bundle.mjs                 # de.bubenheim
 *   node scripts/build-quran-bundle.mjs de.aburida      # another edition
 *
 * **This script is currently disarmed on purpose.** The German rendering is no
 * longer shipped: bundling a protected translation made this app its
 * distributor, which needs the rights holder's permission, so it is fetched per
 * Surah instead. `quran:check` fails as soon as `public/data/quran/de` exists
 * again, and running this will therefore break the build.
 *
 * It stays for the day permission arrives. Putting the bundle back means this
 * script *and* reversing the fetch in quranService.ts *and* the guard — all
 * three, or the app ends up in the split state it was in before, reading one
 * source and crediting another.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const dataDir = resolve(root, 'public/data/quran');
const edition = process.argv[2] ?? 'de.bubenheim';
const API = 'https://api.alquran.cloud/v1/surah';

const surahs = JSON.parse(await readFile(resolve(dataDir, 'surahs.json'), 'utf8'));

async function fetchSurah(number, attempt = 1) {
  try {
    const response = await fetch(`${API}/${number}/${edition}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const ayahs = payload?.data?.ayahs;
    if (!Array.isArray(ayahs)) throw new Error('no ayahs in payload');
    if (payload.data.edition?.identifier !== edition) {
      throw new Error(`served edition ${payload.data.edition?.identifier}, asked for ${edition}`);
    }
    return ayahs;
  } catch (error) {
    // The public API rate-limits; a failed Surah must retry rather than leave a
    // hole in the bundle that only shows up as a wrong Ayah count much later.
    if (attempt >= 4) throw new Error(`Surah ${number} failed after ${attempt} attempts: ${error.message}`);
    await new Promise((done) => setTimeout(done, attempt * 750));
    return fetchSurah(number, attempt + 1);
  }
}

let rewritten = 0;
for (const meta of surahs) {
  const path = resolve(dataDir, `de/${meta.number}.json`);
  const existing = JSON.parse(await readFile(path, 'utf8'));
  const ayahs = await fetchSurah(meta.number);

  if (ayahs.length !== meta.numberOfAyahs) {
    throw new Error(`Surah ${meta.number}: edition returned ${ayahs.length} ayahs, catalogue says ${meta.numberOfAyahs}.`);
  }

  existing.ayahs = ayahs.map((ayah, index) => {
    const text = String(ayah.text ?? '').trim();
    if (!text) throw new Error(`Surah ${meta.number}, Ayah ${index + 1} came back empty.`);
    return { numberInSurah: index + 1, text };
  });

  await writeFile(path, `${JSON.stringify(existing)}\n`, 'utf8');
  rewritten += 1;
  if (rewritten % 20 === 0) console.log(`  ${rewritten}/${surahs.length} …`);
}

console.log(`Rebuilt ${rewritten} German surah files from ${edition}.`);
console.log('Run "npm run quran:check" and update the fingerprint there if the edition changed.');
