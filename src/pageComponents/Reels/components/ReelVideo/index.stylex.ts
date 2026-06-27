import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   container: {
      position: 'absolute',
      inset: 0,
   },
   video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
   },
   playPauseOverlay: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      background: 'none',
      border: 'none',
   },
   volumeControl: {
      position: 'absolute',
      bottom: '12px',
      right: '12px',
      '@media (max-width: 767px)': {
         bottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)',
         right: '8px',
      },
   },
});
