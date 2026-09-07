import { useEffect, useRef } from 'react';

export default function IntroOverlay({ onDismiss }) {
  const enterRef = useRef(null);

  useEffect(() => {
    enterRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onDismiss]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B0E14]/85 px-6 backdrop-blur-sm"
    >
      <div className="max-w-lg text-center">
        <p className="text-xs font-medium tracking-[0.14em] text-[#C9A24B]">A map, not a resume</p>
        <h1
          id="intro-title"
          className="mt-4 text-5xl leading-tight text-[#F2EFE6] sm:text-6xl"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Avi Kathuria
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-[#B9B4A6]">
          Software engineer, technical lead, traveler, photographer, and Level 8 Local Guide.
          Drag to look around, then tap a star to read its story and visit its destination.
        </p>
        <button
          ref={enterRef}
          type="button"
          onClick={onDismiss}
          className="mt-9 rounded-full px-8 py-3 text-sm font-medium text-[#241a06]"
          style={{ background: '#C9A24B' }}
        >
          Enter
        </button>
      </div>
    </div>
  );
}
