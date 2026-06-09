import { toggleCommentLikeAction } from '@/src/actions/comments/toggleCommentLike';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { useOptimisticToggle } from '@/src/hooks/useOptimisticToggle';
import type { PostComment, PostComments } from '@/src/queries/comments';

export function useToggleCommentLike(comment: PostComment, commentsKey: readonly unknown[]) {
   const { data: authUser } = useAuthUser();

   const isLiked = comment.comment_likes.some(cl => cl.user_id === authUser?.id);

   return useOptimisticToggle<PostComments>({
      queryKey: commentsKey,
      mutationFn: () => toggleCommentLikeAction({ commentId: comment.id, isLiked }),
      updater: old =>
         old.map(c => {
            if (c.id !== comment.id) return c;
            return {
               ...c,
               like_count: isLiked ? Math.max(c.like_count - 1, 0) : c.like_count + 1,
               comment_likes: isLiked
                  ? c.comment_likes.filter(cl => cl.user_id !== authUser?.id)
                  : [...c.comment_likes, { user_id: authUser?.id ?? '' }],
            };
         }),
   });
}
