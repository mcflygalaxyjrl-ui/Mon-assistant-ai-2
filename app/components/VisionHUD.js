'use client';

const CX = 200;
const CY = 400;

function polar(r, deg) {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function arcPath(r, a1, a2) {
  const s = polar(r, a1);
  const e = polar(r, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

const SEGMENTS = [
  { r: 196, a1: 8, a2: 55, color: '#f2fbff', cls: 'a', dur: 9, delay: 0 },
  { r: 181, a1: 62, a2: 102, color: '#5ec8e8', cls: 'b', dur: 12, delay: 0.3 },
  { r: 191, a1: 108, a2: 158, color: '#f2fbff', cls: 'a', dur: 14, delay: 0.6 },
  { r: 176, a1: 164, a2: 198, color: '#5ec8e8', cls: 'b', dur: 8, delay: 0.9 },
  { r: 198, a1: 206, a2: 254, color: '#f2fbff', cls: 'b', dur: 13, delay: 0.2 },
  { r: 184, a1: 260, a2: 300, color: '#5ec8e8', cls: 'a', dur: 10, delay: 0.5 },
  { r: 190, a1: 306, a2: 344, color: '#f2fbff', cls: 'b', dur: 11, delay: 0.8 },
  { r: 178, a1: 350, a2: 3, color: '#5ec8e8', cls: 'a', dur: 15, delay: 1.1 },
];

function ladder(xStart, xEnd, y) {
  const ticks = [];
  for (let x = xStart; x <= xEnd; x += 13) {
    ticks.push(<line key={x} x1={x} y1={y - 5} x2={x} y2={y + 5} />);
  }
  return (
    <g stroke="#e8f6fb" strokeWidth="1" opacity="0.22">
      <line x1={xStart} y1={y} x2={xEnd} y2={y} />
      {ticks}
    </g>
  );
}

function reticle(flip) {
  const y0 = flip ? 800 : 0;
  const yV = flip ? 762 : 38;
  return (
    <g>
      <line x1="200" y1={y0} x2="200" y2={yV} stroke="#e05252" strokeWidth="1" opacity="0.35" />
      <line x1="200" y1={yV} x2="148" y2={y0} stroke="#e8f6fb" strokeWidth="0.9" opacity="0.28" />
      <line x1="200" y1={yV} x2="252" y2={y0} stroke="#e8f6fb" strokeWidth="0.9" opacity="0.28" />
      <g fill="#e05252" opacity="0.42">
        <rect x="190" y={flip ? 748 : 46} width="4.5" height="4.5" transform={`rotate(45 192 ${flip ? 750 : 48})`} />
        <rect x="205" y={flip ? 748 : 46} width="4.5" height="4.5" transform={`rotate(45 207 ${flip ? 750 : 48})`} />
      </g>
    </g>
  );
}

export default function VisionHUD() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes orionSway { 0% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } 100% { transform: rotate(-4deg); } }
        @keyframes orionSwayRev { 0% { transform: rotate(4deg); } 50% { transform: rotate(-4deg); } 100% { transform: rotate(4deg); } }
        .orion-a { transform-origin: 200px 400px; animation-name: orionSway; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .orion-b { transform-origin: 200px 400px; animation-name: orionSwayRev; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      `}</style>

      <svg viewBox="0 0 400 800" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>

        {/* croix diagonale, s'arrête avant le cercle */}
        <g stroke="#e8f6fb" strokeWidth="0.6" opacity="0.15">
          <line x1="0" y1="0" x2="106" y2="212" />
          <line x1="400" y1="0" x2="294" y2="212" />
          <line x1="0" y1="800" x2="106" y2="588" />
          <line x1="400" y1="800" x2="294" y2="588" />
        </g>

        {/* halo de points */}
        <g opacity="0.2">
          <circle cx="200" cy="400" r="212" fill="none" stroke="#a9e8f5" strokeWidth="1.6" strokeDasharray="1 8" strokeLinecap="round" />
          <circle cx="200" cy="400" r="224" fill="none" stroke="#a9e8f5" strokeWidth="1.6" strokeDasharray="1 10" strokeLinecap="round" />
        </g>

        {/* fin cercle guide, statique et discret */}
        <circle cx="200" cy="400" r="165" fill="none" stroke="#5ec8e8" strokeWidth="0.6" opacity="0.1" />

        {/* morceaux d'anneau qui s'imbriquent, chacun oscille légèrement */}
        {SEGMENTS.map((s, i) => (
          <g
            key={i}
            className={s.cls === 'a' ? 'orion-a' : 'orion-b'}
            style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
          >
            <path d={arcPath(s.r, s.a1, s.a2)} fill="none" stroke={s.color} strokeWidth="3" opacity="0.3" strokeLinecap="round" />
          </g>
        ))}

        {ladder(0, 46, 400)}
        {ladder(354, 400, 400)}

        {reticle(false)}
        {reticle(true)}
      </svg>

      <div style={{ position: 'absolute', top: 'max(70px, calc(env(safe-area-inset-top) + 46px))', left: '20px', fontSize: '10px', letterSpacing: '0.15em', color: '#6ee7ff', opacity: 0.5, fontFamily: 'monospace' }}>
        ● ORION VISION
      </div>
    </div>
  );
}
