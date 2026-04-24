'use client';

import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
   main: {
      width: '100%',
      display: 'flex',
      gap: '64px',
   },

   feedContainer: {
      width: '630px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
   },
});

export default function Main() {
   return (
      <main {...stylex.props(styles.main)}>
         <div {...stylex.props(styles.feedContainer)}></div>
      </main>
   );
}
