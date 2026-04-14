const issueTypes = [
  { value: 'police_harassment', label: 'Police Harassment', icon: '👮' },
  { value: 'roadside_extortion', label: 'Roadside Extortion', icon: '💰' },
  { value: 'unsafe_parking', label: 'Unsafe Parking', icon: '🅿️' },
  { value: 'accident_zone', label: 'Accident Zone', icon: '💥' },
  { value: 'poor_road', label: 'Poor Road', icon: '🛣️' },
  { value: 'accident', label: 'Accident', icon: '🚨' },
  { value: 'breakdown', label: 'Breakdown', icon: '🔧' },
  { value: 'cargo_theft', label: 'Cargo Theft', icon: '📦' },
  { value: 'medical_emergency', label: 'Medical', icon: '🏥' },
  { value: 'weather_issue', label: 'Weather Hazard', icon: '⛈️' },
  { value: 'route_blockage', label: 'Route Blocked', icon: '🚧' },
  { value: 'other', label: 'Other', icon: '📌' },
];

const IssueTypeSelector = ({ value, onChange }) => (
  <div className="grid grid-cols-3 gap-2">
    {issueTypes.map(({ value: v, label, icon }) => (
      <button
        key={v}
        type="button"
        onClick={() => onChange(v)}
        className={value === v ? 'chip-active' : 'chip-inactive'}
      >
        <span className="text-xl">{icon}</span>
        <span className="text-center leading-tight">{label}</span>
      </button>
    ))}
  </div>
);

export default IssueTypeSelector;
