/**
 * Hajj, Umrah und die drei heiligen Moscheen.
 *
 * Anders als alle übrigen Inhaltsbereiche gab es hierfür **keine Vorlage** im
 * Altbestand `memetreza34-ux/nur-islam` — dort standen sechs beziehungsweise
 * drei Stichpunkte. Diese Texte sind daher neu verfasst, und das ist der Grund
 * für die enge Selbstbeschränkung:
 *
 * Beschrieben wird der **Ablauf** — welche Station wann kommt und was dort
 * geschieht. Nicht beschrieben werden **Urteile**: was Pflicht und was Sunnah
 * ist, was die Pilgerfahrt ungültig macht, was bei Versäumnissen zu tun ist.
 * Genau diese Fragen unterscheiden sich zwischen den Rechtsschulen und gehören
 * zu einer qualifizierten Quelle, nicht in eine Übersicht.
 *
 * Wo eine Station eine klare Quranstelle hat, ist sie genannt. Wo keine steht,
 * fehlt sie bewusst, statt eine zu behaupten.
 *
 * Diese Einträge stehen mit erhöhter Priorität auf der Prüfliste, weil sie im
 * Gegensatz zu allen anderen nicht übernommen, sondern verfasst wurden.
 */

export type PilgrimageStation = {
  id: string;
  /** Zeitliche Einordnung, soweit sie zum Ablauf gehört. */
  when: string;
  title: string;
  description: string;
  /** Quranstelle, wo eine eindeutige besteht. */
  reference?: string;
};

export type HolyPlace = {
  id: string;
  name: string;
  city: string;
  description: string;
  region: 'Makkah' | 'Madinah' | 'Jerusalem';
  eyebrow: string;
  context: string;
  facts: readonly [string, string];
  image: string;
  imageAlt: string;
  sourceLabel: string;
  sourceUrl: string;
  reference?: string;
};

export const UMRAH_STATIONS: readonly PilgrimageStation[] = [
  {
    id: 'umrah-ihram',
    when: 'Vor dem Erreichen des Miqat',
    title: 'Ihram',
    description: 'Der Miqat ist die festgelegte Grenze für den Eintritt in den Weihezustand. Die Vorbereitung umfasst die passende Kleidung; der Ihram ist aber mehr als Kleidung. Absicht und Talbiya, der Pilgerruf, gehören zum Beginn.',
  },
  {
    id: 'umrah-tawaf',
    when: 'Nach der Ankunft in Makkah',
    title: 'Tawaf',
    description: 'Tawaf heißt Umrundung: sieben Runden um die Kaaba, mit der Kaaba zur Linken. Beginn und Ende jeder Runde liegen auf Höhe des Schwarzen Steins.',
  },
  {
    id: 'umrah-sai',
    when: 'Im Anschluss an den Tawaf',
    title: 'Sa’i zwischen Safa und Marwa',
    description: 'Sa’i ist der Weg zwischen Safa und Marwa. Beginn ist Safa, Ende nach sieben Strecken Marwa. Ein Hinweg zählt als eine Strecke, der Rückweg als die nächste — nicht zusammen als eine.',
    reference: 'Quran 2:158',
  },
  {
    id: 'umrah-halq',
    when: 'Zum Abschluss',
    title: 'Haarkürzung',
    description: 'Männer scheren oder kürzen das Haar; Frauen kürzen die Haarspitzen. Mit diesem abschließenden Schritt endet der Ihram der Umrah. Umfang und besondere Fälle erklärt die qualifizierte Begleitung.',
  },
];

export const HAJJ_STATIONS: readonly PilgrimageStation[] = [
  {
    id: 'hajj-ihram',
    when: 'Je nach Pilgerform; bei Tamattuʿ zum Beginn der Hajj',
    title: 'Ihram',
    description: 'Bei Tamattuʿ beginnt nach der abgeschlossenen Umrah ein neuer Ihram für Hajj in Makkah. Bei Ifrad und Qiran kann der Ihram bereits seit dem Miqat bestehen.',
  },
  {
    id: 'hajj-mina',
    when: '8. Dhul-Hijjah',
    title: 'Mina',
    description: 'Aufenthalt und Übernachtung in Mina bereiten auf den folgenden Tag in Arafat vor.',
  },
  {
    id: 'hajj-arafat',
    when: '9. Dhul-Hijjah',
    title: 'Das Stehen in Arafat',
    description: 'Der zentrale Aufenthalt in der Ebene von Arafat. Im üblichen Ablauf bleiben die Pilger bis Sonnenuntergang zum Gebet und Bittgebet dort.',
  },
  {
    id: 'hajj-muzdalifah',
    when: 'Nacht zum 10. Dhul-Hijjah',
    title: 'Muzdalifah',
    description: 'Nach Sonnenuntergang führt der Weg von Arafat nach Muzdalifah für Gebete und den nächtlichen Aufenthalt.',
    reference: 'Quran 2:198',
  },
  {
    id: 'hajj-jamarat',
    when: '10. Dhul-Hijjah',
    title: 'Steinigung, Opfer und Haarkürzung',
    description: 'Sieben Steinchen werden an der großen Jamrah al-Aqaba geworfen. Haarkürzung und, je nach Pilgerform, das Opfer gehören ebenfalls zu diesem Abschnitt.',
  },
  {
    id: 'hajj-ifada',
    when: '10. Dhul-Hijjah oder danach',
    title: 'Tawaf al-Ifada',
    description: 'Tawaf al-Ifada ist die Umrundung im Hajj-Ablauf. Bei Tamattuʿ folgt ein eigener Sa’i für Hajj. Bei Ifrad und Qiran kann dieser bereits vorher erfolgt sein.',
  },
  {
    id: 'hajj-tashriq',
    when: '11. bis 13. Dhul-Hijjah',
    title: 'Die Tage von Tashriq',
    description: 'Aufenthalt in Mina und Steinigung aller drei Jamarat. Eine frühere Abreise am 12. ist unter ihren Voraussetzungen vorgesehen.',
  },
  {
    id: 'hajj-wada',
    when: 'Vor der Abreise',
    title: 'Tawaf al-Wada',
    description: 'Der Abschiedstawaf steht am Ende vor dem Verlassen Makkahs. Für Ausnahmen und persönliche Situationen ist fachliche Begleitung wichtig.',
  },
];

export const HOLY_PLACES: readonly HolyPlace[] = [
  {
    id: 'haram',
    name: 'Al-Masjid al-Haram',
    city: 'Makkah',
    description: 'Die Moschee umschließt die Kaaba und steht im Mittelpunkt von Gebet, Hajj und Umrah.',
    region: 'Makkah',
    eyebrow: 'Qibla & Pilgerfahrt',
    context: 'Muslime auf der ganzen Welt richten ihr Gebet zur Kaaba aus. Safa und Marwa sowie weitere Stationen der Pilgerfahrt liegen im unmittelbaren Umfeld.',
    facts: ['Im Zentrum: die Kaaba', 'Ziel von Hajj und Umrah'],
    image: '/premium-assets/high-res-objects/place-masjid-al-haram-v1.webp',
    imageAlt: 'Al-Masjid al-Haram mit der Kaaba in Makkah bei warmem Morgenlicht',
    sourceLabel: 'Quran 2:144',
    sourceUrl: 'https://quran.com/2/144',
    reference: 'Quran 2:144',
  },
  {
    id: 'hira',
    name: 'Jabal an-Nur & Ghar Hira',
    city: 'Makkah',
    description: 'Die Höhle Hira liegt am Jabal an-Nur außerhalb des Zentrums von Makkah.',
    region: 'Makkah',
    eyebrow: 'Beginn der Offenbarung',
    context: 'Der Prophet Muhammad ﷺ zog sich hier vor der ersten Offenbarung zurück. Sahih al-Bukhari überliefert den Beginn der Offenbarung in dieser Höhle.',
    facts: ['Berg nordöstlich der Kaaba', 'Ort der ersten Offenbarung'],
    image: '/premium-assets/high-res-objects/place-jabal-an-nur-v1.webp',
    imageAlt: 'Felsiger Jabal an-Nur mit dem Weg zur Höhle Hira und Blick über Makkah',
    sourceLabel: 'Sahih al-Bukhari 3',
    sourceUrl: 'https://sunnah.com/bukhari:3',
  },
  {
    id: 'nabawi',
    name: 'Al-Masjid an-Nabawi',
    city: 'Madinah',
    description: 'Die Moschee des Propheten ﷺ wurde nach der Hijra zum Zentrum der jungen muslimischen Gemeinschaft.',
    region: 'Madinah',
    eyebrow: 'Moschee des Propheten ﷺ',
    context: 'Von hier aus entwickelte sich das religiöse und gemeinschaftliche Leben in Madinah. Der heutige Moscheekomplex umfasst auch die Ruhestätte des Propheten ﷺ.',
    facts: ['Nach der Hijra errichtet', 'Im Herzen von Madinah'],
    image: '/premium-assets/high-res-objects/place-masjid-an-nabawi-v1.webp',
    imageAlt: 'Al-Masjid an-Nabawi in Madinah mit grüner Kuppel und Hofschirmen',
    sourceLabel: 'Saudipedia · Prophetenmoschee',
    sourceUrl: 'https://saudipedia.com/en/the-prophet%22s-mosque',
  },
  {
    id: 'quba',
    name: 'Masjid Quba',
    city: 'Madinah',
    description: 'Quba liegt südlich des Zentrums von Madinah und ist eng mit der Ankunft nach der Hijra verbunden.',
    region: 'Madinah',
    eyebrow: 'Frühe Gemeinde',
    context: 'Der Prophet ﷺ hielt sich nach der Auswanderung zunächst in Quba auf. Die dort errichtete Moschee gilt als die erste in der islamischen Geschichte gebaute Moschee.',
    facts: ['Südlich von Madinah', 'Mit der Hijra verbunden'],
    image: '/premium-assets/high-res-objects/place-masjid-quba-v1.webp',
    imageAlt: 'Weiße Masjid Quba mit Minaretten und Palmen in Madinah',
    sourceLabel: 'Saudipedia · Masjid Quba',
    sourceUrl: 'https://saudipedia.com/%D9%85%D8%B3%D8%AC%D8%AF-%D9%82%D8%A8%D8%A7%D8%A1',
  },
  {
    id: 'uhud',
    name: 'Berg Uhud',
    city: 'Madinah',
    description: 'Der lange Bergzug liegt nördlich von Madinah und prägt die Landschaft der Stadt.',
    region: 'Madinah',
    eyebrow: 'Sira & Geschichte',
    context: 'Am Berg Uhud fand im dritten Jahr nach der Hijra die Schlacht von Uhud statt. Der Ort erinnert an ein zentrales Ereignis der frühen muslimischen Gemeinschaft.',
    facts: ['Nördlich von Madinah', 'Schlacht von Uhud · 3 AH'],
    image: '/premium-assets/high-res-objects/place-mount-uhud-v1.webp',
    imageAlt: 'Langer rötlicher Bergzug des Uhud nördlich von Madinah im Abendlicht',
    sourceLabel: 'Saudipedia · Berg Uhud',
    sourceUrl: 'https://saudipedia.com/en/mount-uhud',
  },
  {
    id: 'aqsa',
    name: 'Al-Masjid al-Aqsa',
    city: 'Jerusalem',
    description: 'Al-Masjid al-Aqsa bezeichnet den heiligen Moscheebezirk in Jerusalem.',
    region: 'Jerusalem',
    eyebrow: 'Nachtreise & erste Qibla',
    context: 'Der Quran nennt Al-Masjid al-Aqsa als Ziel der Nachtreise. Der weitläufige Bezirk umfasst mehrere bedeutende Gebets- und Bauwerke.',
    facts: ['Im Quran ausdrücklich genannt', 'Historisch erste Qibla'],
    image: '/premium-assets/high-res-objects/place-masjid-al-aqsa-v1.webp',
    imageAlt: 'Al-Masjid al-Aqsa mit silberner Kuppel und dem Felsendom im Hintergrund',
    sourceLabel: 'Quran 17:1',
    sourceUrl: 'https://quran.com/17/1',
    reference: 'Quran 17:1',
  },
];
