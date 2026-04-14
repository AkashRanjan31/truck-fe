import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StateCrossingBanner = ({ stateCrossing, currentState }) => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!stateCrossing) return;
    setData(stateCrossing);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 12000);
    return () => clearTimeout(t);
  }, [stateCrossing?.timestamp?.toString()]);

  const { from, to } = data || {};

  return (
    <AnimatePresence>
      {visible && data && (
        <motion.div
          initial={{ opacity: 0, y: -16, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -16, x: '-50%' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute top-20 left-1/2 z-[1002] w-80 max-w-[90vw]"
          style={{
            background: 'rgba(15,23,42,0.97)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(249,115,22,0.5)',
            boxShadow: '0 8px 32px rgba(249,115,22,0.2)',
          }}
        >

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗺️</span>
          <div>
            <p className="text-white font-bold text-sm">State Border Crossed</p>
            <p className="text-slate-400 text-xs">{from?.name} → {to?.name}</p>
          </div>
        </div>
        <button onClick={() => setVisible(false)} className="text-slate-400 hover:text-white text-lg">×</button>
      </div>

      {/* New state info */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📍</span>
          <div>
            <p className="text-orange-400 font-bold">{to?.name}</p>
            <p className="text-slate-400 text-xs">Capital: {to?.capital} · {to?.region} India</p>
          </div>
        </div>

        {/* Emergency numbers for new state */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { label: 'Police',    number: to?.police,    icon: '🚔', color: '#3b82f6' },
            { label: 'Ambulance', number: to?.ambulance, icon: '🚑', color: '#22c55e' },
            { label: 'Highway',   number: to?.highway,   icon: '🛣️', color: '#f97316' },
            { label: 'Fire',      number: to?.fire,      icon: '🚒', color: '#ef4444' },
          ].map(({ label, number, icon, color }) => (
            <a key={label} href={`tel:${number}`}
              className="flex items-center gap-2 rounded-xl p-2 transition-opacity hover:opacity-80"
              style={{ background: color + '15', border: `1px solid ${color}30` }}>
              <span className="text-base">{icon}</span>
              <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="font-bold text-white text-sm">{number}</p>
              </div>
            </a>
          ))}
        </div>

        <p className="text-xs text-slate-500 text-center pt-1">
          Nearby authorities updated for {to?.name}
        </p>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StateCrossingBanner;
