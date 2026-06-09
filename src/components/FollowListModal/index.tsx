'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useInView } from 'react-intersection-observer';
import { getFollowers, getFollowing } from '@/src/actions/follow/getFollows';
import FollowButton from '@/src/components/FollowButton';
import { UserListItem, UserListSkeleton } from '@/src/components/UserListItem';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { useFollowListModal } from '@/src/store/useFollowListModalStore';
import DialogOverlay from '../DialogOverlay';
import { styles } from './index.stylex';

export default function FollowListModal() {
   const { isOpen, type, userId, close } = useFollowListModal();
   const { data: authUser } = useAuthUser();
   const { ref: sentinelRef, inView } = useInView();

   const queryKey = ['follow-list', type, userId];

   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
      queryKey,
      queryFn: async ({ pageParam = 0 }) => {
         if (type === 'followers') {
            return getFollowers(userId, pageParam);
         }
         return getFollowing(userId, pageParam);
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
         const loaded = allPages.length * 10;
         if (loaded < lastPage.total) return allPages.length;
         return undefined;
      },
      enabled: isOpen && !!userId,
   });

   useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
         fetchNextPage();
      }
   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

   const users = data?.pages.flatMap(page => page.users) ?? [];

   return (
      <Dialog.Root open={isOpen} onOpenChange={() => close()}>
         <Dialog.Portal>
            <DialogOverlay />
            <Dialog.Content {...stylex.props(styles.content)}>
               <div {...stylex.props(styles.header)}>
                  <Dialog.Title {...stylex.props(styles.title)}>
                     {type === 'followers' ? 'Followers' : 'Following'}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                     <button type="button" aria-label="Close" {...stylex.props(styles.closeButton)}>
                        <IoCloseOutline size={22} />
                     </button>
                  </Dialog.Close>
               </div>

               <div {...stylex.props(styles.list)}>
                  {isLoading && <UserListSkeleton count={5} />}

                  {!isLoading && users.length === 0 && (
                     <div {...stylex.props(styles.emptyState)}>
                        {type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
                     </div>
                  )}

                  {users.map(user => (
                     <UserListItem
                        key={user.id}
                        avatarUrl={user.avatar_url}
                        avatarAlt={user.username}
                        username={user.username}
                        userId={user.id}
                        name={user.username}
                        subtitle={user.full_name}
                        rightElement={
                           authUser && authUser.id !== user.id ? (
                              <div style={{ marginRight: '16px' }}>
                                 <FollowButton
                                    targetUserId={user.id}
                                    targetIsPrivate={user.is_private}
                                    variant="card"
                                    rootStyle={
                                       stylex.create({
                                          custom: { paddingTop: 6, paddingBottom: 6 },
                                       }).custom
                                    }
                                 />
                              </div>
                           ) : undefined
                        }
                     />
                  ))}

                  {isFetchingNextPage && (
                     <div {...stylex.props(styles.sentinel)}>
                        <div {...stylex.props(styles.loader)} />
                     </div>
                  )}

                  {hasNextPage && !isFetchingNextPage && (
                     <div ref={sentinelRef} {...stylex.props(styles.sentinel)} />
                  )}
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
