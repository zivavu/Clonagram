import * as stylex from '@stylexjs/stylex';
import { BiNotificationOff } from 'react-icons/bi';
import { getHomeFeedPosts } from '../../../../../../actions/post/getHomeFeedPosts';
import HomepagePost from './HomepagePost';
import { styles } from './index.stylex';

export default async function HomepageFeed({
   variant,
}: {
   variant: 'home' | 'following';
}) {
   const posts = await getHomeFeedPosts(variant);

   return (
      <>
         {posts.length === 0 ? (
            <div {...stylex.props(styles.emptyState)}>
               <BiNotificationOff {...stylex.props(styles.emptyStateIcon)} />
               <span {...stylex.props(styles.emptyStateTitle)}>No posts yet</span>
               <span {...stylex.props(styles.emptyStateSubtitle)}>
                  {variant === 'following'
                     ? 'Follow people to see their photos and videos here.'
                     : 'Be the first to share a photo or video.'}
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
