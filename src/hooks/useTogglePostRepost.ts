import { togglePostRepost } from '@/src/actions/post/togglePostRepost';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { useOptimisticToggle } from '@/src/hooks/useOptimisticToggle';
import { queryKeys } from '@/src/lib/queryKeys';
import type { PostWithMedia } from '@/src/queries/posts';

type RepostablePost = Pick<PostWithMedia, 'id' | 'reposts' | 'repost_count'>;

export function useTogglePostRepost(post: RepostablePost) {
   const { data: authUser } = useAuthUser();
   const isReposted = post.reposts?.some(r => r.user_id === authUser?.id) ?? false;

   return useOptimisticToggle<PostWithMedia>({
      queryKey: queryKeys.post(post.id),
      mutationFn: () => togglePostRepost({ postId: post.id, isReposted }),
      updater: old => {
         if (!authUser) return old;
         return {
            ...old,
            repost_count: isReposted
               ? Math.max((old.repost_count ?? 0) - 1, 0)
               : (old.repost_count ?? 0) + 1,
            reposts: isReposted
               ? (old.reposts ?? []).filter(r => r.user_id !== authUser.id)
               : [...(old.reposts ?? []), { user_id: authUser.id }],
         };
      },
   });
}
