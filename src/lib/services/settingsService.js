import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';

const SETTINGS_COLLECTION = 'settings';

// Default settings
const defaultSettings = {
  general: {
    siteName: 'Great Post News',
    siteTagline: 'Your trusted source for breaking news',
    siteEmail: 'admin@gpn.com',
    contactEmail: 'contact@gpn.com',
    timezone: 'Asia/Kolkata',
    dateFormat: 'MMM DD, YYYY',
  },
  seo: {
    metaTitle: 'GPN - Great Post News | Breaking News, Live TV & Latest Updates',
    metaDescription: 'Your video-first news platform for breaking news, live TV streaming, trending stories, and exclusive coverage from around the world.',
    metaKeywords: 'news, live tv, breaking news, global news, world news, politics, technology, sports, entertainment',
    googleAnalyticsId: '',
    googleSiteVerification: '',
  },
  social: {
    facebook: 'https://facebook.com/gpn',
    twitter: 'https://twitter.com/gpn',
    instagram: 'https://instagram.com/gpn',
    youtube: 'https://youtube.com/gpn',
    linkedin: 'https://linkedin.com/company/gpn',
  },
  appearance: {
    primaryColor: '#ff2b2b',
    accentColor: '#ff2b2b',
    darkMode: 'system',
    fontFamily: 'Inter',
  },
  homepage: {
    heroEnabled: true,
    trendingCount: 8,
    latestVideosCount: 20,
    categoriesToShow: 6,
  },
};

// Get all settings
export const getSettings = async () => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'main');
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      return { success: true, settings: settingsSnap.data() };
    } else {
      // Create default settings if not exists
      await setDoc(settingsRef, defaultSettings);
      return { success: true, settings: defaultSettings };
    }
  } catch (error) {
    console.error('Error getting settings:', error);
    return { success: false, error: error.message, settings: defaultSettings };
  }
};

// Update general settings
export const updateGeneralSettings = async (data, adminData) => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'main');
    await updateDoc(settingsRef, {
      general: data,
      updatedAt: serverTimestamp(),
      updatedBy: adminData.id,
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.SETTINGS,
      entityId: 'general',
      entityTitle: 'General Settings',
      details: 'Updated general settings',
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating general settings:', error);
    return { success: false, error: error.message };
  }
};

// Update SEO settings
export const updateSeoSettings = async (data, adminData) => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'main');
    await updateDoc(settingsRef, {
      seo: data,
      updatedAt: serverTimestamp(),
      updatedBy: adminData.id,
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.SETTINGS,
      entityId: 'seo',
      entityTitle: 'SEO Settings',
      details: 'Updated SEO settings',
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating SEO settings:', error);
    return { success: false, error: error.message };
  }
};

// Update social links
export const updateSocialLinks = async (data, adminData) => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'main');
    await updateDoc(settingsRef, {
      social: data,
      updatedAt: serverTimestamp(),
      updatedBy: adminData.id,
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.SETTINGS,
      entityId: 'social',
      entityTitle: 'Social Links',
      details: 'Updated social media links',
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating social links:', error);
    return { success: false, error: error.message };
  }
};

// Update appearance settings
export const updateAppearanceSettings = async (data, adminData) => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'main');
    await updateDoc(settingsRef, {
      appearance: data,
      updatedAt: serverTimestamp(),
      updatedBy: adminData.id,
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.SETTINGS,
      entityId: 'appearance',
      entityTitle: 'Appearance Settings',
      details: 'Updated appearance settings',
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating appearance settings:', error);
    return { success: false, error: error.message };
  }
};

// Update homepage settings
export const updateHomepageSettings = async (data, adminData) => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'main');
    await updateDoc(settingsRef, {
      homepage: data,
      updatedAt: serverTimestamp(),
      updatedBy: adminData.id,
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.SETTINGS,
      entityId: 'homepage',
      entityTitle: 'Homepage Settings',
      details: 'Updated homepage settings',
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating homepage settings:', error);
    return { success: false, error: error.message };
  }
};