'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { styles } from './error.stylex';

export default function MainLayoutError({
   error,
   reset,
}: {
   error: Error & { digest?: string };
   reset: () => void;
}) {
   return (
      <div {...stylex.props(styles.container)}>
         <h1 {...stylex.props(styles.heading)}>Something went wrong</h1>
         <p {...stylex.props(styles.message)}>{error.message || 'An unexpected error occurred.'}</p>
         <button type="button" onClick={() => reset()} {...stylex.props(styles.button)}>
            Try again
         </button>
         <Link href="/" {...stylex.props(styles.homeLink)}>
            Go home
         </Link>
      </div>
   );
}
