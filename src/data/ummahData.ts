/**
 * Ummah-Übersicht.
 *
 * Übernommen aus dem Altbestand `memetreza34-ux/nur-islam`, wo der Bereich
 * vier Stichpunkte hatte.
 *
 * **Die absoluten Bevölkerungszahlen sind entfernt.** Sie trugen im Altbestand
 * weder Quelle noch Stichjahr, und eine undatierte Bevölkerungszahl ist nicht
 * ungenau, sondern unüberprüfbar: „Pakistan 212 Mio." ist ohne Bezugsjahr weder
 * richtig noch falsch. Gegen die Erhebung des Pew Research Center (Stand 2020)
 * lagen sie zudem messbar daneben — bei Pakistan um 15 Millionen Menschen.
 *
 * Der Weg zurück wäre **eine** datierte Tabelle für alle Länder, nicht 17
 * Einzelquellen mit 17 Stichjahren; das sähe belegt aus und wäre schlechter als
 * gar keine Zahl.
 *
 * Was bleibt, sind Länder, Regionen und Anteile. Die Prozentwerte tragen
 * dieselbe Quellenlücke und sind deshalb weiter als grobe Einordnung
 * gekennzeichnet — sie sind nur, anders als absolute Zahlen, nicht Jahr für
 * Jahr eine andere Aussage.
 */

export type UmmahRegion = {
  name: string;
  share: string;
};

export type UmmahCountry = {
  id: string;
  name: string;
  region: string;
  share: string;
  info: string;
};

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
    share: '87%',
    info: 'Das Land mit der größten muslimischen Bevölkerung weltweit.',
  },
  {
    id: 'pakistan',
    name: 'Pakistan',
    region: 'Südasien',
    share: '96%',
    info: 'Eine der größten muslimischen Gemeinschaften in Südasien.',
  },
  {
    id: 'india',
    name: 'Indien',
    region: 'Südasien',
    share: '15%',
    info: 'Beherbergt eine der größten muslimischen Minderheiten weltweit.',
  },
  {
    id: 'bangladesh',
    name: 'Bangladesch',
    region: 'Südasien',
    share: '90%',
    info: 'Ein Land mit einer sehr hohen Dichte an muslimischer Bevölkerung.',
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    region: 'Westafrika',
    share: '50%',
    info: 'Das Land mit der größten muslimischen Bevölkerung in Afrika.',
  },
  {
    id: 'egypt',
    name: 'Ägypten',
    region: 'Nordafrika',
    share: '90%',
    info: 'Ein historisches Zentrum islamischer Gelehrsamkeit.',
  },
  {
    id: 'iran',
    name: 'Iran',
    region: 'Mittlerer Osten',
    share: '99%',
    info: 'Ein Land mit einer reichen islamischen Geschichte und Kultur.',
  },
  {
    id: 'turkey',
    name: 'Türkei',
    region: 'Eurasien',
    share: '99%',
    info: 'Die Brücke zwischen Europa und der islamischen Welt.',
  },
  {
    id: 'algeria',
    name: 'Algerien',
    region: 'Nordafrika',
    share: '99%',
    info: 'Das flächenmäßig größte Land in Afrika mit einer fast ausschließlich muslimischen Bevölkerung.',
  },
  {
    id: 'sudan',
    name: 'Sudan',
    region: 'Nordafrika',
    share: '97%',
    info: 'Ein Land mit tiefer islamischer Geschichte und vielen Sufi-Orden.',
  },
  {
    id: 'morocco',
    name: 'Marokko',
    region: 'Nordafrika',
    share: '99%',
    info: 'Bekannt für seine reiche islamische Architektur und Gelehrsamkeit.',
  },
  {
    id: 'saudi_arabia',
    name: 'Saudi-Arabien',
    region: 'Mittlerer Osten',
    share: '100%',
    info: 'Der Geburtsort des Islam und Heimat der zwei heiligsten Stätten: Mekka und Medina.',
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    region: 'Südostasien',
    share: '61%',
    info: 'Ein multikulturelles Land, in dem der Islam die offizielle Religion ist.',
  },
  {
    id: 'usa',
    name: 'USA',
    region: 'Nordamerika',
    share: '1.1%',
    info: 'Eine der vielfältigsten muslimischen Gemeinschaften der Welt.',
  },
  {
    id: 'france',
    name: 'Frankreich',
    region: 'Westeuropa',
    share: '8.8%',
    info: 'Die größte muslimische Gemeinschaft in Westeuropa.',
  },
  {
    id: 'germany',
    name: 'Deutschland',
    region: 'Westeuropa',
    share: '6.7%',
    info: 'Eine wachsende und vielfältige muslimische Gemeinschaft.',
  },
  {
    id: 'uk',
    name: 'Großbritannien',
    region: 'Westeuropa',
    share: '6.5%',
    info: 'Eine etablierte muslimische Gemeinschaft mit starker Präsenz in großen Städten.',
  },
];
