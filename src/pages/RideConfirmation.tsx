import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface RideDetails {
  driverId: string;
  driver: {
    name: string;
  };
  pickup: string;
  dropoff: string;
}

export function RideConfirmation() {
  const { rideId } = useParams<{ rideId: string }>();
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!rideId) return;

      try {
        const rideDoc = await getDoc(doc(db, 'rides', rideId));
        if (rideDoc.exists()) {
          setRideDetails(rideDoc.data() as RideDetails);
        }
      } catch (error) {
        console.error('Error fetching ride details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C69249]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-[#C69249]" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#C69249] mb-4">
            Ride Scheduled Successfully!
          </h1>
          
          <p className="text-lg text-neutral-300 mb-8">
            Your ride request has been sent to {rideDetails?.driver.name}. They will review your request and confirm the booking shortly.
          </p>

          {rideDetails && (
            <div className="bg-neutral-900 rounded-lg p-6 mb-8">
              <h2 className="font-semibold mb-4">Ride Details</h2>
              <div className="text-left text-neutral-300 space-y-3">
                <p>
                  <span className="font-medium">From:</span> {rideDetails.pickup}
                </p>
                <p>
                  <span className="font-medium">To:</span> {rideDetails.dropoff}
                </p>
                <p>
                  <span className="font-medium">Driver:</span> {rideDetails.driver.name}
                </p>
              </div>
            </div>
          )}

          <div className="bg-neutral-900 rounded-lg p-6 mb-8">
            <h2 className="font-semibold mb-4">What happens next?</h2>
            <ul className="text-left text-neutral-300 space-y-3">
              <li>• The driver will review your request</li>
              <li>• You'll receive a confirmation notification</li>
              <li>• Final pricing will be confirmed</li>
              <li>• Your ride details will be scheduled</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link 
              to={`/rider?tab=messages&rideId=${rideId}&driverId=${rideDetails?.driverId}`}
              className="inline-block w-full py-3 px-6 bg-[#C69249] text-white rounded-lg hover:bg-[#B58239] transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Message Driver</span>
              </div>
            </Link>

            <Link 
              to="/rider" 
              className="inline-block w-full py-3 px-6 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
            >
              View My Rides
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RideConfirmation;
