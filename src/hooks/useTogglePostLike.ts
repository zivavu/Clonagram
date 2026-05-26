import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dislikePostAction } from '@/src/actions/likes/dislikePost';
import { likePostAction } from '@/src/actions/likes/likePost';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import type { PostWithMedia } from '@/src/queries/posts';

export function useTogglePostLike(post: PostWithMedia) {
   const { data: authUser } = useAuthUser();
   const queryClient = useQueryClient();
   const postKey = ['post', post.id];

   return useMutation({
      mutationFn: () => {
         const isLiked = post.likes.some(l => l.user_id === authUser?.id);
         return isLiked
            ? dislikePostAction({ postId: post.id })
            : likePostAction({ postId: post.id });
      },
      onMutate: async () => {
         await queryClient.cancelQueries({ queryKey: postKey });
         const previous = queryClient.getQueryData<PostWithMedia>(postKey);
         const isLiked = post.likes.some(l => l.user_id === authUser?.id);

         queryClient.setQueryData<PostWithMedia>(postKey, old => {
            if (!old || !authUser) return old;
            return {
               ...old,
               likes: isLiked
                  ? old.likes.filter(l => l.user_id !== authUser.id)
                  : [...old.likes, { user_id: authUser.id }],
            };
         });

         return { previous };
      },
      onError: (_err, _vars, context) => {
         if (context?.previous) queryClient.setQueryData(postKey, context.previous);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: postKey });
      },
   });
}
