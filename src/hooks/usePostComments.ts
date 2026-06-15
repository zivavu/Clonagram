'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';
import { postCommentsQuery } from '@/src/queries/comments';

export function usePostComments(postId: string) {
   const { data: authUser } = useAuthUser();
   const hideAi = authUser?.hide_ai_content ?? false;
   const commentsKey = queryKeys.comments(postId, hideAi);

   const { data: comments = [], isLoading } = useQuery({
      queryKey: commentsKey,
      queryFn: async () => {
         const { data, error } = await postCommentsQuery(supabase, postId, hideAi);
         if (error) throw error;
         return data;
      },
   });

   return { comments, commentsKey, isLoading };
}
