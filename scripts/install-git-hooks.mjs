/**
 * Points git at the tracked hooks directory.
 *
 * Runs from the `prepare` lifecycle script, so `npm install` sets it up and
 * nobody has to remember a manual opt-in. That mattered: the hook only guarded
 * whoever had run the command, and red commits kept arriving from the side
 * that had not.
 *
 * Never fails the install. A missing git directory or a machine without git is
 * a normal situation here, not a reason to break `npm install`.
 */
import { execFile } from 'node:child_process';
import { access } from 'node:fs/promises';
import { promisify } from 'node:util';
import { resolve } from 'node:path';

const run = promisify(execFile);
const root = process.cwd();

try {
  // A worktree has .git as a file rather than a directory, so only check that
  // something is there.
  await access(resolve(root, '.git'));
} catch {
  process.exit(0);
}

try {
  const { stdout } = await run('git', ['config', '--get', 'core.hooksPath'], { cwd: root });
  if (stdout.trim() === '.githooks') process.exit(0);
} catch {
  // Not configured yet, which is the case this script exists for.
}

try {
  await run('git', ['config', 'core.hooksPath', '.githooks'], { cwd: root });
  console.log('Git hooks enabled: npm run check now guards every push (bypass with --no-verify).');
} catch (error) {
  console.warn(`Could not enable git hooks automatically: ${error instanceof Error ? error.message : error}`);
  console.warn('Enable them with: git config core.hooksPath .githooks');
}
