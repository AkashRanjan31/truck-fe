import { Shield, Lock, ClipboardList, Video, AlertTriangle, MapPin, Hospital, MessageSquareOff } from 'lucide-react';

const tips = [
  { Icon: Shield,           text: 'Stay calm and stay in your truck' },
  { Icon: Lock,             text: 'Lock your doors if threatened' },
  { Icon: ClipboardList,    text: 'Note badge numbers of officers' },
  { Icon: Video,            text: 'Record video if safe to do so' },
  { Icon: AlertTriangle,    text: 'Turn on hazard lights immediately' },
  { Icon: MapPin,           text: 'Share your live location with family' },
  { Icon: Hospital,         text: 'Note nearest hospital location' },
  { Icon: MessageSquareOff, text: 'Do not argue with aggressors' },
];

const SafetyTips = () => (
  <div className="card">
    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
      <Shield className="w-4 h-4 text-orange-400" /> Safety Tips
    </h3>
    <div className="grid grid-cols-1 gap-2">
      {tips.map(({ Icon, text }, i) => (
        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-700/50">
          <Icon className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="text-sm text-slate-300">{text}</span>
        </div>
      ))}
    </div>
  </div>
);

export default SafetyTips;
