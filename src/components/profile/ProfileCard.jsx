import { Truck, Phone, CreditCard, Calendar, MapPin, Pencil } from 'lucide-react';
import { UPLOADS_URL } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

const ProfileCard = ({ user, driver, onEdit }) => (
  <div className="card space-y-4">
    {/* Avatar + name row */}
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 flex items-center justify-center overflow-hidden shadow-xl">
          {user?.profilePhoto ? (
            <img src={`${UPLOADS_URL}/profiles/${user.profilePhoto}`} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-black text-orange-400">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </span>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800" />
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-black text-white truncate">{user?.name}</h2>
        <span className="inline-block mt-0.5 bg-orange-500/20 text-orange-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-orange-500/30 capitalize">
          {user?.role?.replace('_', ' ')}
        </span>
        {driver?.driverId && (
          <p className="text-xs text-slate-500 mt-1 font-mono">{driver.driverId}</p>
        )}
      </div>

      {/* Edit button */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-orange-500/40 text-orange-400 hover:bg-orange-500/10 transition-all"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
      )}
    </div>

    {/* Info grid */}
    <div className="bg-slate-900 rounded-xl p-4 space-y-2.5">
      {[
        { Icon: Truck,      label: 'Vehicle No.',  value: driver?.vehicleNumber || '—' },
        { Icon: Phone,      label: 'Phone',        value: user?.phone || '—' },
        { Icon: CreditCard, label: 'Driver ID',    value: driver?.driverId || '—', mono: true },
        { Icon: MapPin,     label: 'Home State',   value: driver?.homeState?.name || user?.state?.name || '—' },
        { Icon: Calendar,   label: 'Joined',       value: driver?.joiningDate ? formatDate(driver.joiningDate) : formatDate(user?.createdAt) },
      ].map(({ Icon, label, value, mono }) => (
        <div key={label} className="flex items-center justify-between gap-2">
          <span className="text-slate-400 text-sm flex items-center gap-2 shrink-0">
            <Icon className="w-3.5 h-3.5 text-slate-500" /> {label}
          </span>
          <span className={`text-sm font-medium text-white truncate text-right ${mono ? 'font-mono text-orange-400' : ''}`}>
            {value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default ProfileCard;
