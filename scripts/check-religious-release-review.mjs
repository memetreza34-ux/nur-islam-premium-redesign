import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const releaseMode = process.env.NUR_RELEASE === 'true';
const manifestPath = resolve(root, 'docs/religious-release-review.json');

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1) throw new Error('Unsupported religious review manifest schema.');
if (!Array.isArray(manifest.scopes) || manifest.scopes.length === 0) {
  throw new Error('Religious review manifest must define at least one scope.');
}

const ids = new Set();
const pending = [];
const stale = [];

async function hashScope(files) {
  const hash = createHash('sha256');
  for (const file of [...files].sort()) {
    const content = await readFile(resolve(root, file), 'utf8').catch(() => null);
    if (content === null) throw new Error(`Religious review scope references a missing file: ${file}`);
    hash.update(file);
    hash.update('\0');
    hash.update(content);
    hash.update('\0');
  }
  return hash.digest('hex');
}

for (const scope of manifest.scopes) {
  if (!scope || typeof scope !== 'object') throw new Error('Invalid religious review scope.');
  if (typeof scope.id !== 'string' || !scope.id.trim()) throw new Error('Every religious review scope needs an id.');
  if (ids.has(scope.id)) throw new Error(`Duplicate religious review scope id: ${scope.id}`);
  ids.add(scope.id);

  if (typeof scope.label !== 'string' || !scope.label.trim()) {
    throw new Error(`Religious review scope ${scope.id} needs a label.`);
  }
  if (!Array.isArray(scope.files) || scope.files.length === 0 || scope.files.some((file) => typeof file !== 'string' || !file.startsWith('src/'))) {
    throw new Error(`Religious review scope ${scope.id} must list repository src/ files.`);
  }
  if (!['pending', 'approved'].includes(scope.status)) {
    throw new Error(`Religious review scope ${scope.id} has invalid status: ${scope.status}`);
  }

  const currentHash = await hashScope(scope.files);

  if (scope.status === 'pending') {
    pending.push({ scope, currentHash });
    continue;
  }

  const reviewedBy = String(scope.reviewedBy ?? '').trim();
  const qualification = String(scope.qualification ?? '').trim();
  const reviewedAt = String(scope.reviewedAt ?? '').trim();
  const approvedHash = String(scope.contentHash ?? '').trim().toLowerCase();

  if (reviewedBy.length < 3) throw new Error(`Approved religious review scope ${scope.id} is missing reviewedBy.`);
  if (qualification.length < 5) throw new Error(`Approved religious review scope ${scope.id} is missing reviewer qualification/context.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewedAt) || Number.isNaN(Date.parse(`${reviewedAt}T00:00:00Z`))) {
    throw new Error(`Approved religious review scope ${scope.id} needs reviewedAt in YYYY-MM-DD format.`);
  }
  if (!/^[a-f0-9]{64}$/.test(approvedHash)) {
    throw new Error(`Approved religious review scope ${scope.id} needs the SHA-256 contentHash printed by this check.`);
  }
  if (approvedHash !== currentHash) {
    stale.push({ scope, approvedHash, currentHash });
  }
}

if (stale.length > 0) {
  const details = stale
    .map(({ scope, approvedHash, currentHash }) => `- ${scope.label} (${scope.id})\n  approved: ${approvedHash}\n  current:  ${currentHash}`)
    .join('\n');
  throw new Error(
    `Religious content changed after human approval. The affected scope must be reviewed again:\n${details}`,
  );
}

if (pending.length > 0) {
  const details = pending
    .map(({ scope, currentHash }) => `- ${scope.label} (${scope.id})\n  current contentHash: ${currentHash}`)
    .join('\n');

  if (releaseMode) {
    throw new Error(
      `Public release blocked: ${pending.length} required religious review scope(s) are still pending.\n`
      + `${details}\n`
      + 'A qualified human reviewer must review the current content, then set status=approved, reviewedBy, qualification, reviewedAt and the printed contentHash in docs/religious-release-review.json. Do not approve a scope merely to make CI green.',
    );
  }

  console.log(
    `Religious release review: ${pending.length} scope(s) pending. Development checks remain allowed; NUR_RELEASE=true will block publication until qualified human review is recorded.\n${details}`,
  );
} else {
  console.log(`Religious release review verified: ${manifest.scopes.length} scope(s) approved for their exact current content.`);
}
