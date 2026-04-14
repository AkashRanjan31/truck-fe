import { useState } from 'react';

const RADIUS_OPTIONS = [
  { label: '2km',  value: 2000  },
  { label: '5km',  value: 5000  },
  { label: '10km', value: 10000 },
  { label: '20km', value: 20000 },
];

const ServiceCard = ({ place, type, isNearest, onNavigate, onSendAlert }) => {
  const isPolice = type === 'police';
  const accentColor = isPolice ? 'text-blue-400' : 'text-green-400';
  const borderBg    = isPolice ? 'bg-blue-500/10 border-blue-500/20' : 'bg-green-500/10 border-green-500/20';
  const nearestBorder = isNearest ? (isPolice ? 'border-blue-400' : 'border-green-400') : '';

  return (
    <div className={`rounded-xl border p-3 mb-2 transition-all ${borderBg} ${nearestBorder}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">{isPolice ? '🚔' : '🏥'}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-white truncate">{place.name}</p>
              {isNearest && (
                <span className="shrink-0 text-[9px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded-full">
                  NEAREST
                </span>
              )}
            </div>
            <p className={`text-xs font-bold ${accentColor}`}>{place.distanceLabel} away</p>
          </div>
        </div>
        {place.phone && (
          <a href={`tel:${place.phone}`}
            className="shrink-0 text-orange-400 hover:text-orange-300 text-xs border border-orange-500/30 rounded-lg px-2 py-1 transition-colors">
            📞
          </a>
        )}
      </div>

      {place.address && (
        <p className="text-xs text-slate-500 mt-1.5 truncate">🏠 {place.address}</p>
      )}
      {place.openingHours && (
        <p className="text-xs text-slate-600 mt-0.5 truncate">🕐 {place.openingHours}</p>
      )}

      <div className="flex gap-2 mt-2.5">
        <button onClick={() => onNavigate(place)}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors
            ${isPolice ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'}`}>
          🗺️ Directions
        </button>
        <button onClick={() => onSendAlert(place, type)}
          className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors">
          🚨 Alert
        </button>
      </div>
    </div>
  );
};

const ServicesPanel = ({
  activeView, police, hospitals,
  loading, error,
  onNavigate, onSendAlert, onClose,
  radius, onRadiusChange,
}) => {
  const [tab, setTab] = useState('all'); // all | police | hospital

  if (activeView === 'map' || activeView === 'satellite' || activeView === 'terrain' ||
      activeView === 'street' || activeView === 'traffic') return null;

  // Build list based on tab
  const getItems = () => {
    if (tab === 'police')   return police.map((p) => ({ ...p, type: 'police' }));
    if (tab === 'hospital') return hospitals.map((h) => ({ ...h, type: 'hospital' }));
    // 'all' — interleave sorted by distance
    return [
      ...police.map((p) => ({ ...p, type: 'police' })),
      ...hospitals.map((h) => ({ ...h, type: 'hospital' })),
    ].sort((a, b) => a.distance - b.distance);
  };

  const items = getItems();
  const totalCount = police.length + hospitals.length;

  const titles = {
    police:    '🚔 Police Stations',
    hospital:  '🏥 Hospitals',
    emergency: '🚨 Emergency Services',
  };

  return (
    <div
      className="absolute z-[1000] flex flex-col"
      style={{
        top: '80px', right: '12px',
        width: '280px',
        maxHeight: 'calc(100vh - 160px)',
        background: 'rgba(15,23,42,0.96)',
        backdropFilter: 'blur(16px)',
        borderRadius: '16px',
        border: '1px solid rgba(51,65,85,0.8)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 shrink-0">
        <div>
          <p className="font-bold text-white text-sm">{titles[activeView]}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {loading ? 'Searching...' : `${totalCount} found within ${radius / 1000}km`}
          </p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none transition-colors">×</button>
      </div>

      {/* Radius selector */}
      <div className="px-3 pt-2 pb-1 shrink-0">
        <p className="text-xs text-slate-500 mb-1.5">Search radius</p>
        <div className="flex gap-1">
          {RADIUS_OPTIONS.map(({ label, value }) => (
            <button key={value} onClick={() => onRadiusChange(value)}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors ${
                radius === value ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-3 py-2 shrink-0">
        {[
          { id: 'all',      label: `All (${totalCount})` },
          { id: 'police',   label: `🚔 ${police.length}` },
          { id: 'hospital', label: `🏥 ${hospitals.length}` },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === id ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {loading && (
          <div className="flex flex-col items-center py-10 gap-3">
            <div className="w-7 h-7 border-2 border-slate-600 border-t-orange-400 rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Fetching nearby places...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-6">
            <p className="text-2xl mb-2">⚠️</p>
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-center py-10">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm text-slate-400 font-medium">Nothing found nearby</p>
            <p className="text-xs text-slate-500 mt-1">Try increasing the search radius</p>
          </div>
        )}

        {!loading && items.map((item, i) => {
          // isNearest = first of its type
          const isNearest = item.type === 'police'
            ? police[0]?.id === item.id
            : hospitals[0]?.id === item.id;
          return (
            <ServiceCard
              key={`${item.type}-${item.id}`}
              place={item}
              type={item.type}
              isNearest={isNearest}
              onNavigate={onNavigate}
              onSendAlert={onSendAlert}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ServicesPanel;
