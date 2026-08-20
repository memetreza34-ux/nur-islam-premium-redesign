import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const reviewSource = await readFile(resolve(root, 'src/data/beginnerReview.ts'), 'utf8');

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
];

const recordPattern = /\{ contentId: '([^']+)', status: '(pending|approved)', reviewer: (null|'[^']+'), reviewedAt: (null|'[^']+'), evidence: (null|'[^']+') \}/g;
const records = [...reviewSource.matchAll(recordPattern)].map((match) => ({
  contentId: match[1],
  status: match[2],
  reviewer: match[3] === 'null' ? null : match[3].slice(1, -1),
  reviewedAt: match[4] === 'null' ? null : match[4].slice(1, -1),
  evidence: match[5] === 'null' ? null : match[5].slice(1, -1),
}));

if (records.length !== requiredIds.length) {
  throw new Error(`Expected ${requiredIds.length} beginner review records, found ${records.length}.`);
}

const ids = records.map((record) => record.contentId);
if (new Set(ids).size !== ids.length) throw new Error('Beginner review content IDs must be unique.');

for (const id of requiredIds) {
  if (!ids.includes(id)) throw new Error(`Missing beginner review record: ${id}`);
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
  console.error(`Release blocked: ${pending.length}/${requiredIds.length} beginner P0 reviews are still pending.`);
  for (const id of pending) console.error(`- ${id}`);
  process.exit(1);
}

console.log(`Beginner P0 release approval verified: ${requiredIds.length}/${requiredIds.length} approved with reviewer metadata.`);
