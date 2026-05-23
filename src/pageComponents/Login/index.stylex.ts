import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      minHeight: '100dvh',
      maxWidth: '100dvw',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.bg,
   },
   content: {
      display: 'flex',
   },
});
