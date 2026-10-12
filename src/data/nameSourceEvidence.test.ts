import { expect, it } from 'vitest';
import { getNameSourceEvidence, getRelatedNameSourceContext } from './nameSourceEvidence';
import { NAMES_OF_ALLAH } from './namesOfAllahData';
import { VERIFIED_NAMES_OF_ALLAH } from './verifiedNamesOfAllahData';

it('retains all 99 IDs and distinguishes 75 documented references from 24 open forms', () => {
  expect(NAMES_OF_ALLAH.map(entry => entry.id)).toEqual(Array.from({ length: 99 }, (_, i) => i + 1));
  expect(NAMES_OF_ALLAH.filter(entry => getNameSourceEvidence(entry.id))).toHaveLength(75);
  for (const entry of NAMES_OF_ALLAH) {
    for (const link of getNameSourceEvidence(entry.id)?.links ?? []) {
      expect(link.url).toMatch(/^https:\/\/(quran\.com\/\d+\/\d+|sunnah\.com\/(abudawud|bukhari|muslim):\d+[a-z]?)$/);
    }
  }
  expect(getNameSourceEvidence(65)).toBeNull();
  expect(getNameSourceEvidence(0)).toBeNull();
});

it('maps actual documented Quran and hadith references without a fallback collection', () => {
  expect(getNameSourceEvidence(1)?.links).toEqual([{ label: 'Quran 59:22', url: 'https://quran.com/59/22' }]);
  expect(getNameSourceEvidence(20)?.links).toEqual([{ label: 'Sunan Abi Dawud 3451', url: 'https://sunnah.com/abudawud:3451' }]);
  expect(getNameSourceEvidence(71)?.links).toEqual([{ label: 'Sahih al-Bukhari 6398', url: 'https://sunnah.com/bukhari:6398' }]);
  expect(getNameSourceEvidence(85)?.links.map(link => link.url)).toEqual(['https://quran.com/55/27', 'https://quran.com/55/78']);
});

it('keeps the freshly compared first thirteen forms and explanatory glosses consistent', () => {
  for (const name of NAMES_OF_ALLAH.slice(0, 13)) {
    const documented = VERIFIED_NAMES_OF_ALLAH.find(entry => entry.legacyId === name.id)!;
    expect(name.arabic).toBe(documented.arabic);
    expect(name.latin).toBe(documented.latin);
    expect(name.meaning).toBe(documented.meaning);
  }
});

it('keeps related and exclusion contexts separate from direct name evidence for twenty-one open forms', () => {
  for (const id of [22, 23, 24, 25, 29, 41, 49, 57, 58, 59, 61, 81, 86, 89, 90, 91, 92, 96, 97, 98, 99]) {
    expect(getNameSourceEvidence(id)).toBeNull();
    expect(getRelatedNameSourceContext(id)?.note).toMatch(/nicht|kein/);
    expect(getRelatedNameSourceContext(id)?.note).toContain('gesondert zu prüfen');
  }
  expect(getRelatedNameSourceContext(22)?.url).toBe('https://sunnah.com/abudawud:3450');
  expect(getRelatedNameSourceContext(24)?.url).toBe('https://quran.com/3/26');
  expect(getRelatedNameSourceContext(29)?.url).toBe('https://quran.com/4/40');
  expect(getRelatedNameSourceContext(41)?.url).toBe('https://quran.com/55/27');
  expect(getRelatedNameSourceContext(49)?.url).toBe('https://quran.com/22/7');
  expect(getRelatedNameSourceContext(57)?.url).toBe('https://quran.com/72/28');
  for (const id of [58, 59]) expect(getRelatedNameSourceContext(id)?.url).toBe('https://quran.com/85/13');
  expect(getRelatedNameSourceContext(61)?.url).toBe('https://quran.com/53/44');
  expect(getRelatedNameSourceContext(28)).toBeNull();
});

it('preserves the actual grammar, meaning and evidence limits of entries eighty-one to ninety-nine', () => {
  const direct: Record<number, string[]> = {
    82: ['4/99'], 83: ['3/30'], 84: ['3/26'], 85: ['55/27', '55/78'],
    87: ['3/9'], 88: ['22/64'], 93: ['24/35'], 94: ['25/31'], 95: ['2/117'],
  };
  for (const [id, refs] of Object.entries(direct)) expect(getNameSourceEvidence(Number(id))?.links.map(link => link.url)).toEqual(refs.map(ref => `https://quran.com/${ref}`));
  const related: Record<number, string> = {
    81: 'https://quran.com/32/22', 86: 'https://quran.com/3/18', 89: 'https://quran.com/53/48',
    90: 'https://sunnah.com/bukhari:844', 91: 'https://quran.com/10/107', 92: 'https://quran.com/10/107',
    96: 'https://quran.com/55/27', 97: 'https://quran.com/15/23', 98: 'https://quran.com/11/87',
    99: 'https://sunnah.com/bukhari:6099',
  };
  for (const [id, url] of Object.entries(related)) {
    expect(getNameSourceEvidence(Number(id))).toBeNull();
    expect(getRelatedNameSourceContext(Number(id))?.url).toBe(url);
  }
  for (const id of [82, 83, 87, 94, 95]) expect(getNameSourceEvidence(id)?.note).toContain('ohne bestimmten Artikel');
  expect(getNameSourceEvidence(84)?.note).toContain('Anredeform Malika');
  expect(getNameSourceEvidence(85)?.note).toContain('Dhi (ذي)');
  for (const id of [87, 93, 95]) expect(getNameSourceEvidence(id)?.note).toContain('Genitivverbindung');
  expect(getNameSourceEvidence(93)?.note).toContain('keine Gleichsetzung');
  expect(getRelatedNameSourceContext(97)?.note).toContain('Pluralform Al-Warithun');
  expect(getRelatedNameSourceContext(98)?.note).toContain('Shuayb, nicht an Allah');
  expect(getRelatedNameSourceContext(99)?.note).toContain('Vergleichsform asbar');
  for (const id of [64, 65, 77]) expect(getRelatedNameSourceContext(id)).toBeNull();
  const meanings: Record<number, string> = {
    83: 'Der überaus Gütige und Barmherzige', 84: 'Der Inhaber aller Herrschaft',
    88: 'Der Reiche, auf nichts Angewiesene', 95: 'Der ohne Vorbild Erschaffende',
  };
  for (const [id, meaning] of Object.entries(meanings)) expect(NAMES_OF_ALLAH.find(entry => entry.id === Number(id))?.meaning).toBe(meaning);
});

it('preserves compared references and meaning boundaries for entries sixty-one to eighty', () => {
  const paths: Record<number, string[]> = {
    62: ['2/255', '3/2'], 63: ['2/255', '3/2'], 66: ['39/4'], 67: ['112/1'],
    68: ['112/2'], 69: ['6/65'], 70: ['18/45'], 78: ['13/9'], 79: ['52/28'], 80: ['2/37'],
  };
  for (const [id, refs] of Object.entries(paths)) expect(getNameSourceEvidence(Number(id))?.links.map(link => link.url)).toEqual(refs.map(ref => `https://quran.com/${ref}`));
  for (const id of [71, 72]) expect(getNameSourceEvidence(id)?.links.map(link => link.url)).toEqual(['https://sunnah.com/bukhari:6398']);
  for (const id of [73, 74, 75, 76]) expect(getNameSourceEvidence(id)?.links.map(link => link.url)).toEqual(['https://quran.com/57/3', 'https://sunnah.com/muslim:2713a']);
  for (const id of [61, 64, 65, 77]) expect(getNameSourceEvidence(id)).toBeNull();
  for (const id of [67, 70]) expect(getNameSourceEvidence(id)?.note).toContain('ohne bestimmten Artikel');
  expect(getNameSourceEvidence(78)?.note).toContain('finale Ya');
  expect(getNameSourceEvidence(68)?.note).toContain('Angewiesenheit');
  expect(getNameSourceEvidence(75)?.note).toContain('nicht schlicht Sichtbarkeit');
  expect(getNameSourceEvidence(76)?.note).toContain('keine räumliche Festlegung');
  expect(NAMES_OF_ALLAH.find(entry => entry.id === 63)?.meaning).toBe(VERIFIED_NAMES_OF_ALLAH.find(entry => entry.legacyId === 63)?.meaning);
  expect(NAMES_OF_ALLAH.find(entry => entry.id === 68)?.meaning).toBe('Der Unabhängige, auf den alle angewiesen sind');
  expect(NAMES_OF_ALLAH.find(entry => entry.id === 70)?.meaning).toBe('Der über alles Mächtige');
});

it('preserves the compared sources, grammar and learning glosses of entries thirty-six to sixty', () => {
  const referencePaths: Record<number, string[]> = {
    36: ['2/255'], 37: ['22/62'], 38: ['11/57'], 39: ['4/85'], 40: ['4/6', '4/86'],
    42: ['82/6'], 43: ['4/1'], 44: ['11/61'], 45: ['2/115'], 46: ['59/24', '6/18'],
    47: ['85/14'], 48: ['11/73'], 50: ['22/17'], 51: ['22/6', '22/62'], 52: ['3/173'],
    53: ['22/40'], 54: ['51/58'], 55: ['42/28'], 56: ['42/28'], 60: ['41/39'],
  };
  expect(Object.keys(referencePaths)).toHaveLength(20);
  for (const [id, paths] of Object.entries(referencePaths)) {
    expect(getNameSourceEvidence(Number(id))?.links.map(link => link.url)).toEqual(paths.map(path => `https://quran.com/${path}`));
  }
  for (const id of [38, 39, 40, 43, 44, 45, 48, 50, 53, 60]) {
    expect(getNameSourceEvidence(id)?.note).toContain('ohne bestimmten Artikel');
  }
  expect(getNameSourceEvidence(39)?.note).toContain('Ibn Kathir');
  expect(getNameSourceEvidence(44)?.note).toContain('keine Zusage');
  expect(getNameSourceEvidence(48)?.note).toContain('Majīd (مجيد)');
  expect(getNameSourceEvidence(48)?.note).toContain('Mājid (ماجد), Eintrag 65');
  expect(getNameSourceEvidence(60)?.note).toContain('Muhyi al-mawta');
  expect(getNameSourceEvidence(60)?.note).toContain('nicht der wörtlich identische');
  expect(NAMES_OF_ALLAH.find(entry => entry.id === 40)?.meaning).toBe('Der alles Abrechnende');
  for (const id of [46, 54]) {
    expect(NAMES_OF_ALLAH.find(entry => entry.id === id)?.meaning).toBe(VERIFIED_NAMES_OF_ALLAH.find(entry => entry.legacyId === id)?.meaning);
  }
});

it('preserves explicit forms and contextual qualifications in entries fourteen to thirty-five', () => {
  const referencePaths: Record<number, string[]> = {
    14: ['quran.com/39/5'], 15: ['quran.com/39/4'], 16: ['quran.com/3/8'],
    17: ['quran.com/51/58'], 18: ['quran.com/34/26'], 19: ['quran.com/34/26'],
    20: ['sunnah.com/abudawud:3451'], 21: ['sunnah.com/abudawud:3451'],
    26: ['quran.com/42/11'], 27: ['quran.com/42/11'], 28: ['sunnah.com/abudawud:4955'],
    30: ['quran.com/6/103', 'quran.com/42/19'], 31: ['quran.com/6/18'],
    32: ['quran.com/2/225'], 33: ['quran.com/2/255'], 34: ['quran.com/85/14'], 35: ['quran.com/35/30'],
  };
  for (const [id, paths] of Object.entries(referencePaths)) {
    expect(getNameSourceEvidence(Number(id))?.links.map(link => link.url)).toEqual(paths.map(path => `https://${path}`));
  }
  expect(getNameSourceEvidence(32)?.note).toContain('ohne bestimmten Artikel');
  expect(getNameSourceEvidence(35)?.note).toContain('ohne bestimmten Artikel');
  for (const id of [20, 21, 28]) expect(getNameSourceEvidence(id)?.note).toContain('Sahih (Al-Albani)');
  expect(NAMES_OF_ALLAH.find(entry => entry.id === 18)?.meaning).toBe('Der Öffnende und Entscheidende');
  expect(NAMES_OF_ALLAH.find(entry => entry.id === 30)?.meaning).toBe('Der Gütige, dem nichts Verborgenes entgeht');
  expect(NAMES_OF_ALLAH.find(entry => entry.id === 33)?.meaning).toBe('Der Gewaltige');
  expect(NAMES_OF_ALLAH.find(entry => entry.id === 35)?.meaning).toBe('Der gute Taten Anerkennende und Belohnende');
});
