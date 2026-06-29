import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      width: '480px',
      flexShrink: 0,
      height: '100dvh',
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderRightColor: colors.separator,
      display: 'flex',
      flexDirection: 'column',
      '@media (max-width: 1024px)': {
         minWidth: '100%',
         width: '100%',
         height: 'calc(100dvh - 58px - env(safe-area-inset-bottom, 0px))',
         borderRightWidth: 0,
      },
   },
   topBar: {
      padding: '38px 26px 8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '@media (max-width: 1024px)': {
         padding: '16px 16px 8px',
      },
   },
   foldersRow: {
      display: 'flex',
      width: '100%',
   },
   folder: {
      width: '100%',
      padding: '14px 12px',
      display: 'flex',
      justifyContent: 'center',
   },
   body: {
      flex: 1,
      overflowY: 'hidden',
      padding: '10px 0',
      display: 'flex',
      flexDirection: 'column',
   },
   search: {
      margin: '0 16px',
   },
   notesRow: {
      display: 'flex',
      flexDirection: 'row',
      flexShrink: 0,
      paddingTop: '52px',
      paddingBottom: '12px',
      paddingLeft: '16px',
      paddingRight: '16px',
      gap: '36px',
   },
   noteItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      flexShrink: 0,
   },
   threadList: {
      display: 'flex',
      flexDirection: 'column',
   },
   threadItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 24px',
   },
   threadContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
   },
});
