import * as stylex from '@stylexjs/stylex';
import { radius } from '../../styles/tokens.stylex';

const scaleIn = stylex.keyframes({
   from: { transform: 'translate(-50%, -50%) scale(0.9)', opacity: 0 },
   via: { transform: 'translate(-50%, -50%) scale(1.05)' },
   to: { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
});

export const styles = stylex.create({
   content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      animationName: scaleIn,
      animationDuration: '0.1s',
      animationTimingFunction: 'ease-in-out',
      animationFillMode: 'both',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.xs,
      height: '95dvh',
      width: '84dvw',
      zIndex: 4,
   },
});
