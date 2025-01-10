import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface DriverMetrics {
  hoursOnline: number;
  totalRides: number;
  rating: number;
  todayRides: number;
  todayHours: number;
}

interface RideData {
  id: string;
  status: string;
  created_at: string;
  rating?: number;
  driverId: string;
}

interface DriverStatusData {
  id: string;
  driverId: string;
  isOnline: boolean;
  lastOnlineChange: string;
}

export function useDriverMetrics(driverId: string) {
  const [metrics, setMetrics] = useState<DriverMetrics>({
    hoursOnline: 0,
    totalRides: 0,
    rating: 5.0,
    todayRides: 0,
    todayHours: 0
  });

  useEffect(() => {
    if (!driverId) return;

    // Get today's start timestamp (midnight)
    const today = new Date('2025-01-10T17:41:10-05:00');
    today.setHours(0, 0, 0, 0);

    // Listen for completed rides
    const ridesQuery = query(
      collection(db, 'rides'),
      where('driverId', '==', driverId),
      where('status', '==', 'completed')
    );

    // Listen for online status changes
    const statusQuery = query(
      collection(db, 'driverStatus'),
      where('driverId', '==', driverId)
    );

    const unsubscribeRides = onSnapshot(ridesQuery, (snapshot) => {
      const allRides = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RideData));

      // Calculate total rides
      const totalRides = allRides.length;

      // Calculate today's rides
      const todayRides = allRides.filter(ride => 
        new Date(ride.created_at) >= today
      ).length;

      // Calculate average rating
      const ratings = allRides.map(ride => ride.rating).filter(Boolean);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 5.0;

      setMetrics(prev => ({
        ...prev,
        totalRides,
        todayRides,
        rating: Number(averageRating.toFixed(1))
      }));
    });

    const unsubscribeStatus = onSnapshot(statusQuery, (snapshot) => {
      const statusDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DriverStatusData));

      // Calculate total online hours
      let totalHours = 0;
      let todayHours = 0;

      statusDocs.forEach(doc => {
        if (doc.isOnline) {
          const startTime = new Date(doc.lastOnlineChange);
          const endTime = new Date('2025-01-10T17:41:10-05:00');
          const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
          
          totalHours += hours;
          if (startTime >= today) {
            todayHours += hours;
          }
        }
      });

      setMetrics(prev => ({
        ...prev,
        hoursOnline: Number(totalHours.toFixed(1)),
        todayHours: Number(todayHours.toFixed(1))
      }));
    });

    return () => {
      unsubscribeRides();
      unsubscribeStatus();
    };
  }, [driverId]);

  return metrics;
}
