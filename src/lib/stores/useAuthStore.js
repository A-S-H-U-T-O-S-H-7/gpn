import { create } from 'zustand';
import { userAuthService } from '@/lib/services/userAuthService';
import Cookies from 'js-cookie';

const useAuthStore = create((set, get) => ({
  user: null,
  sessionToken: null,
  loading: true,
  error: null,
  isAuthenticated: false,

  // Initialize auth on app load
  initialize: async () => {
    set({ loading: true });
    
    try {
      const token = Cookies.get('user_session');
      
      if (!token) {
        set({ loading: false, isAuthenticated: false });
        return;
      }

      const result = await userAuthService.verifySession(token);
      
      if (result.success && result.user) {
        set({ 
          user: result.user,
          sessionToken: token,
          isAuthenticated: true,
          loading: false 
        });
      } else {
        Cookies.remove('user_session');
        set({ loading: false, isAuthenticated: false });
      }
    } catch (error) {
      Cookies.remove('user_session');
      set({ loading: false, isAuthenticated: false });
    }
  },

  // Sign up
  signUp: async (name, email, password) => {
    set({ loading: true, error: null });
    
    try {
      const result = await userAuthService.signUp(name, email, password);
      
      if (result.success) {
        Cookies.set('user_session', result.sessionToken, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        });
        
        set({ 
          user: result.user,
          sessionToken: result.sessionToken,
          isAuthenticated: true,
          loading: false,
          error: null 
        });
        
        return { success: true };
      } else {
        set({ error: result.error, loading: false });
        return { success: false, error: result.error };
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    
    try {
      // Clear old session first
      Cookies.remove('user_session');
      
      const result = await userAuthService.login(email, password);
      
      if (result.success) {
        Cookies.set('user_session', result.sessionToken, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        });
        
        set({ 
          user: result.user,
          sessionToken: result.sessionToken,
          isAuthenticated: true,
          loading: false,
          error: null 
        });
        
        return { success: true };
      } else {
        set({ error: result.error, loading: false });
        return { success: false, error: result.error };
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Google Login
  googleLogin: async () => {
    set({ loading: true, error: null });
    
    try {
      Cookies.remove('user_session');
      
      const result = await userAuthService.googleLogin();
      
      if (result.success) {
        Cookies.set('user_session', result.sessionToken, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        });
        
        set({ 
          user: result.user,
          sessionToken: result.sessionToken,
          isAuthenticated: true,
          loading: false,
          error: null 
        });
        
        return { success: true };
      } else {
        set({ error: result.error, loading: false });
        return { success: false, error: result.error };
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await userAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clean up
      Cookies.remove('user_session');
      set({ 
        user: null,
        sessionToken: null,
        isAuthenticated: false,
        loading: false,
        error: null 
      });
    }
  },

  verifySession: async () => {
    const token = Cookies.get('user_session');
    
    if (!token) {
      set({ isAuthenticated: false, user: null, loading: false });
      return { success: false };
    }

    try {
      const result = await userAuthService.verifySession(token);
      
      if (result.success && result.user) {
        set({ 
          user: result.user, 
          sessionToken: token, 
          isAuthenticated: true, 
          loading: false 
        });
        return { success: true };
      } else {
        Cookies.remove('user_session');
        set({ user: null, sessionToken: null, isAuthenticated: false, loading: false });
        return { success: false };
      }
    } catch (error) {
      Cookies.remove('user_session');
      set({ user: null, sessionToken: null, isAuthenticated: false, loading: false });
      return { success: false };
    }
  },

  clearError: () => set({ error: null }),
}));

// Auto-initialize
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useAuthStore.getState().initialize();
  }, 100);
}

export default useAuthStore;