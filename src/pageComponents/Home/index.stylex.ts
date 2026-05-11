import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      gap: '12px',
      backgroundColor: colors.bg,
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      margin: '0 auto',
   },
   forYouFollowingContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '36px',
      paddingTop: '44px',
      paddingBottom: '26px',
   },
   forYouFollowingSwitch: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
   },
   forYouFollowingLink: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
   },
   forYouFollowingSwitchButtonLabel: {
      fontSize: '1rem',
      fontWeight: 600,
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
});
