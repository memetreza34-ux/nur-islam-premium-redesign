export type HadithEntry = {
  id: string;
  title: string;
  summary: string;
  /**
   * Collection, and the number within it where the narration was recorded.
   *
   * Every entry now carries a number. The seventeen carried over from the old
   * repository named the collection only; the numbers below were looked up
   * against the collections themselves (sunnah.com for Sahih Muslim, whose
   * numbering differs between editions, and the open eng-* editions for
   * al-Bukhari and at-Tirmidhi, whose numbering matches sunnah.com). Each was
   * confirmed by reading the narration at that number and comparing it with
   * the summary here — never written from memory.
   */
  source: string;
  /** Explanation carried over with the entry, where one existed. */
  context?: string;
};

/**
 * Existing, source-labelled Hadith summaries used by the app.
 *
 * The German text deliberately remains a sinngemäße Inhaltsangabe rather than
 * pretending to be the original wording. Source presence is not a scholarly
 * review; the release checklist still requires that review before publication.
 *
 * The library held 25 entries, five of which were the same narration twice:
 * the old repository carried both a numbered and an unnumbered copy of the
 * intentions, brother, leniency, purity and smile Hadith. The daily rotation
 * showed each of those twice per cycle, in different words and with different
 * sourcing. They are merged, keeping the verified number and the fuller
 * explanation of the pair, which leaves 20 distinct narrations.
 */
export const HADITH_LIBRARY: readonly HadithEntry[] = [
  {
    id: 'intentions',
    title: 'Absichten',
    summary: 'Sinngemäßer Inhalt: Die Taten sind entsprechend den Absichten, und jedem Menschen gebührt das, was er beabsichtigt hat.',
    source: 'Sahih al-Bukhari 1; Sahih Muslim 1907',
    context: 'Dieser Hadith betont, dass die Aufrichtigkeit der Absicht (Niyyah) die Grundlage für die Annahme jeder Handlung bei Allah ist.',
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
    summary: 'Sinngemäßer Inhalt: Keiner von euch glaubt (wahrhaftig), bis er für seinen Bruder liebt, was er für sich selbst liebt.',
    source: 'Sahih al-Bukhari 13; Sahih Muslim 45',
    context: 'Wahrer Glaube zeigt sich darin, anderen dasselbe Gute zu wünschen, das man sich selbst wünscht.',
  },
  {
    id: 'ease',
    title: 'Erleichtern',
    summary: 'Sinngemäßer Inhalt: Erleichtert und erschwert nicht, verkündet frohe Botschaft und stoßt nicht ab.',
    source: 'Sahih al-Bukhari 69; Sahih Muslim 1734',
    context: 'Der Prophet ﷺ lehrte Sanftheit und Erleichterung im Umgang mit den Menschen und in der Religion.',
  },
  {
    id: 'cleanliness',
    title: 'Reinheit',
    summary: 'Sinngemäßer Inhalt: Die Reinheit ist die Hälfte des Glaubens.',
    source: 'Sahih Muslim 223',
    context: 'Äußere und innere Reinheit nehmen im Islam einen hohen Stellenwert ein.',
  },
  {
    id: 'smile',
    title: 'Das Lächeln als Sadaqa',
    summary: 'Sinngemäßer Inhalt: Dein Lächeln deinem Bruder gegenüber ist für dich eine Sadaqa (Wohltätigkeit).',
    source: 'Jami at-Tirmidhi 1956',
    context: 'Schon kleine freundliche Gesten gelten im Islam als Wohltätigkeit.',
  },
  {
    id: 'der-beste-unter-euch',
    title: 'Quran lernen und lehren',
    summary: 'Sinngemäßer Inhalt: Der Beste unter euch ist derjenige, der den Koran lernt und ihn lehrt.',
    source: 'Sahih al-Bukhari 5027',
    context: 'Das Studium und die Weitergabe des göttlichen Wortes gehören zu den edelsten Beschäftigungen eines Gläubigen.',
  },
  {
    id: 'ein-muslim-ist-derjenige',
    title: 'Zunge und Hand',
    summary: 'Sinngemäßer Inhalt: Ein Muslim ist derjenige, vor dessen Zunge und Hand die anderen Muslime sicher sind.',
    source: 'Sahih al-Bukhari 10',
    context: 'Wahrer Glaube zeigt sich im respektvollen und friedlichen Umgang mit seinen Mitmenschen.',
  },
  {
    id: 'wer-an-allah-und',
    title: 'Gutes sprechen oder schweigen',
    summary: 'Sinngemäßer Inhalt: Wer an Allah und den Jüngsten Tag glaubt, soll Gutes sprechen oder schweigen.',
    source: 'Sahih al-Bukhari 6018; Sahih Muslim 47',
    context: 'Dieser Hadith lehrt uns Achtsamkeit in der Sprache und die Wichtigkeit, unnötige oder schädliche Worte zu vermeiden.',
  },
  {
    id: 'allah-ist-barmherzig-gegenuber',
    title: 'Barmherzigkeit auf der Erde',
    summary: 'Sinngemäßer Inhalt: Allah ist barmherzig gegenüber denen, die barmherzig sind. Seid barmherzig zu denen auf der Erde, damit derjenige im Himmel barmherzig zu euch ist.',
    source: 'Jami at-Tirmidhi 1924',
    context: 'Barmherzigkeit gegenüber allen Geschöpfen ist ein zentraler Wert im Islam und ein Weg, Allahs Liebe zu erlangen.',
  },
  {
    id: 'der-islam-ist-auf',
    title: 'Die fünf Säulen',
    summary: 'Sinngemäßer Inhalt: Der Islam ist auf fünf (Säulen) errichtet: dem Zeugnis, dass es keinen Gott außer Allah gibt und dass Muhammad der Gesandte Allahs ist, dem Verrichten des Gebets, dem Entrichten der Zakah, der Pilgerfahrt und dem Fasten im Ramadan.',
    source: 'Sahih al-Bukhari 8; Sahih Muslim 16',
    context: 'Dieser Hadith nennt die fünf Grundpfeiler des Islam, auf denen das religiöse Leben eines Muslims aufbaut.',
  },
  {
    id: 'die-religion-ist-aufrichtiger',
    title: 'Aufrichtiger Rat',
    summary: 'Sinngemäßer Inhalt: Die Religion ist aufrichtiger Rat. Wir fragten: Wem gegenüber? Er sagte: Allah, Seinem Buch, Seinem Gesandten, den Führern der Muslime und ihrer Allgemeinheit.',
    source: 'Sahih Muslim 55',
    context: 'Der Islam beruht auf Aufrichtigkeit gegenüber Allah, Seiner Offenbarung und den Menschen.',
  },
  {
    id: 'es-gehort-zum-guten',
    title: 'Was einen nichts angeht',
    summary: 'Sinngemäßer Inhalt: Es gehört zum guten Islam eines Menschen, dass er das unterlässt, was ihn nichts angeht.',
    source: 'Jami at-Tirmidhi 2317',
    context: 'Ein Zeichen guten Glaubens ist es, sich nicht in Belanglosigkeiten oder fremde Angelegenheiten einzumischen.',
  },
  {
    id: 'der-starke-glaubige-ist',
    title: 'Der starke Gläubige',
    summary: 'Sinngemäßer Inhalt: Der starke Gläubige ist besser und Allah lieber als der schwache Gläubige, und in beiden ist Gutes.',
    source: 'Sahih Muslim 2664',
    context: 'Stärke in Glaube, Charakter und Tatkraft wird gelobt, ohne den schwächeren Gläubigen abzuwerten.',
  },
  {
    id: 'furchte-allah-wo-immer',
    title: 'Gottesfurcht im Alltag',
    summary: 'Sinngemäßer Inhalt: Fürchte Allah, wo immer du bist, lass auf eine schlechte Tat eine gute folgen, die sie auslöscht, und begegne den Menschen mit gutem Charakter.',
    source: 'Jami at-Tirmidhi 1987',
    context: 'Drei umfassende Ratschläge: Gottesbewusstsein, Wiedergutmachung und guter Umgang mit den Menschen.',
  },
  {
    id: 'die-allah-liebsten-taten',
    title: 'Beständigkeit',
    summary: 'Sinngemäßer Inhalt: Die Allah liebsten Taten sind die beständigsten, auch wenn sie gering sind.',
    source: 'Sahih al-Bukhari 6464; Sahih Muslim 783',
    context: 'Beständigkeit in guten Taten ist wertvoller als seltene, große Anstrengungen.',
  },
  {
    id: 'wer-einen-weg-beschreitet',
    title: 'Wissen suchen',
    summary: 'Sinngemäßer Inhalt: Wer einen Weg beschreitet, um darauf Wissen zu suchen, dem ebnet Allah einen Weg zum Paradies.',
    source: 'Sahih Muslim 2699',
    context: 'Das Streben nach nützlichem Wissen ist ein Weg, der zum Paradies führt.',
  },
  {
    id: 'der-beste-von-euch',
    title: 'Umgang mit der Familie',
    summary: 'Sinngemäßer Inhalt: Der Beste von euch ist derjenige, der am besten zu seiner Familie ist, und ich bin der Beste von euch zu meiner Familie.',
    source: 'Jami at-Tirmidhi 3895',
    context: 'Wahrer guter Charakter zeigt sich zuerst im liebevollen Umgang mit der eigenen Familie.',
  },
] as const;

const SAVED_HADITH_STORAGE_KEY = 'nur_daily_hadith_saved_ids';
const LEGACY_DAILY_HADITH_STORAGE_KEY = 'nur_daily_hadith_saved';
const LEGACY_LIBRARY_FAVORITES_STORAGE_KEY = 'nur_hadith_library_favorites';

/**
 * The duplicate half of each merged pair, pointing at the entry that survived.
 *
 * Dropping an id silently drops the bookmark with it, and a saved Hadith
 * disappearing is exactly the kind of loss nobody reports and everybody
 * notices. A bookmark on either copy now resolves to the merged entry.
 */
const MERGED_HADITH_IDS: Readonly<Record<string, string>> = {
  'die-taten-sind-entsprechend': 'intentions',
  'keiner-von-euch-glaubt': 'brother',
  'erleichtert-und-erschwert-nicht': 'ease',
  'die-reinheit-ist-die': 'cleanliness',
  'dein-lacheln-deinem-bruder': 'smile',
};

function localDayNumber(date: Date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

export function getDailyHadith(date = new Date()) {
  const index = ((localDayNumber(date) % HADITH_LIBRARY.length) + HADITH_LIBRARY.length) % HADITH_LIBRARY.length;
  return HADITH_LIBRARY[index];
}

export function getHadithById(id: string | null | undefined) {
  if (!id) return null;
  const current = MERGED_HADITH_IDS[id] ?? id;
  return HADITH_LIBRARY.find((entry) => entry.id === current) ?? null;
}

function addValidSavedValues(saved: Set<string>, raw: string | null, validIds: Set<string>) {
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return;
    parsed.forEach((value) => {
      if (typeof value !== 'string') return;
      const id = MERGED_HADITH_IDS[value] ?? value;
      if (validIds.has(id)) saved.add(id);
    });
  } catch {
    // A damaged legacy key must not prevent valid favorites in another key
    // from being recovered and mirrored back into a clean payload.
  }
}

export function readSavedHadithIds() {
  const validIds = new Set(HADITH_LIBRARY.map((entry) => entry.id));
  const saved = new Set<string>();
  try {
    addValidSavedValues(saved, localStorage.getItem(SAVED_HADITH_STORAGE_KEY), validIds);
    addValidSavedValues(saved, localStorage.getItem(LEGACY_LIBRARY_FAVORITES_STORAGE_KEY), validIds);

    // The old daily implementation stored one boolean for the fixed intentions
    // Hadith. Migrate it once so an existing bookmark is never silently lost.
    if (localStorage.getItem(LEGACY_DAILY_HADITH_STORAGE_KEY) === '1') {
      saved.add('intentions');
      localStorage.removeItem(LEGACY_DAILY_HADITH_STORAGE_KEY);
    }

    const serialized = JSON.stringify([...saved]);
    localStorage.setItem(SAVED_HADITH_STORAGE_KEY, serialized);
    // Keep the legacy library key mirrored until the old library screen has
    // been fully migrated to the shared helper. This makes saving interoperable
    // immediately in both directions instead of showing conflicting states.
    localStorage.setItem(LEGACY_LIBRARY_FAVORITES_STORAGE_KEY, serialized);
  } catch {
    // Storage is optional in restricted browser modes.
  }
  return saved;
}

export function writeSavedHadithIds(ids: Set<string>) {
  const validIds = new Set(HADITH_LIBRARY.map((entry) => entry.id));
  const safe = [...ids].map((id) => MERGED_HADITH_IDS[id] ?? id).filter((id) => validIds.has(id));
  try {
    const serialized = JSON.stringify([...new Set(safe)]);
    localStorage.setItem(SAVED_HADITH_STORAGE_KEY, serialized);
    localStorage.setItem(LEGACY_LIBRARY_FAVORITES_STORAGE_KEY, serialized);
  } catch {
    // Storage is optional in restricted browser modes.
  }
}
