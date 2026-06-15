import { type QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@/src/actions/comments/createComment';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { queryKeys } from '@/src/lib/queryKeys';
import type { PostComment, PostComments } from '@/src/queries/comments';

export function useSubmitComment(postId: string, commentsKey: QueryKey) {
   const queryClient = useQueryClient();
   const { data: authUser } = useAuthUser();

   return useMutation({
      mutationFn: ({ content, parentId }: { content: string; parentId?: string }) =>
         createComment({ postId, content, parentId }),
      onMutate: async ({ content, parentId }) => {
         if (!authUser) return {};

          const optimistic: PostComment = {
             id: `optimistic-${Date.now()}`,
             content,
             created_at: new Date().toISOString(),
             like_count: 0,
             reply_count: 0,
             parent_id: parentId ?? null,
             is_ai: false,
             comment_likes: [],
             user: { id: authUser.id, username: authUser.username, avatar_url: authUser.avatar_url },
          };

         if (parentId) {
            const repliesKey = queryKeys.replies(parentId);
            await queryClient.cancelQueries({ queryKey: repliesKey });
            const previousReplies = queryClient.getQueryData<PostComments>(repliesKey);
            queryClient.setQueryData<PostComments>(repliesKey, prev => [
               ...(prev ?? []),
               optimistic,
            ]);
            queryClient.setQueryData<PostComments>(commentsKey, prev =>
               (prev ?? []).map(c =>
                  c.id === parentId ? { ...c, reply_count: c.reply_count + 1 } : c,
               ),
            );
            return { previousReplies, repliesKey };
         }

         await queryClient.cancelQueries({ queryKey: commentsKey });
         const previousComments = queryClient.getQueryData<PostComments>(commentsKey);
         queryClient.setQueryData<PostComments>(commentsKey, prev => [...(prev ?? []), optimistic]);
         return { previousComments };
      },
      onError: (_err, { parentId }, context) => {
         if (!context) return;
         if (parentId && 'previousReplies' in context && context.repliesKey) {
            queryClient.setQueryData(context.repliesKey, context.previousReplies);
            queryClient.setQueryData<PostComments>(commentsKey, prev =>
               (prev ?? []).map(c =>
                  c.id === parentId ? { ...c, reply_count: Math.max(c.reply_count - 1, 0) } : c,
               ),
            );
         } else if ('previousComments' in context) {
            queryClient.setQueryData(commentsKey, context.previousComments);
         }
      },
      onSuccess: (newComment, { parentId }) => {
         if (parentId) {
            const repliesKey = queryKeys.replies(parentId);
            queryClient.setQueryData<PostComments>(repliesKey, prev =>
               (prev ?? []).map(c => (c.id.startsWith('optimistic-') ? newComment : c)),
            );
            queryClient.invalidateQueries({ queryKey: commentsKey });
         } else {
            queryClient.setQueryData<PostComments>(commentsKey, prev =>
               (prev ?? []).map(c => (c.id.startsWith('optimistic-') ? newComment : c)),
            );
         }
      },
   });
}
