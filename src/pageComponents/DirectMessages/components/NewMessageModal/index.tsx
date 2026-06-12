'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoCheckmark, IoClose, IoCloseOutline } from 'react-icons/io5';
import { createConversation } from '@/src/actions/dm/createConversation';
import { toast } from '@/src/components/AppToast';
import DialogOverlay from '@/src/components/DialogOverlay';
import { UserListItem } from '@/src/components/UserListItem';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';
import { useNewMessageModalStore } from '@/src/store/createModalStore';
import { sharedStyles } from '@/src/styles/shared.stylex';
import { styles } from './index.stylex';

export default function NewMessageModal() {
   const { isOpen, close } = useNewMessageModalStore();
   const [query, setQuery] = useState('');
   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
   const [creating, setCreating] = useState(false);
   const router = useRouter();

   const { data: followedUsers = [] } = useQuery({
      queryKey: queryKeys.followedUsers(),
      queryFn: async () => {
         const {
            data: { user },
         } = await supabase.auth.getUser();
         if (!user) return [];
         const { data } = await supabase
            .from('follows')
            .select('user:profiles!following_id(id, username, full_name, avatar_url)')
            .eq('follower_id', user.id);
         return (data ?? []).map(r => r.user).filter(Boolean);
      },
      staleTime: Infinity,
   });

   const { data: searchResults = [] } = useQuery({
      queryKey: queryKeys.userSearch(query),
      queryFn: async () => {
         if (!query.trim()) return [];
         const { data } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
            .limit(20);
         return data ?? [];
      },
      staleTime: 30_000,
   });

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

   const allKnownUsers = [
      ...followedUsers,
      ...searchResults.filter(r => !followedUsers.some(f => f.id === r.id)),
   ];

   const filteredUsers = query.trim() ? searchResults : followedUsers;

   const selectedUsers = allKnownUsers.filter(u => selectedIds.has(u.id));
   const hasSelection = selectedIds.size > 0;

   async function handleChat() {
      if (!hasSelection || creating) return;
      setCreating(true);
      try {
         const conversationId = await createConversation([...selectedIds]);
         close();
         router.push(`/direct/${conversationId}`);
      } catch (e) {
         toast(e instanceof Error ? e.message : 'Could not start conversation.');
      } finally {
         setCreating(false);
      }
   }

   return (
      <Dialog.Root open={isOpen} onOpenChange={close}>
         <Dialog.Portal>
            <DialogOverlay zIndex={50} />
            <Dialog.Content {...stylex.props(styles.content)} onEscapeKeyDown={close}>
               <Dialog.Description style={{ display: 'none' }}>
                  Start a new direct message
               </Dialog.Description>
               <div {...stylex.props(styles.header)}>
                  <IoCloseOutline size={30} style={{ visibility: 'hidden' }} />
                  <Dialog.Title {...stylex.props(styles.title)}>New message</Dialog.Title>
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
                           const isSelected = selectedIds.has(user.id);
                           return (
                              <UserListItem
                                 key={user.id}
                                 avatarUrl={user.avatar_url}
                                 avatarAlt={user.full_name || user.username}
                                 username={user.username}
                                 name={user.full_name || user.username}
                                 subtitle={user.username}
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

               <div {...stylex.props(styles.footer)}>
                  <button
                     type="button"
                     {...stylex.props(
                        styles.chatButton,
                        (!hasSelection || creating) && styles.chatButtonDisabled,
                     )}
                     disabled={!hasSelection || creating}
                     onClick={handleChat}
                  >
                     Chat
                  </button>
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
