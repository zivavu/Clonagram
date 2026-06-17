'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { colors } from '../../styles/tokens.stylex';

const styles = stylex.create({
   container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
      gap: 16,
      padding: 24,
   },
   heading: {
      fontSize: 24,
      fontWeight: 600,
   },
   message: {
      color: colors.textSecondary,
      textAlign: 'center',
   },
   button: {
      backgroundColor: colors.primaryButton,
      color: 'white',
      border: 'none',
      borderRadius: 8,
      padding: '10px 24px',
      fontWeight: 600,
   },
   link: {
      color: colors.accentText,
      fontWeight: 600,
      fontSize: 14,
      textDecoration: 'none',
   },
});

export default function AuthError({
   error,
   reset,
}: {
   error: Error & { digest?: string };
   reset: () => void;
}) {
   return (
      <div {...stylex.props(styles.container)}>
         <h1 {...stylex.props(styles.heading)}>Authentication error</h1>
         <p {...stylex.props(styles.message)}>{error.message || 'Something went wrong.'}</p>
         <button type="button" onClick={() => reset()} {...stylex.props(styles.button)}>
            Try again
         </button>
         <Link href="/login" {...stylex.props(styles.link)}>
            Go to login
         </Link>
      </div>
   );
}
