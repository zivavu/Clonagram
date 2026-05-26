import { create } from 'zustand';

interface ThemeStore {
   isDark: boolean;
   setIsDark: (isDark: boolean) => void;
   toggle: () => void;
}

export const useThemeStore = create<ThemeStore>(set => ({
   isDark: true,
   setIsDark: isDark => set({ isDark }),
   toggle: () => set(s => ({ isDark: !s.isDark })),
}));
