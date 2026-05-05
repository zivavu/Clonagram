import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto',
      width: '468px',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      paddingLeft: '16px',
      marginBottom: '16px',
   },
   topUsername: {
      fontSize: '0.9rem',
      fontWeight: 600,
      marginLeft: '16px',
   },
   separator: {
      fontSize: '0.9rem',
      color: colors.textSecondary,
   },
   createdAt: {
      fontSize: '0.9rem',
      color: colors.textSecondary,
   },
   iconsBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      width: '100%',
      marginTop: '16px',
   },
   iconBarItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontWeight: 500,
   },
   descriptionContainer: {
      display: 'flex',
      gap: '4px',
      marginLeft: '8px',
      marginTop: '8px',
   },
   bottomUsername: {
      fontSize: '0.9rem',
      fontWeight: 600,
      marginLeft: '8px',
   },
   description: {
      fontSize: '0.9rem',
      color: colors.textPrimary,
   },
});
