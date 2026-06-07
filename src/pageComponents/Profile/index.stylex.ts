import * as stylex from '@stylexjs/stylex';
import { spacing } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      paddingLeft: '120px',
      paddingRight: '100px',
      minHeight: '100dvh',
      maxWidth: '1255px',
      padding: '58px 0',
      margin: '0 auto',

      '@media (max-width: 768px)': {
         paddingLeft: '0',
         paddingRight: '0',
      },
   },
   topSection: {
      width: 'min(680px, 100%)',
      padding: `0 ${spacing.sm}`,
   },
});
