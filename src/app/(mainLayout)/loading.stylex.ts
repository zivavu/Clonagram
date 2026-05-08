import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

const spin = stylex.keyframes({
   from: { transform: 'rotate(0deg)' },
   to: { transform: 'rotate(360deg)' },
});

export const styles = stylex.create({
   container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      width: '100%',
      gap: 16,
   },
   spinner: {
      width: 32,
      height: 32,
      border: `3px solid ${colors.border}`,
      borderTopColor: colors.accent,
      borderRadius: '50%',
      animationName: spin,
      animationDuration: '0.8s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
   },
});
