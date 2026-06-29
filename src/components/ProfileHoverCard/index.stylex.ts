import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

const fadeIn = stylex.keyframes({
   from: { opacity: 0, transform: 'translateY(-4px) scale(0.97)' },
   to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});

export const styles = stylex.create({
   content: {
      width: '370px',
      backgroundColor: colors.bgElevated,
      borderRadius: radius.lg,
      boxShadow: `0 4px 24px rgba(0,0,0,0.18)`,
      zIndex: 100,
      outline: 'none',
      overflow: 'hidden',
      animationName: fadeIn,
      animationDuration: '150ms',
      animationTimingFunction: 'ease-out',
      animationFillMode: 'forwards',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '14px',
      padding: '16px',
   },
   nameBlock: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      minWidth: 0,
   },
   username: {
      fontWeight: 700,
      fontSize: '1rem',
      color: colors.textPrimary,
   },
   fullName: {
      fontSize: '0.8125rem',
      color: colors.textSecondary,
   },
   handleRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
   },
   handle: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
   },
   statsRow: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '12px',
   },
   statItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
   },
   statValue: {
      fontWeight: 700,
      fontSize: '0.9375rem',
      color: colors.textPrimary,
      lineHeight: '1.3',
   },
   statLabel: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
   },
   postsContainer: {
      gap: '2px',
      marginBottom: '12px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
   },
   emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px',
      gap: '6px',
   },
   gradientRing: {
      width: '62px',
      height: '62px',
      borderRadius: radius.full,
      padding: '2px',
      background: `linear-gradient(45deg, ${colors.storyGradientStart}, ${colors.storyGradientEnd})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '4px',
   },
   gradientRingInner: {
      width: '100%',
      height: '100%',
      borderRadius: radius.full,
      backgroundColor: colors.bgElevated,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   emptyTitle: {
      fontWeight: 600,
      fontSize: '0.875rem',
      color: colors.textPrimary,
   },
   emptySubtitle: {
      fontSize: '0.8125rem',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: '1.4',
   },

   followButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 16px',
   },
   skeletonWrapper: {
      margin: '16px',
   },
   skeleton: {
      borderRadius: radius.xs,
      backgroundColor: colors.buttonHover,
      animationName: stylex.keyframes({
         '0%': { opacity: 0.6 },
         '50%': { opacity: 1 },
         '100%': { opacity: 0.6 },
      }),
      animationDuration: '1.4s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease-in-out',
   },
   skeletonAvatar: {
      width: '56px',
      height: '56px',
      borderRadius: radius.full,
      flexShrink: 0,
      backgroundColor: colors.buttonHover,
   },
   skeletonRow: {
      display: 'flex',
      gap: '12px',
      marginBottom: '14px',
   },
   skeletonLines: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      paddingTop: '4px',
   },
});
