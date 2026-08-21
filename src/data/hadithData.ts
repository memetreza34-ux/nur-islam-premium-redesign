export type HadithEntry = {
  id: string;
  title: string;
  summary: string;
  /**
   * Collection, and the number within it where one was recorded. The entries
   * carried over from the old repository name only the collection, so the
   * number is missing on those — a real gap for the scholarly review to close.
   * Numbers are never filled in from memory.
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
    source: 'Sahih al-Bukhari 6013; Sahih Muslim 2319a',
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
  {
    id: 'die-taten-sind-entsprechend',
    title: 'Absicht der Taten',
    summary: 'Sinngemäßer Inhalt: Die Taten sind entsprechend den Absichten, und jedem Menschen gebührt das, was er beabsichtigt hat.',
    source: 'Sahih al-Bukhari 1; Sahih Muslim 1907a',
    context: 'Der Hadith verbindet Handlungen und ihren Lohn mit der Absicht und verdeutlicht dies am Beispiel der Auswanderung.',
  },
  {
    id: 'der-beste-unter-euch',
    title: 'Quran lernen und lehren',
    summary: 'Sinngemäßer Inhalt: Der Beste unter euch ist derjenige, der den Koran lernt und ihn lehrt.',
    source: 'Sahih al-Bukhari 5027',
    context: 'Der Hadith hebt ausdrücklich das Lernen und Lehren des Quran hervor.',
  },
  {
    id: 'ein-muslim-ist-derjenige',
    title: 'Zunge und Hand',
    summary: 'Sinngemäßer Inhalt: Ein Muslim ist derjenige, vor dessen Zunge und Hand die anderen Muslime sicher sind.',
    source: 'Sahih al-Bukhari 10',
    context: 'Der Hadith beschreibt das Unterlassen von Schaden durch Zunge und Hand als wichtiges Merkmal eines Muslims.',
  },
  {
    id: 'wer-an-allah-und',
    title: 'Gutes sprechen oder schweigen',
    summary: 'Sinngemäßer Inhalt: Wer an Allah und den Jüngsten Tag glaubt, soll Gutes sprechen oder schweigen.',
    source: 'Sahih al-Bukhari 6018; Sahih Muslim 47b',
    context: 'Der Hadith verbindet den Glauben an Allah und den Jüngsten Tag mit gutem Sprechen oder Schweigen.',
  },
  {
    id: 'allah-ist-barmherzig-gegenuber',
    title: 'Barmherzigkeit auf der Erde',
    summary: 'Sinngemäßer Inhalt: Allah ist barmherzig gegenüber denen, die barmherzig sind. Seid barmherzig zu denen auf der Erde, damit derjenige im Himmel barmherzig zu euch ist.',
    source: 'Jami at-Tirmidhi 1924',
    context: 'Der Hadith verbindet Barmherzigkeit gegenüber den Menschen mit der Barmherzigkeit Ar-Rahmans.',
  },
  {
    id: 'der-islam-ist-auf',
    title: 'Die fünf Säulen',
    summary: 'Sinngemäßer Inhalt: Der Islam ist auf fünf (Säulen) errichtet: dem Zeugnis, dass es keinen Gott außer Allah gibt und dass Muhammad der Gesandte Allahs ist, dem Verrichten des Gebets, dem Entrichten der Zakah, der Pilgerfahrt und dem Fasten im Ramadan.',
    source: 'Sahih al-Bukhari 8; Sahih Muslim 16c',
    context: 'Der Hadith nennt die fünf Grundpfeiler des Islam.',
  },
  {
    id: 'keiner-von-euch-glaubt',
    title: 'Für den Bruder wünschen',
    summary: 'Sinngemäßer Inhalt: Keiner von euch glaubt (wahrhaftig), bis er für seinen Bruder liebt, was er für sich selbst liebt.',
    source: 'Sahih al-Bukhari 13; Sahih Muslim 45a',
    context: 'Der Hadith verbindet den Glauben damit, dem Bruder beziehungsweise in einer Muslim-Überlieferung dem Bruder oder Nachbarn das Gute zu wünschen, das man für sich selbst wünscht.',
  },
  {
    id: 'die-religion-ist-aufrichtiger',
    title: 'Aufrichtiger Rat',
    summary: 'Sinngemäßer Inhalt: Die Religion ist aufrichtiger Rat. Wir fragten: Wem gegenüber? Er sagte: Allah, Seinem Buch, Seinem Gesandten, den Führern der Muslime und ihrer Allgemeinheit.',
    source: 'Sahih Muslim 55a',
    context: 'Der Hadith nennt Aufrichtigkeit gegenüber Allah, Seinem Buch, Seinem Gesandten, den Verantwortlichen der Muslime und ihrer Allgemeinheit.',
  },
  {
    id: 'es-gehort-zum-guten',
    title: 'Was einen nichts angeht',
    summary: 'Sinngemäßer Inhalt: Es gehört zum guten Islam eines Menschen, dass er das unterlässt, was ihn nichts angeht.',
    source: 'Jami at-Tirmidhi 2317 · auf Sunnah.com/Darussalam als Da’if eingestuft',
    context: 'Die Formulierung ist in Jami at-Tirmidhi 2317 überliefert. Die dort angezeigte Darussalam-Einstufung lautet Da’if; die fachliche Hadith-Einordnung bleibt deshalb vor Veröffentlichung ausdrücklich offen.',
  },
  {
    id: 'die-reinheit-ist-die',
    title: 'Reinheit',
    summary: 'Sinngemäßer Inhalt: Die Reinheit ist die Hälfte des Glaubens.',
    source: 'Sahih Muslim 223',
    context: 'Sahih Muslim 223 beginnt mit der Aussage, dass Reinheit die Hälfte des Glaubens ist, und nennt anschließend weitere Aussagen zu Lobpreisung, Gebet, Wohltätigkeit, Geduld und Quran.',
  },
  {
    id: 'erleichtert-und-erschwert-nicht',
    title: 'Erleichtern statt erschweren',
    summary: 'Sinngemäßer Inhalt: Erleichtert und erschwert nicht, verkündet frohe Botschaft und stoßt nicht ab.',
    source: 'Sahih al-Bukhari 69; Sahih Muslim 1734',
    context: 'Die Überlieferungen enthalten ausdrücklich die Aufforderung zu erleichtern und keine Abneigung zu erzeugen.',
  },
  {
    id: 'der-starke-glaubige-ist',
    title: 'Der starke Gläubige',
    summary: 'Sinngemäßer Inhalt: Der starke Gläubige ist besser und Allah lieber als der schwache Gläubige, und in beiden ist Gutes.',
    source: 'Sahih Muslim 2664',
    context: 'Der Hadith sagt ausdrücklich, dass in beiden Gutes ist, und fordert anschließend dazu auf, nach dem Nützlichen zu streben, Allah um Hilfe zu bitten und nicht hilflos aufzugeben.',
  },
  {
    id: 'furchte-allah-wo-immer',
    title: 'Gottesfurcht im Alltag',
    summary: 'Sinngemäßer Inhalt: Fürchte Allah, wo immer du bist, lass auf eine schlechte Tat eine gute folgen, die sie auslöscht, und begegne den Menschen mit gutem Charakter.',
    source: 'Jami at-Tirmidhi 1987 · Hasan (Darussalam)',
    context: 'Die Überlieferung verbindet Taqwa, eine gute Tat nach einer schlechten und guten Umgang mit den Menschen.',
  },
  {
    id: 'die-allah-liebsten-taten',
    title: 'Beständigkeit',
    summary: 'Sinngemäßer Inhalt: Die Allah liebsten Taten sind die beständigsten, auch wenn sie gering sind.',
    source: 'Sahih al-Bukhari 6465; Sahih Muslim 783b',
    context: 'Beide Überlieferungen betonen beständige Taten, auch wenn sie klein sind.',
  },
  {
    id: 'wer-einen-weg-beschreitet',
    title: 'Wissen suchen',
    summary: 'Sinngemäßer Inhalt: Wer einen Weg beschreitet, um darauf Wissen zu suchen, dem ebnet Allah einen Weg zum Paradies.',
    source: 'Sahih Muslim 2699a',
    context: 'Sahih Muslim 2699a enthält ausdrücklich die Aussage über den Weg des Wissens und den dadurch erleichterten Weg zum Paradies.',
  },
  {
    id: 'dein-lacheln-deinem-bruder',
    title: 'Das Lächeln als Sadaqa',
    summary: 'Sinngemäßer Inhalt: Dein Lächeln deinem Bruder gegenüber ist für dich eine Sadaqa (Wohltätigkeit).',
    source: 'Jami at-Tirmidhi 1956 · Hasan (Darussalam)',
    context: 'Die Überlieferung nennt das Lächeln ins Gesicht des Bruders ausdrücklich als Sadaqa und zählt weitere Formen guter Taten auf.',
  },
  {
    id: 'der-beste-von-euch',
    title: 'Umgang mit der Familie',
    summary: 'Sinngemäßer Inhalt: Der Beste von euch ist derjenige, der am besten zu seiner Familie ist, und ich bin der Beste von euch zu meiner Familie.',
    source: 'Jami at-Tirmidhi 3895 · Sahih (Darussalam)',
    context: 'Die Überlieferung nennt ausdrücklich den guten Umgang mit der eigenen Familie und verweist auf das Vorbild des Propheten ﷺ.',
  },
] as const;

/**
 * Nur dieser kleine Pool darf automatisch auf Home rotieren. Jeder Eintrag
 * besitzt eine konkrete Referenz in Sahih al-Bukhari und/oder Sahih Muslim.
 * Der größere Legacy-Bestand bleibt für die spätere Einzelprüfung erhalten,
 * wird aber nicht als täglicher Hadith ausgespielt.
 */
export const DAILY_HADITH_IDS = [
  'intentions',
  'mercy',
  'good-word',
  'anger',
  'brother',
  'ease',
  'cleanliness',
] as const;

const DAILY_HADITH_POOL = DAILY_HADITH_IDS
  .map((id) => HADITH_LIBRARY.find((entry) => entry.id === id))
  .filter((entry): entry is HadithEntry => Boolean(entry));

const SAVED_HADITH_STORAGE_KEY = 'nur_daily_hadith_saved_ids';
const LEGACY_DAILY_HADITH_STORAGE_KEY = 'nur_daily_hadith_saved';
const LEGACY_LIBRARY_FAVORITES_STORAGE_KEY = 'nur_hadith_library_favorites';

function localDayNumber(date: Date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

export function getDailyHadith(date = new Date()) {
  const pool = DAILY_HADITH_POOL.length ? DAILY_HADITH_POOL : [HADITH_LIBRARY[0]];
  const index = ((localDayNumber(date) % pool.length) + pool.length) % pool.length;
  return pool[index];
}

export function getHadithById(id: string | null | undefined) {
  return id ? HADITH_LIBRARY.find((entry) => entry.id === id) ?? null : null;
}

function addValidSavedValues(saved: Set<string>, raw: string | null, validIds: Set<string>) {
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return;
    parsed.forEach((value) => {
      if (typeof value === 'string' && validIds.has(value)) saved.add(value);
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

    if (localStorage.getItem(LEGACY_DAILY_HADITH_STORAGE_KEY) === '1') {
      saved.add('intentions');
      localStorage.removeItem(LEGACY_DAILY_HADITH_STORAGE_KEY);
    }

    const serialized = JSON.stringify([...saved]);
    localStorage.setItem(SAVED_HADITH_STORAGE_KEY, serialized);
    localStorage.setItem(LEGACY_LIBRARY_FAVORITES_STORAGE_KEY, serialized);
  } catch {
    // Storage is optional in restricted browser modes.
  }
  return saved;
}

export function writeSavedHadithIds(ids: Set<string>) {
  const validIds = new Set(HADITH_LIBRARY.map((entry) => entry.id));
  const safe = [...ids].filter((id) => validIds.has(id));
  try {
    const serialized = JSON.stringify(safe);
    localStorage.setItem(SAVED_HADITH_STORAGE_KEY, serialized);
    localStorage.setItem(LEGACY_LIBRARY_FAVORITES_STORAGE_KEY, serialized);
  } catch {
    // Storage is optional in restricted browser modes.
  }
}
