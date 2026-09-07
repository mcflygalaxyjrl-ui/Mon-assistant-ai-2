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
        @keyframes orionSway { 0% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } 100% { transform: rotate(-5deg); } }
        @keyframes orionSwayRev { 0% { transform: rotate(5deg); } 50% { transform: rotate(-5deg); } 100% { transform: rotate(5deg); } }
        .orion-sway-a { transform-origin: 200px 400px; animation: orionSway 9s ease-in-out infinite; }
        .orion-sway-b { transform-origin: 200px 400px; animation: orionSwayRev 12s ease-in-out infinite; }
      `}</style>

      <svg viewBox="0 0 400 800" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>

        {/* lignes diagonales depuis les coins */}
        <g stroke="#cfeffa" strokeWidth="0.5" opacity="0.22">
          <line x1="0" y1="0" x2="230" y2="230" />
          <line x1="0" y1="0" x2="130" y2="330" />
          <line x1="400" y1="0" x2="170" y2="230" />
          <line x1="400" y1="0" x2="270" y2="330" />
          <line x1="0" y1="800" x2="230" y2="570" />
          <line x1="0" y1="800" x2="130" y2="470" />
          <line x1="400" y1="800" x2="170" y2="570" />
          <line x1="400" y1="800" x2="270" y2="470" />
        </g>

        {/* arcs en pointillés dans les coins */}
        {cornerArc(30, 30, 60, 0, 90, 6, 0)}
        {cornerArc(370, 30, 60, 90, 180, 6, 0.3)}
        {cornerArc(30, 770, 60, 270, 360, 6, 0.6)}
        {cornerArc(370, 770, 60, 180, 270, 6, 0.9)}
        {cornerArc(30, 30, 95, 0, 90, 5, 1.1)}
        {cornerArc(370, 30, 95, 90, 180, 5, 1.4)}
        {cornerArc(30, 770, 95, 270, 360, 5, 1.7)}
        {cornerArc(370, 770, 95, 180, 270, 5, 2.0)}

        {/* arcs de cercle qui oscillent doucement */}
        <g className="orion-sway-a" opacity="0.28">
          <circle cx="200" cy="400" r="150" fill="none" stroke="#6ee7ff" strokeWidth="0.6" strokeDasharray="90 40" />
        </g>
        <g className="orion-sway-b" opacity="0.2">
          <circle cx="200" cy="400" r="185" fill="none" stroke="#6ee7ff" strokeWidth="0.5" strokeDasharray="70 60" />
        </g>

        {/* repères haut */}
        <g stroke="#cfeffa" strokeWidth="0.9" opacity="0.4">
          <line x1="185" y1="26" x2="185" y2="42" />
          <line x1="200" y1="20" x2="200" y2="46" />
          <line x1="215" y1="26" x2="215" y2="42" />
        </g>
        <g fill="#e05252" opacity="0.55">
          <rect x="181" y="50" width="4" height="4" transform="rotate(45 183 52)" />
          <rect x="215" y="50" width="4" height="4" transform="rotate(45 217 52)" />
        </g>

        {/* repères bas (miroir) */}
        <g stroke="#cfeffa" strokeWidth="0.9" opacity="0.4">
          <line x1="185" y1="774" x2="185" y2="758" />
          <line x1="200" y1="780" x2="200" y2="754" />
          <line x1="215" y1="774" x2="215" y2="758" />
        </g>
        <g fill="#e05252" opacity="0.55">
          <rect x="181" y="746" width="4" height="4" transform="rotate(45 183 748)" />
          <rect x="215" y="746" width="4" height="4" transform="rotate(45 217 748)" />
        </g>
      </svg>

      <div style={{ position: 'absolute', top: 'max(70px, calc(env(safe-area-inset-top) + 46px))', left: '20px', fontSize: '10px', letterSpacing: '0.15em', color: '#6ee7ff', opacity: 0.55, fontFamily: 'monospace' }}>
        ● ORION VISION
      </div>
    </div>
  );
}
