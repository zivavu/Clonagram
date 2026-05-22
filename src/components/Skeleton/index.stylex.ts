import * as stylex from '@stylexjs/stylex';
import { radius } from '../../styles/tokens.stylex';

const shimmer = stylex.keyframes({
   '0%': { backgroundPosition: '-200% 0' },
   '100%': { backgroundPosition: '200% 0' },
});

export const styles = stylex.create({
   base: {
      backgroundColor: 'light-dark(rgb(220, 220, 220), rgb(40, 44, 50))',
      backgroundImage:
         'linear-gradient(90deg, transparent 25%, light-dark(rgba(255,255,255,0.55), rgba(255,255,255,0.06)) 50%, transparent 75%)',
      backgroundSize: '200% 100%',
      animationName: shimmer,
      animationDuration: '1.5s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      borderRadius: radius.xs,
      flexShrink: 0,
   },
   rounded: {
      borderRadius: radius.full,
   },
});
