export type HadithEntry = {
  id: string;
  title: string;
  summary: string;
  source: string;
};

/**
 * Existing, source-labelled Hadith summaries used by the app.
 *
 * The German text deliberately remains a sinngemäße Inhaltsangabe rather than
 * pretending to be the original wording. Source presence is not a scholarly
 * review; the release checklist still requires that review before publication.
 */
export const HADITH_LIBRARY: readonly HadithEntry[] = [
  {
    id: 'intentions',
    title: 'Absichten',
    summary: 'Sinngemäßer Inhalt: Der Wert einer Handlung hängt von der Absicht ab.',
    source: 'Sahih al-Bukhari 1; Sahih Muslim 1907',
  },
  {
    id: 'mercy',
    title: 'Barmherzigkeit',
    summary: 'Sinngemäßer Inhalt: Wer anderen keine Barmherzigkeit zeigt, dem wird keine Barmherzigkeit gezeigt.',
    source: 'Sahih al-Bukhari 6013; Sahih Muslim 2319',
  },
  {
    id: 'good-word',
    title: 'Ein gutes Wort',
    summary: 'Sinngemäßer Inhalt: Auch ein gutes Wort gilt als Wohltätigkeit.',
    source: 'Sahih al-Bukhari 2989; Sahih Muslim 1009',
  },
  {
    id: 'anger',
    title: 'Selbstbeherrschung',
    summary: 'Sinngemäßer Inhalt: Wirkliche Stärke zeigt sich darin, sich im Zorn zu beherrschen.',
    source: 'Sahih al-Bukhari 6114; Sahih Muslim 2609',
  },
  {
    id: 'brother',
    title: 'Für den anderen wünschen',
    summary: 'Sinngemäßer Inhalt: Vollständiger Glaube schließt ein, für andere das Gute zu wünschen, das man für sich selbst wünscht.',
    source: 'Sahih al-Bukhari 13; Sahih Muslim 45',
  },
  {
    id: 'ease',
    title: 'Erleichtern',
    summary: 'Sinngemäßer Inhalt: Erleichtert und erschwert nicht; gebt frohe Botschaft und schreckt nicht ab.',
    source: 'Sahih al-Bukhari 69; Sahih Muslim 1734',
  },
  {
    id: 'cleanliness',
    title: 'Reinheit',
    summary: 'Sinngemäßer Inhalt: Reinheit besitzt im Glauben einen hohen Stellenwert.',
    source: 'Sahih Muslim 223',
  },
  {
    id: 'smile',
    title: 'Freundlichkeit',
    summary: 'Sinngemäßer Inhalt: Freundliche Begegnung und ein lächelndes Gesicht sind gute Taten.',
    source: 'Jami at-Tirmidhi 1956',
  },
] as const;

const SAVED_HADITH_STORAGE_KEY = 'nur_daily_hadith_saved_ids';
const LEGACY_DAILY_HADITH_STORAGE_KEY = 'nur_daily_hadith_saved';

function localDayNumber(date: Date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

export function getDailyHadith(date = new Date()) {
  const index = ((localDayNumber(date) % HADITH_LIBRARY.length) + HADITH_LIBRARY.length) % HADITH_LIBRARY.length;
  return HADITH_LIBRARY[index];
}

export function getHadithById(id: string | null | undefined) {
  return id ? HADITH_LIBRARY.find((entry) => entry.id === id) ?? null : null;
}

export function readSavedHadithIds() {
  const validIds = new Set(HADITH_LIBRARY.map((entry) => entry.id));
  const saved = new Set<string>();
  try {
    const raw = localStorage.getItem(SAVED_HADITH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        parsed.forEach((value) => {
          if (typeof value === 'string' && validIds.has(value)) saved.add(value);
        });
      }
    }

    // The old implementation stored one boolean for the fixed intentions
    // Hadith. Migrate it once so an existing bookmark is never silently lost.
    if (localStorage.getItem(LEGACY_DAILY_HADITH_STORAGE_KEY) === '1') {
      saved.add('intentions');
      localStorage.removeItem(LEGACY_DAILY_HADITH_STORAGE_KEY);
    }
    localStorage.setItem(SAVED_HADITH_STORAGE_KEY, JSON.stringify([...saved]));
  } catch {
    // Storage is optional in restricted browser modes.
  }
  return saved;
}

export function writeSavedHadithIds(ids: Set<string>) {
  const validIds = new Set(HADITH_LIBRARY.map((entry) => entry.id));
  const safe = [...ids].filter((id) => validIds.has(id));
  try {
    localStorage.setItem(SAVED_HADITH_STORAGE_KEY, JSON.stringify(safe));
  } catch {
    // Storage is optional in restricted browser modes.
  }
}
