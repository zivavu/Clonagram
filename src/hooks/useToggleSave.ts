import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savePostAction } from '@/src/actions/saves/savePost';
import { unsavePostAction } from '@/src/actions/saves/unsavePost';
import { useAuthUser } from '@/src/hooks/useAuthUser';

export function useToggleSave(postId: string, saves: Array<{ user_id: string }> | undefined) {
   const { data: authUser } = useAuthUser();
   const queryClient = useQueryClient();
   const postKey = ['post', postId];

   return useMutation({
      mutationFn: () => {
         const isSaved = saves?.some(s => s.user_id === authUser?.id);
         return isSaved ? unsavePostAction({ postId }) : savePostAction({ postId });
      },
      onMutate: async () => {
         await queryClient.cancelQueries({ queryKey: postKey });
         const previous = queryClient.getQueryData<unknown>(postKey);
         return { previous };
      },
      onError: (_err, _vars, context) => {
         if (context?.previous) queryClient.setQueryData(postKey, context.previous);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: postKey });
         queryClient.invalidateQueries({ queryKey: ['reels'] });
      },
   });
}
