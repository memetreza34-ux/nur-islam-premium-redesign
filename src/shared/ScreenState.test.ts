import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import { ScreenStateProvider, useScreenState, useScreenRef } from './ScreenState';

afterEach(() => { vi.unstubAllGlobals(); });

it('retains choices and return offsets across unmounts without mixing screens', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  let update: (value: string | ((current: string) => string)) => void;
  function Screen() {
    const [query, setQuery] = useScreenState('query', '');
    const offset = useScreenRef('offset', 0);
    update = setQuery;
    return createElement('button', { onClick: () => { offset.current = 920; } }, `${query}:${offset.current}`);
  }
  const render = (key: string) => act(async () => root.render(createElement(ScreenStateProvider, { stateKey: key, children: createElement(Screen, { key }) })));
  await render('state-test-quran');
  await act(async () => { update!('Al-'); update!(previous => `${previous}Baqarah`); host.querySelector('button')!.click(); });
  await render('state-test-learn');
  expect(host.textContent).toBe(':0');
  await render('state-test-quran');
  expect(host.textContent).toBe('Al-Baqarah:920');
  await act(async () => root.unmount());
  host.remove();
});

it('uses normal fresh state when rendered outside the app screen provider', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  const host = document.createElement('div');
  const root = createRoot(host);
  function Screen() {
    const [value, update] = useScreenState('value', 0);
    return createElement('button', { onClick: () => update(previous => previous + 1) }, value);
  }
  await act(async () => root.render(createElement(Screen, { key: 1 })));
  await act(async () => host.querySelector('button')!.click());
  expect(host.textContent).toBe('1');
  await act(async () => root.render(createElement(Screen, { key: 2 })));
  expect(host.textContent).toBe('0');
  await act(async () => root.unmount());
});
