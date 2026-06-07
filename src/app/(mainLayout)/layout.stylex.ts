import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      backgroundColor: colors.bg,
      minHeight: '100dvh',
      '@media (max-width: 767px)': {
         paddingBottom: 'calc(58px + env(safe-area-inset-bottom, 0px))',
      },
   },
});
