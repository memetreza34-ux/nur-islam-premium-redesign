import type { CSSProperties } from 'react';
import { versionAppPath } from './appPaths';

const PREMIUM_ASSET_VERSION = '20260806-visual4';

type VisualProps = {
  className?: string;
  style?: CSSProperties;
};

function versionPremiumAsset(src: string) {
  if (!src.includes('premium-assets/')) return src;
  return versionAppPath(src, PREMIUM_ASSET_VERSION);
}

export function NurMark({ className = '', style }: VisualProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 96 96" aria-hidden="true">
      <defs>
        <linearGradient id="nur-gold" x1="12" y1="8" x2="82" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff0c7" />
          <stop offset=".45" stopColor="#e8c77e" />
          <stop offset="1" stopColor="#9c7131" />
        </linearGradient>
        <radialGradient id="nur-green" cx="50%" cy="40%" r="70%">
          <stop stopColor="#174f3e" />
          <stop offset="1" stopColor="#06251e" />
        </radialGradient>
      </defs>
      <path d="M48 5 59 17l16-1 2 16 13 9-8 14 5 15-15 6-7 15-15-6-14 8-9-13-16-2 1-16L3 50l11-12-3-16 16-4L37 6l11 8Z" fill="url(#nur-green)" stroke="url(#nur-gold)" strokeWidth="6" strokeLinejoin="round" />
      <path d="M58 31a20 20 0 1 0 2 32 18 18 0 1 1-2-32Z" fill="url(#nur-gold)" />
      <path d="m63 34 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2-4.5-4.4 6.2-.9Z" fill="#fff5d8" />
    </svg>
  );
}

export function MosqueScene({ className = '', style }: VisualProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 620 330" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="310" y1="15" x2="310" y2="315" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d9b36c" stopOpacity=".78" />
          <stop offset=".38" stopColor="#48705b" stopOpacity=".7" />
          <stop offset="1" stopColor="#082820" stopOpacity=".05" />
        </linearGradient>
        <linearGradient id="building" x1="310" y1="110" x2="310" y2="315" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0d49b" />
          <stop offset=".45" stopColor="#aa8246" />
          <stop offset="1" stopColor="#1a4939" />
        </linearGradient>
        <radialGradient id="sunset" cx="50%" cy="28%" r="55%">
          <stop stopColor="#ffe3a5" stopOpacity=".95" />
          <stop offset="1" stopColor="#f0c46b" stopOpacity="0" />
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <ellipse cx="315" cy="100" rx="220" ry="105" fill="url(#sunset)" filter="url(#glow)" />
      <path d="M0 260c92-30 154-34 225-12 70 22 146 13 213-8 64-20 119-17 182 10v80H0Z" fill="#061d18" opacity=".9" />
      <g fill="url(#building)" stroke="#e5c47c" strokeWidth="2">
        <path d="M190 289v-95h33v95Zm207 0v-95h33v95Z" />
        <path d="M197 194v-70h19v70Zm207 0v-70h19v70Z" />
        <path d="m206 102 13 23h-26Z" />
        <path d="m413 102 13 23h-26Z" />
        <path d="M233 290v-89h154v89Z" />
        <path d="M257 201c0-59 24-105 53-105s53 46 53 105Z" />
        <path d="M278 201c0-33 14-60 32-60s32 27 32 60Z" fill="#143c30" />
        <path d="M309 96V65" />
        <path d="m310 48 10 18h-20Z" />
        <path d="M235 223c17-20 33-30 49-30s31 10 47 30v67h-96Z" opacity=".7" />
        <path d="M331 223c17-20 33-30 49-30s31 10 47 30v67h-96Z" opacity=".7" />
      </g>
      <g fill="#ffd98d" opacity=".85">
        <circle cx="266" cy="245" r="4" /><circle cx="286" cy="245" r="4" /><circle cx="357" cy="245" r="4" /><circle cx="377" cy="245" r="4" />
      </g>
      <g fill="#f4d68f" opacity=".8">
        <circle cx="92" cy="73" r="2" /><circle cx="142" cy="38" r="1.8" /><circle cx="486" cy="58" r="2" /><circle cx="531" cy="100" r="1.5" />
      </g>
    </svg>
  );
}

export function QuranObject({ className = '', style }: VisualProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 260 220" aria-hidden="true">
      <defs>
        <linearGradient id="book-cover" x1="40" y1="28" x2="220" y2="202" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1b5c47" /><stop offset="1" stopColor="#031a15" />
        </linearGradient>
        <linearGradient id="book-gold" x1="68" y1="32" x2="198" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff0bd" /><stop offset=".5" stopColor="#d6a94c" /><stop offset="1" stopColor="#835b20" />
        </linearGradient>
      </defs>
      <path d="M47 42 183 23l39 152-137 27Z" fill="#35281b" opacity=".6" />
      <path d="M38 28 176 13l38 151-139 25Z" fill="url(#book-cover)" stroke="url(#book-gold)" strokeWidth="5" />
      <path d="M54 43 164 30l29 119-110 20Z" fill="none" stroke="#e2bc70" strokeWidth="4" />
      <path d="M73 58 154 48l21 87-81 15Z" fill="none" stroke="#ae8138" strokeWidth="2" />
      <path d="m124 64 18 16-11 24-25 3-15-19 13-21Z" fill="#0c3329" stroke="#e9ca82" strokeWidth="3" />
      <path d="M128 75a14 14 0 1 0 3 23 12 12 0 1 1-3-23Z" fill="#e8c778" />
      <circle cx="125" cy="89" r="2.2" fill="#fff3c7" />
      <path d="m102 185 10 24 8-27" fill="#c5923c" />
    </svg>
  );
}

export function QiblaObject({ className = '', style }: VisualProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 260 260" aria-hidden="true">
      <defs>
        <radialGradient id="compass-face"><stop stopColor="#164a3b" /><stop offset="1" stopColor="#031a15" /></radialGradient>
        <linearGradient id="compass-gold" x1="42" y1="20" x2="220" y2="238"><stop stopColor="#fff0bd" /><stop offset=".5" stopColor="#d8ae57" /><stop offset="1" stopColor="#75501e" /></linearGradient>
      </defs>
      <circle cx="130" cy="130" r="112" fill="url(#compass-face)" stroke="url(#compass-gold)" strokeWidth="8" />
      <circle cx="130" cy="130" r="88" fill="none" stroke="#d6ad60" strokeOpacity=".45" strokeWidth="2" />
      {Array.from({ length: 16 }).map((_, index) => {
        const angle = (index * 360) / 16;
        return <line key={angle} x1="130" y1="31" x2="130" y2={index % 4 === 0 ? 49 : 41} stroke="#e8cb85" strokeWidth={index % 4 === 0 ? 3 : 1.5} transform={`rotate(${angle} 130 130)`} />;
      })}
      <path d="m130 30 16 61-16 17-16-17Z" fill="url(#compass-gold)" />
      <path d="M93 137h74v42H93Z" fill="#050907" stroke="#d7ad5e" strokeWidth="3" />
      <path d="M89 133h82l-11-16h-60Z" fill="#11140f" stroke="#d7ad5e" strokeWidth="3" />
      <path d="M96 148h68" stroke="#d7ad5e" strokeWidth="5" />
      <path d="M130 102a9 9 0 1 0 1 17 8 8 0 1 1-1-17Z" fill="#efd48f" />
    </svg>
  );
}

export function RosetteObject({ className = '', style }: VisualProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 220 220" aria-hidden="true">
      <defs><linearGradient id="rosette-gold" x1="30" y1="25" x2="190" y2="198"><stop stopColor="#fff0c1" /><stop offset=".45" stopColor="#ddb767" /><stop offset="1" stopColor="#875d25" /></linearGradient></defs>
      <g transform="translate(110 110)">
        {Array.from({ length: 10 }).map((_, i) => <path key={i} d="M0-96C22-76 31-50 22-27 5-36-11-36-27-27-34-51-24-77 0-96Z" transform={`rotate(${i * 36})`} fill={i % 2 ? '#0d3a2d' : '#f6ead1'} stroke="url(#rosette-gold)" strokeWidth="4" />)}
        <path d="M0-58 17-23 55-18 27 8 34 46 0 27-34 46-27 8-55-18-17-23Z" fill="#0b3026" stroke="url(#rosette-gold)" strokeWidth="4" />
        <circle r="20" fill="#f5e2b2" stroke="#d3aa56" strokeWidth="5" />
      </g>
    </svg>
  );
}

export function LanternObject({ className = '', style }: VisualProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 180 250" aria-hidden="true">
      <defs><radialGradient id="lamp-light"><stop stopColor="#fff6c5" /><stop offset=".38" stopColor="#ffc55c" /><stop offset="1" stopColor="#b06f17" stopOpacity="0" /></radialGradient><linearGradient id="lamp-metal" x1="24" y1="15" x2="150" y2="234"><stop stopColor="#f2d38e" /><stop offset=".5" stopColor="#a56f28" /><stop offset="1" stopColor="#372312" /></linearGradient></defs>
      <ellipse cx="90" cy="143" rx="74" ry="86" fill="url(#lamp-light)" opacity=".7" />
      <path d="M74 18h32l8 22H66Z" fill="url(#lamp-metal)" />
      <path d="M52 49h76l13 33-8 127H47L39 82Z" fill="#0b211b" stroke="url(#lamp-metal)" strokeWidth="8" />
      <path d="M64 69h52l7 25-6 92H63l-6-92Z" fill="#ffcd67" fillOpacity=".2" stroke="#d9a74e" strokeWidth="3" />
      <circle cx="90" cy="132" r="37" fill="url(#lamp-light)" />
      <path d="M47 209h86l-13 25H60Z" fill="url(#lamp-metal)" />
      <path d="M64 50 48 81m68-31 17 31M90 50v159" stroke="#d7a64b" strokeWidth="4" />
    </svg>
  );
}

export function CrescentObject({ className = '', style }: VisualProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 220 220" aria-hidden="true">
      <defs><linearGradient id="crescent-gold" x1="32" y1="22" x2="180" y2="202"><stop stopColor="#fff3c8" /><stop offset=".48" stopColor="#dcb45f" /><stop offset="1" stopColor="#7e5420" /></linearGradient></defs>
      <path d="M142 26c-52 12-83 58-72 105 11 48 59 77 107 63-20 22-50 33-81 26-57-13-92-70-79-127C30 36 87 1 142 14Z" fill="url(#crescent-gold)" stroke="#f0d590" strokeWidth="3" />
      <path d="m155 77 9 19 21 3-15 15 4 21-19-10-19 10 4-21-15-15 21-3Z" fill="#fff0b7" />
      <g fill="#f6d883"><circle cx="173" cy="50" r="3" /><circle cx="192" cy="84" r="2" /><circle cx="130" cy="47" r="2" /></g>
    </svg>
  );
}

export function PremiumImage({
  src,
  alt = '',
  className = '',
  fallback,
  priority = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  fallback: React.ReactNode;
  priority?: boolean;
}) {
  const versionedSrc = versionPremiumAsset(src);
  const eager = priority || /brand-lockup|welcome-hero|reference-.*hero/.test(className);

  return (
    <span className={`premium-image ${className}`} data-premium-src={versionedSrc}>
      <img
        src={versionedSrc}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        onLoad={(event) => {
          event.currentTarget.hidden = false;
          const next = event.currentTarget.nextElementSibling as HTMLElement | null;
          if (next) next.hidden = true;
        }}
        onError={(event) => {
          event.currentTarget.hidden = true;
          const next = event.currentTarget.nextElementSibling as HTMLElement | null;
          if (next) next.hidden = false;
        }}
      />
      <span className="premium-image__fallback" hidden>{fallback}</span>
    </span>
  );
}
