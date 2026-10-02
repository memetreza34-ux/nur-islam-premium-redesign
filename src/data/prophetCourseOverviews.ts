export type ProphetCourseOverview = {
  orientation: string;
  coursePath: string;
  boundary: string;
  learningGoals: readonly string[];
};

/**
 * Extended course introductions that stay inside the Quran passages cited by
 * the corresponding chapters. They explain scope and learning order without
 * turning later biographies or disputed reports into Quran facts.
 */
export const PROPHET_COURSE_OVERVIEWS: Readonly<Record<string, ProphetCourseOverview>> = {
  adam: {
    orientation: 'Adams Geschichte verbindet den Ursprung des Menschen mit Wissen, Verantwortung und freier Entscheidung. Sie erklärt zugleich, wie Hochmut zur Verweigerung führt und wie ein menschlicher Fehltritt durch aufrichtige Reue beantwortet werden kann.',
    coursePath: 'Du beginnst bei der Erschaffung und dem Wissen, das Adam gelehrt wurde. Danach folgen die Prüfung im Garten, die gemeinsame Verantwortung von Adam und seiner Frau sowie die Annahme der Reue und die Rechtleitung für das Leben auf der Erde.',
    boundary: 'Der Kurs nennt keine Zeitangaben, geografischen Einzelheiten oder späteren Legenden, die in den angegebenen Quran-Passagen nicht stehen.',
    learningGoals: ['Wissen und Verantwortung zusammen einordnen', 'Hochmut und menschlichen Fehltritt unterscheiden', 'Reue als bewusste Rückkehr verstehen'],
  },
  idris: {
    orientation: 'Der Quran berichtet über Idris nur in wenigen Versen. Gerade deshalb zeigt dieser Kurs, wie sorgfältiges Lernen funktioniert: Eine kurze, klare Offenbarung wird nicht durch Vermutungen zu einer scheinbar vollständigen Biografie erweitert.',
    coursePath: 'Du untersuchst die ausdrücklichen Bezeichnungen „wahrhaftig“ und „Prophet“, den genannten hohen Rang und seine Einordnung unter den Geduldigen. Anschließend wird klar getrennt, welche verbreiteten Lebensdetails der Quran selbst nicht erzählt.',
    boundary: 'Ort, Zeit, Beruf und eine ausführliche Lebensgeschichte werden im Quran nicht genannt und deshalb hier nicht als sichere Tatsachen dargestellt.',
    learningGoals: ['Die sicheren Quran-Aussagen zu Idris wiedergeben', 'Wahrhaftigkeit und Geduld als genannte Eigenschaften erkennen', 'Belegtes Wissen von späteren Erzählungen trennen'],
  },
  nuh: {
    orientation: 'Nuh wird als beharrlicher Warner gezeigt, der sein Volk über lange Zeit und auf unterschiedliche Weise zur Anbetung Allahs ruft. Die Erzählung verbindet Einladung, Ablehnung, göttlichen Auftrag, Rettung und persönliche Verantwortung.',
    coursePath: 'Der Kurs folgt Nuhs öffentlichem und verborgenem Aufruf, dem Bau der Arche unter Allahs Aufsicht, der Flut und der schmerzhaften Begegnung mit der Verantwortung seines Sohnes. Er endet mit Frieden, Segen und einer bleibenden Warnung.',
    boundary: 'Die Kursdarstellung bleibt bei den Quran-Passagen und ergänzt weder technische Details der Arche noch eine moderne Datierung der Flut.',
    learningGoals: ['Beharrlichkeit ohne Erfolgsgarantie verstehen', 'Rettung und persönliche Verantwortung unterscheiden', 'Nuhs Annahme göttlicher Korrektur einordnen'],
  },
  hud: {
    orientation: 'Hud wird zum mächtigen Volk ʿAd gesandt. Seine Botschaft stellt der sichtbaren Stärke des Volkes die Abhängigkeit von Allah, Dankbarkeit und moralische Verantwortung gegenüber.',
    coursePath: 'Du lernst Huds Aufruf zum Tawhid, die Reaktion der führenden Menschen und sein Vertrauen auf Allah kennen. Danach wird erklärt, warum materielle Macht das Volk nicht vor den Folgen seiner hartnäckigen Ablehnung schützte.',
    boundary: 'Archäologische Zuordnungen, genaue Orte und Datierungen werden nicht als Quran-Aussagen ausgegeben.',
    learningGoals: ['Huds zentrale Botschaft benennen', 'Stärke als Gabe und Verantwortung einordnen', 'Vertrauen und klare Warnung zusammendenken'],
  },
  salih: {
    orientation: 'Salihs Geschichte richtet den Blick auf Thamud, ein deutliches Zeichen und eine ausdrücklich gesetzte Grenze. Das Zeichen der Kamelstute verlangt nicht bloß Staunen, sondern verantwortliches Handeln.',
    coursePath: 'Der Lernweg beginnt mit Salihs Aufruf zu Tawhid und Umkehr. Danach werden die Kamelstute, die konkrete Schutzanweisung, die Übertretung des Volkes und die angekündigte Folge in ihrer Reihenfolge behandelt.',
    boundary: 'Der Kurs verzichtet auf Namen, Zusatzgeschichten und Ortsbestimmungen, die in den zitierten Versen nicht genannt werden.',
    learningGoals: ['Zeichen und Verantwortung verbinden', 'Hochmut als Hindernis für Umkehr erkennen', 'Die Quran-Reihenfolge der Ereignisse wiedergeben'],
  },
  ibrahim: {
    orientation: 'Ibrahims Geschichte gehört zu den umfangreichsten prophetischen Erzählungen im Quran. Sie verbindet begründeten Tawhid, Widerstand gegen Götzendienst, persönliche Prüfungen, Familie, die Kaaba und Bittgebete für kommende Generationen.',
    coursePath: 'Du folgst Ibrahims Argumenten gegen die Verehrung geschaffener Dinge, seiner Konfrontation mit den Götzen, den Prüfungen seiner Verantwortung, dem Bau der Kaaba mit Ismail und der schweren Familienprüfung in Sure As-Saffat.',
    boundary: 'Wo der Quran eine Person nicht ausdrücklich benennt – etwa den Sohn in der Opfererzählung –, behandelt der Kurs eine spätere Zuordnung nicht als wörtliche Quran-Aussage.',
    learningGoals: ['Ibrahims Argumentation für Tawhid erklären', 'Prüfung, Verantwortung und Dua verbinden', 'Explizite Quran-Aussagen von späterer Zuordnung trennen'],
  },
  lut: {
    orientation: 'Luts Geschichte behandelt eine Gemeinschaft, die offen Grenzen überschreitet und seine Warnung zurückweist. Gleichzeitig zeigt sie seinen Schutz der Gäste, die Rettung der Gläubigen und die persönliche Verantwortung jedes Menschen.',
    coursePath: 'Der Kurs beginnt mit Luts moralischer Warnung, folgt der zugespitzten Begegnung mit den Gästen und endet mit Rettung und Gericht. Die Rolle seiner Frau macht deutlich, dass Nähe zu einem Propheten den eigenen Glauben nicht ersetzt.',
    boundary: 'Die Darstellung bleibt sachlich und benutzt die Erzählung weder für Beschimpfung noch für zusätzliche, nicht belegte Einzelheiten.',
    learningGoals: ['Warnung und Menschenwürde zusammenhalten', 'Gastschutz und göttliche Anweisung einordnen', 'Persönliche Verantwortung trotz familiärer Nähe verstehen'],
  },
  ismail: {
    orientation: 'Ismail wird mit dem Bau der Kaaba, Verlässlichkeit, Prophetentum sowie der Sorge um Gebet und Zakat verbunden. Der Quran zeichnet damit ein Bild praktischer Treue statt einer langen Einzelbiografie.',
    coursePath: 'Du lernst seine gemeinsame Arbeit mit Ibrahim, die Bitte um Annahme, seine Verlässlichkeit und seine Verantwortung gegenüber der Familie kennen. Ein eigenes Kapitel erklärt außerdem ehrlich die Grenze der Namensnennung in der Opfererzählung.',
    boundary: 'Der Kurs sagt nicht, der Quran nenne Ismail ausdrücklich als Sohn der Opfererzählung, weil der Name in dieser Passage nicht steht.',
    learningGoals: ['Ismails klar belegte Eigenschaften nennen', 'Arbeit, Dua und Familienverantwortung verbinden', 'Text und verbreitete Einordnung unterscheiden'],
  },
  ishaq: {
    orientation: 'Ishaq erscheint im Quran als überraschende frohe Botschaft, als Prophet und als Teil einer rechtgeleiteten Familie. Die wenigen Passagen betonen Allahs Macht und die Fortsetzung der Offenbarung.',
    coursePath: 'Der Kurs folgt der Ankündigung seiner Geburt im hohen Alter der Eltern, seiner ausdrücklichen Bezeichnung als Prophet und seiner Einordnung in die Reihe rechtgeleiteter Nachkommen.',
    boundary: 'Eine ausführliche Kindheit, ein eigener Wirkungsort oder nicht genannte Lebensereignisse werden nicht ergänzt.',
    learningGoals: ['Die frohe Botschaft von Ishaq erklären', 'Prophetentum und persönliche Verantwortung verbinden', 'Die Grenzen der kurzen Quran-Biografie erkennen'],
  },
  yaqub: {
    orientation: 'Yaqubs Geschichte verbindet die Weitergabe des Tawhid mit tiefer familiärer Trauer, schöner Geduld und beharrlicher Hoffnung. Seine Gefühle werden nicht verborgen und dennoch nicht von Hoffnungslosigkeit bestimmt.',
    coursePath: 'Du beginnst bei Yaqubs Sorge um den Glauben seiner Kinder. Danach folgen die Trennung von Yusuf, sein Schmerz, seine Weigerung zu verzweifeln und schließlich die Wiederbegegnung und Vergebung innerhalb der Familie.',
    boundary: 'Der Kurs übernimmt nur Familienangaben und Ereignisse, die in den zitierten Quran-Passagen tatsächlich vorkommen.',
    learningGoals: ['Trauer und Geduld richtig unterscheiden', 'Hoffnung als aktive Glaubenshaltung verstehen', 'Religiöse Verantwortung zwischen Generationen einordnen'],
  },
  yusuf: {
    orientation: 'Sure Yusuf erzählt eine zusammenhängende Geschichte von Trennung, Versuchung, falscher Beschuldigung, Gefängnis, Verantwortung und Versöhnung. Der Quran selbst bezeichnet sie als eine besonders schöne Erzählung.',
    coursePath: 'Der Kurs folgt Yusufs Traum, dem Handeln seiner Brüder, seinem Leben im Haus des ägyptischen Würdenträgers, seiner Standhaftigkeit, den Jahren im Gefängnis, seiner staatlichen Verantwortung und der Wiedervereinigung mit der Familie.',
    boundary: 'Spätere Namen und Ausschmückungen werden nicht eingefügt, wenn die Sure sie nicht selbst nennt.',
    learningGoals: ['Die großen Wendepunkte der Sure ordnen', 'Integrität unter Versuchung und Ungerechtigkeit verstehen', 'Verantwortung und Vergebung statt Rache erkennen'],
  },
  ayyub: {
    orientation: 'Ayyub wird in schwerer Bedrängnis gezeigt, ohne dass der Quran die Krankheit oder ihre Dauer ausführlich beschreibt. Im Mittelpunkt stehen sein ehrliches Dua, Allahs Antwort und seine geduldige Haltung.',
    coursePath: 'Du lernst die zwei wichtigsten Quran-Passagen gemeinsam: den knappen Hilferuf in Al-Anbiya und die ausführlichere Antwort in Sure Sad. Dabei werden Bedrängnis, Hilfe, Wiederherstellung und Verantwortung unterschieden.',
    boundary: 'Diagnosen, Zeitangaben und dramatische Zusatzgeschichten werden nicht als Quran-Fakten erzählt.',
    learningGoals: ['Geduld und Hilferuf zusammen verstehen', 'Die Grenzen des Quran-Berichts benennen', 'Allahs Antwort als Barmherzigkeit einordnen'],
  },
  shuayb: {
    orientation: 'Shuʿaybs Botschaft verbindet die Anbetung Allahs unmittelbar mit wirtschaftlicher Ehrlichkeit. Volles Maß, richtiges Gewicht und das Unterlassen von Betrug erscheinen als Glaubensfragen.',
    coursePath: 'Der Kurs behandelt seinen Aufruf an Madyan, die konkreten Forderungen nach fairem Handel, die Einwände der führenden Menschen, seine Antwort und das Ende hartnäckiger Ablehnung.',
    boundary: 'Eine Gleichsetzung mit außerquranischen Personen oder zusätzliche biografische Angaben werden nicht als sicher behauptet.',
    learningGoals: ['Tawhid und wirtschaftliche Gerechtigkeit verbinden', 'Shuʿaybs Reformverständnis erklären', 'Ablehnung und prophetische Antwort unterscheiden'],
  },
  musa: {
    orientation: 'Musa ist im Quran besonders häufig und in vielen Zusammenhängen erwähnt. Seine Geschichte umfasst frühe Gefahr, Flucht, Berufung, die Begegnung mit Pharao, den Auszug, die Offenbarung der Schrift und schwierige Führungserfahrungen.',
    coursePath: 'Der Lernweg führt von Musas Kindheit und seinem Aufbruch nach Madyan zur Berufung am Feuer. Danach folgen die Zeichen vor Pharao, der Auszug, das Meer, die Begegnung am Berg und die Prüfungen mit seinem Volk.',
    boundary: 'Der Kurs verdichtet mehrere Suren, kennzeichnet seine Stellen genau und vermeidet außerquranische Namen oder Chronologien als sichere Tatsachen.',
    learningGoals: ['Musas wichtigste Lebensabschnitte ordnen', 'Angst, Auftrag und Vertrauen zusammendenken', 'Befreiung und anschließende Führungsverantwortung unterscheiden'],
  },
  harun: {
    orientation: 'Harun wird als Prophet und Partner seines Bruders Musa im Auftrag an Pharao gezeigt. Seine Geschichte macht Zusammenarbeit, sprachliche Unterstützung und Verantwortung in einer Krise sichtbar.',
    coursePath: 'Du lernst Musas Bitte um Harun als Helfer, die gemeinsame Sendung, Haruns Rolle während Musas Abwesenheit und das schwierige Gespräch nach der Verehrung des Kalbes kennen.',
    boundary: 'Der Kurs ergänzt keine eigenständige Harun-Biografie, wo der Quran ihn im Zusammenhang mit Musa behandelt.',
    learningGoals: ['Haruns prophetische Rolle benennen', 'Gemeinsame Verantwortung als Stärke verstehen', 'Sein Verhalten in der Kalb-Krise einordnen'],
  },
  'dhul-kifl': {
    orientation: 'Dhul-Kifl wird im Quran nur zweimal kurz und positiv erwähnt. Er steht unter den Geduldigen und Ausgezeichneten; eine zusammenhängende Lebensgeschichte wird nicht erzählt.',
    coursePath: 'Der Kurs liest beide Nennungen sorgfältig, erklärt die sicher genannten Eigenschaften und zeigt anschließend, warum die religiöse Einordnung Dhul-Kifls in der Auslegung nicht völlig einheitlich ist.',
    boundary: 'Sein Prophetentum wird nicht als unumstrittene Quran-Aussage formuliert; der Kurs benennt ausdrücklich die unterschiedliche Gelehrteneinordnung.',
    learningGoals: ['Beide Quran-Nennungen kennen', 'Geduld und Rechtschaffenheit als sichere Aussagen festhalten', 'Meinungsunterschiede transparent benennen'],
  },
  dawud: {
    orientation: 'Dawud wird mit Herrschaft, Weisheit, dem Zabur, gerechtem Urteil, intensivem Lobpreis und handwerklicher Gabe verbunden. Der Quran zeigt Macht nicht als Besitz ohne Rechenschaft.',
    coursePath: 'Du folgst Dawuds Sieg und Verantwortung, dem Empfang des Zabur, den besonderen Gaben beim Lobpreis und der Verarbeitung von Eisen sowie der Rechtssache, in der Urteil, Prüfung und Umkehr zusammenkommen.',
    boundary: 'Der Kurs trennt den Quran-Bericht von späteren Erzählungen und vermeidet Deutungen, die der Text nicht ausdrücklich festlegt.',
    learningGoals: ['Zabur, Herrschaft und Weisheit zuordnen', 'Gaben als Auftrag zum guten Handeln verstehen', 'Gerechtes Urteil und Umkehr verbinden'],
  },
  sulayman: {
    orientation: 'Sulayman erhält Wissen, ein außergewöhnliches Königreich und besondere Mittel. Seine Erzählungen betonen dabei immer wieder Dankbarkeit, Prüfung, gerechte Einladung und die Abhängigkeit aller Macht von Allah.',
    coursePath: 'Der Kurs behandelt sein Erbe von Dawud, das Tal der Ameisen, den Bericht des Wiedehopfs, die Königin von Saba, Wind und Dschinn sowie seinen Tod als Beleg für die Grenze verborgenen Wissens.',
    boundary: 'Märchenhafte Ausschmückungen und nicht belegte Details werden von den klaren Quran-Szenen getrennt.',
    learningGoals: ['Wissen und Dankbarkeit verbinden', 'Prüfung einer Nachricht vor dem Handeln erkennen', 'Die Grenze menschlicher und übernatürlicher Macht verstehen'],
  },
  ilyas: {
    orientation: 'Ilyas wird als Gesandter gezeigt, der sein Volk von der Verehrung Baals zur Anbetung Allahs ruft. Die Passage ist kurz, aber in Botschaft und Bewertung eindeutig.',
    coursePath: 'Du untersuchst seinen Gesandtenstatus, seine Fragen an das Volk, die klare Benennung Allahs als Herrn, die Ablehnung vieler Menschen und das bewahrte gute Andenken.',
    boundary: 'Orte, Zeiten, Verwandtschaften und spätere Ereignisse werden nicht ergänzt, weil die Quran-Passage sie nicht nennt.',
    learningGoals: ['Ilyas’ Tawhid-Aufruf wiedergeben', 'Seine ausdrückliche Einordnung als Gesandter kennen', 'Kurze Quellen ohne Ausschmückung lernen'],
  },
  'al-yasa': {
    orientation: 'Al-Yasaʿ wird im Quran zweimal namentlich und lobend genannt. Beide Stellen ordnen ihn in eine Reihe rechtgeleiteter und ausgezeichneter Menschen ein, erzählen jedoch keine einzelnen Lebensereignisse.',
    coursePath: 'Der Kurs liest die Nennung in Al-Anam und die Erinnerung in Sure Sad. Danach wird erklärt, was aus diesen Versen sicher gesagt werden kann und warum eine ausführliche Ereignisbiografie hier nicht möglich ist.',
    boundary: 'Herkunft, Wirkungsort und konkrete Taten bleiben offen und werden nicht aus späteren Traditionen als Quran-Fakten übernommen.',
    learningGoals: ['Beide Nennungen zuordnen', 'Rechtleitung und Auszeichnung als Kern festhalten', 'Die Grenze fehlender Ereignisberichte respektieren'],
  },
  yunus: {
    orientation: 'Yunus’ Geschichte verbindet einen voreiligen Aufbruch, tiefe Bedrängnis, ein prägnantes Dua, Rettung und einen erneuerten Auftrag. Sein Volk wird zudem als besondere Gemeinschaft erwähnt, deren rechtzeitiger Glaube nützte.',
    coursePath: 'Du folgst dem Schiff, dem Losentscheid und dem großen Fisch, lernst das Dua in den Finsternissen, die Rettung und Versorgung an Land sowie die spätere Sendung und die Reaktion seines Volkes.',
    boundary: 'Der Kurs verwendet die Quran-Beschreibung und ergänzt weder die Art des Fisches noch eine genaue Reisedauer.',
    learningGoals: ['Yunus’ Dua inhaltlich verstehen', 'Fehler, Korrektur und neuen Auftrag verbinden', 'Die Besonderheit der Umkehr seines Volkes erklären'],
  },
  zakariyya: {
    orientation: 'Zakariyya wird als fürsorglicher Betreuer Maryams und als demütig Bittender gezeigt. Sein hohes Alter beendet seine Hoffnung nicht; sein Dua richtet sich auf rechtschaffene Nachkommenschaft und Verantwortung.',
    coursePath: 'Der Kurs beginnt bei Maryams Versorgung und Zakariyyas daraus gestärktem Dua. Danach folgen sein leiser Hilferuf, die frohe Botschaft von Yahya und das Zeichen des zeitweise eingeschränkten Sprechens.',
    boundary: 'Der Kurs bleibt bei den Quran-Angaben zu Familie, Alter und Zeichen und fügt keine spätere Biografie hinzu.',
    learningGoals: ['Zakariyyas Dua und Absicht erklären', 'Hoffnung trotz menschlicher Unwahrscheinlichkeit verstehen', 'Erhörung und weiteres Gedenken verbinden'],
  },
  yahya: {
    orientation: 'Yahya wird schon vor seiner Geburt namentlich angekündigt. Der Quran beschreibt ungewöhnlich konkret seine frühe Weisheit, Reinheit, Gottesbewusstsein, Güte zu den Eltern und Freiheit von Überheblichkeit.',
    coursePath: 'Du lernst die Ankündigung an Zakariyya, die Gabe der Weisheit als Kind, seine charakterlichen Eigenschaften und seine ausdrückliche Einordnung als Prophet kennen.',
    boundary: 'Berichte über sein späteres Leben und seinen Tod werden nicht als Quran-Fakten erzählt, weil die zitierten Verse sie nicht ausführen.',
    learningGoals: ['Yahyas genannte Eigenschaften vollständig ordnen', 'Wissen und Charakter zusammendenken', 'Quran-Aussagen von späterer Biografie trennen'],
  },
  isa: {
    orientation: 'Isa wird im Quran als Messias, Wort von Allah, Gesandter und Sohn Maryams geehrt. Seine besondere Geburt, das Injil, seine Zeichen durch Allahs Erlaubnis und sein Aufruf zur Anbetung Allahs stehen im Mittelpunkt.',
    coursePath: 'Der Kurs folgt der Ankündigung und Geburt, den Zeichen und der Botschaft, den Jüngern, der Quran-Aussage über die Kreuzigung und der klaren Zurückweisung seiner Vergöttlichung. Jede besondere Fähigkeit wird ausdrücklich Allahs Erlaubnis zugeschrieben.',
    boundary: 'Der Kurs formuliert christologische Unterschiede sachlich aus Quran-Perspektive und ergänzt keine spekulative Endzeit-Chronologie.',
    learningGoals: ['Isas Stellung im Quran präzise wiedergeben', 'Zeichen und Allahs Erlaubnis zusammen nennen', 'Ehrung des Gesandten von seiner Anbetung unterscheiden'],
  },
  muhammad: {
    orientation: 'Muhammad ﷺ wird im Quran als Gesandter Allahs, Empfänger der Offenbarung, Barmherzigkeit, menschliches Vorbild und Siegel der Propheten beschrieben. Der Kurs richtet sich auf Quran-Aussagen über Auftrag und Haltung, nicht auf eine vollständige Sira.',
    coursePath: 'Du beginnst mit dem Auftrag zu lesen, gehst über die universale Sendung, Barmherzigkeit und Vorbildfunktion zur Höhle während der Auswanderung und endest bei der ausdrücklichen Bezeichnung als Siegel der Propheten.',
    boundary: 'Jahreszahlen und ausführliche Sira-Ereignisse benötigen zusätzliche, eigens geprüfte Hadith- und Geschichtsquellen und werden hier nicht als Quran-Inhalt ausgegeben.',
    learningGoals: ['Offenbarungsauftrag und Wissen verbinden', 'Universale Sendung und Barmherzigkeit einordnen', 'Die Bedeutung von Quran 33:40 korrekt wiedergeben'],
  },
};
