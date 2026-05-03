import * as stylex from '@stylexjs/stylex';

export const colors = stylex.defineVars({
   bg: 'light-dark(rgb(255, 255, 255), rgb(12, 16, 20))',
   bgSecondary: 'light-dark(rgb(250, 250, 250), rgb(37, 41, 46))',
   bgElevated: 'light-dark(rgb(255, 255, 255), rgb(28, 28, 28))',
   bgBubble: 'light-dark(rgb(255, 255, 255), rgb(33, 35, 40))',
   border: 'light-dark(rgb(219, 219, 219), rgb(73, 77, 83))',
   borderMuted: 'light-dark(rgb(224, 224, 224), rgb(38, 38, 38))',
   separator: 'light-dark(rgb(224, 224, 224), rgb(38, 38, 38))',
   textPrimary: 'light-dark(rgb(0, 0, 0), rgb(242, 244, 246))',
   textSecondary: 'light-dark(rgb(115, 115, 115), rgb(168, 168, 168))',
   textMuted: 'light-dark(rgb(199, 199, 199), rgb(85, 85, 85))',
   buttonHover: 'light-dark(rgb(242, 244, 246), rgb(53, 53, 56))',
   accent: 'rgb(0, 100, 224)',
   accentHover: 'rgb(24, 119, 242)',
   accentText: 'rgb(75, 169, 254)',
   accentTextHover: 'rgb(112, 141, 255)',
   primaryButton: 'rgb(0, 100, 224)',
   danger: 'rgb(237, 73, 86)',
   storyGradientStart: 'rgb(240, 148, 51)',
   storyGradientEnd: 'rgb(188, 24, 136)',
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
