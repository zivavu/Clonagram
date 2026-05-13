import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      padding: '16px',
      overflowY: 'auto',
   },
   section: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
   },
   sectionTitle: {
      fontSize: '15px',
      fontWeight: 700,
      color: colors.textPrimary,
   },
   soundSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
});
