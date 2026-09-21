import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { Plane, Globe as GlobeIcon } from 'lucide-react';

// Lazy load the Globe component for code splitting
const Globe = lazy(() => import('react-globe.gl'));

/**
 * Flight Memory Component - Drawer Version
 * 
 * Renders within the DetailPanel drawer with:
 * - 3D globe visualization
 * - Auto-replay on mount
 * - US-centered view
 * - Compact metrics
 */
export default function FlightMemory({ color }) {
  const [flightData, setFlightData] = useState(null);
  const [useKm, setUseKm] = useState(true);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const globeEl = useRef();
  const containerRef = useRef();

  // Load flight data
  useEffect(() => {
    import('../data/flights.generated.json')
      .then(module => {
        setFlightData(module.default);
        // Auto-start replay after data loads
        setTimeout(() => setIsReplaying(true), 500);
      })
      .catch(err => console.error('Failed to load flight data:', err));
  }, []);

  // Set initial globe position to focus on USA (center of most flights)
  useEffect(() => {
    if (globeEl.current && flightData) {
      // Point camera at USA (latitude 37.09, longitude -95.71)
      globeEl.current.pointOfView(
        {
          lat: 37.09,
          lng: -95.71,
          altitude: 2.5
        },
        1000
      );
      
      // Enable gentle auto-rotate
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.2;
      globeEl.current.controls().enableZoom = true;
    }
  }, [flightData]);

  // Replay animation with smooth progression
  useEffect(() => {
    if (!isReplaying || !flightData) return;

    const interval = setInterval(() => {
      setReplayIndex(prev => {
        if (prev >= flightData.routes.length - 1) {
          // Loop the replay
          return 0;
        }
        return prev + 1;
      });
    }, 1200); // Slightly faster for better engagement

    return () => clearInterval(interval);
  }, [isReplaying, flightData]);

  // Prepare globe data with performance optimization
  const { arcsData, pointsData } = useMemo(() => {
    if (!flightData) return { arcsData: [], pointsData: [] };

    const displayRoutes = isReplaying 
      ? flightData.routes.slice(0, replayIndex + 1)
      : flightData.routes;

    const arcs = displayRoutes.map((route, idx) => {
      const from = flightData.airports[route.from];
      const to = flightData.airports[route.to];
      if (!from || !to) return null;
      
      const isActive = isReplaying && idx === displayRoutes.length - 1;
      
      return {
        startLat: from.latitude,
        startLng: from.longitude,
        endLat: to.latitude,
        endLng: to.longitude,
        color: isActive
          ? ['rgba(224, 141, 60, 0.8)', 'rgba(224, 141, 60, 0.9)']
          : ['rgba(94, 200, 192, 0.25)', 'rgba(94, 200, 192, 0.5)'],
      };
    }).filter(Boolean);

    const points = Object.values(flightData.airports).map(airport => ({
      lat: airport.latitude,
      lng: airport.longitude,
      size: 0.25,
      color: 'rgba(224, 141, 60, 0.85)',
      label: `${airport.city}, ${airport.country}\n${airport.code}`,
    }));

    return { arcsData: arcs, pointsData: points };
  }, [flightData, isReplaying, replayIndex]);

  // Calculate insights
  const insights = useMemo(() => {
    if (!flightData) return [];

    const distance = useKm 
      ? flightData.metrics.totalDistanceKm 
      : flightData.metrics.totalDistanceMiles;
    const unit = useKm ? 'km' : 'mi';
    const earthCircumference = useKm ? 40075 : 24901;
    const tripsAroundEarth = (distance / earthCircumference).toFixed(1);

    return [
      `${distance.toLocaleString()} ${unit} travelled`,
      `${tripsAroundEarth}× around Earth`,
      `${flightData.metrics.uniqueAirports} airports visited`,
    ];
  }, [flightData, useKm]);

  if (!flightData) {
    return (
      <div className="mt-6 flex items-center justify-center py-12">
        <div className="text-[#241a06]/40 flex flex-col items-center gap-3">
          <GlobeIcon className="w-8 h-8 animate-pulse" style={{ color }} />
          <p className="text-sm">Loading flight data...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="mt-6 space-y-4">
      {/* Globe Container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border border-[#241a06]/15 bg-[#0B0E14] shadow-[0_10px_25px_rgba(36,26,6,0.12)]"
        style={{ height: '420px' }}
      >
        <Suspense fallback={
          <div className="flex items-center justify-center h-full bg-[#0B0E14]">
            <div className="text-white/60 flex flex-col items-center gap-3">
              <GlobeIcon className="w-12 h-12 animate-pulse" style={{ color }} />
              <p className="text-sm">Initializing globe...</p>
            </div>
          </div>
        }>
          <Globe
            ref={globeEl}
            backgroundColor="rgba(11,14,20,1)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            arcsData={arcsData}
            arcColor="color"
            arcDashLength={0.4}
            arcDashGap={0.2}
            arcDashAnimateTime={1800}
            arcStroke={0.6}
            pointsData={pointsData}
            pointAltitude={0.01}
            pointRadius="size"
            pointColor="color"
            pointLabel="label"
            atmosphereColor={color || '#E08D3C'}
            atmosphereAltitude={0.12}
            width={containerRef.current?.offsetWidth || 600}
            height={420}
            animateIn={false}
          />
        </Suspense>

        {/* Replay indicator */}
        {isReplaying && (
          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
            <Plane className="w-3 h-3 text-white animate-pulse" />
            <span className="text-white text-xs font-medium">
              {replayIndex + 1} / {flightData.routes.length}
            </span>
          </div>
        )}
      </div>

      {/* Metrics Panel */}
      <div className="bg-[#e9dfc9] rounded-xl border border-[#241a06]/15 p-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-[#241a06]/60 text-[10px] font-medium uppercase tracking-wide mb-1">
              ✈️ Flights
            </div>
            <div className="text-xl font-bold" style={{ color: color || '#6c441d' }}>
              {flightData.metrics.totalFlights}
            </div>
          </div>
          <div>
            <div className="text-[#241a06]/60 text-[10px] font-medium uppercase tracking-wide mb-1">
              🌍 Airports
            </div>
            <div className="text-xl font-bold" style={{ color: color || '#6c441d' }}>
              {flightData.metrics.uniqueAirports}
            </div>
          </div>
          <div>
            <div className="text-[#241a06]/60 text-[10px] font-medium uppercase tracking-wide mb-1">
              📏 Distance
            </div>
            <div className="text-xl font-bold transition-all duration-300" style={{ color: color || '#6c441d' }}>
              {(useKm 
                ? flightData.metrics.totalDistanceKm 
                : flightData.metrics.totalDistanceMiles
              ).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[#241a06]/60 text-[10px] font-medium uppercase tracking-wide mb-1">
              ⭐ Most Used
            </div>
            <div className="text-sm font-semibold truncate" style={{ color: color || '#6c441d' }}>
              {flightData.metrics.mostUsedAirline}
            </div>
          </div>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-center gap-2 mb-3 pb-3 border-b border-[#241a06]/10">
          <button
            onClick={() => setUseKm(true)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              useKm 
                ? 'text-[#f3ecd9]' 
                : 'bg-[#f3ecd9] text-[#241a06]/50 hover:text-[#241a06]/80'
            }`}
            style={useKm ? { backgroundColor: color || '#E08D3C' } : {}}
          >
            KM
          </button>
          <button
            onClick={() => setUseKm(false)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              !useKm 
                ? 'text-[#f3ecd9]' 
                : 'bg-[#f3ecd9] text-[#241a06]/50 hover:text-[#241a06]/80'
            }`}
            style={!useKm ? { backgroundColor: color || '#E08D3C' } : {}}
          >
            MI
          </button>
        </div>

        {/* Insights */}
        <div className="space-y-1.5">
          {insights.map((insight, i) => (
            <div key={i} className="text-[#241a06]/70 text-xs flex items-center gap-2">
              <span className="text-[#241a06]/30">•</span>
              <span>{insight}</span>
            </div>
          ))}
        </div>

        {/* Replay Toggle */}
        <button
          onClick={() => setIsReplaying(!isReplaying)}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-[#f3ecd9] hover:opacity-90"
          style={{ backgroundColor: color || '#E08D3C' }}
        >
          {isReplaying ? (
            <>
              <Plane className="w-4 h-4 animate-pulse" />
              Replaying Journey...
            </>
          ) : (
            <>
              <Plane className="w-4 h-4" />
              ▶ Resume Replay
            </>
          )}
        </button>
      </div>
    </section>
  );
}
