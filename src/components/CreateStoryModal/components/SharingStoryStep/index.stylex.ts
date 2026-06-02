import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const spin = stylex.keyframes({
   from: { transform: 'rotate(0deg)' },
   to: { transform: 'rotate(360deg)' },
});

export const styles = stylex.create({
   spinningRing: {
      animationName: spin,
      animationDuration: '0.5s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
   },
   errorText: {
      color: colors.textPrimary,
      fontSize: 14,
      textAlign: 'center',
      padding: '0 24px',
      maxWidth: 320,
   },
   retryButton: {
      marginTop: 16,
      padding: '8px 24px',
      borderRadius: radius.md,
      backgroundColor: colors.textPrimary,
      color: colors.bg,
      fontSize: 14,
      fontWeight: 600,
   },
   closeButton: {
      display: 'flex',
      color: colors.textPrimary,
      borderRadius: radius.full,
      ':hover': { backgroundColor: colors.buttonHover },
   },
});
