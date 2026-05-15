import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto',
      width: '468px',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '0 8px 0 16px',
      marginBottom: '16px',
   },
   actionsIcon: {
      marginLeft: 'auto',
      fontSize: '1.2rem',
   },
   topUsername: {
      fontSize: '0.9rem',
      fontWeight: 600,
      marginLeft: '8px',
   },
   separator: {
      fontSize: '0.9rem',
      color: colors.textSecondary,
   },
   createdAt: {
      fontSize: '0.9rem',
      color: colors.textSecondary,
   },
   carouselContainer: {
      position: 'relative',
      width: '468px',
      overflow: 'hidden',
      borderRadius: radius.xs,
   },
   carouselTrack: {
      display: 'flex',
      height: '100%',
      transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)',
   },
   carouselSlide: {
      position: 'relative',
      flexShrink: 0,
      width: '468px',
      height: '100%',
   },
   postImage: {
      objectFit: 'cover',
   },
   dotsContainer: {
      position: 'absolute',
      bottom: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '4px',
      zIndex: 2,
   },
   dot: {
      width: '6px',
      height: '6px',
      borderRadius: radius.full,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      transition: 'background-color 0.15s ease',
   },
   dotActive: {
      backgroundColor: colors.textPrimary,
   },
   iconsBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      width: '100%',
      marginTop: '12px',
      padding: '0 16px',
   },
   iconBarItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontWeight: 500,
   },
   descriptionContainer: {
      display: 'flex',
      gap: '4px',
      marginLeft: '8px',
      marginTop: '8px',
   },
   bottomUsername: {
      fontSize: '0.9rem',
      fontWeight: 600,
      marginLeft: '8px',
   },
   description: {
      fontSize: '0.9rem',
      color: colors.textPrimary,
   },
   avatarImage: {
      borderRadius: '50%',
   },
});
