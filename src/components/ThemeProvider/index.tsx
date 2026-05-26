'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';
import { darkTheme } from '@/src/styles/themes.stylex';
import { useThemeStore } from '@/src/store/useThemeStore';

const styles = stylex.create({
   root: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
   },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
   const { isDark, setIsDark } = useThemeStore();

   useEffect(() => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
   }, [setIsDark]);

   return (
      <div {...stylex.props(styles.root, isDark && darkTheme)}>
         {children}
      </div>
   );
}
