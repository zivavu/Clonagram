'use client';

import * as stylex from '@stylexjs/stylex';
import { useLayoutEffect } from 'react';
import { useThemeStore } from '@/src/store/useThemeStore';
import { darkTheme } from '@/src/styles/tokens.stylex';

export const darkClass = (stylex.props(darkTheme) as unknown as { className: string }).className;

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
