import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savePostAction } from '@/src/actions/saves/savePost';
import { unsavePostAction } from '@/src/actions/saves/unsavePost';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import type { PostWithMedia } from '@/src/queries/posts';

export function useTogglePostSave(post: PostWithMedia) {
   const { data: authUser } = useAuthUser();
   const queryClient = useQueryClient();
   const postKey = ['post', post.id];

   return useMutation({
      mutationFn: () => {
         const isSaved = post.saves?.some(s => s.user_id === authUser?.id);
         return isSaved
            ? unsavePostAction({ postId: post.id })
            : savePostAction({ postId: post.id });
      },
      onMutate: async () => {
         await queryClient.cancelQueries({ queryKey: postKey });
         const previous = queryClient.getQueryData<PostWithMedia>(postKey);
         const isSaved = post.saves?.some(s => s.user_id === authUser?.id);

         queryClient.setQueryData<PostWithMedia>(postKey, old => {
            if (!old || !authUser) return old;
            return {
               ...old,
               saves: isSaved
                  ? (old.saves ?? []).filter(s => s.user_id !== authUser.id)
                  : [...(old.saves ?? []), { user_id: authUser.id }],
            };
         });

         return { previous };
      },
      onError: (_err, _vars, context) => {
         if (context?.previous) queryClient.setQueryData(postKey, context.previous);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: postKey });
         queryClient.invalidateQueries({ queryKey: ['reels'] });
         queryClient.invalidateQueries({ queryKey: ['profiles'] });
      },
   });
}
