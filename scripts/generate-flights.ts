#!/usr/bin/env node
/**
 * Flight Data Generator
 * 
 * Reads flights.xlsx and generates src/data/flights.generated.json
 * with sanitized, privacy-safe data.
 * 
 * NO sensitive data is exposed:
 * - No dates
 * - No booking references
 * - No PNRs
 * - No flight numbers
 * - Only airport codes, routes, and aggregated metrics
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Airport database with coordinates
const AIRPORT_DATA: Record<string, { city: string; country: string; latitude: number; longitude: number }> = {
  'DFW': { city: 'Dallas', country: 'United States', latitude: 32.8998, longitude: -97.0403 },
  'SEA': { city: 'Seattle', country: 'United States', latitude: 47.4502, longitude: -122.3088 },
  'BOS': { city: 'Boston', country: 'United States', latitude: 42.3656, longitude: -71.0096 },
  'BNA': { city: 'Nashville', country: 'United States', latitude: 36.1263, longitude: -86.6892 },
  'ORD': { city: 'Chicago', country: 'United States', latitude: 41.9742, longitude: -87.9073 },
  'ATL': { city: 'Atlanta', country: 'United States', latitude: 33.6407, longitude: -84.4277 },
  'LAX': { city: 'Los Angeles', country: 'United States', latitude: 33.9416, longitude: -118.4085 },
  'MIA': { city: 'Miami', country: 'United States', latitude: 25.7959, longitude: -80.2870 },
  'JFK': { city: 'New York', country: 'United States', latitude: 40.6413, longitude: -73.7781 },
  'LGA': { city: 'New York', country: 'United States', latitude: 40.7769, longitude: -73.8740 },
  'EWR': { city: 'Newark', country: 'United States', latitude: 40.6895, longitude: -74.1745 },
  'SFO': { city: 'San Francisco', country: 'United States', latitude: 37.6213, longitude: -122.3790 },
  'DEN': { city: 'Denver', country: 'United States', latitude: 39.8561, longitude: -104.6737 },
  'PHX': { city: 'Phoenix', country: 'United States', latitude: 33.4352, longitude: -112.0101 },
  'MCO': { city: 'Orlando', country: 'United States', latitude: 28.4312, longitude: -81.3081 },
  'IAH': { city: 'Houston', country: 'United States', latitude: 29.9902, longitude: -95.3368 },
  'SAN': { city: 'San Diego', country: 'United States', latitude: 32.7338, longitude: -117.1933 },
  'PHL': { city: 'Philadelphia', country: 'United States', latitude: 39.8744, longitude: -75.2424 },
  'BWI': { city: 'Baltimore', country: 'United States', latitude: 39.1774, longitude: -76.6684 },
  'DCA': { city: 'Washington', country: 'United States', latitude: 38.8521, longitude: -77.0377 },
  'IAD': { city: 'Washington', country: 'United States', latitude: 38.9531, longitude: -77.4565 },
  'PDX': { city: 'Portland', country: 'United States', latitude: 45.5898, longitude: -122.5951 },
  'SLC': { city: 'Salt Lake City', country: 'United States', latitude: 40.7899, longitude: -111.9791 },
  'MSP': { city: 'Minneapolis', country: 'United States', latitude: 44.8848, longitude: -93.2223 },
  'DTW': { city: 'Detroit', country: 'United States', latitude: 42.2162, longitude: -83.3554 },
  'LAS': { city: 'Las Vegas', country: 'United States', latitude: 36.0840, longitude: -115.1537 },
  'CLT': { city: 'Charlotte', country: 'United States', latitude: 35.2144, longitude: -80.9473 },
  'TPA': { city: 'Tampa', country: 'United States', latitude: 27.9775, longitude: -82.5339 },
  'IND': { city: 'Indianapolis', country: 'United States', latitude: 39.7173, longitude: -86.2944 },
  'COS': { city: 'Colorado Springs', country: 'United States', latitude: 38.8056, longitude: -104.7006 },
  'AUS': { city: 'Austin', country: 'United States', latitude: 30.1945, longitude: -97.6699 },
  'DEL': { city: 'New Delhi', country: 'India', latitude: 28.5562, longitude: 77.1000 },
  'BOM': { city: 'Mumbai', country: 'India', latitude: 19.0896, longitude: 72.8656 },
  'BLR': { city: 'Bangalore', country: 'India', latitude: 13.1979, longitude: 77.7063 },
  'PNE': { city: 'Pune', country: 'India', latitude: 18.5822, longitude: 73.9197 },
  'IXC': { city: 'Chandigarh', country: 'India', latitude: 30.6735, longitude: 76.7885 },
  'TRV': { city: 'Trivandrum', country: 'India', latitude: 8.4821, longitude: 76.9200 },
  'COK': { city: 'Kochi', country: 'India', latitude: 10.1520, longitude: 76.3919 },
  'HYD': { city: 'Hyderabad', country: 'India', latitude: 17.2403, longitude: 78.4294 },
  'LKO': { city: 'Lucknow', country: 'India', latitude: 26.7606, longitude: 80.8893 },
  'MDW': { city: 'Chicago', country: 'United States', latitude: 41.7868, longitude: -87.7522 },
  'SJC': { city: 'San Jose', country: 'United States', latitude: 37.3639, longitude: -121.9289 },
  'DAL': { city: 'Dallas', country: 'United States', latitude: 32.8471, longitude: -96.8518 },
  'BUF': { city: 'Buffalo', country: 'United States', latitude: 42.9405, longitude: -78.7322 },
  'GUA': { city: 'Guatemala City', country: 'Guatemala', latitude: 14.5833, longitude: -90.5275 },
  'DXB': { city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2532, longitude: 55.3657 },
  'DOH': { city: 'Doha', country: 'Qatar', latitude: 25.2732, longitude: 51.6080 },
  'FRA': { city: 'Frankfurt', country: 'Germany', latitude: 50.0379, longitude: 8.5622 },
};

interface FlightRoute {
  from: string;
  to: string;
}

interface GeneratedData {
  metrics: {
    totalFlights: number;
    totalDistanceKm: number;
    totalDistanceMiles: number;
    uniqueAirports: number;
    uniqueAirlines: number;
    longestFlight: {
      route: string;
      distanceKm: number;
      distanceMiles: number;
    };
    mostUsedAirline: string;
  };
  routes: FlightRoute[];
  airports: Record<string, {
    code: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  }>;
}

/**
 * Parse Excel data from simple structure
 * Note: In production, you'd use a proper Excel parser like 'xlsx' package
 */
function parseFlightsData(): any[] {
  // For this TypeScript version, we'll read from a temporary JSON
  // that the Python script will generate
  try {
    const tempData = JSON.parse(readFileSync(resolve(process.cwd(), 'flights-temp.json'), 'utf-8'));
    return tempData;
  } catch (error) {
    console.error('Error reading flights-temp.json. Run Python parser first.');
    console.error('Run: python3 scripts/parse-excel.py');
    process.exit(1);
  }
}

function generateFlightData(): GeneratedData {
  const flights = parseFlightsData();
  
  const routes: FlightRoute[] = [];
  const airports = new Set<string>();
  const airlines = new Map<string, number>();
  let totalDistanceKm = 0;
  let totalDistanceMiles = 0;
  let longestFlight = { route: '', distanceKm: 0, distanceMiles: 0 };

  flights.forEach((flight: any) => {
    const { origin, destination, layover, airline, distanceKm, distanceMiles } = flight;
    
    // Handle layover flights: Split into two segments (A→B, B→C)
    if (layover && layover.trim() !== '') {
      // First segment: origin → layover
      routes.push({ from: origin, to: layover });
      // Second segment: layover → destination
      routes.push({ from: layover, to: destination });
      
      // Track all three airports
      airports.add(origin);
      airports.add(layover);
      airports.add(destination);
    } else {
      // Direct flight: origin → destination
      routes.push({ from: origin, to: destination });
      
      // Track airports
      airports.add(origin);
      airports.add(destination);
    }
    
    // Track airlines
    airlines.set(airline, (airlines.get(airline) || 0) + 1);
    
    // Sum distances
    totalDistanceKm += distanceKm;
    totalDistanceMiles += distanceMiles;
    
    // Track longest flight
    if (distanceKm > longestFlight.distanceKm) {
      longestFlight = {
        route: layover ? `${origin} → ${layover} → ${destination}` : `${origin} → ${destination}`,
        distanceKm,
        distanceMiles
      };
    }
  });

  // Find most used airline
  let mostUsedAirline = '';
  let maxFlights = 0;
  airlines.forEach((count, airline) => {
    if (count > maxFlights) {
      maxFlights = count;
      mostUsedAirline = airline;
    }
  });

  // Build airport metadata
  const airportMetadata: GeneratedData['airports'] = {};
  airports.forEach(code => {
    const data = AIRPORT_DATA[code];
    if (data) {
      airportMetadata[code] = {
        code,
        ...data
      };
    } else {
      console.warn(`Warning: No data for airport ${code}`);
    }
  });

  return {
    metrics: {
      totalFlights: flights.length,
      totalDistanceKm: Math.round(totalDistanceKm),
      totalDistanceMiles: Math.round(totalDistanceMiles),
      uniqueAirports: airports.size,
      uniqueAirlines: airlines.size,
      longestFlight,
      mostUsedAirline
    },
    routes,
    airports: airportMetadata
  };
}

// Main execution
const data = generateFlightData();
const outputPath = resolve(process.cwd(), 'src/data/flights.generated.json');
writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log('✅ Flight data generated successfully!');
console.log(`📊 Metrics:`);
console.log(`   - Total flights: ${data.metrics.totalFlights}`);
console.log(`   - Total distance: ${data.metrics.totalDistanceKm.toLocaleString()} km`);
console.log(`   - Unique airports: ${data.metrics.uniqueAirports}`);
console.log(`   - Airlines: ${data.metrics.uniqueAirlines}`);
console.log(`   - Most used: ${data.metrics.mostUsedAirline}`);
console.log(`\n💾 Generated: ${outputPath}`);
