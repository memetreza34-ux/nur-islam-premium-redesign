import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const files = new Map(await Promise.all([
  ['homeHero', 'src/styles/home-hero.css'],
  ['homeContent', 'src/styles/home-content.css'],
  ['prayer', 'src/styles/prayer.css'],
  ['prayerList', 'src/styles/prayer-list.css'],
  ['calendar', 'src/styles/calendar.css'],
  ['learn', 'src/styles/learn.css'],
  ['more', 'src/styles/more.css'],
  ['moreControls', 'src/styles/more-controls.css'],
  ['navigation', 'src/styles/navigation.css'],
].map(async ([name, path]) => [name, await read(path)])));

function requireTokens(name, tokens) {
  const source = files.get(name);
  for (const token of tokens) {
    if (!source.includes(token)) throw new Error(`${name} is missing core reference token: ${token}`);
  }
}

function forbidTokens(name, tokens) {
  const source = files.get(name);
  for (const token of tokens) {
    if (source.includes(token)) throw new Error(`${name} still contains legacy source token: ${token}`);
  }
}

requireTokens('homeHero', [
  'border-radius: var(--radius-xl)',
  'linear-gradient(145deg, #0d5743 0%, #07372b 46%, #00120f 100%)',
  'border-radius: 18px',
]);
requireTokens('homeContent', [
  '.quick-card {',
  'border-radius: 28px',
  'background: linear-gradient(145deg, rgba(13, 87, 67, 0.78), rgba(0, 27, 22, 0.88))',
]);
requireTokens('prayer', [
  '.prayer-page-header{',
  'border-radius:18px',
  '.next-prayer-panel{',
  'border-radius:42px',
  'linear-gradient(145deg,#0d5743 0%,#07372b 45%,#00120f 100%)',
  '.daily-prayer-progress{',
  'border-radius:28px',
]);
requireTokens('prayerList', [
  '.prayer-time-row{',
  'border-radius:28px',
  'rgba(13,87,67,.74)',
  'rgba(0,27,22,.82)',
  '.prayer-alert,.prayer-complete{',
  'border-radius:18px',
]);
requireTokens('calendar', [
  '.calendar-page-header{',
  'border-radius:18px',
  '.calendar-month-card{padding:18px;border-radius:28px}',
  '.calendar-day{',
  'border-radius:18px',
  '.calendar-modal{',
  'border-radius:28px',
  'linear-gradient(160deg,#0d5743,#00120f)',
]);
requireTokens('learn', [
  '.learn-header{',
  'border-radius:18px',
  '.learning-hero{',
  'border-radius:42px',
  'linear-gradient(145deg,#0d5743,#00120f)',
  '.learning-card{',
  'border-radius:28px',
]);
requireTokens('more', [
  '.settings-header{',
  'border-radius:18px',
  '.account-card{',
  'border-radius:28px',
  'linear-gradient(145deg,rgba(13,87,67,.96),rgba(0,27,22,.98))',
  '.settings-row input:not([type=range]),.settings-row select{',
  'border-radius:18px',
]);
requireTokens('moreControls', [
  '.settings-modal{',
  'border-radius:28px',
  'linear-gradient(160deg,#0d5743,#00120f)',
]);
requireTokens('navigation', [
  'border-radius: 24px',
  '.bottom-nav__item {',
  'border-radius: 16px',
  '.bottom-nav__item > span {',
  'border-radius: 10px',
  'white-space: nowrap',
  'color: #f3d996',
  'box-shadow: none !important',
  '@media (max-height: 720px)',
]);

forbidTokens('prayer', [
  'border-radius:24px', 'border-radius:22px', 'border-radius:32px', 'border-radius:15px', 'border-radius:16px',
  '#0b513e', '#063126', '#021a15', 'rgba(244,218,160',
]);
forbidTokens('prayerList', [
  'border-radius:22px', 'border-radius:15px', 'border-radius:13px',
  'rgba(11,67,51', 'rgba(3,29,23', 'rgba(13,78,59',
]);
forbidTokens('calendar', [
  'border-radius:24px', 'border-radius:22px', 'border-radius:20px', 'border-radius:30px',
  'border-radius:15px', 'border-radius:16px', 'border-radius:14px', 'border-radius:13px', 'border-radius:12px',
  '#0b513e', '#031f19', '#0b4938', '#021812',
]);
forbidTokens('learn', [
  'border-radius:24px', 'border-radius:32px', 'border-radius:15px', 'border-radius:14px',
  'border-radius:11px', 'border-radius:12px', 'border-radius:26px', 'border-radius:25px',
  '#0a513d', '#021a14', '#c99c51', '#f4daa0', '#b88d46', '#f1d58f',
]);
forbidTokens('more', [
  'border-radius:24px', 'border-radius:30px', 'border-radius:26px', 'border-radius:21px',
  'border-radius:15px', 'border-radius:14px', 'border-radius:12px',
  'rgba(14,80,61', 'rgba(2,30,23', '#f4daa0', '#bd9149', '#d1a85d', '#c79b50', '#f0d28b',
]);
forbidTokens('moreControls', [
  'border-radius:12px', 'border-radius:30px', 'border-radius:20px', 'border-radius:14px',
  '#0b4938', '#021a14', '#f3d99d', '#c79b50',
]);

console.log('Core screen source verified: Home, Prayer, Calendar, Learning and More keep the approved reference geometry/palette, while bottom navigation uses the compact one-line 24/16/10 treatment without the old nested active-icon glow.');
