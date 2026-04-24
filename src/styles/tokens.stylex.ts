import * as stylex from '@stylexjs/stylex';
export const colors = stylex.defineVars({
   bg: 'light-dark(#ffffff, #0c1014)',
   bgSecondary: 'light-dark(#fafafa, #1f1f22)',
   bgElevated: 'light-dark(#ffffff, #1c1c1c)',
   border: 'light-dark(#dbdbdb, #494D53)',
   borderMuted: 'light-dark(#e0e0e0, #262626)',
   textPrimary: 'light-dark(#000000, #F2F4F6)',
   textSecondary: 'light-dark(#737373, #a8a8a8)',
   textMuted: 'light-dark(#c7c7c7, #555555)',
   buttonHover: 'light-dark(#f2f4f6, #353538)',
   accent: '#0064e0',
   accentHover: '#1877f2',
   accentText: 'rgb(75, 169, 254)',
   accentTextHover: '#708dff',
   primaryButton: '#0064E0',
   danger: '#ed4956',
   storyGradientStart: '#f09433',
   storyGradientEnd: '#bc1888',
});

export const spacing = stylex.defineVars({
   xs: '4px',
   sm: '8px',
   md: '16px',
   lg: '24px',
   xl: '32px',
});

export const radius = stylex.defineVars({
   xs: '4px',
   sm: '8px',
   md: '12px',
   lg: '16px',
   xl: '22px',
   xxl: '28px',
   full: '9999px',
});
