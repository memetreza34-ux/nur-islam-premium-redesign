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
  grading?: { text: string; sourceUrl: string; comparisonUrl?: string };
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
 * explanation of the pair, leaving 20 distinct narrations. Differing grades
 * stay attributed and visible rather than silently removing an entry.
 */
export const HADITH_LIBRARY: readonly HadithEntry[] = [
  {
    id: 'intentions',
    title: 'Absichten',
    summary: 'Sinngemäßer Inhalt: Die Taten sind entsprechend den Absichten, und jedem Menschen gebührt das, was er beabsichtigt hat.',
    source: 'Sahih al-Bukhari 1; Sahih Muslim 1907a',
    context: 'Die zitierte Passage verbindet Taten mit Absichten und erläutert dies am Beispiel der Auswanderung. Sie ist keine pauschale Zusage, dass jede gut gemeinte Handlung angenommen wird.',
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
    source: 'Sahih al-Bukhari 6114; Sahih Muslim 2609a',
  },
  {
    id: 'brother',
    title: 'Für den anderen wünschen',
    summary: 'Sinngemäßer Inhalt: Keiner von euch glaubt (wahrhaftig), bis er für seinen Bruder liebt, was er für sich selbst liebt.',
    source: 'Sahih al-Bukhari 13; Sahih Muslim 45a',
    context: 'Wahrer Glaube zeigt sich darin, anderen dasselbe Gute zu wünschen, das man sich selbst wünscht.',
  },
  {
    id: 'ease',
    title: 'Erleichtern',
    summary: 'Sinngemäßer Inhalt: Erleichtert und erschwert nicht, verkündet frohe Botschaft und stoßt nicht ab.',
    source: 'Sahih al-Bukhari 69; Sahih Muslim 1734',
    context: 'Die Kurzfassung folgt al-Bukhari 69. Muslim 1734 nennt an derselben Stelle Beruhigen statt froher Botschaft; beide Fassungen fordern Erleichterung und warnen vor Abschreckung.',
  },
  {
    id: 'cleanliness',
    title: 'Reinheit',
    summary: 'Sinngemäßer Inhalt: Die Reinheit ist die Hälfte des Glaubens.',
    source: 'Sahih Muslim 223',
    context: 'Der zitierte Anfang spricht von Reinheit. Der vollständige Hadith nennt außerdem Gottesgedenken, Gebet, Wohltätigkeit und Geduld; er reduziert den Glauben nicht auf Hygiene.',
  },
  {
    id: 'smile',
    title: 'Das Lächeln als Sadaqa',
    summary: 'Sinngemäßer Inhalt: Dein Lächeln deinem Bruder gegenüber ist für dich eine Sadaqa (Wohltätigkeit).',
    source: 'Jami at-Tirmidhi 1956',
    context: 'Der vollständige Hadith nennt neben dem Lächeln auch Wegweisung, Hilfe für Menschen mit eingeschränktem Sehvermögen und das Entfernen von Hindernissen vom Weg.',
    grading: { text: 'Darussalam-Ausgabe auf Sunnah.com: hasan. At-Tirmidhi bezeichnet ihn im arabischen Sammlungstext als hasan gharib. Das sind zugeordnete Bewertungen, keine eigene Einstufung der App.', sourceUrl: 'https://sunnah.com/tirmidhi:1956' },
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
    context: 'Der zitierte Abschnitt mahnt, andere Muslime nicht durch Worte oder Handlungen zu verletzen. Der weitere Abschnitt beschreibt den Auswanderer als jemanden, der aufgibt, was Allah verboten hat.',
  },
  {
    id: 'wer-an-allah-und',
    title: 'Gutes sprechen oder schweigen',
    summary: 'Sinngemäßer Inhalt: Wer an Allah und den Jüngsten Tag glaubt, soll Gutes sprechen oder schweigen.',
    source: 'Sahih al-Bukhari 6018; Sahih Muslim 47a',
    context: 'Dieser Hadith lehrt uns Achtsamkeit in der Sprache und die Wichtigkeit, unnötige oder schädliche Worte zu vermeiden.',
  },
  {
    id: 'allah-ist-barmherzig-gegenuber',
    title: 'Barmherzigkeit auf der Erde',
    summary: 'Sinngemäßer Inhalt: Allah ist barmherzig gegenüber denen, die barmherzig sind. Seid barmherzig zu denen auf der Erde, damit derjenige im Himmel barmherzig zu euch ist.',
    source: 'Jami at-Tirmidhi 1924',
    context: 'Die zitierte Passage verbindet Barmherzigkeit auf der Erde mit der Barmherzigkeit des Allerbarmers. Sie verspricht hier Barmherzigkeit, nicht ausdrücklich Allahs Liebe. Aus dieser Kurzfassung wird keine Aussage über einen räumlichen Ort Allahs abgeleitet.',
    grading: { text: 'Darussalam-Ausgabe auf Sunnah.com: hasan. At-Tirmidhi bezeichnet ihn im arabischen Sammlungstext als hasan sahih. Die Angaben bleiben getrennt; die App vergibt kein eigenes Urteil.', sourceUrl: 'https://sunnah.com/tirmidhi:1924' },
  },
  {
    id: 'der-islam-ist-auf',
    title: 'Die fünf Säulen',
    summary: 'Sinngemäßer Inhalt: Der Islam ist auf fünf (Säulen) errichtet: dem Zeugnis, dass es keinen Gott außer Allah gibt und dass Muhammad der Gesandte Allahs ist, dem Verrichten des Gebets, dem Entrichten der Zakah, der Pilgerfahrt und dem Fasten im Ramadan.',
    source: 'Sahih al-Bukhari 8; Sahih Muslim 16c',
    context: 'Dieser Hadith nennt die fünf Grundpfeiler des Islam, auf denen das religiöse Leben eines Muslims aufbaut.',
  },
  {
    id: 'die-religion-ist-aufrichtiger',
    title: 'Aufrichtiger Rat',
    summary: 'Sinngemäßer Inhalt: Die Religion ist Aufrichtigkeit (Nasiha) gegenüber Allah, Seinem Buch, Seinem Gesandten, den Führern der Muslime und ihrer Allgemeinheit.',
    source: 'Sahih Muslim 55a',
    context: 'Nasiha umfasst hier Aufrichtigkeit und wohlmeinenden Rat. Gegenüber Allah ist damit nicht gemeint, Allah Ratschläge zu erteilen.',
  },
  {
    id: 'es-gehort-zum-guten',
    title: 'Was einen nichts angeht',
    summary: 'Sinngemäßer Inhalt: Es gehört zum guten Islam eines Menschen, dass er das unterlässt, was ihn nichts angeht.',
    source: 'Jami at-Tirmidhi 2317; vgl. an-Nawawi, Hadith 12',
    context: 'Die Bewertungen unterscheiden sich nach Quelle und Überlieferungsweg. Die Kurzfassung ist kein pauschales Verbot, sich um andere Menschen zu kümmern.',
    grading: { text: 'Darussalam-Ausgabe auf Sunnah.com: daif für Tirmidhi 2317. At-Tirmidhi nennt diesen Überlieferungsweg gharib. An-Nawawi bezeichnet den Hadith in seiner Vierzigersammlung, Nr. 12, als hasan. Unterschiedliche Zuordnungen, kein eigenes Urteil der App.', sourceUrl: 'https://sunnah.com/tirmidhi:2317', comparisonUrl: 'https://sunnah.com/nawawi40:12' },
  },
  {
    id: 'der-starke-glaubige-ist',
    title: 'Der starke Gläubige',
    summary: 'Sinngemäßer Inhalt: Der starke Gläubige ist besser und Allah lieber als der schwache Gläubige, und in beiden ist Gutes.',
    source: 'Sahih Muslim 2664',
    context: 'Der weitere Hadith fordert dazu auf, nach Nützlichem zu streben und Allah um Hilfe zu bitten. Die Kurzfassung nennt keine körperliche oder medizinische Rangordnung; sie betont auch das Gute in beiden Gläubigen.',
  },
  {
    id: 'furchte-allah-wo-immer',
    title: 'Gottesfurcht im Alltag',
    summary: 'Sinngemäßer Inhalt: Fürchte Allah, wo immer du bist, lass auf eine schlechte Tat eine gute folgen, die sie auslöscht, und begegne den Menschen mit gutem Charakter.',
    source: 'Jami at-Tirmidhi 1987',
    context: 'Die Passage nennt Gottesbewusstsein, eine gute Tat nach einer schlechten und guten Umgang mit Menschen. Sie ist keine pauschale Zusage, dass jede Verfehlung ohne weitere Voraussetzungen erledigt ist.',
    grading: { text: 'Darussalam-Ausgabe auf Sunnah.com: hasan. At-Tirmidhi bezeichnet ihn im arabischen Sammlungstext als hasan sahih. Die Angaben bleiben getrennt; die App vergibt kein eigenes Urteil.', sourceUrl: 'https://sunnah.com/tirmidhi:1987' },
  },
  {
    id: 'die-allah-liebsten-taten',
    title: 'Beständigkeit',
    summary: 'Sinngemäßer Inhalt: Die Allah liebsten Taten sind die beständigsten, auch wenn sie gering sind.',
    source: 'Sahih al-Bukhari 6464; Sahih Muslim 783b',
    context: 'Der Hadith lobt beständige Taten, auch wenn sie klein sind. Daraus folgt nicht, dass jede kleine freiwillige Tat wichtiger wäre als eine größere verpflichtende Handlung.',
  },
  {
    id: 'wer-einen-weg-beschreitet',
    title: 'Wissen suchen',
    summary: 'Sinngemäßer Inhalt: Wer einen Weg beschreitet, um darauf Wissen zu suchen, dem ebnet Allah einen Weg zum Paradies.',
    source: 'Sahih Muslim 2699a',
    context: 'Das Streben nach nützlichem Wissen ist ein Weg, der zum Paradies führt.',
  },
  {
    id: 'der-beste-von-euch',
    title: 'Umgang mit der Familie',
    summary: 'Sinngemäßer Inhalt: Der Beste von euch ist derjenige, der am besten zu seiner Familie ist, und ich bin der Beste von euch zu meiner Familie.',
    source: 'Jami at-Tirmidhi 3895',
    context: 'Wahrer guter Charakter zeigt sich zuerst im liebevollen Umgang mit der eigenen Familie.',
    grading: { text: 'Darussalam-Ausgabe auf Sunnah.com: sahih. At-Tirmidhi bezeichnet ihn im arabischen Sammlungstext als hasan gharib sahih. Das sind zugeordnete Bewertungen, keine eigene Einstufung der App.', sourceUrl: 'https://sunnah.com/tirmidhi:3895' },
  },
] as const;

const SAVED_HADITH_STORAGE_KEY = 'nur_daily_hadith_saved_ids';
export const DAILY_HADITH_IDS = ['intentions', 'mercy', 'good-word', 'anger', 'brother', 'ease', 'cleanliness'] as const;
export const DAILY_HADITH_POOL = DAILY_HADITH_IDS.map(id => HADITH_LIBRARY.find(entry => entry.id === id)!);
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
  const index = ((localDayNumber(date) % DAILY_HADITH_POOL.length) + DAILY_HADITH_POOL.length) % DAILY_HADITH_POOL.length;
  return DAILY_HADITH_POOL[index];
}

export function getHadithById(id: string | null | undefined) {
  if (!id) return null;
  const current = MERGED_HADITH_IDS[id] ?? id;
  return HADITH_LIBRARY.find((entry) => entry.id === current) ?? null;
}

export function getHadithShareText(entry: HadithEntry) {
  return [entry.summary, entry.context ? `Einordnung: ${entry.context}` : null, `Quelle: ${entry.source}`, entry.grading ? `Bewertung laut Quelle: ${entry.grading.text}\n${entry.grading.sourceUrl}${entry.grading.comparisonUrl ? `\n${entry.grading.comparisonUrl}` : ''}` : null].filter(Boolean).join('\n\n');
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
    return localStorage.getItem(SAVED_HADITH_STORAGE_KEY) === serialized && localStorage.getItem(LEGACY_LIBRARY_FAVORITES_STORAGE_KEY) === serialized;
  } catch {
    return false;
  }
}
