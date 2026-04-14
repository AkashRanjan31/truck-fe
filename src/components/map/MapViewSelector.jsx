import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const TILE_LAYERS = {
  map:       { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',                                                              attribution: '© OpenStreetMap contributors' },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',                   attribution: '© Esri, Maxar' },
  terrain:   { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',                                                               attribution: '© OpenTopoMap' },
  street:    { url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',                                                          attribution: '© OSM HOT' },
  traffic:   { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',                                                             attribution: '© OpenStreetMap contributors' },
};

const PREVIEWS = {
  map:       { bg: 'linear-gradient(135deg,#dbeafe,#93c5fd,#60a5fa)', icon: '🗺️' },
  satellite: { bg: 'linear-gradient(135deg,#14532d,#166534,#4ade80)', icon: '🛰️' },
  terrain:   { bg: 'linear-gradient(135deg,#d4a574,#a0785a,#6b8f5e)', icon: '⛰️' },
  street:    { bg: 'linear-gradient(135deg,#fef3c7,#fde68a,#f59e0b)', icon: '🛣️' },
  police:    { bg: 'linear-gradient(135deg,#1e3a5f,#2563eb,#3b82f6)', icon: '🚔' },
  hospital:  { bg: 'linear-gradient(135deg,#14532d,#16a34a,#22c55e)', icon: '🏥' },
  traffic:   { bg: 'linear-gradient(135deg,#7f1d1d,#dc2626,#f97316)', icon: '🚦' },
  emergency: { bg: 'linear-gradient(135deg,#7f1d1d,#ef4444,#dc2626)', icon: '🚨' },
};

const ALL_VIEWS = [
  { id: 'map',       label: 'Map',       group: 'view' },
  { id: 'satellite', label: 'Satellite', group: 'view' },
  { id: 'terrain',   label: 'Terrain',   group: 'view' },
  { id: 'street',    label: 'Street',    group: 'view' },
  { id: 'police',    label: 'Police',    group: 'service' },
  { id: 'hospital',  label: 'Hospital',  group: 'service' },
  { id: 'traffic',   label: 'Traffic',   group: 'service' },
  { id: 'emergency', label: 'Emergency', group: 'service' },
];

const TileCard = ({ item, isActive, onClick, count }) => {
  const preview = PREVIEWS[item.id];
  const isEmergency = item.id === 'emergency';
  const activeColor = isEmergency ? '#ef4444' : '#f97316';

  return (
    <motion.button
      onClick={onClick}
      title={item.label}
      whileHover={{ y: -2, scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '4px', padding: '5px 4px', borderRadius: '10px',
        border: isActive ? `2px solid ${activeColor}` : '2px solid transparent',
        background: isActive ? `${activeColor}12` : 'transparent',
        cursor: 'pointer', minWidth: '52px', position: 'relative',
        outline: 'none',
      }}
    >
      {/* Thumbnail */}
      <motion.div
        animate={isActive ? { boxShadow: `0 0 12px ${activeColor}60` } : { boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
        transition={{ duration: 0.3 }}
        style={{
          width: '42px', height: '32px', borderRadius: '7px',
          background: preview.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px',
          border: isActive ? `1.5px solid ${activeColor}` : '1.5px solid rgba(255,255,255,0.1)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <span style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>{preview.icon}</span>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{
              position: 'absolute', bottom: '2px', right: '2px',
              background: activeColor, borderRadius: '50%',
              width: '12px', height: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '7px', color: 'white', fontWeight: 700,
            }}
          >✓</motion.div>
        )}
      </motion.div>

      {/* Label */}
      <span style={{
        fontSize: '9px', fontWeight: isActive ? 700 : 500,
        color: isActive ? activeColor : '#94a3b8',
        whiteSpace: 'nowrap',
      }}>
        {item.label}
      </span>

      {/* Count badge */}
      <AnimatePresence>
        {count > 0 && !isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'absolute', top: '2px', right: '2px',
              background: isEmergency ? '#ef4444' : '#f97316',
              color: 'white', fontSize: '8px', fontWeight: 700,
              padding: '1px 3px', borderRadius: '999px', minWidth: '14px',
              textAlign: 'center', lineHeight: '13px',
            }}
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const MapViewSelector = ({ activeView, onViewChange, loading, policeCount, hospitalCount }) => {
  const [expanded, setExpanded] = useState(true);
  const counts = { police: policeCount, hospital: hospitalCount, emergency: policeCount + hospitalCount, traffic: 0 };

  return (
    <motion.div
      className="absolute z-[1000]"
      style={{ top: '12px', left: '50%', x: '-50%' }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div
        layout
        style={{
          background: 'rgba(15,23,42,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '14px',
          border: '1px solid rgba(51,65,85,0.9)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
        transition={{ layout: { duration: 0.25, ease: 'easeInOut' } }}
      >
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '6px 8px' }}
            >
              {/* Map views */}
              {ALL_VIEWS.slice(0, 4).map((item) => (
                <TileCard key={item.id} item={item} isActive={activeView === item.id}
                  onClick={() => onViewChange(item.id)} count={0} />
              ))}

              {/* Divider */}
              <div style={{ width: '1px', height: '44px', background: 'rgba(51,65,85,0.8)', margin: '0 2px' }} />

              {/* Service views */}
              {ALL_VIEWS.slice(4).map((item) => (
                <TileCard key={item.id} item={item} isActive={activeView === item.id}
                  onClick={() => onViewChange(item.id)} count={counts[item.id] || 0} />
              ))}

              {/* Divider */}
              <div style={{ width: '1px', height: '44px', background: 'rgba(51,65,85,0.8)', margin: '0 2px' }} />

              {/* Loading + collapse */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '0 4px' }}>
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#f97316', borderRadius: '50%' }}
                  />
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setExpanded(false)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px', padding: '2px' }}
                >✕</motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setExpanded(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 14px', background: 'none', border: 'none',
                color: '#f1f5f9', cursor: 'pointer', fontSize: '12px',
                fontWeight: 600, fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: '16px' }}>{PREVIEWS[activeView]?.icon}</span>
              <span>{ALL_VIEWS.find(v => v.id === activeView)?.label}</span>
              {loading && (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#f97316', borderRadius: '50%' }} />
              )}
              <span style={{ color: '#64748b', fontSize: '10px' }}>▼</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default MapViewSelector;
