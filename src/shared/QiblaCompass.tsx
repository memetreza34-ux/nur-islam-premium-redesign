import { motion, useReducedMotion } from 'motion/react';

export type CompassVisualState = 'ready' | 'turn' | 'near' | 'aligned' | 'uncertain' | 'error';

type Props = {
  direction: number;
  heading: number | null;
  rotation: number;
  state: CompassVisualState;
  pulse: boolean;
};

const rosePoints = Array.from({ length: 16 }, (_, i) => {
  const angle = i * Math.PI / 8 - Math.PI / 2;
  const radius = i % 2 === 0 ? 78 : 56;
  return `${180 + Math.cos(angle) * radius},${180 + Math.sin(angle) * radius}`;
}).join(' ');

export function QiblaCompass({ direction, heading, rotation, state, pulse }: Props) {
  const reduced = useReducedMotion();
  const transition = reduced ? 'none' : 'transform 320ms cubic-bezier(.22,.61,.36,1)';
  const turn = (degrees: number) => ({ transform: `rotate(${degrees}deg)`, transformOrigin: '180px 180px', transition });
  const northRotation = heading === null ? 0 : rotation - direction;

  return (
    <motion.div className="qibla-dial" data-state={state} data-aligned={state === 'aligned'} data-pulse={pulse && !reduced && state === 'aligned'} initial={{ opacity: 0, scale: reduced ? 1 : .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : .36 }}>
      <svg viewBox="0 0 360 360" role="img" aria-label={`Qibla-Kompass: ${Math.round(direction)} Grad ab Norden${heading === null ? ', nordorientierte Ansicht ohne Gerätesensor' : ', relativ zur Geräteausrichtung'}`}>
        <defs>
          <radialGradient id="qibla-paper" cx=".45" cy=".35" r=".8">
            <stop offset="0" stopColor="#fff9ec" />
            <stop offset="1" stopColor="#edddba" />
          </radialGradient>
        </defs>
        <circle className="qibla-dial__case" cx="180" cy="180" r="171" />
        <circle className="qibla-dial__bezel" cx="180" cy="180" r="164" />
        <circle className="qibla-dial__rim" cx="180" cy="180" r="157" />
        <circle className="qibla-dial__face" cx="180" cy="180" r="150" />
        <circle className="qibla-dial__status-ring" cx="180" cy="180" r="168" />
        <circle className="qibla-dial__chapter-ring" cx="180" cy="180" r="126" />
        <polygon className="qibla-dial__rose" points={rosePoints} />
        <g className="qibla-dial__scale" style={turn(northRotation)}>
          {Array.from({ length: 72 }, (_, i) => (
            <line key={i} x1="180" y1="31" x2="180" y2={i % 18 === 0 ? 50 : i % 6 === 0 ? 45 : 39} transform={`rotate(${i * 5} 180 180)`} className={i % 18 === 0 ? 'qibla-dial__tick qibla-dial__tick--major' : i % 6 === 0 ? 'qibla-dial__tick qibla-dial__tick--medium' : 'qibla-dial__tick'} />
          ))}
          {['N', 'O', 'S', 'W'].map((label, i) => (
            <g key={label} transform={`rotate(${i * 90} 180 180)`}>
              <text x="180" y="78" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${-i * 90} 180 78)`} className={i === 0 ? 'qibla-dial__north' : ''}>{label}</text>
            </g>
          ))}
        </g>
        <g className="qibla-dial__qibla-pointer" style={turn(rotation)} aria-hidden="true">
          <path className="qibla-dial__qibla-shaft" d="M180 76 190 167 180 178 170 167Z" />
          <path className="qibla-dial__qibla-highlight" d="M180 78V174L170 167Z" />
          <g className="qibla-dial__kaaba-mark" transform="translate(180 68)">
            <circle className="qibla-dial__target-halo" r="13" />
            <path className="qibla-dial__target-kaaba" d="M-6-5 0-8 6-5V5L0 8-6 5ZM-6-5 0-2 6-5M0-2V8" />
          </g>
        </g>
        <circle className="qibla-dial__pin-outer" cx="180" cy="180" r="10" />
        <circle className="qibla-dial__pin-inner" cx="180" cy="180" r="4" />
        <path className="qibla-dial__device-marker" d="M180 29 173 14H187Z" />
      </svg>
    </motion.div>
  );
}
