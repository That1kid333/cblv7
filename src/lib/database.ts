import { createClient } from '@supabase/supabase-js';
import { Driver } from '../types/driver';

const supabaseUrl = 'https://jgbaqzgkdqqvxmqytgsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYmFxemdrZHFxdnhtcXl0Z3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExODg5NzksImV4cCI6MjA0Njc2NDk3OX0.XpmQLQy2Mm2vgWg6UourHAapIee3JfuS1Ncz5mt8610';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Driver operations
export async function createDriver(driver: Partial<Driver>) {
  const { data, error } = await supabase
    .from('drivers')
    .insert([driver])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDriver(id: string, updates: Partial<Driver>) {
  const { data, error } = await supabase
    .from('drivers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDriver(id: string) {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getDriverByEmail(email: string) {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw error;
  return data;
}

// Rider operations
export async function createRider(rider: any) {
  const { data, error } = await supabase
    .from('riders')
    .insert([rider])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRider(id: string, updates: any) {
  const { data, error } = await supabase
    .from('riders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRider(id: string) {
  const { data, error } = await supabase
    .from('riders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Ride operations
export async function createRide(ride: any) {
  const { data, error } = await supabase
    .from('rides')
    .insert([ride])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRide(id: string, updates: any) {
  const { data, error } = await supabase
    .from('rides')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRidesByDriver(driverId: string) {
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .eq('driver_id', driverId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRidesByRider(riderId: string) {
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .eq('rider_id', riderId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Message operations
export async function createMessage(message: any) {
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMessagesByRide(rideId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('ride_id', rideId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// Real-time subscriptions
export function subscribeToDriverUpdates(driverId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`driver-${driverId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'drivers',
        filter: `id=eq.${driverId}`
      },
      callback
    )
    .subscribe();
}

export function subscribeToRideUpdates(rideId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`ride-${rideId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rides',
        filter: `id=eq.${rideId}`
      },
      callback
    )
    .subscribe();
}

export function subscribeToNewMessages(rideId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`messages-${rideId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `ride_id=eq.${rideId}`
      },
      callback
    )
    .subscribe();
}