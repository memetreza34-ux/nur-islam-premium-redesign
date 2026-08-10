import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();

function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`${label}: expected source block was not found.`);
  if (source.indexOf(before, first + before.length) >= 0) throw new Error(`${label}: expected source block is not unique.`);
  return source.slice(0, first) + after + source.slice(first + before.length);
}

async function patch(path, transform) {
  const absolute = resolve(root, path);
  const before = await readFile(absolute, 'utf8');
  const after = transform(before);
  if (after === before) throw new Error(`${path}: patch produced no change.`);
  await writeFile(absolute, after);
}

await patch('src/app/App.tsx', (input) => {
  let source = input;

  source = replaceOnce(
    source,
    "import { useEffect, useState } from 'react';",
    "import { useEffect, useRef, useState } from 'react';",
    'React navigation refs',
  );

  source = replaceOnce(
    source,
    "import { getHijriLabel } from '../services/hijriCalendar';\nimport { consumePendingNavigation } from '../services/pendingNavigation';",
    "import { getHijriLabel } from '../services/hijriCalendar';\nimport {\n  browserNavigationDepth,\n  pushBrowserNavigation,\n  readBrowserNavigation,\n  replaceBrowserNavigation,\n} from '../services/browserNavigation';\nimport { consumePendingNavigation } from '../services/pendingNavigation';",
    'Browser navigation import',
  );

  source = replaceOnce(
    source,
    "type Tab = PrimaryTab | 'quran' | 'dhikr' | 'qibla' | 'duas' | 'names' | 'mosques' | 'collections' | 'assistant' | 'reader' | 'ayah' | 'hadith' | 'wudu' | 'salah' | 'legal' | LegacyTab;\n\ntype QuickAction = {",
    "type Tab = PrimaryTab | 'quran' | 'dhikr' | 'qibla' | 'duas' | 'names' | 'mosques' | 'collections' | 'assistant' | 'reader' | 'ayah' | 'hadith' | 'wudu' | 'salah' | 'legal' | LegacyTab;\n\ntype NavigationSnapshot = {\n  activeTab: Tab;\n  navigationHistory: Tab[];\n  selectedSurahNumber: number;\n  selectedAyahNumber: number;\n  selectedDuaId: string | null;\n  selectedNameId: string | null;\n  selectedCalendarDate: string | null;\n  selectedHadithId: string | null;\n};\n\ntype QuickAction = {",
    'Navigation snapshot type',
  );

  source = replaceOnce(
    source,
    "function hasCompletedOnboarding() {\n  try {\n    return localStorage.getItem('nur_onboarding_complete') === 'true';\n  } catch {\n    return false;\n  }\n}\n\nfunction PremiumHome({",
    "function hasCompletedOnboarding() {\n  try {\n    return localStorage.getItem('nur_onboarding_complete') === 'true';\n  } catch {\n    return false;\n  }\n}\n\nfunction isNavigationSnapshot(value: unknown): value is NavigationSnapshot {\n  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;\n  const snapshot = value as Partial<NavigationSnapshot>;\n  return typeof snapshot.activeTab === 'string'\n    && Array.isArray(snapshot.navigationHistory)\n    && snapshot.navigationHistory.every((tab) => typeof tab === 'string')\n    && typeof snapshot.selectedSurahNumber === 'number'\n    && Number.isInteger(snapshot.selectedSurahNumber)\n    && snapshot.selectedSurahNumber >= 1\n    && snapshot.selectedSurahNumber <= 114\n    && typeof snapshot.selectedAyahNumber === 'number'\n    && Number.isInteger(snapshot.selectedAyahNumber)\n    && snapshot.selectedAyahNumber >= 1\n    && (snapshot.selectedDuaId === null || typeof snapshot.selectedDuaId === 'string')\n    && (snapshot.selectedNameId === null || typeof snapshot.selectedNameId === 'string')\n    && (snapshot.selectedCalendarDate === null || typeof snapshot.selectedCalendarDate === 'string')\n    && (snapshot.selectedHadithId === null || typeof snapshot.selectedHadithId === 'string');\n}\n\nfunction PremiumHome({",
    'Navigation snapshot validation',
  );

  source = replaceOnce(
    source,
    "  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);\n  const [selectedHadithId, setSelectedHadithId] = useState<string | null>(null);\n  const primaryActive: PrimaryTab = activeTab === 'prayer'",
    "  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);\n  const [selectedHadithId, setSelectedHadithId] = useState<string | null>(null);\n  const currentNavigationSnapshot: NavigationSnapshot = {\n    activeTab,\n    navigationHistory,\n    selectedSurahNumber,\n    selectedAyahNumber,\n    selectedDuaId,\n    selectedNameId,\n    selectedCalendarDate,\n    selectedHadithId,\n  };\n  const latestNavigationSnapshotRef = useRef(currentNavigationSnapshot);\n  const pendingBrowserRootRef = useRef<NavigationSnapshot | null>(null);\n  latestNavigationSnapshotRef.current = currentNavigationSnapshot;\n  const primaryActive: PrimaryTab = activeTab === 'prayer'",
    'Navigation refs',
  );

  const oldNavigationBlock = `  const clearDirectTargets = () => {\n    setSelectedDuaId(null);\n    setSelectedNameId(null);\n    setSelectedCalendarDate(null);\n    setSelectedHadithId(null);\n  };\n\n  const moveTo = (tab: Tab, rememberOrigin = true) => {\n    if (tab === activeTab) return;\n    if (rememberOrigin) setNavigationHistory((current) => [...current, activeTab].slice(-24));\n    if (tab === 'duas') setSelectedDuaId(null);\n    if (tab === 'names') setSelectedNameId(null);\n    if (tab === 'calendar') setSelectedCalendarDate(null);\n    if (tab === 'hadith') setSelectedHadithId(null);\n    setActiveTab(tab);\n  };\n\n  const navigate = (tab: Tab) => moveTo(tab, true);\n\n  const navigatePrimary = (tab: PrimaryTab) => {\n    clearDirectTargets();\n    setNavigationHistory([]);\n    setActiveTab(tab);\n  };\n\n  const goBack = (fallback: Tab = 'home') => {\n    const remaining = [...navigationHistory];\n    let previous = remaining.pop();\n    while (previous === activeTab) previous = remaining.pop();\n    setNavigationHistory(remaining);\n    setActiveTab(previous ?? fallback);\n  };`;

  const newNavigationBlock = `  const buildNavigationSnapshot = (overrides: Partial<NavigationSnapshot> = {}): NavigationSnapshot => ({\n    ...latestNavigationSnapshotRef.current,\n    ...overrides,\n  });\n\n  const applyNavigationSnapshot = (snapshot: NavigationSnapshot) => {\n    setActiveTab(snapshot.activeTab);\n    setNavigationHistory([...snapshot.navigationHistory].slice(-24));\n    setSelectedSurahNumber(snapshot.selectedSurahNumber);\n    setSelectedAyahNumber(snapshot.selectedAyahNumber);\n    setSelectedDuaId(snapshot.selectedDuaId);\n    setSelectedNameId(snapshot.selectedNameId);\n    setSelectedCalendarDate(snapshot.selectedCalendarDate);\n    setSelectedHadithId(snapshot.selectedHadithId);\n  };\n\n  const resetBrowserRoot = (snapshot: NavigationSnapshot) => {\n    const depth = browserNavigationDepth();\n    if (depth > 0) {\n      pendingBrowserRootRef.current = snapshot;\n      window.history.go(-depth);\n      return;\n    }\n    replaceBrowserNavigation(snapshot, 0);\n    applyNavigationSnapshot(snapshot);\n  };\n\n  const moveTo = (tab: Tab, rememberOrigin = true, overrides: Partial<NavigationSnapshot> = {}) => {\n    if (tab === activeTab && Object.keys(overrides).length === 0) return;\n    const nextHistory = rememberOrigin && tab !== activeTab\n      ? [...navigationHistory, activeTab].slice(-24)\n      : navigationHistory;\n    const snapshot = buildNavigationSnapshot({\n      activeTab: tab,\n      navigationHistory: nextHistory,\n      selectedDuaId: tab === 'duas' ? null : selectedDuaId,\n      selectedNameId: tab === 'names' ? null : selectedNameId,\n      selectedCalendarDate: tab === 'calendar' ? null : selectedCalendarDate,\n      selectedHadithId: tab === 'hadith' ? null : selectedHadithId,\n      ...overrides,\n    });\n\n    if (tab === activeTab) replaceBrowserNavigation(snapshot, browserNavigationDepth());\n    else pushBrowserNavigation(snapshot);\n    applyNavigationSnapshot(snapshot);\n  };\n\n  const navigate = (tab: Tab) => moveTo(tab, true);\n\n  const navigatePrimary = (tab: PrimaryTab) => {\n    resetBrowserRoot(buildNavigationSnapshot({\n      activeTab: tab,\n      navigationHistory: [],\n      selectedDuaId: null,\n      selectedNameId: null,\n      selectedCalendarDate: null,\n      selectedHadithId: null,\n    }));\n  };\n\n  const goBack = (fallback: Tab = 'home') => {\n    if (browserNavigationDepth() > 0) {\n      window.history.back();\n      return;\n    }\n\n    const remaining = [...navigationHistory];\n    let previous = remaining.pop();\n    while (previous === activeTab) previous = remaining.pop();\n    const snapshot = buildNavigationSnapshot({\n      activeTab: previous ?? fallback,\n      navigationHistory: remaining,\n      selectedDuaId: null,\n      selectedNameId: null,\n      selectedCalendarDate: null,\n      selectedHadithId: null,\n    });\n    replaceBrowserNavigation(snapshot, 0);\n    applyNavigationSnapshot(snapshot);\n  };`;

  source = replaceOnce(source, oldNavigationBlock, newNavigationBlock, 'Navigation controller');

  source = replaceOnce(
    source,
    "  useEffect(() => {\n    const openPrayerTracker = () => {",
    "  useEffect(() => {\n    if (!onboardingComplete) return;\n\n    const handlePopState = (event: PopStateEvent) => {\n      const pendingRoot = pendingBrowserRootRef.current;\n      if (pendingRoot) {\n        pendingBrowserRootRef.current = null;\n        replaceBrowserNavigation(pendingRoot, 0);\n        applyNavigationSnapshot(pendingRoot);\n        return;\n      }\n\n      const entry = readBrowserNavigation<NavigationSnapshot>(event.state);\n      if (!entry || !isNavigationSnapshot(entry.snapshot)) return;\n      applyNavigationSnapshot(entry.snapshot);\n    };\n\n    const existing = readBrowserNavigation<NavigationSnapshot>();\n    if (existing && isNavigationSnapshot(existing.snapshot)) applyNavigationSnapshot(existing.snapshot);\n    else replaceBrowserNavigation(buildNavigationSnapshot(), 0);\n\n    window.addEventListener('popstate', handlePopState);\n    return () => window.removeEventListener('popstate', handlePopState);\n  }, [onboardingComplete]);\n\n  useEffect(() => {\n    const openPrayerTracker = () => {",
    'Popstate lifecycle',
  );

  const oldIntentHandlers = `    const openPrayerTracker = () => {\n      setOnboardingComplete(true);\n      clearDirectTargets();\n      setNavigationHistory([]);\n      setActiveTab('prayer');\n    };\n    const openCalendar = () => {\n      setOnboardingComplete(true);\n      clearDirectTargets();\n      setNavigationHistory([]);\n      setActiveTab('calendar');\n    };`;

  const newIntentHandlers = `    const openRootTab = (tab: 'prayer' | 'calendar') => {\n      setOnboardingComplete(true);\n      resetBrowserRoot(buildNavigationSnapshot({\n        activeTab: tab,\n        navigationHistory: [],\n        selectedDuaId: null,\n        selectedNameId: null,\n        selectedCalendarDate: null,\n        selectedHadithId: null,\n      }));\n    };\n    const openPrayerTracker = () => openRootTab('prayer');\n    const openCalendar = () => openRootTab('calendar');`;

  source = replaceOnce(source, oldIntentHandlers, newIntentHandlers, 'Notification root navigation');

  const oldDirectOpeners = `  const openQuran = () => {\n    setSelectedAyahNumber(1);\n    moveTo('quran');\n  };\n  const openReader = (surahNumber: number, ayahNumber = 1) => {\n    clearDirectTargets();\n    setSelectedSurahNumber(surahNumber);\n    setSelectedAyahNumber(Math.max(1, Math.floor(ayahNumber)));\n    if (activeTab === 'reader') return;\n    const readerParent: Tab = activeTab === 'home' ? 'quran' : activeTab;\n    setNavigationHistory((current) => [...current, readerParent].slice(-24));\n    setActiveTab('reader');\n  };\n  const openSavedDua = (id: string) => {\n    setSelectedNameId(null);\n    setSelectedCalendarDate(null);\n    setSelectedHadithId(null);\n    moveTo('duas');\n    setSelectedDuaId(id);\n  };\n  const openSavedName = (id: string) => {\n    setSelectedDuaId(null);\n    setSelectedCalendarDate(null);\n    setSelectedHadithId(null);\n    moveTo('names');\n    setSelectedNameId(id);\n  };\n  const openSavedCalendarDate = (date: string) => {\n    setSelectedDuaId(null);\n    setSelectedNameId(null);\n    setSelectedHadithId(null);\n    moveTo('calendar');\n    setSelectedCalendarDate(date);\n  };\n  const openSavedHadith = (id: string) => {\n    setSelectedDuaId(null);\n    setSelectedNameId(null);\n    setSelectedCalendarDate(null);\n    moveTo('hadith');\n    setSelectedHadithId(id);\n  };`;

  const newDirectOpeners = `  const openQuran = () => moveTo('quran', true, { selectedAyahNumber: 1 });\n\n  const openReader = (surahNumber: number, ayahNumber = 1) => {\n    const safeAyahNumber = Math.max(1, Math.floor(ayahNumber));\n    const directTargets = {\n      selectedDuaId: null,\n      selectedNameId: null,\n      selectedCalendarDate: null,\n      selectedHadithId: null,\n    };\n\n    if (activeTab === 'reader') {\n      const snapshot = buildNavigationSnapshot({\n        selectedSurahNumber: surahNumber,\n        selectedAyahNumber: safeAyahNumber,\n        ...directTargets,\n      });\n      replaceBrowserNavigation(snapshot, browserNavigationDepth());\n      applyNavigationSnapshot(snapshot);\n      return;\n    }\n\n    if (activeTab === 'home') {\n      const quranSnapshot = buildNavigationSnapshot({\n        activeTab: 'quran',\n        navigationHistory,\n        ...directTargets,\n      });\n      pushBrowserNavigation(quranSnapshot);\n      const readerSnapshot = {\n        ...quranSnapshot,\n        activeTab: 'reader' as const,\n        navigationHistory: [...navigationHistory, 'quran' as Tab].slice(-24),\n        selectedSurahNumber: surahNumber,\n        selectedAyahNumber: safeAyahNumber,\n      };\n      pushBrowserNavigation(readerSnapshot);\n      applyNavigationSnapshot(readerSnapshot);\n      return;\n    }\n\n    const readerSnapshot = buildNavigationSnapshot({\n      activeTab: 'reader',\n      navigationHistory: [...navigationHistory, activeTab].slice(-24),\n      selectedSurahNumber: surahNumber,\n      selectedAyahNumber: safeAyahNumber,\n      ...directTargets,\n    });\n    pushBrowserNavigation(readerSnapshot);\n    applyNavigationSnapshot(readerSnapshot);\n  };\n\n  const openSavedDua = (id: string) => moveTo('duas', true, {\n    selectedDuaId: id,\n    selectedNameId: null,\n    selectedCalendarDate: null,\n    selectedHadithId: null,\n  });\n\n  const openSavedName = (id: string) => moveTo('names', true, {\n    selectedDuaId: null,\n    selectedNameId: id,\n    selectedCalendarDate: null,\n    selectedHadithId: null,\n  });\n\n  const openSavedCalendarDate = (date: string) => moveTo('calendar', true, {\n    selectedDuaId: null,\n    selectedNameId: null,\n    selectedCalendarDate: date,\n    selectedHadithId: null,\n  });\n\n  const openSavedHadith = (id: string) => moveTo('hadith', true, {\n    selectedDuaId: null,\n    selectedNameId: null,\n    selectedCalendarDate: null,\n    selectedHadithId: id,\n  });`;

  source = replaceOnce(source, oldDirectOpeners, newDirectOpeners, 'Direct browser-aware navigation');

  source = replaceOnce(
    source,
    "          <OnboardingScreen onComplete={() => {\n            setOnboardingComplete(true);\n            clearDirectTargets();\n            setNavigationHistory([]);\n            setActiveTab('home');\n          }} />",
    "          <OnboardingScreen onComplete={() => {\n            const snapshot = buildNavigationSnapshot({\n              activeTab: 'home',\n              navigationHistory: [],\n              selectedDuaId: null,\n              selectedNameId: null,\n              selectedCalendarDate: null,\n              selectedHadithId: null,\n            });\n            replaceBrowserNavigation(snapshot, 0);\n            applyNavigationSnapshot(snapshot);\n            setOnboardingComplete(true);\n          }} />",
    'Onboarding browser root',
  );

  return source;
});

await patch('scripts/check-navigation.mjs', (input) => {
  let source = input;
  source = replaceOnce(
    source,
    "const calendar = await readFile(resolve(root, 'src/screens/CalendarScreen.tsx'), 'utf8');",
    "const calendar = await readFile(resolve(root, 'src/screens/CalendarScreen.tsx'), 'utf8');\nconst browserNavigation = await readFile(resolve(root, 'src/services/browserNavigation.ts'), 'utf8');",
    'Navigation guard service source',
  );
  source = replaceOnce(
    source,
    "  'setSelectedAyahNumber(Math.max(1, Math.floor(ayahNumber)))',\n  \"onNavigate('legacy:ummah')\",",
    "  'const safeAyahNumber = Math.max(1, Math.floor(ayahNumber))',\n  \"onNavigate('legacy:ummah')\",\n  'pushBrowserNavigation',\n  'replaceBrowserNavigation',\n  'readBrowserNavigation<NavigationSnapshot>',\n  \"window.addEventListener('popstate'\",\n  'window.history.back()',\n  'window.history.go(-depth)',\n  \"activeTab: 'quran'\",\n  \"activeTab: 'reader' as const\",",
    'Navigation guard browser requirements',
  );
  source = replaceOnce(
    source,
    "if (app.includes('legacy:ummah-map')) throw new Error('Invalid legacy route remains: legacy:ummah-map');\n",
    "if (app.includes('legacy:ummah-map')) throw new Error('Invalid legacy route remains: legacy:ummah-map');\n\nfor (const fragment of [\n  \"const NAVIGATION_STATE_KEY = '__nurIslamNavigation'\",\n  'readBrowserNavigation',\n  'replaceBrowserNavigation',\n  'pushBrowserNavigation',\n  'window.history.replaceState',\n  'window.history.pushState',\n]) {\n  if (!browserNavigation.includes(fragment)) throw new Error(`Browser navigation state is missing: ${fragment}`);\n}\n",
    'Navigation guard browser state contract',
  );
  source = replaceOnce(
    source,
    "console.log('Navigation verified: history-aware screen return paths, Quran bookmarks deep-link to exact Ayat across all 114 Surahs, collection rows open exact saved Duas, Names, Hadiths and calendar dates, and legacy route IDs remain valid.');",
    "console.log('Navigation verified: visible back controls and browser/system Back share app-owned history snapshots, Home-to-Reader preserves the logical Quran parent, Quran bookmarks deep-link to exact Ayat across all 114 Surahs, collection rows open exact saved Duas, Names, Hadiths and calendar dates, and legacy route IDs remain valid.');",
    'Navigation guard summary',
  );
  return source;
});

await patch('e2e/core-flows.spec.ts', (input) => {
  let source = input;
  const anchor = `test('saves today’s Hadith and reopens that exact entry from Collections', async ({ page }) => {`;
  const tests = `test('browser Back and Forward preserve the synthetic Quran parent from Home', async ({ page }) => {\n  await page.locator('.journey-card--quran').click();\n  await expect(page.locator('.reference-reader-screen')).toBeVisible({ timeout: 15_000 });\n\n  await page.goBack();\n  await expect(page.locator('.reference-quran-screen')).toBeVisible({ timeout: 15_000 });\n  await expect(page.getByRole('heading', { name: 'Quran' })).toBeVisible();\n\n  await page.goBack();\n  await expect(page.locator('.premium-home--v2')).toBeVisible({ timeout: 15_000 });\n\n  await page.goForward();\n  await expect(page.locator('.reference-quran-screen')).toBeVisible({ timeout: 15_000 });\n});\n\ntest('primary navigation resets the app-owned browser stack', async ({ page }) => {\n  await page.locator('.journey-card').filter({ hasText: 'Dhikr' }).click();\n  await expect(page.locator('.reference-dhikr-screen')).toBeVisible();\n\n  await page.getByRole('navigation').getByText('Gebete', { exact: true }).click();\n  await expect(page.locator('.reference-prayer-screen')).toBeVisible();\n\n  const depth = await page.evaluate(() => window.history.state?.__nurIslamNavigation?.depth ?? -1);\n  expect(depth).toBe(0);\n});\n\n`;
  if (!source.includes(anchor)) throw new Error('E2E insertion anchor missing.');
  source = source.replace(anchor, tests + anchor);
  return source;
});

console.log('Guarded browser-navigation patch applied to App, navigation guard and E2E flows.');
