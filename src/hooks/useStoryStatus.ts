import { useQuery } from '@tanstack/react-query';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { supabase } from '@/src/lib/supabase/client';

export function useStoryStatus(userId: string | undefined) {
   const { data: authUser } = useAuthUser();

   return useQuery({
      queryKey: ['storyStatus', userId],
      queryFn: async () => {
         if (!userId || !authUser) {
            return { hasStories: false, allStoriesViewed: false };
         }

         const { data, error } = await supabase
            .from('stories')
            .select('id, story_views(viewer_id)')
            .eq('user_id', userId)
            .gt('expires_at', new Date().toISOString());

         if (error) throw new Error(`Failed to fetch story status: ${error.message}`);

         const hasStories = data.length > 0;
         const allStoriesViewed = data.every(story =>
            story.story_views?.some(view => view.viewer_id === authUser.id),
         );

         return { hasStories, allStoriesViewed };
      },
      enabled: !!userId && !!authUser,
      staleTime: 30_000,
      retry: false,
   });
}
