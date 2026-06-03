import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { getExplorePosts } from '../../actions/post/getExplorePosts';
import ExploreGrid from './ExploreGrid';
import { styles } from './index.stylex';

export default async function ExplorePage({ variant }: { variant: string | null }) {
   const activeVariant = variant === 'nonpersonalized' ? 'nonpersonalized' : 'for_you';
   const isForYou = activeVariant === 'for_you';

   const posts = await getExplorePosts(activeVariant);

   return (
      <div {...stylex.props(styles.page)}>
         <div {...stylex.props(styles.content)}>
            <div {...stylex.props(styles.header)}>
               <Link href="/explore?variant=for_you" {...stylex.props(styles.headerLink)}>
                  <span {...stylex.props(isForYou ? styles.headerActive : styles.headerInactive)}>
                     For you
                  </span>
               </Link>
               <Link href="/explore?variant=nonpersonalized" {...stylex.props(styles.headerLink)}>
                  <span {...stylex.props(!isForYou ? styles.headerActive : styles.headerInactive)}>
                     Not personalized
                  </span>
               </Link>
            </div>
            <ExploreGrid posts={posts} />
         </div>
      </div>
   );
}
