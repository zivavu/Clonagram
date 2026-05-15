import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   root: {
      width: '630px',
      flexDirection: 'column',
      gap: '38px',
      display: 'flex',
      position: 'relative',
   },
   postsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '36px',
   },
   emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      paddingTop: '64px',
      paddingBottom: '64px',
      color: 'rgb(115, 115, 115)',
   },
   emptyStateIcon: {
      fontSize: '52px',
      transform: 'scale(-1) rotate(90deg)',
   },
   emptyStateTitle: {
      fontSize: '22px',
      fontWeight: '600',
   },
   emptyStateSubtitle: {
      fontSize: '14px',
      textAlign: 'center',
   },
});
