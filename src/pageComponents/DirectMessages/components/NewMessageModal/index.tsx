'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { IoCheckmark, IoClose, IoCloseOutline } from 'react-icons/io5';
import { UserListItem, UserListSkeleton } from '@/src/components/shared/UserListItem';
import { SUGGESTED_USERS } from '@/src/mocks/users';
import { useNewMessageModalStore } from '../../../../store/useNewMessageModalStore';
import { styles } from './index.stylex';

export default function NewMessageModal() {
   const { isOpen, close } = useNewMessageModalStore();
   const [query, setQuery] = useState('');
   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

   const toggleUser = (id: string) => {
      setSelectedIds(prev => {
         const next = new Set(prev);
         if (next.has(id)) {
            next.delete(id);
         } else {
            next.add(id);
         }
         return next;
      });
   };

   const removeUser = (id: string) => {
      setSelectedIds(prev => {
         const next = new Set(prev);
         next.delete(id);
         return next;
      });
   };

   const filteredUsers = SUGGESTED_USERS.filter(
      u =>
         (u.full_name?.toLowerCase() ?? '').includes(query.toLowerCase()) ||
         u.username.toLowerCase().includes(query.toLowerCase()),
   );

   const selectedUsers = SUGGESTED_USERS.filter(u => selectedIds.has(u.id));
   const hasSelection = selectedIds.size > 0;

   const MIN_VISIBLE_ROWS = 7;
   const skeletonCount = Math.max(0, MIN_VISIBLE_ROWS - filteredUsers.length);

   return (
      <Dialog.Root open={isOpen} onOpenChange={close}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} />
            <Dialog.Content {...stylex.props(styles.content)} onEscapeKeyDown={close}>
               <Dialog.Description style={{ display: 'none' }}>Start a new direct message</Dialog.Description>
               <div {...stylex.props(styles.header)}>
                  <IoCloseOutline style={{ fontSize: 30, visibility: 'hidden' }} />
                  <Dialog.Title {...stylex.props(styles.title)}>New message</Dialog.Title>
                  <Dialog.Close asChild>
                     <button {...stylex.props(styles.closeButton)} aria-label="Close">
                        <IoCloseOutline style={{ fontSize: 30 }} />
                     </button>
                  </Dialog.Close>
               </div>
               <hr {...stylex.props(styles.divider)} />

               <div {...stylex.props(styles.toField)}>
                  <span {...stylex.props(styles.toLabel)}>To:</span>
                  <div {...stylex.props(styles.toInputArea)}>
                     {selectedUsers.map(user => (
                        <span key={user.id} {...stylex.props(styles.chip)}>
                           {user.full_name || user.username}
                           <button
                              type="button"
                              {...stylex.props(styles.chipRemove)}
                              onClick={e => {
                                 e.stopPropagation();
                                 removeUser(user.id);
                              }}
                              aria-label={`Remove ${user.full_name || user.username}`}
                           >
                              <IoClose style={{ fontSize: '14px' }} />
                           </button>
                        </span>
                     ))}
                     <input
                        {...stylex.props(styles.searchInput)}
                        type="text"
                        placeholder={selectedUsers.length === 0 ? 'Search...' : ''}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                     />
                  </div>
               </div>

               <hr {...stylex.props(styles.divider)} />

               <div {...stylex.props(styles.listContainer)}>
                  <h3 {...stylex.props(styles.suggestedHeading)}>Suggested</h3>
                  <div {...stylex.props(styles.userList)} role="listbox">
                     {filteredUsers.map(user => {
                        const isSelected = selectedIds.has(user.id);
                        return (
                           <UserListItem
                              key={user.id}
                              avatarUrl={user.avatar_url}
                              avatarAlt={user.full_name || user.username}
                              name={user.full_name || user.username}
                              subtitle={user.username}
                              rightElement={
                                 <div {...stylex.props(styles.radioCircle, isSelected && styles.radioCircleSelected)}>
                                    {isSelected && <IoCheckmark style={{ fontSize: '14px' }} />}
                                 </div>
                              }
                              onClick={() => toggleUser(user.id)}
                              role="option"
                              ariaSelected={isSelected}
                           />
                        );
                     })}
                     <UserListSkeleton count={skeletonCount} />
                  </div>
               </div>

               <div {...stylex.props(styles.footer)}>
                  <button
                     type="button"
                     {...stylex.props(styles.chatButton, !hasSelection && styles.chatButtonDisabled)}
                     disabled={!hasSelection}
                     onClick={() => {
                        // TODO: create or navigate to thread
                        close();
                     }}
                  >
                     Chat
                  </button>
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
