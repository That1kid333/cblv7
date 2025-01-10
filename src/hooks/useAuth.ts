import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../lib/services/auth.service';
import type { Driver } from '../types/driver';
import type { Rider } from '../types/rider';

interface AuthState {
  user: User | null;
  rider: Rider | null;
  driver: Driver | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    rider: null,
    driver: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // Get the latest user document on every auth state change
          const userDoc = await authService.getUserDoc(user.uid);
          
          if (userDoc.type === 'rider') {
            setState({
              user,
              rider: userDoc as Rider,
              driver: null,
              loading: false,
              error: null,
            });
          } else if (userDoc.type === 'driver') {
            setState({
              user,
              rider: null,
              driver: userDoc as Driver,
              loading: false,
              error: null,
            });
          }
        } else {
          setState({
            user: null,
            rider: null,
            driver: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
}
