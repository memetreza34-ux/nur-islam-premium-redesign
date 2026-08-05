import { useEffect, useState } from 'react';
import { ReferenceSprite, type ReferenceSpriteAsset } from './ReferenceSprite';

type Accent = {
  asset: ReferenceSpriteAsset;
  className: string;
  label: string;
};

const accents: Record<string, Accent[]> = {
  prayer: [{ asset: 'dome', className: 'reference-artwork-layer__dome', label: 'Goldene Moscheekuppel' }],
  calendar: [{ asset: 'sun-emblem', className: 'reference-artwork-layer__sun', label: 'Islamisches Sonnenemblem' }],
  duas: [{ asset: 'dua-hands', className: 'reference-artwork-layer__hands', label: 'Hände im Dua' }],
  qibla: [{ asset: 'kaaba', className: 'reference-artwork-layer__kaaba', label: 'Kaaba' }],
  ayah: [{ asset: 'mihrab', className: 'reference-artwork-layer__mihrab', label: 'Illuminierter Mihrab' }],
  hadith: [{ asset: 'lantern', className: 'reference-artwork-layer__lantern', label: 'Goldene Laterne' }],
  learn: [{ asset: 'mihrab', className: 'reference-artwork-layer__learn-mihrab', label: 'Illuminierter Gebetsbogen' }],
  profile: [{ asset: 'bookmark', className: 'reference-artwork-layer__bookmark', label: 'Goldenes Lesezeichen' }],
  collections: [{ asset: 'bookmark', className: 'reference-artwork-layer__collection-bookmark', label: 'Goldenes Lesezeichen' }],
};

function detectScreen() {
  if (document.querySelector('.reference-prayer-screen')) return 'prayer';
  if (document.querySelector('.reference-calendar-screen')) return 'calendar';
  if (document.querySelector('.reference-duas-screen')) return 'duas';
  if (document.querySelector('.reference-qibla-screen')) return 'qibla';
  if (document.querySelector('.reference-learn-screen')) return 'learn';
  if (document.querySelector('.reference-profile-screen')) return 'profile';
  if (document.querySelector('.reference-collections-screen')) return 'collections';

  const heading = document.querySelector('.reference-detail-screen h1')?.textContent?.toLowerCase() ?? '';
  if (heading.includes('ayah')) return 'ayah';
  if (heading.includes('hadith')) return 'hadith';
  return '';
}

export function ReferenceArtworkHost() {
  const [screen, setScreen] = useState('');

  useEffect(() => {
    const update = () => setScreen(detectScreen());
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.getElementById('root') ?? document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const active = accents[screen];
  if (!active?.length) return null;

  return (
    <div className={`reference-artwork-host reference-artwork-host--${screen}`} aria-hidden="true">
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
