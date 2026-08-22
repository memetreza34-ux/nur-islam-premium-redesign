/**
 * Performance budget for what actually crosses the network.
 *
 * The release gate asks for budgets, and the app is aimed at phones that are
 * often on mobile data. Sizes are measured gzipped, because that is what a user
 * downloads.
 *
 * The primary budget is the *startup payload*: the entry script, the chunks the
 * built index.html preloads with it, and the stylesheet. That is what has to
 * arrive before anything renders. An earlier version of this file summed every
 * emitted chunk instead, which contradicted its own premise: a screen that is
 * only fetched when it is opened — and a gated legacy feature that a v1 user
 * never opens at all — counted exactly like bytes on the critical path, so
 * splitting code out looked like no improvement, or even a regression, because
 * a separate chunk compresses slightly worse than the same bytes inlined.
 *
 * A second, looser ceiling still covers *all* emitted JavaScript, so on-demand
 * chunks cannot grow without limit behind the startup budget.
 *
 * The budgets sit slightly above today's numbers. They are a ratchet against
 * drift, not a claim that the current size is good: the stylesheet is still the
 * single largest thing a user downloads and remains the part most likely to
 * keep climbing. Lowering a budget after a cleanup is the intended direction;
 * raising one should need a reason.
 *
 * Run after a build. `npm run check` builds last, so use `npm run budget:check`
 * on an existing dist, or build first.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { basename, resolve } from 'node:path';

const root = process.cwd();
const assets = resolve(root, 'dist/assets');
const indexHtml = resolve(root, 'dist/index.html');

const BUDGETS_KB = {
  /**
   * Entry chunk + every chunk index.html preloads alongside it. Today: the
   * entry, react, motion, the icon set and the prayer sequence.
   */
  startupJs: 200,
  /** The single stylesheet, which is loaded render-blocking. */
  startupCss: 100,
  /** Everything a first visit pulls down before the app paints. */
  startupTotal: 300,
  /**
   * All emitted JavaScript, including chunks fetched only when a screen is
   * opened and the legacy features that stay gated for v1. Deliberately looser:
   * these bytes are not on the critical path, but they are not free either.
   */
  emittedJs: 285,
};

/**
 * The entry chunk on its own: what has to be parsed before anything renders,
 * separate from the vendor chunks that sit next to it.
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

const detail = new Map();
for (const name of entries) {
  const extension = name.endsWith('.js') ? 'js' : name.endsWith('.css') ? 'css' : null;
  if (!extension) continue;
  const path = resolve(assets, name);
  detail.set(name, {
    name,
    extension,
    raw: (await stat(path)).size,
    gzipped: gzipSync(await readFile(path)).length,
  });
}

/**
 * The startup set is read from the built HTML rather than guessed: whatever the
 * bundler decided to load eagerly is exactly what it writes there as the entry
 * script, its modulepreloads and the stylesheet link.
 */
let html;
try {
  html = await readFile(indexHtml, 'utf8');
} catch {
  throw new Error('dist/index.html is missing; cannot tell startup assets from on-demand chunks.');
}

const startup = [];
for (const match of html.matchAll(/(?:src|href)="([^"]+\/assets\/[^"]+\.(?:js|css))"/g)) {
  const asset = detail.get(basename(match[1]));
  if (asset && !startup.includes(asset)) startup.push(asset);
}
if (!startup.some(({ extension }) => extension === 'js')) {
  throw new Error('No startup JavaScript found in dist/index.html; the build output changed shape.');
}

const kb = (bytes) => Math.round(bytes / 1024);
const sum = (items) => items.reduce((total, { gzipped }) => total + gzipped, 0);
const list = (items) => items
  .slice()
  .sort((a, b) => b.gzipped - a.gzipped)
  .map(({ name, raw, gzipped }) => `    ${name}: ${kb(gzipped)} KB gzipped (${kb(raw)} KB raw)`)
  .join('\n');

const startupJs = startup.filter(({ extension }) => extension === 'js');
const startupCss = startup.filter(({ extension }) => extension === 'css');
const allJs = [...detail.values()].filter(({ extension }) => extension === 'js');
const onDemandJs = allJs.filter((asset) => !startup.includes(asset));

const measurements = [
  ['startupJs', startupJs, 'JavaScript on the critical path'],
  ['startupCss', startupCss, 'render-blocking CSS'],
  ['startupTotal', [...startupJs, ...startupCss], 'everything a first visit downloads'],
  ['emittedJs', allJs, 'all emitted JavaScript'],
];

for (const [label, items, description] of measurements) {
  const budget = BUDGETS_KB[label];
  if (kb(sum(items)) > budget) {
    throw new Error(
      `Bundle budget exceeded for ${label} (${description}): ${kb(sum(items))} KB gzipped, budget ${budget} KB.\n`
      + `${list(items)}\n`
      + '  Load it on demand, reduce it, or raise the budget in scripts/check-bundle-budget.mjs with a reason.',
    );
  }
}

const oversizedJs = allJs.filter(({ raw }) => raw > MAX_RAW_JS_CHUNK_KB * 1024);
if (oversizedJs.length) {
  throw new Error(
    `Raw JavaScript chunk budget exceeded: no production JS chunk may exceed ${MAX_RAW_JS_CHUNK_KB} KB.\n${list(oversizedJs)}\n`
    + '  Split stable vendors or lazy-load secondary code instead of hiding the warning with a larger threshold.',
  );
}

const entry = allJs.find(({ name }) => /^index-.*\.js$/.test(name));
if (!entry) throw new Error('No entry chunk found in dist/assets; the naming scheme changed.');
if (kb(entry.gzipped) > ENTRY_BUDGET_KB) {
  throw new Error(
    `Entry chunk is ${kb(entry.gzipped)} KB gzipped, budget ${ENTRY_BUDGET_KB} KB.\n`
    + '  Load the screen that grew it on demand instead of adding it to startup.',
  );
}

console.log(
  `Bundle budget verified: startup ${kb(sum(startupJs))} KB JS + ${kb(sum(startupCss))} KB CSS `
  + `= ${kb(sum([...startupJs, ...startupCss]))} KB gzipped across ${startup.length} assets, within ${BUDGETS_KB.startupTotal} KB. `
  + `Entry chunk ${kb(entry.gzipped)} KB (budget ${ENTRY_BUDGET_KB} KB). `
  + `${onDemandJs.length} on-demand chunks add ${kb(sum(onDemandJs))} KB, `
  + `${kb(sum(allJs))} KB JS emitted in total (budget ${BUDGETS_KB.emittedJs} KB).`,
);
