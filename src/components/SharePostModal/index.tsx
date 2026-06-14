'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { IoCheckmark, IoClose, IoCloseOutline } from 'react-icons/io5';
import { sharePost } from '@/src/actions/post/sharePost';
import { toast } from '@/src/components/AppToast';
import DialogOverlay from '@/src/components/DialogOverlay';
import { HiddenDialogDescription } from '@/src/components/HiddenDialogLabel';
import { UserListItem } from '@/src/components/UserListItem';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';
import { followedUsersQuery } from '@/src/queries/follows';
import { userProfilesQuery } from '@/src/queries/userProfiles';
import { useSharePostModal } from '@/src/store/createModalStore';
import { sharedStyles } from '@/src/styles/shared.stylex';
import { styles } from './index.stylex';

export default function SharePostModal() {
   const { isOpen, data: postId, close } = useSharePostModal();
   const { data: authUser } = useAuthUser();
   const [query, setQuery] = useState('');
   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
   const [message, setMessage] = useState('');
   const [sending, setSending] = useState(false);

   const { data: followedUsers = [] } = useQuery({
      queryKey: queryKeys.followedUsers(),
      queryFn: async () => {
         if (!authUser?.id) return [];
         const { data } = await followedUsersQuery(supabase, authUser.id);
         return (data ?? []).map(r => r.user).filter((u): u is NonNullable<typeof u> => u != null);
      },
      enabled: !!authUser?.id,
      staleTime: Infinity,
   });

   const { data: searchResults = [] } = useQuery({
      queryKey: queryKeys.userSearch(query),
      queryFn: async () => {
         if (!query.trim()) return [];
         const { data } = await userProfilesQuery(supabase, { search: query, limit: 20 });
         return data ?? [];
      },
      staleTime: 30_000,
   });

   const allKnownUsers = [
      ...followedUsers,
      ...searchResults.filter(r => !followedUsers.some(f => f.id === r.id)),
   ];

   const filteredUsers = query.trim() ? searchResults : followedUsers;
   const selectedUsers = allKnownUsers.filter(u => selectedIds.has(u.id));
   const hasSelection = selectedIds.size > 0;

   function toggleUser(id: string) {
      setSelectedIds(prev => {
         const next = new Set(prev);
         if (next.has(id)) {
            next.delete(id);
         } else {
            next.add(id);
         }
         return next;
      });
   }

   function removeUser(id: string) {
      setSelectedIds(prev => {
         const next = new Set(prev);
         next.delete(id);
         return next;
      });
   }

   function handleClose() {
      close();
      setQuery('');
      setSelectedIds(new Set());
      setMessage('');
   }

   async function handleSend() {
      if (!hasSelection || sending || !postId) return;
      setSending(true);
      try {
         await sharePost({
            postId,
            recipientIds: [...selectedIds],
            message: message.trim() || undefined,
         });
         toast('Sent.');
         handleClose();
      } catch (e) {
         toast(e instanceof Error ? e.message : 'Could not send. Try again.');
      } finally {
         setSending(false);
      }
   }

   return (
      <Dialog.Root open={isOpen} onOpenChange={handleClose}>
         <Dialog.Portal>
            <DialogOverlay zIndex={50} />
            <Dialog.Content {...stylex.props(styles.content)} onEscapeKeyDown={handleClose}>
               <HiddenDialogDescription>Share post via direct message</HiddenDialogDescription>
               <div {...stylex.props(styles.header)}>
                  <IoCloseOutline size={30} style={{ visibility: 'hidden' }} />
                  <Dialog.Title {...stylex.props(styles.title)}>Share</Dialog.Title>
                  <Dialog.Close asChild>
                     <button {...stylex.props(styles.closeButton)} aria-label="Close">
                        <IoCloseOutline size={30} />
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
                              <IoClose size={14} />
                           </button>
                        </span>
                     ))}
                     <input
                        {...stylex.props(styles.searchInput, sharedStyles.placeholder)}
                        type="text"
                        placeholder={selectedUsers.length === 0 ? 'Search...' : ''}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                     />
                  </div>
               </div>

               <hr {...stylex.props(styles.divider)} />

               <div {...stylex.props(styles.listContainer)}>
                  {query.trim() && filteredUsers.length === 0 ? (
                     <p {...stylex.props(styles.noResults)}>No results found.</p>
                  ) : (
                     <div {...stylex.props(styles.userList)} role="listbox">
                        {filteredUsers.map(user => {
                           if (!user) return null;
                           const isSelected = selectedIds.has(user.id);
                           return (
                              <UserListItem
                                 key={user.id}
                                 avatarUrl={user.avatar_url}
                                 avatarAlt={user.full_name || user.username}
                                 username={user.username}
                                 name={user.full_name || user.username}
                                 fullName={user.username}
                                 rightElement={
                                    <div
                                       {...stylex.props(
                                          styles.radioCircle,
                                          isSelected && styles.radioCircleSelected,
                                       )}
                                    >
                                       {isSelected && <IoCheckmark size={14} />}
                                    </div>
                                 }
                                 onClick={() => toggleUser(user.id)}
                                 role="option"
                                 ariaSelected={isSelected}
                              />
                           );
                        })}
                     </div>
                  )}
               </div>

               <hr {...stylex.props(styles.divider)} />

               <div {...stylex.props(styles.messageRow)}>
                  <textarea
                     {...stylex.props(styles.messageInput, sharedStyles.placeholder)}
                     placeholder="Message..."
                     rows={1}
                     value={message}
                     onChange={e => setMessage(e.target.value)}
                  />
               </div>

               <div {...stylex.props(styles.footer)}>
                  <button
                     type="button"
                     {...stylex.props(
                        styles.sendButton,
                        (!hasSelection || sending) && styles.sendButtonDisabled,
                     )}
                     disabled={!hasSelection || sending}
                     onClick={handleSend}
                  >
                     {sending ? 'Sending...' : 'Send'}
                  </button>
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
