import { 
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase';

export const messagesService = {
  async sendMessage(messageData: {
    rideId: string;
    senderId: string;
    senderType: 'driver' | 'rider';
    content: string;
  }) {
    return await addDoc(collection(db, 'messages'), {
      ...messageData,
      timestamp: new Date().toISOString(),
      read: false
    });
  },

  subscribeToMessages(rideId: string, callback: (messages: any[]) => void) {
    const q = query(
      collection(db, 'messages'),
      where('rideId', '==', rideId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    });
  },

  async markAsRead(messageId: string) {
    await updateDoc(doc(db, 'messages', messageId), {
      read: true
    });
  }
};