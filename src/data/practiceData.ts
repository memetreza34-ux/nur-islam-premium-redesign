/**
 * Sunnah im Alltag sowie Fehler und Reue.
 *
 * Alltagspraxis und Reue am 03.09.2026 anhand der verlinkten Quellen überarbeitet.
 * Beispiele sind Lernhilfen, keine zusätzlichen Vorschriften. Der Abschnitt
 * zu schweren Verfehlungen stammt weiterhin aus dem Altbestand.
 * Die religiös-fachliche Freigabe bleibt offen.
 */

export type PracticeItem = {
  title: string;
  description: string;
  proof: string;
  meaning?: string;
  example?: string;
  sourceUrl?: string;
};

export type PracticeGroup = {
  id: string;
  category: string;
  items: PracticeItem[];
};

export const SUNNAH_GROUPS: readonly PracticeGroup[] = [
  {
    id: 'daily',
    category: 'Essen, Zuhause und Schlafen',
    items: [
      {
        title: 'Zur Ruhe kommen',
        description: 'Die Überlieferung beschreibt Wudu vor dem Zubettgehen und das Hinlegen auf die rechte Seite. Sie fordert nicht, die ganze Nacht bewusst dieselbe Lage zu halten.',
        proof: 'Sahih al-Bukhari 6311',
        meaning: 'Wudu ist die rituelle Gebetswaschung. Hier wird sie als Vorbereitung auf das Schlafen erwähnt.',
        example: 'Wenn du dich für die Nacht fertig machst, nimm dir bewusst Zeit für Wudu und verbinde die Erinnerung mit deiner Abendroutine.',
        sourceUrl: 'https://sunnah.com/bukhari:6311',
      },
      {
        title: 'Bewusst essen',
        description: 'Der Prophet ﷺ lehrte einen Jungen, Allahs Namen zu nennen, mit der rechten Hand zu essen und von dem zu nehmen, was vor ihm liegt. Der letzte Hinweis betrifft hier das Essen aus einem gemeinsamen Gefäß.',
        proof: 'Sahih al-Bukhari 5376',
        meaning: 'Bismillah bedeutet: im Namen Allahs. Es ist hier die Erinnerung an Allah vor dem Essen.',
        example: 'Am gemeinsamen Tisch beginnst du mit Bismillah und greifst nicht über andere hinweg. Die Anwendung verbindet Gottesgedenken mit Rücksicht.',
        sourceUrl: 'https://sunnah.com/bukhari:5376',
      },
      {
        title: 'Allah beim Heimkommen erwähnen',
        description: 'Diese Überlieferung nennt das Gedenken Allahs beim Betreten des Hauses und beim Essen. Sie enthält keine Anweisung dazu, mit welchem Fuß du dein Zuhause betreten sollst.',
        proof: 'Sahih Muslim 2018a',
        meaning: 'Dhikr bedeutet das Gedenken Allahs. Es kann mitten im normalen Tagesablauf stattfinden.',
        example: 'Wenn du nach Hause kommst, erinnerst du dich bewusst an Allah, statt die Handlung nur nebenbei auszuführen.',
        sourceUrl: 'https://sunnah.com/muslim:2018a',
      },
    ],
  },
  {
    id: 'character',
    category: 'Umgang mit Menschen und Körperpflege',
    items: [
      {
        title: 'Freundlich begegnen',
        description: 'Die Überlieferung zählt ein freundliches Lächeln gegenüber dem Bruder zu den guten Taten. Hilfsbereitschaft ist nicht auf Geldspenden beschränkt.',
        proof: 'Jamiʿ at-Tirmidhi 1956 · hasan nach Darussalam',
        meaning: 'Sadaqah bezeichnet eine freiwillige gute Gabe; in diesem Zusammenhang auch eine freundliche Handlung.',
        example: 'Du begrüßt einen Menschen aufmerksam und freundlich. So lässt sich die beschriebene Haltung in einer kleinen Begegnung umsetzen.',
        sourceUrl: 'https://sunnah.com/tirmidhi:1956',
      },
      {
        title: 'Mit Worten Verantwortung übernehmen',
        description: 'Der Hadith verbindet gutes Sprechen oder Schweigen mit Rücksicht auf Nachbarn und Gastfreundschaft. Das Vorbild betrifft also auch, wie andere unseren Umgang erleben.',
        proof: 'Sahih al-Bukhari 6018',
        meaning: 'Gutes Sprechen ist hilfreiche, verantwortliche Rede. Nicht jeder spontane Kommentar braucht ausgesprochen zu werden.',
        example: 'Vor einer Nachricht prüfst du: Ist sie wahr und hilfreich oder macht sie jemanden unnötig schlecht? Einen verletzenden Kommentar kannst du weglassen.',
        sourceUrl: 'https://sunnah.com/bukhari:6018',
      },
      {
        title: 'Die Zähne mit Miswak reinigen',
        description: 'Der Prophet ﷺ betonte die Zahnreinigung vor dem Gebet, ohne daraus in dieser Überlieferung einen verpflichtenden Befehl zu machen. Er nennt ausdrücklich die Sorge vor einer Belastung der Gemeinschaft.',
        proof: 'Sahih al-Bukhari 887',
        meaning: 'Miswak ist ein Zahnreinigungshölzchen. Die Überlieferung beschreibt eine Praxis der Körperpflege.',
        example: 'Du legst deinen Miswak an einen sauberen Platz, an dem du dich vor dem Gebet an die Zahnreinigung erinnerst.',
        sourceUrl: 'https://sunnah.com/bukhari:887',
      },
    ],
  },
];

export const REPENTANCE_GROUPS: readonly PracticeGroup[] = [
  {
    id: 'major',
    category: 'Die großen Sünden (Al-Kaba\'ir)',
    items: [
      {
        title: 'Shirk (Beigesellung)',
        description: 'Allah Partner zur Seite zu stellen. Dies ist die größte Sünde und die einzige, die Allah nicht vergibt, wenn man nicht davor bereut.',
        proof: 'Koran (4:48): \'Wahrlich, Allah vergibt nicht, dass Ihm etwas beigesellt wird; Er vergibt aber, was geringer ist als dies, wem Er will.\'',
      },
      {
        title: 'Zauberei (Sihr)',
        description: 'Das Praktizieren oder Erlernen von Magie/Zauberei, da es oft mit Shirk verbunden ist.',
        proof: 'Der Prophet ﷺ zählte Zauberei zu den sieben zerstörerischen Sünden. (Bukhari)',
      },
      {
        title: 'Mord',
        description: 'Das ungerechtfertigte Töten eines Menschen.',
        proof: 'Koran (5:32): \'...wer einen Menschen tötet... so ist es, als hätte er die ganze Menschheit getötet.\'',
      },
      {
        title: 'Zinsnehmen (Riba)',
        description: 'Das Nehmen oder Geben von Zinsen bei finanziellen Transaktionen.',
        proof: 'Koran (2:275): \'...Allah hat den Handel erlaubt und den Zins (Riba) verboten.\'',
      },
      {
        title: 'Verzehr des Waisenvermögens',
        description: 'Das ungerechtfertigte Aneignen oder Ausgeben des Vermögens von Waisenkindern.',
        proof: 'Koran (4:10): \'Diejenigen, die den Besitz der Waisen ungerecht aufzehren, verzehren in ihren Bäuchen nur Feuer...\'',
      },
    ],
  },
  {
    id: 'repentance',
    category: 'Schritt für Schritt zurückfinden',
    items: [
      {
        title: 'Hoffnung behalten',
        description: 'Quran 39:53 warnt davor, an Allahs Barmherzigkeit zu verzweifeln. Der folgende Vers ruft zur Rückkehr zu Allah auf. Hoffnung und Umkehr gehören zusammen; das ist kein Freibrief, mit dem Unrecht weiterzumachen.',
        proof: 'Quran 39:53–54',
        meaning: 'Tawbah bedeutet Umkehr: Du wendest dich nach einer Verfehlung wieder Allah zu.',
        example: 'Statt zu denken, dass alles verloren sei, benennst du für dich einen ersten Schritt, mit dem du das Fehlverhalten beendest.',
        sourceUrl: 'https://quran.com/39/53-54',
      },
      {
        title: 'Das Fehlverhalten beenden',
        description: 'Reue bleibt nicht nur ein Satz. Quran 3:135 beschreibt Menschen, die um Vergebung bitten und nicht wissentlich auf ihrem Unrecht beharren.',
        proof: 'Quran 3:135 · Umkehr',
        meaning: 'Aufhören heißt: eine erkannte falsche Handlung nicht bewusst weiterführen.',
        example: 'Du beendest das Weiterleiten einer verletzenden Nachricht und verhinderst, soweit möglich, ihre weitere Verbreitung.',
        sourceUrl: 'https://quran.com/3/135',
      },
      {
        title: 'Bereuen und sich neu ausrichten',
        description: 'Zur Reue gehören Bedauern über die Tat und der ernsthafte Entschluss, sie nicht zu wiederholen. Das ist eine ehrliche Entscheidung jetzt, keine Behauptung, dass du zukünftig niemals mehr einen Fehler machen könntest.',
        proof: 'Dar al-Ifta · Bedingungen der Reue',
        meaning: 'Reue richtet sich gegen das Unrecht, nicht gegen deinen Wert als Mensch.',
        example: 'Du erkennst, wodurch du immer wieder in denselben Streit gerätst, und planst eine konkrete Veränderung, etwa eine Pause vor der Antwort.',
        sourceUrl: 'https://www.dar-alifta.org/en/fatwa/details/7148/how-can-i-repent-from-a-sin-so-god-would-forgive-me',
      },
      {
        title: 'Rechte anderer wiederherstellen',
        description: 'Wenn andere geschädigt wurden, ist auch ihr Anspruch zu beachten. Eine Bitte um Vergebung bei Allah ersetzt nicht einfach die Rückgabe fremden Eigentums. Bei Rufschädigung oder komplizierten Fällen hilft qualifizierter Rat, zusätzlichen Schaden zu vermeiden.',
        proof: 'Sahih al-Bukhari 2449 · Dar al-Ifta, Bedingungen der Reue',
        meaning: 'Wiedergutmachung bedeutet, einen verursachten Schaden beziehungsweise einen offenen Anspruch zu klären.',
        example: 'Geld, das jemand anderem gehört, gibst du zurück. Eine Entschuldigung verpflichtet die geschädigte Person nicht dazu, dir sofort zu vergeben.',
        sourceUrl: 'https://sunnah.com/bukhari:2449',
      },
      {
        title: 'Um Vergebung bitten',
        description: 'Istighfar ist die Bitte an Allah um Vergebung. Sie begleitet die Umkehr, ersetzt aber nicht das Aufhören oder die Wiedergutmachung. Auch der Prophet ﷺ suchte häufig Vergebung.',
        proof: 'Riyad as-Salihin 13 · Überlieferung aus al-Bukhari',
        meaning: 'Astaghfirullah bedeutet: Ich bitte Allah um Vergebung. Vereinfachte Aussprache: As-tagh-fi-rul-laah; das gh ist kein deutsches g.',
        example: 'Du bittest Allah um Vergebung und gehst danach den nächsten notwendigen Schritt zur Veränderung.',
        sourceUrl: 'https://sunnah.com/riyadussalihin:13',
      },
      {
        title: 'Nach einem Rückfall erneut umkehren',
        description: 'Ein erneuter Fehler ist kein Grund, Reue aufzugeben. Erneuere deine Umkehr, beende das Verhalten wieder und verstärke deine konkreten Schutzmaßnahmen. Das ist etwas anderes, als die Wiederholung von Anfang an einzuplanen.',
        proof: 'Dar al-Ifta · Erneute Umkehr nach einem Rückfall',
        meaning: 'Neu anfangen bedeutet Verantwortung übernehmen, auch wenn der Weg nicht geradlinig ist.',
        example: 'Du sprichst vertraulich mit einer geeigneten Unterstützungsperson darüber, welcher Auslöser bisher übersehen wurde, statt dich mit bloßer Selbstanklage festzufahren.',
        sourceUrl: 'https://www.dar-alifta.org/en/fatwa/details/7980/falling-into-cardinal-sins-any-chance-for-repentance',
      },
    ],
  },
];
