import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'relative',
      height: '100svh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
   },
   title: {
      position: 'absolute',
      top: '8px',
      left: '16px',
      zIndex: 10,
      fontFamily: 'var(--font-grand-hotel)',
      fontWeight: '200',
   },
   strip: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      willChange: 'transform',
      transition: 'transform 380ms cubic-bezier(0.4, 0, 0.2, 1)',
   },
   story: {
      position: 'relative',
      flexShrink: 0,
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'width 380ms cubic-bezier(0.4, 0, 0.2, 1), height 380ms cubic-bezier(0.4, 0, 0.2, 1)',
   },
   storyRounded: {
      borderRadius: radius.md,
   },
   sideStoryOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(38, 38, 38, 0.7)',
      zIndex: 1,
   },
   sideStoryUsername: {
      fontSize: '0.85rem',
      fontWeight: 600,
      color: colors.textPrimary,
      marginTop: 8,
   },
   sideStoryTimestamp: {
      fontSize: '0.85rem',
      fontWeight: 300,
      marginTop: 4,
   },
   navBtn: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      display: 'flex',
      padding: '0',
      transition: 'left 380ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms ease',
      '@media (hover: none)': {
         display: 'none',
      },
   },
   navBtnHidden: {
      opacity: 0,
      pointerEvents: 'none',
   },
   navIcon: {
      stroke: colors.textMuted,
      fill: colors.textMuted,
      strokeWidth: 0.5,
      transition: 'all 0.2s ease-in-out',
      ':hover': {
         stroke: colors.textPrimary,
         fill: colors.textPrimary,
         scale: 1.05,
      },
   },
   navIconLeft: { transform: 'rotate(180deg)' },
   activeStoryOverlay: {
      position: 'relative',
      width: '100%',
      height: '100%',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
   },
   activeStoryTopBar: {
      backgroundImage: 'linear-gradient(rgba(38, 38, 38, 0.8), rgba(38, 38, 38, 0))',
      paddingBottom: '20px',
   },
   activeStoryBottomBar: {
      backgroundImage: 'linear-gradient(rgba(38, 38, 38, 0), rgba(38, 38, 38, 0.8))',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
   },
   activeStoryReplyToInput: {
      width: '100%',
      height: '44px',
      padding: '0 16px',
      borderRadius: radius.full,
      borderColor: 'white',
      borderWidth: '1px',
      borderStyle: 'solid',
      backgroundColor: 'transparent',

      '::placeholder': {
         color: colors.textPrimary,
      },
   },
   storyMediaBarsContainer: {
      padding: '20px 16px',
      paddingBottom: '12px',
      width: '100%',
      display: 'flex',
      gap: '4px',
   },
   storyMediaBarItem: {
      width: '100%',
      height: '2px',
      backgroundColor: colors.textMuted,
      borderRadius: radius.md,
   },
   storyMediaActiveStoryBarContainer: {
      display: 'flex',
   },
   storyMediaBarItemActive: {
      backgroundColor: colors.textPrimary,
   },
   activeStoryTopNavigation: {
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
   },
   activeStoryTopNavigationLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
   },
   activeStoryUsername: {
      fontSize: '0.85rem',
      fontWeight: 400,
      color: colors.textPrimary,
   },
   activeStoryUploadTimestamp: {
      fontSize: '0.85rem',
      fontWeight: 300,
   },
   activeStoryTopNavigationRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
   },
   activeStoryTopNavigationRightButton: {
      display: 'flex',
      transition: 'all 0.2s ease-in-out',
      ':hover': {
         scale: 1.05,
      },
   },
});
