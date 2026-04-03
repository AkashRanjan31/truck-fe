import React from 'react';
import { Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function createAccidentIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="background:#1a1a2e;border:2px solid #e74c3c;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 0 12px rgba(231,76,60,0.6)">💥</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22],
  });
}

export default function AccidentZone({ report, userPos, distanceKm }) {
  const lat = report.location.coordinates[1];
  const lng = report.location.coordinates[0];
  const dist = userPos ? distanceKm(userPos[0], userPos[1], lat, lng) : null;

  return (
    <>
      <Circle
        center={[lat, lng]}
        radius={250}
        pathOptions={{ color: '#e74c3c', fillColor: '#e74c3c', fillOpacity: 0.18, weight: 2, opacity: 0.8 }}
      />
      <Marker position={[lat, lng]} icon={createAccidentIcon()}>
        <Popup>
          <div className="popup">
            <strong>💥 ACCIDENT ZONE</strong>
            <p>{report.description}</p>
            {report.severity && <p>⚠️ Severity: <strong>{report.severity}</strong></p>}
            {dist !== null && <p>📍 {dist < 1 ? `${(dist * 1000).toFixed(0)}m` : `${dist.toFixed(2)}km`} away</p>}
            <small>{new Date(report.createdAt).toLocaleString()}</small>
          </div>
        </Popup>
      </Marker>
    </>
  );
}
