import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../styles/tokens.stylex';

export const styles = stylex.create({
   row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '8px 16px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      color: 'inherit',
      textAlign: 'left',
      borderRadius: radius.sm,
      ':hover': {
         backgroundColor: colors.threadHover,
      },
   },
   info: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
      minWidth: 0,
   },
   avatar: {
      borderRadius: '50%',
      flexShrink: 0,
   },
   names: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      minWidth: 0,
   },
   name: {
      fontSize: '14px',
      fontWeight: 400,
      color: colors.textPrimary,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
   },
   subtitle: {
      fontSize: '12px',
      lineHeight: '16px',
      color: colors.textSecondary,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
   },
   right: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      marginLeft: '12px',
   },
   skeletonRow: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      width: '100%',
   },
   skeletonAvatar: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      backgroundColor: colors.bgSecondary,
      flexShrink: 0,
      marginRight: 12,
   },
   skeletonLines: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      flex: 1,
   },
   skeletonName: {
      width: '80%',
      height: 12,
      borderRadius: radius.xs,
      backgroundColor: colors.bgSecondary,
   },
   skeletonSubtitle: {
      width: '60%',
      height: 12,
      borderRadius: radius.xs,
      backgroundColor: colors.bgSecondary,
   },
});
