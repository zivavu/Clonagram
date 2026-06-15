import { useQuery } from '@tanstack/react-query';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';
import { getStoryRingState } from '@/src/queries/stories';

export function useStoryStatus(userId: string | undefined) {
   const { data: authUser } = useAuthUser();

   const hideAi = authUser?.hide_ai_content ?? false;

   return useQuery({
      queryKey: userId ? queryKeys.storyStatus(userId, hideAi) : ['storyStatus'],
      queryFn: async () => {
         if (!userId) return { hasStories: false, allStoriesViewed: false };
         return getStoryRingState(supabase, userId, authUser?.id ?? null, hideAi);
      },
      enabled: !!userId && !!authUser,
      staleTime: 30_000,
      retry: false,
   });
}
