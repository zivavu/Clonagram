import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
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
      ':hover': {
         backgroundColor: '#4150f7',
      },
   },
});

export const stepHeaderStyles = stylex.create({
   closeButton: {
      display: 'flex',
      padding: '8px',
      color: colors.textPrimary,
      borderRadius: radius.full,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
});
