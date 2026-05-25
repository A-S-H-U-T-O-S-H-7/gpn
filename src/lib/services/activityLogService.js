import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, where, deleteDoc, doc } from 'firebase/firestore';

const ACTIVITY_LOGS_COLLECTION = 'activity_logs';

// Activity action types
export const ActivityActions = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  PUBLISH: 'PUBLISH',
  UNPUBLISH: 'UNPUBLISH',
  TRENDING_ON: 'TRENDING_ON',
  TRENDING_OFF: 'TRENDING_OFF',
  EDITOR_PICK_ON: 'EDITOR_PICK_ON',
  EDITOR_PICK_OFF: 'EDITOR_PICK_OFF',
  BREAKING_ON: 'BREAKING_ON',
  BREAKING_OFF: 'BREAKING_OFF',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  STATUS_CHANGE: 'STATUS_CHANGE',
  VIEW: 'VIEW',
};

// Activity entity types
export const ActivityEntityTypes = {
  NEWS: 'news',
  BLOG: 'blog',
  VIDEO: 'video',
  CATEGORY: 'category',
  USER: 'user',
  SUBSCRIBER: 'subscriber',
  SETTINGS: 'settings',
  ADMIN: 'admin',
  LIVE_TV: 'live_tv',
  HOROSCOPE: 'horoscope',
};

// Log an activity
export const logActivity = async ({
  action,
  entityType,
  entityId,
  entityTitle,
  oldData = null,
  newData = null,
  details = null,
  adminId,
  adminName,
  adminRole,
  ipAddress = null,
  userAgent = null,
}) => {
  try {
    const activityData = {
      action,
      entityType,
      entityId,
      entityTitle: entityTitle || '',
      oldData: oldData ? JSON.stringify(oldData) : null,
      newData: newData ? JSON.stringify(newData) : null,
      details: details || '',
      adminId,
      adminName,
      adminRole,
      ipAddress: ipAddress || 'unknown',
      userAgent: userAgent || (typeof window !== 'undefined' ? navigator.userAgent : 'server'),
      timestamp: serverTimestamp(),
    };
    
    await addDoc(collection(db, ACTIVITY_LOGS_COLLECTION), activityData);
    console.log(`📝 Activity logged: ${action} - ${entityType} - ${entityTitle}`);
    return { success: true };
  } catch (error) {
    console.error('Error logging activity:', error);
    return { success: false, error: error.message };
  }
};

// Get activity logs with pagination and filters
export const getActivityLogs = async (page = 1, filters = {}) => {
  try {
    const logsRef = collection(db, ACTIVITY_LOGS_COLLECTION);
    let constraints = [orderBy('timestamp', 'desc'), limit(100)];
    
    const q = query(logsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let logs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        entityTitle: data.entityTitle,
        details: data.details,
        adminId: data.adminId,
        adminName: data.adminName,
        adminRole: data.adminRole,
        oldData: data.oldData ? JSON.parse(data.oldData) : null,
        newData: data.newData ? JSON.parse(data.newData) : null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        timestamp: data.timestamp?.toDate?.() || null,
      });
    });
    
    // Apply filters
    if (filters.action && filters.action !== 'all') {
      logs = logs.filter(log => log.action === filters.action);
    }
    if (filters.entityType && filters.entityType !== 'all') {
      logs = logs.filter(log => log.entityType === filters.entityType);
    }
    if (filters.adminId && filters.adminId !== 'all') {
      logs = logs.filter(log => log.adminId === filters.adminId);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      logs = logs.filter(log => 
        log.entityTitle?.toLowerCase().includes(searchLower) ||
        log.adminName?.toLowerCase().includes(searchLower)
      );
    }
    
    // Pagination
    const itemsPerPage = 20;
    const totalItems = logs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedLogs = logs.slice(startIndex, startIndex + itemsPerPage);
    
    return {
      success: true,
      logs: paginatedLogs,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error('Error getting activity logs:', error);
    return { success: false, error: error.message, logs: [], totalPages: 1, totalItems: 0 };
  }
};

// Get recent activity logs (for dashboard)
export const getRecentActivities = async (limit = 10) => {
  try {
    const logsRef = collection(db, ACTIVITY_LOGS_COLLECTION);
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(limit));
    const snapshot = await getDocs(q);
    
    const logs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        action: data.action,
        entityType: data.entityType,
        entityTitle: data.entityTitle,
        adminName: data.adminName,
        timestamp: data.timestamp?.toDate?.() || null,
      });
    });
    
    return { success: true, logs };
  } catch (error) {
    console.error('Error getting recent activities:', error);
    return { success: false, logs: [] };
  }
};

// Clear old logs (optional - for maintenance)
export const clearOldLogs = async (daysOld = 90) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const logsRef = collection(db, ACTIVITY_LOGS_COLLECTION);
    const q = query(logsRef, where('timestamp', '<=', cutoffDate));
    const snapshot = await getDocs(q);
    
    let deletedCount = 0;
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
      deletedCount++;
    }
    
    return { success: true, deletedCount };
  } catch (error) {
    console.error('Error clearing old logs:', error);
    return { success: false, error: error.message };
  }
};