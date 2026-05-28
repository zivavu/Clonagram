import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      justifyContent: 'center',
      gap: '60px',
      borderTop: `1px solid ${colors.separator}`,
      width: '100%',
   },
   tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      paddingTop: '16px',
      paddingBottom: '16px',
      borderTop: '1px solid transparent',
      marginTop: '-1px',
      color: colors.textSecondary,
      backgroundColor: 'transparent',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
   },
   tabActive: {
      borderTopColor: colors.textPrimary,
      color: colors.textPrimary,
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
