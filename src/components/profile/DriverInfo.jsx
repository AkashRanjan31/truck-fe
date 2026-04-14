import { CreditCard, Star, CheckCircle, XCircle, AlertTriangle, ShieldCheck, ShieldX, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const verificationConfig = {
  approved: { Icon: ShieldCheck, color: 'text-green-400', label: 'Approved' },
  rejected: { Icon: ShieldX,     color: 'text-red-400',   label: 'Rejected' },
  pending:  { Icon: Clock,       color: 'text-yellow-400',label: 'Pending'  },
};

const DriverInfo = ({ driver }) => {
  if (!driver) return null;

  const isExpiringSoon = driver.licenseExpiry &&
    new Date(driver.licenseExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const rating = driver.rating || 5;
  const vConfig = verificationConfig[driver.verificationStatus] || verificationConfig.pending;

  return (
    <div className="card">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-orange-400" /> Driver Details
      </h3>

      <div className="space-y-0">
        {/* License */}
        <Row label="License No." value={driver.licenseNumber || '—'} />

        {/* Experience */}
        <Row label="Experience" value={`${driver.experience || 0} years`} />

        {/* Total Reports */}
        <Row label="Total Reports" value={driver.totalReports || 0} />

        {/* Verification */}
        <div className="flex justify-between items-center py-2.5 border-b border-slate-700/60">
          <span className="text-slate-400 text-sm">Verification</span>
          <span className={`flex items-center gap-1.5 text-sm font-semibold ${vConfig.color}`}>
            <vConfig.Icon className="w-3.5 h-3.5" /> {vConfig.label}
          </span>
        </div>

        {/* Duty status */}
        <div className="flex justify-between items-center py-2.5 border-b border-slate-700/60">
          <span className="text-slate-400 text-sm">Duty Status</span>
          <span className={`flex items-center gap-1.5 text-sm font-semibold ${driver.isOnDuty ? 'text-green-400' : 'text-slate-400'}`}>
            {driver.isOnDuty
              ? <><CheckCircle className="w-3.5 h-3.5" /> On Duty</>
              : <><XCircle className="w-3.5 h-3.5" /> Off Duty</>}
          </span>
        </div>

        {/* Rating */}
        <div className="flex justify-between items-center py-2.5 border-b border-slate-700/60">
          <span className="text-slate-400 text-sm">Rating</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`} />
            ))}
            <span className="text-white text-sm font-medium ml-1">({rating}/5)</span>
          </div>
        </div>

        {/* License expiry */}
        <div className="flex justify-between items-center py-2.5">
          <span className="text-slate-400 text-sm">License Expiry</span>
          <span className={`flex items-center gap-1.5 text-sm font-medium ${isExpiringSoon ? 'text-red-400' : 'text-white'}`}>
            {isExpiringSoon && <AlertTriangle className="w-3.5 h-3.5" />}
            {driver.licenseExpiry ? formatDate(driver.licenseExpiry) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-slate-700/60">
    <span className="text-slate-400 text-sm">{label}</span>
    <span className="text-white text-sm font-medium">{value}</span>
  </div>
);

export default DriverInfo;
