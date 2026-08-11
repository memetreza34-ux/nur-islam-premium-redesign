/**
 * Sunnah im Alltag sowie Fehler und Reue.
 *
 * Übernommen aus dem Altbestand `memetreza34-ux/nur-islam`. Beide Bereiche
 * zeigten bisher je sechs Stichpunkte.
 *
 * Jeder Eintrag führt seinen Beleg mit — das Feld hieß im Altbestand `proof`
 * und nennt Quran-Stelle oder Sammlung. Die fachliche Prüfung steht aus.
 */

export type PracticeItem = {
  title: string;
  description: string;
  /** Beleg, wie im Altbestand hinterlegt: Quranstelle oder Hadith-Sammlung. */
  proof: string;
};

export type PracticeGroup = {
  id: string;
  category: string;
  items: PracticeItem[];
};

export const SUNNAH_GROUPS: readonly PracticeGroup[] = [
  {
    id: 'daily',
    category: 'Tägliche Sunnah',
    items: [
      {
        title: 'Schlafen und Aufwachen',
        description: 'Wudu vor dem Schlafen machen, auf der rechten Seite schlafen, Ayat al-Kursi rezitieren und beim Aufwachen Allah danken.',
        proof: 'Der Prophet ﷺ sagte: \'Wenn du zu Bett gehst, vollziehe die Gebetswaschung...\' (Bukhari)',
      },
      {
        title: 'Essen und Trinken',
        description: 'Bismillah sagen, mit der rechten Hand essen, im Sitzen trinken und nach dem Essen Alhamdulillah sagen.',
        proof: 'Der Prophet ﷺ sagte: \'Nenne den Namen Allahs, iss mit deiner Rechten und iss von dem, was vor dir ist.\' (Bukhari)',
      },
      {
        title: 'Haus betreten und verlassen',
        description: 'Mit dem rechten Fuß eintreten, Bismillah sagen und den Friedensgruß (Salam) sprechen. Beim Verlassen Bismillahi tawakkaltu \'ala Allah sagen.',
        proof: 'Der Prophet ﷺ sagte: \'Wenn ein Mann sein Haus betritt und Allahs gedenkt... sagt der Schaitan: Hier gibt es keine Übernachtung für euch.\' (Muslim)',
      },
    ],
  },
  {
    id: 'character',
    category: 'Charakter & Verhalten',
    items: [
      {
        title: 'Lächeln',
        description: 'Einem anderen Muslim mit einem Lächeln zu begegnen, ist eine Form der Sadaqah (Spende).',
        proof: 'Der Prophet ﷺ sagte: \'Dein Lächeln im Gesicht deines Bruders ist für dich eine Sadaqah.\' (Tirmidhi)',
      },
      {
        title: 'Gutes Sprechen oder Schweigen',
        description: 'Nur Worte sprechen, die nützlich und gut sind, andernfalls ist es besser zu schweigen.',
        proof: 'Der Prophet ﷺ sagte: \'Wer an Allah und den Jüngsten Tag glaubt, soll Gutes sprechen oder schweigen.\' (Bukhari)',
      },
      {
        title: 'Verwendung des Miswak',
        description: 'Die Zähne mit dem Miswak (Zahnputzholz) zu reinigen, besonders vor dem Gebet und beim Wudu.',
        proof: 'Der Prophet ﷺ sagte: \'Wenn es nicht zu schwer für meine Ummah wäre, hätte ich ihnen befohlen, den Miswak vor jedem Gebet zu benutzen.\' (Bukhari)',
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
    category: 'Die Reue (Tawbah)',
    items: [
      {
        title: 'Die Tür der Reue ist offen',
        description: 'Egal wie groß die Sünde ist, Allah vergibt alle Sünden, wenn man aufrichtig bereut, die Sünde aufgibt und sich vornimmt, sie nicht zu wiederholen.',
        proof: 'Koran (39:53): \'Sprich: O Meine Diener, die ihr euch gegen eure eigenen Seelen vergangen habt, verzweifelt nicht an Allahs Barmherzigkeit; wahrlich, Allah vergibt alle Sünden...\'',
      },
    ],
  },
];
