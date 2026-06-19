import { db } from '@/lib/firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  updateDoc, 
  doc, 
  setDoc,
  orderBy,
  deleteDoc
} from 'firebase/firestore';

const SUBSCRIBERS_COLLECTION = 'subscribers';
const USERS_COLLECTION = 'users';

// Helper function to sync subscription status with user document
const syncUserSubscriptionStatus = async (email, isSubscribed) => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      await updateDoc(doc(db, USERS_COLLECTION, userDoc.id), {
        isSubscribed: isSubscribed,
        updatedAt: serverTimestamp(),
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error syncing user subscription:', error);
    return false;
  }
};

// Subscribe user
export const subscribeUser = async (email, name = null, userId = null) => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if already subscribed
    const q = query(
      collection(db, SUBSCRIBERS_COLLECTION), 
      where('email', '==', normalizedEmail)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      // Already exists, update status if inactive
      const existingDoc = snapshot.docs[0];
      const existingData = existingDoc.data();
      
      if (existingData.status !== 'active') {
        // Reactivate subscription
        await updateDoc(doc(db, SUBSCRIBERS_COLLECTION, existingDoc.id), {
          status: 'active',
          name: name || existingData.name || null,
          userId: userId || existingData.userId || null,
          updatedAt: serverTimestamp(),
          // Keep original subscribedAt if it exists
          subscribedAt: existingData.subscribedAt || serverTimestamp(),
        });
        
        // Sync with user document
        await syncUserSubscriptionStatus(normalizedEmail, true);
        
        return { 
          success: true, 
          message: 'Subscription renewed successfully!',
          isNewSubscription: false
        };
      }
      
      return { 
        success: false, 
        message: 'This email is already subscribed!',
        isNewSubscription: false
      };
    }
    
    // Add new subscriber
    const subscriberData = {
      email: normalizedEmail,
      name: name || null,
      userId: userId || null,
      status: 'active',
      subscribedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      source: 'website_newsletter'
    };
    
    await addDoc(collection(db, SUBSCRIBERS_COLLECTION), subscriberData);
    
    // Sync with user document
    await syncUserSubscriptionStatus(normalizedEmail, true);
    
    return { 
      success: true, 
      message: 'Successfully subscribed to GPN newsletter!',
      isNewSubscription: true
    };
  } catch (error) {
    console.error('Subscribe error:', error);
    return { 
      success: false, 
      message: 'Failed to subscribe. Please try again.',
      error: error.message
    };
  }
};

// Unsubscribe user
export const unsubscribeUser = async (email) => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    const q = query(
      collection(db, SUBSCRIBERS_COLLECTION), 
      where('email', '==', normalizedEmail)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: false, message: 'Email not found in subscribers' };
    }
    
    const docRef = doc(db, SUBSCRIBERS_COLLECTION, snapshot.docs[0].id);
    await updateDoc(docRef, {
      status: 'inactive',
      unsubscribedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Sync with user document
    await syncUserSubscriptionStatus(normalizedEmail, false);
    
    return { success: true, message: 'Unsubscribed successfully' };
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return { 
      success: false, 
      message: 'Failed to unsubscribe',
      error: error.message
    };
  }
};

// Check if user is subscribed by email
export const isUserSubscribed = async (email) => {
  try {
    if (!email) {
      return { success: true, isSubscribed: false };
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check subscribers collection
    const q = query(
      collection(db, SUBSCRIBERS_COLLECTION), 
      where('email', '==', normalizedEmail),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return { success: true, isSubscribed: true };
    }
    
    // Fallback: Check users collection
    const usersRef = collection(db, USERS_COLLECTION);
    const userQuery = query(usersRef, where('email', '==', normalizedEmail));
    const userSnapshot = await getDocs(userQuery);
    
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      return { success: true, isSubscribed: userData.isSubscribed === true };
    }
    
    return { success: true, isSubscribed: false };
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
      q = query(
        collection(db, SUBSCRIBERS_COLLECTION), 
        where('userId', '==', userId)
      );
    } else if (email) {
      q = query(
        collection(db, SUBSCRIBERS_COLLECTION), 
        where('email', '==', email.toLowerCase().trim())
      );
    } else {
      return { success: true, isSubscribed: false, subscription: null };
    }
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Check users collection as fallback
      if (email) {
        const usersRef = collection(db, USERS_COLLECTION);
        const userQuery = query(usersRef, where('email', '==', email.toLowerCase().trim()));
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          return { 
            success: true, 
            isSubscribed: userData.isSubscribed === true,
            subscription: null,
            source: 'user_document'
          };
        }
      }
      
      return { success: true, isSubscribed: false, subscription: null };
    }
    
    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    
    return { 
      success: true, 
      isSubscribed: data.status === 'active',
      subscription: { id: docSnap.id, ...data },
      source: 'subscribers_collection'
    };
  } catch (error) {
    console.error('Get subscription status error:', error);
    return { success: false, isSubscribed: false, subscription: null };
  }
};

// Get all subscribers (for admin panel)
export const getAllSubscribers = async (includeInactive = false) => {
  try {
    let q;
    
    if (includeInactive) {
      q = query(collection(db, SUBSCRIBERS_COLLECTION), orderBy('subscribedAt', 'desc'));
    } else {
      q = query(
        collection(db, SUBSCRIBERS_COLLECTION), 
        where('status', '==', 'active'),
        orderBy('subscribedAt', 'desc')
      );
    }
    
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
        unsubscribedAt: data.unsubscribedAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        userId: data.userId,
        source: data.source || 'website_newsletter'
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
    const q = query(
      collection(db, SUBSCRIBERS_COLLECTION), 
      where('status', '==', 'active')
    );
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
    const result = await getAllSubscribers(false); // Only active subscribers
    
    if (!result.success || !result.subscribers) {
      return { success: false, error: 'Failed to fetch subscribers' };
    }
    
    const activeSubscribers = result.subscribers;
    
    const csvRows = [
      ['Email', 'Name', 'Subscribed Date', 'Source', 'Status']
    ];
    
    activeSubscribers.forEach(subscriber => {
      csvRows.push([
        subscriber.email,
        subscriber.name || '',
        subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleDateString() : '',
        subscriber.source || 'website_newsletter',
        subscriber.status
      ]);
    });
    
    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    return { 
      success: true, 
      csv: csvContent, 
      count: activeSubscribers.length 
    };
  } catch (error) {
    console.error('Export subscribers error:', error);
    return { success: false, error: error.message };
  }
};

// Delete subscriber (for admin panel)
export const deleteSubscriber = async (subscriberId) => {
  try {
    const subscriberRef = doc(db, SUBSCRIBERS_COLLECTION, subscriberId);
    const subscriberSnap = await getDoc(subscriberRef);
    
    if (!subscriberSnap.exists()) {
      return { success: false, message: 'Subscriber not found' };
    }
    
    const subscriberData = subscriberSnap.data();
    
    // Delete from subscribers collection
    await deleteDoc(subscriberRef);
    
    // Sync with user document if email exists
    if (subscriberData.email) {
      await syncUserSubscriptionStatus(subscriberData.email, false);
    }
    
    return { success: true, message: 'Subscriber deleted successfully' };
  } catch (error) {
    console.error('Delete subscriber error:', error);
    return { success: false, error: error.message };
  }
};

// Bulk import subscribers
export const bulkImportSubscribers = async (subscribers) => {
  try {
    let importedCount = 0;
    let skippedCount = 0;
    
    for (const subscriber of subscribers) {
      if (!subscriber.email) {
        skippedCount++;
        continue;
      }
      
      const result = await subscribeUser(
        subscriber.email,
        subscriber.name || null,
        subscriber.userId || null
      );
      
      if (result.success) {
        importedCount++;
      } else {
        skippedCount++;
      }
    }
    
    return {
      success: true,
      importedCount,
      skippedCount,
      message: `Successfully imported ${importedCount} subscribers. ${skippedCount} skipped.`
    };
  } catch (error) {
    console.error('Bulk import error:', error);
    return { success: false, error: error.message };
  }
};