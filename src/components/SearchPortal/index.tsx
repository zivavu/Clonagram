'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FaCircleXmark } from 'react-icons/fa6';
import { IoCloseOutline, IoSearchOutline } from 'react-icons/io5';
import { MdVerified } from 'react-icons/md';
import { searchProfiles } from '@/src/actions/profile/searchProfiles';
import { HiddenDialogDescription } from '@/src/components/HiddenDialogLabel';
import { queryKeys } from '@/src/lib/queryKeys';
import { useSearchPortalStore } from '@/src/store/createModalStore';
import { sharedStyles } from '@/src/styles/shared.stylex';
import { colors } from '../../styles/tokens.stylex';
import { UserListItem, UserListSkeleton } from '../UserListItem';
import { styles } from './index.stylex';

const VERIFIED_USERS = new Set(['crumbling.concrete']);

export default function SearchPortal() {
   const { isOpen, close } = useSearchPortalStore();
   const [query, setQuery] = useState('');

   const { data: filteredUsers, isLoading } = useQuery({
      queryKey: queryKeys.profileSearch(query),
      queryFn: async () => searchProfiles({ search: query }),
      enabled: !!query,
   });
   const skeletonCount = filteredUsers?.length ?? 7;

   return (
      <Dialog.Root open={isOpen} onOpenChange={close}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} onClick={close} />
            <Dialog.Content {...stylex.props(styles.content)} onEscapeKeyDown={close}>
               <HiddenDialogDescription>Search for people</HiddenDialogDescription>
               <div {...stylex.props(styles.header)}>
                  <Dialog.Title {...stylex.props(styles.title)}>Search</Dialog.Title>
                  <Dialog.Close asChild>
                     <button {...stylex.props(styles.closeButton)} aria-label="Close">
                        <IoCloseOutline size={30} />
                     </button>
                  </Dialog.Close>
               </div>

               <div {...stylex.props(styles.searchInputWrapper)}>
                  <input
                     {...stylex.props(styles.searchInput, sharedStyles.placeholder)}
                     type="text"
                     placeholder="Search"
                     value={query}
                     onChange={e => setQuery(e.target.value)}
                     // biome-ignore lint/a11y/noAutofocus: It's like that in the original Instagram search bar.
                     autoFocus
                  />
                  {query && (
                     <button
                        type="button"
                        {...stylex.props(styles.clearButton)}
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                     >
                        <FaCircleXmark size={14} />
                     </button>
                  )}
               </div>

               <div {...stylex.props(styles.list)} role="listbox">
                  {!query && (
                     <div {...stylex.props(styles.emptyState)}>
                        <IoSearchOutline
                           size={32}
                           style={{ color: colors.textSecondary, marginBottom: 8 }}
                        />
                        <span {...stylex.props(styles.emptyStateText)}>Search for users</span>
                     </div>
                  )}
                  {query && !isLoading && !filteredUsers?.length && (
                     <div {...stylex.props(styles.emptyState)}>
                        <span {...stylex.props(styles.emptyStateText)}>No results found</span>
                     </div>
                  )}
                  {filteredUsers?.map(user => {
                     const isVerified = VERIFIED_USERS.has(user.username);
                     return (
                        <UserListItem
                           key={user.id}
                           avatarUrl={user.avatar_url}
                           avatarAlt={user.username}
                           username={user.username}
                           name={
                              <span
                                 style={{
                                    display: 'flex',
                                    fontWeight: 600,
                                    alignItems: 'center',
                                    gap: 4,
                                 }}
                              >
                                 {user.username}
                                 {isVerified && (
                                    <MdVerified
                                       size={14}
                                       style={{
                                          color: 'rgb(0, 149, 246)',
                                          flexShrink: 0,
                                       }}
                                    />
                                 )}
                              </span>
                           }
                           subtitle={user.full_name ?? ''}
                           href={`/profile/${user.username}`}
                        />
                     );
                  })}
                  {isLoading && <UserListSkeleton count={skeletonCount} />}
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
