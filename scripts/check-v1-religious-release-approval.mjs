import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const files = [
  'src/data/beginnerReview.ts',
  'src/data/coreContentReview.ts',
];
const requiredIds = [
  'beginner-islam',
  'beginner-allah',
  'beginner-shahada',
  'beginner-prophet',
  'beginner-quran-sunnah',
  'beginner-five-pillars',
  'beginner-six-beliefs',
  'beginner-purity',
  'beginner-prayer',
  'beginner-next-steps',
  'names-of-allah',
  'dhikr-counter-steps',
];

const recordPattern = /\{ contentId: '([^']+)', status: '(pending|approved)', reviewer: (null|'[^']+'), reviewedAt: (null|'[^']+'), evidence: (null|'[^']+') \}/g;
const records = [];
for (const file of files) {
  const source = await readFile(resolve(root, file), 'utf8');
  for (const match of source.matchAll(recordPattern)) {
    records.push({
      contentId: match[1],
      status: match[2],
      reviewer: match[3] === 'null' ? null : match[3].slice(1, -1),
      reviewedAt: match[4] === 'null' ? null : match[4].slice(1, -1),
      evidence: match[5] === 'null' ? null : match[5].slice(1, -1),
    });
  }
}

const ids = records.map((record) => record.contentId);
if (records.length !== requiredIds.length) {
  throw new Error(`Expected ${requiredIds.length} v1 religious review records, found ${records.length}.`);
}
if (new Set(ids).size !== ids.length) throw new Error('V1 religious review content IDs must be unique.');
for (const id of requiredIds) {
  if (!ids.includes(id)) throw new Error(`Missing v1 religious review record: ${id}`);
}

const pending = [];
for (const record of records) {
  if (record.status === 'pending') {
    if (record.reviewer || record.reviewedAt || record.evidence) {
      throw new Error(`Pending review ${record.contentId} must not carry approval metadata.`);
    }
    pending.push(record.contentId);
    continue;
  }

  if (!record.reviewer?.trim()) throw new Error(`Approved review ${record.contentId} is missing reviewer.`);
  if (!record.reviewedAt || !/^\d{4}-\d{2}-\d{2}$/.test(record.reviewedAt)) {
    throw new Error(`Approved review ${record.contentId} needs reviewedAt in YYYY-MM-DD format.`);
  }
  if (!record.evidence?.trim()) throw new Error(`Approved review ${record.contentId} is missing evidence/reference.`);
}

if (pending.length) {
  console.error(`V1 religious release blocked: ${pending.length}/${requiredIds.length} P0 review records are still pending.`);
  for (const id of pending) console.error(`- ${id}`);
  process.exit(1);
}

console.log(`V1 religious release approval verified: ${requiredIds.length}/${requiredIds.length} P0 records approved with reviewer metadata.`);
