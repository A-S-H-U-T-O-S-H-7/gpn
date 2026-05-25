import { db, auth } from '@/lib/firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc,
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';

const ADMIN_USERS_COLLECTION = 'admin_users';

// Available permissions
export const AVAILABLE_PERMISSIONS = [
  // Dashboard
  { id: 'view_dashboard', name: 'View Dashboard', category: 'Dashboard' },
  
  // News
  { id: 'view_news', name: 'View News', category: 'News' },
  { id: 'create_news', name: 'Create News', category: 'News' },
  { id: 'edit_news', name: 'Edit News', category: 'News' },
  { id: 'delete_news', name: 'Delete News', category: 'News' },
  { id: 'publish_news', name: 'Publish News', category: 'News' },
  
  // Blogs
  { id: 'view_blogs', name: 'View Blogs', category: 'Blogs' },
  { id: 'create_blogs', name: 'Create Blogs', category: 'Blogs' },
  { id: 'edit_blogs', name: 'Edit Blogs', category: 'Blogs' },
  { id: 'delete_blogs', name: 'Delete Blogs', category: 'Blogs' },
  { id: 'publish_blogs', name: 'Publish Blogs', category: 'Blogs' },
  
  // Videos
  { id: 'view_videos', name: 'View Videos', category: 'Videos' },
  { id: 'add_videos', name: 'Add Videos', category: 'Videos' },
  { id: 'edit_videos', name: 'Edit Videos', category: 'Videos' },
  { id: 'delete_videos', name: 'Delete Videos', category: 'Videos' },
  
  // Live TV
  { id: 'manage_live_tv', name: 'Manage Live TV', category: 'Live TV' },
  
  // Users
  { id: 'view_users', name: 'View Users', category: 'Users' },
  { id: 'edit_users', name: 'Edit Users', category: 'Users' },
  { id: 'block_users', name: 'Block Users', category: 'Users' },
  
  // Subscribers
  { id: 'view_subscribers', name: 'View Subscribers', category: 'Subscribers' },
  
  // Comments
  { id: 'moderate_comments', name: 'Moderate Comments', category: 'Comments' },
  
  // Analytics
  { id: 'view_analytics', name: 'View Analytics', category: 'Analytics' },
  
  // Settings
  { id: 'manage_settings', name: 'Manage Settings', category: 'Settings' },
];

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  super_admin: AVAILABLE_PERMISSIONS.map(p => p.id),
  admin: [
    'view_dashboard',
    'view_news', 'create_news', 'edit_news', 'publish_news',
    'view_blogs', 'create_blogs', 'edit_blogs', 'publish_blogs',
    'view_videos', 'add_videos', 'edit_videos',
    'manage_live_tv',
    'view_users', 'edit_users',
    'view_subscribers',
    'moderate_comments',
    'view_analytics',
    'manage_settings',
  ],
  editor: [
    'view_dashboard',
    'view_news', 'create_news', 'edit_news', 'publish_news',
    'view_blogs', 'create_blogs', 'edit_blogs', 'publish_blogs',
    'view_videos', 'add_videos', 'edit_videos',
    'moderate_comments',
  ],
  reporter: [
    'view_dashboard',
    'create_news', 'edit_news',
    'create_blogs', 'edit_blogs',
    'add_videos',
  ],
  moderator: [
    'view_dashboard',
    'view_news', 'view_blogs', 'view_videos',
    'moderate_comments',
    'view_users',
  ],
};

// Roles list
export const ROLES = [
  { id: 'super_admin', name: 'Super Admin', description: 'Full access to everything' },
  { id: 'admin', name: 'Admin', description: 'Most features except admin management' },
  { id: 'editor', name: 'Editor', description: 'Create and edit content' },
  { id: 'reporter', name: 'Reporter', description: 'Create content only' },
  { id: 'moderator', name: 'Moderator', description: 'Manage comments and users' },
];

// Get all admins
export const getAllAdmins = async () => {
  try {
    const adminsRef = collection(db, ADMIN_USERS_COLLECTION);
    const q = query(adminsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const admins = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      admins.push({
        id: doc.id,
        uid: data.uid,
        name: data.name || '',
        email: data.email || '',
        username: data.username || '',
        role: data.role || 'admin',
        permissions: data.permissions || [],
        status: data.status || 'active',
        createdAt: data.createdAt?.toDate?.() || null,
        lastLoginAt: data.lastLoginAt?.toDate?.() || null,
        createdBy: data.createdBy || null,
      });
    });
    
    return { success: true, admins };
  } catch (error) {
    console.error('Error getting admins:', error);
    return { success: false, error: error.message, admins: [] };
  }
};

// Get admin by ID
export const getAdminById = async (adminId) => {
  try {
    const adminRef = doc(db, ADMIN_USERS_COLLECTION, adminId);
    const adminSnap = await getDoc(adminRef);
    
    if (!adminSnap.exists()) {
      return { success: false, error: 'Admin not found' };
    }
    
    const data = adminSnap.data();
    return {
      success: true,
      admin: {
        id: adminSnap.id,
        uid: data.uid,
        name: data.name || '',
        email: data.email || '',
        username: data.username || '',
        role: data.role || 'admin',
        permissions: data.permissions || [],
        status: data.status || 'active',
        createdAt: data.createdAt?.toDate?.() || null,
        lastLoginAt: data.lastLoginAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting admin:', error);
    return { success: false, error: error.message };
  }
};

// Create new admin - FIRST CREATE IN AUTH, THEN IN FIRESTORE
export const createAdmin = async (adminData, currentAdmin) => {
  try {
    // Step 1: Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, adminData.email, adminData.password);
    const user = userCredential.user;
    
    // Step 2: Get permissions based on role
    let permissions = adminData.permissions || [];
    if (adminData.role === 'super_admin') {
      permissions = [];
    } else if (permissions.length === 0) {
      permissions = ROLE_PERMISSIONS[adminData.role] || [];
    }
    
    // Step 3: Create Firestore document with Document ID = user.uid (CRITICAL!)
    const adminRef = doc(db, ADMIN_USERS_COLLECTION, user.uid);  // ← Using user.uid as document ID
    await setDoc(adminRef, {
      uid: user.uid,
      name: adminData.name,
      email: adminData.email,
      username: adminData.username,
      role: adminData.role,
      permissions: permissions,
      status: adminData.status || 'active',
      createdBy: currentAdmin.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: null,
    });
    
    // Step 4: Log activity
    await logActivity({
      action: ActivityActions.CREATE,
      entityType: ActivityEntityTypes.ADMIN,
      entityId: adminRef.id,
      entityTitle: adminData.name,
      details: `Created admin user: ${adminData.name} (${adminData.role})`,
      adminId: currentAdmin.id,
      adminName: currentAdmin.name,
      adminRole: currentAdmin.role,
    });
    
    return { success: true, id: adminRef.id };
    
  } catch (error) {
    console.error('Error creating admin:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      return { success: false, error: 'Email already exists in authentication system' };
    }
    if (error.code === 'auth/weak-password') {
      return { success: false, error: 'Password is too weak. Use at least 6 characters' };
    }
    return { success: false, error: error.message };
  }
};

// Update admin
export const updateAdmin = async (adminId, adminData, currentAdmin) => {
  try {
    const adminRef = doc(db, ADMIN_USERS_COLLECTION, adminId);
    const oldAdmin = await getAdminById(adminId);
    
    if (!oldAdmin.success) {
      return { success: false, error: 'Admin not found' };
    }
    
    // Get permissions based on role
    let permissions = adminData.permissions || [];
    if (adminData.role === 'super_admin') {
      permissions = [];
    } else if (permissions.length === 0) {
      permissions = ROLE_PERMISSIONS[adminData.role] || [];
    }
    
    const updateData = {
      name: adminData.name,
      role: adminData.role,
      permissions: permissions,
      status: adminData.status,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(adminRef, updateData);
    
    // Log activity
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.ADMIN,
      entityId: adminId,
      entityTitle: adminData.name,
      details: `Updated admin: ${adminData.name} (${adminData.role})`,
      adminId: currentAdmin.id,
      adminName: currentAdmin.name,
      adminRole: currentAdmin.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating admin:', error);
    return { success: false, error: error.message };
  }
};

// Delete admin
export const deleteAdmin = async (adminId, adminName, currentAdmin) => {
  try {
    // Prevent self-deletion
    if (adminId === currentAdmin.id) {
      return { success: false, error: 'You cannot delete your own account' };
    }
    
    const adminToDelete = await getAdminById(adminId);
    if (!adminToDelete.success) {
      return { success: false, error: 'Admin not found' };
    }
    
    // Prevent deleting last super admin
    if (adminToDelete.admin.role === 'super_admin') {
      const allAdmins = await getAllAdmins();
      const superAdminCount = allAdmins.admins.filter(a => a.role === 'super_admin').length;
      if (superAdminCount <= 1) {
        return { success: false, error: 'Cannot delete the only super admin' };
      }
    }
    
    // Delete from Firestore
    await deleteDoc(doc(db, ADMIN_USERS_COLLECTION, adminId));
    
    // Note: We don't delete from Firebase Auth for security reasons
    // The user account remains but becomes inactive
    
    // Log activity
    await logActivity({
      action: ActivityActions.DELETE,
      entityType: ActivityEntityTypes.ADMIN,
      entityId: adminId,
      entityTitle: adminName,
      details: `Deleted admin: ${adminName}`,
      adminId: currentAdmin.id,
      adminName: currentAdmin.name,
      adminRole: currentAdmin.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting admin:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const resetAdminPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, error: error.message };
  }
};