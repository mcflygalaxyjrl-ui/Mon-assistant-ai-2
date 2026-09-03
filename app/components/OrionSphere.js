'use client';
import { useRef, useEffect } from 'react';

export default function OrionSphere({ speaking = false, size = 280 }) {
  const canvasRef = useRef(null);
  const speakingRef = useRef(speaking);

  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const POINT_COUNT = 900;
    const radius = size * 0.34;

    const points = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < POINT_COUNT; i++) {
      const y = 1 - (i / (POINT_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      points.push({
        baseX: Math.cos(theta) * radiusAtY,
        baseY: y,
        baseZ: Math.sin(theta) * radiusAtY,
        jitter: 0.06 + Math.random() * 0.10,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.8,
      });
    }

    let angle = 0;
    let frameId;
    const start = performance.now();

    function draw(now) {
      const t = (now - start) / 1000;
      const isSpeaking = speakingRef.current;
      ctx.clearRect(0, 0, size, size);

      angle += isSpeaking ? 0.010 : 0.004;
      const tilt = Math.sin(t * 0.2) * 0.15;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      const pulseAmp = isSpeaking ? 0.16 : 0.035;
      const pulseSpeedMul = isSpeaking ? 3.2 : 1;

      const projected = [];
      for (const p of points) {
        const breathe = 1 + Math.sin(t * p.speed * pulseSpeedMul + p.phase) * (p.jitter * (pulseAmp / 0.06));
        const x = p.baseX * breathe;
        const y = p.baseY * breathe;
        const z = p.baseZ * breathe;

        const rx = x * cosA - z * sinA;
        let rz = x * sinA + z * cosA;
        const ry = y * cosT - rz * sinT;
        rz = y * sinT + rz * cosT;

        const perspective = 1 / (2.4 - rz);
        const screenX = size / 2 + rx * radius * perspective;
        const screenY = size / 2 + ry * radius * perspective;
        const depth = (rz + 1) / 2;

        projected.push({ screenX, screenY, depth });
      }

      projected.sort((a, b) => a.depth - b.depth);

      for (const pt of projected) {
        const r = 0.6 + pt.depth * 1.6;
        const alpha = 0.15 + pt.depth * 0.75;
        ctx.beginPath();
        ctx.arc(pt.screenX, pt.screenY, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110, 231, 255, ${alpha})`;
        ctx.fill();
      }

      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [size]);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
}
