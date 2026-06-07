import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '0 auto',
      gap: '12px',
      padding: '44px',
      paddingLeft: 'var(--main-sidebar-width)',

      '@media (max-width: 767px)': {
         padding: '0',
         paddingLeft: '0',
         paddingTop: '16px',
         paddingBottom: '16px',
      },
   },
   forYouFollowingSwitch: {
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'flex-start',
      gap: '12px',
      padding: '0 12px',
   },
   forYouFollowingLink: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
   },
   forYouFollowingSwitchButtonLabel: {
      fontSize: '1rem',
      fontWeight: 700,
      color: colors.textSecondary,
   },
   forYouFollowingTextActive: {
      color: colors.textPrimary,
   },
   separator: {
      width: '100%',
      height: '1px',
      backgroundColor: colors.separator,
   },
   mainContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
   },
   sidebarSlot: {
      width: '287px',
      marginLeft: '80px',
      flexShrink: 0,
      '@media (max-width: 1200px)': {
         display: 'none',
      },
   },
});
