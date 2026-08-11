/**
 * Caps the stylesheet layering so it can only shrink.
 *
 * The styles grew by adding a new override file for each visual fix instead of
 * changing the rule that caused the problem: 98 files, ~700 KB and over 2200
 * `!important`, of which 33 files carry `lock` or `parallel-pass` in the name.
 * Each layer overrides an earlier one, so the file that decides what you see is
 * no longer the file that describes the component — which is exactly why small
 * visual fixes keep needing another layer.
 *
 * This does not clean any of that up. It stops it from growing, so cleanup work
 * is not silently undone by the next fix. Every budget below is the measured
 * value at the time of writing.
 *
 * When you remove debt, lower the matching budget in the same commit. Raising a
 * budget is a deliberate decision and should be argued for in the commit
 * message, not done to make the check pass.
 */
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const styleDir = resolve(root, 'src/styles');

// Measured when this guard landed. The first thing it caught was work merged
// while it was being written: one more stylesheet and twenty more `!important`
// in a single afternoon. That growth rate is the reason for the cap, so these
// numbers start where reality was, not where it should be.
const BUDGET = {
  files: 98,
  overrideFiles: 33,
  importantRules: 2291,
  // Covers `.frame-guard`, the install-prompt scroll clearance, the quiz
  // answer states and the Hadith explanation card, plus the child combinators
  // that stop the active navigation label being dressed as an icon box, and
  // the prophet detail and person list surfaces, the lazy-chunk fallback and
  // the knowledge/practice surfaces. The eight added `!important` sit in the file that already
  // owned those rules with `!important` throughout — matching that weight was
  // the only way to change them without adding a 34th override layer, which is
  // exactly the trade this budget exists to make visible.
  totalBytes: 728_079,
};

const names = (await readdir(styleDir)).filter((name) => name.endsWith('.css'));
const sources = await Promise.all(names.map((name) => readFile(resolve(styleDir, name), 'utf8')));

const measured = {
  files: names.length,
  overrideFiles: names.filter((name) => /lock|parallel-pass/.test(name)).length,
  importantRules: sources.reduce((total, css) => total + (css.match(/!important/g)?.length ?? 0), 0),
  totalBytes: sources.reduce((total, css) => total + Buffer.byteLength(css), 0),
};

const labels = {
  files: 'Stylesheets',
  overrideFiles: 'lock/parallel-pass override files',
  importantRules: '!important declarations',
  totalBytes: 'total stylesheet bytes',
};

const over = Object.keys(BUDGET).filter((key) => measured[key] > BUDGET[key]);
if (over.length) {
  const detail = over
    .map((key) => `${labels[key]}: ${measured[key]} exceeds the budget of ${BUDGET[key]}`)
    .join('\n  ');
  throw new Error(
    `Stylesheet debt grew instead of shrinking.\n  ${detail}\n` +
      '\nFix the rule in the file that defines it rather than adding another override layer.' +
      '\nIf the growth is genuinely warranted, raise the budget in scripts/check-stylesheet-debt.mjs and say why in the commit message.',
  );
}

const slack = Object.keys(BUDGET)
  .filter((key) => measured[key] < BUDGET[key])
  .map((key) => `${labels[key]} ${measured[key]} (budget ${BUDGET[key]})`);

if (slack.length) {
  console.log(
    `Stylesheet debt verified and now under budget — lower the budgets in the same commit: ${slack.join(', ')}.`,
  );
} else {
  console.log(
    `Stylesheet debt verified: ${measured.files} stylesheets, ${measured.overrideFiles} override layers, ${measured.importantRules} !important, ${Math.round(measured.totalBytes / 1024)} KB, none above budget.`,
  );
}
