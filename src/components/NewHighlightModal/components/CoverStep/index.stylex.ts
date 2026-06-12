import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 16px 20px',
      gap: '24px',
      overflowY: 'auto',
   },
   preview: {
      width: '200px',
      height: '200px',
      borderRadius: radius.full,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: colors.bgSecondary,
      flexShrink: 0,
   },
   strip: {
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      width: '100%',
      paddingBottom: '4px',
   },
   thumb: {
      width: '64px',
      height: '108px',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.xs,
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      padding: 0,
   },
   thumbSelected: {
      borderColor: colors.white,
   },
});
