import { useEffect, useRef } from 'react';

// A quiet, non-interactive starfield. Stars twinkle in place — they do not
// drift — so they read as sky rather than as decorative confetti.
export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame;
    let stars = [];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.round((canvas.width * canvas.height) / 3600);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 0.65 + 0.18,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.004 + 0.003,
        sparkle: Math.random() > 0.86,
      }));
    }

    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const twinkle = prefersReducedMotion ? 0.85 : 0.5 + 0.5 * Math.sin(s.phase + t * s.speed);
        ctx.beginPath();
        ctx.fillStyle = `rgba(237, 230, 214, ${0.12 + twinkle * 0.78})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.sparkle && twinkle > 0.78) {
          const glow = s.r * 5;
          ctx.strokeStyle = `rgba(244, 231, 193, ${(twinkle - 0.72) * 0.8})`;
          ctx.lineWidth = 0.45;
          ctx.beginPath();
          ctx.moveTo(s.x - glow, s.y);
          ctx.lineTo(s.x + glow, s.y);
          ctx.moveTo(s.x, s.y - glow);
          ctx.lineTo(s.x, s.y + glow);
          ctx.stroke();
        }
      }
      if (!prefersReducedMotion) frame = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(draw);
    if (prefersReducedMotion) draw(0);

    return () => {
      window.removeEventListener('resize', resize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />;
}
