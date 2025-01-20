import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  getAuth
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
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
            expirationDate: '',
            documentUrl: ''
          },
          vehicle: {
            make: '',
            model: '',
            year: new Date().getFullYear().toString(),
            color: '',
            plate: '',
            insurance: {
              provider: '',
              policyNumber: '',
              expirationDate: '',
              documentUrl: ''
            },
            registration: {
              expirationDate: '',
              documentUrl: ''
            }
          },
          isOnline: true,
          lastOnlineChange: now,
          rating: 5.0,
          totalRides: 0,
          metrics: {
            totalEarnings: 0,
            acceptanceRate: 100,
            responseTime: 0,
            hoursOnline: 0,
            todayRides: 0
          },
          backgroundCheck: {
            status: 'pending',
            submissionDate: now,
            documentUrl: ''
          },
          baseRate: 25,
          airportRate: 35,
          longDistanceRate: 2,
          serviceLocations: [],
          status: 'active',
          created_at: now,
          updated_at: now,
          languages: [],
          experience: '0-1 years'
        };
        
        await setDoc(doc(db, 'drivers', userCredential.user.uid), newDriver);
        return newDriver;
      }

      return { id: driverDoc.id, ...driverDoc.data() } as Driver;
    } catch (error) {
      console.error('Google sign in error:', error);
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
      plate: string;
    };
    locationId: string;
  }): Promise<Driver> {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        driverData.email,
        driverData.password
      );

      const now = new Date().toISOString();

      // Create driver document with complete vehicle information
      const driverDoc: Driver = {
        id: userCredential.user.uid,
        name: driverData.name,
        email: driverData.email,
        phone: driverData.phone,
        photo: '',
        driversLicense: {
          ...driverData.driversLicense,
          documentUrl: ''
        },
        vehicle: {
          make: driverData.vehicle.make,
          model: driverData.vehicle.model,
          year: driverData.vehicle.year,
          color: driverData.vehicle.color,
          plate: driverData.vehicle.plate,
          insurance: {
            provider: '',
            policyNumber: '',
            expirationDate: '',
            documentUrl: ''
          },
          registration: {
            expirationDate: '',
            documentUrl: ''
          }
        },
        isOnline: true,
        lastOnlineChange: now,
        rating: 5.0,
        totalRides: 0,
        metrics: {
          totalEarnings: 0,
          acceptanceRate: 100,
          responseTime: 0,
          hoursOnline: 0,
          todayRides: 0
        },
        backgroundCheck: {
          status: 'pending',
          submissionDate: now,
          documentUrl: ''
        },
        baseRate: 25, // Set a default base rate
        airportRate: 35, // Set a default airport rate
        longDistanceRate: 2, // Set a default per-mile rate for long distance
        serviceLocations: [driverData.locationId],
        status: 'active',
        created_at: now,
        updated_at: now,
        languages: [], // Initialize empty languages array
        experience: '0-1 years' // Set default experience
      };

      // Save driver document
      await setDoc(doc(db, 'drivers', driverDoc.id), driverDoc);

      return driverDoc;
    } catch (error) {
      console.error('Error registering driver:', error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<Driver> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
            expirationDate: '',
          },
          vehicle: {
            make: '',
            model: '',
            year: '2020',
            color: '',
            plate: '',
            insurance: {
              provider: '',
              policyNumber: '',
              expirationDate: '',
            },
            registration: {
              expirationDate: '',
            }
          },
          isOnline: false,
          lastOnlineChange: now,
          rating: 5.0,
          totalRides: 0,
          metrics: {
            totalEarnings: 0,
            acceptanceRate: 100,
            responseTime: 0,
            hoursOnline: 0,
            todayRides: 0
          },
          backgroundCheck: {
            status: 'pending',
            submissionDate: now,
          },
          baseRate: 0,
          airportRate: 0,
          longDistanceRate: 0,
          serviceLocations: [],
          status: 'inactive',
          created_at: now,
          updated_at: now
        };
        
        await setDoc(doc(db, 'drivers', userCredential.user.uid), newDriver);
        return newDriver;
      }
      
      return { id: driverDoc.id, ...driverDoc.data() } as Driver;
    } catch (error) {
      console.error('Login error:', error);
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

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
};