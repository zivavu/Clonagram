'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';

const styles = stylex.create({
   container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
      width: '100%',
      gap: 16,
      padding: 24,
   },
   heading: {
      fontSize: 24,
      fontWeight: 600,
   },
   message: {
      color: 'rgb(115, 115, 115)',
      textAlign: 'center',
   },
   homeLink: {
      color: 'rgb(0, 100, 224)',
      fontWeight: 600,
      fontSize: 14,
      textDecoration: 'none',
   },
});

export default function MainLayoutNotFound() {
   return (
      <div {...stylex.props(styles.container)}>
         <h1 {...stylex.props(styles.heading)}>Page not found</h1>
         <p {...stylex.props(styles.message)}>The page you are looking for does not exist.</p>
         <Link href="/" {...stylex.props(styles.homeLink)}>
            Go home
         </Link>
      </div>
   );
}
