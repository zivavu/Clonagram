'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { FaCircleXmark } from 'react-icons/fa6';
import { IoCloseOutline } from 'react-icons/io5';
import { MdVerified } from 'react-icons/md';
import { SUGGESTED_USERS } from '@/src/mocks/users';
import { useSearchPortalStore } from '@/src/store/useSearchPortalStore';
import { UserListItem, UserListSkeleton } from '../shared/UserListItem';
import { styles } from './index.stylex';

const VERIFIED_USERS = new Set(['crumbling.concrete']);

export default function SearchPortal() {
   const { isOpen, close } = useSearchPortalStore();
   const [query, setQuery] = useState('');

   const filteredUsers = SUGGESTED_USERS.filter(
      u =>
         (u.full_name?.toLowerCase() ?? '').includes(query.toLowerCase()) ||
         u.username.toLowerCase().includes(query.toLowerCase()),
   );

   const skeletonCount = filteredUsers.length ? 0 : 7;

   return (
      <Dialog.Root open={isOpen} onOpenChange={close}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} onClick={close} />
            <Dialog.Content {...stylex.props(styles.content)} onEscapeKeyDown={close}>
               <Dialog.Description style={{ display: 'none' }}>Search for people</Dialog.Description>
               <div {...stylex.props(styles.header)}>
                  <Dialog.Title {...stylex.props(styles.title)}>Search</Dialog.Title>
                  <Dialog.Close asChild>
                     <button {...stylex.props(styles.closeButton)} aria-label="Close">
                        <IoCloseOutline style={{ fontSize: 30 }} />
                     </button>
                  </Dialog.Close>
               </div>

               <div {...stylex.props(styles.searchInputWrapper)}>
                  <input
                     {...stylex.props(styles.searchInput)}
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
                        <FaCircleXmark style={{ fontSize: 14 }} />
                     </button>
                  )}
               </div>

               <div {...stylex.props(styles.list)} role="listbox">
                  {filteredUsers.map(user => {
                     const isVerified = VERIFIED_USERS.has(user.username);
                     return (
                        <UserListItem
                           key={user.id}
                           avatarUrl={user.avatar_url}
                           avatarAlt={user.username}
                           name={
                              <span style={{ display: 'flex', fontWeight: 600, alignItems: 'center', gap: 4 }}>
                                 {user.username}
                                 {isVerified && (
                                    <MdVerified style={{ color: 'rgb(0, 149, 246)', fontSize: 14, flexShrink: 0 }} />
                                 )}
                              </span>
                           }
                           subtitle={user.full_name ?? ''}
                           onClick={() => {
                              // TODO: navigate to user profile
                           }}
                        />
                     );
                  })}
                  <UserListSkeleton count={skeletonCount} />
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
