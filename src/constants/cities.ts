export const SUPPORTED_CITIES = [
  'New York City',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
  'Atlanta'
] as const;

export type SupportedCity = typeof SUPPORTED_CITIES[number];

// Atlanta locations
export const ATLANTA_LOCATIONS = [
  { id: 'downtown-atl', name: 'Downtown Atlanta', area: 'Downtown', coordinates: { latitude: 33.7490, longitude: -84.3880 } },
  { id: 'midtown-atl', name: 'Midtown', area: 'Midtown', coordinates: { latitude: 33.7841, longitude: -84.3825 } },
  { id: 'buckhead', name: 'Buckhead', area: 'Buckhead', coordinates: { latitude: 33.8392, longitude: -84.3791 } },
  { id: 'airport', name: 'Hartsfield-Jackson Airport', area: 'Airport', coordinates: { latitude: 33.6407, longitude: -84.4277 } }
];
