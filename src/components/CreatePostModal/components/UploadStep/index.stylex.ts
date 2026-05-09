import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '4px 16px',
      backgroundColor: colors.bg,
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: colors.border,
   },
   title: {
      fontSize: '16px',
      fontWeight: 600,
      color: colors.textPrimary,
      lineHeight: '24px',
   },
   closeButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      background: 'none',
      border: 'none',
      color: colors.textPrimary,
      borderRadius: radius.full,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   dropZone: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      height: '100%',
      padding: '80px 40px',
      transition: 'background-color 0.2s ease',
   },
   dropZoneActive: {
      backgroundColor: 'rgba(74, 93, 249, 0.05)',
   },
   dropText: {
      fontSize: '20px',
      fontWeight: 500,
      color: colors.textPrimary,
      margin: 0,
   },
   selectButton: {
      padding: '8px 16px',
      borderRadius: radius.md,
      backgroundColor: colors.accent,
      color: 'white',
      fontSize: '14px',
      fontWeight: 600,
      textAlign: 'center',
      border: 'none',
      ':hover': {
         backgroundColor: '#4150f7',
      },
   },
});
