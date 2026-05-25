import { db } from '@/lib/firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';

const LIVE_TV_COLLECTION = 'live_tv_settings';
const SCHEDULE_COLLECTION = 'live_tv_schedule';

// Live TV Settings
export const getLiveTvSettings = async () => {
  try {
    const settingsRef = collection(db, LIVE_TV_COLLECTION);
    const snapshot = await getDocs(settingsRef);
    
    if (snapshot.empty) {
      // Return default settings if none exist
      return {
        success: true,
        settings: {
          isLive: false,
          youtubeUrl: '',
          videoId: '',
          title: 'No Live Broadcast',
          description: 'Check back later for live coverage',
          viewers: '0',
          quality: '1080p',
        }
      };
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      success: true,
      settings: {
        id: doc.id,
        isLive: data.isLive || false,
        youtubeUrl: data.youtubeUrl || '',
        videoId: data.videoId || '',
        title: data.title || 'No Live Broadcast',
        description: data.description || 'Check back later for live coverage',
        viewers: data.viewers || '0',
        quality: data.quality || '1080p',
        updatedAt: data.updatedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting live TV settings:', error);
    return { success: false, error: error.message, settings: null };
  }
};

// Update Live TV Settings
export const updateLiveTvSettings = async (settingsData, adminData) => {
  try {
    const settingsRef = collection(db, LIVE_TV_COLLECTION);
    const snapshot = await getDocs(settingsRef);
    
    // Extract YouTube ID from URL
    const getYouTubeId = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };
    
    const videoId = getYouTubeId(settingsData.youtubeUrl);
    
    let result;
    if (snapshot.empty) {
      // Create new settings
      result = await addDoc(collection(db, LIVE_TV_COLLECTION), {
        isLive: settingsData.isLive || false,
        youtubeUrl: settingsData.youtubeUrl || '',
        videoId: videoId || '',
        title: settingsData.title || 'No Live Broadcast',
        description: settingsData.description || '',
        viewers: settingsData.viewers || '0',
        quality: settingsData.quality || '1080p',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Update existing settings
      const settingsDoc = snapshot.docs[0];
      const settingsRef = doc(db, LIVE_TV_COLLECTION, settingsDoc.id);
      await updateDoc(settingsRef, {
        isLive: settingsData.isLive || false,
        youtubeUrl: settingsData.youtubeUrl || '',
        videoId: videoId || '',
        title: settingsData.title || 'No Live Broadcast',
        description: settingsData.description || '',
        viewers: settingsData.viewers || '0',
        quality: settingsData.quality || '1080p',
        updatedAt: serverTimestamp(),
      });
      result = { id: settingsDoc.id };
    }
    
    // Log activity
    await logActivity({
      action: settingsData.isLive ? ActivityActions.PUBLISH : ActivityActions.UNPUBLISH,
      entityType: ActivityEntityTypes.LIVE_TV,
      entityId: result.id,
      entityTitle: 'Live TV Settings',
      details: settingsData.isLive ? 'Live TV started' : 'Live TV stopped',
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating live TV settings:', error);
    return { success: false, error: error.message };
  }
};

// Get Live Schedule
export const getLiveSchedule = async () => {
  try {
    const scheduleRef = collection(db, SCHEDULE_COLLECTION);
    const q = query(scheduleRef, orderBy('startTime', 'asc'));
    const snapshot = await getDocs(q);
    
    const schedule = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      schedule.push({
        id: doc.id,
        title: data.title || '',
        startTime: data.startTime || '',
        endTime: data.endTime || '',
        category: data.category || '',
        description: data.description || '',
        isLive: data.isLive || false,
        order: data.order || 0,
        createdAt: data.createdAt?.toDate?.() || null,
      });
    });
    
    return { success: true, schedule };
  } catch (error) {
    console.error('Error getting live schedule:', error);
    return { success: false, error: error.message, schedule: [] };
  }
};

// Add Schedule Item
export const addScheduleItem = async (scheduleData, adminData) => {
  try {
    const scheduleRef = await addDoc(collection(db, SCHEDULE_COLLECTION), {
      title: scheduleData.title,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      category: scheduleData.category || '',
      description: scheduleData.description || '',
      isLive: scheduleData.isLive || false,
      order: scheduleData.order || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    await logActivity({
      action: ActivityActions.CREATE,
      entityType: ActivityEntityTypes.LIVE_TV,
      entityId: scheduleRef.id,
      entityTitle: scheduleData.title,
      details: `Added schedule item: ${scheduleData.title}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true, id: scheduleRef.id };
  } catch (error) {
    console.error('Error adding schedule item:', error);
    return { success: false, error: error.message };
  }
};

// Update Schedule Item
export const updateScheduleItem = async (scheduleId, scheduleData, adminData) => {
  try {
    const scheduleRef = doc(db, SCHEDULE_COLLECTION, scheduleId);
    await updateDoc(scheduleRef, {
      title: scheduleData.title,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      category: scheduleData.category || '',
      description: scheduleData.description || '',
      isLive: scheduleData.isLive || false,
      order: scheduleData.order || 0,
      updatedAt: serverTimestamp(),
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.LIVE_TV,
      entityId: scheduleId,
      entityTitle: scheduleData.title,
      details: `Updated schedule item: ${scheduleData.title}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating schedule item:', error);
    return { success: false, error: error.message };
  }
};

// Delete Schedule Item
export const deleteScheduleItem = async (scheduleId, scheduleTitle, adminData) => {
  try {
    await deleteDoc(doc(db, SCHEDULE_COLLECTION, scheduleId));
    
    await logActivity({
      action: ActivityActions.DELETE,
      entityType: ActivityEntityTypes.LIVE_TV,
      entityId: scheduleId,
      entityTitle: scheduleTitle,
      details: `Deleted schedule item: ${scheduleTitle}`,
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    return { success: false, error: error.message };
  }
};

// Get current live stream (for frontend)
export const getCurrentLiveStream = async () => {
  try {
    const settingsRef = collection(db, LIVE_TV_COLLECTION);
    const snapshot = await getDocs(settingsRef);
    
    if (snapshot.empty) {
      return {
        success: true,
        live: null,
        isLive: false,
      };
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return {
      success: true,
      live: {
        id: doc.id,
        isLive: data.isLive || false,
        youtubeUrl: data.youtubeUrl || '',
        videoId: data.videoId || '',
        title: data.title || '',
        description: data.description || '',
        viewers: data.viewers || '0',
      },
      isLive: data.isLive || false,
    };
  } catch (error) {
    console.error('Error getting current live stream:', error);
    return { success: false, error: error.message, live: null, isLive: false };
  }
};

// Get today's schedule (for frontend)
export const getTodaysSchedule = async () => {
  try {
    const scheduleRef = collection(db, SCHEDULE_COLLECTION);
    const q = query(scheduleRef, orderBy('startTime', 'asc'), limit(10));
    const snapshot = await getDocs(q);
    
    const schedule = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      schedule.push({
        id: doc.id,
        title: data.title || '',
        startTime: data.startTime || '',
        endTime: data.endTime || '',
        category: data.category || '',
      });
    });
    
    return { success: true, schedule };
  } catch (error) {
    console.error('Error getting today\'s schedule:', error);
    return { success: false, error: error.message, schedule: [] };
  }
};