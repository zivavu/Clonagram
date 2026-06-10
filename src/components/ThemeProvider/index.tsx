'use client';

import { useLayoutEffect } from 'react';
import { darkClass } from '@/src/lib/theme';
import { useThemeStore } from '@/src/store/useThemeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
   const { isDark } = useThemeStore();

   useLayoutEffect(() => {
      darkClass.split(' ').forEach(cls => {
         document.documentElement.classList.toggle(cls, isDark);
      });
      // biome-ignore lint/suspicious/noDocumentCookie: Required for SSR theme cookie sync
      document.cookie = `theme=${isDark ? 'dark' : 'light'}; path=/; max-age=31536000; SameSite=Lax`;
   }, [isDark]);

   return <>{children}</>;
}
