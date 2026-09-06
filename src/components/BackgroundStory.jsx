import { useEffect, useRef } from 'react';

const WAVES = [
  'M-80 180 C180 40 350 315 610 165 S1050 20 1360 175 S1710 300 1800 105',
  'M-100 440 C120 300 355 555 630 405 S1070 245 1400 430 S1680 520 1810 350',
  'M-90 715 C180 555 355 830 610 680 S1080 515 1360 700 S1660 835 1810 625',
];

export default function BackgroundStory() {
  const textPathRefs = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Nudge each line of text slowly along its own wave path so the
    // background keeps a quiet sense of motion, not just static labels.
    const baseOffsets = [7, 15, 22];
    const speeds = [0.0025, -0.0018, 0.0032]; // percent per ms, opposing directions
    let frame;

    function tick(t) {
      textPathRefs.current.forEach((el, i) => {
        if (!el) return;
        const span = 40; // drift within a 40%-wide band so text never fully exits
        const offset = baseOffsets[i] + span * 0.5 * Math.sin(t * speeds[i]);
        el.setAttribute('startOffset', `${offset}%`);
      });
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1720 1000" preserveAspectRatio="none">
        <defs>
          {WAVES.map((path, index) => <path key={`guide-${index}`} id={`story-wave-${index}`} d={path} />)}
        </defs>
        {WAVES.map((path, index) => (
          <g key={path}>
            <path
              d={path}
              fill="none"
              stroke={index === 1 ? '#C9A24B' : '#7B9F9B'}
              strokeDasharray={index === 1 ? '2 13' : '1 11'}
              strokeOpacity={index === 1 ? '0.25' : '0.17'}
              strokeWidth="1"
            />
            <text className="story-path-text">
              <textPath
                ref={(el) => { textPathRefs.current[index] = el; }}
                href={`#story-wave-${index}`}
                startOffset={index === 1 ? '15%' : '7%'}
              >
                {index === 0 && 'BUILD · REACT · TYPESCRIPT · NODE.JS · NEXT.JS · AWS · GRAPHQL · MICROSERVICES · CI/CD'}
                {index === 1 && 'EXPLORE · LEVEL 8 LOCAL GUIDE · 10,000+ CONTRIBUTIONS · 52M+ PHOTO VIEWS · PLACES DOCUMENTED'}
                {index === 2 && 'SHARE · TRAVELER · PHOTOGRAPHER · YOUTUBE · TRIBUTE TO INDIA · AI ENTHUSIAST'}
              </textPath>
            </text>
          </g>
        ))}
      </svg>

      <div className="universe-plate">
        <div className="universe-scrim" />
        <p className="universe-kicker">A map, not a resume</p>
        <h1>
          <span>Avi</span>
          <span>Verse</span>
        </h1>
        <p className="universe-byline">Avi Kathuria · engineer, traveler, explorer</p>
      </div>

    </div>
  );
}
