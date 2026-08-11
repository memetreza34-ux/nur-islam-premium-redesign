/**
 * Ummah-Übersicht.
 *
 * Übernommen aus dem Altbestand `memetreza34-ux/nur-islam`, wo der Bereich
 * vier Stichpunkte hatte.
 *
 * Wichtig: die Zahlen führen im Altbestand **weder Quelle noch Stichjahr**.
 * Sie werden deshalb ausdrücklich als Größenordnung ohne Bezugsjahr angezeigt
 * statt als belastbare Statistik, und stehen auf der Prüfliste. Eine undatierte
 * Zahl als Tatsache auszugeben wäre derselbe Fehler wie ein Hadith ohne Beleg.
 */

export type UmmahRegion = {
  name: string;
  share: string;
};

export type UmmahCountry = {
  id: string;
  name: string;
  region: string;
  muslimPopulation: string;
  share: string;
  info: string;
};

export const UMMAH_TOTAL = '~ 1.9 - 2.0 Mrd.';

export const UMMAH_REGIONS: readonly UmmahRegion[] = [
  { name: 'Asien-Pazifik', share: '62%' },
  { name: 'Naher Osten & Nordafrika', share: '20%' },
  { name: 'Subsahara-Afrika', share: '15%' },
  { name: 'Europa & Amerika', share: '3%' },
];

export const UMMAH_COUNTRIES: readonly UmmahCountry[] = [
  {
    id: 'indonesia',
    name: 'Indonesien',
    region: 'Südostasien',
    muslimPopulation: '231 Mio.',
    share: '87%',
    info: 'Das Land mit der größten muslimischen Bevölkerung weltweit.',
  },
  {
    id: 'pakistan',
    name: 'Pakistan',
    region: 'Südasien',
    muslimPopulation: '212 Mio.',
    share: '96%',
    info: 'Eine der größten muslimischen Gemeinschaften in Südasien.',
  },
  {
    id: 'india',
    name: 'Indien',
    region: 'Südasien',
    muslimPopulation: '200 Mio.',
    share: '15%',
    info: 'Beherbergt eine der größten muslimischen Minderheiten weltweit.',
  },
  {
    id: 'bangladesh',
    name: 'Bangladesch',
    region: 'Südasien',
    muslimPopulation: '153 Mio.',
    share: '90%',
    info: 'Ein Land mit einer sehr hohen Dichte an muslimischer Bevölkerung.',
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    region: 'Westafrika',
    muslimPopulation: '103 Mio.',
    share: '50%',
    info: 'Das Land mit der größten muslimischen Bevölkerung in Afrika.',
  },
  {
    id: 'egypt',
    name: 'Ägypten',
    region: 'Nordafrika',
    muslimPopulation: '90 Mio.',
    share: '90%',
    info: 'Ein historisches Zentrum islamischer Gelehrsamkeit.',
  },
  {
    id: 'iran',
    name: 'Iran',
    region: 'Mittlerer Osten',
    muslimPopulation: '82 Mio.',
    share: '99%',
    info: 'Ein Land mit einer reichen islamischen Geschichte und Kultur.',
  },
  {
    id: 'turkey',
    name: 'Türkei',
    region: 'Eurasien',
    muslimPopulation: '80 Mio.',
    share: '99%',
    info: 'Die Brücke zwischen Europa und der islamischen Welt.',
  },
  {
    id: 'algeria',
    name: 'Algerien',
    region: 'Nordafrika',
    muslimPopulation: '42 Mio.',
    share: '99%',
    info: 'Das flächenmäßig größte Land in Afrika mit einer fast ausschließlich muslimischen Bevölkerung.',
  },
  {
    id: 'sudan',
    name: 'Sudan',
    region: 'Nordafrika',
    muslimPopulation: '39 Mio.',
    share: '97%',
    info: 'Ein Land mit tiefer islamischer Geschichte und vielen Sufi-Orden.',
  },
  {
    id: 'morocco',
    name: 'Marokko',
    region: 'Nordafrika',
    muslimPopulation: '36 Mio.',
    share: '99%',
    info: 'Bekannt für seine reiche islamische Architektur und Gelehrsamkeit.',
  },
  {
    id: 'saudi_arabia',
    name: 'Saudi-Arabien',
    region: 'Mittlerer Osten',
    muslimPopulation: '34 Mio.',
    share: '100%',
    info: 'Der Geburtsort des Islam und Heimat der zwei heiligsten Stätten: Mekka und Medina.',
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    region: 'Südostasien',
    muslimPopulation: '20 Mio.',
    share: '61%',
    info: 'Ein multikulturelles Land, in dem der Islam die offizielle Religion ist.',
  },
  {
    id: 'usa',
    name: 'USA',
    region: 'Nordamerika',
    muslimPopulation: '3.5 Mio.',
    share: '1.1%',
    info: 'Eine der vielfältigsten muslimischen Gemeinschaften der Welt.',
  },
  {
    id: 'france',
    name: 'Frankreich',
    region: 'Westeuropa',
    muslimPopulation: '5.7 Mio.',
    share: '8.8%',
    info: 'Die größte muslimische Gemeinschaft in Westeuropa.',
  },
  {
    id: 'germany',
    name: 'Deutschland',
    region: 'Westeuropa',
    muslimPopulation: '5.5 Mio.',
    share: '6.7%',
    info: 'Eine wachsende und vielfältige muslimische Gemeinschaft.',
  },
  {
    id: 'uk',
    name: 'Großbritannien',
    region: 'Westeuropa',
    muslimPopulation: '3.9 Mio.',
    share: '6.5%',
    info: 'Eine etablierte muslimische Gemeinschaft mit starker Präsenz in großen Städten.',
  },
];
