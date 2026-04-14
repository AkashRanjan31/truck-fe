import { Truck, Phone, Shield, Ambulance, Flame, Navigation, AlertOctagon } from 'lucide-react';

const contacts = [
  { label: 'Police',    number: '100',  Icon: Shield,       color: 'border-blue-500/30 bg-blue-500/5',   iconColor: 'text-blue-400' },
  { label: 'Ambulance', number: '108',  Icon: Ambulance,    color: 'border-red-500/30 bg-red-500/5',     iconColor: 'text-red-400' },
  { label: 'Fire',      number: '101',  Icon: Flame,        color: 'border-orange-500/30 bg-orange-500/5', iconColor: 'text-orange-400' },
  { label: 'Highway',   number: '1033', Icon: Navigation,   color: 'border-green-500/30 bg-green-500/5', iconColor: 'text-green-400' },
  { label: 'Emergency', number: '112',  Icon: AlertOctagon, color: 'border-purple-500/30 bg-purple-500/5', iconColor: 'text-purple-400' },
];

const EmergencyInfoCard = ({ user, driver, truck }) => (
  <div className="space-y-4">
    {(user || truck) && (
      <div className="card">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-orange-400" /> Your Details
        </h3>
        <div className="space-y-2">
          {[
            ['Driver Name', user?.name],
            ['Truck ID', truck?.truckId || '—'],
            ['Phone', user?.phone],
            ['Driver ID', driver?.driverId || '—'],
          ].map(([label, value]) => value && (
            <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-700 last:border-0">
              <span className="text-slate-400 text-sm">{label}</span>
              <span className="text-white text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="card">
      <h3 className="font-bold text-white mb-3 flex items-center gap-2">
        <Phone className="w-4 h-4 text-orange-400" /> Emergency Contacts
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {contacts.map(({ label, number, Icon, color, iconColor }) => (
          <a key={label} href={`tel:${number}`}
            className={`flex items-center gap-2.5 p-3 rounded-xl border ${color} hover:opacity-80 transition-opacity`}>
            <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
            <div>
              <p className="text-xs text-slate-400">{label}</p>
              <p className="font-bold text-white text-lg leading-none">{number}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default EmergencyInfoCard;
