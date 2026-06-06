import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleCommentLikeAction } from '@/src/comments/toggleCommentLike';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import type { PostComment, PostComments } from '@/src/queries/comments';

export function useToggleCommentLike(comment: PostComment, commentsKey: unknown[]) {
   const { data: authUser } = useAuthUser();
   const queryClient = useQueryClient();

   const isLiked = comment.comment_likes.some(cl => cl.user_id === authUser?.id);

   return useMutation({
      mutationFn: () => toggleCommentLikeAction({ commentId: comment.id, isLiked }),
      onMutate: async () => {
         await queryClient.cancelQueries({ queryKey: commentsKey });
         const previous = queryClient.getQueryData<PostComments>(commentsKey);

         queryClient.setQueryData<PostComments>(commentsKey, prev =>
            (prev ?? []).map(c => {
               if (c.id !== comment.id) return c;
               return {
                  ...c,
                  like_count: isLiked ? Math.max(c.like_count - 1, 0) : c.like_count + 1,
                  comment_likes: isLiked
                     ? c.comment_likes.filter(cl => cl.user_id !== authUser?.id)
                     : [...c.comment_likes, { user_id: authUser?.id ?? '' }],
               };
            }),
         );

         return { previous };
      },
      onError: (_err, _vars, context) => {
         if (context?.previous) queryClient.setQueryData(commentsKey, context.previous);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: commentsKey });
      },
   });
}
