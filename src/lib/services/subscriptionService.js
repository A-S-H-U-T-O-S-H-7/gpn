import { db } from '@/lib/firebase/config';
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc, orderBy } from 'firebase/firestore';

const SUBSCRIBERS_COLLECTION = 'subscribers';

// Subscribe user
export const subscribeUser = async (email, name = null, userId = null) => {
  try {
    // Check if already subscribed
    const q = query(collection(db, SUBSCRIBERS_COLLECTION), where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      // Already subscribed, update status if inactive
      const existingDoc = snapshot.docs[0];
      const existingData = existingDoc.data();
      if (existingData.status !== 'active') {
        await updateDoc(doc(db, SUBSCRIBERS_COLLECTION, existingDoc.id), {
          status: 'active',
          updatedAt: serverTimestamp()
        });
        return { success: true, message: 'Subscription renewed successfully!' };
      }
      return { success: false, message: 'This email is already subscribed!' };
    }
    
    // Add new subscriber
    await addDoc(collection(db, SUBSCRIBERS_COLLECTION), {
      email: email.toLowerCase(),
      name: name || null,
      userId: userId || null,
      status: 'active',
      subscribedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      source: 'website_newsletter'
    });
    
    return { success: true, message: 'Successfully subscribed to GPN newsletter!' };
  } catch (error) {
    console.error('Subscribe error:', error);
    return { success: false, message: 'Failed to subscribe. Please try again.' };
  }
};

// Unsubscribe user
export const unsubscribeUser = async (email) => {
  try {
    const q = query(collection(db, SUBSCRIBERS_COLLECTION), where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: false, message: 'Email not found' };
    }
    
    const docRef = doc(db, SUBSCRIBERS_COLLECTION, snapshot.docs[0].id);
    await updateDoc(docRef, {
      status: 'inactive',
      unsubscribedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, message: 'Unsubscribed successfully' };
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return { success: false, message: 'Failed to unsubscribe' };
  }
};

// Check if user is subscribed by email
export const isUserSubscribed = async (email) => {
  try {
    const q = query(
      collection(db, SUBSCRIBERS_COLLECTION), 
      where('email', '==', email.toLowerCase()),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    return { success: true, isSubscribed: !snapshot.empty };
  } catch (error) {
    console.error('Check subscription error:', error);
    return { success: false, isSubscribed: false };
  }
};

// Get subscription status for current user
export const getSubscriptionStatus = async (userId, email) => {
  try {
    let q;
    if (userId) {
      q = query(collection(db, SUBSCRIBERS_COLLECTION), where('userId', '==', userId));
    } else {
      q = query(collection(db, SUBSCRIBERS_COLLECTION), where('email', '==', email.toLowerCase()));
    }
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: true, isSubscribed: false, subscription: null };
    }
    
    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    return { 
      success: true, 
      isSubscribed: data.status === 'active',
      subscription: { id: docSnap.id, ...data }
    };
  } catch (error) {
    console.error('Get subscription status error:', error);
    return { success: false, isSubscribed: false, subscription: null };
  }
};

// Get all subscribers (for admin panel)
export const getAllSubscribers = async () => {
  try {
    const q = query(collection(db, SUBSCRIBERS_COLLECTION), orderBy('subscribedAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const subscribers = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      subscribers.push({
        id: doc.id,
        email: data.email,
        name: data.name,
        status: data.status,
        subscribedAt: data.subscribedAt?.toDate?.() || null,
        userId: data.userId
      });
    });
    
    return { success: true, subscribers };
  } catch (error) {
    console.error('Get subscribers error:', error);
    return { success: false, subscribers: [] };
  }
};

// Get active subscribers count
export const getActiveSubscribersCount = async () => {
  try {
    const q = query(collection(db, SUBSCRIBERS_COLLECTION), where('status', '==', 'active'));
    const snapshot = await getDocs(q);
    return { success: true, count: snapshot.size };
  } catch (error) {
    console.error('Get subscribers count error:', error);
    return { success: false, count: 0 };
  }
};

// Export subscribers to CSV
export const exportSubscribersToCSV = async () => {
  try {
    const result = await getAllSubscribers();
    if (!result.success) return { success: false };
    
    const activeSubscribers = result.subscribers.filter(s => s.status === 'active');
    
    const csvRows = [
      ['Email', 'Name', 'Subscribed Date', 'Status']
    ];
    
    activeSubscribers.forEach(subscriber => {
      csvRows.push([
        subscriber.email,
        subscriber.name || '',
        subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleDateString() : '',
        subscriber.status
      ]);
    });
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    return { success: true, csv: csvContent, count: activeSubscribers.length };
  } catch (error) {
    console.error('Export subscribers error:', error);
    return { success: false };
  }
};