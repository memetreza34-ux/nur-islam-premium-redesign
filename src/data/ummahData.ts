/** Geografische Auswahl, keine Bevölkerungsstatistik oder Rangliste. */
export type UmmahRegion = { name: string };
export type UmmahCountry = { id: string; name: string; region: string };

export const UMMAH_REGIONS: readonly UmmahRegion[] = [
  { name: 'Asien' },
  { name: 'Afrika' },
  { name: 'Europa' },
  { name: 'Amerika' },
];

export const UMMAH_COUNTRIES: readonly UmmahCountry[] = [
  {
    id: 'indonesia',
    name: 'Indonesien',
    region: 'Südostasien',
  },
  {
    id: 'pakistan',
    name: 'Pakistan',
    region: 'Südasien',
  },
  {
    id: 'india',
    name: 'Indien',
    region: 'Südasien',
  },
  {
    id: 'bangladesh',
    name: 'Bangladesch',
    region: 'Südasien',
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    region: 'Westafrika',
  },
  {
    id: 'egypt',
    name: 'Ägypten',
    region: 'Nordafrika',
  },
  {
    id: 'iran',
    name: 'Iran',
    region: 'Westasien',
  },
  {
    id: 'turkey',
    name: 'Türkei',
    region: 'Europa und Asien',
  },
  {
    id: 'algeria',
    name: 'Algerien',
    region: 'Nordafrika',
  },
  {
    id: 'sudan',
    name: 'Sudan',
    region: 'Afrika',
  },
  {
    id: 'morocco',
    name: 'Marokko',
    region: 'Nordafrika',
  },
  {
    id: 'saudi_arabia',
    name: 'Saudi-Arabien',
    region: 'Westasien',
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    region: 'Südostasien',
  },
  {
    id: 'usa',
    name: 'USA',
    region: 'Nordamerika',
  },
  {
    id: 'france',
    name: 'Frankreich',
    region: 'Europa',
  },
  {
    id: 'germany',
    name: 'Deutschland',
    region: 'Europa',
  },
  {
    id: 'uk',
    name: 'Vereinigtes Königreich',
    region: 'Europa',
  },
];
