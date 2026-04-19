import * as stylex from '@stylexjs/stylex';
export const colors = stylex.defineVars({
	bg: '#ffffff',
	bgSecondary: '#fafafa',
	border: '#dbdbdb',
	textPrimary: '#000000',
	textSecondary: '#737373',
	textMuted: '#c7c7c7',
	accent: '#0095f6',
	accentHover: '#1877f2',
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
export const radii = stylex.defineVars({
	sm: '4px',
	md: '8px',
	full: '9999px',
});
export const fonts = stylex.defineVars({
	body: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
	size: { default: '14px' },
});
