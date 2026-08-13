/**
 * Prophetenübersicht.
 *
 * Übernommen aus dem Altbestand `memetreza34-ux/nur-islam`, wo die Einträge
 * vollständig als Daten vorlagen. Der bisherige Bereich zeigte davon nur sechs
 * Stichpunkte — Namen ohne jeden Inhalt.
 *
 * Die fachliche Prüfung steht wie bei allen religiösen Inhalten aus.
 */

export type ProphetEntry = {
  id: string;
  name: string;
  commonName?: string;
  role: string;
  intro: string;
  description: string;
  keyPoints: string[];
  lessons: string[];
};

export const PROPHETS: readonly ProphetEntry[] = [
  {
    id: 'adam',
    name: 'Adam',
    role: 'Er legte den Grundstein für die Menschheit und den Glauben an den einen Gott.',
    intro: 'Der erste Mensch und der erste Prophet Allahs.',
    description: 'Adam (as) wurde von Allah aus Erde erschaffen und ihm wurde das Wissen über alle Dinge gegeben.',
    keyPoints: ['Vater der Menschheit', 'Erschaffung aus Erde', 'Reue und Vergebung nach dem Verlassen des Paradieses'],
    lessons: ['Die Wichtigkeit der aufrichtigen Reue', 'Dass der Mensch Wissen von Allah erhält'],
  },
  {
    id: 'nuh',
    name: 'Nuh',
    commonName: 'Noah',
    role: 'Er rettete die Gläubigen und bewahrte den Glauben für die kommende Menschheit.',
    intro: 'Einer der standhaftesten Gesandten, bekannt für die Arche.',
    description: 'Nuh (as) rief sein Volk über 950 Jahre lang zum Monotheismus auf, trotz großen Widerstands.',
    keyPoints: ['Langjährige Geduld in der Da\'wah', 'Bau der Arche auf Allahs Befehl', 'Die große Flut als Reinigung'],
    lessons: ['Unerschütterliche Geduld und Vertrauen auf Allah', 'Dass Erfolg bei Allah liegt, nicht in der Anzahl der Anhänger'],
  },
  {
    id: 'ibrahim',
    name: 'Ibrahim',
    commonName: 'Abraham',
    role: 'Er ist das Vorbild des reinen Monotheismus (Hanif) und Begründer wichtiger Rituale.',
    intro: 'Der Freund Allahs (Khalilullah) und Stammvater vieler Propheten.',
    description: 'Ibrahim (as) ist eine zentrale Figur im Islam, bekannt für seine absolute Hingabe und Prüfung.',
    keyPoints: ['Wiederaufbau der Kaaba mit seinem Sohn Ismail', 'Bereitschaft zum größten Opfer für Allah', 'Vater der Propheten'],
    lessons: ['Vollkommene Ergebenheit gegenüber Allahs Willen', 'Die Suche nach der Wahrheit durch Vernunft und Herz'],
  },
  {
    id: 'musa',
    name: 'Musa',
    commonName: 'Moses',
    role: 'Ein starker Führer und Gesetzgeber, dessen Geschichte oft im Koran erwähnt wird.',
    intro: 'Der Prophet, der direkt mit Allah sprach (Kalimullah).',
    description: 'Musa (as) befreite die Kinder Israels aus der Knechtschaft des Pharaos und erhielt die Thora.',
    keyPoints: ['Konfrontation mit dem Pharao', 'Teilung des Meeres durch Allahs Erlaubnis', 'Erhalt der Zehn Gebote und der Thora'],
    lessons: ['Mut gegenüber Unterdrückung', 'Vertrauen auf Allahs Hilfe in ausweglosen Situationen'],
  },
  {
    id: 'isa',
    name: 'Isa',
    commonName: 'Jesus',
    role: 'Ein Vorbote des letzten Propheten und ein Zeichen für Allahs Schöpfungskraft.',
    intro: 'Ein bedeutender Prophet und der Messias, geboren von der Jungfrau Maria.',
    description: 'Isa (as) vollbrachte durch Allahs Erlaubnis viele Wunder und verkündete das Evangelium (Injil).',
    keyPoints: ['Wunderbare Geburt ohne Vater', 'Heilung von Kranken und Totenerweckung durch Allahs Erlaubnis', 'Verkündung der Barmherzigkeit und Liebe'],
    lessons: ['Bescheidenheit und spirituelle Hingabe', 'Dass Wunder nur durch Allahs Macht geschehen'],
  },
  {
    id: 'yusuf',
    name: 'Yusuf',
    commonName: 'Josef',
    role: 'Ein leuchtendes Beispiel für Geduld, Keuschheit und Vergebung.',
    intro: 'Ein Prophet, der für seine außergewöhnliche Schönheit und seine Fähigkeit, Träume zu deuten, bekannt war.',
    description: 'Yusuf (as) wurde von seinen eifersüchtigen Brüdern in einen Brunnen geworfen, als Sklave nach Ägypten verkauft, unschuldig ins Gefängnis geworfen und stieg schließlich zu einem der mächtigsten Männer Ägyptens auf.',
    keyPoints: ['Verrat durch seine Brüder', 'Geduld im Gefängnis', 'Traumdeutung für den König von Ägypten', 'Vergebung gegenüber seinen Brüdern'],
    lessons: ['Geduld (Sabr) in Zeiten der Not', 'Vertrauen auf Allahs Plan', 'Vergebung und Barmherzigkeit gegenüber denen, die einem Unrecht getan haben'],
  },
  {
    id: 'yunus',
    name: 'Yunus',
    commonName: 'Jonas',
    role: 'Ein Beweis dafür, dass Allah diejenigen rettet, die Ihn in der Not anrufen.',
    intro: 'Der Prophet, der vom Wal verschluckt wurde.',
    description: 'Yunus (as) verließ sein Volk in Ninive aus Frustration, bevor Allah es ihm erlaubte. Er wurde von einem großen Fisch verschluckt und rief in der Dunkelheit zu Allah.',
    keyPoints: ['Flucht vor seiner Mission', 'Verschluckt vom Wal', 'Aufrichtige Reue im Bauch des Wals', 'Rettung und Rückkehr zu seinem Volk, das schließlich glaubte'],
    lessons: ['Man kann nicht vor Allahs Befehl fliehen', 'Die Macht der aufrichtigen Reue (Dua von Yunus)', 'Allahs unermessliche Barmherzigkeit'],
  },
  {
    id: 'ayyub',
    name: 'Ayyub',
    commonName: 'Hiob',
    role: 'Ein Vorbild für alle, die schwere Zeiten durchmachen.',
    intro: 'Das ultimative Symbol für Geduld im Angesicht extremen Leids.',
    description: 'Ayyub (as) war ein wohlhabender Prophet, der alles verlor: seinen Reichtum, seine Kinder und seine Gesundheit. Dennoch blieb er Allah gegenüber dankbar und geduldig.',
    keyPoints: ['Verlust von Familie und Reichtum', 'Schwere, langanhaltende Krankheit', 'Unerschütterliche Geduld und Dankbarkeit', 'Wiederherstellung durch Allahs Gnade'],
    lessons: ['Wahre Geduld (Sabr Jamil)', 'Krankheit und Verlust sind Prüfungen, keine Strafen', 'Allah belohnt die Geduldigen reichlich'],
  },
  {
    id: 'dawud',
    name: 'Dawud',
    commonName: 'David',
    role: 'Ein Symbol für gerechte Herrschaft und tiefe Hingabe an Allah.',
    intro: 'Ein Prophet und König, dem die Psalmen (Zabur) offenbart wurden.',
    description: 'Dawud (as) besiegte den Riesen Jalut (Goliath) als junger Mann und wurde später ein gerechter König. Allah gab ihm eine wunderschöne Stimme und machte Eisen in seinen Händen weich.',
    keyPoints: ['Sieg über Jalut (Goliath)', 'Offenbarung der Psalmen (Zabur)', 'Wunderschöne Stimme beim Lobpreis Allahs', 'Gerechter Herrscher und Richter'],
    lessons: ['Mut und Vertrauen auf Allah (Sieg über Jalut)', 'Dankbarkeit durch Anbetung (er fastete jeden zweiten Tag)', 'Gerechtigkeit in der Führung'],
  },
  {
    id: 'sulayman',
    name: 'Sulayman',
    commonName: 'Salomo',
    role: 'Ein Beweis, dass weltliche Macht und tiefe Frömmigkeit vereint sein können.',
    intro: 'Ein Prophet und König mit beispielloser Macht und Weisheit.',
    description: 'Sulayman (as), der Sohn von Dawud, erhielt von Allah ein Königreich, wie es niemandem nach ihm gegeben wurde. Er konnte die Sprache der Tiere verstehen und befehligte die Dschinn und den Wind.',
    keyPoints: ['Beispielloses Königreich und Reichtum', 'Kontrolle über Dschinn, Wind und Tiere', 'Bau des Tempels (Masjid al-Aqsa)', 'Die Geschichte mit der Königin von Saba (Bilqis)'],
    lessons: ['Reichtum und Macht sind Prüfungen von Allah', 'Dankbarkeit bewahrt vor Arroganz', 'Weisheit ist wertvoller als materieller Besitz'],
  },
  {
    id: 'muhammad',
    name: 'Muhammad',
    role: 'Der letzte Gesandte, dessen Botschaft bis zum Jüngsten Tag gültig bleibt.',
    intro: 'Das Siegel der Propheten und eine Barmherzigkeit für die Welten.',
    description: 'Muhammad (saws) erhielt die letzte Offenbarung, den Koran, und vervollständigte die Religion.',
    keyPoints: ['Erhalt des Korans über 23 Jahre', 'Vorbild in Charakter und Lebensweise (Sunnah)', 'Vereinigung der Stämme unter dem Monotheismus'],
    lessons: ['Güte, Ehrlichkeit und Standhaftigkeit', 'Dass der Islam eine Botschaft für die gesamte Menschheit ist'],
  },
];
