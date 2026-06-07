import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   footerLinksContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0 6px',
      marginTop: '18px',
   },
   footerLink: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
      textDecoration: 'none',
      ':hover': {
         textDecoration: 'underline',
      },
   },
   copyright: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
      marginTop: '16px',
      textTransform: 'uppercase',
   },
});
