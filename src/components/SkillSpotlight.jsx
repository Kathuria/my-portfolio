import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { SKILLS } from '../data/universe.js';

// A quiet, occasional callout — cycles through Avi's real skill list (see
// universe.js for the source) and fades in/out in the corner, timed
// independently from the node spotlight so it never blocks anything.
export default function SkillSpotlight({ hidden }) {
  const [visible, setVisible] = useState(false);
  const [skill, setSkill] = useState(SKILLS[0]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let showTimeout;
    let hideTimeout;
    let cancelled = false;

    function cycle() {
      const wait = 8000 + Math.random() * 6000;
      showTimeout = setTimeout(() => {
        if (cancelled) return;
        setSkill(SKILLS[Math.floor(Math.random() * SKILLS.length)]);
        setVisible(true);
        hideTimeout = setTimeout(() => {
          if (!cancelled) setVisible(false);
        }, 3200);
        cycle();
      }, wait);
    }

    cycle();
    return () => {
      cancelled = true;
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-6 left-6 z-20 flex items-center gap-2 rounded-full border border-[#C9A24B]/30 bg-[#0B0E14]/75 px-4 py-2 text-sm text-[#EDE6D6] backdrop-blur transition-all duration-500 ${
        visible && !hidden ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <Sparkles size={14} className="text-[#C9A24B]" />
      <span>{skill}</span>
    </div>
  );
}
