import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

class AdminAuthService {
  async login(email, password) {
    try {
      console.log('🔐 Admin login attempt:', email);

      // Authenticate with Firebase Auth
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (authError) {
        return { 
          success: false, 
          error: 'Invalid email or password' 
        };
      }

      const user = userCredential.user;
      console.log('✅ Firebase auth successful for UID:', user.uid);

      // Check if user exists in admin_users collection
      const adminRef = doc(db, 'admin_users', user.uid);
      const adminDoc = await getDoc(adminRef);

      if (!adminDoc.exists()) {
        console.log('❌ User not found in admin_users');
        await signOut(auth);
        return { 
          success: false, 
          error: 'You are not authorized as admin' 
        };
      }

      const adminData = adminDoc.data();

      if (adminData.status !== 'active') {
        console.log('❌ Admin account inactive');
        await signOut(auth);
        return { 
          success: false, 
          error: 'Your admin account is inactive' 
        };
      }

      // Update last login
      await updateDoc(adminRef, {
        lastLoginAt: serverTimestamp()
      });

      // Generate session token
      const sessionToken = Buffer.from(`${user.uid}:${Date.now()}`).toString('base64');

      // Store session
      const sessionRef = doc(db, 'admin_sessions', sessionToken);
      await setDoc(sessionRef, {
        adminId: user.uid,
        adminUid: user.uid,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      // Prepare admin data (without sensitive info)
      const { password: _, ...adminWithoutPassword } = adminData;
      
      return { 
        success: true, 
        admin: {
          id: adminDoc.id,
          uid: user.uid,
          ...adminWithoutPassword
        },
        sessionToken
      };

    } catch (error) {
      console.error('❌ Admin login error:', error);
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    }
  }

  async verifySession(sessionToken) {
    try {
      const sessionRef = doc(db, 'admin_sessions', sessionToken);
      const sessionDoc = await getDoc(sessionRef);
      
      if (!sessionDoc.exists()) {
        return { success: false, error: 'Invalid session' };
      }

      const session = sessionDoc.data();

      // Check if session expired
      if (session.expiresAt?.toDate() < new Date()) {
        await deleteDoc(sessionRef);
        return { success: false, error: 'Session expired' };
      }

      // Get admin user details
      const adminRef = doc(db, 'admin_users', session.adminUid);
      const adminDoc = await getDoc(adminRef);

      if (!adminDoc.exists()) {
        return { success: false, error: 'Admin not found' };
      }

      const adminData = adminDoc.data();

      if (adminData.status !== 'active') {
        return { success: false, error: 'Admin account inactive' };
      }

      const { password: _, ...adminWithoutPassword } = adminData;

      return { 
        success: true, 
        admin: {
          id: adminDoc.id,
          uid: session.adminUid,
          ...adminWithoutPassword
        }
      };

    } catch (error) {
      console.error('Session verification error:', error);
      return { success: false, error: 'Failed to verify session' };
    }
  }

  async logout(sessionToken) {
    try {
      if (sessionToken) {
        const sessionRef = doc(db, 'admin_sessions', sessionToken);
        await deleteDoc(sessionRef);
      }
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }
}

export const adminAuthService = new AdminAuthService();