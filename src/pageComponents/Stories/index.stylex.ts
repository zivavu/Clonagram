import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

const storyPictureBarFillKeyframes = stylex.keyframes({
   from: {
      transform: 'scaleX(0)',
   },
   to: {
      transform: 'scaleX(1)',
   },
});

export const styles = stylex.create({
   root: {
      position: 'relative',
      height: '100dvh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
   },
   titleLink: {
      position: 'absolute',
      top: '8px',
      left: '16px',
      zIndex: 10,
   },
   titleLinkText: {
      fontFamily: 'var(--font-grand-hotel)',
      fontWeight: '200',
   },
   closeLink: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      zIndex: 10,
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
      height: '100%',
      flexShrink: 0,
      overflow: 'hidden',
      cursor: 'pointer',
      transition:
         'width 380ms cubic-bezier(0.4, 0, 0.2, 1), height 380ms cubic-bezier(0.4, 0, 0.2, 1)',
   },
   storyRounded: {
      borderRadius: radius.md,
   },
   sideStoryClickTarget: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 2,
   },
   sideStoryOverlay: {
      position: 'absolute',
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
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
   },
   activeStoryTopBar: {
      backgroundImage: 'linear-gradient(rgba(38, 38, 38, 0.8), rgba(38, 38, 38, 0))',
      paddingBottom: '20px',
      zIndex: 1,
   },
   activeStoryBottomBar: {
      backgroundImage: 'linear-gradient(rgba(38, 38, 38, 0), rgba(38, 38, 38, 0.8))',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      zIndex: 1,
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
      width: '100%',
   },
   storyMediaBarItemActive: {
      backgroundColor: colors.textPrimary,
   },
   storyPictureBarTrack: {
      flex: 1,
      height: '2px',
      backgroundColor: colors.textMuted,
      borderRadius: radius.md,
      overflow: 'hidden',
   },
   storyPictureBarFill: {
      display: 'block',
      height: '100%',
      width: '100%',
      backgroundColor: colors.textPrimary,
      borderRadius: radius.md,
      transformOrigin: 'left center',
      animationName: storyPictureBarFillKeyframes,
      animationTimingFunction: 'linear',
      animationFillMode: 'forwards',
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
   avatarImage: {
      borderRadius: '50%',
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
   volumePopperPaper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px 14px',
      borderRadius: radius.full,
      backgroundColor: colors.bgElevated,
      boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
      border: 'none',
      outline: 'none',
      zIndex: 100,
   },
   volumeSlider: {
      appearance: 'none',
      width: '88px',
      backgroundColor: colors.bgElevated,
      '::-webkit-slider-runnable-track': {
         backgroundColor: 'rgba(255,255,255,0.28)',
         borderRadius: radius.full,
         height: '3px',
      },
      '::-webkit-slider-thumb': {
         appearance: 'none',
         backgroundColor: 'white',
         width: '14px',
         height: '14px',
         borderRadius: '50%',
         boxShadow: '0 1px 6px rgba(0,0,0,0.45)',
         transition: 'transform 0.15s ease',
         marginTop: '-5.5px',
      },
      '::-moz-range-track': {
         backgroundColor: 'rgba(255,255,255,0.28)',
         borderRadius: radius.full,
         height: '3px',
      },
      '::-moz-range-thumb': {
         backgroundColor: 'white',
         width: '14px',
         height: '14px',
         borderRadius: '50%',
         border: 'none',
         boxShadow: '0 1px 6px rgba(0,0,0,0.45)',
      },
   },
});
