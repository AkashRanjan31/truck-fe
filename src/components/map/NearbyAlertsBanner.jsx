const NearbyAlertsBanner = ({ alerts, onDismiss, onReport }) => {
  if (!alerts?.length) return null;
  return (
    <div className="bg-red-500/90 backdrop-blur-sm text-white rounded-xl shadow-2xl p-3 border border-red-400/50">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl animate-pulse">🚨</span>
          <div>
            <p className="font-bold text-sm">
              {alerts.length} Emergency Alert{alerts.length > 1 ? 's' : ''} Nearby
            </p>
            <p className="text-xs text-red-100 mt-0.5 truncate max-w-[200px]">
              {alerts[0]?.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReport}
            className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            Report
          </button>
          <button onClick={onDismiss} className="text-white/70 hover:text-white text-xl leading-none">
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyAlertsBanner;
