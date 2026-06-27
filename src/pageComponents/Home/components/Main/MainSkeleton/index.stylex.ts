import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      width: '630px',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      '@media (max-width: 767px)': {
         width: '100%',
      },
   },
   post: {
      width: '100%',
      maxWidth: '468px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
   },
   postImageWrapper: {
      width: '100%',
      aspectRatio: '1 / 1',
   },
   storiesSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      maxWidth: '100dvw',
   },
   storiesRow: {
      display: 'flex',
      flexDirection: 'row',
      gap: '18px',
      paddingTop: '8px',
      paddingBottom: '12px',
      paddingLeft: '12px',
      borderBottom: `1px solid ${colors.separator}`,
   },
   storyItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      flexShrink: 0,
   },
   postsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '36px',
   },
   postHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      paddingLeft: '16px',
   },
});
