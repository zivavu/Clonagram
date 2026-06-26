import * as stylex from '@stylexjs/stylex';

const heartPop = stylex.keyframes({
   '0%': { opacity: 0, transform: 'scale(0.4) rotate(var(--rotation))' },
   '20%': { opacity: 1, transform: 'scale(1.2) rotate(var(--rotation))' },
   '35%': { opacity: 1, transform: 'scale(1) rotate(0deg)' },
   '58%': {
      opacity: 1,
      transform: 'scale(1) rotate(0deg) translateY(0)',
      animationTimingFunction: 'cubic-bezier(0.85, 0, 1, 0.6)',
   },
   '100%': { opacity: 0, transform: 'scale(0.6) rotate(0deg) translateY(-380px)' },
});

export const styles = stylex.create({
   overlay: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 5,
   },
   heartWrapper: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
   },
   heartInner: {
      animationName: heartPop,
      animationDuration: '0.75s',
      animationTimingFunction: 'ease-out',
      animationFillMode: 'forwards',
      display: 'flex',
   },
});
