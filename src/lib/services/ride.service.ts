import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp, QueryConstraint } from 'firebase/firestore';
import { db } from '../firebase';
import { Driver } from '../../types/driver';

interface RideRequest {
  riderId: string;
  driverId: string;
  pickup: string;
  dropoff: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  timestamp: any;
  estimatedPickupTime?: string;
  fare?: number;
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
        console.log('Found driver:', driverData.name, 'Online:', driverData.isOnline);
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
}

export const rideService = new RideService();
