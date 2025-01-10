import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { FormInput } from '../components/FormInput';
import { LocationSelector } from '../components/LocationSelector';
import { DriverSelection } from '../components/DriverSelection';
import { locations } from '../types/location';
import { webhookService } from '../lib/services/webhook.service';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RideRequest } from '../types/ride';

function BookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RideRequest>({
    name: '',
    phone: '',
    pickup: '',
    dropoff: '',
    locationId: locations[0].id,
    driverId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.name.trim() || !formData.phone.trim()) {
        setError('Name and phone number are required');
        return;
      }
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      if (!formData.driverId) {
        throw new Error('Please select a driver');
      }

      // Save to Firebase
      const rideRef = await addDoc(collection(db, 'rides'), {
        customerName: formData.name,
        phone: formData.phone,
        pickup: formData.pickup || '',
        dropoff: formData.dropoff || '',
        locationId: formData.locationId,
        driverId: formData.driverId,
        status: 'pending',
        created_at: new Date('2025-01-10T17:34:28-05:00').toISOString(),
        scheduled_time: new Date('2025-01-10T17:34:28-05:00').toISOString(),
        date: new Date('2025-01-10T17:34:28-05:00').toLocaleDateString(),
        time: new Date('2025-01-10T17:34:28-05:00').toLocaleTimeString()
      });

      // Send to webhook with complete user information
      await webhookService.submitRideRequest({
        ...formData,
        rideId: rideRef.id,
        timestamp: new Date('2025-01-10T17:34:28-05:00').toISOString()
      });

      // Redirect to guest confirmation page with ride details
      navigate('/guest/confirmation', { 
        state: { 
          ride: {
            id: rideRef.id,
            ...formData,
            status: 'pending',
            created_at: new Date('2025-01-10T17:34:28-05:00').toISOString(),
            scheduled_time: new Date('2025-01-10T17:34:28-05:00').toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Submission error:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit ride request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (locationId: string) => {
    setFormData(prev => ({ ...prev, locationId, driverId: '' }));
  };

  const handleDriverSelect = (driverId: string) => {
    setFormData(prev => ({ ...prev, driverId }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-md">
          <h1 className="text-[#C69249] text-4xl font-bold mb-2">
            NEED A RIDE?
          </h1>
          <h2 className="text-white text-2xl mb-4">
            Private Rider Association Sign-up & Scheduler
          </h2>

          <p className="text-white mb-8">
            If you're looking for a ride to the airport or need a long distance run,
            please submit your info below. (Please schedule 24 hours prior)
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="mb-6">
                  <LocationSelector
                    locations={locations}
                    selectedLocation={formData.locationId}
                    onLocationChange={handleLocationChange}
                  />
                </div>

                <FormInput
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />

                <FormInput
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  required
                />

                <FormInput
                  label="Pickup Location"
                  name="pickup"
                  value={formData.pickup}
                  onChange={handleChange}
                  placeholder="Enter pickup address"
                />

                <FormInput
                  label="Drop-off Location"
                  name="dropoff"
                  value={formData.dropoff}
                  onChange={handleChange}
                  placeholder="Enter drop-off address"
                />
              </>
            ) : (
              <DriverSelection
                locationId={formData.locationId}
                selectedDriver={formData.driverId}
                onDriverSelect={handleDriverSelect}
              />
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-[#C69249] text-white rounded-lg hover:bg-[#B58239] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : step === 1 ? 'Next' : 'Schedule Ride'}
            </button>

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-3 px-6 bg-transparent border border-neutral-700 text-white rounded-lg hover:border-neutral-500 transition-colors"
              >
                Back
              </button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

export default BookingPage;