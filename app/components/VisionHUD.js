'use client';

export default function VisionHUD() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes orionSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orionSpinRev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes orionScan { 0% { transform: translateY(-10%); opacity: 0; } 10% { opacity: 0.5; } 90% { opacity: 0.5; } 100% { transform: translateY(110%); opacity: 0; } }
        @keyframes orionPulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.9; } }
        .orion-ring { transform-origin: center; transform-box: fill-box; }
        .orion-ring-a { animation: orionSpin 18s linear infinite; }
        .orion-ring-b { animation: orionSpinRev 26s linear infinite; }
        .orion-dot { animation: orionPulse 2.4s ease-in-out infinite; }
      `}</style>

      <svg viewBox="0 0 400 800" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="orionDots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#6ee7ff" opacity="0.25" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="400" height="800" fill="url(#orionDots)" opacity="0.4" />

        <g className="orion-ring orion-ring-a" opacity="0.35">
          <circle cx="200" cy="380" r="150" fill="none" stroke="#6ee7ff" strokeWidth="0.6" strokeDasharray="2 10" />
        </g>
        <g className="orion-ring orion-ring-b" opacity="0.25">
          <circle cx="200" cy="380" r="190" fill="none" stroke="#6ee7ff" strokeWidth="0.6" strokeDasharray="1 14" />
        </g>

        {[[16, 16, 1, 1], [384, 16, -1, 1], [16, 764, 1, -1], [384, 764, -1, -1]].map(([x, y, dx, dy], i) => (
          <g key={i} stroke="#6ee7ff" strokeWidth="1.6" opacity="0.75">
            <line x1={x} y1={y} x2={x + 26 * dx} y2={y} />
            <line x1={x} y1={y} x2={x} y2={y + 26 * dy} />
          </g>
        ))}

        <g stroke="#6ee7ff" strokeWidth="1" opacity="0.6">
          <line x1="188" y1="30" x2="188" y2="46" />
          <line x1="200" y1="26" x2="200" y2="50" />
          <line x1="212" y1="30" x2="212" y2="46" />
        </g>

        <circle className="orion-dot" cx="200" cy="380" r="2.5" fill="#6ee7ff" />

        <rect x="0" y="0" width="400" height="18" fill="#6ee7ff" opacity="0.25" style={{ animation: 'orionScan 5s linear infinite' }} />
      </svg>

      <div style={{ position: 'absolute', top: 'max(70px, calc(env(safe-area-inset-top) + 46px))', left: '20px', fontSize: '10px', letterSpacing: '0.15em', color: '#6ee7ff', opacity: 0.7, fontFamily: 'monospace' }}>
        ● ORION VISION
      </div>
    </div>
  );
}
