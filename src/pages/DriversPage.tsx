import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Phone, MapPin } from 'lucide-react';
import { LocationSelector } from '../components/LocationSelector';
import { locations } from '../types/location';

interface Driver {
  id: string;
  name: string;
  image: string;
  rating: number;
  phone: string;
  available: boolean;
  locationId: string;
  pricing: {
    baseRate: number;
    perMile: number;
    minimumFare: number;
    airportFare: number;
  };
  car: {
    make: string;
    model: string;
    year: string;
    color: string;
  };
}

function DriversPage() {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);

  useEffect(() => {
    const storedDrivers = JSON.parse(localStorage.getItem('drivers') || '[]');
    const formattedDrivers = storedDrivers.map((driver: any) => ({
      id: driver.id,
      name: driver.name,
      image: driver.photo || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
      rating: driver.rating || 4.8,
      phone: driver.phone,
      available: driver.available,
      locationId: driver.locationId || locations[0].id,
      pricing: driver.pricing || {
        baseRate: 5,
        perMile: 2,
        minimumFare: 10,
        airportFare: 50
      },
      car: {
        make: driver.vehicle.make,
        model: driver.vehicle.model,
        year: driver.vehicle.year,
        color: driver.vehicle.color
      }
    }));
    setDrivers(formattedDrivers);
  }, []);

  const handleCallDriver = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleSelectDriver = async (driver: Driver) => {
    const currentRide = JSON.parse(localStorage.getItem('currentRideRequest') || '{}');
    
    const driverRides = JSON.parse(localStorage.getItem(`driver_${driver.id}_rides`) || '[]');
    const updatedRide = {
      ...currentRide,
      driverId: driver.id,
      status: 'pending'
    };
    
    localStorage.setItem(`driver_${driver.id}_rides`, JSON.stringify([...driverRides, updatedRide]));
    
    const pendingRides = JSON.parse(localStorage.getItem('pendingRides') || '[]');
    const updatedPendingRides = pendingRides.map((ride: any) => 
      ride.id === currentRide.id ? updatedRide : ride
    );
    localStorage.setItem('pendingRides', JSON.stringify(updatedPendingRides));

    await fetch('https://hook.us1.make.com/230lqlrgl82qcp54v3etqhifyt4terqf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updatedRide,
        driverName: driver.name,
        driverEmail: driver.email,
        timestamp: new Date().toISOString()
      }),
    });

    setSelectedDriver(driver);
    setShowConfirmation(true);
  };

  const currentLocation = locations.find(loc => loc.id === selectedLocation);
  const filteredDrivers = drivers.filter(driver => 
    driver.available && driver.locationId === selectedLocation
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-4 mb-8">
          <h1 className="text-[#F5A623] text-4xl font-bold text-center lg:text-left">
            Available Drivers
          </h1>
          
          <div className="flex justify-center lg:justify-start">
            <LocationSelector
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
            />
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-2 text-neutral-400">
            <MapPin className="w-5 h-5" />
            <span>Currently showing drivers in {currentLocation?.name}</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-neutral-900 rounded-lg overflow-hidden"
            >
              <img
                src={driver.image}
                alt={driver.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold">{driver.name}</h3>
                    <div className="text-sm text-neutral-400">
                      {driver.car.year} {driver.car.make} {driver.car.model}
                    </div>
                  </div>
                  <div className="text-[#F5A623]">★ {driver.rating}</div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 bg-neutral-800 p-3 rounded-lg mb-4">
                  <div>
                    <div className="text-neutral-400 text-sm">Base Rate</div>
                    <div className="font-semibold">${driver.pricing.baseRate}</div>
                  </div>
                  <div>
                    <div className="text-neutral-400 text-sm">Per Mile</div>
                    <div className="font-semibold">${driver.pricing.perMile}</div>
                  </div>
                  <div>
                    <div className="text-neutral-400 text-sm">Min Fare</div>
                    <div className="font-semibold">${driver.pricing.minimumFare}</div>
                  </div>
                  <div>
                    <div className="text-neutral-400 text-sm">Airport</div>
                    <div className="font-semibold">${driver.pricing.airportFare}</div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => handleSelectDriver(driver)}
                    className="flex-1 px-4 py-2 bg-[#F5A623] text-white rounded-lg hover:bg-[#E09612] transition-colors"
                  >
                    Select Driver
                  </button>
                  <button
                    onClick={() => handleCallDriver(driver.phone)}
                    className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors w-full sm:w-auto"
                  >
                    <Phone className="w-5 h-5 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDrivers.length === 0 && (
          <div className="text-center text-neutral-400 mt-8">
            No drivers are currently available in {currentLocation?.name}. 
            Please check back later or try another location.
          </div>
        )}
      </main>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Ride Request Sent!</h3>
            <p className="text-neutral-400 mb-6">
              Your request has been sent to {selectedDriver?.name}. They will review your trip details 
              and send you a confirmation email shortly. Please check your email for updates.
            </p>
            <button
              onClick={() => {
                setShowConfirmation(false);
                window.location.href = '/';
              }}
              className="w-full px-4 py-2 bg-[#F5A623] text-white rounded-lg hover:bg-[#E09612] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriversPage;