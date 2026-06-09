import { dislikePostAction } from '@/src/actions/likes/dislikePost';
import { likePostAction } from '@/src/actions/likes/likePost';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { useOptimisticToggle } from '@/src/hooks/useOptimisticToggle';
import { queryKeys } from '@/src/lib/queryKeys';
import type { PostWithMedia } from '@/src/queries/posts';

export function useTogglePostLike(post: PostWithMedia) {
   const { data: authUser } = useAuthUser();
   const isLiked = post.likes.some(l => l.user_id === authUser?.id);

   return useOptimisticToggle<PostWithMedia>({
      queryKey: queryKeys.post(post.id),
      mutationFn: () =>
         isLiked ? dislikePostAction({ postId: post.id }) : likePostAction({ postId: post.id }),
      updater: old => {
         if (!authUser) return old;
         return {
            ...old,
            likes: isLiked
               ? old.likes.filter(l => l.user_id !== authUser.id)
               : [...old.likes, { user_id: authUser.id }],
         };
      },
   });
}
