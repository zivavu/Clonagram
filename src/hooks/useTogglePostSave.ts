import { savePostAction } from '@/src/actions/saves/savePost';
import { unsavePostAction } from '@/src/actions/saves/unsavePost';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { useOptimisticToggle } from '@/src/hooks/useOptimisticToggle';
import { queryKeys } from '@/src/lib/queryKeys';
import type { PostWithMedia } from '@/src/queries/posts';

type SaveablePost = Pick<PostWithMedia, 'id' | 'saves'>;

export function useTogglePostSave(post: SaveablePost) {
   const { data: authUser } = useAuthUser();
   const isSaved = post.saves?.some(s => s.user_id === authUser?.id);

   return useOptimisticToggle<PostWithMedia>({
      queryKey: queryKeys.post(post.id),
      mutationFn: () =>
         isSaved ? unsavePostAction({ postId: post.id }) : savePostAction({ postId: post.id }),
      updater: old => {
         if (!authUser) return old;
         return {
            ...old,
            saves: isSaved
               ? (old.saves ?? []).filter(s => s.user_id !== authUser.id)
               : [...(old.saves ?? []), { user_id: authUser.id }],
         };
      },
      extraInvalidations: [[...queryKeys.reels()]],
   });
}
