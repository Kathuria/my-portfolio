import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { Plane, Globe as GlobeIcon, Maximize2, X, Map, Play, Pause, ZoomIn, ZoomOut } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

// Lazy load the Globe component for code splitting
const Globe = lazy(() => import('react-globe.gl'));

/**
 * Flight Memory Component - Enhanced Interactive Experience
 * 
 * Features:
 * - Fullscreen mode with ESC/cross to return
 * - Trail bounce only for new entries
 * - Camera zooms to show origin and destination
 * - Map view toggle to see all visited airports
 * - Cosmic purple theme
 * - Smart zoom to flight regions
 * - City highlighting on globe
 */
export default function FlightMemory() {
  const [flightData, setFlightData] = useState(null);
  const [useKm, setUseKm] = useState(true);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('globe'); // 'globe' or 'map'
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [currentFlight, setCurrentFlight] = useState(null); // Track current flight for info display
  const [manualZoom, setManualZoom] = useState(0); // Manual zoom offset (-2 to +2)
  const manualZoomRef = useRef(0); // Ref to always get latest manual zoom value
  const globeEl = useRef();
  const containerRef = useRef();

  // Keep ref in sync with state
  useEffect(() => {
    manualZoomRef.current = manualZoom;
  }, [manualZoom]);

  // Order routes: USA flights → International flights → India-only flights
  const orderedRoutes = useMemo(() => {
    if (!flightData) return [];
    
    const usaAirports = new Set(['DFW', 'SEA', 'BOS', 'BNA', 'ORD', 'ATL', 'LAX', 'MIA', 'JFK', 'LGA', 'EWR', 'SFO', 'DEN', 'PHX', 'MCO', 'IAH', 'SAN', 'PHL', 'BWI', 'DTW', 'LAS', 'IND', 'MDW', 'SJC', 'DAL', 'BUF', 'COS', 'AUS', 'TPA', 'CLT']);
    const indiaAirports = new Set(['DEL', 'BOM', 'BLR', 'PNE', 'IXC', 'TRV', 'COK', 'HYD', 'LKO']);
    
    const usaFlights = [];
    const internationalFlights = [];
    const indiaFlights = [];
    
    flightData.routes.forEach(route => {
      const fromUSA = usaAirports.has(route.from);
      const toUSA = usaAirports.has(route.to);
      const fromIndia = indiaAirports.has(route.from);
      const toIndia = indiaAirports.has(route.to);
      
      if (fromUSA && toUSA) {
        // Domestic USA flight
        usaFlights.push(route);
      } else if (fromIndia && toIndia) {
        // Domestic India flight
        indiaFlights.push(route);
      } else {
        // International flight (crosses USA/India border or involves other countries)
        internationalFlights.push(route);
      }
    });
    
    // Return ordered: USA first, then international, then India
    return [...usaFlights, ...internationalFlights, ...indiaFlights];
  }, [flightData]);

  // Load flight data in background (lazy)
  useEffect(() => {
    // Use requestIdleCallback to load during browser idle time
    const loadFlightData = () => {
      import('../data/flights.generated.json')
        .then(module => {
          setFlightData(module.default);
          // Auto-start replay after data loads
          setTimeout(() => setIsReplaying(true), 500);
        })
        .catch(err => console.error('Failed to load flight data:', err));
    };

    // Load in background when browser is idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadFlightData, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(loadFlightData, 100);
    }
  }, []);

  // Calculate center of flight activity for smart zoom
  const flightCenter = useMemo(() => {
    if (!flightData) return { lat: 37.09, lng: -95.71 };

    const airports = Object.values(flightData.airports);
    const sumLat = airports.reduce((sum, a) => sum + a.latitude, 0);
    const sumLng = airports.reduce((sum, a) => sum + a.longitude, 0);

    return {
      lat: sumLat / airports.length,
      lng: sumLng / airports.length,
    };
  }, [flightData]);

  // Set initial globe position - zoom to flight region
  useEffect(() => {
    if (globeEl.current && flightData) {
      globeEl.current.pointOfView(
        {
          lat: flightCenter.lat,
          lng: flightCenter.lng,
          altitude: Math.max(0.2, 0.5 + (manualZoomRef.current * 0.2))  // Use latest manual zoom
        },
        2000  // Smoother initial zoom
      );
      
      // Enable gentle auto-rotate
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.15;
      globeEl.current.controls().enableZoom = true;
    }
  }, [flightData, flightCenter]);

  // Auto-advance replay index every 5s
  useEffect(() => {
    if (!isReplaying || orderedRoutes.length === 0) return;

    // Start at 0
    setReplayIndex(0);
    
    // Advance every 3s (faster flow)
    const interval = setInterval(() => {
      setReplayIndex(prev => {
        const nextIndex = prev >= orderedRoutes.length - 1 ? 0 : prev + 1;
        
        // If looping back to start, zoom out for smooth transition
        if (nextIndex === 0 && globeEl.current) {
          const currentAltitude = Math.max(0.2, 0.7 + (manualZoomRef.current * 0.2));
          globeEl.current.pointOfView(
            {
              lat: flightCenter.lat,
              lng: flightCenter.lng,
              altitude: currentAltitude + 0.5  // Zoom out before resetting
            },
            1000  // Faster zoom out (1s)
          );
        }
        
        return nextIndex;
      });
    }, 3000);  // 3s per flight (40% faster)

    return () => clearInterval(interval);
  }, [isReplaying, orderedRoutes, flightCenter]);

  // Smooth camera movement when replayIndex changes
  useEffect(() => {
    if (!isReplaying || !flightData || !globeEl.current || orderedRoutes.length === 0) return;

    const route = orderedRoutes[replayIndex];
    const from = flightData.airports[route.from];
    const to = flightData.airports[route.to];
    
    if (!from || !to) return;

    // Disable auto-rotate during flight viewing
    if (globeEl.current.controls()) {
      globeEl.current.controls().autoRotate = false;
    }
    
    // Use ref to get LATEST manual zoom value
    // Zoom out one level: 0.5 → 0.7 base altitude
    const currentAltitude = Math.max(0.2, 0.7 + (manualZoomRef.current * 0.2));
    
    // Calculate midpoint between origin and destination for smooth arc
    const midLat = (from.latitude + to.latitude) / 2;
    const midLng = (from.longitude + to.longitude) / 2;
    
    // Show flight info immediately
    setCurrentFlight({ 
      from: route.from, 
      to: route.to,
      fromAirport: from,
      toAirport: to
    });
    
    // Single smooth camera movement showing the entire flight path
    globeEl.current.pointOfView(
      {
        lat: midLat,
        lng: midLng,
        altitude: currentAltitude
      },
      2700 // Faster but still smooth camera movement (2.7s)
    );
    
    // Re-enable auto-rotate after flight completes
    const timeout = setTimeout(() => {
      if (globeEl.current && globeEl.current.controls()) {
        globeEl.current.controls().autoRotate = true;
      }
    }, 2900);  // 2.9s (before next 3s interval)

    return () => clearTimeout(timeout);
  }, [isReplaying, flightData, replayIndex, orderedRoutes]);

  // Track container dimensions to prevent globe shifting
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = isFullscreen ? window.innerHeight - 100 : 500;
        setDimensions({ width, height });
      }
    };

    // Initial measurement
    updateDimensions();

    // Update on window resize
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isFullscreen]);

  // Handle ESC key for fullscreen exit
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  // Prepare globe data - bounce ONLY for newest arc
  const { arcsData, pointsData } = useMemo(() => {
    if (!flightData) return { arcsData: [], pointsData: [] };

    const displayRoutes = isReplaying 
      ? orderedRoutes.slice(0, replayIndex + 1)
      : orderedRoutes;

    const arcs = displayRoutes.map((route, idx) => {
      const from = flightData.airports[route.from];
      const to = flightData.airports[route.to];
      if (!from || !to) return null;
      
      // ONLY the newest arc gets the bounce effect
      const isNewest = isReplaying && idx === displayRoutes.length - 1;
      
      return {
        startLat: from.latitude,
        startLng: from.longitude,
        endLat: to.latitude,
        endLng: to.longitude,
        // Cosmic purple for old arcs, orange highlight for new
        color: isNewest
          ? ['rgba(224, 141, 60, 0.9)', 'rgba(224, 141, 60, 1)']
          : ['rgba(138, 138, 196, 0.3)', 'rgba(138, 138, 196, 0.5)'],
        // Dash animation ONLY for newest
        dashLength: isNewest ? 0.5 : 1,
        dashGap: isNewest ? 0.3 : 0,
        dashAnimateTime: isNewest ? 1500 : 0,
        // Plane icon label on newest arc
        label: isNewest ? `✈️ ${from.code} → ${to.code}` : '',
      };
    }).filter(Boolean);

    // Highlight origin and destination cities for newest flight
    const newestRoute = isReplaying && displayRoutes.length > 0 
      ? displayRoutes[displayRoutes.length - 1] 
      : null;

    const points = Object.values(flightData.airports).map(airport => {
      const isOrigin = newestRoute && airport.code === flightData.airports[newestRoute.from]?.code;
      const isDestination = newestRoute && airport.code === flightData.airports[newestRoute.to]?.code;
      const isHighlighted = isOrigin || isDestination;

      return {
        lat: airport.latitude,
        lng: airport.longitude,
        // Highlight cities: origin/destination larger and glowing
        size: isHighlighted ? 0.7 : 0.3,
        color: isHighlighted 
          ? 'rgba(224, 141, 60, 1)' // Orange glow for active cities
          : 'rgba(238, 238, 245, 0.7)', // Normal lavender
        label: `${airport.city}, ${airport.country}\n${airport.code}`,
      };
    });

    // Combine airport points (no animated plane marker to avoid jitter)
    const allPoints = points;

    return { arcsData: arcs, pointsData: allPoints };
  }, [flightData, isReplaying, replayIndex]);

  // Get all unique airports with their visit count for map view
  const mapMarkers = useMemo(() => {
    if (!flightData) return [];
    
    const airportCounts = {};
    flightData.routes.forEach(route => {
      airportCounts[route.from] = (airportCounts[route.from] || 0) + 1;
      airportCounts[route.to] = (airportCounts[route.to] || 0) + 1;
    });
    
    return Object.entries(flightData.airports).map(([code, airport]) => ({
      ...airport,
      code,
      visits: airportCounts[code] || 0
    }));
  }, [flightData]);

  // Calculate insights - data-driven
  const insights = useMemo(() => {
    if (!flightData) return {
      distance: 0,
      unit: 'km',
      tripsAroundEarth: 0,
      airports: 0,
      flights: 0,
      mostUsedAirline: ''
    };

    const distance = useKm 
      ? flightData.metrics.totalDistanceKm 
      : flightData.metrics.totalDistanceMiles;
    const unit = useKm ? 'km' : 'mi';
    const earthCircumference = useKm ? 40075 : 24901;
    const tripsAroundEarth = parseFloat((distance / earthCircumference).toFixed(1));

    return {
      distance,
      unit,
      tripsAroundEarth,
      airports: flightData.metrics.uniqueAirports,
      flights: flightData.metrics.totalFlights,
      mostUsedAirline: flightData.metrics.mostUsedAirline
    };
  }, [flightData, useKm]);

  if (!flightData) {
    return (
      <div className="mt-6 flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3 text-[#c4c4d8]">
          <div className="relative">
            <GlobeIcon className="w-12 h-12 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#8a8ac4] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-sm font-medium">Loading flight data...</p>
          <p className="text-xs text-[#c4c4d8]/70">Preparing your global journey...</p>
        </div>
      </div>
    );
  }

  const globeHeight = isFullscreen ? '100vh' : '500px';

  return (
    <section className={`${isFullscreen ? 'fixed inset-0 z-[100] bg-[#1a1a2e] flex flex-col' : 'mt-6'}`}>
        {/* Globe/Map Container */}
        <div 
          ref={containerRef}
          className={`relative ${isFullscreen ? 'flex-1' : 'rounded-xl border border-[#4a4a6d]/30 overflow-hidden'} bg-[#0B0E14]`}
          style={{ height: isFullscreen ? 'auto' : globeHeight }}
        >
        {viewMode === 'globe' ? (
          // GLOBE VIEW
          <Suspense fallback={
            <div className="flex items-center justify-center h-full bg-[#0B0E14]">
              <div className="text-[#c4c4d8] flex flex-col items-center gap-3">
                <GlobeIcon className="w-12 h-12 animate-pulse" />
                <p className="text-sm">Initializing globe...</p>
              </div>
            </div>
          }>
            <Globe
              ref={globeEl}
              backgroundColor="rgba(11,14,20,1)"
              globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
              bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
              arcsData={arcsData}
              arcColor="color"
              arcDashLength={(arc) => arc.dashLength}
              arcDashGap={(arc) => arc.dashGap}
              arcDashAnimateTime={(arc) => arc.dashAnimateTime}
              arcStroke={0.8}
              arcLabel="label"
              arcLabelColor={() => '#E08D3C'}
              arcLabelDotRadius={0.5}
              arcLabelResolution={4}
              pointsData={pointsData}
              pointAltitude={0.015}
              pointRadius="size"
              pointColor="color"
              pointLabel="label"
              atmosphereColor="#8a8ac4"
              atmosphereAltitude={0.15}
              width={dimensions.width || 800}
              height={dimensions.height || 500}
              animateIn={false}
            />
          </Suspense>
        ) : (
          // MAP VIEW - Interactive world map with airport markers
          <div className="w-full h-full bg-[#1a1a2e] relative">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 140,
                center: [0, 20]
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <ZoomableGroup center={[0, 20]} zoom={1}>
                {/* World map geography */}
                <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#2f2f47"
                        stroke="#4a4a6d"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: { fill: '#3a3a57', outline: 'none' },
                          pressed: { outline: 'none' }
                        }}
                      />
                    ))
                  }
                </Geographies>
                
                {/* Airport markers */}
                {mapMarkers.map((airport) => (
                  <Marker key={airport.code} coordinates={[airport.longitude, airport.latitude]}>
                    {/* Pin/marker circle */}
                    <circle
                      r={Math.max(3, Math.min(8, airport.visits / 2))}
                      fill="#E08D3C"
                      stroke="#eeeef5"
                      strokeWidth={0.5}
                      opacity={0.9}
                      style={{ cursor: 'pointer' }}
                    />
                    {/* Airport code label for high-traffic airports */}
                    {airport.visits >= 5 && (
                      <text
                        textAnchor="middle"
                        y={-10}
                        style={{
                          fontFamily: 'system-ui',
                          fontSize: '8px',
                          fill: '#eeeef5',
                          pointerEvents: 'none'
                        }}
                      >
                        {airport.code}
                      </text>
                    )}
                    {/* Tooltip on hover */}
                    <title>
                      {airport.code} - {airport.city}, {airport.country}\n{airport.visits} flight{airport.visits > 1 ? 's' : ''}
                    </title>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
            
            {/* Map legend */}
            <div className="absolute bottom-4 left-4 bg-[#2f2f47]/95 backdrop-blur-sm rounded-lg border border-[#eeeef5]/15 p-4">
              <div className="text-[#eeeef5] text-sm font-semibold mb-2">
                {mapMarkers.length} Airports Visited
              </div>
              <div className="flex items-center gap-3 text-xs text-[#c4c4d8]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#E08D3C] border border-[#eeeef5]"></div>
                  <span>Visited Location</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-[#c4c4d8]/70">
                Hover over markers for details
              </div>
            </div>
          </div>
        )}

        {/* Flight Info - Bottom Left */}
        {currentFlight && viewMode === 'globe' && (
          <div className={`absolute pointer-events-none ${isFullscreen ? 'bottom-8 left-8' : 'bottom-6 left-6'}`}>
            <div className="bg-[#2f2f47]/95 backdrop-blur-md rounded-xl border-2 border-[#E08D3C] px-4 py-3 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  ✈️
                </div>
                <div>
                  <div className="text-xs font-medium text-[#c4c4d8] uppercase tracking-wider">
                    Flight Route
                  </div>
                  <div className="text-lg font-bold text-[#eeeef5] flex items-center gap-2">
                    <span>{currentFlight.fromAirport?.code}</span>
                    <span className="text-[#E08D3C]">→</span>
                    <span>{currentFlight.toAirport?.code}</span>
                  </div>
                  <div className="text-xs text-[#c4c4d8]">
                    {currentFlight.fromAirport?.city} → {currentFlight.toAirport?.city}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manual Zoom Controls - Bottom Right */}
        {viewMode === 'globe' && (
          <div className={`absolute flex flex-col gap-2 ${isFullscreen ? 'bottom-8 right-8' : 'bottom-6 right-6'}`}>
            <button
              onClick={() => {
                const newZoom = Math.max(-2, manualZoom - 1);
                setManualZoom(newZoom);
                // Immediately apply zoom to globe
                if (globeEl.current) {
                  const currentView = globeEl.current.pointOfView();
                  globeEl.current.pointOfView(
                    {
                      ...currentView,
                      altitude: Math.max(0.2, 0.5 + (newZoom * 0.2))
                    },
                    800 // Quick zoom response
                  );
                }
              }}
              disabled={manualZoom <= -2}
              className="group p-2 bg-[#2f2f47]/90 backdrop-blur-sm rounded-lg border border-[#eeeef5]/15 text-[#eeeef5] hover:bg-[#8a8ac4] hover:text-[#1a1a2e] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Zoom in closer"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={() => {
                const newZoom = Math.min(2, manualZoom + 1);
                setManualZoom(newZoom);
                // Immediately apply zoom to globe
                if (globeEl.current) {
                  const currentView = globeEl.current.pointOfView();
                  globeEl.current.pointOfView(
                    {
                      ...currentView,
                      altitude: Math.max(0.2, 0.5 + (newZoom * 0.2))
                    },
                    800 // Quick zoom response
                  );
                }
              }}
              disabled={manualZoom >= 2}
              className="group p-2 bg-[#2f2f47]/90 backdrop-blur-sm rounded-lg border border-[#eeeef5]/15 text-[#eeeef5] hover:bg-[#8a8ac4] hover:text-[#1a1a2e] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Zoom out farther"
            >
              <ZoomOut size={18} />
            </button>
          </div>
        )}

        {/* Controls: Play/Pause, Map, Fullscreen */}
        <div className={`absolute flex items-center gap-2 ${isFullscreen ? 'top-6 right-8' : 'top-3 right-3'}`}>
          {/* Play/Pause Toggle */}
          {viewMode === 'globe' && (
            <button
              onClick={() => setIsReplaying(!isReplaying)}
              className="group p-2 bg-[#2f2f47]/90 backdrop-blur-sm rounded-lg border border-[#eeeef5]/15 text-[#eeeef5] hover:bg-[#8a8ac4] hover:text-[#1a1a2e] transition-all"
              title={isReplaying ? 'Pause replay' : 'Resume replay'}
            >
              {isReplaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
          )}
          
          {/* Map View Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'globe' ? 'map' : 'globe')}
            className="group p-2 bg-[#2f2f47]/90 backdrop-blur-sm rounded-lg border border-[#eeeef5]/15 text-[#eeeef5] hover:bg-[#8a8ac4] hover:text-[#1a1a2e] transition-all"
            title={viewMode === 'globe' ? 'Switch to map view' : 'Switch to globe view'}
          >
            {viewMode === 'globe' ? <Map size={18} /> : <GlobeIcon size={18} />}
          </button>
          
          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="group p-2 bg-[#2f2f47]/90 backdrop-blur-sm rounded-lg border border-[#eeeef5]/15 text-[#eeeef5] hover:bg-[#8a8ac4] hover:text-[#1a1a2e] transition-all"
            title={isFullscreen ? 'Exit fullscreen (ESC)' : 'Enter fullscreen'}
          >
            {isFullscreen ? <X size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        {/* Replay indicator - show in globe view */}
        {viewMode === 'globe' && isReplaying && (
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-[#2f2f47]/90 backdrop-blur-sm rounded-full border border-[#eeeef5]/10">
            <Plane className="w-3 h-3 text-[#eeeef5] animate-pulse" />
            <span className="text-[#eeeef5] text-xs font-medium">
              {replayIndex + 1} / {orderedRoutes.length}
            </span>
          </div>
        )}

      </div>

      {/* Compact Metrics Row at Bottom */}
      {!isFullscreen && (
        <div className="mt-4 bg-[#2f2f47] rounded-xl border border-[#4a4a6d]/30 p-4">
        <div className="flex flex-wrap items-stretch justify-between gap-4">
            {/* Flights Badge - Data Driven */}
            <div className="flex flex-col items-center gap-1 px-4 py-2 bg-[#25253a] rounded-lg min-w-[100px]" title="Total flights taken">
              <div className="flex items-center gap-1.5 text-[#c4c4d8] text-[10px] font-medium uppercase tracking-wide">
                <span>✈️</span>
                <span>Flights</span>
              </div>
              <div className="text-2xl font-bold text-[#eeeef5]">
                {insights.flights}
              </div>
            </div>

            {/* Airports Badge - Data Driven */}
            <div className="flex flex-col items-center gap-1 px-4 py-2 bg-[#25253a] rounded-lg min-w-[100px]" title="Unique airports visited">
              <div className="flex items-center gap-1.5 text-[#c4c4d8] text-[10px] font-medium uppercase tracking-wide">
                <span>🌍</span>
                <span>Airports</span>
              </div>
              <div className="text-2xl font-bold text-[#eeeef5]">
                {insights.airports}
              </div>
            </div>

            {/* Distance Badge - Data Driven with inline toggle */}
            <div className="flex flex-col items-center gap-1 px-4 py-2 bg-[#25253a] rounded-lg min-w-[140px]" title="Total distance travelled">
              <div className="flex items-center gap-1.5 text-[#c4c4d8] text-[10px] font-medium uppercase tracking-wide">
                <span>📏</span>
                <span>Distance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#eeeef5]">
                  {insights.distance.toLocaleString()}
                </span>
                {/* Inline KM/MI toggle */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => setUseKm(true)}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                      useKm ? 'bg-[#8a8ac4] text-[#1a1a2e]' : 'text-[#c4c4d8]/50 hover:text-[#c4c4d8]'
                    }`}
                    title="Switch to kilometers"
                  >
                    KM
                  </button>
                  <button
                    onClick={() => setUseKm(false)}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                      !useKm ? 'bg-[#8a8ac4] text-[#1a1a2e]' : 'text-[#c4c4d8]/50 hover:text-[#c4c4d8]'
                    }`}
                    title="Switch to miles"
                  >
                    MI
                  </button>
                </div>
              </div>
            </div>

            {/* Around Earth Badge - Data Driven */}
            <div className="flex flex-col items-center gap-1 px-4 py-2 bg-[#25253a] rounded-lg min-w-[120px]" title="Equivalent trips around Earth">
              <div className="flex items-center gap-1.5 text-[#c4c4d8] text-[10px] font-medium uppercase tracking-wide">
                <span>🌐</span>
                <span>Around Earth</span>
              </div>
              <div className="text-2xl font-bold text-[#eeeef5]">
                {insights.tripsAroundEarth}×
              </div>
            </div>

            {/* Most Used Airline Badge - Data Driven */}
            <div className="flex flex-col items-center gap-1 px-4 py-2 bg-[#25253a] rounded-lg min-w-[140px]" title="Most frequently used airline">
              <div className="flex items-center gap-1.5 text-[#c4c4d8] text-[10px] font-medium uppercase tracking-wide">
                <span>⭐</span>
                <span>Most Used</span>
              </div>
              <div className="text-sm font-semibold text-[#eeeef5] truncate max-w-[140px]">
                {insights.mostUsedAirline}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
