import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      width: '100%',
      minHeight: '135px',
      paddingTop: '22px',
      paddingBottom: '20px',
      paddingLeft: '32px',
      paddingRight: '32px',
      backgroundColor: colors.bg,
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: colors.border,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '18px',
      fontWeight: 300,
      fontSize: '0.75rem',
   },
   footerLinks: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      columnGap: '12px',
      rowGap: '8px',
      maxWidth: '1220px',
   },
   footerLink: {
      fontSize: '0.75rem',
      lineHeight: '1.2',
      color: '#a8adb7',
      ':hover': {
         textDecoration: 'underline',
      },
   },
   footerMetaRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      color: '#9ea4b0',
      fontSize: '0.75rem',
   },
   languageButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#9ea4b0',
      fontWeight: 300,
   },
});
