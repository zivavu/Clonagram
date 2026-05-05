import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      backgroundColor: colors.bg,
   },
});
