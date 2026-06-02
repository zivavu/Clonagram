import * as stylex from '@stylexjs/stylex';
import { getActiveStories } from '@/src/actions/story/getActiveStories';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import HomepageFeed from './components/HomepageFeed';
import StoriesRow from './components/StoriesRow';
import { styles } from './index.stylex';

export default async function Main() {
   const [{ entries, viewedStoryIds }, profile] = await Promise.all([
      getActiveStories(),
      getAuthProfile(),
   ]);

   return (
      <main {...stylex.props(styles.root)}>
         <StoriesRow
            entries={entries}
            viewedStoryIds={viewedStoryIds}
            currentUserAvatarUrl={profile?.avatar_url ?? null}
         />
         <HomepageFeed />
      </main>
   );
}
