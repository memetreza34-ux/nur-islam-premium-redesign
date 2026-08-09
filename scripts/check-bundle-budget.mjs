/**
 * Performance budget for what actually crosses the network.
 *
 * The release gate asks for budgets, and the app is aimed at phones that are
 * often on mobile data. Sizes are measured gzipped, because that is what a user
 * downloads; the raw figures are shown for context only.
 *
 * The budgets sit slightly above today's numbers. They are a ratchet against
 * drift, not a claim that the current size is good: 96 stylesheet layers is a
 * lot, and the CSS is the part most likely to keep climbing. Lowering a budget
 * after a cleanup is the intended direction; raising one should need a reason.
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
  js: 215,
  css: 105,
  total: 320,
};

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

console.log(`Bundle budget verified: ${kb(measured.js)} KB JS + ${kb(measured.css)} KB CSS = ${kb(total)} KB gzipped, within ${BUDGETS_KB.total} KB.`);
