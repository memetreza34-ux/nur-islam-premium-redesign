import { useEffect, useState } from 'react';

type Accent = {
  src: string;
  className: string;
  label: string;
};

const VISUAL_VERSION = '20260806-visual4';
const asset = (name: string) => `/premium-assets/high-res-objects/${name}-v2.webp?v=${VISUAL_VERSION}`;

const accents: Record<string, Accent[]> = {
  prayer: [{ src: asset('dome'), className: 'reference-artwork-layer__dome', label: 'Goldene Moscheekuppel' }],
  calendar: [
    { src: asset('sun-emblem'), className: 'reference-artwork-layer__sun', label: 'Islamisches Sonnenemblem' },
    { src: asset('calendar-chip'), className: 'reference-artwork-layer__calendar-chip', label: 'Goldene Kalenderkarte' },
  ],
  duas: [{ src: asset('dua-hands'), className: 'reference-artwork-layer__hands', label: 'Hände im Dua' }],
  qibla: [{ src: asset('kaaba'), className: 'reference-artwork-layer__kaaba', label: 'Kaaba' }],
  ayah: [{ src: asset('mihrab-arch'), className: 'reference-artwork-layer__mihrab', label: 'Illuminierter Mihrab' }],
  hadith: [{ src: asset('lantern'), className: 'reference-artwork-layer__lantern', label: 'Goldene Laterne' }],
  learn: [{ src: asset('mihrab-arch'), className: 'reference-artwork-layer__learn-mihrab', label: 'Illuminierter Gebetsbogen' }],
  profile: [{ src: asset('bookmark'), className: 'reference-artwork-layer__bookmark', label: 'Goldenes Lesezeichen' }],
  collections: [{ src: asset('bookmark'), className: 'reference-artwork-layer__collection-bookmark', label: 'Goldenes Lesezeichen' }],
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
        <img
          key={`${screen}-${accent.src}`}
          src={accent.src}
          className={`reference-artwork-image ${accent.className}`}
          alt=""
          aria-label={accent.label}
          loading="eager"
          decoding="async"
          draggable={false}
        />
      ))}
    </div>
  );
}
