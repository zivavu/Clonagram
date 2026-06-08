import * as stylex from '@stylexjs/stylex';
import { getNotesForFeed } from '@/src/actions/notes/getNotesForFeed';
import { getActiveStories } from '@/src/actions/story/getActiveStories';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';
import HomepageFeed from './components/HomepageFeed';
import StoriesRow from './components/StoriesRow';
import { styles } from './index.stylex';

export default async function Main() {
   const supabase = await createServerClient();
   const [{ entries, viewedStoryIds }, profile, { notes, ownNote }] = await Promise.all([
      getActiveStories(),
      getAuthProfile(supabase),
      getNotesForFeed(),
   ]);

   const {
      data: { user },
   } = await supabase.auth.getUser();
   const isAnonymous = user?.is_anonymous ?? false;

   return (
      <main {...stylex.props(styles.root)}>
         <StoriesRow
            entries={entries}
            viewedStoryIds={viewedStoryIds}
            currentUser={profile}
            isAnonymous={isAnonymous}
            notes={notes}
            ownNote={ownNote}
         />
         <HomepageFeed />
      </main>
   );
}
