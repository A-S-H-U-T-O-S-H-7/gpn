import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      setDarkMode: (isDarkMode) => set({ isDarkMode }),
    }),
    {
      name: 'gpn-theme-storage',
      partialize: (state) => ({ isDarkMode: state.isDarkMode })
    }
  )
);

export default useThemeStore;