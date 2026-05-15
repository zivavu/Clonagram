import { Separator } from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { createServerClient } from '../../lib/supabase/server';
import { postsWithMediaQuery } from '../../queries/posts';
import Main from './components/Main';
import RightSidebar from './components/RightSidebar';
import { styles } from './index.stylex';

export default async function HomePage({ variant }: { variant: string | null }) {
   const isFollowingSelected = variant === 'following';

   const supabase = await createServerClient();
   const { data, error } = await postsWithMediaQuery(supabase);

   if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
   }

   const posts = data ?? [];

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.forYouFollowingContainer)}>
            <div {...stylex.props(styles.forYouFollowingSwitch)}>
               <Link
                  href="?variant=home"
                  aria-label="For You"
                  {...stylex.props(styles.forYouFollowingLink)}
               >
                  <span
                     {...stylex.props(
                        styles.forYouFollowingSwitchButtonLabel,
                        !isFollowingSelected && styles.forYouFollowingTextActive,
                     )}
                  >
                     For you
                  </span>
               </Link>
               <Link
                  href="?variant=following"
                  aria-label="Following"
                  {...stylex.props(styles.forYouFollowingLink)}
               >
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
               <Main posts={posts} />
               <RightSidebar />
            </div>
         </div>
      </div>
   );
}
