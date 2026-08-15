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
      'Ohne Anmeldung verlassen deine Inhalte das Gerät nicht. Gebets-Tracker, Dhikr-Zähler, Lesezeichen, Favoriten, Kalendereinträge, Notizen, Lernfortschritt und Einstellungen liegen ausschließlich im lokalen Speicher deines Browsers.',
      'Ein Konto ist ausschließlich für die freiwillige Cloud-Sicherung und Cloud-Notizen nötig.',
    ],
  },
  {
    heading: 'Standortdaten',
    paragraphs: [
      'Der Standort wird nur nach ausdrücklicher Freigabe durch dich abgefragt und dient zwei Zwecken: der Berechnung der Gebetszeiten und der Suche nach Moscheen im Umkreis.',
      'Die Koordinaten werden dafür an die jeweils genannten Dienste übertragen. Sie werden nicht in die Cloud-Sicherung aufgenommen und verlassen dein Gerät ausschließlich für diese beiden Abfragen.',
      'Verweigerst du die Freigabe, nutzt die App einen voreingestellten Ort und bleibt vollständig bedienbar.',
    ],
  },
  {
    heading: 'Eingesetzte Dienste und was an sie übermittelt wird',
    paragraphs: [
      'AlAdhan (api.aladhan.com) – Gebetszeiten. Übermittelt werden Breiten- und Längengrad, Datum, Berechnungsmethode und Asr-Schule.',
      'Al Quran Cloud (api.alquran.cloud) – Nachladen von Suren, die nicht fest in der App enthalten sind. Übermittelt werden Surennummer und Ausgabenkennung, keine personenbezogenen Daten.',
      'Islamic Network (cdn.islamic.network) – Rezitations-Aufnahmen im Gebetskurs, nur wenn du „Anhören“ antippst. Übermittelt wird die Versnummer; wie bei jedem Abruf verarbeitet der Anbieter dabei technisch notwendige Verbindungsdaten wie deine IP-Adresse. Ohne Antippen wird nichts geladen.',
      'Hisn al-Muslim (www.hisnmuslim.com) – Aufnahmen der überlieferten Gebetsformeln im Gebetskurs, ebenfalls nur beim Antippen von „Anhören“. Übermittelt wird die Nummer der Aufnahme; auch hier verarbeitet der Anbieter dabei technisch notwendige Verbindungsdaten wie deine IP-Adresse.',
      'OpenStreetMap über die öffentlichen Overpass-Dienste overpass-api.de und overpass.kumi.systems – Moschee-Suche. Übermittelt werden Breiten- und Längengrad sowie der Suchradius. Kartendaten stammen von OpenStreetMap-Mitwirkenden und stehen unter der Open Database License.',
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
      'Cloud-Daten bleiben gespeichert, bis du sie löschst. Unter „Konto & Sicherung“ kannst du deine Cloud-Daten jederzeit vollständig entfernen; die Anmeldung selbst bleibt dabei bestehen.',
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
      'Arabischer Quran-Text: Ausgabe Uthmani über Al Quran Cloud.',
      'Deutsche Quran-Wiedergabe: Bubenheim & Elyas über Al Quran Cloud.',
      'Herkunft und Nutzungsrechte der einzelnen Textbestände werden fortlaufend dokumentiert. Inhalte ohne belegte Quelle sind in der App als solche gekennzeichnet.',
    ],
  },
];

/** True while the imprint still contains values nobody has filled in. */
export function hasUnfilledOperatorDetails() {
  return Object.values(operator).some((value) => value === OPERATOR_PLACEHOLDER);
}
