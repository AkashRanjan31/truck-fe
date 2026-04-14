const VIEWS = [
  { id: 'map',       label: 'Map',      emoji: '🗺️' },
  { id: 'police',    label: 'Police',   emoji: '🚔' },
  { id: 'hospital',  label: 'Hospital', emoji: '🏥' },
  { id: 'emergency', label: 'Emergency',emoji: '🚨' },
];

const MapOverlayBar = ({ activeView, onViewChange, loading, policeCount, hospitalCount }) => {
  const counts = { police: policeCount, hospital: hospitalCount, emergency: policeCount + hospitalCount };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]"
      style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }}>
      <div style={{
        background: 'rgba(15,23,42,0.95)',
        backdropFilter: 'blur(16px)',
        borderRadius: '999px',
        border: '1px solid rgba(51,65,85,0.9)',
        padding: '6px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        {VIEWS.map(({ id, label, emoji }) => {
          const isActive = activeView === id;
          const count = counts[id];
          const isEmergency = id === 'emergency';

          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                background: isActive
                  ? isEmergency ? '#ef4444' : '#f97316'
                  : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13px',
                position: 'relative',
                boxShadow: isActive
                  ? isEmergency
                    ? '0 0 16px rgba(239,68,68,0.5)'
                    : '0 0 16px rgba(249,115,22,0.4)'
                  : 'none',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>{emoji}</span>
              <span>{label}</span>

              {/* Count badge */}
              {count > 0 && !isActive && (
                <span style={{
                  background: isEmergency ? '#ef4444' : '#f97316',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '999px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}>
                  {count}
                </span>
              )}

              {/* Loading spinner on active */}
              {isActive && loading && (
                <span style={{
                  width: '12px', height: '12px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite',
                }} />
              )}
            </button>
          );
        })}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default MapOverlayBar;
