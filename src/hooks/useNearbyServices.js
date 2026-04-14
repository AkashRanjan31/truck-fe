import { useState, useCallback, useRef } from 'react';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export const calcDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const formatDistance = (meters) =>
  meters < 1000 ? `${meters}m` : `${(meters / 1000).toFixed(1)}km`;

// Fetch all police + hospitals + clinics within radius
const buildQuery = (lat, lng, radius) => `
[out:json][timeout:25];
(
  node["amenity"="police"](around:${radius},${lat},${lng});
  way["amenity"="police"](around:${radius},${lat},${lng});
  node["amenity"="hospital"](around:${radius},${lat},${lng});
  way["amenity"="hospital"](around:${radius},${lat},${lng});
  node["amenity"="clinic"](around:${radius},${lat},${lng});
  node["amenity"="doctors"](around:${radius},${lat},${lng});
);
out center 50;
`;

const parseElement = (el, userLat, userLng) => {
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (!lat || !lng) return null;

  const amenity = el.tags?.amenity || '';
  const type = amenity === 'police' ? 'police' : 'hospital';
  const dist = calcDistance(userLat, userLng, lat, lng);

  return {
    id: String(el.id),
    type,
    name: el.tags?.name || el.tags?.['name:en'] || (type === 'police' ? 'Police Station' : 'Hospital'),
    lat,
    lng,
    distance: dist,
    distanceLabel: formatDistance(dist),
    phone: el.tags?.phone || el.tags?.['contact:phone'] || el.tags?.['contact:mobile'] || null,
    address: [
      el.tags?.['addr:housenumber'],
      el.tags?.['addr:street'],
      el.tags?.['addr:city'],
    ].filter(Boolean).join(', ') || el.tags?.['addr:full'] || null,
    website: el.tags?.website || el.tags?.['contact:website'] || null,
    openingHours: el.tags?.opening_hours || null,
    emergency: el.tags?.emergency || null,
  };
};

const useNearbyServices = () => {
  const [police, setPolice]       = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [lastCoords, setLastCoords] = useState(null);
  const [radius, setRadius]       = useState(10000); // default 10km
  const debounceRef = useRef(null);
  const abortRef    = useRef(null);

  const fetchServices = useCallback(async (lat, lng, customRadius) => {
    const r = customRadius || radius;

    // Skip if moved < 500m from last fetch
    if (lastCoords) {
      const moved = calcDistance(lat, lng, lastCoords[0], lastCoords[1]);
      if (moved < 500) return;
    }

    // Debounce — wait 800ms before firing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      // Abort previous in-flight request
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(OVERPASS_URL, {
          method: 'POST',
          body: buildQuery(lat, lng, r),
          signal: abortRef.current.signal,
        });
        const data = await res.json();

        const all = (data.elements || [])
          .map((el) => parseElement(el, lat, lng))
          .filter(Boolean);

        // Deduplicate by id
        const seen = new Set();
        const unique = all.filter((el) => {
          if (seen.has(el.id)) return false;
          seen.add(el.id);
          return true;
        });

        const policeList   = unique.filter((e) => e.type === 'police').sort((a, b) => a.distance - b.distance);
        const hospitalList = unique.filter((e) => e.type === 'hospital').sort((a, b) => a.distance - b.distance);

        setPolice(policeList);
        setHospitals(hospitalList);
        setLastCoords([lat, lng]);
      } catch (err) {
        if (err.name !== 'AbortError') setError('Could not fetch nearby services. Check your connection.');
      } finally {
        setLoading(false);
      }
    }, 800);
  }, [lastCoords, radius]);

  const changeRadius = (newRadius) => {
    setRadius(newRadius);
    setLastCoords(null); // force re-fetch
  };

  return { police, hospitals, loading, error, fetchServices, radius, changeRadius };
};

export default useNearbyServices;
