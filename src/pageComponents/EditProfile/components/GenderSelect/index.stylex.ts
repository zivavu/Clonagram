import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.sm,
      overflow: 'hidden',
   },
   option: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      borderBottom: `1px solid ${colors.border}`,
      backgroundColor: 'transparent',
      color: colors.textPrimary,
      fontSize: '14px',
      ':last-child': {
         borderBottom: 'none',
      },
   },
   radio: {
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      border: `2px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
   },
   radioSelected: {
      borderColor: colors.textPrimary,
      backgroundColor: colors.textPrimary,
   },
   checkmark: {
      color: colors.bg,
      fontSize: '14px',
      fontWeight: 700,
   },
});
