import { db } from '@/lib/firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';

const USERS_COLLECTION = 'users';
const ITEMS_PER_PAGE = 10;

// Get all users with pagination and filters
export const getUsers = async (page = 1, searchTerm = '', statusFilter = 'all', subscriptionFilter = 'all') => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc'), limit(100)];
    
    const q = query(usersRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let users = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        id: doc.id,
        uid: data.uid || doc.id,
        name: data.name || data.displayName || 'User',
        email: data.email || '',
        avatar: data.avatar || data.photoURL || null,
        role: data.role || 'user',
        status: data.status || 'active',
        isSubscribed: data.isSubscribed || false,
        createdAt: data.createdAt?.toDate?.() || null,
        lastLoginAt: data.lastLoginAt?.toDate?.() || null,
      });
    });
    
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
    return {
      success: true,
      user: {
        id: userSnap.id,
        uid: data.uid || userSnap.id,
        name: data.name || data.displayName || 'User',
        email: data.email || '',
        avatar: data.avatar || data.photoURL || null,
        role: data.role || 'user',
        status: data.status || 'active',
        isSubscribed: data.isSubscribed || false,
        createdAt: data.createdAt?.toDate?.() || null,
        lastLoginAt: data.lastLoginAt?.toDate?.() || null,
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
    
    await updateDoc(userRef, {
      isSubscribed: isSubscribed,
      updatedAt: serverTimestamp(),
      updatedBy: adminData.id
    });
    
    await logActivity({
      action: isSubscribed ? 'SUBSCRIBE_ON' : 'SUBSCRIBE_OFF',
      entityType: ActivityEntityTypes.USER,
      entityId: userId,
      entityTitle: user.user?.name || 'User',
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
    await deleteDoc(doc(db, USERS_COLLECTION, userId));
    
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
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('isSubscribed', '==', true));
    const snapshot = await getDocs(q);
    
    const subscribers = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      subscribers.push({
        email: data.email,
        name: data.name || '',
        subscribedAt: data.createdAt?.toDate?.() || null,
      });
    });
    
    const csvRows = [
      ['Email', 'Name', 'Subscribed Date']
    ];
    
    subscribers.forEach(subscriber => {
      csvRows.push([
        subscriber.email,
        subscriber.name,
        subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleDateString() : ''
      ]);
    });
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    return { success: true, csv: csvContent, count: subscribers.length };
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
    
    let totalUsers = 0;
    let activeUsers = 0;
    let subscribedUsers = 0;
    let blockedUsers = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      totalUsers++;
      if (data.status === 'active') activeUsers++;
      if (data.status === 'blocked') blockedUsers++;
      if (data.isSubscribed === true) subscribedUsers++;
    });
    
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