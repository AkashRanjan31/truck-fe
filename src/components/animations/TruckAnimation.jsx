import React from 'react';
import './TruckAnimation.css';

/**
 * TruckAnimation
 * Props:
 *   phase: 'drive-in' | 'idle' | 'drive-out'
 */
export default function TruckAnimation({ phase = 'drive-in' }) {
  const wrapperClass = [
    'truck-wrapper',
    phase === 'idle'      ? 'truck-idle' : '',
    phase === 'drive-out' ? 'truck-exit' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="truck-scene">
      {/* Road surface */}
      <div className="truck-road" />

      {/* Truck */}
      <div className={wrapperClass}>
        {/* Exhaust smoke (left side) */}
        <div className="smoke-container">
          <div className="smoke-puff" />
          <div className="smoke-puff" />
          <div className="smoke-puff" />
        </div>

        {/* Main truck body (SVG) */}
        <div className="truck-body">
          <svg className="truck-svg" viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Trailer body */}
            <rect x="0" y="20" width="180" height="75" rx="6" fill="#1e3a5f" stroke="#2d5a8e" strokeWidth="1.5"/>
            {/* Trailer side details */}
            <rect x="8" y="28" width="164" height="59" rx="3" fill="#162d4a" stroke="#1e4a7a" strokeWidth="1"/>
            <rect x="16" y="36" width="148" height="43" rx="2" fill="#0f1f33" stroke="#1a3a6a" strokeWidth="0.5"/>
            {/* Trailer text/logo area */}
            <rect x="40" y="48" width="88" height="20" rx="3" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.3)" strokeWidth="1"/>
            <text x="84" y="62" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="700" fontFamily="Inter,Arial,sans-serif">TRUCK ALERT</text>
            {/* Trailer door seam */}
            <line x1="90" y1="20" x2="90" y2="95" stroke="#243f5e" strokeWidth="1"/>
            {/* Trailer rivets */}
            {[20,50,70,110,140,160].map(x => (
              <React.Fragment key={x}>
                <circle cx={x} cy="28" r="2" fill="#2d5a8e"/>
                <circle cx={x} cy="87" r="2" fill="#2d5a8e"/>
              </React.Fragment>
            ))}
            {/* Reflective strip */}
            <rect x="0" y="88" width="180" height="5" rx="2" fill="rgba(245,158,11,0.5)"/>

            {/* Cab body */}
            <rect x="175" y="30" width="90" height="65" rx="8" fill="#1a2e4a" stroke="#2d4a6e" strokeWidth="1.5"/>
            {/* Cab roof curve */}
            <path d="M 182 30 Q 200 10 235 12 L 260 20 L 265 30 Z" fill="#1a3a5a" stroke="#2d5a8e" strokeWidth="1"/>
            {/* Windshield */}
            <path d="M 195 32 Q 205 15 235 16 L 258 24 L 258 52 L 195 52 Z" fill="rgba(100,180,255,0.15)" stroke="rgba(100,200,255,0.4)" strokeWidth="1"/>
            {/* Windshield glare */}
            <path d="M 202 34 Q 210 22 228 21 L 235 28" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Cab door */}
            <rect x="182" y="55" width="48" height="36" rx="4" fill="#162840" stroke="#1e3a5a" strokeWidth="1"/>
            {/* Door window */}
            <rect x="188" y="60" width="32" height="18" rx="3" fill="rgba(100,180,255,0.12)" stroke="rgba(100,200,255,0.3)" strokeWidth="0.8"/>
            {/* Door handle */}
            <rect x="218" y="72" width="10" height="3" rx="1.5" fill="#4a7a9e"/>
            {/* Side mirror */}
            <rect x="260" y="35" width="14" height="9" rx="2" fill="#1a2e4a" stroke="#2d4a6e" strokeWidth="1"/>
            <rect x="262" y="37" width="10" height="5" rx="1" fill="rgba(100,180,255,0.2)"/>
            {/* Headlight */}
            <rect x="262" y="55" width="14" height="10" rx="3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"/>
            <rect x="264" y="57" width="10" height="6" rx="2" fill="rgba(255,220,100,0.8)"/>
            {/* Front bumper */}
            <rect x="265" y="82" width="12" height="12" rx="2" fill="#243f5f" stroke="#344f6f" strokeWidth="1"/>
            {/* Grill */}
            {[0,4,8].map(i => (
              <line key={i} x1="267" y1={84+i} x2="275" y2={84+i} stroke="#4a7a9e" strokeWidth="1"/>
            ))}
            {/* Steps */}
            <rect x="178" y="88" width="18" height="4" rx="1" fill="#243f5f"/>
            <rect x="180" y="92" width="14" height="3" rx="1" fill="#1a2e4a"/>
            {/* Fuel tank */}
            <rect x="172" y="72" width="10" height="22" rx="3" fill="#1a2e4a" stroke="#243f5f" strokeWidth="1"/>
            {/* Exhaust pipe */}
            <rect x="177" y="12" width="5" height="20" rx="2" fill="#243f5f" stroke="#344f6f" strokeWidth="0.8"/>
          </svg>

          {/* Headlight beam */}
          {phase === 'idle' && (
            <div className="headlight-glow" />
          )}

          {/* Rear wheel */}
          <div className="wheel wheel-rear" />
          {/* Front wheel */}
          <div className="wheel wheel-front" />
        </div>
      </div>
    </div>
  );
}
