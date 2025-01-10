interface FormData {
  name: string;
  phone: string;
  dropoff: string;
  pickup: string;
}

interface RideResponse {
  rideId: string;
  driverId: string;
  driverName: string;
  action: 'accept' | 'decline' | 'transfer';
  transferredTo?: string;
  customerName: string;
  timestamp: string;
}

export async function submitRideRequest(formData: FormData): Promise<Response> {
  const response = await fetch('https://hook.us1.make.com/230lqlrgl82qcp54v3etqhifyt4terqf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: formData.name,
      phone: formData.phone,
      dropoff_location: formData.dropoff,
      pickup_location: formData.pickup,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

export async function submitRideResponse(responseData: RideResponse): Promise<Response> {
  const response = await fetch('https://hook.us1.make.com/jp5iknecxrrou1anu5sytl9s89s84z2t', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...responseData,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}