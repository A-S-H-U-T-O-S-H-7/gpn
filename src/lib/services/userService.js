import { db } from '@/lib/firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';
import { getActiveSubscribersCount, isUserSubscribed } from './subscriptionService';

const USERS_COLLECTION = 'users';
const ITEMS_PER_PAGE = 10;

// Get all users with pagination and filters
export const getUsers = async (page = 1, searchTerm = '', statusFilter = 'all', subscriptionFilter = 'all') => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc'), limit(100)];
    
    const q = query(usersRef, ...constraints);
    const snapshot = await getDocs(q);
    
    // Get all subscribed emails from subscribers collection for cross-reference
    const subscribersRef = collection(db, 'subscribers');
    const subscribersQuery = query(subscribersRef, where('status', '==', 'active'));
    const subscribersSnapshot = await getDocs(subscribersQuery);
    
    const subscribedEmails = new Set();
    subscribersSnapshot.forEach(doc => {
      const email = doc.data().email?.toLowerCase();
      if (email) subscribedEmails.add(email);
    });
    
    let users = [];
    for (const document of snapshot.docs) {
      const data = document.data();
      const userEmail = data.email?.toLowerCase();
      
      // Check isSubscribed from both user document AND subscribers collection
      const isSubscribed = data.isSubscribed === true || subscribedEmails.has(userEmail);
      
      users.push({
        id: document.id,
        uid: data.uid || document.id,
        name: data.name || data.displayName || 'User',
        email: data.email || '',
        avatar: data.avatar || data.photoURL || null,
        phone: data.phone || null,
        role: data.role || 'user',
        status: data.status || 'active',
        isSubscribed: isSubscribed,
        preferences: data.preferences || { emailNotifications: true, language: 'en' },
        createdAt: data.createdAt?.toDate?.() || null,
        lastLoginAt: data.lastLoginAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
      });
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      users = users.filter(user => user.status === statusFilter);
    }
    
    // Apply subscription filter
    if (subscriptionFilter !== 'all') {
      users = users.filter(user => 
        subscriptionFilter === 'subscribed' ? user.isSubscribed === true : user.isSubscribed === false
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      users = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Pagination
    const totalItems = users.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    return {
      success: true,
      users: paginatedUsers,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error('Error getting users:', error);
    return { success: false, error: error.message, users: [], totalPages: 1, totalItems: 0 };
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const data = userSnap.data();
    const userEmail = data.email?.toLowerCase();
    
    // Check subscription status from subscribers collection
    const subscriptionCheck = await isUserSubscribed(userEmail);
    
    return {
      success: true,
      user: {
        id: userSnap.id,
        uid: data.uid || userSnap.id,
        name: data.name || data.displayName || 'User',
        email: data.email || '',
        avatar: data.avatar || data.photoURL || null,
        phone: data.phone || null,
        role: data.role || 'user',
        status: data.status || 'active',
        isSubscribed: data.isSubscribed === true || subscriptionCheck.isSubscribed,
        preferences: data.preferences || { emailNotifications: true, language: 'en' },
        createdAt: data.createdAt?.toDate?.() || null,
        lastLoginAt: data.lastLoginAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return { success: false, error: error.message };
  }
};

// Update user status (block/unblock)
export const updateUserStatus = async (userId, status, adminData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const user = await getUserById(userId);
    
    await updateDoc(userRef, {
      status: status,
      updatedAt: serverTimestamp(),
      updatedBy: adminData.id
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.USER,
      entityId: userId,
      entityTitle: user.user?.name || 'User',
      details: `User status changed to ${status}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user status:', error);
    return { success: false, error: error.message };
  }
};

// Update user subscription
export const updateUserSubscription = async (userId, isSubscribed, adminData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const user = await getUserById(userId);
    
    if (!user.success || !user.user) {
      return { success: false, error: 'User not found' };
    }
    
    // Update user document
    await updateDoc(userRef, {
      isSubscribed: isSubscribed,
      updatedAt: serverTimestamp(),
      updatedBy: adminData.id
    });
    
    // Sync with subscribers collection
    const subscribersRef = collection(db, 'subscribers');
    const q = query(subscribersRef, where('email', '==', user.user.email?.toLowerCase()));
    const snapshot = await getDocs(q);
    
    if (isSubscribed) {
      // Create or reactivate subscription
      if (!snapshot.empty) {
        const subDoc = snapshot.docs[0];
        await updateDoc(doc(db, 'subscribers', subDoc.id), {
          status: 'active',
          userId: userId,
          updatedAt: serverTimestamp(),
          subscribedAt: subDoc.data().subscribedAt || serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, 'subscribers', user.user.email?.toLowerCase()), {
          email: user.user.email?.toLowerCase(),
          name: user.user.name || '',
          userId: userId,
          status: 'active',
          source: 'admin_manual',
          subscribedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } else {
      // Deactivate subscription
      if (!snapshot.empty) {
        const subDoc = snapshot.docs[0];
        await updateDoc(doc(db, 'subscribers', subDoc.id), {
          status: 'inactive',
          unsubscribedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }
    
    await logActivity({
      action: isSubscribed ? 'SUBSCRIBE_ON' : 'SUBSCRIBE_OFF',
      entityType: ActivityEntityTypes.USER,
      entityId: userId,
      entityTitle: user.user.name || 'User',
      details: `${isSubscribed ? 'Subscribed to' : 'Unsubscribed from'} newsletter`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return { success: false, error: error.message };
  }
};

// Delete user
export const deleteUser = async (userId, userName, adminData) => {
  try {
    // Get user data before deletion
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      
      // Also handle subscriber collection cleanup
      if (userData.email) {
        const subscribersRef = collection(db, 'subscribers');
        const q = query(subscribersRef, where('email', '==', userData.email.toLowerCase()));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const subDoc = snapshot.docs[0];
          await updateDoc(doc(db, 'subscribers', subDoc.id), {
            status: 'inactive',
            userId: null,
            updatedAt: serverTimestamp(),
          });
        }
      }
    }
    
    // Delete user document
    await deleteDoc(userRef);
    
    await logActivity({
      action: ActivityActions.DELETE,
      entityType: ActivityEntityTypes.USER,
      entityId: userId,
      entityTitle: userName,
      details: `Deleted user: ${userName}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
};

// Export subscribed users to CSV
export const exportSubscribedUsersToCSV = async () => {
  try {
    // Get subscribed users from both collections
    const usersRef = collection(db, USERS_COLLECTION);
    const usersSnapshot = await getDocs(usersRef);
    
    const subscribersRef = collection(db, 'subscribers');
    const subscribersQuery = query(subscribersRef, where('status', '==', 'active'));
    const subscribersSnapshot = await getDocs(subscribersQuery);
    
    // Create set of subscribed emails
    const subscribedEmails = new Map();
    
    // Add from subscribers collection
    subscribersSnapshot.forEach(doc => {
      const data = doc.data();
      subscribedEmails.set(data.email?.toLowerCase(), {
        email: data.email,
        name: data.name || '',
        subscribedAt: data.subscribedAt?.toDate?.() || null,
      });
    });
    
    // Add from users collection (those marked as subscribed)
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.isSubscribed === true && data.email) {
        const email = data.email.toLowerCase();
        if (!subscribedEmails.has(email)) {
          subscribedEmails.set(email, {
            email: data.email,
            name: data.name || '',
            subscribedAt: data.createdAt?.toDate?.() || null,
          });
        }
      }
    });
    
    // Convert to CSV
    const csvRows = [
      ['Email', 'Name', 'Subscribed Date']
    ];
    
    subscribedEmails.forEach(subscriber => {
      csvRows.push([
        subscriber.email,
        subscriber.name,
        subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleDateString() : ''
      ]);
    });
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    return { success: true, csv: csvContent, count: subscribedEmails.size };
  } catch (error) {
    console.error('Error exporting subscribers:', error);
    return { success: false, csv: '', count: 0 };
  }
};

// Get statistics
export const getUserStats = async () => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);
    
    // Get active subscribers count
    const subscribersCount = await getActiveSubscribersCount();
    
    let totalUsers = 0;
    let activeUsers = 0;
    let blockedUsers = 0;
    let subscribedUsersFromUsers = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      totalUsers++;
      if (data.status === 'active') activeUsers++;
      if (data.status === 'blocked') blockedUsers++;
      if (data.isSubscribed === true) subscribedUsersFromUsers++;
    });
    
    // Use the higher count between users collection and subscribers collection
    const subscribedUsers = Math.max(subscribedUsersFromUsers, subscribersCount.count || 0);
    
    return {
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        blockedUsers,
        subscribedUsers,
      }
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return { success: false, stats: null };
  }
};