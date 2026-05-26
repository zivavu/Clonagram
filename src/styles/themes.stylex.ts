import * as stylex from '@stylexjs/stylex';
import { colors } from './tokens.stylex';

export const darkTheme = stylex.createTheme(colors, {
   bg: 'rgb(12, 16, 20)',
   bgSecondary: 'rgb(37, 41, 46)',
   bgElevated: 'rgb(28, 28, 28)',
   bgBubble: 'rgb(33, 35, 40)',
   border: 'rgb(73, 77, 83)',
   separator: 'rgb(38, 38, 38)',
   elevatedSeparator: 'rgb(43, 48, 54)',
   textPrimary: 'rgb(242, 244, 246)',
   textSecondary: 'rgb(168, 168, 168)',
   textMuted: 'rgb(85, 85, 85)',
   buttonHover: 'rgb(53, 53, 56)',
   threadHover: 'rgb(37, 41, 46)',
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
   blackWhite: 'rgb(0, 0, 0)',
});
