import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { getExplorePosts } from '../../actions/post/getExplorePosts';
import { createServerClient } from '../../lib/supabase/server';
import { colors } from '../../styles/tokens.stylex';
import ExploreFeed from './ExploreFeed';
import { styles } from './index.stylex';

export default async function ExplorePage({ variant }: { variant: string | null }) {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   const isAnonymous = !user || user.is_anonymous;
   const activeVariant =
      isAnonymous || variant === 'nonpersonalized' ? 'nonpersonalized' : 'for_you';
   const isForYou = activeVariant === 'for_you';

   const { posts } = await getExplorePosts({ variant: activeVariant });

   return (
      <div {...stylex.props(styles.page)}>
         <div {...stylex.props(styles.content)}>
            {!isAnonymous && (
               <div {...stylex.props(styles.header)}>
                  <Link href="/explore?variant=for_you" {...stylex.props(styles.headerLink)}>
                     <span
                        {...stylex.props(isForYou ? styles.headerActive : styles.headerInactive)}
                     >
                        For you
                     </span>
                  </Link>
                  <Link
                     href="/explore?variant=nonpersonalized"
                     {...stylex.props(styles.headerLink)}
                  >
                     <span
                        {...stylex.props(!isForYou ? styles.headerActive : styles.headerInactive)}
                     >
                        Not personalized
                     </span>
                  </Link>
               </div>
            )}
            {posts.length === 0 && isForYou ? (
               <span {...stylex.props(styles.emptyText)}>
                  Start following people to see their posts.{' '}
                  <Link href="/explore/people" style={{ color: colors.accent, fontWeight: 600 }}>
                     Find people
                  </Link>
               </span>
            ) : (
               <ExploreFeed variant={activeVariant} initialPosts={posts} />
            )}
         </div>
      </div>
   );
}
