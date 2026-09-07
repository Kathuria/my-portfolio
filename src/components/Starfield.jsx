import { useEffect, useRef } from 'react';

// A quiet, non-interactive starfield. Stars twinkle in place — they do not
// drift — so they read as sky rather than as decorative confetti. A rare
// shooting star crosses every so often to keep the background feeling alive
// without ever demanding attention.
export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let frame;
    let stars = [];
    let shootingStars = [];
    let lastTs = null;

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

    function spawnShootingStar() {
      const fromLeft = Math.random() > 0.5;
      const startX = fromLeft ? Math.random() * canvas.width * 0.35 : canvas.width - Math.random() * canvas.width * 0.35;
      const startY = Math.random() * canvas.height * 0.4;
      const dir = fromLeft ? 1 : -1;
      return {
        x: startX,
        y: startY,
        vx: dir * (420 + Math.random() * 180),
        vy: 230 + Math.random() * 130,
        life: 0,
        maxLife: 0.85 + Math.random() * 0.35,
      };
    }

    function draw(t) {
      const dt = lastTs ? Math.min((t - lastTs) / 1000, 0.05) : 0;
      lastTs = t;

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

      if (!prefersReducedMotion) {
        // Rare — roughly once every ~15s on average, never more than one
        // at a time, so it reads as a special moment rather than a loop.
        if (shootingStars.length === 0 && Math.random() < dt * 0.065) {
          shootingStars.push(spawnShootingStar());
        }

        shootingStars = shootingStars.filter((star) => {
          star.x += star.vx * dt;
          star.y += star.vy * dt;
          star.life += dt;
          const alpha = Math.max(0, 1 - star.life / star.maxLife);
          if (alpha <= 0 || star.x < -50 || star.x > canvas.width + 50 || star.y > canvas.height + 50) {
            return false;
          }
          const tailX = star.x - star.vx * 0.09;
          const tailY = star.y - star.vy * 0.09;
          const grad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
          grad.addColorStop(0, 'rgba(244, 231, 193, 0)');
          grad.addColorStop(1, `rgba(244, 231, 193, ${alpha})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(star.x, star.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 250, 235, ${alpha})`;
          ctx.arc(star.x, star.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
          return true;
        });

        frame = requestAnimationFrame(draw);
      }
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
