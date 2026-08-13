import { beforeEach, describe, expect, it } from 'vitest';
import {
  browserNavigationDepth,
  pushBrowserNavigation,
  readBrowserNavigation,
  replaceBrowserNavigation,
} from './browserNavigation';

type Snapshot = { tab: string; history: string[] };

function snapshot(tab: string): Snapshot {
  return { tab, history: [] };
}

describe('browser navigation state', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', window.location.href);
  });

  it('replaces the current entry as the app root', () => {
    replaceBrowserNavigation(snapshot('home'));
    expect(readBrowserNavigation<Snapshot>()).toEqual({ depth: 0, snapshot: snapshot('home') });
    expect(browserNavigationDepth()).toBe(0);
  });

  it('pushes increasing app-owned depths without changing the URL', () => {
    replaceBrowserNavigation(snapshot('home'));
    const url = window.location.href;
    expect(pushBrowserNavigation(snapshot('quran'))).toBe(1);
    expect(pushBrowserNavigation(snapshot('reader'))).toBe(2);
    expect(window.location.href).toBe(url);
    expect(readBrowserNavigation<Snapshot>()).toEqual({ depth: 2, snapshot: snapshot('reader') });
  });

  it('preserves unrelated history state owned by the browser or another feature', () => {
    window.history.replaceState({ scrollKey: 'abc', nested: { value: 1 } }, '', window.location.href);
    replaceBrowserNavigation(snapshot('home'));
    expect(window.history.state.scrollKey).toBe('abc');
    expect(window.history.state.nested).toEqual({ value: 1 });
    pushBrowserNavigation(snapshot('quran'));
    expect(window.history.state.scrollKey).toBe('abc');
  });

  it('reads a supplied popstate payload instead of only the current entry', () => {
    replaceBrowserNavigation(snapshot('home'));
    pushBrowserNavigation(snapshot('quran'));
    const quranState = window.history.state;
    pushBrowserNavigation(snapshot('reader'));
    expect(readBrowserNavigation<Snapshot>(quranState)).toEqual({ depth: 1, snapshot: snapshot('quran') });
  });

  it('rejects malformed or foreign states safely', () => {
    expect(readBrowserNavigation<Snapshot>(null)).toBeNull();
    expect(readBrowserNavigation<Snapshot>({})).toBeNull();
    expect(readBrowserNavigation<Snapshot>({ __nurIslamNavigation: { version: 2, depth: 0, snapshot: snapshot('home') } })).toBeNull();
    expect(readBrowserNavigation<Snapshot>({ __nurIslamNavigation: { version: 1, depth: -1, snapshot: snapshot('home') } })).toBeNull();
    expect(readBrowserNavigation<Snapshot>({ __nurIslamNavigation: { version: 1, depth: 1.5, snapshot: snapshot('home') } })).toBeNull();
  });
});
