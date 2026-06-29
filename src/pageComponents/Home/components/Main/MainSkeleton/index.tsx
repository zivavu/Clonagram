import * as stylex from '@stylexjs/stylex';
import PostSkeleton from '@/src/components/PostSkeleton';
import Skeleton from '@/src/components/Skeleton';
import { styles } from './index.stylex';

export default function MainSkeleton() {
   return (
      <main {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.storiesSection)}>
            <div {...stylex.props(styles.storiesRow)}>
               {Array.from({ length: 6 }, (_, i) => `story-${i}`).map(key => (
                  <div key={key} {...stylex.props(styles.storyItem)}>
                     <Skeleton width={86} height={86} rounded />
                     <Skeleton width={54} height={10} />
                  </div>
               ))}
            </div>
         </div>

         <div {...stylex.props(styles.postsContainer)}>
            <PostSkeleton />
            <PostSkeleton />
         </div>
      </main>
   );
}
