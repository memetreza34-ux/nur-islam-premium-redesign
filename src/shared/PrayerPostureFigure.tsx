/**
 * Die Gebetshaltungen als Zeichnung — eine pro Schritt.
 *
 * Der Kurs benannte die Haltung bisher nur als Wort („Niederwerfung“,
 * „Aufgerichtet“). Wer das Gebet neu lernt, kann daraus nicht ableiten, wie
 * der Körper dabei steht: wo die Hände liegen, wie tief die Verbeugung geht,
 * was am Boden aufliegt. Das Bild trägt genau diese Information.
 *
 * Gezeichnet statt fotografiert oder generiert, aus drei Gründen: eine
 * Strichfigur im Profil zeigt die Haltung eindeutiger als ein Foto, in dem
 * Kleidung und Perspektive die Linie verdecken; alle acht Haltungen bleiben
 * derselbe Körper in derselben Größe, sodass der Unterschied zwischen zwei
 * Schritten wirklich der Unterschied der Haltung ist; und es sind wenige
 * Kilobyte statt acht Bilddateien, was für das Bundle-Budget dieser App
 * (`npm run budget:check`) den Ausschlag gibt.
 *
 * Blickrichtung ist überall dieselbe (nach rechts), damit die Figuren beim
 * Durchblättern nicht springen. Die Linie nimmt `currentColor` an.
 */
import type { CSSProperties, ReactElement } from 'react';
import type { PrayerPosture } from '../data/prayerRakatData';

/** Was die Figur zeigt — als Textfassung für Screenreader. */
const POSTURE_ALT: Record<PrayerPosture, string> = {
  takbir: 'Stehend, die Hände auf Ohrhöhe erhoben, Handflächen nach vorn.',
  qiyam: 'Stehend, die Hände vor dem Oberkörper zusammengelegt.',
  ruku: 'Verbeugt, der Rücken waagerecht, die Hände auf den Knien.',
  standing: 'Wieder aufgerichtet, die Arme locker an der Seite.',
  sujud: 'Niedergeworfen: Stirn, Hände, Knie und Zehen berühren den Boden.',
  sitting: 'Aufrecht auf den Unterschenkeln sitzend, die Hände auf den Oberschenkeln.',
  rising: 'Im Aufstehen, aus dem Sitzen zur nächsten Rakʿah.',
  taslim: 'Sitzend, den Kopf zur Seite gedreht.',
};

/** Ein liegender Strich als Boden — er macht erst lesbar, was aufliegt. */
const GROUND: ReactElement = <path d="M20 116h100" strokeWidth={2.5} opacity={0.32} />;

/** Zwei Beine im Profil, leicht versetzt: sonst steht die Figur auf einem Strich. */
const STANDING_LEGS: ReactElement = <path d="M64 74l-3 21-2 21M65 74l4 21 1 21" />;

const FIGURES: Record<PrayerPosture, ReactElement> = {
  // Hände offen auf Ohrhöhe — die Haltung, die das Gebet eröffnet.
  takbir: (
    <g>
      <circle cx={66} cy={22} r={10} />
      <path d="M65 32l-1 42" />
      {STANDING_LEGS}
      <path d="M65 40c10 0 13-8 10-16" />
      {GROUND}
    </g>
  ),
  // Hände vor dem Oberkörper zusammengelegt.
  qiyam: (
    <g>
      <circle cx={66} cy={22} r={10} />
      <path d="M65 32l-1 42" />
      {STANDING_LEGS}
      <path d="M65 41c10 5 12 15 3 20" />
      {GROUND}
    </g>
  ),
  // Der waagerechte Rücken ist das Merkmal: Oberkörper flach, Arme senkrecht.
  ruku: (
    <g>
      <circle cx={96} cy={68} r={10} />
      <path d="M48 66h38" />
      <path d="M48 66l-2 26-2 24M49 66l4 26 2 24" />
      <path d="M80 70v24" />
      {GROUND}
    </g>
  ),
  // Wieder aufgerichtet, die Arme hängen locker.
  standing: (
    <g>
      <circle cx={66} cy={22} r={10} />
      <path d="M65 32l-1 42" />
      {STANDING_LEGS}
      <path d="M65 41c7 11 6 22 2 31" />
      {GROUND}
    </g>
  ),
  // Sieben Punkte am Boden: Stirn, beide Hände, Knie, Zehen. Das Gesäß bleibt
  // oben, der Rücken fällt schräg nach vorn ab.
  sujud: (
    <g>
      <circle cx={98} cy={108} r={8} />
      <path d="M50 80l38 24" />
      <path d="M50 80l6 36" />
      <path d="M56 116H32" />
      <path d="M84 98l2 18" />
      {GROUND}
    </g>
  ),
  // Auf den Unterschenkeln sitzend, die Hände ruhen auf den Oberschenkeln.
  sitting: (
    <g>
      <circle cx={66} cy={46} r={10} />
      <path d="M64 56l-6 50" />
      <path d="M58 108h30l2 8" />
      <path d="M58 110l-22 6" />
      <path d="M65 60c12 11 18 27 19 42" />
      {GROUND}
    </g>
  ),
  // Halb aufgerichtet: ein Knie noch gebeugt, der Oberkörper schon im Zug nach oben.
  rising: (
    <g>
      <circle cx={70} cy={30} r={10} />
      <path d="M69 40l-9 38" />
      <path d="M60 78l12 18-10 20M59 79l-5 17 2 20" />
      <path d="M68 47c9 9 10 20 4 29" />
      {GROUND}
    </g>
  ),
  // Sitzend wie im Tashahhud, der Kopf ist zur Seite gedreht.
  taslim: (
    <g>
      <circle cx={76} cy={46} r={10} />
      <path d="M86 42c5 2 8 5 10 9" strokeWidth={2.5} opacity={0.55} />
      <path d="M67 54l-9 52" />
      <path d="M58 108h30l2 8" />
      <path d="M58 110l-22 6" />
      <path d="M66 60c12 11 18 27 19 42" />
      {GROUND}
    </g>
  ),
};

export function PrayerPostureFigure({
  posture,
  className = '',
  style,
  labelled = false,
}: {
  posture: PrayerPosture;
  className?: string;
  style?: CSSProperties;
  /** Nur die große Figur wird vorgelesen; die kleinen in der Liste nicht. */
  labelled?: boolean;
}) {
  return (
    <svg
      className={`prayer-posture-figure prayer-posture-figure--${posture} ${className}`.trim()}
      style={style}
      viewBox="0 0 140 130"
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? POSTURE_ALT[posture] : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      {FIGURES[posture]}
    </svg>
  );
}
