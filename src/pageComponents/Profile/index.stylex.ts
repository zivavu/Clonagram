import * as stylex from '@stylexjs/stylex';
import { radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      minHeight: '100dvh',
      maxWidth: '1255px',
      padding: '58px 0',
      margin: '0 auto',
      gap: radius.md,
   },
   topSection: {
      width: 'min(680px, 90dvw)',
   },
});
