'use client';

function Dot({ cx, cy, delay }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r="1.3"
      fill="#a9e8f5"
      style={{ animation: `orionTwinkle 3.2s ease-in-out infinite`, animationDelay: `${delay}s` }}
    />
  );
}

function cornerArc(cx, cy, r, startAngle, endAngle, count, delayBase) {
  const dots = [];
  for (let i = 0; i < count; i++) {
    const t = startAngle + ((endAngle - startAngle) * i) / (count - 1);
    const rad = (t * Math.PI) / 180;
    dots.push(
      <Dot key={i} cx={cx + r * Math.cos(rad)} cy={cy + r * Math.sin(rad)} delay={delayBase + i * 0.12} />
    );
  }
  return dots;
}

export default function VisionHUD() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes orionTwinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.75; } }
        @keyframes orionSway { 0% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } 100% { transform: rotate(-4deg); } }
        @keyframes orionSwayRev { 0% { transform: rotate(4deg); } 50% { transform: rotate(-4deg); } 100% { transform: rotate(4deg); } }
        .orion-sway-a { transform-origin: 200px 400px; animation: orionSway 10s ease-in-out infinite; }
        .orion-sway-b { transform-origin: 200px 400px; animation: orionSwayRev 13s ease-in-out infinite; }
      `}</style>

      <svg viewBox="0 0 400 800" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>

        {/* grande croix diagonale */}
        <g stroke="#cfeffa" strokeWidth="0.6" opacity="0.28">
          <line x1="0" y1="0" x2="400" y2="800" />
          <line x1="400" y1="0" x2="0" y2="800" />
        </g>

        {/* arcs en pointillés dans les coins */}
        {cornerArc(0, 0, 90, 5, 85, 8, 0)}
        {cornerArc(0, 0, 140, 5, 85, 7, 0.3)}
        {cornerArc(400, 0, 90, 95, 175, 8, 0.6)}
        {cornerArc(400, 0, 140, 95, 175, 7, 0.9)}
        {cornerArc(0, 800, 90, 275, 355, 8, 1.2)}
        {cornerArc(0, 800, 140, 275, 355, 7, 1.5)}
        {cornerArc(400, 800, 90, 185, 265, 8, 1.8)}
        {cornerArc(400, 800, 140, 185, 265, 7, 2.1)}

        {/* traits horizontaux pointillés au milieu, gauche et droite */}
        <g stroke="#cfeffa" strokeWidth="1" opacity="0.35" strokeDasharray="4 5">
          <line x1="0" y1="400" x2="60" y2="400" />
          <line x1="340" y1="400" x2="400" y2="400" />
        </g>

        {/* deux cercles segmentés, larges, qui débordent du cadre */}
        <g className="orion-sway-a" opacity="0.4">
          <circle cx="200" cy="400" r="280" fill="none" stroke="#5ec8e8" strokeWidth="1.1" strokeDasharray="70 35 40 45" />
        </g>
        <g className="orion-sway-b" opacity="0.3">
          <circle cx="200" cy="400" r="245" fill="none" stroke="#5ec8e8" strokeWidth="0.9" strokeDasharray="55 40 30 50" />
        </g>

        {/* repère haut : croix centrale + branches qui s'écartent */}
        <g stroke="#cfeffa" strokeWidth="1" opacity="0.45">
          <line x1="200" y1="8" x2="200" y2="42" />
          <line x1="200" y1="20" x2="180" y2="55" />
          <line x1="200" y1="20" x2="220" y2="55" />
        </g>
        <g fill="#e05252" opacity="0.6">
          <rect x="180" y="62" width="4" height="4" transform="rotate(45 182 64)" />
          <rect x="216" y="62" width="4" height="4" transform="rotate(45 218 64)" />
        </g>

        {/* repère bas, miroir exact */}
        <g stroke="#cfeffa" strokeWidth="1" opacity="0.45">
          <line x1="200" y1="792" x2="200" y2="758" />
          <line x1="200" y1="780" x2="180" y2="745" />
          <line x1="200" y1="780" x2="220" y2="745" />
        </g>
        <g fill="#e05252" opacity="0.6">
          <rect x="180" y="734" width="4" height="4" transform="rotate(45 182 736)" />
          <rect x="216" y="734" width="4" height="4" transform="rotate(45 218 736)" />
        </g>
      </svg>

      <div style={{ position: 'absolute', top: 'max(70px, calc(env(safe-area-inset-top) + 46px))', left: '20px', fontSize: '10px', letterSpacing: '0.15em', color: '#6ee7ff', opacity: 0.55, fontFamily: 'monospace' }}>
        ● ORION VISION
      </div>
    </div>
  );
}
