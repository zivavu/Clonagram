import { create } from 'zustand';

const getInitialIsDark = () => {
   if (typeof document !== 'undefined') {
      const theme = document.cookie.match(/theme=(dark|light)/)?.[1];
      if (theme) {
         return theme === 'dark';
      }
   }
   return true;
};

interface ThemeStore {
   isDark: boolean;
   setIsDark: (isDark: boolean) => void;
   toggle: () => void;
}

export const useThemeStore = create<ThemeStore>(set => ({
   isDark: getInitialIsDark(),
   setIsDark: isDark => set({ isDark }),
   toggle: () => set(s => ({ isDark: !s.isDark })),
}));
