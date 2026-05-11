import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'relative',
   },
   storiesRow: {
      display: 'flex',
      flexDirection: 'row',
      gap: '18px',
      overflowX: 'auto',
      paddingBottom: spacing.xs,
      borderBottom: `1px solid ${colors.separator}`,
      paddingTop: '8px',
      paddingLeft: '12px',
      position: 'relative',
      scrollbarWidth: 'none',
   },
   storiesRowButton: {
      display: 'flex',
      padding: '8px',
      borderRadius: radius.full,
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      transition: 'visibility 0s',
      ':hover': {
         backgroundColor: 'rgba(255, 255, 255, 0.3)',
      },
      ':disabled': {
         color: colors.textPrimary,
      },
   },
   storiesRowButtonLeft: {
      left: '0',
   },
   storiesRowButtonRight: {
      right: '0',
   },
   hidden: {
      visibility: 'hidden',
      pointerEvents: 'none',
   },
   navIcon: {
      fontSize: 24,
   },
   navIconLeft: {
      transform: 'rotate(90deg)',
   },
   navIconRight: {
      transform: 'rotate(-90deg)',
   },
   storyLink: {
      display: 'contents',
   },
   storyItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer',
      flexShrink: 0,
   },
   storyRing: {
      padding: '3px',
      borderRadius: radius.full,
      backgroundImage: 'linear-gradient(45deg, #f09433, #bc1888)',
   },
   storyRingInner: {
      padding: '3px',
      borderRadius: radius.full,
      backgroundColor: colors.bg,
   },
   storyAvatar: {
      borderRadius: radius.full,
   },
   storyUsername: {
      fontSize: '0.7rem',
      color: colors.textPrimary,
      maxWidth: '64px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      textAlign: 'center',
   },
});
