import * as stylex from '@stylexjs/stylex';
import { getActiveStories } from '@/src/actions/story/getActiveStories';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { getCachedUser } from '@/src/lib/supabase/getCachedUser';
import HomepageFeed from './components/HomepageFeed';
import StoriesRow from './components/StoriesRow';
import { styles } from './index.stylex';

export default async function Main({ variant }: { variant: 'home' | 'following' | null }) {
   const [{ entries, viewedStoryIds }, profile, user] = await Promise.all([
      getActiveStories(),
      getAuthProfile(),
      getCachedUser(),
   ]);
   const isAnonymous = user?.is_anonymous ?? false;

   return (
      <main {...stylex.props(styles.root)}>
         <StoriesRow
            entries={entries}
            viewedStoryIds={viewedStoryIds}
            currentUser={profile}
            isAnonymous={isAnonymous}
         />
         <HomepageFeed variant={variant ?? 'home'} />
      </main>
   );
}
