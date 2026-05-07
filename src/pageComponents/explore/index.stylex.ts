import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   page: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '62px',
      paddingBottom: '48px',
      marginLeft: 'calc(var(--main-sidebar-width) / 2)',
      minHeight: '100dvh',
   },
   content: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '1000px',
      paddingLeft: '16px',
      paddingRight: '16px',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '10px',
   },
   headerLink: {
      fontSize: '1rem',
      fontWeight: 700,
   },
   headerActive: {
      color: colors.textPrimary,
   },
   headerInactive: {
      color: colors.textSecondary,
   },
   grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      width: '100%',
      gridAutoFlow: 'row dense',
      gap: 1,
   },
   item: {
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      backgroundColor: colors.bgSecondary,
   },
   itemTall: {
      gridRow: 'span 2',
      aspectRatio: '1 / 2',
   },
   videoBadge: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   videoIcon: {
      color: 'white',
      fontSize: '20px',
      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
   },
});
