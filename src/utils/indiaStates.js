// All 28 Indian States + 8 Union Territories
// Each entry: code, name, capital, center coords, emergency numbers, region
export const INDIA_STATES = {
  AP: { code: 'AP', name: 'Andhra Pradesh',      capital: 'Amaravati',    center: [15.9129, 79.7400], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'South' },
  AR: { code: 'AR', name: 'Arunachal Pradesh',   capital: 'Itanagar',     center: [28.2180, 94.7278], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'Northeast' },
  AS: { code: 'AS', name: 'Assam',               capital: 'Dispur',       center: [26.2006, 92.9376], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'Northeast' },
  BR: { code: 'BR', name: 'Bihar',               capital: 'Patna',        center: [25.0961, 85.3131], police: '100', ambulance: '102', fire: '101', highway: '1033', region: 'East' },
  CG: { code: 'CG', name: 'Chhattisgarh',        capital: 'Raipur',       center: [21.2787, 81.8661], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'Central' },
  GA: { code: 'GA', name: 'Goa',                 capital: 'Panaji',       center: [15.2993, 74.1240], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'West' },
  GJ: { code: 'GJ', name: 'Gujarat',             capital: 'Gandhinagar',  center: [22.2587, 71.1924], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'West' },
  HR: { code: 'HR', name: 'Haryana',             capital: 'Chandigarh',   center: [29.0588, 76.0856], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'North' },
  HP: { code: 'HP', name: 'Himachal Pradesh',    capital: 'Shimla',       center: [31.1048, 77.1734], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'North' },
  JH: { code: 'JH', name: 'Jharkhand',           capital: 'Ranchi',       center: [23.6102, 85.2799], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'East' },
  KA: { code: 'KA', name: 'Karnataka',           capital: 'Bengaluru',    center: [15.3173, 75.7139], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'South' },
  KL: { code: 'KL', name: 'Kerala',              capital: 'Thiruvananthapuram', center: [10.8505, 76.2711], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'South' },
  MP: { code: 'MP', name: 'Madhya Pradesh',      capital: 'Bhopal',       center: [22.9734, 78.6569], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'Central' },
  MH: { code: 'MH', name: 'Maharashtra',         capital: 'Mumbai',       center: [19.7515, 75.7139], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'West' },
  MN: { code: 'MN', name: 'Manipur',             capital: 'Imphal',       center: [24.6637, 93.9063], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'Northeast' },
  ML: { code: 'ML', name: 'Meghalaya',           capital: 'Shillong',     center: [25.4670, 91.3662], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'Northeast' },
  MZ: { code: 'MZ', name: 'Mizoram',             capital: 'Aizawl',       center: [23.1645, 92.9376], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'Northeast' },
  NL: { code: 'NL', name: 'Nagaland',            capital: 'Kohima',       center: [26.1584, 94.5624], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'Northeast' },
  OD: { code: 'OD', name: 'Odisha',              capital: 'Bhubaneswar',  center: [20.9517, 85.0985], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'East' },
  PB: { code: 'PB', name: 'Punjab',              capital: 'Chandigarh',   center: [31.1471, 75.3412], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'North' },
  RJ: { code: 'RJ', name: 'Rajasthan',           capital: 'Jaipur',       center: [27.0238, 74.2179], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'North' },
  SK: { code: 'SK', name: 'Sikkim',              capital: 'Gangtok',      center: [27.5330, 88.5122], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'Northeast' },
  TN: { code: 'TN', name: 'Tamil Nadu',          capital: 'Chennai',      center: [11.1271, 78.6569], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'South' },
  TS: { code: 'TS', name: 'Telangana',           capital: 'Hyderabad',    center: [18.1124, 79.0193], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'South' },
  TR: { code: 'TR', name: 'Tripura',             capital: 'Agartala',     center: [23.9408, 91.9882], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'Northeast' },
  UP: { code: 'UP', name: 'Uttar Pradesh',       capital: 'Lucknow',      center: [26.8467, 80.9462], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'North' },
  UK: { code: 'UK', name: 'Uttarakhand',         capital: 'Dehradun',     center: [30.0668, 79.0193], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'North' },
  WB: { code: 'WB', name: 'West Bengal',         capital: 'Kolkata',      center: [22.9868, 87.8550], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'East' },
  // Union Territories
  DL: { code: 'DL', name: 'Delhi',               capital: 'New Delhi',    center: [28.6139, 77.2090], police: '100', ambulance: '102', fire: '101', highway: '1033', region: 'North' },
  JK: { code: 'JK', name: 'Jammu & Kashmir',     capital: 'Srinagar',     center: [33.7782, 76.5762], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'North' },
  LA: { code: 'LA', name: 'Ladakh',              capital: 'Leh',          center: [34.1526, 77.5770], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'North' },
  CH: { code: 'CH', name: 'Chandigarh',          capital: 'Chandigarh',   center: [30.7333, 76.7794], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'North' },
  PY: { code: 'PY', name: 'Puducherry',          capital: 'Puducherry',   center: [11.9416, 79.8083], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'South' },
  AN: { code: 'AN', name: 'Andaman & Nicobar',   capital: 'Port Blair',   center: [11.7401, 92.6586], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'Island' },
  DN: { code: 'DN', name: 'Dadra & Nagar Haveli',capital: 'Silvassa',     center: [20.1809, 73.0169], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'West' },
  LD: { code: 'LD', name: 'Lakshadweep',         capital: 'Kavaratti',    center: [10.5667, 72.6417], police: '100', ambulance: '108', fire: '101', highway: '1033', region: 'Island' },
};

// Match Nominatim state name → our state code
const STATE_NAME_MAP = {
  'andhra pradesh': 'AP', 'arunachal pradesh': 'AR', 'assam': 'AS',
  'bihar': 'BR', 'chhattisgarh': 'CG', 'goa': 'GA', 'gujarat': 'GJ',
  'haryana': 'HR', 'himachal pradesh': 'HP', 'jharkhand': 'JH',
  'karnataka': 'KA', 'kerala': 'KL', 'madhya pradesh': 'MP',
  'maharashtra': 'MH', 'manipur': 'MN', 'meghalaya': 'ML',
  'mizoram': 'MZ', 'nagaland': 'NL', 'odisha': 'OD', 'orissa': 'OD',
  'punjab': 'PB', 'rajasthan': 'RJ', 'sikkim': 'SK', 'tamil nadu': 'TN',
  'telangana': 'TS', 'tripura': 'TR', 'uttar pradesh': 'UP',
  'uttarakhand': 'UK', 'uttaranchal': 'UK', 'west bengal': 'WB',
  'delhi': 'DL', 'national capital territory of delhi': 'DL',
  'jammu and kashmir': 'JK', 'jammu & kashmir': 'JK', 'ladakh': 'LA',
  'chandigarh': 'CH', 'puducherry': 'PY', 'pondicherry': 'PY',
  'andaman and nicobar islands': 'AN', 'dadra and nagar haveli': 'DN',
  'lakshadweep': 'LD',
};

/**
 * Resolve a Nominatim state string to our state code + full state data.
 */
export const resolveState = (nominatimStateName) => {
  if (!nominatimStateName) return null;
  const key = nominatimStateName.toLowerCase().trim();
  const code = STATE_NAME_MAP[key];
  return code ? INDIA_STATES[code] : null;
};

/**
 * Get state data by code.
 */
export const getStateByCode = (code) => INDIA_STATES[code?.toUpperCase()] || null;

/**
 * Get all states as array, sorted by name.
 */
export const getAllStates = () =>
  Object.values(INDIA_STATES).sort((a, b) => a.name.localeCompare(b.name));

/**
 * Get states by region.
 */
export const getStatesByRegion = (region) =>
  Object.values(INDIA_STATES).filter((s) => s.region === region);
