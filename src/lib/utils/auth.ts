import { User } from 'firebase/auth';
import { auth } from '../firebase';

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function isAuthenticated(): boolean {
  return auth.currentUser !== null;
}

export function getUserId(): string | null {
  return auth.currentUser?.uid || null;
}

export function getUserEmail(): string | null {
  return auth.currentUser?.email || null;
}