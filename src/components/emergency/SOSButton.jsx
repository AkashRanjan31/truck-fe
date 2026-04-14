import { useState } from 'react';
import { toast } from 'react-toastify';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { sendSOS } from '../../services/alertService';
import { getCurrentPosition } from '../../utils/geoUtils';

const SOSButton = ({ driverName, truckId, phone }) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSOS = async () => {
    if (!window.confirm('Send SOS Emergency Alert?\n\nThis will notify all drivers within 5km and the state admin immediately.')) return;
    setLoading(true);
    try {
      const pos = await getCurrentPosition();
      await sendSOS([pos.coords.longitude, pos.coords.latitude]);
      setSent(true);
      toast.success('SOS sent! Help is on the way. Stay calm.', { autoClose: false });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send SOS. Call 112 immediately.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-slate-400 text-sm text-center max-w-xs leading-relaxed">
        Press the button to alert the admin and all drivers within{' '}
        <span className="text-orange-400 font-semibold">5km</span> of your location.
      </p>

      <div className="relative flex items-center justify-center">
        {!sent && !loading && (
          <>
            <div className="absolute w-56 h-56 rounded-full bg-red-500/10 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute w-48 h-48 rounded-full bg-red-500/15 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
          </>
        )}
        <button
          onClick={handleSOS}
          disabled={loading || sent}
          className="sos-btn relative z-10"
          style={sent ? { background: '#22c55e', boxShadow: '0 0 30px rgba(34,197,94,0.5)', animation: 'none' } : {}}
        >
          {loading ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : sent ? (
            <div className="flex flex-col items-center gap-1">
              <CheckCircle className="w-10 h-10" />
              <span className="text-sm font-bold tracking-widest">SENT</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <AlertTriangle className="w-10 h-10" />
              <span className="text-sm font-black tracking-widest">SOS</span>
            </div>
          )}
        </button>
      </div>

      {sent && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center max-w-xs">
          <p className="text-green-400 font-semibold text-sm">Emergency alert sent successfully!</p>
          <p className="text-slate-400 text-xs mt-1">Stay calm. Help is on the way.</p>
        </div>
      )}
    </div>
  );
};

export default SOSButton;
