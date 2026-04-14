const TrafficLegend = () => (
  <div className="absolute bottom-20 left-4 z-[1000] map-panel rounded-xl p-3">
    <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Traffic</p>
    {[
      ['Heavy', '#ef4444'],
      ['Moderate', '#f97316'],
      ['Light', '#22c55e'],
    ].map(([label, color]) => (
      <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
        <div className="w-8 h-2 rounded-full" style={{ background: color }} />
        <span className="text-xs text-slate-400">{label}</span>
      </div>
    ))}
  </div>
);

export default TrafficLegend;
