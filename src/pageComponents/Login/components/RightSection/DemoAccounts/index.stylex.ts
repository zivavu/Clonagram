import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '26px',
      marginBottom: '10px',
   },
   title: {
      fontSize: '0.8125rem',
      color: colors.textSecondary,
      textAlign: 'center',
   },
   list: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '8px',
   },
   chip: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 4px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: radius.xl,
      color: colors.textPrimary,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
      ':disabled': {
         cursor: 'not-allowed',
         opacity: 0.6,
      },
   },
   avatar: {
      width: '44px',
      height: '44px',
      borderRadius: radius.full,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.border,
      backgroundColor: colors.bgSecondary,
      color: colors.textSecondary,
   },
   username: {
      maxWidth: '100%',
      fontSize: '12px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
   },
});
