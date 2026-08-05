import { ReferenceSprite, type ReferenceSpriteAsset } from './ReferenceSprite';

type Accent = {
  asset: ReferenceSpriteAsset;
  className: string;
  label: string;
};

const accents: Record<string, Accent[]> = {
  prayer: [
    { asset: 'dome', className: 'reference-artwork-layer__dome', label: 'Goldene Moscheekuppel' },
  ],
  calendar: [
    { asset: 'sun-emblem', className: 'reference-artwork-layer__sun', label: 'Islamisches Sonnenemblem' },
  ],
  duas: [
    { asset: 'dua-hands', className: 'reference-artwork-layer__hands', label: 'Hände im Dua' },
  ],
  qibla: [
    { asset: 'kaaba', className: 'reference-artwork-layer__kaaba', label: 'Kaaba' },
  ],
  ayah: [
    { asset: 'mihrab', className: 'reference-artwork-layer__mihrab', label: 'Illuminierter Mihrab' },
  ],
  hadith: [
    { asset: 'lantern', className: 'reference-artwork-layer__lantern', label: 'Goldene Laterne' },
  ],
  learn: [
    { asset: 'mihrab', className: 'reference-artwork-layer__learn-mihrab', label: 'Illuminierter Gebetsbogen' },
  ],
  profile: [
    { asset: 'bookmark', className: 'reference-artwork-layer__bookmark', label: 'Goldenes Lesezeichen' },
  ],
  collections: [
    { asset: 'bookmark', className: 'reference-artwork-layer__collection-bookmark', label: 'Goldenes Lesezeichen' },
  ],
};

export function ReferenceArtworkLayer({ screen }: { screen: string }) {
  const active = accents[screen];
  if (!active?.length) return null;

  return (
    <div className={`reference-artwork-layer reference-artwork-layer--${screen}`} aria-hidden="true">
      {active.map((accent) => (
        <ReferenceSprite
          key={`${screen}-${accent.asset}`}
          asset={accent.asset}
          className={accent.className}
          label={accent.label}
        />
      ))}
    </div>
  );
}
