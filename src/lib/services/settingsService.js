import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'site_settings';

// Default settings structure
const DEFAULT_SETTINGS = {
  general: {
    siteName: 'Great Post News',
    siteTagline: 'Your Trusted News Source',
    siteEmail: 'info@gpn.com',
    contactEmail: 'contact@gpn.com',
    timezone: 'Asia/Kolkata',
    dateFormat: 'MMM DD, YYYY',
    siteLogo: '/logo.webp',
  },
  seo: {
    metaTitle: 'Great Post News - Latest News, Breaking News, India News',
    metaDescription: 'Get latest news, breaking news, live updates on politics, business, sports, entertainment from India and around the world.',
    metaKeywords: 'news, breaking news, India news, world news, politics, business, sports',
    googleAnalyticsId: '',
    googleSiteVerification: '',
  },
  social: {
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: '',
  },
  contact: {
    phone1: '',
    phone2: '',
    contactEmail: '',
    address: '',
  },
  legal: {
    privacyPolicyUrl: '/privacy-policy',
    termsOfUseUrl: '/terms',
    cookiePolicyUrl: '/cookie-policy',
  },
  footer: {
    copyrightText: 'Great Post News. All rights reserved',
    creditsText: 'Designed by ALL TIME DATA',
    showAppButtons: false,
    appStoreUrl: '',
    playStoreUrl: '',
  },
};

// Get all settings
export const getSettings = async () => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      return { success: true, settings: settingsSnap.data() };
    } else {
      // Create default settings if not exists
      await setDoc(settingsRef, DEFAULT_SETTINGS);
      return { success: true, settings: DEFAULT_SETTINGS };
    }
  } catch (error) {
    console.error('Error getting settings:', error);
    return { success: false, error: error.message, settings: DEFAULT_SETTINGS };
  }
};

// Update general settings
export const updateGeneralSettings = async (generalData, adminData) => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await updateDoc(settingsRef, {
      general: generalData,
      updatedAt: serverTimestamp(),
      updatedBy: adminData?.id,
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.SETTINGS,
      entityId: SETTINGS_DOC_ID,
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
export const updateSeoSettings = async (seoData, adminData) => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await updateDoc(settingsRef, {
      seo: seoData,
      updatedAt: serverTimestamp(),
      updatedBy: adminData?.id,
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.SETTINGS,
      entityId: SETTINGS_DOC_ID,
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
export const updateSocialLinks = async (socialData, adminData) => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await updateDoc(settingsRef, {
      social: socialData,
      updatedAt: serverTimestamp(),
      updatedBy: adminData?.id,
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.SETTINGS,
      entityId: SETTINGS_DOC_ID,
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

// Update contact settings
export const updateContactSettings = async (contactData, adminData) => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await updateDoc(settingsRef, {
      contact: contactData,
      updatedAt: serverTimestamp(),
      updatedBy: adminData?.id,
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.SETTINGS,
      entityId: SETTINGS_DOC_ID,
      entityTitle: 'Contact Settings',
      details: 'Updated contact information',
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating contact settings:', error);
    return { success: false, error: error.message };
  }
};

// Get public settings for frontend
export const getPublicSettings = async () => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      return {
        success: true,
        data: {
          general: data.general,
          social: data.social,
          contact: data.contact,
          legal: data.legal,
          footer: data.footer,
        }
      };
    }
    return { success: true, data: DEFAULT_SETTINGS };
  } catch (error) {
    console.error('Error getting public settings:', error);
    return { success: false, error: error.message };
  }
};

// Get contact info for Contact/Advertise pages
export const getContactInfo = async () => {
  const result = await getPublicSettings();
  if (result.success) {
    return {
      success: true,
      contact: result.data.contact,
      social: result.data.social,
    };
  }
  return { success: false, contact: null, social: null };
};