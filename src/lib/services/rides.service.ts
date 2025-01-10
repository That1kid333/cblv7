import { 
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

export const ridesService = {
  async createRide(rideData: {
    name: string;
    phone: string;
    pickup?: string;
    dropoff?: string;
    locationId: string;
  }) {
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
  },

  async getRidesByDriver(driverId: string) {
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
  },

  async updateRideStatus(rideId: string, status: string) {
    await updateDoc(doc(db, 'rides', rideId), {
      status,
      updated_at: new Date().toISOString()
    });
  },

  subscribeToRides(driverId: string, callback: (rides: any[]) => void) {
    const q = query(
      collection(db, 'rides'),
      where('driverId', '==', driverId),
      orderBy('created_at', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const rides = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(rides);
    });
  }
};