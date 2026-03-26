import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  QueryConstraint,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';
import { Driver } from '../../types/driver';

interface RideRequest {
  riderId: string;
  driverId: string;
  pickup: string;
  dropoff: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  timestamp: any;
  estimatedPickupTime: string;
  passengers: number;
  fare?: number;
}

interface DriverDetails {
  name: string;
  vehicle?: {
    make: string;
    model: string;
    color: string;
  };
  photo?: string;
}

class RideService {
  async getAvailableDrivers(locationId?: string): Promise<Driver[]> {
    try {
      console.log('Fetching drivers for location:', locationId);
      const driversRef = collection(db, 'drivers');
      
      // Base query conditions
      const conditions: QueryConstraint[] = [
        where('isOnline', '==', true),
        where('status', '==', 'active'),
      ];

      // Add location filter if locationId is provided
      if (locationId) {
        conditions.push(where('serviceLocations', 'array-contains', locationId));
      }

      // Create query with all conditions
      const q = query(driversRef, ...conditions, orderBy('rating', 'desc'));

      console.log('Executing drivers query...');
      const querySnapshot = await getDocs(q);
      const drivers: Driver[] = [];

      querySnapshot.forEach((doc) => {
        const driverData = doc.data();
        console.log('Found driver:', driverData.name, 'Online:', driverData.isOnline, 'Tag Number:', driverData.tagNumber);
        console.log('Tag Number:', driverData.tagNumber);
        console.log('Driver Data:', driverData);
        drivers.push({ id: doc.id, ...driverData } as Driver);
      });

      console.log('Found', drivers.length, 'available drivers');
      return drivers;
    } catch (error) {
      console.error('Error getting available drivers:', error);
      return [];
    }
  }

  async requestRide(riderId: string, driverId: string, pickup: string, dropoff: string): Promise<string> {
    try {
      const rideRequest: RideRequest = {
        riderId,
        driverId,
        pickup,
        dropoff,
        status: 'pending',
        timestamp: serverTimestamp(),
      };

      const ridesRef = collection(db, 'rides');
      const docRef = await addDoc(ridesRef, rideRequest);
      console.log('Ride request created with ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating ride request:', error);
      throw new Error('Failed to create ride request');
    }
  }

  async createRideRequest(rideRequest: Omit<RideRequest, 'timestamp'>): Promise<string> {
    try {
      const ridesRef = collection(db, 'rides');
      const docRef = await addDoc(ridesRef, {
        ...rideRequest,
        timestamp: serverTimestamp(),
        status: 'pending'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating ride request:', error);
      throw error;
    }
  }

  async getRideDetails(rideId: string): Promise<(RideRequest & { id: string; driver: any }) | null> {
    try {
      const rideDoc = await getDoc(doc(db, 'rides', rideId));
      if (!rideDoc.exists()) return null;

      const rideData = rideDoc.data() as RideRequest;
      const driverDoc = await getDoc(doc(db, 'drivers', rideData.driverId));
      const driverData = driverDoc.data() as DriverDetails | undefined;

      return {
        id: rideDoc.id,
        ...rideData,
        driver: {
          name: driverData?.name || '',
          vehicle: driverData?.vehicle ? 
            `${driverData.vehicle.make} ${driverData.vehicle.model} (${driverData.vehicle.color})` : 
            'Vehicle information not available',
          photo: driverData?.photo || ''
        }
      };
    } catch (error) {
      console.error('Error getting ride details:', error);
      throw error;
    }
  }

  async getUserRides(userId: string, type: 'upcoming' | 'past'): Promise<(RideRequest & { id: string; driver: any })[]> {
    try {
      const ridesRef = collection(db, 'rides');
      const now = new Date();
      
      let conditions: QueryConstraint[] = [
        where('riderId', '==', userId)
      ];

      if (type === 'upcoming') {
        conditions = [
          ...conditions,
          where('status', 'in', ['pending', 'active']),
          where('estimatedPickupTime', '>=', now.toISOString())
        ];
      } else {
        conditions = [
          ...conditions,
          where('status', 'in', ['completed', 'cancelled']),
          where('estimatedPickupTime', '<', now.toISOString())
        ];
      }

      const q = query(ridesRef, ...conditions, orderBy('estimatedPickupTime', type === 'upcoming' ? 'asc' : 'desc'));
      const querySnapshot = await getDocs(q);
      
      const rides = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const rideData = doc.data() as RideRequest;
          const driverDoc = await getDoc(doc(db, 'drivers', rideData.driverId));
          const driverData = driverDoc.data() as DriverDetails | undefined;

          return {
            id: doc.id,
            ...rideData,
            driver: {
              name: driverData?.name || '',
              vehicle: driverData?.vehicle ? 
                `${driverData.vehicle.make} ${driverData.vehicle.model} (${driverData.vehicle.color})` : 
                'Vehicle information not available',
              photo: driverData?.photo || ''
            }
          };
        })
      );

      return rides;
    } catch (error) {
      console.error('Error getting user rides:', error);
      throw error;
    }
  }

  async updateRideStatus(rideId: string, status: RideRequest['status']): Promise<void> {
    try {
      await updateDoc(doc(db, 'rides', rideId), {
        status,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating ride status:', error);
      throw error;
    }
  }

  subscribeToRideStatus(rideId: string, callback: (status: string) => void): () => void {
    const unsubscribe = onSnapshot(doc(db, 'rides', rideId), (doc) => {
      if (doc.exists()) {
        const rideData = doc.data() as RideRequest;
        callback(rideData.status);
      }
    });

    return unsubscribe;
  }

  async getDriverRides(driverId: string, status?: RideRequest['status'][]): Promise<(RideRequest & { id: string })[]> {
    try {
      const ridesRef = collection(db, 'rides');
      let conditions: QueryConstraint[] = [
        where('driverId', '==', driverId)
      ];

      if (status) {
        conditions.push(where('status', 'in', status));
      }

      const q = query(ridesRef, ...conditions, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (RideRequest & { id: string })[];
    } catch (error) {
      console.error('Error getting driver rides:', error);
      throw error;
    }
  }
}

export const rideService = new RideService();
