import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { styles } from './not-found.stylex';

export default function NotFound() {
   return (
      <div {...stylex.props(styles.container)}>
         <h1 {...stylex.props(styles.heading)}>Sorry, this page isn&apos;t available.</h1>
         <p {...stylex.props(styles.message)}>
            The link you followed may be broken, or the page may have been removed.
         </p>
         <Link href="/" {...stylex.props(styles.link)}>
            Go back to Clonagram
         </Link>
      </div>
   );
}
