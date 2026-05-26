import * as stylex from '@stylexjs/stylex';

export const colors = stylex.defineVars({
   bg: 'rgb(255, 255, 255)',
   bgSecondary: 'rgb(250, 250, 250)',
   bgElevated: 'rgb(255, 255, 255)',
   bgBubble: 'rgb(255, 255, 255)',
   border: 'rgb(219, 219, 219)',
   separator: 'rgb(224, 224, 224)',
   elevatedSeparator: 'rgb(224, 224, 224)',
   textPrimary: 'rgb(0, 0, 0)',
   textSecondary: 'rgb(115, 115, 115)',
   textMuted: 'rgb(199, 199, 199)',
   buttonHover: 'rgb(242, 244, 246)',
   threadHover: 'rgb(245, 245, 245)',
   accent: 'rgb(74, 93, 249)',
   accentHover: 'rgb(24, 119, 242)',
   accentText: 'rgb(75, 169, 254)',
   accentTextHover: 'rgb(112, 141, 255)',
   primaryButton: 'rgb(0, 100, 224)',
   danger: 'rgb(237, 73, 86)',
   storyGradientStart: 'rgb(240, 148, 51)',
   storyGradientEnd: 'rgb(188, 24, 136)',
   black: 'rgb(0, 0, 0)',
   white: 'rgb(255, 255, 255)',
   blackWhite: 'rgb(255, 255, 255)',
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
