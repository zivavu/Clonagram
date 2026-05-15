'use client';

import * as stylex from '@stylexjs/stylex';
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
         <div {...stylex.props(styles.postsContainer)}>
            {posts.map((post, index) => (
               <HomepagePost key={post.id} post={post} index={index} />
            ))}
         </div>
      </main>
   );
}
