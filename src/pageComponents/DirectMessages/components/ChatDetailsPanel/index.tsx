'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoCloseOutline, IoNotificationsOutline } from 'react-icons/io5';
import { addParticipants } from '@/src/actions/dm/addParticipants';
import { deleteConversation } from '@/src/actions/dm/deleteConversation';
import { leaveConversation } from '@/src/actions/dm/leaveConversation';
import { removeParticipant } from '@/src/actions/dm/removeParticipant';
import { toggleMute } from '@/src/actions/dm/toggleMute';
import { updateGroupName } from '@/src/actions/dm/updateGroupName';
import { toast } from '@/src/components/AppToast';
import DeleteConfirmModal from '@/src/components/DeleteConfirmModal';
import { HiddenDialogDescription } from '@/src/components/HiddenDialogLabel';
import Toggle from '@/src/components/Toggle';
import UserAutocomplete from '@/src/components/UserAutocomplete';
import UserAvatar from '@/src/components/UserAvatar';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';
import { type ConversationDetail, getConversationQuery } from '@/src/queries/conversations';
import { sharedStyles } from '@/src/styles/shared.stylex';
import type { PartialUser } from '@/src/types/global';
import { styles } from './index.stylex';

interface ChatDetailsPanelProps {
   conversationId: string;
   authUserId: string;
   initialConversation: ConversationDetail;
   isGroup: boolean;
   onClose: () => void;
}

export default function ChatDetailsPanel({
   conversationId,
   authUserId,
   initialConversation,
   isGroup,
   onClose,
}: ChatDetailsPanelProps) {
   const router = useRouter();
   const queryClient = useQueryClient();
   const convKey = queryKeys.conversation(conversationId);

   const { data: conversation = initialConversation } = useQuery({
      queryKey: convKey,
      queryFn: async () => {
         const { data, error } = await getConversationQuery(supabase, conversationId);
         if (error) throw error;
         return data;
      },
      initialData: initialConversation,
      staleTime: Infinity,
   });

   const participants = conversation?.participants ?? [];
   const selfParticipant = participants.find(p => p.user_id === authUserId);
   const isAdmin = selfParticipant?.role === 'admin';
   const isMuted = selfParticipant?.is_muted ?? false;
   const otherParticipant = participants.find(p => p.user_id !== authUserId);

   const [showRenameModal, setShowRenameModal] = useState(false);
   const [groupName, setGroupName] = useState(conversation?.title ?? '');
   const [showAddPeople, setShowAddPeople] = useState(false);
   const [pendingAdd, setPendingAdd] = useState<PartialUser[]>([]);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [isNavigating, setIsNavigating] = useState(false);

   const { mutate: saveName, isPending: isSavingName } = useMutation({
      mutationFn: () => updateGroupName({ conversationId, title: groupName }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: convKey });
         setShowRenameModal(false);
      },
      onError: (e: Error) => toast(e.message),
   });

   const { mutate: muteMutation, isPending: isMuting } = useMutation({
      mutationFn: (muted: boolean) => toggleMute({ conversationId, muted }),
      onMutate: async muted => {
         await queryClient.cancelQueries({ queryKey: convKey });
         const prev = queryClient.getQueryData<ConversationDetail>(convKey);
         queryClient.setQueryData<ConversationDetail>(convKey, old => {
            if (!old) return old;
            return {
               ...old,
               participants: old.participants.map(p =>
                  p.user_id === authUserId ? { ...p, is_muted: muted } : p,
               ),
            };
         });
         return { prev };
      },
      onError: (_e, _v, ctx) => {
         if (ctx?.prev !== undefined) queryClient.setQueryData(convKey, ctx.prev);
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: convKey }),
   });

   const { mutate: removeMember, isPending: isRemovingMember } = useMutation({
      mutationFn: (userId: string) => removeParticipant({ conversationId, userId }),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: convKey }),
      onError: (e: Error) => toast(e.message),
   });

   const { mutate: addMembers, isPending: isAddingMembers } = useMutation({
      mutationFn: (users: PartialUser[]) =>
         addParticipants({
            conversationId,
            userIds: users.map(u => u.id),
         }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: convKey });
         setShowAddPeople(false);
         setPendingAdd([]);
      },
      onError: (e: Error) => toast(e.message),
   });

   const isLoading =
      isSavingName || isMuting || isRemovingMember || isAddingMembers || isNavigating;

   async function handleLeave() {
      setIsNavigating(true);
      try {
         await leaveConversation({ conversationId });
         queryClient.invalidateQueries({ queryKey: queryKeys.allConversations() });
         router.push('/direct');
      } catch (e) {
         toast(e instanceof Error ? e.message : 'Could not leave chat.');
         setIsNavigating(false);
      }
   }

   async function handleDelete() {
      setIsNavigating(true);
      try {
         await deleteConversation({ conversationId });
         queryClient.invalidateQueries({ queryKey: queryKeys.allConversations() });
         router.push('/direct');
      } catch (e) {
         toast(e instanceof Error ? e.message : 'Could not delete chat.');
         setIsNavigating(false);
      }
   }

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.header)}>
            <button
               type="button"
               {...stylex.props(styles.closeButton)}
               onClick={onClose}
               aria-label="Close details"
            >
               <IoCloseOutline size={24} />
            </button>
            <span {...stylex.props(styles.headerTitle)}>Details</span>
         </div>

         {isGroup && (
            <>
               <div {...stylex.props(styles.row)}>
                  <span {...stylex.props(styles.rowLabel)}>Change group name</span>
                  <button
                     type="button"
                     {...stylex.props(styles.changeButton)}
                     onClick={() => setShowRenameModal(true)}
                     disabled={isLoading}
                  >
                     Change
                  </button>
               </div>

               <Dialog.Root
                  open={showRenameModal}
                  onOpenChange={open => {
                     setShowRenameModal(open);
                     if (!open) setGroupName(conversation?.title ?? '');
                  }}
               >
                  <Dialog.Portal>
                     <Dialog.Overlay {...stylex.props(styles.modalOverlay)} />
                     <Dialog.Content {...stylex.props(styles.renameModalContent)}>
                        <HiddenDialogDescription>Change the group name</HiddenDialogDescription>
                        <div {...stylex.props(styles.renameModalHeader)}>
                           <Dialog.Close asChild>
                              <button
                                 type="button"
                                 {...stylex.props(styles.renameModalCloseButton)}
                                 aria-label="Close"
                              >
                                 <IoCloseOutline size={24} />
                              </button>
                           </Dialog.Close>
                           <Dialog.Title {...stylex.props(styles.renameModalTitle)}>
                              Change group name
                           </Dialog.Title>
                        </div>
                        <p {...stylex.props(styles.renameModalSubtitle)}>
                           Changing the name of a group chat changes it for everyone.
                        </p>
                        <input
                           {...stylex.props(styles.renameModalInput, sharedStyles.placeholder)}
                           value={groupName}
                           onChange={e => setGroupName(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && !isLoading && saveName()}
                           placeholder="New group name"
                           disabled={isLoading}
                        />
                        <button
                           type="button"
                           {...stylex.props(styles.renameModalSaveButton)}
                           onClick={() => saveName()}
                           disabled={isLoading}
                        >
                           Save
                        </button>
                     </Dialog.Content>
                  </Dialog.Portal>
               </Dialog.Root>
            </>
         )}

         <div {...stylex.props(styles.row)}>
            <div {...stylex.props(styles.rowLeft)}>
               <IoNotificationsOutline {...stylex.props(styles.rowIcon)} />
               <span {...stylex.props(styles.rowLabel)}>Mute messages</span>
            </div>
            <Toggle checked={isMuted} onChange={() => muteMutation(!isMuted)} />
         </div>

         <div {...stylex.props(styles.sectionHeader)}>
            <span {...stylex.props(styles.sectionTitle)}>Members</span>
            {isGroup && isAdmin && (
               <button
                  type="button"
                  {...stylex.props(styles.addPeopleButton)}
                  onClick={() => setShowAddPeople(true)}
                  disabled={isLoading}
               >
                  Add people
               </button>
            )}
         </div>

         {isGroup && showAddPeople && (
            <UserAutocomplete
               multiSelect
               selected={pendingAdd}
               onSelect={(user: PartialUser) => {
                  setPendingAdd(prev =>
                     prev.some(u => u.id === user.id)
                        ? prev.filter(u => u.id !== user.id)
                        : [...prev, user],
                  );
               }}
               onDone={() => addMembers(pendingAdd)}
               onDismiss={() => {
                  setShowAddPeople(false);
                  setPendingAdd([]);
               }}
               placeholder="Search..."
               autoFocus
            />
         )}

         {isGroup &&
            participants.map(p => (
               <Link
                  key={p.user_id}
                  href={`/profile/${p.user.username}`}
                  {...stylex.props(styles.memberRow)}
               >
                  <UserAvatar
                     src={p.user.avatar_url}
                     alt={p.user.username}
                     size={44}
                     username={p.user.username}
                     userId={p.user.id}
                     useHoverCard={false}
                  />
                  <div {...stylex.props(styles.memberInfo)}>
                     <span {...stylex.props(styles.memberName)}>
                        {p.user.full_name || p.user.username}
                     </span>
                     <span {...stylex.props(styles.memberMeta)}>
                        {p.role === 'admin' ? 'Admin · ' : ''}
                        {p.user.username}
                     </span>
                  </div>
                  {isAdmin && p.user_id !== authUserId && (
                     <button
                        type="button"
                        {...stylex.props(styles.memberRemoveBtn)}
                        onClick={() => removeMember(p.user_id)}
                        disabled={isLoading}
                     >
                        ···
                     </button>
                  )}
               </Link>
            ))}

         {!isGroup && otherParticipant && (
            <div {...stylex.props(styles.memberRow)}>
               <UserAvatar
                  src={otherParticipant.user.avatar_url}
                  alt={otherParticipant.user.username}
                  size={44}
                  username={otherParticipant.user.username}
                  userId={otherParticipant.user.id}
               />
               <div {...stylex.props(styles.memberInfo)}>
                  <span {...stylex.props(styles.memberName)}>
                     {otherParticipant.user.full_name || otherParticipant.user.username}
                  </span>
                  <span {...stylex.props(styles.memberMeta)}>{otherParticipant.user.username}</span>
               </div>
            </div>
         )}

         {isGroup && (
            <>
               <button
                  type="button"
                  {...stylex.props(styles.dangerButton)}
                  onClick={handleLeave}
                  disabled={isLoading}
               >
                  Leave chat
               </button>
               {isAdmin && (
                  <button
                     type="button"
                     {...stylex.props(styles.dangerButton)}
                     onClick={handleDelete}
                     disabled={isLoading}
                  >
                     Delete chat
                  </button>
               )}
            </>
         )}

         {!isGroup && (
            <>
               <button
                  type="button"
                  {...stylex.props(styles.dangerButton)}
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
               >
                  Delete chat
               </button>

               <DeleteConfirmModal
                  open={showDeleteConfirm}
                  onOpenChange={setShowDeleteConfirm}
                  onConfirm={handleDelete}
                  isLoading={isLoading}
                  title="Delete chat from inbox?"
                  description="This will remove the chat from your inbox and erase the chat history. To stop receiving new messages from this account, first block the account then delete the chat."
               />
            </>
         )}
      </div>
   );
}
