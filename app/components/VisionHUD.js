'use client';

function ladder(xStart, xEnd, y) {
  const ticks = [];
  for (let x = xStart; x <= xEnd; x += 13) {
    ticks.push(<line key={x} x1={x} y1={y - 5} x2={x} y2={y + 5} />);
  }
  return (
    <g stroke="#e8f6fb" strokeWidth="1" opacity="0.35">
      <line x1={xStart} y1={y} x2={xEnd} y2={y} />
      {ticks}
    </g>
  );
}

function reticle(flip) {
  const sign = flip ? -1 : 1;
  const y0 = flip ? 800 : 0;
  const yV = flip ? 762 : 38;
  const yTick = (t) => yV + sign * -1 * 0; // placeholder unused
  return (
    <g>
      <line x1="200" y1={y0} x2="200" y2={yV} stroke="#e05252" strokeWidth="1" opacity="0.5" />
      <line x1="200" y1={yV} x2="148" y2={y0} stroke="#e8f6fb" strokeWidth="0.9" opacity="0.4" />
      <line x1="200" y1={yV} x2="252" y2={y0} stroke="#e8f6fb" strokeWidth="0.9" opacity="0.4" />
      <g stroke="#e8f6fb" strokeWidth="0.9" opacity="0.4">
        <line x1="179" y1={flip ? 777 : 23} x2="172" y2={flip ? 783 : 17} />
        <line x1="221" y1={flip ? 777 : 23} x2="228" y2={flip ? 783 : 17} />
        <line x1="161" y1={flip ? 790 : 10} x2="153" y2={flip ? 796 : 4} />
        <line x1="239" y1={flip ? 790 : 10} x2="247" y2={flip ? 796 : 4} />
      </g>
      <g fill="#e05252" opacity="0.6">
        <rect x="190" y={flip ? 748 : 46} width="4.5" height="4.5" transform={`rotate(45 192 ${flip ? 750 : 48})`} />
        <rect x="205" y={flip ? 748 : 46} width="4.5" height="4.5" transform={`rotate(45 207 ${flip ? 750 : 48})`} />
        <circle cx="196" cy={flip ? 758 : 56} r="1.6" />
        <circle cx="204" cy={flip ? 758 : 56} r="1.6" />
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
        @keyframes orionBreathe { 0%, 100% { opacity: 0.22; } 50% { opacity: 0.42; } }
        .orion-sway-a { transform-origin: 200px 400px; animation: orionSway 11s ease-in-out infinite; }
        .orion-sway-b { transform-origin: 200px 400px; animation: orionSwayRev 14s ease-in-out infinite; }
        .orion-breathe { animation: orionBreathe 4s ease-in-out infinite; }
      `}</style>

      <svg viewBox="0 0 400 800" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>

        {/* croix diagonale plein cadre */}
        <g stroke="#e8f6fb" strokeWidth="0.6" opacity="0.22">
          <line x1="0" y1="0" x2="400" y2="800" />
          <line x1="400" y1="0" x2="0" y2="800" />
        </g>

        {/* halo de points autour de l'anneau */}
        <g className="orion-breathe">
          <circle cx="200" cy="400" r="172" fill="none" stroke="#a9e8f5" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
          <circle cx="200" cy="400" r="185" fill="none" stroke="#a9e8f5" strokeWidth="2" strokeDasharray="1 9" strokeLinecap="round" />
        </g>

        {/* anneau épais segmenté, blanc + cyan qui se complètent */}
        <g className="orion-sway-a">
          <circle cx="200" cy="400" r="150" fill="none" stroke="#f2fbff" strokeWidth="3.4" opacity="0.5" strokeDasharray="55 22 38 26 48 24 30 30" />
          <circle cx="200" cy="400" r="150" fill="none" stroke="#5ec8e8" strokeWidth="3.4" opacity="0.45" strokeDasharray="30 30 48 24 38 26 55 22" strokeDashoffset="140" />
        </g>

        {/* anneau fin intérieur */}
        <g className="orion-sway-b" opacity="0.25">
          <circle cx="200" cy="400" r="131" fill="none" stroke="#5ec8e8" strokeWidth="0.7" />
        </g>

        {/* échelles horizontales gauche/droite */}
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
