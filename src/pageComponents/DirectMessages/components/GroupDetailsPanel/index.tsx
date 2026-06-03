'use client';

import * as stylex from '@stylexjs/stylex';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { addParticipants } from '@/src/actions/dm/addParticipants';
import { deleteConversation } from '@/src/actions/dm/deleteConversation';
import { leaveConversation } from '@/src/actions/dm/leaveConversation';
import { removeParticipant } from '@/src/actions/dm/removeParticipant';
import { toggleMute } from '@/src/actions/dm/toggleMute';
import { updateGroupName } from '@/src/actions/dm/updateGroupName';
import { toast } from '@/src/components/AppToast';
import UserAutocomplete from '@/src/components/UserAutocomplete';
import UserAvatar from '@/src/components/UserAvatar';
import { supabase } from '@/src/lib/supabase/client';
import { type ConversationDetail, getConversationQuery } from '@/src/queries/conversations';
import type { PartialUser } from '@/src/types/global';
import { styles } from './index.stylex';

interface GroupDetailsPanelProps {
   conversationId: string;
   authUserId: string;
   initialConversation: ConversationDetail;
}

export default function GroupDetailsPanel({
   conversationId,
   authUserId,
   initialConversation,
}: GroupDetailsPanelProps) {
   const router = useRouter();
   const queryClient = useQueryClient();
   const convKey = ['conversation', conversationId];

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

   const [groupName, setGroupName] = useState(conversation?.title ?? '');
   const [showAddPeople, setShowAddPeople] = useState(false);
   const [pendingAdd, setPendingAdd] = useState<PartialUser[]>([]);

   const { mutate: saveName } = useMutation({
      mutationFn: () => updateGroupName(conversationId, groupName),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: convKey }),
      onError: (e: Error) => toast(e.message),
   });

   const { mutate: muteMutation } = useMutation({
      mutationFn: (muted: boolean) => toggleMute(conversationId, muted),
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

   const { mutate: removeMember } = useMutation({
      mutationFn: (userId: string) => removeParticipant(conversationId, userId),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: convKey }),
      onError: (e: Error) => toast(e.message),
   });

   const { mutate: addMembers } = useMutation({
      mutationFn: (users: PartialUser[]) =>
         addParticipants(
            conversationId,
            users.map(u => u.id),
         ),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: convKey });
         setShowAddPeople(false);
         setPendingAdd([]);
      },
      onError: (e: Error) => toast(e.message),
   });

   async function handleLeave() {
      try {
         await leaveConversation(conversationId);
         router.push('/direct');
      } catch (e) {
         toast(e instanceof Error ? e.message : 'Could not leave chat.');
      }
   }

   async function handleDelete() {
      try {
         await deleteConversation(conversationId);
         router.push('/direct');
      } catch (e) {
         toast(e instanceof Error ? e.message : 'Could not delete chat.');
      }
   }

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.header)}>Details</div>

         {isAdmin && (
            <div {...stylex.props(styles.row)}>
               <span {...stylex.props(styles.rowLabel)}>Change group name</span>
               <input
                  {...stylex.props(styles.changeInput)}
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveName()}
               />
               <button
                  type="button"
                  {...stylex.props(styles.changeButton)}
                  onClick={() => saveName()}
               >
                  Change
               </button>
            </div>
         )}

         <div {...stylex.props(styles.row)}>
            <span {...stylex.props(styles.rowLabel)}>Mute messages</span>
            <button
               type="button"
               {...stylex.props(styles.toggle, isMuted ? styles.toggleOn : styles.toggleOff)}
               onClick={() => muteMutation(!isMuted)}
               aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
               <span
                  {...stylex.props(
                     styles.toggleThumb,
                     isMuted ? styles.toggleThumbOn : styles.toggleThumbOff,
                  )}
               />
            </button>
         </div>

         <div {...stylex.props(styles.sectionHeader)}>
            <span {...stylex.props(styles.sectionTitle)}>Members</span>
            {isAdmin && (
               <button
                  type="button"
                  {...stylex.props(styles.addPeopleButton)}
                  onClick={() => setShowAddPeople(true)}
               >
                  Add people
               </button>
            )}
         </div>

         {showAddPeople && (
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

         {participants.map(p => (
            <div key={p.user_id} {...stylex.props(styles.memberRow)}>
               <UserAvatar
                  src={p.user.avatar_url}
                  alt={p.user.username}
                  size={44}
                  userId={p.user.id}
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
                  >
                     ···
                  </button>
               )}
            </div>
         ))}

         <button type="button" {...stylex.props(styles.dangerButton)} onClick={handleLeave}>
            Leave chat
         </button>
         <button type="button" {...stylex.props(styles.dangerButton)} onClick={handleDelete}>
            Delete chat
         </button>
      </div>
   );
}
