import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getNearbyReports, getTrafficZones, updateLocation } from '../services/api';
import { connectSocket } from '../services/socket';
import { useNavigate } from 'react-router-dom';
import { useDriver } from '../context/DriverContext';
import LocationMapModal from '../components/LocationMapModal';
import SosAlertPopup from '../components/SosAlertPopup';
import AccidentZone from '../components/AccidentZone';
import HazardMarker from '../components/HazardMarker';
import RoadClosureOverlay from '../components/RoadClosureOverlay';
import './MapPage.css';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const SEARCH_RADIUS_M = 5000;

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchEmergencyServices(lat, lng) {
  const query = `
    [out:json][timeout:20];
    (
      node["amenity"="police"](around:${SEARCH_RADIUS_M},${lat},${lng});
      way["amenity"="police"](around:${SEARCH_RADIUS_M},${lat},${lng});
      node["amenity"="hospital"](around:${SEARCH_RADIUS_M},${lat},${lng});
      way["amenity"="hospital"](around:${SEARCH_RADIUS_M},${lat},${lng});
    );
    out center;
  `;
  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const json = await res.json();
  return json.elements.map((el) => ({
    id: el.id,
    lat: el.lat ?? el.center?.lat,
    lng: el.lon ?? el.center?.lon,
    name: el.tags?.name || (el.tags?.amenity === 'police' ? 'Police Station' : 'Hospital'),
    type: el.tags?.amenity,
  })).filter((el) => el.lat && el.lng);
}

function createEmergencyIcon(type) {
  const isPolice = type === 'police';
  const color = isPolice ? '#3b82f6' : '#22c55e';
  const glow  = isPolice ? 'rgba(59,130,246,0.55)' : 'rgba(34,197,94,0.55)';
  const emoji = isPolice ? '🚔' : '🏥';
  return L.divIcon({
    className: '',
    html: `<div class="em-marker em-marker-${type}" style="border-color:${color};box-shadow:0 0 10px ${glow},0 2px 8px rgba(0,0,0,0.5)">${emoji}</div>`,
    iconSize: [38, 38], iconAnchor: [19, 19], popupAnchor: [0, -22],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: '',
    html: `<div class="user-marker"><div class="user-marker-pulse"></div><div class="user-marker-dot"></div></div>`,
    iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -14],
  });
}

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const INCIDENT_TYPES = new Set(['accident', 'road_closed', 'hazard', 'pothole', 'slippery_road', 'landslide', 'fog_area']);

const ISSUE_ICONS = {
  police_harassment: '👮', extortion: '💰', unsafe_parking: '🅿️',
  accident_zone: '💥', poor_road: '🚧', other: '⚠️',
  accident: '💥', road_closed: '🚧', hazard: '⚠️',
  pothole: '🕳️', slippery_road: '🌊', landslide: '⛰️', fog_area: '🌫️',
};
const MARKER_COLORS = {
  police_harassment: '#e74c3c', extortion: '#e67e22', unsafe_parking: '#3498db',
  accident_zone: '#c0392b', poor_road: '#95a5a6', other: '#f39c12',
  accident: '#e74c3c', road_closed: '#922b21', hazard: '#f1c40f',
  pothole: '#e67e22', slippery_road: '#3498db', landslide: '#8e44ad', fog_area: '#95a5a6',
};

function createIcon(type) {
  return L.divIcon({
    className: '',
    html: `<div style="background:#1a1a2e;border:2px solid ${MARKER_COLORS[type]};border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.4)">${ISSUE_ICONS[type]}</div>`,
    iconSize: [36, 36], iconAnchor: [18, 18],
  });
}

// MapController: handles all programmatic map movement.
// flyTarget is set once (first GPS fix) — triggers flyTo zoom 16.
// coords updates after that only pan the map.
function MapController({ flyTarget, coords }) {
  const map = useMap();

  // First fix: fly to zoom 16
  useEffect(() => {
    if (!flyTarget) return;
    map.flyTo(flyTarget, 16, { animate: true, duration: 1.5 });
  }, [flyTarget, map]); // eslint-disable-line react-hooks/exhaustive-deps

  // Subsequent position updates: smooth pan only
  useEffect(() => {
    if (!coords || !flyTarget) return;
    // Skip if coords is the same as flyTarget (first fix)
    if (coords[0] === flyTarget[0] && coords[1] === flyTarget[1]) return;
    map.panTo(coords, { animate: true, duration: 0.5 });
  }, [coords, map]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

// "Locate Me" button rendered inside the MapContainer so it has map access
function LocateMeButton({ onLocate }) {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleClick = () => {
    if (locating) return;
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
        onLocate(lat, lng);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="locate-me-btn-wrap">
      <button
        className={`locate-me-btn ${locating ? 'locating' : ''}`}
        onClick={handleClick}
        title="My Location"
      >
        {locating ? (
          <span className="locate-spinner" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
          </svg>
        )}
        <span>{locating ? 'Locating…' : 'My Location'}</span>
      </button>
    </div>
  );
}

const TRAFFIC_LEVEL_LABEL = { Heavy: '🔴 Heavy', Moderate: '🟠 Moderate', Light: '🟢 Light' };

export default function MapPage() {
  const [reports, setReports] = useState([]);
  const [zones, setZones] = useState([]);
  const [emergencySvcs, setEmergencySvcs] = useState([]);
  const [userPos, setUserPos] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null); // set once on first GPS fix
  const [gpsError, setGpsError] = useState(false);
  const [alert, setAlert] = useState(null);
  const [sosAlert, setSosAlert] = useState(null);
  const [proximityWarning, setProximityWarning] = useState(null);
  const warnedAccidents = useRef(new Set());
  const [showTraffic, setShowTraffic] = useState(true);
  const [showPolice, setShowPolice] = useState(true);
  const [showHospital, setShowHospital] = useState(true);
  const [pinLocation, setPinLocation] = useState(null);
  const { driver } = useDriver();
  const navigate = useNavigate();
  const refreshTimer = useRef(null);
  const lastEmergencyPos = useRef(null);
  const userPosRef = useRef(null);

  const fetchReports = useCallback(async (lat, lng) => {
    try {
      const { data } = await getNearbyReports(lat, lng);
      setReports(data);
    } catch {}
  }, []);

  const fetchZones = useCallback(async (lat, lng) => {
    try {
      const { data } = await getTrafficZones(lat, lng);
      setZones(data);
    } catch {}
  }, []);

  const fetchEmergency = useCallback(async (lat, lng) => {
    const prev = lastEmergencyPos.current;
    if (prev && distanceKm(prev[0], prev[1], lat, lng) < 0.5) return;
    lastEmergencyPos.current = [lat, lng];
    try {
      const results = await fetchEmergencyServices(lat, lng);
      setEmergencySvcs(results);
    } catch {}
  }, []);

  const refreshAll = useCallback((lat, lng) => {
    fetchReports(lat, lng);
    fetchZones(lat, lng);
  }, [fetchReports, fetchZones]);

  useEffect(() => {
    if (!driver?._id) return;
    let watchId = null;

    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos([lat, lng]);
        setFlyTarget([lat, lng]); // triggers MapController to flyTo zoom 16
        userPosRef.current = [lat, lng];
        setGpsError(false);
        refreshAll(lat, lng);
        fetchEmergency(lat, lng);
        updateLocation(driver._id, lat, lng).catch(() => {});
        refreshTimer.current = setInterval(() => {
          const p = userPosRef.current;
          if (p) refreshAll(p[0], p[1]);
        }, 60000);
      },
      () => {
        setGpsError(true);
        refreshAll(20.5937, 78.9629);
      },
      { timeout: 10000, maximumAge: 60000 }
    );

    watchId = navigator.geolocation?.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos([lat, lng]);
        userPosRef.current = [lat, lng];
        setGpsError(false);
        updateLocation(driver._id, lat, lng).catch(() => {});
        fetchEmergency(lat, lng);
        setReports((prev) => {
          prev.filter((r) => r.type === 'accident').forEach((r) => {
            const dist = distanceKm(lat, lng, r.location.coordinates[1], r.location.coordinates[0]);
            if (dist <= 0.3 && !warnedAccidents.current.has(r._id)) {
              warnedAccidents.current.add(r._id);
              setProximityWarning(r);
              setTimeout(() => setProximityWarning(null), 6000);
            }
          });
          return prev;
        });
      },
      () => setGpsError(true),
      { timeout: 15000, maximumAge: 30000, enableHighAccuracy: false }
    );

    const socket = connectSocket(driver._id);

    const handleAlert = (report) => {
      setReports((prev) => prev.find((r) => r._id === report._id) ? prev : [report, ...prev]);
      setAlert(report);
      setTimeout(() => setAlert(null), 5000);
      setUserPos((pos) => { if (pos) fetchZones(pos[0], pos[1]); return pos; });
    };
    const handleEmergency = (data) => setSosAlert(data);
    const handleSosNearby = (data) => setSosAlert(data);

    socket.on('alert_nearby', handleAlert);
    socket.on('emergency_alert', handleEmergency);
    socket.on('sos_nearby', handleSosNearby);

    return () => {
      clearInterval(refreshTimer.current);
      if (watchId != null) navigator.geolocation?.clearWatch(watchId);
      socket.off('alert_nearby', handleAlert);
      socket.off('emergency_alert', handleEmergency);
      socket.off('sos_nearby', handleSosNearby);
    };
  }, [driver?._id, fetchZones, refreshAll, fetchEmergency]); // eslint-disable-line react-hooks/exhaustive-deps

  const heavyCount    = zones.filter((z) => z.level === 'Heavy').length;
  const moderateCount = zones.filter((z) => z.level === 'Moderate').length;
  const lightCount    = zones.filter((z) => z.level === 'Light').length;
  const policeList    = emergencySvcs.filter((e) => e.type === 'police');
  const hospitalList  = emergencySvcs.filter((e) => e.type === 'hospital');

  return (
    <div className="map-wrapper">
      {sosAlert && (
        <SosAlertPopup sos={sosAlert} driver={driver} onDismiss={() => setSosAlert(null)} />
      )}
      {proximityWarning && (
        <div className="alert-banner" style={{ background: 'linear-gradient(90deg,#c0392b,#e74c3c)', cursor: 'pointer' }}
          onClick={() => setProximityWarning(null)}>
          <span>💥</span>
          <div>
            <strong>⚠️ Accident Ahead! Drive Carefully.</strong>
            <p>{proximityWarning.description} — within 300m</p>
          </div>
        </div>
      )}
      {alert && (
        <div className="alert-banner">
          <span>{ISSUE_ICONS[alert.type]}</span>
          <div>
            <strong>⚠️ Alert Ahead!</strong>
            <p>{alert.type.replace(/_/g, ' ').toUpperCase()} — {alert.description}</p>
          </div>
        </div>
      )}
      {gpsError && (
        <div className="gps-error-banner">
          📍 Location unavailable — enable GPS for live tracking.
        </div>
      )}

      <div className="map-controls">
        <span className="map-count">{reports.length} ⚠️ alerts</span>
        <div className="map-controls-divider" />
        <button className={`map-btn traffic-toggle ${showTraffic ? 'active' : ''}`}
          onClick={() => setShowTraffic((v) => !v)} title="Toggle traffic zones">
          🚦 Traffic
        </button>
        <button className={`map-btn police-toggle ${showPolice ? 'active' : ''}`}
          onClick={() => setShowPolice((v) => !v)} title={`Police stations (${policeList.length})`}>
          🚔 Police {policeList.length > 0 && <span className="map-btn-count">{policeList.length}</span>}
        </button>
        <button className={`map-btn hospital-toggle ${showHospital ? 'active' : ''}`}
          onClick={() => setShowHospital((v) => !v)} title={`Hospitals (${hospitalList.length})`}>
          🏥 Hospital {hospitalList.length > 0 && <span className="map-btn-count">{hospitalList.length}</span>}
        </button>
        <div className="map-controls-divider" />
        <button className="map-btn" title="Refresh alerts"
          onClick={() => { const p = userPosRef.current; if (p) refreshAll(p[0], p[1]); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </button>
        <button className="map-btn report-btn" onClick={() => navigate('/report')}>+ Report</button>
      </div>

      {(showTraffic || showPolice || showHospital) && (
        <div className="traffic-legend">
          {showTraffic && (
            <>
              <span className="legend-title">Traffic</span>
              <span className="legend-item red">🔴 Heavy ({heavyCount})</span>
              <span className="legend-item orange">🟠 Moderate ({moderateCount})</span>
              <span className="legend-item green">🟢 Light ({lightCount})</span>
            </>
          )}
          {(showPolice || showHospital) && showTraffic && <span className="legend-sep" />}
          {showPolice && policeList.length > 0 && (
            <span className="legend-item" style={{ color: '#60a5fa' }}>🚔 Police ({policeList.length})</span>
          )}
          {showHospital && hospitalList.length > 0 && (
            <span className="legend-item" style={{ color: '#4ade80' }}>🏥 Hospital ({hospitalList.length})</span>
          )}
        </div>
      )}

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        minZoom={3}
        maxZoom={19}
        scrollWheelZoom
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <ZoomControl position="bottomright" />
        <MapController flyTarget={flyTarget} coords={userPos} />
        <LocateMeButton onLocate={(lat, lng) => {
          setUserPos([lat, lng]);
          userPosRef.current = [lat, lng];
          setGpsError(false);
          refreshAll(lat, lng);
          updateLocation(driver._id, lat, lng).catch(() => {});
        }} />

        {/* Driver's own position */}
        {userPos && (
          <Marker position={userPos} icon={createUserIcon()}>
            <Popup>
              <div className="popup">
                <strong>📍 Your Location</strong>
                <p>{driver?.name} · {driver?.truckNumber}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {showTraffic && zones.map((zone, i) => (
          <Circle key={i} center={[zone.lat, zone.lng]} radius={800}
            pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.25, weight: 2, opacity: 0.7 }}>
            <Popup>
              <div className="popup traffic-popup">
                <strong>{TRAFFIC_LEVEL_LABEL[zone.level]} Traffic</strong>
                <p>📊 Congestion score: {zone.count}</p>
                <p>⚠️ Issues: {zone.types.map((t) => t.replace(/_/g, ' ')).join(', ')}</p>
                {zone.level === 'Heavy' && (
                  <p style={{ color: '#e74c3c', fontWeight: 'bold', marginTop: 4 }}>⚠️ Consider an alternative route</p>
                )}
              </div>
            </Popup>
          </Circle>
        ))}

        {reports.filter((r) => r.type === 'accident').map((r) => (
          <AccidentZone key={`acc-${r._id}`} report={r} userPos={userPos} distanceKm={distanceKm} />
        ))}
        {reports.filter((r) => r.type === 'road_closed').map((r) => (
          <RoadClosureOverlay key={`rc-${r._id}`} report={r} />
        ))}
        {reports.filter((r) => INCIDENT_TYPES.has(r.type) && r.type !== 'accident' && r.type !== 'road_closed').map((r) => (
          <HazardMarker key={`hz-${r._id}`} report={r} />
        ))}

        {reports.filter((r) => !INCIDENT_TYPES.has(r.type)).map((r) => (
          <Marker key={r._id}
            position={[r.location.coordinates[1], r.location.coordinates[0]]}
            icon={createIcon(r.type)}>
            <Popup>
              <div className="popup">
                <strong>{ISSUE_ICONS[r.type]} {r.type.replace(/_/g, ' ').toUpperCase()}</strong>
                <p>{r.description}</p>
                <small>👍 {r.upvotes} · {r.driverName}</small><br />
                <small>{new Date(r.createdAt).toLocaleString()}</small>
                <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                  <button className="popup-nav-btn" onClick={() => setPinLocation({
                    lat: r.location.coordinates[1], lng: r.location.coordinates[0],
                    title: r.type.replace(/_/g, ' ').toUpperCase(),
                    type: r.type, description: r.description, address: r.address,
                  })}>📍 View Location</button>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${r.location.coordinates[1]},${r.location.coordinates[0]}`}
                    target="_blank" rel="noreferrer" className="popup-gmaps-btn">🧭 Navigate</a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {showPolice && policeList.map((p) => (
          <Marker key={`police-${p.id}`} position={[p.lat, p.lng]} icon={createEmergencyIcon('police')}>
            <Popup>
              <div className="popup em-popup">
                <strong className="em-popup-title police">🚔 Police Station</strong>
                <p className="em-popup-name">{p.name}</p>
                {userPos && <p className="em-popup-dist">📍 {distanceKm(userPos[0], userPos[1], p.lat, p.lng).toFixed(2)} km away</p>}
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                  target="_blank" rel="noreferrer" className="popup-gmaps-btn" style={{ display: 'inline-block', marginTop: 8 }}>🧭 Navigate</a>
              </div>
            </Popup>
          </Marker>
        ))}

        {showHospital && hospitalList.map((h) => (
          <Marker key={`hospital-${h.id}`} position={[h.lat, h.lng]} icon={createEmergencyIcon('hospital')}>
            <Popup>
              <div className="popup em-popup">
                <strong className="em-popup-title hospital">🏥 Hospital</strong>
                <p className="em-popup-name">{h.name}</p>
                {userPos && <p className="em-popup-dist">📍 {distanceKm(userPos[0], userPos[1], h.lat, h.lng).toFixed(2)} km away</p>}
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
                  target="_blank" rel="noreferrer" className="popup-gmaps-btn" style={{ display: 'inline-block', marginTop: 8 }}>🧭 Navigate</a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <LocationMapModal location={pinLocation} onClose={() => setPinLocation(null)} />
    </div>
  );
}
