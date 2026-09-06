import { useEffect, useRef } from 'react';

const WAVES = [
  'M-80 180 C180 40 350 315 610 165 S1050 20 1360 175 S1710 300 1800 105',
  'M-100 440 C120 300 355 555 630 405 S1070 245 1400 430 S1680 520 1810 350',
  'M-90 715 C180 555 355 830 610 680 S1080 515 1360 700 S1660 835 1810 625',
];

// Avi's name in the languages of the places and people this site touches.
// Left side of each pair is only a label for future editors — the string on
// the right is the one that renders, exactly as given, unchanged.
const NAMES = [
  ['Hindi / Marathi', 'अवी कथूरिया'],
  ['English', 'Avi Kathuria'],
  ['Bengali', 'অমি কথুরিয়া'],
  ['Mandarin', '阿维·卡图里亚'],
  ['Telugu', 'అవి కథూరియా'],
  ['Russian', 'Ави Катурия'],
  ['Tamil', 'அவி கதுரியா'],
  ['Arabic', 'آفي كاثوريا'],
  ['Gujarati', 'અવી કથુરિયા'],
  ['Kannada', 'ಅವಿ ಕಥೂರಿಯಾ'],
  ['Urdu', 'اوی کتھوریا'],
  ['Odia', 'ଅଭି କଥୁରିଆ'],
  ['Malayalam', 'അവി കതൂരിയ'],
].map(([, value]) => value);

// A handful of lanes, each slowly and continuously drifting upward (never
// reversing — no boomerang) and cycling through the name list over time, so
// only a few are ever on screen at once and each stays put long enough to
// actually read, following the same "few things, slow, legible" spirit as
// tholman.com's background rather than a fast dense ticker.
const LANES = [
  { x: '8%', duration: 46, delay: -6 },
  { x: '32%', duration: 58, delay: -30 },
  { x: '58%', duration: 50, delay: -18 },
  { x: '82%', duration: 62, delay: -42 },
];

function NameLane({ x, duration, delay, startIndex }) {
  const ref = useRef(null);
  const indexRef = useRef(startIndex);

  useEffect(() => {
    if (ref.current) ref.current.textContent = NAMES[indexRef.current % NAMES.length];
  }, []);

  const onIteration = () => {
    indexRef.current += 1;
    if (ref.current) ref.current.textContent = NAMES[indexRef.current % NAMES.length];
  };

  return (
    <span
      ref={ref}
      className="name-lane"
      style={{ '--lane-x': x, '--lane-duration': `${duration}s`, '--lane-delay': `${delay}s` }}
      onAnimationIteration={onIteration}
    />
  );
}

export default function BackgroundStory() {
  const textPathRefs = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    // Each line drifts slowly in one constant direction and wraps around —
    // no back-and-forth. Percent-per-second keeps it independent of frame
    // rate; a full loop takes several minutes, which is what makes it
    // readable instead of a fast ticker.
    const speeds = [0.09, -0.06, 0.12]; // % per second, mixed directions across lines
    const offsets = [7, 15, 22];
    let last = performance.now();
    let frame;

    function tick(now) {
      const dt = (now - last) / 1000;
      last = now;
      textPathRefs.current.forEach((el, i) => {
        if (!el) return;
        offsets[i] = ((offsets[i] + speeds[i] * dt) % 100 + 100) % 100;
        el.setAttribute('startOffset', `${offsets[i]}%`);
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
                {index === 0 && 'BUILD · REACT · TYPESCRIPT · NODE.JS · AWS'}
                {index === 1 && 'EXPLORE · LEVEL 8 LOCAL GUIDE · 52M+ PHOTO VIEWS'}
                {index === 2 && 'SHARE · TRAVELER · PHOTOGRAPHER · AI ENTHUSIAST'}
              </textPath>
            </text>
          </g>
        ))}
      </svg>

      {LANES.map((lane, i) => (
        <NameLane key={lane.x} x={lane.x} duration={lane.duration} delay={lane.delay} startIndex={i * 3} />
      ))}

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
