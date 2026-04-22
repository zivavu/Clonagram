import * as stylex from '@stylexjs/stylex';
export const colors = stylex.defineVars({
	bg: 'light-dark(#ffffff, #0c1014)',
	bgSecondary: 'light-dark(#fafafa, #1f1f22)',
	bgElevated: 'light-dark(#ffffff, #1c1c1c)',
	border: 'light-dark(#dbdbdb, #494D53)',
	textPrimary: 'light-dark(#000000, #F2F4F6)',
	textSecondary: 'light-dark(#737373, #a8a8a8)',
	textMuted: 'light-dark(#c7c7c7, #555555)',
	buttonHover: 'light-dark(#f2f4f6, #353538)',
	accent: '#0064e0',
	accentHover: '#1877f2',
	accentText: '#6078d4',
	accentTextHover: '#7b90e4',
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
	sm: '4px',
	md: '8px',
	lg: '12px',
	xl: '22px',
	full: '9999px',
});

export const fonts = stylex.defineVars({
	body: 'var(--font-chivo), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
	size: { default: '14px' },
});
