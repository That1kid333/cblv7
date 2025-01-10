export interface Location {
  id: string;
  name: string;
  area: string;
}

export const CITY_LOCATIONS: Location[] = [
  // Manhattan
  { id: 'upper-manhattan', name: 'Upper Manhattan', area: 'Manhattan' },
  { id: 'midtown-manhattan', name: 'Midtown Manhattan', area: 'Manhattan' },
  { id: 'lower-manhattan', name: 'Lower Manhattan', area: 'Manhattan' },
  
  // Brooklyn
  { id: 'downtown-brooklyn', name: 'Downtown Brooklyn', area: 'Brooklyn' },
  { id: 'williamsburg', name: 'Williamsburg', area: 'Brooklyn' },
  { id: 'park-slope', name: 'Park Slope', area: 'Brooklyn' },
  
  // Queens
  { id: 'astoria', name: 'Astoria', area: 'Queens' },
  { id: 'long-island-city', name: 'Long Island City', area: 'Queens' },
  { id: 'flushing', name: 'Flushing', area: 'Queens' },
  
  // Bronx
  { id: 'south-bronx', name: 'South Bronx', area: 'Bronx' },
  { id: 'fordham', name: 'Fordham', area: 'Bronx' },
  { id: 'riverdale', name: 'Riverdale', area: 'Bronx' },
  
  // Staten Island
  { id: 'st-george', name: 'St. George', area: 'Staten Island' },
  { id: 'todt-hill', name: 'Todt Hill', area: 'Staten Island' },
  { id: 'great-kills', name: 'Great Kills', area: 'Staten Island' }
];

// Helper function to get location by ID
export const getLocationById = (locationId: string): Location | undefined => {
  return CITY_LOCATIONS.find(location => location.id === locationId);
};

// Helper function to get locations by area
export const getLocationsByArea = (area: string): Location[] => {
  return CITY_LOCATIONS.filter(location => location.area === area);
};

// Helper function to check if a location exists
export const isValidLocation = (locationId: string): boolean => {
  return CITY_LOCATIONS.some(location => location.id === locationId);
};
