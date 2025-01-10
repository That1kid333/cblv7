export interface RideRequest {
  name: string;
  phone: string;
  pickup: string;
  dropoff: string;
  locationId: string;
  driverId: string;
  rideId?: string;
  timestamp?: string;
}

export interface Ride extends RideRequest {
  id: string;
  riderId: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  created_at: string;
  scheduled_time: string;
  updated_at?: string;
}