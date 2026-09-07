import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Gamepad2, Github, FolderGit2, Boxes, Briefcase, Mic,
  Mountain, Facebook, Youtube, BookOpen, MapPin, Route,
} from 'lucide-react';
import { NODES, EXTRA_EDGES, CLUSTER_META, BASE_W, BASE_H, CORE_POS } from '../data/universe.js';

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 1.8;

// One icon per satellite star, kept close to what each destination actually
// is (YouTube gets the YouTube glyph, Google Maps gets a pin, and so on).
const NODE_ICONS = {
  pokedex: Gamepad2,
  engineering: Github,
  opensource: FolderGit2,
  'metals-catalog': Boxes,
  portfolio: Briefcase,
  'alexa-skills': Mic,
  travel: Mountain,
  'astonishing-facts': Facebook,
  youtube: Youtube,
  blog: BookOpen,
  'google-maps': MapPin,
  journey: Route,
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function computeFit() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const zoom = clamp(Math.min(vw / (BASE_W * 0.92), vh / (BASE_H * 0.92)), MIN_ZOOM, 0.85);
  // Keep the constellation away from the identity plate in the lower-left.
  const focusX = vw < 700 ? vw * 0.62 : vw * 0.66;
  const focusY = vw < 700 ? vh * 0.4 : vh * 0.38;
  return {
    zoom,
    panX: focusX - CORE_POS.x * zoom,
    panY: focusY - CORE_POS.y * zoom,
  };
}

export default function UniverseGraph({ onSelect, activeId, paused }) {
  const stageRef = useRef(null);
  const [view, setView] = useState(computeFit);
  const [spotlightId, setSpotlightId] = useState(null);
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0, moved: false });

  const fitToViewport = useCallback(() => setView(computeFit()), []);

  useEffect(() => {
    const onResize = () => setView(computeFit());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Every so often, quietly highlight a random star for a few seconds, then
  // let it fade back to normal — a small "did you notice this?" nudge
  // rather than anything that demands attention.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let hideTimeout;
    let cycleTimeout;

    function cycle() {
      const wait = 7000 + Math.random() * 6000;
      cycleTimeout = setTimeout(() => {
        if (!paused) {
          const candidates = NODES.filter((n) => n.id !== activeId);
          const pick = candidates[Math.floor(Math.random() * candidates.length)];
          if (pick) {
            setSpotlightId(pick.id);
            hideTimeout = setTimeout(() => setSpotlightId(null), 2800);
          }
        }
        cycle();
      }, wait);
    }
    cycle();
    return () => {
      clearTimeout(cycleTimeout);
      clearTimeout(hideTimeout);
    };
  }, [paused, activeId]);

  const onPointerDown = (e) => {
    if (paused) return;
    dragState.current = {
      dragging: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startPanX: view.panX,
      startPanY: view.panY,
    };
    stageRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = dragState.current;
    if (!d.dragging) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true;
    setView((v) => ({ ...v, panX: d.startPanX + dx, panY: d.startPanY + dy }));
  };

  const onPointerUp = (e) => {
    dragState.current.dragging = false;
    // Always give up capture on release so a stray drag can never leave the
    // stage silently swallowing the next click meant for something else
    // (like the Help "Enter" button or a panel above it).
    if (e?.pointerId != null) stageRef.current?.releasePointerCapture?.(e.pointerId);
  };

  const onWheel = (e) => {
    if (paused) return;
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setView((v) => {
      const newZoom = clamp(v.zoom + delta, MIN_ZOOM, MAX_ZOOM);
      // zoom toward viewport center so the graph doesn't drift
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const worldX = (vw / 2 - v.panX) / v.zoom;
      const worldY = (vh / 2 - v.panY) / v.zoom;
      return {
        zoom: newZoom,
        panX: vw / 2 - worldX * newZoom,
        panY: vh / 2 - worldY * newZoom,
      };
    });
  };

  const zoomBy = (delta) => {
    setView((v) => {
      const newZoom = clamp(v.zoom + delta, MIN_ZOOM, MAX_ZOOM);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const worldX = (vw / 2 - v.panX) / v.zoom;
      const worldY = (vh / 2 - v.panY) / v.zoom;
      return {
        zoom: newZoom,
        panX: vw / 2 - worldX * newZoom,
        panY: vh / 2 - worldY * newZoom,
      };
    });
  };

  const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div
      ref={stageRef}
      className={`fixed inset-0 z-10 touch-none select-none ${paused ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
    >
      <div
        style={{
          transform: `translate(${view.panX}px, ${view.panY}px) scale(${view.zoom})`,
          transformOrigin: '0 0',
          width: BASE_W,
          height: BASE_H,
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        {/* constellation lines */}
        <svg
          width={BASE_W}
          height={BASE_H}
          className="absolute inset-0 overflow-visible"
          style={{ pointerEvents: 'none' }}
        >
          {NODES.map((n) => (
            <line
              key={`spoke-${n.id}`}
              x1={CORE_POS.x}
              y1={CORE_POS.y}
              x2={n.x}
              y2={n.y}
              stroke={CLUSTER_META[n.cluster].color}
              strokeOpacity={activeId === n.id ? 0.85 : 0.28}
              strokeWidth={activeId === n.id ? 2 : 1}
            />
          ))}
          {EXTRA_EDGES.map(([a, b], i) => {
            const na = nodeById[a];
            const nb = nodeById[b];
            if (!na || !nb) return null;
            return (
              <line
                key={`edge-${i}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke="#C9A24B"
                strokeOpacity={0.18}
                strokeWidth={1}
                strokeDasharray="2 5"
              />
            );
          })}
        </svg>

        {/* core node */}
        <button
          type="button"
          aria-label="Avi Kathuria — open profile"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onSelect('avi');
          }}
          className="absolute flex flex-col items-center justify-center overflow-hidden rounded-full text-center"
          style={{
            left: CORE_POS.x - 106,
            top: CORE_POS.y - 106,
            width: 212,
            height: 212,
            background: '#0f2233',
            boxShadow: activeId === 'avi'
              ? '0 0 0 4px rgba(201,162,75,0.5), 0 0 60px rgba(201,162,75,0.55)'
              : '0 0 40px rgba(201,162,75,0.35)',
          }}
        >
          <svg viewBox="0 0 212 212" className="absolute inset-0 h-full w-full" style={{ opacity: 0.6 }} aria-hidden="true">
            <defs>
              <radialGradient id="globeOcean" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#a8dcec" />
                <stop offset="55%" stopColor="#2f7ea6" />
                <stop offset="100%" stopColor="#123a52" />
              </radialGradient>
            </defs>
            <circle cx="106" cy="106" r="106" fill="url(#globeOcean)" />
            <path d="M35 65 Q55 42 90 55 Q112 48 104 78 Q128 84 112 106 Q98 128 66 116 Q38 124 44 96 Q18 88 35 65Z" fill="#B9A15A" />
            <path d="M135 48 Q158 40 168 68 Q182 82 160 98 Q152 118 132 104 Q124 82 135 48Z" fill="#8fae5c" />
            <path d="M70 150 Q95 140 116 156 Q124 172 102 178 Q80 182 72 165Z" fill="#B9A15A" />
            <path d="M150 130 Q172 126 176 148 Q166 162 148 152Z" fill="#8fae5c" />
            <ellipse cx="106" cy="106" rx="106" ry="32" fill="none" stroke="#F4E7C1" strokeOpacity="0.18" strokeWidth="1.2" />
            <ellipse cx="106" cy="106" rx="48" ry="106" fill="none" stroke="#F4E7C1" strokeOpacity="0.14" strokeWidth="1.2" />
          </svg>
          <span
            className="relative font-serif text-[1.08rem] leading-none text-[#F8F1DE]"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}
          >
            Avi Kathuria
          </span>
          <span
            className="relative mt-2 text-[10px] uppercase tracking-[0.15em] text-[#F8F1DE]/90"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
          >
            Explore the map
          </span>
        </button>

        {NODES.map((n) => {
          const color = CLUSTER_META[n.cluster].color;
          const isActive = activeId === n.id;
          const isSpotlighted = spotlightId === n.id;
          const Icon = NODE_ICONS[n.id];
          return (
            <button
              key={n.id}
              type="button"
              aria-label={`${n.title} — open`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(n.id);
              }}
              className="absolute flex flex-col items-center justify-center rounded-full transition-transform hover:scale-110"
              style={{
                left: n.x - n.r,
                top: n.y - n.r,
                width: n.r * 2,
                height: n.r * 2,
                background: `radial-gradient(circle at 35% 30%, ${color}dd, ${color}88 70%)`,
                border: `1.5px solid ${color}`,
                boxShadow: isActive ? `0 0 0 4px ${color}55, 0 0 30px ${color}88` : `0 0 16px ${color}44`,
              }}
            >
              {isSpotlighted && (
                <span
                  className="node-aura"
                  style={{ '--aura-color': color }}
                  aria-hidden="true"
                />
              )}
              {Icon && <Icon size={n.r} strokeWidth={1.75} className="text-[#0B0E14]/80" aria-hidden="true" />}
              <span
                className="absolute whitespace-nowrap font-sans text-[13px] font-medium text-[#F2EFE6]"
                style={{ top: n.r * 2 + 8 }}
              >
                {n.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* zoom controls */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => zoomBy(0.15)}
          aria-label="Zoom in"
          className="h-11 w-11 rounded-full border border-[#C9A24B]/40 bg-[#0B0E14]/80 text-lg text-[#EDE6D6] backdrop-blur hover:border-[#C9A24B]"
        >
          +
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => zoomBy(-0.15)}
          aria-label="Zoom out"
          className="h-11 w-11 rounded-full border border-[#C9A24B]/40 bg-[#0B0E14]/80 text-lg text-[#EDE6D6] backdrop-blur hover:border-[#C9A24B]"
        >
          −
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={fitToViewport}
          aria-label="Recenter"
          className="h-11 w-11 rounded-full border border-[#C9A24B]/40 bg-[#0B0E14]/80 text-xs text-[#EDE6D6] backdrop-blur hover:border-[#C9A24B]"
        >
          ⟲
        </button>
      </div>
    </div>
  );
}
