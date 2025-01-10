import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import type { SupportedCity } from '../constants/cities';
import { useNavigate } from 'react-router-dom';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Location {
  id: string;
  name: string;
  area: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface Driver {
  id: string;
  name: string;
  rating?: number;
  available: boolean;
  currentLocation?: Coordinates;
  serviceLocations: string[];
  schedule?: {
    [key: number]: Array<{
      start: string;
      end: string;
    }>;
  };
}

interface DriverWithDistance extends Driver {
  distance?: number;
}

// Define locations for each supported city
const CITY_LOCATIONS: { [key in SupportedCity]: Location[] } = {
  'New York City': [
    { id: 'manhattan', name: 'Manhattan', area: 'Manhattan', coordinates: { latitude: 40.7831, longitude: -73.9712 } },
    { id: 'brooklyn', name: 'Brooklyn', area: 'Brooklyn', coordinates: { latitude: 40.6782, longitude: -73.9442 } },
    { id: 'queens', name: 'Queens', area: 'Queens', coordinates: { latitude: 40.7282, longitude: -73.7949 } },
    { id: 'bronx', name: 'Bronx', area: 'Bronx', coordinates: { latitude: 40.8448, longitude: -73.8648 } },
    { id: 'staten-island', name: 'Staten Island', area: 'Staten Island', coordinates: { latitude: 40.5795, longitude: -74.1502 } }
  ],
  'Los Angeles': [
    { id: 'downtown-la', name: 'Downtown LA', area: 'Central LA', coordinates: { latitude: 34.0407, longitude: -118.2468 } },
    { id: 'hollywood', name: 'Hollywood', area: 'Central LA', coordinates: { latitude: 34.0928, longitude: -118.3287 } },
    { id: 'santa-monica', name: 'Santa Monica', area: 'Westside', coordinates: { latitude: 34.0195, longitude: -118.4912 } },
    { id: 'venice', name: 'Venice', area: 'Westside', coordinates: { latitude: 33.9850, longitude: -118.4695 } }
  ],
  'Atlanta': [
    { id: 'downtown-atl', name: 'Downtown Atlanta', area: 'Downtown', coordinates: { latitude: 33.7490, longitude: -84.3880 } },
    { id: 'midtown-atl', name: 'Midtown', area: 'Midtown', coordinates: { latitude: 33.7841, longitude: -84.3825 } },
    { id: 'buckhead', name: 'Buckhead', area: 'Buckhead', coordinates: { latitude: 33.8392, longitude: -84.3791 } },
    { id: 'airport', name: 'Hartsfield-Jackson Airport', area: 'Airport', coordinates: { latitude: 33.6407, longitude: -84.4277 } }
  ],
  'Chicago': [
    { id: 'loop', name: 'The Loop', area: 'Downtown', coordinates: { latitude: 41.8781, longitude: -87.6298 } },
    { id: 'lincoln-park', name: 'Lincoln Park', area: 'North Side', coordinates: { latitude: 41.9214, longitude: -87.6513 } },
    { id: 'wicker-park', name: 'Wicker Park', area: 'West Side', coordinates: { latitude: 41.9088, longitude: -87.6796 } }
  ],
  'Houston': [
    { id: 'downtown-houston', name: 'Downtown Houston', area: 'Downtown', coordinates: { latitude: 29.7604, longitude: -95.3698 } },
    { id: 'midtown', name: 'Midtown', area: 'Central', coordinates: { latitude: 29.7447, longitude: -95.3783 } },
    { id: 'galleria', name: 'The Galleria', area: 'Uptown', coordinates: { latitude: 29.7600, longitude: -95.4619 } }
  ],
  'Phoenix': [
    { id: 'downtown-phoenix', name: 'Downtown Phoenix', area: 'Downtown', coordinates: { latitude: 33.4484, longitude: -112.0740 } },
    { id: 'scottsdale', name: 'Scottsdale', area: 'East Valley', coordinates: { latitude: 33.4942, longitude: -111.9261 } },
    { id: 'tempe', name: 'Tempe', area: 'East Valley', coordinates: { latitude: 33.4255, longitude: -111.9400 } }
  ],
  'Philadelphia': [
    { id: 'center-city', name: 'Center City', area: 'Downtown', coordinates: { latitude: 39.9526, longitude: -75.1652 } },
    { id: 'university-city', name: 'University City', area: 'West Philly', coordinates: { latitude: 39.9522, longitude: -75.1932 } },
    { id: 'fishtown', name: 'Fishtown', area: 'North Philly', coordinates: { latitude: 39.9723, longitude: -75.1339 } }
  ],
  'San Antonio': [
    { id: 'downtown-sa', name: 'Downtown San Antonio', area: 'Downtown', coordinates: { latitude: 29.4241, longitude: -98.4936 } },
    { id: 'alamo-heights', name: 'Alamo Heights', area: 'North Central', coordinates: { latitude: 29.4847, longitude: -98.4683 } },
    { id: 'pearl-district', name: 'Pearl District', area: 'Downtown', coordinates: { latitude: 29.4425, longitude: -98.4804 } }
  ],
  'San Diego': [
    { id: 'gaslamp', name: 'Gaslamp Quarter', area: 'Downtown', coordinates: { latitude: 32.7098, longitude: -117.1611 } },
    { id: 'la-jolla', name: 'La Jolla', area: 'Coastal', coordinates: { latitude: 32.8328, longitude: -117.2713 } },
    { id: 'pacific-beach', name: 'Pacific Beach', area: 'Coastal', coordinates: { latitude: 32.7997, longitude: -117.2304 } }
  ],
  'Dallas': [
    { id: 'downtown-dallas', name: 'Downtown Dallas', area: 'Downtown', coordinates: { latitude: 32.7767, longitude: -96.7970 } },
    { id: 'uptown', name: 'Uptown', area: 'Central Dallas', coordinates: { latitude: 32.7942, longitude: -96.8029 } },
    { id: 'deep-ellum', name: 'Deep Ellum', area: 'East Dallas', coordinates: { latitude: 32.7843, longitude: -96.7840 } }
  ],
  'San Jose': [
    { id: 'downtown-sj', name: 'Downtown San Jose', area: 'Downtown', coordinates: { latitude: 37.3382, longitude: -121.8863 } },
    { id: 'santana-row', name: 'Santana Row', area: 'West San Jose', coordinates: { latitude: 37.3209, longitude: -121.9476 } },
    { id: 'willow-glen', name: 'Willow Glen', area: 'South San Jose', coordinates: { latitude: 37.3057, longitude: -121.8907 } }
  ]
};

export function ScheduleRide() {
  const navigate = useNavigate();
  const { rider } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableDrivers, setAvailableDrivers] = useState<DriverWithDistance[]>([]);
  const [allDrivers, setAllDrivers] = useState<DriverWithDistance[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  useEffect(() => {
    if ('geolocation' in navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      const success = (position: GeolocationPosition) => {
        setUserCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationError('');
      };

      const error = (err: GeolocationPositionError) => {
        console.warn('Error getting location:', err.message);
        setLocationError('Unable to get your location. You can still select a pickup location manually.');
        setUserCoordinates(null);
      };

      navigator.geolocation.getCurrentPosition(success, error, options);

      return () => {
        // No cleanup needed for getCurrentPosition
      };
    } else {
      setLocationError('Geolocation is not supported by your browser. Please select a pickup location manually.');
    }
  }, []);

  useEffect(() => {
    const fetchAllDrivers = async () => {
      if (!selectedLocation || !rider?.currentCity) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const driversRef = collection(db, 'drivers');
        const q = query(
          driversRef,
          where('isOnline', '==', true),
          where('status', '==', 'active'),
          where('serviceLocations', 'array-contains', selectedLocation),
          where('currentCity', '==', rider.currentCity)
        );

        const querySnapshot = await getDocs(q);
        const drivers: DriverWithDistance[] = [];
        
        for (const doc of querySnapshot.docs) {
          const driverData = doc.data();
          const driver: Driver = {
            id: doc.id,
            name: driverData.name,
            rating: driverData.rating,
            available: true,
            currentLocation: driverData.currentLocation,
            serviceLocations: driverData.serviceLocations
          };
          
          const driverWithDistance: DriverWithDistance = { ...driver };
          
          if (userCoordinates && driver.currentLocation) {
            const distance = calculateDistance(
              userCoordinates.latitude,
              userCoordinates.longitude,
              driver.currentLocation.latitude,
              driver.currentLocation.longitude
            );
            driverWithDistance.distance = distance;
          }
          
          drivers.push(driverWithDistance);
        }

        if (userCoordinates) {
          drivers.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        }

        setAllDrivers(drivers);
        setAvailableDrivers(drivers); // Show all drivers initially
        
        if (drivers.length === 0) {
          setError(`No drivers found in ${rider.currentCity} for this location.`);
        }
      } catch (err) {
        console.error('Error finding drivers:', err);
        setError('Error finding drivers. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllDrivers();
  }, [selectedLocation, rider?.currentCity, userCoordinates]);

  useEffect(() => {
    if (!selectedDate || !selectedTime || allDrivers.length === 0) return;
    
    const currentTime = new Date('2025-01-10T17:07:23-05:00');
    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    
    // If scheduling for current day, check current time
    const isToday = selectedDate === currentTime.toISOString().split('T')[0];
    const selectedHour = parseInt(selectedTime.split(':')[0]);
    
    if (isToday && selectedHour < currentTime.getHours()) {
      setError('Please select a future time for today\'s rides');
      return;
    }

    const currentDay = scheduledDateTime.getDay();
    const scheduleHour = scheduledDateTime.getHours();

    const availableDrivers = allDrivers.filter(driver => {
      const schedule = driver.schedule?.[currentDay];
      if (!schedule) return true; // Available if no schedule set
      
      return schedule.some((shift: any) => {
        const startHour = parseInt(shift.start.split(':')[0]);
        const endHour = parseInt(shift.end.split(':')[0]);
        return scheduleHour >= startHour && scheduleHour < endHour;
      });
    });

    setAvailableDrivers(availableDrivers);
    
    if (availableDrivers.length === 0) {
      setError(`No drivers available for ${selectedTime} on ${selectedDate}. Please try a different time.`);
    }
  }, [selectedDate, selectedTime, allDrivers]);

  const handleSubmitRide = async () => {
    if (!selectedDriver) {
      setError('Please select a driver');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const selectedLocationData = cityLocations.find(loc => loc.id === selectedLocation);
      
      if (!selectedLocationData) {
        throw new Error('Invalid location selected');
      }

      await addDoc(collection(db, 'rides'), {
        riderId: rider?.id,
        driverId: selectedDriver,
        pickup: selectedLocationData.name,
        locationId: selectedLocation,
        status: 'pending',
        created_at: new Date().toISOString(),
        scheduled_time: `${selectedDate}T${selectedTime}`,
        currentCity: rider?.currentCity
      });

      // Navigate to confirmation page
      navigate('/rider/confirmation');
      
      // Reset form
      setSelectedLocation('');
      setSelectedDate('');
      setSelectedTime('');
      setSelectedDriver('');
      setAvailableDrivers([]);
    } catch (err) {
      console.error('Error scheduling ride:', err);
      setError('Failed to schedule ride. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; 
    return d;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };

  const cityLocations = rider?.currentCity ? CITY_LOCATIONS[rider.currentCity as SupportedCity] : [];

  const renderLocationOptions = () => {
    if (!rider?.currentCity) return null;
    
    const locations = CITY_LOCATIONS[rider.currentCity as SupportedCity] || [];
    if (locations.length === 0) {
      return (
        <div className="text-yellow-500 p-4">
          Service locations for {rider.currentCity} are coming soon!
        </div>
      );
    }

    return (
      <select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        className="w-full p-2 border rounded-md bg-gray-800 text-white border-gray-600"
      >
        <option value="">Select a location</option>
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
    );
  };

  if (!rider?.currentCity) {
    return (
      <div className="space-y-6">
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded-lg">
          Please set your city in your profile settings before scheduling a ride.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Schedule a Ride in {rider.currentCity}</h2>
      
      {locationError && (
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-2 rounded-lg mb-4">
          {locationError}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Pickup Location
          </label>
          {renderLocationOptions()}
        </div>

        {allDrivers.length > 0 && (
          <>
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-[#C69249] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-2">
                Time
              </label>
              <input
                type="time"
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-[#C69249] focus:border-transparent"
              />
            </div>
          </>
        )}

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C69249] mx-auto"></div>
            <div className="mt-2 text-gray-400">Finding Drivers...</div>
          </div>
        ) : (
          <>
            {allDrivers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">
                  {selectedDate && selectedTime ? 'Available Drivers' : 'All Drivers in Area'}
                </h3>
                <div className="space-y-4">
                  {(selectedDate && selectedTime ? availableDrivers : allDrivers).map((driver) => (
                    <div
                      key={driver.id}
                      className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                        selectedDriver === driver.id
                          ? 'bg-gray-700 border-[#C69249]'
                          : 'bg-gray-800 border-transparent hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedDriver(driver.id)}
                    >
                      <div className="font-medium">{driver.name}</div>
                      <div className="text-sm text-gray-400">Rating: {driver.rating ?? 'N/A'}</div>
                      {driver.distance !== undefined && (
                        <div className="text-sm text-gray-400">
                          Distance: {driver.distance.toFixed(1)} km
                        </div>
                      )}
                      {selectedDriver === driver.id && (
                        <div className="mt-2 text-[#C69249] text-sm">Selected</div>
                      )}
                    </div>
                  ))}
                </div>

                {selectedDriver && selectedDate && selectedTime && (
                  <button
                    onClick={handleSubmitRide}
                    disabled={isSubmitting}
                    className="w-full mt-4 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Scheduling Ride...' : 'Schedule with Selected Driver'}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
