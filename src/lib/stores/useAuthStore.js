import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userAuthService } from '@/lib/services/userAuthService';
import Cookies from 'js-cookie';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      sessionToken: null,
      loading: true,  // Start with loading true
      error: null,
      isAuthenticated: false,
      initialized: false,  // Track initialization

      // Initialize store - call this from layout
      initialize: async () => {
        if (get().initialized) return;
        set({ loading: true });
        await get().verifySession();
        set({ initialized: true, loading: false });
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
              sameSite: 'lax',
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
            set({ 
              error: result.error,
              loading: false,
              user: null,
              sessionToken: null,
              isAuthenticated: false
            });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            error: error.message || 'Signup failed',
            loading: false,
            user: null,
            sessionToken: null,
            isAuthenticated: false
          });
          return { success: false, error: error.message };
        }
      },

      // Login with Email
      login: async (email, password) => {
        set({ loading: true, error: null });
        
        try {
          const result = await userAuthService.login(email, password);
          
          if (result.success) {
            Cookies.set('user_session', result.sessionToken, { 
              expires: 7,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
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
            set({ 
              error: result.error,
              loading: false,
              user: null,
              sessionToken: null,
              isAuthenticated: false
            });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            error: error.message || 'Login failed',
            loading: false,
            user: null,
            sessionToken: null,
            isAuthenticated: false
          });
          return { success: false, error: error.message };
        }
      },

      // Google Login
      googleLogin: async () => {
        set({ loading: true, error: null });
        
        try {
          const result = await userAuthService.googleLogin();
          
          if (result.success) {
            Cookies.set('user_session', result.sessionToken, { 
              expires: 7,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
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
            set({ 
              error: result.error,
              loading: false,
              user: null,
              sessionToken: null,
              isAuthenticated: false
            });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            error: error.message || 'Google login failed',
            loading: false,
            user: null,
            sessionToken: null,
            isAuthenticated: false
          });
          return { success: false, error: error.message };
        }
      },

      // Logout
      logout: async () => {
        set({ loading: true });
        
        try {
          await userAuthService.logout();
          Cookies.remove('user_session');
          
          set({ 
            user: null,
            sessionToken: null,
            isAuthenticated: false,
            loading: false,
            error: null 
          });
          
          return { success: true };
        } catch (error) {
          set({ loading: false });
          return { success: false, error: error.message };
        }
      },

      // Verify session - IMPROVED
      verifySession: async () => {
        const token = Cookies.get('user_session');
        
        if (!token) {
          set({ isAuthenticated: false, user: null, loading: false });
          return { success: false };
        }

        try {
          const result = await userAuthService.verifySession(token);
          
          if (result.success) {
            set({ 
              user: result.user, 
              sessionToken: token, 
              isAuthenticated: true, 
              loading: false 
            });
            return { success: true };
          } else {
            Cookies.remove('user_session');
            set({ 
              user: null, 
              sessionToken: null, 
              isAuthenticated: false, 
              loading: false 
            });
            return { success: false };
          }
        } catch (error) {
          console.error('Session verification error:', error);
          Cookies.remove('user_session');
          set({ 
            user: null, 
            sessionToken: null, 
            isAuthenticated: false, 
            loading: false 
          });
          return { success: false };
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Reset store
      reset: () => set({ 
        user: null,
        sessionToken: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        initialized: false
      })
    }),
    {
      name: 'gpn-user-auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        sessionToken: state.sessionToken,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useAuthStore;