import Airtable from 'airtable';

// Initialize Airtable
const airtable = new Airtable({
  apiKey: process.env.VITE_AIRTABLE_API_KEY
});

const base = airtable.base(process.env.VITE_AIRTABLE_BASE_ID!);

// Driver operations
export async function createDriver(driverData: any) {
  try {
    const record = await base('Drivers').create([
      { fields: driverData }
    ]);
    return record[0];
  } catch (error) {
    console.error('Error creating driver:', error);
    throw error;
  }
}

export async function updateDriver(recordId: string, updates: any) {
  try {
    const record = await base('Drivers').update([
      { id: recordId, fields: updates }
    ]);
    return record[0];
  } catch (error) {
    console.error('Error updating driver:', error);
    throw error;
  }
}

export async function getDriver(recordId: string) {
  try {
    const record = await base('Drivers').find(recordId);
    return record;
  } catch (error) {
    console.error('Error fetching driver:', error);
    throw error;
  }
}

// Ride operations
export async function createRide(rideData: any) {
  try {
    const record = await base('Rides').create([
      { fields: rideData }
    ]);
    return record[0];
  } catch (error) {
    console.error('Error creating ride:', error);
    throw error;
  }
}

export async function updateRide(recordId: string, updates: any) {
  try {
    const record = await base('Rides').update([
      { id: recordId, fields: updates }
    ]);
    return record[0];
  } catch (error) {
    console.error('Error updating ride:', error);
    throw error;
  }
}

export async function getRidesByDriver(driverId: string) {
  try {
    const records = await base('Rides')
      .select({
        filterByFormula: `{DriverId} = '${driverId}'`,
        sort: [{ field: 'CreatedTime', direction: 'desc' }]
      })
      .all();
    return records;
  } catch (error) {
    console.error('Error fetching rides:', error);
    throw error;
  }
}

// Message operations
export async function createMessage(messageData: any) {
  try {
    const record = await base('Messages').create([
      { fields: messageData }
    ]);
    return record[0];
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

export async function getMessagesByRide(rideId: string) {
  try {
    const records = await base('Messages')
      .select({
        filterByFormula: `{RideId} = '${rideId}'`,
        sort: [{ field: 'CreatedTime', direction: 'asc' }]
      })
      .all();
    return records;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}