import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   container: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      overflow: 'hidden',
      height: '100%',
      aspectRatio: '9 / 16',
   },
   previewArea: {
      flex: 1,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#000',
   },
   media: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
   },
   controls: {
      position: 'absolute',
      bottom: '12px',
      right: '12px',
      zIndex: 3,
   },
});
