import * as stylex from '@stylexjs/stylex';
export const colors = stylex.defineVars({
	bg: 'light-dark(#ffffff, #000000)',
	bgSecondary: 'light-dark(#fafafa, #121212)',
	bgElevated: 'light-dark(#ffffff, #1c1c1c)',
	border: 'light-dark(#dbdbdb, #262626)',
	textPrimary: 'light-dark(#000000, #f5f5f5)',
	textSecondary: 'light-dark(#737373, #a8a8a8)',
	textMuted: 'light-dark(#c7c7c7, #555555)',
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
