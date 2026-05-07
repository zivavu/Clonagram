import { Separator } from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import Main from './components/Main';
import RightSidebar from './components/RightSidebar';
import { styles } from './index.stylex';

export default function HomePage({ variant }: { variant: string | null }) {
   const isFollowingSelected = variant === 'following';

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.forYouFollowingContainer)}>
            <div {...stylex.props(styles.forYouFollowingSwitch)}>
               <Link href="?variant=home" aria-label="For You" {...stylex.props(styles.forYouFollowingLink)}>
                  <span
                     {...stylex.props(
                        styles.forYouFollowingSwitchButtonLabel,
                        !isFollowingSelected && styles.forYouFollowingTextActive,
                     )}
                  >
                     For you
                  </span>
               </Link>
               <Link href="?variant=following" aria-label="Following" {...stylex.props(styles.forYouFollowingLink)}>
                  <span
                     {...stylex.props(
                        styles.forYouFollowingSwitchButtonLabel,
                        isFollowingSelected && styles.forYouFollowingTextActive,
                     )}
                  >
                     Following
                  </span>
               </Link>
            </div>
            <Separator {...stylex.props(styles.separator)} />
            <div {...stylex.props(styles.mainContainer)}>
               <Main />
               <RightSidebar />
            </div>
         </div>
      </div>
   );
}
