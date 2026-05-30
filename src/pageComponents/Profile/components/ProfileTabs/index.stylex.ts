import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      justifyContent: 'center',
      borderTop: `1px solid ${colors.separator}`,
      width: '100%',
   },
   tab: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      paddingTop: '16px',
      paddingBottom: '16px',
      width: '194px',
      borderTop: '1px solid transparent',
      color: colors.textSecondary,
      backgroundColor: 'transparent',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      position: 'relative',
   },
   tabActive: {
      borderTopColor: colors.textPrimary,
      color: colors.textPrimary,

      '::after': {
         content: '""',
         width: 60,
         height: 2,
         backgroundColor: colors.textPrimary,
         position: 'absolute',
         bottom: 0,
         left: '50%',
         transform: 'translateX(-50%)',
      },
   },
   tabIcon: {
      display: 'flex',
      alignItems: 'center',
   },
   tabLabel: {
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '1px',
   },
});
