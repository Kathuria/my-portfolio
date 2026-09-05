import { useCallback, useEffect, useRef, useState } from 'react';
import { NODES, EXTRA_EDGES, CLUSTER_META, BASE_W, BASE_H, CORE_POS } from '../data/universe.js';

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 1.8;

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

export default function UniverseGraph({ onSelect, activeId }) {
  const stageRef = useRef(null);
  const [view, setView] = useState(computeFit);
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0, moved: false });

  const fitToViewport = useCallback(() => setView(computeFit()), []);

  useEffect(() => {
    const onResize = () => setView(computeFit());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onPointerDown = (e) => {
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

  const onPointerUp = () => {
    dragState.current.dragging = false;
  };

  const onWheel = (e) => {
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
      className="fixed inset-0 z-10 touch-none cursor-grab active:cursor-grabbing select-none"
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
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onSelect('avi');
          }}
          className="absolute flex flex-col items-center justify-center rounded-full text-center"
          style={{
            left: CORE_POS.x - 106,
            top: CORE_POS.y - 106,
            width: 212,
            height: 212,
            background: 'radial-gradient(circle at 35% 30%, #F4E7C1, #C9A24B 65%, #8a6c2c 100%)',
            boxShadow: activeId === 'avi'
              ? '0 0 0 4px rgba(201,162,75,0.5), 0 0 60px rgba(201,162,75,0.55)'
              : '0 0 40px rgba(201,162,75,0.35)',
          }}
        >
          <span className="font-serif text-[2.15rem] font-semibold leading-none text-[#241a06]">AviVerse</span>
          <span className="mt-1 font-serif text-[1.08rem] leading-none text-[#241a06]">Avi Kathuria</span>
          <span className="mt-2 text-[10px] uppercase tracking-[0.15em] text-[#3a2c0d]">Explore the map</span>
        </button>

        {NODES.map((n) => {
          const color = CLUSTER_META[n.cluster].color;
          const isActive = activeId === n.id;
          return (
            <button
              key={n.id}
              type="button"
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
