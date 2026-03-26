import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User,
  getAuth
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Driver } from '../../types/driver';
import { Rider } from '../../types/rider';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          unsubscribe();
          resolve(user);
        },
        reject
      );
    });
  },

  async signInWithGoogle(): Promise<Driver> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const driverDoc = await getDoc(doc(db, 'drivers', userCredential.user.uid));

      if (!driverDoc.exists()) {
        // Create a basic driver document if it doesn't exist
        const now = new Date().toISOString();
        const newDriver: Driver = {
          id: userCredential.user.uid,
          name: userCredential.user.displayName || '',
          email: userCredential.user.email || '',
          phone: userCredential.user.phoneNumber || '',
          photo: userCredential.user.photoURL || '',
          driversLicense: {
            number: '',
            expirationDate: ''
          },
          vehicle: {
            make: '',
            model: '',
            year: '',
            color: '',
            licensePlate: '',
            registration: {
              number: '',
              expirationDate: '',
              documentUrl: ''
            },
            insurance: {
              provider: '',
              policyNumber: '',
              expirationDate: '',
              documentUrl: ''
            }
          },
          metrics: {
            hoursOnline: 0,
            totalRides: 0,
            todayRides: 0,
            todayHours: 0,
            totalEarnings: 0
          },
          status: 'pending',
          serviceLocations: [],
          type: 'driver',
          created_at: now,
          updated_at: now
        };

        await setDoc(doc(db, 'drivers', userCredential.user.uid), newDriver);
        return newDriver;
      }

      return { id: driverDoc.id, ...driverDoc.data() } as Driver;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },

  async login(email: string, password: string, rememberMe: boolean = false): Promise<Driver> {
    try {
      // Set persistence based on remember me preference
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const driverDoc = await getDoc(doc(db, 'drivers', userCredential.user.uid));
      
      if (!driverDoc.exists()) {
        throw new Error('Driver account not found');
      }

      const driver = { id: driverDoc.id, ...driverDoc.data() } as Driver;
      
      // Update last login timestamp
      await updateDoc(doc(db, 'drivers', userCredential.user.uid), {
        last_login: serverTimestamp()
      });

      return driver;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  async register(driverData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    driversLicense: {
      number: string;
      expirationDate: string;
    };
    vehicle: {
      make: string;
      model: string;
      year: string;
      color: string;
      licensePlate: string;
      insurance: {
        provider: string;
        policyNumber: string;
        expirationDate: string;
        documentUrl: string;
      };
    };
    serviceLocations: string[];
  }): Promise<Driver> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, driverData.email, driverData.password);
      const now = new Date().toISOString();

      const newDriver: Driver = {
        id: userCredential.user.uid,
        name: driverData.name,
        email: driverData.email,
        phone: driverData.phone,
        photo: userCredential.user.photoURL || '',
        driversLicense: driverData.driversLicense,
        vehicle: {
          ...driverData.vehicle,
          registration: {
            number: '',
            expirationDate: '',
            documentUrl: ''
          }
        },
        metrics: {
          hoursOnline: 0,
          totalRides: 0,
          todayRides: 0,
          todayHours: 0,
          totalEarnings: 0
        },
        status: 'pending',
        serviceLocations: driverData.serviceLocations,
        type: 'driver',
        created_at: now,
        updated_at: now
      };

      await setDoc(doc(db, 'drivers', userCredential.user.uid), newDriver);
      return newDriver;
    } catch (error) {
      console.error('Error registering driver:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  async getUserDoc(uid: string): Promise<(Driver | Rider) & { type: string }> {
    try {
      // Try to get both driver and rider docs
      const [driverDoc, riderDoc] = await Promise.all([
        getDoc(doc(db, 'drivers', uid)),
        getDoc(doc(db, 'riders', uid))
      ]);

      if (driverDoc.exists()) {
        return { ...driverDoc.data() as Driver, type: 'driver' };
      }
      if (riderDoc.exists()) {
        return { ...riderDoc.data() as Rider, type: 'rider' };
      }

      // If no documents exist, check if the user exists in authentication
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create a basic rider document if user exists but has no document
      const now = new Date().toISOString();
      const newRider = {
        id: uid,
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        photo: user.photoURL || '',
        rating: 5.0,
        totalRides: 0,
        serviceLocations: [],
        created_at: now,
        updated_at: now,
        status: 'active' as const
      };

      // Save the new rider document
      await setDoc(doc(db, 'riders', uid), newRider);
      return { ...newRider, type: 'rider' };
    } catch (error) {
      console.error('Error getting user document:', error);
      throw error;
    }
  },

  async updateUserDoc(userId: string, userData: Rider | Driver): Promise<void> {
    try {
      const userRef = doc(db, userData.type === 'rider' ? 'riders' : 'drivers', userId);
      await updateDoc(userRef, {
        ...userData,
        updated_at: new Date().toISOString()
      });
      
      // Trigger auth state change to update the context
      const auth = getAuth();
      if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdToken(true);
        await auth.currentUser.reload();
      }
    } catch (error) {
      console.error('Error updating user document:', error);
      throw error;
    }
  },

  async updateRiderDoc(riderId: string, riderData: Rider): Promise<void> {
    try {
      const riderRef = doc(db, 'riders', riderId);
      
      // Ensure we preserve all fields and types
      const updateData = {
        ...riderData,
        type: 'rider' as const,
        serviceLocations: riderData.serviceLocations || [], // Ensure it's an array
        status: riderData.status || 'active',
        updated_at: new Date().toISOString()
      };
      
      // Update the document
      await updateDoc(riderRef, updateData);
      
      // Force a refresh of the auth state to update the context
      const auth = getAuth();
      if (auth.currentUser) {
        // Force token refresh
        await auth.currentUser.getIdToken(true);
        // Reload the user
        await auth.currentUser.reload();
        // Get the latest user doc
        await this.getUserDoc(riderId);
      }
    } catch (error) {
      console.error('Error updating rider document:', error);
      throw error;
    }
  },

  async registerRider(riderData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }): Promise<void> {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        riderData.email,
        riderData.password
      );

      const now = new Date().toISOString();
      
      // Check for referral
      const referralDriverId = sessionStorage.getItem('referralDriverId');
      let referralDriver = null;
      
      if (referralDriverId) {
        const driverDoc = await getDoc(doc(db, 'drivers', referralDriverId));
        if (driverDoc.exists()) {
          referralDriver = { id: driverDoc.id, ...driverDoc.data() };
          
          // Update driver's referral metrics
          const driverRef = doc(db, 'drivers', referralDriverId);
          await updateDoc(driverRef, {
            'metrics.totalReferrals': (referralDriver.metrics?.totalReferrals || 0) + 1,
            'metrics.activeReferrals': (referralDriver.metrics?.activeReferrals || 0) + 1
          });
        }
      }

      // Create rider document
      const riderDoc = {
        id: userCredential.user.uid,
        name: riderData.name,
        email: riderData.email,
        phone: riderData.phone,
        photo: '',
        rating: 5.0,
        totalRides: 0,
        referredBy: referralDriverId || null,
        created_at: now,
        updated_at: now,
        preferences: {
          notifications: true,
          language: 'en',
          currency: 'USD'
        }
      };

      // Save rider document
      await setDoc(doc(db, 'riders', riderDoc.id), riderDoc);
      
      // Clear referral from session storage
      sessionStorage.removeItem('referralDriverId');
    } catch (error) {
      console.error('Error registering rider:', error);
      // Handle specific Firebase Auth errors
      if (error instanceof Error) {
        const message = error.message;
        if (message.includes('auth/email-already-in-use')) {
          throw new Error('This email is already registered. Please sign in instead.');
        } else if (message.includes('auth/invalid-email')) {
          throw new Error('Please enter a valid email address.');
        } else if (message.includes('auth/operation-not-allowed')) {
          throw new Error('Email/password accounts are not enabled. Please contact support.');
        } else if (message.includes('auth/weak-password')) {
          throw new Error('Please choose a stronger password.');
        }
      }
      throw error;
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      if (error instanceof Error) {
        if (error.message.includes('auth/invalid-email')) {
          throw new Error('Please enter a valid email address');
        } else if (error.message.includes('auth/user-disabled')) {
          throw new Error('This account has been disabled');
        } else if (error.message.includes('auth/user-not-found')) {
          throw new Error('No account found with this email');
        } else if (error.message.includes('auth/wrong-password')) {
          throw new Error('Incorrect password');
        }
      }
      throw error;
    }
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
};

export const signInWithGoogle = authService.signInWithGoogle;