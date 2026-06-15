export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  STATE_ADMIN: 'STATE_ADMIN',
  AUTHORITY: 'AUTHORITY',
  DRIVER: 'DRIVER'
};

export const ALERT_TYPES = {
  ACCIDENT: 'ACCIDENT',
  HAZARD: 'HAZARD',
  REPORT: 'REPORT',
  EMERGENCY: 'EMERGENCY',
  TRAFFIC_JAM: 'TRAFFIC_JAM'
};

export const ALERT_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export const ALERT_STATUS = {
  ACTIVE: 'ACTIVE',
  RESPONDED: 'RESPONDED',
  RESOLVED: 'RESOLVED'
};

export const REPORT_TYPES = {
  POLICE_HARASSMENT: 'police_harassment',
  EXTORTION: 'extortion',
  UNSAFE_PARKING: 'unsafe_parking',
  ACCIDENT_ZONE: 'accident_zone',
  POOR_ROAD: 'poor_road',
  ACCIDENT: 'accident',
  ROAD_CLOSED: 'road_closed',
  HAZARD: 'hazard',
  POTHOLE: 'pothole',
  SLIPPERY_ROAD: 'slippery_road',
  LANDSLIDE: 'landslide',
  FOG_AREA: 'fog_area',
  OTHER: 'other'
};
