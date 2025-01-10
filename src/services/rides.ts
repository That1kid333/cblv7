import { 
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { webhookService } from '../lib/services/webhook.service';
import { RideRequest } from '../types/ride';

export async function submitRideRequest(rideData: RideRequest) {
  try {
    // First submit to webhook
    await webhookService.submitRideRequest(rideData);

    // Then save to Firestore
    const ride = await addDoc(collection(db, 'rides'), {
      customerName: rideData.name,
      phone: rideData.phone,
      pickup: rideData.pickup || '',
      dropoff: rideData.dropoff || '',
      locationId: rideData.locationId,
      status: 'pending',
      created_at: new Date().toISOString(),
      scheduled_time: new Date().toISOString()
    });

    return { id: ride.id };
  } catch (error) {
    console.error('Error submitting ride request:', error);
    throw error;
  }
}

export async function getRidesByDriver(driverId: string) {
  try {
    const q = query(
      collection(db, 'rides'),
      where('driverId', '==', driverId),
      orderBy('created_at', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching rides:', error);
    throw error;
  }
}

export async function updateRideStatus(rideId: string, status: string) {
  try {
    await updateDoc(doc(db, 'rides', rideId), {
      status,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating ride status:', error);
    throw error;
  }
}