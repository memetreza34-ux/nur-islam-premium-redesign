/**
 * Performance budget for what actually crosses the network.
 *
 * The release gate asks for budgets, and the app is aimed at phones that are
 * often on mobile data. Aggregate sizes are measured gzipped, because that is
 * what a user downloads; raw per-chunk size is also guarded so the production
 * entry cannot silently collapse back into one oversized JavaScript file.
 *
 * The budgets sit slightly above today's numbers. They are a ratchet against
 * drift, not a claim that the current size is good: 98 stylesheet layers is
 * still a lot, and CSS remains the part most likely to keep climbing. Lowering
 * a budget after a cleanup is the intended direction; raising one should need
 * a reason.
 *
 * Run after a build. `npm run check` builds last, so use `npm run budget:check`
 * on an existing dist, or build first.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { resolve } from 'node:path';

const root = process.cwd();
const assets = resolve(root, 'dist/assets');

const BUDGETS_KB = {
  // Raised three times now for content the app did not have: the quiz
  // catalogue, the prophets and companions, then the knowledge library, Sunnah,
  // repentance and the Ummah overview, and now the prayer sequence — every
  // Rakʿah with its Arabic wording, transliteration and German meaning, which
  // is what turned the prayer course from seven generic positions into
  // something you can actually learn from.
  //
  // The last step is also the case this file warns about: the sequence first
  // landed in the entry chunk and pushed it to exactly its 100 KB limit, so it
  // was split into `prayer-rakats`. That brought the entry back to 98 KB and
  // added ~3 KB here, because a separate chunk compresses worse than the same
  // bytes inlined. Paying that on the total to protect the first paint is the
  // trade this pair of budgets exists to make visible.
  // 243 now: the prayer course gained posture figures and the aloud/silent
  // marking per Rakʿah, which pushed the entry chunk to 101 KB — over the
  // budget below that protects the first paint. The course is loaded on demand
  // instead, bringing the entry back to 98 KB and adding ~2 KB here, since a
  // separate chunk compresses worse than the same bytes inlined. That trade is
  // the whole reason these two budgets are kept apart.
  //
  // Raised again for the four schools of law: one comparison per step where the
  // practice differs, and for three guides the app did not have — Sujud
  // as-Sahw, the Shahada, and the questions that only come up for women. All of
  // it sits in on-demand chunks, not the entry, so the number that decides the
  // first paint is untouched — which is exactly the distinction the pair of
  // budgets below exists to keep visible.
  //
  // Und für zwei Anleitungen, die die App nicht hatte: was außer der Pflicht
  // gebetet wird, und was auf Reisen, bei Krankheit oder nach einem
  // ausgefallenen Gebet gilt. Beide liegen im `worship-guides`-Chunk, der erst
  // beim Öffnen einer Anleitung geladen wird.
  //
  // Zuletzt für die Anleitung zu den Anlässen (Eid, Janazah, Istikhara) und
  // drei Dhikr-Routinen, die fehlten — allen voran der Abend, der im Quran und
  // in der Überlieferung immer neben dem Morgen steht. Auch die Dhikr-Daten
  // liegen jetzt in einem eigenen Chunk statt im Entry.
  //
  // Premium adds nine local-first comfort features: Quran goals, routines,
  // in-app widgets, Home personalization, statistics, reminders, favorite
  // folders, a private journal and accent themes. The feature surface is split
  // into its own ~9 KB gzip chunk so the startup entry stays below the separate
  // 95 KB first-paint budget. The aggregate budget pays only for the requested
  // product surface; there is no new runtime dependency or remote AI client.
  // Six original quick-card miniatures add only local asset mappings and
  // accessible fallbacks; the entry stays below its separate 95 KB budget.
  // Sculpted SVG Qibla instrument: bezel, enamel, faceted needle and reflection.
  // Loaded on demand to retain the 95 KB entry limit; no bitmap or dependency.
  // The five-prayer course now carries a German-readable pronunciation line
  // for every spoken Arabic passage and loads its posture chooser only with
  // the course. Seven generated WebP illustrations stay outside JS; the entry
  // bundle remains below its independent first-paint limit.
  // The Quran reader now loads two independently cached reading layers per
  // Surah and renders Arabic, pronunciation and German meaning in one ordered
  // card. The extra aggregate KB buys the requested third text layer; the entry
  // itself remains at its separate 95 KB first-paint limit.
  // The dual-date prayer calendar adds one on-demand interaction chunk: month
  // navigation, selected-day details and upcoming Islamic occasions. It stays
  // outside the startup entry and reuses the existing calendar data model.
  // The learning hub now has a sourced beginner path with six additional
  // lessons for the five pillars and essential terms. The complete course is
  // loaded on demand; the startup entry drops to about 87 KB gzip.
  // The five-pillar overview is no longer three compressed summaries: Shahada,
  // Salah, Zakat, Sawm and Hajj each have their own sourced lesson, practical
  // distinctions and quiz. These strings add about 2 KB to the already
  // on-demand learning chunk; the 87 KB startup entry remains unchanged.
  // Lowered after removing the six-lesson Quran-&-Sunnah course from the
  // foundations hub; the Quran reader and Hadith library remain separate.
  // The essential-terms course replaces two compressed summaries with one
  // introduction and seven independently teachable definitions, examples,
  // distinctions and quizzes. The added text remains in the on-demand
  // learning chunk; the startup entry stays below its separate 95 KB limit.
  // The remaining five foundations now follow the same teaching pattern:
  // every course starts with an introduction, the six articles of faith are
  // taught separately, and practice, Seerah and character gain the missing
  // examples and distinctions. The added strings stay in the on-demand
  // learning chunk; the startup entry remains about 87 KB gzip.
  // The audited foundations add ten sourced lessons for Islam/Iman/Ihsan,
  // Niyyah, Mubah/Makruh, Ghusl/Tayammum and social responsibility. This is
  // text in the on-demand learning chunk; the startup entry remains unchanged.
  // The Prophets catalogue replaces 25 short summaries with 25 independent,
  // Quran-grounded courses, 25 extended orientations with explicit knowledge
  // boundaries and 97 sourced chapters. The content stays in the already
  // on-demand LegacyFeatureScreens chunk; the 95 KB startup guard is unchanged,
  // so normal app startup does not pay for these lesson texts.
  // User-requested four-school catalogue: sourced historical/methodological
  // explanations and their reading UI load only when opening this catalogue.
  // Adds about 6 KB gzip; the independent startup budget is unchanged.
  // Dedicated foundation-grid entry for the school catalogue adds a small
  // navigation tile; the catalogue remains lazy and the entry limit unchanged.
  // Four existing utilities now include sourced foundation chapters and
  // concrete practice examples in the lazy legacy chunk (~6 KB gzip).
  // Shared reading styles add ~1 KB; startup budget remains unchanged.
  // The rebuilt Qibla guide replaces the decorative dial with one functional
  // SVG instrument, live direction guidance, level and calibration states.
  // Its component remains lazy; only about 1 KB compressed CSS is added.
  // The illustrated Learn prayer cards add scoped responsive composition for
  // five local daypart scenes and three local preparation objects. The image
  // bytes stay outside this CSS total and the startup JS limit is unchanged.
  // Eight distinct learning-card illustrations replace repeated decorative
  // motifs. Their WebP bytes stay outside JS; the semantic local asset map
  // adds about 1 KB while the entry remains below its separate 95 KB guard.
  // Adjacent-day prayer times and the official monthly timetable add about
  // 2 KB gzip to the existing Prayer screen. No dependency was added and the
  // independently guarded startup entry remains below 95 KB.
  // The Surah catalogue's 114 semantic labels, localized number seals
  // and truthful Ayah extents add under 1 KB gzip to the existing Quran entry.
  // No dependency or new chunk is introduced; the 95 KB startup guard stays.
  // The six-stop Islamic places atlas adds sourced context and image metadata
  // to the lazy Legacy feature chunk. The startup entry remains below its
  // independently guarded 95 KB first-paint limit.
  // The completed learning catalogue, prayer timetable and widget previews
  // bring the measured aggregate to 352 KB gzip. Learn, Prayer and More now
  // load on demand, bringing the entry back below its unchanged 95 KB guard;
  // the aggregate cap still counts those optional screens after they load.
  js: 353,
  // One shared responsive art slot reserves a clean crop on all fourteen
  // learning cards. The scoped rules add about 1 KB gzip and no dependency.
  // The prayer companions now use six subject-specific local illustrations,
  // one feature hierarchy and a narrow-phone composition. The images remain
  // outside CSS/JS; only the scoped card geometry adds about 1 KB gzip.
  // Home's date control replaces its card surface with compact metadata and a
  // dedicated narrow-phone wrap. This crosses the rounded CSS limit by 1 KB.
  // The atlas adds one responsive editorial composition for hero, route and
  // place profiles in the existing design-system owner.
  // The new legal/about, learning-library and mosque-finder surfaces bring the
  // built CSS to 123 KB gzip. CSS remains one shared stylesheet today, so this
  // cap reflects the measured delivered file rather than hiding it in chunks.
  css: 123,
  // The complete More directory exposes all existing areas through typed deep
  // links. It adds no dependency and keeps the entry below its separate limit.
  // Six WebP artworks remain outside this JS/CSS transfer budget.
  // Measured together after the on-demand split: 475 KB gzip. Keep only a
  // 1 KB rounding allowance over that snapshot.
  total: 476,
};

/**
 * The entry chunk on its own: what has to arrive before anything renders.
 *
 * The totals above treat a 20 KB chunk loaded when a screen is opened the same
 * as 20 KB in the entry, so splitting a screen out looks like no improvement at
 * all. It halved this number, and this budget is what keeps it there.
 */
// Lowered from 100 after the worship guides left the entry chunk: eight
// guides with Arabic wording that nobody reads before tapping into one. That
// took the entry from 100 KB — exactly at the old limit — to 93 KB. The
// budget follows the gain down so the next addition cannot quietly spend it.
const ENTRY_BUDGET_KB = 95;
const MAX_RAW_JS_CHUNK_KB = 500;

let entries;
try {
  entries = await readdir(assets);
} catch {
  console.log('Bundle budget skipped: no dist/assets yet. Run npm run build first.');
  process.exit(0);
}

const measured = { js: 0, css: 0 };
const detail = [];

for (const name of entries) {
  const extension = name.endsWith('.js') ? 'js' : name.endsWith('.css') ? 'css' : null;
  if (!extension) continue;
  const path = resolve(assets, name);
  const raw = (await stat(path)).size;
  const gzipped = gzipSync(await readFile(path)).length;
  measured[extension] += gzipped;
  detail.push({ name, raw, gzipped });
}

const kb = (bytes) => Math.round(bytes / 1024);
const total = measured.js + measured.css;

for (const [label, bytes] of [['js', measured.js], ['css', measured.css], ['total', total]]) {
  const budget = BUDGETS_KB[label];
  if (kb(bytes) > budget) {
    const lines = detail
      .filter(({ name }) => label === 'total' || name.endsWith(`.${label}`))
      .map(({ name, raw, gzipped }) => `    ${name}: ${kb(gzipped)} KB gzipped (${kb(raw)} KB raw)`)
      .join('\n');
    throw new Error(
      `Bundle budget exceeded for ${label}: ${kb(bytes)} KB gzipped, budget ${budget} KB.\n${lines}\n`
      + '  Reduce it, or raise the budget in scripts/check-bundle-budget.mjs with a reason.',
    );
  }
}

const jsChunks = detail.filter(({ name }) => name.endsWith('.js'));
const oversizedJs = jsChunks.filter(({ raw }) => raw > MAX_RAW_JS_CHUNK_KB * 1024);
if (oversizedJs.length) {
  const lines = oversizedJs
    .map(({ name, raw, gzipped }) => `    ${name}: ${kb(raw)} KB raw (${kb(gzipped)} KB gzipped)`)
    .join('\n');
  throw new Error(
    `Raw JavaScript chunk budget exceeded: no production JS chunk may exceed ${MAX_RAW_JS_CHUNK_KB} KB.\n${lines}\n`
    + '  Split stable vendors or lazy-load secondary code instead of hiding the warning with a larger threshold.',
  );
}

const entry = detail.find(({ name }) => /^index-.*\.js$/.test(name));
if (!entry) throw new Error('No entry chunk found in dist/assets; the naming scheme changed.');
if (kb(entry.gzipped) > ENTRY_BUDGET_KB) {
  throw new Error(
    `Entry chunk is ${kb(entry.gzipped)} KB gzipped, budget ${ENTRY_BUDGET_KB} KB.\n`
    + '  Load the screen that grew it on demand instead of adding it to startup.',
  );
}

const largestJs = jsChunks.reduce((largest, entry) => !largest || entry.raw > largest.raw ? entry : largest, null);
const largestLabel = largestJs ? ` Largest JS chunk: ${largestJs.name} at ${kb(largestJs.raw)} KB raw.` : '';
console.log(`Bundle budget verified: ${kb(measured.js)} KB JS + ${kb(measured.css)} KB CSS = ${kb(total)} KB gzipped, within ${BUDGETS_KB.total} KB. Entry chunk ${kb(entry.gzipped)} KB (budget ${ENTRY_BUDGET_KB} KB).${largestLabel}`);
