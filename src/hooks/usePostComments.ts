'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';
import { postCommentsQuery } from '@/src/queries/comments';

export function usePostComments(postId: string) {
   const commentsKey = queryKeys.comments(postId);

   const { data: comments = [], isLoading } = useQuery({
      queryKey: commentsKey,
      queryFn: async () => {
         const { data, error } = await postCommentsQuery(supabase, postId);
         if (error) throw error;
         return data;
      },
   });

   return { comments, commentsKey, isLoading };
}
