'use client';

import * as stylex from '@stylexjs/stylex';
import { BiNotificationOff } from 'react-icons/bi';
import type { PostsWithMedia } from '../../../../queries/posts';
import HomepagePost from '../HomepagePost';
import StoriesRow from '../StoriesRow';
import { styles } from './index.stylex';

interface MainProps {
   posts: PostsWithMedia;
}

export default function Main({ posts }: MainProps) {
   return (
      <main {...stylex.props(styles.root)}>
         <StoriesRow />
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
      </main>
   );
}
