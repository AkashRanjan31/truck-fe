const TrafficControls = ({ showAlerts, showTraffic, onToggleAlerts, onToggleTraffic, onRefresh, onReport, alertCount }) => (
  <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center gap-2 flex-wrap">
    {/* Alert count badge */}
    {alertCount > 0 && (
      <div className="map-panel rounded-xl px-3 py-2 flex items-center gap-2 text-sm font-semibold text-orange-400">
        <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
        {alertCount} alert{alertCount > 1 ? 's' : ''} nearby
      </div>
    )}

    <div className="flex items-center gap-2 ml-auto">
      {/* Traffic toggle */}
      <button
        onClick={onToggleTraffic}
        className={`map-panel rounded-xl px-3 py-2 text-sm font-medium transition-all ${
          showTraffic ? 'text-orange-400 border-orange-500/50' : 'text-slate-300 hover:text-white'
        }`}
      >
        🚦 Traffic
      </button>

      {/* Refresh */}
      <button
        onClick={onRefresh}
        className="map-panel rounded-xl p-2.5 text-slate-300 hover:text-white transition-colors"
        title="Refresh"
      >
        🔄
      </button>

      {/* Report button */}
      <button
        onClick={onReport}
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-1.5"
      >
        + Report Issue
      </button>
    </div>
  </div>
);

export default TrafficControls;
