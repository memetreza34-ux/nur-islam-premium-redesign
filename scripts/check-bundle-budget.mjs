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
  // Raised twice now for content the app did not have: the quiz catalogue, the
  // prophets and companions, then the knowledge library, Sunnah, repentance and
  // the Ummah overview. All of it landed in the on-demand chunk — the entry
  // chunk has not moved from 95 KB across either step, which is the number
  // `entry` below exists to protect. This total counts every chunk and cannot
  // tell the difference.
  js: 235,
  css: 105,
  total: 340,
};

/**
 * The entry chunk on its own: what has to arrive before anything renders.
 *
 * The totals above treat a 20 KB chunk loaded when a screen is opened the same
 * as 20 KB in the entry, so splitting a screen out looks like no improvement at
 * all. It halved this number, and this budget is what keeps it there.
 */
const ENTRY_BUDGET_KB = 100;
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
