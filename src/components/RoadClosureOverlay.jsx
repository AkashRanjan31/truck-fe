import React from 'react';
import { Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

function createRoadClosedIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="background:#1a1a2e;border:2px solid #922b21;border-radius:6px;width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 0 10px rgba(146,43,33,0.6)">🚧</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22],
  });
}

// Generate a short polyline segment around the report point to simulate blocked road
function getRoadSegment(lat, lng) {
  const offset = 0.0008;
  return [
    [lat, lng - offset],
    [lat, lng + offset],
  ];
}

export default function RoadClosureOverlay({ report }) {
  const lat = report.location.coordinates[1];
  const lng = report.location.coordinates[0];

  return (
    <>
      <Polyline
        positions={getRoadSegment(lat, lng)}
        pathOptions={{ color: '#922b21', weight: 6, opacity: 0.85, dashArray: '10, 6' }}
      />
      <Marker position={[lat, lng]} icon={createRoadClosedIcon()}>
        <Popup>
          <div className="popup">
            <strong>🚧 ROAD CLOSED</strong>
            <p>{report.description}</p>
            {report.severity && <p>Reason: <strong>{report.severity}</strong></p>}
            <small>{new Date(report.createdAt).toLocaleString()}</small>
            <div style={{ marginTop: 8 }}>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                target="_blank" rel="noreferrer" className="popup-gmaps-btn"
              >
                🧭 Find Alternate Route
              </a>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
}
