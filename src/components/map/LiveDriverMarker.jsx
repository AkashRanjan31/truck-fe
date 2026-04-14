import { useRef, useEffect } from 'react';
import { Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';

const buildDriverIcon = (heading, accuracy, source) => {
  const hasHeading = heading !== null && heading !== undefined;
  const color = source === 'gps' ? '#f97316' : source === 'network' ? '#3b82f6' : '#94a3b8';
  const accuracyColor = accuracy < 20 ? '#22c55e' : accuracy < 50 ? '#f97316' : '#ef4444';

  const arrow = hasHeading
    ? `<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%) rotate(${heading}deg);
        width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;
        border-bottom:10px solid ${color};filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5));"></div>`
    : '';

  return L.divIcon({
    html: `
      <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
        ${arrow}
        <div style="position:absolute;width:28px;height:28px;border-radius:50%;
          background:${color};opacity:0.2;animation:livePulse 2s ease-out infinite;"></div>
        <div style="position:absolute;width:22px;height:22px;border-radius:50%;
          background:white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>
        <div style="position:absolute;width:14px;height:14px;border-radius:50%;
          background:${color};box-shadow:0 0 8px ${color}99;"></div>
        <div style="position:absolute;bottom:-2px;right:-2px;width:7px;height:7px;border-radius:50%;
          background:${accuracyColor};border:1.5px solid white;"></div>
      </div>
      <style>
        @keyframes livePulse {
          0%   { transform:scale(1);   opacity:0.3; }
          70%  { transform:scale(2.5); opacity:0;   }
          100% { transform:scale(1);   opacity:0;   }
        }
      </style>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
  });
};

const LiveDriverMarker = ({ position, address, gpsSource }) => {
  const markerRef = useRef(null);
  const coords = [position.coordinates[1], position.coordinates[0]];
  const { heading, accuracy, speed } = position;

  // Smoothly move the marker via Leaflet's setLatLng — no React re-render needed
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(coords);
    }
  }, [coords[0], coords[1]]);

  const icon = buildDriverIcon(heading, accuracy ?? 999, gpsSource);
  const accuracyRadius = Math.min(accuracy ?? 100, 500);
  const speedKmh = speed ? (speed * 3.6).toFixed(0) : 0;
  const sourceLabel = { gps: '📡 GPS', network: '📶 Network', cached: '💾 Cached' }[gpsSource] || '📍';

  return (
    <>
      <Circle
        center={coords}
        radius={accuracyRadius}
        pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.06, weight: 1, dashArray: '4 4' }}
      />
      <Marker ref={markerRef} position={coords} icon={icon}>
        <Popup>
          <div style={{ fontFamily: 'sans-serif', padding: '4px', minWidth: '180px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>🚛</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '13px', margin: 0, color: '#1e293b' }}>Your Location</p>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{sourceLabel}</p>
              </div>
            </div>
            {address?.road && (
              <p style={{ fontSize: '12px', color: '#374151', margin: '4px 0', fontWeight: 600 }}>
                📍 {address.road}
              </p>
            )}
            {address?.city && (
              <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0' }}>
                {[address.suburb, address.city, address.state].filter(Boolean).join(', ')}
              </p>
            )}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>
                🎯 ±{Math.round(accuracy ?? 0)}m
              </span>
              {speedKmh > 0 && (
                <span style={{ fontSize: '10px', background: '#fff7ed', color: '#ea580c', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>
                  🚀 {speedKmh} km/h
                </span>
              )}
              {heading !== null && (
                <span style={{ fontSize: '10px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>
                  🧭 {Math.round(heading)}°
                </span>
              )}
            </div>
            <p style={{ fontSize: '10px', color: '#9ca3af', margin: '6px 0 0' }}>
              {position.coordinates[1].toFixed(6)}, {position.coordinates[0].toFixed(6)}
            </p>
          </div>
        </Popup>
      </Marker>
    </>
  );
};

export default LiveDriverMarker;
