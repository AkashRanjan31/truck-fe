import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Google Maps–style pin icon
const makePin = (emoji, bgColor, isNearest = false) => {
  const size = isNearest ? 42 : 34;
  const pulse = isNearest
    ? `<div style="position:absolute;inset:-6px;border-radius:50%;background:${bgColor};opacity:0.2;animation:pinPulse 2s ease-out infinite;"></div>`
    : '';

  return L.divIcon({
    html: `
      <div style="position:relative;width:${size}px;height:${size + 10}px;display:flex;flex-direction:column;align-items:center;">
        ${pulse}
        <!-- Pin body -->
        <div style="
          width:${size}px;height:${size}px;
          background:${bgColor};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:${isNearest ? '3px' : '2px'} solid white;
          box-shadow:0 3px 12px rgba(0,0,0,0.4)${isNearest ? ',0 0 16px ' + bgColor + '80' : ''};
          display:flex;align-items:center;justify-content:center;
          position:relative;z-index:1;
        ">
          <span style="transform:rotate(45deg);font-size:${isNearest ? 18 : 15}px;line-height:1;">${emoji}</span>
        </div>
        <!-- Pin tip shadow -->
        <div style="width:8px;height:4px;background:rgba(0,0,0,0.2);border-radius:50%;margin-top:-2px;"></div>
        ${isNearest ? '<div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#f97316;color:white;font-size:8px;font-weight:700;padding:1px 5px;border-radius:999px;white-space:nowrap;">NEAREST</div>' : ''}
      </div>
      <style>
        @keyframes pinPulse {
          0%   { transform:scale(1);   opacity:0.3; }
          70%  { transform:scale(2.2); opacity:0;   }
          100% { transform:scale(1);   opacity:0;   }
        }
      </style>
    `,
    className: '',
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 10],
    popupAnchor: [0, -(size + 10)],
  });
};

// Memoize icons to avoid recreating on every render
const ICONS = {
  police:         makePin('🚔', '#2563eb', false),
  policeNearest:  makePin('🚔', '#1d4ed8', true),
  hospital:       makePin('🏥', '#16a34a', false),
  hospitalNearest:makePin('🏥', '#15803d', true),
};

const ServiceMarker = ({ place, type, isNearest, onNavigate, onSendAlert }) => {
  const isPolice = type === 'police';
  const color    = isPolice ? '#2563eb' : '#16a34a';
  const label    = isPolice ? 'Police Station' : 'Hospital / Clinic';
  const icon     = isPolice
    ? (isNearest ? ICONS.policeNearest : ICONS.police)
    : (isNearest ? ICONS.hospitalNearest : ICONS.hospital);

  return (
    <Marker position={[place.lat, place.lng]} icon={icon} zIndexOffset={isNearest ? 1000 : 0}>
      <Popup minWidth={230} maxWidth={260}>
        <div style={{ fontFamily: 'Inter, sans-serif', padding: '6px 2px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: color + '15', border: `1.5px solid ${color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', shrink: 0,
            }}>
              {isPolice ? '🚔' : '🏥'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: '13px', margin: 0, color: '#0f172a', lineHeight: 1.3 }}>
                {place.name}
              </p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>{label}</p>
            </div>
          </div>

          {/* Distance badge */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span style={{
              fontSize: '11px', fontWeight: 700,
              background: color + '15', color,
              padding: '3px 10px', borderRadius: '999px',
              border: `1px solid ${color}30`,
            }}>
              📍 {place.distanceLabel} away
            </span>
            {isNearest && (
              <span style={{
                fontSize: '11px', fontWeight: 700,
                background: '#f97316', color: 'white',
                padding: '3px 10px', borderRadius: '999px',
              }}>
                ⭐ Nearest
              </span>
            )}
          </div>

          {/* Address */}
          {place.address && (
            <p style={{ fontSize: '11px', color: '#475569', margin: '0 0 6px', display: 'flex', gap: '4px' }}>
              <span>🏠</span>
              <span>{place.address}</span>
            </p>
          )}

          {/* Phone */}
          {place.phone && (
            <p style={{ fontSize: '12px', margin: '0 0 6px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span>📞</span>
              <a href={`tel:${place.phone}`} style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>
                {place.phone}
              </a>
            </p>
          )}

          {/* Opening hours */}
          {place.openingHours && (
            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 6px' }}>
              🕐 {place.openingHours}
            </p>
          )}

          {/* Coords */}
          <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 10px', fontFamily: 'monospace' }}>
            {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => onNavigate(place)} style={{
              flex: 1, padding: '7px 4px', borderRadius: '8px', border: 'none',
              background: color, color: 'white', fontSize: '11px',
              fontWeight: 700, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '4px',
            }}>
              🗺️ Directions
            </button>
            <button onClick={() => onSendAlert(place, type)} style={{
              flex: 1, padding: '7px 4px', borderRadius: '8px', border: 'none',
              background: '#ef4444', color: 'white', fontSize: '11px',
              fontWeight: 700, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '4px',
            }}>
              🚨 Alert
            </button>
          </div>

          {place.website && (
            <a href={place.website} target="_blank" rel="noreferrer" style={{
              display: 'block', textAlign: 'center', marginTop: '6px',
              fontSize: '10px', color: '#3b82f6', textDecoration: 'none',
            }}>
              🌐 Visit website
            </a>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export const ServiceMarkers = ({ police, hospitals, activeView, onNavigate, onSendAlert }) => {
  const showPolice   = activeView === 'police'   || activeView === 'emergency';
  const showHospital = activeView === 'hospital' || activeView === 'emergency';

  return (
    <>
      {showPolice && police.map((p, i) => (
        <ServiceMarker
          key={`police-${p.id}`}
          place={p}
          type="police"
          isNearest={i === 0}
          onNavigate={onNavigate}
          onSendAlert={onSendAlert}
        />
      ))}
      {showHospital && hospitals.map((h, i) => (
        <ServiceMarker
          key={`hospital-${h.id}`}
          place={h}
          type="hospital"
          isNearest={i === 0}
          onNavigate={onNavigate}
          onSendAlert={onSendAlert}
        />
      ))}
    </>
  );
};

export default ServiceMarkers;
