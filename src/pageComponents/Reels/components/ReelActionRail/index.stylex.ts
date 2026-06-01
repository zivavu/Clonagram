import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   rail: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
   },
   group: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
   },
   button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      color: colors.textPrimary,
   },
   count: {
      color: colors.textPrimary,
      fontSize: '13px',
      fontWeight: 600,
   },
   likedIcon: {
      color: colors.danger,
   },
   avatar: {
      width: '28px',
      height: '28px',
      borderRadius: radius.xs,
      objectFit: 'cover',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.border,
   },
});
