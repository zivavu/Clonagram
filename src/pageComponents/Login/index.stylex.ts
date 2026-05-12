import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      width: '100%',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.bg,
   },
   content: {
      flex: 1,
      display: 'flex',
      width: '100%',
   },
});
