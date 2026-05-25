import { 
  auth, 
  db 
} from '@/lib/firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const USERS_COLLECTION = 'users';

// Build user profile
const buildUserProfile = (user, name = null) => ({
  uid: user.uid,
  name: name || user.displayName || user.email?.split('@')[0] || 'User',
  email: user.email || '',
  phone: user.phoneNumber || null,
  avatar: user.photoURL || null,
  role: 'user',
  status: 'active',
  isSubscribed: false,
  createdAt: serverTimestamp(),
  lastLoginAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  preferences: {
    emailNotifications: true,
    language: 'en'
  }
});

// Sign Up with Email
export const userAuthService = {
  signUp: async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userRef = doc(db, USERS_COLLECTION, user.uid);
      await setDoc(userRef, buildUserProfile(user, name));
      
      const sessionToken = await user.getIdToken();
      
      return {
        success: true,
        user: {
          uid: user.uid,
          name: name,
          email: user.email,
          role: 'user',
          isSubscribed: false
        },
        sessionToken
      };
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Signup failed';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already registered';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password too weak. Use at least 6 characters';
      }
      return { success: false, error: errorMessage };
    }
  },

  // Login with Email
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userRef = doc(db, USERS_COLLECTION, user.uid);
      await updateDoc(userRef, { lastLoginAt: serverTimestamp() });
      
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      
      const sessionToken = await user.getIdToken();
      
      return {
        success: true,
        user: {
          uid: user.uid,
          name: userData?.name || user.email?.split('@')[0],
          email: user.email,
          role: userData?.role || 'user',
          isSubscribed: userData?.isSubscribed || false
        },
        sessionToken
      };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Account not found';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid password';
      }
      return { success: false, error: errorMessage };
    }
  },

  // Google Login - ADD THIS
  googleLogin: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userRef = doc(db, USERS_COLLECTION, user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new user profile
        await setDoc(userRef, buildUserProfile(user));
      } else {
        // Update last login
        await updateDoc(userRef, { lastLoginAt: serverTimestamp() });
      }
      
      const userData = userDoc.exists() ? userDoc.data() : buildUserProfile(user);
      const sessionToken = await user.getIdToken();
      
      return {
        success: true,
        user: {
          uid: user.uid,
          name: userData.name || user.displayName || user.email?.split('@')[0],
          email: user.email,
          avatar: user.photoURL,
          role: userData.role || 'user',
          isSubscribed: userData.isSubscribed || false
        },
        sessionToken
      };
    } catch (error) {
      console.error('Google login error:', error);
      let errorMessage = 'Google login failed';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Popup closed before completing sign in';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address';
      }
      return { success: false, error: errorMessage };
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  },

  // Verify session
  verifySession: async (sessionToken) => {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        return { success: false };
      }
      
      const userRef = doc(db, USERS_COLLECTION, currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      
      return {
        success: true,
        user: {
          uid: currentUser.uid,
          name: userData?.name || currentUser.email?.split('@')[0],
          email: currentUser.email,
          role: userData?.role || 'user',
          isSubscribed: userData?.isSubscribed || false
        }
      };
    } catch (error) {
      console.error('Session verification error:', error);
      return { success: false };
    }
  },

  // Send password reset
  sendPasswordReset: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  }
};