'use client';
import * as stylex from '@stylexjs/stylex';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelFollowRequest } from '@/src/actions/follow/cancelFollowRequest';
import { followUser } from '@/src/actions/follow/followUser';
import { unfollowUser } from '@/src/actions/follow/unfollowUser';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { supabase } from '@/src/lib/supabase/client';
import { type FollowState, getFollowStatus } from '@/src/queries/followStatus';
import { styles } from './index.stylex';

interface FollowButtonProps {
   targetUserId: string;
   targetIsPrivate: boolean;
   initialState?: FollowState;
   variant: 'profile' | 'sidebar' | 'card';
}

export default function FollowButton({
   targetUserId,
   targetIsPrivate,
   initialState,
   variant,
}: FollowButtonProps) {
   const { data: authUser } = useAuthUser();
   const queryClient = useQueryClient();
   const queryKey = ['follow-status', targetUserId];

   const { data: state = 'none' } = useQuery({
      queryKey,
      queryFn: async () => {
         return getFollowStatus(supabase, authUser?.id ?? '', targetUserId);
      },
      ...(initialState !== undefined && { initialData: initialState }),
      staleTime: Infinity,
   });

   const { mutate, isPending } = useMutation({
      mutationFn: async (action: 'follow' | 'unfollow' | 'cancel') => {
         if (action === 'follow') return followUser(targetUserId);
         if (action === 'unfollow') return unfollowUser(targetUserId);
         return cancelFollowRequest(targetUserId);
      },
      onMutate: async action => {
         await queryClient.cancelQueries({ queryKey });
         const previous = queryClient.getQueryData<FollowState>(queryKey);
         const next: FollowState =
            action === 'follow' ? (targetIsPrivate ? 'requested' : 'following') : 'none';
         queryClient.setQueryData(queryKey, next);
         return { previous };
      },
      onError: (_err, _action, context) => {
         if (context?.previous !== undefined) {
            queryClient.setQueryData(queryKey, context.previous);
         }
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey });
      },
   });

   function handleClick() {
      if (state === 'none') mutate('follow');
      else if (state === 'following') mutate('unfollow');
      else mutate('cancel');
   }

   const label =
      state === 'following' ? 'Following' : state === 'requested' ? 'Requested' : 'Follow';
   const isActive = state !== 'none';

   return (
      <button
         type="button"
         onClick={handleClick}
         disabled={isPending}
         {...stylex.props(
            variant === 'profile' && styles.profileBase,
            variant === 'profile' && (isActive ? styles.profileSecondary : styles.profileFollow),
            variant === 'sidebar' && (isActive ? styles.sidebarSecondary : styles.sidebarFollow),
            variant === 'card' && styles.cardBase,
            variant === 'card' && (isActive ? styles.cardSecondary : styles.cardFollow),
         )}
      >
         {label}
      </button>
   );
}
