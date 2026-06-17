import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'relative',
      maxWidth: 'min(100vw, 630px)',
   },
   storiesRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '26px',
      overflowX: 'auto',
      paddingBottom: spacing.xs,
      borderBottom: `1px solid ${colors.separator}`,
      paddingTop: '8px',
      paddingLeft: '12px',
      position: 'relative',
      scrollbarWidth: 'none',
      zIndex: 3,
   },
   storiesRowButton: {
      display: 'flex',
      padding: '8px',
      borderRadius: radius.full,
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 4,
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
   storyUsername: {
      fontSize: '0.7rem',
      color: colors.textPrimary,
      maxWidth: '64px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      textAlign: 'center',
   },
   addStoryCard: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      gap: '6px',
      flexShrink: 0,
   },
   addStoryRingWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   addStoryPlusBadge: {
      position: 'absolute',
      bottom: 16,
      right: 0,
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      backgroundColor: colors.accentFg,
      color: colors.invertedBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 700,
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: colors.bgBubble,
   },
});
