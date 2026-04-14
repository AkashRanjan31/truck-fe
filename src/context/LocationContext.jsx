import { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import { updateLocation } from '../services/locationService';
import { AuthContext } from './AuthContext';
import { resolveState } from '../utils/indiaStates';

export const LocationContext = createContext(null);

const R = 6371000;
function distanceBetween([lng1, lat1], [lng2, lat2]) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Smooth lerp between two coordinate pairs over `steps` frames
function animateCoords(from, to, steps, intervalMs, onStep, onDone) {
  let step = 0;
  const id = setInterval(() => {
    step++;
    const t = step / steps;
    onStep([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]);
    if (step >= steps) {
      clearInterval(id);
      onDone();
    }
  }, intervalMs);
  return id;
}

const MIN_MOVE_METERS    = 8;    // ignore GPS noise below 8m
const MAX_ACCURACY_METERS = 500; // accept readings up to 500m — tighten after first fix
const THROTTLE_BACKEND_MS = 5000;
const SMOOTH_STEPS        = 12;
const SMOOTH_INTERVAL_MS  = 50;

export const LocationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [position, setPosition]         = useState(null);
  const [gpsError, setGpsError]         = useState(null);
  const [gpsLoading, setGpsLoading]     = useState(false);
  const [gpsSource, setGpsSource]       = useState(null);
  const [address, setAddress]           = useState(null);
  const [currentState, setCurrentState] = useState(null);
  const [stateCrossing, setStateCrossing] = useState(null);

  // Refs — never cause re-renders
  const targetCoordsRef   = useRef(null); // latest "true" GPS coords
  const displayCoordsRef  = useRef(null); // coords currently shown on map
  const animFrameRef      = useRef(null); // active animation interval id
  const isAnimatingRef    = useRef(false);
  const watchIdRef        = useRef(null);
  const retryTimerRef     = useRef(null);
  const lastSentRef       = useRef(null);
  const lastGeocodedRef   = useRef(null);
  const prevStateRef      = useRef(null);
  const metaRef           = useRef({ speed: 0, heading: null, accuracy: 999 });
  // Stable ref to startTracking — breaks the circular dep between onGpsError and startTracking
  const startTrackingRef  = useRef(null);

  const stopAnimation = () => {
    if (animFrameRef.current) {
      clearInterval(animFrameRef.current);
      animFrameRef.current = null;
    }
    isAnimatingRef.current = false;
  };

  const applyPosition = useCallback((raw, source) => {
    const { longitude, latitude, accuracy, speed, heading } = raw.coords;

    // Discard very inaccurate readings
    if (accuracy > MAX_ACCURACY_METERS) return;

    const newCoords = [longitude, latitude];
    const prev = targetCoordsRef.current;

    // Ignore tiny GPS jitter
    if (prev && distanceBetween(prev, newCoords) < MIN_MOVE_METERS) return;

    targetCoordsRef.current = newCoords;
    metaRef.current = { speed: speed ?? 0, heading: heading ?? null, accuracy };

    setGpsError(null);
    setGpsLoading(false);
    setGpsSource(source);

    const from = displayCoordsRef.current;

    if (!from) {
      // First fix — set immediately, no animation
      displayCoordsRef.current = newCoords;
      setPosition({ coordinates: newCoords, speed: speed ?? 0, heading: heading ?? null, accuracy });
      return;
    }

    // Stop any in-progress animation before starting a new one
    stopAnimation();

    const startCoords = [...from];
    isAnimatingRef.current = true;

    animFrameRef.current = animateCoords(
      startCoords,
      newCoords,
      SMOOTH_STEPS,
      SMOOTH_INTERVAL_MS,
      (interpolated) => {
        displayCoordsRef.current = interpolated;
        setPosition({
          coordinates: interpolated,
          speed: metaRef.current.speed,
          heading: metaRef.current.heading,
          accuracy: metaRef.current.accuracy,
        });
      },
      () => {
        isAnimatingRef.current = false;
        animFrameRef.current = null;
        displayCoordsRef.current = newCoords;
      }
    );

    // Throttled backend sync — uses true GPS coords, not interpolated
    const now = Date.now();
    const lastSent = lastSentRef.current;
    if (
      now - (lastSent?.time || 0) > THROTTLE_BACKEND_MS &&
      (!lastSent || distanceBetween(lastSent.coords, newCoords) > MIN_MOVE_METERS)
    ) {
      lastSentRef.current = { coords: newCoords, time: now };
      updateLocation(newCoords, speed ?? 0, heading ?? 0).catch(() => {});
    }
  }, []);

  const onGpsError = useCallback((err, highAccuracy) => {
    if (err.code === 1) {
      setGpsError('Location permission denied. Enable location in browser settings.');
      setGpsLoading(false);
      return;
    }
    if (highAccuracy) {
      setGpsSource('network');
      navigator.geolocation.getCurrentPosition(
        (pos) => applyPosition(pos, 'network'),
        () => {
          setGpsError('GPS signal unavailable. Check your location settings.');
          setGpsLoading(false);
          // Use ref to avoid stale closure
          retryTimerRef.current = setTimeout(() => startTrackingRef.current?.(), 12000);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 }
      );
    } else {
      setGpsError('Location unavailable. Retrying...');
      setGpsLoading(false);
      retryTimerRef.current = setTimeout(() => startTrackingRef.current?.(), 12000);
    }
  }, [applyPosition]);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by this browser.');
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    setGpsLoading(true);
    setGpsError(null);

    // Step 1 — instant result from cache (shows position immediately, no wait)
    navigator.geolocation.getCurrentPosition(
      (pos) => applyPosition(pos, pos.coords.accuracy < 50 ? 'gps' : 'network'),
      () => {}, // ignore error — step 2 will handle it
      { enableHighAccuracy: false, timeout: 2000, maximumAge: 60000 }
    );

    // Step 2 — accurate fix in background (may take a few seconds)
    navigator.geolocation.getCurrentPosition(
      (pos) => applyPosition(pos, pos.coords.accuracy < 50 ? 'gps' : 'network'),
      (err) => onGpsError(err, true),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 }
    );

    // Step 3 — continuous watch with relaxed accuracy for fast updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => applyPosition(pos, pos.coords.accuracy < 50 ? 'gps' : 'network'),
      (err) => onGpsError(err, true),
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 3000 }
    );
  }, [applyPosition, onGpsError]);

  // Keep ref in sync with latest startTracking
  useEffect(() => { startTrackingRef.current = startTracking; }, [startTracking]);

  useEffect(() => {
    if (user?.role !== 'driver') return;
    startTracking();

    const handleRetry = () => startTracking();
    window.addEventListener('truckalert:retry-location', handleRetry);

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      stopAnimation();
      window.removeEventListener('truckalert:retry-location', handleRetry);
    };
  }, [user?._id]);

  // Reverse geocode — fires every 300m of movement
  useEffect(() => {
    if (!position) return;
    const coords = position.coordinates;
    // Use true GPS coords for geocoding, not interpolated
    const trueCoords = targetCoordsRef.current || coords;
    if (lastGeocodedRef.current && distanceBetween(lastGeocodedRef.current, trueCoords) < 300) return;
    lastGeocodedRef.current = trueCoords;

    const [lng, lat] = trueCoords;

    // Validate coords are finite numbers in valid geographic ranges
    if (
      !Number.isFinite(lat) || !Number.isFinite(lng) ||
      lat < -90 || lat > 90 || lng < -180 || lng > 180
    ) return;

    const NOMINATIM = 'https://nominatim.openstreetmap.org';
    const url = new URL('/reverse', NOMINATIM);
    url.searchParams.set('lat', lat.toFixed(6));
    url.searchParams.set('lon', lng.toFixed(6));
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');

    fetch(url.toString())
      .then((r) => r.json())
      .then((data) => {
        if (!data?.address) return;
        const a = data.address;
        setAddress({
          road:     a.road || a.pedestrian || a.highway || a.path || null,
          suburb:   a.suburb || a.neighbourhood || a.quarter || null,
          district: a.county || a.state_district || a.district || null,
          city:     a.city || a.town || a.village || a.municipality || null,
          state:    a.state || null,
          postcode: a.postcode || null,
          country:  a.country || null,
          display:  data.display_name || null,
        });
        const stateObj = resolveState(a.state);
        setCurrentState(stateObj);
        if (prevStateRef.current && stateObj && prevStateRef.current.code !== stateObj.code) {
          setStateCrossing({ from: prevStateRef.current, to: stateObj, timestamp: new Date() });
        }
        if (stateObj) prevStateRef.current = stateObj;
      })
      .catch(() => {});
  }, [position?.coordinates[0].toFixed(3), position?.coordinates[1].toFixed(3)]);

  return (
    <LocationContext.Provider value={{
      position, gpsError, gpsLoading, gpsSource,
      address, currentState, stateCrossing,
    }}>
      {children}
    </LocationContext.Provider>
  );
};
