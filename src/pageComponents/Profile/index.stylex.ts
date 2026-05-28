import * as stylex from '@stylexjs/stylex';
import { spacing } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      minHeight: '100dvh',
      paddingTop: '30px',
      paddingBottom: '30px',
   },
   container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '975px',
      paddingLeft: spacing.md,
      paddingRight: spacing.md,
      gap: spacing.md,
   },
});
