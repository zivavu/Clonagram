import * as stylex from '@stylexjs/stylex';

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
      height: '95dvh',
      zIndex: 4,
   },
   noAnimation: {
      animationName: 'none',
      animationDuration: '0s',
   },
   closeOverlayLayer: {
      position: 'fixed',
      inset: 0,
      zIndex: 5,
      pointerEvents: 'none',
   },
   closeOverlayButton: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      pointerEvents: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      cursor: 'pointer',
      ':hover': {
         backgroundColor: 'rgba(255, 255, 255, 0.15)',
      },
   },
});
