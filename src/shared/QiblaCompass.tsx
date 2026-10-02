import { motion, useReducedMotion } from 'motion/react';

type Props = {
  direction: number;
  heading: number | null;
  rotation: number;
  aligned: boolean;
};

export function QiblaCompass({ direction, heading, rotation, aligned }: Props) {
  const reduced = useReducedMotion();
  const transition = reduced ? 'none' : 'transform 320ms cubic-bezier(.22,.61,.36,1)';
  const turn = (degrees: number) => ({ transform: `rotate(${degrees}deg)`, transformOrigin: '180px 180px', transition });
  const northRotation = heading === null ? 0 : rotation - direction;
  const rosePoints = Array.from({ length: 16 }, (_, i) => {
    const angle = i * Math.PI / 8 - Math.PI / 2;
    const radius = i % 2 === 0 ? 72 : 28;
    return `${180 + Math.cos(angle) * radius},${180 + Math.sin(angle) * radius}`;
  }).join(' ');

  return (
    <motion.div className="qibla-dial" data-aligned={aligned} initial={{ opacity: 0, scale: reduced ? 1 : .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : .36 }}>
      <svg viewBox="0 0 360 360" role="img" aria-label={`Qibla-Kompass: ${Math.round(direction)} Grad ab Norden${heading === null ? ', nordorientierte Ansicht ohne Gerätesensor' : ', relativ zur Geräteausrichtung'}`}>
        <defs>
          <linearGradient id="qibla-bezel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ead29d" />
            <stop offset=".48" stopColor="#9b7845" />
            <stop offset="1" stopColor="#d6b574" />
          </linearGradient>
          <radialGradient id="qibla-enamel" cx=".38" cy=".3" r=".75">
            <stop offset="0" stopColor="#fff9ea" />
            <stop offset=".7" stopColor="#f1e5c8" />
            <stop offset="1" stopColor="#d8c69f" />
          </radialGradient>
        </defs>
        <circle className="qibla-dial__case" cx="180" cy="180" r="170" />
        <circle className="qibla-dial__bezel" cx="180" cy="180" r="164" />
        <circle className="qibla-dial__rim" cx="180" cy="180" r="156" />
        <circle className="qibla-dial__face" cx="180" cy="180" r="151" />
        <circle className="qibla-dial__chapter-ring" cx="180" cy="180" r="133" />
        <polygon className="qibla-dial__rose" points={rosePoints} />
        <circle className="qibla-dial__rose-core" cx="180" cy="180" r="49" />
        <g className="qibla-dial__scale" style={turn(northRotation)}>
          {Array.from({ length: 36 }, (_, i) => (
            <line key={i} x1="180" y1="31" x2="180" y2={i % 9 === 0 ? 48 : i % 3 === 0 ? 43 : 38} transform={`rotate(${i * 10} 180 180)`} className={i % 9 === 0 ? 'qibla-dial__tick qibla-dial__tick--major' : i % 3 === 0 ? 'qibla-dial__tick qibla-dial__tick--medium' : 'qibla-dial__tick'} />
          ))}
          {['N', 'O', 'S', 'W'].map((label, i) => (
            <g key={label} transform={`rotate(${i * 90} 180 180)`}>
              <text x="180" y="78" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${-i * 90} 180 78)`} className={i === 0 ? 'qibla-dial__north' : ''}>{label}</text>
            </g>
          ))}
        </g>
        <g className="qibla-dial__qibla-pointer" style={turn(rotation)} aria-hidden="true">
          <path className="qibla-dial__pointer-shadow" d="M180 91 199 181 180 231 161 181Z" />
          <path className="qibla-dial__qibla-counterweight" d="M164 181 180 200 196 181 180 226Z" />
          <path className="qibla-dial__qibla-shaft" d="M180 87 197 181 180 169 163 181Z" />
          <path className="qibla-dial__qibla-highlight" d="M180 89V169L163 181Z" />
          <g className="qibla-dial__kaaba-mark" transform="translate(180 103)">
            <circle className="qibla-dial__target-halo" r="13" />
            <circle className="qibla-dial__target-body" r="10" />
            <path className="qibla-dial__target-kaaba" d="M-5-4H5V5H-5ZM-5-1H5M2 0V5" />
          </g>
        </g>
        <circle className="qibla-dial__pin-outer" cx="180" cy="180" r="12" />
        <circle className="qibla-dial__pin-inner" cx="180" cy="180" r="4" />
      </svg>
      <span className="qibla-dial__device-marker" aria-hidden="true" />
    </motion.div>
  );
}
