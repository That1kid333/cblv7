import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { updateEmail, updatePassword } from 'firebase/auth';
import type { Rider } from '../../types/rider';

export const riderService = {
  async updateBasicInfo(riderId: string, updates: Partial<Pick<Rider, 'name' | 'phone' | 'photo'>>) {
    try {
      const riderRef = doc(db, 'riders', riderId);
      await updateDoc(riderRef, {
        ...updates,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating rider info:', error);
      throw error;
    }
  },

  async updateLocation(riderId: string, locationId: string): Promise<Rider> {
    try {
      const riderRef = doc(db, 'riders', riderId);
      
      // First get the current rider data
      const currentDoc = await getDoc(riderRef);
      if (!currentDoc.exists()) {
        throw new Error('Rider not found');
      }
      
      const currentData = currentDoc.data();
      
      // Prepare update data while preserving all existing fields
      const updateData = {
        ...currentData,
        serviceLocations: [locationId], // Make sure it's an array
        type: 'rider' as const,
        status: currentData.status || 'active',
        updated_at: new Date().toISOString()
      };
      
      // Update the document
      await updateDoc(riderRef, updateData);
      
      // Return the updated rider data with the correct ID
      return { 
        id: currentDoc.id,
        ...updateData,
      } as Rider;
    } catch (error) {
      console.error('Error updating rider location:', error);
      throw error;
    }
  },

  async updateEmail(riderId: string, currentUser: any, newEmail: string) {
    try {
      // Update Firebase Auth email
      await updateEmail(currentUser, newEmail);
      
      // Update Firestore document
      const riderRef = doc(db, 'riders', riderId);
      await updateDoc(riderRef, {
        email: newEmail,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating rider email:', error);
      throw error;
    }
  },

  async updatePassword(currentUser: any, newPassword: string) {
    try {
      await updatePassword(currentUser, newPassword);
    } catch (error) {
      console.error('Error updating rider password:', error);
      throw error;
    }
  },

  async updateNotificationPreferences(
    riderId: string,
    preferences: {
      email: boolean;
      push: boolean;
      sms: boolean;
    }
  ): Promise<void> {
    try {
      const riderRef = doc(db, 'riders', riderId);
      await updateDoc(riderRef, {
        notifications: preferences,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw new Error('Failed to update notification preferences');
    }
  }
};
