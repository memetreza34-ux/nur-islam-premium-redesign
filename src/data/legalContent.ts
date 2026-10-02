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

/**
 * Details only the operator can supply. An imprint may not be invented.
 *
 * `street` and `city` must be an address where post can actually be served —
 * § 5 DDG asks for a summonable address, which a P.O. box does not satisfy.
 * Services that provide a c/o business address exist for exactly this case;
 * whichever one is used, the address it issues goes here verbatim.
 */
export const operator = {
  name: 'Mohammad Reza Rahimi',
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
      'Derzeit werden noch keine Zahlungen entgegengenommen und keine Werbung ausgeliefert. Eine spätere Bezahlfunktion muss vor ihrer Aktivierung in Impressum und Datenschutzerklärung berücksichtigt werden.',
    ],
  },
  {
    heading: 'Hinweis zu religiösen Inhalten',
    paragraphs: [
      'Die App gibt religiöses Wissen wieder und ersetzt keine Rechtsauskunft einer qualifizierten Lehrperson. Angaben zu Gebetszeiten, Qibla-Richtung und islamischem Datum beruhen auf Berechnungen und können regional abweichen.',
      'Die Quran-Aussprachehilfe ist eine vereinfachte Umschrift in Lateinschrift und keine Tajwid-Anleitung. Deutsche Übersetzungen von Quran und Hadith sind sinngemäße Wiedergaben und nicht der Originalwortlaut.',
    ],
  },
];

export const privacySections: LegalSection[] = [
  {
    heading: 'Stand und Geltungsbereich',
    paragraphs: [
      'Stand dieser Datenschutzerklärung: 12. September 2026.',
      'Diese Erklärung beschreibt die Web-App Nur Islam, ihre lokale Speicherung, die optionalen Live-Dienste und die freiwilligen Konto- und Cloud-Funktionen.',
    ],
  },
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
      'Gebets-Tracker, Dhikr-Zähler, Lesezeichen, Favoriten, Kalendereinträge, lokale Notizen, Lernfortschritt und Einstellungen liegen zunächst ausschließlich im lokalen Speicher deines Browsers. Ohne Konto werden diese persönlichen App-Inhalte nicht in die Nur-Islam-Cloud übertragen.',
      'Ein Konto ist ausschließlich für die freiwillige Cloud-Sicherung und Cloud-Notizen nötig.',
    ],
  },
  {
    heading: 'Lokaler Speicher und Gerätezugriffe',
    paragraphs: [
      'Die App verwendet Local Storage, Session Storage und den Browser-Cache für ausdrücklich gewünschte Funktionen wie Einstellungen, Offline-Nutzung, Fortschritt, Erinnerungen und die laufende Anmeldung. Es werden keine Analyse- oder Werbe-Cookies gesetzt.',
      'Diese technisch-funktionalen Speicherzugriffe erfolgen, soweit sie für die angeforderte App-Funktion unbedingt erforderlich sind, nach § 25 Absatz 2 Nummer 2 TDDDG. Personenbezogene lokale Verarbeitung erfolgt zur Bereitstellung der angeforderten App-Funktionen nach Artikel 6 Absatz 1 Buchstabe b DSGVO.',
      'Standort und Benachrichtigungen werden nur nach einer gesonderten Geräte- oder Browserfreigabe verwendet. Eine verweigerte Freigabe verhindert nicht die übrige Nutzung der App.',
    ],
  },
  {
    heading: 'Standortdaten',
    paragraphs: [
      'Der Standort wird nur nach ausdrücklicher Freigabe durch dich abgefragt und dient zwei Zwecken: der Berechnung der Gebetszeiten und der Suche nach Moscheen im Umkreis.',
      'Die Koordinaten werden dafür an die jeweils genannten Dienste übertragen. Sie werden nicht in die Cloud-Sicherung aufgenommen und verlassen dein Gerät ausschließlich für diese beiden Abfragen.',
      'Verweigerst du die Freigabe, nutzt die App einen voreingestellten Ort und bleibt vollständig bedienbar.',
      'Rechtsgrundlage für den Gerätestandort und seine Übermittlung ist deine Einwilligung nach Artikel 6 Absatz 1 Buchstabe a DSGVO. Soweit der Nutzungskontext Rückschlüsse auf religiöse Überzeugungen zulässt, stützt sich die Verarbeitung zusätzlich auf deine ausdrückliche Einwilligung nach Artikel 9 Absatz 2 Buchstabe a DSGVO. Du kannst sie jederzeit über die Geräte- oder Browsereinstellungen mit Wirkung für die Zukunft widerrufen.',
    ],
  },
  {
    heading: 'Eingesetzte Dienste und was an sie übermittelt wird',
    paragraphs: [
      'AlAdhan (api.aladhan.com) – Gebetszeiten. Übermittelt werden Breiten- und Längengrad, Datum, Berechnungsmethode und Asr-Schule.',
      'Al Quran Cloud (api.alquran.cloud) – Quran-Aussprachehilfe in Lateinschrift und deutsche Übersetzung. Beide sind nicht Teil der App, sondern werden beim Öffnen einer Sure abgerufen und danach im Browser gespeichert. Übermittelt werden Surennummer und Ausgabenkennung, keine personenbezogenen Daten; wie bei jedem Abruf verarbeitet der Anbieter dabei technisch notwendige Verbindungsdaten wie deine IP-Adresse. Der arabische Text liegt vollständig in der App und wird nicht abgefragt.',
      'Islamic Network (cdn.islamic.network) – Rezitations-Aufnahmen im Gebetskurs, nur wenn du „Anhören“ antippst. Übermittelt wird die Versnummer; wie bei jedem Abruf verarbeitet der Anbieter dabei technisch notwendige Verbindungsdaten wie deine IP-Adresse. Ohne Antippen wird nichts geladen.',
      'OpenStreetMap über die öffentlichen Overpass-Dienste overpass-api.de und overpass.kumi.systems – Moschee-Suche. Übermittelt werden Breiten- und Längengrad sowie der Suchradius. Kartendaten stammen von OpenStreetMap-Mitwirkenden und stehen unter der Open Database License.',
      'Supabase (jmswsgwnvmvsfayeodcd.supabase.co) – nur bei angelegtem Konto: Anmeldung, Profil, Cloud-Sicherung und Cloud-Notizen. Das genutzte Projekt liegt in der Region EU-Nord (Stockholm).',
      'GitHub Pages – Auslieferung der App. Beim Abruf verarbeitet GitHub technisch notwendige Verbindungsdaten wie deine IP-Adresse.',
    ],
  },
  {
    heading: 'Rechtsgrundlagen der Online-Dienste',
    paragraphs: [
      'Das Laden ausdrücklich ausgewählter Quran-Inhalte und Rezitationen sowie die Bereitstellung angeforderter Gebets- und Moschee-Funktionen erfolgt nach Artikel 6 Absatz 1 Buchstabe b DSGVO. Standortübermittlungen erfolgen nur nach Einwilligung gemäß Artikel 6 Absatz 1 Buchstabe a DSGVO.',
      'Soweit einzelne Anfragen oder gespeicherte Inhalte religiöse Überzeugungen erkennen lassen können, gilt zusätzlich Artikel 9 DSGVO. Für die Nur-Islam-Cloud wird deshalb vor der ersten Nutzung eine ausdrückliche, freiwillige und versioniert dokumentierte Einwilligung eingeholt.',
      'Technisch notwendige Sicherheits- und Zugriffsprotokolle des Hostings werden auf Grundlage von Artikel 6 Absatz 1 Buchstabe f DSGVO verarbeitet. Das berechtigte Interesse liegt im sicheren und störungsfreien Betrieb der App.',
    ],
  },
  {
    heading: 'Konto und Cloud-Sicherung',
    paragraphs: [
      'Mit einem Konto werden gespeichert: deine E-Mail-Adresse, ein Anzeigename und der Zeitpunkt sowie die Version deiner ausdrücklichen Cloud-Einwilligung. Erst nach dieser Einwilligung können Cloud-Notizen gespeichert und von dir ausgelöste Backups mit Favoriten, Lernfortschritt, Gebets-Tracker und unterstützten Einstellungen angelegt werden.',
      'Cloud-Inhalte können religiöse Überzeugungen erkennen lassen und gehören deshalb zu den besonders geschützten Daten. Rechtsgrundlagen sind deine Einwilligung nach Artikel 6 Absatz 1 Buchstabe a und Artikel 9 Absatz 2 Buchstabe a DSGVO. Die Einwilligung ist freiwillig und nicht Voraussetzung für die lokale Nutzung.',
      'Bewusst nicht gesichert werden: Standortkoordinaten, zwischengespeicherte Gebetszeiten, Moschee-Suchergebnisse, lokale Notizen sowie der Onboarding- und Installationsstatus. Das lokale Premium-Komfortpaket verwendet einen getrennten gerätegebundenen Speicher; insbesondere privates Journal, lokale Routinen, Quran-Plan, Premium-Erinnerungen, Premium-Ordner und Premium-Einstellungen werden nicht durch das generische Cloud-Backup übertragen.',
      'Der Zugriff ist datenbankseitig so abgesichert, dass ein angemeldetes Konto ausschließlich die eigenen Datensätze lesen und verändern kann.',
    ],
  },
  {
    heading: 'Empfänger, Auftragsverarbeitung und Drittländer',
    paragraphs: [
      'Supabase verarbeitet Konto- und Cloud-Daten als technische Cloud-Plattform im Auftrag des Verantwortlichen. Das Projekt speichert Anwendungsdaten in der Region EU-Nord (Stockholm). Unterauftragnehmer können je nach eingesetzter Infrastruktur beteiligt sein.',
      'GitHub stellt die App bereit und protokolliert nach eigener Dokumentation IP-Adressen zu Sicherheitszwecken. AlAdhan, Al Quran Cloud, Islamic Network und öffentliche Overpass-Instanzen erhalten nur bei Nutzung der jeweiligen Funktion die oben genannten Anfrage- und Verbindungsdaten und können diese in eigener Verantwortung verarbeiten.',
      'Soweit Empfänger oder Unterauftragnehmer Daten außerhalb des Europäischen Wirtschaftsraums verarbeiten, muss die Übermittlung auf einem Angemessenheitsbeschluss, Standardvertragsklauseln oder einer anderen zulässigen Garantie nach Kapitel V DSGVO beruhen. Die jeweils aktuelle Anbieter- und Unterauftragnehmerliste ist vor Veröffentlichung und danach regelmäßig zu prüfen.',
    ],
  },
  {
    heading: 'Speicherdauer',
    paragraphs: [
      'Lokale Daten bleiben so lange auf dem Gerät, bis du sie in der App zurücksetzt oder die Browserdaten löschst.',
      'Nur-Islam-Cloud-Daten bleiben gespeichert, bis du sie löschst oder deine Einwilligung widerrufst. Unter „Konto & Sicherung“ kannst du das app-spezifische Profil, Backups und Cloud-Notizen entfernen; die technisch getrennte Supabase-Anmeldung bleibt dabei bestehen und kann über die Kontaktadresse vollständig gelöscht werden.',
      'Speicherfristen für Sicherheitsprotokolle und technisch notwendige Verbindungsdaten richten sich nach den Regeln der jeweiligen Anbieter. Sie dürfen nicht länger als für Sicherheit, Betrieb oder gesetzliche Pflichten erforderlich gespeichert werden.',
    ],
  },
  {
    heading: 'Deine Rechte',
    paragraphs: [
      'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch.',
      'Auskunft und Übertragbarkeit kannst du ohne Anfrage selbst wahrnehmen: Unter „Konto & Sicherung“ exportierst du deine gespeicherten Daten als JSON-Datei und löschst sie dort auch wieder.',
      'Eine erteilte Standortfreigabe kannst du jederzeit in den Einstellungen deines Browsers oder Geräts widerrufen.',
      'Deine Cloud-Einwilligung kannst du unter „Konto & Sicherung“ durch Löschen der Cloud-Daten mit Wirkung für die Zukunft widerrufen. Die Rechtmäßigkeit der vorherigen Verarbeitung bleibt davon unberührt.',
      'Du kannst dich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren. Zuständig ist die Behörde deines Wohnsitzes oder die des Anbieters.',
    ],
  },
  {
    heading: 'Keine automatisierten Entscheidungen und keine KI-Funktion',
    paragraphs: [
      'Die App trifft keine ausschließlich automatisierten Entscheidungen mit rechtlicher oder ähnlich erheblicher Wirkung und erstellt keine Nutzerprofile für Werbung oder Bewertung.',
      'In der ausgelieferten App ist kein Chatbot und kein generatives KI-System eingebunden. Mit ChatGPT erstellte Illustrationen werden im Bereich „Lizenzen“ offengelegt; sie dienen nur der Gestaltung und Lernunterstützung.',
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
    heading: 'Illustrationen',
    paragraphs: [
      'Die projektspezifischen Bildobjekte und Illustrationen der App wurden für dieses Projekt mit ChatGPT (OpenAI) erzeugt.',
      'Nach den OpenAI-Nutzungsbedingungen stehen dem Nutzer im Verhältnis zu OpenAI und soweit rechtlich zulässig die Rechte am Output zu. Generative Outputs können anderen Outputs ähneln und sind nicht notwendigerweise einzigartig.',
      'Ob und in welchem Umfang einzelne KI-generierte oder menschlich bearbeitete Elemente in Deutschland urheberrechtlichen Schutz genießen, wird hier nicht pauschal behauptet. Maßgeblich sind die gesetzlichen Voraussetzungen und die konkrete Entstehung des jeweiligen Elements.',
    ],
  },
  {
    heading: 'Aufnahmen',
    paragraphs: [
      'Quran-Rezitation im Gebetskurs: Mishary Alafasy, bezogen über Islamic Network (cdn.islamic.network).',
      'Die Aufnahme wird erst beim Antippen von „Anhören" gestreamt und liegt nicht in der App. Die Nutzung richtet sich nach den Bedingungen von Al Quran Cloud; das Copyright verbleibt beim Rezitator.',
    ],
  },
  {
    heading: 'Textquellen',
    paragraphs: [
      'Arabischer Quran-Text: Ausgabe Uthmani über Al Quran Cloud.',
      'Quran-Aussprachehilfe in Lateinschrift: Edition en.transliteration über Al Quran Cloud.',
      'Deutsche Quran-Übersetzung: Edition de.bubenheim (Bubenheim & Elyas) über Al Quran Cloud; nicht mit der App ausgeliefert.',
      'Herkunft und Nutzungsrechte der einzelnen Textbestände werden fortlaufend dokumentiert. Inhalte ohne belegte Quelle sind in der App als solche gekennzeichnet.',
    ],
  },
];

/** True while the imprint still contains values nobody has filled in. */
export function hasUnfilledOperatorDetails() {
  return Object.values(operator).some((value) => value === OPERATOR_PLACEHOLDER);
}
