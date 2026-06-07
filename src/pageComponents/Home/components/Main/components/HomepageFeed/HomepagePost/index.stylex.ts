import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto',
      width: '100%',
      maxWidth: '468px',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '0 8px 0 16px',
      marginBottom: '16px',
   },
   actionsIcon: {
      marginLeft: 'auto',
      fontSize: '1.2rem',
   },
   topUsername: {
      fontSize: '0.9rem',
      fontWeight: 600,
      marginLeft: '8px',
      color: colors.textPrimary,
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
      alignItems: 'baseline',
      gap: '12px',
      width: '100%',
      marginTop: '12px',
      padding: '0 16px',
      color: colors.textPrimary,
   },
   iconBarItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
   },
   iconBarItemButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontWeight: 600,
      color: colors.textPrimary,
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
      color: colors.textPrimary,
   },
   description: {
      fontSize: '0.9rem',
      color: colors.textPrimary,
   },
   avatarImage: {
      borderRadius: '50%',
   },
});
