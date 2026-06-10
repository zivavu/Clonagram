import { getActiveStories } from '@/src/actions/story/getActiveStories';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';

export async function loadStoriesPage() {
   const [{ entries, viewedStoryIds }, profile] = await Promise.all([
      getActiveStories(),
      getAuthProfile(),
   ]);

   return { entries, viewedStoryIds, currentUserId: profile?.id ?? null };
}
