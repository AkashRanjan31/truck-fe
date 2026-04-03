import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const HAZARD_ICONS = {
  pothole: '🕳️', slippery_road: '🌊', landslide: '⛰️', fog_area: '🌫️', hazard: '⚠️',
};

const SEVERITY_COLOR = { low: '#f1c40f', medium: '#e67e22', high: '#e74c3c' };

function createHazardIcon(type, severity = 'low') {
  const color = SEVERITY_COLOR[severity] || '#f1c40f';
  const emoji = HAZARD_ICONS[type] || '⚠️';
  return L.divIcon({
    className: '',
    html: `<div style="background:#1a1a2e;border:2px solid ${color};border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 10px ${color}88">
      ${emoji}
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

export default function HazardMarker({ report }) {
  const lat = report.location.coordinates[1];
  const lng = report.location.coordinates[0];
  const severity = report.severity || 'low';

  return (
    <Marker position={[lat, lng]} icon={createHazardIcon(report.type, severity)}>
      <Popup>
        <div className="popup">
          <strong>{HAZARD_ICONS[report.type] || '⚠️'} {report.type.replace(/_/g, ' ').toUpperCase()}</strong>
          <p>{report.description}</p>
          <p>⚠️ Severity: <strong style={{ color: SEVERITY_COLOR[severity] }}>{severity.toUpperCase()}</strong></p>
          <small>{new Date(report.createdAt).toLocaleString()}</small>
        </div>
      </Popup>
    </Marker>
  );
}
