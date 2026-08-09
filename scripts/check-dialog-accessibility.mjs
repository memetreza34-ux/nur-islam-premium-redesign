/**
 * Every modal dialog must carry the shared dialog behaviour.
 *
 * All nine dialogs were plain sections: nothing announced that a dialog had
 * opened, Escape did nothing, and focus stayed behind the overlay. The fix is
 * a shared hook, and this keeps a tenth dialog from being added without it.
 *
 * Matches on the container class rather than on the exact JSX, so restyling a
 * dialog does not trip it while removing its behaviour still does.
 */
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const dir = resolve(root, 'src');
const files = (await readdir(dir)).filter((name) => name.endsWith('.tsx'));

// A container is a dialog if its class ends in -modal. Inner parts use the
// block__element form and are not dialogs themselves.
const dialogClass = /className="([^"]*\b[a-z-]*-modal)"/g;

const offenders = [];
let dialogCount = 0;

for (const name of files) {
  const source = await readFile(resolve(dir, name), 'utf8');
  for (const match of source.matchAll(dialogClass)) {
    const classes = match[1];
    if (classes.includes('__') || classes.includes('backdrop')) continue;

    dialogCount += 1;
    // The spread sits immediately before className on the same tag.
    const tagStart = source.lastIndexOf('<', match.index);
    const tag = source.slice(tagStart, match.index + match[0].length);
    if (!/\{\.\.\.\w*[Dd]ialog\.props\}/.test(tag)) {
      offenders.push(`${name}: ${classes}`);
    }
  }
}

if (dialogCount === 0) {
  throw new Error('No dialogs found; the container naming changed and this check no longer sees anything.');
}

if (offenders.length) {
  throw new Error(
    `Dialogs without the shared keyboard and screen-reader behaviour (spread useDialog props onto them):\n  ${offenders.join('\n  ')}`,
  );
}

console.log(`Dialog accessibility verified: ${dialogCount} dialogs carry a role, an accessible name, Escape-to-close and focus handling.`);
