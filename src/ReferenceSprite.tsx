import type { CSSProperties } from 'react';
import chunk00 from './assets/referenceSpriteChunk00';
import chunk01 from './assets/referenceSpriteChunk01';
import chunk02 from './assets/referenceSpriteChunk02';
import chunk03 from './assets/referenceSpriteChunk03';
import chunk04 from './assets/referenceSpriteChunk04';
import chunk05 from './assets/referenceSpriteChunk05';

export type ReferenceSpriteAsset =
  | 'dome'
  | 'kaaba'
  | 'lantern'
  | 'mihrab'
  | 'dua-hands'
  | 'sun-emblem'
  | 'calendar-chip'
  | 'bookmark';

const sprite = `data:image/webp;base64,${chunk00}${chunk01}${chunk02}${chunk03}${chunk04}${chunk05}`;

const positions: Record<ReferenceSpriteAsset, string> = {
  dome: '0 0',
  kaaba: '-128px 0',
  lantern: '-256px 0',
  mihrab: '-384px 0',
  'dua-hands': '0 -128px',
  'sun-emblem': '-128px -128px',
  'calendar-chip': '-256px -128px',
  bookmark: '-384px -128px',
};

export function ReferenceSprite({
  asset,
  className = '',
  label,
  style,
}: {
  asset: ReferenceSpriteAsset;
  className?: string;
  label?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`reference-sprite reference-sprite--${asset} ${className}`.trim()}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{
        backgroundImage: `url(${sprite})`,
        backgroundPosition: positions[asset],
        ...style,
      }}
    />
  );
}
