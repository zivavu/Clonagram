import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.md,
   },
   info: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      flex: 1,
   },
   username: {
      fontSize: '16px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   fullName: {
      fontSize: '14px',
      color: colors.textSecondary,
   },
   changeBtn: {
      padding: '8px 16px',
      borderRadius: radius.sm,
      backgroundColor: colors.primaryButton,
      color: colors.white,
      fontSize: '14px',
      fontWeight: 600,
      flexShrink: 0,
   },
});
