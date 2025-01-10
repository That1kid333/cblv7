import { RideRequest } from '../../types/ride';
import { Driver } from '../../types/driver';

const RIDE_REQUEST_WEBHOOK = 'https://hook.us1.make.com/230lqlrgl82qcp54v3etqhifyt4terqf';
const DRIVER_REGISTRATION_WEBHOOK = 'https://hook.us1.make.com/jf2f7ipkfm91ap9np2ggvpp9iyxp1417';

export const webhookService = {
  async submitRideRequest(rideData: RideRequest) {
    try {
      const response = await fetch(RIDE_REQUEST_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...rideData,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit ride request: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('Error submitting ride request:', error);
      throw error;
    }
  },

  async submitDriverRegistration(driver: Driver) {
    try {
      const response = await fetch(DRIVER_REGISTRATION_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: driver.id,
          name: driver.name,
          email: driver.email,
          phone: driver.phone,
          vehicle: driver.vehicle,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit driver registration: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('Error submitting driver registration:', error);
      throw error;
    }
  }
};