import { describe, expect, it } from 'vitest';
import { getCategoryLessons, getLearningCategory, LEARNING_LESSONS } from './islamicLearningContent';

const expectedPracticeSources = {
  'practice-overview': ['https://quran.com/16/43', 'https://quran.com/17/36', 'https://islamansiklopedisi.org.tr/fikih#1', 'https://cdn2.islamansiklopedisi.org.tr/dosya/12/C12004617.pdf'],
  'fiqh-purity': ['https://quran.com/5/6', 'https://sunnah.com/bukhari:135', 'https://sunnah.com/muslim:277', 'https://islamansiklopedisi.org.tr/abdest', undefined],
  'fiqh-ghusl-tayammum': ['https://quran.com/5/6', 'https://quran.com/4/43', 'https://islamansiklopedisi.org.tr/gusul', 'https://cdn2.islamansiklopedisi.org.tr/dosya/41/C41013310.pdf'],
  'fiqh-prayer-time': ['https://quran.com/4/103', 'https://aladhan.com/calculation-methods', 'https://aladhan.com/play', undefined],
  'fiqh-asking': ['https://quran.com/16/43', 'https://quran.com/17/36', 'https://islamansiklopedisi.org.tr/fikih#1', 'https://cdn2.islamansiklopedisi.org.tr/dosya/12/C12004617.pdf'],
};

describe('practice lessons and their source boundaries', () => {
  const lesson = (id: string) => LEARNING_LESSONS.find(item => item.id === id)!;
  it.each(Object.entries(expectedPracticeSources))('%s retains compared external references and honest internal references', (id, urls) => {
    expect(lesson(id).sources.map(source => source.url)).toEqual(urls);
    expect(lesson(id).sources.every(source => source.note.length > 15)).toBe(true);
    for (const source of lesson(id).sources.filter(item => !item.url)) {
      expect(source.label).toBe('App-Bereich');
      expect(source.note).toContain('Interner Bedienhinweis');
      expect(source.note).toMatch(/[Kk]ein religiöser Beleg/);
    }
  });
  it('keeps five existing lessons with 46 inventory positions and 21 source entries', () => {
    const lessons = getCategoryLessons('practice');
    expect(lessons.map(item => item.id)).toEqual(Object.keys(expectedPracticeSources));
    expect(getLearningCategory('practice').lessonIds).toEqual(Object.keys(expectedPracticeSources));
    expect(lessons.reduce((sum, item) => sum + 2 + item.paragraphs.length + (item.detailItems?.length ?? 0) + item.keyPoints.length, 0)).toBe(46);
    expect(lessons.reduce((sum, item) => sum + item.sources.length, 0)).toBe(21);
    expect(LEARNING_LESSONS).toHaveLength(44);
  });
  it('describes the actual four topics instead of promising absent examples', () => {
    const item = lesson('practice-overview');
    expect(item.paragraphs[1]).toContain('vier Themenlektionen');
    expect(item.keyPoints[1]).toContain('Vier Themenlektionen');
    expect(JSON.stringify(item)).not.toContain('Jede Lektion enthält ein praktisches Beispiel');
  });
  it('includes voluntary prayer and does not require automatic Wudu renewal', () => {
    const item = lesson('fiqh-purity');
    expect(item.paragraphs[0]).toContain('freiwillige Gebete');
    expect(item.paragraphs[0]).toContain('vier sunnitischen Rechtsschulen');
    expect(item.paragraphs[0]).toContain('noch gültiger Wudu');
    expect(item.sources[2].reference).toContain('Buch 2, Hadith 108');
    expect(item.sources[2].note).toContain('inzwischen ungültiger');
  });
  it('does not promise a complete school comparison in the separate Wudu guide', () => {
    expect(lesson('fiqh-purity').paragraphs[1]).toContain('keinen vollständigen Vergleich');
    expect(lesson('fiqh-purity').sources[4].note).toContain('allgemeinem Rechtsschulhinweis');
  });
  it('does not declare every shower invalid or valid regardless of school conditions', () => {
    const item = lesson('fiqh-ghusl-tayammum');
    expect(item.paragraphs[0]).toContain('auch unter der Dusche');
    expect(item.paragraphs[0]).toContain('wenn die erforderlichen Bedingungen erfüllt');
    expect(item.paragraphs[0]).toContain('nicht pauschal gültig oder ungültig');
    expect(item.sources[2].note).toContain('Absicht hanafitisch Sunnah');
    expect(item.sources[2].note).toContain('bei den anderen drei sunnitischen Schulen verpflichtend');
    expect(item.sources[2].note).toContain('Mund/Nase hanafitisch und hanbalitisch verpflichtend');
  });
  it('does not accept every clean surface for Tayammum or hide material differences', () => {
    const paragraph = lesson('fiqh-ghusl-tayammum').paragraphs[1];
    expect(paragraph).toContain('staubhaltige reine Erde');
    expect(paragraph).toContain('Abu Hanifa und die malikitische Schule');
    expect(paragraph).toContain('Nicht jede saubere Oberfläche genügt');
  });
  it('separates provider calculation, the Asr setting and religious evidence', () => {
    const item = lesson('fiqh-prayer-time');
    expect(item.paragraphs[1]).toContain('gesonderte Schulauswahl betrifft Asr');
    expect(item.paragraphs[1]).toContain('keine Messung');
    expect(item.sources[0].note).toContain('Kein Beleg für eine bestimmte API-Methode');
    expect(item.sources[1].note).toContain('keine religiöse Konsensbestätigung');
    expect(item.sources[2].note).toContain('kein allgemeiner Rechtsschulwechsel');
  });
  it('retains scripture context and qualified case-specific advice without infallibility', () => {
    for (const id of ['practice-overview', 'fiqh-asking']) {
      const item = lesson(id);
      expect(item.sources[0].note).toContain('frühere menschliche Gesandte und Schriftkundige');
      expect(item.sources[3].reference).toContain('Fahrettin Atar');
      expect(item.sources[3].reference).toContain('490 und 493');
    }
    expect(lesson('fiqh-asking').question.options[0]).toContain('vollständigen Umstände');
    expect(lesson('fiqh-asking').sources[1].note).toContain('keine eigene Fatwa');
  });
});

const expectedTerminologySources = {
  'terms-overview': ['https://quran.com/16/116', 'https://quran.com/17/36'],
  'terms-islam-iman-ihsan': ['https://sunnah.com/muslim:8a', 'https://quran.com/2/177', 'https://quran.com/49/14'],
  'terms-fard': ['https://quran.com/4/103', 'https://quran.com/2/183-185', 'https://islamansiklopedisi.org.tr/farz', 'https://sunnah.com/muslim:11a', 'https://sunnah.com/muslim:612d'],
  'terms-sunnah': ['https://quran.com/33/21', 'https://sunnah.com/bukhari:631', 'https://islamansiklopedisi.org.tr/sunnet--peygamber', 'https://islamansiklopedisi.org.tr/sunnet--hukum', 'https://sunnah.com/muslim:728b'],
  'terms-mubah-makruh': ['https://sunnah.com/bukhari:52', 'https://sunnah.com/muslim:1599a', 'https://quran.com/5/87', 'https://islamansiklopedisi.org.tr/mekruh', 'https://islamansiklopedisi.org.tr/mubah'],
  'terms-halal': ['https://quran.com/16/114', 'https://quran.com/2/168', 'https://quran.com/2/275', 'https://islamansiklopedisi.org.tr/helal#2-fikih'],
  'terms-haram': ['https://quran.com/16/115', 'https://quran.com/16/116', 'https://islamansiklopedisi.org.tr/haram#2-fikih'],
  'terms-hadith-fiqh-madhhab': ['https://quran.com/4/59', 'https://quran.com/16/43', 'https://islamansiklopedisi.org.tr/sunnet--peygamber', 'https://islamansiklopedisi.org.tr/hadis', 'https://islamansiklopedisi.org.tr/fikih#1', 'https://islamansiklopedisi.org.tr/mezhep#4-fikih'],
};

describe('remaining eight terminology lessons and precise source limits', () => {
  const lesson = (id: string) => LEARNING_LESSONS.find(item => item.id === id)!;
  it.each(Object.entries(expectedTerminologySources))('%s retains compared references and meaningful notes', (id, urls) => {
    expect(lesson(id).sources.map(source => source.url)).toEqual(urls);
    expect(lesson(id).sources.every(source => source.note.length > 15)).toBe(true);
  });
  it('keeps eight lessons with 88 inventory positions and 33 source entries', () => {
    const lessons = Object.keys(expectedTerminologySources).map(lesson);
    expect(lessons.reduce((sum, item) => sum + 2 + item.paragraphs.length + item.detailItems!.length + item.keyPoints.length, 0)).toBe(88);
    expect(lessons.reduce((sum, item) => sum + item.sources.length, 0)).toBe(33);
    expect(getCategoryLessons('terms')).toHaveLength(12);
    expect(LEARNING_LESSONS).toHaveLength(44);
  });
  it('preserves both parts of the Ihsan explanation as a paraphrase', () => {
    const item = lesson('terms-islam-iman-ihsan');
    expect(item.paragraphs[0]).toContain('sinngemäß');
    expect(item.paragraphs[0]).toContain('als ob du Ihn sähest');
    expect(item.detailItems![2].text).toContain('auch wenn du Ihn nicht siehst, sieht Er dich');
    expect(item.sources[2].note).toContain('Kein App-Urteil');
  });
  it('retains prayer names, fasting exceptions and the school-specific Fard distinction', () => {
    const item = lesson('terms-fard');
    expect(item.detailItems![0].text).toContain('Fajr-, Dhuhr-, Asr-, Maghrib- und Isha');
    expect(item.sources[1].note).toContain('Krankheit und Reise');
    expect(item.paragraphs[2]).toContain('hanafitischen Fachsprache');
    expect(item.sources[3].note).toContain('Kein pauschaler Ausschluss');
  });
  it('does not certify health or any financial product merely by a Halal label', () => {
    const item = lesson('terms-halal');
    expect(item.paragraphs[2]).toContain('allein kein Nachweis');
    expect(item.sources[2].note).toContain('Keine pauschale Freigabe');
    expect(item.question.options[item.question.correctIndex]).toBe('Religiös erlaubt oder zulässig');
  });
  it('does not remove either condition of the necessity exception', () => {
    const item = lesson('terms-haram');
    expect(item.paragraphs[1]).toContain('nicht aus Verlangen');
    expect(item.paragraphs[1]).toContain('nicht über den nötigen Bedarf');
    expect(item.detailItems![0].text).toContain('ohne Überschreiten');
    expect(item.sources[0].note).toContain('keine pauschale Freigabe');
  });
  it('keeps the scripture context and distinguishes Fiqh schools from broader Madhhab usage', () => {
    const item = lesson('terms-hadith-fiqh-madhhab');
    expect(item.paragraphs[1]).toContain('hier eine gewachsene Fiqh-Rechtsschule');
    expect(item.paragraphs[1]).toContain('theologische Schule');
    expect(item.sources[1].note).toContain('frühere menschliche Gesandte und Schriftkundige');
    expect(item.detailItems![0].text).toContain('bestätigt weder seine Echtheit');
  });
});

const expectedDevotionSources = {
  'terms-niyyah': ['https://sunnah.com/bukhari:1', 'https://quran.com/98/5', 'https://www.dar-alifta.org/ar/fatwa/details/23253/حكم-التلفظ-بالنية-عند-كل-صلاة', 'https://sunnah.com/muslim:1015'],
  'terms-dua': ['https://quran.com/2/186', 'https://quran.com/40/60', 'https://sunnah.com/muslim:2697a', 'https://sunnah.com/muslim:2735c', 'https://www.dar-alifta.org/ar/fatwa/details/17537/حكم-الذكر-والدعاء-بغير-المأثور-في-الصلاة', 'https://www.dar-alifta.org/ar/fatwa/details/21715/حكم-الذكر-عند-الطواف-بالبيت-بالأذكار-المأثورة-وغير-المأثورة'],
  'terms-dhikr': ['https://quran.com/33/41', 'https://quran.com/13/28', 'https://sunnah.com/muslim:2137a', 'https://sunnah.com/muslim:2675a', 'https://sunnah.com/muslim:2699a'],
  'terms-tawba': ['https://quran.com/66/8', 'https://quran.com/39/53-54', 'https://www.dar-alifta.org/en/fatwa/details/7148/how-can-i-repent-from-a-sin-so-god-would-forgive-me', 'https://sunnah.com/bukhari:2449', 'https://sunnah.com/muslim:2758a'],
};

describe('Niyyah, Dua, Dhikr and Tawba source boundaries', () => {
  const lesson = (id: string) => LEARNING_LESSONS.find(item => item.id === id)!;
  it.each(Object.entries(expectedDevotionSources))('%s retains the actually compared references', (id, urls) => {
    expect(lesson(id).sources.map(source => source.url)).toEqual(urls);
    expect(lesson(id).sources.every(source => source.note.length > 15)).toBe(true);
  });
  it('keeps four existing lessons, 44 content positions and 20 source entries', () => {
    const lessons = Object.keys(expectedDevotionSources).map(lesson);
    expect(lessons.reduce((sum, item) => sum + 2 + item.paragraphs.length + item.detailItems!.length + item.keyPoints.length, 0)).toBe(44);
    expect(lessons.reduce((sum, item) => sum + item.sources.length, 0)).toBe(20);
    expect(LEARNING_LESSONS).toHaveLength(44);
  });
  it('does not impose a universal verbal intention rule', () => {
    const item = lesson('terms-niyyah');
    expect(item.sources[2].reference).toContain('8922');
    expect(item.sources[2].note).toContain('unterschiedliche Auffassungen');
    expect(item.sources[3].note).toContain('erlaubtes Handeln');
  });
  it('does not apply unrestricted own wording to Salah or promise instant results', () => {
    const item = lesson('terms-dua');
    expect(item.paragraphs[1]).toContain('nicht uneingeschränkt');
    expect(item.detailItems![0].text).toContain('keine vollständige wörtliche Wiedergabe');
    expect(item.sources[0].note).toContain('Keine garantierte sofortige Erfüllung');
    expect(item.sources[4].reference).toContain('6904');
  });
  it('does not turn spiritual comfort into a medical cure or invent repetition counts', () => {
    const item = lesson('terms-dhikr');
    expect(item.sources[1].note).toContain('keine medizinische Heilungszusage');
    expect(item.sources[0].note).toContain('keine hier festgelegte Wiederholungszahl');
    expect(item.detailItems![0].text).toContain('sinngemäß');
  });
  it('keeps rights, actual repentance and the contextual mercy verses together', () => {
    const item = lesson('terms-tawba');
    expect(item.paragraphs[1]).toContain('Rechte anderer Menschen');
    expect(item.paragraphs[2]).toContain('keine Erlaubnis, die Sünde weiterzuplanen');
    expect(item.sources[1].reference).toContain('39:53–54');
    expect(item.sources[3].note).toContain('gesonderte Einordnung');
  });
});

describe('technical religious terminology corrections', () => {
  const lesson = (id: string) => LEARNING_LESSONS.find(item => item.id === id)!;
  it('describes eleven topics instead of promising one separate lesson per word', () => {
    const item = lesson('terms-overview');
    expect(getCategoryLessons('terms').slice(1)).toHaveLength(11);
    expect(item.summary).toContain('elf Themen');
    expect(item.paragraphs[1]).toContain('teils gemeinsam erklärt');
    expect(item.question.options[item.question.correctIndex]).toContain('Elf Themenlektionen');
  });
  it('does not reduce all Makruh usage to recommended avoidance', () => {
    const item = lesson('terms-mubah-makruh');
    expect(item.summary).toContain('genaue rechtliche Verwendung');
    expect(item.paragraphs[1]).toContain('Unterlassen verbindlich verlangt');
    expect(item.detailItems![1].text).toContain('Tahrimi');
    expect(item.question.options[item.question.correctIndex]).toContain('Makruh tahrimi');
    expect(item.question.explanation).toContain('Verbindlichkeit');
    expect(item.sources.map(source => source.url)).toEqual(expectedTerminologySources['terms-mubah-makruh']);
  });
  it('does not turn the mere term Hadith into an authenticity guarantee', () => {
    const item = lesson('terms-hadith-fiqh-madhhab');
    expect(item.paragraphs[0]).toContain('noch nicht seine Authentizität');
    expect(item.paragraphs[0]).toContain('synonym verwendet');
    expect(item.question.explanation).toContain('Echtheitsbewertung ist gesondert nötig');
    expect(item.sources[2].url).toBe('https://islamansiklopedisi.org.tr/sunnet--peygamber');
  });
  it('sources Fard/Wajib distinctions without inventing a personal religious verdict', () => {
    expect(lesson('terms-fard').sources[2].url).toBe('https://islamansiklopedisi.org.tr/farz');
    expect(lesson('terms-fard').sources[2].note).toContain('beide verbindlich');
    expect(lesson('terms-fard').sources[2].note).toContain('Kein persönliches Urteil');
  });
  it('separates the broader Sunnah concept and the recommended legal category', () => {
    const item = lesson('terms-sunnah');
    expect(item.sources.slice(2, 4).map(source => source.url)).toEqual(['https://islamansiklopedisi.org.tr/sunnet--peygamber', 'https://islamansiklopedisi.org.tr/sunnet--hukum']);
    expect(item.sources[4].url).toBe('https://sunnah.com/muslim:728b');
    expect(getCategoryLessons('terms')).toHaveLength(12);
    expect(LEARNING_LESSONS).toHaveLength(44);
  });
});

const expectedFaithSources = {
  'faith-overview': ['https://quran.com/2/285', 'https://sunnah.com/muslim:8a'],
  'faith-allah': ['https://quran.com/112', 'https://quran.com/2/255', 'https://quran.com/6/102', 'https://quran.com/1/5', 'https://quran.com/10/107', 'https://quran.com/42/11'],
  'faith-angels': ['https://quran.com/2/285', 'https://quran.com/66/6', 'https://quran.com/2/97', 'https://quran.com/82/10-12', 'https://quran.com/21/26-27'],
  'faith-books': ['https://quran.com/2/285', 'https://quran.com/5/48', 'https://quran.com/3/3', 'https://quran.com/4/163', 'https://quran.com/15/9'],
  'faith-messengers': ['https://quran.com/2/285', 'https://quran.com/33/40', 'https://quran.com/4/163-164', 'https://quran.com/21/25', 'https://quran.com/33/21', 'https://quran.com/16/44'],
  'faith-last-day': ['https://quran.com/99/6-8', 'https://sunnah.com/muslim:8a', 'https://quran.com/22/7', 'https://quran.com/7/187', 'https://quran.com/39/53-54'],
  'faith-decree': ['https://quran.com/54/49', 'https://sunnah.com/muslim:8a', 'https://quran.com/81/28-29', 'https://quran.com/2/255', 'https://sunnah.com/muslim:2664', 'https://quran.com/99/6-8'],
};

const expectedPillarSources = {
  'pillars-overview': ['https://sunnah.com/bukhari:8', 'https://sunnah.com/muslim:16b'],
  'pillars-shahada': ['https://quran.com/3/18', 'https://quran.com/48/29', 'https://sunnah.com/bukhari:8', 'https://sunnah.com/muslim:403a'],
  'pillars-prayer': ['https://quran.com/4/103', 'https://quran.com/20/14', 'https://sunnah.com/muslim:11a', 'https://sunnah.com/muslim:612d', 'https://sunnah.com/muslim:1094a', 'https://quran.com/5/6', 'https://quran.com/2/144', 'https://quran.com/7/31', 'https://www.dar-alifta.org/en/fatwa/details/6483/praying-over-the-deceased-in-the-mosque'],
  'pillars-zakat': ['https://quran.com/2/43', 'https://quran.com/9/60', 'https://sunnah.com/bukhari:8', 'https://sunnah.com/bukhari:1454', 'https://aliftaa.jo/en-fatwas/255/DefaultEn.aspx', 'https://www.dar-alifta.org/en/fatwa/details/6754/should-i-pay-zakat-on-my-bank-account-before-deducting-the-debt-i-owe-for-purchas'],
  'pillars-fasting': ['https://quran.com/2/183-185', 'https://quran.com/2/187', 'https://sunnah.com/bukhari:8', 'https://sunnah.com/muslim:1094a', 'https://sunnah.com/bukhari:1', 'https://sunnah.com/bukhari:1903'],
  'pillars-hajj': ['https://quran.com/3/97', 'https://quran.com/2/196', 'https://quran.com/2/197-200', 'https://sunnah.com/bukhari:8', 'https://sunnah.com/muslim:1337', 'https://sunnah.com/muslim:1218a', 'https://sunnah.com/bukhari:1513', 'https://sunnah.com/abudawud:4403', 'https://sunnah.com/muslim:1336a', 'https://dar-alifta.org/en/article/details/46/the-merits-of-ramadan'],
};

describe('five pillars learning corrections', () => {
  const lesson = (id: string) => LEARNING_LESSONS.find(item => item.id === id)!;

  it('keeps six existing lessons and 74 content positions', () => {
    expect(getCategoryLessons('pillars').map(item => item.id)).toEqual(Object.keys(expectedPillarSources));
    expect(getLearningCategory('pillars').lessonIds).toEqual(Object.keys(expectedPillarSources));
    expect(getCategoryLessons('pillars').reduce((total, item) => total + 2 + item.paragraphs.length + (item.detailItems?.length ?? 0) + item.keyPoints.length, 0)).toBe(74);
    expect(getCategoryLessons('pillars').reduce((total, item) => total + item.sources.length, 0)).toBe(37);
  });

  it.each(Object.entries(expectedPillarSources))('%s retains precise source links and context', (id, urls) => {
    expect(lesson(id).sources.map(source => source.url)).toEqual(urls);
    for (const source of lesson(id).sources) {
      expect(source.note.length).toBeGreaterThan(15);
      expect(source.url).toMatch(/^https:\/\/(quran\.com|sunnah\.com|aliftaa\.jo|(?:www\.)?dar-alifta\.org)\//);
      expect(source.reference).not.toMatch(/ und (?:Sahih|\d)/);
    }
  });

  it('matches the consonantal Shahada wording actually read in Muslim 403a', () => {
    const arabic = lesson('pillars-shahada').detailItems![0];
    const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').replace(/[،,]/g, '').replace(/\s+/g, ' ').trim();
    expect(normalize(arabic.text)).toBe(normalize('أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ'));
    expect(arabic.lang).toBe('ar');
    expect(lesson('pillars-shahada').sources[3].note).toContain('kein Quranvers');
    expect(lesson('pillars-shahada').detailItems![1].text).toContain('keine angeleitete arabische Aussprache');
    expect(lesson('pillars-shahada').detailItems![2].title).toContain('Sinngemäße');
  });

  it('distinguishes true dawn, sunrise, sunset and the end of twilight', () => {
    const prayer = lesson('pillars-prayer');
    expect(prayer.detailItems![0].text).toContain('wahren Morgendämmerung');
    expect(prayer.detailItems![0].text).toContain('endet mit Beginn des Sonnenaufgangs');
    expect(prayer.detailItems![4].text).toContain('nicht schon beim Sonnenuntergang');
    expect(lesson('pillars-fasting').detailItems![0].text).toContain('nicht vom Sonnenaufgang');
  });

  it('does not define every Sadaqa as voluntary or debts as universally deductible', () => {
    const zakat = lesson('pillars-zakat');
    expect(zakat.detailItems![0].text).toContain('auch Zakat bezeichnen');
    expect(zakat.paragraphs[1]).toContain('keine allgemeingültige Regel');
    expect(zakat.sources[4].note).toContain('schafiitische');
    expect(zakat.sources[4].note).toContain('Nicht mit Forderungen');
    expect(zakat.sources[5].note).toContain('Einzelfall und Rechtsauffassung');
  });

  it('does not turn moral warnings into an invented fasting invalidation rule', () => {
    expect(lesson('pillars-fasting').sources[5].note).toContain('keine pauschale Regel');
    expect(lesson('pillars-fasting').sources[4].note).toContain('schulabhängigen Absichtsfristen');
  });

  it('distinguishes a once-in-life duty, proxy cases and a child’s valid hajj', () => {
    const hajj = lesson('pillars-hajj');
    expect(hajj.paragraphs[0]).toContain('einmal im Leben');
    expect(hajj.paragraphs[0]).toContain('Körperliche Einschränkungen heben die Pflicht nicht automatisch auf');
    expect(hajj.question.options[hajj.question.correctIndex]).toContain('Voraussetzungen');
    expect(hajj.sources[7].note).toContain('Sahih nach al-Albani');
    expect(hajj.sources[8].note).toContain('Gültigkeit und Verpflichtung');
    expect(hajj.detailItems![3].text).toContain('ersetzt die verpflichtende Hajj nicht');
  });
});

describe('faith learning corrections', () => {
  it('keeps the existing seven lessons and their routing IDs', () => {
    expect(getCategoryLessons('faith').map(lesson => lesson.id)).toEqual(Object.keys(expectedFaithSources));
    expect(getLearningCategory('faith').lessonIds).toEqual(Object.keys(expectedFaithSources));
    expect(LEARNING_LESSONS).toHaveLength(44);
    expect(getCategoryLessons('faith').reduce((total, lesson) => total + 2 + lesson.paragraphs.length + (lesson.detailItems?.length ?? 0) + lesson.keyPoints.length, 0)).toBe(77);
  });

  it('places Tawhid in the real Allah lesson instead of promising an absent lesson', () => {
    const intro = getCategoryLessons('faith')[0];
    expect(intro.summary).toContain('Tawhid gehört zur Lektion über Allah');
    expect(intro.paragraphs[1]).toContain('keine zusätzliche Tawhid-Lektion');
    expect(intro.question.options[intro.question.correctIndex]).toBe('Einführung und sechs Grundlagen; Tawhid in der Lektion über Allah');
    expect(intro.paragraphs[2]).toContain('keine vollständige Darstellung aller theologischen Traditionen');
  });

  it.each(Object.entries(expectedFaithSources))('%s retains its actually compared source links', (id, urls) => {
    const lesson = LEARNING_LESSONS.find(item => item.id === id)!;
    expect(lesson.sources.map(source => source.url)).toEqual(urls);
    for (const source of lesson.sources) {
      expect(source.reference.length).toBeGreaterThan(5);
      expect(source.note.length).toBeGreaterThan(15);
      expect(source.url).toMatch(/^https:\/\/(quran\.com|sunnah\.com)\//);
    }
  });

  it('keeps the limits of preservation, mercy and divine decree explicit', () => {
    const notes = (id: string) => LEARNING_LESSONS.find(item => item.id === id)!.sources.map(source => source.note).join(' ');
    expect(notes('faith-books')).toContain('keine Zertifizierung einer bestimmten App-Datei');
    expect(notes('faith-last-day')).toContain('mit der Aufforderung zur Umkehr');
    expect(notes('faith-decree')).toContain('keine vollständige Erklärung theologischer Modelle');
    expect(notes('faith-messengers')).toContain('nicht, dass jede frühere Einzelregel heute unverändert gilt');
  });
});
