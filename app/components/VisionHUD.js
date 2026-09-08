'use client';

const CX = 200;
const CY = 400;
const R = 240; // rayon mesuré sur la photo de référence (~58% de la largeur)
const GAP = 156; // point d'arrêt de la croix (0.65 * R, mesuré)

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
  { r: R, a1: 6, a2: 50, color: '#f2fbff', cls: 'a', dur: 9, delay: 0 },
  { r: R - 3, a1: 56, a2: 100, color: '#5ec8e8', cls: 'b', dur: 12, delay: 0.3 },
  { r: R, a1: 106, a2: 158, color: '#f2fbff', cls: 'a', dur: 14, delay: 0.6 },
  { r: R - 3, a1: 164, a2: 200, color: '#5ec8e8', cls: 'b', dur: 8, delay: 0.9 },
  { r: R, a1: 206, a2: 254, color: '#f2fbff', cls: 'b', dur: 13, delay: 0.2 },
  { r: R - 3, a1: 260, a2: 302, color: '#5ec8e8', cls: 'a', dur: 10, delay: 0.5 },
  { r: R, a1: 308, a2: 346, color: '#f2fbff', cls: 'b', dur: 11, delay: 0.8 },
  { r: R - 3, a1: 352, a2: 4, color: '#5ec8e8', cls: 'a', dur: 15, delay: 1.1 },
];

function Dot({ cx, cy, delay }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r="1.2"
      fill="#a9e8f5"
      style={{ animation: `orionTwinkle 3.2s ease-in-out infinite`, animationDelay: `${delay}s` }}
    />
  );
}

function haloArc(rBase, startAngle, endAngle, count, delayBase) {
  const dots = [];
  for (let i = 0; i < count; i++) {
    const t = startAngle + ((endAngle - startAngle) * i) / (count - 1);
    const r = rBase + (i % 2 === 0 ? 0 : 14);
    const p = polar(r, t);
    dots.push(<Dot key={`${startAngle}-${i}`} cx={p.x} cy={p.y} delay={delayBase + i * 0.08} />);
  }
  return dots;
}

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
      <line x1="200" y1={y0} x2="200" y2={yV} stroke="#e05252" strokeWidth="1" opacity="0.32" />
      <line x1="200" y1={yV} x2="148" y2={y0} stroke="#e8f6fb" strokeWidth="0.9" opacity="0.26" />
      <line x1="200" y1={yV} x2="252" y2={y0} stroke="#e8f6fb" strokeWidth="0.9" opacity="0.26" />
      <g fill="#e05252" opacity="0.4">
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
        @keyframes orionTwinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.7; } }
        @keyframes orionSway { 0% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } 100% { transform: rotate(-3deg); } }
        @keyframes orionSwayRev { 0% { transform: rotate(3deg); } 50% { transform: rotate(-3deg); } 100% { transform: rotate(3deg); } }
        .orion-a { transform-origin: 200px 400px; animation-name: orionSway; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .orion-b { transform-origin: 200px 400px; animation-name: orionSwayRev; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      `}</style>

      <svg viewBox="0 0 400 800" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>

        <g stroke="#e8f6fb" strokeWidth="0.6" opacity="0.16">
          <line x1="0" y1="0" x2={200 - 0.4472 * GAP} y2={400 - 0.8944 * GAP} />
          <line x1="400" y1="0" x2={200 + 0.4472 * GAP} y2={400 - 0.8944 * GAP} />
          <line x1="0" y1="800" x2={200 - 0.4472 * GAP} y2={400 + 0.8944 * GAP} />
          <line x1="400" y1="800" x2={200 + 0.4472 * GAP} y2={400 + 0.8944 * GAP} />
        </g>

        <g>
          {haloArc(R + 6, 0, 340, 28, 0)}
        </g>

        <circle cx={CX} cy={CY} r={R * 0.93} fill="none" stroke="#5ec8e8" strokeWidth="0.5" opacity="0.08" />

        {SEGMENTS.map((s, i) => (
          <g key={i} className={s.cls === 'a' ? 'orion-a' : 'orion-b'} style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}>
            <path d={arcPath(s.r, s.a1, s.a2)} fill="none" stroke={s.color} strokeWidth="9" opacity="0.10" strokeLinecap="round" />
            <path d={arcPath(s.r, s.a1, s.a2)} fill="none" stroke={s.color} strokeWidth="2.2" opacity="0.32" strokeLinecap="round" />
          </g>
        ))}

        {ladder(0, CX - R - 8, CY)}
        {ladder(CX + R + 8, 400, CY)}

        {reticle(false)}
        {reticle(true)}
      </svg>

      <div style={{ position: 'absolute', top: 'max(70px, calc(env(safe-area-inset-top) + 46px))', left: '20px', fontSize: '10px', letterSpacing: '0.15em', color: '#6ee7ff', opacity: 0.5, fontFamily: 'monospace' }}>
        ● ORION VISION
      </div>
    </div>
  );
}
