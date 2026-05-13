import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   previewImage: {
      flexShrink: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      userSelect: 'none',
   },
});
