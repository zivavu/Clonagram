import * as stylex from '@stylexjs/stylex';
import { BiNotificationOff } from 'react-icons/bi';
import { createServerClient } from '../../../../../../lib/supabase/server';
import { postsWithMediaQuery } from '../../../../../../queries/posts';
import HomepagePost from './HomepagePost';
import { styles } from './index.stylex';

export default async function HomepageFeed() {
   const supabase = await createServerClient();
   const { data: posts, error } = await postsWithMediaQuery(supabase);

   if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
   }
   return (
      <>
         {posts.length === 0 ? (
            <div {...stylex.props(styles.emptyState)}>
               <BiNotificationOff {...stylex.props(styles.emptyStateIcon)} />
               <span {...stylex.props(styles.emptyStateTitle)}>No posts yet</span>
               <span {...stylex.props(styles.emptyStateSubtitle)}>
                  Follow people to see their photos and videos here.
               </span>
            </div>
         ) : (
            <div {...stylex.props(styles.postsContainer)}>
               {posts.map((post, index) => (
                  <HomepagePost key={post.id} post={post} index={index} />
               ))}
            </div>
         )}
      </>
   );
}
