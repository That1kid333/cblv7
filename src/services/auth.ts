import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Driver } from '../types/driver';

export async function registerDriver(driverData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  vehicle: string;
}): Promise<Driver> {
  try {
    // Create authentication account
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      driverData.email,
      driverData.password
    );

    // Create driver document in Firestore
    const driverDoc = {
      id: userCredential.user.uid,
      name: driverData.name,
      email: driverData.email,
      phone: driverData.phone,
      vehicle: driverData.vehicle,
      available: false,
      rating: 5.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await setDoc(doc(db, 'drivers', userCredential.user.uid), driverDoc);

    return driverDoc as Driver;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function loginDriver(email: string, password: string): Promise<Driver> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get driver data from Firestore
    const driverDoc = await getDoc(doc(db, 'drivers', userCredential.user.uid));
    
    if (!driverDoc.exists()) {
      throw new Error('Driver not found');
    }

    return { id: driverDoc.id, ...driverDoc.data() } as Driver;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}