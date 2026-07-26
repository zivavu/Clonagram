import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: colors.border,
      position: 'relative',
      flexShrink: 0,
   },
   title: {
      fontSize: '16px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   iconButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: radius.full,
      color: colors.textPrimary,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   closeButton: {
      right: '8px',
   },
   backButton: {
      left: '8px',
   },
   renameBody: {
      padding: '16px',
   },
   input: {
      width: '100%',
      padding: '10px 12px',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.sm,
      border: 'none',
      fontSize: '15px',
      color: colors.textPrimary,
      outline: 'none',
      '::placeholder': {
         color: colors.textMuted,
      },
      ':focus': {
         outline: `1px solid ${colors.border}`,
      },
   },
   confirmBody: {
      padding: '24px 16px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      textAlign: 'center',
   },
   confirmTitle: {
      fontSize: '18px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   confirmDescription: {
      fontSize: '14px',
      color: colors.textSecondary,
      lineHeight: '1.5',
   },
});
