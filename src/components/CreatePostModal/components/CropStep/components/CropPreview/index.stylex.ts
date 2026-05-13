import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   root: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
   },
   cropContainer: {
      position: 'relative',
      maxWidth: '100%',
      maxHeight: '100%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   previewImage: {
      flexShrink: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      pointerEvents: 'none',
   },
   gridOverlay: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
   },
});
