import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer as LeafletMap, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

import AlertMarker from './AlertMarker';
import TrafficLegend from './TrafficLegend';
import NearbyAlertsBanner from './NearbyAlertsBanner';
import MapViewSelector from './MapViewSelector';
import ServicesPanel from './ServicesPanel';
import { ServiceMarkers } from './ServiceMarkers';
import DynamicTileLayer from './DynamicTileLayer';
import LiveDriverMarker from './LiveDriverMarker';
import LocationInfoBar from './LocationInfoBar';
import StateCrossingBanner from './StateCrossingBanner';

import useAlerts from '../../hooks/useAlerts';
import useLocationTracker from '../../hooks/useLocationTracker';
import useNearbyServices from '../../hooks/useNearbyServices';
import { getNearbyAlerts } from '../../services/alertService';
import { useNavigate } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const INDIA_CENTER = [20.5937, 78.9629];
const RECENTER_ZOOM = 16;
const SERVICE_VIEWS = ['police', 'hospital', 'emergency'];

// ── MapController: exposes map instance + handles initial centering + drag detection ──
const MapController = ({ mapRef, coordsRef, onUserDrag }) => {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  // Auto-center once on first valid location
  const centeredRef = useRef(false);
  useEffect(() => {
    if (centeredRef.current || !coordsRef.current) return;
    centeredRef.current = true;
    map.flyTo(coordsRef.current, RECENTER_ZOOM, { animate: true, duration: 1.2 });
  });

  useMapEvents({
    dragstart: () => onUserDrag(),
  });

  return null;
};

const FAB = ({ onClick, title, children, active, danger }) => (
  <motion.button
    onClick={onClick}
    title={title}
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.92 }}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`w-10 h-10 rounded-xl flex items-center justify-center text-base shadow-lg transition-colors
      ${danger ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' :
        active ? 'bg-orange-500 text-white shadow-orange-500/30' :
        'map-panel text-slate-300 hover:text-white'}`}
  >
    {children}
  </motion.button>
);

const MapContainer = () => {
  const { alerts } = useAlerts();
  const { position, gpsError, gpsLoading, gpsSource, address, currentState, stateCrossing } = useLocationTracker();
  const { police, hospitals, loading: servicesLoading, error: servicesError, fetchServices, radius, changeRadius } = useNearbyServices();
  const navigate = useNavigate();

  const [activeView, setActiveView]       = useState('map');
  const [nearbyAlerts, setNearbyAlerts]   = useState([]);
  const [showBanner, setShowBanner]       = useState(false);
  const [userPanned, setUserPanned]       = useState(false); // true after user manually drags
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Stable refs — no re-render side effects
  const mapRef    = useRef(null);  // Leaflet map instance
  const coordsRef = useRef(null);  // latest [lat, lng] for recenter

  // Keep coordsRef in sync with position
  const userCoords = position ? [position.coordinates[1], position.coordinates[0]] : null;
  useEffect(() => {
    if (userCoords) coordsRef.current = userCoords;
  }, [userCoords?.[0], userCoords?.[1]]);

  // ── Recenter handler — always uses latest coords from ref ──
  const handleRecenter = useCallback(() => {
    const map = mapRef.current;
    const coords = coordsRef.current;
    if (!map) return;
    if (!coords) {
      toast.warn('📍 Location not available yet. Please wait...', { autoClose: 3000 });
      return;
    }
    setUserPanned(false);
    map.flyTo(coords, RECENTER_ZOOM, { animate: true, duration: 1 });
  }, []);

  const fetchNearbyAlerts = useCallback(async () => {
    if (!position) return;
    const [lng, lat] = position.coordinates;
    try {
      const { data } = await getNearbyAlerts(lat, lng, 5000);
      if (data.data?.length) { setNearbyAlerts(data.data); setShowBanner(true); }
    } catch {}
  }, [position?.coordinates[0].toFixed(3), position?.coordinates[1].toFixed(3)]);

  useEffect(() => { fetchNearbyAlerts(); }, [fetchNearbyAlerts]);

  useEffect(() => {
    if (!position || !SERVICE_VIEWS.includes(activeView)) return;
    const [lng, lat] = position.coordinates;
    fetchServices(lat, lng, radius);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, position?.coordinates[0].toFixed(3), radius]);

  useEffect(() => {
    if (!stateCrossing || !position) return;
    const [lng, lat] = position.coordinates;
    fetchServices(lat, lng, radius);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCrossing?.timestamp?.toString()]);

  const handleViewChange = (view) => {
    setActiveView(view);
    const msgs = {
      emergency: '🚨 Emergency mode — showing nearest help',
      satellite: '🛰️ Satellite view',
      terrain:   '⛰️ Terrain view',
      street:    '🛣️ Street view',
      traffic:   '🚦 Traffic layer',
    };
    if (msgs[view]) toast.info(msgs[view], { autoClose: 2000 });
  };

  const handleEmergency = () => {
    setEmergencyMode(true);
    setActiveView('emergency');
    if (position) {
      const [lng, lat] = position.coordinates;
      fetchServices(lat, lng, radius);
    }
    toast.error('🚨 Emergency mode activated! Nearest help shown.', { autoClose: 5000 });
  };

  const handleNavigate = (place) =>
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}&travelmode=driving`, '_blank');

  const handleSendAlert = (place) => {
    toast.success(`🚨 Alert sent to ${place.name}!`, { autoClose: 4000 });
    if (place.phone) {
      setTimeout(() => toast.info(
        <div>
          <p className="font-semibold text-sm">Call {place.name}?</p>
          <a href={`tel:${place.phone}`} className="text-orange-400 text-xs underline">{place.phone}</a>
        </div>, { autoClose: 8000 }
      ), 600);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">

      <MapViewSelector
        activeView={activeView}
        onViewChange={handleViewChange}
        loading={servicesLoading}
        policeCount={police.length}
        hospitalCount={hospitals.length}
      />

      <ServicesPanel
        activeView={activeView}
        police={police}
        hospitals={hospitals}
        loading={servicesLoading}
        error={servicesError}
        onNavigate={handleNavigate}
        onSendAlert={handleSendAlert}
        onClose={() => { setActiveView('map'); setEmergencyMode(false); }}
        radius={radius}
        onRadiusChange={changeRadius}
      />

      <StateCrossingBanner stateCrossing={stateCrossing} currentState={currentState} />

      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-4 right-4 z-[1001]"
          >
            <NearbyAlertsBanner
              alerts={nearbyAlerts}
              onDismiss={() => setShowBanner(false)}
              onReport={() => navigate('/driver/report')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RIGHT SIDE FABs ── */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-2">
        <FAB onClick={handleRecenter} title="Center on my location" active={!userPanned}>🎯</FAB>
        <FAB onClick={fetchNearbyAlerts} title="Refresh alerts">🔄</FAB>
        <FAB onClick={() => navigate('/driver/report')} title="Report issue">📋</FAB>
      </div>

      {/* ── EMERGENCY BUTTON ── */}
      <motion.button
        onClick={handleEmergency}
        className="absolute bottom-20 right-3 z-[1000] flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm text-white shadow-2xl"
        style={{
          background: emergencyMode
            ? 'linear-gradient(135deg, #dc2626, #ef4444)'
            : 'linear-gradient(135deg, #b91c1c, #ef4444)',
        }}
        animate={{
          boxShadow: emergencyMode
            ? ['0 0 0 0 rgba(239,68,68,0.7)', '0 0 0 16px rgba(239,68,68,0)', '0 0 0 0 rgba(239,68,68,0)']
            : ['0 4px 20px rgba(239,68,68,0.3)', '0 4px 28px rgba(239,68,68,0.5)', '0 4px 20px rgba(239,68,68,0.3)'],
        }}
        transition={{ duration: emergencyMode ? 1.2 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
      >
        <motion.span
          animate={emergencyMode ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{ duration: 0.5, repeat: emergencyMode ? Infinity : 0, repeatDelay: 1 }}
          className="text-lg"
        >
          🆘
        </motion.span>
        <span>{emergencyMode ? 'Emergency Active' : 'Emergency'}</span>
      </motion.button>

      {(activeView === 'map' || activeView === 'traffic') && <TrafficLegend />}

      {/* ── LEAFLET MAP ── */}
      <LeafletMap
        center={INDIA_CENTER}
        zoom={5}
        className="h-full w-full z-0"
        style={{ background: '#1e293b' }}
        zoomControl={false}
      >
        <MapController
          mapRef={mapRef}
          coordsRef={coordsRef}
          onUserDrag={() => setUserPanned(true)}
        />

        <DynamicTileLayer activeView={activeView} />

        {position && (
          <LiveDriverMarker position={position} address={address} gpsSource={gpsSource} />
        )}

        {activeView === 'map' && alerts.map((alert) => (
          <AlertMarker key={alert._id} alert={alert} />
        ))}

        <ServiceMarkers
          police={police}
          hospitals={hospitals}
          activeView={activeView}
          onNavigate={handleNavigate}
          onSendAlert={handleSendAlert}
        />
      </LeafletMap>

      <LocationInfoBar
        position={position}
        address={address}
        gpsSource={gpsSource}
        gpsError={gpsError}
        gpsLoading={gpsLoading}
        currentState={currentState}
      />
    </div>
  );
};

export default MapContainer;
