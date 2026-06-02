import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.65)',
      zIndex: 100,
   },
   content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      backgroundColor: colors.bgElevated,
      borderRadius: radius.md,
      width: '400px',
      overflow: 'hidden',
      zIndex: 101,
      display: 'flex',
      flexDirection: 'column',
   },
   title: {
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: 700,
      color: colors.textPrimary,
      padding: '24px 16px 16px',
   },
   option: {
      width: '100%',
      padding: '16px',
      fontSize: '14px',
      fontWeight: 600,
      textAlign: 'center',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: colors.separator,
      backgroundColor: 'transparent',
      color: colors.textPrimary,
   },
   optionUpload: {
      color: colors.accentText,
   },
   optionRemove: {
      color: colors.danger,
   },
});
