import { getActiveStories } from '@/src/actions/story/getActiveStories';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import StoriesPage from '@/src/pageComponents/Stories';

export default async function StoriesRoute({
   params,
}: {
   params: Promise<{ username: string; id: string }>;
}) {
   const { username, id } = await params;
   const [{ entries, viewedStoryIds }, profile] = await Promise.all([
      getActiveStories(),
      getAuthProfile(),
   ]);

   return (
      <StoriesPage
         username={username}
         storyId={id}
         entries={entries}
         viewedStoryIds={viewedStoryIds}
         currentUserId={profile?.id ?? null}
      />
   );
}
