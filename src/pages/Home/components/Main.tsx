'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { colors } from '../../../styles/tokens.stylex';

const styles = stylex.create({
   main: {
      width: '100%',
      display: 'flex',
      gap: '64px',
      padding: '36px',
      paddingTop: '48px',
      paddingBottom: '26px',
   },
   forYouFollowingSwitch: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
   },
   forYouFollowingSwitchButton: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
   },
   forYouFollowingSwitchButtonLabel: {
      fontSize: '1rem',
      fontWeight: 300,
      color: colors.textPrimary,
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
         <div {...stylex.props(styles.feedContainer)}>
            <div {...stylex.props(styles.forYouFollowingSwitch)}>
               <Link href="?variant=home" aria-label="For You" {...stylex.props(styles.forYouFollowingSwitchButton)}>
                  <span {...stylex.props(styles.forYouFollowingSwitchButtonLabel)}>For You</span>
               </Link>
               <Link
                  href="?variant=following"
                  aria-label="Following"
                  {...stylex.props(styles.forYouFollowingSwitchButton)}
               >
                  <span {...stylex.props(styles.forYouFollowingSwitchButtonLabel)}>Following</span>
               </Link>
            </div>
         </div>
      </main>
   );
}
