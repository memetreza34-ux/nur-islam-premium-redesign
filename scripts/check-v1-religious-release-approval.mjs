import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const reviewFiles = [
  'src/data/beginnerReview.ts',
  'src/data/learningContentReview.ts',
  'src/data/coreContentReview.ts',
];
const scopeSource = await readFile(resolve(root, 'src/data/v1ReligiousReleaseScope.ts'), 'utf8');
const requiredIds = [...scopeSource.matchAll(/\{ contentId: '([^']+)', group: '(?:beginner|learning|core)', label: '[^']+' \}/g)]
  .map((match) => match[1]);

if (requiredIds.length === 0) throw new Error('V1 religious release scope is empty or no longer parseable.');
if (new Set(requiredIds).size !== requiredIds.length) throw new Error('V1 religious release scope contains duplicate content IDs.');

const recordPattern = /\{ contentId: '([^']+)', status: '(pending|approved)', reviewer: (null|'[^']+'), reviewedAt: (null|'[^']+'), evidence: (null|'[^']+') \}/g;
const records = [];
for (const file of reviewFiles) {
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
for (const id of ids) {
  if (!requiredIds.includes(id)) throw new Error(`Review record is outside the v1 release scope: ${id}`);
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

const byId = new Map(records.map((record) => [record.contentId, record]));

if (byId.get('quran-offline-bundle')?.status === 'approved') {
  const quranService = await readFile(resolve(root, 'src/services/quranService.ts'), 'utf8');
  if (quranService.includes("translationLabel: 'übernommener deutscher Altbestand'")) {
    throw new Error('Offline Quran cannot be approved while the German translation provenance is still labelled only as inherited legacy content.');
  }
}

if (byId.get('daily-hadith-rotation')?.status === 'approved') {
  const hadithData = await readFile(resolve(root, 'src/data/hadithData.ts'), 'utf8');
  if (!hadithData.includes('export const DAILY_HADITH_IDS')) {
    throw new Error('Daily Hadith cannot be approved until Home uses an explicit curated DAILY_HADITH_IDS pool.');
  }
}

if (pending.length) {
  console.error(`V1 religious release blocked: ${pending.length}/${requiredIds.length} review records are still pending.`);
  for (const id of pending) console.error(`- ${id}`);
  process.exit(1);
}

console.log(`V1 religious release approval verified: ${requiredIds.length}/${requiredIds.length} records approved with reviewer metadata.`);
