import { access, readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const forbiddenRuntime = /AssistantScreen|assistantIndex|NurAssistantIcon|answerFromApp|Nur[- ]Assistent|Fasten-Assistent|Lokaler Quellenmodus|ai-preview|reference-assistant|reference-chat|['"]assistant['"]|api\.(?:openai|anthropic)\.com|generativelanguage\.googleapis\.com|\/chat\/completions/i;

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      if (!['assets', 'embedded'].includes(entry.name)) await scan(file);
      continue;
    }
    if (!/\.(?:ts|tsx|css)$/.test(entry.name) || entry.name.endsWith('.test.ts')) continue;
    if ((await stat(file)).size > 100_000) continue;
    if (forbiddenRuntime.test(await readFile(file, 'utf8'))) {
      throw new Error(`Removed assistant or known AI integration found in runtime: ${relative(root, file)}`);
    }
  }
}

await scan(resolve(root, 'src'));
for (const path of [
  'src/screens/AssistantScreen.tsx',
  'src/services/assistantIndex.ts',
  'src/styles/reference-assistant.css',
  'public/premium-assets/high-res-objects/mini-assistant-v1.webp',
]) {
  try { await access(resolve(root, path)); }
  catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  throw new Error(`Removed assistant artifact is present again: ${path}`);
}

const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
for (const dependency of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })) {
  if (/^(?:openai|@anthropic-ai\/|@google\/generative-ai|@google\/genai|@ai-sdk\/|ai$|@langchain\/|langchain$)/.test(dependency)) {
    throw new Error(`AI dependency requires explicit product approval: ${dependency}`);
  }
}
for (const path of ['src/app/main.tsx', 'public/sw.js']) {
  const source = await readFile(resolve(root, path), 'utf8');
  if (/mini-assistant|AssistantScreen/.test(source)) throw new Error(`Removed asset is still cached/preloaded: ${path}`);
}
console.log('No-assistant boundary verified: no chat screen, answer engine, route, UI styles, shipped tile artwork or known AI SDK/provider integration. Static image provenance remains separate.');
