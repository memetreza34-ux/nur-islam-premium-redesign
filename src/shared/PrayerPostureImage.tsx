import type { PrayerPosture } from '../data/prayerRakatData';
import { PremiumImage } from './PremiumVisuals';
import { PrayerPostureFigure } from './PrayerPostureFigure';

const POSTURE_IMAGE: Record<PrayerPosture, string> = {
  takbir: 'takbir',
  qiyam: 'qiyam',
  ruku: 'ruku',
  standing: 'standing',
  rising: 'standing',
  sujud: 'sujud',
  sitting: 'sitting',
  taslim: 'taslim',
};

const POSTURE_ALT: Record<PrayerPosture, string> = {
  takbir: 'Betender steht aufrecht und hebt beide Hände zum Eröffnungstakbir.',
  qiyam: 'Betender steht aufrecht mit gefalteten Händen.',
  ruku: 'Betender verbeugt sich mit geradem Rücken und Händen auf den Knien.',
  standing: 'Betender steht nach der Verbeugung wieder aufrecht.',
  rising: 'Zielhaltung nach dem Aufstehen: aufrecht stehen.',
  sujud: 'Betender befindet sich in der Niederwerfung auf der Gebetsmatte.',
  sitting: 'Betender sitzt aufrecht zwischen den Niederwerfungen.',
  taslim: 'Betender sitzt und dreht den Kopf zum Abschluss nach rechts.',
};

export function PrayerPostureImage({ posture, compact = false }: { posture: PrayerPosture; compact?: boolean }) {
  return (
    <PremiumImage
      src={`/premium-assets/high-res-objects/salah-posture-${POSTURE_IMAGE[posture]}-v1.webp`}
      alt={POSTURE_ALT[posture]}
      className={`salah-posture-image${compact ? ' salah-posture-image--compact' : ''}`}
      fallback={<PrayerPostureFigure posture={posture} labelled={!compact} />}
    />
  );
}
