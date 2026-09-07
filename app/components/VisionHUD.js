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

        {/* grande croix diagonale, coin à coin */}
        <g stroke="#cfeffa" strokeWidth="0.5" opacity="0.2">
          <line x1="0" y1="0" x2="400" y2="800" />
          <line x1="400" y1="0" x2="0" y2="800" />
        </g>

        {/* arcs en pointillés qui longent les bords, dans chaque coin */}
        {cornerArc(0, 0, 130, 5, 85, 9, 0)}
        {cornerArc(0, 0, 190, 5, 85, 8, 0.3)}
        {cornerArc(400, 0, 130, 95, 175, 9, 0.6)}
        {cornerArc(400, 0, 190, 95, 175, 8, 0.9)}
        {cornerArc(0, 800, 130, 275, 355, 9, 1.2)}
        {cornerArc(0, 800, 190, 275, 355, 8, 1.5)}
        {cornerArc(400, 800, 130, 185, 265, 9, 1.8)}
        {cornerArc(400, 800, 190, 185, 265, 8, 2.1)}

        {/* grand cercle fin, oscille doucement */}
        <g className="orion-sway-a" opacity="0.3">
          <circle cx="200" cy="400" r="260" fill="none" stroke="#8fdcef" strokeWidth="0.6" />
        </g>
        <g className="orion-sway-b" opacity="0.18">
          <circle cx="200" cy="400" r="240" fill="none" stroke="#8fdcef" strokeWidth="0.5" />
        </g>

        {/* repères haut */}
        <g stroke="#cfeffa" strokeWidth="0.9" opacity="0.4">
          <line x1="185" y1="26" x2="185" y2="42" />
          <line x1="200" y1="20" x2="200" y2="46" />
          <line x1="215" y1="26" x2="215" y2="42" />
        </g>
        <g fill="#e05252" opacity="0.55">
          <rect x="181" y="48" width="4" height="4" transform="rotate(45 183 50)" />
          <rect x="215" y="48" width="4" height="4" transform="rotate(45 217 50)" />
        </g>

        {/* repères bas (miroir) */}
        <g stroke="#cfeffa" strokeWidth="0.9" opacity="0.4">
          <line x1="185" y1="774" x2="185" y2="758" />
          <line x1="200" y1="780" x2="200" y2="754" />
          <line x1="215" y1="774" x2="215" y2="758" />
        </g>
        <g fill="#e05252" opacity="0.55">
          <rect x="181" y="752" width="4" height="4" transform="rotate(45 183 754)" />
          <rect x="215" y="752" width="4" height="4" transform="rotate(45 217 754)" />
        </g>
      </svg>

      <div style={{ position: 'absolute', top: 'max(70px, calc(env(safe-area-inset-top) + 46px))', left: '20px', fontSize: '10px', letterSpacing: '0.15em', color: '#6ee7ff', opacity: 0.55, fontFamily: 'monospace' }}>
        ● ORION VISION
      </div>
    </div>
  );
}
