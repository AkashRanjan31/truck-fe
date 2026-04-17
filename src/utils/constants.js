export const API_URL     = import.meta.env.VITE_API_URL;
export const SOCKET_URL  = import.meta.env.VITE_SOCKET_URL;
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export const ROLES = {
  DRIVER: 'driver',
  STATE_ADMIN: 'state_admin',
  SUPER_ADMIN: 'super_admin',
  AUTHORITY: 'authority',
};

export const ISSUE_TYPES = [
  { value: 'police_harassment', label: 'Police Harassment' },
  { value: 'roadside_extortion', label: 'Roadside Extortion' },
  { value: 'unsafe_parking', label: 'Unsafe Parking' },
  { value: 'accident_zone', label: 'Accident Zone' },
  { value: 'poor_road', label: 'Poor Road' },
  { value: 'accident', label: 'Accident' },
  { value: 'breakdown', label: 'Breakdown' },
  { value: 'cargo_theft', label: 'Cargo Theft' },
  { value: 'medical_emergency', label: 'Medical Emergency' },
  { value: 'weather_issue', label: 'Weather Hazard' },
  { value: 'route_blockage', label: 'Route Blocked' },
  { value: 'other', label: 'Other' },
];

export const PRIORITY_LEVELS = ['low', 'medium', 'high', 'critical'];
export const REPORT_STATUSES = ['pending', 'in_review', 'forwarded', 'accepted', 'resolved', 'closed'];
export const AUTHORITY_TYPES = ['police', 'highway_patrol', 'transport_dept', 'emergency', 'hospital'];
