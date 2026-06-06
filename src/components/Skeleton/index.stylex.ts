import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

const shimmer = stylex.keyframes({
   '0%': { backgroundPosition: '-200% 0' },
   '100%': { backgroundPosition: '200% 0' },
});

export const styles = stylex.create({
   base: {
      backgroundColor: colors.separator,
      backgroundImage: `linear-gradient(90deg, transparent 25%, ${colors.buttonHover} 50%, transparent 75%)`,
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
