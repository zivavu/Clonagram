import * as stylex from '@stylexjs/stylex';
import { radius } from '../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   image: {
      display: 'block',
      maxWidth: '240px',
      maxHeight: '300px',
      borderRadius: radius.lg,
      objectFit: 'cover',
   },
   button: {
      padding: 0,
      background: 'none',
      border: 'none',
      display: 'block',
   },
});
