import * as stylex from '@stylexjs/stylex';
import type { Post } from '@/src/mocks/posts';
import { POSTS } from '@/src/mocks/posts';
import HomepagePost from '../HomepagePost';
import { styles } from './index.stylex';
import StoriesRow from '../StoriesRow';

export type { Post };

export default function Main() {
   return (
      <main {...stylex.props(styles.root)}>
         <StoriesRow />
         <div {...stylex.props(styles.postsContainer)}>
            {POSTS.map((post, index) => (
               <HomepagePost key={post.id} post={post} index={index} />
            ))}
         </div>
      </main>
   );
}
