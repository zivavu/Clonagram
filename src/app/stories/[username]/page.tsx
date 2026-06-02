import { getActiveStories } from '@/src/actions/story/getActiveStories';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import StoriesPage from '@/src/pageComponents/Stories';

export default async function StoriesRoute({ params }: { params: Promise<{ username: string }> }) {
   const { username } = await params;
   const [{ entries, viewedStoryIds }, profile] = await Promise.all([
      getActiveStories(),
      getAuthProfile(),
   ]);

   return (
      <StoriesPage
         username={username}
         storyId={null}
         entries={entries}
         viewedStoryIds={viewedStoryIds}
         currentUserId={profile?.id ?? null}
      />
   );
}
