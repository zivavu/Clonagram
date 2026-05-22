import * as stylex from '@stylexjs/stylex';
import Skeleton from '@/src/components/Skeleton';
import { styles } from './index.stylex';

function PostSkeleton() {
   return (
      <div {...stylex.props(styles.post)}>
         <div {...stylex.props(styles.postHeader)}>
            <Skeleton width={32} height={32} rounded />
            <Skeleton width={110} height={12} />
         </div>
         <Skeleton width={468} height={468} />
      </div>
   );
}

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
