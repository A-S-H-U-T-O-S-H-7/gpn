import { create } from 'zustand';
import { adminAuthService } from '@/lib/admin/auth';
import Cookies from 'js-cookie';

const useAdminAuthStore = create((set, get) => ({
  admin: null,
  sessionToken: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  adminLogin: async (email, password) => {
    set({ loading: true, error: null });
    
    try {
      Cookies.remove('gpn_admin_session');
      
      console.log('🔐 GPN Admin login attempt:', email);
      const result = await adminAuthService.login(email, password);
      
      if (result.success) {
        Cookies.set('gpn_admin_session', result.sessionToken, { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        });
        
        set({ 
          admin: result.admin, 
          sessionToken: result.sessionToken, 
          isAuthenticated: true, 
          loading: false, 
          error: null 
        });
        
        return { success: true };
      } else {
        set({ 
          error: result.error,
          loading: false,
          admin: null,
          sessionToken: null,
          isAuthenticated: false
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      set({ 
        error: error.message || 'Login failed',
        loading: false,
        admin: null,
        sessionToken: null,
        isAuthenticated: false
      });
      return { success: false, error: error.message };
    }
  },

  verifySession: async () => {
    const token = Cookies.get('gpn_admin_session');
    
    if (!token) {
      set({ isAuthenticated: false, admin: null, loading: false });
      return { success: false };
    }

    try {
      const result = await adminAuthService.verifySession(token);
      
      if (result.success && result.admin) {
        set({ 
          admin: result.admin, 
          sessionToken: token, 
          isAuthenticated: true, 
          loading: false 
        });
        return { success: true };
      } else {
        Cookies.remove('gpn_admin_session');
        set({ admin: null, sessionToken: null, isAuthenticated: false, loading: false });
        return { success: false };
      }
    } catch (error) {
      Cookies.remove('gpn_admin_session');
      set({ admin: null, sessionToken: null, isAuthenticated: false, loading: false });
      return { success: false };
    }
  },

  adminLogout: async () => {
    set({ loading: true });
    
    try {
      const { sessionToken } = get();
      if (sessionToken) {
        await adminAuthService.logout(sessionToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('gpn_admin_session');
      set({ 
        admin: null, 
        sessionToken: null, 
        isAuthenticated: false, 
        loading: false 
      });
    }
    
    return { success: true };
  },

  hasPermission: (permission) => {
    const { admin } = get();
    if (!admin) return false;
    if (admin.role === 'super_admin') return true;
    return admin.permissions?.includes(permission) || false;
  },

  clearError: () => set({ error: null }),
}));

// Auto-verify session on load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useAdminAuthStore.getState().verifySession();
  }, 100);
}

export default useAdminAuthStore;