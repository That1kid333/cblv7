import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export async function checkDocumentExists(
  collectionName: string,
  field: string,
  value: string
): Promise<boolean> {
  const q = query(collection(db, collectionName), where(field, '==', value));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

export function generateFirestoreId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}