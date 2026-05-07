import * as stylex from '@stylexjs/stylex';
import { colors } from '@/src/styles/tokens.stylex';

export const styles = stylex.create({
   page: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      width: '100%',
      backgroundColor: colors.bg,
   },
   main: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
   },
   heading: {
      fontSize: 24,
      fontWeight: 600,
      textAlign: 'center',
      marginBottom: 36,
   },
   message: {
      fontSize: 16,
      lineHeight: '20px',
      textAlign: 'center',
   },
   link: {
      color: colors.accentText,
      textDecoration: 'none',
      ':hover': {
         textDecoration: 'underline',
      },
   },
});
