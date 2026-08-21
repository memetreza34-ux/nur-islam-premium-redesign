/**
 * Imprint and privacy content.
 *
 * The processing described here was derived from what the code actually does,
 * not from a template: every provider, field and storage location below was
 * read out of the services that talk to them. That is the part a generic
 * privacy generator gets wrong.
 *
 * It is still not legal advice and nobody here is a lawyer. Two things must
 * happen before this is published:
 *   1. every OPERATOR_PLACEHOLDER value has to be filled in with real details,
 *   2. the result has to be reviewed by someone qualified.
 *
 * `npm run legal:check` fails while placeholders remain, so an unfinished
 * imprint cannot reach a release build unnoticed.
 */

export const OPERATOR_PLACEHOLDER = '<<BITTE AUSFÜLLEN>>';

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

/** Details only the operator can supply. An imprint may not be invented. */
export const operator = {
  name: OPERATOR_PLACEHOLDER,
  street: OPERATOR_PLACEHOLDER,
  city: OPERATOR_PLACEHOLDER,
  country: 'Deutschland',
  email: OPERATOR_PLACEHOLDER,
};

export const imprintSections: LegalSection[] = [
  {
    heading: 'Anbieter',
    paragraphs: [
      `${operator.name}`,
      `${operator.street}`,
      `${operator.city}`,
      `${operator.country}`,
    ],
  },
  {
    heading: 'Kontakt',
    paragraphs: [`E-Mail: ${operator.email}`],
  },
  {
    heading: 'Verantwortlich für den Inhalt',
    paragraphs: [
      `${operator.name}, Anschrift wie oben.`,
      'Nur Islam ist ein nichtkommerzielles Angebot. Es werden keine Zahlungen entgegengenommen und keine Werbung ausgeliefert.',
    ],
  },
  {
    heading: 'Hinweis zu religiösen Inhalten',
    paragraphs: [
      'Die App gibt religiöses Wissen wieder und ersetzt keine Rechtsauskunft einer qualifizierten Lehrperson. Angaben zu Gebetszeiten, Qibla-Richtung und islamischem Datum beruhen auf Berechnungen und können regional abweichen.',
      'Deutsche Übersetzungen von Quran und Hadith sind sinngemäße Wiedergaben und nicht der Originalwortlaut.',
    ],
  },
];

export const privacySections: LegalSection[] = [
  {
    heading: 'Verantwortlicher',
    paragraphs: [
      `${operator.name}, ${operator.street}, ${operator.city}, ${operator.country}.`,
      `Anfragen zum Datenschutz: ${operator.email}`,
    ],
  },
  {
    heading: 'Grundsatz: die App funktioniert ohne Konto',
    paragraphs: [
      'Ein Konto ist für die lokale Nutzung nicht erforderlich. Gebets-Tracker, Dhikr-Zähler, Lesezeichen, Favoriten, Kalendereinträge, Notizen, Lernfortschritt und Einstellungen werden standardmäßig im lokalen Speicher deines Browsers gehalten. Freiwillig genutzte Online-Funktionen wie Live-Gebetszeiten, Moschee-Suche oder ein Quran-Fallback können unabhängig von einer Anmeldung die jeweils unten beschriebenen technischen Daten an externe Dienste übertragen.',
      'Ein Konto ist ausschließlich für die freiwillige Cloud-Sicherung und Cloud-Notizen nötig.',
    ],
  },
  {
    heading: 'Standortdaten',
    paragraphs: [
      'Der Gerätestandort wird nur nach ausdrücklicher Freigabe durch dich abgefragt. Er wird lokal für die persönliche Qibla-Richtung verwendet und als gemeinsamer Gebetsstandort gespeichert. Für Live-Gebetszeiten können die Koordinaten an AlAdhan und für die Moschee-Suche an öffentliche OpenStreetMap/Overpass-Dienste übertragen werden.',
      'Standortkoordinaten werden nicht in die Cloud-Sicherung aufgenommen. Die persönliche Qibla-Berechnung erfolgt in der App; externe Übertragungen finden nur für die jeweils genannten Online-Abfragen statt.',
      'Verweigerst du die Standortfreigabe, gibt die App keine persönliche Qibla-Richtung und keine persönlichen Live-Gebetszeiten aus. Andere lokale App-Bereiche bleiben nutzbar; die Moschee-Suche kann einen ausdrücklich gekennzeichneten Standardort verwenden.',
    ],
  },
  {
    heading: 'Eingesetzte Dienste und was an sie übermittelt wird',
    paragraphs: [
      'AlAdhan (api.aladhan.com) – Live-Gebetszeiten. Nach freiwilliger Standortfreigabe werden Breiten- und Längengrad, Datum, Berechnungsmethode und Asr-Schule übermittelt.',
      'Al Quran Cloud (api.alquran.cloud) – technischer Quran-Fallback, falls eine lokale Quran-Datei fehlt oder nicht lesbar ist. Übermittelt werden Surennummer und Ausgabenkennung, keine personenbezogenen Daten.',
      'OpenStreetMap über die öffentlichen Overpass-Dienste overpass-api.de und overpass.kumi.systems – Moschee-Suche. Bei Nutzung des Gerätestandorts werden Breiten- und Längengrad sowie der Suchradius übermittelt. Kartendaten stammen von OpenStreetMap-Mitwirkenden und stehen unter der Open Database License.',
      'Supabase (jmswsgwnvmvsfayeodcd.supabase.co) – nur bei angelegtem Konto: Anmeldung, Profil, Cloud-Sicherung und Cloud-Notizen. Das genutzte Projekt liegt in der Region EU-Nord (Stockholm).',
      'GitHub Pages – Auslieferung der App. Beim Abruf verarbeitet GitHub technisch notwendige Verbindungsdaten wie deine IP-Adresse.',
    ],
  },
  {
    heading: 'Konto und Cloud-Sicherung',
    paragraphs: [
      'Mit einem Konto werden gespeichert: deine E-Mail-Adresse, ein Anzeigename, deine Darstellungseinstellungen sowie – wenn du die Sicherung ausdrücklich auslöst – dein Fortschritt und deine Cloud-Notizen.',
      'Bewusst nicht gesichert werden: Standortkoordinaten, zwischengespeicherte Gebetszeiten, Moschee-Suchergebnisse, lokale Notizen sowie der Onboarding- und Installationsstatus.',
      'Der Zugriff ist datenbankseitig so abgesichert, dass ein angemeldetes Konto ausschließlich die eigenen Datensätze lesen und verändern kann.',
    ],
  },
  {
    heading: 'Speicherdauer',
    paragraphs: [
      'Lokale Daten bleiben so lange auf dem Gerät, bis du sie in der App zurücksetzt oder die Browserdaten löschst.',
      'Cloud-Daten bleiben gespeichert, bis du sie löschst. Unter „Konto & Sicherung“ kannst du deine Cloud-Daten jederzeit vollständig entfernen; das zugrunde liegende Login-Konto wird dadurch nicht gelöscht.',
    ],
  },
  {
    heading: 'Deine Rechte',
    paragraphs: [
      'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch.',
      'Auskunft und Übertragbarkeit kannst du ohne Anfrage selbst wahrnehmen: Unter „Konto & Sicherung“ exportierst du deine gespeicherten Daten als JSON-Datei und löschst sie dort auch wieder.',
      'Eine erteilte Standortfreigabe kannst du jederzeit in den Einstellungen deines Browsers oder Geräts widerrufen.',
      'Du kannst dich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren. Zuständig ist die Behörde deines Wohnsitzes oder die des Anbieters.',
    ],
  },
  {
    heading: 'Kein Tracking',
    paragraphs: [
      'Die App setzt keine Analyse-, Tracking- oder Werbedienste ein und verwendet keine Cookies zu diesen Zwecken.',
      'Es findet keine Auswertung deines religiösen Nutzungsverhaltens statt.',
    ],
  },
];

export const licenseSections: LegalSection[] = [
  {
    heading: 'Kartendaten',
    paragraphs: [
      'Moscheedaten: © OpenStreetMap-Mitwirkende, veröffentlicht unter der Open Database License (ODbL).',
    ],
  },
  {
    heading: 'Schriften und Symbole',
    paragraphs: [
      'Schriften Amiri, Cormorant Garamond und Inter über Fontsource, jeweils unter ihrer Open-Font-Lizenz.',
      'Symbole: Lucide, MIT-Lizenz.',
    ],
  },
  {
    heading: 'Textquellen',
    paragraphs: [
      'Lokaler Offline-Quran: Herkunft, konkrete arabische Ausgabe, deutsche Wiedergabe und Nutzungsrechte des übernommenen Bestands sind noch nicht abschließend dokumentiert. Dieser Punkt blockiert die Freigabe des Quran-Bestands für den öffentlichen Release.',
      'Online-Fallback über Al Quran Cloud: arabische Ausgabe quran-uthmani; deutsche Ausgabe de.bubenheim (Bubenheim & Elyas). Diese Angaben beziehen sich ausschließlich auf den Online-Fallback und nicht automatisch auf den lokalen Offline-Bestand.',
      'Herkunft und Nutzungsrechte der einzelnen Textbestände werden vor Veröffentlichung dokumentiert. Ungeklärte Provenienz wird nicht als bereits verifizierte Ausgabe ausgegeben.',
    ],
  },
];

/** True while the imprint still contains values nobody has filled in. */
export function hasUnfilledOperatorDetails() {
  return Object.values(operator).some((value) => value === OPERATOR_PLACEHOLDER);
}
