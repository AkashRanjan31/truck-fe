import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Satellite, Wifi, HardDrive, ChevronUp, ChevronDown, AlertTriangle, Building2, Shield, Ambulance, Navigation, Flame } from 'lucide-react';

const SOURCE_CONFIG = {
  gps:     { label: 'GPS',     color: '#22c55e', Icon: Satellite },
  network: { label: 'Net',     color: '#3b82f6', Icon: Wifi },
  cached:  { label: 'Cache',   color: '#94a3b8', Icon: HardDrive },
};

const emergencyContacts = [
  { label: 'Police',    key: 'police',    Icon: Shield,     color: '#3b82f6' },
  { label: 'Ambulance', key: 'ambulance', Icon: Ambulance,  color: '#22c55e' },
  { label: 'Highway',   key: 'highway',   Icon: Navigation, color: '#f97316' },
  { label: 'Fire',      key: 'fire',      Icon: Flame,      color: '#ef4444' },
];

const LocationInfoBar = ({ position, address, gpsSource, gpsError, gpsLoading, currentState }) => {
  const [expanded, setExpanded] = useState(false);

  if (gpsError) return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-4 right-20 z-[1000] map-panel rounded-xl px-4 py-2.5 flex items-center gap-3">
      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
      <p className="text-red-400 text-xs flex-1 truncate">{gpsError}</p>
      <button
        onClick={() => {
          // Clear error and re-trigger location — do not reload the whole page
          window.dispatchEvent(new Event('truckalert:retry-location'));
        }}
        className="shrink-0 text-xs bg-orange-500 text-white px-3 py-1 rounded-lg font-semibold">Retry</button>
    </motion.div>
  );

  if (gpsLoading && !position) return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-4 z-[1000] map-panel rounded-xl px-4 py-2 flex items-center gap-2.5">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-3 h-3 border-2 border-slate-600 border-t-orange-400 rounded-full shrink-0" />
      <div>
        <p className="text-slate-300 text-xs font-medium">Locating you...</p>
        <p className="text-slate-500 text-[10px] mt-0.5">Allow location access if prompted</p>
      </div>
    </motion.div>
  );

  if (!position) return null;

  const src = SOURCE_CONFIG[gpsSource] || SOURCE_CONFIG.cached;
  const speedKmh = position.speed ? (position.speed * 3.6).toFixed(0) : 0;
  const accuracy = Math.round(position.accuracy ?? 0);
  const accuracyColor = accuracy < 20 ? '#22c55e' : accuracy < 50 ? '#f97316' : '#ef4444';

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="absolute bottom-4 left-4 right-20 z-[1000] map-panel rounded-xl overflow-hidden">

      <div className="px-3 py-2 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <motion.p key={address?.road || position.coordinates.toString()}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            className="text-white text-xs font-semibold truncate">
            {address?.road || `${position.coordinates[1].toFixed(4)}, ${position.coordinates[0].toFixed(4)}`}
          </motion.p>
          <motion.p key={address?.city} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }} className="text-slate-400 text-[10px] truncate">
            {[address?.city, address?.district, address?.state].filter(Boolean).join(' · ')}
          </motion.p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {speedKmh > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-orange-500/15 text-orange-400">
              {speedKmh}km/h
            </motion.span>
          )}
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1"
            style={{ background: src.color + '15', color: src.color }}>
            <src.Icon className="w-2.5 h-2.5" /> {src.label}
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
            style={{ background: accuracyColor + '15', color: accuracyColor }}>
            ±{accuracy}m
          </span>
          {currentState && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="flex items-center gap-1 text-[10px] text-slate-400">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
              {currentState.code}
            </motion.span>
          )}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setExpanded(v => !v)} className="text-slate-500 hover:text-white">
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && currentState && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-slate-700/50">
            <div className="px-3 py-2.5 space-y-2">
              {address?.district && (
                <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3" />
                  <span className="text-slate-200">{address.district}</span>
                  {address?.postcode && <span className="text-slate-500 ml-1">PIN {address.postcode}</span>}
                </p>
              )}
              <div>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1.5 font-semibold">
                  {currentState.name} Emergency
                </p>
                <div className="grid grid-cols-4 gap-1">
                  {emergencyContacts.map(({ label, key, Icon, color }, i) => (
                    <motion.a key={label} href={`tel:${currentState[key]}`}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg"
                      style={{ background: color + '15', border: `1px solid ${color}25` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                      <span className="text-white font-bold text-[10px]">{currentState[key]}</span>
                      <span className="text-slate-500 text-[8px]">{label}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LocationInfoBar;
