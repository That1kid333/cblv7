import { RideRequest } from '../types/ride';
import { Driver } from '../types/driver';

const RIDE_REQUEST_WEBHOOK = 'https://hook.us1.make.com/230lqlrgl82qcp54v3etqhifyt4terqf';
const DRIVER_REGISTRATION_WEBHOOK = 'https://hook.us1.make.com/jf2f7ipkfm91ap9np2ggvpp9iyxp1417';

export async function submitToWebhook(rideData: RideRequest) {
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
      throw new Error(`Webhook submission failed: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('Webhook submission error:', error);
    if (error instanceof Error) {
      throw new Error(`Webhook error: ${error.message}`);
    } else {
      throw new Error('Failed to submit to webhook');
    }
  }
}

export async function submitDriverRegistration(driver: Driver) {
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
        vehicle: {
          make: driver.vehicle.make,
          model: driver.vehicle.model,
          year: driver.vehicle.year,
          color: driver.vehicle.color,
          plate: driver.vehicle.plate
        },
        driversLicense: {
          number: driver.driversLicense.number,
          expirationDate: driver.driversLicense.expirationDate
        },
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`Driver registration webhook failed: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('Driver registration webhook error:', error);
    if (error instanceof Error) {
      throw new Error(`Webhook error: ${error.message}`);
    } else {
      throw new Error('Failed to submit driver registration');
    }
  }
}